<script lang="ts" setup>
  import { useVbenForm } from '/@/adapter/form';
  import { handleUnpack, registerMouseEvent } from '/@/views/engineering/quotationBom/utils';
  import { getSchema, getColumns } from './config';
  import { reactive, toRefs, ref, onMounted, h } from 'vue';
  import { Subtitle } from '/@/components/Subtitle';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import vShowDropdown from '/@/components/VShowDropdown/src/vShowDropdown.vue';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { isEmpty, isExist, isObject } from '/@/utils/is';
  import { usePopup } from '/@/components/Popup';
  import DetailPopup from './components/DetailPopup.vue';
  import { ModeTypeEnum } from '/@/enums/modeEnum';
  import {
    getProductList,
    deleteProductDetail,
    updateProductDetail,
    importPreview,
    importTaskSave,
    downloadImportTemplate,
    getImportTask,
    getImportTaskData,
    cancelImportTask,
    importTaskRead,
  } from '/@/api/engineering/detectionData';
  import { get, cloneDeep, filter, includes } from 'lodash-es';
  import { dateUtil } from '/@/utils/dateUtil';
  import { ImportModal } from '/@/components/ImportModal';
  import { useModal } from '/@/components/Modal';
  import ExportModal from '/@/components/ExportModal/index.vue';

  const { hasBtnP } = usePermission();

  const { t } = useI18n();
  const { createConfirm, createMessage } = useMessage();
  const bomContent = ref<HTMLElement | null>(null);
  const mainContent = ref<HTMLElement | null>(null);
  const divider = ref(null);
  const container = ref(null);

  const [registerDetail, { openPopup: openDetail }] = usePopup();
  const [registerImportPop, { openPopup: openImportPopup }] = usePopup();
  const [registerExportModal, { openModal: openExportModal }] = useModal();

  defineOptions({ name: 'engineering-basicInformation-detectionData' });

  const state = reactive({
    isPack: true,
    loadingBom: false,
    codeList: [],
    activeId: '',
  });

  const { isPack, loadingBom, codeList, activeId } = toRefs(state);
  const [Form, formApi] = useVbenForm({
    collapsed: true,
    showCollapseButton: true,
    submitOnChange: false,
    submitOnEnter: true,
    commonConfig: {
      componentProps: {},
      labelClass: 'w-0',
    },
    submitButtonOptions: {
      content: '查询',
    },
    handleReset: async () => {
      await formApi.setValues({
        time: [],
        productCode: '',
        remark: '',
      });
      fetchData();
    },
    handleSubmit: fetchData,
    wrapperClass: 'grid grid-cols-5 gap-4',
    schema: getSchema(),
    // fieldMappingTime: [['time', ['creatorTimeStart', 'creatorTimeEnd'], 'YYYY-MM-DD HH:mm:ss']],
    // i18nConfig: {
    //   moduleCode: 'PartNumberApplyColumn',
    //   transferRange: ['placeholder'],
    // },
  });

  const [Grid, $grid] = useVbenVxeGrid({
    gridOptions: {
      id: 'engineering-basicInformation-detectionData',
      columns: getColumns(),
      // 列删除是通过列id去处理的，会有影响，暂时禁用
      toolbarConfig: {
        custom: false,
      },
      // customConfig: {
      //   slots: {
      //     header:
      //   }
      // }
    },
    gridEvents: {
      pageChange: (...rest) => {
        fetchData();
      },
      headerCellDblclick: handleDel,
    },
  });
  const { getSelectRowKeys, getFetchParams, loadData, setLoading, getDataSource, setGridOptions } = $grid;

  function handleClick(_, value) {
    console.log('click');
  }

  function reloadData(list) {
    const cols = getColumns().filter(item => item.field !== 'checkbox' && item.field !== 'faiNo');

    const buildlist = cols.map(column => {
      const item: any = { col0: column.title };
      list.forEach((row, index) => {
        if (column.field === 'isEnabled') {
          item[`col${index + 1}`] = row[column.field] == 1 ? '启用' : '禁用';
        } else if (column.field === 'creatorTime') {
          item[`col${index + 1}`] = dateUtil(row[column.field]).format('YYYY-MM-DD HH:mm:ss');
        } else {
          item[`col${index + 1}`] = row[column.field];
        }
      });
      return item;
    });
    const buildColumns = [{ field: 'col0', fixed: 'left', width: 100 }];
    list.forEach((item, index) => {
      buildColumns.push({
        field: `col${index + 1}`,
        title: item.faiNo,
        width: 160,
        slots: {
          header: 'headerSlot',
        },
      });
    });
    setGridOptions({
      columns: buildColumns,
      data: buildlist,
    });
  }

  function handleAdd() {
    openDetail(true, {
      mode: ModeTypeEnum.ADD,
    });
  }

  function batchImportOrExport({ key }) {
    const openMethod = key === 'import' ? batchImportFile : handleExport;
    openMethod();
  }

  function handleDel({ column, columnIndex }) {
    console.log('🚀 ~ handleDel ~ column:', column, columnIndex);
    // const prodctLen = state.codeList.length;
    const prodctLen = $grid.grid.getColumns().length;
    const delMsg = prodctLen <= 2 ? '此操作将永久删除该列检测数据, 是否继续？' : '此操作将永久删除该料号， 是否继续？';
    createConfirm({
      iconType: 'warning',
      title: t('common.tipTitle'),
      content: delMsg,
      onOk: async () => {
        try {
          setLoading(true);
          state.loadingBom = true;
          if (prodctLen <= 2) {
            // 直接删除ID
            deleteProductDetail(state.activeId).then(({ code, msg }) => {
              if (code === 200) {
                createMessage.success(msg);
                fetchData();
              }
            });
          } else {
            // 更新单条数据
            const target: any = state.codeList.find(item => item.id === state.activeId) || {};
            if (target) {
              target.productQcItems.splice(columnIndex - 1, 1);
              const params = {
                id: target.id,
                productCode: target.productCode,
                remark: target.remark,
                productQcItems: target.productQcItems,
              };
              updateProductDetail(params).then(({ code, msg }) => {
                if (code === 200) {
                  createMessage.success(msg);
                  successReload(state.activeId);
                }
              });
            }
          }
          setLoading(false);
          state.loadingBom = false;
        } catch (e) {
          setLoading(false);
          state.loadingBom = false;
        }
      },
    });
  }

  function successReload(id) {
    fetchData(id);
  }

  function handleEdit(column) {
    // console.log(column.field, 'columncolumncolumn')
    // debugger
    const target = state.codeList.find(item => item.id === state.activeId);
    openDetail(true, {
      mode: ModeTypeEnum.EDIT,
      ...target,
    });
  }

  function handlePreview(row) {
    const target = state.codeList.find(item => item.id === state.activeId);
    openDetail(true, {
      mode: ModeTypeEnum.VIEW,
      ...target,
    });
  }

  function getTableActions(row, rowIndex) {
    return [
      {
        // label: t('common.edit'),
        icon: 'icon-ym icon-ym-edit',
        onClick: handleEdit.bind(null, row),
      },
      {
        icon: 'icon-ym icon-ym-btn-preview',
        onClick: handlePreview.bind(null, row),
      },
    ];
  }

  async function fetchData(id) {
    const params = await getFetchParams();
    const formValues = cloneDeep(await formApi.getValues());
    const { time } = formValues;
    if (isExist(time) && time.length === 2) {
      formValues.creatorTimeStart = dateUtil(time[0]).startOf('day').valueOf();
      formValues.creatorTimeEnd = dateUtil(time[1]).endOf('day').valueOf();
    }
    delete formValues.time;
    console.log(formValues, 'paramsparamsparamsparams');
    setLoading(true);
    state.loadingBom = true;
    getProductList({
      ...params,
      ...formValues,
      includeQcItems: true,
    }).then(({ code, data }) => {
      setLoading(false);
      state.loadingBom = false;
      if (code !== 200) {
        createMessage.error('获取列表数据失败');
        reloadData([]);
        return;
      }
      // 设置bom数据
      const bomList = (data.list || []).map(item => ({
        ...item,
        id: item.id,
        code: item.productCode,
        productQcItems: item.productQcItems || [],
      }));

      setGridOptions({
        pagerConfig: {
          total: data.pagination.total || 0,
          pageSize: data.pagination.pageSize || 1,
          page: data.pagination.currentPage || 1,
          // total: 100,
          // pageSize: 4,
          // page: 3,
        },
      });
      console.log(bomList, 'bomListbomListbomList');
      state.codeList = bomList;
      // console.log(get(data, 'list.0.productQcItems', []), "get(data, 'list.0.productQcItems', [])get(data, 'list.0.productQcItems', [])")
      // 设置数据为第一条数据
      state.activeId = bomList[0]?.id || '';

      console.log($grid);
      let list;
      if (!isObject(id) && isExist(id)) {
        state.activeId = id;
        const index = state.codeList.findIndex(item => item.id === id);
        // reloadData(get(state.codeList[index], 'productQcItems', []));
        list = get(data, `list.${index}.productQcItems`, []);
      } else {
        list = get(data, 'list.0.productQcItems', []);
      }
      console.log(list, 'listlistlist');
      reloadData(list);
      // reloadData(get(data, 'list.0.productQcItems', []));
    });
  }

  function handleBomClick(item) {
    console.log(item);
    state.activeId = item.id || '';
    reloadData(item.productQcItems || []);
  }

  // 批量导入
  const batchImportFile = () => {
    openImportPopup(true, {
      importPreviewApi: importPreview,
      importSaveApi: importTaskSave,
      templateApi: downloadImportTemplate,
      previewColumn: getColumns().filter(
        item => item.field !== 'checkbox' && item.field !== 'creatorUserName' && item.field !== 'isEnabled' && item.field !== 'creatorTime',
      ),
      excludeFields: ['ApplyCode', 'Status', 'HandlerName', 'currentNodeName', 'nodeDetail', 'ApplyUserName', 'ApplyDate'],
      usePolling: true,
      pollingParams: {
        interval: 4000,
        getTaskStatus: getImportTask,
        getTaskDataList: getImportTaskData,
        cancelTask: cancelImportTask,
        taskRead: importTaskRead,
      },
      apiParams: {
        importSave: {
          isoperation: hasBtnP('btn_review') ? 1 : 0,
        },
      },
      i18nConfig: {
        moduleCode: 'QuotationRequirementsColumn', // 字典分类EnCode
      },
    });
  };

  // 导出
  const handleExport = async () => {
    openExportModal(true, {
      api: exportQuotationRequirementsExcel,
      listQuery: await getFetchParams(),
      nameProps: 'title',
      idProps: 'field',
      exportOptions: getCommonColumns(),
      i18nConfig: {
        moduleCode: 'QuotationRequirementsColumn',
      },
    });
  };

  onMounted(() => {
    registerMouseEvent(state, divider, container, bomContent, mainContent);
    fetchData();
  });
</script>

<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <Form class="relative overflow-x-hidden p-10px pb-10px vxe-form page" />
        <div class="bg-bar"></div>
        <div ref="container" class="container-box">
          <div ref="bomContent" class="bom-content">
            <div class="drag-box">
              <div ref="divider" class="drag-ctrl"></div>
            </div>
            <div class="flex flex-col">
              <div class="w-full h-44px title flex flex-row-reverse justify-between">
                <div class="cursor-pointer" @click="() => (state.isPack = handleUnpack(bomContent, mainContent, isPack))">
                  <i :class="['icon-ym icon-ym-nav-prev icon-color', isPack ? '' : 'rotate-90']" />
                </div>
                <Subtitle title="产品内部料号" :class="[isPack ? 'opacity-100' : 'opacity-0', 'duration-300 ease-out pb-0']" />
              </div>
            </div>
            <a-spin class="loading-bom" :spinning="loadingBom">
              <div class="bom-list h-full">
                <div v-for="item in codeList" :key="item.id" @click="handleBomClick(item)" :class="['bom-item', item.id === activeId ? 'active' : '']">
                  <div class="bom-item-content">
                    <div class="bom-item-content-title">{{ item.code }}</div>
                  </div>
                </div>
              </div>
            </a-spin>
          </div>
          <div ref="mainContent" class="main-content">
            <Grid>
              <template #toolbar-actions>
                <a-space>
                  <!-- v-auth="'btn_edit'"  -->
                  <a-button type="primary" @click="handleAdd"> {{ t('common.add') }} </a-button>
                  <vShowDropdown>
                    <template #overlay>
                      <!-- v-if="hasBtnP('btn_upload')" -->
                      <button @click="batchImportOrExport({ key: 'import' })">{{ t('common.batchImport') }} </button>
                      <button @click="batchImportOrExport({ key: 'export' })">{{ t('common.batchExport') }} </button>
                    </template>
                    <a-button>{{ t('common.batchImportOrExport') }}</a-button>
                  </vShowDropdown>
                  <!-- <a-button danger @click="handleDel">{{ t('common.batchDelText') }} </a-button> -->
                </a-space>
              </template>
              <template #headerSlot="{ column }">
                <div class="flex flex-row justify-between items-center px-8px">
                  <div>{{ column.title }}</div>
                  <i @click="handleEdit(column)" class="icon-ym icon-ym-edit cursor-pointer" style="color: #333" />
                </div>
                <!-- <div>{{ console.log(row, 'rowrowrowrow') }}</div>
                <div>{{ console.log(row, 'column') }}</div> -->
              </template>
              <template #action="{ row, rowIndex }">
                <TableAction outside :actions="getTableActions(row, rowIndex)" />
              </template>
            </Grid>
          </div>
        </div>
      </div>
    </div>
    <DetailPopup @register="registerDetail" @reload="successReload" />
    <ImportModal @register="registerImportPop" @refresh="fetchData"></ImportModal>
    <ExportModal @register="registerExportModal" />
  </div>
</template>

<style scoped lang="less" src="./style.less" />
<style lang="less" scoped>
  :deep(.lydc-subtitle-container) {
    .title {
      min-width: 100px;
      overflow: hidden;
    }
  }

  .bg-bar {
    width: 100%;
    height: 12px;
    background-color: #ebeef5;
  }

  :deep(.ant-spin-nested-loading) {
    height: calc(100% - 44px);
    background: rgb(250 250 250 / 100%);
  }

  :deep(.ant-spin-container) {
    height: 100%;
  }

  .bom-item {
    height: 38px;
    display: flex;
    align-items: center;
    padding: 8px 8px 8px 24px;
    font-size: 14px;
    overflow: hidden;

    .bom-item-content {
      flex: 1 1 auto;
      min-width: 0;
    }

    .bom-item-content-title {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    &.active {
      background: rgb(255 123 0 / 6%);
      color: rgb(255 123 0 / 100%);
      border-right: 1px solid rgb(255 123 0 / 100%);
    }
  }
</style>
