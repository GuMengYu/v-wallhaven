<template>
  <app-title path="common.other" class="mb-2 pl-1" />

  <v-list-item>
    <v-list-item-title>
      <v-list-item-title>{{ $t('common.language') }}</v-list-item-title>
    </v-list-item-title>
    <template #append>
      <App-Select v-model="lang" :items="localeOptions" />
    </template>
  </v-list-item>
  <v-list-item>
    <v-list-item-title>
      <v-list-item-title>{{ $t('common.source') }}</v-list-item-title>
    </v-list-item-title>
    <template #append>
      <App-Select v-model="source" :items="sourceOptions" />
    </template>
  </v-list-item>
  <v-divider class="mt-4 mb-3 mx-n3" />
</template>
<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'

import AppSelect from '@/components/menu/Select.vue'
import AppTitle from '@/components/Title.vue'
import { SOURCE, useSettingStore } from '@/store/setting'

const settingStore = useSettingStore()
const { locale: lang, source } = storeToRefs(settingStore)
const { t, locale } = useI18n({ useScope: 'global' })
const localeOptions = [
  {
    title: t('common.zh-CN'),
    value: 'zhCN',
    activeClass: 'text-primary',
    rounded: true,
  },
  {
    title: t('common.en'),
    value: 'en',
    activeClass: 'text-primary',
    rounded: true,
  },
]

const sourceOptions = [
  {
    title: 'wallhaven',
    value: SOURCE.WALLHAVEN,
    activeClass: 'text-primary',
  },
  {
    title: '必应（每日一图）',
    value: SOURCE.BING,
    activeClass: 'text-primary',
  },
]
watch(lang, () => {
  locale.value = lang.value
})
</script>
