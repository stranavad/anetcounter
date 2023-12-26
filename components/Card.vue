<script lang="ts" setup>
defineProps<{title: string}>();
defineSlots<{default: []}>();
</script>
<template>
  <div
      class="border border-slate-800 rounded-lg p-4 bg-slate-950"
  >
    <h2 v-if="title" class="text-3xl mb-8">{{title}}</h2>
    <slot name="default"/>
  </div>
</template>
