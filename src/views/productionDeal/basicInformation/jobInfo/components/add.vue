<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" showOkBtn @ok="handleSubmit">
    <BasicForm @register="registerForm">
      <template #DepartmentId>
        <TreeSelect
          v-model:value="selectTreeData"
          :placeholder="t('common.selectPlaceholder')"
          :treeDefaultExpandAll="true"
          :treeDataSimpleMode="true"
          :labelInValue="true"
          :treeData="treeData"
          :fieldNames="{ label: 'fullName', value: 'id' }"
          @change="onParentIdChange" />
      </template>
    </BasicForm>
  </BasicModal>
</template>

<script setup lang="ts">
  import { computed, reactive, ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm, FormSchema } from '/@/components/Form';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { addJobInfo, updateJobInfo, getJobInfoById } from '/@/api/productionDeal/jobInfo';
  import { getDepartmentSelector } from '/@/api/basicData/department';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { TreeSelect } from 'ant-design-vue';
  import { isEmpty } from '/@/utils/is';

  interface State {
    dataForm: any;
  }

  const { t } = useI18n();

  const state = reactive<State>({
    dataForm: {},
  });

  const treeData = ref<any[]>([]);

  const selectTreeData = ref<any>({ label: '', value: '' });

  const schemas: FormSchema[] = [
    {
      field: 'Code',
      label: '岗位编码',
      component: 'Input',
      componentProps: { placeholder: '请输入' },
      rules: [{ required: true, trigger: 'blur', message: '必填' }],
    },
    {
      field: 'Name',
      label: '岗位名称',
      component: 'Input',
      componentProps: { placeholder: '请输入' },
      rules: [{ required: true, trigger: 'blur', message: '必填' }],
    },
    {
      field: 'DepartmentId',
      label: '所属部门',
      component: 'TreeSelect',
      slot: 'DepartmentId',
      rules: [{ required: true, trigger: 'blur', message: '必填' }],
      helpMessage: t('dict.JobInfoColumn.HelpMessage'),
    },
    {
      field: 'Description',
      label: '岗位描述',
      component: 'Input',
      componentProps: { placeholder: '请输入' },
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
    },
    {
      field: 'Remark',
      label: '备注',
      component: 'Input',
      componentProps: { placeholder: '请输入' },
    },
  ];

  const getTitle = computed(() => (!state.dataForm.Id ? t('common.addText') : t('common.editText')));
  const emit = defineEmits(['register', 'reload']);
  const { createMessage } = useMessage();
  const [registerForm, { setFieldsValue, validate, resetFields }] = useForm({
    labelWidth: 140,
    schemas: schemas,
  });
  const [registerModal, { closeModal, changeLoading, changeOkLoading }] = useModalInner(init);

  function onParentIdChange() {
    setFieldsValue({ DepartmentId: selectTreeData.value.value });
  }

  function init(data) {
    resetFields();
    state.dataForm.Id = data.id;
    selectTreeData.value = { label: undefined, value: undefined };
    changeLoading(true);
    getDepartmentSelector().then(res => {
      changeLoading(true);
      treeData.value = res.data.list;
      changeLoading(false);
    });

    if (state.dataForm.Id) {
      changeLoading(true);
      getJobInfoById(state.dataForm.Id).then(res => {
        const data = res.data;
        state.dataForm = data;
        selectTreeData.value = { label: res.data.DepartmentName, value: res.data.DepartmentId };
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

  transformSchemas(schemas, 'JobInfoColumn', { OrgId: 'OrgName' });

  //提交
  async function handleSubmit() {
    const values = await validate();
    if (!values) return;
    changeOkLoading(true);
    const query = {
      ...values,
      id: state.dataForm.Id,
    };
    const formMethod = state.dataForm.Id ? updateJobInfo : addJobInfo;
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
