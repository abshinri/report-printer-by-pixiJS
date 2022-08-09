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
// 鼠标指针信息
const cursorInfo = inject<any>("cursorInfo");

app.stage.interactive = true;
app.stage.sortableChildren = true;

// 画布窗口控制器
const canvasPanel = inject<any>("canvasPanel");

const wrapperRef = ref<any>(null);
const canvasRef = ref<any>(null);

// 页面初始化
const initBodySize = function () {
  canvasPanel.initWidth = wrapperRef.value.clientWidth;
  canvasPanel.initHeight = wrapperRef.value.clientHeight;
  canvasPanel.elWidth = canvasRef.value.clientWidth;
  canvasPanel.elHeight = canvasRef.value.clientHeight;
  canvasPanel.meter_zoom = canvasPanel.elWidth / 1000;
  canvasPanel.elLeft = canvasPanel.initWidth / 2;
  canvasPanel.elTop = canvasPanel.initHeight / 2;

  canvasPanel.zoom = 0.5;
};

const handleWeel = function (e: any) {
  if (e.wheelDelta < 0) {
    canvasPanel.zoom -= 0.1;
  } else {
    canvasPanel.zoom += 0.1;
  }
  if (canvasPanel.zoom >= 3) {
    canvasPanel.zoom = 3;
    return;
  }
  if (canvasPanel.zoom <= 0.01) {
    canvasPanel.zoom = 0.01;
    return;
  }

  canvasPanel.meter_zoom = canvasPanel.elWidth / 1000;
  canvasPanel.elWidth = canvasRef.value.clientWidth;
  canvasPanel.elHeight = canvasRef.value.clientHeight;
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
  canvasPanel.elLeft += event.data.originalEvent.movementX; // 实现拖拽元素随偏移量移动
  canvasPanel.elTop += event.data.originalEvent.movementY;
}

function onMouseStart(this: any, event: any) {
  app.stage.on("pointermove", onMouseMove);
}
function onMouseEnd(this: any, event: any) {
  app.stage.off("pointermove", onMouseMove);
}
function onMouseMove(this: any, event: any) {
  cursorInfo.value.x = event.data.global.x;
  cursorInfo.value.y = event.data.global.y;
}
// 初始化拖拽事件
const initDragEvent = () => {
  background.value.sprite.interactive = true;
  background.value.sprite.on("pointerdown", onDragStart);
  background.value.sprite.on("pointerup", onDragEnd);
  background.value.sprite.on("pointerupoutside", onDragEnd);
  app.stage.on("pointerover", onMouseStart);
  app.stage.on("pointerout", onMouseEnd);

  // app.stage.on("pointermove", (e: any) => {
  //   console.log(e.screen.x);
  // });
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
        left: `${canvasPanel.elLeft}px`,
        top: `${canvasPanel.elTop}px`,
        transform: `translate(-50%, -50%) scale(${canvasPanel.zoom})`,
      }"
    ></div>
  </div>
</template>
<style lang="scss" scoped>
.canvas-Ref {
  border: 2px solid var(--color-theme-dark);

  .pages {
    top: 3px;
    position: absolute;
    z-index: 2;
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
      box-shadow: 1px 1px 8px rgba(0, 0, 0, 0.3);
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
    z-index: 1;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    padding: 10px 10px 5px;
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
