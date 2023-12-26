<script setup lang="ts">
const props = defineProps<{
  value: Date
}>();
const emit = defineEmits<{(e: 'update:value', data: Date): void}>();
const date = computed({
  get:() => {
    return props.value
  },
  set: (newDate: Date) => {
    emit('update:value', newDate);
  }
})
const dayjs = useDayjs();
const label = computed(() => dayjs(date.value).format('dddd DD. MM. YYYY'))
</script>

<template>
  <UPopover :popper="{ placement: 'bottom-start' }">
    <UButton color="white" icon="i-heroicons-calendar-days-20-solid" :label="label"/>

    <template #panel="{ close }">
      <DatePicker v-model="date" @close="close" />
    </template>
  </UPopover>
</template>
