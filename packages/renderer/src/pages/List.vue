<script setup lang="ts">
import type { WALLHAVEN_MODEL } from '@/api/wallhaven'
import { useFetchWallpapers } from '@/hooks/fetch/useFetchWallpapers'

import ImageViewer from './components/imageViewer.vue'
const page = ref(1)
const el = ref<HTMLElement | null>(null)
const wallpapers = ref<WALLHAVEN_MODEL[]>([])
const modelState = reactive({
  visiable: false,
  data: {} as WALLHAVEN_MODEL,
})
const { wallpapers: newData, meta, loading, reset } = useFetchWallpapers(page)
function open(wallpaper: WALLHAVEN_MODEL) {
  modelState.visiable = true
  modelState.data = wallpaper
}

useInfiniteScroll(
  el,
  () => {
    // load more
    console.log('load more')
    if (meta.value?.current_page < meta.value?.last_page) {
      page.value++
    }
  },
  { distance: 40 }
)
watchEffect(() => {
  if (reset.value) {
    wallpapers.value = []
    wallpapers.value.push(...newData.value)
  } else {
    wallpapers.value.push(...newData.value)
  }
})
function handleViewerClose() {
  modelState.visiable = false
}
</script>
<template>
  <section>
    <div ref="el" class="overflow-y-auto h-screen pa-4 pt-16">
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
    <image-viewer :data="modelState.data" :open="modelState.visiable" @close="handleViewerClose" />
  </section>
</template>
