<template>
  <UCard
    class="mt-28"
  >
    <h2 class="text-4xl mb-8">Úspěšně přihlášen!</h2>
    <p class="text-slate-400">
      Vítejte v 'Dny štěstí'! Tady začíná cesta plná lásky a vzpomínek. Přidejte si významné okamžiky, sdílejte fotografie a sledujte, jak roste váš společný příběh. Pusťte se do toho a tvořte vzpomínky, které trvají věčně!
    </p>
    <UButton
        block
        class="mt-8"
        @click="navigateTo('/')"
    >
      Pokračovat do aplikace
    </UButton>
  </UCard>
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
