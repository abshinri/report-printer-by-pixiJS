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
const background = ref<any>(null);
// 画布控制器
const controller = ref<any>(null);
// 元素池
const elementPool = inject<any>("elementPool");

// 初始化画布控制器
bus.on("initByCanvas", (_controller) => {
  controller.value = _controller;
});

const { getFileToUrl, addAnchorPoint, addFixedPoint, cleanFixedPoint } =
  mixin();

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

    // originSize.widthCm = pxToCm(imgInfo.width, 2);
    // originSize.heightCm = pxToCm(imgInfo.height, 2);
    controller.value.app.renderer.resize(
      imgInfo.width + padding.left + padding.right,
      imgInfo.height + padding.top + padding.bottom
    );
    const image = controller.value.image();
    image.apply(result, { zIndex: 0 });
    background.value = image;

    resetElementPool();
    bus.emit("onChangeBackground");
  });
};

// 恢复已经加载的元素
const resetElementPool = () => {
  elementPool.value.forEach((element: any) => {
    element.reset({ scale: 1, adjust: { x: -adjust.x, y: -adjust.y } });
  });
};
//#endregion
// 应用比例的更改
const handleSizeChange = (scale?: number) => {
  background.value.reset({ scale: scale || backgroudScale.value });
  elementPool.value.forEach((element: any) => {
    element.reset({ scale: scale || backgroudScale.value });
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

const adjust = reactive({
  x: 0,
  y: 0,
});
const handleAdjustChange = (current: number = 1, old: number = 1) => {
  handleSizeChange(1);
};

defineExpose({
  background,
  adjust,
});
</script>
<template>
  <div id="backgroundPanel" class="background-panel">
    <h3>设置背图</h3>
    <!-- 画布配置层 -->
    <div class="background-setting">
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
      </div>
      <div class="setting">
        <div class="setting-item">
          <div class="setting-item-title">X轴偏移: </div>
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
          <div class="setting-item-title">Y轴偏移: </div>
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
          <div class="setting-item-title">X轴缩放: </div>
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
          <div class="setting-item-title">Y轴缩放: </div>
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
    <!-- <h4>打印偏移校对</h4>
    <div class="adjust">
      <div>
        <div class="label">X轴</div>
        <div class="input">
          <el-input-number
            v-model="adjust.x"
            :min="-originSize.widthCm"
            :max="originSize.widthCm"
            @change="handleAdjustChange"
          ></el-input-number>
          <span>cm</span>
        </div>
      </div>
      <div>
        <div class="label">Y轴</div>
        <div class="input">
          <el-input-number
            v-model="adjust.y"
            :min="-originSize.heightCm"
            :max="originSize.heightCm"
            @change="handleAdjustChange"
          ></el-input-number>
          <span>cm</span>
        </div>
      </div>
    </div>
    <h4>画布信息</h4>
    <div class="resolution" v-if="background !== null">
      <div class="original">
        <div>原始分辨率</div>
        <div>
          <span>宽:</span><span>{{ originSize.widthCm }}cm</span> x
          <span>高:</span><span>{{ originSize.heightCm }}cm</span>
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
    <div v-else>未知</div> -->
  </div>
</template>
<style lang="scss" scoped>

.background-setting{
  display: flex;
  align-items: center;
  justify-content: space-around;
  width: 100%;
  height: 100%;
  margin: 8px 0;
  .setting-item{
    display: flex;
    justify-content: space-between;
    padding:5px 0;
    .setting-item-title{
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
