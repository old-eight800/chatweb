<!--
 * @Author: allen
 * @LastEditTime: 2023-09-16 19:55:29
 * @FilePath: \chagpt-shuowen\src\views\draw\VariationImage.vue
 * @Description: 
-->

<script setup lang='ts'>
import { ref } from 'vue'
import { NButton, NCol, NRow, NUpload, useMessage } from 'naive-ui'
import type { UploadFileInfo } from 'naive-ui'
import format from 'date-fns/format'
import CommonSetting from './components/CommonSetting.vue'
import { checkProcess } from './helper'
import { useDrawStore } from '@/store'
import api from '@/api'

interface Emit {
  (e: 'scrollToBottom'): void
}
const emit = defineEmits<Emit>()
const drawStore = useDrawStore()
const ms = useMessage()
const originalImage = ref<string>('')
const selectedImageSize = ref<string>('')
const generateImageNumber = ref<number>(0)
const buttonDisabled = ref<boolean>(false)

function commonSettingChange(imageSize: string, imageNumber: number) {
  selectedImageSize.value = imageSize
  generateImageNumber.value = imageNumber
}

async function beforeUpload(data: { file: UploadFileInfo; fileList: UploadFileInfo[] }) {
  if (data.file.file?.type !== 'image/png') {
    ms.error('只能上传png格式的图片文件，请重新上传')
    return false
  }
  if (data.file.file?.size > 4 * 1024 * 1024) {
    ms.error('不能超过4MB')
    return false
  }
  return true
}

// Upload original image finish
function handleOriginalFinish({ file, event }: { file: UploadFileInfo; event?: ProgressEvent }) {
  buttonDisabled.value = false
  const res = JSON.parse((event?.target as XMLHttpRequest).response)
  if (res.code === 200) {
    originalImage.value = res.data.url
    // eslint-disable-next-line no-console
    console.log(`image uuid:${originalImage.value}`)
  }
  else {
    // eslint-disable-next-line no-console
    console.log(`handleOriginalFinish err:${res.data}`)
  }
}

// Delete original image
function removeOriginalImage({ file }: { file: UploadFileInfo }) {
  if (originalImage.value)
    api.fileDel(originalImage.value)
  originalImage.value = ''
  buttonDisabled.value = true
}

async function handleSubmit() {
  buttonDisabled.value = true
  setTimeout(() => {
    buttonDisabled.value = false
  }, 3000)
  try {
    const resp = await api.imageVariation<CreateImageResult>(originalImage.value, selectedImageSize.value, generateImageNumber.value)
    const uuid = resp.data.uuid
    drawStore.setLoadingUuid(uuid)

    const originalUrl = `/${originalImage.value}`
    const curDate = format(new Date(), 'yyyy-MM-dd HH:mm:ss')
    const aiImage = {
      id: 0,
      uuid,
      originalImageUrl: originalUrl,
      createTime: curDate,
      interactingMethod: 3,
      processStatus: 1,
      imageUrlList: [],
    }
    drawStore.setLoadingUuid(uuid)
    drawStore.pushOne(aiImage)
    console.log(aiImage)
    emit('scrollToBottom')
    setTimeout(() => {
      checkProcess(uuid)
    }, 5000)
  }
  catch (error) {
    const e = error as { message: string }
    ms.error(e.message)
  }
}
</script>

<template>
  <div>
    <CommonSetting ref="commonSettingRef" @valChange="commonSettingChange" />
    <NRow>
      <NCol :span="2">
        原图
      </NCol>
      <NCol :span="12">
        <NUpload
          action="/api/file/upload" :max="1" response-type="text" list-type="image-card"
          @before-upload="beforeUpload" @finish="handleOriginalFinish" @remove="removeOriginalImage"
        >
          上传小于4MB的PNG图片
        </NUpload>
      </NCol>
    </NRow>
    <NRow>
      <NCol>
        <NButton type="primary" :disabled="buttonDisabled" @click="handleSubmit">
          提交
        </NButton>
      </NCol>
    </NRow>
  </div>
</template>
