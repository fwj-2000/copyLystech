<script setup lang="ts">
  import { FilterOutlined } from '@ant-design/icons-vue';
  import { ref, defineAsyncComponent } from 'vue';
  const SuperQueryWrap = defineAsyncComponent(() => import('./SuperQueryWrap.vue'));
  const emits = defineEmits(['superQuery', 'close', 'open']);
  defineOptions({
    name: 'SuperQueryPopover',
  });
  const props = withDefaults(
    defineProps<{
      columnsOps?: any[];
    }>(),
    {},
  );

  // 校验字符串是否是纯数字
  function getcSharpType(groupItem: any) {
    // 仅校验lydc为select、apiselect的组件值
    const _component = groupItem.lydcKey || groupItem.__config__.lydcKey;
    const cSharpType = groupItem.cSharpType;
    if (cSharpType) return cSharpType;
    if (['Select', 'ApiSelect'].includes(_component)) {
      const value = groupItem.fieldValue;
      if (typeof value === 'number') return 'int';
      if (!value || value === '') return 'string';
      const isNum = /^\d+$/.test(value) ? 'int' : 'string';
      return isNum;
    }
    return 'string';
  }
  // 事件处理函数
  const handleSuperQuery = queryStr => {
    if (queryStr === '') return emits('superQuery', '');
    if (!queryStr) return;
    const queryObj = JSON.parse(queryStr);
    // 调整数据
    queryObj.conditionList.forEach(item => {
      item.groups = item.groups.map(groupItem => {
        return {
          field: groupItem.field,
          fieldValue: groupItem.fieldValue,
          symbol: groupItem.symbol,
          cSharpType: getcSharpType(groupItem),
        };
      });
    });
    emits('superQuery', JSON.stringify(queryObj));
    visabled.value = false;
  };
  const handleClose = () => {
    visabled.value = false;
  };
  const visabled = ref(false);
  const initSuperQuery = ref(0);
  function handleVisabledChange(value: boolean) {
    if (value) {
      initSuperQuery.value++;
    }
  }
</script>

<template>
  <a-popover v-model:open="visabled" placement="bottomRight" trigger="click" @openChange="handleVisabledChange">
    <template #content>
      <div style="min-width: 900px">
        <SuperQueryWrap targetType="vxeTable" :columnsOps="props.columnsOps" :init="initSuperQuery" @super-query="handleSuperQuery" @close="handleClose" />
      </div>
    </template>
    <button class="super-query-icon vxe-button type--button size--small is--circle" title="高级查询" type="button">
      <FilterOutlined></FilterOutlined>
    </button>
  </a-popover>
</template>
<style lang="less" scoped>
  .super-query-icon {
    border-radius: 0% !important;
    margin-right: -10px !important;
  }
</style>
