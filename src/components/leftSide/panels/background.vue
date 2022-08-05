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
const { getFileToUrl, addAnchorPoint, addFixedPoint, cleanFixedPoint, mmToPx } =
  mixin();

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

// 恢复已经加载的元素
const resetElementPool = () => {
  elementPool.value.forEach((element: any) => {
    element.reset({ scale: 1, adjust: { x: -adjust.x, y: -adjust.y } });
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
// 通过定位点推导的偏移值
const adjust = reactive({
  x: 0,
  y: 0,
});

defineExpose({
  background,
  adjust,
});
</script>
<template>
  <div id="backgroundPanel" class="background-panel">
    <h3>设置背图</h3>
    <!-- 设置背图大小 -->
    <div class="background-size">
      <div class="background-size-item">
        <span>宽度</span>
        <el-input
          type="number"
          v-model.number="reportSize.width"
          @change="handleSizeChange"
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
        >
          <template #append>mm</template></el-input
        >
      </div>
    </div>
    <!-- 画布配置层 -->
    <div class="background-setting">
      <div
        @click="clickAddBackgroundBtn"
        class="uploader"
        :class="background ? 'uploaded' : ''"
        :style="'background-image:url(' + bgUrl + ')'"
      >
        <div v-if="!isUploaded">
          <div style="text-align: center">
            <el-icon><Picture /></el-icon>
          </div>
          <div>上传套打底图</div>
        </div>
      </div>
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
    <input
      type="file"
      ref="backgroudInputRef"
      accept="image/*"
      @change="getFileToBackground"
      style="display: none"
    />
    <el-button @click="addAnchorPoint" plain>导入定位点</el-button>
    <el-button @click="addFixedPoint" plain>导入矫正点</el-button>
    <el-button @click="cleanFixedPoint" plain>清除矫正点</el-button>
  </div>
</template>
<style lang="scss" scoped>
.background-size {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .background-size-item{
    margin: 0 5px;
  }
}
.background-setting {
  display: flex;
  align-items: center;
  justify-content: space-around;
  width: 100%;
  height: 100%;
  margin: 8px 0;
  .setting-item {
    display: flex;
    justify-content: space-between;
    padding: 5px 0;
    .setting-item-title {
      font-size: 13px;
      align-self: center;
      margin-right: 10px;
    }
  }
}
.background-panel {
  $uploaderWidth: 200px;
  $uploaderHeight: 150px;
  .uploader {
    border: 1px dashed var(--el-color-info-light-3);
    border-radius: 4px;
    // margin: 20px 0 10px;
    // margin-left: 150px;
    width: $uploaderWidth;
    height: $uploaderHeight;
    cursor: pointer;
    background-position: center;
    background-repeat: no-repeat;
    background-size: contain;
    display: flex;
    justify-content: center;
    align-items: center;
    // .padding {
    //   position: relative;
    //   left: 0;
    //   top: 0;
    //   margin: 0;
    //   padding: 0;
    //   width: 100%;
    //   height: 100%;
    //   > * {
    //     position: absolute;
    //     &.top {
    //       top: -15px;
    //       left: 105px;
    //     }
    //     &.bottom {
    //       bottom: -15px;
    //       left: 105px;
    //     }
    //     &.left {
    //       top: 107px;
    //       left: -70px;
    //     }
    //     &.right {
    //       top: 107px;
    //       right: -70px;
    //     }
    //   }
    // }
  }
  .adjust,
  .resolution {
    display: flex;
    justify-content: space-between;
  }
}
</style>
