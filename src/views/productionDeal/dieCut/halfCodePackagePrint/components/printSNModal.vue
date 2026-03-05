<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    :title="t('dict.CommonCol.packageLabelPrint')"
    destroy-on-close
    showOkBtn
    :showCancelBtn="false"
    @ok="handleSubmit"
    width="800px">
    <div class="mb-12px flex justify-start">
      <span>{{ t('dict.CommonCol.scanQRCode') }}：</span>
      <div class="w-1/2">
        <LydcInput
          :suffixIcon="'icon-ym icon-ym-scanCode'"
          v-model:value="translateInput"
          :placeholder="t('dict.CommonCol.scanQRCode')"
          @Keydown="handlerInputKeydown" />
      </div>

      <a-switch
        class="ml-120px"
        :checked-children="t('dict.PrintBoxType.1')"
        :un-checked-children="t('dict.PrintBoxType.2')"
        @change="switchChange"
        v-model:checked="isStandardBox" />
      <br />
    </div>
    <BasicForm @register="registerForm" @field-value-change="handleFieldValueChange"> </BasicForm>

    <div class="flex items-center justify-between mb-10px">
      <div class="flex justify-start">
        <div class="w-[70px]">{{ t('dict.CommonCol.scannedTotalNumber') }}：</div>
        <div class="w-[60px]">
          <LydcInput v-model:value="totalNumber" :disabled="scanCodeType !== 'SN'" />
        </div>
      </div>
      <a-button type="primary" ghost @click="handleClear">{{ t('common.cleanText') }}</a-button>
    </div>
    <Grid>
      <template #action="{ row }">
        <TableAction outside :actions="getTableActions(row)" />
      </template>
    </Grid>
  </BasicModal>
  <designindex v-show="false" ref="designindexPrint" />
</template>
<script setup lang="ts">
  import { ref, nextTick } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form';
  import { printSNFormSchema, STATUS_OPTIONS } from '../config';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { TableAction } from '/@/components/Table';
  import designindex from '/@/views/system/printTemplate/components/LydcPrintDesign/src/designIndex.vue';
  import {
    getAllPrintTemplate,
    GetCurrentDetailBySn,
    PrintSingleApi,
    getPrintTemplateDetail,
    appendPrint,
    getpacklabelprint,
  } from '/@/api/productionDeal/packagePrint';
  import { isEmpty } from '/@/utils/is';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { debounce } from '/@/utils/debounce';
  import dayjs from 'dayjs';
  import Decimal from 'decimal.js';
  import { message } from 'ant-design-vue';
  import { getdropdownlist } from '/@/api/business/projectMember';
  import { cloneDeep } from 'lodash-es';

  const translateInput = ref('');
  interface DesignindexPrintType {
    clickTemplate: (data: any) => void;
    previewPrint: (data: any) => void;
  }
  interface ScannedContentType {
    next: string;
    qty: number;
  }

  const { createConfirm } = useMessage();
  const scanCodeType = ref('');
  const isStandardBox = ref(true);
  const totalNumber = ref(0);
  const designindexPrint = ref<DesignindexPrintType>();
  const emit = defineEmits(['register', 'added', 'reload']);
  const { t } = useI18n();
  const [registerForm, { setFieldsValue, validate, updateSchema, resetFields, getFieldsValue }] = useForm({
    labelWidth: 180,
    schemas: printSNFormSchema,
    layout: 'vertical',
    baseColProps: { span: 12 },
    i18nConfig: {
      moduleCode: 'PackLabelPrintColumn',
      transferRange: ['label', 'placeholder'],
    },
  });

  const inCode = ref('');
  // 主页表格column配置
  const column = [
    {
      title: t('dict.CommonCol.seq'),
      field: 'sort',
      width: 50,
    },
    {
      title: 'SN/唯一码',
      field: 'snCode',
      i18nField: t('dict.CommonCol.SNorUniqueCode'),
      width: 160,
    },
    {
      // '内部料号'
      title: t('dict.CommonCol.innerMaterialDescription'),
      field: 'innerMaterialNumber',
      width: 160,
    },
    {
      // '包装类型'
      title: 'config',
      field: 'config',
      width: 80,
    },
    {
      // '线体类型'
      title: t('dict.CommonCol.lineType'),
      field: 'lineTypeName',
      width: 120,
    },
    {
      // '包装类型'
      title: t('dict.PackingType'),
      field: 'girdPackType',
      cellRender: {
        name: 'Tag',
        options: STATUS_OPTIONS,
      },
      width: 120,
    },
    {
      title: '操作',
      field: 'action',
      slots: { default: 'action' },
      width: 60,
      fixed: 'right',
    },
  ];

  const [Grid, { getDataSource, remove, loadData }] = useVbenVxeGrid({
    gridOptions: {
      id: 'productionDeal-dieCut-halfCodePackagePrint-snList',
      columns: column,
      position: 'modal',
      toolbarConfig: {
        enabled: false,
      },
      pagerConfig: {
        autoHidden: true,
      },
      height: 210,
    },
  });

  // 操作
  function getTableActions(row) {
    return [
      {
        icon: 'icon-ym icon-ym-delete',
        onClick: handledelete.bind(null, row),
        toolTip: t('common.delText'),
      },
    ];
  }
  const ScannedContent = ref<ScannedContentType | null>({} as ScannedContentType | null);
  const currentContent = ref<ScannedContentType | null>({} as ScannedContentType | null);
  const [registerModal, { closeModal, changeLoading, changeOkLoading }] = useModalInner(init);

  // 补扫的才有inCode
  async function handleReScan(detail) {
    inCode.value = detail.inCode;
    // 补扫自动切换尾箱类型
    isStandardBox.value = false;
    totalNumber.value = detail.qty;
    scanCodeType.value = detail.scanCodeType;
    // 获取下一个包装的数据（类型、数量）
    const nextType = getNextType(detail.peQty, detail.inQty, detail.outQty, scanCodeType.value);
    // 获取当前包装的数据（类型、数量）
    currentContent.value = getNextType(detail.peQty, detail.inQty, detail.outQty, scanCodeType.value, 'current');
    if (isEmpty(ScannedContent.value)) {
      ScannedContent.value = nextType;
    }

    // 设置包装类型
    detail.girdPackType = ScannedContent.value?.next;
    setFieldsValue(detail);
    if (detail.qty < detail.inQty) {
      setFieldsValue({
        peQty: totalNumber.value,
      });
    } else {
      setFieldsValue({
        peQty: ScannedContent.value?.qty,
      });
    }

    updateSchema({
      field: 'peQty',
      componentProps: {
        min: 1,
        max: ScannedContent.value?.qty,
        disabled: false,
      },
    });
    // 获取直接客户和标签模板下拉数据
    getOptions(detail.innerMaterialNumber);
    await nextTick();
    const snList = detail.snList.map((item, index) => {
      return { ...item, girdPackType: detail.girdPackType, innerMaterialNumber: detail.innerMaterialNumber, sort: detail.snList.length - index };
    });

    loadData(snList);
  }

  async function getLocalStorageData(isRescan) {
    // isRescan: 是否是补扫，否就是单品打印
    const packageLocalStorageData = localStorage.getItem('halfCodePackageCache');
    const packageReScanLocalStorageData = localStorage.getItem('halfCodePackageReScanCache');
    let localData: any = null;
    if (isRescan && packageReScanLocalStorageData) {
      // 补扫
      localData = JSON.parse(packageReScanLocalStorageData!);
    } else if (!isRescan && packageLocalStorageData) {
      // 单品打印
      localData = JSON.parse(packageLocalStorageData!);
    }
    if (!localData) return;
    await nextTick();
    setFieldsValue(localData.formValue);
    loadData(localData.tableList);
    ScannedContent.value = cloneDeep(localData.scannedContent);
    currentContent.value = cloneDeep(localData.currentContent);
    isStandardBox.value = localData.isStandardBox;
    labelTemplateName.value = localData.labelTemplateName;
    code.value = localData.code;
    totalNumber.value = localData.totalNumber;
    scanCodeType.value = localData.scanCodeType;
    ImmediateCustomerCode.value = localData.immediateCustomerCode;
    ImmediateCustomerName.value = localData.immediateCustomerName;
    if (isRescan) {
      inCode.value = localData.inCode;
    }
    getOptions(localData.innerMaterialNumber);
    if (!isStandardBox.value) {
      updateSchema({
        field: 'peQty',
        componentProps: {
          disabled: false,
        },
      });
    }
  }

  const configparam = ref({
    validCNCLs: '0',
    validateConfig: '0',
  });

  async function getConfigparam() {
    const { data } = await getpacklabelprint();
    if (!data) return;
    configparam.value.validCNCLs = data.validCNCLs || '0';
    configparam.value.validateConfig = data.validateConfig || '0';
  }

  async function init({ detail }) {
    ScannedContent.value = {} as ScannedContentType | null;
    translateInput.value = '';
    labelTemplateName.value = '';
    isStandardBox.value = true;
    totalNumber.value = 0;
    code.value = '';
    inCode.value = '';
    configparam.value = {
      validCNCLs: '0',
      validateConfig: '0',
    };
    resetFields();
    getConfigparam();

    if (detail && detail.snList) {
      // 有snList就说明不是缓存中取的数据，是对新的码进行补扫
      handleReScan(detail);
      return;
    }
    // 判断是否有缓存数据，有缓存数据需要将缓存数据渲染页面
    // 单品打印没有detail，补扫有detail
    getLocalStorageData(detail);
  }

  const code = ref('');
  const handlerInputKeydown = async (e: any) => {
    if (e.keyCode !== 13) return;
    const val = e.target._value;

    labelTemplateName.value = '';
    handlerInputChangeFn(val);
  };

  const labelTemplateName = ref('');
  const ImmediateCustomerCode = ref('');
  const ImmediateCustomerName = ref('');

  // 切换直接客户
  const immediateCustomerChange = (allPrintTemplate, option) => {
    // 根据直接客户过滤标签模板
    ImmediateCustomerCode.value = option.code;
    ImmediateCustomerName.value = option.name;
    const newRes =
      allPrintTemplate.filter(item => {
        if (item.immediateCustomerCode === option.code && item.secondCategoryCode === ScannedContent.value?.next) {
          return item;
        }
      }) || [];
    updateSchema({
      field: 'labelTemplateId',
      componentProps: {
        options: newRes.map(item => {
          return {
            fullName: item.name,
            enCode: item.id,
          };
        }),
        fieldNames: { value: 'enCode' },
        onChange: (e, { fullName }) => {
          labelTemplateName.value = fullName;
        },
      },
    });

    if (newRes.length === 1) {
      setFieldsValue({
        labelTemplateId: newRes[0]?.id,
      });
      labelTemplateName.value = newRes[0]?.name;
    }
  };

  // 获取直接客户及包装模板下拉数据
  const getOptions = async innerMaterialNumber => {
    if (!innerMaterialNumber) return;
    // 获取所有模板
    const res = await getAllPrintTemplate({ productCode: innerMaterialNumber, firstCategoryCode: 'PackagingLabel' });
    // secondCategoryCode-指包装类型
    // 根据下一个打印的类型 获取下一个要打印的模板
    const packTypeFilterRes = res.data.filter(item => item.secondCategoryCode === ScannedContent.value?.next);
    // 获取所有直接客户
    const CustomerFilterList = Array.from(new Set(packTypeFilterRes.map(item => item.immediateCustomerName)));
    // 获取所有直接客户
    const { data: customerList } = await getdropdownlist({ mainProcess: 1, type: 2 });
    const customerOptions = customerList.filter(item => CustomerFilterList.includes(item.fullName));

    //  获取标签模板下拉数据
    updateSchema({
      field: 'immediateCustomer',
      componentProps: {
        options: customerOptions,
        nameFormat: ['name', '/', 'code'],
        valueField: 'code',
        onChange: (e: any, option) => {
          immediateCustomerChange(res.data, option);
        },
      },
    });
    await nextTick();
    if (customerOptions && customerOptions.length === 1) {
      setFieldsValue({
        immediateCustomer: customerOptions[0].id,
      });
      immediateCustomerChange(res.data, customerOptions[0]);
    }
  };

  const handleFieldValueChange = debounce(async () => {
    const innerMaterialNumber = getFieldsValue().innerMaterialNumber;
    setLocalstoragePackage(innerMaterialNumber);
  }, 300);

  function setLocalstoragePackage(innerMaterialNumber) {
    const formValue = getFieldsValue();
    const tableList = getDataSource();
    const scannedContent = ScannedContent.value;
    const packageLocalStorage: any = {
      formValue,
      tableList,
      scannedContent,
      currentContent: currentContent.value,
      isStandardBox: isStandardBox.value,
      labelTemplateName: labelTemplateName.value,
      code: code.value,
      totalNumber: totalNumber.value,
      scanCodeType: scanCodeType.value,
      immediateCustomerCode: ImmediateCustomerCode.value,
      immediateCustomerName: ImmediateCustomerName.value,
      innerMaterialNumber,
    };

    if (inCode.value) {
      // 补扫
      packageLocalStorage.inCode = inCode.value;
      localStorage.setItem('halfCodePackageReScanCache', JSON.stringify(packageLocalStorage));
    } else {
      // 单品打印
      localStorage.setItem('halfCodePackageCache', JSON.stringify(packageLocalStorage));
    }
  }

  const codePrefix = (code: string, strLen: number) => {
    return code ? code.slice(0, strLen) : '';
  };

  const handlerInputChangeFn = async (val: string) => {
    const tableList = getDataSource();
    // ScannedContent指下一个要打印的数据（类型、数量）
    // 判断扫的数量不能超过要扫描的数量
    if (tableList.length && tableList.length >= (isEmpty(ScannedContent.value) ? 0 : ScannedContent.value?.qty)) {
      translateInput.value = '';
      message.error(t('dict.CommonCol.scansMaximumTip'));
      return;
    }
    // 不能扫重
    if (tableList.length && tableList.some(item => item.snCode === translateInput.value)) {
      translateInput.value = '';
      message.error(t('dict.CommonCol.snExists'));
      return;
    }
    changeLoading(true);
    // 获取详情
    const { data } = await GetCurrentDetailBySn({ code: val }).finally(() => {
      changeLoading(false);
      translateInput.value = '';
    });
    if (configparam.value.validateConfig === '1' && data.config && tableList.length && data.config !== tableList[0].config) {
      message.warning(t('dict.CommonCol.inconsistentConfig'));
      return;
    }
    if (configparam.value.validCNCLs === '1' && data.lineType && tableList.length && data.lineType !== tableList[0].lineType) {
      message.warning(t('dict.CommonCol.lineTypeInconsistent'));
      return;
    }

    setFieldsValue({
      labelTemplateId: '',
    });

    if (data.scanCodeType === 'InnerCarton') {
      if (data.qty > data.inQty) return message.error(t('dict.CommonCol.scanIncorrectCode'));
      if (data.qty < data.inQty) {
        isStandardBox.value = false;
      }
    }

    // 根据料号前缀判断料号是否一致
    if (tableList.length && codePrefix(data.innerMaterialNumber, 10) !== codePrefix(tableList[0].innerMaterialNumber, 10)) {
      return message.error(t('dict.CommonCol.scanConsistentTip'));
    }

    //计算已扫总数
    totalNumber.value = Number(new Decimal(totalNumber.value).plus(new Decimal(data.qty || 0)));
    scanCodeType.value = data.scanCodeType;
    code.value = val;
    // 获取下一个包装的数据（类型、数量）
    const nextType = getNextType(data.peQty, data.inQty, data.outQty, scanCodeType.value);
    // 获取当前包装的数据（类型、数量）
    currentContent.value = getNextType(data.peQty, data.inQty, data.outQty, scanCodeType.value, 'current');

    if (isEmpty(ScannedContent.value)) {
      ScannedContent.value = nextType;
    } else if (JSON.stringify(ScannedContent.value) !== JSON.stringify(nextType)) {
      // 只能扫描同一个类型
      return message.error(t('dict.CommonCol.scanSamePackageTypeTip'));
    }
    // 设置包装类型
    data.girdPackType = ScannedContent.value?.next;
    setFieldsValue(data);
    if (isStandardBox.value === false) {
      const peQtyValue = getFieldsValue().peQty;
      if (peQtyValue) {
        setFieldsValue({ peQty: peQtyValue });
      } else if (data.scanCodeType === 'InnerCarton' && data.qty < data.inQty) {
        setFieldsValue({
          peQty: totalNumber.value,
        });
      } else {
        setFieldsValue({
          peQty: ScannedContent.value?.qty,
        });
      }
    } else {
      setFieldsValue({
        peQty: ScannedContent.value?.qty,
      });
    }

    updateSchema({
      field: 'peQty',
      componentProps: {
        min: 1,
        max: ScannedContent.value?.qty,
      },
    });
    let tableData = [data, ...tableList];
    tableData = tableData.map((item, index) => {
      return {
        ...item,
        sort: tableData.length - index,
      };
    });
    await loadData(tableData);
    setLocalstoragePackage(data.innerMaterialNumber);
    // 获取直接客户和标签模板下拉数据
    getOptions(data.innerMaterialNumber);
  };

  const switchChange = e => {
    updateSchema({
      field: 'peQty',
      componentProps: {
        disabled: e,
      },
    });
    if (e) {
      setFieldsValue({
        peQty: ScannedContent.value?.qty,
      });
    } else {
      setFieldsValue({
        peQty: totalNumber.value,
      });
    }
    const innerMaterialNumber = getFieldsValue().innerMaterialNumber;
    setLocalstoragePackage(innerMaterialNumber);
  };

  const handledelete = row => {
    totalNumber.value = Number(new Decimal(totalNumber.value).minus(new Decimal(row.qty || 1)));
    remove(row);
  };

  function removeStorage() {
    if (inCode.value) {
      // 补扫
      localStorage.removeItem('halfCodePackageReScanCache');
    } else {
      // 单品打印
      localStorage.removeItem('halfCodePackageCache');
    }
  }

  function handleClear() {
    createConfirm({
      iconType: 'warning',
      title: t('common.tipTitle'),
      content: t('dict.CommonCol.clearSNDataTip'),
      onOk: async () => {
        removeStorage();
        closeModal();
      },
    });
  }

  //提交
  async function handleSubmit() {
    const tableList = getDataSource();
    if (!tableList.length) return message.error(t('dict.CommonCol.scanLabelTip'));
    const values = await validate();
    if (!values) return;
    if (isStandardBox.value && tableList.length < (ScannedContent.value?.qty ?? 1) / (currentContent.value?.qty ?? 1)) {
      message.error(t('dict.CommonCol.scanEnoughLabelsTip'));
      return;
    }
    if (Number(values.peQty) !== Number(totalNumber.value)) return message.error(t('dict.CommonCol.quantityMismatch'));

    if (!code.value) return message.warning(t('dict.CommonCol.scanAtLeastOneSN'));

    if (!values) return;
    const { packDate, labelTemplateId, remark } = values;
    changeOkLoading(true);
    const params: any = {
      labelTemplateId,
      labelTemplateName: labelTemplateName.value,
      printQty: 1,
      packDate: dayjs(packDate).format('YYYY-MM-DD'),
      code: code.value,
      qty: totalNumber.value,
      remark,
      snList: tableList.map(item => item.snCode),
      secondCategoryCode: ScannedContent.value?.next,
      scanCodeType: scanCodeType.value,
      immediateCustomerCode: ImmediateCustomerCode.value,
      immediateCustomerName: ImmediateCustomerName.value,
      config: tableList[0].config,
    };
    if (inCode.value) {
      params.inCode = inCode.value;
    }
    const api = inCode.value ? appendPrint : PrintSingleApi;
    const { data } = await api(params).finally(() => {
      changeOkLoading(false);
    });
    removeStorage();
    getPrintTemplateDetail(labelTemplateId).then(res => {
      emit('reload');
      closeModal();
      if (currentContent.value?.next == 'SN' && ScannedContent.value?.next == 'SmallPouch') {
        return;
      }
      if (designindexPrint.value && designindexPrint.value.clickTemplate) {
        designindexPrint.value.clickTemplate(res.data);
        designindexPrint.value.previewPrint([data]);
      }
    });
  }

  // 获取下一个要打印的包装类型
  function getNextType(
    peQty: number,
    inQty: number,
    outQty: number,
    currentType: string,
    direction: 'forward' | 'current' = 'forward', // 添加direction参数来控制搜索方向
  ): { next: string; qty: number } | null {
    const steps = ['SN', 'SmallPouch', 'InnerCarton', 'OuterCarton'];
    const qtyMap: Record<string, number> = {
      SmallPouch: peQty,
      InnerCarton: inQty,
      OuterCarton: outQty,
    };

    if (direction === 'current') {
      // 当前项搜索：直接检查当前项的数量
      const currentQty = qtyMap[currentType];
      return { next: currentType, qty: currentQty };
    }

    // 正向搜索
    const currentIndex = steps.indexOf(currentType);
    if (currentIndex === -1 || currentIndex === steps.length - 1) {
      return null;
    }

    for (let i = currentIndex + 1; i < steps.length; i++) {
      const next = steps[i];
      const qty = qtyMap[next];
      if (qty > 0) {
        return { next: next, qty: qty };
      }
    }

    return null;
  }
</script>

<style lang="less" scoped>
  :deep(.icon-ym-scanCode) {
    color: #ff7b00 !important;
  }

  ::v-deep(.ant-switch) {
    background: #1890ff;
  }

  ::v-deep(.ant-switch-checked) {
    background: #ff7b00;
  }
</style>
