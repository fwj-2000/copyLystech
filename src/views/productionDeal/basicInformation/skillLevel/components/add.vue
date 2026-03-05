<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" showOkBtn @ok="handleSubmit">
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>

<script setup lang="ts">
  import { computed, reactive } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm, FormSchema } from '/@/components/Form';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { getSkillLevelById, addSkillLevel, updateSkillLevel } from '/@/api/productionDeal/skillLevel';
  import { getJobInfoList } from '/@/api/productionDeal/jobInfo';
  import { isEmpty } from '/@/utils/is';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { debounce } from '/@/utils/debounce';

  interface State {
    dataForm: any;
  }

  const { t } = useI18n();

  const state = reactive<State>({
    dataForm: {},
  });

  const schemas: FormSchema[] = [
    {
      field: 'Code',
      label: '技能编码',
      component: 'Input',
      componentProps: { placeholder: '请输入' },
      rules: [{ required: true, trigger: 'blur', message: '必填' }],
    },
    {
      field: 'Name',
      label: '技能名称',
      component: 'Input',
      componentProps: { placeholder: '请输入' },
      rules: [{ required: true, trigger: 'blur', message: '必填' }],
    },
    {
      field: 'JobInfoId',
      label: '所属岗位',
      component: 'Select',
      componentProps: {
        showSearch: true,
        placeholder: '请选择',
        onSearch: value => {
          if (!value) {
            value = ' ';
          }
          updateJobInfoList(value);
        },
      },
      rules: [{ required: true, trigger: 'change', message: '必填' }],
    },
    {
      field: 'Description',
      label: '技能描述',
      component: 'Input',
      componentProps: { placeholder: '请输入' },
    },
    {
      field: 'SkillLevel',
      label: '技能等级',
      component: 'Select',
      componentProps: {
        showSearch: true,
        placeholder: '请选择',
      },
      rules: [{ required: true, trigger: 'change', message: '必填' }],
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

  const getTitle = computed(() => (state.dataForm.Id ? t('common.editText') : t('common.addText')));
  const emit = defineEmits(['register', 'reload']);
  const { createMessage } = useMessage();
  const [registerForm, { setFieldsValue, validate, resetFields, updateSchema }] = useForm({
    labelWidth: 140,
    schemas: schemas,
  });
  const [registerModal, { closeModal, changeLoading, changeOkLoading }] = useModalInner(init);

  function init(data) {
    resetFields();
    state.dataForm.Id = data.id;

    if (data.skillLevel)
      updateSchema([
        {
          field: 'SkillLevel',
          componentProps: {
            options: data.skillLevel,
            fieldNames: { value: 'enCode' },
          },
        },
      ]);

    if (data.jobInfoList)
      updateSchema([
        {
          field: 'JobInfoId',
          componentProps: {
            options: data.jobInfoList,
          },
        },
      ]);

    if (state.dataForm.Id) {
      changeLoading(true);
      getSkillLevelById(state.dataForm.Id).then(res => {
        const data = res.data;
        state.dataForm = data;
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

  transformSchemas(schemas, 'SkillLevelColumn', { OrgId: 'OrgName' });
  //提交
  async function handleSubmit() {
    const values = await validate();
    if (!values) return;
    changeOkLoading(true);
    const query = {
      ...values,
      id: state.dataForm.Id,
    };
    const formMethod = state.dataForm.Id ? updateSkillLevel : addSkillLevel;
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

  const updateJobInfoList = debounce(getJobInfos, 500);
  async function getJobInfos(searchKey) {
    const optionList = (await getJobInfoList(searchKey)).data;
    const jobInfoList = optionList
      ? optionList.map(i => {
          return {
            id: i.Id,
            fullName: i.Name,
          };
        })
      : [];
    updateSchema([
      {
        field: 'JobInfoId',
        componentProps: {
          options: jobInfoList,
        },
      },
    ]);
  }
</script>
