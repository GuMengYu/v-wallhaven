// types
import type { App } from 'vue'
import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHashHistory } from 'vue-router'

import Discover from '@/pages/discover/Discover.vue'
import FourOhFour from '@/pages/errors/FourOhFour.vue'
import Home from '@/pages/Home.vue'
import List from '@/pages/List.vue'
import Setting from '@/pages/setting/Setting.vue'
const musicRoutes: RouteRecordRaw[] = [
  {
    path: '/gallery',
    name: 'gallery',
    component: Discover,
    meta: { keepAlive: true },
  },
  {
    path: '/setting',
    name: 'setting',
    component: Setting,
    meta: {
      keepAlive: true,
    },
  },
  {
    path: '/list',
    name: 'list',
    component: List,
    props: true,
    meta: {
      keepAlive: true,
    },
  },
]

export function useRouter(app: App) {
  const router = createRouter({
    history: createWebHashHistory(),
    scrollBehavior: (to, from, savedPosition) => savedPosition || ({ x: 0, y: 0 } as any),
    routes: [
      {
        path: '/',
        name: 'Home',
        component: Home,
        children: musicRoutes,
        redirect: { path: '/discover' },
      },
      {
        path: '/:pathMatch(.*)*',
        name: 'FourOhFour',
        component: FourOhFour,
      },
    ],
  })
  // router.beforeEach(({ meta }, from, next) => {
  //   next()
  //   // const logged = store.getters['settings/logged'];
  //   // if (meta.needLogin && !logged) {
  //   //   store.commit('app/showLogin', true);
  //   // } else {

  //   // }
  // })
  // router.afterEach((to, from, failed) => {
  //   console.log(failed)
  // })
  app.use(router)
}
