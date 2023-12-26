<script setup lang="ts">
import {definePageMeta} from "#imports";
import type {RelationshipEventType, RelationshipType} from "~/types";
import type {Ref} from "vue";
import EventCard from "~/components/EventCard.vue";
import SupabaseImage from "~/components/SupabaseImage.vue";

definePageMeta({
  middleware: "relationship"
})
const route = useRoute();
const relationshipId = Number(route.params.id);
const {data, refresh}: {data: Ref<RelationshipType>} = await useFetch(`/api/relationship/${relationshipId}`);
const {data: events, refresh: refreshEvents}: {data: Ref<RelationshipEventType[]>} = await useFetch(`/api/event/${relationshipId}`);


async function deleteRelationship(){
  await $fetch(`/api/relationship/${data.value.id}`, {method: 'DELETE'});
  await navigateTo('/');
}

const tabs = [
  {
    key: 'events',
    label: 'Významné události',
  },
  {
    key: 'settings',
    label: 'Nastavení'
  }
]
</script>
<template>
    <div class="flex justify-between items-center">
      <span class="font-semibold text-2xl">{{data.name}}</span>
      <Days :since="data.since"/>
    </div>
    <SupabaseImage class="mt-4" :image="data.photoUrl"/>
    <UTabs
      class="mt-4"
      :items="tabs"
    >
      <template #item="{item}">
        <Settings v-if="item.key === 'settings'" :relationship="data" @delete="deleteRelationship()" @update="refresh()"/>
        <div v-else class="flex flex-col gap-4 mt-4">
          <CreateOrUpdateEvent :relationship-id="data.id" @refresh="refreshEvents()"/>
          <EventCard v-for="event in events" :key="event.id" :event="event" @refresh="refreshEvents()"/>
        </div>
      </template>
    </UTabs>
</template>
