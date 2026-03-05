<template>
  <div class="group-tab-inner">
    <div class="pr-20px pl-20px">
      <BasicForm @register="registerForm">
        <template #formFooter>
          <a-button type="primary" class="ml-3" @click="search">{{ t('common.queryText') }}</a-button>
          <a-button class="ml-3" @click="reset">{{ t('common.resetText') }}</a-button>
        </template>
      </BasicForm>
    </div>
    <Grid></Grid>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, reactive, ref, watch } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { getListDynamicTitles } from '../utils';
  import { getMaintainList, getdropdownlist, getFactorylist } from '/@/api/business/projectMember';
  import { BasicTableProps, VxeBasicTable, VxeGridInstance } from '/@/components/VxeTable';
  import { BasicForm, useForm } from '/@/components/Form';
  import { message } from 'ant-design-vue';
  import { commonCols, endCols } from '../components/tableConfig';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';

  const { t } = useI18n();

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
    async () => {
      await getDynamicTitle();
      search();
    },
  );

  const [registerForm, { getFieldsValue, resetFields, updateSchema }] = useForm({
    baseColProps: { span: 3 },
    i18nConfig: {
      moduleCode: 'ProjectMembersGroupColumn',
      transferRange: ['placeholder'],
    },
    schemas: [
      {
        field: 'factory',
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
          nameFormat: ['Code', '/', 'Name'],
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
          api: getdropdownlist,
          showSearch: true,
          apiSearch: {
            show: true,
            searchName: 'code',
          },
          params: { type: 1 },
          beforeFetch: params => {
            params.mainProcess = props.mainProcess || '1';
            params.factory = getFieldsValue().factoryCode || '';
          },
          resultField: 'data',
          valueField: 'code',
          labelField: 'name',
          allowClear: true,
          filterOption: false,
          immediate: true,
        },
      },
      {
        field: 'materialPartsNumber',
        label: '',
        component: 'Input',
        componentProps: {
          placeholder: '料件号',
        },
      },
      {
        field: 'immediateCustomerName',
        i18nField: 'immediateCustomerName',
        label: '',
        component: 'ApiSelect',
        componentProps: {
          placeholder: '直接客户',
          api: getdropdownlist,
          showSearch: true,
          apiSearch: {
            show: true,
            searchName: 'code',
          },
          params: {
            type: 2,
          },
          beforeFetch: params => {
            params.insideProjectCode = getFieldsValue().insideProjectCode;
            params.factory = getFieldsValue().factoryCode || '';
            params.mainProcess = props.mainProcess || '1';
          },
          resultField: 'data',
          valueField: 'code',
          labelField: 'name',
          nameFormat: ['code', '/', 'name'],
          allowClear: true,
          filterOption: false,
          immediate: false,
        },
      },
      {
        field: 'configType',
        label: '',
        component: 'Select',
        componentProps: {
          placeholder: '角色',
        },
      },
      {
        field: 'memberId',
        label: '',
        component: 'CustomUserSelect',
        componentProps: {
          placeholder: '项目成员',
        },
      },
    ],
  });

  const gridOptions = reactive<BasicTableProps>({
    id: 'business-basicInformation-projectMember-PMT',
    checkboxConfig: {
      checkField: 'isChecked',
      indeterminateField: 'isIndeterminate',
    },
    keyboardConfig: {
      isClip: true,
    },
    columns: commonCols,
    columnConfig: {
      resizable: true,
    },
    formConfig: {
      enabled: false,
    },
    filterConfig: {
      remote: true,
    },
    proxyConfig: {
      response: {
        result: 'data',
        total: 'total',
      },
      ajax: {
        query: args => {
          return getList(args.page);
        },
      },
    },
    toolbarConfig: {
      buttons: [
        {
          icon: 'ant-design:plus-circle-outlined',
          content: t('common.updateText'),
          buttonRender: {
            name: 'AButton',
            events: {
              click: () => {
                // 打开更改项目组弹框
                updateGroup();
              },
            },
          },
        },
      ],
      export: false,
      print: false,
      refresh: true,
    },
    showIndexColumn: true,
  });
  const [Grid, gridApi] = useVbenVxeGrid({
    gridOptions,
  });
  const { query, reloadColumn } = gridApi;
  //   获取列表数据
  async function getList(params?: { currentPage: number; pageSize: number }) {
    gridOptions.loading = true;

    const queryParams = params ?? { currentPage: 1, pageSize: 10 };

    try {
      const r = await getMaintainList({
        teamType: props.teamType,
        mainProcess: props.mainProcess,
        ...getFieldsValue(),
        ...queryParams,
      });

      const { data } = r;

      const list = (data.list ?? []).map(el => {
        const row = { ...el };

        (el.memberConfigList ?? []).forEach(memberItem => {
          row[memberItem.configType] = memberItem.memberName;
        });

        return row;
      });

      return {
        total: data.pagination?.total ?? 0,
        data: list,
      };
    } finally {
      gridOptions.loading = false;
    }
  }

  const emits = defineEmits(['openUpdate']);
  function updateGroup() {
    const rows = gridApi.grid.getCheckboxRecords() || [];
    if (!rows.length) {
      return message.info(t('common.selectText'));
    }
    // 打开更改项目组弹框
    emits(
      'openUpdate',
      rows.map(el => el.id),
    );
  }

  function search() {
    query();
  }
  function reset() {
    resetFields().then(() => {
      setTimeout(() => {
        search();
      }, 0);
    });
  }
  async function getDynamicTitle() {
    const list = await getListDynamicTitles(props.teamType, props.mainProcess);
    console.log(list);
    updateSchema({
      field: 'configType',
      componentProps: {
        options: list,
        fieldNames: {
          value: 'field',
          label: 'title',
        },
      },
    });
    reloadColumn(commonCols.concat(list).concat(endCols));
  }
  onMounted(async () => {
    await getDynamicTitle();
    query();
  });
</script>

<style lang="less" scoped>
  .group-tab-inner {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
</style>
