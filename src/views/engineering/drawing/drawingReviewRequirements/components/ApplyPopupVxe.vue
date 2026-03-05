<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    :showOkBtn="state.showSubmit"
    :okText="t('common.submit')"
    :okButtonProps="{ class: 'mr-12px' }"
    :title="title"
    @ok="handleSave"
    class="full-popup">
    <template #centerToolbar>
      <a-button v-if="state.showSubmit" :loading="loading" class="ml-12px" @click="handleSave('storage')" type="primary" ghost>{{
        t('common.temporarySave')
      }}</a-button>
    </template>
    <div class="h-full requirement-pop p-10px">
      <div class="lydc-content-wrapper-search-box pt-8px mb-16px">
        <Subtitle :title="t('common.baseinfo')" />
        <BasicForm @register="registerForm" />
      </div>
      <Subtitle :title="t('common.requireInfo')" class="mt-8px" :extra="{ show: state.mode == 'add', hideAdd: true }">
        <template #afterTitle>
          <a-button v-if="state.mode == 'add'" type="primary" v-auth="'btn_batchAdd'" ghost @click="handleBeforeBatch">{{ t('common.batchAdd') }}</a-button>
        </template>
        <template #extra>
          <AddCustomRows @submit="addColumn" />
        </template>
      </Subtitle>
      <Grid :columns="columns" style="height: calc(100% - 170px)">
        <template #action="{ row }">
          <TableAction :outside="true" :actions="getTableActions(row)" />
        </template>
      </Grid>
    </div>
    <batchAdd @register="registerAddModal" @reload="handleBatchAdd"></batchAdd>
  </BasicPopup>
  <NodeModal @register="registerNodeModal"></NodeModal>
</template>
<script lang="ts" setup>
  import { reactive, toRefs, nextTick, h, ref } from 'vue';
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { TableAction, ActionItem } from '/@/components/Table';
  import { dateUtil } from '/@/utils/dateUtil';
  import { useUserStore } from '/@/store/modules/user';
  import { cloneDeep, pick } from 'lodash-es';
  import { BasicForm, FormSchema, useForm } from '/@/components/Form';
  import { useModal } from '/@/components/Modal';
  import { getUserInfoList } from '/@/api/permission/user';
  import { getUserListByAccountList } from '/@/api/business/salesForecast';
  import batchAdd from '/@/views/business/quantitation/requirement/components/BatchAddModal.vue';
  import { getQuantitationApplyDetailByMaterial, getprojectlist } from '/@/api/business/quantitation';
  import {
    createOrUpdateDrawingsReviewReq,
    saveDrawingsReviewReqDraft,
    getDrawingsReviewReqNodeHistory,
    getDrawingsReviewReqDetail,
  } from '/@/api/engineering/drawingReviewApply';
  import { selectMultiple } from '/@/api/business/quota';
  import { debounce } from '/@/utils/debounce';
  import { Subtitle } from '/@/components/Subtitle';
  import { NodeModal } from '/@/components/CustomComponents';
  import { STATUS_OPTIONS } from '/@/components/CustomComponents/src/quality/Constant';
  import { message } from 'ant-design-vue';
  import { useVbenVxeGrid, VxeGridProps } from '/@/adapter/vxe-table';
  import { buildUUID } from '/@/utils/uuid';
  import { splitArrayIntoChunks } from '/@/utils/splitArrayIntoChunks';
  import { AddCustomRows } from '/@/components/AddCustomRows';
  import dayjs from 'dayjs';
  import { CURRENT_RM_NODE } from '../config';
  import { getPartNumberFactoryList } from '/@/api/basicData/factory';
  import { pastePartNumberFactorys } from '/@/utils/pasterPartNumberFactorys';

  const [registerNodeModal, { openModal: openNodeModal }] = useModal();
  const [registerAddModal, { openModal }] = useModal();
  const emits = defineEmits(['register', 'refresh']);

  interface State {
    mode: 'add' | 'edit' | 'view';
    systemId: string;
    showSubmit: boolean;
    title: string;
    parentId: string;
    base: any;
    line: number;
    validate: string;
    initFields: any;
  }

  const { t } = useI18n();
  const state = reactive<State>({
    mode: 'add',
    showSubmit: true,
    systemId: '',
    title: '',
    parentId: '',
    base: {},
    line: 1,
    validate: '',
    initFields: {
      insidePartNumber: '',
      terminalCustomerPartNumber: '',
      projectPhase: '',
      factory: '',
      teakQty: '',
      customerDeliveryTime: '',
      epmId: '',
      epmName: '',
      isDrawingReview: '',
      remark: '',
    },
  });
  const { title } = toRefs(state);

  const userStore = useUserStore();
  const { createMessage } = useMessage();

  const viewSchema: FormSchema[] = [
    {
      field: 'applyCode',
      i18nField: 'applyNo',
      label: '需求单号',
      component: 'Input',
      componentProps: {
        disabled: true,
      },
    },
  ];
  const addSchema: FormSchema[] = [
    {
      field: 'insideProjectCode',
      label: '内部项目代码',
      component: 'ApiSelect',
      required: true,
      componentProps: {
        api: getprojectlist,
        placeholder: '输入大写字母查询',
        i18nField: 'CommonCol.higherCodeTip',
        showSearch: true,
        apiSearch: {
          show: true,
          searchName: 'code',
        },
        params: {
          pageSize: 100,
        },
        immediate: false,
        resultField: 'data',
        labelField: 'InsideProjectCode',
        valueField: 'InsideProjectCode',
        onChange: (value, data) => {
          setFieldsValue({
            terminalCustomerProjectCode: data.TerminalCustomerProjectCode,
          });
        },
      },
    },
    {
      field: 'terminalCustomerProjectCode',
      label: '终端项目代码',
      component: 'Input',
      required: true,
      componentProps: {
        placeholder: '自动带出',
        i18nField: 'CommonCol.autoCarryTip',
        disabled: true,
      },
    },
    {
      field: 'applyUserName',
      label: '申请人',
      component: 'Input',
      i18nField: 'CommonCol.applyUser',
      componentProps: { placeholder: '申请人', maxlength: 50, disabled: true },
    },
    {
      field: 'applyDateTime',
      label: '申请时间',
      component: 'Input',
      i18nField: 'CommonCol.applyTime',
      componentProps: { placeholder: '申请时间', maxlength: 50, disabled: true },
    },
  ];
  const [registerForm, { getFieldsValue, setFieldsValue, setProps: setPropsForm }] = useForm({
    baseColProps: { span: 4 },
    labelWidth: '200',
    layout: 'vertical',
    i18nConfig: {
      moduleCode: 'QuantitativeApplyColumn',
      transferRange: ['label', 'placeholder'],
    },
    schemas: [],
  });

  function handleInnerPartNumberItem(data, type?: 'add') {
    // 批导返回的接口字段和
    const Members = data.Members || data.members || [];
    const EPM = Members.find(item => item.configType == 'PDTLeader');
    const _item: any = {
      epmName: EPM?.memberName,
      epmId: EPM?.memberId,
      factory: data.Factory || data.factory,
      factoryName: data.FactoryFullName || data.FactoryName || data.factoryFullName || data.factoryName,
      terminalCustomerPartNumber: data.TerminalCustomerPartNumber || data.terminalCustomerPartNumber,
      immediateCustomerPartNumber: data.ImmediateCustomerPartNumber || data.immediateCustomerPartNumber,
      immediateCustomerCode: data.ImmediateCustomerCode || data.immediateCustomerCode,
      immediateCustomerProjectCode: data.ImmediateCustomerProjectCode || data.immediateCustomerProjectCode,
      productDesc: data.ProductDesc || data.productDesc,
      insideProjectCode: data.InsideProjectCode || data.insideProjectCode,
    };
    if (data.insidePartNumber) {
      _item.insidePartNumber = data.insidePartNumber;
    }
    if (data.InsidePartNumber) {
      _item.insidePartNumber = data.InsidePartNumber;
    }
    if (type == 'add') {
      _item.isDeclareCustoms = 0;
    }

    // 如果当前需求类型为 `工程样品需求` 并且当前`产品内部料号`存在`样品组`人员，则赋值
    const sampleGroupData = Members.find(item => item.configType == 'SampleGroup');
    if (getFieldsValue().demandType === 'EngineeringSamples') {
      _item.sampleGroupLeaderPersonId = sampleGroupData?.memberId ?? '';
      _item.sampleGroupLeaderPersonName = sampleGroupData?.memberName ?? '';
    }
    return _item;
  }

  const editColumns: any[] = [
    {
      title: '状态',
      field: 'status',
      sorter: true,
      width: 100,
      cellRender: {
        name: 'Tag',
        options: STATUS_OPTIONS,
      },
    },
    // {
    //   title: '节点记录',
    //   field: 'nodeDetail',
    //   i18nField: 'CommonCol.nodeDetail',
    //   width: 120,
    //   slots: {
    //     default: ({ row }) => {
    //       return h('span', { class: 'table-a', onClick: handleNodeModal.bind(null, row) }, t('common.searchDetail'));
    //     },
    //   },
    // },
  ];
  let menuTableColumns: any[] = [
    {
      title: '产品内部料号',
      field: 'insidePartNumber',
      width: 240,
      formatter: 'ApiSelect',
      editRender: {
        name: 'ApiSelect',
        props: {
          api: getQuantitationApplyDetailByMaterial,
          showSearch: true,
          apiSearch: {
            show: true,
            searchName: 'insidePartNumber',
          },
          params: {
            pageSize: 100,
            statusTag: '1,3',
          },
          beforeFetch: params => {
            // demandType: 工程需求类型时，需要排除掉外购类的
            const { insideProjectCode, terminalCustomerProjectCode } = getFieldsValue();
            params.insideProjectCode = insideProjectCode;
            params.terminalCustomerProjectCode = terminalCustomerProjectCode;
          },
          resultField: 'data',
          labelField: 'InsidePartNumber',
          valueField: 'InsidePartNumber',
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
      formatter: 'ApiSelect',
      editRender: {
        name: 'ApiSelect',
        props: {
          api: getPartNumberFactoryList,
          placeholder: '请选择',
          showSearch: true,
          rowParams: {
            partNumber: 'insidePartNumber',
          },
          apiSearch: {
            show: true,
            searchName: 'factory',
          },
          resultField: 'data',
          labelField: 'Name',
          valueField: 'Code',
          nameFormat: ['Code', '/', 'Name'],
          onChange: (_value: string, option: any, { row }) => {
            setMembersByFactoryChange(option, row);
          },
        },
      },
    },
    {
      title: 'PDT Leader',
      field: 'epmId',
      i18nField: 'CommonCol.pdtLeader',
      width: 200,
      editRender: {
        cacheField: 'epmName',
        name: 'CustomUserSelect',
      },
    },
    {
      title: '客户要求交期',
      field: 'customerDeliveryTime',
      width: 160,
      editRender: {
        name: 'DatePicker',
        props: {
          valueFormat: 'YYYY-MM-DD',
        },
      },
    },
    {
      title: '备注',
      field: 'remark',
      width: 160,
      editRender: {
        name: 'Input',
      },
    },
    {
      title: '直接客户料号',
      field: 'immediateCustomerPartNumber',
      width: 200,
    },
    {
      title: '直接客户项目代码',
      field: 'immediateCustomerProjectCode',
      width: 150,
    },
    {
      title: '终端客户料号',
      field: 'terminalCustomerPartNumber',
      width: 160,
    },
    {
      title: '产品描述',
      field: 'productDesc',
      width: 200,
    },
  ];

  function setMembersByFactoryChange(factoryInfo: any, row: any) {
    if (!factoryInfo) {
      return;
    }

    const Members = factoryInfo.Members || factoryInfo.members || [];
    const EPM = Members.find(item => item.configType == 'PDTLeader');
    const _item: any = {
      epmName: EPM?.memberName,
      epmId: EPM?.memberId,
    };
    if (getFieldsValue().demandType === 'EngineeringSamples') {
      const sampleGroupData = Members.find(item => item.configType == 'SampleGroup');
      _item.sampleGroupLeaderPersonId = sampleGroupData?.memberId ?? '';
      _item.sampleGroupLeaderPersonName = sampleGroupData?.memberName ?? '';
    }
    Object.assign(row, _item);
  }

  const columns = ref<any>([]);
  const canEditStatus = [0, 3, 4]; // 0:未提交 3:已退回 4:已撤回
  const gridOptions: VxeGridProps = {
    // columns: columns,
    id: 'engineering-drawing-drawingReviewRequirements-edit',
    height: 'auto',
    editConfig: {
      trigger: 'dblclick',
      mode: 'row',
      beforeEditMethod({ row }) {
        if (state.mode == 'add') return true;
        return canEditStatus.includes(row.status);
      },
    },
    rowConfig: {
      keyField: '_X_ROW_KEY',
    },
    scrollX: { enabled: true },
    mouseConfig: {
      area: true, // 是否开启区域选取
    },
    areaConfig: {
      multiple: true, // 是否启用多区域选取功能
    },
    keyboardConfig: {
      isClip: true, // 是否开启复制粘贴
      isEdit: true, // 是否开启任意键进入编辑（功能键除外）
      isDel: true, // 是否开启删除键功能
      isEsc: true, // 是否开启Esc键关闭编辑功能
    },
    showOverflow: true,
    keepSource: true,
    data: [state.initFields],
    toolbarConfig: {
      enabled: false,
    },
    clipConfig: {
      isPaste: true,
      afterPasteMethod: handleAfterPaster,
      copyMethod: handleCopyMethod,
    },
    i18nConfig: {
      moduleCode: 'QuantitativeApplyColumn',
    },
    showIndexColumn: true,
    pagerConfig: {
      enabled: false,
    },
    proxyConfig: {
      enabled: false,
    },
    position: 'modal',
  };
  const [Grid, gridApi] = useVbenVxeGrid({ gridOptions });
  const { reloadColumn } = gridApi;

  function handleEditable(tableList?: any[]) {
    if (state.mode === 'add') {
      state.showSubmit = true;
      return true;
    }

    const list = tableList ?? getDataSource() ?? [];
    const editable = list.some(o => canEditStatus.includes(o.status));

    state.showSubmit = editable;
    return editable;
  }

  const [registerPopup, { closePopup, changeOkLoading, changeLoading }] = usePopupInner(init);

  function handleNodeModal(record) {
    openNodeModal(true, {
      api: getDrawingsReviewReqNodeHistory,
      id: record.id,
    });
  }

  async function init(data) {
    changeLoading(true);
    state.systemId = data.id;
    state.title = data.title;
    state.mode = data.type || 'add';
    handleEditable();
    // 判断当前的环境
    let _column = cloneDeep(menuTableColumns);
    if (state.mode == 'add') {
      _column.push({
        title: t('common.action'),
        width: 80,
        slots: { default: 'action' },
        fixed: 'right',
        field: 'action',
      });
      reloadColumn(_column);
      if (data.id) {
        getDetail('add');
      } else {
        nextTick(() => {
          setFieldsValue({
            applyUserName: userStore.getUserInfo.userName,
            applyDateTime: dateUtil(new Date()).format('YYYY/MM/DD'),
          });
        });
      }
      setPropsForm({
        schemas: addSchema,
        disabled: state.mode !== 'add',
      });
    } else {
      try {
        _column = editColumns.concat(_column);
        reloadColumn(_column);
        setPropsForm({
          schemas: [...viewSchema, ...addSchema],
        });
        await getDetail();
      } catch (error) {
        console.log(error);
        closePopup();
      }
    }
    changeLoading(false);
  }

  async function getDetail(type?: string) {
    const res = await getDrawingsReviewReqDetail({ id: state.systemId });
    const { data } = res;
    const { grid } = gridApi;
    const tableList = data.outputs.map(el => {
      el.customerDeliveryTime = el.customerDeliveryTime ? dayjs(el.customerDeliveryTime).format('YYYY-MM-DD') : '';
      return el;
    });
    grid.reloadData(tableList);
    handleEditable(tableList);
    nextTick(() => {
      if (type == 'add') {
        data.applyUserName = userStore.getUserInfo.userName;
        data.applyDateTime = dateUtil(new Date()).format('YYYY/MM/DD');
      }
      setFieldsValue(data);
    });
  }
  function getTableActions(row): ActionItem[] {
    return [
      {
        label: '',
        icon: 'icon-ym icon-ym-btn-copy',
        onClick: handleCopy.bind(null, row),
      },
      {
        label: '',
        color: 'error',
        icon: 'icon-ym icon-ym-delete',
        onClick: handleDelete.bind(null, row),
      },
    ];
  }
  // 删除数据
  function handleDelete(row) {
    gridApi.grid.remove(row);
  }
  // 增加列
  function addColumn(line) {
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
  // 打开批量添加的弹框
  function handleBeforeBatch() {
    const { insideProjectCode } = getFieldsValue();
    if (!insideProjectCode) {
      return message.info(t('common.insideProjectCodeTip'));
    }
    openModal(true, {
      insideProjectCode: insideProjectCode,
      beforeFetch: params => {
        return {
          ...params,
          statusTag: '1,3',
        };
      },
    });
  }
  function getDataSource() {
    return cloneDeep(gridApi.grid.getFullData());
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
        list.push(Object.assign(cloneDeep(state.initFields), handleInnerPartNumberItem(item, 'add')));
      });
      gridApi.grid.reloadData(list);
    }
  }

  /**
   * 报关复制处理
   * @param cols
   * @param rows
   */
  function handleAfterPasterIsDeclareCustoms(cols: Array<{ field: string }>, rows: Array<{ isDeclareCustoms: string }>, pasteCells: string[][]) {
    const targetIndex = cols.findIndex((item: any) => item.field === 'isDeclareCustoms');
    if (targetIndex == -1) return false;

    const dataList = rows.map((item, index) => {
      const targetValue = pasteCells?.[index]?.[targetIndex] || '';
      const target = CONDITIONAL_OPTIONS.find(unit => unit.id == targetValue);
      return Object.assign(item, {
        isDeclareCustoms: target?.id || '',
        isDeclareCustomsName: target?.fullName || '',
      });
    });
    if (dataList.length == 0) return false;
    nextTick(() => {
      gridApi.grid.setRow(dataList);
    });
  }
  /**
   * 复制黏贴用户处理
   * @param cols 复制的列配置
   * @param rows 复制的行内容
   * @param pasteCellData 复制的内容
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
        Object.assign(row, { [fieldConfig.id]: target?.id || '', [fieldConfig.name]: target?.fullName || '' });
      });
    });
  }

  async function handleAfterPaster({ targetAreas, pasteCells }) {
    if (targetAreas.length === 0) {
      return;
    }
    const { cols, rows } = targetAreas[0];
    // 当黏贴只有一行有数据时，将粘贴的数据填充到每一行
    const pasteCellData = [...pasteCells];
    if (pasteCellData.length === 1 && rows.length > 1) {
      const target = pasteCells[0];
      pasteCellData.length = 0;
      for (let i = 0; i < rows.length; i++) {
        pasteCellData.push(target);
      }
    }
    // 报关
    handleAfterPasterIsDeclareCustoms(cols, rows, pasteCellData);
    // 采购处理
    handleAfterPasterUser(cols, rows, { id: 'epmId', name: 'epmName' });

    // PD处理
    handleAfterPasterUser(cols, rows, { id: 'sampleGroupLeaderPersonId', name: 'sampleGroupLeaderPersonName' });

    // 找出粘贴的第几列，如粘贴料号，粘贴区域第0列就是料号，对应excel也是第0列
    const targetIndex = cols.findIndex(item => item.field === 'insidePartNumber');
    // if (targetIndex == -1) return;
    if (targetIndex !== -1) {
      const list = pasteCells.map(item => item[targetIndex]);
      const chunks = splitArrayIntoChunks(list, 1000);

      const promiseList = [];
      chunks.forEach(item => {
        promiseList.push(
          selectMultiple({
            pageSize: 1000,
            InsidePartNumbers: item,
            statusTag: '1,3',
          }),
        );
      });
      await Promise.all(promiseList).then(res => {
        const data = res.reduce((prev, cur) => {
          return prev.concat(cur.data.list);
        }, []);
        // 设置rows的值
        if (data.length == 0) return createMessage.warning(t('common.invalidatePartNumber'));
        const datalist = rows.map(item => {
          const dataItem = data.find((el: any) => el.InsidePartNumber === item.insidePartNumber);
          return Object.assign(item, dataItem ? handleInnerPartNumberItem(dataItem, 'add') : {});
          // TODO: 区分两种数据 如果是已经存在的数据，则更新表格，如果不是则新建行数据
        });
        nextTick(() => {
          console.log('datalist', datalist);
          gridApi.grid.setRow(datalist);
        });
      });
    }

    pastePartNumberFactorys({
      cols,
      rows,
      pasteCells: pasteCellData,
      fields: {
        partNumberField: 'insidePartNumber',
        factoryField: 'factory',
        factoryNameField: 'factoryName',
        factoryValueField: 'Code',
        factoryNameFormat: ['Code', '/', 'Name'],
      },
      afterPaste({ row, factoryDetail }) {
        setMembersByFactoryChange(factoryDetail, row);
      },
    });
  }
  // vxe复制表值
  function handleCopyMethod({ isCut, row, column, cellValue }) {
    return cellValue;
  }

  const loading = ref<boolean>(false);
  function setLoading(isLoading = false) {
    loading.value = isLoading;
    changeOkLoading(isLoading);
    changeLoading(isLoading);
  }

  async function handleSave(type) {
    // 提交前需要校验
    const { insideProjectCode, terminalCustomerProjectCode } = getFieldsValue();
    if (!insideProjectCode) {
      return message.info(`${t('common.insiderProjectCode')}${t('common.notEmpty')}~`);
    }
    // 提取出提交字段
    // let isValidate = true;
    // if (!isValidate) {
    //   state.validate = 'error';
    //   handleColumns();
    //   return false;
    // }
    const params = {
      insideProjectCode: insideProjectCode || '',
      terminalCustomerProjectCode: terminalCustomerProjectCode || '',
    };
    const listField: any = ['remark', 'insidePartNumber', 'epmId', 'customerDeliveryTime', 'factory'];
    if (state.mode != 'add') {
      listField.push('id');
    }
    const list = gridApi.grid.getFullData().map(el => pick(el, listField));
    setLoading(true);
    let method: any = null;
    if (type == 'storage') {
      method = saveDrawingsReviewReqDraft;
    } else {
      method = createOrUpdateDrawingsReviewReq;
    }
    method(list, params)
      .then(res => {
        createMessage.success(t('sys.api.operationSuccess'));
        emits('refresh');
        closePopup();
      })
      .finally(() => {
        setLoading(false);
      });
  }
</script>

<style lang="less">
  :deep(.lydc-basic-table-action button i) {
    font-size: 18px;
  }

  .table-a {
    color: #ff7b00;
    cursor: pointer;
  }

  .requirement-pop {
    display: flex;
    flex-direction: column;
    padding-bottom: 10px;
  }
</style>
