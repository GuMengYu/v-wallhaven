<template>
  <v-app class="v-player">
    <AppCC />
    <!-- <app-nav class="v-player-nav" /> -->
    <app-header class="v-player-header" />
    <app-content class="v-player-content" />
  </v-app>
</template>

<script setup lang="ts">
import { useTheme } from 'vuetify'

import { useCurrentTheme } from '@/hooks/useTheme'

import AppCC from './layout/CC.vue'
import AppHeader from './layout/Header.vue'
import AppContent from './layout/View.vue'
const { themeName } = useCurrentTheme()
const theme = useTheme()
watchEffect(() => {
  theme.name.value = themeName.value
})
</script>
