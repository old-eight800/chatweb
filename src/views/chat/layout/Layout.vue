<!--
 * @Author: mjjh
 * @LastEditTime: 2023-04-15 22:10:36
 * @FilePath: \chatgpt-shuowen\src\views\chat\layout\Layout.vue
 * @Description: 页面布局文件
-->
<script setup lang='ts'>
import { computed } from 'vue'
import { NLayout, NLayoutContent, NModal, NTabPane, NTabs } from 'naive-ui'
import { useRoute, useRouter } from 'vue-router'
import Sider from './sider/index.vue'
import login from './login.vue'
import register from './register.vue'
import register2 from './ResetPassword.vue'
import { useBasicLayout } from '@/hooks/useBasicLayout'
import { useAppStore, useAuthStore, useChatStore, useUserStore } from '@/store'
import Icon403 from '@/icons/403.vue'

const router = useRouter()
const route = useRoute()
const appStore = useAppStore()
const chatStore = useChatStore()
const authStore = useAuthStore()
const userStore = useUserStore()


const { uuid: curConvUuid } = route.params as { uuid: string }
console.log(`curConvUuid:${curConvUuid}`)
if (!curConvUuid) {
  console.log(`uuid,chatStore.active:${chatStore.active}`)
  router.replace({ name: 'Chat', params: { uuid: chatStore.active } })
} else if (curConvUuid !== chatStore.active) {
  console.log(`curConvUuid !== chatStore.active:${chatStore.active}`)
  chatStore.setActive(curConvUuid)
}

// router.replace({ name: 'Chat', params: { uuid: chatStore.active } })

const { isMobile } = useBasicLayout()

const collapsed = computed(() => appStore.siderCollapsed)

const needPermission = computed(() => !authStore.token)

// 获取屏幕尺寸适配移动端
const getMobileClass = computed(() => {
  if (isMobile.value)
    return ['rounded-none', 'shadow-none']
  return ['border', 'rounded-md', 'shadow-md', 'dark:border-neutral-800']
})


const getContainerClass = computed(() => {
  return [
    'h-full',
    { 'pl-[260px]': !isMobile.value && !collapsed.value && route.path.includes('chat') },
    { 'pl-[0px]': !isMobile.value && !collapsed.value && route.path.includes('draw') }
  ]
})

// 页面加载请求用户信息
if (!needPermission.value)
  userStore.getUserData()
</script>

<template>
  <div class="h-full dark:bg-[#24272e] transition-all" :class="[isMobile ? 'p-0' : 'p-4']">
    <div class="h-full overflow-hidden" :class="getMobileClass">
      <NLayout class="z-40 transition" :class="getContainerClass" has-sider>
        <Sider v-if="$route.path.includes('chat') " />
        <NLayoutContent class="h-full">
          <RouterView v-slot="{ Component, route }">
            <component :is="Component" :key="route.fullPath" />
          </RouterView>
        </NLayoutContent>
      </NLayout>
    </div>
    <NModal :show="needPermission" style="width: 90%; max-width: 640px">
      <div class="p-10 bg-white rounded dark:bg-slate-800">
        <div class="space-y-4">
          <header class="space-y-2">
            <h2 class="text-2xl font-bold text-center text-slate-800 dark:text-neutral-200">
              403
            </h2>
            <p class="text-base text-center text-slate-500 dark:text-slate-500">
              {{ $t('common.unauthorizedTips') }}
            </p>
            <Icon403 class="w-[200px] m-auto" />
          </header>
          <NTabs default-value="login" size="large" animated>
            <NTabPane name="login" tab="登录">
              <login />
            </NTabPane>
            <NTabPane name="register" tab="注册">
              <register />
            </NTabPane>
            <NTabPane name="resetPassword" tab="密码重置">
              <register2 />
            </NTabPane>
          </NTabs>
        </div>
      </div>
    </NModal>
  </div>
</template>
