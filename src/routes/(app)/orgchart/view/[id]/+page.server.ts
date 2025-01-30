import { AIRTABLE_PAT } from '$env/static/private';
import { EasyAirtableTable } from 'easy-airtable';
import { differenceInYears, differenceInMonths } from 'date-fns';
import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

const getMonthYear = (date: string) => {
	const dateObj = new Date(date);
	return `${dateObj.toLocaleString('default', { month: 'long' })} ${dateObj.getFullYear()}`;
};

const getTenure = (startDate: string, endDate: string) => {
	const start = new Date(startDate);
	const end = new Date(endDate);
	if (differenceInYears(end, start) < 2) {
		return differenceInMonths(end, start) + ' months';
	} else {
		return differenceInYears(end, start) + ' years';
	}
};

const tableList = {
	Company: {
		apiKey: AIRTABLE_PAT,
		baseId: 'app6rqTtoNCCajSS1',
		tableId: 'tblqTddKRbCwD0hhB'
	},
	Position: {
		apiKey: AIRTABLE_PAT,
		baseId: 'app6rqTtoNCCajSS1',
		tableId: 'tblfjvDhEe0qroqE7'
	},
	Moves: {
		apiKey: AIRTABLE_PAT,
		baseId: 'app6rqTtoNCCajSS1',
		tableId: 'tblp13UW7l8l1k5J4'
	}
};

export const load: PageServerLoad = async ({ params, locals, fetch }) => {
	if (!locals.user || !locals.session) redirect(302, '/login');
	if (locals.user.isBetaEnrolled != 1) redirect(302, '/');
	let title = 'JP Orgchart (Beta)';

	const selectedView = fetch(
		`https://api.airtable.com/v0/meta/bases/app6rqTtoNCCajSS1/views/${params.id}`,
		{
			headers: { Authorization: `Bearer ${AIRTABLE_PAT}` }
		}
	).then((res) => res.json().then((data) => data.name));

	const positionTable = EasyAirtableTable.fromConfig(tableList.Position);
	const positionRecords = await positionTable.findAll({
		view: params.id,
		filterByFormula: `{End Date}=''`,
		fields: [
			'position_id',
			'Company',
			'person_name',
			'manager_id',
			'Concatenate Title',
			'Photo (from Person)',
			'locationText',
			'Biography (from Person)',
			'departmentText',
			'Gender (from Person)',
			'ethnicityText'
		]
	});

	const companyID = positionRecords[0]._rawJson.fields.Company[0];

	const companyTable = EasyAirtableTable.fromConfig(tableList.Company);
	const company = await companyTable.findOneById(companyID);
	const selectedCompany = company._rawJson;

	const movesTable = EasyAirtableTable.fromConfig(tableList.Moves);
	const movesRecords = await movesTable.findAll({
		filterByFormula: `AND(OR({Company (from Previous Position)}='${selectedCompany.fields.Company}', {Company (from New Position)}='${selectedCompany.fields.Company}'), {fldWcDuquxc0jf9vS}='External', OR({newLabelTag}='Distribution', {newLabelTag}='C-Suite', AND(OR({prevLabelTag}='Distribution', {prevLabelTag}='C-Suite'), {Company (from Previous Position)}='${selectedCompany.fields.Company}')))`, // Move Type = 'External'
		sort: [{ field: 'fld2STUK7uTIu1SlB', direction: 'desc' }] // Start Date (from New Position)
	});

	const moves = movesRecords
		.map((record) => record._rawJson)
		.flatMap((move) => [
			{
				id: move.id,
				personName: move.fields.personName || 'N/A',
				newStartDate: move.fields['Start Date (from New Position)']
					? getMonthYear(move.fields['Start Date (from New Position)'][0])
					: 'N/A',
				newConcatTitle: move.fields['Concatenate Title (from New Position)']
					? move.fields['Concatenate Title (from New Position)'][0]
					: 'Unknown',
				newCompany: move.fields.newCompany || 'N/A',
				newCorporateTitle: move.fields['Corporate Title (from New Position)']
					? move.fields['Corporate Title (from New Position)'][0]
					: 'Unknown',
				pronoun: move.fields.Pronoun || 'They',
				prevCompany: move.fields.prevCompany || 'N/A',
				prevConcatTitle: move.fields['Concatenate Title (from Previous Position)']
					? move.fields['Concatenate Title (from Previous Position)'][0]
					: 'Unknown',
				prevCorporateTitle: move.fields['Corporate Title (from Previous Position) 2']
					? move.fields['Corporate Title (from Previous Position) 2'][0]
					: 'Unknown',
				prevTenure:
					move.fields['End Date (from Previous Position)'] &&
					move.fields['Start Date (from Previous Position)']
						? getTenure(
								move.fields['Start Date (from Previous Position)'][0],
								move.fields['End Date (from Previous Position)'][0]
							)
						: 'an unknown amount of time',
				prevEndDate: move.fields['End Date (from Previous Position)']
					? getMonthYear(move.fields['End Date (from Previous Position)'][0])
					: 'N/A',
				moveType: move.fields['Company (from New Position)']
					? move.fields['Company (from New Position)'][0] === companyID
						? 'Hire'
						: 'Departure'
					: '',
				isKeyMove: move.fields.isKeyMove === 'Y' ? true : false
			}
		]);

	const positions = [
		{
			key: selectedCompany.id,
			name: selectedCompany.fields.Company || 'N/A',
			logoURL: selectedCompany.fields.Logo ? selectedCompany.fields.Logo[0].url : '',
			logoWidth: selectedCompany.fields.Logo ? selectedCompany.fields.Logo[0].width : '',
			logoHeight: selectedCompany.fields.Logo ? selectedCompany.fields.Logo[0].height : '',
			biography: ''
		},
		...positionRecords
			.map((record) => record._rawJson)
			.flatMap((position) => [
				{
					key: position.id,
					name: position.fields.person_name ? position.fields.person_name[0] : 'N/A',
					parent: position.fields.manager_id ? position.fields.manager_id[0] : companyID,
					title: position.fields['Concatenate Title']
						? position.fields['Concatenate Title']
						: 'N/A',
					photoURL: position.fields['Photo (from Person)']
						? position.fields['Photo (from Person)'][0].url
						: '',
					location: position.fields.locationText || '',
					biography: position.fields['Biography (from Person)']
						? position.fields['Biography (from Person)'][0]
						: '',
					department: position.fields['departmentText'] || '',
					ethnicity: position.fields['ethnicityText'] || '',
					// it gets really bad below here, this checks for existence of gender, if it exists and is blank then returns 'Unknown', if it's the id of Male in DIR_Gender table it returns 'Male', else it's 'Female'
					gender: position.fields['Gender (from Person)']
						? position.fields['Gender (from Person)'][0] === ''
							? 'Unknown'
							: position.fields['Gender (from Person)'][0] === 'recMQ9KHAFCsRr9pB'
								? 'Male'
								: 'Female'
						: ''
				}
			])
	];

	return {
		user: locals.user,
		title: (await selectedView) || title,
		company: selectedCompany.fields,
		positions: positions,
		moves: {
			keyHires: moves.filter((move) => move.moveType === 'Hire' && move.isKeyMove) || undefined,
			keyDepartures:
				moves.filter((move) => move.moveType === 'Departure' && move.isKeyMove) || undefined,
			general: moves.filter((move) => !move.isKeyMove) || undefined
		}
	};
};

export const actions = {
	updateManager: async ({ request }) => {
		const data = await request.formData();
		const positionID = data.get('positionID') as string;
		const managerID = data.get('managerID') as string;
		const rootNode = data.get('rootNode') as string;

		const table = EasyAirtableTable.fromConfig(tableList.Position);
		if (managerID === rootNode) {
			try {
				table.updateOne(positionID, { Manager: '' });
			} catch (error) {
				console.log(error);
			}
		} else {
			try {
				table.updateOne(positionID, { Manager: managerID });
			} catch (error) {
				console.log(error);
			}
		}
	}
};
