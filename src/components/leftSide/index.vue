<script lang="ts">
// 控制画布上元素增减的模块
export default {
  name: "LeftSide",
};
</script>
<script setup lang="ts">
import { ref, inject } from "vue";
import mixin from "@/lib/mixin";
import bus from "@/lib/bus";
import certDataPanel from "./panels/certData.vue";
// 矫正参数
const adjustPointsGroup = inject<any>("adjustPointsGroup");

// 套打背图
const background = inject<any>("background");
// 画布控制器
const controller = ref<any>(null);

// 初始化画布控制器
bus.on("initByCanvas", (_controller) => {
  controller.value = _controller;
});

//#endregion
</script>
<template>
  <div id="leftSide" class="left-side">
    <certDataPanel style="margin-top: 10px" />
  </div>
</template>
<style lang="scss" scoped>
@import "./index.scss";
#leftSide {
  height: 100vh;
  overflow-y: hidden;
  overflow-x: hidden;
  padding: 10px;
}
.title {
  padding-bottom: 5px;
  margin-bottom: 10px;
}
</style>
