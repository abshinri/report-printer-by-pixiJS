<script lang="ts">
// 来自证照数据列表的模块
export default {
  name: "certDataPanel",
};
</script>
<script setup lang="ts">
import { ref, reactive, defineEmits, onMounted, inject } from "vue";
import mixin from "../mixin";
import bus from "@/lib/bus";
// 画布控制器
const controller = ref<any>(null);

// 初始化画布控制器
bus.on("initByCanvas", (_controller) => {
  controller.value = _controller;
});

// 元素池
const elementPool = inject<any>("elementPool");
const { addText } = mixin();
const certData = ref<any>([
  {
    type: "文字",
    name: "证照名称",
    egname: "certName",
    content: "测试BLAHBLAHBLAH目录",
  },
  {
    type: "文字",
    name: "证照类型代码",
    egname: "certCode",
    content: "032123125123123124i",
  },
  {
    type: "文字",
    name: "证照编号",
    egname: "certNumber",
    content: "34123_231",
  },
  {
    type: "文字",
    name: "证照标识",
    egname: "certSign",
    content: "1.2.156.3005.2.062301.1101101102.0624_001.001.U",
  },
]);

const onAddText = (row: any) => {
  addText(row.content, undefined, row.egname);
};

const removeText = (row: any) => {
  for (let i = 0; i < elementPool.value.length; i++) {
    const element = elementPool.value[i];
    if (element.id === row.egname) {
      element.remove();
      elementPool.value.splice(i, 1);
      break;
    }
  }
};
</script>
<template>
  <div id="certDataPanel" class="certData-panel">
    <h3>证照数据</h3>
    <el-table
      :data="certData"
      style="margin: 10px 0; width: 100%"
      size="small"
      max-height="600"
    >
      <el-table-column prop="type" label="类型" width="50" />
      <el-table-column prop="name" label="字段名" width="80" />
      <el-table-column prop="egname" label="英文名" width="80" />
      <el-table-column prop="content" label="内容预览" width="100" />
      <el-table-column label="操作" align="center">
        <template #default="{ row }">
          <div style="text-align: center">
            <el-button link type="primary" size="small" @click="onAddText(row)"
              >添加</el-button
            >
            <el-button link type="danger" size="small" @click="removeText(row)"
              >删除</el-button
            >
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<style lang="scss" scoped>
.certData-panel {
  width: 100%;
  ::v-deep(.el-table td.el-table__cell div) {
    text-overflow: -o-ellipsis-lastline;
    overflow: hidden; //溢出内容隐藏
    text-overflow: ellipsis; //文本溢出部分用省略号表示
    display: -webkit-box; //特别显示模式
    -webkit-line-clamp: 2; //行数
    line-clamp: 2;
    -webkit-box-orient: vertical; //盒子中内容竖直排列
  }
  ::v-deep(.el-button + .el-button) {
    margin-left: 0;
  }
}
</style>
