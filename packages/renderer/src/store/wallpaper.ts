import { useLocalStorage } from '@vueuse/core'
import { defineStore } from 'pinia'

export enum PURITY {
  SFW = 'sfw',
  SKETCHY = 'sketchy',
  NSFW = 'nsfw',
}
export enum CATGORY {
  GENERAL = 'general',
  ANIME = 'anime',
  PEOPLE = 'people',
}
export enum SORTING {
  RANDOM = 'random',
  RELEVANCE = 'relevance',
  DATE_ADDED = 'date_added',
  VIEWS = 'views',
  FAVORITES = 'favorites',
  TOPLIST = 'toplist',
  HOT = 'hot',
}
export enum ORDER {
  ASC = 'asc',
  DESC = 'desc',
}
export enum TOPRANGE {
  LASTDAY = '1d',
  LAST_THREE_DAYS = '3d',
  LAST_WEEK = '1w',
  LAST_MONTH = '1M',
  LAST_THREE_MONTH = '3M',
  LAST_SIX_MONTH = '6M',
  LAST_YEAR = '1y',
}
export interface WallpaperState {
  categories: CATGORY[]
  purity: PURITY[]
  sorting: SORTING
  order: ORDER
  topRange: TOPRANGE
}
export const useWallpaperStore = defineStore('wallpaper', {
  state: () => {
    return useLocalStorage<WallpaperState>('wallpaper', {
      categories: [CATGORY.GENERAL, CATGORY.ANIME, CATGORY.PEOPLE],
      purity: [PURITY.SFW, PURITY.SKETCHY],
      sorting: SORTING.RELEVANCE,
      order: ORDER.DESC,
      topRange: TOPRANGE.LAST_MONTH,
    })
  },
})
