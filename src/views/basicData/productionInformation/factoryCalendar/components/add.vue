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
  import { addFactoryCalendar, updateFactoryCalendar, getFactoryCalendarById, getEquipmentList } from '/@/api/basicData/factoryCalendar';
  import { getProductLineList } from '/@/api/basicData/productLine';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useBaseStore } from '/@/store/modules/base';
  import { debounce } from '/@/utils/debounce';
  import { isEmpty } from '/@/utils/is';

  interface State {
    dataForm: any;
    Weekday: any;
  }

  const { t } = useI18n();

  const state = reactive<State>({
    dataForm: {},
    Weekday: [],
  });

  const schemas: FormSchema[] = [
    {
      field: 'Date',
      label: '日期',
      component: 'DatePicker',
      componentProps: { placeholder: '请选择', format: 'YYYY-MM-DD' },
      rules: [{ required: true, trigger: 'blur', message: '必填' }],
      colProps: {
        span: 12,
      },
    },
    {
      field: 'Weeks',
      label: '周数',
      component: 'InputNumber',
      componentProps: { placeholder: '请输入' },
      rules: [{ required: true, trigger: 'blur', message: '必填' }],
      colProps: {
        span: 12,
      },
    },
    {
      field: 'Weekday',
      label: '星期',
      component: 'Select',
      componentProps: {
        placeholder: '请选择',
      },
      colProps: { span: 12 },
      rules: [{ required: true, trigger: 'blur', message: '必填' }],
    },
    {
      field: 'ClassesCodes',
      label: '班次',
      component: 'Select',
      componentProps: {
        placeholder: '请选择',
        multiple: true,
      },
      colProps: { span: 12 },
    },
    {
      field: 'ProductLineId',
      label: '生产线',
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
      colProps: { span: 12 },
    },
    {
      field: 'EquipmentIds',
      label: '机台',
      component: 'Select',
      componentProps: {
        placeholder: '请选择',
        multiple: true,
        showSearch: true,
        onSearch: value => {
          if (!value) {
            value = ' ';
          }
          updateEquipmentList(value);
        },
      },
      colProps: { span: 12 },
    },
    {
      field: 'IsRestDay',
      label: '是否休息日',
      component: 'Select',
      componentProps: {
        placeholder: '请选择',
        options: [
          { fullName: t('common.yes'), id: 1 },
          { fullName: t('common.no'), id: 2 },
        ],
      },
      rules: [{ required: true, trigger: 'change', message: '必填', type: 'number' }],
      colProps: { span: 12 },
    },
    {
      field: 'WeekdayNumber',
      label: '工作日数量',
      component: 'InputNumber',
      componentProps: { placeholder: '请输入' },
      rules: [{ required: true, trigger: 'blur', message: '必填' }],
      colProps: {
        span: 12,
      },
    },
    {
      field: 'WorkingHours',
      label: '工作小时数',
      component: 'InputNumber',
      componentProps: { placeholder: '请输入' },
      rules: [{ required: true, trigger: 'blur', message: '必填' }],
      colProps: {
        span: 12,
      },
    },
    {
      field: 'Remark',
      label: '备注',
      component: 'Input',
      componentProps: { placeholder: '请输入' },
      colProps: {
        span: 12,
      },
    },
  ];

  const baseStore = useBaseStore();
  const getTitle = computed(() => (state.dataForm.Id ? t('common.editText') : t('common.addText')));
  const emit = defineEmits(['register', 'reload']);
  const { createMessage } = useMessage();
  const [registerForm, { setFieldsValue, validate, resetFields, updateSchema }] = useForm({
    labelWidth: 180,
    schemas: schemas,
    layout: 'vertical',
  });
  const [registerModal, { closeModal, changeLoading, changeOkLoading }] = useModalInner(init);

  async function init(data) {
    resetFields();
    state.dataForm.Id = data.id;

    baseStore.getDictionaryData('Weekday').then(res => {
      updateSchema({
        field: 'Weekday',
        componentProps: {
          options: res,
          fieldNames: { value: 'enCode' },
        },
      });
    });

    baseStore.getDictionaryData('ClassesName').then(res => {
      updateSchema({
        field: 'ClassesCodes',
        componentProps: {
          options: res,
          fieldNames: { value: 'enCode' },
        },
      });
    });

    const optionList = await getProductLineList();
    const productLines = optionList.data.map(i => {
      return {
        id: i.Id,
        fullName: i.Name,
      };
    });
    updateSchema({
      field: 'ProductLineId',
      componentProps: {
        options: productLines,
      },
    });

    const equipmentList = await getEquipmentList();
    const equipmentInfos = equipmentList.data.map(i => {
      return {
        id: i.Id,
        fullName: i.Name + '(' + i.Code + ')',
      };
    });
    updateSchema({
      field: 'EquipmentIds',
      componentProps: {
        options: equipmentInfos,
      },
    });

    if (state.dataForm.Id) {
      changeLoading(true);
      getFactoryCalendarById(state.dataForm.Id).then(res => {
        const data = {
          ...res.data,
          ClassesCodes: res.data.ClassesCodes ? res.data.ClassesCodes.split(',') : [],
          EquipmentIds: res.data.EquipmentIds ? res.data.EquipmentIds.split(',') : [],
        };
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

  transformSchemas(schemas, 'FactoryCalendarColumn', { OrgId: 'OrgName' });

  //提交
  async function handleSubmit() {
    const values = await validate();
    if (!values) return;
    changeOkLoading(true);
    const query = {
      ...values,
      id: state.dataForm.Id,
      ClassesCodes: values.ClassesCodes && values.ClassesCodes.length ? values.ClassesCodes.join() : '',
      EquipmentIds: values.EquipmentIds && values.EquipmentIds.length ? values.EquipmentIds.join() : '',
    };

    const formMethod = state.dataForm.Id ? updateFactoryCalendar : addFactoryCalendar;
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

  const updateEquipmentList = debounce(getMachineNoDatas, 500);
  async function getMachineNoDatas(searchKey) {
    const optionList = (await getEquipmentList(searchKey)).data;
    const equipmentList = optionList
      ? optionList.map(i => {
          return {
            id: i.Id,
            fullName: i.Name + '(' + i.Code + ')',
          };
        })
      : [];
    updateSchema([
      {
        field: 'ProductLineId',
        componentProps: {
          options: equipmentList,
        },
      },
    ]);
  }
</script>
