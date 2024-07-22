import { redirect, type RequestEvent } from '@sveltejs/kit';
import { generateState, generateCodeVerifier } from 'arctic';
import { airtable } from '$lib/server/auth';
import { dev } from '$app/environment';

export async function GET(event: RequestEvent): Promise<Response> {
	const state = generateState();
	const codeVerifier = generateCodeVerifier();
	const url = await airtable.createAuthorizationURL(state, codeVerifier);

	event.cookies.set('airtable_oauth_state', state, {
		path: '/',
		secure: !dev,
		httpOnly: true,
		maxAge: 60 * 10,
		sameSite: 'lax'
	});

	event.cookies.set('airtable_oauth_code_verifier', codeVerifier, {
		path: '/',
		secure: !dev,
		httpOnly: true,
		maxAge: 60 * 10,
		sameSite: 'lax'
	});

	redirect(302, url.toString());
}
