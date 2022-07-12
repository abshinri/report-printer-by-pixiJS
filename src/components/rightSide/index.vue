<script lang="ts">
// 对选中元素细调的模块
export default {
  name: "RightSide",
};
</script>
<script setup lang="ts">
import bus from "@/lib/bus";
import { inject } from "vue";
// 当前元素
const currentElement = inject<any>("currentElement");
</script>
<template>
  <div id="rightSide">
    <h1 class="title">当前元素</h1>
    <div v-if="!currentElement">请先选择元素</div>
    <div v-else class="current-element">
      <div class="current-element-name">
        <span>ID：</span>
        <span class="current-element-name-content">{{
          currentElement.id
        }}</span>
      </div>
      <div class="current-element-type">
        <span>类型：</span>
        <span class="current-element-type-content">{{
          currentElement.type
        }}</span>
      </div>
      <div class="current-element-option">
        <span>配置项：</span>
        <div>
          <el-form-item label="字体大小">
            <el-input-number :min="1" v-model="currentElement.style.fontSize" />
          </el-form-item>
          <el-form-item label="字体">
            <el-input v-model="currentElement.style.fontFamily" />
          </el-form-item>
          <el-form-item label="对齐方式">
            <el-select v-model="currentElement.style.align">
              <el-option label="左对齐" value="left" />
              <el-option label="居中" value="center" />
              <el-option label="右对齐" value="right" />
            </el-select>
          </el-form-item>

          <el-form-item label="文本框宽度">
            <el-input-number
              v-model="currentElement.style.wordWrapWidth"
              :min="1"
            />
          </el-form-item>
          <el-button @click="currentElement.reset()">应用配置</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss">
#rightSide {
  padding: 10px;
}
.title {
  border-bottom: 3px solid var(--el-color-primary);
  padding-bottom: 5px;
  margin-bottom: 10px;
}
</style>
