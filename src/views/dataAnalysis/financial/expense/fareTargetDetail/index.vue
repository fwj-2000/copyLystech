<!-- 费用目标 -->
<template>
  <TableLayout>
    <template #toolbarRight>
      <a-button @click="handleSave">保存</a-button>
    </template>
  </TableLayout>
</template>

<script lang="ts" setup>
  import { reactive, ref } from 'vue';
  import { getAllColumns, formOptions, batchMenuItems } from './config';
  import { useTableLayout } from '/@/views/dataAnalysis/components/TableLayout/useTableLayout';
  import { faretargetpage, updateTarget } from '/@/api/dataAnalysis/fare';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useI18n } from '/@/hooks/web/useI18n';

  import type { VxeGridProps } from 'vxe-table';
  const { createMessage, createConfirm } = useMessage();
  const { t } = useI18n();
  defineOptions({ name: 'dataAnalysis-financial-expense-fareTargetDetail' });

  const attrs = reactive<VxeGridProps<any>>({
    id: 'dataAnalysis-financial-expense-fareTargetDetail-list',
    proxyConfig: {
      response: {
        list: 'data.list',
        total: 'data.pagination.total',
      },
    },
    showOverflow: true,
    rowConfig: {
      resizable: true,
    },
    resizableConfig: {
      isAllRowDrag: true,
      isDblclickAutoWidth: true,
      isDblclickAutoHeight: true,
    },
    cellConfig: {
      height: 'auto' as any,
      verticalAlign: 'top',
    },
    keepSource: true,
    editConfig: {
      trigger: 'dblclick',
      mode: 'cell',
      showStatus: true,
    },
    // 禁用回车键功能，解决原生textarea 和 Textarea 无法回车换行的问题
    // keyboardConfig: {
    //   isEnter: false,
    // },
  });
  const columns = ref(getAllColumns());

  const [TableLayout, api] = useTableLayout({
    formConfig: {
      formOptions,
    },
    tableConfig: {
      columns,
      attrs,
      getExportParams: () => {
        const { getFormParams } = api.searchFormApi;
        const { startTime, endTime } = getFormParams();

        const filename = `费用目标明细_${startTime}-${endTime}`;
        return {
          filename,
        };
      },
      api: faretargetpage,
    },
    toolbarConfig: {
      batchMenuItems,
    },
  });
  const handleSave = () => {
    const { updateRecords } = api.getGridInstance().getRecordset();
    console.log('🚀 ~ handleSave ~ api.getGridInstance().getRecordset():', api.getGridInstance());
    if (updateRecords.length === 0) {
      createMessage.warning(t('dict.common.dataUnchanged'));
      return;
    }
    console.log('🚀 ~ handleSave ~ updateRecords:', updateRecords);
    const params = updateRecords.map(item => {
      return {
        unionStr: item.UnionStr ?? '',
        reason: item.Reason ?? '',
        measure: item.Measure ?? '',
      };
    });
    updateTarget(params)
      .then(({ code, msg }) => {
        if (code == 200) {
          createMessage.success(msg);
          api.getGridInstance().commitProxy('query');
        } else {
          createMessage.error(msg);
        }
      })
      .catch(() => {})
      .finally(() => {
        // saveLoading.value = false;
      });
  };
</script>

<style lang="less" scoped>
  @import url('/@/views/dataAnalysis/style.less');
</style>
