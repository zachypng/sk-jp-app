import type { ATMove } from '$lib/config';
import { paragraphify } from '$lib/utils';
import { describe, it, expect } from 'vitest';

const moves: ATMove[] = [
	{
		id: 'rec1',
		isKeyMove: true,
		moveType: 'Hire',
		newCompany: 'Apollo Global Management',
		newConcatTitle: 'Managing Director, Balls and such',
		newCorporateTitle: 'Managing Director',
		newStartDate: '2024-01-21',
		personName: 'Paul Kariya',
		prevCompany: 'KKR',
		prevConcatTitle: 'Director, Horseshit',
		prevCorporateTitle: 'Director',
		prevEndDate: '2024-01-21',
		prevTenure: '10 years',
		pronoun: 'He'
	},
	{
		id: 'rec1',
		isKeyMove: true,
		moveType: 'Departure',
		newCompany: 'Cerberus Capital',
		newConcatTitle: 'Managing Director, Balls and such',
		newCorporateTitle: 'Managing Director',
		newStartDate: '2024-02-21',
		personName: 'David Archuleta',
		prevCompany: 'Ares Management',
		prevConcatTitle: 'Director, Horseshit',
		prevCorporateTitle: 'Director',
		prevEndDate: '2024-02-21',
		prevTenure: '10 years',
		pronoun: 'He'
	}
];

describe('sum test', () => {
	it('adds 1 + 2 to equal 3', () => {
		expect(1 + 2).toBe(3);
	});
});

describe('paragraph test', () => {
	it('should render a paragraph', () => {
		expect(paragraphify(moves[0])).not.toBe('hidden');
	});
});
