import { addHours, format, startOfDay } from 'date-fns'
import { ReactNode, useMemo, useState } from 'react'
import { Button, DatetimeRow, Form, InputRow, SelectRow } from 'react-tec'
import { roundDownToNearestHalf } from '~/utils/roundDownToNearestHalf'

type ModeOption =
	| {
			label: '6 Hours'
			value: '6hr'
			scale: Record<number, number>
	  }
	| {
			label: '6.5 Hours'
			value: '6.5hr'
			scale: Record<number, number>
	  }
const modeOptions: Array<ModeOption> = [
	{
		label: '6 Hours',
		value: '6hr',
		scale: {
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
	},
	{
		label: '6.5 Hours',
		value: '6.5hr',
		scale: {
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
	},
]

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
	const [mode, setMode] = useState<ModeOption | undefined>(modeOptions[0])
	const [startOfDayTime, setStartOfDayTime] = useState<number | undefined>(
		addHours(startOfDay(new Date()), 8).getTime(),
	)
	const [department, setDepartment] = useState('')
	const [treatmentHours, setTreatmentHours] = useState(0.25)
	const [hourArray, setHourArray] = useState<Array<HourData>>([])

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
						onClick={() =>
							// Remove and update all items after the deleted one
							setHourArray((prev) =>
								recalculateHours({
									hourArray: [...prev.slice(0, i), ...prev.slice(i + 1)],
									scale: mode?.scale,
									startOfDayTime,
								}),
							)
						}
					>
						Delete
					</Button>
				),
			},
		],
		[],
	)

	return (
		<div className='p-6'>
			<h1 className='text-primary font-bold text-3xl mb-1 text-center'>ADP Calculator</h1>
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
			<div>
				<SelectRow<ModeOption>
					title='Treatment Ratio'
					labelForKey='mode'
					value={mode}
					onChange={(option) => {
						setMode(option ?? undefined)
						setHourArray((prev) =>
							recalculateHours({
								hourArray: prev,
								scale: option?.scale,
								startOfDayTime,
							}),
						)
					}}
					options={modeOptions}
					required
				/>
				<DatetimeRow
					title='Start of Day'
					labelForKey='startTime'
					value={startOfDayTime ? new Date(startOfDayTime) : undefined}
					onChange={(time) => setStartOfDayTime(time?.getTime())}
					showTimeSelect
					showTimeSelectOnly
					dateFormat='h:mm aa'
					timeIntervals={15}
					required
				/>
				<Form
					onSubmit={(e) => {
						e.preventDefault()
						if (mode) {
							setHourArray((prev) => [
								...prev,
								createHoursData({
									department,
									treatmentHours,
									scale: mode.scale,
									prevHourArray: prev,
									startOfDayTime,
								}),
							])
							setDepartment('')
							setTreatmentHours(0.25)
						}
					}}
					style={{
						display: 'flex',
						alignItems: 'flex-end',
					}}
				>
					<InputRow
						title='Cost Center'
						labelForKey='department'
						value={department}
						onChange={(e) => setDepartment(e.target.value)}
						rowSize='third'
					/>
					<InputRow
						type='number'
						title='Treatment Hours'
						labelForKey='treatmentHours'
						value={treatmentHours}
						onChange={(e) => setTreatmentHours(e.target.valueAsNumber)}
						required
						rowSize='third'
						min={0.25}
						max={6.75}
						step={0.25}
					/>
					<Button
						type='submit'
						style={{ width: '33%', marginBottom: '10px', height: '38px' }}
					>
						Add
					</Button>
				</Form>
				<table className='border-collapse w-full text-left'>
					<thead>
						<tr>
							{tableConfig.map((config) => (
								<th key={config.header} className='px-3 py-2 bg-primary text-white'>
									{config.header}
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{hourArray.map((d, i) => (
							<tr key={i} className='even:bg-gray-100'>
								{tableConfig.map((config) => (
									<td key={config.header} className='p-2'>
										{config.cell(d, i)}
									</td>
								))}
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	)
}
