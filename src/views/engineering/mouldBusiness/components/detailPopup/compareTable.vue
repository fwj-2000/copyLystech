<template>
  <div class="h-full w-full items-start justify-start">
    <!-- 修改前信息表格 -->
    <div v-if="beforeData.length" class="w-full h-1/2">
      <BeforeGrid>
        <template #buttons>
          <Subtitle :title="t('dict.MoldApply.beforeModifyInfo')" class="pb-none" />
          <a-button v-auth="'btn_download'" type="primary" ghost @click="() => handleDownload(true)">{{ t('common.downloadDrawingText') }}</a-button>
        </template>

        <!-- 脱敏图纸 -->
        <template #drawingshistory="{ row }">
          <a class="table-a" @click="handleDrawView(row)">{{ t('common.viewDetails') }}</a>
        </template>
        <template #moldNo="{ row }">
          <a-input v-model:value="row.moldNo" />
        </template>
        <template #moldDrawings="{ row }">
          <FileListCell :row="row" :list="row.moldDrawings" />
        </template>
      </BeforeGrid>
    </div>

    <!-- 修改后信息表格 -->
    <div v-if="afterData.length" class="w-full h-1/2">
      <AfterGrid>
        <template #buttons>
          <Subtitle :title="t('dict.MoldApply.modifiedInfo')" class="pb-none" />
          <a-button v-auth="'btn_download'" type="primary" ghost @click="() => handleDownload(false)">{{ t('common.downloadDrawingText') }}</a-button>
        </template>

        <!-- 脱敏图纸 -->
        <template #drawingshistory="{ row }">
          <a class="table-a" @click="handleDrawView(row)">{{ t('common.viewDetails') }}</a>
        </template>
        <template #moldNo="{ row }">
          <a-input v-model:value="row.moldNo" />
        </template>
        <template #moldDrawings="{ row }">
          <FileListCell :row="row" :list="row.moldDrawings" />
        </template>
      </AfterGrid>
    </div>

    <FileListModal @register="registerFile" />
  </div>
</template>

<script lang="ts" setup>
  import { ref, nextTick } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { getCompareColumns } from './config';
  import { downloadDrawings } from '../config';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { fileDownload } from '/@/api/basicData/processrulestemplate';
  import { getDrawingshistory } from '/@/api/basicData/productCodeApply';
  import { useModal } from '/@/components/Modal';

  import FileListCell from '../fileListCell.vue';
  import Subtitle from '/@/components/Subtitle/src/Subtitle.vue';
  import { FileListModal } from '/@/components/Upload';

  /** 修改前信息 */
  const beforeData = ref<Array<Record<string, any>>>([]);
  /** 修改后信息 */
  const afterData = ref<Array<Record<string, any>>>([]);

  const { t } = useI18n();
  const { createMessage } = useMessage();

  /** 修改前信息表格 */
  const [BeforeGrid, beforeGridApi] = useVbenVxeGrid({
    showSearchForm: false,
    gridOptions: {
      showIndexColumn: true,
      columns: getCompareColumns(),
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
        moduleCode: 'MoldApplyColumn',
      },
      editConfig: {
        trigger: 'manual',
        mode: 'row',
        showIcon: false,
      },
    },
    gridEvents: {
      scroll: ({ scrollTop, scrollLeft }) => {
        return afterGridApi.grid.scrollTo(scrollLeft, scrollTop);
      },
    },
  });

  /** 修改后信息表格 */
  const [AfterGrid, afterGridApi] = useVbenVxeGrid({
    showSearchForm: false,
    gridOptions: {
      showIndexColumn: true,
      columns: getCompareColumns(),
      cellClassName: ({ rowIndex, column, row }) => {
        if (column.field === 'moldDrawings') {
          const beforeDrawings = (beforeData.value?.[rowIndex]?.[column.field] || []).map(item => `${item.fileName}(${item.filePath})`).join(',');
          const afterDrawings = (row?.[column.field] || []).map(item => `${item.fileName}(${item.filePath})`).join(',');
          return beforeDrawings === afterDrawings ? '' : 'text-red-500';
        }

        // 对比表格中，修改前和修改后信息不同的单元格，添加红色字体样式
        if (beforeData.value?.[rowIndex]?.[column.field] !== row?.[column.field]) {
          return 'text-red-500';
        }
        return '';
      },
      pagerConfig: {
        enabled: false,
      },
      i18nConfig: {
        moduleCode: 'MoldApplyColumn',
      },
      editConfig: {
        trigger: 'manual',
        mode: 'row',
        showIcon: false,
      },
      toolbarConfig: {
        enabled: true,
        refresh: false,
        custom: false,
        slots: {
          buttons: 'buttons',
        },
      },
    },
    gridEvents: {
      scroll: ({ scrollTop, scrollLeft }) => {
        return beforeGridApi.grid.scrollTo(scrollLeft, scrollTop);
      },
    },
  });

  /** 下载图纸 */
  function handleDownload(isBefore: boolean) {
    const gridApi = isBefore ? beforeGridApi : afterGridApi;

    const rows = gridApi.getSelectRows();
    if (rows.length === 0) {
      return createMessage.warning(t('common.selectText'));
    }
    // 取出`rows`的每个元素中的`moldDrawings: Array<{ filePath: string, fileName: string }>`，并且根据`filePath`去重
    const drawings = rows.reduce<{ filePath: string; fileName: string }[]>((prev, cur) => {
      Array.isArray(cur.moldDrawings) &&
        cur.moldDrawings.forEach((item: any) => {
          prev.every(i => i.filePath !== item.filePath) && prev.push(item);
        });
      return prev;
    }, []);

    downloadDrawings(drawings);
  }

  /** 加载数据 */
  function reloadData(data: Record<string, any>) {
    beforeData.value = data.beforeData || [];
    afterData.value = data.afterData || [];
    nextTick(() => {
      typeof beforeGridApi?.grid?.reloadData === 'function' && beforeGridApi.grid.reloadData(beforeData.value);
      typeof afterGridApi?.grid?.reloadData === 'function' && afterGridApi.grid.reloadData(afterData.value);
    });
  }

  const [registerFile, { openModal: openFileList }] = useModal();
  function handleDrawView(record: any) {
    openFileList(true, {
      id: record.id,
      downloadApi: fileDownload,
      listApi: () =>
        getDrawingshistory(
          {
            InsidePartNumber: record.insidePartNumber,
            DrawingsType: 'DesensitizedDrawings',
            id: record.insidePartNumberId,
          },
          record.insidePartNumberId,
        ),
    });
  }

  defineExpose({
    reloadData,
  });
</script>

<style scoped lang="less">
  div.pb-none {
    padding-bottom: 0;
  }

  :deep(.text-red-500 .table-a) {
    color: rgb(239 68 68 / var(--tw-text-opacity));
  }
</style>
