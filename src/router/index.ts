/*
 * @Author: mjjh
 * @LastEditTime: 2023-04-16 13:53:25
 * @FilePath: \chagpt-shuowen\src\router\index.ts
 * @Description: 路由配置文件出口
 */
import type { App } from 'vue'
import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHashHistory } from 'vue-router'
import { setupPageGuard } from './permission'
import { ChatLayout } from '@/views/chat/layout'

// DrawLayout
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Root',
    component: ChatLayout,
    redirect: '/chat',
    children: [
      {
        path: '/chat/:uuid?',
        name: 'Chat',
        component: () => import('@/views/chat/index.vue'),
      },
      {
        path: '/draw',
        name: 'Draw',
        component: () => import('@/views/draw/index.vue'),
      },
    ],
  },
  // {
  //   path: '/draw',
  //   component: ChatLayout,
  //   children: [
  //     {
  //       path: '/',
  //       name: 'Draw',
  //       component: () => import('@/views/draw/index.vue'),
  //     },
  //   ],
  // },
  
  {
    path: '/emailValidation',
    name: 'emailValidation',
    component: () => import('@/views/exception/emailValidation/index.vue'),
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/exception/404/index.vue'),
  },

  {
    path: '/500',
    name: '500',
    component: () => import('@/views/exception/500/index.vue'),
  },

  {
    path: '/:pathMatch(.*)*',
    name: 'notFound',
    redirect: '/404',
  },
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior: () => ({ left: 0, top: 0 }),
})

setupPageGuard(router)

export async function setupRouter(app: App) {
  app.use(router)
  await router.isReady()
}
