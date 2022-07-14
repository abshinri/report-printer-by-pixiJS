<script setup lang="ts">
import { ref, onMounted, provide } from "vue";
import Canvas from "./components/canvas/index.vue";
import LeftSide from "./components/leftSide/index.vue";
import RightSide from "./components/rightSide/index.vue";

// 初始化画布元素池,导入所有的证照数据
const elementPool = ref<any>([]);
provide("elementPool", elementPool);
// 当前的元素的配置,多个元素则为默认配置
const currentElements = ref<any>([]);
provide("currentElements", currentElements);
</script>

<template>
  <div class="report-printer">
    <LeftSide ref="leftSideRef" class="left-side"></LeftSide>
    <Canvas ref="canvasRef" class="canvas"></Canvas>
    <RightSide ref="rightSideRef" class="right-side"></RightSide>
  </div>
</template>

<style lang="scss">
@import "./assets/base.css";
.report-printer {
  width: 100%;
  height: 100vh;
  overflow: hidden;
  display: flex;
  justify-content: space-between;
  background: #ddd;
  > div {
    background: #fff;
    height: 100%;
  }
  .left-side {
    width: 500px;
  }
  .canvas {
    flex: 1;
  }
  .right-side {
    width: 400px;
  }
}
</style>
