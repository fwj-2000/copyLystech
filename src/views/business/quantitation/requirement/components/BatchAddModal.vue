<template>
  <BasicModal v-bind="$attrs" :width="900" :title="t('common.batchImport')" destroyOnClose class="batch-modal" @register="registerModal" @ok="handleSubmit">
    <Grid :style="{ minHeight: '550px' }"></Grid>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { reactive } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { getInnermaterialnumberPage, getFactorysList } from '/@/api/business/quantitation';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';

  const { t } = useI18n();
  const emit = defineEmits(['reload', 'register']);
  const state = reactive({
    insideProjectCode: '',
    beforeFetch: null,
    init: true,
  });

  const [Grid, { getSelectRows, setFieldValue, query }] = useVbenVxeGrid({
    formOptions: {
      collapsed: false,
      showCollapseButton: false,
      // 是否在字段值改变时提交表单
      submitOnChange: false,
      // 按下回车时是否提交表单
      submitOnEnter: true,
      commonConfig: {
        labelClass: 'w-0',
      },
      wrapperClass: 'grid grid-cols-3 gap-4',
      i18nConfig: {
        moduleCode: 'CommonCol',
        transferRange: ['placeholder'],
      },
      schema: [
        {
          fieldName: 'applyCode',
          i18nField: 'applyNo',
          label: '',
          component: 'Input',
          componentProps: { placeholder: '成品编码申请单号' },
        },
        {
          fieldName: 'insidePartNumber',
          label: '',
          component: 'Input',
          componentProps: { placeholder: '产品内部料号' },
        },
        {
          fieldName: 'insideProjectCode',
          label: '',
          component: 'Input',
          componentProps: { placeholder: '内部项目代码' },
        },
        {
          fieldName: 'factoryId',
          i18nField: 'CommonCol.factory',
          label: '',
          component: 'ApiSelect',
          componentProps: {
            placeholder: '工厂',
            api: getFactorysList,
            showSearch: true,
            apiSearch: {
              show: true,
              searchName: 'factoryCode',
            },
            resultField: 'data',
            labelField: 'Name',
            valueField: 'Id',
            immediate: true,
            nameFormat: ['Name', '/', 'Code'],
          },
        },
        {
          fieldName: 'immediateCustomerCode',
          label: '',
          component: 'Input',
          componentProps: { placeholder: '直接客户代码' },
        },
      ],
    },
    gridOptions: {
      api: getInnermaterialnumberPage,
      columns: [
        { type: 'checkbox', field: 'checkbox', minWidth: 50, fixed: 'left' },
        { title: '成品编码申请单号', field: 'applyCode', i18nField: 'applyNo', minWidth: 150, sortable: true },
        { title: '产品内部料号', field: 'insidePartNumber', minWidth: 180 },
        {
          title: '工厂',
          field: 'factoryFullName',
          i18nField: 'CommonCol.factory',
          minWidth: 120,
          formatter: ({ row }) => {
            if (Array.isArray(row.factoryFullNames)) {
              return row.factoryFullNames.join('，');
            }
            return row.factoryFullName || '';
          },
        },
        {
          title: '脱敏图纸',
          field: 'desensitizedDrawingsName',
          minWidth: 120,
          formatter: ({ cellValue }) => {
            return cellValue ? t('dict.NewsStatusEnum.Have') : t('dict.NewsStatusEnum.Nothing');
          },
        },
        { title: '终端客户料号', field: 'terminalCustomerPartNumber', minWidth: 120 },
        { title: '直接客户料号', field: 'immediateCustomerPartNumber', minWidth: 120 },
        { title: '产品描述', field: 'productDesc', minWidth: 180 },
        {
          title: '直接客户代码',
          field: 'immediateCustomerCode',
          minWidth: 180,
          formatter: ({ row }) => {
            return row.immediateCustomerName + '/' + row.immediateCustomerCode;
          },
        },
      ],
      beforeFetch: params => {
        const _params = params;
        if (state.init) {
          state.init = false;
          _params.insideProjectCode = state.insideProjectCode;
        }
        return state.beforeFetch ? state.beforeFetch(_params) : _params;
      },
      proxyConfig: {
        autoLoad: false,
      },
      toolbarConfig: {
        enabled: false,
      },
      showIndexColumn: true,
      position: 'modal',
      i18nConfig: {
        moduleCode: 'CommonCol',
      },
    },
  });
  const [registerModal, { closeModal }] = useModalInner(init);
  function init(data) {
    const { insideProjectCode, beforeFetch } = data;
    if (beforeFetch) {
      state.beforeFetch = beforeFetch;
    }
    if (insideProjectCode) {
      state.insideProjectCode = insideProjectCode;
      setFieldValue('insideProjectCode', insideProjectCode).then(() => {
        state.init = true;
        query();
      });
    } else {
      state.insideProjectCode = '';
      state.init = false;
      query();
    }
  }
  function handleSubmit() {
    closeModal();
    emit('reload', getSelectRows());
  }
</script>
