import { redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db/db';
import { userTable } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { fail, superValidate } from 'sveltekit-superforms';
import { nameForm } from './schemas';
import { zod } from 'sveltekit-superforms/adapters';
import { EasyAirtableTable } from 'easy-airtable';
import { AIRTABLE_PAT } from '$env/static/private';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) redirect(302, '/login');
	const title = 'User Settings';

	const airtableConfig = {
		apiKey: AIRTABLE_PAT,
		baseId: 'app6rqTtoNCCajSS1',
		tableId: 'tble09CzL5BM9QBEl' // JENSEN ANALYSTS
	};

	const namesTable = await EasyAirtableTable.fromConfig(airtableConfig).findAll({
		view: 'viwxCDxTdtXuvuXuX', // CURRENT
		fields: ['Name']
	});

	const names = namesTable.map((record) => record._rawJson).flatMap((r) => r.fields.Name);

	return {
		user: locals.user,
		title,
		names,
		form: await superValidate(zod(nameForm))
	};
};

export const actions: Actions = {
	betaEnroll: async (event) => {
		if (!event.locals.user) return;
		try {
			await db
				.update(userTable)
				.set({ isBetaEnrolled: true })
				.where(eq(userTable.id, event.locals.user.id))
				.returning({ updatedBetaEnroll: userTable.isBetaEnrolled });
		} catch (e) {
			console.error(e);
		}
	},
	updateName: async (event) => {
		if (!event.locals.user) return;
		const form = await superValidate(event, zod(nameForm));
		if (!form.valid) {
			return fail(400, {
				form
			});
		}
		try {
			await db
				.update(userTable)
				.set({ name: form.data.name })
				.where(eq(userTable.id, event.locals.user.id))
				.returning({ updatedName: userTable.name });
		} catch (e) {
			console.error(e);
		}
		return {
			form
		};
	},
	updateNickname: async ({ locals, request }) => {
		if (!locals.user) return;
		const data = await request.formData();
		const nickname = data.get('nickname');

		try {
			await db
				.update(userTable)
				.set({ nickname: nickname ? nickname.toString() : '' })
				.where(eq(userTable.id, locals.user.id))
				.returning({ updatedNickname: userTable.nickname });
		} catch (e) {
			console.error(e);
		}
	}
};
