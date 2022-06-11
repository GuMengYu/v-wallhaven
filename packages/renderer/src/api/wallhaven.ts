import { request } from '@/util/fetch'

export interface WALLHAVEN_MODEL {
  id: string
  category: string
  colors: string[]
  created_at: string
  dimension_x: number
  dimension_y: number
  resolution: string
  purity: string
  ratio: string
  path: string
  favorites: number
  file_type: string
  file_size: number
  thumbs: {
    large: string
    original: string
    small: string
  }
  url: string
  short_url: string
  views: number
}
export function search(params: Record<string, any>) {
  return request<{
    code: number
    data: {
      data: WALLHAVEN_MODEL[]
      meta: {
        current_page: number
        last_page: number
        per_page: number
        total: number
      }
    }
  }>('/wallhaven/search', { params })
}
