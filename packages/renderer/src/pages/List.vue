<script setup lang="ts">
import { mdiClose } from '@mdi/js'

import type { WALLHAVEN_MODEL } from '@/api/wallhaven'
import { useFetchWallpapers } from '@/hooks/fetch/useFetchWallpapers'
const page = ref(1)
const modelState = reactive({
  visiable: false,
  data: {} as WALLHAVEN_MODEL,
})
const { wallpapers, meta, loading } = useFetchWallpapers(page)
function open(wallpaper: WALLHAVEN_MODEL) {
  modelState.visiable = true
  modelState.data = wallpaper
}
</script>
<template>
  <section class="mt-16 mx-4">
    <h1 class="text-h3">wallhaven</h1>
    <v-progress-linear v-show="loading" indeterminate color="primary" rounded height="2"></v-progress-linear>
    <transition name="slide-fade-y">
      <div v-show="!loading">
        <card-row>
          <wallpaper-thumb
            v-for="wallpaper in wallpapers"
            :key="wallpaper.id"
            :wallpaper="wallpaper"
            @open="open(wallpaper)"
          >
          </wallpaper-thumb>
        </card-row>
      </div>
    </transition>
    <v-dialog v-model="modelState.visiable" fullscreen>
      <v-card>
        <v-img :src="modelState.data.path">
          <v-btn icon class="float-right ma-4" variant="text" @click="modelState.visiable = false">
            <v-icon>{{ mdiClose }}</v-icon>
          </v-btn>
        </v-img>
      </v-card>
    </v-dialog>
  </section>
</template>
