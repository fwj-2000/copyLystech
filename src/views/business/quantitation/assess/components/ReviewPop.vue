<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    :showOkBtn="state.editable"
    :okText="t('common.submit')"
    :okButtonProps="okBtnProps"
    :title="title"
    class="full-popup"
    @ok="handleSave"
    @open-change="handleVisibleChange">
    <template #insertToolbar>
      <div v-if="state.idList.length > 1">
        <a-button @click="handlePrev" :disabled="state.currentIndex === 0">上一个</a-button>
        <a-button @click="handleNext" :disabled="state.currentIndex === state.idList.length - 1" type="primary" class="ml-8px">下一个</a-button>
        <a-divider type="vertical" class="ml-10px"></a-divider>
      </div>
    </template>
    <div class="review-popup">
      <div class="py-16px px-24px">
        <Subtitle :title="t('views.quantitation.common.basicInfo')" />
        <CustomTable :columns="state.list" :extra="state.extra" :basicInfo="state.basicInfo" />
      </div>
      <div class="py-16px px-24px">
        <Subtitle :title="t('views.quantitation.common.drawingInfo')" />
        <div class="flex-none cursor-pointer" style="color: #ff7b00" @click="handlePreview">{{ state.basicInfo.DesensitizedDrawingsName || '暂无' }}</div>
      </div>
      <div class="py-16px px-24px">
        <Subtitle :title="t('views.quantitation.common.reviewInfo')" />
        <BasicForm layout="vertical" @register="registerForm" />
      </div>
    </div>
  </BasicPopup>
  <Preview ref="filePreviewRef" />
</template>
<script lang="ts" setup>
  import { reactive, toRefs, onMounted, ref } from 'vue';
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { Subtitle } from '/@/components/Subtitle';
  import { BasicForm, useForm } from '/@/components/Form';
  import CustomTable from './CustomTable.vue';
  import { PRODUCTION_TYPE_LIST, BASIC_INFO_COLUMNS, REVIEW_STATUS_EUMN } from '../config';
  import { getQuantationReviewInfo, quantitativeReview } from '/@/api/business/quantitation';
  import { dateUtil } from '/@/utils/dateUtil';
  import { useMessage } from '/@/hooks/web/useMessage';
  import Preview from '/@/components/Upload/src/components/Preview.vue';

  const { t } = useI18n();

  const { createMessage } = useMessage();
  const emits = defineEmits(['register', 'reload']);
  const basicInfoColumn = BASIC_INFO_COLUMNS;
  const filePreviewRef = ref<any>(null);

  interface State {
    title: string;
    list: any[];
    extra: any;
    basicInfo: any;
    splitNum: number;
    idList: any[];
    editable: boolean;
    currentIndex: number;
    currentId: string;
  }

  const state = reactive<State>({
    list: basicInfoColumn,
    extra: { title: 'PM备注', dataIndex: 'PMDesc', key: 'PMDesc', width: 110 },
    title: '',
    basicInfo: {},
    splitNum: 3,
    idList: [],
    editable: false,
    currentIndex: 0,
    currentId: '',
  });

  const okBtnProps = reactive({
    disabled: false,
  });

  const { title } = toRefs(state);

  const applySchemas = bool => {
    return [
      {
        field: 'ProductionType',
        label: '生产类型',
        component: 'Select',
        defaultValue: '1',
        componentProps: {
          options: PRODUCTION_TYPE_LIST,
          allowClear: false,
          disabled: bool,
        },
        rules: [{ required: !bool, trigger: 'blur', message: '' }],
      },
      {
        field: 'DeliveryTime',
        component: 'DatePicker',
        label: '外购时间',
        ifShow: opt => opt.values.ProductionType != '1',
        rules: [{ required: !bool, trigger: 'blur', message: '' }],
        componentProps: {
          disabled: bool,
        },
      },
      {
        field: 'OldInventoryHandle',
        component: 'Input',
        label: '旧库存处理方式',
        ifShow: opt => opt.values.ProductionType != '1',
        componentProps: {
          placeholder: t('common.inputText'),
          disabled: bool,
        },
      },
      {
        field: 'CustomerRequestDesc',
        component: 'Textarea',
        label: '客户要求',
        componentProps: {
          placeholder: t('common.inputText'),
          rows: 1,
          maxlength: 200,
          autoSize: { minRows: 1, maxRows: 5 },
          showCount: true,
          disabled: bool,
        },
      },
    ] as any;
  };

  const [registerPopup, { closePopup, changeOkLoading }] = usePopupInner(init);
  const [registerForm, { validate, resetFields, updateSchema, setFieldsValue, getFieldsValue }] = useForm({
    schemas: applySchemas(!state.editable),
    labelWidth: 100,
    baseColProps: { span: 8 },
    actionColOptions: { span: 24 },
    autoSubmitOnEnter: true,
    // submitFunc: handleSubmit,
  });

  function handlePrev() {
    if (state.currentIndex === 0) return;
    state.currentIndex -= 1;
    state.currentId = state.idList[state.currentIndex];
    getDetailInfo();
    resetFields();
  }

  function handleNext() {
    if (state.currentIndex === state.idList.length - 1) return;
    state.currentIndex += 1;
    state.currentId = state.idList[state.currentIndex];
    getDetailInfo();
    resetFields();
  }

  // async function handleSubmit() {
  //   const data = await validate();
  //   console.log(data, 'handleSubmit');
  // }
  function handleVisibleChange(v) {
    if (!v) {
      emits('reload');
    }
  }
  async function handleSave() {
    const values = await validate();
    console.log(getFieldsValue(), values, 'values-valid');
    if (!values) return;
    changeOkLoading(true);
    const { ProductionType, CustomerRequestDesc, DeliveryTime, OldInventoryHandle } = values;
    const params = {
      Id: state.currentId,
      CustomerRequestDesc,
      ProductionType,
      DeliveryTime: DeliveryTime ? dateUtil(DeliveryTime).format('YYYY-MM-DD') : '',
      OldInventoryHandle,
    };
    values?.ProductionType == '1' && Reflect.deleteProperty(params, 'DeliveryTime');
    values?.ProductionType != '1' && Reflect.deleteProperty(params, 'CustomerRequestDesc');
    quantitativeReview(params)
      .then(res => {
        createMessage.success(res.msg);
        changeOkLoading(false); //用于修改确认按钮的loading状态
        closePopup(); //关闭弹窗
        emits('reload');
      })
      .catch(() => {
        changeOkLoading(false);
      });
  }
  function handlePreview() {
    const params = {
      name: state.basicInfo.DesensitizedDrawingsName,
      Id: state.basicInfo.DesensitizedDrawingsId,
      previewType: 'localPreview',
      noCache: false,
      isCopy: 0,
    };
    filePreviewRef.value?.init(params);
  }

  function getDetailInfo() {
    const params = state.idList[state.currentIndex];
    if (!params) return;
    getQuantationReviewInfo(params).then(res => {
      const data = res.data[0];
      state.basicInfo = {
        ...data,
        IsDeclareCustoms: data?.IsDeclareCustoms ? '是' : '否',
        EPMStatus: data?.EPMStatus ? REVIEW_STATUS_EUMN[data?.EPMStatus] : '-',
      };
      console.log(dateUtil(data?.DeliveryTime).format('YYYY/MM/DD HH:mm:ss'), 'dateUtil(data?.DeliveryTime)');

      resetFields();
      setFieldsValue({
        ...data,
        DeliveryTime: data?.DeliveryTime ? dateUtil(data?.DeliveryTime).valueOf() : '',
        ProductionType: data?.ProductionType ? String(data?.ProductionType) : '1',
      });
    });
  }

  function init(data) {
    state.title = '量试评审' + (data.type == 'view' ? t('common.detailText') : '');
    state.idList = data.idList || [];
    state.editable = data.type == 'edit';
    state.currentIndex = 0;
    state.currentId = data.idList.length ? data.idList[0] : '';
    updateSchema(applySchemas(!state.editable));
    getDetailInfo();
  }
  onMounted(() => {});
</script>

<style lang="less" scoped>
  .review-popup {
    .basic-info {
      display: flex;
      flex-flow: wrap;
      border: 1px solid #ccc;

      .cell {
        // height: 42px;
        // line-height: 42px;
        // padding-left: 12px;
        border-right: 1px solid #ccc;
        border-bottom: 1px solid #ccc;
        display: flex;

        .label {
          width: 140px;
          background: #f3f3f3;
          color: #1a1a1a;

          /* 中文/正文14 */

          font-size: 14px;
          font-style: normal;
          font-weight: 400;
          line-height: 22px; /* 157.143% */
          padding: 10px 0 10px 12px;
          border-right: 1px solid #dbdbdb;
        }
      }

      .br-0 {
        border-right: none;
      }

      .bb-0 {
        border-bottom: none;
      }
    }
  }
</style>
