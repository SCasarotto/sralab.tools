import { forwardRef } from 'react'

import type { SelectItemProps as AriaSelectItemProps } from 'ariakit'
import { SelectItem as AriaSelectItem } from 'ariakit'

export type SelectItemProps = AriaSelectItemProps
export const SelectItem = forwardRef<HTMLDivElement, SelectItemProps>((props, ref) => {
	const { className = '', ...rest } = props
	return (
		<AriaSelectItem
			className={`flex items-center gap-2 scroll-m-2 rounded p-3 cursor-pointer transition duration-100 ease-in aria-selected:bg-brand-orange-500/25 active-item:aria-selected:bg-brand-orange-500  active-item:bg-brand-orange-500 active-item:text-white ${className}`}
			ref={ref}
			{...rest}
		/>
	)
})
SelectItem.displayName = 'SelectItem'
