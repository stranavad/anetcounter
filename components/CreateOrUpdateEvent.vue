<script setup lang="ts">
import {z} from "zod";
import DateInput from "~/components/DateInput.vue";
import type {FormSubmitEvent} from "#ui/types";

const client = useSupabaseClient();
const props = defineProps<{relationshipId: number}>();
const emit = defineEmits<{(e: 'refresh'): void}>();

const loading = ref(false);
const open = ref(false);

const schema = z.object({
  name: z.string().max(255, 'Jméno nesmí obsahovat více než 255 znaků').min(2, 'Jméno musí mít minimálně 2 znaky'),
  date: z.date(),
  description: z.string(),
})

type Schema = z.output<typeof schema>

const state = reactive<Schema>({
  name: '',
  description: '',
  date: new Date(),
})

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

async function onSubmit(event: FormSubmitEvent<Schema>){
  loading.value = true;

  const eventData = event.data;
  if(file.value){
    const fileSplit = file.value!.name.split('.');
    const end = fileSplit[fileSplit.length - 1]
    const timestamp = Date.now()
    const filename = `${props.relationshipId}:${timestamp}.${end}`
    const {data, error} = await client.storage.from('anetcounter').upload(filename, file.value!);

    if(error){
      console.error(error)
    } else if(data) {
      eventData.photoUrl = data.path
    }
  }

  await $fetch(`/api/event/${props.relationshipId}`, {
    method: 'POST',
    body: event.data
  })

  loading.value = false;
  open.value = false;

  emit('refresh');
}
</script>

<template>
  <UButton
    v-if="!open"
    block
    color="white"
    @click="open = true"
  >
    Přidat událost
  </UButton>
  <UCard
    v-if="open"
  >
    <span class="text-xl">Nová událost</span>
    <input
      ref="uploader"
      type="file"
      class="hidden"
      @change="onFileChanged($event)"
    />
    <UForm
        class="mt-4 flex flex-col gap-4"
        :schema="schema"
        :state="state"
        @submit="onSubmit"
    >
      <UFormGroup label="Název Události" name="name" required>
        <UInput v-model="state.name" :disabled="loading"/>
      </UFormGroup>
      <UFormGroup label="Popis události" name="description">
        <UTextarea v-model="state.description" :disabled="loading"/>
      </UFormGroup>
      <UButton color="white" :disabled="loading" @click="triggerFileUpload()">
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
        <UButton :loading="loading"  variant="outline" @click="open = false">
          Zavřít
        </UButton>
        <UButton  type="submit" :loading="loading">
          Vytvořit
        </UButton>
      </div>
    </UForm>
  </UCard>
</template>
