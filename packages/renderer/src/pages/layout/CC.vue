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
    <v-toolbar dense class="pr-2" color="surface">
      <v-toolbar-title class="text-onSurfaceVariant">{{ $t('common.setting') }}</v-toolbar-title>
      <v-spacer />
      <v-btn icon size="small" @click="app.showControlCenter = false">
        <v-icon size="small"> {{ mdiClose }} </v-icon>
      </v-btn>
    </v-toolbar>
    <v-container>
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
          <switch-card :title="$t('common.list')" :icon="mdiCog" @click="to('list')" />
        </v-col>
        <v-col></v-col>
      </v-row>
    </v-container>
  </v-navigation-drawer>
</template>

<script lang="ts">
import { mdiCircleHalfFull, mdiClose, mdiCog, mdiTestTube } from '@mdi/js'
import { computed } from 'vue'
import { useTheme } from 'vuetify'

// Composables
import { useAppStore } from '@/store/app'
import { APPEARANCE, useSettingStore } from '@/store/setting'

export default defineComponent({
  setup() {
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
    const isDev = import.meta.env.DEV
    // for dev
    function to(name: 'setting' | 'list') {
      router.push(`/${name}`)
    }
    return {
      darkMode,
      app,
      mdiCircleHalfFull,
      mdiTestTube,
      mdiClose,
      mdiCog,
      isDev,
      to,
    }
  },
})
</script>