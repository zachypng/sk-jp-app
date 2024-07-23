import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { AIRTABLE_PAT } from '$env/static/private';
import { EasyAirtableTable } from 'easy-airtable';

const airtableConfig = {
	movesGathering: {
		apiKey: AIRTABLE_PAT,
		baseId: 'appwlo7J9Ol1wsPoH',
		tableId: 'tblxfyYFpxat7wg6y'
	},
	projectManager: {
		apiKey: AIRTABLE_PAT,
		baseId: 'appr2KZxQErPJYjH5',
		tableId: 'tblNGUm7BLvjzc3v9'
	},
	position: {
		apiKey: AIRTABLE_PAT,
		baseId: 'app6rqTtoNCCajSS1',
		tableId: 'tblfjvDhEe0qroqE7'
	},
	company: {
		apiKey: AIRTABLE_PAT,
		baseId: 'app6rqTtoNCCajSS1',
		tableId: 'tblqTddKRbCwD0hhB'
	}
};

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) redirect(302, '/login');
	const title = 'Home';

	const positionCount = EasyAirtableTable.fromConfig(airtableConfig.company)
		.findAll({
			view: 'All Mapped Firms (Y)',
			fields: ['countFullyMappedPositions']
		})
		.then((records) =>
			records
				.map((record) => record._rawJson)
				.flatMap((r) => r.fields.countFullyMappedPositions)
				.reduce((partialSum, a) => partialSum + a, 0)
		);

	const recentCompanies = EasyAirtableTable.fromConfig(airtableConfig.company)
		.findAll({
			view: 'Recently Modified Fully-Mapped Companies',
			fields: ['Company', 'company_id', 'firmType', 'aum_last_modified', 'position_last_modified']
		})
		.then((records) => records.map((record) => record._rawJson).flatMap((r) => r.fields));

	const outOfDateCompanies = EasyAirtableTable.fromConfig(airtableConfig.company)
		.findAll({
			view: 'AUM Out-of-Date',
			fields: ['Company', 'company_id', 'firmType', 'aum_last_modified', 'position_last_modified'],
			maxRecords: 20
		})
		.then((records) => records.map((record) => record._rawJson).flatMap((r) => r.fields));

	const movesGathering = EasyAirtableTable.fromConfig(airtableConfig.movesGathering)
		.findAll({
			view: 'currentNewsletterCycle',
			fields: ['Move', 'Move Type', 'Inputted']
		})
		.then((records) =>
			records
				.map((record) => record._rawJson)
				.flatMap((r) => [
					{
						move: r.fields.Move,
						moveType: r.fields['Move Type'],
						inputted: r.fields.Inputted
					}
				])
		);

	const inputtedMoves = movesGathering.then((moves) => moves.filter((m) => m.inputted));
	const pendingMoves = movesGathering.then((moves) => moves.filter((m) => !m.inputted));

	return {
		user: event.locals.user,
		title,
		streamed: {
			positionCount: positionCount,
			recentlyModified: recentCompanies,
			outOfDate: outOfDateCompanies,
			movesGathering: movesGathering,
			inputtedMoves,
			pendingMoves
		}
	};
};
