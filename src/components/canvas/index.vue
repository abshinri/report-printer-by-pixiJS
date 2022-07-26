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

// 获取元素的宽高

onMounted(() => {
  const canvasElement: any = document.getElementById("canvas");
  const app = new PIXI.Application({
    width: canvasElement.clientWidth,
    height: canvasElement.clientHeight,
    resizeTo: canvasElement,
    backgroundAlpha: 0,
  });

  app.stage.interactive = true;
  app.stage.sortableChildren = true;

  canvasElement.appendChild(app.view);

  // app.stage.pivot.x = app.screen.width / 2;
  // app.stage.pivot.y = app.screen.height / 2;

  // 规划好各个容器层
  const containers = {
    // 核心内容,承载底图和打印内容
    // main: new PIXI.Container(),
    // 放背图
    background: new PIXI.Container(),
    // 放待打印内容
    content: new PIXI.Container(),
    // 打印层
    // printer: new PIXI.Container(),
    // 辅助内容
    assist: new PIXI.Container(),
  };

  containers.background.sortableChildren = true;

  containers.content.interactive = true;
  // containers.content.sortableChildren = true;

  containers.assist.interactive = true;
  containers.assist.sortableChildren = true;

  // app.stage.addChild(containers.main);
  app.stage.addChild(containers.background);
  app.stage.addChild(containers.content);
  
  app.stage.addChild(containers.assist);



  // containers.main.addChild(containers.background);
  // containers.main.addChild(containers.printer);

  // containers.printer.addChild(containers.content);

  bus.emit("initByCanvas", controller(app, containers));
});
</script>
<template>
  <div class="canvas-wrapper" id="canvas-wrapper">
    <div class="hint">请先上传背图</div>
    <div id="canvas"></div>
  </div>
</template>
<style lang="scss">
.canvas-wrapper {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  // overflow: auto;
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
  #canvas {
    background: #38404e url(../../assets/tile.png) 56px 56px;
    text-align: center;
    border: 1px solid #ccc;
    width: 100%;
    height: 100%;
    // max-width: 100%;
    // max-height: 100vh;
  }
}
</style>
