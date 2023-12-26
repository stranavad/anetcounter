<script setup lang="ts">
const client = useSupabaseClient();
async function login(){
  await client.auth.signInWithOAuth({provider: 'google', options: {
      redirectTo: `${window.location.origin}/confirm`,
    }})
}
</script>

<template>
  <UCard
      class="mt-28"
  >
    <h2 class="text-4xl mb-8">Dny štěstí</h2>
    <p class="text-slate-400">
     'Dny štěstí' proměňuje každý den ve vztahu v dobrodružství. Počítejte společné chvíle, sdílejte fotky a zaznamenávejte milníky lásky. Intuitivní, zábavná a plná lásky!
    </p>
    <UButton
        block
        class="mt-8"
        @click="login()"
    >
      Přihlásit se
    </UButton>
  </UCard>
</template>
