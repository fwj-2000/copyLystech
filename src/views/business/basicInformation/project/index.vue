<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <Grid>
          <template #toolbar-actions>
            <a-space>
              <a-button v-auth="'btn_add'" type="primary" @click="addOrUpdateHandle()">
                {{ t('common.add') }}
              </a-button>
              <a-button v-auth="'btn_download'" @click="handleExport">
                {{ t('common.batchExport') }}
              </a-button>
            </a-space>
          </template>
          <template #MainProcess="{ row }">
            <span>{{ optionsProcessList.find(c => c.id == row.MainProcess)?.fullName }}</span>
          </template>
          <template #Status="{ row }">
            <a-tag :color="row.Status === 1 ? 'success' : 'error'">{{ row.Status === 1 ? t('common.valid') : t('common.invalid') }}</a-tag>
          </template>
          <template #action="{ row }">
            <TableAction :actions="getTableActions(row)" />
          </template>
        </Grid>
      </div>
    </div>
    <add @register="registerForm" @reload="reload" />
    <ExportModal @register="registerExportModal" />
    <ImportModal @register="registerImportModal" @reload="reload" />
  </div>
</template>

<script setup lang="ts">
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { getColumn, getFormConfig } from '/@/views/business/basicInformation/project/config';
  import { ActionItem } from '/@/components/Table';
  import { useI18n } from '/@/hooks/web/useI18n';
  import TableAction from '/@/components/Table/src/components/TableAction.vue';
  import { getProject, getOrganize, exportProjectExcel } from '/@/api/business/project';
  import { useModal } from '/@/components/Modal';
  import { reactive, onMounted, toRefs } from 'vue';
  import { getProductLineCode } from '/@/api/basicData/productLine';
  import { useBaseStore } from '/@/store/modules/base';

  import add from './components/add.vue';
  import ExportModal from '/@/components/ExportModal/index.vue';
  import ImportModal from './components/ImportModal.vue';

  defineOptions({ name: 'business-basicInformation-project' });

  const pageBizCode = 'Project';
  const { t } = useI18n();
  const baseStore = useBaseStore();

  interface State {
    optionsProcessList: any[];
    terminalCustomerList: any[];
    customerCodeList: any[];
    productLineList: any[];
    organizeIdTree: any[];
  }

  const state = reactive<State>({
    optionsProcessList: [],
    terminalCustomerList: [],
    customerCodeList: [],
    productLineList: [],
    organizeIdTree: [],
  });
  const { optionsProcessList } = toRefs(state);

  const [registerForm, { openModal: openFormModal }] = useModal();
  const [registerExportModal, { openModal: openExportModal }] = useModal();
  const [registerImportModal, { openModal: openImportModal }] = useModal();

  const [Grid, gridApi] = useVbenVxeGrid({
    formOptions: {
      collapsed: true,
      // 是否在字段值改变时提交表单
      submitOnChange: false,
      showCollapseButton: true,
      // 按下回车时是否提交表单
      submitOnEnter: true,
      commonConfig: {
        componentProps: {},
        labelClass: 'w-0',
      },
      wrapperClass: 'grid grid-cols-5 gap-4',
      schema: getFormConfig(),
      i18nConfig: {
        moduleCode: 'ProjectColumn',
        transferRange: ['placeholder'],
      },
    },
    gridOptions: {
      id: 'business-basicInformation-project-list',
      columns: getColumn(),
      api: getProject,
      pagerConfig: {
        autoHidden: false,
      },
      i18nConfig: {
        moduleCode: 'ProjectColumn',
      },
    },
  });
  const { reload, getFetchParams, updateSchema } = gridApi;

  function getTableActions(record): ActionItem[] {
    return [
      {
        icon: 'ym-diecut ym-diecut-edit-1',
        onClick: addOrUpdateHandle.bind(null, record.Id, record.MainProcess),
        auth: 'btn_detail',
        tooltip: t('common.editText'),
      },
    ];
  }

  //新增或者修改
  async function addOrUpdateHandle(id = '', process = 0) {
    if (process) {
      const line = (await getProductLineCode(' ', process)).data.map(i => {
        return {
          id: i.Code,
          fullName: i.Code + '(' + i.Name + ')',
        };
      });
      state.productLineList = line;
    }
    openFormModal(true, {
      id,
      optionsProcessList: state.optionsProcessList,
      //customerCodeList: state.customerCodeList,
      terminalCustomerList: state.terminalCustomerList,
      productLineList: state.productLineList,
      organizeIdTree: state.organizeIdTree,
    });
  }

  //导入
  function handleImport() {
    openImportModal(true, {});
  }

  //导出
  function handleExport() {
    const listQuery = {
      ...getFetchParams(),
    };
    openExportModal(true, {
      listQuery,
      exportOptions: getColumn().slice(2),
      nameProps: 'title',
      idProps: 'field',
      api: exportProjectExcel,
      i18nConfig: {
        moduleCode: `${pageBizCode}Column`,
      },
    });
  }

  onMounted(async () => {
    //主要制程
    const process = (await baseStore.getDictionaryData('MainProcess')) as any[];
    const optionsProcess = process.map(i => {
      return {
        id: +i.enCode,
        fullName: i.fullName,
      };
    });
    state.optionsProcessList = optionsProcess;

    //产品线
    const line = (await getProductLineCode(' ', 1)).data.map(i => {
      return {
        id: i.Code,
        fullName: i.Code + '(' + i.Name + ')',
      };
    });
    updateSchema([
      {
        fieldName: 'MainProcess',
        componentProps: {
          onChange: async value => {
            updateSchema([
              {
                fieldName: 'ProductLineCode',
                componentProps: {
                  params: {
                    mainProcess: value,
                  },
                },
              },
            ]);
          },
        },
      },
    ]);

    state.productLineList = line;
    const organizeIdTree = (await getOrganize()).data;
    state.organizeIdTree = organizeIdTree;
  });
</script>

<style scoped lang="less">
  .pldr {
    color: #ff7b00;
  }

  :deep(.ym-diecut) {
    font-size: 18px;
  }
</style>
