<script setup lang="ts">
import type {RelationshipType} from "~/types";
import type {Ref} from "vue";

const {data, refresh}: {data: Ref<RelationshipType[]>} = await useFetch<RelationshipType[]>('/api/relationship/my')

</script>

<template>
  <div class="flex flex-col gap-4 mt-4">
    <NuxtLink
      v-for="relationship in data"
      :key="relationship.id"
      :to="`/${relationship.id}`"
      prefetch
    >
      <UCard>
        <div class="flex flex-col items-center justify-center">
          <span class="text-3xl font-semibold mb-8 text-center">{{relationship.name}}</span>
          <Days :since="relationship.since"/>
          <span class="text-sm text-slate-300">{{$dayjs(relationship.since).format('DD. MM. YYYY')}}</span>
        </div>
        <div class="flex items-center justify-between mt-8">
          <div class="flex items-center">
            <NuxtImg width="25" height="25" class="rounded-full mr-2" :src="relationship.users[0].avatarUrl"/>
            <span>{{relationship.users[0].name}}</span>
          </div>
          <UIcon name="i-heroicons-heart" class="text-pink-500 w-6 h-6"/>
          <div class="flex items-center">
            <span>{{relationship.users[1].name}}</span>
            <NuxtImg width="25" height="25" class="rounded-full ml-2" :src="relationship.users[1].avatarUrl"/>
          </div>
        </div>
      </UCard>
    </NuxtLink>
    <CreateRelationshipForm @refresh="refresh()"/>
  </div>
</template>
