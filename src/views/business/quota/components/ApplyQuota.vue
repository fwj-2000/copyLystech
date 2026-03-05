<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    @ok="handleSaveAction"
    :showOkBtn="false"
    :showCancelBtn="true"
    :cancelButtonProps="{ class: 'my-12px mr-12px' }"
    class="full-popup"
    destroyOnClose
    :title="t('common.add2Text')">
    <template #centerToolbar>
      <a-button ghost :loading="loading" @click="handleSaveAction('save')" type="primary" class="my-12px">{{ t('common.temporarySave') }} </a-button>
    </template>
    <template #appendToolbar>
      <a-button @click="handleSaveAction('commit')" :loading="loading" type="primary" class="mx-12px my-12px">{{ t('common.submit') }} </a-button>
    </template>
    <div class="p-10px h-full">
      <BasicForm style="padding-top: 10px" @register="registerForm" />
      <Grid style="height: calc(100% - 95px)">
        <template #action="{ row }">
          <i class="icon-ym icon-ym-btn-add text-orange-400 cursor-pointer mx-1" @click="handleChangeTable('addBaseIndex', { uuid: row.uuid })" />
          <i class="icon-ym icon-ym-btn-copy text-orange-400 cursor-pointer mx-1" @click="handleChangeTable('copy', { uuid: row.uuid })" />
          <i class="icon-ym icon-ym-delete text-orange-400 cursor-pointer mx-1" @click="handleChangeTable('delete', { uuid: row.uuid })" />
        </template>
        <template #toolbar-actions>
          <a-button @click="handleBeforeBatch" type="primary">{{ t('common.batchAdd') }} </a-button>
        </template>
        <template #toolbar-tools>
          <AddCustomRows @submit="addColumn" />
        </template>
      </Grid>
    </div>
  </BasicPopup>
  <batchAdd @register="registerAddModal" @reload="handleBatchAdd"></batchAdd>
</template>
<script setup lang="ts">
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { BasicForm, useForm } from '/@/components/Form';
  import dayjs from 'dayjs';
  import duration from 'dayjs/plugin/duration';
  import { QUOTA_TABLE_ROW_DATA } from '/@/views/business/quota/config';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useModal } from '/@/components/Modal';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { getEnablePartNumberApply, getFactoryList } from '/@/api/basicData/productCodeApply';
  import { getPartNumberFactoryList } from '/@/api/basicData/factory';
  import { getUnitListByKeyword } from '/@/api/finance/materialPrice';
  import { postQuotationRequirement, selectMultiple } from '/@/api/business/quota';
  import { splitArrayIntoChunks } from '/@/utils/splitArrayIntoChunks';
  import { nextTick, ref } from 'vue';
  import { buildUUID } from '/@/utils/uuid';
  import batchAdd from '/@/views/business/quantitation/requirement/components/BatchAddModal.vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { getUserInfoList } from '/@/api/permission/user';
  import { getUserListByAccountList } from '/@/api/business/salesForecast';
  import { AddCustomRows } from '/@/components/AddCustomRows';
  import { pastePartNumberFactorys } from '/@/utils/pasterPartNumberFactorys';
  import { getprojectlist } from '/@/api/business/quantitation';
  import { useBaseStore } from '/@/store/modules/base';
  import { FormSchema } from '/@/components/Table';

  const baseStore = useBaseStore();
  dayjs.extend(duration);
  const { createMessage } = useMessage();

  const emit = defineEmits(['reload', 'register']);

  const { t } = useI18n();
  const [registerAddModal, { openModal }] = useModal();
  const [registerPopup, { closePopup, changeLoading }] = usePopupInner(init);

  const [registerForm, { validate, setFieldsValue, getFieldsValue }] = useForm({
    schemas: getSearchFormSchema(),
    labelWidth: 280,
    layout: 'vertical',
    baseColProps: {
      span: 4,
    },
    i18nConfig: {
      moduleCode: 'QuotationRequirementsColumn',
      transferRange: ['label', 'placeholder'],
    },
  });

  function getSearchFormSchema(): FormSchema[] {
    return [
      {
        field: 'Purpose',
        label: '报价用途',
        required: true,
        // rules: [{ required: true, trigger: 'blur', message: '请选择报价用途' }],
        component: 'ApiSelect',
        componentProps: {
          api: () => baseStore.getDictionaryData('QuotationRequirements.Purpose', true),
          showSearch: true,
          apiSearch: {
            show: true,
            searchName: '',
          },
          labelField: 'fullName',
          valueField: 'enCode',
          filterOption: false,
          notFoundContent: null,
          immediate: true,
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
        field: 'DeliveryDate',
        label: '客户要求交期',
        required: true,
        component: 'DatePicker',
        componentProps: {
          // placeholder: '请选择',
          // showTime: true,
          disabledDate: current => {
            return current && current.valueOf() < Date.now();
          },
        },
      },
      {
        field: 'UrgencyLevel',
        label: '紧急程度',
        required: true,
        defaultValue: 1,
        // rules: [{ required: true, trigger: 'blur', message: '请选择报价用途' }],
        component: 'ApiSelect',
        componentProps: {
          api: () => baseStore.getDictionaryData('QuotationRequirements.UrgencyLevel', true),
          showSearch: true,
          apiSearch: {
            show: true,
            searchName: '',
          },
          labelField: 'fullName',
          valueField: 'enCode',
          filterOption: false,
          notFoundContent: null,
          immediate: true,
        },
      },
      // {
      //   field: 'TotalQty',
      //   label: '项目总量(W)',
      //   rules: [{ required: true, trigger: 'blur' }],
      //   component: 'InputNumber',
      //   componentProps: {
      //     placeholder: '项目总量',
      //   },
      // },
      {
        field: 'ProductionCycle',
        label: '量产周期(月)',
        component: 'InputNumber',
        required: true,
        componentProps: {
          placeholder: '请输入量产周期',
          min: 0,
          step: 1,
          precision: 0,
        },
      },
      {
        field: 'TenderFactoryQty',
        label: '招标模切厂家数',
        component: 'InputNumber',
        componentProps: {
          placeholder: '请输入招标模切厂家数',
          min: 0,
          step: 1,
          precision: 0,
        },
      },
    ];
  }

  const columns = [
    {
      title: '产品内部料号',
      field: 'InsidePartNumber',
      minWidth: 180,
      formatter: 'ApiSelect',
      editRender: {
        name: 'ApiSelect',
        dblClickHead: false,
        props: {
          api: getEnablePartNumberApply,
          showSearch: true,
          apiSearch: {
            show: true,
            searchName: 'keyword',
          },
          params: {
            statusTag: '1,3',
          },
          beforeFetch: params => {
            const { insideProjectCode } = getFieldsValue();
            params.insideProjectCode = insideProjectCode;
            return params;
          },
          resultField: 'data.list',
          labelField: 'InsidePartNumber',
          valueField: 'InsidePartNumber',
          immediate: false,
          onChange: (InsidePartNumber, data, params) => {
            const {
              $grid: { setRow },
              row,
            } = params;
            const { Factory, FactoryName, Members, TerminalCustomerPartNumber, ImmediateCustomerPartNumber, ProductDesc } = data;
            console.log(data);
            const project = Members.find(item => item.configType == 'PDTLeader');
            // row.ProjectLeader = project?.memberName;
            setRow(row, {
              ProjectLeaderName: project?.memberName,
              ProjectLeader: project?.memberId,
              Factory,
              // FactoryName,
              TerminalCustomerPartNumber,
              ImmediateCustomerPartNumber,
              ProductDesc,
            });
            nextTick(() => {
              row.FactoryName = [Factory, FactoryName].filter(Boolean).join('/');
            });
          },
        },
      },
    },
    {
      title: '工厂',
      field: 'Factory',
      minWidth: 120,
      formatter: 'ApiSelect',
      editRender: {
        name: 'ApiSelect',
        props: {
          api: getPartNumberFactoryList,
          placeholder: '请选择',
          showSearch: true,
          rowParams: {
            partNumber: 'InsidePartNumber',
          },
          apiSearch: {
            show: true,
            searchName: 'factory',
          },
          resultField: 'data',
          labelField: 'Name',
          valueField: 'Code',
          nameFormat: ['Code', '/', 'Name'],
          onChange: (_value: string, option: any, { row, $grid }) => {
            if (option && Array.isArray(option.Members)) {
              const project = option.Members.find(item => item.configType == 'PDTLeader');
              $grid.setRow(row, {
                ProjectLeaderName: project?.memberName || '',
                ProjectLeader: project?.memberId || '',
              });
            }
          },
        },
      },
    },
    {
      title: '项目量(W)',
      field: 'TotalQty',
      minWidth: 130,
      editRender: {
        name: 'InputNumber',
      },
    },
    {
      title: '备注',
      field: 'LineRemark',
      minWidth: 140,
      editRender: {
        name: 'Input',
      },
    },
    {
      title: '下一节点处理人(PDT Leader)',
      field: 'ProjectLeader',
      i18nField: 'CommonCol.nextHandler',
      i18nParams: ['PDT Leader'],
      width: 220,
      editRender: {
        autofocus: '.ant-select-selection-search-input',
        name: 'CustomUserSelect',
        cacheField: 'ProjectLeaderName',
        props: {
          immediate: false,
          allowClear: true,
          showSearch: true,
        },
      },
    },
    {
      title: '是否保税',
      field: 'IsBonded',
      minWidth: 100,
      editRender: {
        name: 'ASelect',
        props: {
          fieldNames: {
            label: 'fullName',
            value: 'enCode',
          },
          options: [
            { fullName: '是', enCode: 'true' },
            { fullName: '否', enCode: 'false' },
          ],
        },
      },
    },
    {
      title: '成本单位',
      field: 'CostUnit',
      minWidth: 100,
      formatter: 'ApiSelect',
      editRender: {
        name: 'ApiSelect',
        props: {
          api: getUnitListByKeyword,
          // placeholder: '请选择',
          showSearch: true,
          apiSearch: {
            show: true,
            searchName: 'keyword',
          },
          resultField: 'data',
          filterOption: false,
          notFoundContent: null,
          immediate: true,
          useChangeCopy: true,
          labelField: 'Name',
          valueField: 'Code',
          // nameFormat: ['Name', '(', 'Code', ')'],
        },
      },
    },
    {
      title: '终端客户料号',
      field: 'TerminalCustomerPartNumber',
      minWidth: 120,
      editRender: {
        enabled: false,
        name: 'Input',
      },
    },
    {
      title: '直接客户料号',
      field: 'ImmediateCustomerPartNumber',
      minWidth: 120,
      editRender: {
        enabled: false,
        name: 'Input',
      },
    },
    {
      title: '产品描述',
      field: 'ProductDesc',
      minWidth: 180,
      editRender: {
        name: 'Input',
        enabled: false,
      },
    },
    {
      title: '操作',
      field: 'action',
      slots: { default: 'action' },
      minWidth: 100,
      fixed: 'right',
    },
  ];

  const gridOptions = {
    id: 'business-quota-apply',
    columns,
    showIndexColumn: true,
    editConfig: {
      trigger: 'dblclick',
      mode: 'row',
    },
    editRules: {
      InsidePartNumber: [{ required: true, message: '请选择料号', trigger: 'blur' }],
      Factory: [{ required: true, message: '请选择工厂', trigger: 'blur' }],
      TotalQty: [{ required: true, message: '请输入项目量', trigger: 'blur' }],
      ProjectLeader: [{ required: true, message: '请选择PDT Leader', trigger: 'blur' }],
    },
    pagerConfig: {
      enabled: false,
    },
    scrollY: {
      enabled: true,
      gt: 0,
    },
    mouseConfig: {
      area: true, // 是否开启区域选取
    },
    toolbarConfig: {
      refresh: false,
    },
    customConfig: {
      allowVisible: false,
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
    data: [
      {
        InsidePartNumber: '',
        Factory: '',
        TotalQty: '',
        LineRemark: '',
        ProjectLeader: '',
        IsBonded: 'false',
        CostUnit: 'PCS',
        TerminalCustomerPartNumber: '',
        ImmediateCustomerPartNumber: '',
        ProductDesc: '',
      },
    ],
    rowConfig: {
      keyField: 'uuid',
    },
    height: '100%',
    clipConfig: {
      isPaste: true,
      afterPasteMethod: handleAfterPaster,
    },
    i18nConfig: {
      moduleCode: 'QuotationRequirementsColumn',
    },
    position: 'modal',
  };

  const [Grid, gridApi] = useVbenVxeGrid({
    gridOptions,
  });
  const { getDataSource, reloadData } = gridApi;

  function handleChangeTable(type: 'add' | 'update' | 'copy' | 'delete' | 'addBaseIndex', data) {
    let findIndex = -1;

    switch (type) {
      case 'addBaseIndex': {
        const rowData = {
          ...QUOTA_TABLE_ROW_DATA,
          uuid: buildUUID(),
        };
        const fullData = gridApi.grid.getFullData();
        findIndex = fullData.findIndex(item => item.uuid === data.uuid);
        fullData.splice(findIndex + 1, 0, rowData);
        gridApi.grid.reloadData(fullData);
        break;
      }

      case 'copy': {
        const gridData = gridApi.grid.getFullData();
        findIndex = gridData.findIndex(item => item.uuid === data.uuid);
        const copyData = gridData[findIndex];
        gridData.splice(findIndex + 1, 0, { ...copyData, uuid: buildUUID() });
        gridApi.grid.reloadData(gridData);
        break;
      }

      case 'delete': {
        const datalist = gridApi.grid.getFullData();
        findIndex = datalist.findIndex(item => item.uuid === data.uuid);
        datalist.splice(findIndex, 1);
        gridApi.grid.reloadData(datalist);
        break;
      }

      case 'update':
      default:
        break;
    }
  }
  // 增加列
  function addColumn(line) {
    const list = getDataSource();
    for (let i = 0; i < line; i++) {
      list.push({
        _X_ROW_KEY: buildUUID(),
        ...QUOTA_TABLE_ROW_DATA,
      });
    }
    gridApi.grid.reloadData(list);
  }

  async function init(data) {
    console.log(data, 'init data');
  }

  const loading = ref<boolean>(false);
  function setLoading(val: boolean) {
    loading.value = val;
    changeLoading(val);
  }

  // 保存按钮
  function handleSaveAction(type) {
    validate().then(async val => {
      if (!val) return;
      const { Purpose, DeliveryDate } = val;
      if (!Purpose) return createMessage.error('请输入报价用途');
      if (!DeliveryDate) return createMessage.error('请输入交货日期');
      if (await gridApi.grid.validate(true)) {
        return createMessage.warning(t('dict.SalesSiteColumn.requiredTip'));
      }
      const list = gridApi.grid.getFullData();
      const datalist = list.map(item => ({
        ...item,
        ...val,
        SaveAndCommit: type === 'commit',
      }));
      setLoading(true);
      postQuotationRequirement(datalist)
        .then(res => {
          if (res.code === 200) {
            createMessage.success(res.msg);
            closePopup();
            emit('reload');
          }
        })
        .finally(() => {
          setLoading(false);
        });
    });
  }

  function getPdtLeader(members) {
    if (!Array.isArray(members)) return null;
    return members.find(m => m.configType === 'PDTLeader') || null;
  }

  function buildRowPatchFromFactoryDetail(factoryDetail) {
    const project = getPdtLeader(factoryDetail?.Members);
    return {
      ProjectLeaderName: project?.memberName || '',
      ProjectLeader: project?.memberId || '',
    };
  }

  function buildDatalistFromApiData(data) {
    return data.map(item => {
      const { Factory, FactoryName, Members, TerminalCustomerPartNumber, ImmediateCustomerPartNumber, ProductDesc, InsidePartNumber } = item;
      const project = getPdtLeader(Members);

      return {
        ProjectLeaderName: project?.memberName,
        ProjectLeader: project?.memberId,
        Factory,
        FactoryName: [Factory, FactoryName].filter(Boolean).join('/'),
        InsidePartNumber,
        TerminalCustomerPartNumber,
        ImmediateCustomerPartNumber,
        ProductDesc,
        IsBonded: 'false',
        CostUnit: 'PCS',
        TotalQty: '',
      };
    });
  }

  function applyDatalistToRows(rows, datalist) {
    // 用 Map 降低 find 的 O(n^2)
    const map = new Map(datalist.map(d => [d.InsidePartNumber, d]));

    nextTick(() => {
      for (const row of rows) {
        const patch = map.get(row.InsidePartNumber);
        if (patch) Object.assign(row, patch);
      }
    });
  }

  async function fetchFactoriesByPartNumbers(list) {
    const chunks = splitArrayIntoChunks(list, 1000);

    const requests = chunks.map(chunk =>
      selectMultiple({
        pageSize: 1000,
        InsidePartNumbers: chunk,
        statusTag: '1,3',
      }),
    );

    const resList = await Promise.all(requests);

    return resList.reduce((prev, cur) => prev.concat(cur?.data?.list || []), []);
  }

  function handleAfterPasteFactoryLeader({ rows, cols, pasteCells }) {
    pastePartNumberFactorys({
      rows,
      cols,
      pasteCells,
      fields: {
        partNumberField: 'InsidePartNumber',
        factoryField: 'Factory',
        factoryNameField: 'FactoryName',
        factoryValueField: 'Code',
        factoryNameFormat: ['Code', '/', 'Name'],
      },
      afterPaste: ({ row, factoryDetail }) => {
        Object.assign(row, buildRowPatchFromFactoryDetail(factoryDetail));
      },
    });
  }

  async function handleAfterPaster({ targetAreas, pasteCells }) {
    if (!targetAreas?.length) return;

    const { cols, rows } = targetAreas[0];

    handleAfterPasterUser(cols, rows, { id: 'ProjectLeader', name: 'ProjectLeaderName' });

    const targetIndex = cols.findIndex(c => c.field === 'InsidePartNumber');
    if (targetIndex !== -1) {
      const list = pasteCells.map(r => r[targetIndex]);

      const data = await fetchFactoriesByPartNumbers(list);

      const datalist = buildDatalistFromApiData(data);
      if (datalist.length === 0) {
        createMessage.warning('未识别到有效的料号');
        return;
      }

      applyDatalistToRows(rows, datalist);
    }

    handleAfterPasteFactoryLeader({ rows, cols, pasteCells });
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
        Object.assign(row, { [fieldConfig.id]: target?.id || '', [fieldConfig.name]: target?.fullName || '' });
      });
    });
  }

  function handleBeforeBatch() {
    openModal(true, {
      insideProjectCode: '',
      beforeFetch: params => {
        return {
          ...params,
          statusTag: '1,3',
        };
      },
    });
  }

  function handleBatchAdd(data) {
    const list = data.map(item => {
      const { members } = item;
      const target = {
        ...item,
        InsidePartNumber: item.insidePartNumber,
        Factory: item.factory,
        LineRemark: item.lineRemark,
        TerminalCustomerPartNumber: item.terminalCustomerPartNumber,
        ImmediateCustomerPartNumber: item.immediateCustomerPartNumber,
        IsBonded: 'false',
        CostUnit: 'PCS',
        FactoryName: item.FactoryFullName || item.factoryFullName,
        uuid: buildUUID(),
        onEdit: true,
        editable: true,
        disabled: {
          TerminalCustomerPartNumber: true,
          ImmediateCustomerPartNumber: true,
          ProductDesc: true,
        },
        ProductDesc: item.productDesc,
      };
      const project = members?.find(item => item.configType == 'PDTLeader');
      if (project) {
        target.ProjectLeader = project.memberId;
        target.ProjectLeaderName = project.memberName;
      }

      target.uuid = buildUUID();
      return target;
    });
    const datalist = gridApi.grid.getFullData();

    nextTick(() => {
      if (datalist.length == 1 && !datalist[0].InsidePartNumber) {
        return gridApi.grid.reloadData(list);
      }
      gridApi.grid.reloadData([...datalist, ...list]);
    });
  }
</script>
<style lang="less" scoped>
  .add-summary {
    display: inline-flex;
    height: 42px;
    padding: 0 8px;
    justify-content: center;
    align-items: center;
    gap: 4px;
    flex-shrink: 0;
    border-radius: 4px;
    border: 1px dashed #dbdbdb;
    margin-top: 8px;
    cursor: pointer;
    width: max-content;
    margin-bottom: 15px;
    color: #1a1a1a;

    /* 中文/正文14 */

    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 22px;

    /* 157.143% */

    .img-box {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      width: 30px;
      height: 30px;

      & > img {
        width: 12px;
        height: 12px;
      }
    }
  }

  .form-pd {
    padding: 0 15px 15px;
  }
</style>
