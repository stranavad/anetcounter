<script setup lang="ts">
import type {RelationshipEventType} from "~/types";
import {z} from "zod";
import type {FormSubmitEvent} from "#ui/types";
import DateInput from "~/components/DateInput.vue";
const client = useSupabaseClient();
const props = defineProps<{event: RelationshipEventType}>();
const emit = defineEmits<{(e: 'refresh'): void}>();

const editMode = ref(false);
const file = ref<File | null>(null);
const uploader = ref<HTMLInputElement>();

const schema = z.object({
  name: z.string().max(255, 'Jmeno nesmi obsahovat vice nez 255 znaku').min(2, 'Jmeno musi mit minimalne 2 znaky'),
  date: z.date(),
  description: z.string()
})

type Schema = z.output<typeof schema>
const state = reactive<Schema>({
  name: props.event.name,
  description: props.event.description,
  date: new Date(props.event.date)
})

async function onSubmit(event: FormSubmitEvent<Schema>){
  const eventData = event.data;
  if(file.value){
    const fileSplit = file.value!.name.split('.');
    const end = fileSplit[fileSplit.length - 1]
    const timestamp = Date.now()
    const filename = `${props.event.relationshipId}:${timestamp}.${end}`
    const {data, error} = await client.storage.from('anetcounter').upload(filename, file.value!);

    if(error){
      eventData.photoUrl = props.event.photoUrl
      console.error(error)
    } else if(data) {
      eventData.photoUrl = data.path
    }
  } else {
    eventData.photoUrl = props.event.photoUrl
  }

  await $fetch(`/api/event/${props.event.id}`, {
    method: 'PUT',
    body: event.data
  })

  editMode.value = false;

  emit('refresh');
}

async function deleteEvent(){
  await $fetch(`/api/event/${props.event.id}`, {method: 'DELETE'})

  editMode.value = false;

  emit('refresh');
}

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
</script>

<template>
<UCard
  v-if="!editMode"
  @click.native="editMode = true"
>
  <SupabaseImage :image="event.photoUrl" class="mb-4"/>
  <div class="flex items-center justify-between mb-2">
    <span class="text-xl">{{event.name}}</span>
    <span class="text-xs text-slate-300">{{$dayjs(event.date).format('DD. MM. YYYY')}}</span>
  </div>
  <p class="break-words text-sm text-slate-200">{{event.description}}</p>
</UCard>
<UCard v-else>
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
    <UFormGroup label="Název Události" name="name" required>
      <UInput v-model="state.name"/>
    </UFormGroup>
    <UFormGroup label="Popis události" name="description">
      <UTextarea v-model="state.description"/>
    </UFormGroup>
    <UButton color="white" @click="triggerFileUpload()">
        <span v-if="file" class="overflow-hidden text-ellipsis">
          {{file.name}}
        </span>
      <span v-else>
          Nahrát fotku
        </span>
    </UButton>
    <UFormGroup label="Datum události" required>
      <DateInput class="mt-2" v-model:value="state.date"/>
    </UFormGroup>
    <div class="flex mt-4 justify-between">
      <UButton
          variant="outline"
          color="red"
          @click="deleteEvent"
      >
        Smazat
      </UButton>
      <div class="flex gap-4">
        <UButton  variant="outline" @click="editMode = false">
          Zavřít
        </UButton>
        <UButton  type="submit">
          Uložit
        </UButton>
      </div>
    </div>
  </UForm>
</UCard>
</template>
