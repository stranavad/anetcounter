import {getUserFromEventToken} from "~/utils/server";
import {db} from '~/drizzle/client';
import {User} from "~/drizzle/schema";

export default defineEventHandler(async(event) => {
    const authData = await getUserFromEventToken(event);
    const userId = authData.id;
    const {full_name: name, avatar_url: avatarUrl, email}: {full_name: string, avatar_url: string, email: string} = authData.metadata;
    return db.insert(User).values({id: userId, name, avatarUrl, email}).onConflictDoUpdate({target: User.id, set: { name, avatarUrl}}).returning();
})
