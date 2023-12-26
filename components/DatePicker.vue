<script setup lang="ts">
import { DatePicker as VCalendarDatePicker } from 'v-calendar'
import 'v-calendar/dist/style.css'

const props = withDefaults(defineProps<{modelValue?: Date}>(), {modelValue: null})

const emit = defineEmits(['update:model-value', 'close'])

const date = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit('update:model-value', value)
    emit('close')
  }
})

const attrs = [{
  key: 'today',
  highlight: {
    color: 'blue',
    fillMode: 'outline',
    class: '!bg-gray-100 dark:!bg-gray-800'
  },
  dates: new Date()
}]
</script>

<template>
  <VCalendarDatePicker
      v-model="date"
      :max-date="$dayjs().toDate()"
      :attributes="attrs"
      :is-dark="true"
      title-position="left"
      trim-weeks
      :first-day-of-week="2"
  />
</template>
