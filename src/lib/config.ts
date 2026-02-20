import { getQuarter } from 'date-fns';
import { writable } from 'svelte/store';

export const orgchartConfig = writable({
	showInfo: false,
	showPhotos: false,
	showBios: false,
	allowEdits: false,
	showNodeCount: false,
	lastTab: 'view',
	downloadOpen: false,
	searchOpen: false,
	detail: 'location',
	activeSelection: '',
	colorBy: 'level'
});

export interface InputConfig {
	company: {
		url: string;
		fields: {
			'Fully Mapped'?: string;
			'Firm Type'?: string;
			Currency: string;
		};
	};
	person: {
		url: string;
		fields: {
			Gender?: string;
			Ethnicity?: string;
		};
	};
	position: {
		url: string;
		fields: {
			Department?: string;
			'Write-In Title'?: string;
			Location?: string;
			'Senior / Junior'?: string;
			Note?: string;
			'Start Date'?: string;
		};
	};
	move: {
		url: string;
		fields: {
			'Move Type'?: string;
			'Key Move'?: string;
			'Move by Year'?: string;
			'Move by Quarter'?: string;
			'Individual Move Type (relates to position at new Company)'?: string;
		};
	};
}

// DEFAULT FORM AUTOFILLS
export const inputConfig = writable<InputConfig>({
	company: {
		url: 'https://airtable.com/embed/app6rqTtoNCCajSS1/shrUAOr9Tk1PXWaLE',
		fields: {
			Currency: '$'
		}
	},
	person: {
		url: 'https://airtable.com/embed/app6rqTtoNCCajSS1/shrDNd0cCsFN0KB8D',
		fields: {
			Gender: 'Male',
			Ethnicity: 'Caucasian'
		}
	},
	position: {
		url: 'https://airtable.com/embed/app6rqTtoNCCajSS1/shrDejmZUPXYq5bB0',
		fields: {}
	},
	move: {
		url: 'https://airtable.com/embed/app6rqTtoNCCajSS1/shr20otoaDJph6ZUc',
		fields: {
			'Key Move': 'N',
			'Move Type': 'Outside Move',
			'Move by Year': new Date().getFullYear().toString(),
			'Move by Quarter': 'Q' + getQuarter(new Date()).toString()
		}
	}
});

// AIRTABLE TYPES
export type ATTable = {
	description?: string;
	fields?: Array<string>;
	id: string;
	name?: string;
	primaryFieldId?: string;
	views: Array<{
		id: string;
		name: string;
		type: string;
	}>;
};

export type ATView = {
	id: string;
	name: string;
	type: string;
};

export type ATMove = {
	id?: string;
	personName?: string;
	newStartDate?: string;
	newConcatTitle?: string;
	newCompany?: string;
	newCorporateTitle?: string;
	pronoun?: string;
	prevCompany?: string;
	prevConcatTitle?: string;
	prevCorporateTitle?: string;
	prevTenure?: string;
	prevEndDate?: string;
	moveType?: string;
	isKeyMove?: boolean;
};

export type ATCompany = {
	'Firm Type'?: string[];
	'Focus/Asset Class'?: string[];
	'Data Source'?: string[];
	Company?: string;
	'LinkedIn Page to Company'?: string;
	Views?: string;
	Position?: string[];
	'HQ Location'?: string[];
	'Firm Types'?: string[];
	'Firm Homepage'?: string;
	Logo?: {
		id?: string;
		width?: number;
		height?: number;
		url?: string;
		filename?: string;
		size?: number;
		type?: string;
		thumbnails?: any;
	};
	'Founder(s)'?: string;
	Currency?: string[];
	'Fully Mapped'?: string[];
	Unit?: string[];
	'Key Focus'?: string;
	'Jensen Agent'?: string[];
	company_id?: string;
	'Deck Source'?: string[];
	AUM?: number;
	Inception?: number;
	'Created Time'?: string;
	'Last modified time'?: string;
	'# of linked positions (w/ end date empty)'?: number;
	AUM_Concatenate?: string;
	firmType?: string;
};
