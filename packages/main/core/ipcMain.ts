import type { BrowserWindow } from 'electron'
import { app, ipcMain, shell } from 'electron'

import { WindowState } from '../../renderer/src/util/enum'
import { downloadFile } from './util/download'
import log from './util/log'
import { setWallpaper } from './util/wallpaper'
export const registerIpcMain = (window: BrowserWindow) => {
  ipcMain.handle('zoom-window', () => {
    if (window.isMaximized()) {
      window.unmaximize()
    } else {
      window.maximize()
    }
  })
  ipcMain.handle('downloadFile', (_e, data) => {
    log.info('start download file', data.url)
    downloadFile(data)
  })
  ipcMain.handle(WindowState.MINIMIZED, () => {
    window.minimize()
  })
  ipcMain.handle(WindowState.MAXIMIZED, () => {
    if (window.isMaximized()) {
      window.unmaximize()
    } else {
      window.maximize()
    }
  })
  ipcMain.handle(WindowState.NORMAL, () => {
    window.unmaximize()
  })
  ipcMain.handle(WindowState.CLOSED, () => {
    window.close()
  })
  ipcMain.handle('open-url', (e, url) => {
    try {
      shell.openExternal(url)
    } catch (e) {
      log.error('open external url failed', e)
    }
  })
  ipcMain.handle('capturePage', async () => {
    const nativeImage = await window.capturePage()
    const buffer = nativeImage.toBitmap()
    const { width, height } = nativeImage.getSize()
    const result = {
      buffer,
      width,
      height,
    }
    return result
  })
  ipcMain.handle('setWallpaper', async (e, url: string) => {
    try {
      window.webContents.send('setWallpaper', 'loading')
      const directory = app.getPath('pictures')
      const file = await downloadFile({ url, directory })
      console.log('will set wallpaper path:', file.path)
      await setWallpaper(file.path)
      window.webContents.send('setWallpaper', 'settled')
    } catch (e) {
      window.webContents.send('setWallpaper', 'faild')
    }
  })
}
