import { redirect, type Actions, fail } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { AIRTABLE_PAT } from '$env/static/private';
import { EasyAirtableTable } from 'easy-airtable';

const airtableConfig = {
	location: {
		apiKey: AIRTABLE_PAT,
		baseId: 'app6rqTtoNCCajSS1',
		tableId: 'tbl6BYdmMizZNRtlC'
	},
	individualMoveType: {
		apiKey: AIRTABLE_PAT,
		baseId: 'app6rqTtoNCCajSS1',
		tableId: 'tblImFSNEflA83Fif'
	},
	companyTypes: {
		apiKey: AIRTABLE_PAT,
		baseId: 'app6rqTtoNCCajSS1',
		tableId: 'tblgotVDLdVaP9p7K'
	},
	departments: {
		apiKey: AIRTABLE_PAT,
		baseId: 'app6rqTtoNCCajSS1',
		tableId: 'tblKjxL3C2haSP6s4'
	},
	ethnicities: {
		apiKey: AIRTABLE_PAT,
		baseId: 'app6rqTtoNCCajSS1',
		tableId: 'tblSqF45aGlvVCHU6'
	}
};

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) redirect(302, '/login');
	const title = 'JP Data Input';

	const locationTable = EasyAirtableTable.fromConfig(airtableConfig.location);
	const locationRecords = await locationTable.findAll({
		view: 'sortedByPositionCount'
	});
	const locations = locationRecords
		.map((record) => record._rawJson)
		.flatMap((l) => [{ label: l.fields.City, value: l.fields.id }]);

	const individualMoveTypeTable = EasyAirtableTable.fromConfig(airtableConfig.individualMoveType);
	const individualMoveTypeRecords = await individualMoveTypeTable.findAll({
		view: 'sortedByCount'
	});
	const individualMoveTypes = individualMoveTypeRecords
		.map((record) => record._rawJson)
		.map((r) => r.fields['Individual Move Type']);

	const firmTypes = EasyAirtableTable.fromConfig(airtableConfig.companyTypes)
		.findAll({
			view: 'usedTypes',
			fields: ['Company Type']
		})
		.then((records) =>
			records.map((record) => record._rawJson).flatMap((r) => r.fields['Company Type'])
		);

	const departments = EasyAirtableTable.fromConfig(airtableConfig.departments)
		.findAll({
			view: 'usedDepartments',
			fields: ['Department']
		})
		.then((records) =>
			records.map((record) => record._rawJson).flatMap((r) => r.fields['Department'])
		);

	const ethnicities = EasyAirtableTable.fromConfig(airtableConfig.ethnicities)
		.findAll({
			view: 'usedEthnicities',
			fields: ['Ethnicity']
		})
		.then((records) =>
			records.map((record) => record._rawJson).flatMap((r) => r.fields['Ethnicity'])
		);

	return {
		user: locals.user,
		title,
		streamed: {
			locations,
			individualMoveTypes,
			firmTypes,
			departments,
			ethnicities
		}
	};
};
