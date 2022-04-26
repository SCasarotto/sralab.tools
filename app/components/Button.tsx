import { forwardRef, useMemo } from 'react'

import type { ButtonProps as AriaButtonProps } from 'ariakit'
import { Button as AriaButton } from 'ariakit'

import { getButtonStyles } from '~/constants/theme'

export type ButtonProps = AriaButtonProps & {
	variant?: 'primary' | 'secondary'
}
export const Button = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
	const { className = '', variant, ...rest } = props

	const variantStyles = useMemo(() => getButtonStyles(variant), [variant])

	return <AriaButton className={`${variantStyles} ${className}`} ref={ref} {...rest} />
})
Button.displayName = 'Button'
