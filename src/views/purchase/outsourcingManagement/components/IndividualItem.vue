<template>
  <!-- 批次 -->
  <div>
    <div class="form-search-block mb-20px">
      <div class="mb-6px">{{ t('dict.CommonCol.transformTag') }}：</div>
      <div class="w-1/2">
        <LydcInput :suffixIcon="'icon-ym icon-ym-scanCode'" v-model:value="translateInput" :placeholder="t('common.scanText')" @Keydown="handlerInputKeydown" />
      </div>
    </div>

    <BasicForm @register="registerForm"> </BasicForm>

    <Grid>
      <template #action="{ row }">
        <TableAction outside :actions="getTableActions(row)" />
      </template>
    </Grid>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive } from 'vue';
  import { BasicForm, FormSchema, useForm } from '/@/components/Form';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { TableAction, ActionItem } from '/@/components/Table';
  import { useBaseStore } from '/@/store/modules/base';
  import { bulkReceive, getunreceivelist } from '/@/api/purchase/outsourcemanage';
  import { useUserStore } from '/@/store/modules/user';
  import { debounce } from 'lodash-es';
  import { individualColumns } from './config';
  const baseStore = useBaseStore();

  const { t } = useI18n();
  interface State {
    dataForm: any;
  }

  const state = reactive<State>({
    dataForm: {},
  });
  const userStore = useUserStore();
  const userInfo = userStore.getUserInfo;

  const translateInput = ref('');
  const schemas: FormSchema[] = [
    {
      field: 'testDecideResult',
      label: '检测结果',
      component: 'ApiSelect',
      componentProps: {
        placeholder: '请选择',
        api: () => {
          return baseStore.getDictionaryData('outsourceTestResult');
        },
        labelField: 'fullName',
        valueField: 'enCode',
        filterOption: false,
        notFoundContent: null,
        immediate: true,
      },
      rules: [{ required: true, trigger: 'change', message: '必填' }],
    },
    // {
    //   field: 'testHardness',
    //   label: '检测硬度',
    //   component: 'InputNumber',
    //   componentProps: { placeholder: '请输入' },
    //   rules: [{ required: true, trigger: 'blur', message: '必填' }],
    //   ifShow: ({ values }) => {
    //     console.log(values);
    //     return !['1', '2', '3'].includes(values.testDecideResult);
    //   },
    // },
    // {
    //   field: 'testCircularJump',
    //   label: '检测圆跳',
    //   component: 'InputNumber',
    //   componentProps: { placeholder: '请输入' },
    //   rules: [{ required: true, trigger: 'blur', message: '必填' }],
    //   ifShow: ({ values }) => {
    //     console.log(values);
    //     return !['1', '2', '3'].includes(values.testDecideResult);
    //   },
    // },

    // {
    //   field: 'spheroidization',
    //   label: '球化',
    //   component: 'ApiSelect',
    //   componentProps: {
    //     placeholder: '请选择',
    //     api: () => {
    //       return baseStore.getDictionaryData('ProcessRules.YesOrNo');
    //     },
    //     labelField: 'fullName',
    //     valueField: 'enCode',
    //     filterOption: false,
    //     notFoundContent: null,
    //     immediate: true,
    //   },
    //   rules: [{ required: true, trigger: 'blur', message: '必填' }],
    //   ifShow: ({ values }) => {
    //     console.log(values);
    //     return !['1', '2', '3'].includes(values.testDecideResult);
    //   },
    // },
    // {
    //   field: 'deepCold',
    //   label: '深冷',
    //   component: 'ApiSelect',
    //   componentProps: {
    //     placeholder: '请选择',
    //     api: () => {
    //       return baseStore.getDictionaryData('ProcessRules.YesOrNo');
    //     },
    //     labelField: 'fullName',
    //     valueField: 'enCode',
    //     filterOption: false,
    //     notFoundContent: null,
    //     immediate: true,
    //   },
    //   rules: [{ required: false, trigger: 'blur', message: '必填' }],
    //   ifShow: ({ values }) => {
    //     console.log(values);
    //     return !['1', '2', '3'].includes(values.testDecideResult);
    //   },
    // },
    // {
    //   field: 'bladeDecideResult',
    //   label: '刀刃',
    //   component: 'ApiSelect',
    //   componentProps: {
    //     placeholder: '请选择',
    //     api: () => {
    //       return baseStore.getDictionaryData('ProcessRules.DecideResult');
    //     },
    //     labelField: 'fullName',
    //     valueField: 'enCode',
    //     filterOption: false,
    //     notFoundContent: null,
    //     immediate: true,
    //   },
    //   rules: [{ required: true, trigger: 'change', message: '必填' }],
    //   ifShow: ({ values }) => {
    //     console.log(values);
    //     return !['1', '2', '3'].includes(values.testDecideResult);
    //   },
    // },

    {
      field: 'testUserId',
      label: '检测人',
      component: 'CustomUserSelect',
      componentProps: { placeholder: '请选择' },
    },
    {
      field: 'testTime',
      label: '检测时间',
      component: 'DatePicker',
      componentProps: { placeholder: '请选择', format: 'YYYY-MM-DD HH:mm:ss' },
    },
  ];
  const emit = defineEmits(['register', 'reload', 'changeLoading', 'closeModal']);
  const { createMessage } = useMessage();
  const [registerForm, { validate, setFieldsValue }] = useForm({
    schemas: schemas,
    layout: 'vertical',
    baseColProps: { span: 6 },
  });

  const [Grid, gridApi] = useVbenVxeGrid({
    gridOptions: {
      id: 'purchase-outsourcingManagement-individual-list',
      columns: individualColumns,
      toolbarConfig: {
        enabled: false,
      },
      pagerConfig: {
        enabled: false,
      },
      height: 240,
      showIndexColumn: true,
      i18nConfig: {
        moduleCode: 'OutsourceManageColumn',
        otherConfig: {
          resizeable: true,
        },
      },
    },
  });

  function getTableActions(record): ActionItem[] {
    return [
      {
        icon: 'icon-ym icon-ym-delete',
        onClick: deleteFn.bind(null, record),
      },
    ];
  }

  const deleteFn = async record => {
    gridApi.grid.remove(record);
  };
  // const [registerModal, { closeModal, changeOkLoading }] = useModalInner(init);

  function init({ receiveTable }) {
    console.log(receiveTable, 'receiveTable++');
    gridApi.grid.reloadData(receiveTable);
    setFieldsValue({ testUserId: userInfo.userId, testTime: new Date(), testDecideResult: 'OK' });
  }

  const handlerInputKeydown = (e: any) => {
    if (e.keyCode !== 13) return;
    const val = e.target._value;
    const arr = val.split('!') || [];
    translateInput.value = arr[0];
    handlerInputChangeFn(arr[0]);
  };

  const handlerInputChangeFn = debounce(async val => {
    emit('changeLoading', true);
    const { data } = await getunreceivelist({ documentNumber: val }).finally(() => {
      emit('changeLoading', false);
    });
    const table = gridApi.getDataSource();
    if (!data) return;
    if (table.some(item => item.workOrderNo === data[0].workOrderNo)) {
      // createMessage.error('不能扫描相同的');
      return;
    }
    table.push(...data);
    gridApi.reloadData(table);
  }, 300);

  //提交
  async function handleSubmit() {
    const values = await validate();
    if (!values) return;
    emit('changeLoading', true);
    const table = gridApi.getDataSource();
    const params = {
      ...values,
      ids: table.map(item => item.id),
    };
    bulkReceive(params)
      .then(res => {
        createMessage.success(res.msg);
        emit('changeLoading', false);
        emit('closeModal');
        emit('reload');
      })
      .catch(() => {
        emit('changeLoading', false);
      });
  }

  defineExpose({
    init,
    handleSubmit,
  });
</script>

<style lang="scss" scoped>
  .form-search-block {
    display: flex;
    align-items: center;
  }
  ::v-deep(.icon-ym-scanCode) {
    color: #ff7b00 !important;
  }
</style>
