<template>
  <Grid>
    <template #buttons>
      <Subtitle :title="t('dict.CommonCol.moldDrawingsName')" class="pb-none" />
      <a-button v-auth="'btn_drawingsDownload'" type="primary" ghost @click="handleDownloadDrawings">{{ t('common.downloadDrawingText') }}</a-button>
    </template>

    <template #moldDrawings="{ row }">
      <FileListCell :row="row" :list="row.moldDrawings" />
    </template>
  </Grid>
</template>

<script lang="ts" setup>
  import { onMounted } from 'vue';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { moldDrawingColumns } from './config';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { downloadMoldDrawings } from '/@/views/engineering/mouldBusiness/components/config';
  import { getMoldDrawingDetail } from '/@/api/engineering/moldDrawingLibrary';

  import Subtitle from '/@/components/Subtitle/src/Subtitle.vue';
  import FileListCell from '/@/views/engineering/mouldBusiness/components/fileListCell.vue';

  const props = defineProps({
    list: {
      type: Array as PropType<Array<any>>,
      default: () => [],
    },
  });

  const { t } = useI18n();
  const { createMessage } = useMessage();

  const [Grid, gridApi] = useVbenVxeGrid({
    showSearchForm: false,
    gridOptions: {
      columns: moldDrawingColumns,
      pagerConfig: {
        enabled: false,
      },
      toolbarConfig: {
        enabled: true,
        refresh: false,
        custom: false,
        slots: {
          buttons: 'buttons',
        },
      },
      i18nConfig: {
        moduleCode: 'MoldDrawingColumn',
      },
    },
  });

  /** 图纸下载 */
  function handleDownloadDrawings() {
    const rows = gridApi.getSelectRows();
    if (rows.length === 0) {
      createMessage.warning(t('common.selectText'));
      return false;
    }
    downloadMoldDrawings(rows);
  }

  /** 加载数据 */
  function getTableData() {
    if (props.list.length === 0) {
      gridApi.reloadData([]);
      return;
    }

    gridApi.setLoading(true);
    getMoldDrawingDetail(props.list.map(item => item.id))
      .then(res => {
        return gridApi.reloadData(res.data || []);
      })
      .finally(() => {
        gridApi.setLoading(false);
      });
  }

  onMounted(getTableData);
</script>
