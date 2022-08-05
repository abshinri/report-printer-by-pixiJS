<script setup lang="ts">
import { ref, onMounted, provide } from "vue";
import Canvas from "./components/canvas/index.vue";
import LeftSide from "./components/leftSide/index.vue";
import RightSide from "./components/rightSide/index.vue";
import Top from "./components/top/index.vue";
// 初始化画布元素池,导入所有的证照数据
const elementPool = ref<any>([]);
provide("elementPool", elementPool);
// 当前的元素的配置,多个元素则为默认配置
const currentElements = ref<any>([]);
provide("currentElements", currentElements);
// 报告打印矫正参数
const adjustPointsGroup = ref<any>({
  anchorPoints: { a: null, b: null },
  fixedPoints: { a: null, b: null },
  x: 0,
  y: 0,
  scaleX: 1,
  scaleY: 1,
});
provide("adjustPointsGroup", adjustPointsGroup);
// 套打底图的数据
const background = ref<any>({ hadImage: false });
provide("background", background);
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
.report-printer {
  .top {
    background: #38404e;
    width: 100vw;
    height: 80px;
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
      background: #38404e;
      height: 100%;
    }
    .left-side {
      height: 80px;
      width: 500px;
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
