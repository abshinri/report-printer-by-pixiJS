<script lang="ts">
// 核心套打展示层
export default {
  name: "Canvas",
};
</script>
<script setup lang="ts">
import { defineExpose, onMounted } from "vue";
import bus from "@/lib/bus";
import controller from "./lib/controller";

import * as PIXI from "pixi.js";
import { Layer } from "@pixi/layers";
const layer = new Layer();

const app = new PIXI.Application({ backgroundAlpha: 0 });
app.stage.interactive = true;
app.stage.sortableChildren = true;
app.stage.addChild(layer);
onMounted(() => {
  document.getElementById("canvas")?.appendChild(app.view);
  bus.emit("initByCanvas", controller(app, layer));
});
</script>
<template>
  <div class="canvas-wrapper">
    <div class="hint">请先上传背图</div>
    <div id="canvas"></div>
  </div>
</template>
<style lang="scss">
.canvas-wrapper {
  position: relative;
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
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
  canvas {
    text-align: center;
    border: 1px solid #ccc;
    width: auto;
    height: auto;
    max-width: 100%;
    max-height: 100vh;
  }
}
</style>
