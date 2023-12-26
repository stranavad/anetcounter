import {z} from "zod";
import {authorizeUser} from "~/utils/server";
import {db} from "~/drizzle/client";
import {RelationshipEvent} from "~/drizzle/schema";
import {RelationshipEventType} from "~/types";

const CreateEventDto = z.object({
    name: z.string(),
    description: z.string(),
    date: z.string(),
    photoUrl: z.string().optional()
});

export default defineEventHandler(async(event): Promise<RelationshipEventType> => {
    const relationshipId = Number(getRouterParam(event, 'id'));
    await authorizeUser(event, relationshipId);

    const body = await readBody(event);
    const data = CreateEventDto.parse(body);

    return (await db.insert(RelationshipEvent).values({
        name: data.name,
        date: data.date,
        description: data.description,
        relationshipId,
        photoUrl: data.photoUrl
    }).returning())[0];
})

