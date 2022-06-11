<template>
  <div>
    <discover-loader v-if="state.loading" />
    <section v-else class="discover d-flex flex-column gap-6">home</section>
  </div>
</template>
<script setup lang="ts">
import { personalizedMV, personalizedPlaylist, personalizedRadar, personalizedSong } from '@/api/personalized'
import type { MV, Playlist, Track } from '@/types'

interface RootState {
  playLists: Playlist[]
  radarPlayLists: Playlist[]
  songs: Track[]
  mvs: MV[]
  loading: boolean
}
const state = reactive<RootState>({
  radarPlayLists: [],
  playLists: [],
  mvs: [],
  songs: [],
  loading: false,
})

const fetch = async () => {
  state.loading = true
  try {
    const [{ result: playLists }, { result: mvs }, { result: songs }, radars] = await Promise.all([
      personalizedPlaylist(7),
      personalizedMV(),
      personalizedSong(7),
      personalizedRadar(),
    ])
    state.playLists = playLists
    state.mvs = mvs
    state.songs = songs.map((i) => i.song)
    state.radarPlayLists = radars
  } catch (e) {
    console.log(e)
  } finally {
    state.loading = false
  }
}
</script>
