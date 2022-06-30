<script lang="ts">
// 控制画布上元素增减的模块
export default {
  name: "LeftSide",
};
</script>
<script setup lang="ts">
import { ref, reactive, defineEmits, onMounted } from "vue";
import mixin from "./mixin";
import bus from "@/lib/bus";

const { getFileToUrl } = mixin();
// 套打背图
const background = ref<any>(null);

// 画布控制器
const controller = ref<any>(null);

// 初始化画布控制器
bus.on("initByCanvas", (_controller) => {
  controller.value = _controller;
});

// 元素池
const elementPool = ref<any>([]);

//#region 背景图交互
const backgroudInputRef = ref<any>(null);
const clickAddBackgroundBtn = () => {
  backgroudInputRef.value.click();
};

// 把上传的图片导入画布背景图
const getFileToBackground = (event: any) => {
  getFileToUrl(event, (result: any, imgInfo: any) => {
    controller.value.app.renderer.resize(imgInfo.width, imgInfo.height);
    const image = controller.value.image;
    image.init(result, { zIndex: 0 });
    background.value = image;

    resetElementPool();
  });
};

// 恢复已经加载的元素
const resetElementPool = () => {
  elementPool.value.forEach((element: any) => {
    console.log(element);
    element.reset();
  });
};
//#endregion

//#region 图片交互
const imageInputRef = ref<any>(null);
const clickAddImageBtn = () => {
  imageInputRef.value.click();
};

// 把上传的图片导入画布
const getFileToImage = (event: any) => {
  getFileToUrl(event, (result: any) => {
    const image = controller.value.image;
    image.init(result, { zIndex: elementPool.value.length + 1 });
    elementPool.value.push(image);
  });
};

//#endregion
</script>
<template>
  <div id="leftSide" class="left-side">
    <div class="title">控制台</div>
    <div class="layers">
      <div class="list"></div>
      <div class="btns">
        <el-button size="small" plain @click="clickAddBackgroundBtn"
          >设置背图</el-button
        >
        <el-button size="small" plain @click="clickAddImageBtn"
          >添加图片</el-button
        >
        <el-button size="small" plain>添加文字</el-button>
        <el-button size="small" plain type="danger">删除</el-button>
        <input
          type="file"
          ref="imageInputRef"
          accept="image/*"
          @change="getFileToImage"
          style="display: none"
        />
        <input
          type="file"
          ref="backgroudInputRef"
          accept="image/*"
          @change="getFileToBackground"
          style="display: none"
        />
      </div>
    </div>
  </div>
</template>
<style lang="scss">
@import "./index.scss";
</style>
