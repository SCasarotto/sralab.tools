import type { ReactNode } from 'react'
import { useEffect, useMemo, useState } from 'react'

import { Form, useFormState, useSelectState } from 'ariakit'
import { addWeeks, format, getDay, setDay, startOfYear, subDays } from 'date-fns'

import { DatePicker } from '~/components/DatePicker'
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

type PayPeriod = {
	start: Date
	end: Date
	spend: number
	balance: number
}

type RecalculatePayPeriodData = {
	startDate: number
	startingPTO: number
	payPeriodCount: number
	ptoGainPerPayPeriod: number
	prevPayPeriodArray: Array<PayPeriod>
}
const recalculatePayPeriod = (d: RecalculatePayPeriodData) => {
	const { startDate, startingPTO, payPeriodCount, ptoGainPerPayPeriod, prevPayPeriodArray } = d

	const initialPTO = startingPTO || 0
	const periodCount = payPeriodCount || 0
	const ptoGain = ptoGainPerPayPeriod || 0

	const newPayPeriodArray: Array<PayPeriod> = []
	for (let i = 0; i < periodCount; i++) {
		// Two week pay periods
		const start = addWeeks(startDate, 2 * i)
		const end = subDays(addWeeks(start, 2), 1)
		// gotta be careful because the number of pay perios could be larger than the previous array
		const spend = prevPayPeriodArray?.[i]?.spend || 0
		// Use initialPTO if this is the first pay period
		// Otherwise use the previous pay period's balance
		const balance = (i === 0 ? initialPTO : newPayPeriodArray[i - 1].balance + ptoGain) - spend

		newPayPeriodArray.push({
			start,
			end,
			spend,
			balance,
		})
	}
	return newPayPeriodArray
}

const firstSundayOfTheYear = setDay(
	startOfYear(new Date()),
	0, // sunday
	{ weekStartsOn: getDay(startOfYear(new Date())) },
)

const classifications = {
	Staff: {
		value: 'Staff',
		yearsOfService: [
			{ min: 0, max: 3, accrualRate: 7.69 },
			{ min: 4, max: Infinity, accrualRate: 9.23 },
		],
	},
	'Physicians, Department Heads, and Above': {
		value: 'Physicians, Department Heads, and Above',
		yearsOfService: [{ min: 0, max: Infinity, accrualRate: 9.23 }],
	},
}
type Classification = keyof typeof classifications
const classificationOptions = Object.values(classifications)

export default function PTOCalculator() {
	const form = useFormState<{
		initialStartDate: number
		initialPTO: number
		payPeriodCount: number
		classification: Classification
		yearsOfService: number
	}>({
		defaultValues: {
			initialStartDate: firstSundayOfTheYear.getTime(),
			initialPTO: 0,
			payPeriodCount: 26,
			classification: 'Staff',
			yearsOfService: 1,
		},
	})
	const classificationSelectState = useSelectState<Classification>({
		value: form.values.classification,
		setValue: (value) => form.setValue(form.names.classification, value as Classification),
		gutter: 4,
		sameWidth: true,
	})

	const ptoGainPerPayPeriod = useMemo(
		() =>
			classifications[form.values.classification]?.yearsOfService.find(
				(y) => y.min <= form.values.yearsOfService && form.values.yearsOfService <= y.max,
			)?.accrualRate ?? 0,
		[form.values.classification, form.values.yearsOfService],
	)
	const [payPeriodArray, setPayPeriodArray] = useState<Array<PayPeriod>>(
		recalculatePayPeriod({
			startDate: form.values.initialStartDate,
			startingPTO: form.values.initialPTO,
			payPeriodCount: form.values.payPeriodCount,
			ptoGainPerPayPeriod,
			prevPayPeriodArray: [],
		}),
	)

	useEffect(() => {
		setPayPeriodArray((prev) => {
			return recalculatePayPeriod({
				startDate: form.values.initialStartDate,
				startingPTO: form.values.initialPTO,
				payPeriodCount: form.values.payPeriodCount,
				ptoGainPerPayPeriod,
				prevPayPeriodArray: prev,
			})
		})
	}, [
		form.values.initialStartDate,
		form.values.initialPTO,
		form.values.payPeriodCount,
		ptoGainPerPayPeriod,
	])

	const tableConfig: Array<{
		header: string
		cell: (data: PayPeriod, index: number) => ReactNode
	}> = useMemo(
		() => [
			{ header: 'Start of Pay Period', cell: (d) => format(d.start, 'MM/dd/yyyy') },
			{ header: 'End of Pay Period', cell: (d) => format(d.end, 'MM/dd/yyyy') },
			{
				header: 'PTO Spend',
				cell: (d, i) => (
					<Input
						name='ptoSpend'
						type='number'
						onChange={(e) => {
							const spend = e.target.valueAsNumber
							setPayPeriodArray((prev) => {
								// Its okay to mutate because recalculatePayPeriod immutably modifies the array
								prev[i].spend = spend
								return recalculatePayPeriod({
									startDate: form.values.initialStartDate,
									startingPTO: form.values.initialPTO,
									payPeriodCount: form.values.payPeriodCount,
									ptoGainPerPayPeriod,
									prevPayPeriodArray: prev,
								})
							})
						}}
						value={d.spend || 0}
					/>
				),
			},
			{
				header: `PTO Balance (+${ptoGainPerPayPeriod})`,
				cell: (d) => {
					const val = Math.round(d.balance * 100) / 100
					const className = val >= 0 ? '' : 'text-red-500'
					return <span className={className}>{val}</span>
				},
			},
		],
		[
			form.values.payPeriodCount,
			ptoGainPerPayPeriod,
			form.values.initialStartDate,
			form.values.initialPTO,
		],
	)

	return (
		<div className='p-6'>
			<h1 className='text-brand-orange-500 font-bold text-3xl mb-1 text-center'>
				PTO Calculator
			</h1>
			<p className='text-center mb-3 leading-6'>
				Sometimes its helpful to have a quick tool to think about PTO.
				<br />
				Spend the time that this saves you to do a nice thing for someone.
			</p>
			<Form state={form} resetOnSubmit={false}>
				<InputRow>
					<InputWrapper>
						<Label name='initialStartDate' htmlFor='initialStartDate'>
							Start of First Pay Period
						</Label>
						<DatePicker
							id='initialStartDate'
							name='initialStartDate'
							selected={new Date(form.values.initialStartDate)}
							onChange={(d) => {
								const val = (d ?? firstSundayOfTheYear).getTime()
								form.setValue(form.names.initialStartDate, val)
								setPayPeriodArray((prev) =>
									recalculatePayPeriod({
										startDate: val,
										startingPTO: form.values.initialPTO,
										payPeriodCount: form.values.payPeriodCount,
										ptoGainPerPayPeriod,
										prevPayPeriodArray: prev,
									}),
								)
							}}
							isClearable={false}
						/>
						<InputError name={form.names.initialStartDate} />
					</InputWrapper>
					<InputWrapper>
						<Label name={form.names.initialPTO}>Initail PTO</Label>
						<Input name={form.names.initialPTO} type='number' min={0} />
						<InputError name={form.names.initialPTO} />
					</InputWrapper>
					<InputWrapper>
						<Label name={form.names.payPeriodCount}>Number of Pay periods</Label>
						<Input name={form.names.payPeriodCount} type='number' min={1} max={100} />
						<InputError name={form.names.payPeriodCount} />
					</InputWrapper>
					<InputWrapper>
						<SelectLabel state={classificationSelectState}>Classification</SelectLabel>
						<Select state={classificationSelectState} required />
						<SelectPopover state={classificationSelectState}>
							{classificationOptions.map((option) => (
								<SelectItem key={option.value} value={option.value}>
									{option.value}
								</SelectItem>
							))}
						</SelectPopover>
						<InputError name={form.names.classification} />
					</InputWrapper>
					{/* <SelectRow
						labelForKey='classification'
						title='Classification'
						value={classifications[classification]}
						options={classificationOptions}
						onChange={(selection) => {
							const newClassification =
								(selection?.value as Classification | undefined) ?? 'staff'
							setClassification(newClassification)
							const ptoGainPerPayPeriod =
								classifications[newClassification]?.yearsOfService.find(
									(y) => y.min <= yearsOfService && yearsOfService <= y.max,
								)?.accrualRate ?? 0
							setPayPeriodArray((prev) =>
								recalculatePayPeriod({
									startDate: initialStartDate,
									startingPTO: initialPTO,
									payPeriodCount,
									ptoGainPerPayPeriod,
									prevPayPeriodArray: prev,
								}),
							)
						}}
						getOptionValue={(option) => option.value}
						getOptionLabel={(option) => option.name}
						rowSize='condensed'
						className='flex-1'
					/> */}
					<InputWrapper>
						<Label name={form.names.yearsOfService}>Years of Service</Label>
						<Input name={form.names.yearsOfService} type='number' min={0} step={1} />
						<InputError name={form.names.yearsOfService} />
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
					{payPeriodArray.map((d, i) => (
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
