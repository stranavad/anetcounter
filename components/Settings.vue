<script setup lang="ts">
import {z} from "zod";
import type {RelationshipType, UpdateRelationship} from "~/types";
import DateInput from "~/components/DateInput.vue";
import type {FormSubmitEvent} from "#ui/types";
const client = useSupabaseClient();
const dayjs = useDayjs();

const loading = ref(false);
const props = defineProps<{relationship: RelationshipType}>();
const emit = defineEmits<{(e: 'refresh'): void, (e: 'delete'): void}>();

const state = reactive({
  name: props.relationship.name,
  partner0: props.relationship.users[0].name,
  partner1: props.relationship.users[1].name,
  since: dayjs(props.relationship.since).toDate()
})

watch(() => props.relationship, (newRelationship: RelationshipType) => {
  state.name = newRelationship.name;
  state.since = newRelationship.since;
  state.partner0 = newRelationship.users[0].name
  state.partner1 = newRelationship.users[1].name
})

/* FILE UPLOAD */
const uploader = ref<HTMLInputElement>()
const file = ref<null | File>(null);

function onFileChanged(event){
  if (!event || !uploader.value) {
    return;
  }

  const newFile = event.target.files ? event.target.files[0] : null;

  if (!newFile) {
    file.value = null;
    return;
  }

  file.value = newFile;

  uploader.value.value = '';
}

function triggerFileUpload(){
  uploader.value?.click();
}
/* FILE UPLOAD END */

const schema = z.object({
  name: z.string().max(50, 'Jmeno nesmi obsahovat vice nez 50 znaku'),
  partner0: z.string(),
  partner1: z.string(),
  since: z.date(),
})

type Schema = z.output<typeof schema>;

async function onSubmit(event: FormSubmitEvent<Schema>){
  loading.value = true;
  const {name, partner0, partner1, since} = event.data;
  const data = {
    name,
    since,
    photoUrl: props.relationship.photoUrl,
    partner0: {
      id: props.relationship.users[0].id,
      name: partner0
    },
    partner1: {
      id: props.relationship.users[1].id,
      name: partner1
    },
  }

  if(file.value){
    const fileSplit = file.value!.name.split('.');
    const end = fileSplit[fileSplit.length - 1]
    const timestamp = Date.now()
    const filename = `${props.relationship.id}:${timestamp}.${end}`
    const {data: uploadData, error} = await client.storage.from('anetcounter').upload(filename, file.value!);

    if(error){
      console.error(error)
    } else if(uploadData) {
      data.photoUrl = uploadData.path
    }
  }

  await $fetch(`/api/relationship/${props.relationship.id}`, {
    method: 'PUT',
    body: data
  });

  loading.value = false;

  emit('refresh');
}
</script>

<template>
<UCard
  class="mt-4"
>
  <input
      ref="uploader"
      type="file"
      class="hidden"
      @change="onFileChanged($event)"
  />
  <UForm
      class="flex flex-col gap-4"
      :schema="schema"
      :state="state"
      @submit="onSubmit"
  >
    <UFormGroup label="Název vztahu" name="name" required>
      <UInput v-model="state.name" :disabled="loading"/>
    </UFormGroup>
    <UFormGroup :label="relationship.users[0].name" name="partner0" required>
      <UInput
          v-model="state.partner0"
          :disabled="loading"
      >
        <template #leading>
          <NuxtImg :src="relationship.users[0].avatarUrl" width="20" height="20" class="rounded-full"/>
        </template>
      </UInput>
    </UFormGroup>
    <UFormGroup :label="relationship.users[1].name" name="partner1" required>
      <UInput
          v-model="state.partner1"
          :disabled="loading"
      >
        <template #leading>
          <NuxtImg :src="relationship.users[1].avatarUrl" width="20" height="20" class="rounded-full"/>
        </template>
      </UInput>
    </UFormGroup>
    <UButton color="white" :disabled="loading" @click="triggerFileUpload()">
        <span v-if="file" class="overflow-hidden text-ellipsis">
          {{file.name}}
        </span>
      <span v-else>
          Nahrát fotku
        </span>
    </UButton>
    <UFormGroup label="Začátek vztahu" required>
      <DateInput class="mt-2" :value="state.since" @update:value="state.since = $event"/>
    </UFormGroup>
    <UButton class="mt-4" block type="submit" :loading="loading">
      Uložit
    </UButton>
    <UButton variant="outline" color="red" block :disabled="loading" @click="emit('delete')">
      Smazat vztah
    </UButton>
  </UForm>
</UCard>
</template>
