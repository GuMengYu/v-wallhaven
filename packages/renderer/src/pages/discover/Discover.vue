<template>
  <div ref="container" v-wheel="wheelHandler" class="d-flex wallpaper" :style="{ height: '100vh' }">
    <transition name="route-animation">
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
      >
      </v-img>
    </transition>

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
          <span class="text-uppercase mr-2">{{ currentWallpaper?.category }}</span>
          <span> #{{ currentWallpaper?.id }} </span>
        </v-card-title>
        <div class="divider mx-3" style="min-height: 4px">
          <v-progress-linear v-show="loading" indeterminate color="primary" rounded></v-progress-linear>
        </div>

        <v-card-content class="text-caption d-flex flex-column pt-0">
          <span>
            {{ currentWallpaper?.views }}
          </span>
          <span>
            {{ currentWallpaper?.created_at }}
          </span>
          <span>
            {{ currentWallpaper?.category }} / {{ currentWallpaper?.resolution }} / {{ currentWallpaper?.file_size }}
          </span>
        </v-card-content>
      </v-card>
    </transition>
  </div>
</template>
<script setup lang="ts">
import { mdiChevronLeft, mdiChevronRight, mdiInformationOutline } from '@mdi/js'
import { useWheel } from '@vueuse/gesture'
import { throttle } from 'lodash-es'
import { useContextMenu } from 'vuetify-ctx-menu/lib/main'

import type { WALLHAVEN_MODEL } from '@/api/wallhaven'
import { useFetchWallpapers } from '@/hooks/fetch/useFetchWallpapers'
import { useCurrentTheme } from '@/hooks/useTheme'
const contextMenu = useContextMenu()

const { themeName } = useCurrentTheme()

const queue = ref<WALLHAVEN_MODEL[]>([])
const loading = ref(false)
const currentIndex = ref(-1)
const currentWallpaper = ref<WALLHAVEN_MODEL>()
const page = ref(1)

const snackbar = ref(false)
const cover = ref(false)
const container = ref()
const msg = ref('')
const showInfo = ref(true)
const currentImage = ref('')
const prevWallpaper = throttle(loadPrev, 1500, { leading: true, trailing: false })
const nextWallpaper = throttle(loadNext, 1500, { leading: true, trailing: false })

const prevWallpaperClick = throttle(loadPrev, 500, { leading: true, trailing: false })
const nextWallpaperClick = throttle(loadNext, 500, { leading: true, trailing: false })

onKeyStroke(' ', (e) => {
  cover.value = !cover.value
})

const wheelHandler = ({ movement: [x, y] }) => {
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

function onContextMenu(e: MouseEvent) {
  const { x, y } = e
  const option = {
    theme: themeName.value,
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
        divided: true,
      },
      {
        // icon: mdiFaceMan,
        label: '下载',
        onClick: () => {
          // todo
        },
      },
    ],
  }
  contextMenu(option)
}

const { wallpapers, meta } = useFetchWallpapers(page)

watch(wallpapers, (list) => {
  if (list?.length) {
    const offset = queue.value.length
    // todo overflow
    queue.value.push(...list)

    loading.value = true
    currentIndex.value = offset
    currentWallpaper.value = queue.value[currentIndex.value]
  }
})

async function loadPrev() {
  if (currentIndex.value === 0) {
    return
  }
  loading.value = true
  currentWallpaper.value = void 0
  currentIndex.value--
  currentWallpaper.value = queue.value[currentIndex.value]
}
async function loadNext() {
  if (currentIndex.value === queue.value.length - 1) {
    page.value++
    return
  }
  loading.value = true
  // currentWallpaper.value = null

  currentIndex.value++
  currentWallpaper.value = queue.value[currentIndex.value]
  console.log(currentWallpaper.value)
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

function loadImage(url: string): Promise<HTMLImageElement> {
  const img = h('img', {
    class: ['v-img__img'],
    src: url,
    ref: currentImage,
    onLoad,
    onError,
  })
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.className = 'img-fluid'
    img.onload = () => {
      resolve(img)
    }
    img.onerror = () => {
      reject(img)
    }
    img.src = url
  })
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
