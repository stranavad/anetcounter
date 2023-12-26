export default defineNuxtRouteMiddleware(async (to) => {
    const user = useSupabaseUser();

    if(!user.value){
        return navigateTo('/login');
    }

    const relationshipId = Number(to.params.id);

    if(isNaN(relationshipId) || !relationshipId){
        return navigateTo('/');
    }

    // Check relationship presence
    const check = await $fetch<boolean>('/api/relationship/check', {
        method: 'POST',
        body: {
            userId: user.value?.id,
            relationshipId: relationshipId
        }
    });

    if(!check){
        return navigateTo('/');
    }
})
