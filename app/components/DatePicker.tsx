import { forwardRef } from 'react'

import type { ReactDatePickerProps } from 'react-datepicker'
import RDatePicker from 'react-datepicker'

import { inputStyles } from '~/constants/theme'

export type DatePickerProps = ReactDatePickerProps
export const DatePicker = forwardRef<RDatePicker, DatePickerProps>((props, ref) => {
	const { className = '', wrapperClassName = '', ...rest } = props
	return (
		<RDatePicker
			className={`${inputStyles} ${className}`}
			wrapperClassName={`w-full ${wrapperClassName}`}
			ref={ref}
			{...rest}
		/>
	)
})
DatePicker.displayName = 'DatePicker'
