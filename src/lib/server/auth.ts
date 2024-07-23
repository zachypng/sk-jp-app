import { DrizzleSQLiteAdapter } from '@lucia-auth/adapter-drizzle';
import { db } from './db/db';
import { sessionTable, userTable } from './db/schema';
import { Airtable } from 'arctic';
import {
	AIRTABLE_CLIENT_ID,
	AIRTABLE_CLIENT_SECRET,
	BASE_URL,
	VERCEL_URL
} from '$env/static/private';
import { Lucia } from 'lucia';
import { dev } from '$app/environment';

const adapter = new DrizzleSQLiteAdapter(db, sessionTable, userTable);

export const airtable = new Airtable(
	AIRTABLE_CLIENT_ID,
	AIRTABLE_CLIENT_SECRET,
	!dev ? 'https://' + VERCEL_URL : BASE_URL + '/login/airtable/callback'
);

export const lucia = new Lucia(adapter, {
	sessionCookie: {
		attributes: {
			secure: !dev
		}
	},
	getUserAttributes: (attributes) => {
		return {
			airtableId: attributes.airtable_id,
			email: attributes.email,
			isAdmin: attributes.isAdmin,
			isBetaEnrolled: attributes.isBetaEnrolled,
			name: attributes.name,
			nickname: attributes.nickname
		};
	}
});

declare module 'lucia' {
	interface Register {
		Lucia: typeof lucia;
		DatabaseUserAttributes: DatabaseUserAttributes;
	}
}

interface DatabaseUserAttributes {
	airtable_id: string;
	email?: string;
	isAdmin?: number;
	isBetaEnrolled?: number;
	name?: string;
	nickname?: string;
}
