<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    :showOkBtn="state.mode != 'view'"
    :okText="t('common.submit')"
    :title="title"
    @ok="handleSave"
    class="full-popup">
    <div class="h-full requirement-pop">
      <Subtitle :title="state.title" class="mt-2px" :extra="{ show: state.mode == 'add' }" @addColumn="handleAddColumn"> </Subtitle>
      <Grid class="flex-1">
        <template #action="{ row }">
          <div class="flex">
            <TableAction :outside="true" :actions="getTableActions(row)" />
          </div>
        </template>
        <template #files="{ row }">
          <FileCell :list="row.testReport" @click="handlePreview"></FileCell>
        </template>
      </Grid>
    </div>
    <UploadBtn ref="uploadRef" type="link" @success="afterUpload"></UploadBtn>
    <PreviewModal ref="filePreviewRef" />
  </BasicPopup>
</template>
<script lang="ts" setup>
  import { reactive, toRefs, nextTick, h, ref } from 'vue';
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { TableAction, ActionItem } from '/@/components/Table';
  import { cloneDeep, debounce, pick } from 'lodash-es';
  import { getTemporaryDeliveryDetail, saveOrUpdateTemporaryDelivery } from '/@/api/warehouse/moldTemp';
  import { selectMultiple } from '/@/api/business/quota';
  import { Subtitle } from '/@/components/Subtitle';
  import { useBaseStore } from '/@/store/modules/base';
  import { useVbenVxeGrid, VxeGridProps } from '/@/adapter/vxe-table';
  import { buildUUID } from '/@/utils/uuid';
  import { splitArrayIntoChunks } from '/@/utils/splitArrayIntoChunks';
  import { UploadBtn, FileCell, PreviewModal } from '/@/components/Upload';
  import { getFactoryList } from '/@/api/basicData/factory';
  import { getMoldNumberList } from '/@/api/warehouse/moIdBill';
  import { getShipList } from '/@/api/common/basedata';
  import { getSupplierlist, getInnermaterialnumberlist } from '/@/api/engineering/mould';

  const emits = defineEmits(['register', 'reload']);

  interface State {
    mode: 'add' | 'upgrade' | 'view';
    title: string;
    base: any;
    line: number;
    validate: string;
    initFields: any;
  }

  const { t } = useI18n();
  const state = reactive<State>({
    mode: 'add',
    title: '',
    base: {},
    line: 1,
    validate: '',
    initFields: {},
  });
  const { title } = toRefs(state);

  const { createMessage } = useMessage();

  const baseStore = useBaseStore();

  function handleInnerPartNumberItem(data) {
    const _item: any = {
      factory: data.factory,
      factoryName: data.factoryName || data.factoryFullName || data.FactoryName,
    };
    if (data.insidePartNumber) {
      _item.insidePartNumber = data.insidePartNumber;
    }
    if (data.shippingSpaceCode) {
      _item.shippingSpaceCode = data.shippingSpaceCode;
      _item.shippingSpaceName = data.shippingSpaceName;
    }
    if (data.manufacturer) {
      _item.manufacturer = data.manufacturer;
      _item.manufacturerName = data.manufacturerName;
    }
    if (data.moldType) {
      _item.moldType = data.moldType;
      _item.moldTypeName = data.moldTypeName;
    }
    if (data.status) {
      _item.status = data.status;
      _item.statusName = data.statusName;
    }
    return _item;
  }
  function handlePartNumChange(_, data, params) {
    const {
      $grid: { setRow },
      row,
    } = params;
    const item = handleInnerPartNumberItem(data);
    setRow(row, item);
  }
  let menuTableColumns: any[] = [
    {
      field: 'moldPartNumber',
      title: '模具料号',
      formatter: 'ApiSelect',
      editRender: {
        name: 'ApiSelect',
        props: {
          placeholder: '模具料号',
          api: getMoldNumberList,
          showSearch: true,
          params: {
            type: 2,
            page: 20,
          },
          apiSearch: {
            show: false,
            keyword: 'moldPartNumber',
          },
          resultField: 'data',
          labelField: 'moldPartNumber',
          valueField: 'moldPartNumber',
          onChange: handlePartNumChange,
        },
      },
    },
    {
      title: '模具状态',
      field: 'status',
      formatter: 'ApiSelect',
      editRender: {
        name: 'ApiSelect',
        cacheField: 'statusName',
        props: {
          api: () => baseStore.getDictionaryData('MoldLedgerStatusEnum', true),
          showSearch: false,
          filterOption: false,
          notFoundContent: null,
          resultField: 'data',
          labelField: 'fullName',
          valueField: 'enCode',
          immediate: true,
        },
      },
    },
    {
      title: '模具类型',
      field: 'moldType',
      formatter: 'ApiSelect',
      editRender: {
        name: 'ApiSelect',
        cacheField: 'moldTypeName',
        props: {
          api: () => baseStore.getDictionaryData('MoldApply.MoldType'),
          showSearch: false,
          filterOption: false,
          notFoundContent: null,
          resultField: 'data',
          labelField: 'fullName',
          valueField: 'enCode',
          immediate: true,
        },
      },
    },
    {
      title: '产品内部料号',
      field: 'insidePartNumber',
      width: 240,
      formatter: 'ApiSelect',
      editRender: {
        name: 'ApiSelect',
        cacheField: 'insidePartNumber',
        props: {
          api: getInnermaterialnumberlist,
          showSearch: true,
          autoFocus: true,
          apiSearch: {
            show: true,
            searchName: 'insidePartNumber',
          },
          params: {
            pageSize: 50,
          },
          resultField: 'data',
          labelField: 'insidePartNumber',
          valueField: 'insidePartNumber',
          immediate: false,
        },
      },
    },
    {
      title: '工厂',
      field: 'factory',
      formatter: 'ApiSelect',
      editRender: {
        name: 'ApiSelect',
        cacheField: 'factoryName',
        props: {
          api: getFactoryList,
          showSearch: false,
          // preciseParam: 'materialWidth',
          filterOption: false,
          notFoundContent: null,
          resultField: 'data',
          labelField: 'Name',
          valueField: 'Code',
          immediate: true,
        },
      },
    },
    {
      title: '供应商',
      field: 'manufacturer',
      formatter: 'ApiSelect',
      editRender: {
        name: 'ApiSelect',
        props: {
          api: getSupplierlist,
          apiSearch: {
            show: true,
            searchName: 'searchKey',
          },
          showSearch: true,
          filterOption: false,
          resultField: 'data',
          labelField: 'name',
          valueField: 'code',
          immediate: true,
          alwaysLoad: true,
        },
      },
      width: 200,
    },
    {
      title: '当前仓位',
      field: 'shippingSpaceCode',
      minWidth: 240,
      formatter: 'ApiSelect',
      editRender: {
        name: 'ApiSelect',
        cacheField: 'shippingSpaceName',
        props: {
          api: getShipList,
          showSearch: true,
          apiSearch: {
            show: true,
            searchName: 'shippingSpace',
          },
          rowParams: {
            factoryCode: 'factory',
          },
          resultField: 'data',
          labelField: 'shippingSpaceName',
          valueField: 'shippingSpaceCode',
          nameFormat: ['shippingSpaceCode', '/', 'shippingSpaceName'],
        },
      },
    },
    {
      title: '检测报告',
      field: 'testReport',
      width: 300,
      slots: {
        default: 'files',
      },
    },
    {
      title: '数量',
      field: 'existStockQty',
      width: 120,
      editRender: {
        name: 'InputNumber',
        props: {
          min: 1,
          max: 99999,
        },
      },
    },
    {
      title: t('common.action'),
      field: 'action',
      width: 120,
      slots: { default: 'action' },
      fixed: 'right',
    },
  ];

  const gridOptions: VxeGridProps = {
    id: 'warehouse-mouldBusiness-temp-edit',
    columns: menuTableColumns,
    height: 'auto',
    editConfig: {
      trigger: 'dblclick',
      mode: 'row',
      beforeEditMethod({ rowIndex }) {
        return state.mode !== 'view';
      },
    },
    editRules: {
      proj: [{ required: true, message: t('common.required') }],
    },
    rowConfig: {
      keyField: '_X_ROW_KEY',
    },
    scrollX: { enabled: true },
    keyboardConfig: {
      isClip: true,
      isEdit: true,
      isDel: true,
      isEsc: true,
    },
    showOverflow: true,
    keepSource: true,
    data: [state.initFields],
    proxyConfig: {
      enabled: false,
    },
    toolbarConfig: {
      enabled: false,
    },
    clipConfig: {
      isPaste: true,
      afterPasteMethod: handleAfterPaster,
      // copyMethod: handleCopyMethod,
    },
    i18nConfig: {
      moduleCode: 'ProjDocColumn',
    },
    showIndexColumn: true,
    pagerConfig: {
      enabled: false,
    },
    position: 'modal',
  };
  const [Grid, gridApi] = useVbenVxeGrid({ gridOptions });
  const { reloadColumn, getDataSource, reloadData } = gridApi;

  const [registerPopup, { closePopup, changeOkLoading, changeLoading }] = usePopupInner(init);

  // 初始化
  async function init(data) {
    changeLoading(true);
    state.mode = data.mode || 'add';
    // switch (data.mode) {
    //   case 'add':
    //     state.title = t('common.addText');
    //     reloadColumn(menuTableColumns);
    //     break;
    //   default:
    //     state.title = t('common.detailText');
    //     const detailcolumn = cloneDeep(menuTableColumns);
    //     detailcolumn.pop();
    //     reloadColumn(detailcolumn);
    //     break;
    // }
    if (data.mode === 'add') {
      state.title = t('common.addText');
      reloadColumn(menuTableColumns);
    } else {
      state.title = t('common.detailText');
      const detailcolumn = cloneDeep(menuTableColumns);
      detailcolumn.pop();
      reloadColumn(detailcolumn);
    }
    handleDetail(data);
  }

  function getTableActions(row): ActionItem[] {
    return [
      {
        label: t('common.upFiles'),
        onClick: handleUpload.bind(null, row),
      },
      {
        label: '',
        icon: 'icon-ym icon-ym-btn-copy',
        tooltip: t('common.copyText'),
        onClick: handleCopy.bind(null, row),
      },
      {
        label: '',
        color: 'error',
        icon: 'icon-ym icon-ym-delete',
        tooltip: t('common.delText'),
        onClick: handleDelete.bind(null, row),
      },
    ];
  }

  const uploadRef = ref();
  const currentUploadId = ref('');
  // 上传数据
  const handleUpload = debounce(async row => {
    currentUploadId.value = row._X_ROW_KEY;
    uploadRef.value?.click();
  }, 1000);
  function afterUpload(fileList) {
    const list = getDataSource();
    const fileListBackup = cloneDeep(fileList);
    const index = list.findIndex(el => el._X_ROW_KEY == currentUploadId.value);
    const { testReport } = list[index];
    if (testReport && testReport.length) {
      // 如果当前的行数据已经有数据了，则进行拼接
      list[index].testReport = testReport.concat(fileListBackup);
    } else {
      list[index].testReport = fileListBackup;
    }
    createMessage.success(t('component.upload.uploadSuccess'));
    uploadRef.value.clearUploadFileList();
    reloadData(list);
  }
  const filePreviewRef = ref<any | null>(null);
  async function handlePreview(item) {
    const params = {
      name: item.fileName,
      filePath: item.filePath,
      version: 2,
    };
    filePreviewRef.value?.init(params);
  }

  // 处理详情页进来的数据
  function handleDetail(data) {
    const list = cloneDeep(data.list || []);
    if (!list.length) {
      return changeLoading(false);
    }
    getTemporaryDeliveryDetail(data.list.map(el => el.id))
      .then(res => {
        const _list = (res.data || []).map(el => {
          el._X_ROW_KEY = el.id;
          el.testReport = el.testReportList;
          return el;
        });
        reloadData(_list);
      })
      .finally(() => {
        changeLoading(false);
      });
  }

  // 删除数据
  function handleDelete(row) {
    gridApi.grid.remove(row);
  }
  // 增加列
  function handleAddColumn(line) {
    const list = getDataSource();
    for (let i = 0; i < line; i++) {
      list.push({
        _X_ROW_KEY: buildUUID(),
        ...state.initFields,
      });
    }
    gridApi.grid.reloadData(list);
  }
  function handleCopy(row) {
    const item = cloneDeep(row);
    item._X_ROW_KEY = buildUUID();
    const list = getDataSource();
    const index = list.findIndex(el => el._X_ROW_KEY == row._X_ROW_KEY);
    list.splice(index, 0, item);
    gridApi.grid.reloadData(list);
  }
  function handleAfterPaster({ targetAreas, pasteCells }) {
    if (targetAreas.length === 0) {
      return;
    }
    const { cols } = targetAreas[0];
    // 找出粘贴的第几列，如粘贴料号，粘贴区域第0列就是料号，对应excel也是第0列
    const targetIndex = cols.findIndex(item => item.field === 'insidePartNumber');
    if (targetIndex == -1) return;
    const list = pasteCells.map(item => item[targetIndex]);
    const chunks = splitArrayIntoChunks(list, 1000);

    const promiseList = [];
    chunks.forEach(item => {
      promiseList.push(
        selectMultiple({
          pageSize: 1000,
          insidePartNumber: item,
        }),
      );
    });
    Promise.all(promiseList).then(res => {
      console.log(res);
      const data = res.reduce((prev, cur) => {
        return prev.concat(cur.data.list);
      }, []);
      // 设置rows的值
      const datalist = data.map(item => {
        return handleInnerPartNumberItem(item);
        // TODO: 区分两种数据 如果是已经存在的数据，则更新表格，如果不是则新建行数据
      });
      if (datalist.length == 0) return createMessage.warning(t('common.invalidatePartNumber'));
      nextTick(() => {
        gridApi.grid.reloadData(datalist);
      });
    });
  }

  async function handleSave(type) {
    if (await gridApi.grid.validate(true)) {
      return createMessage.warning(t('dict.SalesSiteColumn.requiredTip'));
    }
    const pickFields = [
      'id',
      'testReport',
      'factory',
      'moldPartNumber',
      'status',
      'insidePartNumber',
      'moldType',
      'shippingSpaceCode',
      'existStockQty',
      'manufacturer',
    ];
    changeLoading(true);
    const list = gridApi.grid.getFullData().map(el => pick(el, pickFields));
    // 参数
    const params = list;
    saveOrUpdateTemporaryDelivery(params)
      .then(() => {
        changeLoading(false);
        createMessage.success(t('sys.api.operationSuccess'));
        emits('reload');
        closePopup();
      })
      .catch(() => {
        changeLoading(false);
      });
  }
</script>

<style lang="less">
  .requirement-pop {
    display: flex;
    flex-direction: column;
    padding: 20px 12px 10px;
  }
</style>
