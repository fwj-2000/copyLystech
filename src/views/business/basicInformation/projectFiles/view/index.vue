<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <Grid>
          <template #fileNode="{ row, column }">
            <span class="table-a" @click="handleFileNode(row, column)">{{ getFilesDetail(row, column) }}</span>
          </template>
        </Grid>
      </div>
    </div>
    <FilesModal @register="registerFiles"></FilesModal>
  </div>
</template>
<script lang="ts" setup>
  import { reactive, onMounted } from 'vue';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { getOverviewList } from '/@/api/business/projectFiles';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useModal } from '/@/components/Modal';
  import { columnsVxe, formSchema } from './config';
  import FilesModal from '../components/Files/FilesModal.vue';
  import { useBaseStore } from '/@/store/modules/base';

  const { t } = useI18n();

  defineOptions({ name: 'business-basicInformation-projectFiles-view' });

  const [registerFiles, { openModal: openFiles }] = useModal();
  const state = reactive({
    activeKey: '1',
    stages: [],
  });

  const [Grid, gridApi] = useVbenVxeGrid({
    formOptions: {
      commonConfig: {
        labelClass: 'w-0',
      },
      showCollapseButton: false,
      wrapperClass: 'grid grid-cols-5 gap-1',
      schema: formSchema,
      i18nConfig: {
        moduleCode: 'CommonCol',
        transferRange: ['placeholder'],
      },
    },
    gridOptions: {
      id: 'business-basicInformation-projectFiles-view',
      showIndexColumn: true,
      columns: columnsVxe,
      api: getOverviewList,
      beforeFetch: params => {
        return {
          ...params,
        };
      },
      i18nConfig: {
        moduleCode: 'CommonCol',
      },
    },
  });
  const { reloadColumn } = gridApi;

  const handleFileNode = (row: any, column: any) => {
    openFiles(true, {
      states: state.stages,
      currentStage: column.field,
      params: {
        insidePartNumber: row.insidePartNumber,
      },
    });
  };

  // 获取文件详情文案
  const getFilesDetail = (row, column) => {
    const { stageList } = row;
    if (!stageList || stageList.length === 0) {
      return '';
    }
    const stage = stageList.find(item => item.stage === column.field && item.count > 0);
    return stage ? t('common.searchDetail') : '';
  };

  onMounted(async () => {
    // 获取动态的阶段
    const baseStore = useBaseStore();
    state.stages = (await baseStore.getDictionaryData('projDocStage')) || [];
    // 基于阶段动态生成表头
    const stateCols = state.stages.map((stage: any) => {
      return {
        field: stage.enCode,
        title: stage.fullName,
        width: 150,
        slots: { default: 'fileNode' },
      };
    });
    reloadColumn(columnsVxe.concat(stateCols));
  });
</script>
