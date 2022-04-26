import type { ComponentPropsWithRef } from 'react'
import { forwardRef } from 'react'

export type TdProps = ComponentPropsWithRef<'td'>
export const Td = forwardRef<HTMLTableDataCellElement, TdProps>((props, ref) => {
	const { className = '', ...rest } = props
	return <td className={`p-2 ${className}`} ref={ref} {...rest} />
})
Td.displayName = 'Td'
