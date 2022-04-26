import { forwardRef } from 'react'

import type { SelectPopoverProps as AriaSelectPopoverProps } from 'ariakit'
import { SelectPopover as AriaSelectPopover } from 'ariakit'

export type SelectPopoverProps = AriaSelectPopoverProps
export const SelectPopover = forwardRef<HTMLDivElement, SelectPopoverProps>((props, ref) => {
	const { className = '', ...rest } = props
	return (
		<AriaSelectPopover
			className={`flex flex-col gap-1 rounded-lg p-2 z-50 border border-gray-100 drop-shadow bg-white ${className}`}
			ref={ref}
			{...rest}
		/>
	)
})
SelectPopover.displayName = 'SelectPopover'
