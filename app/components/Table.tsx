import type { ComponentPropsWithRef } from 'react'
import { forwardRef } from 'react'

export type TableProps = ComponentPropsWithRef<'table'>
export const Table = forwardRef<HTMLTableElement, TableProps>((props, ref) => {
	const { className = '', ...rest } = props
	return <table className={`border-collapse w-full text-left ${className}`} ref={ref} {...rest} />
})
Table.displayName = 'Table'
