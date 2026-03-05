<template>
  <BasicModal :showOkBtn="hasBtnP('btn_edit')" v-bind="$attrs" @register="registerModal" :title="getTitle" showOkBtn @ok="handleSubmit">
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>

<script setup lang="ts">
  import { computed, reactive } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm, FormSchema } from '/@/components/Form';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { getEmployeeInfoById, updateEmployeeInfoV2, addEmployeeInfo } from '/@/api/hr/training/employee';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { usePermission } from '/@/hooks/web/usePermission';
  import dayjs from 'dayjs';
  const { hasBtnP } = usePermission();
  interface State {
    dataForm: any;
  }

  const state = reactive<State>({
    dataForm: {},
  });

  const { t } = useI18n();

  const schemas: FormSchema[] = [
    {
      field: 'trainerWorkNo',
      label: '员工工号',
      component: 'Input',
      componentProps: { placeholder: '请输入', disabled: true },
      rules: [{ required: true, trigger: 'blur', message: t('common.required') }],
    },
    {
      field: 'trainerName',
      label: '员工姓名',
      component: 'Input',
      componentProps: { placeholder: '请输入' },
      rules: [{ required: true, trigger: 'blur', message: t('common.required') }],
    },
    {
      field: 'recordGrouping',
      label: '档案分组',
      component: 'Input',
      componentProps: { placeholder: '请输入' },
      rules: [{ required: true, trigger: 'blur', message: t('common.required') }],
    },
    {
      field: 'factoryName',
      label: '厂区',
      component: 'Input',
      componentProps: { placeholder: '请输入' },
      rules: [{ required: true, trigger: 'blur', message: t('common.required') }],
    },
    {
      field: 'attendanceShift',
      label: '打卡班次',
      component: 'Input',
      componentProps: { placeholder: '请输入' },
      rules: [{ required: true, trigger: 'blur', message: t('common.required') }],
    },
    {
      field: 'employmentDate',
      label: '入职日期',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择',
        row: 3,
        onChange: e => {
          setFieldsValue({
            ValidityDateEnd: dayjs(e).tz().endOf('month').valueOf(),
          });
        },
      },
      rules: [{ required: true, trigger: 'change', message: t('common.required') }],
    },
    {
      field: 'officeTrainingCoordinatorUserId',
      label: '办公培训导师',
      component: 'UserSelect',
      i18nField: 'officeTrainingCoordinatorName',
      componentProps: {
        multiple: false,
        fieldNames: { value: 'fullname' },
      },
      rules: [{ required: true, trigger: 'blur', message: t('common.required') }],
    },
    {
      field: 'workshopTrainingCoordinatorUserId',
      label: '车间培训导师',
      component: 'UserSelect',
      i18nField: 'workshopTrainingCoordinatorName',
      componentProps: {
        multiple: false,
        fieldNames: { value: 'fullname' },
      },
      rules: [{ required: true, trigger: 'blur', message: t('common.required') }],
    },
    {
      field: 'teamLevelTrainingCoordinatorUserId',
      label: '班组培训导师',
      component: 'UserSelect',
      i18nField: 'teamLevelTrainingCoordinatorName',
      componentProps: {
        multiple: false,
        fieldNames: { value: 'fullname' },
      },
      rules: [{ required: true, trigger: 'blur', message: t('common.required') }],
    },
  ];

  const getTitle = computed(() => (state.dataForm.id ? t('dict.EmployeeTrain.EditTrainDataText') : t('dict.EmployeeTrain.AddTrainDataText')));
  const emit = defineEmits(['register', 'reload']);
  const { createMessage } = useMessage();

  const [registerForm, { setFieldsValue, setProps, validate, resetFields }] = useForm({
    labelWidth: 100,
    schemas: schemas,
    i18nConfig: {
      moduleCode: 'EmployeeTrainingColumn',
      transferRange: ['label', 'placeholder'],
    },
  });
  const [registerModal, { closeModal, changeLoading, changeOkLoading }] = useModalInner(init);

  function init(data) {
    if (data.id) {
      setProps({
        disabled: !hasBtnP('btn_edit'),
      });
    } else {
      // setProps({
      //   disabled: !hasBtnP('btn_add'),
      // });
    }
    resetFields();
    state.dataForm.id = data.id;

    if (state.dataForm.id) {
      changeLoading(true);
      getEmployeeInfoById(state.dataForm.id).then(res => {
        const data = res.data;
        state.dataForm = data;
        setFieldsValue(data); //设置表单值
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
    const formMethod = state.dataForm.id ? updateEmployeeInfoV2 : addEmployeeInfo;
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
