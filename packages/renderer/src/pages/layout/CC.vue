<template>
  <v-navigation-drawer
    v-model="app.showControlCenter"
    location="right"
    hide-overlay
    temporary
    width="300"
    floating
    class="bg-surface"
  >
    <v-toolbar dense class="pr-4" color="surface">
      <v-toolbar-title class="text-onSurfaceVariant">{{ $t('common.setting') }}</v-toolbar-title>
      <v-spacer />
      <v-btn icon size="small" @click="app.showControlCenter = false">
        <v-icon size="small"> {{ mdiClose }} </v-icon>
      </v-btn>
    </v-toolbar>
    <v-container class="pa-0">
      <div class="px-4">
        <v-row dense>
          <v-col class="d-flex">
            <switch-card v-model="darkMode" :title="$t('common.dark_theme')" :icon="mdiCircleHalfFull" />
          </v-col>
          <v-col class="d-flex">
            <switch-card :title="$t('common.setting')" :icon="mdiCog" @click="to('setting')" />
          </v-col>
        </v-row>
        <v-row dense class="mt-1">
          <v-col class="d-flex">
            <switch-card
              :title="$t(`common.${inList ? 'gallery' : 'list'}`)"
              :icon="mdiCog"
              @click="to(inList ? 'gallery' : 'list')"
            />
          </v-col>
          <v-col></v-col>
        </v-row>
        <v-divider class="my-2" />
      </div>

      <v-list-item>
        <v-list-item-header class="text-caption">
          {{ $t('common.sorting') }}
        </v-list-item-header>
        <v-list-item-media>
          <Select v-model="sorting" :items="sortingOptions" />
        </v-list-item-media>
      </v-list-item>
      <v-list-item>
        <v-list-item-header class="text-caption"> {{ $t('common.order') }} </v-list-item-header>
        <v-list-item-media>
          <Select v-model="order" :items="orderOptions" />
        </v-list-item-media>
      </v-list-item>
      <v-list-item v-if="sorting === SORTING.TOPLIST">
        <v-list-item-header class="text-caption"> {{ $t('common.top_range') }} </v-list-item-header>
        <v-list-item-media>
          <Select v-model="topRange" :items="topRangeOptions" />
        </v-list-item-media>
      </v-list-item>
      <v-list-item>
        <v-list-item-header class="text-caption"> {{ $t('common.cats') }} </v-list-item-header>
        <v-chip-group v-model="categories" multiple variant="outlined" color="primary">
          <v-chip v-for="cat in categoriesOptions" :key="cat.value" size="small" label :value="cat.value">
            {{ cat.title }}
          </v-chip>
        </v-chip-group>
      </v-list-item>

      <v-list-item>
        <v-list-item-header class="text-caption"> {{ $t('common.purity') }} </v-list-item-header>
        <v-chip-group v-model="purity" multiple variant="outlined" color="primary">
          <v-chip v-for="cat in purityOptions" :key="cat.value" size="small" label :value="cat.value">
            {{ cat.title }}
          </v-chip>
        </v-chip-group>
      </v-list-item>
    </v-container>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { mdiCircleHalfFull, mdiClose, mdiCog, mdiSort } from '@mdi/js'
import { storeToRefs } from 'pinia'
import { useTheme } from 'vuetify'

import useInForeground from '@/hooks/useInForeground'
import { useAppStore } from '@/store/app'
import { APPEARANCE, useSettingStore } from '@/store/setting'
import { CATGORY, ORDER, PURITY, SORTING, TOPRANGE, useWallpaperStore } from '@/store/wallpaper'

const wallpaperStore = useWallpaperStore()
const { categories, purity, sorting, order, topRange } = storeToRefs(wallpaperStore)

const { isActive: inList } = useInForeground('list')
const app = useAppStore()
const setting = useSettingStore()
const theme = useTheme()
const router = useRouter()
const darkMode = computed<boolean>({
  get() {
    return theme.current.value.dark
  },
  set(value) {
    setting.appearance = value ? APPEARANCE.DARK : APPEARANCE.LIGHT
  },
})
function to(name: 'setting' | 'list' | 'gallery') {
  router.push(`/${name}`)
}

const topRangeOptions = [
  {
    title: '近 1 天',
    value: TOPRANGE.LASTDAY,
    activeClass: 'text-primary',
  },
  {
    title: '近 3 天',
    value: TOPRANGE.LAST_THREE_DAYS,
    activeClass: 'text-primary',
  },
  {
    title: '近 1 周',
    value: TOPRANGE.LAST_WEEK,
    activeClass: 'text-primary',
  },
  {
    title: '近 1 月',
    value: TOPRANGE.LAST_MONTH,
    activeClass: 'text-primary',
  },
  {
    title: '近 3 月',
    value: TOPRANGE.LAST_THREE_MONTH,
    activeClass: 'text-primary',
  },
  {
    title: '近 6 月',
    value: TOPRANGE.LAST_SIX_MONTH,
    activeClass: 'text-primary',
  },
  {
    title: '近 1 年',
    value: TOPRANGE.LAST_YEAR,
    activeClass: 'text-primary',
  },
]

const orderOptions = [
  {
    title: '降序',
    value: ORDER.DESC,
    activeClass: 'text-primary',
  },
  {
    title: '升序',
    value: ORDER.ASC,
    activeClass: 'text-primary',
  },
]

const sortingOptions = [
  {
    title: '相关性',
    value: SORTING.RELEVANCE,
    activeClass: 'text-primary',
  },
  {
    title: '日期',
    value: SORTING.DATE_ADDED,
    activeClass: 'text-primary',
  },
  {
    title: '收藏数',
    value: SORTING.FAVORITES,
    activeClass: 'text-primary',
  },
  {
    title: '热度',
    value: SORTING.HOT,
    activeClass: 'text-primary',
  },
  {
    title: '排行',
    value: SORTING.TOPLIST,
    activeClass: 'text-primary',
  },
  {
    title: '随机',
    value: SORTING.RANDOM,
    activeClass: 'text-primary',
  },
  {
    title: '浏览数',
    value: SORTING.VIEWS,
    activeClass: 'text-primary',
  },
]

const categoriesOptions = [
  {
    title: 'GENERAL',
    value: CATGORY.GENERAL,
    activeClass: 'text-primary',
  },
  {
    title: 'ANIME',
    value: CATGORY.ANIME,
    activeClass: 'text-primary',
  },
  {
    title: 'PEOPLE',
    value: CATGORY.PEOPLE,
    activeClass: 'text-primary',
  },
]
const purityOptions = computed(() => {
  const options = [
    {
      title: 'SFW',
      value: PURITY.SFW,
      activeClass: 'text-primary',
    },
    {
      title: 'SKETCHY',
      value: PURITY.SKETCHY,
      activeClass: 'text-primary',
    },
  ]
  if (setting.apiKey) {
    options.push({
      title: 'NSFW',
      value: PURITY.NSFW,
      activeClass: 'text-primary',
    })
  }
  return options
})
</script>
