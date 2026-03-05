<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" showOkBtn @ok="handleSubmit" :okText="t('common.setTemplate')">
    <BasicForm @register="registerForm">
      <template #sqlTemplate>
        <a-form-item-rest>
          <a-button preIcon="icon-ym icon-ym-btn-add" @click="handleAddSql()">{{ t('dict.CommonCol.addSQL') }}</a-button>
          <a-row v-for="(item, i) in sqlTemplate" :key="i" class="mt-10px">
            <a-col :span="21">
              <a-textarea v-model:value="item.sql" placeholder="请输入SQL查询语句&存储过程语句" type="textarea" :autoSize="{ minRows: 3, maxRows: 10 }" />
            </a-col>
            <a-col :span="2" :offset="1" class="delBtn">
              <a-button type="danger" preIcon="icon-ym icon-ym-nav-close" @click="handleDelSql(i)"> </a-button>
            </a-col>
          </a-row>
        </a-form-item-rest>
      </template>
      <template #interfaceId="{ model, field }">
        <interface-modal :value="model[field]" :title="dataForm.interfaceName" :hasPage="0" dataType="1,3" @change="onInterfaceChange" />
      </template>
    </BasicForm>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { computed, reactive, toRefs, watch, nextTick, toRaw } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm, FormSchema } from '/@/components/Form';
  import { getPrintTemplateDetail } from '/@/api/system/printTemplate';
  import { getInnermaterialnumberlist } from '/@/api/basicData/processrulestemplate';
  import { getFields } from '/@/api/system/printDev';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useBaseStore } from '/@/store/modules/base';
  import { getDataSourceSelector } from '/@/api/systemData/dataSource';
  import InterfaceModal from './components/LydcPrintDesign/src/components/InterfaceModal.vue';
  import { getdropdownlist } from '/@/api/business/projectMember';
  //状态//
  interface State {
    treeData: any;
    dataForm: any;
    dbOptions: any[];
    sqlTemplate: any[];
    parameterJson: any[];
    showPrint: boolean;
    fieldList: any[];
    id: string;
    [x: string]: any;
  }
  const { t } = useI18n();
  const state = reactive<State>({
    id: '',
    treeData: [],
    dataForm: {
      id: '',
      fullName: '',
      enCode: '',
      dbLinkId: '0',
      type: 1,
      enabledMark: 1,
      sortCode: 0,
      category: '',
      sqlTemplate: '',
      leftFields: '',
      printTemplate: '',
      description: '',
      sourceType: 0,
      immediateCustomerCode: '',
    },
    dbOptions: [],
    sqlTemplate: [],
    parameterJson: [],
    showPrint: true,
    showPrintDesign: true,
    fieldList: [],
  } as State);
  const { dataForm, sqlTemplate } = toRefs(state);
  const baseStore = useBaseStore();
  const schemas: FormSchema[] = [
    {
      field: 'name',
      label: '模板名称',
      component: 'Input',
      componentProps: { placeholder: '请输入', maxlength: 50 },
      rules: [{ required: true, trigger: 'blur', message: '必填' }],
    },
    {
      field: 'firstCategoryCode',
      label: t('common.templateClass'),
      component: 'ApiSelect',
      componentProps: {
        api: () => baseStore.getDictionaryData('PrintTemplate.Category'),
        placeholder: '分类',
        labelField: 'fullName',
        valueField: 'enCode',
        notFoundContent: null,
        immediate: true,
      },
      rules: [{ required: true, trigger: 'change', message: '必填' }],
    },
    {
      field: 'productCode',
      label: '物料号',
      component: 'ApiSelect',
      componentProps: {
        api: getInnermaterialnumberlist,
        placeholder: '请选择物料',
        showSearch: true,
        apiSearch: {
          show: true,
          searchName: 'searchKey',
        },
        memoInputVal: true,
        resultField: 'data',
        filterOption: true,
        notFoundContent: null,
        immediate: true,
        useChangeCopy: true,
        labelField: 'code',
        valueField: 'code',
      },
      required: true,
    },
    {
      field: 'secondCategoryCode',
      component: 'ApiSelect',
      label: t('common.packagingMethod'),
      ifShow: ({ values }) => values.firstCategoryCode == 'PackagingLabel',
      componentProps: {
        api: () => baseStore.getDictionaryData('PrintTemplate.PackingLabel'),
        labelField: 'fullName',
        valueField: 'enCode',
        notFoundContent: null,
        immediate: true,
      },
      rules: [{ required: true, trigger: 'blur', message: '必填' }],
    },
    {
      field: 'immediateCustomerCode',
      label: '直接客户',
      component: 'ApiSelect',
      ifShow: ({ values }) => values.firstCategoryCode == 'PackagingLabel',
      componentProps: {
        placeholder: '直接客户',
        api: getdropdownlist,
        showSearch: true,
        apiSearch: {
          show: true,
          searchName: 'code',
        },
        params: {
          type: 2,
        },
        beforeFetch: params => {
          params.mainProcess = state.mainProcess || '1';
          params.insideProjectCode = getFieldsValue().insideProjectCode;
        },
        resultField: 'data',
        valueField: 'code',
        labelField: 'immediateCustomerCode',
        allowClear: true,
        filterOption: false,
        immediate: true,
        nameFormat: ['name', '/', 'code'],
      },
      rules: [{ required: true, trigger: 'blur', message: '必填' }],
    },
    {
      field: 'sourceType',
      label: t('dict.CommonCol.dataSourcesDesc'),
      defaultValue: 0,
      component: 'Radio',
      componentProps: {
        options: [
          { fullName: t('dict.CommonCol.CustomSQL'), id: 0 },
          { fullName: t('dict.CommonCol.dataInterface'), id: 1 },
        ],
        optionType: 'button',
        buttonStyle: 'solid',
        onChange: onSourceTypeChange,
      },
    },
    {
      ifShow: ({ values }) => values.sourceType == 0,
      field: 'tips',
      label: ' ',
      component: 'Alert',
      componentProps: { message: '默认打印的时候必须传业务主键@formId给SQL语句里面作为Where查询条件', type: 'warning', showIcon: true },
    },
    {
      ifShow: ({ values }) => values.sourceType == 0,
      field: 'dbLinkId',
      label: t('routes.systemData-dataSource'),
      component: 'Select',
      defaultValue: '0',
      componentProps: { placeholder: '请选择', allowClear: false, showSearch: true, fieldNames: { options: 'children' } },
      // rules: [{ required: true, trigger: 'change', message: '必填' }],
    },
    {
      ifShow: ({ values }) => values.sourceType == 0,
      field: 'sqlTemplate',
      label: t('dict.CommonCol.SQLStatement'),
      component: 'Select',
      slot: 'sqlTemplate',
      // required: true,
    },
    {
      ifShow: ({ values }) => values.sourceType == 1,
      field: 'interfaceId',
      label: t('dict.CommonCol.dataInterface'),
      slot: 'interfaceId',
      component: 'Select',
      // rules: [{ required: true, trigger: 'change', message: '必填' }],
    },
  ];
  const getTitle = computed(() => (state.id ? t('common.editText') : t('common.addText')));
  const emit = defineEmits(['register', 'reload', 'submit']);
  const { createMessage } = useMessage();
  const [registerModal, { closeModal, changeLoading, changeOkLoading }] = useModalInner(init);
  const [registerForm, { setFieldsValue, getFieldsValue, validate, resetFields, updateSchema, clearValidate }] = useForm({ labelWidth: 80, schemas: schemas });

  watch(
    () => state.sqlTemplate,
    value => {
      nextTick(() => {
        setFieldsValue({ sqlTemplate: value });
      });
    },
    { deep: true },
  );
  function onInterfaceChange(id, row) {
    state.fieldList = [];
    if (!id) {
      state.dataForm.interfaceId = '';
      state.dataForm.interfaceName = '';
      state.parameterJson = [];
      handleInterfaceInfo();
      return;
    }
    state.fieldList = row.fieldJson ? JSON.parse(row.fieldJson) : [];
    state.dataForm.interfaceId = id;
    state.dataForm.interfaceName = row.fullName;
    state.parameterJson = row.templateJson ? row.templateJson.map(o => ({ ...o, relationField: '', sourceType: 2 })) : [];
    handleInterfaceInfo();
    setTimeout(() => {
      clearValidate('interfaceId');
    }, 0);
  }
  function handleInterfaceInfo() {
    setFieldsValue({
      interfaceId: state.dataForm.interfaceId,
      interfaceName: state.dataForm.interfaceName,
    });
  }
  function init(data) {
    state.sqlTemplate = [];
    state.parameterJson = [];
    state.fieldList = [];
    state.dataForm.printTemplate = '';
    resetFields();
    clearValidate();
    state.id = data.id;
    getDataSource();
    if (state.id) {
      changeLoading(true);
      getPrintTemplateDetail(state.id).then(res => {
        state.dataForm = res.data;
        state.sqlTemplate = (state.dataForm.sqlTemplate && JSON.parse(state.dataForm.sqlTemplate)) || [];
        state.parameterJson = (state.dataForm.parameterJson && JSON.parse(state.dataForm.parameterJson)) || [];
        state.fieldList = state.dataForm.fieldJson ? JSON.parse(state.dataForm.fieldJson) : [];
        setFieldsValue(state.dataForm);
        changeLoading(false);
      });
    }
  }
  function getDataSource() {
    getDataSourceSelector().then(res => {
      let list = res.data.list || [];
      list = list.filter(o => o.children && o.children.length);
      if (list[0] && list[0].children && list[0].children.length) list[0] = list[0].children[0];
      delete list[0].children;
      state.dbOptions = list;
      updateSchema([{ field: 'dbLinkId', componentProps: { options: state.dbOptions } }]);
    });
  }
  function onSourceTypeChange(val) {
    state.dataForm.sourceType = val;
  }
  function handleAddSql() {
    state.sqlTemplate.push({ sql: '' });
  }
  function handleDelSql(i) {
    state.sqlTemplate.splice(i, 1);
  }
  function exist() {
    // if (!state.sqlTemplate.length) {
    //   createMessage.error('请输入SQL语句');
    //   return false;
    // }
    let isOk = true;
    for (let i = 0; i < state.sqlTemplate.length; i++) {
      const e = state.sqlTemplate[i];
      if (!e.sql) {
        createMessage.error(`第${i + 1}行SQL语句不能为空`);
        isOk = false;
        break;
      }
    }
    return isOk;
  }
  async function handleSubmit() {
    const values = await validate();
    if (!values) return;
    state.dataForm = {
      ...state.dataForm,
      ...values,
      sqlTemplate: JSON.stringify(state.sqlTemplate),
      parameterJson: JSON.stringify(state.parameterJson),
    };
    if (values.sourceType == 0) {
      if (!exist()) return;
      const query = {
        dbLinkId: values.dbLinkId,
        sqlTemplate: state.dataForm.sqlTemplate,
      };
      let res = await getFields(query);
      state.treeData = res.data;
    } else {
      // if (!state.fieldList?.length) return createMessage.error('请先设置数据接口的字段列表！');
      state.treeData = state.fieldList.map(o => ({ ...o, fullName: o.field + '(' + o.defaultValue + ')', id: o.defaultValue }));
      values.fieldJson = JSON.stringify(state.fieldList);
    }
    changeOkLoading(false);
    closeModal();
    if (getTitle.value == t('common.editText')) {
      emit('submit', values, state, state.treeData);
    } else {
      emit('submit', values, {}, state.treeData);
    }
    resetFields();
    emit('reload');
  }
</script>
<style scoped>
  /* body ::v-deep .ant-table-container {
    margin-top: 20px;
  }
  body ::v-deep .ant-table-body {
    max-height: 510px !important;
  } */
  ::v-deep(.ant-table-container) {
    /* 你的样式 */
    margin-top: 20px;
  }

  ::v-deep(.ant-table-body) {
    /* 你的样式 */
    max-height: 510px !important;
  }
</style>
