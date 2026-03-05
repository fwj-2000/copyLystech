<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" showOkBtn @ok="handleSubmit" destroyOnClose>
    <BasicForm @register="registerForm">
      <!-- <template #OrgId>
        <lydcOrganizeSelect :disabled="!hasBtnP('btn_edit')" v-model:value="organizeIdTree" placeholder="请选择" @change="onOrganizeChange" />
      </template> -->
    </BasicForm>
  </BasicModal>
</template>

<script setup lang="ts">
  import { computed, nextTick, reactive, ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, FormSchema, useForm } from '/@/components/Form';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { addProcess, getNeedCodeFactory, updateProcess } from '/@/api/engineering/process';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useOrganizeStore } from '/@/store/modules/organize';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { useBaseStore } from '/@/store/modules/base';
  import { getFactoryList } from '/@/api/basicData/productCodeApply';
  import { ListByUserfactory } from '/@/api/productionPlan/processRoute';
  const baseStore = useBaseStore();
  const { hasBtnP } = usePermission();
  // const organizeIdTree = ref([]);

  const { t } = useI18n();
  interface State {
    dataForm: any;
    factoryList: any[];
  }

  const state = reactive<State>({
    dataForm: {
      id: '',
    },
    factoryList: [],
  });

  const schemas: FormSchema[] = [
    {
      field: 'mainProcess',
      label: '主要制程',
      component: 'ApiSelect',
      componentProps: {
        placeholder: '请选择主要制程',
        api: () => baseStore.getDictionaryData('MainProcess'),
        labelField: 'fullName',
        valueField: 'enCode',
        filterOption: false,
        notFoundContent: null,
        immediate: true,
      },
      rules: [{ required: true, trigger: 'blur', message: '必填' }],
    },
    {
      field: 'factoryArea',
      label: '工厂',
      component: 'ApiSelect',
      required: true,
      componentProps: {
        api: ListByUserfactory,
        showSearch: true,
        apiSearch: {
          show: true,
          searchName: 'searchKey',
        },
        resultField: 'data',
        filterOption: false,
        notFoundContent: null,
        immediate: true,
        useChangeCopy: true,
        labelField: 'Name',
        valueField: 'Code',
        afterFetch: ({ data }) => {
          if (!state.dataForm.id) {
            setFieldsValue({ factoryArea: data.length && data[0].Code });
          }
        },
      },
    },
    {
      field: 'name',
      label: '工序名称',
      component: 'Input',
      componentProps: { placeholder: '请输入工序名称' },
      rules: [{ required: true, trigger: 'blur', message: '必填' }],
    },
    {
      field: 'type',
      label: '生产类型',
      component: 'Select',
      componentProps: { placeholder: '请选择生产类型' },
      rules: [{ required: true, trigger: 'blur', message: '必填' }],
    },
    {
      field: 'processType',
      label: '工序类型',
      component: 'Select',
      componentProps: { placeholder: '请选择工序类型' },
      rules: [{ required: true, trigger: 'blur', message: '必填' }],
    },
    {
      field: 'code',
      label: '工序编码',
      component: 'Input',
      dynamicDisabled: ({ values }) => {
        const factoryArea = values?.factoryArea;
        return !state.factoryList.includes(factoryArea);
      },
      className: 'required-item',
      componentProps: {
        placeholder: '请输入工序编码',
      },
      // rules: [{ required: true, trigger: 'blur', message: '必填' }],
    },
    {
      field: 'status',
      label: '是否启用',
      i18nField: 'CommonCol.isEnable',
      component: 'Select',
      defaultValue: 1,
      componentProps: {
        placeholder: '请选择状态',
        options: [
          { fullName: t('common.enableText'), id: 1 },
          { fullName: t('common.disableText'), id: 2 },
        ],
      },
      rules: [{ required: true, trigger: 'change', message: '必填', type: 'number' }],
    },
    {
      field: 'remark',
      label: '备注',
      component: 'Textarea',
      componentProps: { placeholder: '请输入备注', row: 3 },
    },
  ];

  const organizeStore = useOrganizeStore();
  const getTitle = computed(() => (!state.dataForm.id ? t('common.newProcess') : t('common.modifiedProcess')));
  const emit = defineEmits(['register', 'reload']);
  const { createMessage } = useMessage();
  const [registerForm, { setFieldsValue, setProps, validate, resetFields, clearValidate, updateSchema }] = useForm({
    labelWidth: 120,
    schemas: schemas,
    layout: 'vertical',
    i18nConfig: {
      moduleCode: 'CommonCol',
      transferRange: ['label', 'placeholder'],
    },
  });
  const [registerModal, { closeModal, changeLoading, changeOkLoading }] = useModalInner(init);
  const processTypeList = ref<{ id: string }[]>([]);
  function init(data) {
    getNeedCodeFactory({}).then(({ code, data }) => {
      if (code === 200) {
        state.factoryList = data;
      }
    });
    if (data.id) {
      setProps({
        disabled: !hasBtnP('btn_edit'),
      });
    } else {
      setProps({
        disabled: !hasBtnP('btn_add'),
      });
    }
    resetFields();
    // state.dataForm.id = data?.record?.id;
    //更新下拉列表
    nextTick(() => {
      if (data.typeList) {
        updateSchema({
          field: 'type',
          componentProps: {
            options: data.typeList,
            onChange: e => {
              if (e === '2') {
                setFieldsValue({ processType: '4' });
                updateSchema({
                  field: 'processType',
                  componentProps: { options: processTypeList.value, disabled: true },
                });
              } else {
                setFieldsValue({ processType: '' });
                updateSchema({
                  field: 'processType',
                  componentProps: { options: processTypeList.value.filter(item => item.id !== '4'), disabled: false },
                });
              }
            },
          },
        });
      }
      if (data.processTypeList) {
        processTypeList.value = data.processTypeList;
        updateSchema({
          field: 'processType',
          componentProps: { options: data.processTypeList },
        });
      }
      // if (state.dataForm.id) {
      console.log(data.record);
      if (data.record) {
        data.record.type = data.record?.type?.toString() || ''; //转化为字符串 防止下拉无法渲染
        data.record.processType = data.record?.processType?.toString() || ''; //转化为字符串 防止下拉无法渲染
        data.record.mainProcess = data.record?.mainProcess?.toString() || ''; //转化为字符串 防止下拉无法渲染
      }
      state.dataForm = data.record;
      setFieldsValue(data.record); //设置表单值

      // organizeIdTree.value = data.record?.organizeIdTree?.split(',') || [];
      // } else {
      // organizeIdTree.value = [];
      // }
    });
  }

  //提交
  async function handleSubmit() {
    const values = await validate();
    if (!values) return;
    changeOkLoading(true);
    const query = {
      ...values,
      id: state.dataForm.id,
    };
    const { factoryArea } = values;
    if (state.factoryList.includes(factoryArea) && !values.code) {
      createMessage.error('请输入工序编码');
      return changeLoading(false);
    }

    const formMethod = state.dataForm.id ? updateProcess : addProcess;
    formMethod(query)
      .then(res => {
        createMessage.success(res.msg);
        changeOkLoading(false); //用于修改确认按钮的loading状态
        organizeStore.resetState();
        closeModal(); //关闭弹窗
        emit('reload');
      })
      .catch(() => {
        changeOkLoading(false);
      });
  }
</script>
<style lang="less" scoped>
  :deep(.required-item) {
    & > div > div > label::before {
      display: inline-block;
      margin-inline-end: 4px;
      color: #ed6f6f;
      font-size: 14px;
      font-family: SimSun, sans-serif;
      line-height: 1;
      content: '*';
    }
  }
</style>
