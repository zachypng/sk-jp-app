import { AIRTABLE_PAT } from '$env/static/private';
import { EasyAirtableTable } from 'easy-airtable';
import { differenceInYears, differenceInMonths } from 'date-fns';
import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

const getMonthYear = (date: string) => {
	const dateObj = new Date(date + 'T00:00:00');
	return dateObj.toLocaleDateString('en-US', {
		month: 'long',
		year: 'numeric'
	});
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

export const load: PageServerLoad = async ({ params, locals }) => {
	if (!locals.user) redirect(302, '/login');
	if (locals.user.isBetaEnrolled != 1) redirect(302, '/');
	const title = 'JP Orgchart (Beta)';

	const companyTable = EasyAirtableTable.fromConfig(tableList.Company);
	const company = await companyTable.findOneById(params.id);
	const selectedCompany = company._rawJson;

	const positionTable = EasyAirtableTable.fromConfig(tableList.Position);
	const positionRecords = await positionTable.findAll({
		view: 'viw3yw95f2rQUhQ6M', // Distribution View (All)
		filterByFormula: `{company_id}='${params.id}'`,
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
			'ethnicityText',
			'region_squashed',
			'Rainmaker (from Person)'
		]
	});

	const tbdRecords = await positionTable.findAll({
		// view: 'viw3yw95f2rQUhQ6M', // Distribution View (All)
		filterByFormula: `AND({company_id}='${params.id}', NOT({End Date}=''), {Move}=BLANK())`,
		fields: [
			'position_id',
			'Company',
			'person_name',
			'Corporate Title',
			'Gender (from Person)',
			'Start Date',
			'End Date'
		]
	});

	const tbds = tbdRecords
		.map((record) => record._rawJson)
		.flatMap((position) => [
			{
				id: position.id,
				personName: position.fields.person_name ? position.fields.person_name[0] : 'N/A',
				company: selectedCompany.fields.Company || 'N/A',
				corporateTitle: position.fields['Corporate Title']
					? position.fields['Corporate Title']
					: 'N/A',
				gender: position.fields['Gender (from Person)']
					? position.fields['Gender (from Person)'][0]
					: 'N/A',
				prevStartDate: position.fields['Start Date'] ? position.fields['Start Date'] : 'N/A',
				startDate: position.fields['Start Date']
					? getMonthYear(position.fields['Start Date'])
					: 'N/A',
				prevEndDateRaw: position.fields['End Date'] ? position.fields['End Date'] : 'N/A',
				prevEndDate: position.fields['End Date'] ? position.fields['End Date'] : 'N/A',
				newStartDateRaw: 'N/A',
				endDate: position.fields['End Date'] ? getMonthYear(position.fields['End Date']) : 'N/A',
				tenure:
					position.fields['Start Date'] && position.fields['End Date']
						? getTenure(position.fields['Start Date'], position.fields['End Date'])
						: 'N/A',
				pronoun: position.fields['Gender (from Person)']
					? position.fields['Gender (from Person)'][0] === ''
						? 'Unknown'
						: position.fields['Gender (from Person)'][0] === 'recMQ9KHAFCsRr9pB'
							? 'Male'
							: 'Female'
					: '',
				moveType: 'Departure TBD'
			}
		]);

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
				newStartDateRaw: move.fields['Start Date (from New Position)']
					? move.fields['Start Date (from New Position)'][0]
					: 'N/A',
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
				endDate: move.fields['End Date (from Previous Position)']
					? getMonthYear(move.fields['End Date (from Previous Position)'][0])
					: 'N/A',
				prevEndDateRaw: move.fields['End Date (from Previous Position)']
					? move.fields['End Date (from Previous Position)'][0]
					: 'N/A',
				moveType: move.fields['Company (from New Position)']
					? move.fields['Company (from New Position)'][0] === params.id
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
			logoURL:
				selectedCompany.fields.Logo && selectedCompany.fields.Logo[0]?.type !== 'image/svg+xml'
					? selectedCompany.fields.Logo[0].url
					: '',
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
					parent: position.fields.manager_id ? position.fields.manager_id[0] : params.id,
					title: position.fields['Concatenate Title']
						? position.fields['Concatenate Title']
						: 'N/A',
					photoURL: position.fields['Photo (from Person)']
						? position.fields['Photo (from Person)'][0].url
						: '',
					location: position.fields.locationText || '',
					region: position.fields.region_squashed ? position.fields.region_squashed[0] : '',
					biography: position.fields['Biography (from Person)']
						? position.fields['Biography (from Person)'][0]
						: '',
					rainmaker: position.fields['Rainmaker (from Person)']
						? position.fields['Rainmaker (from Person)'][0] === 'Yes'
							? true
							: false
						: false,
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

	const isValidMove = (move: (typeof moves)[0]) => {
		return (
			move.personName !== 'N/A' &&
			move.newCompany !== 'N/A' &&
			move.prevCompany !== 'N/A' &&
			move.newStartDateRaw !== 'N/A' &&
			move.prevEndDateRaw !== 'N/A'
		);
	};

	const isValidTbd = (tbd: (typeof tbds)[0]) => {
		return tbd.personName !== 'N/A' && tbd.company !== 'N/A' && tbd.prevEndDateRaw !== 'N/A';
	};

	const filteredMoves = moves.filter((move) => !move.isKeyMove && isValidMove(move));
	const filteredTbds = tbds.filter(isValidTbd);
	const mergedMoves = [...filteredMoves, ...filteredTbds].sort((a, b) => {
		const dateA = a.moveType === 'Hire' ? a.newStartDateRaw : a.prevEndDateRaw;
		const dateB = b.moveType === 'Hire' ? b.newStartDateRaw : b.prevEndDateRaw;
		return dateB.localeCompare(dateA);
	});

	return {
		user: locals.user,
		title: (await selectedCompany.fields.Company) + ' | Distribution View' || title,
		company: await selectedCompany.fields,
		positions: positions,
		moves: {
			keyHires:
				moves
					.filter((move) => {
						const isKeyHire = move.moveType === 'Hire' && move.isKeyMove;
						const isRecent =
							move.newStartDateRaw !== 'N/A' &&
							differenceInYears(new Date(), new Date(move.newStartDateRaw)) <= 5;
						return isKeyHire && isRecent;
					})
					.sort((a, b) => b.newStartDateRaw.localeCompare(a.newStartDateRaw)) || undefined,
			keyDepartures:
				moves
					.filter((move) => {
						const isKeyDeparture = move.moveType === 'Departure' && move.isKeyMove;
						const isRecent =
							move.prevEndDateRaw !== 'N/A' &&
							differenceInYears(new Date(), new Date(move.prevEndDateRaw)) <= 5;
						return isKeyDeparture && isRecent;
					})
					.sort((a, b) => b.prevEndDateRaw.localeCompare(a.prevEndDateRaw)) || undefined,
			general: mergedMoves || undefined
		},
		tbds: filteredTbds.sort((a, b) => b.prevEndDateRaw.localeCompare(a.prevEndDateRaw)) || undefined
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
