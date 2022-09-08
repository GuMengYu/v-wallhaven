import { app } from 'electron'
import type electronDl from 'electron-dl'
import { download } from 'electron-dl'

import { getWin } from '../../index'
import log from './log'
export const downloadFile = (data: {
  fileName?: string
  url: string
  directory?: string
}): Promise<electronDl.File> => {
  const win = getWin()
  const fileName = data.fileName || data.url.split('/').pop()
  const directory = data.directory ? data.directory : app.getPath('downloads')
  return new Promise((resolve, reject) => {
    if (win) {
      download(win, data.url, {
        directory,
        showBadge: false,
        filename: fileName,
        onStarted(item) {
          win.webContents.send('startDownload', { name: item.getFilename() })
        },
        onProgress(progress) {
          progress.percent = (progress.transferredBytes / progress.totalBytes) * 100
          win.webContents.send('downloadProgress', progress)
        },
        onCompleted(file) {
          win.webContents.send('downloadCompleted', file)
          resolve(file)
        },
      })
    } else {
      reject('not found window')
      log.warn('not found window')
    }
  })
}
