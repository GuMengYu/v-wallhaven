<template>
  <app-title path="common.wallhaven" />
  <div class="d-flex align-center gap-2 my-4">
    <span> apiKey: </span>
    <v-text-field
      v-model="apiKey"
      hide-details
      label="NSFW 内容需要配置apiKey, 请前往wallhaven官网注册生成"
      :disabled="!editing"
      variant="outlined"
      density="compact"
      color="primary"
    ></v-text-field>
    <v-btn size="small" color="primary" icon @click="editing = !editing">
      <v-icon>
        {{ editing ? mdiCheckOutline : mdiPencilOutline }}
      </v-icon>
    </v-btn>
  </div>
  <!-- <v-expansion-panels :elevation="0">
    <v-expansion-panel title="wallhaven">
      <v-expansion-panel-text> </v-expansion-panel-text>
    </v-expansion-panel>
    <v-expansion-panel title="bing"> </v-expansion-panel>
  </v-expansion-panels> -->

  <v-divider class="mt-4 mb-3 mx-n3" />
</template>
<script setup lang="ts">
import { mdiCheckOutline, mdiPencilOutline } from '@mdi/js'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'

import AppSelect from '@/components/menu/Select.vue'
import AppTitle from '@/components/Title.vue'
import { SOURCE, useSettingStore } from '@/store/setting'

const settingStore = useSettingStore()
const { locale: lang, source, apiKey } = storeToRefs(settingStore)
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

const editing = ref(false)
</script>
