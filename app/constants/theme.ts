export const inputStyles =
	'w-full text-left text-base leading-4 border border-gray-300 rounded-lg p-3 gap-1 bg-white hover:bg-gray-100/60 transition duration-100 ease-in'
export const labelStyles = 'mb-1 text-base leading-4'
export const getButtonStyles = (variant?: 'primary' | 'secondary') => {
	const base = 'w-full rounded-lg border transition duration-100 ease-in py-2 px-4'
	switch (variant) {
		case 'secondary':
			return `${base} text-gray-700 bg-white border-gray-300 hover:bg-gray-100/60`
		case 'primary':
		default:
			return `${base} text-white bg-brand-orange-500 border-none hover:bg-brand-orange-600`
	}
}
