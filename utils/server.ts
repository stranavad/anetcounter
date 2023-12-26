import jwt, {JwtPayload} from 'jsonwebtoken';
import type {H3Event} from "h3";
import type {User} from "@supabase/gotrue-js";
import {db} from "~/drizzle/client";
import {UserRelationship} from "~/drizzle/schema";
import {and, eq} from "drizzle-orm";
export async function getUserFromEventToken(event: H3Event<Request>): Promise<{id: string, metadata: User['user_metadata']}>{
    const {jwtSecret} = useRuntimeConfig();
    const token = await getCookie(event, 'sb-access-token');

    if(!token){
        throw createError({
            statusCode: 403,
            statusMessage: 'Auth is wrong'
        })
    }

    const data = jwt.verify(token, jwtSecret) as JwtPayload;
    return {id: data.sub as string, metadata: data.user_metadata as User['user_metadata']};
}


export async function authorizeUser(event: H3Event<Request>, relationshipId: number){
    const authData = await getUserFromEventToken(event);

    const found = await db.select({id: UserRelationship.id}).from(UserRelationship).where(and(eq(UserRelationship.relationshipId, relationshipId), eq(UserRelationship.userId, authData.id)));
    if(!found.length){
        throw createError({
            statusCode: 403,
            statusMessage: 'Forbidden'
        })
    }
}
