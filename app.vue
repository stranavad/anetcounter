<template>
    <div class="max-w-xl mx-auto mt-2 mb-10 px-3">
      <div class="flex justify-between mb-2">
        <NuxtLink class="text-pink-400 text-lg font-semibold cursor-pointer" to="/">Dny štěstí</NuxtLink>
        <AuthUserMenu/>
      </div>
      <NuxtPage/>
      <NuxtPwaManifest/>
    </div>
</template>
<script lang="ts" setup>
useSeoMeta({
  title: "Dny štěstí",
  ogTitle: "Dny štěstí"
})
</script>
<style>
body {
  @apply bg-slate-900;
}
</style>
