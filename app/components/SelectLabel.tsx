import { forwardRef } from 'react'

import type { SelectLabelProps as AriaSelectLabelProps } from 'ariakit'
import { SelectLabel as AriaSelectLabel } from 'ariakit'

import { labelStyles } from '~/constants/theme'

// TODO: Once the next version of aria kit comes out the 'div' won't be needed
export type SelectLabelProps = AriaSelectLabelProps<'div'>
export const SelectLabel = forwardRef<HTMLDivElement, SelectLabelProps>((props, ref) => {
	const { className = '', ...rest } = props
	return <AriaSelectLabel className={`${labelStyles} ${className}`} ref={ref} {...rest} />
})
SelectLabel.displayName = 'SelectLabel'
