<template>
  <div class="group-tab-inner">
    <div class="pr-20px pl-20px">
      <subtitle :title="t('common.memberMaintain')" :extra="{ show: true, hideAdd: true }">
        <template #extra>
          <a-button v-auth="'btn_maintain'" class="mr-3" @click="openGroup"> {{ t('common.maintianGroup') }} </a-button>
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
  import { watch, reactive } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import Subtitle from '/@/components/Subtitle/src/Subtitle.vue';
  // import { getMainProcess } from './components/config';
  import pointGroupModal from '../components/GroupListModal.vue';
  import { getToMaintainist, getdropdownlistToMain, getFactorylist } from '/@/api/business/projectMember';
  // import { BasicTableProps, VxeBasicTable, VxeGridInstance } from '/@/components/VxeTable';
  import { BasicForm, useForm } from '/@/components/Form';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { message } from 'ant-design-vue';
  import { useModal } from '/@/components/Modal';

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
          nameFormat: ['Name', '/', 'Code'],
          showSearch: true,
          immediate: false,
          filterOption: false,
          placeholder: '请选择工厂',
          alwaysLoad: true,
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
            params.factory = getFieldsValue().factoryCode || '';
            params.mainProcess = props.mainProcess || '1';
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
          apiSearch: {
            show: true,
            searchName: 'immediateCustomerCode',
          },
          alwaysLoad: true,
          params: {
            type: 2,
          },
          beforeFetch: params => {
            params.mainProcess = props.mainProcess || '1';
            params.insideProjectCode = getFieldsValue().insideProjectCode;
            params.factory = getFieldsValue().factoryCode || '';
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
    ],
  });

  const gridOptions: any = {
    id: 'business-basicInformation-projectMember-PMT-toMain',
    checkboxConfig: {
      checkField: 'isChecked',
      indeterminateField: 'isIndeterminate',
    },
    scrollX: {
      enabled: true,
    },
    columns: [
      { type: 'checkbox', field: 'checkbox', width: 60 },
      {
        field: 'factory',
        title: t('dict.ProjectMembersGroupColumn.factoryName'),
        minWidth: 200,
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
        field: 'skuTeamName',
        title: t('dict.ProjectMembersGroupColumn.skuTeamName'),
        minWidth: 200,
      },
      {
        field: 'customerTeamName',
        title: t('dict.ProjectMembersGroupColumn.customerTeamName'),
        minWidth: 200,
      },
    ],
    columnConfig: {
      resizable: true,
    },
    formConfig: {
      enabled: false,
    },
    height: 'auto',
    minHeight: 400,
    filterConfig: {
      remote: false,
      className: 'vxe-filter-wrapper',
    },
    sortConfig: {
      remote: false,
      defaultSort: [{ field: 'materialPartsNumber', order: 'asc' }],
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
        return el;
      });
      // 更新 gridOptions 中的 filters 选项
      handleColumFilter('materialPartsNumber', uniqueSku);
      handleColumFilter('immediateCustomerName', uniqueCustomer);

      gridApi.setLoading(false);
      state.tableData = _list;
      gridApi.grid.reloadData(_list);
    } catch (error) {
      console.error('🚀 ~ toMaintain.vue:266 ~ getList ~ error:', error);
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

  function handleColumFilter(keyName, unique) {
    gridOptions.columns.forEach(column => {
      if (column.field === keyName) {
        console.log(Array.from(unique.values()));
        column.filters = Array.from(unique.values());
      }
    });
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
    // 指定人员
    openPointGroupModal(true, {
      mainProcess: props.mainProcess,
      teamType: props.teamType,
      rows,
    });
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
