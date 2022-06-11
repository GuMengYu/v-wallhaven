import express from 'express'

import log from './util/log'
import apis from './util/wallhavenapi'
export function useWallpaperServer() {
  log.info('api server create')
  const app = express()
  Object.entries(apis).map(([k, v]) => {
    app.use(k, v)
  })
  return app.listen(12141, '', () => {
    log.info('app run in port 12141')
  })
}
