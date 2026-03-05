<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" showOkBtn @ok="handleSubmit">
    <BasicForm @register="registerForm">
      <template #OrgId>
        <lydcOrganizeSelect
          :disabled="!hasBtnP('btn_edit')"
          v-model:value="organizeIdTree"
          :placeholder="t('common.chooseText')"
          auth
          @change="onOrganizeChange" />
      </template>
    </BasicForm>
  </BasicModal>
</template>

<script setup lang="ts">
  import { computed, nextTick, reactive, ref, unref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, FormSchema, useForm } from '/@/components/Form';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { addProcessPara, updateProcessPara } from '/@/api/engineering/process';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useOrganizeStore } from '/@/store/modules/organize';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { useBaseStore } from '/@/store/modules/base';
  import { useUserStore } from '/@/store/modules/user';
  import { cloneDeep } from 'lodash-es';
  const userStore = useUserStore();
  const baseStore = useBaseStore();

  const { hasBtnP } = usePermission();
  const organizeIdTree: any = ref([]);

  interface State {
    dataForm: any;
  }

  const state = reactive<State>({
    dataForm: {},
  });

  const schemas: FormSchema[] = [
    {
      field: 'typeCode',
      label: '工艺类型',
      component: 'ApiSelect',
      componentProps: {
        placeholder: '请选择类型',
        api: () => {
          return baseStore.getDictionaryData('PCC.ProcessType');
        },
        labelField: 'fullName',
        valueField: 'enCode',
        filterOption: false,
        notFoundContent: null,
        immediate: true,
      },
    },
    {
      field: 'numberOfKnives',
      label: '刀数',
      component: 'InputNumber',
      componentProps: { placeholder: '请输入刀数' },
      rules: [{ required: true, trigger: 'blur', message: '必填' }],
    },
    {
      field: 'stepDistanceFrom',
      label: '步距范围-起',
      component: 'InputNumber',
      componentProps: { placeholder: '请输入步距范围-起' },
      rules: [{ required: true, trigger: 'blur', message: '必填' }],
    },
    {
      field: 'stepDistanceTo',
      label: '步距范围-止',
      component: 'InputNumber',
      componentProps: { placeholder: '请输入步距范围-止' },
      rules: [{ required: true, trigger: 'blur', message: '必填' }],
    },
    // {
    //   field: 'dieCutSpeed',
    //   label: '模切-速度',
    //   component: 'InputNumber',
    //   componentProps: { placeholder: '请输入模切-速度' },
    //   rules: [{ required: true, trigger: 'blur', message: '必填' }],
    // },
    // {
    //   field: 'dieCutSpeedUnit',
    //   label: '模切-单位',
    //   component: 'Input',
    //   componentProps: { placeholder: '请输入模切-单位' },
    //   rules: [{ required: true, trigger: 'blur', message: '必填' }],
    // },
    {
      field: 'suggestedStartupSpeed',
      label: '建议开机-速度',
      component: 'InputNumber',
      componentProps: { placeholder: '请输入建议开机-速度' },
      rules: [{ required: true, trigger: 'change', message: '必填' }],
    },
    {
      field: 'suggestedStartupSpeedUnit',
      label: '建议开机-单位',
      component: 'Input',
      componentProps: { placeholder: '请输入建议开机-单位' },
      rules: [{ required: true, trigger: 'change', message: '必填' }],
    },
    {
      field: 'mainOperatorStaffing',
      label: '主机手技能',
      component: 'ApiSelect',
      i18nField: 'mainOperatorStaffingName',
      componentProps: {
        placeholder: '请选择主机手技能',
        api: () => {
          return baseStore.getDictionaryData('SkillLevel');
        },
        labelField: 'fullName',
        valueField: 'enCode',
        filterOption: false,
        notFoundContent: null,
        immediate: true,
      },
    },
    {
      field: 'auxiliaryOperatorStaffing',
      label: '辅机手技能',
      component: 'ApiSelect',
      i18nField: 'auxiliaryOperatorStaffingName',
      componentProps: {
        placeholder: '请选择辅机手技能',
        api: () => {
          return baseStore.getDictionaryData('SkillLevel');
        },
        labelField: 'fullName',
        valueField: 'enCode',
        filterOption: false,
        notFoundContent: null,
        immediate: true,
      },
    },
    {
      field: 'suggestedAdjustmentTime',
      label: '建议调机时间',
      component: 'InputNumber',
      componentProps: { placeholder: '请输入建议调机时间' },
      rules: [{ required: true, trigger: 'change', message: '必填' }],
    },
    {
      field: 'suggestedYield',
      label: '建议良率',
      component: 'InputNumber',
      componentProps: { placeholder: '请输入建议良率', rate: true },
      rules: [{ required: true, trigger: 'change', message: '必填' }],
    },
    {
      field: 'suggestedAdjustmentMetres',
      label: '建议调机米数',
      component: 'InputNumber',
      componentProps: { placeholder: '请输入建议调机米数' },
      rules: [{ required: true, trigger: 'change', message: '必填' }],
    },
    {
      field: 'orgId',
      label: '组织',
      component: 'TreeSelect',
      slot: 'OrgId',
      componentProps: { placeholder: '请选择组织' },
      required: true,
    },
  ];

  const organizeStore = useOrganizeStore();
  // const getTitle = computed(() => (!state.dataForm.id ? t('新增工艺参数') : t('修改工艺参数')));
  const getTitle = computed(() =>
    state.dataForm.id ? `${t('common.modify')} ${t('dict.Module.ProcessPara')}` : `${t('common.add2Text')} ${t('dict.Module.ProcessPara')}`,
  );
  const emit = defineEmits(['register', 'reload']);
  const { createMessage } = useMessage();
  const { t } = useI18n();
  const [registerForm, { setFieldsValue, setProps, validate, resetFields, clearValidate, updateSchema }] = useForm({
    labelWidth: 220,
    schemas: schemas,
    layout: 'vertical',
    baseColProps: {
      span: 12,
    },
    i18nConfig: {
      moduleCode: 'ProcessParaColumn',
      transferRange: ['placeholder', 'label'],
    },
  });
  const [registerModal, { closeModal, changeLoading, changeOkLoading }] = useModalInner(init);

  function init(d) {
    const data = cloneDeep(d);
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

    state.dataForm.id = data.record.id;
    if (state.dataForm.id) {
      data.record.type = data.record?.type?.toString() || '';
      data.record.processType = data.record?.processType?.toString() || '';
      data.record.mainOperatorStaffing = data.record?.mainOperatorStaffing?.toString() || '';
      data.record.auxiliaryOperatorStaffing = data.record?.auxiliaryOperatorStaffing?.toString() || '';
      data.record.suggestedYield = data.record?.suggestedYield * 100;
      state.dataForm = data.record;
      setFieldsValue(data.record); //设置表单值
      organizeIdTree.value = data.record.organizeIdTree.split(',') || [];
    } else {
      organizeIdTree.value = unref(userStore.getUserInfo).organizeIdList;
      setFieldsValue({
        orgId: organizeIdTree.value[organizeIdTree.value.length - 1],
      });
    }
  }

  function onOrganizeChange(val) {
    setFieldsValue({ orgId: !val || !val.length ? '' : val[val.length - 1] });
    if (!val || !val.length) return;
    clearValidate('orgId');
  }

  //提交
  async function handleSubmit() {
    const values = await validate();
    if (!values) return;
    changeOkLoading(true);
    const query = {
      ...values,
      suggestedYield: values.suggestedYield / 100,
      id: state.dataForm.id,
      organizeIdTree: organizeIdTree.value,
    };

    const formMethod = state.dataForm.id ? updateProcessPara : addProcessPara;
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
