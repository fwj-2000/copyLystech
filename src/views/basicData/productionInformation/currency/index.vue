<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <Grid>
          <template #toolbar-actions>
            <a-button v-auth="'btn_add'" type="primary" @click="addOrUpdateHandle()"> {{ t('common.add2Text') }}</a-button>
            <!-- <a-button v-auth="'btn_download'" type="primary" @click="handleExport">{{ t('common.exportText') }} </a-button>
            <a-button v-auth="'btn_upload'" type="link" @click="handleImport">{{ t('common.importText') }} </a-button> -->
            <vShowDropdown>
              <template #overlay>
                <button v-if="hasBtnP('btn_download')" @click="batchImportOrExport({ key: 'export' })">{{ t('common.batchExport') }} </button>
                <button v-if="hasBtnP('btn_upload')" @click="batchImportOrExport({ key: 'import' })">{{ t('common.batchImport') }} </button>
              </template>
              <a-button v-if="hasBtnP('btn_download') || hasBtnP('btn_upload')">{{ t('common.batchImportOrExport') }}</a-button>
            </vShowDropdown>
            <a-button v-auth="'btn_batchRemove'" danger @click="handleDeleteList()"> {{ t('common.batchDelText') }} </a-button>
          </template>
          <template #action="{ row }">
            <TableAction :actions="getTableActions(row)" />
          </template>
          <!-- <template #bodyCell="{ column, record }">
            <template v-if="column.dataIndex === 'Status'">
              <a-tag :color="record.Status === 1 ? 'success' : 'error'">{{ record.Status === 1 ? t('common.yes') : t('common.no') }}</a-tag>
            </template>
            <template v-if="column.dataIndex === 'action'">
              <TableAction :actions="getTableActions(record)" />
            </template>
          </template> -->
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
  import { BasicTable, useTable, BasicColumn, FormSchema, ActionItem } from '/@/components/Table';
  import { useI18n } from '/@/hooks/web/useI18n';
  import TableAction from '/@/components/Table/src/components/TableAction.vue';
  import { getCurrency, deleteCurrency, blukDeleteCurrency } from '/@/api/basicData/currency';
  //import Record from '/@/views/extend/printData/components/Record.vue';
  import { useModal } from '/@/components/Modal';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { reactive } from 'vue';
  import { message } from 'ant-design-vue';
  import { usePermission } from '/@/hooks/web/usePermission';
  import add from './components/add.vue';
  import ExportModal from './components/ExportModal.vue';
  import ImportModal from './components/ImportModal.vue';
  import vShowDropdown from '/@/components/VShowDropdown/src/vShowDropdown.vue';

  defineOptions({ name: 'basicData-productionInformation-currency' });
  const { t } = useI18n();

  interface State {
    industryTypeList: any[];
  }

  const state = reactive<State>({
    industryTypeList: [],
  });

  const [registerForm, { openModal: openFormModal }] = useModal();
  const [registerExportModal, { openModal: openExportModal }] = useModal();
  const [registerImportModal, { openModal: openImportModal }] = useModal();

  const { hasBtnP } = usePermission();

  const STATUS = [
    { id: 1, fullName: t('common.yes'), theme: 'green' },
    { id: 2, fullName: t('common.no'), theme: 'red' },
  ];

  const columns = [
    { type: 'checkbox', field: 'checkbox', width: 50 },
    { title: 'ISO代码', field: 'ISOCode', width: 150 },
    { title: '简称', field: 'ShortName', width: 140 },
    { title: '所属组织', field: 'OrgName', width: 140 },
    { title: '全称', field: 'FullName', width: 150 },
    {
      title: '是否启用',
      field: 'Status',
      cellRender: {
        name: 'Tag',
        options: STATUS,
      },
      width: 120,
    },
    { title: '备注', field: 'Remark', width: 150 },
    { title: '创建人', field: 'CreatorUserName', width: 180 },
    {
      title: '创建时间',
      field: 'CreatorTime',
      cellRender: {
        name: 'Date',
      },
      width: 180,
    },
    { title: '修改人', field: 'LastModifyUserName', width: 180 },
    {
      title: '修改时间',
      field: 'LastModifyTime',
      cellRender: {
        name: 'Date',
      },
      width: 180,
    },
    { title: '操作', field: 'action', slots: { default: 'action' }, width: 80, fixed: 'right' },
  ];

  const searchFormSchema = [
    {
      fieldName: 'ISOCode',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: 'ISO代码',
      },
    },
    {
      fieldName: 'FullName',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: '全称',
      },
    },
    {
      fieldName: 'Status', //1是有效，2是失效
      label: '',
      component: 'Select',
      componentProps: {
        placeholder: '请选择是否启用',
        options: [
          { fullName: t('common.yes'), id: 1 },
          { fullName: t('common.no'), id: 2 },
        ],
        fieldNames: { label: 'fullName', value: 'id' },
      },
    },
  ];

  const [Grid, gridApi] = useVbenVxeGrid({
    formOptions: {
      collapsed: false,
      showCollapseButton: false,
      submitOnChange: false,
      submitOnEnter: true,
      commonConfig: {
        componentProps: {},
        labelClass: 'w-0',
      },
      wrapperClass: 'grid grid-cols-5 gap-4',
      schema: searchFormSchema,
      i18nConfig: {
        moduleCode: 'CurrencyColumn',
        transferRange: ['placeholder'],
      },
    },
    gridOptions: {
      id: 'productionInformation-currency-list',
      columns: columns,
      api: getCurrency,
      isCanResizeParent: true,
      canResize: true, //自适应高度
      useSearchForm: true,
      bordered: true,
      showIndexColumn: true,
      striped: true,
      showTableSetting: true, //刷新按钮,默认打开
      i18nConfig: {
        moduleCode: 'CurrencyColumn',
      },
      pagerConfig: {
        pageSize: 30,
        size: 'small',
      },
    },
  });

  const { reload, getSelectRowKeys, getFetchParams, clearSelectedRowKeys } = gridApi;

  // //getRowSelection获取行id, reload刷新表单，getFetchParams获取表单数据
  // const [registerTable, { getRowSelection, reload, getFetchParams }] = useTable({
  //   api: getCurrency,
  //   title: '',
  //   columns,
  //   rowKey: 'Id',
  //   isCanResizeParent: true,
  //   canResize: true, //自适应高度
  //   formConfig: {
  //     //搜索框
  //     labelWidth: 100,
  //     schemas: searchFormSchema,
  //     autoAdvancedLine: 1, //自动展开行
  //     i18nConfig: {
  //       moduleCode: 'CurrencyColumn',
  //       transferRange: ['placeholder'],
  //     },
  //   },
  //   striped: true,
  //   useSearchForm: true, //使用搜索表单
  //   showTableSetting: true, //刷新按钮,默认打开
  //   bordered: true, //显示表格边框
  //   showIndexColumn: true, //显示序号
  //   pagination: {
  //     pageSize: 30,
  //     size: 'small',
  //   },
  //   rowSelection: {
  //     type: 'checkbox',
  //   },
  //   actionColumn: {
  //     width: 70,
  //     title: t('common.action'),
  //     dataIndex: 'action', //字段
  //     fixed: 'right', //显示在右边
  //   },
  //   i18nConfig: {
  //     moduleCode: 'CurrencyColumn',
  //   },
  // });

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
          title: t('common.deleted'),
          onOk: handleDelete.bind(null, record),
        },
        auth: 'btn_remove',
      },
    ];
  }

  const { createMessage, createConfirm } = useMessage();

  function addOrUpdateHandle(id = '') {
    openFormModal(true, { id, industryTypeList: state.industryTypeList });
  }

  //单个删除
  function handleDelete(record: Recordable) {
    deleteCurrency(record.Id).then(res => {
      createMessage.success(res.msg);
      reload();
    });
  }

  //批量删除
  async function handleDeleteList() {
    let list = getSelectRowKeys();
    if (list?.length === 0) {
      return message.warning(t('common.selectDelDatasTip'));
    } else {
      createConfirm({
        iconType: 'warning',
        title: t('common.tipTitle'),
        content: t('common.delTip'),
        onOk: async () => {
          try {
            const { code } = await blukDeleteCurrency(list);
            if (code == 200) {
              clearSelectedRowKeys();
              message.warning(t('common.delSuccess'));
            }
            reload();
          } catch (e) {
            reload();
            throw e;
          }
        },
      });
    }
  }

  function batchImportOrExport({ key }) {
    const openMethod = key === 'import' ? handleImport : handleExport;
    openMethod();
  }

  //导入
  function handleImport() {
    openImportModal(true, {});
  }

  //导出
  async function handleExport() {
    const listQuery = {
      ...(await getFetchParams()),
    };
    openExportModal(true, { listQuery });
  }
</script>

<style scoped lang="less">
  .pldr {
    color: #ff7b00;
  }
</style>
