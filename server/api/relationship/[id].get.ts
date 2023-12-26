import {getUserFromEventToken} from "~/utils/server";
import {db} from "~/drizzle/client";
import {eq} from "drizzle-orm";
import {Relationship} from "~/drizzle/schema";

export default defineEventHandler(async(event) => {
    const id = Number(getRouterParam(event, 'id'));

    if(!id || isNaN(id)){
        throw createError({
            statusCode: 405,
            statusMessage: "Invalid relationship ID"
        })
    }

    const authData = await getUserFromEventToken(event);
    const relationship = await db.query.Relationship.findFirst({
        where: eq(Relationship.id, id),
        with: {
            users: true
        }
    });

    if(!relationship){
        throw createError({
            statusCode: 404,
            statusMessage: "This relationship doesn't exist"
        })
    }

    // Check for members
    const memberIds = relationship.users.map(({userId}) => userId) as string[];
    if(memberIds.includes(authData.id)){
        return relationship
    }

    throw createError({
        statusCode: 403,
        statusMessage: 'Forbidden',
    })
})
