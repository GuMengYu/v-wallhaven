<script lang="ts" setup>
import { mdiClose, mdiInformationOutline } from '@mdi/js'
import type { ComponentPublicInstance } from 'vue'
import { useToast } from 'vue-toastification'

import type { WALLHAVEN_MODEL } from '@/api/wallhaven'
import { setTransForm } from '@/util/fn'
const toast = useToast()
// props
const props = defineProps<{
  data: WALLHAVEN_MODEL
  open: boolean
}>()
// emeits
const emit = defineEmits<{
  (event: 'close'): void
}>()

const showDetail = ref(false)
const imageEl = ref<ComponentPublicInstance | null>(null)
const imageLoad = ref(false)

interface ImageTransForm {
  moveX: number
  moveY: number
  rotate: number
  scale: number
  wheeling: boolean
}
const imageTransForm = ref<ImageTransForm>({
  moveX: 0,
  moveY: 0,
  rotate: 0,
  scale: 1,
  wheeling: false,
})

// handle image load event
async function onError() {
  toast.error('something error')
}
function onLoadStart() {
  imageLoad.value = true
}
async function onLoad() {
  imageLoad.value = false
  // handle image scale and drag
  const el = imageEl.value?.$el as HTMLDivElement
  console.log(el)
  el.addEventListener('wheel', wheelHandler)
  el.addEventListener('mousedown', mouseHandler)
}
const minScale = 0.2
const maxScale = 8
const wheelHandler = (event: WheelEvent) => {
  let n = 1
  if (event.deltaY) {
    n = event.deltaY > 0 ? 1 : -1
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
  } else if (event.wheelDelta) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    n = -event.wheelDelta / 120
  } else if (event.detail) {
    n = event.detail > 0 ? 1 : -1
  }
  event?.preventDefault()
  event?.stopPropagation()
  imageTransForm.value.scale = Math.min(Math.max(imageTransForm.value.scale - 0.03 * n, minScale), maxScale)
  update(event!.currentTarget as HTMLElement)
}

const mouseHandler = function (e: MouseEvent) {
  const t = e.currentTarget as HTMLElement,
    n = t.getBoundingClientRect(),
    r = n.left + n.width / 2 - imageTransForm.value.moveX,
    i = n.top + n.height / 2 - imageTransForm.value.moveY,
    o = e.clientX - r,
    a = e.clientY - i,
    s = imageTransForm.value.moveX,
    l = imageTransForm.value.moveY
  e.preventDefault()
  e.stopPropagation()
  document.onmousemove = function (e) {
    var n = e.clientX - r + s,
      c = e.clientY - i + l
    imageTransForm.value.moveX = n - o
    imageTransForm.value.moveY = c - a
    update(t)
  }
  document.onmouseup = function () {
    document.onmousemove = null
    document.onmouseup = null
  }
}

function update(el: HTMLElement) {
  setTransForm(el, {
    x: `${imageTransForm.value.moveX}`,
    y: `${imageTransForm.value.moveY}`,
    scale: `${imageTransForm.value.scale}`,
    rotate: `${imageTransForm.value.rotate}`,
  })
}
function clear() {
  const el = imageEl.value?.$el as HTMLDivElement
  el.removeEventListener('wheel', wheelHandler)
  el.removeEventListener('mousedown', mouseHandler)
  imageTransForm.value = {
    moveX: 0,
    moveY: 0,
    rotate: 0,
    scale: 1,
    wheeling: false,
  }
}

onUnmounted(() => {
  clear()
})
watch(
  () => props.open,
  (val) => {
    if (!val) {
      clear()
    }
  }
)

// close the dialog
function close() {
  emit('close')
}
</script>
<template>
  <v-dialog :model-value="open" fullscreen>
    <v-sheet>
      <v-toolbar
        absolute
        :style="{
          zIndex: 1,
          width: '100%',
          background: 'transparent',
        }"
      >
        <v-btn icon @click="close">
          <v-icon>{{ mdiClose }}</v-icon>
        </v-btn>

        <v-toolbar-title>{{ `${data.category} #${data.id}` }}</v-toolbar-title>

        <v-spacer></v-spacer>

        <v-btn icon @click="showDetail = !showDetail">
          <v-icon>{{ mdiInformationOutline }}</v-icon>
        </v-btn>
      </v-toolbar>
      <v-progress-linear
        v-if="imageLoad"
        indeterminate
        color="primary"
        rounded
        :style="{
          position: 'absolute',
          width: '20%',
          left: '40%',
          top: '50%',
          zIndex: 1,
        }"
      ></v-progress-linear>

      <div class="previewer">
        <div class="image-previewer">
          <div class="image-wrapper">
            <v-img
              ref="imageEl"
              :src="data.path"
              transition="loader"
              @error="onError"
              @loadstart="onLoadStart"
              @load="onLoad"
            >
            </v-img>
          </div>
        </div>
      </div>
    </v-sheet>
  </v-dialog>
</template>
<style scoped lang="scss">
.previewer {
  height: 100%;
  width: 100%;
  .image-previewer {
    padding: 64px 120px 72px;
    width: 100%;
    height: 100%;
    .image-wrapper {
      height: 100%;
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}
/* scoped css */
</style>
