<template>
  <div class="pt-16px">
    <BasicForm @register="registerForm" />
  </div>

  <div class="d-flex" v-loading="isLoading">
    <TempList @onChange="onChangeFn" :tempList="state.tempListData" :operationType="curOperationType" ref="tempListRef" />
    <div class="basic-warp">
      <Subtitle :title="t('common.baseinfo')"></Subtitle>
      <TempForm @onChange="onChangeFn" :tempList="state.tempListData" :isShowTitleTips="false" ref="tempFormRef" :colSpan="8" class="basic-block" />
    </div>
  </div>
</template>
<script setup lang="ts">
  import { reactive, ref, nextTick } from 'vue';
  import TempForm from './tempForm.vue';
  import TempList from './tempList.vue';
  import { getProcrulesTempDetail } from '/@/api/basicData/processrulestemplate';
  import Subtitle from '/@/components/Subtitle/src/Subtitle.vue';
  import { BasicForm, FormSchema, useForm } from '/@/components/Form';
  import { useBaseStore } from '/@/store/modules/base';
  import { alllistbyfactory } from '/@/api/engineering/mould';
  import { ListByUserfactory } from '/@/api/productionPlan/processRoute';
  import { useI18n } from 'vue-i18n';
  const { t } = useI18n();
  interface State {
    dataForm: any;
    searchFormValue: string | null;
    tempListData: any[];
  }
  const state = reactive<State>({
    dataForm: {},
    searchFormValue: null,
    tempListData: [],
  });

  const baseStore = useBaseStore();
  const [registerForm, { validateFields, getFieldsValue, clearValidate, setFieldsValue }] = useForm({
    schemas: getSchemas(),
    layout: 'horizontal',
    labelWidth: 120,
  });
  const tempListRef = ref();
  const tempFormRef = ref();
  const curOperationType = ref('');
  const isLoading = ref(false);

  function getSchemas(): FormSchema[] {
    return [
      {
        field: 'orgId',
        label: '工厂',
        component: 'ApiSelect',
        componentProps: {
          placeholder: '请选择工厂',
          api: ListByUserfactory,
          labelField: 'Name',
          valueField: 'Id',
          filterOption: false,
          notFoundContent: null,
          immediate: true,
          showSearch: true,
          useChangeCopy: true,
          resultField: 'data',
        },
        colProps: { span: 6 },
        rules: [{ required: true, trigger: 'blur' }],
      },
      {
        field: 'processIdList',
        label: t('dict.ProcessColumn.name'),
        component: 'ApiSelect',
        componentProps: {
          api: alllistbyfactory,
          mode: 'multiple',
          maxTagTextLength: 14,
          maxTagPlaceholder: '....',
          maxTagCount: 1,
          resultField: 'data',
          filterOption: (input: string, option: any) => {
            return option.label.toLowerCase().includes(input.toLowerCase());
          },
          notFoundContent: null,
          immediate: true,
          labelField: 'name',
          valueField: 'id',
        },
        colProps: {
          span: 6,
          style: {
            minWidth: '200px',
          },
        },
        rules: [
          {
            required: true,
            message: t('common.inputText'),
            trigger: 'blur',
            validator: (_rule, val) => {
              if (!val.length) return Promise.reject(t('common.inputText'));
              return Promise.resolve();
            },
          },
        ],
      },
      {
        field: 'operationType',
        label: t('dict.ProcessRules.OperationType'),
        component: 'ApiSelect',
        componentProps: {
          // numberToString: true,
          api: () => {
            return baseStore.getDictionaryData('ProcessRules.OperationType');
          },
          placeholder: '请选择',
          labelField: 'fullName',
          valueField: 'enCode',
          filterOption: false,
          notFoundContent: null,
          immediate: true,
          onChange: val => {
            curOperationType.value = val;
          },
        },
        colProps: {
          span: 6,
        },
        rules: [{ required: true, message: t('common.inputText'), trigger: 'blur' }],
      },
    ];
  }

  // 获取字段配置列表
  async function getProcrulesTempDetailFn(preSetType, id = '') {
    const { code, data } = await getProcrulesTempDetail({ id });
    if (code == 200) {
      if (!data.detailList) return;
      state.tempListData = data.detailList.map(o => {
        if (id) {
          o.fieldValue = o.fieldEnName === 'organize' && o.organizeIdTree ? o.organizeIdTree.split(',') : o.fieldValue;
        } else {
          o.fieldValue = o.defaultValue;
        }
        return o;
      });
      nextTick(() => {
        const { processIdList, operationType, orgId } = data;
        curOperationType.value = operationType;

        let finalOperationType: null | string = null;
        if (preSetType) {
          finalOperationType = String(preSetType);
        } else if (operationType) {
          finalOperationType = String(operationType);
        }

        const obj = {
          orgId,
          processIdList: processIdList || [],
          operationType: finalOperationType,
        };
        clearValidate();
        setFieldsValue(obj);
        isLoading.value = false;
      });
    }
  }

  function onChangeFn(data) {
    state.tempListData = data;
  }

  async function getParams() {
    const values = await validateFields();
    console.log(values);
    if (!values) return;
    const data = await tempFormRef.value.validateFormFn();
    if (!data) return;
    return { detailList: data, ...getFieldsValue() };
  }

  function init(data: any = {}) {
    isLoading.value = true;
    const { id, operationType } = data;
    getProcrulesTempDetailFn(operationType, id);
  }

  defineExpose({ getParams, init });
</script>

<style lang="less" scoped>
  .d-flex {
    display: flex;
    height: 80vh;
  }

  .basic-warp {
    width: 100%;
    padding: 16px 24px;
  }

  .basic-block {
    border: 1px solid #e1e1e1;
    padding: 24px 0 100px 24px;
    border-radius: 8px;
  }
</style>
