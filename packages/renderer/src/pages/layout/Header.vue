<template>
  <v-app-bar class="app_header px-2 drag-area" flat height="56">
    <div class="append d-flex no-drag-area">
      <b-f-btn />
      <reload-btn />
      <!-- <theme-toggle /> -->
    </div>
    <div class="d-flex align-center no-drag-area">
      <control-center-toggle />
      <window-control v-if="isShowWindowControl" />
    </div>
  </v-app-bar>
</template>
<script setup lang="ts">
import is from '@/util/is'
const isShowWindowControl = computed(() => {
  return is.windows() || is.linux()
})
const justifyContent = is.macOS() ? 'end' : 'space-between'
</script>
<style scoped lang="scss">
.app_header {
  background: transparent;
  :deep(.v-toolbar__content) {
    justify-content: v-bind(justifyContent);
    .topbar-content-wrapper {
      flex-grow: 1;
    }
  }
}
</style>
