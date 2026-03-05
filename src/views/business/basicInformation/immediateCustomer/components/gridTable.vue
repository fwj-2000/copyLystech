<template>
  <Grid>
    <template #toolbar-actions>
      <a-space>
        <a-button v-auth="'btn_edit'" type="primary" @click="handleBatchModify">{{ t('common.batchUpdate') }}</a-button>
        <vShowDropdown>
          <template #overlay>
            <button v-if="hasBtnP('btn_upload')" @click="batchImportOrExport({ key: 'import' })"> {{ t('common.batchImport') }} </button>
            <button v-if="hasBtnP('btn_download')" @click="batchImportOrExport({ key: 'export' })"> {{ t('common.batchExport') }} </button>
          </template>
          <a-button v-if="hasBtnP('btn_upload') || hasBtnP('btn_download')">{{ t('common.batchImportOrExport') }}</a-button>
        </vShowDropdown>
      </a-space>
    </template>

    <template #action="{ row }">
      <TableAction :actions="getTableActions(row)" />
    </template>
  </Grid>

  <RecordModal @register="registerRecordModal" />
</template>

<script lang="ts" setup>
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { getList } from '/@/api/business/immediateCustomer';
  import { schema, columns, initDictionaryData } from '../config';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { omit } from 'lodash-es';
  import { useModal } from '/@/components/Modal';
  import { useMessage } from '/@/hooks/web/useMessage';

  import TableAction from '/@/components/Table/src/components/TableAction.vue';
  import RecordModal from './recordModal.vue';
  import vShowDropdown from '/@/components/VShowDropdown/src/vShowDropdown.vue';
  const props = defineProps({
    isComplete: {
      type: Boolean,
      default: false,
    },
  });
  const emits = defineEmits(['batchImportOrExport', 'batchModify']);
  const { t } = useI18n();
  const { hasBtnP } = usePermission();
  const [registerRecordModal, { openModal: openRecordModal }] = useModal();
  const { createMessage } = useMessage();

  const [Grid, gridApi] = useVbenVxeGrid({
    formOptions: {
      collapsed: true,
      showCollapseButton: true,
      // 是否在字段值改变时提交表单
      submitOnChange: false,
      // 按下回车时是否提交表单
      submitOnEnter: true,
      commonConfig: {
        componentProps: {},
        labelClass: 'w-0',
      },
      wrapperClass: 'grid grid-cols-5 gap-4',
      schema,
    },
    gridOptions: {
      id: `business-basicInformation-immediateCustomer-${props.isComplete ? 'todoList' : 'doneList'}`,
      columns,
      rowConfig: {
        keyField: 'Id',
      },
      // @ts-ignore
      api: async (params: any) => {
        await initDictionaryData();
        // `isComplete` 直接客户信息是否配置完整
        // return getList({ isComplete: props.isComplete, ...params });
        return getList({ ...params });
      },
      keyboardConfig: {
        isBack: false,
      },
      pagerConfig: {
        autoHidden: false,
      },
    },
  });

  function batchImportOrExport(e: any) {
    emits('batchImportOrExport', e);
  }

  function reload() {
    gridApi.reload();
  }

  /**
   * @description: 获取查询参数
   */
  async function getQueryParams() {
    const params = await gridApi.getFetchParams();
    const { pager } = gridApi.grid.getProxyInfo()!;
    return {
      ...params,
      ...omit(pager, 'total'),
    };
  }

  function getTableActions(row: any) {
    return [
      // {
      //   icon: 'icon-ym icon-ym-btn-edit',
      //   onClick: handleEdit.bind(null, row),
      //   tooltip: t('common.editText'),
      //   auth: 'btn_edit',
      // },
      {
        icon: 'icon-ym icon-ym-extend-history',
        tooltip: t('dict.PartNumberApplyColumn.record'),
        onClick: showModifyRecord.bind(null, row),
      },
    ];
  }

  function showModifyRecord(row: any) {
    openRecordModal(true, row.ImmediateCustomerLogs);
  }

  function getSelectRowKeys() {
    return gridApi.getSelectRowKeys();
  }

  function handleBatchModify() {
    const rows = gridApi.getSelectRows();
    if (rows.length === 0) {
      createMessage.warn(t('common.selectText'));
      return false;
    }

    emits(
      'batchModify',
      rows.map(item => {
        return {
          ...item,
          SapCompanyName: [item.SapCompanyCode, item.SapCompanyName].filter(Boolean).join('/'),
        };
      }),
    );
  }

  defineExpose({
    reload,
    getQueryParams,
    getSelectRowKeys,
  });
</script>
