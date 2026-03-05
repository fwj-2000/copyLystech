<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="pr-10px pl-10px pt-10px bg-white">
        <BasicForm @register="registerForm">
          <template #formFooter>
            <a-button type="primary" class="ml-3" @click="search">{{ t('common.queryText') }}</a-button>
            <a-button class="ml-3" @click="reset">{{ t('common.resetText') }}</a-button>
          </template>
        </BasicForm>
      </div>
      <div class="lydc-content-wrapper-content bg-white">
        <Grid>
          <template #toolbar_buttons>
            <div class="flex">
              <a-button
                v-auth="'btn_configRole'"
                class="mr-3"
                type="primary"
                @click="
                  openPopup(true, {
                    mainProcess: state.mainProcess,
                  })
                ">
                {{ t('common.configRole') }}
              </a-button>
              <a-button v-auth="'btn_download'" class="mr-3" type="primary" ghost @click="download">
                {{ t('common.exportText') }}
              </a-button>
              <div>
                <span>{{ t('dict.MainProcess') }}: </span>
                <LydcSelect v-model:value="state.mainProcess" :options="state.mainProcessList" style="width: 200px" @change="changeMainprocess" />
              </div>
            </div>
          </template>
        </Grid>
      </div>
    </div>
    <configRole @register="registerConfigRole"></configRole>
  </div>
</template>

<script lang="ts" setup>
  import { onMounted, reactive } from 'vue';
  import { commonCols, endCols, pdtColsName } from '../components/tableConfig';
  import { getProjectMembers, exportTotals, getdropdownlist, getFactorylist } from '/@/api/business/projectMember';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { BasicTableProps } from '/@/components/VxeTable';
  import { usePopup } from '/@/components/Popup';
  import ConfigRole from '../components/ConfigRole.vue';
  import { BasicForm, useForm } from '/@/components/Form';
  import { getMainProcess, getProductionType } from '/@/utils/business/index';
  import { downloadByUrl } from '/@/utils/file/download';
  import { getListDynamicTitles } from '../utils';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  defineOptions({ name: 'business-basicInformation-projectMember-total' });

  const state = reactive<{ tableData: Array<any>; mainProcess: string; mainProcessList: any[] }>({
    tableData: [],
    mainProcess: '1',
    mainProcessList: [],
  });
  const { t } = useI18n();
  const { hasBtnP } = usePermission();
  const [registerConfigRole, { openPopup }] = usePopup();
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
            params.mainProcess = state.mainProcess || '1';
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
            params.mainProcess = state.mainProcess || '1';
            return params;
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
            params.mainProcess = state.mainProcess || '1';
            params.insideProjectCode = getFieldsValue().insideProjectCode;
          },
          resultField: 'data',
          valueField: 'code',
          labelField: 'name',
          allowClear: true,
          filterOption: false,
          immediate: false,
          nameFormat: ['code', '/', 'name'],
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
    id: 'business-basicInformation-projectMember-total',
    mouseConfig: {
      area: true, // 是否开启区域选取
      extension: false,
    },
    keyboardConfig: {
      isClip: true,
    },
    columns: commonCols,
    columnConfig: {
      resizable: true,
    },
    data: state.tableData,
    formConfig: {
      enabled: false,
    },
    height: 'auto',
    filterConfig: {
      remote: true,
    },
    pagerConfig: {
      autoHidden: false,
    },
    proxyConfig: {
      filter: true,
      response: {
        result: 'data',
        total: 'total',
      },
      ajax: {
        query: args => {
          return getTableData(args.page);
        },
      },
    },
    scrollX: {
      enabled: true,
    },
    toolbarConfig: {
      export: hasBtnP('btn_download'),
      print: false,
      reload: true,
      slots: {
        buttons: 'toolbar_buttons', // 指定插槽名称
      },
    },
    exportConfig: {
      excludeFields: ['checkbox'],
    },
    showOverflow: true,
  });

  async function getTableData({ currentPage = 1, pageSize = 10 }, searchForm = {}) {
    const params = getFieldsValue();
    return getProjectMembers({
      pageSize,
      currentPage,
      ...searchForm,
      ...params,
      mainProcess: state.mainProcess,
    }).then(({ data }) => {
      return {
        data: data.list.map(el => {
          el.memberConfigList.forEach(memberItem => {
            el[memberItem.configType] = memberItem.memberName;
          });
          return el;
        }),
        total: data.pagination.total,
      };
    });
  }

  const [Grid, gridApi] = useVbenVxeGrid({
    gridOptions,
  });
  const { reloadColumn, query } = gridApi;

  // 下载
  async function download() {
    const params = getFieldsValue();
    params.mainProcess = state.mainProcess;
    const res = await exportTotals(params);
    if (res.code == 200) {
      downloadByUrl({ url: res.data.url });
    }
  }

  // 获取动态表头
  async function getDynamicTitle(mainProcess?: string) {
    const list = await getListDynamicTitles('all', mainProcess || state.mainProcess);
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

  // 更换主要制程
  function changeMainprocess(e) {
    getDynamicTitle(e);
    search();
  }

  async function search() {
    query();
  }
  function reset() {
    resetFields().then(() => {
      setTimeout(() => {
        search();
      }, 0);
    });
  }

  onMounted(async () => {
    getDynamicTitle();
    query();
    state.mainProcessList = await getMainProcess();
  });
</script>

<style lang="less" scoped>
  :deep(.lydc-basic-popup-header) {
    padding-left: 12px;
  }
</style>
