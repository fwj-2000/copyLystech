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
  import { getConfigTypes } from '/@/api/business/member';
  import { insertFromSap } from '/@/api/basicData/customer';

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
        placeholder: '请选择主要制程',
      },
      rules: [{ required: true, trigger: 'change', message: '必填', type: 'number' }],
    },
    {
      field: 'codes',
      i18nField: 'code',
      label: 'SAP代码',
      component: 'Checkbox',
      defaultValue: ['1010', '1020', '1030', '6040'],
      componentProps: {
        options: [
          { fullName: '1010', id: '1010' },
          { fullName: '1020', id: '1020' },
          { fullName: '1030', id: '1030' },
          { fullName: '6040', id: '6040' },
        ],
      },
    },
  ];

  const getTitle = computed(() => (state.dataForm.id ? t('common.editText') : t('common.addText')));
  const emit = defineEmits(['register', 'reload']);
  const { createMessage } = useMessage();
  const { t } = useI18n();
  const [registerForm, { setFieldsValue, setProps, validate, resetFields, updateSchema }] = useForm({
    labelWidth: 100,
    schemas: schemas,
    i18nConfig: {
      moduleCode: 'CustomerColumn',
      transferRange: ['label', 'placeholder'],
      en_US: {
        labelWidth: 120,
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

    nextTick(() => {
      //更新下拉列表
      // if (data.industryTypeList) updateSchema({ field: 'harhor', componentProps: { options: data.industryTypeList } });
      // if (data.industryCustomerType)
      //   updateSchema({
      //     field: 'terminalCustomerCode',
      //     componentProps: { options: data.industryCustomerType },
      //   });
      // if (data.industryFilingsApply)
      //   updateSchema({
      //     field: 'shipmentMode',
      //     componentProps: { options: data.industryFilingsApply },
      //   });
      if (data.optionsProcessList) {
        updateSchema({
          field: 'mainProcess',
          componentProps: { options: data.optionsProcessList },
        });
      }
    });
    // if (state.dataForm.id) {
    //   changeLoading(true);
    //   getCustomerCodeById(state.dataForm.id).then(res => {
    //     const data = res.data;
    //     state.dataForm = data;
    //     setFieldsValue(data); //设置表单值
    //     changeLoading(false); //用于修改Modal的loading状态
    //   });
    // }
  }

  //提交
  async function handleSubmit() {
    const values = await validate();
    if (!values) return;
    changeOkLoading(true);
    const query = {
      ...values,
    };

    console.log(query);
    // return
    insertFromSap(query)
      .then(({ code, msg }) => {
        // console.log(res);
        if (code === 200) {
          createMessage.success(msg);
          emit('reload');
          closeModal();
        }
      })
      .finally(() => {
        changeOkLoading(false); //用于修改确认按钮的loading状态
      });
    // const formMethod = state.dataForm.id ? updateCustomerCode : addCustomerCode;
    // formMethod(query)
    //   .then(res => {
    //     createMessage.success(res.msg);
    //     changeOkLoading(false); //用于修改确认按钮的loading状态
    //     closeModal(); //关闭弹窗
    //     emit('reload');
    //   })
    //   .catch(() => {
    //     changeOkLoading(false);
    //   });
  }
</script>
