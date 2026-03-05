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
  import { addProcedure, updateProcedure, getProcedureById } from '/@/api/productionDeal/procedure';
  import { getProcessList } from '/@/api/productionDeal/tolerance';
  import { getWorkshopList } from '/@/api/productionDeal/workshop';
  import { getProductLineList } from '/@/api/basicData/productLine';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { isEmpty } from '/@/utils/is';
  import { debounce } from '/@/utils/debounce';
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
      label: '工位名称',
      component: 'Input',
      componentProps: { placeholder: '请输入' },
      rules: [{ required: true, trigger: 'blur', message: '必填' }],
    },
    {
      field: 'Mainstay',
      label: '产能主体',
      component: 'Input',
      componentProps: { placeholder: '请输入' },
      rules: [{ required: true, trigger: 'blur', message: '必填' }],
    },
    {
      field: 'ProcessId',
      label: '关联工序',
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
    },
    {
      field: 'WorkshopId',
      label: '所属车间',
      component: 'Select',
      componentProps: {
        showSearch: true,
        placeholder: '请选择',
        onSearch: value => {
          if (!value) {
            value = ' ';
          }
          updateWorkshopList(value);
        },
      },
      rules: [{ required: true, trigger: 'change', message: '必填' }],
    },
    {
      field: 'CreateOrderUserId',
      label: '制单人',
      component: 'UserSelect',
      componentProps: {
        multiple: false,
        fieldNames: { value: 'fullname' },
      },
    },
    {
      field: 'ProductLineId',
      label: '所属产线',
      component: 'Select',
      componentProps: {
        showSearch: true,
        placeholder: '请选择',
        onSearch: value => {
          if (!value) {
            value = ' ';
          }
          updateProductLineList(value);
        },
      },
      rules: [{ required: true, trigger: 'blur', message: '必填' }],
    },
    {
      field: 'CreateOrderDate',
      label: '制单日期',
      component: 'DatePicker',
      componentProps: { placeholder: '请选择', format: 'YYYY-MM-DD' },
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
    labelWidth: 160,
    schemas: schemas,
  });
  const [registerModal, { closeModal, changeLoading, changeOkLoading }] = useModalInner(init);

  async function init(data) {
    resetFields();
    state.dataForm.Id = data.id;

    const processList = await getProcessList('');
    const processOptionList = processList.data.map(i => {
      return {
        id: i.id,
        fullName: i.name,
      };
    });
    updateSchema([
      {
        field: 'ProcessId',
        componentProps: {
          placeholder: t(['common.selectPlaceholder', 'dict.ProcedureColumn.ProcessId']), //'请选择工序',
          options: processOptionList,
        },
      },
    ]);

    const workshopList = await getWorkshopList('');
    const workshopOptionList = workshopList.data.map(i => {
      return {
        id: i.Id,
        fullName: i.Name,
      };
    });
    updateSchema([
      {
        field: 'WorkshopId',
        componentProps: {
          placeholder: t(['common.selectPlaceholder', 'dict.ProcedureColumn.Workshop']), //'请选择生产车间',
          options: workshopOptionList,
        },
      },
    ]);

    const productLineList = await getProductLineList();
    const productLineOptionList = productLineList.data.map(i => {
      return {
        id: i.Id,
        fullName: i.Name,
      };
    });
    updateSchema({
      field: 'ProductLineId',
      componentProps: {
        options: productLineOptionList,
      },
    });

    if (state.dataForm.Id) {
      changeLoading(true);
      getProcedureById(state.dataForm.Id).then(res => {
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

  transformSchemas(schemas, 'ProcedureColumn', { OrgId: 'OrgName' });

  //提交
  async function handleSubmit() {
    const values = await validate();
    if (!values) return;
    changeOkLoading(true);
    const query = {
      ...values,
      id: state.dataForm.Id,
    };
    const formMethod = state.dataForm.Id ? updateProcedure : addProcedure;
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
  async function getProcessData(searchKey) {
    const optionList = (await getProcessList(searchKey)).data;
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
          placeholder: '工序',
          options: optionProcessList,
        },
      },
    ]);
  }

  const updateWorkshopList = debounce(getWorkshopData, 300);
  async function getWorkshopData(searchKey) {
    const optionList = (await getWorkshopList(searchKey)).data;
    const optionProcessList = optionList
      ? optionList.map(i => {
          return {
            id: i.Id,
            fullName: i.Name,
          };
        })
      : [];
    updateSchema([
      {
        field: 'WorkshopId',
        componentProps: {
          placeholder: '生产车间',
          options: optionProcessList,
        },
      },
    ]);
  }

  const updateProductLineList = debounce(getProductLineDatas, 500);
  async function getProductLineDatas(searchKey) {
    const optionList = (await getProductLineList(searchKey)).data;
    const productLineList = optionList
      ? optionList.map(i => {
          return {
            id: i.Id,
            fullName: i.Name,
          };
        })
      : [];
    updateSchema([
      {
        field: 'ProductLineId',
        componentProps: {
          options: productLineList,
        },
      },
    ]);
  }
</script>
