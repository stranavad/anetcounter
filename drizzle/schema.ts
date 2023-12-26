import {date, integer, pgTable, serial, text, timestamp, uniqueIndex, uuid, varchar} from "drizzle-orm/pg-core";
import {relations} from "drizzle-orm";

export const User = pgTable('user', {
    id: uuid('id').primaryKey(),
    name: varchar('name', {length: 255}).notNull(),
    email: varchar('email', {length: 255}).unique(),
    avatarUrl: varchar('avatar_url', {length: 500})
},
(table) => {
    return {
        emailIds: uniqueIndex('email_idx').on(table.email)
    }
});

export const UserRelations = relations(User, ({many}) => ({
    relations: many(UserRelationship)
}))

export const UserRelationship = pgTable('user_relationship', {
    id: serial('id').primaryKey(),
    userId: uuid('userId').references(() => User.id, {onDelete: 'cascade'}).notNull(),
    name: varchar('name', {length: 255}).notNull(),
    avatarUrl: varchar('avatar_url', {length: 500}),
    relationshipId: integer('relationshipId').references(() => Relationship.id, {onDelete: 'cascade'}).notNull(),
    photoUrl: varchar('photo_url', {length: 250})
})

export const UserRelationShipRelations = relations(UserRelationship, ({one}) => ({
    user: one(User, {
        fields: [UserRelationship.userId],
        references: [User.id]
    }),
    relationship: one(Relationship, {
        fields: [UserRelationship.relationshipId],
        references: [Relationship.id]
    })
}))

export const Relationship = pgTable('relationship', {
    id: serial('id').primaryKey(),
    name: varchar('name', {length: 255}),
    since: timestamp('since', {mode: 'string', withTimezone: true, precision: 0}),
    photoUrl: varchar('photo_url', {length: 250})
});

export const RelationshipRelations = relations(Relationship, ({many}) => ({
    users: many(UserRelationship),
    events: many(RelationshipEvent)
}))

export const RelationshipEvent = pgTable('relationship_event', {
    id: serial('id').primaryKey(),
    name: varchar('name', {length: 500}),
    description: text('description'),
    date: timestamp('date', {mode: 'string', withTimezone: true, precision: 0}),
    relationshipId: integer('relationship_id').references(() => Relationship.id, {onDelete: 'cascade'}),
    photoUrl: varchar('photo_url', {length: 250})
})

export const RelationshipEventRelations = relations(RelationshipEvent, ({one}) => ({
    relationship: one(Relationship, {
        fields: [RelationshipEvent.relationshipId],
        references: [Relationship.id]
    })
}))

