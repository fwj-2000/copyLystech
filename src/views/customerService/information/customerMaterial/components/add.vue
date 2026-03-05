<template>
  <BasicModal
    :showOkBtn="hasBtnP('btn_edit')"
    v-bind="$attrs"
    @register="registerModal"
    :minHeight="500"
    width="800px"
    :canFullscreen="true"
    :draggable="true"
    :title="getTitle"
    @ok="handleSubmit">
    <BasicForm @register="registerForm" :actionColOptions="{ span: 24 }">
      <template #OrgId>
        <lydcOrganizeSelect :disabled="!hasBtnP('btn_edit')" v-model:value="organizeIdTree" placeholder="请选择" auth @change="onOrganizeChange" />
      </template>
    </BasicForm>
  </BasicModal>
</template>

<script setup lang="ts">
  import { computed, reactive, ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm, FormSchema } from '/@/components/Form';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { debounce } from '/@/utils/debounce';
  import { addCustomerMaterial, updateCustomerMaterial, getCustomerMaterialById } from '/@/api/business/customerMaterial';
  import { useOrganizeStore } from '/@/store/modules/organize';
  import { getQuantitationApplyDetailByMaterial } from '/@/api/business/quantitation';
  import { getCustomerCodeByCode } from '/@/api/business/customerCode';
  import { usePermission } from '/@/hooks/web/usePermission';

  const organizeIdTree = ref([]);
  const { hasBtnP } = usePermission();
  interface State {
    dataForm: any;
  }

  const state = reactive<State>({
    dataForm: {},
  });

  const schemas: FormSchema[] = [
    {
      field: 'InsidePartNumber',
      label: '内部料号',
      component: 'Select',
      colProps: {
        span: 12,
      },
      componentProps: {
        showSearch: true,
        placeholder: '请输入内部料号',
        onSearch: value => {
          getDetailByInsidePartNumber(value);
        },
        onChange: async value => {
          let descOptions = (await getQuantitationApplyDetailByMaterial(value)).data;
          setFieldsValue({ ProductDesc: descOptions[0].ProductDesc });
        },
      },
      rules: [{ required: true, trigger: 'change', message: '必填' }],
    },
    {
      field: 'ProductDesc',
      label: '内部物料描述',
      component: 'Input',
      colProps: {
        span: 12,
      },
      componentProps: {
        disabled: true,
      },
    },
    {
      field: 'CustomerCode',
      label: '客户编码',
      component: 'Select',
      colProps: {
        span: 12,
      },
      componentProps: {
        placeholder: '请选择',
        showSearch: true,
        onSearch: value => {
          updateCustomerCode(value);
        },
      },
      rules: [{ required: true, trigger: 'change', message: '必填' }],
    },
    {
      field: 'CustomerMaterialCode',
      label: '客户物料编码',
      component: 'Input',
      colProps: {
        span: 12,
      },
      componentProps: { placeholder: '请输入' },
      rules: [{ required: true, trigger: 'blur', message: '必填' }],
    },
    {
      field: 'CustomerMaterialDesc',
      label: '客户物料描述',
      component: 'Input',
      colProps: {
        span: 12,
      },
      componentProps: { placeholder: '请输入' },
      rules: [{ required: true, trigger: 'blur', message: '必填' }],
    },
    {
      field: 'CustomerMaterialSpec',
      label: '客户物料规格',
      component: 'Input',
      colProps: {
        span: 12,
      },
      componentProps: { placeholder: '请输入' },
      rules: [{ required: true, trigger: 'blur', message: '必填' }],
    },
    {
      field: 'Weight',
      label: '单重',
      component: 'Input',
      colProps: {
        span: 12,
      },
      componentProps: { placeholder: '请输入' },
      rules: [{ required: true, trigger: 'blur', message: '必填' }],
    },
    {
      field: 'WeightUnit',
      label: '重量单位',
      component: 'Input',
      colProps: {
        span: 12,
      },
      componentProps: {
        placeholder: '请输入',
      },
      rules: [{ required: true, trigger: 'blur', message: '必填' }],
    },
    // {
    //     field: 'OrgId',
    //     label: '所属组织',
    //     component: 'TreeSelect',
    //     slot: 'OrgId',
    //     rules: [{ required: true, trigger: 'change', message: '必填' }],
    // },
    {
      field: 'ISOCode',
      label: '币别',
      component: 'Select',
      colProps: {
        span: 12,
      },
      componentProps: {
        showSearch: true,
        placeholder: '请选择',
      },
    },
    {
      field: 'EffectiveDate',
      label: '生效日期',
      component: 'DatePicker',
      //defaultValue: new Date(),
      colProps: {
        span: 12,
      },
      componentProps: { placeholder: '请选择', format: 'date|YYYY-MM-DD HH:mm:ss' },
    },
    {
      field: 'ExpirationDate',
      label: '失效日期',
      component: 'DatePicker',
      colProps: {
        span: 12,
      },
      // defaultValue: new Date(),
      componentProps: { placeholder: '请选择', format: 'date|YYYY-MM-DD HH:mm:ss' },
    },
    {
      field: 'CustomerService',
      label: '客服',
      component: 'TreeSelect',
      slot: 'OrgId',
      colProps: {
        span: 12,
      },
      componentProps: { placeholder: '请输入', row: 3 },
    },
    {
      field: 'Remark',
      label: '备注',
      component: 'Textarea',
      colProps: {
        span: 12,
      },
      componentProps: { placeholder: '请输入', row: 3 },
    },
  ];

  const organizeStore = useOrganizeStore();
  const getTitle = computed(() => (!state.dataForm.Id ? t('common.addText') : t('common.editText')));
  const emit = defineEmits(['register', 'reload']);
  const { createMessage } = useMessage();
  const { t } = useI18n();
  const [registerForm, { setFieldsValue, setProps, validate, resetFields, clearValidate, updateSchema }] = useForm({
    labelWidth: 140,
    schemas: schemas,
    layout: 'vertical',
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
    //重置表单值
    resetFields();
    state.dataForm.Id = data.id;
    if (data.industryTypeList)
      updateSchema([
        { field: 'ISOCode', componentProps: { options: data.industryTypeList } },
        { field: 'InsidePartNumber', componentProps: { options: data.insidePartNumberList } },
        { field: 'CustomerCode', componentProps: { options: data.customerCodeList } },
        // { field: 'EffectiveDate', defaultValue: data.dateNow }
      ]);
    if (state.dataForm.Id) {
      changeLoading(true);
      getCustomerMaterialById(state.dataForm.Id).then(res => {
        state.dataForm = res.data;
        organizeIdTree.value = res.data.organizeIdTree || [];
        setFieldsValue(res.data); //设置表单值
        changeLoading(false); //用于修改Modal的loading状态
      });
    } else {
      setFieldsValue({ organizeId: data.organizeId || '' });
      organizeIdTree.value = data.organizeIdTree || [];
      changeLoading(false);
    }
  }
  //提交
  async function handleSubmit() {
    const values = await validate();
    if (!values) return;
    changeOkLoading(true);
    const query = {
      ...values,
      id: state.dataForm.Id,
      organizeIdTree: organizeIdTree.value,
    };
    const formMethod = state.dataForm.Id ? updateCustomerMaterial : addCustomerMaterial;
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

  function onOrganizeChange(val) {
    setFieldsValue({ OrgId: !val || !val.length ? '' : val[val.length - 1] });
    if (!val || !val.length) return;
    clearValidate('OrgId');
  }

  //通过内部料号去做模糊查询，更新下拉列表
  const getDetailByInsidePartNumber = debounce(async value => {
    const optionList = await getQuantitationApplyDetailByMaterial(value);
    const optionPartNumber = optionList.data.map(i => {
      return {
        id: i.InsidePartNumber,
        fullName: i.InsidePartNumber,
      };
    });
    updateSchema([
      {
        field: 'InsidePartNumber',
        componentProps: {
          options: optionPartNumber,
        },
      },
    ]);
  }, 300);

  //通过客户代码去做模糊查询，更新下拉列表
  const updateCustomerCode = debounce(async value => {
    const optionList = await getCustomerCodeByCode(value);
    const optionCustomerCode = optionList.data.map(i => {
      return {
        id: i.customerCode,
        fullName: i.customerCode + '(' + i.name + ')',
      };
    });
    updateSchema([
      {
        field: 'CustomerCode',
        componentProps: {
          options: optionCustomerCode,
        },
      },
    ]);
  }, 300);
</script>
