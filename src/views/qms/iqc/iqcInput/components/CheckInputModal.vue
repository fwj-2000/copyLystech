<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    :title="getTitle"
    :draggable="true"
    showOkBtn
    @ok="handleSubmit"
    width="1000px"
    :destroyOnClose="true"
    :showFooter="false"
    :ok-text="t('common.submit')">
    <BasicForm @register="registerForm">
      <template #title>
        <div class="mb-2">
          <AddCustomRows :columns="SAPColumns" :data="state.reviewData" :canEdit="false" :showAddBtn="false" />
        </div>
        <Grid ref="gridRef" v-bind="Grid" :data="state.reviewData"></Grid>
      </template>
    </BasicForm>
    <Grid> </Grid>
  </BasicModal>
</template>

<script setup lang="ts">
  import { computed, reactive } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm, FormSchema } from '/@/components/Form';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { SAPColumns } from './config';
  import { useVbenVxeGrid, VxeGridProps } from '/@/adapter/vxe-table';
  import type { VxeGridPropTypes } from '/@/components/VxeTable';

  interface State {
    reviewData: any[];
  }
  const state = reactive<State>({
    reviewData: [],
  });
  const emits = defineEmits(['register', 'reload', 'onSelect']);

  const { t } = useI18n();
  const [registerModal, { closeModal, changeOkLoading }] = useModalInner(init);

  // 其他基础信息
  const schema: FormSchema[] = [
    {
      field: 'iqcchkno',
      label: '',
      // label: '标准值',
      component: 'Input',
      componentProps: {
        placeholder: '标准值',
        allowClear: true,
      },
    },
    {
      field: 'lotno1',
      label: '',
      // label: '上公差',
      component: 'Input',
      componentProps: {
        placeholder: '上公差',
        allowClear: true,
      },
    },
    {
      field: 'lotno2',
      label: '',
      // label: '下公差',
      component: 'Input',
      componentProps: {
        placeholder: '下公差',
        allowClear: true,
      },
    },
    {
      field: 'insidepartnumber',
      label: '',
      // label: '检测规格',
      component: 'ApiSelect',
      componentProps: {
        placeholder: '请输入检测规格',
        allowClear: true,
        // api: getProductLineList,
        labelField: 'Name',
        valueField: 'Code',
        resultField: 'data',
        filterOption: false,
        nameFormat: ['Code', '-', 'Name'],
        notFoundContent: null,
        immediate: true,
      },
    },
    {
      field: 'insidepartnumber1',
      label: '',
      // label: '检测工具',
      component: 'ApiSelect',
      componentProps: {
        placeholder: '请输入检测工具',
        allowClear: true,
        // api: getProductLineList,
        labelField: 'Name',
        valueField: 'Code',
        resultField: 'data',
        filterOption: false,
        nameFormat: ['Code', '-', 'Name'],
        notFoundContent: null,
        immediate: true,
      },
    },
  ];
  const [registerForm, { validate, setFieldsValue }] = useForm({
    schemas: schema,
    baseColProps: { span: 4 },
    // actionColOptions: { span: 24 },
    autoSubmitOnEnter: true,
    submitFunc: handleSubmit,
  });

  const [Grid, gridApi] = useVbenVxeGrid({
    // api: params => confirmPageList({ ...params, isConfirm: false }),
    gridEvents: {},
    gridOptions: {
      columns: getColumn(),
      virtualXConfig: {
        enabled: false,
        gt: 0,
      },
      virtualYConfig: {
        enabled: false,
        gt: 0,
      },
      spanMethod(data) {
        let spanFields: string[] = ['lastCheckResult'];
        const { $rowIndex: rowIndex, column, visibleData } = data;
        if (spanFields.includes(column.field)) {
          if (rowIndex === 0) {
            return { rowspan: visibleData.length, colspan: 1 };
          } else {
            return { rowspan: 0, colspan: 0 };
          }
        }
      },
      editConfig: {
        trigger: 'dblclick',
        mode: 'row',
        showAsterisk: true,
      },
      editRules: {
        checkItem: [
          {
            trigger: 'blur',
            validator: ({ row }) => {
              const ErrorText = handleValidate(row);
              if (ErrorText) {
                return new Error('失败');
              }
            },
          },
        ],
      },
      rowConfig: {
        keyField: '_X_ROW_KEY',
      },
      pagerConfig: {
        enabled: false,
      },
      i18nConfig: {
        moduleCode: '',
      },
    },
  });

  function getColumn(): VxeGridPropTypes.Columns {
    return [
      {
        field: 'seq',
        title: t('component.table.index'),
        type: 'seq',
        width: 50,
        align: 'center',
      },
      {
        title: '检测项目',
        field: 'checkItem',
        sortable: true,
        editRender: {
          //   enabled: canEdit,
          //   name: 'Input',
          //   props: {
          //     placeholder: '',
          //     disabled: false,
          //   },
        },
        slots: { edit: 'edit_checkItem', default: 'default_checkItem' },
        width: 260,
      },
      {
        title: 'NG数',
        field: 'ngCount',
        width: 120,
        editRender: {
          name: 'InputNumber',
          props: {
            placeholder: '',
            rowParams: {
              checkResult: 'checkResult',
            },

            onChange: (e, params) => {
              const {
                $grid: { setRow },
                row,
              } = params;
              if (e) {
                row.checkResult = 1;
              } else {
                row.checkResult = 0;
              }
              // const item = handleInnerPartNumberItem(data);
              setRow(row);
              // nextTick(() => {
              //   row.factory = item.factory;
              // });
            },
          },
        },
      },
      {
        title: '备注',
        field: 'remark',
        // width: 120,
        editRender: {
          name: 'Input',
          props: {
            placeholder: '',
          },
        },
      },
      {
        title: '检测结果',
        field: 'checkResult',
        sortable: true,
        // width: 120,
        cellRender: {
          name: 'Tag',
          options: [
            { id: 0, fullName: 'OK', theme: 'green' }, // ok
            { id: 1, fullName: 'NG', theme: 'red' }, // ng
          ],
        },
      },
      {
        title: '最终检测结果',
        field: 'lastCheckResult',
        sortable: true,
        // width: 150,
        cellRender: {
          name: 'Tag',
          options: [
            { id: 0, fullName: 'OK', theme: 'green' }, // ok
            { id: 1, fullName: 'NG', theme: 'red' }, // ng
          ],
        },
        slots: {
          //   default: data => {
          //     const checkResultList: any = [];
          //     if (!data?.data) return '';
          //     data.data.forEach(item => {
          //       checkResultList.push(item.checkResult);
          //     });
          //     if (checkResultList.includes(1)) {
          //       return h('div', { class: 'ng-class' }, 'NG');
          //     } else {
          //       return h('div', { class: 'ok-class' }, 'OK');
          //     }
          //   },
        },
      },
      // 操作行
      {
        title: t('common.action'),
        width: 120,
        field: 'action',
        fixed: 'right',
        slots: {
          default: 'action',
        },
      },
    ];
  }

  const getTitle = computed(() => t('common.add1Text'));
  function init(data) {
    const reviewer: string[] = [];
    data.reviewData.forEach((item: any) => {
      reviewer.push(item.chkUserNo);
    });
    setFieldsValue({ reviewer });
  }
</script>
