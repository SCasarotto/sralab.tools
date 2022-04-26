import { forwardRef } from 'react'

import type { FormErrorProps } from 'ariakit'
import { FormError } from 'ariakit'

export type InputErrorProps = FormErrorProps
export const InputError = forwardRef<HTMLDivElement, InputErrorProps>((props, ref) => {
	const { className = '', ...rest } = props

	return (
		<FormError
			className={`rounded-lg border border-red-700 text-red-700 py-2 px-3 mt-1 bg-red-100 empty:hidden ${className}`}
			ref={ref}
			{...rest}
		/>
	)
})
InputError.displayName = 'InputError'
