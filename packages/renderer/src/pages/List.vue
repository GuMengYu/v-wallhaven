<script setup lang="ts">
import { mdiClose } from '@mdi/js'

import type { WALLHAVEN_MODEL } from '@/api/wallhaven'
import { useFetchWallpapers } from '@/hooks/fetch/useFetchWallpapers'
const page = ref(1)
const el = ref<HTMLElement | null>(null)
const wallpapers = ref<WALLHAVEN_MODEL[]>([])
const modelState = reactive({
  visiable: false,
  data: {} as WALLHAVEN_MODEL,
})
const { wallpapers: newData, meta, loading, error } = useFetchWallpapers(page)

function open(wallpaper: WALLHAVEN_MODEL) {
  modelState.visiable = true
  modelState.data = wallpaper
}

useInfiniteScroll(
  el,
  () => {
    // load more
    console.log('load more')
    page.value++
  },
  { distance: 40 }
)
watchEffect(() => {
  wallpapers.value.push(...newData.value)
})
</script>
<template>
  <section>
    <div ref="el" class="overflow-y-auto h-screen pa-4">
      <card-row>
        <wallpaper-thumb
          v-for="wallpaper in wallpapers"
          :key="wallpaper.id"
          :wallpaper="wallpaper"
          @open="open(wallpaper)"
        >
        </wallpaper-thumb>
      </card-row>
      <v-progress-linear v-show="loading" indeterminate color="primary" rounded height="1"></v-progress-linear>
    </div>
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
