<script setup lang="ts">
const user = useSupabaseUser();
const client = useSupabaseClient();
</script>

<template>
  <UPopover
    v-if="user"
  >
    <div
      class="ml-auto flex items-center"
    >
      <span class="mr-2 text-sm text-slate-300 font-semibold">{{user.user_metadata.full_name}}</span>
      <NuxtImg width="25" class="rounded-full" :src="user.user_metadata!.avatar_url"/>
    </div>
    <template #panel>
      <div class="bg-slate-900 p-2">
        <UButton  color="white" variant="solid" size="xs" @click="client.auth.signOut()">Odhlasit se</UButton>
      </div>
    </template>
  </UPopover>
</template>
