import { z } from 'zod';

export const names = ['Jaclyn', 'Jacob', 'Katie', 'Samuel', 'Zach'];

export const nameForm = z.object({
	name: z.string().min(2).max(50)
});

export type NameForm = typeof nameForm;
type Name = keyof typeof names;
