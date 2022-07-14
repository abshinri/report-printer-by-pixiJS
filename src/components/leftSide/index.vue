<script lang="ts">
// 控制画布上元素增减的模块
export default {
  name: "LeftSide",
};
</script>
<script setup lang="ts">
import { ref, reactive, defineEmits, onMounted, computed, inject } from "vue";
import mixin from "@/lib/mixin";
import bus from "@/lib/bus";
import backgroundPanel from "./panels/background.vue";
import certDataPanel from "./panels/certData.vue";

// 套打背图
const backgroundPanelRef = ref<any>(null);
// 画布控制器
const controller = ref<any>(null);
// 元素池
const elementPool = inject<any>("elementPool");

// 初始化画布控制器
bus.on("initByCanvas", (_controller) => {
  controller.value = _controller;
});

const { getFileToUrl, subscribeDragEvent } = mixin();

// 恢复已经加载的元素
const resetElementPool = () => {
  elementPool.value.forEach((element: any) => {
    element.reset();
  });
};
//#region 图片交互
const imageInputRef = ref<any>(null);
const clickAddImageBtn = () => {
  imageInputRef.value.click();
};

// 把上传的图片导入画布
const getFileToImage = (event: any) => {
  getFileToUrl(event, (result: any) => {
    if (!result) return;
    const image = controller.value.image();
    image.init(result, { zIndex: elementPool.value.length + 1 });

    subscribeDragEvent(image);
    elementPool.value.push(image);
  });
};

//#endregion

//#region 导出套打图
const output = () => {
  // 移除背景
  controller.value.app.stage.removeChild(
    backgroundPanelRef.value.background.sprite
  );

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
  controller.value.app.stage.addChild(
    backgroundPanelRef.value.background.sprite
  );
  resetElementPool();
};
//#endregion
</script>
<template>
  <div id="leftSide" class="left-side">
    <h1 class="title">套打控制台</h1>
    <backgroundPanel ref="backgroundPanelRef" />
    <certDataPanel style="margin-top: 10px" />

    <el-button @click="output" plain>导出结果</el-button>
    <h3 style="margin-top: 10px">资源池</h3>
    <el-table :data="elementPool" style="width: 100%" max-height="250">
      <el-table-column prop="type" label="类型" />
      <el-table-column prop="id" label="ID号" />
    </el-table>

    <!-- <div class="layers">
      <div class="btns">
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
      </div>

    </div> -->
  </div>
</template>
<style lang="scss" scoped>
@import "./index.scss";
#leftSide {
  height: 100vh;
  overflow-y: hidden;
  overflow-x: hidden;
  padding: 10px;
}
.title {
  border-bottom: 3px solid var(--el-color-primary);
  padding-bottom: 5px;
  margin-bottom: 10px;
}
</style>
