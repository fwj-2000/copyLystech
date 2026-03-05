<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    :showOkBtn="state.pageType == 'edit' || state.pageType == 'review'"
    :okText="t('common.submit')"
    :cancelText="t('common.closeText')"
    :okButtonProps="okBtnProps"
    :title="title"
    destroyOnClose
    class="full-popup"
    @ok="handleSave">
    <template #insertToolbar>
      <div v-if="state.idList.length > 1">
        <!-- 历史数据包含量试和报价，数据不同库，暂不介入 -->
        <!-- <a-button @click="useHistoryData">引用历史数据</a-button> -->
        <!-- <a-divider type="vertical" class="ml-10px"></a-divider> -->
        <a-button @click="handlePrev" :disabled="state.currentIndex === 0">上一个</a-button>
        <a-button @click="handleNext" :disabled="state.currentIndex === state.idList.length - 1" type="primary" class="ml-8px">下一个</a-button>
        <!-- <a-divider type="vertical" class="ml-10px"></a-divider> -->
      </div>
    </template>
    <ScrollContainer style="background: #ebeef5">
      <div class="review-popup">
        <div class="card py-16px px-24px">
          <Subtitle :title="t('views.quantitation.common.basicInfo')" />
          <!-- <CustomTable :columns="state.columnList" :basicInfo="state.basicInfo" :extra="state.extra" /> -->
          <!-- <CustomRows :list="state.basicInfoList" /> -->
        </div>
        <div class="card py-16px px-24px mt-16px">
          <!-- <Subtitle :title="t('views.quantitation.common.reviewInfo')" /> -->
          <BasicForm @register="registerBasicInfoForm" />
        </div>
        <!-- <MaterialTable
          class="mt-16px rounded-8px"
          :columns="MATERIAL_TABLE_COLUMNS"
          title="材料清单BOM"
          :list="state.EngineeringMaterials"
          :detailed="!editable"
          ref="materialTableRef" /> -->
        <!-- <MaterialTable class="mt-16px rounded-8px" :columns="SILICONE_TABLE_COLUMNS" title="硅胶件" /> -->
        <!-- <MaterialTable class="mt-16px rounded-8px" :columns="PACKAGE_TABLE_COLUMNS" title="包材" :list="state.EngineeringPackagingMaterials" :detailed="!editable" ref="packageTableRef" /> -->
        <!-- <MaterialTable
          class="mt-16px rounded-8px"
          :columns="PROCEDURE_TABLE_COLUMNS"
          title="基本流程Route"
          :list="state.EngineeringProcesses"
          :detailed="!editable"
          ref="procedureTableRef" /> -->
        <!-- <MaterialTable class="mt-16px rounded-8px" :columns="MOLD_TABLE_COLUMNS" title="模具" :list="state.EngineeringMoulds" :detailed="!editable" ref="moldTableRef" /> -->
        <!-- <div class="card py-16px px-24px mt-16px pb-32px">
          <Subtitle :title="t('views.quantitation.common.drawingInfo')" />
          <div class="flex justify-start items-baseline">
            <div class="font-bold text-14px text-gray-700 leading-22px">
              <div class="label">工程图纸</div>
              <FileUploader v-bind="productiondrawingsInfo" @uploadSuccess="handleUploadProductiondrawings" ref="productionDrawingsRef"></FileUploader>
            </div>
            <div class="font-bold text-14px text-gray-700 leading-22px ml-16px">
              <div class="label">生产资料</div>
              <FileUploader v-bind="engineerdrawingsInfo" @uploadSuccess="handleUploadEngineeringdrawings" ref="engineerDrawingsRef">
                <template #extra> 仅支持PDF（SOP，POP格式文件）</template>
              </FileUploader>
            </div>
          </div>
        </div> -->
      </div>
    </ScrollContainer>
  </BasicPopup>
</template>
<script lang="ts" setup>
  import { reactive, toRefs, onMounted, nextTick, ref, computed } from 'vue';
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { BasicForm, useForm } from '/@/components/Form';
  import { Subtitle } from '/@/components/Subtitle';
  // import CustomTable from '/@/views/business/quantitation/assess/components/CustomTable.vue';
  // import MaterialTable from '../../produce/components/MaterialTable.vue';
  import { ScrollContainer } from '/@/components/Container';
  import { MATERIAL_TABLE_COLUMNS, PROCEDURE_TABLE_COLUMNS } from '../config';
  // import { getEngineerInfo } from '/@/api/engineering/info';
  import { getEngineerInfoReviewDetail, reviewEngineerInfo } from '/@/api/engineering/review';
  import { CONDITIONAL_OPTIONS } from '../config';
  import dayjs from 'dayjs';
  // import CustomRows from '../../produce/components/CustomRows.vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { cloneDeep } from 'lodash-es';

  const { createMessage } = useMessage();

  const { t } = useI18n();

  const emits = defineEmits(['register', 'reload']);

  const materialTableRef = ref<any>(null);
  // const packageTableRef = ref<any>(null);
  const procedureTableRef = ref<any>(null);
  // const moldTableRef = ref<any>(null);
  // const productionDrawingsRef = ref<any>(null);
  // const engineerDrawingsRef = ref<any>(null);

  const basicInfoColumn = [
    { title: '量试单号', dataIndex: 'ApplyNo', sorter: true, width: 200 },
    { title: '产品内部料号', dataIndex: 'InnerMaterialNumber', sorter: true, width: 200 },
    { title: '工厂', dataIndex: 'Factory', key: 'Factory', width: 160, sorter: true },
    { title: '申请人', dataIndex: 'ApplyUserName', sorter: true, width: 200 },
    { title: '终端客户代码', dataIndex: 'TerminalCustomerCode', width: 120, sorter: true },
    { title: '终端项目代码', dataIndex: 'TerminalCustomerProjectCode', width: 120, sorter: true },
    { title: '终端客户料号', dataIndex: 'TerminalCustomerPartNumber', width: 120, sorter: true },
    { title: '终端项目阶段', dataIndex: 'ProjectPhase', width: 120, sorter: true },
    { title: '客户要求交期', dataIndex: 'CustomerDeliveryTime', width: 120, sorter: true },
    { title: '量试数量(pcs)', dataIndex: 'PeakQty', key: 'PeakQty', width: 160, sorter: true },
  ];

  interface State {
    listQuery: any;
    systemId: string;
    title: string;
    parentId: string;
    isDevPlatform: boolean;
    columnList: any[];
    extra: any;
    basicInfo: {};
    pageType: string;
    originType: string;
    currentIndex: number;
    currentId: string;
    idList: any[];
    EngineeringMaterials: any[];
    EngineeringMoulds: any[];
    EngineeringPackagingMaterials: any[];
    EngineeringProcesses: any[];
    EngineeringDrawingsId: string;
    ProductionMaterialsId: string;
    visible: Boolean;
    historyList: any[];
    initSchemes: any[];
    basicInfoList: any[];
  }

  const state = reactive<State>({
    columnList: basicInfoColumn,
    extra: { title: '产品描述', dataIndex: 'ProductDesc', key: 'ProductDesc', width: 160, sorter: true },
    listQuery: {
      category: 'Web',
      keyword: '',
      type: '',
      enabledMark: '',
    },
    systemId: '',
    title: '',
    parentId: '',
    isDevPlatform: false,
    basicInfo: {},
    pageType: 'edit',
    originType: '',
    currentIndex: 0,
    currentId: '',
    idList: [],
    EngineeringMaterials: [],
    EngineeringMoulds: [],
    EngineeringPackagingMaterials: [],
    EngineeringProcesses: [],
    EngineeringDrawingsId: '',
    ProductionMaterialsId: '',
    visible: false,
    historyList: [],
    initSchemes: [],
    basicInfoList: cloneDeep(basicInfoColumn),
  });

  // const productiondrawingsInfo = computed(() => {
  //   return {
  //     id: state.currentId
  //   };
  // });
  // const engineerdrawingsInfo = computed(() => {
  //   return {
  //     id: state.currentId,
  //     type: 2
  //   };
  // });

  const okBtnProps = reactive({
    disabled: false,
  });

  const editable = computed(() => {
    return state.pageType == 'edit';
  });

  const { title } = toRefs(state);

  // const isExperiment = computed(() => {
  //   const { ExperimentType } = getFieldsValue();
  //   console.log(getFieldsValue(), 'getFieldsValue');
  //   console.log(ExperimentType, 'ExperimentType');
  //   return ExperimentType == 1;
  // })

  const handleExperimentTypeChange = val => {
    console.log(val, !val, 'val');
    updateSchema({
      field: 'ExperimentDuration',
      label: '实验时长（H）',
      component: 'Input',
      // ifShow: opt => opt.values.ExperimentType != 1,
      componentProps: {
        maxlength: 50,
        disabled: !val,
        placeholder: val ? '' : '无需填写',
      },
      rules: [{ required: !!val, trigger: 'blur' }],
      colProps: { span: 5 },
    });
    setFieldsValue({ ExperimentDuration: '' });
    clearValidate();
  };

  const basicFormSchemas = [
    {
      field: 'FinishedProductQty',
      label: '产成品数量(pcs)',
      component: 'Input',
      labelWidth: 130,
      componentProps: { maxlength: 50 },
      rules: [{ required: true, trigger: 'blur' }],
    },
    {
      field: 'ExperimentType',
      label: '是否实验',
      component: 'Select',
      defaultValue: 0,
      labelWidth: 70,
      componentProps: {
        options: CONDITIONAL_OPTIONS,
        allowClear: false,
        onChange: handleExperimentTypeChange,
      },
    },
    {
      field: 'ExperimentDuration',
      label: '实验时长（H）',
      component: 'Input',
      labelWidth: 100,
      componentProps: {
        maxlength: 50,
        disabled: true,
        placeholder: '无需填写',
      },
      rules: [{ required: false, trigger: 'blur' }],
    },
    {
      field: 'OldInventoryHandle',
      label: '旧版库存处理方式',
      component: 'Input',
      labelWidth: 150,
      componentProps: { placeholder: '', maxlength: 50 },
      rules: [{ required: true, trigger: 'blur' }],
    },
    {
      field: 'EstimatedMoldTime',
      label: '预估模具交期',
      component: 'DatePicker',
      labelWidth: 130,
      componentProps: { placeholder: '请选择', format: 'YYYY-MM-DD' },
      rules: [{ required: true, trigger: 'blur' }],
    },
    {
      field: 'ReviewRemarks',
      label: '备注',
      component: 'Textarea',
      labelWidth: 70,
      componentProps: { rows: 1, maxlength: 200, autoSize: true },
      colProps: { sm: 18, span: 18 },
    },
  ] as any;

  const disabledBasicFormSchemas = [
    {
      field: 'FinishedProductQty',
      label: '产成品数量(pcs)',
      component: 'Input',
      labelWidth: 130,
      componentProps: { maxlength: 50, disabled: true },
      rules: [{ required: true, trigger: 'blur' }],
    },
    {
      field: 'ExperimentType',
      label: '是否实验',
      component: 'Select',
      defaultValue: 0,
      labelWidth: 70,
      componentProps: {
        options: CONDITIONAL_OPTIONS,
        allowClear: false,
        disabled: true,
        onChange: handleExperimentTypeChange,
      },
    },
    {
      field: 'ExperimentDuration',
      label: '实验时长（H）',
      component: 'Input',
      labelWidth: 100,
      componentProps: {
        maxlength: 50,
        disabled: true,
        placeholder: '无需填写',
      },
      rules: [{ required: false, trigger: 'blur' }],
    },
    {
      field: 'OldInventoryHandle',
      label: '旧版库存处理方式',
      component: 'Input',
      labelWidth: 150,
      componentProps: { placeholder: '', maxlength: 50, disabled: true },
      rules: [{ required: true, trigger: 'blur' }],
    },
    {
      field: 'EstimatedMoldTime',
      label: '预估模具交期',
      component: 'DatePicker',
      labelWidth: 130,
      componentProps: { placeholder: '请选择', format: 'YYYY-MM-DD', disabled: true },
      rules: [{ required: true, trigger: 'blur' }],
    },
    {
      field: 'ReviewRemarks',
      label: '备注',
      component: 'Textarea',
      labelWidth: 70,
      componentProps: { rows: 1, maxlength: 200, autoSize: true, disabled: true },
      colProps: { sm: 18, span: 18 },
    },
  ] as any;

  const [registerPopup, { closePopup, changeOkLoading }] = usePopupInner(init);
  const [registerBasicInfoForm, { validate, getFieldsValue, setFieldsValue, resetFields, updateSchema, resetSchema, clearValidate }] = useForm({
    schemas: state.initSchemes,
    labelWidth: 150,
    baseColProps: { span: 6 },
    actionColOptions: { span: 18 },
    autoSubmitOnEnter: true,
  });

  // const useHistoryData = () => {
  //   console.log('useHistoryData');
  //   state.visible = true;
  // }

  const handlePrev = () => {
    if (state.currentIndex === 0) return;
    state.currentIndex -= 1;
    state.currentId = state.idList[state.currentIndex];
    getDetailInfo();
    resetFields();
    reset();
  };

  const handleNext = () => {
    if (state.currentIndex === state.idList.length - 1) return;
    state.currentIndex += 1;
    state.currentId = state.idList[state.currentIndex];
    getDetailInfo();
    resetFields();
    reset();
  };

  const reset = () => {
    state.EngineeringMaterials = [];
    // state.EngineeringMoulds = [];
    // state.EngineeringPackagingMaterials = [];
    state.EngineeringProcesses = [];
    // state.EngineeringDrawingsId = '';
    // state.ProductionMaterialsId = '';
    materialTableRef.value.resetData();
    // moldTableRef.value.resetData();
    // packageTableRef.value.resetData();
    procedureTableRef.value.resetData();
    // productionDrawingsRef.value.resetUploadInfo();
    // engineerDrawingsRef.value.resetUploadInfo();
  };

  async function handleSave() {
    console.log('handleSave');
    changeOkLoading(true);
    reviewEngineerInfo(state.currentId)
      .then(res => {
        console.log(res, 'res');
        changeOkLoading(false);
        if (state.idList.length == 1) {
          emits('reload');
          closePopup();
        }
        createMessage.success(t('sys.api.operationSuccess'));
      })
      .catch(err => {
        console.log(err, 'err');
        createMessage.success(t('sys.api.operationFailed'));
        changeOkLoading(false);
      });
  }

  function getDetailInfo() {
    getEngineerInfoReviewDetail(state.currentId).then(res => {
      state.basicInfo = {
        ...res?.data,
      };
      state.EngineeringMaterials = res?.data?.EngineeringMaterials || [];
      // state.EngineeringMoulds = res?.data?.EngineeringMoulds || [];
      // state.EngineeringPackagingMaterials = res?.data?.EngineeringPackagingMaterials || [];
      state.EngineeringProcesses = res?.data?.EngineeringProcesses || [];
      // setFieldsValue({
      //   ...(res?.data || {}),
      //   EstimatedMoldTime: res.data?.EstimatedMoldTime && dayjs(res.data?.EstimatedMoldTime).tz().valueOf()
      // })
      res?.data?.FinishedProductQty && setFieldsValue({ FinishedProductQty: res?.data?.FinishedProductQty || '' });
      res?.data?.ExperimentType && setFieldsValue({ ExperimentType: res?.data?.ExperimentType || '' });
      res?.data?.ExperimentDuration && setFieldsValue({ ExperimentDuration: res?.data?.ExperimentDuration || '' });
      res?.data?.OldInventoryHandle && setFieldsValue({ OldInventoryHandle: res?.data?.OldInventoryHandle || '' });
      res?.data?.EstimatedMoldTime &&
        setFieldsValue({ EstimatedMoldTime: (res?.data?.EstimatedMoldTime && dayjs(res?.data?.EstimatedMoldTime).tz().valueOf()) || '' });
      materialTableRef.value.init();
      procedureTableRef.value.init();

      state.basicInfoList = state.basicInfoList.map(item => {
        return {
          ...item,
          label: item.title,
          value: state.basicInfo[item.dataIndex],
        };
      });
    });
  }

  function init(data) {
    console.log(data, 'init');
    state.idList = data.ids;
    state.title = data.title;
    state.pageType = data.type;
    state.originType = data.type;
    state.initSchemes = data.type == 'edit' ? basicFormSchemas : disabledBasicFormSchemas;
    resetSchema(state.initSchemes);
    // state.title = data.title + '的菜单管理';
    state.currentId = data.ids.length ? data.ids[0] : '';
    nextTick(() => getDetailInfo());
  }

  onMounted(() => {});
</script>

<style lang="less" scoped>
  .review-popup {
    background: #ebeef5;
    min-height: 100%;
    padding-top: 16px;
    padding-bottom: 32px;

    .card {
      background: #fff;
      border-radius: 8px;

      .label {
        color: #1a1a1a;

        /* 中文/正文14 */

        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: 22px; /* 157.143% */
      }
    }
  }
</style>
