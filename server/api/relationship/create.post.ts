import {undefined, z} from "zod";
import {getUserFromEventToken} from "~/utils/server";
import {db} from "~/drizzle/client";
import {Relationship, User, UserRelationship} from "~/drizzle/schema";
import {eq} from "drizzle-orm";

export const CreateRelationshipDto = z.object({
    name: z.string(),
    email: z.string(),
    since: z.string(),
    photoUrl: z.string(),
})

export default defineEventHandler(async(event) => {
    const body = await readBody(event);
    const data = CreateRelationshipDto.parse(body);
    const authData = await getUserFromEventToken(event);

    if(data.email === authData.metadata.email){
        throw createError({
            statusCode: 405,
            statusMessage: 'Cannot create relationship with yourself!'
        })
    }

    // First we've to check whether user with this email exists
    const foundUser: {id: string, name: string, avatarUrl: string}[] = await db.select({id: User.id, name: User.name, avatarUrl: User.avatarUrl}).from(User).where(eq(User.email, data.email));
    if(!foundUser.length){
        throw createError({
            statusCode: 405,
            statusMessage: 'User with this email does not exist yet!',
        })
    }
    // First we create relationship
    const relationship: {id: number}[] = await db.insert(Relationship).values({
        name: data.name,
        since: data.since,
        photoUrl: data.photoUrl
    }).returning({id: Relationship.id})
    const createdRelationshipId = relationship[0].id;
    // Now create 2  members
    const members = await db.insert(UserRelationship).values([
        {
            relationshipId: createdRelationshipId,
            userId: authData.id,
            name: authData.metadata.full_name,
            avatarUrl: authData.metadata.avatar_url
        },
        {
            relationshipId: createdRelationshipId,
            userId: foundUser[0].id,
            name: foundUser[0].name,
            avatarUrl: foundUser[0].avatarUrl
        }
    ]).returning();
    return {...relationship, members};
})
