<script setup lang="ts">
const client = useSupabaseClient();


async function login(){
  await client.auth.signInWithOAuth({provider: 'google', options: {
      redirectTo: `${window.location.origin}/confirm`,
    }})
}
</script>

<template>
  <Card
      class="mt-28"
  >
    <h2 class="text-4xl mb-8">xx counter</h2>
    <p class="text-slate-400">
      Ultimatni cesta lorem ipsumUltimatni cesta lorem ipsumUltimatni cesta lorem ipsum
      Ultimatni cesta lorem ipsumUltimatni cesta lorem ipsumUltimatni cesta lorem ipsumUltimatni cesta lorem ipsum
      Ultimatni cesta lorem ipsumUltimatni cesta lorem ipsumUltimatni cesta lorem ipsum
      Ultimatni cesta lorem ipsumUltimatni cesta lorem ipsum
    </p>
    <UButton
      block
      class="mt-8"
      @click="login()"
    >
      Prihlasit se
    </UButton>
  </Card>
</template>
