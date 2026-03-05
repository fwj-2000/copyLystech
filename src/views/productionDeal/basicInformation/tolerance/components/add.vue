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
  import { addTolerance, updateTolerance, getToleranceById, getProcessList } from '/@/api/productionDeal/tolerance';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { isEmpty } from '/@/utils/is';
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
      field: 'ProjectNo',
      label: '项目号',
      component: 'Input',
      componentProps: { placeholder: '请输入' },
      rules: [{ required: true, trigger: 'blur', message: '必填' }],
      colProps: {
        span: 12,
      },
    },
    {
      field: 'ProcessId',
      label: '工序',
      component: 'Select',
      componentProps: {
        showSearch: true,
        placeholder: '请选择',
        onSearch: value => {
          if (!value) {
            value = ' ';
          }
          updateProcessList(value);
        },
      },
      rules: [{ required: true, trigger: 'change', message: '必填' }],
      colProps: {
        span: 12,
      },
    },
    {
      field: 'ProjectNo',
      label: '项目号',
      component: 'Input',
      componentProps: { placeholder: '请输入' },
      rules: [{ required: true, trigger: 'blur', message: '必填' }],
      colProps: {
        span: 12,
      },
    },
    {
      field: 'FAINo',
      label: 'FAI_NO',
      component: 'Input',
      componentProps: { placeholder: '请输入' },
      colProps: {
        span: 12,
      },
    },
    {
      field: 'DrawingControlUpperLimit',
      label: '图纸管控上限',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入',
      },
      colProps: {
        span: 12,
      },
    },
    {
      field: 'DrawingControlLowerLimit',
      label: '图纸管控下限',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入',
      },
      colProps: {
        span: 12,
      },
    },
    {
      field: 'ShipmentControlUpperLimit',
      label: '出货管控上限',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入',
      },
      colProps: {
        span: 12,
      },
    },
    {
      field: 'ShipmentControlLowerLimit',
      label: '出货管控下限',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入',
      },
      colProps: {
        span: 12,
      },
    },
    {
      field: 'ShutdownControlUpperLimit',
      label: '停机管控上限',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入',
      },
      colProps: {
        span: 12,
      },
    },
    {
      field: 'ShutdownControlLowerLimit',
      label: '停机管控下限',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入',
      },
      colProps: {
        span: 12,
      },
    },
    {
      field: 'FirstArticleUpperLimit',
      label: '建议首件上限',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入',
      },
      colProps: {
        span: 12,
      },
    },
    {
      field: 'FirstArticleLowerLimit',
      label: '建议首件下限',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入',
      },
      colProps: {
        span: 12,
      },
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
      colProps: {
        span: 12,
      },
    },
    {
      field: 'Remark',
      label: '版本说明',
      component: 'Input',
      componentProps: { placeholder: '请输入' },
      colProps: {
        span: 12,
      },
    },
  ];

  const getTitle = computed(() => (state.dataForm.Id ? t('common.editText') : t('common.addText')));
  const emit = defineEmits(['register', 'reload']);
  const { createMessage } = useMessage();
  const [registerForm, { setFieldsValue, validate, resetFields, updateSchema }] = useForm({
    labelWidth: 280,
    schemas: schemas,
    layout: 'vertical',
  });
  const [registerModal, { closeModal, changeLoading, changeOkLoading }] = useModalInner(init);

  function init(data) {
    resetFields();
    state.dataForm.Id = data.id;
    //更新下拉列表
    if (data.processList)
      updateSchema([
        {
          field: 'ProcessId',
          componentProps: { options: data.processList },
        },
      ]);
    if (state.dataForm.Id) {
      changeLoading(true);
      getToleranceById(state.dataForm.Id).then(res => {
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

  transformSchemas(schemas, 'ToleranceColumn', { OrgId: 'OrgName' });

  //提交
  async function handleSubmit() {
    const values = await validate();
    if (!values) return;
    changeOkLoading(true);
    const query = {
      ...values,
      id: state.dataForm.Id,
    };
    const formMethod = state.dataForm.Id ? updateTolerance : addTolerance;
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

  const updateProcessList = debounce(getProcessData, 300);
  async function getProcessData(code) {
    const optionList = (await getProcessList(code)).data;
    const optionProcessList = optionList
      ? optionList.map(i => {
          return {
            id: i.id,
            fullName: i.name,
          };
        })
      : [];
    updateSchema([
      {
        field: 'ProcessId',
        componentProps: {
          placeholder: t(['common.selectPlaceholder', 'dict.ToleranceColumn.ProcessName']), //'请选择工序',
          options: optionProcessList,
        },
      },
    ]);
  }
</script>
