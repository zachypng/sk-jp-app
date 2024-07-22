import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const userTable = sqliteTable('user', {
	id: text('id').notNull().primaryKey(),
	airtable_id: text('airtable_id').notNull(),
	email: text('email'),
	isAdmin: integer('isAdmin', { mode: 'boolean' }),
	isBetaEnrolled: integer('isBetaEnrolled', { mode: 'boolean' }),
	name: text('name'),
	nickname: text('nickname')
});

export const sessionTable = sqliteTable('session', {
	id: text('id').notNull().primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => userTable.id),
	expiresAt: integer('expires_at').notNull()
});
