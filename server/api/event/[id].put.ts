import {db} from "~/drizzle/client";
import {RelationshipEvent} from "~/drizzle/schema";
import {eq} from "drizzle-orm";
import {z} from "zod";
import {authorizeUser} from "~/utils/server";

const UpdateEventDto = z.object({
    name: z.string(),
    date: z.string(),
    description: z.string(),
    photoUrl: z.string().optional(),
})

export default defineEventHandler(async(event) => {
    const eventId = Number(getRouterParam(event, 'id'));

    if(!eventId || isNaN(eventId)){
        throw createError({
            statusCode: 405,
            statusMessage: 'Invalid event id'
        })
    }
    const found = await db.select({relationshipId: RelationshipEvent.relationshipId}).from(RelationshipEvent).where(eq(RelationshipEvent.id, eventId)).limit(1);
    if(!found.length){
        throw createError({
            statusCode: 404,
            statusMessage: 'Event not found'
        })
    }

    const relationshipId = found[0].relationshipId as number;
    await authorizeUser(event, relationshipId);

    const body = await readBody(event);
    const data = UpdateEventDto.parse(body);

    return (await db.update(RelationshipEvent).set({
        name: data.name,
        date: data.date,
        description: data.description,
        photoUrl: data.photoUrl,
    }).where(eq(RelationshipEvent.id, eventId)))[0];
})
