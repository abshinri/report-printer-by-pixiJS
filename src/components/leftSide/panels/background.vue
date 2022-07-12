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
import mixin from "../mixin";
import bus from "@/lib/bus";

// 套打背图
const background = ref<any>(null);
// 画布控制器
const controller = ref<any>(null);
// 元素池
const elementPool = inject<any>("elementPool");

// 初始化画布控制器
bus.on("initByCanvas", (_controller) => {
  controller.value = _controller;
});

const { getFileToUrl } = mixin();

//#region 背景图交互
const backgroudInputRef = ref<any>(null);
const clickAddBackgroundBtn = () => {
  backgroudInputRef.value.click();
};

// 配置画布边距
const padding = reactive<any>({
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
});

// 原始长宽
const originSize = reactive<any>({
  width: 0,
  height: 0,
});

// 原图缩放比例
const backgroudScale = ref<number>(1);

const bgUrl = ref<string>("");
// 把上传的图片导入画布背景图
const getFileToBackground = (event: any) => {
  getFileToUrl(event, (result: any, imgInfo: any) => {
    if (!result) return;

    if (background.value) {
      background.value.sprite.destroy();
      background.value = null;
    }
    padding.top = 0;
    padding.right = 0;
    padding.bottom = 0;
    padding.left = 0;
    backgroudScale.value = 1;
    bgUrl.value = result;
    originSize.width = imgInfo.width;
    originSize.height = imgInfo.height;
    controller.value.app.renderer.resize(
      imgInfo.width + padding.left + padding.right,
      imgInfo.height + padding.top + padding.bottom
    );
    const image = controller.value.image();
    image.init(result, { zIndex: 0 });
    background.value = image;

    resetElementPool();
  });
};

// 恢复已经加载的元素
const resetElementPool = () => {
  elementPool.value.forEach((element: any) => {
    element.reset(1);
  });
};
//#endregion
// 应用比例的更改
const handleSizeChange = (scale?: number) => {
  background.value.reset(scale || backgroudScale.value);
  elementPool.value.forEach((element: any) => {
    element.reset(scale || backgroudScale.value);
  });
  controller.value.app.stage.position.set(padding.left, padding.top);
  controller.value.app.renderer.resize(
    originSize.width * backgroudScale.value + padding.left + padding.right,
    originSize.height * backgroudScale.value + padding.top + padding.bottom
  );
};
// 应用padding的更改
const handlePaddingChange = () => {
  handleSizeChange(1);
};

// 应用缩放比例的更改
const handleScaleChange = (current: number = 1, old: number = 1) => {
  handleSizeChange(current / old);
};
defineExpose({
  background,
});
</script>
<template>
  <div id="backgroundPanel" class="background-panel">
    <h3>设置背图</h3>
    <div
      @click="clickAddBackgroundBtn"
      class="uploader"
      :class="background ? 'uploaded' : ''"
      :style="'background-image:url(' + bgUrl + ')'"
    >
      <div v-if="background === null">
        <div style="text-align: center">
          <el-icon><Picture /></el-icon>
        </div>
        <div>上传套打底图</div>
      </div>
      <div v-else class="padding">
        <el-input-number
          @click.stop
          class="top"
          v-model="padding.top"
          size="small"
          :precision="0"
          controls-position="right"
          @change="handlePaddingChange"
        />
        <el-input-number
          @click.stop
          class="bottom"
          v-model="padding.bottom"
          size="small"
          :precision="0"
          controls-position="right"
          @change="handlePaddingChange"
        />
        <el-input-number
          @click.stop
          class="left"
          v-model="padding.left"
          size="small"
          :precision="0"
          controls-position="right"
          @change="handlePaddingChange"
        />
        <el-input-number
          @click.stop
          class="right"
          v-model="padding.right"
          size="small"
          :precision="0"
          controls-position="right"
          @change="handlePaddingChange"
        />
      </div>
    </div>
    <input
      type="file"
      ref="backgroudInputRef"
      accept="image/*"
      @change="getFileToBackground"
      style="display: none"
    />
    <h4>画布信息</h4>
    <div class="resolution" v-if="background !== null">
      <div class="original">
        <div>原始分辨率</div>
        <div>
          <span>宽:</span><span>{{ originSize.width }}</span> x <span>高:</span
          ><span>{{ originSize.height }}</span>
        </div>
      </div>
      <div class="scale">
        <div>缩放比例</div>
        <div>
          <el-input-number
            v-model="backgroudScale"
            size="small"
            :precision="1"
            :min="0.1"
            :max="10"
            controls-position="right"
            @change="handleScaleChange"
          />
        </div>
      </div>
      <div class="output">
        <div>导出分辨率</div>
        <div>
          <span>宽:</span><span>{{ controller.app.screen.width }}</span> x
          <span>高:</span><span>{{ controller.app.screen.height }}</span>
        </div>
      </div>
    </div>
    <div v-else>未知</div>
  </div>
</template>
<style lang="scss" scoped>
.background-panel {
  $uploaderWidth: 320px;
  $uploaderHeight: 240px;
  .uploader {
    border: 1px dashed var(--el-color-info-light-3);
    border-radius: 4px;
    margin: 20px 0 10px;
    margin-left: 75px;
    width: $uploaderWidth;
    height: $uploaderHeight;
    cursor: pointer;
    background-position: center;
    background-repeat: no-repeat;
    background-size: contain;
    display: flex;
    justify-content: center;
    align-items: center;
    .padding {
      position: relative;
      left: 0;
      top: 0;
      margin: 0;
      padding: 0;
      width: 100%;
      height: 100%;
      > * {
        position: absolute;
        &.top {
          top: -15px;
          left: 105px;
        }
        &.bottom {
          bottom: -15px;
          left: 105px;
        }
        &.left {
          top: 107px;
          left: -70px;
        }
        &.right {
          top: 107px;
          right: -70px;
        }
      }
    }
  }
  .resolution {
    display: flex;
    justify-content: space-between;
  }
}
</style>
