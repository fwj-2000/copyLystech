<template>
  <a-modal v-model:open="visible" title="表格选择器" @cancel="closePicker" @ok="confirmSelection" style="width: 700px">
    <div class="picker-container">
      <div class="input-container">
        <a-input v-model:value="inputRows" :min="1" :max="maxRows" placeholder="行数" @change="updateGrid">
          <template #prefix> 行数 </template>
        </a-input>
        <a-input v-model:value="inputCols" :min="1" :max="maxCols" placeholder="列数" @change="updateGrid">
          <template #prefix> 列数 </template>
        </a-input>
      </div>
      <div class="picker-modal">
        <div class="table-picker">
          <div v-for="row in maxRows" :key="row" class="row">
            <div
              v-for="col in maxCols"
              :key="col"
              class="cell"
              :class="{
                preview: row <= hoverRows && col <= hoverCols,
                active: row <= selectedRows && col <= selectedCols,
              }"
              @mouseover="setHover(row, col)"
              @click="selectGrid(row, col)"></div>
          </div>
        </div>
        <div class="picker-info">
          <span v-if="hoverRows && hoverCols">预览: {{ hoverRows }} x {{ hoverCols }}</span>
          <span v-if="selectedRows && selectedCols"> | 已选: {{ selectedRows }} x {{ selectedCols }}</span>
        </div>
        <div class="picker-result" v-if="selectedRows && selectedCols"> 选中表格：{{ selectedRows }} 行 × {{ selectedCols }} 列 </div>
      </div>
    </div>
    <template #footer>
      <a-button key="back" @click="closePicker">取消</a-button>
      <a-button key="submit" type="primary" @click="confirmSelection">确定</a-button>
    </template>
  </a-modal>
</template>

<script setup lang="ts">
  import { ref, watch } from 'vue';
  import { Modal as AModal, Input as AInput, Button as AButton } from 'ant-design-vue';

  interface TableSelection {
    rows: number;
    cols: number;
  }

  const visible = defineModel('visible', {
    type: Boolean,
    default: false,
  });

  const emit = defineEmits<{
    (e: 'update:visible', value: boolean): void;
    (e: 'select', value: TableSelection): void;
  }>();

  const maxRows = ref(8);
  const maxCols = ref(10);
  const hoverRows = ref<number>(0);
  const hoverCols = ref<number>(0);
  const selectedRows = ref<number>(0);
  const selectedCols = ref<number>(0);
  const inputRows = ref<number>(0);
  const inputCols = ref<number>(0);

  const setHover = (rows: number, cols: number): void => {
    hoverRows.value = rows;
    hoverCols.value = cols;
  };

  const selectGrid = (rows: number, cols: number): void => {
    selectedRows.value = rows;
    selectedCols.value = cols;
    inputRows.value = rows;
    inputCols.value = cols;
  };

  const resetHover = (): void => {
    hoverRows.value = 0;
    hoverCols.value = 0;
  };

  const updateGrid = (): void => {
    if (inputRows.value && inputCols.value) {
      selectedRows.value = inputRows.value;
      selectedCols.value = inputCols.value;
    }
  };

  const confirmSelection = (): void => {
    if (selectedRows.value && selectedCols.value) {
      emit('select', { rows: selectedRows.value, cols: selectedCols.value });
      closePicker();
    }
  };

  const closePicker = (): void => {
    emit('update:visible', false);
    resetHover();
  };
</script>

<style scoped>
  .picker-container {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .input-container {
    display: flex;
    gap: 10px;
    margin-bottom: 15px;
  }

  .picker-modal {
    position: relative;
    background-color: white;
    padding: 20px;
    border-radius: 8px;
  }

  .table-picker {
    display: inline-block;
    padding: 8px;
    border: 1px solid #ccc;
    user-select: none;
  }

  .row {
    display: flex;
  }

  .cell {
    width: 45px;
    height: 45px;
    border: 1px solid #ddd;
    background-color: white;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .cell.preview {
    background-color: #e0e0e0; /* 灰色预览 */
  }

  .cell.active {
    background-color: #f93; /* 橙色确认 */
  }

  .cell:hover {
    background-color: #c0c0c0; /* 悬停时稍深的灰色 */
  }

  .picker-info {
    margin-top: 5px;
    font-size: 12px;
    color: #555;
    text-align: center;
  }

  .picker-result {
    margin-top: 10px;
    font-weight: bold;
    text-align: center;
    color: #333;
  }
</style>
