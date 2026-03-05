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
              <a-button type="primary" ghost @click="openOriginCodeModal(true, {})"> {{ t('dict.productCode') }} </a-button>
              <a-button type="primary" ghost danger v-auth="'btn_batchRemove'" @click="handleDeleteList()">
                {{ t('common.batchDelText') }}
              </a-button>
              <a-button v-auth="'btn_download'" @click="handleExport">
                {{ t('common.batchExport') }}
              </a-button>
            </a-space>
          </template>
          <template #MainProcess="{ row }">
            <span>{{ optionsProcessList.find(c => c.id == row.MainProcess)?.fullName }}</span>
          </template>
          <template #action="{ row }">
            <TableAction outside :actions="getTableActions(row)" />
          </template>
        </Grid>
      </div>
    </div>
    <add @register="registerForm" @reload="reload" />
    <ExportModal @register="registerExportModal" />
    <OriginCode @register="registerOriginCodeModal" />
  </div>
</template>

<script setup lang="ts">
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { getColumn, getFormConfig } from '/@/views/basicData/productionInformation/productLine/config';
  import { useI18n } from '/@/hooks/web/useI18n';
  import TableAction from '/@/components/Table/src/components/TableAction.vue';
  import { getProductLine, deleteProductLine, blukDeleteProductLine, exportProductLineExcel } from '/@/api/basicData/productLine';
  import { useModal } from '/@/components/Modal';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { reactive, onMounted, toRefs } from 'vue';
  import { useBaseStore } from '/@/store/modules/base';
  import add from './components/add.vue';
  import ExportModal from '/@/components/ExportModal/index.vue';
  import OriginCode from './components/OriginCode.vue';

  defineOptions({ name: 'basicData-productionInformation-productLine' });
  const { t } = useI18n();
  const baseStore = useBaseStore();

  const [registerOriginCodeModal, { openModal: openOriginCodeModal }] = useModal();

  interface State {
    optionsProcessList: any[];
  }

  const state = reactive<State>({
    optionsProcessList: [],
  });

  const { optionsProcessList } = toRefs(state);
  const [registerForm, { openModal: openFormModal }] = useModal();
  const [registerExportModal, { openModal: openExportModal }] = useModal();

  const [Grid, { reload, getFetchParams, getSelectRows }] = useVbenVxeGrid({
    formOptions: {
      collapsed: true,
      // 是否在字段值改变时提交表单
      submitOnChange: false,
      showCollapseButton: false,
      // 按下回车时是否提交表单
      submitOnEnter: true,
      commonConfig: {
        componentProps: {},
        labelClass: 'w-0',
      },
      wrapperClass: 'grid grid-cols-5 gap-4',
      schema: getFormConfig(),
      i18nConfig: {
        moduleCode: 'ProductLineColumn',
        transferRange: ['placeholder'],
      },
    },
    gridOptions: {
      id: 'basicData-productionInformation-productLine-list',
      columns: getColumn(),
      api: getProductLine,
      pagerConfig: {
        autoHidden: false,
      },
      i18nConfig: {
        moduleCode: 'ProductLineColumn',
      },
    },
  });

  function getTableActions(record): ActionItem[] {
    return [
      {
        // icon: 'icon-ym icon-ym-btn-edit',
        icon: 'ym-diecut ym-diecut-edit-1',
        onClick: addOrUpdateHandle.bind(null, record.Id),
        auth: 'btn_detail',
        tooltip: t('common.editText'),
      },
      {
        // icon: 'icon-ym icon-ym-delete',
        icon: 'ym-diecut ym-diecut-delete',
        modelConfirm: {
          title: t('common.delText'),
          onOk: handleDelete.bind(null, record),
        },
        auth: 'btn_remove',
        tooltip: t('common.delText'),
      },
    ];
  }

  const { createMessage, createConfirm } = useMessage();

  //新增或者修改
  async function addOrUpdateHandle(id = '') {
    openFormModal(true, {
      id,
      optionsProcessList: state.optionsProcessList,
    });
  }

  //单个删除
  function handleDelete(record: Recordable) {
    deleteProductLine(record.Id).then(res => {
      createMessage.success(res.msg);
      reload();
    });
  }

  //批量删除
  async function handleDeleteList() {
    const selectRows = getSelectRows();
    const selectKeys = selectRows.map(item => item.Id);
    if (selectKeys.length === 0) return createMessage.error(t('common.selectText'));
    createConfirm({
      iconType: 'warning',
      title: t('common.tipTitle'),
      content: t('common.beforeDelTip'),
      onOk: async () => {
        try {
          const { code, msg } = await blukDeleteProductLine(selectKeys);
          if (code === 200) {
            // setSelectedRowKeys([]);
            createMessage.success(msg);
            reload();
          }
        } catch (e) {
          console.log(e);
          reload();
        }
      },
    });
  }

  //导出
  function handleExport() {
    openExportModal(true, {
      api: exportProductLineExcel,
      listQuery: { ...getFetchParams() },
      exportOptions: getColumn().slice(2),
      nameProps: 'title',
      idProps: 'field',
      i18nConfig: {
        moduleCode: 'ProductLineColumn', // 字典分类EnCode
      },
    });
  }

  onMounted(async () => {
    const process = (await baseStore.getDictionaryData('MainProcess')) as any[];
    const optionsProcess = process.map(i => {
      return {
        id: +i.enCode,
        fullName: i.fullName,
      };
    });
    state.optionsProcessList = optionsProcess;
  });
</script>

<style scoped lang="less">
  .pldr {
    color: #ff7b00;
  }
</style>
