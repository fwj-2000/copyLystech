<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" showOkBtn @ok="handleSubmit">
    <BasicForm @register="registerForm">
      <template #OrgId>
        <lydcOrganizeSelect :disabled="!hasBtnP('btn_edit')" v-model:value="organizeIdTree" :placeholder="t('common.chooseText')" @change="onOrganizeChange" />
      </template>
    </BasicForm>
  </BasicModal>
</template>

<script setup lang="ts">
  import { computed, nextTick, reactive, ref, unref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, FormSchema, useForm } from '/@/components/Form';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { addProcessCode, updateProcessCode } from '/@/api/engineering/process';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useOrganizeStore } from '/@/store/modules/organize';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { useBaseStore } from '/@/store/modules/base';
  import { useUserStore } from '/@/store/modules/user';
  const userStore = useUserStore();
  const baseStore = useBaseStore();
  const { t } = useI18n();

  const { hasBtnP } = usePermission();
  const organizeIdTree = ref([]);

  interface State {
    dataForm: any;
  }

  const state = reactive<State>({
    dataForm: {},
  });

  const schemas: FormSchema[] = [
    {
      field: 'typeCode',
      label: '类型',
      i18nField: 'type',
      component: 'ApiSelect',
      componentProps: {
        placeholder: '请选择类型',
        api: () => {
          return baseStore.getDictionaryData('PCC.ProcessType');
        },
        onChange: val => {
          console.log(val);
        },
        labelField: 'fullName',
        valueField: 'enCode',
        filterOption: false,
        notFoundContent: null,
        immediate: true,
      },
    },
    // {
    //   field: 'typeCodeName',
    //   label: '类型名称',
    //   component: 'Input',
    //   componentProps: { placeholder: '请输入类型名称' },
    //   rules: [{ required: true, trigger: 'blur', message: '必填' }],
    // },
    {
      field: 'name',
      label: '名称',
      component: 'Input',
      componentProps: { placeholder: '请输入名称' },
      rules: [{ required: true, trigger: 'blur', message: '必填' }],
    },
    {
      field: 'code',
      label: '代码',
      component: 'Input',
      componentProps: { placeholder: '请输入代码' },
      rules: [{ required: true, trigger: 'blur', message: '必填' }],
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
  const getTitle = computed(() => (state.dataForm.id ? t('dict.CommonCol.modifyProcessCode') : t('dict.CommonCol.addProcessCode')));
  const emit = defineEmits(['register', 'reload']);
  const { createMessage } = useMessage();
  const [registerForm, { setFieldsValue, setProps, validate, resetFields, clearValidate, updateSchema }] = useForm({
    labelWidth: 120,
    schemas: schemas,
    i18nConfig: {
      moduleCode: 'ProcessCodeColumn',
    },
  });
  const [registerModal, { closeModal, changeLoading, changeOkLoading }] = useModalInner(init);

  function init(data) {
    resetFields();
    if (data.id) {
      setProps({
        disabled: !hasBtnP('btn_edit'),
      });
    } else {
      setProps({
        disabled: !hasBtnP('btn_add'),
      });
    }
    state.dataForm.id = data.record.id;
    //更新下拉列表
    nextTick(() => {
      if (data.typeList) updateSchema({ field: 'type', componentProps: { options: data.typeList } });
      if (data.processTypeList)
        updateSchema({
          field: 'processType',
          componentProps: { options: data.processTypeList },
        });
    });
    if (state.dataForm.id) {
      data.record.typeCode = data.record.typeCode?.toString() || ''; //转化为字符串 防止下拉无法渲染
      data.record.processType = data.record.processType?.toString() || ''; //转化为字符串 防止下拉无法渲染
      state.dataForm = data.record;
      // data.record.orgId = data.record.orgId;
      setFieldsValue(data.record); //设置表单值
      organizeIdTree.value = data.record.organizeIdTree?.split(',') || [];
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
      id: state.dataForm.id,
      organizeIdTree: organizeIdTree.value,
    };

    const formMethod = state.dataForm.id ? updateProcessCode : addProcessCode;
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
