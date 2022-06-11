<template>
  <div ref="container" v-wheel="wheelHandler" class="d-flex" :style="{ height: '100vh' }">
    <transition name="route-animation">
      <v-img
        v-if="currentWallpaper"
        :cover="cover"
        :src="currentWallpaper.path"
        @contextmenu="onContextMenu"
        @load="handleLoad"
        @error="handleLoadError"
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
      <v-btn size="large" icon variant="text" @click="prevWallpaper">
        <v-icon size="large">
          {{ mdiChevronLeft }}
        </v-icon>
      </v-btn>
      <v-btn size="large" icon variant="text" @click="nextWallpaper">
        <v-icon size="large">
          {{ mdiChevronRight }}
        </v-icon>
      </v-btn>
      <!-- <v-btn size="large" icon variant="text" @click="hide">
        <v-icon size="large">
          {{ mdiChevronRight }}
        </v-icon>
      </v-btn> -->
    </div>
  </div>
</template>
<script setup lang="ts">
import { mdiChevronLeft, mdiChevronRight } from '@mdi/js'
import { useWheel } from '@vueuse/gesture'
import { throttle } from 'lodash-es'
import { useContextMenu } from 'vuetify-ctx-menu/lib/main'

import type { WALLHAVEN_MODEL } from '@/api/wallhaven'
import { search } from '@/api/wallhaven'
import { useCurrentTheme } from '@/hooks/useTheme'
const contextMenu = useContextMenu()

const { themeName } = useCurrentTheme()

const queue = ref<WALLHAVEN_MODEL[]>([])
const loading = ref(false)
const currentIndex = ref(0)
const currentWallpaper = ref()

const snackbar = ref(false)
const cover = ref(false)
const container = ref()
const msg = ref('')
const show = ref(true)
const currentImage = ref('')
const prevWallpaper = throttle(loadPrev, 1000, { leading: true, trailing: false })
const nextWallpaper = throttle(loadNext, 1000, { leading: true, trailing: false })

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
// useDrag(
//   ({ swipe, tap }) => {
//     console.log(swipe, tap)
//   },
//   {
//     domTarget: demo,
//   }
// )

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
const fetchList = async () => {
  loading.value = true
  try {
    const { data } = await search({
      categories: 110,
      purity: 110,
      sorting: 'hot',
      order: 'desc',
    })
    queue.value = data.data
    currentWallpaper.value = queue.value[currentIndex.value]
  } catch (e) {
    console.log(e)
  } finally {
    loading.value = true
  }
}
fetchList()

async function loadPrev() {
  if (currentIndex.value === 0) {
    return
  }
  loading.value = true
  currentWallpaper.value = null
  currentIndex.value--
  currentWallpaper.value = queue.value[currentIndex.value]
}
async function loadNext() {
  if (currentIndex.value === queue.value.length - 1) {
    return
  }
  loading.value = true
  currentWallpaper.value = null
  currentIndex.value++
  currentWallpaper.value = queue.value[currentIndex.value]
  // const image = await getImageDataUrl(currentWallpaper.value.path)
  // currentImage.value = image
  // loading.value = false
}

function handleLoad() {
  loading.value = false
}
function handleLoadError() {
  loading.value = false
}

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      resolve(img)
    }
    img.onerror = () => {
      reject(img)
    }
    img.src = url
  })
}
function hide() {
  show.value = !show.value
}
</script>
