import {getUserFromEventToken} from "~/utils/server";
import {db} from "~/drizzle/client";
import {Relationship, UserRelationship} from "~/drizzle/schema";
import {and, eq} from "drizzle-orm";
import {z} from "zod";

const UpdateRelationshipDto = z.object({
    name: z.string(),
    since: z.string(),
    photoUrl: z.string().optional(),
    partner0: z.object({
        id: z.number(),
        name: z.string()
    }),
    partner1: z.object({
        id: z.number(),
        name: z.string()
    })
})

export default defineEventHandler(async(event) => {
    const id = Number(getRouterParam(event, 'id'));

    if(!id || isNaN(id)){
        throw createError({
            statusCode: 405,
            statusMessage: 'Invalid relationship ID'
        })
    }

    const authData = await getUserFromEventToken(event);
    const res = await db.select().from(UserRelationship).where(and(eq(UserRelationship.relationshipId, id), eq(UserRelationship.userId, authData.id)));

    if(!res.length){
        throw createError({
            statusCode: 403,
            statusMessage: 'Forbidden'
        })
    }

    const body = await readBody(event);
    const data = UpdateRelationshipDto.parse(body);

    await Promise.all(
        [
            await db.update(Relationship).set({name: data.name, since: data.since, photoUrl: data.photoUrl}).where(eq(Relationship.id, id)),
            await db.update(UserRelationship).set({name: data.partner0.name}).where(and(eq(UserRelationship.relationshipId, id), eq(UserRelationship.id, data.partner0.id))),
            await db.update(UserRelationship).set({name: data.partner1.name}).where(and(eq(UserRelationship.relationshipId, id), eq(UserRelationship.id, data.partner1.id)))
        ]
    )

    return db.query.Relationship.findFirst({
        where: eq(Relationship.id, id),
        with: {
            users: true
        }
    })
})
