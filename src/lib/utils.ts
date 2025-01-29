import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { cubicOut } from 'svelte/easing';
import type { TransitionConfig } from 'svelte/transition';
import { get } from 'svelte/store';
import type { User } from 'lucia';
import { inputConfig, type ATMove, type InputConfig } from './config';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

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

export function generateFormURL(form: keyof InputConfig, user: User) {
	const ref = get(inputConfig);
	let params: string[] = [];
	Object.entries(ref[form].fields).forEach(([key, value]) => {
		params.push(`${key}=${value}`);
	});

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
		return `<span class="font-bold">${move.personName}</span> joined <span class="underline">${move.newCompany}</span> in ${move.newStartDate} as ${
			move.newConcatTitle
		}. ${move.pronoun} joined from <span class="underline">${
			move.prevCompany
		}</span> where ${move.pronoun?.toLowerCase()} worked as ${
			move.isKeyMove ? move.prevConcatTitle : move.prevCorporateTitle
		} for ${move.prevTenure}.`;
	} else if (move.moveType === 'Departure') {
		return `<span class="font-bold">${move.personName}</span>, ${move.prevConcatTitle}, departed from <span class="underline'>${move.prevCompany}</span> in ${
			move.prevEndDate
		}. ${move.pronoun} joins <span class="underline">${move.newCompany}</span> as ${
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
