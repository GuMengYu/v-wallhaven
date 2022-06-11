<template>
  <app-title path="common.source" class="mb-2 pl-1" />

  <v-expansion-panels :elevation="0">
    <v-expansion-panel title="wallhaven">
      <v-expansion-panel-text>
        <v-chip> good </v-chip>
      </v-expansion-panel-text>
    </v-expansion-panel>
    <v-expansion-panel title="bing"> </v-expansion-panel>
  </v-expansion-panels>

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
