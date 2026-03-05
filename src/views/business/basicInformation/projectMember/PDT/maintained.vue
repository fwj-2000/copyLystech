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
  import { onMounted, reactive, watch } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { getListDynamicTitles } from '../utils';
  import { getMaintainList, getdropdownlist, getFactorylist } from '/@/api/business/projectMember';
  import { BasicTableProps } from '/@/components/VxeTable';
  import { BasicForm, useForm } from '/@/components/Form';
  import { message } from 'ant-design-vue';
  import { commonCols, pdtColsName, endCols } from '../components/tableConfig';
  import { getProductionType } from '/@/utils/business/index';
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
    baseColProps: { span: 4 },
    i18nConfig: {
      moduleCode: 'ProjectMembersGroupColumn',
      transferRange: ['placeholder'],
      excludeFields: ['pdId'],
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
      {
        field: 'pdId',
        label: '',
        component: 'CustomUserSelect',
        componentProps: {
          placeholder: 'PD',
        },
      },
      {
        field: 'productionType',
        i18nField: 'productionTypeDesc',
        label: '',
        component: 'Select',
        componentProps: {
          placeholder: '生产类型',
          options: getProductionType,
          fieldNames: {
            label: 'label',
            value: 'value',
          },
        },
      },
    ],
  });

  const gridOptions = reactive<BasicTableProps>({
    id: 'business-basicInformation-projectMember-PDT',
    checkboxConfig: {
      checkField: 'isChecked',
      indeterminateField: 'isIndeterminate',
    },
    border: true,
    keyboardConfig: {
      isClip: true,
    },
    rowConfig: {
      drag: true, // 启用行拖拽调整顺序
      useKey: true,
    },
    columns: commonCols,
    formConfig: {
      enabled: false,
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
            props: {
              auth: 'btn_edit',
            },
            events: {
              click: () => {
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
    exportConfig: {
      excludeFields: ['checkbox'],
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
    reloadColumn(commonCols.concat(pdtColsName).concat(list).concat(endCols));
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
