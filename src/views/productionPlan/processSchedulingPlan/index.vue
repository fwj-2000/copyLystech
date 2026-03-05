<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <Grid>
          <template #toolbar>
            <div class="pb-10px pt-10px">
              <a-button type="primary" class="mr-10px" @click="handleWorkPlan()" v-auth="'btn_planCompletTime'"
                >{{ t('dict.CommonCol.planCompleteTime') }}
              </a-button>
              <a-button @click="handleExport()" v-auth="'btn_download'">{{ t('common.batchExport') }}</a-button>
            </div>
          </template>
          <template #sortSlots="data">
            <span v-if="data.row.parentId">
              <i class="icon-ym icon-ym-report-icon-align-top cursor-pointer" @click="handleToTop(data)"></i>
            </span>
          </template>
          <template #prjDrawingsName="{ row }">
            <span
              class="table-a"
              v-if="row.parentId"
              @click="
                () => {
                  filePreviewRef &&
                    filePreviewRef.init({
                      name: row.prjDrawingsName,
                      Id: row.prjDrawingsId,
                      previewType: 'localPreview',
                      noCache: false,
                      isCopy: 0,
                    });
                }
              "
              >{{ row.prjDrawingsName || '/' }}</span
            >
            <a class="cursor-pointer" @click="downloadFn(row.prjDrawingsId)" v-if="row.prjDrawingsId" v-auth="'btn_download'">{{ t('common.downloadText') }}</a>
          </template>
          <template #processStatus="{ row }">
            <div v-if="row.parentId && STATUS_OPTIONS[row.processStatus]">
              <LydcTag :theme="STATUS_OPTIONS[row.processStatus].theme" :text="STATUS_OPTIONS[row.processStatus].fullName"></LydcTag>
            </div>
          </template>
          <template #isProcessMeet="{ row }">
            <div v-if="row.parentId" :class="row.isProcessMeet === 1 ? 'text-[#1890FF]' : 'text-[#FF7B00]'">
              {{ row.isProcessMeet === 1 ? t('dict.OpinionTypeEnum.Satisfy') : t('dict.OpinionTypeEnum.Discontent') }}
            </div>
          </template>

          <template #seqNo="data">
            <span v-if="!data.row.parentId">
              {{ data.row.processName }}{{ t('dict.processRetrospectReport.ProcessName') }}: {{ t('common.total') }}
              <span class="text-[#1890FF] font-bold text-l"> {{ data.row.total }}</span>
            </span>
            <span v-else>
              {{ formatSeq(data) }}
            </span>
          </template>
          <template #action="{ row }">
            <TableAction outside :actions="getTableActions(row)" v-if="row.parentId" />
          </template>
        </Grid>
      </div>
    </div>
    <detailPopup @register="registerDetailPop" />
    <ExportModal @register="registerExportModal" />
    <workPlanModal @register="registerWorkPlanModal" @reload="init" />
    <Preview ref="filePreviewRef" />
  </div>
</template>
<script setup lang="ts">
  import { onMounted, ref, watch, nextTick } from 'vue';
  import { STATUS_OPTIONS, vxeColumns, searchFormSchema } from './config';
  import { VxeUI } from 'vxe-table';
  import { ActionItem, TableAction } from '/@/components/Table';
  import detailPopup from '../../engineering/mouldRoom/design/detailPopup.vue';
  import { usePopup } from '/@/components/Popup';
  import { getProcessschedulingpage, processschedulingExport, updateseq } from '/@/api/productionPlan/processscheduling';
  import Preview from '/@/views/basicData/productCodeApply/components/Preview.vue';
  import { ModalComponent } from '../../basicData/encodingSettings/types';
  import ExportModal from '/@/components/ExportModal/index.vue';
  import { useModal } from '/@/components/Modal';
  import { useI18n } from '/@/hooks/web/useI18n';
  import workPlanModal from './components/workPlanModal.vue';
  import { cloneDeep } from 'lodash-es';
  import { downloadByUrl } from '/@/utils/file/download';
  import { fileDownload } from '/@/api/basicData/processrulestemplate';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';

  const { t } = useI18n();

  defineOptions({ name: `productionPlan-processSchedulingPlan` });
  const filePreviewRef = ref<ModalComponent | null>(null);
  const curOrgId = ref('');
  const mergeCells = ref([]);

  const [registerWorkPlanModal, { openModal: openWorkPlanModal }] = useModal();
  const [registerExportModal, { openModal: openExportModal, closeModal }] = useModal();
  const [registerDetailPop, { openPopup: openDetailPop }] = usePopup();

  const [Grid, gridApi] = useVbenVxeGrid({
    formOptions: {
      showCollapseButton: false,
      // 是否在字段值改变时提交表单
      submitOnChange: false,
      commonConfig: {
        componentProps: {},
        labelClass: 'w-0',
      },
      wrapperClass: 'grid grid-cols-6 gap-4',
      schema: searchFormSchema,
      i18nConfig: {
        moduleCode: 'MacCameraRateColumn',
        transferRange: ['placeholder'],
      },
    },
    gridOptions: {
      id: 'productionPlan-processSchedulingPlan-list',
      api: getProcessschedulingpage,
      beforeFetch: (params: Record<string, any>) => {
        params.factory = curOrgId.value;
        if (params.date) {
          params.startTime = params.date[0];
          params.endTime = params.date[1];
          delete params.date;
        }
        return params;
      },
      columns: vxeColumns,
      expandConfig: {
        trigger: 'row',
      },
      rowConfig: {
        resizable: true, // 启用列宽拖拽调整宽度
        drag: true, // 启用行拖拽调整顺序
        useKey: true,
      },
      rowDragConfig: {
        // showIcon: false,
        isCrossDrag: true,
        isToChildDrag: true,
        isSelfToChildDrag: false,
        showGuidesStatus: true,
        dragEndMethod: async data => {
          const { newRow, oldRow } = data;
          console.log(data);
          if (oldRow.parentId !== newRow.parentId) {
            VxeUI.modal.message({
              content: t('common.cantDragging'),
              status: 'warning',
            });
            return false;
          } else if (!oldRow.parentId) {
            VxeUI.modal.message({
              content: t('common.onlyDraggedSubItem'),
              status: 'warning',
            });
            return false;
          }
          nextTick(() => {
            handleDragFn({ newRow, oldRow });
          });
          return true;
        },
      },
      treeConfig: {
        transform: true,
        expandAll: true,
        rowField: 'id',
        parentField: 'parentId',
      },
      mergeCells: mergeCells.value, // 默认合并规则
      // virtualYConfig: {
      //   enabled: true,
      // },
      scrollY: {
        gt: 0,
        enabled: false,
      },
      pagerConfig: {
        pageSize: 500,
      },
      proxyConfig: {
        autoLoad: false,
      },
    },
  });

  watch(
    () => [curOrgId.value],
    val => {
      if (val.includes('')) return;
      // init();
    },
  );

  const factoryFilterOption = (inputValue, path) => {
    return [path].some(option => option.label.indexOf(inputValue) > -1);
  };

  function downloadFn(moldDrawingsId) {
    handleFileDownload(moldDrawingsId);
  }

  async function handleFileDownload(id) {
    const { data, code } = await fileDownload(id);
    if (code === 200) {
      downloadByUrl({ url: data.url, fileName: data.name });
    }
  }

  async function handleToTop({ row }) {
    // const type = await VxeUI.modal.confirm({
    //   content: '请确认是否置顶？',
    // });
    // if (type === 'confirm') {
    const dataSource = await gridApi.grid?.getTableData()?.fullData;
    if (!dataSource?.length) {
      return;
    }
    const fullData = cloneDeep(dataSource);
    let activeItems = getActiveItems(fullData, row.parentId);
    activeItems = activeItems.filter(item => item.id !== row.id);
    activeItems = [row, ...activeItems];
    const finalItems = updateItemsWithSeq(activeItems);
    updateSeqFn(finalItems);
    // }
  }

  async function handleDragFn({ oldRow, newRow }) {
    const dataSource = await gridApi.grid?.getTableData()?.fullData;
    if (!dataSource?.length) {
      return;
    }
    const fullData = cloneDeep(dataSource);
    const activeItems = getActiveItems(fullData, oldRow.parentId);
    const finalItems = updateItemsWithSeq(activeItems);
    updateSeqFn(finalItems);
  }

  function getActiveItems(dataSource, parentId) {
    let activeItems: any = [];
    dataSource?.forEach(item => {
      if (item.processId === parentId) {
        activeItems = item.children;
      }
    });
    return activeItems;
  }

  function updateItemsWithSeq(activeItems) {
    return activeItems.map((item, index) => {
      const newItem = { ...item };
      delete newItem._X_ROW_CHILD;
      delete newItem._X_ROW_KEY;
      newItem.seqNo = index + 1;
      return newItem;
    });
  }

  async function updateSeqFn(activeItems) {
    try {
      const { data, code } = await updateseq({ list: activeItems });
      if (code === 200) {
        console.log(data);
        VxeUI.modal.message({
          content: t('common.sortingSuccessful'),
          status: 'success',
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      init();
    }
  }

  function formatSeq({ seq }) {
    if (!seq) return;
    const parts = seq.split('.');
    if (parts.length <= 1) return;
    return parts[parts.length - 1];
  }
  function getTableActions(record): ActionItem[] {
    return [
      {
        icon: 'icon-ym icon-ym-btn-preview',
        onClick: handleDetail.bind(null, record),
        auth: 'btn_detail',
      },
    ];
  }

  function handleDetail(record) {
    openDetailPop(true, { id: record.detailId, title: t('common.detailText') });
  }
  function handleWorkPlan() {
    const selectList = gridApi.grid?.getCheckboxRecords();
    if (!selectList?.length) {
      return VxeUI.modal.message({
        content: '请选择一条数据',
        status: 'warning',
      });
    }
    openWorkPlanModal(true, { data: selectList });
  }

  //导出
  function handleExport() {
    const params = {
      ...gridApi.getFetchParams(),
      factory: curOrgId.value,
    };
    openExportModal(true, {
      api: processschedulingExport,
      listQuery: {
        ...params,
      },
      exportOptions: vxeColumns,
      nameProps: 'title',
      idProps: 'field',
    });
  }

  async function init() {
    gridApi.reload();
  }
  onMounted(() => {
    gridApi.updateSchema([
      {
        fieldName: 'factory',
        componentProps: {
          onChange: e => {
            curOrgId.value = e;
            gridApi.reload();
          },
        },
      },
    ]);
  });
</script>

<style lang="less" scoped>
  .lydc-content-wrapper {
    &-select {
      background: #fff;
      display: flex;
      align-items: flex-start;
      padding: 16px 0 0 12px;
      height: 60px;
      border: 1px solid #f0f0f0;
    }
  }

  :deep(.process-select .ant-select-selection-item) {
    color: #000;
    font-weight: bolder !important;
    font-size: 14px;
  }
</style>
