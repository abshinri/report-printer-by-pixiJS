<script lang="ts">
// 控制画布上元素增减的模块
export default {
  name: "backgroundPanel",
};
</script>
<script setup lang="ts">
import {
  ref,
  reactive,
  defineEmits,
  onMounted,
  inject,
  defineExpose,
} from "vue";
import mixin from "@/lib/mixin";
import bus from "@/lib/bus";

import { ElMessage } from "element-plus";
// 矫正参数
const adjustPointsGroup = inject<any>("adjustPointsGroup");
// 套打背图
const background = inject<any>("background");
// 画布控制器
const controller = ref<any>(null);
// 元素池
const elementPool = inject<any>("elementPool");

// 初始化画布控制器
bus.on("initByCanvas", (_controller) => {
  controller.value = _controller;
});

const isUploaded = ref(false);
const {
  getFileToUrl,
  addAnchorPoint,
  addFixedPoint,
  cleanFixedPoint,
  restoreAnchorPoint,
  mmToPx,
} = mixin();

//#region 背景图交互
const backgroudInputRef = ref<any>(null);
const clickAddBackgroundBtn = () => {
  backgroudInputRef.value.click();
};

const bgUrl = ref<string>("");
// 把上传的图片导入画布背景图
const getFileToBackground = (event: any) => {
  getFileToUrl(event, (result: any, imgInfo: any) => {
    const width = mmToPx(reportSize.width);
    const height = mmToPx(reportSize.height);
    if (!result) return;

    if (background.value) {
      background.value.sprite.destroy();
      background.value = null;
    }
    bgUrl.value = result;

    const image = controller.value.image();
    image.apply(result, {
      x: width / 2,
      y: height / 2,
      width: width,
      height: height,
      zIndex: 0,
    });
    background.value = image;

    resetElementPool();
    bus.emit("onChangeBackground");
    bus.emit("initDragEvent");
    isUploaded.value = true;
  });
};

//#endregion
const reportSize = reactive({
  width: 210,
  height: 297,
});
// 更改报告大小
const handleSizeChange = () => {
  const width = mmToPx(reportSize.width);
  const height = mmToPx(reportSize.height);
  controller.value.app.renderer.resize(width, height);
  if (background.value) {
    background.value.sprite.x = width / 2;
    background.value.sprite.y = height / 2;
    background.value.sprite.width = width;
    background.value.sprite.height = height;
  }
};

// 恢复已经加载的元素
const resetElementPool = () => {
  elementPool.value.forEach((element: any) => {
    element.reset();
  });
};

//#region 导出套打图
const output = () => {
  if (background.value.sprite) {
    // backgroundPanelRef.value.background.sprite.destroy();
    // 移除背景;
    controller.value.app.stage.removeChild(background.value.sprite);
  }

  // elementPool.value.forEach((element: any) => {
  //   if (!element.sprite) {
  //     return;
  //   }
  //   elementContainer.addChild(element.sprite);

  //   element.reset({
  //     x: element.sprite.x - adjustParam.x,
  //     y: element.sprite.y - adjustParam.y,
  //     // scale: adjustParam.scale,
  //     scaleX: adjustParam.scaleX,
  //     scaleY: adjustParam.scaleY,
  //   });
  // });
  // if (
  //   adjustPointsGroup.value.fixedPoints.a &&
  //   adjustPointsGroup.value.fixedPoints.b
  // ) {
  // controller.value.app.stage.scale.x =
  //   controller.value.app.stage.scale.x / adjustParam.scaleX;
  controller.value.app.stage.scale.x = adjustPointsGroup.value.scaleX;
  controller.value.app.stage.scale.y = adjustPointsGroup.value.scaleY;
  // controller.value.app.stage.x = -adjustPointsGroup.value.fixedPoints.a.x;
  // controller.value.app.stage.y = controller.value.app.stage.y - adjustParam.y;
  // controller.value.app.stage.y = -adjustPointsGroup.value.fixedPoints.a.y;
  controller.value.app.stage.x = -adjustPointsGroup.value.x;
  controller.value.app.stage.y = -adjustPointsGroup.value.y;

  // }

  // console.log(controller.value.app.stage);
  // controller.value.app.stage.children.forEach((child: any) => {
  //   child.scale = adjustParam.scale;
  //   child.position.set(child.x + adjustParam.x, child.y + adjustParam.y);
  // });

  controller.value.app.render();
  const dataURL = controller.value.app.view.toDataURL("image/png", 1);

  restore();
  const newWindow = window.open();
  if (newWindow) {
    newWindow.document.write(
      `<html><head><title>套打图</title>
      <style>
      @page {
        margin: 0;
      }
      </style>
        </head>
        <body style="margin:0;padding:0;">
          <img src="${dataURL}" style="width:100vw;height:auto;" />
        </body>
      </html>`
    );
    newWindow.document.close();
    // 打印
    newWindow.print();
    newWindow.onafterprint = function () {
      newWindow.close();
    };
  } else {
    ElMessage.error("请允许弹窗打开");
  }
  // const a = document.createElement("a");
  // a.href = dataURL;
  // a.download = "套打图.png";
  // a.click();
};
// 恢复到导出前的样子
const restore = () => {
  controller.value.app.stage.x = 0;
  controller.value.app.stage.y = 0;
  controller.value.app.stage.scale.x = 1;
  controller.value.app.stage.scale.y = 1;

  // controller.value.app.stage.removeChildren();
  if (background.value.sprite) {
    controller.value.app.stage.addChild(background.value.sprite);
  }

  resetElementPool();
  restoreAnchorPoint();
};
</script>
<template>
  <div id="backgroundPanel" class="background-panel">
    <!-- 上传 -->
    <div class="background-uploader">
      <div @click="clickAddBackgroundBtn" class="uploader printer-btn">
        <div v-if="!isUploaded">
          <el-icon><Picture /></el-icon>
          <div>上传底图</div>
        </div>
        <div v-else>
          <el-icon><Refresh /></el-icon>
          <div>更换底图</div>
        </div>
      </div>
    </div>
    <!-- 设置背图大小 -->
    <div class="background-size">
      <div class="background-size-item">
        <span>宽度</span>
        <el-input
          type="number"
          v-model.number="reportSize.width"
          @change="handleSizeChange"
          size="small"
        >
          <template #append>mm</template></el-input
        >
      </div>
      <div class="background-size-item">
        <span>高度</span>
        <el-input
          type="number"
          v-model.number="reportSize.height"
          @change="handleSizeChange"
          size="small"
        >
          <template #append>mm</template></el-input
        >
      </div>
    </div>
    <!-- 画布配置层 -->
    <div class="background-setting">
      <div class="setting">
        <div class="setting-item">
          <div class="setting-item-title">X轴偏移:</div>
          <div class="setting-item-content">
            <el-input-number
              size="small"
              v-model="adjustPointsGroup.x"
              :step="1"
              :precision="3"
              :value-on-clear="0"
              controls-position=""
            ></el-input-number>
          </div>
        </div>
        <div class="setting-item">
          <div class="setting-item-title">Y轴偏移:</div>
          <div class="setting-item-content">
            <el-input-number
              size="small"
              v-model="adjustPointsGroup.y"
              :step="1"
              :precision="3"
              :value-on-clear="0"
              controls-position=""
            ></el-input-number>
          </div>
        </div>
        <div class="setting-item">
          <div class="setting-item-title">X轴缩放:</div>
          <div class="setting-item-content">
            <el-input-number
              size="small"
              v-model="adjustPointsGroup.scaleX"
              :min="0.1"
              :max="2"
              :step="0.05"
              :precision="3"
              :value-on-clear="1"
              controls-position=""
            ></el-input-number>
          </div>
        </div>
        <div class="setting-item">
          <div class="setting-item-title">Y轴缩放:</div>
          <div class="setting-item-content">
            <el-input-number
              size="small"
              v-model="adjustPointsGroup.scaleY"
              :min="0.1"
              :max="2"
              :step="0.05"
              :precision="3"
              :value-on-clear="1"
              controls-position=""
            ></el-input-number>
          </div>
        </div>
      </div>
    </div>
    <div class="background-fixed">
      <el-button @click="addAnchorPoint" plain>导入定位点</el-button>
      <el-button @click="addFixedPoint" plain>导入矫正点</el-button>
      <el-button @click="cleanFixedPoint" plain>清除矫正点</el-button>
    </div>
    <div class="export">
      <div @click="output" class="exporter printer-btn">
        <div>
          <el-icon><Picture /></el-icon>
          <div>导出结果</div>
        </div>
      </div>
    </div>
    <input
      type="file"
      ref="backgroudInputRef"
      accept="image/*"
      @change="getFileToBackground"
      style="display: none"
    />
  </div>
</template>
<style lang="scss" scoped>
#backgroundPanel {
  padding: 0px 20px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.5);
  display: flex;

  align-items: center;
  .background-uploader {
    width: 180px;
  }
  .exporter,
  .uploader {
    padding: 12px 20px;
    .el-icon {
      padding-right: 10px;
      font-size: 40px;
    }
    > div {
      display: flex;
      justify-content: space-around;
      align-items: center;
    }
  }

  .background-size {
    width: 300px;
    display: flex;

    .background-size-item {
      width: 120px;
      ::v-deep(.el-input-group__append) {
        padding: 0 10px;
      }
    }
  }
  .background-setting {
    width: 500px;
  }
  .background-fixed {
    width: 200px;
  }
}
</style>
