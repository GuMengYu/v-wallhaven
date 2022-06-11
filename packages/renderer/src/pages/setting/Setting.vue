<template>
  <section class="pt-16 px-6">
    <h6 class="text-h5 mb-4">setting</h6>
    <app-settings-theme />

    <v-divider class="mt-4 mb-3 mx-n3" />

    <app-settings-other />
    <pic-source />
    <v-btn color="primary" @click="resetApp"> reset app </v-btn>
    <v-btn color="primary" @click="back"> 返回 </v-btn>
  </section>
</template>

<script setup lang="ts">
import AppSettingsOther from './components/Other.vue'
import PicSource from './components/PicSource.vue'
import AppSettingsTheme from './components/Theme.vue'

function resetApp() {
  window.localStorage.clear()
  window.location.reload()
}
function back() {
  history.back()
}
</script>
