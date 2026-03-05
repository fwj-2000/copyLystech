<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    :showOkBtn="state.mode != 'view'"
    :okText="t('common.submit')"
    :title="title"
    @ok="handleSave"
    class="full-popup">
    <template #insertToolbar>
      <!-- <a-button v-if="state.mode != 'view'" class="mr-3" @click="handleSave('storage')" type="primary" ghost>{{ t('common.temporarySave') }}</a-button> -->
    </template>
    <div class="h-full requirement-pop">
      <!-- <div class="flex align-middle">
        <div class="mb-20px">{{ t('common.approver') }}：</div>
        <BasicForm class="flex-1" @register="registerForm" />
      </div> -->
      <Subtitle :title="state.title" class="mt-2px" :extra="{ show: state.mode == 'uploadFile', hideAdd: true }">
        <!-- <template #afterTitle>
          <a-button v-if="state.mode == 'uploadFile'" type="primary" ghost @click="handleBeforeBatch">{{ t('common.batchAdd') }}</a-button>
        </template>
        <template #extra>
          <AddCustomRows @submit="addColumn" />
        </template> -->
      </Subtitle>
      <Grid>
        <template #action="{ row }">
          <div class="flex">
            <TableAction :outside="true" :actions="getTableActions(row)" />
          </div>
        </template>
        <template #files="{ row }">
          <FileCell :list="row.fileJson" @click="handlePreview"></FileCell>
        </template>
      </Grid>
    </div>
    <batchAdd @register="registerAddModal" @reload="handleBatchAdd"></batchAdd>
    <UploadBtn ref="uploadRef" type="link" :maxFileSize="30" @success="afterUpload"></UploadBtn>
    <!-- 上传文件，最大为30M -->
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
  import { useModal } from '/@/components/Modal';
  import batchAdd from '/@/views/business/quantitation/requirement/components/BatchAddModal.vue';
  // import { getQuantitationApplyDetailByMaterial } from '/@/api/business/quantitation';
  import { getPartNumberApplySearch } from '/@/api/engineering/drawingReviewRequirements';
  import { getUpgradeDetails, saveProjFiles, saveProjectDoc } from '/@/api/business/projectFiles';
  import { selectMultiple } from '/@/api/business/quota';
  import { Subtitle } from '/@/components/Subtitle';
  import { useBaseStore } from '/@/store/modules/base';
  import { useVbenVxeGrid, VxeGridProps } from '/@/adapter/vxe-table';
  import { buildUUID } from '/@/utils/uuid';
  import { splitArrayIntoChunks } from '/@/utils/splitArrayIntoChunks';
  import { UploadBtn, FileCell, PreviewModal } from '/@/components/Upload';
  import { useUserStore } from '/@/store/modules/user';

  const [registerAddModal, { openModal }] = useModal();
  const emits = defineEmits(['register', 'refresh']);

  interface State {
    mode: 'uploadFile' | 'upgrade' | 'view';
    title: string;
    base: any;
    line: number;
    validate: string;
    initFields: any;
    isNewOrder: boolean; // 是否是新订单
  }

  const { t } = useI18n();
  const state = reactive<State>({
    mode: 'uploadFile',
    title: '',
    base: {},
    line: 1,
    validate: '',
    initFields: {},
    isNewOrder: false, // 是否是新订单
  });
  const { title } = toRefs(state);

  const { createMessage } = useMessage();

  const baseStore = useBaseStore();

  // const [registerForm, { getFieldsValue, setFieldsValue, setProps: setPropsForm }] = useForm({
  //   baseColProps: { span: 5 },
  //   layout: 'horizontal',
  //   schemas: [
  //     {
  //       field: 'Review1',
  //       label: '',
  //       component: 'CustomUserSelect',
  //       componentProps: {},
  //     },
  //     {
  //       field: 'Review2',
  //       label: '',
  //       component: 'CustomUserSelect',
  //       componentProps: {},
  //     },
  //     {
  //       field: 'Review3',
  //       label: '',
  //       component: 'CustomUserSelect',
  //     },
  //   ],
  // });

  function handleInnerPartNumberItem(data) {
    const _item: any = {
      factory: data.factory || data.FactoryName || data.factoryFullName || data.factoryName,
      insideProjectCode: data.InsideProjectCode || data.insideProjectCode,
    };
    if (data.insidePartNumber) {
      _item.insidePartNumber = data.insidePartNumber;
    }
    return _item;
  }
  let menuTableColumns: any[] = [
    {
      title: '产品内部料号',
      field: 'insidePartNumber',
      width: 240,
      formatter: 'ApiSelect',
      editRender: {
        name: 'ApiSelect',
        props: {
          api: getPartNumberApplySearch,
          disabled: true,
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
          onChange: (_, data, params) => {
            const {
              $grid: { setRow },
              row,
            } = params;
            const item = handleInnerPartNumberItem(data);
            setRow(row, item);
            nextTick(() => {
              row.factory = item.factory;
            });
          },
        },
      },
    },
    {
      title: '工厂',
      field: 'factory',
      i18nField: 'factory',
      width: 240,
    },
    {
      title: '阶段',
      field: 'stage',
      width: 200,
      cacheField: 'stageName',
      formatter: 'ApiSelect',
      editRender: {
        name: 'ApiSelect',
        props: {
          api: () => baseStore.getDictionaryData('projDocStage'),
          disabled: true,
          labelField: 'fullName',
          valueField: 'enCode',
          immediate: true,
          filterOption: true,
          onChange: async (v, data, params) => {
            const { row } = params;
            row.fileType = '';
            row.fileTypeName = '';
            row.fileTypeOptions = ((await baseStore.getDictionaryData(v + 'FileType')) || []).map(el => {
              return {
                value: el.enCode,
                label: el.fullName,
              };
            });
            console.log(row.fileTypeOptions, 'fileTypeOptions');
          },
        },
      },
    },
    {
      title: '文件类型',
      field: 'fileType',
      width: 200,
      formatter: 'ApiSelect',
      cacheField: 'fileTypeName',
      editRender: {
        name: 'ApiSelect',
        dynamicOptionsField: 'fileTypeOptions',
        props: {
          filterOption: true,
          disabled: true,
          showSearch: true,
          labelField: 'fullName',
          valueField: 'enCode',
          optionFilterProp: 'label',
        },
      },
    },
    {
      title: '附件',
      field: 'fileJson',
      width: 300,
      slots: {
        default: 'files',
      },
    },
    {
      title: '版本',
      field: 'version',
      width: 200,
      formatter: ({ cellValue }) => {
        return `T${cellValue || 0}`;
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
    id: 'business-basicInformation-projectFiles-maint-edit',
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
      // insidePartNumber: [
      //   {
      //     trigger: 'blur',
      //     validator: ({ row }) => {
      //       const ErrorText = handleValidate(row);
      //       if (ErrorText) {
      //         return Error(ErrorText);
      //       }
      //     },
      //   },
      // ],
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
  };
  const [Grid, gridApi] = useVbenVxeGrid({ gridOptions });
  const { reloadColumn, getDataSource, reloadData } = gridApi;

  const [registerPopup, { closePopup, changeLoading }] = usePopupInner(init);

  // 初始化
  async function init(data) {
    changeLoading(true);
    state.mode = data.mode || 'uploadFile';
    state.isNewOrder = data.setDefaultAudit || false;
    // setPropsForm({
    //   disabled: data.mode == 'view',
    // });
    // 判断当前的环境
    switch (data.mode) {
      case 'uploadFile':
        state.title = t('common.upFiles');
        reloadColumn(menuTableColumns);
        handleDetail(data);
        break;
      case 'upgrade': {
        state.title = t('common.upgrade');
        const editColumns = cloneDeep(menuTableColumns);
        editColumns.splice(
          menuTableColumns.length - 2,
          1,
          // 变更后版本
          {
            title: t('dict.ECNColumn.version'),
            field: 'version',
            width: 200,
            formatter: ({ cellValue }) => {
              return `T${cellValue || 0}`;
            },
          },
          {
            title: '项目',
            field: 'proj',
            width: 200,
            editRender: {
              cacheField: 'projName',
              name: 'CustomUserSelect',
            },
          },
        );
        reloadColumn(editColumns);
        // 获取详情
        handleUpgradeDetail(data.list);
        break;
      }
      case 'view': {
        state.title = t('common.detailText');
        const detailcolumn = cloneDeep(menuTableColumns);
        detailcolumn.pop();
        reloadColumn(detailcolumn);
        handleDetail(data);
        break;
      }
      default:
        break;
    }
    if (data.setDefaultAudit) {
      handleDefaultAudit();
    }
  }

  function getTableActions(row): ActionItem[] {
    return [
      {
        label: '上传附件',
        onClick: handleUpload.bind(null, row),
      },
      // {
      //   label: '',
      //   icon: 'icon-ym icon-ym-btn-copy',
      //   tooltip: t('common.copyText'),
      //   onClick: handleCopy.bind(null, row),
      //   ifShow: state.mode == 'uploadFile',
      // },
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
    // // 升版可不做校验
    // if (state.mode !== 'upgrade') {
    //   // 请先填写完整信息再上传
    //   if (!row.insidePartNumber || !row.stage || !row.fileType) {
    //     return createMessage.warn(t('common.fullInfo'));
    //   }
    //   // 判断该数据是否符合需求
    //   const res = await checkUploadStatusProjFiles(pick(row, ['id', 'insidePartNumber', 'stage', 'fileType']));
    //   if (res.data) {
    //     // 该文件类型已上传过，如要替换，请升版
    //     return createMessage.warn(t('common.upgradeTip2'));
    //   }
    // }
    currentUploadId.value = row._X_ROW_KEY;
    uploadRef.value?.click();
  }, 1000);
  function afterUpload(fileList) {
    const list = getDataSource();
    const fileListBackup = cloneDeep(fileList);
    const index = list.findIndex(el => el._X_ROW_KEY == currentUploadId.value);
    const { fileJson } = list[index];
    if (fileJson && fileJson.length) {
      // 如果当前的行数据已经有数据了，则进行拼接
      list[index].fileJson = fileJson.concat(fileListBackup);
    } else {
      list[index].fileJson = fileListBackup;
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

  // 获取升版详情
  async function handleUpgradeDetail(list) {
    const res = await getUpgradeDetails(list.map(el => el.id));
    if (res.code == 200) {
      const { data } = res;
      reloadData(
        (data || []).map(el => {
          el._X_ROW_KEY = el.id;
          el.fileJson = state.isNewOrder ? [] : JSON.parse(el.fileJson || '[]'); // 新建升版需要置空文件信息
          return el;
        }),
      );
      changeLoading(false);
    } else {
      changeLoading(false);
    }
  }
  // 处理详情页进来的数据
  function handleDetail(data) {
    const list = cloneDeep(data.list || []);
    if (!list.length) {
      return changeLoading(false);
    }
    setTimeout(() => {
      // let reviewList = [];
      list.forEach(el => {
        el._X_ROW_KEY = el.id;
        el.fileJson = JSON.parse(el.fileJson || '[]');
        // reviewList = JSON.parse(el.reviewJson || '[]');
        return el;
      });
      // const reviewJson = reviewList.reduce((prev, cur: any) => {
      //   return {
      //     ...prev,
      //     [cur.node]: cur.handlerId,
      //   };
      // }, {});
      // setFieldsValue(reviewJson);
      reloadData(list);
      changeLoading(false);
    }, 0);
  }
  // 默认审批人
  function handleDefaultAudit() {
    // const userInfo: any = useUserStore().getUserInfo;
    // setFieldsValue({
    //   Review1: userInfo?.managerId,
    // });
  }

  // 删除数据
  function handleDelete(row) {
    gridApi.grid.remove(row);
  }

  // 批量添加
  function handleBatchAdd(data) {
    let list = getDataSource();
    if (data.length) {
      // 若是当前的表格没有填写数据
      if (list.length && list[0].insidePartNumber == '') {
        list = [];
      }
      (data || []).forEach(item => {
        list.push(Object.assign(cloneDeep(state.initFields), handleInnerPartNumberItem(item, 'uploadFile')));
      });
      gridApi.grid.reloadData(list);
    }
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

    const pickFields = ['id', 'fileJson', 'proj', 'projName'];
    // if (state.mode == 'upgrade' && state.isNewOrder) {
    //   pickFields.splice(0, 1);
    // }
    const list = gridApi.grid.getFullData().map(el => pick(el, pickFields));
    // 参数
    // const audits = getFieldsValue();
    const params = {
      saveAndCommit: type !== 'storage', // 是否提交
      isUpgrade: state.mode == 'upgrade', // 是否升版
      // reviewJson: [
      //   {
      //     node: 'Review1',
      //     handlerId: audits['Review1'],
      //   },
      //   {
      //     node: 'Review2',
      //     handlerId: audits['Review2'],
      //   },
      //   {
      //     node: 'Review3',
      //     handlerId: audits['Review3'],
      //   },
      // ],
      list,
    };

    if (state.mode === 'upgrade') {
      const fields = gridApi.grid
        .getColumns()
        .slice(0, -1)
        .map(el => (el.type ? '' : el.field))
        .filter(Boolean);
      // `撤回(4)`或者`驳回(5)`
      const idDeliveryList = [4, 5];
      params.list = gridApi.grid.getFullData().map(el => {
        // 如果是`撤回(4)`或者`驳回(5)`后再次编辑升版，需要传输id；否则不传
        const obj = idDeliveryList.includes(+el.status) ? { id: el.id } : {};
        fields.forEach(field => {
          obj[field] = el[field];
        });
        return obj;
      });
    }

    const api = state.mode == 'uploadFile' ? saveProjectDoc : saveProjFiles;
    changeLoading(true);
    api(params)
      .then(() => {
        changeLoading(false);
        createMessage.success(t('sys.api.operationSuccess'));
        emits('refresh');
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
