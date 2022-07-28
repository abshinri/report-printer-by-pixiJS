<script lang="ts">
// 对选中元素细调的模块
export default {
  name: "RightSide",
};
</script>
<script setup lang="ts">
import bus from "@/lib/bus";
import { inject, ref, watch } from "vue";

import { Check, Close } from "@element-plus/icons-vue";

import mixin from "@/lib/mixin";

const { activeElement } = mixin();

// 当前元素
const currentElements = inject<any>("currentElements");
const elementPool = inject<any>("elementPool");
const tempTextStyle = {
  fill: "#000000",
  fontWeight: "normal",
  fontFamily: "微软雅黑",
  fontStyle: "normal",
  fontSize: 24,
  textBaseline: "alphabetic",
  lineHeight: "",
  letterSpacing: 0,
  leading: 0,
  padding: 0,
  breakWords: true,
  wordWrap: true,
  wordWrapWidth: 320,
  align: "left",
};
const currentElementStyle = ref<any>(JSON.parse(JSON.stringify(tempTextStyle)));
// 更新当前样式
bus.on("updateCurrentTextStyle", () => {
  if (currentElements.value.length == 1) {
    currentElementStyle.value = currentElements.value[0].style;
  } else {
    currentElementStyle.value = JSON.parse(JSON.stringify(tempTextStyle));
  }
});
// 应用样式
const applyStyle = () => {
  currentElements.value.forEach((currentElement: any) => {
    // 遍历元素池
    elementPool.value.forEach((e: any) => {
      if (e.id == currentElement.id) {
        if (e.sprite == null) {
          activeElement(e.id, { style: currentElementStyle.value });
        } else {
          e.style = currentElementStyle.value;
          e.reset();
        }
      }
    });
  });
};
</script>
<template>
  <div id="rightSide">
    <h2 class="title">当前元素</h2>
    <div class="empty" v-if="currentElements.length == 0">请先选择元素</div>
    <div v-else class="current-element">
      <div>当前选择元素:</div>
      <span
        class="current-element-name"
        style="padding: 5px"
        v-for="item in currentElements"
      >
        <span>{{ item.id }}</span>
      </span>
      <div class="current-element-option">
        <h3>配置项：</h3>
        <div>
          <el-form-item label="使用字体">
            <el-input v-model="currentElementStyle.fontFamily" />
          </el-form-item>
          <el-form-item label="字体大小">
            <el-input-number
              v-model="currentElementStyle.fontSize"
              :min="1"
              controls-position="right"
            />
          </el-form-item>
          <el-form-item label="文字间距">
            <el-input-number
              v-model="currentElementStyle.letterSpacing"
              :min="0"
              controls-position="right"
            />
          </el-form-item>
          <el-form-item label="行高标准">
            <el-select v-model="currentElementStyle.textBaseline">
              <el-option label="alphabetic" value="alphabetic" />
              <el-option label="底部" value="bottom" />
              <el-option label="中间" value="middle" />
              <el-option label="顶部" value="top" />
              <el-option label="hanging" value="hanging" />
            </el-select>
          </el-form-item>
          <el-form-item label="文本行高">
            <div v-if="currentElementStyle.lineHeight == ''">
              <el-input style="width: 150px" placeholder="默认" disabled />
              <span style="margin-left: 12px">默认行高</span>
              <el-switch
                :model-value="true"
                style="margin-left: 12px"
                class="mt-2"
                @click="currentElementStyle.lineHeight = 1"
                inline-prompt
                :active-icon="Check"
                :inactive-icon="Close"
              />
            </div>
            <div v-else>
              <el-input-number
                v-model="currentElementStyle.lineHeight"
                :min="1"
                controls-position="right"
              />
              <span style="margin-left: 12px">默认行高</span>
              <el-switch
                :model-value="false"
                style="margin-left: 12px"
                class="mt-2"
                @click="currentElementStyle.lineHeight = ''"
                inline-prompt
                :active-icon="Check"
                :inactive-icon="Close"
              />
            </div>
          </el-form-item>
          <el-form-item label="每行间距">
            <el-input-number
              v-model="currentElementStyle.leading"
              :min="0"
              controls-position="right"
            />
          </el-form-item>
          <el-form-item label="文本宽度">
            <el-input-number
              v-model="currentElementStyle.wordWrapWidth"
              :min="1"
              controls-position="right"
              :disabled="!currentElementStyle.wordWrap"
            />
            <span style="margin-left: 12px">启用换行</span>
            <el-switch
              v-model="currentElementStyle.wordWrap"
              style="margin-left: 12px"
              class="mt-2"
              inline-prompt
              :active-icon="Check"
              :inactive-icon="Close"
            />
          </el-form-item>
          <el-form-item label="文字颜色">
            <el-color-picker v-model="currentElementStyle.fill" />
            <span style="margin-left: 12px">{{
              currentElementStyle.fill
            }}</span>
          </el-form-item>
          <el-form-item label="文本对齐">
            <el-select v-model="currentElementStyle.align">
              <el-option label="左对齐" value="left" />
              <el-option label="居中" value="center" />
              <el-option label="右对齐" value="right" />
            </el-select>
          </el-form-item>
          <el-form-item label="文本粗细">
            <el-select v-model="currentElementStyle.fontWeight">
              <el-option label="正常" value="normal" />
              <el-option label="加粗" value="bold" />
              <el-option label="更粗" value="bolder" />
              <el-option label="更细" value="lighter" />
              <el-option label="100" value="100" />
              <el-option label="200" value="200" />
              <el-option label="300" value="300" />
              <el-option label="400" value="400" />
              <el-option label="500" value="500" />
              <el-option label="600" value="600" />
              <el-option label="700" value="700" />
              <el-option label="800" value="800" />
              <el-option label="900" value="900" />
            </el-select>
          </el-form-item>
          <el-form-item label="文字倾斜">
            <el-select v-model="currentElementStyle.fontStyle">
              <el-option label="不倾斜" value="normal" />
              <el-option label="字体倾斜" value="italic" />
              <el-option label="强行倾斜" value="oblique" />
            </el-select>
          </el-form-item>
          <el-form-item label="本文边距">
            <el-input-number
              v-model="currentElementStyle.padding"
              :min="0"
              controls-position="right"
            />
          </el-form-item>
          <el-button style="width: 100%" @click="applyStyle"
            >应用配置</el-button
          >
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss">
#rightSide {
  height: 100vh;
  overflow-y: hidden;
  overflow-x: hidden;
  padding: 10px;
}
.empty {
  font-size: 32px;
  text-align: center;
  padding: 10px;
  color: var(--el-color-info-light-5);
  word-break: break-all;
}
.title {
  border-bottom: 3px solid var(--el-color-primary);
  padding-bottom: 5px;
  margin-bottom: 10px;
}
</style>
