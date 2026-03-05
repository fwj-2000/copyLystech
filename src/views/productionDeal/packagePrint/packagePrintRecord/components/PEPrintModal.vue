<template>
  <!--  -->
  <BasicModal v-bind="$attrs" @register="registerModal" title="PE包装标签打印" :showCancelBtn="false" okText="打印" @ok="handlePrint" :width="700">
    <div class="block-item">
      <div class="block-label">标签扫描</div>
      <LydcInput :suffixIcon="'icon-ym icon-ym-scanCode'" v-model:value="state.labelScan" :placeholder="t('common.scanText')" @Keydown="handlerInputKeydown" />
    </div>
    <BasicForm @register="registerForm"> </BasicForm>
    <template #insertFooter>
      <a-button type="primary" ghost class="ml-12px" @click="resetData">清空</a-button>
    </template>
  </BasicModal>
  <designindex v-show="false" ref="designindexPrint" />
</template>
<script setup lang="ts">
  import { ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form';
  import {
    getPackLabelInfoForPrint,
    getMainProcessByInnerMaterialCode,
    getAllPrintTemplate,
    getPrintTemplateById,
    getPrintDataList,
  } from '/@/api/productionDeal/packagePrint';
  import { getdropdownlist } from '/@/api/business/projectMember';
  import { getPrintTemplateDetail } from '/@/api/system/printTemplate';
  import designindex from '/@/views/system/printTemplate/components/LydcPrintDesign/src/designIndex.vue';

  import { useI18n } from '/@/hooks/web/useI18n';
  // import { formSchemas } from '../config';
  import { useBaseStore } from '/@/store/modules/base';
  import { message } from 'ant-design-vue';

  const baseStore = useBaseStore();
  const emit = defineEmits(['register', 'added', 'reload']);
  const { t } = useI18n();

  const state = ref({
    labelScan: '', // 标签扫描
    workOrder: '', // 工单号
    fnumber: '', // '单据号'
    innerMaterialCode: '', // 内料编码
  });
  // 主要制程
  const mainProcess = ref('');

  interface designindexPrintType {
    clickTemplate: (data: any) => void;
    previewPrint: (data: any) => void;
  }
  const designindexPrint = ref<designindexPrintType>();

  const [registerModal, { closeModal, changeOkLoading }] = useModalInner(init);
  const immediateCustomerCode = ref(''); // 直接客户编码
  const customer = ref(''); // 直接客户名称

  const formSchemas = [
    {
      field: 'printBoxType',
      label: '箱子类型',
      component: 'ApiSelect',
      componentProps: {
        api: async () => {
          return {
            data: await baseStore.getDictionaryData('PrintBoxType'),
          };
        },
        resultField: 'data',
        labelField: 'fullName',
        valueField: 'enCode',
        showSearch: true,
        filterOption: false,
        defaultFirstOption: true,
        onChange: e => {
          // 【箱子类型】为1的情况下【PE数量】禁用
          updateSchema({
            field: 'PeQuantity',
            componentProps: {
              disabled: e === '1' ? true : false,
            },
          });
        },
      },
    },
    {
      field: 'packType',
      label: '包装类型',
      component: 'ApiSelect',
      componentProps: {
        api: async () => {
          return {
            data: await baseStore.getDictionaryData('PackType'),
          };
        },
        resultField: 'data',
        labelField: 'fullName',
        valueField: 'enCode',
        showSearch: true,
        filterOption: false,
        defaultFirstOption: true,
        onChange: () => {
          // 切换【包装类型】的时候要将标签模板和详情数据清空
          // state.value.labelScan = '';
          // setFieldsValue({ innerMaterialCode: '', apn: '', peQuantity: '' });
          resetData();
        },
      },
    },
    {
      field: 'printNumber',
      label: '打印数量',
      component: 'InputNumber',
      componentProps: {
        placeholder: '打印数量',
        defaultValue: 1,
      },
    },
    {
      field: 'directCustomer',
      label: '直接客户',
      component: 'ApiSelect',
      componentProps: {
        api: getdropdownlist,
        showSearch: true,
        apiSearch: {
          show: true,
          searchName: 'code',
        },
        resultField: 'data',
        labelField: 'name',
        valueField: 'id',
        filterOption: false,
        notFoundContent: null,
        immediate: true,
        placeholder: '直接客户',
        beforeFetch: params => {
          params.type = 2;
          params.mainProcess = mainProcess.value || '1';
        },
        onChange: (_, option) => {
          immediateCustomerCode.value = option.code;
          customer.value = option.label;
          getLabelTemplateOptions();
        },
      },
    },
    // {
    //   field: 'labelTemplate',
    //   label: '标签模板',
    //   component: 'ApiSelect',
    //   componentProps: {
    //     api: getAllPrintTemplate,
    //     showSearch: false,
    //     resultField: 'data',
    //     labelField: 'name',
    //     valueField: 'id',
    //     filterOption: false,
    //     notFoundContent: null,
    //     immediate: true,
    //     placeholder: '标签模板',
    //     defaultFirstOption: true,
    //     alwaysLoad: true,
    //     beforeFetch: params => {
    //       console.log(getFieldsValue().directCustomer, 'directCustomer');
    //       // 后面需传入直接客户的选项
    //       params.immediateCustomerCode = '';
    //       params.secondCategoryCode = 'SmallPouch';
    //     },
    //   },
    //   onChange: () => {
    //     // 切换【标签模板】的时候要将标签模板和详情数据清空
    //     state.value.labelScan = '';
    //     setFieldsValue({ innerMaterialCode: '', apn: '', peQuantity: '' });
    //   },
    // },
    {
      field: 'labelTemplate',
      label: '标签模板',
      component: 'Select',
      componentProps: {
        //   api: getAllPrintTemplate,
        //   showSearch: false,
        //   resultField: 'data',
        // labelField: 'name',
        // valueField: 'id',
        //   filterOption: false,
        //   notFoundContent: null,
        //   immediate: true,
        placeholder: '标签模板',
        //   defaultFirstOption: true,
        //   alwaysLoad: true,
        //   beforeFetch: params => {
        //     console.log(getFieldsValue().directCustomer, 'directCustomer');
        //     // 后面需传入直接客户的选项
        //     params.immediateCustomerCode = '';
        //     params.secondCategoryCode = 'SmallPouch';
        //   },
      },
    },
    {
      field: 'remark',
      label: '备注',
      component: 'Textarea',
      componentProps: { placeholder: '请输入', autosize: true },
    },
    {
      field: 'innerMaterialCode',
      label: '内部料号',
      component: 'Input',
      componentProps: {
        disabled: true,
        placeholder: '内部料号',
      },
    },
    {
      field: 'apn',
      label: 'APN',
      component: 'Input',
      componentProps: {
        disabled: true,
        placeholder: 'APN',
      },
    },
    {
      field: 'peQuantity',
      label: 'PE数量',
      component: 'Input',
      componentProps: {
        disabled: true,
        placeholder: 'PE数量',
      },
    },
  ];

  async function getLabelTemplateOptions() {
    const { data } = await getAllPrintTemplate({ immediateCustomerCode: '', secondCategoryCode: 'SmallPouch' });
    updateSchema({
      field: 'labelTemplate',
      componentProps: {
        options: data.map(item => {
          return {
            fullName: item.name,
            enCode: item.id,
          };
        }),
        fieldNames: { value: 'enCode' },
      },
    });
    setFieldsValue({
      labelTemplate: data[0].id,
    });
  }

  const [registerForm, { setFieldsValue, updateSchema, resetFields, getFieldsValue }] = useForm({
    schemas: formSchemas,
    layout: 'vertical',
    labelWidth: 220,
    baseColProps: {
      span: 12,
    },
    // i18nConfig: {
    //   moduleCode: 'RepairMoldColumn',
    //   transferRange: ['placeholder', 'label'],
    // },
  });

  // 重置数据
  const resetData = () => {
    state.value.labelScan = '';
    setFieldsValue({
      printNumber: 1,
      directCustomer: '',
      labelTemplate: '',
      remark: '',
      innerMaterialCode: '',
      apn: '',
      peQuantity: '',
    });
  };

  async function init() {
    resetData();
  }

  const handlerInputKeydown = async (e: any) => {
    if (e.keyCode !== 13) return;
    const val = e.target._value;

    const arr = val.split('!') || [];
    if (arr.length < 3) return message.error('请扫描正确的标签');

    // 单据号
    state.value.fnumber = arr[0];
    // 内部料号
    state.value.innerMaterialCode = arr[1];
    // 工单号
    state.value.workOrder = arr[2];

    const { packType } = getFieldsValue();
    const params = {
      PackType: packType,
      InnerMaterialCode: state.value.innerMaterialCode,
    };
    // 先获取主要制程，这边的主要制程用于获取直接客户的下拉数据
    const res = await getMainProcessByInnerMaterialCode(params);
    mainProcess.value = res.data;
    // 获取详情数据
    const { data } = await getPackLabelInfoForPrint(params);
    const { InnerMaterialCode, APN, PeQuantity } = data;
    setFieldsValue({ innerMaterialCode: InnerMaterialCode, apn: APN, peQuantity: PeQuantity });
    state.value.labelScan = '';
  };

  const handlePrint = async () => {
    const formVal = getFieldsValue();
    if (!formVal.innerMaterialCode) return message.error('请先扫描流转标签');
    const params = {
      ImmediateCustomerCode: immediateCustomerCode.value, // 直接客户代码
      WorkOrder: state.value.workOrder, // 工单号
      Fnumber: state.value.fnumber, // 单据号
      LabelId: formVal.labelTemplate, // 标签模板id
      PrintQty: formVal.printNumber || 1, // 打印数量
      Qty: formVal.peQuantity, // PE数量
      InnerMaterialCode: formVal.innerMaterialCode, // 内部料号
      Customer: customer.value, //直接客户名称
      PrintType: 1, //打印类型默认为1
      PackType: Number(formVal.packType), //包装类型
      APN: formVal.apn, //APN
      Remark: formVal.remark, //备注
    };
    changeOkLoading(true);
    const { data } = await getPrintDataList(params).finally(() => changeOkLoading(false));
    getPrintTemplateDetail(getFieldsValue().labelTemplate).then(res => {
      if (designindexPrint.value && designindexPrint.value.clickTemplate) {
        designindexPrint.value.clickTemplate(res.data);
        designindexPrint.value.previewPrint(data);
      }
    });
  };
</script>
<style lang="scss" scoped>
  .block-item {
    margin-bottom: 12px;

    .block-label {
      margin-bottom: 8px;
    }
  }
</style>
