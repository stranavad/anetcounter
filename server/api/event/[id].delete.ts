import {db} from "~/drizzle/client";
import {RelationshipEvent} from "~/drizzle/schema";
import {eq} from "drizzle-orm";
import {authorizeUser} from "~/utils/server";

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

    await db.delete(RelationshipEvent).where(eq(RelationshipEvent.id, eventId));
})
