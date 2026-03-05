<template>
  <BasicModal v-bind="$attrs" :title="getTitle" :showOkBtn="hasBtnP('btn_edit')" :draggable="true" @ok="handleSubmit" @register="registerModal">
    <BasicForm @register="registerForm"> </BasicForm>
  </BasicModal>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue';

  import dayjs from 'dayjs';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { insertManpowertarget, updateManpowertarget } from '/@/api/hr/hrGoals';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form';

  import type { ManpowertargetItem } from '/@/api/hr/hrGoals';
  import type { FormSchema } from '/@/components/Form';

  const { hasBtnP } = usePermission();

  const dataForm = ref<ManpowertargetItem>({
    id: '',
    archiveGroup: '',
    factory: '',
    department: '',
    directClassify: '',
    postName: '',
    natureEmployment: '',
    yearMonth: '',
    peopleNumber: '',
  });

  function getFormSchema(): FormSchema[] {
    return [
      // 档案分组
      {
        field: 'archiveGroup',
        label: '档案分组',
        component: 'Input',
        rules: [{ required: true, trigger: 'blur' }],
        dynamicDisabled: () => {
          return type.value === 'edit';
        },
      },
      // 厂区
      {
        field: 'factory',
        label: '厂区',
        component: 'Input',
        rules: [{ required: true, trigger: 'blur' }],
        dynamicDisabled: () => {
          return type.value === 'edit';
        },
      },
      // 部门
      {
        field: 'department',
        label: '部门',
        component: 'Input',
        rules: [{ required: true, trigger: 'blur' }],
        dynamicDisabled: () => {
          return type.value === 'edit';
        },
      },
      // 直/间接分类
      {
        field: 'directClassify',
        label: '直/间接分类',
        component: 'Input',
        rules: [{ required: true, trigger: 'blur' }],
        dynamicDisabled: () => {
          return type.value === 'edit';
        },
      },
      // 岗位名称
      {
        field: 'postName',
        label: '岗位名称',
        component: 'Input',
        dynamicDisabled: () => {
          return type.value === 'edit';
        },
      },
      // 工作性质
      {
        field: 'natureEmployment',
        label: '工作性质',
        component: 'Input',
        dynamicDisabled: () => {
          return type.value === 'edit';
        },
      },
      // 年月份
      {
        field: 'yearMonth',
        label: '年月份',
        i18nField: 'yearMonthStr',
        component: 'MonthPicker',
        componentProps: { placeholder: t('common.selectPlaceholder'), format: 'YYYY-MM' },
        dynamicDisabled: () => {
          return type.value === 'edit';
        },
      },
      // 人数
      {
        field: 'peopleNumber',
        label: '人数',
        component: 'Input',
      },
    ];
  }

  const getTitle = computed(() => (dataForm.value.id ? t('common.addText') : t('common.editText')));
  const emit = defineEmits(['register', 'reload']);
  const { createMessage } = useMessage();
  const { t } = useI18n();
  const [registerForm, { setFieldsValue, setProps, validate, resetFields, clearValidate }] = useForm({
    labelWidth: 100,
    schemas: getFormSchema(),
    i18nConfig: {
      moduleCode: 'HrGoalsColumn',
      transferRange: ['label', 'placeholder'],
    },
  });
  const [registerModal, { closeModal, changeOkLoading }] = useModalInner(init);

  const type = ref('add');

  async function init(data: ManpowertargetItem) {
    resetFields();
    if (data.id) {
      type.value = 'edit';
      setProps({
        disabled: !hasBtnP('btn_edit'),
      });
      dataForm.value = data;
      const yearMonth = dataForm.value.yearMonth.toString();
      dataForm.value.yearMonth = dayjs(`${yearMonth.slice(0, 4)}/${yearMonth.slice(4)}`, 'YYYY-MM');
      setFieldsValue(dataForm.value);
    } else {
      type.value = 'add';
      setProps({
        disabled: !hasBtnP('btn_add'),
      });
    }
  }

  //提交
  async function handleSubmit() {
    const values = await validate();
    if (!values) return;
    changeOkLoading(true);
    const query =
      type.value === 'add' ? { ...values, yearMonth: dayjs(values.yearMonth).format('YYYYMM') } : { id: dataForm.value.id, peopleNumber: values.peopleNumber };
    const api = query.id ? updateManpowertarget : insertManpowertarget;
    api(query)
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
