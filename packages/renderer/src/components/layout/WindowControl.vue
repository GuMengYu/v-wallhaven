<template>
  <div class="window-actions no-drag-area">
    <v-divider vertical class="my-3 mx-1" thickness="2" />
    <v-btn icon size="small" class="action-item px-0" @click="handleMinimize">
      <v-icon size="small">
        {{ mdiWindowMinimize }}
      </v-icon>
    </v-btn>
    <v-btn size="small" icon class="action-item px-0" @click="handleToggleMaximize">
      <v-icon size="small">
        {{ windowState === WindowState.MAXIMIZED ? mdiWindowRestore : mdiWindowMaximize }}
      </v-icon>
    </v-btn>
    <v-btn size="small" icon class="action-item action-close px-0" @click="handleClose">
      <v-icon size="small">
        {{ mdiWindowClose }}
      </v-icon>
    </v-btn>
  </div>
</template>

<script setup lang="ts">
import { mdiWindowClose, mdiWindowMaximize, mdiWindowMinimize, mdiWindowRestore } from '@mdi/js'
import { useIpcRenderer } from '@vueuse/electron'
import { storeToRefs } from 'pinia'

import { useAppStore } from '@/store/app'
import { WindowState } from '@/util/enum'

const appStore = useAppStore()
const ipcRenderer = useIpcRenderer()
const { windowState } = storeToRefs(appStore)

function handleMinimize() {
  ipcRenderer.invoke(WindowState.MINIMIZED)
}
function handleToggleMaximize() {
  if (windowState.value === WindowState.MAXIMIZED) {
    ipcRenderer.invoke(WindowState.NORMAL)
  } else {
    ipcRenderer.invoke(WindowState.MAXIMIZED)
  }
}
function handleClose() {
  ipcRenderer.invoke(WindowState.CLOSED)
}
</script>

<style lang="scss">
.window-actions {
  display: flex;
  align-items: center;
  .action-close {
    transition: all 0.25s;
    &:hover {
      color: #fff;
      background: rgb(232, 17, 35);
    }
  }
}
</style>
