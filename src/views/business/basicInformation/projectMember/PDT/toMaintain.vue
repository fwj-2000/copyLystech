<template>
  <div class="group-tab-inner">
    <div class="pr-20px pl-20px">
      <subtitle :title="t('common.memberMaintain')" :extra="{ show: true, hideAdd: true }">
        <template #extra>
          <a-button v-auth="'btn_maintain'" class="mr-3" @click="openGroup"> {{ t('common.maintianGroup') }}</a-button>
          <a-button v-auth="'btn_point'" type="primary" class="mr-3" @click="pointGroup">{{ t('common.pointGroup') }}</a-button>
        </template>
      </subtitle>
      <BasicForm @register="registerForm">
        <template #formFooter>
          <a-button type="primary" class="ml-3" @click="search">{{ t('common.queryText') }}</a-button>
          <a-button class="ml-3" @click="reset">{{ t('common.resetText') }}</a-button>
        </template>
      </BasicForm>
    </div>
    <Grid></Grid>
  </div>
  <pointGroupModal @register="registerPointGroupModal" @reload="getList"></pointGroupModal>
</template>

<script setup lang="ts">
  import { watch, reactive, nextTick } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import Subtitle from '/@/components/Subtitle/src/Subtitle.vue';
  import pointGroupModal from '../components/GroupListModal.vue';
  import { getToMaintainist, getdropdownlistToMain, getFactorylist } from '/@/api/business/projectMember';
  import { BasicForm, useForm } from '/@/components/Form';
  import { message } from 'ant-design-vue';
  import { useModal } from '/@/components/Modal';
  import { getProductionType } from '/@/utils/business/index';
  import { getUserListByAccountList } from '/@/api/business/salesForecast';
  import { getUserInfoList } from '/@/api/permission/user';

  const { t } = useI18n();
  const state = reactive<any>({
    tableData: [],
  });

  const props = defineProps({
    teamType: {
      type: String,
      default: '',
    },
    reload: {
      type: Number,
      default: 0,
    },
    mainProcess: {
      type: String,
      default: '1',
    },
  });

  watch(
    () => props.reload,
    () => {
      // 外部刷新时，清空表格数据
      reset();
    },
  );

  const [registerPointGroupModal, { openModal: openPointGroupModal }] = useModal();
  const [registerForm, { getFieldsValue, resetFields }] = useForm({
    baseColProps: { span: 4 },
    i18nConfig: {
      moduleCode: 'ProjectMembersGroupColumn',
      transferRange: ['placeholder'],
      excludeFields: ['pdId'],
    },
    schemas: [
      {
        field: 'factoryCode',
        i18nField: 'factoryName',
        label: '',
        component: 'ApiSelect',
        componentProps: {
          api: getFactorylist,
          apiSearch: {
            show: true,
            searchName: 'code',
          },
          labelField: 'Name',
          valueField: 'Code',
          resultField: 'data',
          beforeFetch: params => {
            params.mainProcess = props.mainProcess || '1';
            return params;
          },
          alwaysLoad: true,
          nameFormat: ['Name', '/', 'Code'],
          showSearch: true,
          immediate: false,
          filterOption: false,
          placeholder: '请选择工厂',
        },
      },
      {
        field: 'insideProjectCode',
        label: '',
        component: 'ApiSelect',
        componentProps: {
          placeholder: '内部项目代码',
          api: getdropdownlistToMain,
          showSearch: true,
          alwaysLoad: true,
          apiSearch: {
            show: true,
            searchName: 'insideProjectCode',
          },
          params: { type: 1 },
          beforeFetch: params => {
            params.mainProcess = props.mainProcess || '1';
            params.factory = getFieldsValue().factoryCode || '';
          },
          resultField: 'data.codes',
          valueField: 'code',
          labelField: 'insideProjectCode',
          allowClear: true,
          filterOption: false,
          immediate: false,
        },
      },
      {
        field: 'customer',
        i18nField: 'immediateCustomerName',
        label: '',
        component: 'ApiSelect',
        componentProps: {
          placeholder: '直接客户',
          api: getdropdownlistToMain,
          showSearch: true,
          alwaysLoad: true,
          apiSearch: {
            show: true,
            searchName: 'immediateCustomerCode',
          },
          params: {
            type: 2,
          },
          beforeFetch: params => {
            params.insideProjectCode = getFieldsValue().insideProjectCode;
            params.factory = getFieldsValue().factoryCode || '';
            params.mainProcess = props.mainProcess || '1';
          },
          resultField: 'data.customers',
          valueField: 'immediateCustomerCode',
          labelField: 'immediateCustomerName',
          allowClear: true,
          filterOption: false,
          immediate: false,
          nameFormat: ['immediateCustomerCode', '/', 'immediateCustomerName'],
        },
      },
      {
        field: 'pdId',
        label: '',
        component: 'CustomUserSelect',
        componentProps: {
          placeholder: 'PD',
        },
      },
    ],
  });
  const columns = [
    { type: 'checkbox', field: 'checkbox', width: 50 },
    {
      field: 'factory',
      title: t('dict.ProjectMembersGroupColumn.factoryName'),
      minWidth: 200,
      formatter: ({ cellValue, row }) => {
        return row.factoryName + '/' + cellValue;
      },
    },
    {
      field: 'materialPartsNumber',
      title: t('dict.ProjectMembersGroupColumn.materialPartsNumber'),
      minWidth: 160,
      filters: [],
    },
    {
      field: 'immediateCustomerName',
      title: t('dict.ProjectMembersGroupColumn.immediateCustomerName'),
      minWidth: 200,
      filters: [],
    },
    {
      field: 'immediateCustomerCode',
      title: t('dict.ProjectMembersGroupColumn.immediateCustomerCode'),
      minWidth: 120,
    },
    {
      field: 'productionType',
      title: t('dict.ProjectMembersGroupColumn.productionTypeDesc'),
      minWidth: 150,
      editRender: {
        name: 'ASelect',
        cacheField: 'productionTypeDesc',
        props: {
          options: getProductionType,
        },
      },
    },
    {
      field: 'pdId',
      title: 'PD',
      minWidth: 200,
      editRender: {
        name: 'CustomUserSelect',
        cacheField: 'pdName',
        // 自定义编辑渲染组件的事件处理
        events: {
          change: ({ row }, value, $event) => {
            row.pdId = value;
            row.pdName = $event.fullName;
          },
        },
      },
    },
    {
      field: 'skuTeamName',
      title: t('dict.ProjectMembersGroupColumn.skuTeamName'),
      minWidth: 200,
    },
    {
      field: 'customerTeamName',
      title: t('dict.ProjectMembersGroupColumn.customerTeamName'),
      minWidth: 200,
    },
  ];
  const gridOptions: any = {
    id: 'business-basicInformation-projectMember-PDT-toMain',
    checkboxConfig: {
      checkField: 'isChecked',
      indeterminateField: 'isIndeterminate',
    },
    editConfig: { trigger: 'dblclick', mode: 'row', showStatus: true },
    columns: columns,
    formConfig: {
      enabled: false,
    },
    height: 'auto',
    minHeight: 400,
    filterConfig: {
      remote: false,
      className: 'vxe-filter-wrapper',
    },
    proxyConfig: {
      enabled: false,
    },
    toolbarConfig: {
      enabled: false,
    },
    exportConfig: {
      excludeFields: ['checkbox'],
    },
    showOverflow: true,
    clipConfig: {
      isPaste: true,
      afterPasteMethod: handleAfterPaster,
    },
  };

  const [Grid, gridApi] = useVbenVxeGrid({
    gridOptions,
  });
  //   获取列表数据
  async function getList() {
    try {
      gridApi.setLoading(true);
      const r = await getToMaintainist({
        teamType: props.teamType,
        mainProcess: props.mainProcess,
        ...getFieldsValue(),
      });
      const data = sortDataByMaterialPartsNumberAsc(r.data);
      // 过滤出sku和直接客户列表
      const uniqueSku = new Map();
      const uniqueCustomer = new Map();
      const _list = data.map((el: any) => {
        const key = `${el.materialPartsNumber}`;
        if (!uniqueSku.has(key)) {
          uniqueSku.set(key, { label: el.materialPartsNumber, value: el.materialPartsNumber });
        }
        const keyCustomer = `${el.immediateCustomerId}`;
        if (!uniqueCustomer.has(keyCustomer)) {
          uniqueCustomer.set(keyCustomer, { label: el.immediateCustomerName, value: el.immediateCustomerName });
        }
        if (!el.productionType) {
          const item = getProductionType[0];
          el.productionType = item.value;
          el.productionTypeDesc = item.label;
        }
        return el;
      });

      // 更新 gridOptions 中的 filters 选项
      handleColumFilter('materialPartsNumber', uniqueSku);
      handleColumFilter('immediateCustomerName', uniqueCustomer);

      gridApi.setLoading(false);
      state.tableData = _list;
      gridApi.grid.reloadData(_list);
    } catch (error) {
      console.error(error);
      gridApi.setLoading(false);
      state.tableData = [];
      gridApi.grid.reloadData([]);
      gridApi.grid.resetFilterPanel();
    }
    gridApi.grid.clearFilter();
  }

  /**
   * @description 根据【料件号(`materialPartsNumber`)】, 对数据进行升序排序
   * @param data 要排序的数据
   * @param sortColumns 排序配置
   */
  function sortDataByMaterialPartsNumberAsc(data: Array<{ materialPartsNumber: string }>) {
    if (!Array.isArray(data) || data.length === 0) {
      return [];
    }

    const list = [...data];
    list.sort((a, b) => {
      const aMaterialPartsNumber = a.materialPartsNumber || '';
      const bMaterialPartsNumber = b.materialPartsNumber || '';
      return aMaterialPartsNumber.localeCompare(bMaterialPartsNumber);
    });

    return list;
  }

  const emits = defineEmits(['openGroupPopup']);
  function openGroup() {
    emits('openGroupPopup');
  }

  function pointGroup() {
    const rows = gridApi.grid.getCheckboxRecords() || [];
    if (!rows.length) {
      return message.info(t('common.selectText'));
    }
    let hasNotPd = rows.find(el => !el.pdId); // 是否选定了pd
    if (hasNotPd) {
      return message.info('请选择pd，再指定');
    }
    // 指定人员
    openPointGroupModal(true, {
      mainProcess: props.mainProcess,
      teamType: props.teamType,
      rows,
    });
  }

  function handleColumFilter(keyName, unique) {
    gridOptions.columns.forEach(column => {
      if (column.field === keyName) {
        column.filters = Array.from(unique.values());
      }
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
  /**
   * 生产类型复制处理
   * @param cols
   * @param rows
   */
  function handleAfterPasterIsProductionType(cols: Array<{ field: string }>, rows: Array<{ isDeclareCustoms: string }>, pasteCells: string[][]) {
    const targetIndex = cols.findIndex((item: any) => item.field === 'productionType');
    if (targetIndex == -1) return false;

    const dataList = rows.map((item, index) => {
      const targetValue = pasteCells?.[index]?.[targetIndex] || 0;
      const target = getProductionType.find(unit => unit.id == targetValue);
      return Object.assign(item, {
        productionType: target?.id,
        productionTypeDesc: target?.fullName,
      });
    });
    if (dataList.length == 0) return false;
    nextTick(() => {
      gridApi.grid.setRow(dataList);
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
    // PD处理
    handleAfterPasterUser(cols, rows, { id: 'pdId', name: 'pdName' });
    // 生产类型处理
    handleAfterPasterIsProductionType(cols, rows, pasteCellData);
  }

  function search() {
    getList();
  }
  function reset() {
    resetFields();
    gridApi.grid.reloadData([]);
  }
</script>

<style lang="less" scoped>
  .group-tab-inner {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  :deep(.vxe-cell--filter) {
    padding-left: 10px;
  }

  :deep(.vxe-filter-wrapper) {
    transform: translateX(calc(30px + 50%));
  }
</style>
