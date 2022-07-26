<script lang="ts">
// 控制画布上元素增减的模块
export default {
  name: "LeftSide",
};
</script>
<script setup lang="ts">
import { ref, reactive, defineEmits, onMounted, computed, inject } from "vue";
import * as PIXI from "pixi.js";
import mixin from "@/lib/mixin";
import bus from "@/lib/bus";
import backgroundPanel from "./panels/background.vue";
import certDataPanel from "./panels/certData.vue";
import { ElMessage } from "element-plus";

// 套打背图
const backgroundPanelRef = ref<any>(null);
// 画布控制器
const controller = ref<any>(null);
// 元素池
const elementPool = inject<any>("elementPool");

// 打印参数
const printingParameters = inject<any>("printingParameters");
// 初始化画布控制器
bus.on("initByCanvas", (_controller) => {
  controller.value = _controller;
});

const { getFileToUrl, subscribeDragEvent, getAdjustParam } = mixin();

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
  // const adjustParam = getAdjustParam(false);
  // console.log(adjustParam);
  // // controller.value.app.stage.removeChildren();
  // if (backgroundPanelRef.value.background?.sprite) {
  //   // backgroundPanelRef.value.background.sprite.destroy();
  //   // 移除背景;
  //   backgroundPanelRef.value.background.sprite.alpha = 0.1;
  // }

  // elementPool.value.forEach((element: any) => {
  //   if (!element.sprite) {
  //     return;
  //   }
  //   elementContainer.addChild(element.sprite);

  //   // element.reset({
  //   //   x: element.sprite.x + adjustParam.x,
  //   //   y: element.sprite.y + adjustParam.y,
  //   //   scale: adjustParam.scale,
  //   // });
  // });

  // controller.value.containers.content.x =
  //   controller.value.containers.content.x - adjustParam.x;
  // controller.value.containers.content.y =
  //   controller.value.containers.content.y - adjustParam.y;
  // controller.value.containers.content.scale.x = adjustParam.scale;
  // controller.value.containers.content.scale.y = adjustParam.scale;

  // console.log(controller.value.app.stage);
  // controller.value.app.stage.children.forEach((child: any) => {
  //   child.scale = adjustParam.scale;
  //   child.position.set(child.x + adjustParam.x, child.y + adjustParam.y);
  // });

  // controller.value.app.render();

  console.log(controller.value);
  const graphics = new PIXI.Graphics()
    .beginFill(0xffffff, 1)
    .drawRect(
      0,
      0,
      controller.value.containers.background.width,
      controller.value.containers.background.height
    );
  const tempContainer = new PIXI.Container();
  tempContainer.width = printingParameters.value.width;
  tempContainer.height = printingParameters.value.height;

  tempContainer.addChild(graphics);
  tempContainer.addChild(controller.value.containers.content);
  // controller.value.containers.background.removeChildren()
  const dataURL = controller.value.app.renderer.plugins.extract
    .canvas(tempContainer, "image/jpeg", 1)
    .toDataURL();

  // controller.value.containers.content.renderCanvas ()

  // restore();
  // const newWindow = window.open();
  // if (newWindow) {
  //   newWindow.document.write(
  //     `<html><head><title>套打图</title>
  //     <style>
  //     @page {
  //       margin: 0;
  //     }
  //     </style>
  //       </head>
  //       <body style="margin:0;padding:0;">
  //         <img src="${dataURL}" style="width:100vw;height:auto;" />
  //       </body>
  //     </html>`
  //   );
  //   newWindow.document.close();
  //   // 打印
  //   newWindow.print();
  //   newWindow.onafterprint = function () {
  //     newWindow.close();
  //   };
  // } else {
  //   ElMessage.error("请允许弹窗打开");
  // }
  const a = document.createElement("a");
  a.href = dataURL;
  a.download = "套打图.jpg";
  a.click();
};
// 恢复到导出前的样子
const restore = () => {
  // controller.value.app.stage.removeChildren();
  if (backgroundPanelRef.value.background?.sprite) {
    controller.value.app.stage.addChild(
      backgroundPanelRef.value.background?.sprite
    );
  }

  // resetElementPool();
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
