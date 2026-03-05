<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" :draggable="true" showOkBtn @ok="handleSubmit">
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>

<script setup lang="ts">
  import { computed, reactive } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm, FormSchema } from '/@/components/Form';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { postInitiateRollbackOrReSign } from '/@/api/hr/training/employee';
  import { useI18n } from '/@/hooks/web/useI18n';

  interface State {
    dataForm: any;
  }

  const state = reactive<State>({
    dataForm: {
      dataList: [],
    },
  });

  const { t } = useI18n();

  const schemas: FormSchema[] = [
    {
      component: 'Radio',
      componentProps: {
        options: [
          {
            fullName: t('dict.EmployeeTrain.ResignThisNodeText'),
            id: 1,
          },
          {
            fullName: t('dict.EmployeeTrain.ReAduditText'),
            id: 2,
          },
        ],
      },
      field: 'rollbackType',
      label: t('dict.EmployeeTrain.RollbackTypeText'),
    },
    {
      component: 'Select',
      componentProps: {
        allowClear: true,
        filterOption: true,
        options: [
          {
            fullName: t('dict.EmployeeTrain.AuditNode.1'),
            id: 1,
          },
          {
            fullName: t('dict.EmployeeTrain.AuditNode.2'),
            id: 2,
          },
          {
            fullName: t('dict.EmployeeTrain.AuditNode.3'),
            id: 3,
          },
          {
            fullName: t('dict.EmployeeTrain.AuditNode.4'),
            id: 4,
          },
        ],
        placeholder: t('common.selectPlaceholder'),
        showSearch: true,
      },
      field: 'rollbackNode',
      label: t('dict.EmployeeTrain.RollbackNodeText'),
    },
  ];

  const getTitle = computed(() => t('common.rollbackOrResignText'));
  const emit = defineEmits(['register', 'reload']);
  const { createMessage } = useMessage();
  const [registerForm, { setFieldsValue, validate, resetFields, updateSchema }] = useForm({
    labelWidth: 100,
    schemas: schemas,
  });
  const [registerModal, { closeModal, changeOkLoading }] = useModalInner(init);

  function init(data) {
    resetFields();
    if (data.list) {
      state.dataForm.dataList = data.list;
    } else {
      state.dataForm.dataList = [];
    }
  }
  //提交
  async function handleSubmit() {
    const values = await validate();
    if (!values) return;
    changeOkLoading(true);
    const query = {
      ...values,
      employeeTrainIds: state.dataForm.dataList,
    };
    const formMethod = postInitiateRollbackOrReSign;
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
