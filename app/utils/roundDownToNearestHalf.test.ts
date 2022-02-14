import { roundDownToNearestHalf } from './roundDownToNearestHalf'

describe('roundDownToNearestHalf', () => {
	it('rounds a number down to the nearest 0.5', () => {
		const inOut = [
			{ in: -0.75, out: -1 },
			{ in: -0.5, out: -0.5 },
			{ in: -0.1, out: -0.5 },
			{ in: 0, out: 0 },
			{ in: 0.1, out: 0 },
			{ in: 0.2, out: 0 },
			{ in: 0.3, out: 0 },
			{ in: 0.4, out: 0 },
			{ in: 0.5, out: 0.5 },
			{ in: 0.6, out: 0.5 },
			{ in: 0.7, out: 0.5 },
			{ in: 0.8, out: 0.5 },
			{ in: 0.9, out: 0.5 },
			{ in: 1, out: 1 },
			{ in: 1.1, out: 1 },
			{ in: 1.2, out: 1 },
			{ in: 1.3, out: 1 },
			{ in: 1.4, out: 1 },
			{ in: 1.5, out: 1.5 },
			{ in: 1.6, out: 1.5 },
			{ in: 1.7, out: 1.5 },
			{ in: 1.8, out: 1.5 },
			{ in: 1.9, out: 1.5 },
			{ in: 2, out: 2 },
			{ in: 2.1, out: 2 },
			{ in: 2.2, out: 2 },
			{ in: 2.3, out: 2 },
			{ in: 2.4, out: 2 },
			{ in: 2.5, out: 2.5 },
			{ in: 2.6, out: 2.5 },
			{ in: 2.7, out: 2.5 },
			{ in: 2.8, out: 2.5 },
			{ in: 2.9, out: 2.5 },
			{ in: 3, out: 3 },
		]
		inOut.forEach(({ in: input, out: expected }) => {
			expect(roundDownToNearestHalf(input)).toBe(expected)
		})
	})
})
