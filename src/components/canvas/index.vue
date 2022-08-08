<script lang="ts">
// 核心套打展示层
export default {
  name: "Canvas",
};
</script>
<script setup lang="ts">
import { ref, reactive, defineExpose, onMounted, inject } from "vue";
import bus from "@/lib/bus";
import controller from "./lib/controller";

import mixin from "@/lib/mixin";
import * as PIXI from "pixi.js";

import nullSorite from "@/assets/null.png";

const { mmToPx } = mixin();
const size = {
  width: mmToPx(210),
  height: mmToPx(297),
};
const app = new PIXI.Application({
  backgroundAlpha: 0,
  width: size.width,
  height: size.height,
});

// 待提交的数据和套打时拿到的数据
const reportPrinterData = inject<any>("reportPrinterData");

// 套打背图
const background = inject<any>("background");

app.stage.interactive = true;
app.stage.sortableChildren = true;

const canvasController = reactive<any>({
  initWidth: 0, // 父元素的宽-自适应值
  initHeight: 0, // 父元素的高-自适应值
  startclientX: 0, // 元素拖拽前距离浏览器的X轴位置
  startclientY: 0, //元素拖拽前距离浏览器的Y轴位置
  elLeft: 0, // 元素的左偏移量
  elTop: 0, // 元素的右偏移量

  zoom: 0.5, // 缩放比例
  elWidth: 0, // 元素宽
  elHeight: 0, // 元素高
  meter_zoom: 0, // 子元素缩放比例
});

const wrapperRef = ref<any>(null);
const canvasRef = ref<any>(null);

// 页面初始化
const initBodySize = function () {
  canvasController.initWidth = wrapperRef.value.clientWidth;
  canvasController.initHeight = wrapperRef.value.clientHeight;
  canvasController.elWidth = canvasRef.value.clientWidth;
  canvasController.elHeight = canvasRef.value.clientHeight;
  canvasController.meter_zoom = canvasController.elWidth / 1000;
  canvasController.elLeft = canvasController.initWidth / 2;
  canvasController.elTop = canvasController.initHeight / 2;

  canvasController.zoom = 0.5;
};

const handleWeel = function (e: any) {
  if (e.wheelDelta < 0) {
    canvasController.zoom -= 0.1;
  } else {
    canvasController.zoom += 0.1;
  }
  if (canvasController.zoom >= 3) {
    canvasController.zoom = 3;
    return;
  }
  if (canvasController.zoom <= 0.01) {
    canvasController.zoom = 0.01;
    return;
  }

  canvasController.meter_zoom = canvasController.elWidth / 1000;
  canvasController.elWidth = canvasRef.value.clientWidth;
  canvasController.elHeight = canvasRef.value.clientHeight;
};

const showHint = ref(true);

// 监听背景图更换的时候
bus.on("onChangeBackground", () => {
  initBodySize();
  showHint.value = false;
});

function onDragStart(this: any, event: any) {
  app.stage.on("pointermove", onDragMove);
}

function onDragEnd(this: any, event: any) {
  app.stage.off("pointermove", onDragMove);
}

function onDragMove(this: any, event: any) {
  canvasController.elLeft += event.data.originalEvent.movementX; // 实现拖拽元素随偏移量移动
  canvasController.elTop += event.data.originalEvent.movementY;
}

// 初始化拖拽事件
const initDragEvent = () => {
  background.value.sprite.interactive = true;
  background.value.sprite.on("pointerdown", onDragStart);
  background.value.sprite.on("pointerup", onDragEnd);
  background.value.sprite.on("pointerupoutside", onDragEnd);
};

bus.on("initDragEvent", () => {
  initDragEvent();
});
onMounted(() => {
  document.getElementById("canvas")?.appendChild(app.view);
  const _controller = controller(app);
  bus.emit("initByCanvas", _controller);

  let bg = new Image();
  bg.src = nullSorite;

  const image = _controller.image();
  image.apply(bg, {
    x: size.width / 2,
    y: size.height / 2,
    width: size.width,
    height: size.height,
    zIndex: 0,
  });
  background.value = image;

  initBodySize();
  initDragEvent();
});
</script>
<template>
  <div class="canvas-Ref" ref="wrapperRef">
    <div class="pages">
      <div v-for="(item, index) in reportPrinterData">
        <div>{{ item.pageSetting.name }}</div>
        <el-icon><Close /></el-icon>
      </div>
      <div class="add">
        <el-icon><plus /></el-icon>
      </div>
    </div>
    <div class="hint" v-show="showHint">请先上传背图</div>
    <div
      id="canvas"
      ref="canvasRef"
      @wheel="handleWeel"
      :style="{
        left: `${canvasController.elLeft}px`,
        top: `${canvasController.elTop}px`,
        transform: `translate(-50%, -50%) scale(${canvasController.zoom})`,
      }"
    ></div>
  </div>
</template>
<style lang="scss" scoped>
.canvas-Ref {
  border: 2px solid var(--color-theme-dark);

  .pages {
    position: absolute;
    width: 100%;
    height: 28px;
    display: flex;
    padding: 0 2px;
    > div {
      font-size: 13px;
      cursor: pointer;
      display: flex;
      align-items: center;
      background-color: var(--color-theme-main);
      padding: 0px 8px;
      margin: 0 2px;
      border-radius: 4px;

      &:hover {
        background-color: var(--color-theme-hover);
      }
      .el-icon {
        margin-left: 4px;
      }
      &.add {
        .el-icon {
          margin-left: 0px;
        }
      }
    }
  }
  .drag-controller {
    position: absolute;
    cursor: move;
    z-index: 1;
  }
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  // overflow: auto;
  // display: flex;
  // justify-content: center;
  // align-items: center;
  background: var(--color-theme-dark) url(../../assets/tile.png) 56px 56px !important;
  .hint {
    position: absolute;
    z-index: 0;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    // background: rgba(0, 0, 0, 0.5);
    color: #fff;
    text-align: center;
    line-height: 100vh;
    font-size: 20px;
  }
  #canvas {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    .drag-controller {
      cursor: move;
      position: absolute;
      right: -20px;
      bottom: -20px;
    }
    border: 1px solid #ccc;
    text-align: center;
    canvas {
      padding: 20px;
    }
  }
}
</style>
