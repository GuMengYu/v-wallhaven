import wallpaper from 'wallpaper'

export function setWallpaper(url: string) {
  wallpaper.set(url, { scale: 'fill' })
}

export function getWallpaper() {
  return wallpaper.get()
}
