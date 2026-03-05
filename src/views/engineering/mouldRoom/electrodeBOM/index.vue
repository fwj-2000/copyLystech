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
              :class="['catory-item', activityMold === `${item.moldNo}(${item.partNo})` ? 'activited-mold' : '']"
              v-for="(item, index) in bomlist"
              :key="index"
              @click="handleSearchByMoldNo(item)">
              {{ item.moldNo }}({{ item.partNo }})</div
            >
            <div v-if="finish" class="catory-finish text-center">{{ t('dict.CommonCol.noMoreData') }}</div>
          </div>

          <div class="grid-box">
            <Grid>
              <template #toolbar-actions>
                <a-space>
                  <!-- 新增 -->
                  <a-button v-auth="'btn_add'" type="primary" @click="handleAdd">{{ t('common.add2Text') }} </a-button>
                  <!-- 批量删除 -->
                  <vShowDropdown>
                    <template #overlay>
                      <button @click="batchImportOrExport({ key: 'import' })" v-if="hasBtnP('btn_upload')">{{ t('common.batchImport') }} </button>
                      <button @click="batchImportOrExport({ key: 'export' })" v-if="hasBtnP('btn_download')">{{ t('common.batchExport') }} </button>
                    </template>
                    <a-button v-if="hasBtnP('btn_upload') || hasBtnP('btn_download')">{{ t('common.batchImportOrExport') }}</a-button>
                  </vShowDropdown>
                  <a-button v-auth="'btn_batchRemove'" class="mr-12px" danger @click="handelDelete">{{ t('common.batchDelText') }}</a-button>
                </a-space>
              </template>

              <template #action="{ row }">
                <TableAction outside :actions="getTableActions(row)" />
              </template>
            </Grid>
          </div>
        </div>
      </div>
    </div>
    <ApplyPopup @register="registerApply" @reload="refresh" @close="refresh" />
    <PreviewModal ref="filePreviewRef" />
    <ImportModal @register="registerImportPop" @refresh="refresh" @close="refresh"></ImportModal>
  </div>
</template>
<script lang="ts" setup>
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { reactive, ref, onMounted, onBeforeUnmount, nextTick } from 'vue';
  import {
    electrodebomExportdetail,
    electrodebomDelete,
    getElectrodebomPage,
    getElectrodebomlist,
    electrodebomGetTemplateDownload,
    electrodebomImportExcel,
    electrodebomSaveBatchData,
  } from '/@/api/engineering/mould';
  import { BasicForm, useForm } from '/@/components/Form';
  import { usePopup } from '/@/components/Popup';
  import { ModalComponent } from '/@/views/basicData/encodingSettings/types';
  import { useI18n } from '/@/hooks/web/useI18n';
  import ApplyPopup from './components/ApplyPopup.vue';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { PreviewModal } from '/@/components/Upload';
  import { getColumn, formSchemas, importColumns } from './config';
  import { TableAction } from '/@/components/Table';
  import { downloadByUrl } from '/@/utils/file/download';
  import { message } from 'ant-design-vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { throttle } from 'lodash-es';
  import { ImportModal } from '/@/components/ImportModal';
  import vShowDropdown from '/@/components/VShowDropdown/src/vShowDropdown.vue';
  const { t } = useI18n();
  const { hasBtnP } = usePermission();

  defineOptions({ name: 'engineering-mouldRoom-electrodeBOM' });

  const [registerApply, { openPopup: openApplyPop }] = usePopup();
  const [registerImportPop, { openPopup: openImportPopup }] = usePopup();
  const { createConfirm } = useMessage();

  const filePreviewRef = ref<ModalComponent | null>(null);

  const finish = ref(false);
  const pageParams = reactive({
    currentPage: 1,
    pageSize: 30,
  });
  const bomlist = ref<{ moldNo: string; partNo: string }[]>([]);
  const isLoading = ref(false);
  const activityMold = ref('');
  const moldNo = ref('');
  const partNo = ref('');

  const [registerForm, { getFieldsValue }] = useForm({
    baseColProps: { span: 4 },
    showActionButtonGroup: true,
    showAdvancedButton: false,
    compact: true,
    schemas: formSchemas,
    i18nConfig: {
      moduleCode: 'ElectrodeBomColumn',
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
      id: 'engineering-mouldRoom-electrodeBOM-list',
      columns: getColumn(),
      api: getElectrodebomPage,
      showIndexColumn: true,
      beforeFetch: params => {
        return {
          ...params,
          ...getFieldsValue(),
          moldNo: moldNo.value,
          partNo: partNo.value,
        };
      },
      i18nConfig: {
        moduleCode: 'ElectrodeBomColumn',
      },
    },
  });

  const handleSearchByMoldNo = item => {
    activityMold.value = `${item.moldNo}(${item.partNo})`;
    moldNo.value = item.moldNo;
    partNo.value = item.partNo;
    reload();
  };

  function getTableActions(row) {
    return [
      {
        icon: 'icon-ym icon-ym-btn-edit',
        onClick: handleEdit.bind(null, row),
        auth: 'btn_edit',
      },
    ];
  }

  function batchImportOrExport({ key }) {
    const openMethod = key === 'import' ? batchImportFile : handleExport;
    openMethod();
  }

  function batchImportFile() {
    openImportPopup(true, {
      importPreviewApi: electrodebomImportExcel,
      importSaveApi: electrodebomSaveBatchData,
      templateApi: electrodebomGetTemplateDownload,
      version: '2',
      templateUrl: '/api/Production/electrodebom/download/importtemplate',
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
    electrodebomExportdetail(params).then(res => {
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
        const res = await electrodebomDelete(ids);
        if (res.code === 200) {
          refresh();
        }
      },
    });
  };

  // 新增
  const handleAdd = () => {
    openApplyPop(true, { type: 'add' });
  };

  // 编辑
  const handleEdit = (row: any) => {
    openApplyPop(true, { type: 'edit', bomId: row.bomId });
  };

  const getbomlistFn = async () => {
    // 退出分页判断
    if (finish.value) {
      return;
    }
    isLoading.value = true;
    const { data } = await getElectrodebomlist({ ...pageParams, ...getFieldsValue() });
    isLoading.value = false;
    bomlist.value.push(...data.list);
    if (bomlist.value.length) {
      const item = bomlist.value[0];
      moldNo.value = item.moldNo;
      partNo.value = item.partNo;
      activityMold.value = `${moldNo.value}(${partNo.value})`;
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

  //:deep(.lydc-basic-table-action button i) {
  //  font-size: 20px;
  //}
</style>
