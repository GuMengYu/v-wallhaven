import { storeToRefs } from 'pinia'
import type { Ref } from 'vue'

import type { WALLHAVEN_MODEL } from '@/api/wallhaven'
import { search } from '@/api/wallhaven'
import { CATGORY, PURITY, SORTING, useWallpaperStore } from '@/store/wallpaper'

export function useFetchWallpapers(page: Ref<number>) {
  const wallpapers = ref<WALLHAVEN_MODEL[]>([])
  const meta = ref<{
    current_page: number
    last_page: number
    per_page: number
    total: number
  }>()
  const loading = ref(false)
  const wallpaperStore = useWallpaperStore()

  const { categories, purity, sorting, order, topRange } = storeToRefs(wallpaperStore)

  const cats = computed(() => {
    return `${categories.value.includes(CATGORY.GENERAL) ? 1 : 0}${categories.value.includes(CATGORY.ANIME) ? 1 : 0}${
      categories.value.includes(CATGORY.PEOPLE) ? 1 : 0
    }`
  })
  const puritys = computed(() => {
    return `${purity.value.includes(PURITY.SFW) ? 1 : 0}${purity.value.includes(PURITY.SKETCHY) ? 1 : 0}${
      purity.value.includes(PURITY.NSFW) ? 1 : 0
    }`
  })
  watchEffect(async () => {
    const params: Record<string, any> = {
      categories: cats.value,
      purity: puritys.value,
      sorting: sorting.value,
      order: order.value,
      page: page.value,
    }
    if (sorting.value === SORTING.TOPLIST) {
      params.topRange = topRange.value
    }
    loading.value = true
    try {
      const { data } = await search(params)
      wallpapers.value = data.data
      meta.value = data.meta
    } catch (e) {
      console.error(e)
    } finally {
      loading.value = false
    }
  })
  return {
    wallpapers,
    meta: meta,
    loading,
  }
}
