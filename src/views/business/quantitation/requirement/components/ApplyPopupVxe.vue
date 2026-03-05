<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    :showOkBtn="state.show.submit"
    :okText="t('common.submit')"
    :okButtonProps="{ class: 'mr-12px' }"
    :title="title"
    @ok="handleSave"
    class="full-popup">
    <template #insertToolbar> </template>
    <template #centerToolbar>
      <a-button v-if="state.show.submit" :loading="loading" class="ml-12px" @click="handleSave('storage')" type="primary" ghost>{{
        t('common.temporarySave')
      }}</a-button>
    </template>
    <div class="h-full requirement-pop pl-10px pr-10px">
      <div class="lydc-content-wrapper-search-box pt-8px mb-16px">
        <Subtitle :title="t('common.baseinfo')" />
        <BasicForm @register="registerForm" />
      </div>
      <Subtitle :title="t('common.requireInfo')" class="mt-8px" :extra="{ show: state.type == 'add', hideAdd: true }">
        <template #afterTitle>
          <!-- <a-button type="primary" v-auth="'btn_recall'" ghost v-if="state.type !== 'add'" class="mr-3" @click="handleBackReview">
            {{ t('common.revoke') }}
          </a-button>
          <a-button type="primary" v-auth="'btn_stop'" ghost v-if="state.type !== 'add'" class="mr-3" @click="handleStop">{{ t('common.stopText') }}</a-button> -->
          <a-divider type="vertical" class="ml-10px"></a-divider>
          <a-button v-if="state.type == 'add'" type="primary" v-auth="'btn_batchAdd'" ghost @click="handleBeforeBatch">{{ t('common.batchAdd') }}</a-button>
        </template>
        <template #extra>
          <AddCustomRows @submit="addColumn" />
        </template>
      </Subtitle>
      <Grid :columns="columns" style="height: calc(100% - 170px)" :gridEvents="{ headerCellDblclick: handleDblClickHead }">
        <template #action="{ row }">
          <TableAction :outside="true" :actions="getTableActions(row)" />
        </template>
      </Grid>
    </div>
    <batchAdd @register="registerAddModal" @reload="handleBatchAdd"></batchAdd>
  </BasicPopup>
  <NodeModal @register="registerNodeModal"></NodeModal>
  <StopModal @register="registerStopModal" @reload="handleClear"></StopModal>
  <SubmitAfterModal @register="registerSubmitAfter" @reload="emits('refresh')" @close="closePopup" />
</template>
<script lang="ts" setup>
  import { reactive, toRefs, nextTick, h, ref } from 'vue';
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { TableAction, ActionItem } from '/@/components/Table';
  import { dateUtil } from '/@/utils/dateUtil';
  import { useUserStore } from '/@/store/modules/user';
  import { cloneDeep } from 'lodash-es';
  import { BasicForm, FormSchema, useForm } from '/@/components/Form';
  import { useModal } from '/@/components/Modal';
  import { getUserInfoList } from '/@/api/permission/user';
  import { getUserListByAccountList } from '/@/api/business/salesForecast';
  import batchAdd from './BatchAddModal.vue';
  import {
    createQuantitationApply,
    getQuantitationApplyDetail,
    editQuantitationApply,
    getQuantitationApplyDetailByMaterial,
    getFactoryList,
    getprojectlist,
    bulkbackreview,
    getNodelist,
    bulkbacktermination,
    savedraft,
    getQuantitativeApply,
  } from '/@/api/business/quantitation';
  import { selectMultiple } from '/@/api/business/quota';
  import { CONDITIONAL_OPTIONS, CURRENTNODE, getDemandType } from '../config';
  import { Subtitle } from '/@/components/Subtitle';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { NodeModal, StopModal } from '/@/components/CustomComponents';
  import { STATUS_OPTIONS } from '/@/components/CustomComponents/src/quality/Constant';
  import { message } from 'ant-design-vue';
  import { useBaseStore } from '/@/store/modules/base';
  import { useVbenVxeGrid, VxeGridProps } from '/@/adapter/vxe-table';
  import { buildUUID } from '/@/utils/uuid';
  import { splitArrayIntoChunks } from '/@/utils/splitArrayIntoChunks';
  import { LydcTag } from '/@/components/Lydc';
  import { AddCustomRows } from '/@/components/AddCustomRows';
  import { getNodeRemark } from '/@/adapter/utils';
  import SubmitAfterModal from './SubmitAfterModal.vue';
  import { isEmpty, isExist } from '/@/utils/is';

  const [registerNodeModal, { openModal: openNodeModal }] = useModal();
  const [registerAddModal, { openModal }] = useModal();
  const [registerStopModal, { openModal: openStopModal }] = useModal();
  const [registerSubmitAfter, { openModal: openSubmitAfterModal, closeModal: submitAfterCloseModal }] = useModal();

  const { hasBtnP } = usePermission();
  const emits = defineEmits(['register', 'refresh']);

  interface State {
    type: 'add' | 'edit' | 'view';
    systemId: string;
    show: {
      submit: boolean;
    };
    title: string;
    parentId: string;
    base: any;
    line: number;
    validate: string;
    initFields: any;
  }

  const { t } = useI18n();
  const state = reactive<State>({
    type: 'add',
    show: {
      submit: true,
    },
    systemId: '',
    title: '',
    parentId: '',
    base: {},
    line: 1,
    validate: '',
    initFields: {
      innerMaterialNumber: '',
      terminalCustomerPartNumber: '',
      projectPhase: '',
      factoryId: '',
      factory: '',
      teakQty: '',
      customerDeliveryTime: '',
      isDeclareCustoms: 0,
      desensitizedDrawingsId: '',
      desensitizedDrawingsName: '',
      epmId: '',
      epmName: '',
      isDrawingReview: '',
      pmDesc: '',
    },
  });
  const { title } = toRefs(state);

  const userStore = useUserStore();
  const { createMessage } = useMessage();

  const baseStore = useBaseStore();
  const viewSchema: FormSchema[] = [
    {
      field: 'applyNo',
      label: '需求单号',
      component: 'Input',
      componentProps: {
        disabled: true,
      },
    },
  ];
  const addSchema: FormSchema[] = [
    {
      field: 'demandType',
      label: '需求类型',
      component: 'ApiSelect',
      required: true,
      componentProps: {
        api: getDemandType,
        placeholder: '需求类型',
        showSearch: false,
        resultField: '',
        labelField: 'fullName',
        valueField: 'enCode',
        onChange: (v: string) => setColumnByDemandType(v),
      },
    },
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
  const [registerForm, { updateSchema, validate, getFieldsValue, setFieldsValue, setProps: setPropsForm }] = useForm({
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
    if (!data) return {};
    // 批导返回的接口字段
    const Members = data.Members || data.members || [];
    const EPM = Members.find(item => item.configType == 'PDTLeader');
    const _item: any = {
      epmName: EPM?.memberName,
      epmId: EPM?.memberId,
      factoryId: data.FactoryId || data.factoryId,
      factory: data.FactoryFullName || data.FactoryName || data.factoryFullName || data.factoryName,
      desensitizedDrawingsId: data.DesensitizedDrawingsId || data.desensitizedDrawingsId,
      terminalCustomerPartNumber: data.TerminalCustomerPartNumber || data.terminalCustomerPartNumber,
      immediateCustomerPartNumber: data.ImmediateCustomerPartNumber || data.immediateCustomerPartNumber,
      immediateCustomerCode: data.ImmediateCustomerCode || data.immediateCustomerCode,
      immediateCustomerName: data.ImmediateCustomerName || data.immediateCustomerName,
      productDesc: data.ProductDesc || data.productDesc,
      insideProjectCode: data.InsideProjectCode || data.insideProjectCode,
    };
    if (data.insidePartNumber) {
      _item.innerMaterialNumber = data.insidePartNumber;
    }
    if (data.InsidePartNumber) {
      _item.innerMaterialNumber = data.InsidePartNumber;
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
    // {
    //   type: 'checkbox',
    //   field: 'checkbox',
    // },
    {
      title: '状态',
      field: 'status',
      sorter: true,
      width: 100,
      slots: {
        default: ({ row }) => {
          const item = STATUS_OPTIONS.find(el => el.id == row.status);
          return h(LydcTag, { theme: item?.theme, text: row.statusDesc });
        },
      },
    },
    {
      title: '节点记录',
      field: 'nodeDetail',
      i18nField: 'CommonCol.nodeDetail',
      width: 120,
      slots: {
        default: ({ row }) => {
          return h('span', { class: 'table-a', onClick: handleNodeModal.bind(null, row) }, t('common.searchDetail'));
        },
      },
    },
  ];

  const DEP_RESET_BY_PART = {
    factoryId: '',
    factory: '',
    epmId: '',
    epmName: '',
    sampleGroupLeaderPersonId: '',
    sampleGroupLeaderPersonName: '',
  };

  let menuTableColumns: any[] = [
    {
      title: '产品内部料号',
      field: 'innerMaterialNumber',
      width: 240,
      formatter: 'ApiSelect',
      editRender: {
        name: 'ApiSelect',
        cacheField: 'innerMaterialNumber',
        props: {
          api: getQuantitationApplyDetailByMaterial,
          showSearch: true,
          apiSearch: {
            show: true,
            searchName: 'innerMaterialNumber',
          },
          rowParams: {
            factoryId: 'factoryId',
          },
          params: {
            pageSize: 100,
          },
          beforeFetch: params => {
            // demandType: 工程需求类型时，需要排除掉外购类的
            const { insideProjectCode, /** terminalCustomerProjectCode, */ demandType } = getFieldsValue();
            params.insideProjectCode = insideProjectCode;
            // params.terminalCustomerProjectCode = terminalCustomerProjectCode;
            params.demandType = demandType;
            params.statusTag = '1,3';
          },
          resultField: 'data',
          labelField: 'InsidePartNumber',
          valueField: 'InsidePartNumber',
          immediate: false,
          onChange: (value, data, params) => {
            const {
              $grid: { setRow },
              row,
            } = params;
            if (!value) {
              setRow(row, {
                innerMaterialNumber: '',
                ...DEP_RESET_BY_PART,
              });
              return;
            }

            // 选新料号：先清依赖，避免残留；再带出新数据
            const item = handleInnerPartNumberItem(data, 'add');
            setRow(row, {
              ...DEP_RESET_BY_PART,
              ...item,
            });

            nextTick(() => {
              row.factory = item.factory;
            });
          },
        },
      },
    },
    {
      title: '工厂',
      field: 'factoryId',
      i18nField: 'factory',
      width: 240,
      formatter: 'ApiSelect',
      editRender: {
        name: 'ApiSelect',
        cacheField: 'factory',
        props: {
          api: getFactoryList,
          placeholder: '请选择',
          showSearch: true,
          apiSearch: {
            show: true,
            searchName: 'factoryCode',
          },
          rowParams: {
            insidePartNumber: 'innerMaterialNumber',
          },
          resultField: 'data',
          labelField: 'Name',
          valueField: 'Id',
          nameFormat: ['Code', '/', 'Name'],
          filterOption: false,
          onChange: (_, data, { row }) => {
            row.epmId = '';
            row.epmName = '';
            row.sampleGroupLeaderPersonId = '';
            row.sampleGroupLeaderPersonName = '';
            const Members = data?.Members || [];
            // 如果当前需求类型为 `工程样品需求` 并且当前`工厂`存在`样品组`人员，则赋值
            if (getFieldsValue().demandType === 'EngineeringSamples') {
              const sampleGroupData = Members.find(item => item.configType == 'SampleGroup');
              row.sampleGroupLeaderPersonId = sampleGroupData?.memberId ?? '';
              row.sampleGroupLeaderPersonName = sampleGroupData?.memberName ?? '';
            } else {
              // 如果当前需求类型不为 `工程样品需求` 并且当前`工厂`存在`PDTLeader`人员，则赋值
              const EPM = Members.find(item => item.configType == 'PDTLeader');
              row.epmId = EPM?.memberId ?? '';
              row.epmName = EPM?.memberName ?? '';
            }
          },
        },
      },
    },
    {
      title: '终端项目阶段',
      field: 'projectPhase',
      width: 160,
      editRender: {
        name: 'Input',
        props: {
          placeholder: '',
        },
      },
    },
    {
      title: '需求数量(PCS)',
      field: 'peakQty',
      width: 160,
      editRender: {
        name: 'InputNumber',
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
      title: '报关',
      field: 'isDeclareCustoms',
      width: 160,
      editRender: {
        name: 'ASelect',
        props: {
          options: CONDITIONAL_OPTIONS,
          fieldNames: {
            value: 'id',
            label: 'fullName',
          },
        },
      },
    },
    {
      title: '下一节点处理人(PDT Leader)',
      field: 'epmId',
      i18nField: 'CommonCol.nextHandler',
      i18nParams: ['PDT Leader'],
      width: 220,
      editRender: {
        cacheField: 'epmName',
        name: 'CustomUserSelect',
      },
    },
    {
      title: '样品组人员',
      field: 'sampleGroupLeaderPersonId',
      width: 200,
      visible: false,
      editRender: {
        cacheField: 'sampleGroupLeaderPersonName',
        name: 'CustomUserSelect',
      },
    },
    {
      title: '备注',
      field: 'pmDesc',
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
      title: '直接客户简称',
      field: 'immediateCustomerName',
      width: 200,
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

  const columns = ref<any>([]);
  const gridOptions: VxeGridProps = {
    // columns: columns,
    id: 'business-quantitation-requirement-edit',
    editConfig: {
      trigger: 'dblclick',
      mode: 'row',
      // beforeEditMethod: ({ column }) => {
      //   // 判断当前需求类型是否为 `量试需求(Quantitative)`
      //   const { demandType } = getFieldsValue();
      //   console.log('=====', demandType, column);
      //   if (demandType == 'Quantitative') return true;
      //   // 判断当前列是否可编辑
      //   const disabledDataIndexList = ['isDeclareCustoms', 'projectPhase'];
      //   if (disabledDataIndexList.includes(column.field)) return false;
      //   return true;
      // },
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
  const canEdit = [0, 4, 3];
  const { reloadColumn, getDataSource, getSelectRows } = gridApi;

  /**
   * @description 根据 **需求类型**，设置表格列
   * @param value 需求类型的值
   */
  function setColumnByDemandType(value: string) {
    // 判断当前需求类型是否为 `工程样品需求(EngineeringSamples)`
    if (value === 'EngineeringSamples') {
      // 当客户需求发起需 `工程样品需求`时，列表要出来一个样品组人员，PDT leader  则需隐藏掉
      gridApi.grid.hideColumn('epmId');
      gridApi.grid.showColumn('sampleGroupLeaderPersonId');
    } else {
      // 否则，列表要显示PDT leader，`样品组人员`则需隐藏掉
      gridApi.grid.showColumn('epmId');
      gridApi.grid.hideColumn('sampleGroupLeaderPersonId');
    }
  }

  function handleEditable() {
    if (state.type == 'add') return true;
    const list = getDataSource() || [];
    return list.find(o => canEdit.indexOf(o.status) > -1);
  }

  const [registerPopup, { closePopup, changeOkLoading, changeLoading }] = usePopupInner(init);

  function handleNodeModal(record) {
    openNodeModal(true, {
      api: getNodelist,
      id: record.id,
    });
  }

  function handleData(method) {
    const idList = gridApi.grid.getCheckboxRecords();
    if (!idList || idList.length === 0) {
      createMessage.warning(t('common.selectText'));
      return;
    }
    method(idList.map(el => el.id)).then(async res => {
      handleClear();
    });
  }

  /**
   * @decription 双击表头
   * */
  function handleDblClickHead({ column }) {
    const clickField = ['projectPhase', 'customerDeliveryTime', 'peakQty', 'isDeclareCustoms', 'epmId'];
    let firstValue = ''; //第一行数据
    let firstValueName = '';
    if (clickField.includes(column.field)) {
      const Field = column.field;
      const list = getDataSource().map((el, i) => {
        if (i == 0) {
          firstValue = el[Field];
        } else {
          el[Field] = firstValue;
        }

        if (Field === 'epmId' && i === 0) {
          firstValueName = el.epmName;
        } else if (Field === 'epmId') {
          el.epmName = firstValueName;
        }
        return el;
      });
      gridApi.grid.reloadData(list);
    }
  }

  function handleClear() {
    gridApi.grid.clearCheckboxRow();
    createMessage.success(res.msg);
    // 更新数据
    getDetail();
  }

  function handleBackReview() {
    handleData(bulkbackreview);
  }
  function handleStop() {
    const rows = getSelectRows();
    if (!rows || rows.length === 0) {
      createMessage.warning(t('common.selectText'));
      return;
    }
    openStopModal(true, {
      rows,
      api: bulkbacktermination,
      beforeFetch: params => {
        return {
          ids: rows.map(el => el.id),
          terminationRemarks: params.remark,
        };
      },
    });
  }

  async function init(data) {
    changeLoading(true);
    state.systemId = data.id;
    state.title = data.title;
    state.type = data.type || 'add';
    handleEditable();
    // 判断当前的环境
    let _column = cloneDeep(menuTableColumns);
    if (state.type == 'add') {
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
        disabled: state.type !== 'add',
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
    const res = await getQuantitationApplyDetail(state.systemId);
    const { data } = res;
    const { grid } = gridApi;
    grid.reloadData(
      data.quantitativeApplyOutputs.map(el => {
        el.customerDeliveryTime = el.customerDeliveryTime ? el.customerDeliveryDateTime : '';
        el.pmDesc = getNodeRemark(el.nodeRemark, CURRENTNODE);
        return el;
      }),
    );
    nextTick(() => {
      if (type == 'add') {
        data.applyUserName = userStore.getUserInfo.userName;
        data.applyDateTime = dateUtil(new Date()).format('YYYY/MM/DD');
      }
      setColumnByDemandType(data.demandType);
      setFieldsValue(data);
      handleEditable();
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
    const { insideProjectCode, demandType } = getFieldsValue();
    if (!insideProjectCode) {
      return message.info(t('common.insideProjectCodeTip'));
    }
    openModal(true, {
      insideProjectCode: insideProjectCode,
      beforeFetch: params => {
        return {
          ...params,
          demandType: demandType,
          statusTag: '1,3',
        };
      },
    });
  }
  // 批量添加
  function handleBatchAdd(data) {
    let list = getDataSource();
    if (data.length) {
      // 若是当前的表格没有填写数据
      if (list.length && list[0].innerMaterialNumber == '') {
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
      const targetValue = pasteCells?.[index]?.[targetIndex] || 0;
      const target = CONDITIONAL_OPTIONS.find(unit => unit.id == targetValue);
      return Object.assign(item, {
        isDeclareCustoms: target?.id,
        isDeclareCustomsName: target?.fullName,
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

  function handleAfterPaster({ targetAreas, pasteCells }) {
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
    const targetIndex = cols.findIndex(item => item.field === 'innerMaterialNumber');
    if (targetIndex == -1) return;
    const list = pasteCellData.map(item => item[targetIndex]);
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
    Promise.all(promiseList).then(res => {
      const data = res.reduce((prev, cur) => {
        return prev.concat(cur.data.list);
      }, []);
      // 设置rows的值
      if (data.length == 0) return createMessage.warning(t('common.invalidatePartNumber'));
      const datalist = rows.map(row => {
        const dataItem = data.find((el: any) => el.InsidePartNumber === row.innerMaterialNumber);

        // 粘贴空值：只清工厂和人
        if (!row.innerMaterialNumber) {
          return Object.assign(row, { ...DEP_RESET_BY_PART });
        }

        // 粘贴无效料号：也清工厂和人（避免残留）
        if (!dataItem) {
          return Object.assign(row, { ...DEP_RESET_BY_PART });
        }

        // 粘贴有效料号：先清依赖，再带出新数据
        return Object.assign(row, {
          ...DEP_RESET_BY_PART,
          ...handleInnerPartNumberItem(dataItem, 'add'),
        });
      });

      nextTick(() => {
        console.log('datalist', datalist);
        gridApi.grid.setRow(datalist);
      });
    });
  }
  // vxe复制表值
  function handleCopyMethod({ isCut, row, column, cellValue }) {
    return cellValue;
  }

  // 获取需要传值给后端的有效字段
  function getEnableCols() {
    const obj = {};
    // const disabledDataIndexList = ['isDeclareCustoms', 'projectPhase'];
    menuTableColumns.forEach((el: any) => {
      if (!el.disabled) {
        obj[el.field] = '';
      }
    });
    return obj;
  }

  const loading = ref<boolean>(false);
  function setLoading(isLoading = false) {
    loading.value = isLoading;
    changeOkLoading(isLoading);
    changeLoading(isLoading);
  }

  async function handleSave(type) {
    // 提交前需要校验
    const { insideProjectCode, demandType, terminalCustomerProjectCode } = getFieldsValue();
    if (!insideProjectCode) {
      return message.info(`${t('common.insiderProjectCode')}${t('common.notEmpty')}~`);
    }
    if (!demandType) {
      return message.info(`${t('dict.QuantitativeReport.demandType')}${t('common.notEmpty')}~`);
    }
    const listField: any = getEnableCols();
    const list = gridApi.grid.getFullData().map(el => {
      const _o: any = {};
      for (let k in listField) {
        _o[k] = el[k];
      }
      _o.id = state.type === 'add' ? '' : el.id ?? '';
      return _o;
    });
    const params = {
      isOperation: hasBtnP('btn_review') ? 1 : 0,
      insideProjectCode: insideProjectCode || '',
      demandType: demandType,
      terminalCustomerProjectCode: terminalCustomerProjectCode || '',
    };
    setLoading(true);
    let method: any = null;
    if (type == 'storage') {
      method = savedraft;
    } else {
      method = state.type == 'add' ? createQuantitationApply : editQuantitationApply;
    }
    method(list, params)
      .then(({ code, data }) => {
        if (code === 200) {
          if (type !== 'storage') {
            createMessage.info({ content: '数据已提交到后台运行中，请稍后刷新' });
          }
          if (isExist(data) && !isEmpty(data)) {
            openSubmitAfterModal(true, data);
          } else {
            emits('refresh');
            closePopup();
          }
        }
      })
      .finally(() => setLoading(false));
  }
</script>

<style lang="less" scoped>
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

  :deep(.lydc-basic-popup-header) {
    padding-left: 12px;
  }
</style>
