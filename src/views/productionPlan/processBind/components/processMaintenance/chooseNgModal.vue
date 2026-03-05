<template>
  <BasicModal
    width="800px"
    v-bind="$attrs"
    @register="registerModal"
    :title="t('dict.ProcessRouteColumn.chooseNgRoute')"
    showOkBtn
    @ok="handleSubmit"
    @cancel="handleCloseFn"
    destroyOnClose
    wrapClassName="chooseModal">
    <BasicTable @register="registerTable"></BasicTable>
  </BasicModal>
</template>
<script setup lang="ts">
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicColumn, BasicTable, FormSchema, useTable } from '/@/components/Table';
  import { getList } from '/@/api/business/material';
  import { reactive, ref, nextTick } from 'vue';
  import { getProcessRoute } from '/@/api/productionPlan/processRoute';
  import { useI18n } from '/@/hooks/web/useI18n';
  const { t } = useI18n();

  const emit = defineEmits(['select']);
  const activeProcessName = ref();
  const columns: BasicColumn[] = [
    { title: '工艺路线编码', dataIndex: 'routeCode' },
    { title: '工艺路线名称', dataIndex: 'routeName' },
    { title: '工艺路线图', dataIndex: 'id' },
    { title: '工艺路线类型', dataIndex: 'processRouteTypeName' },
    { title: '工艺路线状态', dataIndex: 'routeStatusName' },
    { title: '所属组织', dataIndex: 'orgName' },
    { title: '状态', dataIndex: 'statusName' },
    { title: '申请部门', dataIndex: 'applyDeptName' },
    { title: '创建人', dataIndex: 'creatorUserName' },
    { title: '创建时间', dataIndex: 'creatorTime', format: 'date|YYYY-MM-DD HH:mm:ss' },
    { title: '修改人', dataIndex: 'lastModifyUserName' },
    { title: '修改时间', dataIndex: 'lastModifyTime', format: 'date|YYYY-MM-DD HH:mm:ss' },
  ];
  const [registerModal, { closeModal }] = useModalInner(init);
  const searchFormSchema: FormSchema[] = [
    {
      field: 'routeCode',
      label: '',
      component: 'Input',
      defaultValue: '',
      componentProps: {
        placeholder: '工艺路线编码',
      },
      colProps: { span: 6 },
    },
    {
      field: 'routeName',
      label: '',
      component: 'Input',
      defaultValue: '',
      componentProps: {
        placeholder: '工艺路线名称',
      },
      colProps: { span: 6 },
    },
    {
      field: 'routeStatus', //0是草稿，1是已发布，2是已废弃
      label: '',
      component: 'Select',
      defaultValue: '',
      componentProps: {
        placeholder: '工艺路线状态',
      },
      colProps: { span: 6 },
    },
    {
      field: 'status',
      label: '',
      component: 'Select',
      componentProps: {
        placeholder: '状态',
        options: [
          { fullName: '启用', id: 1 },
          { fullName: '停用', id: 2 },
        ],
      },
      colProps: { span: 6 },
    },
  ];
  const [registerTable, { setSelectedRowKeys, getSelectRows, reload, getForm }] = useTable({
    api: getProcessRoute,
    beforeFetch: params => {
      params.processRouteType = 2;
      return params;
    },
    columns,
    // rowKey: 'id',
    useSearchForm: true,
    formConfig: {
      //搜索框
      labelWidth: 100,
      schemas: searchFormSchema,
      autoAdvancedLine: 0, //自动展开行
      showAdvancedButton: false,
      showResetButton: false,
      baseColProps: { span: 5 },
      actionColOptions: {
        span: 5,
      },
    },
    rowSelection: {
      type: 'radio',
      hideSelectAll: true,
    },
    showTableSetting: false,
    i18nConfig: {
      moduleCode: 'ProcessRouteColumn',
    },
  });
  function handleSubmit() {
    emit('select', { list: getSelectRows() });
    closeModal();
  }
  function handleCloseFn() {
    closeModal();
  }
  function init({ materials }) {
    if (!materials) return;
    const selectList = materials.split(',');
    nextTick(() => {
      setSelectedRowKeys(selectList.length ? selectList : []);
    });
  }
</script>

<style lang="less" scoped>
  :deep(.ant-table-body) {
    height: 400px !important;
  }
</style>
