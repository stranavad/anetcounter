<script setup lang="ts">
import {z} from "zod";
import type {FormSubmitEvent} from "#ui/types";
import DateInput from "~/components/DateInput.vue";
const client = useSupabaseClient();
const emit = defineEmits<{(e: 'refresh'): void}>();

const open = ref(false);
const loading = ref(false);
const uploader = ref<HTMLInputElement>()
const file = ref<null | File>(null);

/* FILE HANDLING */
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
/* END */

const state = reactive<Schema>({
  name: '',
  email: '',
  since: new Date()
})

const schema = z.object({
  name: z.string().max(50, 'Jméno nesmí obsahovat více než 50 znaků'),
  email: z.string().email('Email není platný'),
  since: z.date()
})

type Schema = z.output<typeof schema>
async function onSubmit(event: FormSubmitEvent<Schema>){
  loading.value = true;
  const eventData = event.data;
  if(file.value){
    const fileSplit = file.value!.name.split('.');
    const end = fileSplit[fileSplit.length - 1]
    const timestamp = Date.now()
    const filename = `relationship:${timestamp}.${end}`
    const {data, error} = await client.storage.from('anetcounter').upload(filename, file.value!);

    if(error){
      console.error(error)
    } else if (data) {
      eventData.photoUrl = data.path
    }
  }

  await $fetch('/api/relationship/create', {
    method: 'POST',
    body: event.data
  })

  loading.value = false;
  open.value = false

  emit('refresh');
}
</script>
<template>
<UButton
  v-if="!open"
  block
  color="white"
  @click="open = !open"
>
  Nový vztah
</UButton>
<UCard
  v-if="open"
>
  <input
      ref="uploader"
      type="file"
      class="hidden"
      @change="onFileChanged($event)"
  />
  <span class="text-xl">Nový vztah</span>
  <UForm
      class="flex flex-col gap-4 mt-4"
      :schema="schema"
      :state="state"
      @submit="onSubmit"
  >
    <UFormGroup label="Název vztahu" name="name" required>
      <UInput v-model="state.name" :disabled="loading"/>
    </UFormGroup>
    <UFormGroup label="Email partnera" name="email" required>
      <UInput v-model="state.email" :loading="loading"/>
    </UFormGroup>
    <UButton :loading="loading" color="white" @click="triggerFileUpload()">
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
    <div class="flex mt-4 justify-between">
      <UButton :loading="loading"  variant="outline" @click="open = false">
        Zavřít
      </UButton>
      <UButton :loading="loading"  type="submit">
        Vytvořit
      </UButton>
    </div>
  </UForm>
</UCard>
</template>
