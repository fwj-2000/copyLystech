<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" showOkBtn destroyOnClose @ok="handleSubmit">
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>

<script setup lang="ts">
  import { computed, reactive } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm, FormSchema } from '/@/components/Form';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { addPackLabelInfo, updatePackLabelInfo, getPackLabelInfoById } from '/@/api/productionDeal/packLabelInfo';
  import { getEnablePartNumberApply } from '/@/api/basicData/productCodeApply';
  import { getMaterialCodeList } from '/@/api/finance/materialPrice';
  import { useBaseStore } from '/@/store/modules/base';
  import { useI18n } from '/@/hooks/web/useI18n';
  const baseStore = useBaseStore();
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
      required: true,
      componentProps: {
        api: getEnablePartNumberApply,
        placeholder: '请选择内部料号',
        showSearch: true,
        memoInputVal: true,
        memoInputVagueVal: true,
        apiSearch: {
          show: true,
          searchName: 'keyword',
        },
        resultField: 'data.list',
        labelField: 'InsidePartNumber',
        valueField: 'InsidePartNumber',
        filterOption: false,
        notFoundContent: null,
        immediate: true,
      },
      colProps: {
        span: 12,
      },
    },
    // {
    //   field: 'PackType',
    //   label: '包装类型',
    //   component: 'ApiSelect',
    //   required: true,
    //   componentProps: {
    //     api: async () => {
    //       return {
    //         data: await baseStore.getDictionaryData('PackType'),
    //       };
    //     },
    //     resultField: 'data',
    //     labelField: 'fullName',
    //     valueField: 'enCode',
    //     showSearch: false,
    //     filterOption: false,
    //     defaultFirstOption: true,
    //     immediate: true,
    //     onChange: e => {
    //       if (e === '1') {
    //         resetSchema(schemas);
    //       } else {
    //         const list = schemas.filter(item => item.field !== 'InQuantity');
    //         resetSchema(list);
    //       }
    //     },
    //     afterFetch: data => {
    //       console.log(data, 'afterfetch++++++');
    //     },
    //   },
    //   colProps: {
    //     span: 12,
    //   },
    // },
    {
      field: 'PackType',
      label: '包装类型',
      component: 'Select',
      required: true,
      componentProps: {
        // api: async () => {
        //   return {
        //     data: await baseStore.getDictionaryData('PackType'),
        //   };
        // },
        // resultField: 'data',
        // showSearch: false,
        // filterOption: false,
        // defaultFirstOption: true,
        // immediate: true,
        // onChange: e => {
        //   if (e === '1') {
        //     resetSchema(schemas);
        //   } else {
        //     const list = schemas.filter(item => item.field !== 'InQuantity');
        //     resetSchema(list);
        //   }
        // },
        // afterFetch: data => {
        //   console.log(data, 'afterfetch++++++');
        // },
      },
      colProps: {
        span: 12,
      },
    },
    {
      field: 'APN',
      label: 'APN',
      component: 'Input',
      componentProps: { placeholder: '请输入' },
      colProps: {
        span: 12,
      },
    },
    {
      field: 'PeQuantity',
      label: 'PE数量',
      component: 'InputNumber',
      componentProps: { placeholder: '请输入' },
      required: true,
      colProps: {
        span: 12,
      },
    },
    {
      field: 'InQuantity',
      label: 'In数量',
      component: 'InputNumber',
      componentProps: { placeholder: '请输入' },
      required: true,
      colProps: {
        span: 12,
      },
      ifShow: ({ values }) => {
        return values.PackType === '1';
      },
    },
    {
      field: 'OutQuantity',
      label: 'Out数量',
      component: 'InputNumber',
      componentProps: { placeholder: '请输入', min: 1 },
      required: true,
      colProps: {
        span: 12,
      },
    },
  ];

  const getTitle = computed(() => (state.dataForm.Id ? t('common.editText') : t('common.addText')));

  const emit = defineEmits(['reload']);
  const { createMessage } = useMessage();
  const [registerForm, { setFieldsValue, getFieldsValue, validate, resetFields, updateSchema, resetSchema }] = useForm({
    labelWidth: 160,
    schemas: schemas,
    layout: 'vertical',
  });
  const [registerModal, { closeModal, changeLoading, changeOkLoading }] = useModalInner(init);

  const setPackType = async () => {
    const res = await baseStore.getDictionaryData('PackType');
    const list = (res as any).map(item => {
      return {
        id: item.enCode,
        fullName: item.fullName,
      };
    });
    updateSchema({
      field: 'PackType',
      componentProps: {
        options: list,
      },
    });
    if (!state.dataForm.Id) {
      setFieldsValue({ PackType: list[0].id });
    }
  };

  async function init(data) {
    resetFields();
    state.dataForm.Id = data.id;
    await setPackType();

    if (data.packingType) {
      updateSchema([
        {
          field: 'PackingType',
          componentProps: {
            options: data.packingType,
            fieldNames: { value: 'enCode' },
          },
        },
      ]);
    }
    if (state.dataForm.Id) {
      changeLoading(true);
      getPackLabelInfoById(state.dataForm.Id).then(({ data }) => {
        state.dataForm = data;
        setFieldsValue({ ...data, PackType: data.PackType.toString() }); //设置表单值
        changeLoading(false); //用于修改Modal的loading状态
      });
    }
  }

  // function transformSchemas(cols: FormSchema[], businessCode: string, reWrite: object) {
  //   cols.forEach(col => {
  //     // 翻译label
  //     let key = `dict.${businessCode}.${reWrite[col.field] ? reWrite[col.field] : col.field}`;
  //     let tranTitle = t(key);
  //     col.label = isEmpty(tranTitle) ? col.label : tranTitle;
  //     // 翻译componentProps
  //     if (col.componentProps) {
  //       if (col.componentProps.disabled) {
  //         col.componentProps.placeholder = t('common.nonEditable');
  //         return;
  //       }
  //       let key = `common.${['TreeSelect', 'Select'].includes(col.component) ? t('selectPlaceholder') : t('inputPlaceholder')}`;
  //       let tranPlaceholder = t(key);
  //       col.componentProps.placeholder = isEmpty(tranPlaceholder) ? col.componentProps.placeholder : tranPlaceholder;
  //     }
  //     // 翻译rules
  //     if (col.rules) {
  //       col.rules.forEach(rule => {
  //         //必填
  //         if (rule.required) {
  //           let key = `common.required`;
  //           let tranRule = t(key);
  //           rule.message = isEmpty(tranRule) ? rule.message : tranRule;
  //         }
  //       });
  //     }
  //   });
  // }

  // transformSchemas(schemas, 'PackLabelInfoColumn', { OrgId: 'OrgName' });

  function isMultiple(num, base) {
    return num % base === 0;
  }

  const checkValue = values => {
    const { PackType, PeQuantity, InQuantity, OutQuantity } = values;

    if (PackType === '1' && InQuantity !== 0 && !isMultiple(OutQuantity, InQuantity)) {
      createMessage.warning('OUT数量需是IN数量的倍数');
      return false;
    }

    if (PackType !== '1' && !isMultiple(OutQuantity, PeQuantity)) {
      createMessage.warning('OUT数量需是PE数量的倍数');
      return false;
    }

    return true;
  };

  //提交
  async function handleSubmit() {
    const values = await validate();
    if (!values) return;
    if (!checkValue(values)) return;
    changeOkLoading(true);
    const query = {
      ...values,
      id: state.dataForm.Id,
    };
    if (values.PackType !== '1') {
      delete query.InQuantity;
    }
    const formMethod = state.dataForm.Id ? updatePackLabelInfo : addPackLabelInfo;
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
