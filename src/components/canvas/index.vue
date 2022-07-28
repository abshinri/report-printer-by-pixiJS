<script lang="ts">
// 核心套打展示层
export default {
  name: "Canvas",
};
</script>
<script setup lang="ts">
import { ref, reactive, defineExpose, onMounted } from "vue";
import bus from "@/lib/bus";
import controller from "./lib/controller";

import * as PIXI from "pixi.js";

const app = new PIXI.Application({
  backgroundAlpha: 0,
  width: 320,
  height: 240,
});
app.stage.interactive = true;
app.stage.sortableChildren = true;

const canvasController = reactive<any>({
  initWidth: 0, // 父元素的宽-自适应值
  initHeight: 0, // 父元素的高-自适应值
  startclientX: 0, // 元素拖拽前距离浏览器的X轴位置
  startclientY: 0, //元素拖拽前距离浏览器的Y轴位置
  elLeft: 0, // 元素的左偏移量
  elTop: 0, // 元素的右偏移量

  zoom: 1, // 缩放比例
  elWidth: 0, // 元素宽
  elHeight: 0, // 元素高
  meter_zoom: 0, // 子元素缩放比例
});

const dragstart = (e: any) => {
  canvasController.startclientX = e.clientX; // 记录拖拽元素初始位置
  canvasController.startclientY = e.clientY;
};
const drag = (e: any) => {
  // let x = e.clientX - canvasController.startclientX; // 计算偏移量
  // let y = e.clientY - canvasController.startclientY;
  // canvasController.elLeft = x; // 实现拖拽元素随偏移量移动
  // canvasController.elTop = y;
};
const dragend = (e: any) => {
  let x = e.clientX - canvasController.startclientX; // 计算偏移量
  let y = e.clientY - canvasController.startclientY;
  canvasController.elLeft += x; // 实现拖拽元素随偏移量移动
  canvasController.elTop += y;
};

const wrapperRef = ref<any>(null);
const canvasRef = ref<any>(null);

// 页面初始化
const initBodySize = function () {
  canvasController.initWidth = wrapperRef.value.clientWidth;
  canvasController.initHeight = wrapperRef.value.clientHeight;
  canvasController.elWidth = canvasRef.value.clientWidth;
  canvasController.elHeight = canvasRef.value.clientHeight;
  canvasController.meter_zoom = canvasController.elWidth / 100;
  canvasController.elLeft = canvasController.initWidth / 2;
  canvasController.elTop = canvasController.initHeight / 2;
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

  canvasController.meter_zoom = canvasController.elWidth / 100;
  canvasController.elWidth = canvasRef.value.clientWidth;
  canvasController.elHeight = canvasRef.value.clientHeight;
};

const showHint = ref(true);

// 监听背景图更换的时候
bus.on("onChangeBackground", () => {
  initBodySize();
  showHint.value = false;
});
onMounted(() => {
  document.getElementById("canvas")?.appendChild(app.view);
  bus.emit("initByCanvas", controller(app));

  initBodySize();
});
</script>
<template>
  <div class="canvas-Ref" ref="wrapperRef">
    <el-icon
      class="drag-controller"
      style="top: 0; left: 0"
      draggable="true"
      color="#666"
      size="24px"
      @dragstart="dragstart($event)"
      @drag="drag($event)"
      @dragend="dragend($event)"
      ><Rank
    /></el-icon>
    <el-icon
      class="drag-controller"
      style="right: 0; top: 0"
      draggable="true"
      color="#666"
      size="24px"
      @dragstart="dragstart($event)"
      @drag="drag($event)"
      @dragend="dragend($event)"
      ><Rank
    /></el-icon>
    <el-icon
      class="drag-controller"
      style="right: 0; bottom: 0"
      draggable="true"
      color="#666"
      size="24px"
      @dragstart="dragstart($event)"
      @drag="drag($event)"
      @dragend="dragend($event)"
      ><Rank
    /></el-icon>
    <el-icon
      class="drag-controller"
      style="left: 0; bottom: 0"
      draggable="true"
      color="#666"
      size="24px"
      @dragstart="dragstart($event)"
      @drag="drag($event)"
      @dragend="dragend($event)"
      ><Rank
    /></el-icon>
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
<style lang="scss">
.canvas-Ref {
  border:2px solid #38404e;
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
  background: #38404e url(../../assets/tile.png) 56px 56px !important;
  .hint {
    position: absolute;
    z-index: 0;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background: rgba(0, 0, 0, 0.5);
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
