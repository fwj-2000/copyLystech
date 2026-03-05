<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :showOkBtn="hasBtnP('btn_edit')" :title="getTitle" :draggable="true" showOkBtn @ok="handleSubmit">
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>

<script setup lang="ts">
  import { computed, nextTick, reactive } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, FormSchema, useForm } from '/@/components/Form';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { addCustomerCode, getCustomerCodeById, updateCustomerCode } from '/@/api/business/customerCode';
  import { getHarhorList } from '/@/api/basicData/harhor';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { debounce } from '/@/utils/debounce';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { useBaseStore } from '/@/store/modules/base';

  const baseStore = useBaseStore();
  const { t } = useI18n();
  const { hasBtnP } = usePermission();

  interface State {
    dataForm: any;
  }

  const state = reactive<State>({
    dataForm: {},
  });

  const schemas: FormSchema[] = [
    {
      field: 'mainProcess',
      label: '主要制程',
      component: 'Select',
      componentProps: {
        showSearch: true,
        placeholder: '请选择',
      },
      rules: [{ required: true, trigger: 'change', message: t('common.required'), type: 'number' }],
    },
    {
      field: 'code',
      label: 'SAP代码',
      component: 'Input',
      componentProps: { placeholder: '请输入' },
      rules: [{ required: true, trigger: 'change', message: t('common.required') }],
    },
    {
      field: 'customerCode',
      label: '直接客户代码',
      component: 'Input',
      componentProps: {
        placeholder: '自动生成',
        disabled: true,
        i18nField: 'CommonCol.fromSys',
      },
    },
    {
      field: 'name',
      label: '直接客户简称',
      component: 'Input',
      componentProps: { placeholder: '请输入' },
      rules: [{ required: true, trigger: 'blur', message: t('common.required') }],
    },
    {
      field: 'fullName',
      label: '直接客户全称',
      component: 'Input',
      componentProps: { placeholder: '请输入' },
      rules: [{ required: true, trigger: 'blur', message: t('common.required') }],
    },
    {
      field: 'filingLanguage',
      i18nField: 'filingLanguageName',
      label: '备案语言',
      component: 'ApiSelect',
      componentProps: {
        api: () => baseStore.getDictionaryData('FilingLanguage'),
        placeholder: '备案语言',
        showSearch: false,
        resultField: '',
        labelField: 'fullName',
        valueField: 'enCode',
      },
      rules: [{ required: true, trigger: 'blur', message: t('common.required') }],
    },
    {
      field: 'harhor',
      label: '口岸',
      component: 'Select',
      componentProps: {
        showSearch: true,
        placeholder: '请选择口岸',
      },
    },
    {
      field: 'customerService',
      label: '客服',
      component: 'Input',
      componentProps: { placeholder: '请输入' },
      //rules: [{ required: true, trigger: 'blur', message: '必填' }],
    },
    {
      field: 'shipmentMode',
      label: '出货方式',
      component: 'Select',
      componentProps: { placeholder: '请输入' },
    },
    // {
    //   label: '终端客户代码',
    //   field: 'terminalCustomerCode',
    //   component: 'Select',
    //   rules: [{ required: true, trigger: 'change', message: '必填' }],
    // },
    // {
    //   label: '终端业务名称',
    //   field: 'terminalBusiness',
    //   component: 'Input',
    //   componentProps: {
    //     placeholder: '请输入'
    //   },
    //   rules: [{ required: true, trigger: 'blur', message: '必填' }],
    // },
    {
      field: 'region',
      label: '客户所属地区',
      component: 'Input',
      componentProps: { placeholder: '请输入' },
    },
    {
      field: 'status',
      label: '是否启用',
      component: 'Select',
      defaultValue: 1,
      componentProps: {
        placeholder: '请选择是否启用',
        options: [
          { fullName: t('common.yes'), id: 1 },
          { fullName: t('common.no'), id: 2 },
        ],
      },
      rules: [{ required: true, trigger: 'change', message: t('common.required'), type: 'number' }],
    },
    {
      field: 'remark',
      label: '备注',
      component: 'Textarea',
      componentProps: { placeholder: '请输入', rows: 3 },
    },
  ];

  const getTitle = computed(() => (state.dataForm.id ? t('common.editText') : t('common.addText')));
  const emit = defineEmits(['register', 'reload']);
  const { createMessage } = useMessage();
  const [registerForm, { setFieldsValue, setProps, validate, resetFields, updateSchema }] = useForm({
    labelWidth: 100,
    schemas: schemas,
    i18nConfig: {
      moduleCode: 'CustomerColumn',
      transferRange: ['label', 'placeholder'],
      en_US: {
        labelWidth: 150,
      },
    },
  });
  const [registerModal, { closeModal, changeLoading, changeOkLoading }] = useModalInner(init);

  function init(data) {
    if (data.id) {
      setProps({
        disabled: !hasBtnP('btn_edit'),
      });
    } else {
      setProps({
        disabled: !hasBtnP('btn_add'),
      });
    }
    resetFields(); //刷新表单
    state.dataForm.id = data.id;

    nextTick(() => {
      //更新下拉列表
      if (data.industryTypeList) updateSchema({ field: 'harhor', componentProps: { options: data.industryTypeList } });
      if (data.industryCustomerType)
        updateSchema({
          field: 'terminalCustomerCode',
          componentProps: { options: data.industryCustomerType },
        });
      if (data.industryFilingsApply)
        updateSchema({
          field: 'shipmentMode',
          componentProps: { options: data.industryFilingsApply },
        });
      if (data.optionsProcessList) console.log(123123);
      updateSchema({
        field: 'mainProcess',
        componentProps: { options: data.optionsProcessList },
      });
    });
    if (state.dataForm.id) {
      changeLoading(true);
      getCustomerCodeById(state.dataForm.id).then(res => {
        const data = res.data;
        state.dataForm = {
          ...data,
          filingLanguage: data.filingLanguage + '',
        };
        setFieldsValue(state.dataForm); //设置表单值
        changeLoading(false); //用于修改Modal的loading状态
      });
    }
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
    const formMethod = state.dataForm.id ? updateCustomerCode : addCustomerCode;
    formMethod(query)
      .then(res => {
        createMessage.success(res.msg);
        changeOkLoading(false); //用于修改确认按钮的loading状态
        closeModal(); //关闭弹窗
        emit('reload');
      })
      .catch(() => {
        changeOkLoading(false);
      });
  }

  const searchHarhor = debounce(async value => {
    const harhorList = (await getHarhorList(value)).data;
    const harhorOptions = harhorList
      ? harhorList.map(i => {
          return {
            id: i.Name,
            fullName: i.Name,
          };
        })
      : [];
    updateSchema([
      {
        field: 'harhor',
        componentProps: {
          options: harhorOptions,
        },
      },
    ]);
  }, 500);
</script>
