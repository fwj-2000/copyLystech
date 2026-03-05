<template>
  <BasicModal v-bind="$attrs" @register="registerModal" title="PE包装标签打印" :showOkBtn="false" :showCancelBtn="false" :width="700">
    <div class="package-block">
      <div class="block-left w-[70%]">
        <div class="block-item">
          <div class="block-label">箱子类型</div>
          <a-select class="block-content" v-model:value="state.printBoxType" placeholder="箱子类型" allowClear @change="printBoxTypeChange">
            <a-select-option :value="item.enCode" v-for="(item, index) in printBoxTypeOptions" :key="index">{{ item.fullName }}</a-select-option>
          </a-select>
        </div>
        <div class="block-item">
          <div class="block-label">包装类型</div>
          <a-select class="block-content" v-model:value="state.packType" placeholder="包装类型" allowClear @change="handlePackTypeChange">
            <a-select-option :value="item.enCode" v-for="(item, index) in packTypeOptions" :key="index">{{ item.fullName }}</a-select-option>
          </a-select>
        </div>
        <div class="block-item block-scan">
          <div class="block-label">标签扫描</div>
          <LydcInput
            class="block-content"
            :suffixIcon="'icon-ym icon-ym-scanCode'"
            v-model:value="state.labelScan"
            :placeholder="t('common.scanText')"
            @Keydown="handlerInputKeydown" />
        </div>
        <div class="block-item">
          <div class="block-label">打印数量</div>
          <a-input-number class="block-content" v-model:value="state.printNumber" placeholder="打印数量" />
        </div>
        <div class="block-item">
          <div class="block-label">直接客户</div>
          <div class="template-block">
            <!-- <a-input class="block-content" v-model:value="state.labelTemplate" placeholder="标签模板" disabled /> -->
            <a-select
              class="block-content"
              v-model:value="state.directCustomer"
              placeholder="直接客户"
              allowClear
              showSearch
              :default-active-first-option="false"
              :show-arrow="true"
              :filter-option="false"
              :not-found-content="null"
              @change="handleDirectCustomerChange"
              @search="handleDirectCustomerSearch">
              <a-select-option :value="item.id" v-for="(item, index) in directCustomerOptions" :key="index">{{ item.name }}</a-select-option>
            </a-select>
          </div>
        </div>
        <div class="block-item block-scan">
          <div class="block-label">标签模板</div>
          <div class="template-block">
            <!-- <a-button type="primary" ghost class="ml-2px">选择</a-button> -->
            <a-select
              class="block-content"
              :disabled="!state.directCustomer"
              v-model:value="state.labelTemplate"
              placeholder="标签模板"
              allowClear
              @change="handlePackTypeChange">
              <a-select-option :value="item.id" v-for="(item, index) in templateOptions" :key="index">{{ item.name }}</a-select-option>
            </a-select>
          </div>
        </div>
        <div class="block-item block-scan">
          <div class="block-label">备注</div>
          <div class="template-block">
            <a-textarea v-model:value="state.remark" placeholder="备注" allow-clear />
          </div>
        </div>
      </div>
      <div class="block-right">
        <div class="btn-block">
          <a-button type="primary" @click="handlePrint" :disabled="!state.labelTemplate">打印</a-button>
          <a-button type="primary" ghost class="ml-12px" @click="resetData">清空</a-button>
        </div>
      </div>
    </div>

    <BasicForm @register="registerForm"> </BasicForm>
  </BasicModal>
  <!-- <designindex v-show="false" ref="designindexPrint" /> -->
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
  // import { getPrintTemplateDetail } from '/@/api/system/printTemplate';
  // import designindex from '/@/views/system/printTemplate/components/LydcPrintDesign/src/designIndex.vue';

  import { useI18n } from '/@/hooks/web/useI18n';
  import { formSchemas } from '../config';
  import { useBaseStore } from '/@/store/modules/base';
  import { message } from 'ant-design-vue';

  const baseStore = useBaseStore();
  const emit = defineEmits(['register', 'added', 'reload']);
  const { t } = useI18n();

  const state = ref({
    printBoxType: '', // 箱子类型
    packType: '', // 包装类型
    labelScan: '', // 标签扫描
    printNumber: 1, // 打印数量
    directCustomer: '', // 直接客户
    labelTemplate: '', // 标签模板
    workOrder: '', // 工单号
    fnumber: '', // '单据号'
    innerMaterialCode: '', // 内料编码
    remark: '', // 备注
  });
  // 主要制程
  const mainProcess = ref('');
  // 包装类型下拉数据
  const packTypeOptions = ref<any>([]);
  // 箱子类型下拉数据
  const printBoxTypeOptions = ref<any>([]);
  // 标签模板下拉数据
  const templateOptions = ref<any[]>([]);
  // 直接客户下拉数据
  const directCustomerOptions = ref<any[]>([]);

  interface designindexPrintType {
    clickTemplate: (data: any) => void;
    previewPrint: (data: any) => void;
  }
  const designindexPrint = ref<designindexPrintType>();

  const [registerModal, { closeModal, changeOkLoading }] = useModalInner(init);

  const [registerForm, { setFieldsValue, validateFields: basicInfo, updateSchema, resetFields, getFieldsValue }] = useForm({
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

  // 获取包装类型下拉
  const getPackTypeList = async () => {
    packTypeOptions.value = (await baseStore.getDictionaryData('PackType')) || [];
    state.value.packType = packTypeOptions.value[0].enCode;
  };
  // 获取箱子类型下拉
  const getBoxTypeList = async () => {
    printBoxTypeOptions.value = (await baseStore.getDictionaryData('PrintBoxType')) || [];
    state.value.printBoxType = printBoxTypeOptions.value[0].enCode;
  };

  // 重置数据
  const resetData = () => {
    state.value.labelScan = '';
    state.value.printNumber = 1;
    state.value.directCustomer = '';
    state.value.labelTemplate = '';
    resetFields();
  };

  async function init() {
    resetData();
    getPackTypeList();
    getBoxTypeList();
  }

  const handlePackTypeChange = () => {
    state.value.labelScan = '';
    resetFields();
  };

  const printBoxTypeChange = e => {
    updateSchema({
      field: 'PeQuantity',
      componentProps: {
        disabled: e === '1' ? true : false,
      },
    });
  };

  const getDirectCustomerOptions = async params => {
    const { data } = await getMainProcessByInnerMaterialCode(params);
    mainProcess.value = data;
    const res = await getdropdownlist({ type: 2, mainProcess: data });
    directCustomerOptions.value = res.data;
  };

  const handleDirectCustomerSearch = async val => {
    const { data } = await getdropdownlist({ type: 2, mainProcess: mainProcess.value, code: val });
    directCustomerOptions.value = data;
  };

  const handleDirectCustomerChange = async value => {
    const { data } = await getAllPrintTemplate({ immediateCustomerCode: '', secondCategoryCode: 'SmallPouch' });
    templateOptions.value = data || [];
    state.value.labelTemplate = data[0]?.id;
  };

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

    const params = {
      PackType: state.value.packType,
      InnerMaterialCode: state.value.innerMaterialCode,
    };
    // 先获取主要制程，根据主要制程获取直接客户下拉数据
    getDirectCustomerOptions(params);

    const { data } = await getPackLabelInfoForPrint(params);
    setFieldsValue(data);
    state.value.labelScan = '';
  };

  const handlePrint = async () => {
    if (!state.value.labelTemplate) return;
    const immediateCustomerCode = directCustomerOptions.value.find(item => item.id === state.value.directCustomer)?.code;
    const customer = directCustomerOptions.value.find(item => item.id === state.value.directCustomer)?.name;
    const formVal = getFieldsValue();
    const params = {
      ImmediateCustomerCode: immediateCustomerCode, // 直接客户代码
      WorkOrder: state.value.workOrder, // 工单号
      Fnumber: state.value.fnumber, // 单据号
      LabelId: state.value.labelTemplate, // 标签模板id
      PrintQty: state.value.printNumber, // 打印数量
      Qty: formVal.PeQuantity, // PE数量
      InnerMaterialCode: state.value.innerMaterialCode, // 内部料号
      Customer: customer, //直接客户名称
      PrintType: 1, //打印类型
      PackType: Number(state.value.packType), //包装类型
      APN: formVal.APN, //APN
      Remark: state.value.remark, //备注
    };
    const { data } = await getPrintDataList(params);
    // getPrintTemplateDetail(state.value.labelTemplate).then(res => {
    //   if (designindexPrint.value && designindexPrint.value.clickTemplate) {
    //     designindexPrint.value.clickTemplate(res.data);
    //     designindexPrint.value.previewPrint(data);
    //   }
    // });
  };
</script>
<style lang="scss" scoped>
  .package-block {
    display: flex;
    .block-left {
      display: flex;
      flex-wrap: wrap;
      .block-item {
        width: 45%;
        margin-right: 12px;
        margin-bottom: 12px;
        &:last-child {
          margin-right: 0;
        }
        .block-label {
          width: 70px;
          margin-bottom: 4px;
        }
        .block-content {
          width: 100%;
        }
        .template-block {
          display: flex;
          align-items: center;
        }
      }
      .block-scan {
        width: 92%;
      }
    }
    .block-right {
      flex: 1;
      .btn-block {
        width: 100%;
        display: flex;
        justify-content: flex-end;
      }
    }
  }
</style>
