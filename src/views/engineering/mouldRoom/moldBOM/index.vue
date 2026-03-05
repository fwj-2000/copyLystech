<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-search-box">
        <BasicForm class="search-form" @register="registerForm" @submit="handleSearch" />
      </div>
      <div class="lydc-content-wrapper-content bg-white p-10px">
        <div class="bold-bom h-full w-full">
          <div class="bom-catory mr-12px">
            <div
              :class="['catory-item', moldNo === item.moldNo ? 'activited-mold' : '']"
              v-for="(item, index) in bomlist"
              :key="index"
              @click="handleSearchByMoldNo(item.moldNo)">
              {{ item.moldNo }}</div
            >
            <div v-if="finish" class="catory-finish text-center">{{ t('dict.CommonCol.noMoreData') }}</div>
          </div>

          <div class="grid-box">
            <Grid>
              <template #toolbar-actions>
                <a-space>
                  <!-- 新增 -->
                  <!-- <a-button v-auth="'btn_add'" type="primary" @click="handleAdd">{{ t('common.add2Text') }} </a-button> -->
                  <a-button @click="batchImportOrExport({ key: 'export' })" v-if="hasBtnP('btn_download')">{{ t('common.batchExport') }} </a-button>
                  <a-button v-auth="'btn_batchRemove'" class="mr-12px" danger @click="handelDelete">{{ t('common.batchDelText') }}</a-button>
                </a-space>
              </template>

              <template #IsNeedProcess="{ row }">
                <div>{{ row.isNeedProcess === 1 ? t('dict.YesOrNoStatus.1') : t('dict.YesOrNoStatus.2') }}</div>
              </template>
              <template #IsRubberPart="{ row }">
                <div>{{ row.isRubberPart === 1 ? t('dict.YesOrNoStatus.1') : t('dict.YesOrNoStatus.2') }}</div>
              </template>
              <template #IsDrawOrder="{ row }">
                <div>{{ row.isDrawOrder === 1 ? t('dict.YesOrNoStatus.1') : t('dict.YesOrNoStatus.2') }}</div>
              </template>
              <template #IsLeaveMargin="{ row }">
                <div>{{ row.isLeaveMargin === 1 ? t('dict.YesOrNoStatus.1') : t('dict.YesOrNoStatus.2') }}</div>
              </template>
            </Grid>
          </div>
        </div>
      </div>
    </div>
    <PreviewModal ref="filePreviewRef" />
    <ImportModal @register="registerImportPop" @refresh="refresh" @close="refresh"></ImportModal>
  </div>
</template>
<script lang="ts" setup>
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { reactive, ref, onMounted, onBeforeUnmount, nextTick } from 'vue';
  import {
    moldbomExportdetail,
    moldbomDelete,
    getMoldbomPage,
    getbomlist,
    moldbomGetTemplateDownload,
    moldbomImportExcel,
    moldbomSaveBatchData,
  } from '/@/api/engineering/mould';
  import { BasicForm, useForm } from '/@/components/Form';
  import { usePopup } from '/@/components/Popup';
  import { ModalComponent } from '/@/views/basicData/encodingSettings/types';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { PreviewModal } from '/@/components/Upload';
  import { getColumn, formSchemas, importColumns } from './config';
  import { downloadByUrl } from '/@/utils/file/download';
  import { message } from 'ant-design-vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { throttle } from 'lodash-es';
  import { ImportModal } from '/@/components/ImportModal';
  const { t } = useI18n();
  const { hasBtnP } = usePermission();

  defineOptions({ name: 'engineering-mouldRoom-moldBOM' });

  const [registerImportPop, { openPopup: openImportPopup }] = usePopup();
  const { createConfirm } = useMessage();

  const filePreviewRef = ref<ModalComponent | null>(null);

  const finish = ref(false);
  const pageParams = reactive({
    currentPage: 1,
    pageSize: 30,
  });
  const bomlist = ref<{ moldNo: string }[]>([]);
  const isLoading = ref(false);
  const moldNo = ref('');

  const [registerForm, { getFieldsValue }] = useForm({
    baseColProps: { span: 4 },
    showActionButtonGroup: true,
    showAdvancedButton: false,
    compact: true,
    schemas: formSchemas,
    i18nConfig: {
      moduleCode: 'MoldBomColumn',
      transferRange: ['placeholder'],
    },
  });

  const handleSearch = () => {
    pageParams.currentPage = 1;
    finish.value = false;
    bomlist.value = [];
    getData();
  };

  const [Grid, { reload, getSelectRows }] = useVbenVxeGrid({
    gridOptions: {
      id: 'engineering-mouldRoom-moldBOM-list',
      columns: getColumn(),
      api: getMoldbomPage,
      showIndexColumn: true,
      beforeFetch: params => {
        return {
          ...params,
          ...getFieldsValue(),
          moldNo: moldNo.value,
        };
      },
      scrollY: {
        enabled: false,
      },
      spanMethod(data) {
        const { row, $rowIndex: rowIndex, column, visibleData } = data;
        const spanFields = [
          'checkbox',
          'bomDocumentNumber',
          'projectCode',
          'productName',
          'bomVersion',
          'erpSystem',
          'productMaterials',
          'expenseAttribution',
          'action',
        ];
        const diffField = 'bomId';
        const cellValue = row[diffField];

        if (cellValue && spanFields.includes(column.field)) {
          const prevRow = visibleData[rowIndex - 1];

          // 如果上一行存在且相同，则合并到首行
          if (prevRow && prevRow[diffField] === cellValue) {
            return { rowspan: 0, colspan: 0 };
          }

          // 计算连续相同值的行数
          let countRowspan = 1;
          while (rowIndex + countRowspan < visibleData.length && visibleData[rowIndex + countRowspan][diffField] === cellValue) {
            countRowspan++;
          }

          if (countRowspan > 1) {
            return { rowspan: countRowspan, colspan: 1 };
          }
        }
      },
      i18nConfig: {
        moduleCode: 'MoldBomColumn',
      },
    },
  });

  const handleSearchByMoldNo = (no: string) => {
    moldNo.value = no;
    reload();
  };

  function batchImportOrExport({ key }) {
    const openMethod = key === 'import' ? batchImportFile : handleExport;
    openMethod();
  }

  function batchImportFile() {
    openImportPopup(true, {
      importPreviewApi: moldbomImportExcel,
      importSaveApi: moldbomSaveBatchData,
      templateApi: moldbomGetTemplateDownload,
      version: '2',
      templateUrl: '/api/Information/moldbom/download/importtemplate',
      previewColumn: importColumns,
      usePolling: false,
      pollingParams: {
        interval: 5000,
      },
      apiParams: {
        importSave: {
          isoperation: hasBtnP('btn_review') ? 1 : 0,
        },
      },
    });
  }

  //  批量导出
  const handleExport = () => {
    const list = getSelectRows();
    if (!list.length) return message.warning(t('dict.CheckDataTip'));
    if (list.length > 1) {
      const bomIds = new Set(list.map(item => item.bomId));
      if (bomIds.size !== 1) {
        message.warning(t('dict.NewMoldColumn.selectOneItemTip'));
        return;
      }
    }
    const params = {
      id: list[0].bomId,
    };
    moldbomExportdetail(params).then(res => {
      if (!res.data.url) return;
      downloadByUrl({ url: res.data.url });
    });
  };

  // 批量删除
  const handelDelete = async () => {
    const list = getSelectRows();
    if (!list.length) return message.warning(t('dict.CheckDataTip'));
    createConfirm({
      iconType: 'warning',
      title: t('common.tipTitle'),
      content: t('dict.PerformBatchDeletionTip'),
      onOk: async () => {
        // 获取勾选的数据
        const ids = list.map(item => item.bomId);
        const res = await moldbomDelete(ids);
        if (res.code === 200) {
          refresh();
        }
      },
    });
  };

  const getbomlistFn = async () => {
    // 退出分页判断
    if (finish.value) {
      return;
    }
    isLoading.value = true;
    const { data } = await getbomlist({ ...pageParams, ...getFieldsValue() });
    isLoading.value = false;
    bomlist.value.push(...data.list);
    if (bomlist.value.length) {
      moldNo.value = bomlist.value[0].moldNo;
    }
    if (data.list.length < pageParams.pageSize) {
      finish.value = true;
    } else {
      pageParams.currentPage++;
    }
  };

  const handleScroll = () => {
    const element = document.getElementsByClassName('bom-catory')[0];
    if (element) {
      const { scrollTop, clientHeight, scrollHeight } = element;
      if (scrollTop + clientHeight >= scrollHeight - 100) {
        // 距离底部100px时触发加载
        if (!isLoading.value || !finish.value) {
          getbomlistFn();
        }
      }
    }
  };
  const throttledHandleScroll = throttle(handleScroll, 300);

  const getData = async () => {
    await getbomlistFn();
    reload();
  };

  const resetData = () => {
    pageParams.currentPage = 1;
    finish.value = false;
    bomlist.value = [];
  };

  const refresh = () => {
    resetData();
    getData();
  };

  onMounted(() => {
    getData();
    nextTick(() => {
      document.getElementsByClassName('bom-catory')[0]?.addEventListener('scroll', throttledHandleScroll);
    });
  });

  // 在组件卸载时移除事件监听器
  onBeforeUnmount(() => {
    document.getElementsByClassName('bom-catory')[0]?.removeEventListener('scroll', throttledHandleScroll);
  });
</script>

<style lang="less" scoped>
  .bold-bom {
    display: flex;

    .bom-catory {
      width: 226px;
      background-color: #fafafa;
      overflow: scroll;

      .catory-item {
        padding: 8px 12px;
        color: #1a1a1a;
        font-size: 14px;
        cursor: pointer;
      }

      .activited-mold {
        color: #ff7b00;
        background: rgb(255 123 0 / 10%);
      }

      .catory-finish {
        padding: 8px 12px;
        color: #606266;
        font-size: 12px;
      }
    }

    .grid-box {
      flex: 1;
      overflow: hidden;
    }
  }

  .lydc-content-wrapper {
    position: absolute;
  }

  .btn-wrapper {
    margin-top: 16px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }

  .left-btn {
    display: flex;

    button {
      margin-right: 16px;
    }

    // 选择第二个按钮
    button:nth-child(2) {
      border: #ff7b00 solid 1px;
      color: #ff7b00;
    }
  }
</style>
