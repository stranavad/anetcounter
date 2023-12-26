import {authorizeUser} from "~/utils/server";
import {db} from "~/drizzle/client";
import {Relationship} from "~/drizzle/schema";
import {eq} from "drizzle-orm";

export default defineEventHandler(async(event) => {
    const relationshipId = Number(getRouterParam(event, 'id'));
    await authorizeUser(event, relationshipId);

    await db.delete(Relationship).where(eq(Relationship.id, relationshipId));
})
