import { forwardRef } from 'react'

import type { SelectProps as AriaSelectProps } from 'ariakit'
import { Select as AriaSelect } from 'ariakit'

import { inputStyles } from '~/constants/theme'

export type SelectProps = AriaSelectProps
export const Select = forwardRef<HTMLButtonElement, SelectProps>((props, ref) => {
	const { className = '', ...rest } = props
	return (
		<AriaSelect
			className={`flex justify-between items-center ${inputStyles} ${className}`}
			ref={ref}
			{...rest}
		/>
	)
})
Select.displayName = 'Select'
