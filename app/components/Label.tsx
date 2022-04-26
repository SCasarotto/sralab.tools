import { forwardRef } from 'react'

import type { FormLabelProps } from 'ariakit'
import { FormLabel } from 'ariakit'

import { labelStyles } from '~/constants/theme'

export type LabelProps = FormLabelProps
export const Label = forwardRef<HTMLLabelElement, LabelProps>((props, ref) => {
	const { className = '', ...rest } = props
	return <FormLabel className={`${labelStyles} ${className}`} ref={ref} {...rest} />
})
Label.displayName = 'Label'
