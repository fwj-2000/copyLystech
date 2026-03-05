<template>
  <BasicModal
    :width="400"
    v-bind="$attrs"
    @register="registerModal"
    :title="type === 'add' ? t('common.add2Text') : t('common.editText')"
    showOkBtn
    @ok="handleSubmit">
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm, FormSchema } from '/@/components/Form';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useBaseStore } from '/@/store/modules/base';
  import { takeleaveEdit } from '/@/api/productionDeal/offDutyPersonnel';
  import { useI18n } from '/@/hooks/web/useI18n';

  const baseStore = useBaseStore();
  const { createMessage } = useMessage();
  const emit = defineEmits(['register', 'reload']);
  const { t } = useI18n();

  const [registerModal, { closeModal, changeLoading }] = useModalInner(init);

  const schemas: FormSchema[] = [
    {
      field: 'takeLeaveType',
      label: '类型',
      i18nField: 'takeLeaveTypeName',
      component: 'ApiSelect',
      componentProps: {
        placeholder: '请选择类型',
        api: () => {
          return baseStore.getDictionaryData('takeLeaveType');
        },
        labelField: 'fullName',
        valueField: 'enCode',
        filterOption: false,
        notFoundContent: null,
        immediate: true,
      },
      required: true,
    },
    {
      field: 'pickerVal',
      label: t('dict.OffDutyPersonnelColumn.leaveTime'),
      component: 'DateRange',
      required: true,
      componentProps: {
        format: 'YYYY-MM-DD',
      },
    },
    {
      field: 'classes',
      label: '班次',
      component: 'ApiSelect',
      componentProps: {
        placeholder: '请选择班次',
        api: () => {
          return baseStore.getDictionaryData('ClassesName');
        },
        labelField: 'fullName',
        valueField: 'enCode',
        filterOption: false,
        notFoundContent: null,
        immediate: true,
      },
      required: true,
    },
    {
      field: 'userIds',
      label: '人员',
      component: 'CustomUserSelect',
      componentProps: {
        placeholder: '人员',
        multiple: true,
      },
      required: true,
      i18nField: 'userId',
    },

    {
      field: 'remark',
      label: '备注:',
      component: 'Input',
      componentProps: {
        placeholder: '请输入内容',
        filterOption: false,
        notFoundContent: null,
        immediate: true,
      },
    },
  ];

  const type = ref('');
  const id = ref('');

  const [registerForm, { setFieldsValue, resetFields, getFieldsValue, validateFields, setProps }] = useForm({
    schemas: schemas,
    layout: 'vertical',
    fieldMapToTime: [['pickerVal', ['startTime', 'endTime']]],
    i18nConfig: {
      moduleCode: 'OffDutyPersonnelColumn',
      transferRange: ['placeholder', 'label'],
    },
  });

  function init({ handleType, row }) {
    type.value = handleType;
    resetFields();
    if (handleType === 'edit') {
      id.value = row.id;
      setFieldsValue({
        ...row,
        userIds: row.userIds.split(','),
        pickerVal: [row.startTime, row.endTime],
        classes: row.classes.toString(),
        takeLeaveType: row.takeLeaveType.toString(),
      }); //设置表单值
    }
  }

  //提交
  async function handleSubmit() {
    const values = await validateFields();
    if (!values) return;
    let formValue = getFieldsValue();
    if (type.value === 'edit') {
      formValue.id = id.value;
    }
    changeLoading(true);
    const { code, msg } = await takeleaveEdit({
      ...formValue,
      userIds: formValue.userIds.join(','),
    }).finally(() => {
      changeLoading(false);
    });
    if (code === 200) {
      createMessage.success(msg);
      emit('reload');
      closeModal();
    }
  }
</script>
