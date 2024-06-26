import type { AxiosProgressEvent, GenericAbortSignal } from 'axios'
import { post, get } from '@/utils/request'
import { useAuthStore, useSettingStore } from '@/store'


export function fetchChatAPI<T = any>(
  prompt: string,
  options?: { conversationId?: string; parentMessageId?: string },
  signal?: GenericAbortSignal,
) {
  return post<T>({
    url: '/chat',
    data: { prompt, options },
    signal,
  })
}

export function fetchChatConfig<T = any>() {
  return post<T>({
    url: '/config',
  })
}

export function fetchChatAPIProcess<T = any>(
  params: {
    prompt: string
    options?: { conversationId?: string; parentMessageId?: string }
    signal?: GenericAbortSignal
    onDownloadProgress?: (progressEvent: AxiosProgressEvent) => void },
) {
  const settingStore = useSettingStore()
  const authStore = useAuthStore()

  let data: Record<string, any> = {
    prompt: params.prompt,
    options: params.options,
  }

  if (authStore.isChatGPTAPI) {
    data = {
      ...data,
      systemMessage: settingStore.systemMessage,
      temperature: settingStore.temperature,
      top_p: settingStore.top_p,
    }
  }

  return post<T>({
    url: '/chat-process',
    data,
    signal: params.signal,
    onDownloadProgress: params.onDownloadProgress,
  })
}

export function fetchSession<T>() {
  return get<T>({
    url: '/config/session',
  })
}

export function fetchVerify<T>(token: string) {
  return post<T>({
    url: '/verify',
    data: { token },
  })
}

// export function fetchChatAPI<T = any>(
//   prompt: string,
//   options?: { conversationId?: string; parentMessageId?: string },
//   signal?: GenericAbortSignal,
// ) {
//   return post<T>({
//     url: '/chat',
//     data: { prompt, options },
//     signal,
//   })
// }

// export function fetchChatAPIProcess<T = any>(
//   params: {
//     prompt: string
//     isUsingContext: boolean
//     options?: { conversationId?: string; parentMessageId?: string }
//     signal?: GenericAbortSignal
//     onDownloadProgress?: (progressEvent: AxiosProgressEvent) => void },
// ) {
//   const data: Record<string, any> = {
//     prompt: params.prompt,
//     isUsingContext: params.isUsingContext,
//     options: params.options,
//   }

//   return post<T>({
//     url: '/chat_message/send',
//     data,
//     signal: params.signal,
//     onDownloadProgress: params.onDownloadProgress,
//   })
// }

function fetchAiImage<T = any>(uuid: string) {
  return get<T>({
    url: `/ai-image/detail/${uuid}`,
  })
}

function fetchAiImages<T = any>(maxId: number, pageSize: number) {
  return get<T>({
    url: `/ai-image/list?maxId=${maxId}&pageSize=${pageSize}`,
  })
}

function fileDel<T = any>(uuid: string) {
  return post<T>({
    url: `/file/del/${uuid}`,
  })
}

function imageGenerate<T = any>(prompt: string, model: string, size: string, number: number, imageQuality:string) {
  return post<T>({
    url: '/ai-image/generation',
    data: { prompt, model, size, number, imageQuality },
  })
}

function imageEdit<T = any>(originalImage: string, maskImage: string, prompt: string, size: string, number: number) {
  return post<T>({
    url: '/ai-image/edit',
    data: { originalImage, maskImage, prompt, size, number },
  })
}

function imageDel<T = any>(uuid: string) {
  return post<T>({
    url: `/ai-image/del/${uuid}`,
  })
}

function imageVariation<T = any>(originalImage: string, size: string, number: number) {
  return post<T>({
    url: '/ai-image/variation',
    data: { originalImage, size, number },
  })
}

function modifyPassword<T>(password: string) {
  return post<T>({
    url: '/user/password/modify',
    data: { password },
  })
}

/**
 * 前端密码重置
 */
export interface resetPasswordEmailCodeModel {
    // 邮箱地址
    to_email_address: string
}
/**
 * @description: 密码重置
 * @param {resetPasswordEmailCodeModel} data
 * @return {*}
 */
export function resetPasswordEmailCode<T>(data: resetPasswordEmailCodeModel): any {
  return post<T>({
    url: '/user/password/reset/verify_email_code',
    data,
  })
}

/**
 * 前端密码重置
 */
export interface resetPasswordModel {
  // 邮箱地址
  to_email_address: string  
  // 新的密码
  newPassword: string
  //  图形验证码会话ID，必传
  picCodeSessionId: string
  // 图片验证码，必传
  picVerificationCode: string
  // 发送到邮件的验证码
  emailVerficationCode: string
}
/**
* @description: 密码重置
* @param {resetPasswordModel} data
* @return {*}
*/
export function resetPassword<T>(data: resetPasswordModel): any {
return post<T>({
  url: '/user/password/reset',
  data,
})
}


export function fetchUserUsage<T = any>(): any {
  return get<T>({
    url: `/dashboard/list`,
  })
}

export function usersignindata<T = any>(): any {
  return get<T>({
    url: `/user/checkInData`,
  })
}

export function fetchUsertokens<T = any>(): any {
  return get<T>({
    url: `/dashboard/userUsage`,
  })
}

export function fetchUserConfig<T = any>(): any {
  return get<T>({
    url: `/config/list`,
  })
}

export interface configModel {
  secretKey: string     // apiKey
  proxyAdress: string   // 接口地址
  chatModel: string     // 会话模型
  drawvalue: string     // 绘画模型
  baseUserId: string    // 用户ID
}
/**
* @description: 用户配置更新
* @param {configModel} data
* @return {*}
*/
export function configEdit<T>(data: configModel): any {
return post<T>({
  url: '/config/edit',
  data,
})
}

export interface signinModel {
  date: string     // 签到日期
}
/**
* @description: 用户配置更新
* @param {signinModel} data
* @return {*}
*/
export function signin<T>(data: signinModel): any {
return post<T>({
  url: '/user/checkIn',
  data,
})
}

export interface redeemModel {
  redeemCode: string     // 兑换码
}
/**
* @description: 用户配置更新
* @param {redeemModel} data
* @return {*}
*/
export function redeem<T>(data: redeemModel): any {
return post<T>({
  url: '/user/redeem',
  data,
})
}

export default {
  fileDel,
  fetchAiImage,
  fetchAiImages,
  imageGenerate,
  imageEdit,
  imageVariation,
  imageDel,
  modifyPassword,
  fetchUserUsage,
  fetchUsertokens,
  configEdit,
  fetchUserConfig,
  usersignindata,
  signin,
  redeem,
}

export * from "./mjapi"
export * from "./mjsave"
export * from "./openapi"
export * from "./units"
export * from "./mic"
export * from "./chat"
export * from "./sse/fetchsse"
export * from "./Recognition"
