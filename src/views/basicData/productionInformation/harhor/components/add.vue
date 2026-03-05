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
  import { addHarhor, updateHarhor, getHarhorById } from '/@/api/basicData/harhor';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { usePermission } from '/@/hooks/web/usePermission';
  const { hasBtnP } = usePermission();
  const { t } = useI18n();

  interface State {
    dataForm: any;
  }

  const state = reactive<State>({
    dataForm: {},
  });

  const schemas: FormSchema[] = [
    {
      field: 'Name',
      label: '口岸名称',
      component: 'Input',
      componentProps: { placeholder: '请输入' },
      rules: [{ required: true, trigger: 'blur' /** message: '必填' */ }],
    },

    {
      field: 'Status',
      label: '状态',
      component: 'Select',
      defaultValue: 1,
      componentProps: {
        placeholder: '请选择',
        options: [
          { fullName: t('common.valid'), id: 1 },
          { fullName: t('common.loseEfficacy'), id: 2 },
        ],
      },
      rules: [{ required: true, trigger: 'change', /** message: '必填' */ type: 'number' }],
    },
    {
      field: 'Remark',
      label: '备注',
      component: 'Textarea',
      componentProps: { placeholder: '请输入', row: 3 },
    },
  ];
  //t('新建客户')
  const getTitle = computed(() => (state.dataForm.Id ? t('common.editText') : t('common.addText')));
  const emit = defineEmits(['register', 'reload']);
  const { createMessage } = useMessage();
  const [registerForm, { setFieldsValue, setProps, validate, resetFields }] = useForm({
    labelWidth: '100%',
    layout: 'vertical',
    schemas: schemas,
    i18nConfig: {
      moduleCode: 'HarhorColumn',
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
      setProps({
        disabled: !hasBtnP('btn_add'),
      });
    }
    resetFields();
    state.dataForm.Id = data.id;
    //更新下拉列表
    //if (data.industryTypeList) updateSchema({ field: 'Status', componentProps: { options: data.industryTypeList } });
    if (state.dataForm.Id) {
      changeLoading(true);
      getHarhorById(state.dataForm.Id).then(res => {
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
      id: state.dataForm.Id,
    };

    const formMethod = state.dataForm.Id ? updateHarhor : addHarhor;
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
