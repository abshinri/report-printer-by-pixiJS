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

const { getFileToUrl, subscribeDragEvent } = mixin();
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
    const image = controller.value.image();
    image.init(result, { zIndex: 0 });
    background.value = image;

    resetElementPool();
  });
};

// 恢复已经加载的元素
const resetElementPool = () => {
  elementPool.value.forEach((element: any) => {
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
    const image = controller.value.image();
    image.init(result, { zIndex: elementPool.value.length + 1 });

    subscribeDragEvent(image);
    elementPool.value.push(image);
  });
};

//#endregion

//region 文本
const pendingText = ref<string>("测试文本,请删除");
const pendingTextStyle = ref<string>(
  JSON.stringify({
    fontFamily: "微软雅黑",
    fontSize: 36,
    wordWrap: true,
    wordWrapWidth: 440,
    lineJoin: "round",
  })
);

// 添加文本
const addText = (event: any) => {
  const text = controller.value.text();
  text.init(pendingText.value, {
    zIndex: elementPool.value.length + 1,
    style: JSON.parse(pendingTextStyle.value),
  });

  subscribeDragEvent(text);
  elementPool.value.push(text);
};

//#endregion

//#region 导出套打图
const output = () => {
  // 移除背景
  controller.value.app.stage.removeChild(background.value.sprite);

  controller.value.app.render();
  const dataURL = controller.value.app.view.toDataURL("image/png", 1);
  const a = document.createElement("a");
  a.href = dataURL;
  a.download = "套打图.png";
  a.click();
  restore();
};
// 恢复到导出前的样子
const restore = () => {
  controller.value.app.stage.removeChildren();
  controller.value.app.stage.addChild(background.value.sprite);
  resetElementPool();
};
//#endregion
</script>
<template>
  <div id="leftSide" class="left-side">
    <div class="title">控制台</div>
    <div class="layers">
      <div class="btns">
        <el-button size="small" plain @click="clickAddBackgroundBtn"
          >设置背图</el-button
        >
        <el-button size="small" plain @click="clickAddImageBtn"
          >添加图片</el-button
        >
        <el-input
          v-model="pendingText"
          :rows="2"
          type="textarea"
          placeholder="待添加的文本"
        />
        <el-input
          v-model="pendingTextStyle"
          :rows="8"
          type="textarea"
          placeholder="待添加的文本样式"
        />

        <el-button size="small" @click="addText" plain>添加文字</el-button>
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

      <el-button size="small" @click="output" plain>导出结果</el-button>
      <el-table :data="elementPool" style="width: 100%" max-height="250">
        <el-table-column prop="type" label="类型" />
        <el-table-column prop="id" label="ID号" />
      </el-table>
    </div>
  </div>
</template>
<style lang="scss">
@import "./index.scss";
#leftSide {
  padding: 10px;
}
</style>
