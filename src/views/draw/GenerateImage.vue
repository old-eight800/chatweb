<!--
 * @Author: allen
 * @LastEditTime: 2023-09-16
 * @FilePath: \chagpt-shuowen\src\views\draw\GenerateImage.vue
 * @Description:
-->
<script setup lang='ts'>
import { ref } from "vue";
import format from "date-fns/format";
import { useMessage } from "naive-ui";
import CommonSetting from "./components/CommonSetting.vue";
import SearchInput from "./components/SearchInput.vue";
import { checkProcess } from "./helper";
import { useDrawStore } from "@/store";
import api from "@/api";

interface Emit {
  (e: "scrollToBottom"): void;
}
const emit = defineEmits<Emit>();
const drawStore = useDrawStore();
const ms = useMessage();
const selectedImageSize = ref<string>("");
const generateImageNumber = ref<number>(0);
const selectedImageModel = ref<string>("");
const generateImageQuality = ref<string>("");

function commonSettingChange(
  imageModel: string,
  imageSize: string,
  imageNumber: number,
  imageQuality: String
) {
  selectedImageModel.value = imageModel;
  selectedImageSize.value = imageSize;
  generateImageNumber.value = imageNumber;
  generateImageQuality.value = imageQuality;
}
async function handleSubmit(prompt: string) {
  if (prompt.length === 0) return;
  // eslint-disable-next-line no-console
  console.log(`GenerateImage submit:${prompt}`);
  try {
    const resp = await api.imageGenerate<CreateImageResult>(
      prompt,
      selectedImageModel.value,
      selectedImageSize.value,
      generateImageNumber.value,
      generateImageQuality.value
    );
    const uuid = resp.data.uuid;
    drawStore.setLoadingUuid(uuid);
    const curDate = format(new Date(), "yyyy-MM-dd HH:mm:ss");
    const aiImage = {
      id: 0,
      code: 200,
      uuid,
      prompt,
      createTime: curDate,
      interactingMethod: 1,
      processStatus: 1,
      imageUrlList: [],
    };
    drawStore.setLoadingUuid(uuid);
    drawStore.pushOne(aiImage);
    console.log(aiImage);
    emit("scrollToBottom");
    // eslint-disable-next-line no-console
    console.log(`checkProcess111:${uuid}`);
    setTimeout(() => {
      // eslint-disable-next-line no-console
      console.log(`checkProcess:${uuid}`);
      checkProcess(uuid);
    }, 1000);
  } catch (error: any) {
    const e = error as { message: string };
    ms.error(e.message);
  }
}
</script>

<template>
  <div>
    <CommonSetting @valChange="commonSettingChange" />
    <SearchInput @submit="handleSubmit" />
  </div>
</template>
