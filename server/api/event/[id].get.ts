import {authorizeUser} from "~/utils/server";
import {db} from "~/drizzle/client";
import {RelationshipEvent} from "~/drizzle/schema";
import {desc, eq} from "drizzle-orm";
import {RelationshipEventType} from "~/types";

export default defineEventHandler(async(event): Promise<RelationshipEventType[]> => {
    const relationshipId = Number(getRouterParam(event, 'id'));
    await authorizeUser(event, relationshipId);

    return db.select().from(RelationshipEvent).where(eq(RelationshipEvent.relationshipId, relationshipId)).orderBy(desc(RelationshipEvent.date));
})
