<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="`${processName}工序`" :showOkBtn="false" width="1300px">
    <Grid class="grid-header">
      <template #toolbar-actions>
        <a-space>
          <!-- 批量导出 -->
          <a-button class="mr-12px" @click="handleExport" v-auth="'btn_download'">{{ t('common.batchExport') }}</a-button>
        </a-space>
      </template>
    </Grid>
  </BasicModal>
</template>
<script setup lang="ts">
  import { ref } from 'vue';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { BasicModal, useModalInner } from '/@/components/Modal';

  import { useI18n } from '/@/hooks/web/useI18n';
  import { processColumn } from '../config.ts';
  import { processscheduleplandetailExport } from '/@/api/engineering/mould';
  import { downloadByUrl } from '/@/utils/file/download';

  const emit = defineEmits(['register', 'added', 'reload']);
  const { t } = useI18n();

  const [Grid, gridApi] = useVbenVxeGrid({
    gridOptions: {
      id: 'engineering-mouldRoom-processSchedule-processList',
      height: 450,
      columns: processColumn,
      pagerConfig: {
        autoHidden: true,
      },
      showIndexColumn: true,
      i18nConfig: {
        moduleCode: 'ProcessScheduleColumn',
      },
    },
  });

  const [registerModal] = useModalInner(init);
  const processName = ref('');
  async function init({ detailList, row }) {
    processName.value = row.processName;
    gridApi.reloadData(detailList);
  }

  // 批量导出
  const handleExport = async () => {
    const data = gridApi.grid.getTableData().fullData;
    processscheduleplandetailExport(data).then(res => {
      if (!res.data.url) return;
      downloadByUrl({ url: res.data.url });
    });
  };
</script>
