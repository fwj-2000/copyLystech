<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <Grid>
          <template #toolbar-actions>
            <a-button v-auth="'btn_add'" type="primary" @click="addOrUpdateHandle()"> {{ t('common.add2Text') }}</a-button>
            <a-button v-auth="'btn_batchRemove'" @click="handleDeleteList()"> {{ t('common.batchDelText') }} </a-button>
          </template>

          <template #action="{ row }">
            <TableAction outsize :actions="getTableActions(row)" />
          </template>
        </Grid>
      </div>
    </div>
    <add @register="registerForm" @reload="reload" />
    <ExportModal @register="registerExportModal" />
  </div>
</template>

<script setup lang="ts">
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { BasicTable, useTable, BasicColumn, FormSchema, ActionItem } from '/@/components/Table';
  import { useI18n } from '/@/hooks/web/useI18n';
  import TableAction from '/@/components/Table/src/components/TableAction.vue';
  import { getPCCPackingType, deletePCCPackingType, blukDeletePCCPackingType } from '/@/api/engineering/pccPackingType';
  import Record from '/@/views/extend/printData/components/Record.vue';
  import { useModal } from '/@/components/Modal';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { reactive, onMounted, unref } from 'vue';
  import { message } from 'ant-design-vue';
  import { useBaseStore } from '/@/store/modules/base';
  import { usePermission } from '/@/hooks/web/usePermission';

  const { hasBtnP } = usePermission();

  import add from './components/add.vue';

  const { t } = useI18n();
  const baseStore = useBaseStore();

  const [registerForm, { openModal: openFormModal }] = useModal();
  const [registerExportModal, { openModal: openExportModal }] = useModal();

  const column = [
    { type: 'checkbox', field: 'checkbox', width: 50 },
    { title: '类型', field: 'typeName', align: 'center', width: 80 },
    { title: '单位', field: 'unit', width: 80 },
    { title: '成品出货类型', field: 'shipPatternName', width: 100 },
    { title: '用量倍数', field: 'useQtyMultiple', width: 80 },
    { title: '备注', field: 'remark' },
    { title: '创建人', field: 'creatorUserName' },
    {
      title: '创建时间',
      field: 'creatorTime',
      cellRender: {
        name: 'Date',
      },
    },
    { title: '修改人', field: 'lastModifyUserName' },
    {
      title: '修改时间',
      field: 'lastModifyTime',
      cellRender: {
        name: 'Date',
      },
    },
    { title: '操作', field: 'action', slots: { default: 'action' }, width: 70, fixed: 'right' },
  ];

  function getVxeSchema() {
    return [
      {
        fieldName: 'typeName',
        label: '',
        component: 'Input',
        defaultValue: '',
        componentProps: {
          placeholder: '请输入类型',
        },
        colProps: { span: 4 },
      },
      {
        fieldName: 'shipPattern',
        i18nField: 'shipPatternName',
        label: '',
        component: 'ApiSelect',
        componentProps: {
          api: async () => {
            const data = await baseStore.getDictionaryData('DieCutShipPattern');
            console.log('成品出货类型字典数据:', data);
            return data;
          },
          placeholder: '请选择成品出货类型',
          labelField: 'fullName',
          valueField: 'enCode',
          filterOption: false,
          notFoundContent: null,
          immediate: true,
        },
        colProps: {
          span: 5,
        },
      },
      {
        fieldName: 'pickerVal',
        label: '',
        labelWidth: 70,
        component: 'DateRange',
        colProps: { span: 4 },
      },
    ];
  }

  const [Grid, gridApi] = useVbenVxeGrid({
    formOptions: {
      collapsed: true,
      showCollapseButton: false,
      submitOnChange: false,
      submitOnEnter: true,
      commonConfig: {
        componentProps: {},
        labelClass: 'w-0',
      },
      wrapperClass: 'grid grid-cols-5 gap-4',
      schema: getVxeSchema(),
      i18nConfig: {
        moduleCode: 'PCCPackingTypeColumn',
        transferRange: ['placeholder'],
      },
    },
    gridOptions: {
      id: 'engineering-basicInformation-pccPackingType-list',
      columns: column,
      api: getPCCPackingType,
      showIndexColumn: true,
      i18nConfig: {
        moduleCode: 'PCCPackingTypeColumn',
      },
    },
  });
  const { reload, getSelectRowKeys, clearSelectedRowKeys } = gridApi;

  // //getRowSelection获取行id, reload刷新表单，getFetchParams获取表单数据
  // const [registerTable, { getRowSelection, reload, getFetchParams, getForm }] = useTable({
  //   api: getPCCPackingType,
  //   title: '',
  //   columns,
  //   rowKey: 'id',
  //   isCanResizeParent: true,
  //   canResize: true, //自适应高度
  //   formConfig: {
  //     //搜索框
  //     labelWidth: 100,
  //     schemas: searchFormSchema,
  //     fieldMapToTime: [['pickerVal', ['startTime', 'endTime']]],
  //     autoAdvancedLine: 1, //自动展开行
  //     i18nConfig: {
  //       moduleCode: 'PCCPackingTypeColumn',
  //       transferRange: ['placeholder'],
  //     },
  //   },
  //   striped: true,
  //   useSearchForm: true, //使用搜索表单
  //   showTableSetting: true, //刷新按钮,默认打开

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
  //     title: '操作',
  //     dataIndex: 'action', //字段
  //     fixed: 'right', //显示在右边
  //   },
  //   i18nConfig: {
  //     moduleCode: 'PCCPackingTypeColumn',
  //   },
  // });

  function getTableActions(record): ActionItem[] {
    return [
      {
        icon: 'icon-ym icon-ym-btn-edit',
        onClick: addOrUpdateHandle.bind(null, record),
        auth: 'btn_detail',
      },
      {
        icon: 'icon-ym icon-ym-delete',
        modelConfirm: {
          title: t('common.delText'),
          onOk: handleDelete.bind(null, record),
        },
        auth: 'btn_remove',
      },
    ];
  }

  const { createMessage, createConfirm } = useMessage();

  //新增或者修改
  function addOrUpdateHandle(item = {}) {
    openFormModal(true, { ...item });
  }

  //单个删除
  function handleDelete(record: Recordable) {
    deletePCCPackingType(record.id).then(res => {
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
        content: t('common.beforeDelTip'),
        onOk: async () => {
          try {
            const { code } = await blukDeletePCCPackingType(list);
            if (code == 200) {
              clearSelectedRowKeys();
              message.success(t('common.delSuccess'));
            }
            reload();
          } catch (e) {
            console.error('🚀 ~ index.vue:240 ~ handleDeleteList ~ e:', e);
            clearSelectedRowKeys();
            reload();
          }
        },
      });
    }
  }

  onMounted(async () => {});
</script>

<style scoped lang="less">
  .pldr {
    color: #ff7b00;
  }
</style>
