const plugin = require('tailwindcss/plugin')

module.exports = {
	content: ['./app/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {
			colors: {
				'brand-orange': {
					50: '#fef8f4',
					100: '#fef0e9',
					200: '#fcdac8',
					300: '#fac4a6',
					400: '#f69764',
					500: '#f26b21',
					600: '#da601e',
					700: '#b65019',
					800: '#914014',
					900: '#773410',
				},
				'brand-red': {
					50: '#fef4f4',
					100: '#fde8ea',
					200: '#fac6ca',
					300: '#f7a4aa',
					400: '#f0606b',
					500: '#ea1c2b',
					600: '#d31927',
					700: '#b01520',
					800: '#8c111a',
					900: '#730e15',
				},
			},
		},
	},

	plugins: [
		plugin(({ addVariant }) => {
			addVariant('enter', '&[data-enter]')
			addVariant('leave', '&[data-leave]')
			addVariant('active-item', '&[data-active-item]')

			addVariant('active', ['&:active', '&[data-active]'])
			addVariant('focus-visible', ['&:focus-visible', '&[data-focus-visible]'])
			addVariant('aria-invalid', '&[aria-invalid="true"]')
			addVariant('aria-disabled', '&[aria-disabled="true"]')
			addVariant('aria-selected', '&[aria-selected="true"]')
			addVariant('aria-expanded', '&[aria-expanded="true"]')
			addVariant('aria-checked', '&[aria-checked="true"]')
		}),
	],
}
