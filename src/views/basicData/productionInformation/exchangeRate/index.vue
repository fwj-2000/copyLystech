<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <Grid>
          <template #toolbar-actions>
            <a-space>
              <a-button v-auth="'btn_add'" type="primary" @click="addOrUpdateHandle()"> {{ t('common.add2Text') }} </a-button>
              <a-button v-auth="'btn_batchRemove'" @click="handleDeleteList()"> {{ t('common.batchDelText') }} </a-button>
              <a-button v-auth="'btn_download'" type="primary" @click="handleExport"
                ><i class="icon-ym icon-ym-btn-download button-preIcon"> </i>{{ t('common.exportText') }}
              </a-button>
              <a-button v-auth="'btn_syncSAP'" type="link" @click="handleImport"
                ><i class="icon-ym icon-ym-btn-upload button-preIcon"> </i>{{ t('common.syncSap') }}
              </a-button>
            </a-space>
          </template>
          <template #action="{ row }">
            <TableAction outside :actions="getTableActions(row)" />
          </template>
        </Grid>
      </div>
    </div>
    <add @register="registerForm" @reload="reload" />
    <ExportModal @register="registerExportModal" />
  </div>
</template>

<script setup lang="ts">
  import { ActionItem } from '/@/components/Table';
  import TableAction from '/@/components/Table/src/components/TableAction.vue';
  import { getExchangeRate, deleteExchangeRate, blukDeleteExchangeRate, InsertFromSAP, exportUnitExcel } from '/@/api/basicData/exchangeRate';
  import { getISOCodeList } from '/@/api/basicData/currency';
  import { useModal } from '/@/components/Modal';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { reactive, onMounted } from 'vue';
  import { message } from 'ant-design-vue';
  import add from './components/add.vue';
  import { debounce } from '/@/utils/debounce';
  import { useI18n } from '/@/hooks/web/useI18n';
  import ExportModal from '/@/components/ExportModal/index.vue';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { cloneDeep } from 'lodash-es';

  const { t } = useI18n();
  defineOptions({ name: 'basicData-productionInformation-exchangeRate' });

  interface State {
    industryTypeList: any[];
  }

  const state = reactive<State>({
    industryTypeList: [],
  });

  const columns = [
    { type: 'checkbox', field: 'checkbox', width: 50 },
    { title: t('dict.ExchangeRateColumn.HoldCurrency'), field: 'HoldCurrency', sortable: true, minWidth: 120 },
    { title: t('dict.ExchangeRateColumn.ExchangeCurrency'), field: 'ExchangeCurrency', sortable: true, minWidth: 120 },
    { title: t('dict.ExchangeRateColumn.ExchangeRateNow'), field: 'ExchangeRateNow', sortable: true, minWidth: 120 },
    {
      title: t('dict.SampleApplyColumn.status'),
      field: 'Status',
      sortable: true,
      cellRender: {
        name: 'Tag',
        options: [
          { id: 0, theme: 'gray', rowKey: 'statusDesc' },
          { id: 2, fullName: t('common.disableText'), theme: 'red', rowKey: 'statusDesc' },
          { id: 1, fullName: t('common.enableText'), theme: 'green', rowKey: 'statusDesc' },
        ],
      },
      minWidth: 80,
    },
    {
      title: t('dict.ExchangeRateColumn.ValidityDateStart'),
      field: 'ValidityDateStart',
      cellRender: {
        name: 'Date',
        format: 'YYYY-MM-DD',
      },
      sortable: true,
      minWidth: 120,
    },
    { title: t('dict.LineInfoColumn.OrgName'), field: 'OrgName', sortable: true, minWidth: 80 },
    { title: t('dict.CommonCol.creatorUserName'), field: 'CreatorUserName', sortable: true, minWidth: 180 },
    {
      title: t('dict.CommonCol.creatorTime'),
      field: 'CreatorTime',
      cellRender: {
        name: 'Date',
        format: 'YYYY-MM-DD',
      },
      sortable: true,
      minWidth: 120,
    },
    { title: t('dict.SalesShipPattern.recordTable.modifyUserName'), field: 'LastModifyUserName', sortable: true, minWidth: 180 },
    {
      title: t('dict.SalesShipPattern.recordTable.modifyDateTime'),
      field: 'LastModifyTime',
      cellRender: {
        name: 'Date',
        format: 'YYYY-MM-DD',
      },
      sortable: true,
      minWidth: 120,
    },
    {
      title: t('common.action'),
      field: 'action',
      slots: { default: 'action' },
      minWidth: 80,
      fixed: 'right',
    },
  ];

  const searchFormSchema = [
    {
      fieldName: 'HoldCurrency',
      label: '',
      component: 'ApiSelect',
      componentProps: {
        api: getISOCodeList,
        showSearch: true,
        apiSearch: {
          show: true,
          searchName: 'keyword',
        },
        resultField: 'data',
        labelField: 'ISOCode',
        valueField: 'ISOCode',
        filterOption: false,
      },
    },
    {
      fieldName: 'ExchangeCurrency',
      label: '',
      component: 'ApiSelect',
      componentProps: {
        api: getISOCodeList,
        showSearch: true,
        apiSearch: {
          show: true,
          searchName: 'keyword',
        },
        resultField: 'data',
        labelField: 'ISOCode',
        valueField: 'ISOCode',
        filterOption: false,
      },
    },
    {
      fieldName: 'ValidityDateStart',
      label: '',
      component: 'DatePicker',
      componentProps: {
        placeholder: t('dict.ExchangeRateColumn.ValidityDateStart'),
        format: 'YYYY-MM-DD',
      },
    },
    // {
    //   field: 'ValidityDateEnd',
    //   label: '',
    //   component: 'DatePicker',
    //   componentProps: {
    //     placeholder: '有效期末',
    //     format: 'YYYY-MM-DD',
    //   },
    //   colProps: { span: 3 },
    // },
    {
      fieldName: 'Status',
      label: '',
      component: 'Select',
      // defaultValue: 1,
      componentProps: {
        options: [
          { label: t('common.enableText'), value: 1 },
          { label: t('common.disableText'), value: 2 },
        ],
      },
    },
  ];

  const { createMessage, createConfirm } = useMessage();
  const [registerForm, { openModal: openFormModal }] = useModal();
  const [registerExportModal, { openModal: openExportModal }] = useModal();
  const [Grid, { reload, getSelectRowKeys, clearSelectedRowKeys, getFetchParams }] = useVbenVxeGrid({
    formOptions: {
      collapsed: true,
      showCollapseButton: false,
      // 是否在字段值改变时提交表单
      submitOnChange: false,
      // 按下回车时是否提交表单
      submitOnEnter: true,
      // fieldMappingTime: [['date', ['start', 'end']]],
      commonConfig: {
        componentProps: {},
        labelClass: 'w-0',
      },
      wrapperClass: 'grid grid-cols-6 gap-4',
      schema: searchFormSchema,
      i18nConfig: {
        moduleCode: 'ExchangeRateColumn',
        transferRange: ['placeholder'],
      },
    },
    gridOptions: {
      id: 'basicData-productionInformation-exchangeRate',
      columns,
      showIndexColumn: true,
      api: getExchangeRate,
      i18nConfig: {
        moduleCode: 'ExchangeRateColumn',
      },
    },
  });

  function getTableActions(record): ActionItem[] {
    return [
      {
        icon: 'icon-ym icon-ym-btn-edit',
        onClick: addOrUpdateHandle.bind(null, record.Id),
        auth: 'btn_detail',
      },
      {
        icon: 'icon-ym icon-ym-delete',
        modelConfirm: {
          onOk: handleDelete.bind(null, record),
        },
        auth: 'btn_remove',
        tooltip: t('common.delText'),
      },
    ];
  }

  function addOrUpdateHandle(id = '') {
    openFormModal(true, { id, industryTypeList: state.industryTypeList });
  }

  //单个删除
  function handleDelete(record: Recordable) {
    deleteExchangeRate(record.Id).then(res => {
      createMessage.success(res.msg);
      reload();
    });
  }

  //批量删除
  async function handleDeleteList() {
    let list = getSelectRowKeys;
    if (list?.length === 0) {
      return message.warning(t('common.selectDelDatasTip'));
    } else {
      console.log(list);
      createConfirm({
        iconType: 'warning',
        title: t('common.tipTitle'),
        content: t('common.delTip'),
        onOk: async () => {
          try {
            const { code } = await blukDeleteExchangeRate(list);
            if (code == 200) {
              clearSelectedRowKeys();
              message.warning(t('common.delSuccess'));
            }
            reload();
          } catch (e) {
            clearSelectedRowKeys();
            reload();
          }
        },
      });
    }
  }

  //同步SAP数据
  function handleImport() {
    InsertFromSAP().then(res => {
      createMessage.success(res.msg);
      reload();
    });
  }

  //导出
  function handleExport() {
    const listQuery = {
      ...getFetchParams(),
    };
    openExportModal(true, {
      api: exportUnitExcel,
      listQuery,
      exportOptions: cloneDeep(columns),
      nameProps: 'title',
      idProps: 'field',
      // i18nConfig: {
      //   moduleCode: 'ExchangeRateColumn',
      // },
    });
  }
  //   const optionList = await getISOCodeList(code);
  //   const optionISO = optionList.data.map(i => {
  // 	  return {
  // 		  id: i.ISOCode,
  // 		  fullName: i.ISOCode,
  // 	  };
  //   });
  // }
  //组件加载后更新搜索框的下拉选项
  onMounted(async () => {
    const optionList = await getISOCodeList();
    const optionISO = optionList.data.map(i => {
      return {
        id: i.ISOCode,
        fullName: i.ISOCode,
      };
    });
    state.industryTypeList = optionISO as any[];
  });
</script>

<style scoped lang="less">
  .pldr {
    color: #ff7b00;
  }
</style>
