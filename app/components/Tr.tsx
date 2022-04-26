import type { ComponentPropsWithRef } from 'react'
import { forwardRef, useMemo } from 'react'

export type TrProps = ComponentPropsWithRef<'tr'> & {
	variant?: 'head' | 'body'
}
export const Tr = forwardRef<HTMLTableRowElement, TrProps>((props, ref) => {
	const { className = '', variant, ...rest } = props
	const variantStyles = useMemo(() => {
		switch (variant) {
			case 'head':
				return ''
			case 'body':
			default:
				return 'even:bg-gray-100'
		}
	}, [variant])
	return <tr className={`${variantStyles} ${className}`} ref={ref} {...rest} />
})
Tr.displayName = 'Tr'
