<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    :showOkBtn="state.mode != 'view'"
    :okText="t('common.submit')"
    :okButtonProps="{ class: 'mr-12px' }"
    :title="title"
    @ok="handleSave"
    class="full-popup">
    <!-- 暂存按钮移至centerToolbar插槽，这样顺序就是：取消，暂存，提交 -->
    <template #centerToolbar>
      <a-button v-if="state.mode != 'view'" class="ml-12px" @click="handleSave('storage')" type="primary" ghost>{{ t('common.temporarySave') }}</a-button>
    </template>
    <div class="h-full requirement-pop">
      <Subtitle :title="t('routes.business-basicInformation-projectFiles-demand')" class="mt-2px" :extra="{ show: state.mode == 'add', hideAdd: true }">
        <template #afterTitle>
          <a-button v-if="state.mode == 'add'" type="primary" ghost @click="handleBeforeBatch">{{ t('common.batchAdd') }}</a-button>
        </template>
        <template #extra>
          <AddCustomRows @submit="addColumn" />
        </template>
      </Subtitle>
      <Grid>
        <template #action="{ row, rowIndex }">
          <div class="flex">
            <TableAction :outside="true" :actions="getTableActions(row, rowIndex)" />
          </div>
        </template>
      </Grid>
    </div>
    <batchAdd @register="registerAddModal" @reload="handleBatchAdd"></batchAdd>
  </BasicPopup>
</template>
<script lang="ts" setup>
  import { reactive, toRefs } from 'vue';
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { TableAction, ActionItem } from '/@/components/Table';
  import { cloneDeep, pick } from 'lodash-es';
  import { useModal } from '/@/components/Modal';
  import batchAdd from '/@/views/business/quantitation/requirement/components/BatchAddModal.vue';
  import { saveProjFiles } from '/@/api/business/projectFiles';
  import { selectMultiple } from '/@/api/business/quota';
  import { Subtitle } from '/@/components/Subtitle';
  import { useVbenVxeGrid, VxeGridProps } from '/@/adapter/vxe-table';
  import { buildUUID } from '/@/utils/uuid';
  import { splitArrayIntoChunks } from '/@/utils/splitArrayIntoChunks';
  import { AddCustomRows } from '/@/components/AddCustomRows';
  import { getColumns, handleInnerPartNumberChange, handleStageChange, changeMaintPersonId } from './ApplyPopupVxeConfig';
  import { getUserInfoList } from '/@/api/permission/user';
  import { getUserListByAccountList } from '/@/api/business/salesForecast';
  import { useBaseStore } from '/@/store/modules/base';
  import { pastePartNumberFactorys } from '/@/utils/pasterPartNumberFactorys';

  const [registerAddModal, { openModal }] = useModal();
  const emits = defineEmits(['register', 'refresh']);
  const baseStore = useBaseStore();

  interface State {
    mode: 'add' | 'edit' | 'view';
    title: string;
    base: any;
    line: number;
    validate: string;
    initFields: any;
    isNewOrder: boolean; // 是否是新订单
  }

  const { t } = useI18n();
  const state = reactive<State>({
    mode: 'add',
    title: t('routes.business-basicInformation-projectFiles-demand'),
    base: {},
    line: 1,
    validate: '',
    initFields: {
      insidePartNumber: '',
    },
    isNewOrder: false, // 是否是新订单
  });
  const { title } = toRefs(state);

  const { createMessage } = useMessage();

  const menuTableColumns: any[] = getColumns();

  const gridOptions: VxeGridProps = {
    id: 'business-basicInformation-projectFiles-demand-edit',
    columns: menuTableColumns,
    height: 'auto',
    editConfig: {
      trigger: 'dblclick',
      mode: 'row',
      beforeEditMethod() {
        return state.mode == 'add';
      },
    },
    editRules: {
      insidePartNumber: [
        {
          trigger: 'blur',
          validator: ({ row }) => {
            const ErrorText = handleValidate(row);
            if (ErrorText) {
              return Error(ErrorText);
            }
          },
        },
      ],
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
    data: [{ ...state.initFields }],
    proxyConfig: {
      enabled: false,
    },
    toolbarConfig: {
      enabled: false,
    },
    clipConfig: {
      isPaste: true,
      // @ts-ignore
      afterPasteMethod: handleAfterPaster,
      // copyMethod: handleCopyMethod,
    },
    // @ts-ignore
    i18nConfig: {
      moduleCode: 'ProjDocColumn',
    },
    showIndexColumn: true,
    pagerConfig: {
      enabled: false,
    },
  };
  const [Grid, gridApi] = useVbenVxeGrid({
    gridOptions,
    gridEvents: {
      // @ts-ignore
      'cell-delete-value': ({ row, column }) => {
        handleAfterPasterInsidePartNumber([column], [row]);
        handleAfterPasterStage([column], [row]);
        handleAfterPasterFileType([column], [row]);
        handleAfterPasterRole([column], [row]);
        handleAfterPasterUser([column], [row], { id: 'docUploadUser', name: 'docUploadUserName' });
        handleAfterPasterUser([column], [row], { id: 'dqe', name: 'dqeName' });
      },
    },
  });
  const { reloadColumn, getDataSource, reloadData } = gridApi;

  const [registerPopup, { closePopup, changeLoading }] = usePopupInner(init);

  // 初始化
  async function init(data: any) {
    changeLoading(true);
    state.mode = data.mode || 'add';
    state.isNewOrder = data.setDefaultAudit || false;
    // 判断当前的环境
    switch (data.mode) {
      case 'add':
        state.title = t('common.addText');
        reloadColumn(menuTableColumns);
        handleDetail(data);
        break;
      case 'edit':
        state.title = t('common.editText');
        reloadColumn(menuTableColumns);
        handleDetail(data);
        break;
      case 'view':
        state.title = t('common.detailText');
        const detailcolumn = cloneDeep(menuTableColumns);
        detailcolumn.pop();
        reloadColumn(detailcolumn);
        handleDetail(data);
        break;
      default:
        break;
    }
  }

  function getTableActions(row: any, rowIndex: number): ActionItem[] {
    const list: ActionItem[] = [
      {
        label: '',
        icon: 'icon-ym icon-ym-btn-add',
        onClick: addColumn.bind(null, 1, rowIndex),
      },
      {
        label: '',
        icon: 'icon-ym icon-ym-btn-copy',
        tooltip: t('common.copyText'),
        onClick: handleCopy.bind(null, row),
        ifShow: state.mode == 'add',
      },
      {
        label: '',
        color: 'error',
        icon: 'icon-ym icon-ym-delete',
        tooltip: t('common.delText'),
        onClick: handleDelete.bind(null, row),
      },
    ];
    return state.mode === 'add' ? list : list.slice(-1);
  }

  // 处理详情页进来的数据
  function handleDetail(data) {
    const list = cloneDeep(data.list || []);
    if (!list.length) {
      return changeLoading(false);
    }
    setTimeout(() => {
      list.forEach((el: any) => {
        el._X_ROW_KEY = el.id;
        el.fileJson = JSON.parse(el.fileJson || '[]');
        return el;
      });
      reloadData(list);
      changeLoading(false);
    }, 0);
  }

  // 删除数据
  function handleDelete(row) {
    gridApi.grid.remove(row);
  }
  // 增加列
  function addColumn(line: number, rowIndex = -1) {
    const list = getDataSource();
    const addList: Array<any> = [];
    for (let i = 0; i < line; i++) {
      addList.push({
        _X_ROW_KEY: buildUUID(),
        ...state.initFields,
      });
    }
    if (rowIndex === -1) {
      list.push(...addList);
    } else {
      list.splice(rowIndex + 1, 0, ...addList);
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
  // 打开批量添加的弹框
  function handleBeforeBatch() {
    openModal(true, {});
  }
  // 批量添加
  function handleBatchAdd(data: any) {
    let list = getDataSource();
    if (data.length) {
      // 若是当前的表格没有填写数据
      if (list.length && list[0].insidePartNumber == '') {
        list = [];
      }
      (data || []).forEach(item => {
        const row = cloneDeep(state.initFields);
        row.insidePartNumber = item.insidePartNumber;
        handleInnerPartNumberChange(row, item);
        list.push(row);
      });
      gridApi.grid.reloadData(list);
    }
  }

  async function handleAfterPaster({ targetAreas, pasteCells }) {
    if (targetAreas.length === 0) {
      return false;
    }
    const { cols, rows } = targetAreas[0];

    // 产品内部料号 复制黏贴处理
    await handleAfterPasterInsidePartNumber(cols, rows);

    // 阶段 复制粘帖处理
    handleAfterPasterStage(cols, rows);

    // 文件类型 复制粘帖处理
    handleAfterPasterFileType(cols, rows);

    // 角色 复制粘帖处理
    handleAfterPasterRole(cols, rows);

    // 资料维护人 复制粘帖处理
    handleAfterPasterUser(cols, rows, { id: 'docUploadUser', name: 'docUploadUserName' });

    // DQE 复制粘帖处理
    handleAfterPasterUser(cols, rows, { id: 'dqe', name: 'dqeName' });

    // 工厂复制黏贴处理
    await pastePartNumberFactorys({
      cols,
      rows,
      pasteCells,
      fields: {
        partNumberField: 'insidePartNumber',
        factoryField: 'factory',
        factoryNameField: 'factoryName',
        factoryValueField: 'Code',
        factoryNameFormat: ['Code', '/', 'Name'],
      },
    });
    return true;
  }

  /**
   * 产品内部料号 复制黏贴处理
   * @param cols
   * @param rows
   */
  async function handleAfterPasterInsidePartNumber(cols: Array<{ field: string }>, rows: Array<{ insidePartNumber: string }>) {
    // 找出粘贴的第几列，如粘贴料号，粘贴区域第0列就是料号，对应excel也是第0列
    const targetIndex = cols.findIndex(item => item.field === 'insidePartNumber');
    if (targetIndex == -1) return false;
    const list = rows.map(row => row?.insidePartNumber);
    const chunks = splitArrayIntoChunks(list, 1000);

    const promiseList: Array<any> = [];
    chunks.forEach(item => {
      promiseList.push(
        selectMultiple({
          pageSize: 1000,
          InsidePartNumbers: item,
          statusTag: '1,3',
        }),
      );
    });
    return Promise.all(promiseList)
      .then(res => {
        const data = res.reduce((prev, cur) => {
          return prev.concat(cur.data.list);
        }, []);
        // 设置rows的值
        rows.forEach((row: any) => {
          const target = data.find((item: any) => item.InsidePartNumber === row.insidePartNumber);
          target &&
            handleInnerPartNumberChange(row, {
              members: target.Members || [],
              factory: target.Factory || '',
              factoryName: target.FactoryName || '',
            });
        });
      })
      .catch(e => {
        console.error('🚀 ~ ApplyPopupVxe.vue:356 ~ handleAfterPasterInsidePartNumber ~ e:', e);
      });
  }

  /**
   * 阶段 复制粘帖处理
   * @param cols
   * @param rows
   */
  async function handleAfterPasterStage(cols: Array<{ field: string }>, rows: Array<{ insidePartNumber: string }>) {
    const targetIndex = cols.findIndex(item => item.field === 'stage');
    if (targetIndex == -1) return false;

    const list = await baseStore.getDictionaryData('projDocStage');
    const options = (list as Array<any>) || [];

    rows.forEach((row: any) => {
      const target = options.find((item: any) => item.enCode === row.stage || item.fullName === row.stage);
      row.stage = target?.enCode || '';
      row.stageName = target?.fullName || '';
      handleStageChange(row);
    });
  }

  /**
   * 文件类型 复制粘帖处理
   */
  function handleAfterPasterFileType(cols: Array<{ field: string }>, rows: Array<{ insidePartNumber: string }>) {
    const targetIndex = cols.findIndex(item => item.field === 'fileType');
    if (targetIndex == -1) return false;

    rows.forEach((row: any) => {
      const options = row.fileTypeOptions || [];
      const target = options.find((item: any) => item.value === row.fileType || item.label === row.fileType);
      row.fileType = target?.value || '';
      row.fileTypeName = target?.label || '';
    });
  }

  /**
   * 角色 复制粘帖处理
   * @param cols
   * @param rows
   */
  function handleAfterPasterRole(cols: Array<{ field: string }>, rows: Array<{ insidePartNumber: string }>) {
    const targetIndex = cols.findIndex(item => item.field === 'docUploadUserRole');
    if (targetIndex == -1) return false;

    rows.forEach((row: any) => {
      const options = row.roleOptions || [];
      const target = options.find((item: any) => item.value === row.docUploadUserRole || item.label === row.docUploadUserRole);
      row.docUploadUserRole = target?.value || '';
      row.docUploadUserRoleName = target?.label || '';

      changeMaintPersonId(row);
    });
  }

  /**
   * 复制黏贴用户处理
   * @param cols 复制的列配置
   * @param rows 复制的行内容
   * @param fieldConfig 赋值字段配置
   */
  function handleAfterPasterUser(cols: Array<{ field: string }>, rows: Array<any>, fieldConfig: { id: string; name: string }) {
    const targetIndex = cols.findIndex((item: any) => item.field === fieldConfig.id);
    if (targetIndex == -1 || rows.length === 0) return false;

    const { idList, accountList } = rows.reduce<{ idList: Array<string>; accountList: Array<string> }>(
      (obj, item: { [key: string]: string }) => {
        const value = item[fieldConfig.id] || '';
        // 如果是纯数字组成，则是id，否则按照accountList计算
        if (value && /^\d+$/.test(value)) {
          obj.idList.push(value);
        } else if (value) {
          const account = value.split('/').pop() || '';
          account && obj.accountList.push(account);
        }
        return obj;
      },
      { idList: [], accountList: [] },
    );

    Promise.all([
      idList.length > 0 ? getUserInfoList([...new Set(idList)]) : Promise.resolve({ data: [] }),
      accountList.length > 0 ? getUserListByAccountList([...new Set(accountList)]) : Promise.resolve({ data: {} }),
    ]).then(res => {
      const userList = [
        ...(res[0]?.data?.list || []),
        ...Object.values(res[1]?.data || {}).map((item: any) => ({ ...item, fullName: item.MergeName, id: item.Id })),
      ];
      rows.forEach((row: any) => {
        const target = userList.find(item => item.id === row[fieldConfig.id] || item.fullName === row[fieldConfig.id]);
        gridApi.grid.setRow(row, { [fieldConfig.id]: target?.id || '', [fieldConfig.name]: target?.fullName || '' });
      });
    });
  }

  // 数据校验
  function handleValidate(row) {
    const { desensitizedDrawingsId } = row;
    if (!desensitizedDrawingsId) {
      return t('common.insiderNumTip');
    }
    return false;
  }

  async function handleSave(type) {
    changeLoading(true);
    const pickFields = [
      'id',
      'insidePartNumber',
      'stage',
      'stageName',
      'factory',
      'fileType',
      'fileTypeName',
      'docUploadUserRole',
      'docUploadUserRoleName',
      'docUploadUser',
      'docUploadUserName',
      'dqe',
      'dqeName',
    ];
    if (state.isNewOrder) {
      pickFields.splice(0, 1);
    }
    const list = gridApi.grid.getFullData().map(el => pick(el, pickFields));
    // 参数
    const params = {
      saveAndCommit: type !== 'storage', // 是否提交
      isUpgrade: false, // 是否升版
      list,
    };
    saveProjFiles(params)
      .then(() => {
        createMessage.success(t('sys.api.operationSuccess'));
        emits('refresh');
        closePopup();
      })
      .catch(() => {})
      .finally(() => {
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
