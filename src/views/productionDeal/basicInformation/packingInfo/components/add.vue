<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" showOkBtn @ok="handleSubmit">
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>

<script setup lang="ts">
  import { computed, reactive } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm, FormSchema } from '/@/components/Form';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { addPackingInfo, updatePackingInfo, getPackingInfoById } from '/@/api/productionDeal/packingInfo';
  import { getMaterialCodeList } from '/@/api/finance/materialPrice';
  import { getLabelTemplateList } from '/@/api/productionDeal/labelTemplate';
  import { isEmpty } from '/@/utils/is';
  import { useI18n } from '/@/hooks/web/useI18n';

  interface State {
    dataForm: any;
  }

  const { t } = useI18n();

  const state = reactive<State>({
    dataForm: {},
  });

  const schemas: FormSchema[] = [
    {
      field: 'InnerMaterialCode',
      label: '内部料号',
      component: 'ApiSelect',
      rules: [{ required: true, trigger: 'change', message: '必填' }],
      componentProps: {
        api: getMaterialCodeList,
        placeholder: '请选择内部料号',
        showSearch: true,
        apiSearch: {
          show: true,
          searchName: 'keyword',
        },
        resultField: 'data',
        labelField: 'materialCode',
        valueField: 'materialCode',
        filterOption: false,
        notFoundContent: null,
        immediate: true,
      },
      colProps: {
        span: 12,
      },
    },
    {
      field: 'PackingType',
      label: '包装类型',
      component: 'Select',
      componentProps: {
        showSearch: true,
        placeholder: '请选择',
      },
      rules: [{ required: true, trigger: 'change', message: '必填' }],
      colProps: {
        span: 12,
      },
    },
    {
      field: 'Quantity',
      label: '数量',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入',
      },
      rules: [{ required: true, trigger: 'change', message: '必填' }],
      colProps: {
        span: 12,
      },
    },
    {
      field: 'DateCode',
      label: '生产日期',
      component: 'Input',
      componentProps: { placeholder: '请输入' },
      rules: [{ required: true, trigger: 'blur', message: '必填' }],
      colProps: {
        span: 12,
      },
    },
    {
      field: 'LotNo',
      label: '批次规格',
      component: 'Input',
      componentProps: { placeholder: '请输入' },
      rules: [{ required: true, trigger: 'blur', message: '必填' }],
      colProps: {
        span: 12,
      },
    },
    {
      field: 'LabelTemplateId',
      label: '标签模板',
      component: 'ApiSelect',
      rules: [{ required: true, trigger: 'change', message: '必填' }],
      componentProps: {
        api: getLabelTemplateList,
        placeholder: '请选择标签模板',
        showSearch: true,
        apiSearch: {
          show: true,
          searchName: 'labelName',
        },
        resultField: 'data',
        labelField: 'LabelName',
        valueField: 'Id',
        filterOption: false,
        notFoundContent: null,
        immediate: true,
      },
      colProps: {
        span: 12,
      },
    },
    {
      field: 'PaperBoxSpec',
      label: '纸盒规格',
      component: 'Input',
      componentProps: { placeholder: '请输入' },
      rules: [{ required: true, trigger: 'blur', message: '必填' }],
      colProps: {
        span: 12,
      },
    },
    {
      field: 'PaperCartonSpec',
      label: '纸箱规格',
      component: 'Input',
      componentProps: { placeholder: '请输入' },
      rules: [{ required: true, trigger: 'blur', message: '必填' }],
      colProps: {
        span: 12,
      },
    },
    {
      field: 'Status',
      label: '是否启用',
      component: 'Select',
      defaultValue: 1,
      componentProps: {
        placeholder: '请选择',
        options: [
          { fullName: t('common.valid'), id: 1 },
          { fullName: t('common.invalid'), id: 2 },
        ],
      },
      rules: [{ required: true, trigger: 'change', message: '必填', type: 'number' }],
      colProps: {
        span: 12,
      },
    },
  ];

  const getTitle = computed(() => (!state.dataForm.Id ? t('common.addText') : t('common.editText')));
  const emit = defineEmits(['register', 'reload']);
  const { createMessage } = useMessage();
  const [registerForm, { setFieldsValue, validate, resetFields, updateSchema }] = useForm({
    labelWidth: 160,
    schemas: schemas,
    layout: 'vertical',
  });
  const [registerModal, { closeModal, changeLoading, changeOkLoading }] = useModalInner(init);

  function init(data) {
    resetFields();
    state.dataForm.Id = data.id;
    if (data.packingType)
      updateSchema([
        {
          field: 'PackingType',
          componentProps: {
            options: data.packingType,
            fieldNames: { value: 'enCode' },
          },
        },
      ]);
    if (state.dataForm.Id) {
      changeLoading(true);
      getPackingInfoById(state.dataForm.Id).then(res => {
        const data = res.data;
        state.dataForm = data;
        setFieldsValue(data); //设置表单值
        changeLoading(false); //用于修改Modal的loading状态
      });
    }
  }

  function transformSchemas(cols: FormSchema[], businessCode: string, reWrite: object) {
    cols.forEach(col => {
      // 翻译label
      let key = `dict.${businessCode}.${reWrite[col.field] ? reWrite[col.field] : col.field}`;
      let tranTitle = t(key);
      col.label = isEmpty(tranTitle) ? col.label : tranTitle;
      // 翻译componentProps
      if (col.componentProps) {
        if (col.componentProps.disabled) {
          col.componentProps.placeholder = t('common.nonEditable');
          return;
        }
        let key = `common.${['TreeSelect', 'Select'].includes(col.component) ? t('selectPlaceholder') : t('inputPlaceholder')}`;
        let tranPlaceholder = t(key);
        col.componentProps.placeholder = isEmpty(tranPlaceholder) ? col.componentProps.placeholder : tranPlaceholder;
      }
      // 翻译rules
      if (col.rules) {
        col.rules.forEach(rule => {
          //必填
          if (rule.required) {
            let key = `common.required`;
            let tranRule = t(key);
            rule.message = isEmpty(tranRule) ? rule.message : tranRule;
          }
        });
      }
    });
  }

  transformSchemas(schemas, 'PackingInfoColumn', { OrgId: 'OrgName' });

  //提交
  async function handleSubmit() {
    const values = await validate();
    if (!values) return;
    changeOkLoading(true);
    const query = {
      ...values,
      id: state.dataForm.Id,
    };
    const formMethod = state.dataForm.Id ? updatePackingInfo : addPackingInfo;
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
</script>
