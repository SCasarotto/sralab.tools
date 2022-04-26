import type { ReactNode } from 'react'
import { useEffect, useMemo, useState } from 'react'

import { Form, useFormState, useSelectState } from 'ariakit'
import { addHours, format, startOfDay } from 'date-fns'

import { Button } from '~/components/Button'
import { DatePicker } from '~/components/DatePicker'
import { FormSubmit } from '~/components/FormSubmit'
import { Input } from '~/components/Input'
import { InputError } from '~/components/InputError'
import { InputRow } from '~/components/InputRow'
import { InputWrapper } from '~/components/InputWrapper'
import { Label } from '~/components/Label'
import { Select } from '~/components/Select'
import { SelectItem } from '~/components/SelectItem'
import { SelectLabel } from '~/components/SelectLabel'
import { SelectPopover } from '~/components/SelectPopover'
import { Table } from '~/components/Table'
import { Td } from '~/components/Td'
import { Th } from '~/components/Th'
import { Tr } from '~/components/Tr'
import { roundDownToNearestHalf } from '~/utils/roundDownToNearestHalf'

const modeOptions = ['6 Hours', '6.5 Hours'] as const
type Mode = typeof modeOptions[number]
const modeScales: Record<Mode, Record<number, number>> = {
	'6 Hours': {
		15: 20,
		30: 40,
		60: 80,
		90: 120,
		120: 160,
		150: 200,
		180: 240,
		210: 280,
		240: 320,
		270: 360,
		300: 400,
		330: 440,
		360: 480,
		390: 520,
	},
	'6.5 Hours': {
		15: 18,
		30: 37,
		60: 74,
		90: 111,
		120: 148,
		150: 185,
		180: 222,
		210: 258,
		240: 295,
		270: 332,
		300: 369,
		330: 406,
		360: 443,
		390: 480,
	},
}

// Creates a new hour data row
type CreateHoursData = {
	department: string
	treatmentHours: number
	scale?: Record<number, number>
	prevHourArray: Array<HourData>
	startOfDayTime?: number
	previousIndex?: number
}
const createHoursData = (d: CreateHoursData) => {
	const {
		department,
		treatmentHours,
		scale,
		prevHourArray,
		startOfDayTime,
		// If left empty, assume the end of the array
		previousIndex = prevHourArray.length - 1,
	} = d

	const lookupKey =
		treatmentHours === 0.25 ? 0.25 * 60 : roundDownToNearestHalf(treatmentHours) * 60
	const adpMinutes = scale?.[lookupKey] ?? 0
	const startTime =
		previousIndex >= 0 ? prevHourArray[previousIndex].endTime : startOfDayTime ?? 0
	const endTime = startTime + adpMinutes * 60 * 1000

	return {
		department,
		treatmentHours,
		adpMinutes,
		startTime,
		endTime,
	}
}

// Returns a new array of recalculated values
type RecalculateHoursData = {
	hourArray: Array<HourData>
	scale?: Record<number, number>
	startOfDayTime?: number
}
const recalculateHours = (d: RecalculateHoursData) => {
	const { hourArray, scale, startOfDayTime } = d

	// No scale return empty array
	if (!scale || !startOfDayTime) {
		return []
	}

	const arr = [...hourArray]
	// Work through the array and update all times
	for (let index = 0; index < arr.length; index++) {
		arr[index] = createHoursData({
			prevHourArray: arr,
			scale,
			previousIndex: index - 1,
			startOfDayTime,
			...arr[index],
		})
	}
	return arr
}

type HourData = {
	department: string
	treatmentHours: number
	adpMinutes: number
	startTime: number
	endTime: number
}
export default function ADPCalculator() {
	const form = useFormState<{
		startOfDay: number | undefined
		department: string
		treatmentHours: number
		mode: Mode
	}>({
		defaultValues: {
			startOfDay: addHours(startOfDay(new Date()), 8).getTime(),
			department: '',
			treatmentHours: 0.25,
			mode: '6 Hours',
		},
	})
	const scale = useMemo(() => modeScales[form.values.mode], [form.values.mode])

	form.useSubmit(() => {
		const { values, setError, names, setValues } = form
		const { department, treatmentHours, startOfDay, mode } = values

		if (!scale) {
			setError(
				names.mode,
				mode !== '6 Hours' && mode !== '6.5 Hours' && !!mode
					? 'Invalid Ratio Selected'
					: 'Required',
			)
			return
		}

		setHourArray((prev) => [
			...prev,
			createHoursData({
				department,
				treatmentHours,
				scale,
				prevHourArray: prev,
				startOfDayTime: startOfDay,
			}),
		])
		// Reset only the department and hours
		setValues((prev) => ({
			...prev,
			department: '',
			treatmentHours: 0.25,
		}))
	})
	const modeSelectState = useSelectState<Mode>({
		value: form.values.mode,
		setValue: (value) => form.setValue(form.names.mode, value as Mode),
		gutter: 4,
		sameWidth: true,
	})
	const [hourArray, setHourArray] = useState<Array<HourData>>([])

	// Recalculate the hour array
	useEffect(() => {
		setHourArray((prev) =>
			recalculateHours({
				hourArray: prev,
				scale,
				startOfDayTime: form.values.startOfDay,
			}),
		)
	}, [scale, form.values.startOfDay])

	const tableConfig: Array<{
		header: string
		cell: (data: HourData, index: number) => ReactNode
	}> = useMemo(
		() => [
			{ header: 'Cost Center', cell: (d) => d.department },
			{ header: 'Treatment Hours', cell: (d) => d.treatmentHours },
			{
				header: 'ADP Time',
				cell: (d) => `${Math.floor(d.adpMinutes / 60)}h ${d.adpMinutes % 60}m`,
			},
			{
				header: 'Start Time',
				cell: (d) => format(d.startTime, 'h:mm a'),
			},
			{
				header: 'End Time',
				cell: (d) => format(d.endTime, 'h:mm a'),
			},
			{
				header: 'Delete',
				cell: (_, i) => (
					<Button
						variant='secondary'
						onClick={() =>
							// Remove and update all items after the deleted one
							setHourArray((prev) =>
								recalculateHours({
									hourArray: [...prev.slice(0, i), ...prev.slice(i + 1)],
									scale,
									startOfDayTime: form.values.startOfDay,
								}),
							)
						}
					>
						Delete
					</Button>
				),
			},
		],
		[scale, form.values.startOfDay],
	)

	return (
		<div className='p-6'>
			<h1 className='text-brand-orange-500 font-bold text-3xl mb-1 text-center'>
				ADP Calculator
			</h1>
			<p className='text-center mb-3 leading-6'>
				Time Systems{' '}
				<span role='img' aria-label='eye-roll'>
					🙄
				</span>{' '}
				Am I Right?{' '}
				<span role='img' aria-label='grinning-face-with-sweat'>
					😅
				</span>{' '}
				I hope this helps!
				<br />
				Spend the time that this saves you to do a nice thing for someone.
			</p>
			<Form state={form} resetOnSubmit={false}>
				<InputRow>
					<InputWrapper>
						<SelectLabel state={modeSelectState}>Treatment Ratio</SelectLabel>
						<Select state={modeSelectState} required />
						<SelectPopover state={modeSelectState}>
							{modeOptions.map((option) => (
								<SelectItem key={option} value={option}>
									{option}
								</SelectItem>
							))}
						</SelectPopover>
						<InputError name={form.names.mode} />
					</InputWrapper>
					<InputWrapper>
						<Label
							name={form.names.startOfDay}
							htmlFor={form.names.startOfDay.toString()}
						>
							Start of Day
						</Label>
						<DatePicker
							id={form.names.startOfDay.toString()}
							name={form.names.startOfDay.toString()}
							selected={
								form.values.startOfDay ? new Date(form.values.startOfDay) : null
							}
							onChange={(time) =>
								form.setValue(form.names.startOfDay, time?.getTime())
							}
							showTimeSelect
							showTimeSelectOnly
							dateFormat='h:mm aa'
							timeIntervals={15}
							required
						/>
						<InputError name={form.names.startOfDay} />
					</InputWrapper>
				</InputRow>
				<InputRow>
					<InputWrapper>
						<Label name={form.names.department}>Cost Center</Label>
						<Input name={form.names.department} />
						<InputError name={form.names.department} />
					</InputWrapper>
					<InputWrapper>
						<Label name={form.names.treatmentHours}>Treatment Hours</Label>
						<Input
							name={form.names.treatmentHours}
							type='number'
							min={0.25}
							max={6.75}
							step={0.25}
							required
						/>
						<InputError name={form.names.treatmentHours} />
					</InputWrapper>
					<InputWrapper className='self-end'>
						<FormSubmit className='h-[45px]'>Add</FormSubmit>
					</InputWrapper>
				</InputRow>
			</Form>
			<Table>
				<thead>
					<Tr variant='head'>
						{tableConfig.map((config) => (
							<Th key={config.header}>{config.header}</Th>
						))}
					</Tr>
				</thead>
				<tbody>
					{hourArray.map((d, i) => (
						<Tr key={i}>
							{tableConfig.map((config) => (
								<Td key={config.header}>{config.cell(d, i)}</Td>
							))}
						</Tr>
					))}
				</tbody>
			</Table>
		</div>
	)
}
