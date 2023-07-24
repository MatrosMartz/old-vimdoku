import type { Difficulties } from '../models'

export const probabilityToBeInitial = (difficulty: Difficulties) =>
	!Math.trunc(Math.random() * difficulty)

export function randomNumbers() {
	const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9]

	for (let i = numbers.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i - 1))
		;[numbers[i], numbers[j]] = [numbers[j], numbers[i]]
	}
	return numbers
}
