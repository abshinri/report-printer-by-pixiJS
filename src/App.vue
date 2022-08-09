<script setup lang="ts">
import { ref, reactive, onMounted, provide } from "vue";
import Canvas from "./components/canvas/index.vue";
import LeftSide from "./components/leftSide/index.vue";
import RightSide from "./components/rightSide/index.vue";
import Top from "./components/top/index.vue";

// 待提交的数据和套打时拿到的数据
const reportPrinterData = ref<any>([
  {
    elementPool: [],
    pageSetting: {
      anchorPoints: { a: null, b: null }, // 仅前端自用
      fixedPoints: { a: null, b: null }, // 仅前端自用
      x: 0,
      y: 0,
      scaleX: 1,
      scaleY: 1,
      name: "新照面",
      src: "",
    },
  },
]);
provide("reportPrinterData", reportPrinterData);

// 初始化画布元素池,导入所有的证照数据
const elementPool = ref<any>(reportPrinterData.value[0].elementPool);
provide("elementPool", elementPool);

// 当前的元素的配置,多个元素则为默认配置
const currentElements = ref<any>([]);
provide("currentElements", currentElements);

// 当前照面参数,包含矫正值,底图地址,照面名
const pageSetting = ref<any>(reportPrinterData.value[0].pageSetting);
provide("pageSetting", pageSetting);

// 套打底图的数据
const background = ref<any>({ hadImage: false });
provide("background", background);

// 鼠标指针信息
const cursorInfo = ref<any>({
  x: 0,
  y: 0,
  zoom: 0.5,
});
provide("cursorInfo", cursorInfo);

// 画布窗口控制器
const canvasPanel = reactive<any>({
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
provide("canvasPanel", canvasPanel);
</script>

<template>
  <div class="report-printer">
    <Top ref="topRef" class="top"></Top>
    <div class="content">
      <LeftSide ref="leftSideRef" class="left-side"></LeftSide>
      <Canvas ref="canvasRef" class="canvas"></Canvas>
      <RightSide ref="rightSideRef" class="right-side"></RightSide>
    </div>
  </div>
</template>

<style lang="scss">
@import "./assets/base.css";
html {
  overflow: hidden;
  &::-webkit-scrollbar {
    display: none;
  }
}
.report-printer {
  .top {
    background: var(--color-theme-main);
    width: 100vw;
    height: 70px;
    font-size: 14px;
  }
  .content {
    user-select: none;
    width: 100%;
    height: 100vh;
    overflow: hidden;
    display: flex;
    justify-content: space-between;
    background: #ddd;
    > div {
      background: var(--color-theme-main);
      height: 100%;
    }
    .left-side {
      height: 80px;
      width: 400px;
    }
    .canvas {
      flex: 1;
    }
    .right-side {
      width: 400px;
    }
  }
}
</style>
