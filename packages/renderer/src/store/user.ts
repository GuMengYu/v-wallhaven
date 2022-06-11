// Utilities
import { useLocalStorage } from '@vueuse/core'
import { defineStore } from 'pinia'

import { getAccount, logout } from '@/api/account'
import { sub } from '@/api/music'
import type { Account, Playlist, Track } from '@/types'
import { specialType } from '@/util/metadata'

type Nullable<T> = T | null
export interface UserState {
  account: Nullable<Account>
  likes: number[]
  playlists: Playlist[]
  signOut?: () => void
  refreshAccount?: () => Promise<Account>
}
export const useUserStore = defineStore({
  id: 'user',
  state: () => {
    return useLocalStorage('user', {
      account: null,
      likes: [],
      playlists: [],
    } as UserState)
  },
  getters: {
    logged: (state) => {
      return !!state.account?.profile?.userId
    },
    uid: (state) => {
      return state.account?.profile?.userId
    },
    favorites: (state) => {
      return (state.playlists.find((playlist) => playlist.specialType === specialType.fav.type) ?? {}) as Playlist
    },
    createdPlaylists(state): Playlist[] {
      return state.playlists.filter((i) => i.creator.userId === this.uid)
    },
    subscribedPlaylists(state): Playlist[] {
      return state.playlists.filter((i) => i.creator.userId !== this.uid)
    },
  },
  actions: {
    async init() {
      // todo
    },
    async refreshAccount() {
      const account = await getAccount()
      this.account = account
      return account
    },
    async signOut() {
      await logout()
      this.account = null
    },
    async favSong(id: number, like: boolean) {
      let likes = this.likes
      try {
        const { code } = await sub('track', id, like ? 1 : 0)
        if (code === 200) {
          if (like) {
            likes.push(id)
          } else {
            likes = likes.filter((i) => i !== id)
          }
          this.likes = likes
          return true
        } else {
          return false
        }
      } catch (e) {
        return false
      }
    },
  },
})
