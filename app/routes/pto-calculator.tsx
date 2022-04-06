import { addWeeks, format, getDay, setDay, startOfYear, subDays } from 'date-fns'
import { ReactNode, useMemo, useState } from 'react'
import { DatetimeRow, Input, InputRow, SelectRow } from 'react-tec'

type PayPeriod = {
	start: Date
	end: Date
	spend: number
	balance: number
}

type RecalculatePayPeriodData = {
	startDate: Date
	startingPTO: number
	payPeriodCount: number
	ptoGainPerPayPeriod: number
	prevPayPeriodArray: Array<PayPeriod>
}
const recalculatePayPeriod = (d: RecalculatePayPeriodData) => {
	const { startDate, startingPTO, payPeriodCount, ptoGainPerPayPeriod, prevPayPeriodArray } = d

	const initialPTO = isNaN(startingPTO) ? 0 : startingPTO
	const periodCount = isNaN(payPeriodCount) ? 0 : payPeriodCount
	const ptoGain = isNaN(ptoGainPerPayPeriod) ? 0 : ptoGainPerPayPeriod

	const newPayPeriodArray: Array<PayPeriod> = []
	for (let i = 0; i < periodCount; i++) {
		// Two week pay periods
		const start = addWeeks(startDate, 2 * i)
		const end = subDays(addWeeks(start, 2), 1)
		// gotta be careful because the number of pay perios could be larger than the previous array
		const spend = prevPayPeriodArray?.[i]?.spend ?? 0
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
	staff: {
		name: 'Staff',
		value: 'staff',
		yearsOfService: [
			{ min: 0, max: 3, accrualRate: 7.69 },
			{ min: 4, max: Infinity, accrualRate: 9.23 },
		],
	},
	'physicians-department-heads-and-above': {
		name: 'Physicians, Department Heads, and Above',
		value: 'physicians-department-heads-and-above',
		yearsOfService: [{ min: 0, max: Infinity, accrualRate: 9.23 }],
	},
}
const classificationOptions = Object.values(classifications)

export default function PTOCalculator() {
	const [initialStartDate, setInitialStartDate] = useState<Date>(firstSundayOfTheYear)
	const [initialPTO, setInitialPTO] = useState(0)
	const [payPeriodCount, setPayPeriodCount] = useState(26)
	const [classification, setClassification] = useState<keyof typeof classifications>('staff')
	const [yearsOfService, setYearsOfService] = useState(1)

	const ptoGainPerPayPeriod = useMemo(
		() =>
			classifications[classification]?.yearsOfService.find(
				(y) => y.min <= yearsOfService && yearsOfService <= y.max,
			)?.accrualRate ?? 0,
		[classification, yearsOfService],
	)
	const [payPeriodArray, setPayPeriodArray] = useState<Array<PayPeriod>>(
		recalculatePayPeriod({
			startDate: initialStartDate,
			startingPTO: initialPTO,
			payPeriodCount,
			ptoGainPerPayPeriod,
			prevPayPeriodArray: [],
		}),
	)

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
							const spend = e.target.valueAsNumber ?? 0
							setPayPeriodArray((prev) => {
								const prevPayPeriodArray = [...prev]
								prevPayPeriodArray[i].spend = spend
								return recalculatePayPeriod({
									startDate: initialStartDate,
									startingPTO: initialPTO,
									payPeriodCount,
									ptoGainPerPayPeriod,
									prevPayPeriodArray,
								})
							})
						}}
						value={d.spend ?? 0}
					/>
				),
			},
			{
				header: `PTO Balance (+${ptoGainPerPayPeriod})`,
				cell: (d) => Math.round(d.balance * 100) / 100,
			},
		],
		[payPeriodCount, ptoGainPerPayPeriod, payPeriodArray, initialStartDate, initialPTO],
	)

	return (
		<div className='p-6'>
			<h1 className='text-primary font-bold text-3xl mb-1 text-center'>PTO Calculator</h1>
			<p className='text-center mb-3 leading-6'>
				Sometimes its helpful to have a quick tool to think about PTO.
				<br />
				Spend the time that this saves you to do a nice thing for someone.
			</p>
			<div className='flex'>
				<DatetimeRow
					labelForKey='startDate'
					title='Start of First Pay Period'
					value={initialStartDate}
					onChange={(d) => {
						const val = d ?? firstSundayOfTheYear
						setInitialStartDate(val)
						setPayPeriodArray((prev) =>
							recalculatePayPeriod({
								startDate: val,
								startingPTO: initialPTO,
								payPeriodCount,
								ptoGainPerPayPeriod,
								prevPayPeriodArray: prev,
							}),
						)
					}}
					isClearable={false}
					rowSize='condensed'
					className='flex-1'
				/>
				<InputRow
					type='number'
					labelForKey='initialPTO'
					title='Initial PTO'
					value={initialPTO}
					onChange={(e) => {
						const val = e.target.valueAsNumber
						setInitialPTO(val)
						setPayPeriodArray((prev) =>
							recalculatePayPeriod({
								startDate: initialStartDate,
								startingPTO: val,
								payPeriodCount,
								ptoGainPerPayPeriod,
								prevPayPeriodArray: prev,
							}),
						)
					}}
					rowSize='condensed'
					min={0}
					className='flex-1'
				/>
				<InputRow
					type='number'
					labelForKey='payPeriodCount'
					title='Number of Pay periods'
					value={payPeriodCount}
					onChange={(e) => {
						const val = e.target.valueAsNumber
						setPayPeriodCount(val)
						setPayPeriodArray((prev) =>
							recalculatePayPeriod({
								startDate: initialStartDate,
								startingPTO: initialPTO,
								payPeriodCount: val,
								ptoGainPerPayPeriod,
								prevPayPeriodArray: prev,
							}),
						)
					}}
					rowSize='condensed'
					min={1}
					max={100}
					className='flex-1'
				/>
				<SelectRow
					labelForKey='classification'
					title='Classification'
					value={classifications[classification]}
					options={classificationOptions}
					onChange={(selection) => {
						const newClassification =
							(selection?.value as keyof typeof classifications | undefined) ??
							'staff'
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
				/>
				<InputRow
					type='number'
					labelForKey='yearsOfService'
					title='Years of Service'
					value={yearsOfService}
					onChange={(e) => {
						const val = e.target.valueAsNumber
						setYearsOfService(val)
						const ptoGainPerPayPeriod =
							classifications[classification]?.yearsOfService.find(
								(y) => y.min <= val && val <= y.max,
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
					rowSize='condensed'
					last
					min={0}
					step={1}
					className='flex-1'
				/>
			</div>
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
					{payPeriodArray.map((d, i) => (
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
	)
}
