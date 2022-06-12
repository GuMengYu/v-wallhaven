<script setup lang="ts">
import { mdiTag } from '@mdi/js'

import type { WALLHAVEN_MODEL } from '@/api/wallhaven'
const props = defineProps<{
  wallpaper: WALLHAVEN_MODEL
}>()

const emit = defineEmits<{
  (event: 'open'): void
}>()

function handleTag() {
  // todo
}
function open() {
  emit('open')
}
</script>
<template>
  <v-hover v-slot="{ isHovering, props: hoverProps }">
    <v-card
      rounded
      v-bind="hoverProps"
      class="wallpaper-thumb"
      :class="{
        hover: isHovering,
      }"
      @click="open"
    >
      <v-img class="rounded" :aspect-ratio="16 / 9" :src="wallpaper.thumbs.large">
        <div class="d-flex flex-fill fill-height align-end">
          <div class="thumb-info d-flex flex-fill justify-space-between align-center pa-1">
            <v-chip variant="outlined" label size="x-small" color="primary">
              {{ wallpaper.file_type }}
            </v-chip>
            <v-icon size="x-small" color="primary" @click="handleTag">
              {{ mdiTag }}
            </v-icon>
          </div>
        </div>
      </v-img>
    </v-card>
  </v-hover>
</template>

<style lang="scss" scoped>
.wallpaper-thumb {
  &.hover {
    .thumb-info {
      opacity: 1;
      max-height: 4rem;
    }
  }
  .thumb-info {
    max-height: 0;
    opacity: 0;
    background: rgba(var(--v-theme-surfaceVariant), 0.7);
    transition: 0.3s visibility, 0.3s opacity, 0.3s max-height;
  }
}
</style>
