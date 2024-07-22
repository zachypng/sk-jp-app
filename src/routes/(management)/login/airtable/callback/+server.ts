import { airtable, lucia } from '$lib/server/auth';
import { db } from '$lib/server/db/db';
import { userTable } from '$lib/server/db/schema';
import { type RequestEvent } from '@sveltejs/kit';
import { OAuth2RequestError } from 'arctic';
import { eq } from 'drizzle-orm';
import { generateId } from 'lucia';

export async function GET(event: RequestEvent): Promise<Response> {
	const code = event.url.searchParams.get('code');
	const state = event.url.searchParams.get('state');
	const storedState = event.cookies.get('airtable_oauth_state') ?? null;
	const storedCodeVerifier = event.cookies.get('airtable_oauth_code_verifier') ?? null;

	if (!code || !storedCodeVerifier || !state || !storedState || state !== storedState) {
		return new Response('Invalid state', { status: 400 });
	}

	try {
		const tokens = await airtable.validateAuthorizationCode(code, storedCodeVerifier);
		const airtableUserResponse = await fetch('https://api.airtable.com/v0/meta/whoami', {
			headers: {
				Authorization: `Bearer ${tokens.accessToken}`
			}
		});
		const airtableUser: AirtableUser = await airtableUserResponse.json();

		const existingUser = await db
			.select()
			.from(userTable)
			.where(eq(userTable.airtable_id, airtableUser.id))
			.limit(1);

		if (existingUser.length > 0) {
			const session = await lucia.createSession(existingUser[0].id, {});
			const sessionCookie = lucia.createSessionCookie(session.id);
			event.cookies.set(sessionCookie.name, sessionCookie.value, {
				path: '.',
				...sessionCookie.attributes
			});
		} else {
			const userId = generateId(15);

			await db.insert(userTable).values({
				id: userId,
				airtable_id: airtableUser.id,
				email: airtableUser.email
			});

			const session = await lucia.createSession(userId, {});
			const sessionCookie = lucia.createSessionCookie(session.id);
			event.cookies.set(sessionCookie.name, sessionCookie.value, {
				path: '.',
				...sessionCookie.attributes
			});
		}
		return new Response(null, {
			status: 302,
			headers: {
				Location: '/'
			}
		});
	} catch (e) {
		if (e instanceof OAuth2RequestError) {
			return new Response(JSON.stringify(e), { status: 400 });
		}
		return new Response(null, { status: 500 });
	}
}

interface AirtableUser {
	id: string;
	email?: string;
}
