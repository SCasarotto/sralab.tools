import { forwardRef, useMemo } from 'react'

import type { FormSubmitProps as AriaFormSubmitProps } from 'ariakit'
import { FormSubmit as AriaFormSubmit } from 'ariakit'

import { getButtonStyles } from '~/constants/theme'

export type FormSubmitProps = AriaFormSubmitProps & {
	variant?: 'primary' | 'secondary'
}
export const FormSubmit = forwardRef<HTMLButtonElement, FormSubmitProps>((props, ref) => {
	const { className = '', variant, ...rest } = props

	const variantStyles = useMemo(() => getButtonStyles(variant), [variant])

	return <AriaFormSubmit className={`${variantStyles} ${className}`} ref={ref} {...rest} />
})
FormSubmit.displayName = 'FormSubmit'
