<template>
  <v-app-bar class="app_header drag-area" flat>
    <div class="d-flex align-center no-drag-area">
      <window-control v-if="isShowWindowControl" />
      <b-f-btn />
      <reload-btn />
    </div>
    <div class="append d-flex no-drag-area">
      <control-center-toggle />

      <theme-toggle />
    </div>
  </v-app-bar>
</template>
<script setup lang="ts">
import is from '@/util/is'
const isShowWindowControl = computed(() => {
  return is.windows() || is.linux()
})
</script>
<style scoped lang="scss">
.app_header {
  background: transparent;
  :deep(.v-toolbar__content) {
    justify-content: space-between;
    .topbar-content-wrapper {
      flex-grow: 1;
    }
  }
}
</style>
