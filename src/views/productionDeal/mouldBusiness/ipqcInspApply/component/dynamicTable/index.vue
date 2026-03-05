<template>
  <div class="card mb-12px">
    <Card style="border-radius: 8px">
      <Subtitle :title="state.title" style="padding-bottom: 0" />
      <dynamicTable :dataSource="state.tableData" ref="dynamicTableRef"></dynamicTable>
    </Card>
  </div>
</template>
<script setup lang="ts">
  import { Subtitle } from '/@/components/Subtitle';
  import { ref, reactive, unref, watch } from 'vue';
  import dynamicTable from './dynamicTable.vue';
  import { cloneDeep } from 'lodash-es';
  import { Card } from 'ant-design-vue';
  import { InitParams, opreaMap } from './type';
  import { useI18n } from '/@/hooks/web/useI18n';

  const { t } = useI18n();
  const props = defineProps({
    tableData: [],
  });

  interface FormData {
    title: string;
    columns: string;
    schemas: string;
  }
  interface State extends FormData {
    tableData: any;
  }
  const state = reactive<State>({
    title: '',
    columns: '',
    schemas: '',
    tableData: [],
  });
  const dynamicTableRef = ref();

  watch(
    () => props.tableData,
    val => {
      state.tableData = val;
    },
    {
      immediate: true,
    },
  );

  async function init(data: InitParams) {
    const i18nField = `common.${opreaMap[data.title]}`;
    state.title = t(i18nField);
    unref(dynamicTableRef).init({
      ...data,
    });
  }

  async function getParamsFn() {
    return dynamicTableRef.value.validateFn();
  }

  defineExpose({
    init,
    getParamsFn,
  });
</script>
