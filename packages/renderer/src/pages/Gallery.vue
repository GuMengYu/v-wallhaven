<template>
  <div ref="container" v-wheel="wheelHandler" class="d-flex wallpaper" :style="{ height: '100vh' }">
    <v-img
      :cover="cover"
      :src="currentWallpaper?.path"
      class="wall-image"
      :class="{
        loaded: !loading,
        loading: loading,
      }"
      @contextmenu="onContextMenu"
      @load="onLoad"
      @error="onError"
    >
    </v-img>

    <v-snackbar v-model="snackbar" location="top start" timeout="20000">
      <div class="text-subtitle-1 text-onSurface">
        {{ msg }}
      </div>
      <template #actions>
        <v-btn color="primary" icon variant="plain" @click="snackbar = false">
          <v-icon icon="$close"></v-icon>
        </v-btn>
      </template>
    </v-snackbar>
    <div
      :style="{
        display: 'flex',
        position: 'absolute',
        bottom: '10px',
        width: '100%',
        justifyContent: 'center',
      }"
    >
      <v-btn size="large" icon variant="text" @click="detail">
        <v-icon size="large">
          {{ mdiInformationOutline }}
        </v-icon>
      </v-btn>
      <v-btn size="large" icon variant="text" @click="prevWallpaperClick">
        <v-icon size="large">
          {{ mdiChevronLeft }}
        </v-icon>
      </v-btn>
      <v-btn size="large" icon variant="text" @click="nextWallpaperClick">
        <v-icon size="large">
          {{ mdiChevronRight }}
        </v-icon>
      </v-btn>
    </div>
    <transition name="fade">
      <v-card
        v-show="showInfo && currentWallpaper"
        class="panel"
        position="absolute"
        flat
        rounded="lg"
        color="surfaceVariant"
      >
        <v-card-title>
          <span class="text-uppercase">{{ currentWallpaper?.category }}</span>
          <a href="javascript:void 0" class="text-decoration-none" @click="to"> #{{ currentWallpaper?.id }} </a>
        </v-card-title>
        <div class="divider mx-3" style="min-height: 4px">
          <v-progress-linear v-show="loading" indeterminate color="primary" rounded></v-progress-linear>
        </div>

        <v-card-text class="text-caption d-flex flex-column pt-1">
          <span> {{ currentWallpaper?.views }} views </span>
          <span>
            {{ currentWallpaper?.created_at }}
          </span>
          <span>
            {{ currentWallpaper?.category }} / {{ currentWallpaper?.resolution }} /
            {{ bytesToSize(currentWallpaper?.file_size ?? 0) }}
          </span>
        </v-card-text>
      </v-card>
    </transition>
  </div>
</template>
<script setup lang="ts">
import { mdiChevronLeft, mdiChevronRight, mdiInformationOutline } from '@mdi/js'
import { useIpcRenderer } from '@vueuse/electron'
import { useWheel } from '@vueuse/gesture'
import { throttle } from 'lodash-es'
import { useContextMenu } from 'vuetify-ctx-menu/lib/main'
import { getWallpaper } from 'wallpaper'

import type { WALLHAVEN_MODEL } from '@/api/wallhaven'
import { useFetchWallpapers } from '@/hooks/fetch/useFetchWallpapers'
import { useCurrentTheme } from '@/hooks/useTheme'
import { bytesToSize, loadImage, sleep } from '@/util/fn'
getWallpaper().then((res) => {
  console.log(res)
})

const ipcRenderer = useIpcRenderer()
const contextMenu = useContextMenu()

const { themeName } = useCurrentTheme()

const queue = ref<WALLHAVEN_MODEL[]>([])
const preloadCount = ref(5)

const loading = ref(false)
const currentIndex = ref(-1)
const currentWallpaper = ref<WALLHAVEN_MODEL>()
const page = ref(1)

const snackbar = ref(false)
const cover = ref(true)
const container = ref()
const msg = ref('')
const showInfo = ref(true)

const prevWallpaper = throttle(loadPrev, 1500, { leading: true, trailing: false })
const nextWallpaper = throttle(loadNext, 1500, { leading: true, trailing: false })

const prevWallpaperClick = throttle(loadPrev, 500, { leading: true, trailing: false })
const nextWallpaperClick = throttle(loadNext, 500, { leading: true, trailing: false })

// 按下空格
onKeyStroke(' ', (e) => {
  cover.value = !cover.value
})
onKeyStroke(['a', 'A', 'ArrowLeft'], (e: KeyboardEvent) => {
  prevWallpaperClick()
  e.preventDefault()
})
onKeyStroke(['d', 'D', 'ArrowRight'], (e: KeyboardEvent) => {
  nextWallpaperClick()
  e.preventDefault()
})

// 监听滚轮横向滚动事件（或者触摸板横向滑动）
const wheelHandler = ({ movement: [x, y] }: { movement: [number, number] }) => {
  if (x > 800) {
    nextWallpaper()
  } else if (x < -800) {
    prevWallpaper()
  }
}

// Composable usage
useWheel(wheelHandler, {
  domTarget: container,
})

const { wallpapers, meta } = useFetchWallpapers(page)

watch(wallpapers, async (list) => {
  if (list?.length) {
    const before = currentWallpaper.value?.id
    queue.value = list

    const first = queue.value[0]
    if (first?.id === before) {
      await nextTick()
      loading.value = false
    } else {
      loading.value = true
      currentIndex.value = 0
      preloadCount.value = 0
      currentWallpaper.value = first
    }
  }
})
watch(preloadCount, (newVal) => {
  console.log('watchEffect---preloadCount', newVal, 'currentIndex', currentIndex.value)
  if (newVal <= 0) {
    const start = currentIndex.value + 1
    const end = currentIndex.value + 6
    const picked = queue.value.slice(start, end) // 取后5张
    if (picked.length) {
      console.log(
        "preload images's id",
        picked.map((item) => item.id)
      )
      preload(picked)
    }
    preloadCount.value = 5
  }
})

function preload(list: WALLHAVEN_MODEL[]) {
  list.map((i) => {
    return loadImage(i.path)
  })
}

async function loadPrev() {
  if (currentIndex.value === 0) {
    return
  }
  loading.value = true
  await nextTick()
  await sleep(350)
  currentWallpaper.value = void 0
  currentIndex.value--
  preloadCount.value++
  currentWallpaper.value = queue.value[currentIndex.value]
}
async function loadNext() {
  if (currentIndex.value === queue.value.length - 1) {
    page.value++
    return
  }
  loading.value = true
  await nextTick()
  await sleep(350)
  currentIndex.value++
  preloadCount.value--
  currentWallpaper.value = queue.value[currentIndex.value]
}

async function detail() {
  showInfo.value = !showInfo.value
}
async function onLoad() {
  await nextTick()
  loading.value = false
}
function onError() {
  loading.value = false
}

function onContextMenu(e: MouseEvent) {
  const { x, y } = e
  const option = {
    theme: themeName.value,
    customClass: 'bg-surfaceVariant',
    x,
    y,
    items: [
      {
        label: 'cover (space)',
        onClick: () => {
          cover.value = !cover.value
        },
      },
      {
        label: '用作桌面背景',
        onClick: () => {
          // wallpaper.set(currentWallpaper.value?.path)
          snackbar.value = true
        },
      },
      {
        // icon: mdiFaceMan,
        label: '用作锁屏背景',
        onClick: () => {
          // todo
        },
      },
      {
        // icon: mdiFaceMan,
        label: '下载',
        onClick: () => {
          // todo
        },
      },
      {
        // icon: mdiFaceMan,
        label: '去wallhaven原链接',
        onClick: () => {
          // todo
        },
      },
    ],
  }
  contextMenu(option)
}

function to() {
  ipcRenderer.invoke('open-url', currentWallpaper.value?.url)
}
</script>

<style lang="scss">
.wallpaper {
  .panel {
    bottom: 30px;
    left: 30px;
  }
}
.wall-image {
  opacity: 0;
}
.loaded {
  animation-name: slide-in;
  animation-duration: 0.5s;
  animation-timing-function: ease-in-out;
  animation-fill-mode: both;
}
.loading {
  animation-name: slide-out;
  animation-duration: 0.5s;
  animation-timing-function: ease-in-out;
  animation-fill-mode: both;
}
@keyframes slide-out {
  0% {
    opacity: 1;
    transform: scale(1);
  }
  100% {
    opacity: 0;
    transform: translateX(-15px);
  }
}
@keyframes slide-in {
  0% {
    opacity: 0;
    transform: translateX(15px);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
