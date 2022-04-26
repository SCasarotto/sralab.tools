import type { ComponentProps } from 'react'

export type InputWrapperProps = ComponentProps<'div'>
export const InputWrapper = (props: InputWrapperProps) => {
	const { className = '', ...rest } = props
	return <div className={`flex flex-1 flex-col mb-2 ${className}`} {...rest} />
}
InputWrapper.displayName = 'InputWrapper'
