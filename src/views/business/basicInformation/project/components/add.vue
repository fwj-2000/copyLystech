<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" :draggable="true" @ok="handleSubmit">
    <BasicForm @register="registerForm">
      <template #OrgId>
        <lydcOrganizeSelect v-model:value="organizeIdTree" :disabled="hasBtnP('btn_edit')" placeholder="请选择" auth @change="onOrganizeChange" />
      </template>
    </BasicForm>
  </BasicModal>
</template>

<script setup lang="ts">
  import { computed, nextTick, reactive, ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm, FormSchema } from '/@/components/Form';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { addProject, updateProject, getProjectById } from '/@/api/business/project';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useOrganizeStore } from '/@/store/modules/organize';
  import { getProductLineCode } from '/@/api/basicData/productLine';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { isEmpty } from '/@/utils/is';
  import { getBaseDataTerminalCustomerList } from '/@/api/finance/wageRate';

  const { hasBtnP } = usePermission();

  const organizeIdTree = ref([]);
  interface State {
    dataForm: any;
  }

  const state = reactive<State>({
    dataForm: {},
  });

  const { t } = useI18n();
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
  transformSchemas(getSchema(), 'ProjectColumn', { OrgId: 'OrgName' });
  const organizeStore = useOrganizeStore();
  const getTitle = computed(() => (state.dataForm.Id ? t('common.editText') : t('common.addText')));
  const emit = defineEmits(['register', 'reload']);
  const { createMessage } = useMessage();
  const [registerForm, { setFieldsValue, setProps, validate, resetFields, clearValidate, updateSchema, getFieldsValue }] = useForm({
    labelWidth: 160,
    schemas: getSchema(),
    i18nConfig: {
      moduleCode: 'ProjectColumn',
      transferRange: ['placeholder', 'label'],
    },
  });
  const [registerModal, { closeModal, changeLoading, changeOkLoading }] = useModalInner(init);

  function getSchema(): FormSchema[] {
    return [
      {
        field: 'InsideProjectCode',
        label: '内部项目代码',
        component: 'Input',
        componentProps: {
          placeholder: '不可输入，自动生成',
          disabled: true,
        },
      },
      {
        field: 'MainProcess',
        label: '主要制程',
        defaultValue: 1,
        component: 'Select',
        rules: [{ required: true, trigger: 'change', message: '必填', type: 'number' }],
      },
      {
        // getBaseDataTerminalCustomerList
        field: 'TerminalCustomerCode',
        label: '终端客户代码',
        component: 'ApiSelect',
        componentProps: {
          api: getBaseDataTerminalCustomerList,
          placeholder: '请选择终端客户',
          labelField: 'terminalCustomerName',
          valueField: 'terminalCustomerCode',
          nameFormat: ['terminalCustomerCode', '-', 'terminalCustomerName'],
          resultField: 'data',
          showSearch: true,
          apiSearch: {
            show: true,
            searchName: 'TerminalCustomerCode',
          },
          beforeFetch: params => {
            const { MainProcess } = getFieldsValue();
            params.MainProcess = MainProcess;
            return params;
          },
          filterOption: false,
          notFoundContent: null,
          alwaysLoad: true,
        },
        rules: [{ required: true, trigger: 'change', message: '必填' }],
      },
      {
        field: 'ProductLineCode',
        label: '产品线代码',
        component: 'Select',
        componentProps: {
          showSearch: true,
          placeholder: '请选择',
          // onSearch: (value) => {
          //     getProductLine(value)
          // }
        },
        rules: [{ required: true, trigger: 'change', message: '必填' }],
      },
      // {
      //     field: 'ImmediateCustomerProjectCode',
      //     label: '直接客户项目代码',
      //     component: 'Input',
      //     componentProps: { placeholder: '请输入' },
      //     rules: [{ required: true, trigger: 'blur', message: '必填' }],
      // },
      {
        field: 'ParentProjectCode',
        label: '上一代终端项目代码',
        component: 'Input',
        componentProps: { placeholder: '请输入' },
        rules: [{ required: true, trigger: 'blur', message: '必填' }],
      },
      {
        field: 'TerminalCustomerProjectCode',
        label: '终端项目代码',
        component: 'Input',
        componentProps: { placeholder: '请输入' },
        rules: [{ required: true, trigger: 'blur', message: '必填' }],
      },
      {
        field: 'OldInsideProjectCode',
        label: '旧版项目代码',
        component: 'Input',
        componentProps: { placeholder: '请输入' },
      },
      {
        field: 'OrgId',
        label: '所属组织',
        component: 'TreeSelect',
        slot: 'OrgId',
        rules: [{ required: true, trigger: 'change', message: '必填' }],
      },
      {
        field: 'Status',
        label: '是否启用',
        component: 'Select',
        i18nField: 'CommonCol.isEnable',
        defaultValue: 1,
        componentProps: {
          placeholder: '请选择',
          disabled: true,
          options: [
            { fullName: t('common.enableText'), id: 1 },
            { fullName: t('common.disableText'), id: 2 },
          ],
        },
        rules: [{ required: true, trigger: 'change', message: '必填', type: 'number' }],
      },
      {
        field: 'Remark',
        label: '备注',
        component: 'Textarea',
        componentProps: { placeholder: '请输入', row: 3 },
      },
    ];
  }

  async function handleMainProcessChange(formActionType, value) {
    const descOptions = (await getProductLineCode(' ', value)).data.map(i => ({
      id: i.Code,
      fullName: `${i.Code}(${i.Name})`,
    }));

    formActionType.updateSchema({
      field: 'ProductLineCode',
      componentProps: { options: descOptions },
    });
  }

  function applyEditSchema(updateSchema) {
    updateSchema([
      { field: 'Status', componentProps: { disabled: false } },
      { field: 'TerminalCustomerCode', componentProps: { disabled: true } },
      { field: 'ProductLineCode', componentProps: { disabled: true } },
    ]);
  }

  function applyAddProps(setProps) {
    setProps({ disabled: !hasBtnP('btn_add') });
  }

  function updateDropdownsOnNextTick(data, updateSchema) {
    nextTick(() => {
      if (data.optionsProcessList) {
        updateSchema({
          field: 'MainProcess',
          componentProps: ({ formActionType }) => ({
            options: data.optionsProcessList,
            placeholder: '请选择',
            onChange: value => handleMainProcessChange(formActionType, value),
          }),
        });
      }

      if (data.productLineList) {
        updateSchema({
          field: 'ProductLineCode',
          componentProps: { options: data.productLineList },
        });
      }
    });
  }

  async function loadProjectDetail(id) {
    changeLoading(true);
    try {
      const res = await getProjectById(id);
      state.dataForm = res.data;
      organizeIdTree.value = res.data.organizeIdTree || [];
      setFieldsValue(res.data);
    } finally {
      changeLoading(false);
    }
  }

  function initNewProject(data) {
    organizeIdTree.value = data.organizeIdTree || [];
    const organizeId = data.organizeIdTree?.slice(-1)[0];
    setFieldsValue({ OrgId: organizeId || '' });
    changeLoading(false);
  }

  async function init(data) {
    resetFields();

    if (data.id) {
      applyEditSchema(updateSchema);
    } else {
      applyAddProps(setProps);
    }

    state.dataForm.Id = data.id;

    // 更新下拉列表
    updateDropdownsOnNextTick(data, updateSchema);

    if (state.dataForm.Id) {
      await loadProjectDetail(state.dataForm.Id);
    } else {
      initNewProject(data);
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
      organizeIdTree: organizeIdTree.value,
    };
    const formMethod = state.dataForm.Id ? updateProject : addProject;
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

  function onOrganizeChange(val) {
    setFieldsValue({ OrgId: !val || !val.length ? '' : val[val.length - 1] });
    if (!val || !val.length) return;
    clearValidate('OrgId');
  }
</script>
