import { AIRTABLE_PAT } from '$env/static/private';
import type { ATTable, ATView } from '$lib/config';
import { EasyAirtableTable } from 'easy-airtable';
import type { PageServerLoad } from '../$types';
import { redirect } from '@sveltejs/kit';

const positionTable = 'tblfjvDhEe0qroqE7';

const config = {
	apiKey: AIRTABLE_PAT,
	baseId: 'app6rqTtoNCCajSS1',
	tableId: 'tblqTddKRbCwD0hhB'
};

const fields = [
	'fldF3j6XkS0kcxpN8', //Company
	'flds4ifwz01F29uR8', //Last modified time
	'fldcwjPaNF435CqxT', //# of current positions
	'fldazfjZHvW2I1r32' //AUM_Concatenate
];

export const load: PageServerLoad = async ({ fetch, locals }) => {
	if (!locals.user) redirect(302, '/login');
	if (locals.user.isBetaEnrolled != 1) redirect(302, '/');
	const title = 'JP Orgchart (Beta)';

	//Companies
	const table = EasyAirtableTable.fromConfig(config);
	const companies = table.findAll({
		view: 'viwTfGU10CCmmzUnG',
		fields: fields
	});
	const records = await companies.then((companies) => companies.map((record) => record._rawJson));

	//Views

	const res = await fetch(`https://api.airtable.com/v0/meta/bases/${config.baseId}/tables`, {
		method: 'GET',
		headers: { Authorization: `Bearer ${AIRTABLE_PAT}` }
	});

	const views = await res
		.json()
		.then((data) => data.tables.filter((table: ATTable) => table.id === positionTable)[0].views);

	const filteredViews = views
		.filter((view: ATView) => view.type === 'grid' && view.name.includes(', '))
		.sort((a: ATView, b: ATView) => a.name.trim().localeCompare(b.name.trim()));

	return {
		user: locals.user,
		title,
		companies: await records,
		views: await filteredViews
	};
};
