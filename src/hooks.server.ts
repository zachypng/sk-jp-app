import { dev } from '$app/environment';
import { lucia } from '$lib/server/auth';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	if (dev) {


		event.locals.user = {
			id: 'dev_user',
			airtableId: 'usr8CvL9Iv46kgJfh',
			email: 'placeholder@example.com',
			isAdmin: 1,
			isBetaEnrolled: 1,
			nickname: 'dev',
			name: 'dev'
		}
		event.locals.session = {
			id: 'dev_session',
			userId: 'dev_user',
			expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24 hours
			fresh: true
		}

		return resolve(event)
	}

	const sessionId = event.cookies.get(lucia.sessionCookieName);
	if (!sessionId) {
		event.locals.user = null;
		event.locals.session = null;
		return resolve(event);
	}

	const { session, user } = await lucia.validateSession(sessionId);
	if (session && session.fresh) {
		const sessionCookie = lucia.createSessionCookie(session.id);
		// sveltekit types deviates from the de-facto standard
		// you can use 'as any' too
		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes
		});
	}
	if (!session) {
		const sessionCookie = lucia.createBlankSessionCookie();
		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes
		});
	}
	event.locals.user = user;
	event.locals.session = session;
	return resolve(event);
};
