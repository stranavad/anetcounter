<script setup lang="ts">
import relativeTime from 'dayjs/plugin/relativeTime';
const dayjs = useDayjs();
dayjs.extend(relativeTime);
const props = defineProps<{since: string}>();

const diff = computed<{days: number, text: string}>(() => {
  const diff = Number(dayjs().diff(dayjs(props.since), 'day'));

  if(diff === 1){
    return {
      days: diff,
      text: 'den'
    }
  }

  if(diff > 1 && diff < 5){
    return {
      days: diff,
      text: 'dny'
    }
  }

  return {
    days: diff,
    text: 'dnů'
  }
})
</script>

<template>
<span class="text-4xl font-bold">{{diff.days}}<span class="text-2xl text-slate-400 ml-2">{{diff.text}}</span></span>
</template>
