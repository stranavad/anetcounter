<template>
  <Card
    class="mt-28"
  >
    <h2 class="text-4xl mb-8">Successfully loged in!</h2>
    <p class="text-slate-400">
      Ultimatni cesta lorem ipsumUltimatni cesta lorem ipsumUltimatni cesta lorem ipsum
      Ultimatni cesta lorem ipsumUltimatni cesta lorem ipsumUltimatni cesta lorem ipsumUltimatni cesta lorem ipsum
      Ultimatni cesta lorem ipsumUltimatni cesta lorem ipsumUltimatni cesta lorem ipsum
      Ultimatni cesta lorem ipsumUltimatni cesta lorem ipsum
    </p>
    <UButton
        block
        class="mt-8"
        @click="navigateTo('/')"
    >
      Pokracovat do aplikace
    </UButton>
  </Card>
</template>
<script lang="ts" setup>
const user = useSupabaseUser();

watch(() => user.value, (newUser) => {
  if(!newUser){
    return;
  }

  setupUser();
}, {immediate: true, deep: true})

function setupUser(){
  $fetch('/api/user/setup').then((res) => {
    console.log(res);
  });
}

</script>
