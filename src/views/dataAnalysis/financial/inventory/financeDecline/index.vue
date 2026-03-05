<!-- 财务存跌金额 -->
<template>
  <TableLayout />
  <ExportModal @register="registerExportModal" :dataType="1" />
</template>

<script lang="ts" setup>
  import type { VxeGridProps } from 'vxe-table';
  import { isEmpty } from 'lodash-es';
  import { ref, reactive, watch, onMounted, computed } from 'vue';
  import { getAllColumns, formOptions } from './config';

  import { useTableLayout } from '/@/views/dataAnalysis/components/TableLayout/useTableLayout';
  import { getFinancedecline, getfinanceBukrsParamSelect, ExportDataFinanceDecline } from '/@/api/dataAnalysis/financial';
  import { useModal } from '/@/components/Modal';
  import { downloadByUrl } from '/@/utils/file/download';
  import ExportModal from '/@/components/ExportModal/index.vue';

  defineOptions({ name: 'dataAnalysis-financial-inventory-financeDecline' });

  const attrs = reactive<VxeGridProps<any>>({
    id: 'dataAnalysis-financial-inventory-financeDecline-list',
    proxyConfig: {
      response: {
        list: 'data.list',
        total: 'data.pagination.total',
      },
    },
  });
  const [registerExportModal, { openModal: openExportModal, closeModal }] = useModal();

  const columns = ref(getAllColumns());
  const [TableLayout, api] = useTableLayout({
    formConfig: {
      formOptions,
    },
    tableConfig: {
      columns,
      attrs,
      // getExportParams: () => {
      //   const { getFormParams } = api.searchFormApi;
      //   const { month } = getFormParams();
      //   const filename = `财务存跌金额${month}`;
      //   return {
      //     filename,
      //   };
      // },
      api: getFinancedecline,
    },
    toolbarConfig: {
      baseExportMethod: () => {
        const { getFormParams } = api.searchFormApi;
        openExportModal(true, {
          api: ExportDataFinanceDecline,
          listQuery: getFormParams(),
          exportOptions: columns.value,
          nameProps: 'title',
          idProps: 'field',
        });
      },
    },
  });

  onMounted(() => {
    const { state } = api.searchFormApi;
    // 拉取项目下拉
    watch(
      [() => state.searchLoading, () => state.searchFormValue.orgCode, () => state.searchFormValue.month, () => state.searchFormValue.dimension],
      () => {
        if (!state.searchLoading && !isEmpty(state.searchFormValue)) {
          getDimensionWordNoSearchparameterInfo();
        }
      },
      { immediate: true, deep: true },
    );
  });

  // 获取查询参数信息
  function getDimensionWordNoSearchparameterInfo() {
    const { state, getFormParams, setState } = api.searchFormApi;
    const { orgCode, month } = getFormParams();
    getfinanceBukrsParamSelect({
      orgCode,
      month,
    }).then(({ data }) => {
      const keyIdx = formOptions.findIndex(item => item.key === 'bukrs');
      if (state.formOptions[keyIdx]) {
        const options = data.map(item => ({
          text: item,
          value: item,
        }));
        setState(`formOptions.${keyIdx}.options`, options);
      }
    });
  }
  // 关闭导出
  function exportAction(query) {
    ExportDataFinanceDecline(query).then(res => {
      if (!res.data.url) return;
      downloadByUrl({ url: res.data.url });
      closeModal();
    });
  }
</script>

<style lang="less">
  @import url('/@/views/dashboard/style.less');
</style>
