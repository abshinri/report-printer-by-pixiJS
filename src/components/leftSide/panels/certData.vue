<script lang="ts">
// 来自证照数据列表的模块
export default {
  name: "certDataPanel",
};
</script>
<script setup lang="ts">
import {
  ref,
  reactive,
  defineEmits,
  onMounted,
  inject,
  watch,
  nextTick,
} from "vue";

import mixin from "@/lib/mixin";
import bus from "@/lib/bus";
// 画布控制器
const controller = ref<any>(null);
// 元素池
const elementPool = inject<any>("elementPool");
// 当前选择的元素
const currentElements = inject<any>("currentElements");

// 是否需要注意清空的状态
let noClean = false;
bus.on("updateCurrentElements", () => {
  noClean = true;
  tableRef.value!.clearSelection();
  tableRef.value!.toggleRowSelection(currentElements.value[0], true);
  noClean = false;
});

const { activeElement, deactiveElement } = mixin();
const certData = ref<any>([
  {
    name: "证照名称",
    egName: "certName",
    content: "测试BLAHBLAHBLAH目录",
  },
  {
    name: "证照类型代码",
    egName: "certCode",
    content: "032123125123123124i",
  },
  {
    name: "证照编号",
    egName: "certNumber",
    content: "34123_231",
  },
  {
    name: "证照标识",
    egName: "certSign",
    content: "1.2.156.3005.2.062301.1101101102.0624_001.001.U",
  },
  {
    name: "DEMO1",
    egName: "DEMO1",
    content: "18000000000",
  },
  {
    name: "DEMO2",
    egName: "DEMO2",
    content: "1.2.QWEQWE624_001.001.U",
  },
  {
    name: "DEMO3",
    egName: "DEMO3",
    content: "qw1231_213123dasfffa+++U",
  },
  {
    name: "DEMO1",
    egName: "DEMO1",
    content: "18000000000",
  },
  {
    name: "DEMO2",
    egName: "DEMO2",
    content: "1.2.QWEQWE624_001.001.U",
  },
  {
    name: "DEMO3",
    egName: "DEMO3",
    content: "qw1231_213123dasfffa+++U",
  },
  {
    name: "证照名称",
    egName: "certName",
    content: "测试BLAHBLAHBLAH目录",
  },
  {
    name: "证照类型代码",
    egName: "certCode",
    content: "032123125123123124i",
  },
  {
    name: "证照编号",
    egName: "certNumber",
    content: "34123_231",
  },
  {
    name: "证照标识",
    egName: "certSign",
    content: "1.2.156.3005.2.062301.1101101102.0624_001.001.U",
  },
  {
    name: "DEMO1",
    egName: "DEMO1",
    content: "18000000000",
  },
  {
    name: "DEMO2",
    egName: "DEMO2",
    content: "1.2.QWEQWE624_001.001.U",
  },
  {
    name: "DEMO3",
    egName: "DEMO3",
    content: "qw1231_213123dasfffa+++U",
  },
  {
    name: "DEMO1",
    egName: "DEMO1",
    content: "18000000000",
  },
  {
    name: "DEMO2",
    egName: "DEMO2",
    content: "1.2.QWEQWE624_001.001.U",
  },
  {
    name: "DEMO3",
    egName: "DEMO3",
    content: "qw1231_213123dasfffa+++U",
  },
  {
    name: "证照名称",
    egName: "certName",
    content: "测试BLAHBLAHBLAH目录",
  },
  {
    name: "证照类型代码",
    egName: "certCode",
    content: "032123125123123124i",
  },
  {
    name: "证照编号",
    egName: "certNumber",
    content: "34123_231",
  },
  {
    name: "证照标识",
    egName: "certSign",
    content: "1.2.156.3005.2.062301.1101101102.0624_001.001.U",
  },
  {
    name: "DEMO1",
    egName: "DEMO1",
    content: "18000000000",
  },
  {
    name: "DEMO2",
    egName: "DEMO2",
    content: "1.2.QWEQWE624_001.001.U",
  },
  {
    name: "DEMO3",
    egName: "DEMO3",
    content: "qw1231_213123dasfffa+++U",
  },
  {
    name: "DEMO1",
    egName: "DEMO1",
    content: "18000000000",
  },
  {
    name: "DEMO2",
    egName: "DEMO2",
    content: "1.2.QWEQWE624_001.001.U",
  },
  {
    name: "DEMO3",
    egName: "DEMO3",
    content: "qw1231_213123dasfffa+++U",
  },
]);

// 初始化元素池,除了Sprite全部配置好
const initElementPool = () => {
  certData.value.forEach((item: any) => {
    elementPool.value.push(
      controller.value.text().init(item.egName, {
        type: "text",
        show: false,
        x: 0,
        y: 0,
        text: item.content || item.egName,
        ...item,
      })
    );
  });
};

// 添加一条数据到画布上
const onAddElement = (row: any) => {
  tableRef.value!.clearSelection();
  tableRef.value!.toggleRowSelection(row, true);
  activeElement(row.id);
  // currentElements.value = [row];
};

// 删除一条数据
const onRemoveElement = (row: any) => {
  tableRef.value!.clearSelection();
  tableRef.value!.toggleRowSelection(row, true);
  deactiveElement(row.id);
  // currentElements.value = [row];
};

const tableRef = ref<any>(null);
const tableSelection = ref<any[]>([]);
const toggleSelection = (rows?: any[]) => {
  if (rows) {
    rows.forEach((row) => {
      tableRef.value!.toggleRowSelection(row, undefined);
    });
  } else {
    tableRef.value!.clearSelection();
  }
};
const handleSelectionChange = (val: any[]) => {
  if (noClean) return;
  if (val.length > 0) {
    tableSelection.value = val;
    currentElements.value = elementPool.value.filter((element: any) => {
      return tableSelection.value.find(
        (tableElement: any) => tableElement.egName === element.id
      );
    });
  } else {
    currentElements.value = [];
  }

  bus.emit("updateCurrentTextStyle");
};

// 导入选择的数据
const importSelected = () => {
  tableSelection.value.forEach((row) => {
    if (row.sprite == null) {
      onAddElement(row);
    }
  });
};

// 初始化画布控制器,初始化完成才执行下面的操作
bus.on("initByCanvas", (_controller) => {
  controller.value = _controller;

  initElementPool();
});
</script>
<template>
  <div id="certDataPanel" class="certData-panel">
    <h3>证照数据</h3>
    <el-button link type="primary" size="small" @click="importSelected"
      >导入选中数据</el-button
    >
    <el-table
      ref="tableRef"
      :data="elementPool"
      style="margin: 10px 0; width: 100%"
      size="small"
      :height="`calc(100vh - 200px)`"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="30" />
      <el-table-column prop="name" label="字段名" />
      <el-table-column prop="egName" label="英文名" />
      <el-table-column prop="content" label="内容预览" />
      <el-table-column label="操作" align="center">
        <template #default="{ row }">
          <div style="text-align: center">
            <el-button
              link
              type="primary"
              size="small"
              @click="onAddElement(row)"
              :disabled="row.sprite != null"
              >添加</el-button
            >
            <el-button
              link
              type="danger"
              size="small"
              @click="onRemoveElement(row)"
              :disabled="row.sprite == null"
              >隐藏</el-button
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
