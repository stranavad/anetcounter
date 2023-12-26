<template>
    <div class="max-w-xl mx-auto mt-2 px-3">
      <div class="flex justify-between mb-2">
        <NuxtLink class="text-pink-400 text-lg font-semibold cursor-pointer" to="/">Couplies.com</NuxtLink>
        <AuthUserMenu/>
      </div>
      <NuxtPage/>
      <NuxtPwaManifest/>
    </div>
</template>
<script lang="ts" setup>
const client = useSupabaseClient();

async function login(){
  await client.auth.signInWithOAuth({provider: 'google', options: {
      redirectTo: `${window.location.origin}/login`,
    }})
}
</script>
<style>
body {
  @apply bg-slate-900;
}
</style>
