import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { cubicOut } from 'svelte/easing';
import type { TransitionConfig } from 'svelte/transition';
import { get, writable } from 'svelte/store';
import { getQuarter } from 'date-fns';
import type { User } from 'lucia';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

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

type FlyAndScaleParams = {
	y?: number;
	x?: number;
	start?: number;
	duration?: number;
};

export const flyAndScale = (
	node: Element,
	params: FlyAndScaleParams = { y: -8, x: 0, start: 0.95, duration: 150 }
): TransitionConfig => {
	const style = getComputedStyle(node);
	const transform = style.transform === 'none' ? '' : style.transform;

	const scaleConversion = (valueA: number, scaleA: [number, number], scaleB: [number, number]) => {
		const [minA, maxA] = scaleA;
		const [minB, maxB] = scaleB;

		const percentage = (valueA - minA) / (maxA - minA);
		const valueB = percentage * (maxB - minB) + minB;

		return valueB;
	};

	const styleToString = (style: Record<string, number | string | undefined>): string => {
		return Object.keys(style).reduce((str, key) => {
			if (style[key] === undefined) return str;
			return str + `${key}:${style[key]};`;
		}, '');
	};

	return {
		duration: params.duration ?? 200,
		delay: 0,
		css: (t) => {
			const y = scaleConversion(t, [0, 1], [params.y ?? 5, 0]);
			const x = scaleConversion(t, [0, 1], [params.x ?? 0, 0]);
			const scale = scaleConversion(t, [0, 1], [params.start ?? 0.95, 1]);

			return styleToString({
				transform: `${transform} translate3d(${x}px, ${y}px, 0) scale(${scale})`,
				opacity: t
			});
		},
		easing: cubicOut
	};
};

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
	activeSelection: ''
});

interface InputConfig {
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
		};
	};
	move: {
		url: string;
		fields: {
			'Move Type'?: string;
			'Move by Year'?: string;
			'Move by Quarter'?: string;
			'Individual Move Type (relates to position at new Company)'?: string;
		};
	};
}

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
			'Move Type': 'Outside Move',
			'Move by Year': new Date().getFullYear().toString(),
			'Move by Quarter': 'Q' + getQuarter(new Date()).toString()
		}
	}
});

export function generateFormURL(form: keyof InputConfig, user: User) {
	const ref = get(inputConfig);
	let params: string[] = [];
	Object.entries(ref[form].fields).forEach(([key, value]) => {
		params.push(`${key}=${value}`);
	});

	// console.log(encodeURIComponent(params.join('&prefill_')));
	const prefillURL = `${ref[form].url}?prefill_Jensen%20Analyst=${
		user.name
	}&prefill_${encodeURIComponent(params.join('&prefill_'))
		.replace(RegExp('%3D', 'g'), '=')
		.replace(RegExp('%26', 'g'), '&')}
	`;
	return prefillURL;
}

export function paragraphify(move: ATMove) {
	if (move.moveType === 'Hire') {
		return `${move.personName} joined ${move.newCompany} in ${move.newStartDate} as ${
			move.newConcatTitle
		}. ${move.pronoun} joined from ${
			move.prevCompany
		} where ${move.pronoun?.toLowerCase()} worked as ${
			move.isKeyMove ? move.prevConcatTitle : move.prevCorporateTitle
		} for ${move.prevTenure}.`;
	} else if (move.moveType === 'Departure') {
		return `${move.personName}, ${move.prevConcatTitle}, departed from ${move.prevCompany} in ${
			move.prevEndDate
		}. ${move.pronoun} joins ${move.newCompany} as ${
			move.isKeyMove ? move.newConcatTitle : move.newCorporateTitle
		}.`;
	} else {
		return 'hidden';
	}
}

export function slugify(text: string | undefined) {
	if (!text) return '';
	return text
		.toString()
		.toLowerCase()
		.replace(/\s+/g, '-') // Replace spaces with -
		.replace(/[^\w\-]+/g, '') // Remove all non-word chars
		.replace(/\-\-+/g, '-') // Replace multiple - with single -
		.replace(/^-+/, '') // Trim - from start of text
		.replace(/-+$/, ''); // Trim - from end of text
}
