// export const csr = true;

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
	if (differenceInYears(new Date(endDate), new Date(startDate)) < 2) {
		return differenceInMonths(new Date(endDate), new Date(startDate)) + ' months';
	} else {
		return differenceInYears(new Date(endDate), new Date(startDate)) + ' years';
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

export const load: PageServerLoad = async ({ params, locals }) => {
	if (!locals.user) redirect(302, '/login');
	if (locals.user.isBetaEnrolled != 1) redirect(302, '/');
	const title = 'JP Orgchart (Beta)';

	const companyTable = EasyAirtableTable.fromConfig(tableList.Company);
	const company = await companyTable.findOneById(params.id);
	const selectedCompany = company._rawJson;

	const positionTable = EasyAirtableTable.fromConfig(tableList.Position);
	const positionRecords = await positionTable.findAll({
		view: 'viw3yw95f2rQUhQ6M',
		filterByFormula: `{fldhlHYVgpvmql1On}='${params.id}'`
	});

	const movesTable = EasyAirtableTable.fromConfig(tableList.Moves);
	const movesRecords = await movesTable.findAll({
		filterByFormula: `AND(OR({Company (from Previous Position)}='${selectedCompany.fields.Company}', {Company (from New Position)}='${selectedCompany.fields.Company}'), {fldWcDuquxc0jf9vS}='External')`,
		sort: [{ field: 'fld2STUK7uTIu1SlB', direction: 'desc' }]
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
					? move.fields['Company (from New Position)'][0] === params.id
						? 'Hire'
						: 'Departure'
					: '',
				isKeyMove: move.fields.isKeyMove === 'Y' ? true : false
			}
		]);

	// console.log(selectedCompany.fields.Logo);
	// console.log(
	// 	positionRecords.map((record) => record._rawJson.fields['Photo (from Person)'][0].thumbnails)
	// );

	const positions = [
		{
			key: selectedCompany.id,
			name: selectedCompany.fields.Company || 'N/A',
			logoURL:
				selectedCompany.fields.Logo && selectedCompany.fields.Logo[0]?.type !== 'image/svg+xml'
					? selectedCompany.fields.Logo[0].url
					: '',
			logoWidth: selectedCompany.fields.Logo ? selectedCompany.fields.Logo[0].width : '',
			logoHeight: selectedCompany.fields.Logo ? selectedCompany.fields.Logo[0].height : ''
		},
		...positionRecords
			.map((record) => record._rawJson)
			.flatMap((position) => [
				{
					key: position.id,
					name: position.fields.person_name ? position.fields.person_name[0] : 'N/A',
					parent: position.fields.manager_id ? position.fields.manager_id[0] : params.id,
					title: position.fields['Concatenate Title']
						? position.fields['Concatenate Title']
						: 'N/A',
					photoURL: position.fields['Photo (from Person)']
						? position.fields['Photo (from Person)'][0].url
						: '',
					location: position.fields.locationText || '',
					biography: position.fields['Biography (from Person)']
						? position.fields['Biography (from Person)'][0]
						: ''
				}
			])
	];

	return {
		user: locals.user,
		title: (await selectedCompany.fields.Company) + ' | Distribution View' || title,
		company: await selectedCompany.fields,
		positions: await positions,
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
