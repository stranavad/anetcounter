<script setup lang="ts">
defineProps<{image: string | null}>()
const client = useSupabaseClient();
</script>

<template>
<NuxtImg v-if="image" :src="client.storage.from('anetcounter').getPublicUrl(image).data.publicUrl"/>
</template>
