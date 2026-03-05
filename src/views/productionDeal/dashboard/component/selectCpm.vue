<template>
  <div class="select-block">
    <div class="cj-block" @click="showDrawer">
      <div> 平湖一厂-冲压A-C车间生产看板 </div>
      <div> WorkshopIPQCKanbanForW9-1F </div>
    </div>

    <div class="cj-drawer" v-if="visible">
      <LydcSelect
        class="cj-drawer-select"
        v-model:value="factory"
        :fieldNames="{ label: 'name', value: 'value' }"
        placeholder="请选择车间"
        showSearch
        allowClear
        :options="floorOptions" />

      <LydcSelect
        class="cj-drawer-select"
        v-model:value="floor"
        :fieldNames="{ label: 'name', value: 'value' }"
        placeholder="请选择楼层"
        showSearch
        allowClear
        :options="floorOptions" />
      <div class="footer text-right">
        <a-button size="small" @click="onClose" class="mr-12px">关闭</a-button>
        <!-- <a-button size="small" @click="onClose">取消</a-button> -->
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { ref } from 'vue';

  const visible = ref(false);
  const floor = ref(1);
  const factory = ref('');
  const floorOptions = [
    { name: '一楼', value: '1' },
    { name: '二楼', value: '2' },
  ];

  const showDrawer = () => {
    visible.value = true;
  };

  const onClose = () => {
    visible.value = false;
  };
</script>

<style lang="less" scoped>
  .select-block {
    display: flex;
    margin: 0 20px;
    height: 102px;
    align-items: center;
    border: 1px solid #4eecff;
    padding: 10px;
    box-sizing: border-box;
    cursor: pointer;
    position: relative;
  }

  .tree-select {
    width: 100%;
    height: 100%;
    opacity: 0;
    background: #000;
  }

  .cj-block {
    color: #4eecff;
    font-family: Roboto, sans-serif;
    font-size: 14px;
    font-style: normal;
    font-weight: 700;
    letter-spacing: 1.12px;
    position: relative;
  }

  .cj-drawer {
    z-index: 999;
    position: absolute;
    left: 0;
    bottom: -204px;
    background-color: #071d56;
    border: 1px solid #4eecff;
    // background-color: #fff;
    // opacity: 0.8;
    min-height: 200px;
    color: #fff;
    width: 100%;
    padding: 12px;

    &-select {
      width: 100%;
      margin-bottom: 24px;
    }
  }
</style>
