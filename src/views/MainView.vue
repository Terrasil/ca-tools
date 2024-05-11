<template>
  <div class="card flex justify-content-center">
    <div class="flex flex-column gap-2">
      <label for="username">Username</label>
      <InputText id="username" v-model="value" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import InputText from 'primevue/inputtext'

const value = ref(null)
</script>
