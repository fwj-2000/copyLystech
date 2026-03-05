<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    :title="getTitle"
    :showCancelBtn="false"
    showOkBtn
    @ok="handleSubmit"
    :okText="getOkTest"
    width="1000px"
    destroyOnClose>
    <Grid style="min-height: 500px"> </Grid>
  </BasicModal>
</template>

<script setup lang="ts">
  import { computed, reactive } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { getSnDetail } from '/@/api/productionDeal/packagePrint';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  interface State {
    dataForm: any;
    options: any[];
  }

  const state = reactive<State>({
    dataForm: {},
    options: [],
  });
  const getTitle = computed(() => 'SN明细');
  const getOkTest = computed(() => '确定');

  const emit = defineEmits(['register', 'reload', 'saveAndDesign']);
  const [registerModal, { closeModal }] = useModalInner(init);

  const [Grid, { setGridOptions }] = useVbenVxeGrid({
    formOptions: {
      showCollapseButton: false,
      // 是否在字段值改变时提交表单
      submitOnChange: false,
      submitOnEnter: true,
      commonConfig: {
        componentProps: {},
        labelClass: 'w-0',
      },
      wrapperClass: 'grid grid-cols-3 gap-4 ',
      schema: [
        {
          fieldName: 'snCode',
          label: '',
          component: 'Input',
          componentProps: {
            placeholder: 'SnNo',
            allowClear: true,
          },
        },
      ],
      i18nConfig: {
        moduleCode: 'PackLabelPrintColumn',
        transferRange: ['placeholder'],
      },
    },
    gridOptions: {
      id: 'productionDeal-dieCut-halfCodePackagePrint-components-detail.vue',
      columns: [
        {
          title: 'SN码',
          field: 'snCode',
          width: 150,
        },
        {
          title: '产品内部料号',
          field: 'innerMaterialCode',
          width: 150,
        },
        {
          title: '工厂',
          field: 'factoryName',
          width: 150,
        },

        {
          title: '班次',
          field: 'classesName',

          width: 160,
        },
        {
          title: '创建时间',
          field: 'creatorTime',
          minWidth: 180,
          cellRender: {
            name: 'Date',
          },
        },
      ],
      rowConfig: {
        keyField: 'Id',
      },
      toolbarConfig: {
        enabled: false,
      },
      showIndexColumn: true,
      i18nConfig: {
        moduleCode: 'PackLabelPrintColumn',
      },
      beforeFetch: params => {
        const _params = {
          ...params,
          inPackCode: state.dataForm.uniqueCodeInPack,
        };
        return _params;
      },
    },
  });
  function init(data) {
    state.dataForm.uniqueCodeInPack = data.record.uniqueCodeInPack;
    if (state.dataForm.uniqueCodeInPack) {
      state.dataForm = data.record;
      setGridOptions({ api: getSnDetail });
    }
  }
  //提交
  async function handleSubmit() {
    closeModal();
  }
</script>
<style lang="less" scoped>
  :deep(.vxe-form.page) {
    border-bottom: none;
  }
</style>
