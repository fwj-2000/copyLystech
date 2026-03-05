<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <Grid>
          <template #toolbar-actions>
            <a-button v-auth="'btn_add'" type="primary" @click="addOrUpdateHandle()"> {{ t('common.add2Text') }}</a-button>
            <vShowDropdown>
              <template #overlay>
                <button v-if="hasBtnP('btn_download')" @click="batchImportOrExport({ key: 'export' })">{{ t('common.batchExport') }} </button>
                <button v-if="hasBtnP('btn_upload')" @click="batchImportOrExport({ key: 'import' })">{{ t('common.batchImport') }} </button>
              </template>
              <a-button v-if="hasBtnP('btn_download') || hasBtnP('btn_upload')">{{ t('common.batchImportOrExport') }}</a-button>
            </vShowDropdown>
            <a-button v-auth="'btn_batchRemove'" danger @click="handleDeleteList()"> {{ t('common.batchDelText') }} </a-button>
          </template>
          <!-- <template #bodyCell="{ column, record }">
            <template v-if="column.dataIndex === 'Status'">
              <a-tag :color="record.Status === 1 ? 'success' : 'error'">{{ record.Status === 1 ? t('common.yes') : t('common.no') }}</a-tag>
            </template>
            <template v-if="column.dataIndex === 'action'">
              <TableAction :actions="getTableActions(record)" />
            </template>
          </template> -->
          <!-- <template #Status="{ row }">
            <a-tag :color="row.Status === 1 ? 'success' : 'error'">{{ row.Status === 1 ? t('common.yes') : t('common.no') }}</a-tag>
          </template> -->
          <template #action="{ row }">
            <TableAction outside :actions="getTableActions(row)" />
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
  import { BasicTable, useTable, BasicColumn, FormSchema, ActionItem } from '/@/components/Table';
  import { useI18n } from '/@/hooks/web/useI18n';
  import TableAction from '/@/components/Table/src/components/TableAction.vue';
  import { getUnit, deleteUnit, blukDeleteUnit, importData, importPreview, templateDownload } from '/@/api/basicData/unit';
  import Record from '/@/views/extend/printData/components/Record.vue';
  import { useModal } from '/@/components/Modal';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { onMounted, reactive } from 'vue';
  import { message } from 'ant-design-vue';

  import add from './components/add.vue';
  import ExportModal from './components/ExportModal.vue';
  import ImportModal from './components/ImportModal.vue';
  import { usePermission } from '/@/hooks/web/usePermission';
  import vShowDropdown from '/@/components/VShowDropdown/src/vShowDropdown.vue';
  const { hasBtnP } = usePermission();

  defineOptions({ name: 'basicData-productionInformation-unit' });

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

  const statusOptions = [
    { id: 1, fullName: t('common.enableText'), theme: 'green' },
    { id: 2, fullName: t('common.disableText'), theme: 'red' },
  ];

  const columns = [
    { type: 'checkbox', field: 'checkbox', width: 50 },
    { title: '计量编码', field: 'Code' },
    { title: '计量名称', field: 'Name' },
    { title: '所属组织', field: 'OrgName' },
    {
      title: '是否启用',
      field: 'Status',
      cellRender: {
        name: 'Tag',
        options: statusOptions,
      },
    },
    { title: '辅计量单位', field: 'Auxiliary' },
    { title: '换算率', field: 'Conversion' },
    { title: '小数点位数', field: 'DotNumber' },
    { title: '创建人', field: 'CreatorUserName' },
    {
      title: '创建时间',
      field: 'CreatorTime',
      cellRender: {
        name: 'Date',
      },
    },
    { title: '修改人', field: 'LastModifyUserName' },
    {
      title: '修改时间',
      field: 'LastModifyTime',
      cellRender: {
        name: 'Date',
      },
    },
    { title: '备注', field: 'Remark' },
    { title: '操作', field: 'action', slots: { default: 'action' }, width: 80, fixed: 'right' },
  ];

  const searchFormSchema = [
    {
      fieldName: 'Code',
      label: '',
      component: 'Input',
      defaultValue: '',
      componentProps: {
        placeholder: '请输入计量编码',
      },
    },
    {
      fieldName: 'Name',
      label: '',
      component: 'Input',
      defaultValue: '',
      componentProps: {
        placeholder: '请输入计量名称',
      },
    },
    {
      fieldName: 'Auxiliary', //1是有效，2是失效
      label: '',
      component: 'Input',
      defaultValue: '',
      componentProps: {
        placeholder: '请输入辅计量单位',
      },
    },
  ];

  //getRowSelection获取行id, reload刷新表单，getFetchParams获取表单数据
  // const [registerTable, { getRowSelection, reload, getFetchParams }] = useTable({
  //   api: getUnit,
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
  //       moduleCode: 'UnitColumn',
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
  //     moduleCode: 'UnitColumn',
  //   },
  // });

  const [Grid, gridApi] = useVbenVxeGrid({
    formOptions: {
      collapsed: false,
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
      wrapperClass: 'grid grid-cols-5 gap-4',
      schema: searchFormSchema,
      i18nConfig: {
        moduleCode: 'UnitColumn',
        transferRange: ['placeholder'],
      },
    },
    gridOptions: {
      id: 'basicData-productionInformation-unit-list',
      columns: columns,
      bordered: true,
      showTableSetting: true,
      useSearchForm: true,
      api: getUnit,
      showIndexColumn: true,
      pagerConfig: {
        autoHidden: false,
      },
      i18nConfig: {
        moduleCode: 'UnitColumn',
      },
    },
  });

  const { getSelectRowKeys, getFetchParams, reload, clearSelectedRowKeys } = gridApi;

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

  //新增或者修改
  function addOrUpdateHandle(id = '') {
    openFormModal(true, { id, industryTypeList: state.industryTypeList });
  }

  //单个删除
  function handleDelete(record: Recordable) {
    deleteUnit(record.Id).then(res => {
      createMessage.success(res.msg);
      reload();
    });
  }

  //批量删除
  async function handleDeleteList() {
    const list = getSelectRowKeys();
    if (list?.length === 0) {
      clearSelectedRowKeys();
      return message.warning(t('common.selectDelDatasTip'));
    } else {
      createConfirm({
        iconType: 'warning',
        title: t('common.tipTitle'),
        content: t('common.delTip'),
        onOk: async () => {
          try {
            const { code } = await blukDeleteUnit(list);
            if (code == 200) {
              clearSelectedRowKeys();
              message.warning(t('common.delSuccess'));
            }
            reload();
          } catch (e) {
            clearSelectedRowKeys();
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
