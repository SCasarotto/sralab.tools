import type { ComponentProps } from 'react'

export type InputRowProps = ComponentProps<'div'>
export const InputRow = (props: InputRowProps) => {
	const { className = '', ...rest } = props
	return <div className={`flex flex-row gap-2 ${className}`} {...rest} />
}
InputRow.displayName = 'InputRow'
