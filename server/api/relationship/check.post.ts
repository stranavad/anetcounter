import {z} from "zod";
import {getUserFromEventToken} from "~/utils/server";
import {db} from "~/drizzle/client";
import {UserRelationship} from "~/drizzle/schema";
import {and, eq} from "drizzle-orm";

const CheckRelationship = z.object({
    userId: z.string(),
    relationshipId: z.number()
})

export default defineEventHandler(async(event): Promise<boolean> => {
    const body = await readBody(event);
    const data = CheckRelationship.parse(body);

    const found = await db.select({id: UserRelationship.id}).from(UserRelationship).where(and(eq(UserRelationship.userId, data.userId), eq(UserRelationship.relationshipId, data.relationshipId))).limit(1);
    return !!found.length;
})
