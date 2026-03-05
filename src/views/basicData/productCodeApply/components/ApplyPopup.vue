<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    @ok="handleSaveAction"
    :showOkBtn="hasBtnP('btn_edit')"
    :okText="t('common.submitText')"
    destroyOnClose
    :title="t('dict.PartNumberApplyColumn.appDataApply')"
    class="full-popup top-0 code-apply-popup">
    <ScrollContainer>
      <div class="pop-item">
        <div class="title-stick">
          <div class="gun"></div>
          <div class="title">{{ t('common.baseinfo') }}</div>
        </div>
        <BasicForm @register="registerForm">
          <template #InsideProjectCode="{ model, field }">
            <lydc-select
              show-search
              :show-arrow="false"
              :filter-option="false"
              v-model:value="model[field]"
              :options="InsideProjectCodeOption"
              :not-found-content="null"
              :placeholder="t('common.insideProjectCodeTip')"
              :fieldNames="{
                label: 'InsideProjectCode',
                value: 'InsideProjectCode',
              }"
              @search="handleInsideProjectCodeSearch"
              @change="handleInsideProjectCodeChange"></lydc-select>
          </template>
          <!--          <template #ImmediateCustomerCode="{ model, field }">-->
          <!--            <lydc-select-->
          <!--              show-search-->
          <!--              :show-arrow="false"-->
          <!--              :filter-option="false"-->
          <!--              v-model:value="model[field]"-->
          <!--              :options="ImmediateCustomerCodeOption"-->
          <!--              :disabled="ImmediateCustomerCodeOption.length <= 0"-->
          <!--              :not-found-content="null"-->
          <!--              placeholder="请选择直接客户信息"-->
          <!--              :fieldNames="{-->
          <!--                label: 'fullName',-->
          <!--                value: 'customerCode',-->
          <!--              }"-->
          <!--              @search="handleImmediateCustomerCodeSearch"></lydc-select>-->
          <!--          </template>-->
        </BasicForm>
      </div>
      <BindFactory ref="factoryRef" :main-process="state.mainProcess"></BindFactory>
      <!--      <a-card style="margin-top: 10px">-->
      <!--        <div class="title-stick">-->
      <!--          <div class="gun"></div>-->
      <!--          <div class="title">产品图片</div>-->
      <!--        </div>-->
      <!--        <ImageUpload :api="uploadProductImg" style="min-height: 200px" width="180px" height="180px" :maxnumber="1" @change="handleFileChange" />-->
      <!--      </a-card>-->
    </ScrollContainer>
  </BasicPopup>
</template>
<script lang="ts" setup>
  import { reactive, toRefs, ref } from 'vue';
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { getCustomerList, getProjectList, postPartNumberApply, getSapCompanyCode, checkTerminalCustomerNum } from '/@/api/basicData/productCodeApply';
  import { useBaseStore } from '/@/store/modules/base';
  import { BasicForm, FormSchema, useForm } from '/@/components/Form';
  import { useDebounceFn } from '@vueuse/core';
  import { ScrollContainer } from '/@/components/Container';
  import { useUserStore } from '/@/store/modules/user';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { getBaseDataTerminalCustomerList } from '/@/api/finance/wageRate';
  import { useI18n } from '/@/hooks/web/useI18n';
  import BindFactory from './BindFactory.vue';
  const { t } = useI18n();
  const { hasBtnP } = usePermission();
  const emit = defineEmits(['reload', 'register']);

  const factoryRef = ref<any>(null);

  const baseStore = useBaseStore();
  const userStore = useUserStore();
  const userInfo = userStore.getUserInfo;
  const { createMessage, createConfirm } = useMessage();

  const state = reactive({
    title: t('dict.PartNumberApplyColumn.singApple'),
    reasonTypeOption: [],
    directCustomerList: [],
    terminalCustomerList: [],
    InsideProjectCodeOption: [],
    mainProcessOption: [],
    shipPattern: [],
    fileList: [],
    ImmediateCustomerCodeOption: [],
    mainProcess: '',
  });

  const [registerPopup, { closePopup, changeLoading }] = usePopupInner(init);
  const [registerForm, { setFieldsValue, validateFields, updateSchema, getFieldsValue, clearValidate }] = useForm({
    schemas: getFormSchema(),
    layout: 'vertical',
    labelWidth: 220,
    baseColProps: {
      span: 4,
    },
    i18nConfig: {
      moduleCode: 'PartNumberApplyColumn',
      transferRange: ['placeholder', 'label'],
      excludeFields: ['VSixtyTwoConfig', 'VSTC', 'VSSC', 'VSEC', 'Batch', 'VSTD', 'VSFD', 'CTF'],
    },
  });

  async function init() {
    changeLoading(true);
    setTimeout(() => {
      changeLoading(false);
    }, 300);
    getTypeOption();
    getUserInfo();
  }

  function getFormSchema(): FormSchema[] {
    return [
      {
        field: 'MainProcess',
        label: '主要制程',
        component: 'Select',
        componentProps: {
          placeholder: t('dict.MainProcess'),
          api: () => baseStore.getDictionaryData('MainProcess', true),
          showSearch: true,
          labelField: 'fullName',
          valueField: 'enCode',
          filterOption: false,
          immediate: true,
          onChange: async e => {
            if (e) {
              setFieldsValue({
                InsideProjectCode: '',
              });
              clearValidate();
              await handleInsideProjectCodeSearch('');
            }
          },
        },
        rules: [
          {
            required: true,
            trigger: 'blur',
            message: t('common.required'),
          },
        ],
      },
      {
        field: 'ApplyCode',
        label: '申请单号',
        component: 'Input',
        componentProps: { disabled: true },
      },
      {
        field: 'InsidePartNumber',
        label: '产品内部料号',
        component: 'Input',
        componentProps: { disabled: true },
      },
      {
        field: 'InsidePartNumberOld',
        label: '旧版成品编码',
        component: 'Input',
      },
      {
        field: 'TerminalCustomerProjectCode',
        label: '终端项目代码',
        component: 'Input',
        componentProps: { disabled: true },
        rules: [
          {
            required: true,
            trigger: 'change',
            message: t('common.required'),
          },
        ],
      },
      {
        field: 'TerminalCustomerCode',
        label: '终端客户信息',
        component: 'Select',
        componentProps: { placeholder: t('common.autoCarry'), disabled: true },
        rules: [
          {
            required: true,
            trigger: 'change',
            message: t('common.required'),
          },
        ],
      },
      {
        field: 'ProductLineCode',
        label: '产品线代码',
        component: 'Input',
        componentProps: { disabled: true },
        rules: [
          {
            required: true,
            trigger: 'blur',
            message: t('common.required'),
          },
        ],
      },
      {
        field: 'InsideProjectCode',
        label: '内部项目代码',
        component: 'Select',
        slot: 'InsideProjectCode',
        rules: [
          {
            required: true,
            trigger: 'change',
            message: t('common.required'),
          },
        ],
      },
      {
        field: 'TerminalCustomerPartNumber',
        label: '终端客户料号',
        component: 'Input',
        rules: [
          {
            required: true,
            trigger: 'blur',
            message: t('common.required'),
          },
        ],
      },
      {
        field: 'ProductDesc',
        label: '产品描述',
        component: 'Input',
        colProps: {
          span: 8,
        },
        rules: [
          {
            required: true,
            trigger: 'blur',
            message: t('common.required'),
          },
        ],
      },
      {
        field: 'TerminalCustomerPartVersion',
        label: '终端料号版本',
        component: 'Input',
        required: true,
        componentProps: {
          maxLength: 2,
        },
        rules: [
          {
            trigger: 'blur',
            validator: async (_rule: Rule, value: string) => {
              if (!value) {
                throw new Error(t('dict.PartNumberApplyColumn.valueNotEmpty'));
              }
            },
          },
        ],
      },
      {
        field: 'Config',
        label: 'Config编号',
        component: 'Input',
        componentProps: {
          maxLength: 2,
        },
        rules: [
          {
            trigger: 'blur',
            required: true,
            validator: async (_, value) => {
              if (!value) {
                throw new Error(t('dict.PartNumberApplyColumn.valueNotEmpty'));
              }

              if (value.includes('I') || value.includes('O')) {
                throw new Error(t('dict.PartNumberApplyColumn.notIO'));
              }

              if (!/^[A-HJ-NP-Z0-9]{2}$/.test(value)) {
                throw new Error(t('dict.PartNumberApplyColumn.enterConfig'));
              }
              return;
            },
          },
        ],
      },
      {
        field: 'ConfigDescription',
        label: 'Config描述',
        component: 'Input',
      },
      {
        field: 'ShipPattern',
        label: '出货形态',
        component: 'Select',
        componentProps: { disabled: true },
        rules: [
          {
            required: true,
            trigger: 'blur',
            message: t('common.required'),
          },
        ],
      },
      {
        field: 'AEPartNumber',
        label: 'AE料号',
        component: 'Input',
        componentProps: {},
      },
      {
        field: 'ImmediateCustomerCode',
        label: '直接客户信息',
        component: 'ApiSelect',
        componentProps: {
          api: getCustomerList,
          disabled: true,
          beforeFetch: value => {
            console.log(value);
            return {
              ...value,
              mainProcess: state.mainProcess,
            };
          },
          showSearch: true,
          apiSearch: {
            show: true,
            searchName: 'keyword',
          },
          // memoInputVal: true,
          resultField: 'data',
          labelField: 'name',
          valueField: 'customerCode',
          nameFormat: ['name', '(', 'customerCode', ')'],
          filterOption: false,
          notFoundContent: null,
          // immediate: true,
          alwaysLoad: true,
          onChange: (_value: string, option: any) => {
            setFieldsValue({ ImmediateCustomerSapCode: option?.code || '' });
          },
        },
        rules: [
          {
            required: true,
            trigger: 'blur',
            message: '必填',
          },
        ],
      },
      {
        field: 'ReserveCode',
        label: '预留码',
        component: 'Input',
        componentProps: { maxLength: 1 },
      },
      {
        field: 'ImmediateCustomerProjectCode',
        label: '直接客户项目代码',
        component: 'Input',
      },
      {
        field: 'ImmediateCustomerSapCode',
        label: '直接客户SAP代码',
        component: 'Input',
        componentProps: { disabled: true },
      },
      {
        field: 'ImmediateCustomerPartNumber',
        label: '直接客户料号',
        component: 'Input',
      },
      {
        field: 'ImmediateCustomerPartNumber2',
        label: '直接客户料号2',
        component: 'Input',
      },
      {
        field: 'ImmediateCustomerPartVersion',
        label: '直接客户料号版本',
        component: 'Input',
      },
      {
        field: 'ImmediateCustomerConfigDescription',
        label: '直接客户Config描述',
        component: 'Input',
        colProps: {
          span: 12,
        },
      },
      {
        field: 'ExpiryDate',
        label: '失效日期',
        component: 'DatePicker',
        defaultValue: 253402271999000,
      },
      {
        field: 'Status',
        label: '状态',
        component: 'Input',
        componentProps: { placeholder: '', disabled: true },
      },
      {
        field: 'IsSharePart',
        label: '是否共用件',
        component: 'ApiSelect',
        defaultValue: '0', // 默认为`否(0)`
        componentProps: {
          api: () => baseStore.getDictionaryData('YesOrNo'),
          resultField: 'data',
          labelField: 'fullName',
          valueField: 'enCode',
          filterOption: false,
          notFoundContent: null,
          immediate: true,
        },
      },
      {
        field: 'VSixtyTwoConfig',
        label: 'V62config',
        component: 'Input',
      },
      {
        field: 'VSTC',
        label: 'V63config',
        component: 'Input',
      },
      {
        field: 'V64config',
        label: 'V64config',
        component: 'Input',
      },
      {
        field: 'VSSC',
        label: 'V67config',
        component: 'Input',
      },
      {
        field: 'VSEC',
        label: 'V68config',
        component: 'Input',
      },
      {
        field: 'V69config',
        label: 'V69config',
        component: 'Input',
      },
      {
        field: 'ProductCode',
        label: '产品代码',
        component: 'Input',
      },
      {
        field: 'Batch',
        label: 'Batch',
        component: 'Input',
      },
      {
        field: 'VSTD',
        label: 'V63Description',
        component: 'Input',
      },
      {
        field: 'VSFD',
        label: 'V64Description',
        component: 'Input',
      },
      {
        field: 'CTF',
        label: 'config34',
        component: 'Input',
      },
      {
        field: 'LabelPV',
        label: '标签打印版本',
        component: 'Input',
      },
      {
        field: 'SapCompanyCode',
        label: 'SAP公司代码',
        component: 'ApiSelect',
        componentProps: {
          api: getSapCompanyCode,
          showSearch: true,
          apiSearch: {
            show: true,
            searchName: 'name',
          },
          resultField: 'data',
          labelField: 'name',
          valueField: 'code',
          filterOption: false,
          notFoundContent: null,
          immediate: true,
          nameFormat: ['code', '/', 'name'],
        },
      },

      // {
      //   field: 'ApplyUserName',
      //   label: '申请人',
      //   component: 'Input',
      //   componentProps: { placeholder: '请输入', disabled: true },
      // },
      // {
      //   field: 'ApplyDeptName',
      //   label: '申请部门',
      //   component: 'Input',
      //   componentProps: { placeholder: '请输入', disabled: true },
      // },
      // {
      //   field: 'ApplyDate',
      //   label: '申请日期',
      //   component: 'DatePicker',
      //   componentProps: { placeholder: '请输入', disabled: true },
      // },
      {
        field: 'Remark',
        label: '备注',
        component: 'Input',
        colProps: {
          span: 12,
        },
      },
    ];
  }

  const { InsideProjectCodeOption, ImmediateCustomerCodeOption } = toRefs(state);

  const handleInsideProjectCodeSearch = useDebounceFn(async val => {
    const { MainProcess } = getFieldsValue();
    const { code, data } = await getProjectList({ InsideProjectCode: val, MainProcess });

    if (code === 200) {
      state.InsideProjectCodeOption = data;
    }
  }, 300);

  const handleImmediateCustomerCodeSearch = useDebounceFn(async val => {
    const { code, data } = await getCustomerList({
      mainProcess: state.mainProcess,
      keyword: val,
    });
    if (code === 200) {
      state.ImmediateCustomerCodeOption = data;
    }
  }, 300);

  const handleInsideProjectCodeChange = async val => {
    const { TerminalCustomerCode, TerminalCustomerProjectCode, MainProcess, ProductLineName, ProductLineCode } = state.InsideProjectCodeOption.find(
      item => item.InsideProjectCode === val,
    );
    state.mainProcess = MainProcess;
    setFieldsValue({
      TerminalCustomerCode,
      TerminalCustomerProjectCode,
      ProductLineCode: ProductLineCode + '/' + ProductLineName,
    });
    const process = state.mainProcessOption.find(item => item.enCode === MainProcess);
    const pattern = state.shipPattern.find(item => item.fullName === process.fullName);
    const l = await baseStore.getDictionaryData(pattern.enCode);

    handleImmediateCustomerCodeSearch('');

    updateSchema([
      {
        field: 'ShipPattern',
        componentProps: {
          options: l,
          fieldNames: { value: 'enCode', label: 'fullName' },
          disabled: false,
        },
      },
      {
        field: 'ImmediateCustomerCode',
        componentProps: {
          disabled: false,
        },
      },
    ]);
  };

  function doSubmit(payload) {
    postPartNumberApply(payload)
      .then(({ code, msg }) => {
        if (code === 200) {
          createMessage.success(msg);
        }
        emit('reload');
        closePopup();
      })
      .catch(() => {
        changeLoading(false);
      });
  }

  function handleFileChange(e) {
    state.fileList = e;
  }

  const handleSaveAction = async () => {
    const values = await validateFields();
    if (!values) return;
    const factories = factoryRef.value?.validateFactory();
    if (!factories) return;
    changeLoading(true);

    delete values.Status;
    values.ProductImage = state.fileList;

    const payload = {
      ...values,
      factoryList: factories,
      ProductLineCode: values.ProductLineCode.split('/')[0],
    };
    try {
      const { data } = await checkTerminalCustomerNum({
        TerminalCustomerPartNumber: payload.TerminalCustomerPartNumber,
        InsideProjectCode: payload.InsideProjectCode,
      });

      if (data.result === true) {
        createConfirm({
          iconType: 'warning',
          title: t('common.tip'),
          content: `终端客户料号与${data.sku}料件号重复，请确认是否继续提交`,
          onOk: () => {
            doSubmit(payload);
          },
          onCancel: () => {
            changeLoading(false);
          },
        });
      } else {
        doSubmit(payload);
      }
    } catch (e) {
      console.error(e);
      changeLoading(false);
    } finally {
      // changeLoading(false);
    }
  };

  const getUserInfo = () => {
    setFieldsValue({
      ApplyUserName: userInfo.userName,
      ApplyDeptName: userInfo.departmentName,
      ApplyDate: Date.now(),
    });
  };
  const getTypeOption = async () => {
    const list = await baseStore.getDictionaryData('MainProcess');
    state.mainProcessOption = list;

    handleInsideProjectCodeSearch('');
    updateSchema({
      field: 'MainProcess',
      componentProps: {
        options: list,
        fieldNames: { value: 'enCode', label: 'fullName' },
      },
    });
    setFieldsValue({
      Status: t('dict.Quotation.Status.1'),
    });

    state.shipPattern = await baseStore.getDictionaryData('ShipPattern');
    // TerminalCustomer
    // const TerminalCustomerList = await baseStore.getDictionaryData('TerminalCustomer');
    const { data: TerminalCustomerList } = await getBaseDataTerminalCustomerList();
    TerminalCustomerList.map(item => {
      item.fullName = item.terminalCustomerCode + '-' + item.terminalCustomerName;
    });
    updateSchema({
      field: 'TerminalCustomerCode',
      componentProps: {
        options: TerminalCustomerList,
        fieldNames: { value: 'terminalCustomerCode', label: 'fullName' },
      },
    });
  };
</script>
<style lang="less" scoped>
  .content-box {
    padding: 10px 40px;
    height: 74vh;
    overflow-y: scroll;
  }

  .bottom-box {
    position: relative;
    background: #fff;
    box-shadow: 0 -5px 15px -3px rgb(0 0 0 / 12%), 0 -5px 12px -3px rgb(0 0 0 / 15%), 0 -2px 4px -3px rgb(0 0 0 / 25%);
  }

  .bottom-submit {
    display: flex;
    bottom: 0;
    height: 66px;
    width: 100%;
    padding: 16px;
    flex-direction: row;
    justify-content: space-between;
  }

  .row-margin {
    margin-bottom: 10px;
  }

  .btn-not-primary {
    color: #ff7b00;
    border: 1px solid #ff7b00;
  }

  .form-pd {
    padding: 0 15px 15px;
  }

  :deep(.ant-form-item) {
    margin-bottom: 12px !important;
  }

  .title-stick {
    display: flex;
    align-items: center;
    margin-bottom: 10px;

    .gun {
      border-radius: 2px;
      background: #ff7b00;
      width: 2px;
      height: 14px;
      margin-right: 10px;
    }

    .title {
      color: #1a1a1a;
      font-size: 14px;
      font-style: normal;
      font-weight: 700;
      line-height: 22px; /* 157.143% */
    }

    //&:before {

    //}
    :deep(.ant-upload-list-picture-card-container) {
      width: 250px;
      height: 250px;
    }

    :deep(.ant-upload.ant-upload-select-picture-card) {
      width: 250px;
      height: 250px;
    }

    :deep(.ant-upload) {
      width: 250px;
      height: 250px;
    }
  }
</style>
<style lang="less">
  .code-apply-popup {
    .pop-item {
      border-bottom: 10px solid #f0f0f0;
      padding: 20px 20px 10px;

      &:last-child {
        border-bottom: 0;
      }
    }
  }
</style>
