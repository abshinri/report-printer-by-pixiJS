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
import { ElMessageBox, ElMessage } from "element-plus";
// 当前照面参数,包含矫正值,底图地址,照面名
const pageSetting = inject<any>("pageSetting");

// 画布窗口控制器
const canvasPanel = inject<any>("canvasPanel");

// 画布控制器
const controller = ref<any>(null);

// 鼠标指针信息
const cursorInfo = inject<any>("cursorInfo");
// 初始化画布控制器
bus.on("initByCanvas", (_controller) => {
  controller.value = _controller;
});
// 更改照面名字
const changePageName = () => {
  ElMessageBox.prompt("当前名: " + pageSetting.value.name, "更改照面名称", {
    customClass: "report-printer-dialog",
    confirmButtonText: "确认",
    cancelButtonText: "取消",
  })
    .then(({ value }) => {
      pageSetting.value.name = value;
    })
    .catch(() => {});
};
const save = () => {
  ElMessage("保存成功");
};
</script>
<template>
  <div id="leftSide" class="left-side">
    <div class="currentPageInfo">
      <div class="panel-title">窗口信息</div>
      <div class="row">
        <div class="label">照面名称</div>
        <div class="value">
          <div>{{ pageSetting.name }}</div>
          <el-icon style="cursor: pointer" @click="changePageName">
            <Edit />
          </el-icon>
        </div>
      </div>

      <div class="row">
        <div class="label">指针坐标</div>
        <div class="value">
          X:{{ cursorInfo.x.toFixed(3) }} - Y:{{ cursorInfo.y.toFixed(3) }}
        </div>
      </div>

      <div class="row">
        <div class="label">窗口缩放</div>
        <div class="value">
          <div>{{ canvasPanel.zoom.toFixed(2) }}</div>
          <el-icon style="cursor: pointer" @click="canvasPanel.zoom = 0.5">
            <Refresh />
          </el-icon>
        </div>
      </div>
    </div>
    <el-divider />
    <certDataPanel style="margin-top: 10px" />
    <div @click="save" class="save printer-btn">
      <div>保存配置</div>
      <el-icon><Document /></el-icon>
    </div>
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
.save {
  width: 100%;
  text-align: center;
}
.row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
  padding: 0 10px;
  .label {
    &::after {
      content: ":";
    }
    color: var(--el-color-info-dark-2);
  }
  .value {
    display: flex;
    align-items: center;
    .el-icon {
      margin-left: 4px;
    }
  }
}
</style>
