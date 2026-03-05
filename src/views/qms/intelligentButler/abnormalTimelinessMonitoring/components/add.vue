<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    :showOkBtn="showSubmitBtn"
    :okText="t('common.submitText')"
    :title="title"
    destroyOnClose
    class="full-popup"
    @ok="handleSubmit">
    <template #insertToolbar> </template>
    <ScrollContainer>
      <!-- 基础信息 -->
      <div class="pop-item-top">
        <subtitle :title="t('common.baseinfo')"></subtitle>
        <BasicForm @register="registerBasicForm"></BasicForm>
      </div>

      <div class="pop-item">
        <!-- 异常信息 -->
        <subtitle :title="t('common.exceptionMessage')"></subtitle>
        <BasicForm @register="registerAbnormalForm" :disabled="abnormalDisabled"> </BasicForm>
        <div>
          <!-- 异常图片 -->
          <Subtitle :title="t('common.imgInfo')"></Subtitle>
          <BasicForm @register="registerAbnormalImgForm" :disabled="abnormalDisabled"> </BasicForm>
        </div>
      </div>

      <!-- 处理结果-form -->
      <div class="pop-item" v-if="showProcessResultForm">
        <subtitle :title="t('common.processingResult')"></subtitle>
        <BasicForm @register="registerProcessResultForm"></BasicForm>
      </div>

      <!-- 处理结果-table -->
      <div class="pop-item mb-20px" v-if="showProcessResultTable">
        <Subtitle :title="t('dict.AbnormalTimelinessMonitoringColumn.processingResultRecord')"></Subtitle>
        <Grid></Grid>
      </div>
    </ScrollContainer>
  </BasicPopup>
</template>
<script lang="ts" setup>
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { computed, reactive, ref } from 'vue';
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { BasicForm, useForm } from '/@/components/Form';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { processResultSchema, abnormalForm, processResultColumn } from './config';
  import { ScrollContainer } from '/@/components/Container';
  import {
    getWorkOrderData,
    addData,
    updateData,
    reportData,
    ToDealwith,
    GetGroupInfoByJobNumber,
    GetInfoById,
  } from '/@/api/qms/iqc/abnormalTimelinessMonitoring';
  import { Subtitle } from '/@/components/Subtitle';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { cloneDeep } from 'lodash-es';
  import { useUserStore } from '/@/store/modules/user';
  const userStore = useUserStore();
  const managerId = userStore.userInfo?.managerId;

  const { t } = useI18n();
  const { createMessage } = useMessage();
  const emits = defineEmits(['register', 'reload', 'unReviewReload']);
  const machineNo = ref('');
  const factoryArea = ref('');

  const [registerPopup, { closePopup, changeLoading }] = usePopupInner(init);

  interface StateType {
    type: 'edit' | 'add' | 'detail' | 'report' | 'handlerProcess' | 'handlerDetail';
    id: string;
    status: number;
    total: 0;
    ids: [];
  }

  // 标题
  const title = computed(() => {
    const obj = {
      add: t('common.addText'),
      report: t('common.ExceptionReporting'),
      edit: t('common.editText'),
      detail: t('common.detailText'),
      handlerDetail: t('common.detailText'),
      handlerProcess: t('common.processText'),
    };
    return obj[state.type] || '';
  });

  // 有提交按钮的页面有：1、新增    2、异常上报   3、异常时效监控-待处理状态下的编辑进去的页面   4、处理人-处理按钮进去的页面
  const showSubmitBtn = computed(() => {
    const { type, status } = state;
    return type === 'add' || type === 'report' || (type === 'edit' && status === 2) || type === 'handlerProcess';
  });

  // 异常信息、异常图片：1、处理人-处理按钮 2、详情
  const abnormalDisabled = computed(() => {
    const { type } = state;
    return type === 'handlerProcess' || type === 'detail' || type === 'handlerDetail';
  });

  // 处理结果form：1、处理人-处理按钮
  const showProcessResultForm = computed(() => {
    const { type } = state;
    return type === 'handlerProcess';
  });

  // 处理结果table：1、详情且状态不为待上报、待处理
  const showProcessResultTable = computed(() => {
    const { type, status } = state;
    return (type === 'handlerDetail' || type === 'detail') && status !== 1 && status !== 2;
  });

  const state = reactive<StateType>({
    type: 'add',
    id: '',
    status: 1,
    total: 0,
    ids: [],
  });

  const schemas = [
    {
      field: 'workOrderNo',
      labelWidth: 250,
      label: '工单号',
      component: 'ApiSelect',
      componentProps: {
        placeholder: '请选择',
        api: getWorkOrderData,
        showSearch: true,
        apiSearch: {
          show: true,
          searchName: 'workOrderNo',
        },
        beforeFetch: (params: any) => {
          params.machineNo = machineNo.value;
          params.factoryArea = factoryArea.value;
        },
        afterFetch: ({ data }) => {
          if (!data || !data.length) return;
          // 根据工单号查询出basicForm的信息并赋值
          getworkOrderDetailFn(data[0]);
        },
        labelField: 'workOrderNo',
        valueField: 'workOrderNo',
        filterOption: false,
        notFoundContent: null,
        immediate: true,
        resultField: 'data',
      },
      rules: [{ required: true, message: '', trigger: 'blur' }],
      colProps: { span: 6 },
    },
    {
      field: 'innerMaterialNumber',
      label: '内部物料号',
      labelWidth: 250,
      component: 'Input',
      componentProps: {
        disabled: true,
        placeholder: '自动带入',
      },
      colProps: { span: 6 },
    },
    {
      field: 'fBizDate',
      label: '生产时间',
      component: 'DatePicker',
      componentProps: {
        format: 'YYYY-MM-DD HH:mm:ss',
        disabled: true,
      },
      colProps: { span: 6 },
    },
    {
      field: 'factoryAddress',
      labelWidth: 250,
      label: '厂区物理位置',
      component: 'Input',
      componentProps: {
        disabled: true,
        placeholder: '自动带入',
      },
      colProps: { span: 6 },
    },
    {
      field: 'classes',
      label: '班别',
      component: 'Select',
      componentProps: {
        disabled: true,
        placeholder: '班别',
        options: [
          { fullName: t('common.dayShift'), id: '1' },
          { fullName: t('common.nightShift'), id: '2' },
        ],
      },
      colProps: { span: 6 },
    },
    {
      field: 'machineNo',
      label: '机台号',
      component: 'Input',
      componentProps: {
        disabled: true,
        placeholder: '自动带入',
      },
      colProps: { span: 6 },
    },
  ];

  // 基础信息
  const [
    registerBasicForm,
    {
      updateSchema: updateSchemaBasic,
      setFieldsValue: setFieldsValueBasic,
      getFieldsValue: getFieldsValueBasic,
      resetSchema: resetSchemaBasic,
      validateFields: validateFieldsBasic,
    },
  ] = useForm({
    labelWidth: 120,
    baseColProps: { span: 6 },
    actionColOptions: { span: 24 },
    autoSubmitOnEnter: true,
    layout: 'vertical',
    i18nConfig: {
      moduleCode: 'AbnormalTimelinessMonitoringColumn',
      transferRange: ['label'],
    },
  });

  const [registerAbnormalForm, { getFieldsValue: getFieldsValueAbnormal, setFieldsValue: setFieldsValueAbnormal, validateFields: validateFieldsAbnormal }] =
    useForm({
      labelWidth: 220,
      layout: 'vertical',
      baseColProps: {
        span: 4,
      },
      i18nConfig: {
        moduleCode: 'AbnormalTimelinessMonitoringColumn',
        transferRange: ['label'],
      },
      schemas: abnormalForm,
    });

  //
  const [registerAbnormalImgForm, { getFieldsValue: getFieldsValueAbnormalImg, setFieldsValue: setFieldsValueAbnormalImg }] = useForm({
    schemas: [
      {
        field: 'pictures',
        label: '',
        component: 'ImageUpload',
        componentProps: {
          version: '2',
          placeholder: '',
          maxNumber: 6,
          maxSize: 10,
          updateType: 'all',
        },
        colProps: {
          span: 24,
        },
      },
    ],
  });

  const [
    registerProcessResultForm,
    {
      getFieldsValue: getFieldsValueProcessResult,
      validateFields: validateFieldsProcessResult,
      setFieldsValue: setFieldsValueProcessResult,
      resetSchema: resetSchemaProcessResult,
    },
  ] = useForm({
    labelWidth: 220,
    layout: 'vertical',
    baseColProps: {
      span: 4,
    },
    schemas: processResultSchema,
    i18nConfig: {
      moduleCode: 'AbnormalTimelinessMonitoringColumn',
    },
  });

  const [Grid, { reloadData: reloadDataProcessResult }] = useVbenVxeGrid({
    gridOptions: {
      id: 'qms-intelligentButler-abnormalTimelinessMonitoring-processResult-list',
      columns: processResultColumn,
      showIndexColumn: true,
      pagerConfig: {
        enabled: false,
      },
      height: 300,
      toolbarConfig: {
        enabled: false,
      },
      i18nConfig: {
        moduleCode: 'AbnormalTimelinessMonitoringColumn',
        otherConfig: {
          resizeable: true,
        },
      },
    },
  });

  const resetData = () => {
    state.id = '';
  };
  async function init(data) {
    resetData();
    const type = data.type;
    state.type = type;
    // 新增：基础信息里面的工单下拉数据根据机台号查询出来，工单号组件使用ApiSelect；且可以切换工单，查询对应工单下的基础信息。
    // 其他：数据从详情接口获取，工单号组件使用Input且不可编辑

    // 新增和异常上报：处理人根据 获取当前组长信息接口 查询获得
    // 其他：处理人根据详情接口获取
    if (type === 'add') {
      machineNo.value = data.machineNo;
      factoryArea.value = data.factoryArea;
      resetSchemaBasic(schemas);
      updateSchemaBasic({
        field: 'workOrderNo',
        componentProps: {
          onChange: (_, data) => {
            getworkOrderDetailFn(data);
          },
        },
      });
    } else {
      state.id = data.record.id;
      state.status = data.record.status;
      let newSchemas = cloneDeep(schemas);
      newSchemas[0] = {
        field: 'workOrderNo',
        label: '工单号',
        component: 'Input',
        componentProps: {
          disabled: true,
          placeholder: '自动带入',
        },
        colProps: { span: 6 },
      };
      resetSchemaBasic(newSchemas);
      // 根据id获取详情接口
      await getDetail();

      if (state.status == 3) {
        let newProcessResultSchema = cloneDeep(processResultSchema);
        newProcessResultSchema.splice(2, 0, {
          field: 'pdLeader',
          label: '审核人',
          component: 'CustomUserSelect',
          componentProps: {
            // multiple: true,
            // disabled: true,
          },
          i18nField: 'CommonCol.auditUserName',
          rules: [{ required: true, message: '', trigger: 'change' }],
          colProps: {
            span: 6,
          },
        });
        resetSchemaProcessResult(newProcessResultSchema);
        setFieldsValueProcessResult({ pdLeader: managerId });
      }
    }

    if (type === 'add' || type === 'report') {
      const { data } = await GetGroupInfoByJobNumber();
      setFieldsValueAbnormal({ introducerUserId: data.id });
    }
  }

  // 工单带出
  async function getworkOrderDetailFn(data) {
    setFieldsValueBasic({ ...data, classes: data.classes && data.classes.toString() });
  }

  // 根据详情接口获取数据-待处理
  async function getDetail() {
    changeLoading(true);
    const { data } = await GetInfoById({ id: state.id }).finally(() => changeLoading(false));
    const { baseInfo, exceptionInfo, picturesUrl, picturesName, dealList } = data;
    const pictures = picturesUrl
      ? picturesUrl.split(',').map((item, index) => {
          return {
            url: item,
            name: picturesName.split(',')[index],
          };
        })
      : [];
    setFieldsValueBasic({ ...baseInfo, classes: baseInfo.classes && baseInfo.classes.toString() });
    setFieldsValueAbnormal(exceptionInfo);
    setFieldsValueAbnormalImg({ pictures });
    if (showProcessResultTable.value) {
      reloadDataProcessResult(dealList);
    }
  }

  const validatePage = async () => {
    // 基础信息
    const basicInfo = await validateFieldsBasic();
    // 异常信息
    const abnormalInfo = await validateFieldsAbnormal();
    // 异常图片
    const abnormalImgInfo = getFieldsValueAbnormalImg();
    // // 处理结果信息
    const processResultInfo = showProcessResultForm.value ? await validateFieldsProcessResult() : {};
    return {
      basicInfo,
      abnormalInfo,
      abnormalImgInfo,
      processResultInfo,
    };
  };

  //提交-待处理
  const handleSubmit = async () => {
    const { basicInfo, abnormalInfo, processResultInfo, abnormalImgInfo } = await validatePage();
    const picturesUrl = abnormalImgInfo?.pictures?.map(item => item.url).join(',');
    const picturesName = abnormalImgInfo?.pictures?.map(item => item.name).join(',');
    const params = {
      ...basicInfo,
      ...abnormalInfo,
      picturesUrl,
      picturesName,
      factoryArea: factoryArea.value,
    };
    const dealwithParams = {
      id: state.id,
      ...processResultInfo,
    };
    if (state.id) {
      params.id = state.id;
    }
    const methodObj = {
      add: addData,
      edit: updateData,
      report: reportData,
      handlerProcess: ToDealwith,
    };
    changeLoading(true);
    methodObj[state.type](state.type === 'handlerProcess' ? dealwithParams : params)
      .then(res => {
        createMessage.success(res.msg);
        closePopup(); //关闭弹窗
        emits('reload');
      })
      .finally(() => {
        changeLoading(false);
      });
  };
</script>
<style lang="less" scoped>
  .pop-item {
    border-top: 10px solid #f0f0f0;
    padding: 20px 20px 0;
  }

  .pop-item-top {
    padding: 20px 20px 0;
  }
</style>
