<template>
  <BasicModal
    width="850px"
    v-bind="$attrs"
    @register="registerModal"
    :title="t('dict.ProcessRouteColumn.chooseNgRoute')"
    showOkBtn
    @ok="handleSubmit"
    @cancel="handleCloseFn"
    destroyOnClose
    wrapClassName="chooseModal">
    <div class="w-full h-[400px] bg-white">
      <Grid> </Grid>
    </div>
  </BasicModal>
</template>
<script setup lang="ts">
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { ref, nextTick } from 'vue';
  import { getProcessRoute } from '/@/api/productionPlan/processRoute';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  const { t } = useI18n();

  const emit = defineEmits(['select']);
  const activeProcessName = ref();
  const columns = [
    { type: 'radio', field: 'checkbox', width: 45 },
    { title: '工艺路线编码', field: 'routeCode' },
    { title: '工艺路线名称', field: 'routeName' },
    { title: '工艺路线图', field: 'id' },
    { title: '工艺路线类型', field: 'processRouteTypeName' },
    { title: '工艺路线状态', field: 'routeStatusName' },
    { title: '所属组织', field: 'orgName' },
    { title: '状态', field: 'statusName' },
    { title: '申请部门', field: 'applyDeptName' },
    { title: '创建人', field: 'creatorUserName' },
    { title: '创建时间', field: 'creatorTime', cellRender: { name: 'Date' } },
    { title: '修改人', field: 'lastModifyUserName' },
    { title: '修改时间', field: 'lastModifyTime', cellRender: { name: 'Date' } },
  ];
  const [registerModal, { closeModal }] = useModalInner(init);
  const searchFormSchema = [
    {
      fieldName: 'routeCode',
      label: '',
      labelWidth: 0,
      component: 'Input',
      defaultValue: '',
      componentProps: {
        placeholder: '工艺路线编码',
      },
      // colProps: { span: 6 },
    },
    {
      fieldName: 'routeName',
      label: '',
      labelWidth: 0,
      component: 'Input',
      defaultValue: '',
      componentProps: {
        placeholder: '工艺路线名称',
      },
      // colProps: { span: 6 },
    },
    {
      fieldName: 'routeStatus', //0是草稿，1是已发布，2是已废弃
      label: '',
      labelWidth: 0,
      component: 'Select',
      defaultValue: '',
      componentProps: {
        placeholder: '工艺路线状态',
      },
      // colProps: { span: 6 },
    },
    {
      fieldName: 'status',
      label: '',
      labelWidth: 0,
      component: 'Select',
      componentProps: {
        placeholder: '状态',
        fieldNames: {
          label: 'fullName',
          value: 'enCode',
        },
        options: [
          { fullName: '启用', enCode: 1 },
          { fullName: '停用', enCode: 2 },
        ],
      },
      // colProps: { span: 6 },
    },
  ];
  const [Grid, gridApi] = useVbenVxeGrid({
    formOptions: {
      collapsed: true,
      // 是否在字段值改变时提交表单
      submitOnChange: false,
      showCollapseButton: false,
      // 按下回车时是否提交表单
      submitOnEnter: true,
      wrapperClass: 'grid grid-cols-5 gap-1',
      schema: searchFormSchema,
    },
    gridOptions: {
      id: 'processBind-components-chooseNgModal.vue',
      api: getProcessRoute,
      columns: columns as any,
      showIndexColumn: true,
      beforeFetch: params => {
        params.processRouteType = 2;
        return params;
      },
      rowConfig: {
        keyField: 'id',
      },
      pagerConfig: {
        autoHidden: true,
      },
      i18nConfig: {
        moduleCode: 'ProcessRouteColumn',
      },
      toolbarConfig: {
        enabled: false,
      },
      afterFetch(data) {
        if (selectList.value.length > 0 && data.list.length > 0) {
          nextTick(() => {
            let selectListRow = data.list.filter(
              item => selectList.value.includes(item.OriginalModelNumber as never) || selectList.value.includes(item.MaterialCode),
            );
            gridApi.grid.setRadioRowKey(selectListRow[0]);
          });
        }
      },
    },
  });
  function handleSubmit() {
    emit('select', { list: [gridApi.grid.getRadioRecord()], processName: activeProcessName.value });
    closeModal();
  }
  function handleCloseFn() {
    closeModal();
  }
  const selectList = ref([]);
  function init({ processName, materials }) {
    activeProcessName.value = processName;
    if (!materials) return;
    selectList.value = materials.split(',');
  }
</script>

<style lang="less" scoped>
  :deep(.ant-table-body) {
    height: 400px !important;
  }

  :deep(.vxe-form.page) {
    border-bottom: none;
  }
</style>
