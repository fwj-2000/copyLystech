<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    @ok="handleSaveAction"
    showOkBtn
    :okText="t('common.saveText')"
    :okButtonProps="{ class: 'mx-12px' }"
    destroyOnClose
    :cancelText="t('common.cancelText')"
    :title="t('dict.Module.LaborRate')">
    <div class="form-pd">
      <BasicForm @register="registerForm" :labelWidth="100">
        <!--        <template #supplierId>-->
        <!--          <a-select-->
        <!--            show-search-->
        <!--            :show-arrow="false"-->
        <!--            :filter-option="false"-->
        <!--            :not-found-content="null"-->
        <!--            :fieldNames="{-->
        <!--              label: 'name',-->
        <!--              value: 'id',-->
        <!--            }"-->
        <!--            placeholder="请选择终端项目代码"-->
        <!--            :options="supplierList"-->
        <!--            @search="handleDebounceSupplierSearch"-->
        <!--            @change="handleSupplierChange" />-->
        <!--        </template>-->
        <!--        <template #workingProcedure>-->
        <!--          <a-select-->
        <!--            show-search-->
        <!--            :show-arrow="false"-->
        <!--            :filter-option="false"-->
        <!--            :not-found-content="null"-->
        <!--            :fieldNames="{-->
        <!--              label: 'name',-->
        <!--              value: 'name',-->
        <!--            }"-->
        <!--            placeholder="请选择"-->
        <!--            :options="workingProcedureList"-->
        <!--            @search="handleDebounceWorkingProcedureSearch"-->
        <!--            @change="handleWorkingProcedureChange" />-->
        <!--        </template>-->
      </BasicForm>
      <BasicTable @register="registerTable">
        <template #bodyCell="{ column, text, index, record }">
          <template v-if="column.dataIndex === 'laborRateType'"> {{ laborRateType_MAP[text] }}</template>
          <template v-else-if="column?.dataIndex?.includes('Cost')">
            <InputNumber :min="0" :value="state['backDataSource'][index][column.dataIndex]" @change="handleInputCount(index, column, $event)"></InputNumber>
          </template>
          <template v-else-if="column.dataIndex === 'count'">
            <!-- {{evaluate(`${state['backDataSource'][index]['fixedCost']} + ${state['backDataSource'][index]['changeCost']}`) }}-->
            {{ add(bignumber(state['backDataSource'][index]['fixedCost']), bignumber(state['backDataSource'][index]['changeCost'])).toString() }}
          </template>
        </template>
      </BasicTable>
    </div>
  </BasicPopup>
</template>
<script lang="ts" setup>
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { BasicForm, FormSchema, useForm } from '/@/components/Form';
  import { reactive, toRefs } from 'vue';
  import { message } from 'ant-design-vue';
  import { useBaseStore } from '/@/store/modules/base';
  import { cloneDeep, debounce } from 'lodash-es';
  import {
    addBaseDataLaborrate,
    getBaseDataLaborrateGetworkingprocedurelist,
    getBaseDataShippingspaceGetfactorylist,
    getBaseDataSupplierList,
  } from '/@/api/purchase/rateOfWork';
  import { BasicColumn, BasicTable, useTable } from '/@/components/Table';
  import { add, bignumber } from 'mathjs';
  import InputNumber from '/@/components/Lydc/InputNumber/src/InputNumber.vue';
  import { useI18n } from '/@/hooks/web/useI18n';

  const baseStore = useBaseStore();
  const { t } = useI18n();

  const emit = defineEmits(['register', 'reload']);
  const [registerPopup, { closePopup, changeLoading }] = usePopupInner(init);
  const [registerForm, { setFieldsValue, validate, clearValidate, updateSchema, getFieldsValue }] = useForm({
    schemas: getFormSchema(),
    layout: 'vertical',
    // i18nConfig: {
    // 	moduleCode: 'LaborRateColumn'
    // }
  });

  // 1：基准 2：不含折扣 3：一年 4：两年 5：三年 6：五年 7：七年 8：八年 9：十年

  const laborRateType_MAP = {
    1: t('dict.LaborRateTypeEnum.1'),
    2: t('dict.LaborRateTypeEnum.2'),
    3: t('dict.LaborRateTypeEnum.3'),
    4: t('dict.LaborRateTypeEnum.4'),
    5: t('dict.LaborRateTypeEnum.5'),
    6: t('dict.LaborRateTypeEnum.6'),
    7: t('dict.LaborRateTypeEnum.7'),
    8: t('dict.LaborRateTypeEnum.8'),
    9: t('dict.LaborRateTypeEnum.9'),
  };

  interface StateType {
    backDataSource: any[];
    supplierList: any[];
    dataSource: any[];
    workingProcedureList: any[];
  }

  const templateState = [
    {
      laborRateType: 1,
      fixedCost: 0,
      changeCost: 0,
      count: 0,
    },
    {
      laborRateType: 2,
      fixedCost: 0,
      changeCost: 0,
      count: 0,
    },
    {
      laborRateType: 3,
      fixedCost: 0,
      changeCost: 0,
      count: 0,
    },
    {
      laborRateType: 4,
      fixedCost: 0,
      changeCost: 0,
      count: 0,
    },
    {
      laborRateType: 5,
      fixedCost: 0,
      changeCost: 0,
      count: 0,
    },
    {
      laborRateType: 6,
      fixedCost: 0,
      changeCost: 0,
      count: 0,
    },
    {
      laborRateType: 7,
      fixedCost: 0,
      changeCost: 0,
      count: 0,
    },
    {
      laborRateType: 8,
      fixedCost: 0,
      changeCost: 0,
      count: 0,
    },
    {
      laborRateType: 9,
      fixedCost: 0,
      changeCost: 0,
      count: 0,
    },
  ];

  const state = reactive<StateType>({
    backDataSource: cloneDeep(templateState),
    supplierList: [],
    workingProcedureList: [],
    dataSource: cloneDeep(templateState),
  });

  const { supplierList, dataSource, workingProcedureList } = toRefs(state);
  const columns: BasicColumn[] = [
    { title: t('dict.MaterialAreaColumn.typeName'), dataIndex: 'laborRateType', width: 120 },
    { title: t('dict.LaborRateColumn.fixedCost'), dataIndex: 'fixedCost', width: 220 },
    { title: t('dict.LaborRateColumn.changeCost'), dataIndex: 'changeCost', width: 220 },
    { title: t('dict.LaborRateColumn.count'), dataIndex: 'count', width: 220 },
  ];
  const [registerTable, { reload }] = useTable({
    columns,
    dataSource: state.dataSource,
    immediate: false,
    useSearchForm: false,
    showTableSetting: false,
    pagination: false,
  });

  async function init() {
    state.supplierList = [];
    state.workingProcedureList = [];
    state.dataSource = cloneDeep(templateState);
    state.backDataSource = cloneDeep(templateState);
    changeLoading(true);
    getTypeOps();
    setTimeout(() => {
      changeLoading(false);
    }, 100);
  }

  function handleSaveAction() {
    validate().then(async val => {
      if (!val) return;
      console.log(val);
      let data;
      try {
        data = state.backDataSource.map((item, index) => {
          if (!item.fixedCost) {
            throw new Error(`${t('common.inputPlaceholder')}${laborRateType_MAP[index + 1]}${t('dict.LaborRateColumn.fixedCost')}`);
          }
          if (!item.changeCost) {
            throw new Error(`${t('common.inputPlaceholder')}${laborRateType_MAP[index + 1]}${t('dict.LaborRateColumn.changeCost')}`);
          }

          return {
            ...item,
          };
        });
      } catch (e: any) {
        return message.error(e.message);
      }
      const { code, msg } = await addBaseDataLaborrate({
        ...val,
        laborRateDetailedCrInputs: data,
      });
      if (code === 200) {
        message.success(msg);
        closePopup();
        emit('reload');
      }
    });
  }

  function getFormSchema(): FormSchema[] {
    return [
      {
        field: 'mainProcess',
        label: t('dict.SalesSiteColumn.recordTable.mainProcessDesc'),
        component: 'Select',
        componentProps: { maxlength: 200 },
        colProps: {
          span: 6,
        },
        rules: [{ required: true, trigger: 'blur', message: t('common.required') }],
      },
      {
        field: 'workingProcedureId',
        label: t('dict.LaborRateColumn.workingProcedure'),
        component: 'ApiSelect',
        componentProps: {
          api: getBaseDataLaborrateGetworkingprocedurelist,
          showSearch: true,
          apiSearch: {
            show: true,
            searchName: 'keyword',
          },
          filterOption: false,
          notFoundContent: null,
          immediate: true,
          resultField: 'data',
          labelField: 'processName',
          valueField: 'id',
          maxlength: 50,
        },
        rules: [{ required: true, trigger: 'blur', message: t('common.required') }],
        colProps: {
          span: 6,
        },
      },
      // {
      //   field: 'productName',
      //   label: '设备类型',
      //   component: 'Input',
      //   componentProps: { placeholder: '请输入', maxlength: 50 },
      //   rules: [{ required: true, trigger: 'blur', message: '必填' }],
      //   colProps: {
      //     span: 6,
      //   },
      // },
      // {
      //   field: 'factory',
      //   label: '工厂',
      //   component: 'ApiSelect',
      //   componentProps: {
      //     api: getBaseDataShippingspaceGetfactorylist,
      //     placeholder: '请选择工厂',
      //     showSearch: true,
      //     apiSearch: {
      //       show: true,
      //       // 搜索字段名
      //       searchName: 'factoryCode',
      //     },
      //     labelField: 'Name',
      //     valueField: 'Code',
      //     resultField: 'data',
      //     filterOption: false,
      //     nameFormat: ['Code', '-', 'Name'],
      //     notFoundContent: null,
      //     immediate: true,
      //   },
      //   colProps: {
      //     span: 6,
      //   },
      // },
      {
        field: 'supplierName',
        label: t('dict.OutsourceManageColumn.supplier'),
        component: 'Input',
        componentProps: {
          maxlength: 50,
        },
        colProps: {
          span: 6,
        },
      },
      {
        field: 'specifications',
        label: t('dict.SampleApplyColumn.specifications'),
        component: 'Input',
        componentProps: { maxlength: 200 },
        // rules: [{ required: true, trigger: 'blur', message: '必填' }],
        colProps: {
          span: 6,
        },
      },
      {
        field: 'status',
        label: t('dict.SkillLevelColumn.Status'),
        component: 'Select',
        defaultValue: '1',
        componentProps: {
          maxlength: 50,
          options: [
            { fullName: t('common.disableText'), id: '0' },
            { fullName: t('common.enableText'), id: '1' },
          ],
          fieldNames: {
            label: 'fullName',
            value: 'id',
          },
        },
        rules: [{ required: true, trigger: 'change', message: t('common.required') }],
        colProps: {
          span: 6,
        },
      },
    ];
  }

  const handleDebounceSupplierSearch = debounce(handleSupplierSearch, 300);

  async function handleSupplierSearch(e) {
    const params = {
      name: e,
    };
    const { code, data } = await getBaseDataSupplierList(params);
    if (code === 200) {
      state.supplierList = data;
    }
  }

  function handleSupplierChange(val) {
    setFieldsValue({
      supplierId: val,
    });
  }

  function handleWorkingProcedureChange(val) {
    setFieldsValue({
      workingProcedure: val,
    });
  }

  const handleDebounceWorkingProcedureSearch = debounce(getWorkingProdureList, 300);

  async function getWorkingProdureList(val = '') {
    const { code, data } = await getBaseDataLaborrateGetworkingprocedurelist({
      sorkingProcedure: val,
    });
    if (code === 200) {
      state.workingProcedureList = data;
    }
  }

  function handleInputCount(index, column, e) {
    state.backDataSource[index][column.dataIndex] = e;
  }

  async function getTypeOps() {
    const list = await baseStore.getDictionaryData('MainProcess');

    updateSchema({
      field: 'mainProcess',
      componentProps: {
        options: list,
        fieldNames: { value: 'enCode', label: 'fullName' },
      },
    });
  }
</script>
<style scoped lang="less">
  .form-pd {
    padding: 12px 24px;
  }

  // 为返回按钮添加左边距
  :deep(.lydc-basic-popup-header) {
    padding-left: 12px;
  }
</style>
