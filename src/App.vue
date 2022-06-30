<script setup lang="ts">
import { ref, onMounted } from "vue";
import Canvas from "./components/canvas/index.vue";
import LeftSide from "./components/leftSide/index.vue";
import RightSide from "./components/rightSide/index.vue";
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
  display: flex;
  justify-content: space-between;
  background: #ddd;
  > div {
    background: #fff;
    height: 100%;
  }
  .left-side {
    width: 400px;
  }
  .canvas {
    flex: 1;
  }
  .right-side {
    width: 400px;
  }
}
</style>
