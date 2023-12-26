import {db} from "~/drizzle/client";
import {asc, eq, inArray} from "drizzle-orm";
import {getUserFromEventToken} from "~/utils/server";
import {Relationship, UserRelationship} from "~/drizzle/schema";
import {RelationshipType} from "~/types";

export default defineEventHandler(async(event): Promise<RelationshipType[]> => {
    const authData = await getUserFromEventToken(event);
    const userId = authData.id;

    const relationships = await db.select({id: UserRelationship.relationshipId}).from(UserRelationship).where(eq(UserRelationship.userId, userId));
    // @ts-ignore
    const relationshipsIds = relationships.map(({id}) => id) as number[]

    if(!relationshipsIds.length){
        return [];
    }

    return db.query.Relationship.findMany({
        where: inArray(Relationship.id, relationshipsIds),
        with: {
            users: true
        },
        orderBy: asc(Relationship.since)
    })
})
