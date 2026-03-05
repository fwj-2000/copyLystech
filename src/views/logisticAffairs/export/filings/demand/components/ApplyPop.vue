<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    :showCancelBtn="true"
    :okText="t('common.submitText')"
    :cancelText="t('common.cancel')"
    :title="title"
    destroyOnClose
    class="full-popup top-0 ly-filing-detail">
    <template #appendToolbar>
      <a-button class="mx-12px" v-if="canEditable" :loading="state.btnLoading" :disabled="state.loading" @click="handleSave" type="primary">
        {{ t('common.submit') }}
      </a-button>
    </template>

    <template #insertToolbar>
      <div class="toggle-current flex" v-if="state.Ids.length > 1">
        <a-button preIcon="icon-ym icon-ym-left" @click="handlePrev" :disabled="state.currentIndex === 0"></a-button>
        <div class="state-box m-2">
          <span style="color: rgb(255 123 0 / var(--tw-bg-opacity))">{{ state.currentIndex + 1 }}</span> / {{ state.Ids.length }}
        </div>
        <a-button preIcon="icon-ym icon-ym-right" @click="handleNext" :disabled="state.currentIndex === state.Ids.length - 1"></a-button>
      </div>
    </template>
    <ScrollContainer style="background: #ebeef5">
      <Card>
        <template #title>
          <div>{{ t('common.baseinfo') }}</div>
        </template>
        <BasicForm @register="registerBaseInfoForm"></BasicForm>
      </Card>
      <div style="display: flex; gap: 12px; padding: 12px 0">
        <Card class="flex-1">
          <template #title> {{ t('dict.FilingsApplyColumn.GcDataStatus1') }} </template>
          <template #extra>
            <lydc-select type="primary" v-model:value="state.language" placeholder="" :options="state.engineeringLangOptions" @change="toggleLanguage" />
          </template>
          <BasicForm @register="registerEngineerBaseInfoForm">
            <template #shortMaterialCodes="{ model, field }">
              <MaterialNumberContent :list="model[field]" />
            </template>
            <template #singleMaterialNumbers="{ model, field }">
              <a-textarea disabled :value="Array.isArray(model[field]) ? model[field].join('、') : model[field]" />
            </template>
          </BasicForm>
        </Card>
        <Card class="flex-1">
          <template #title> {{ t('dict.FilingsApplyColumn.ScDataStatus1') }} </template>
          <BasicForm @register="registerProductionBaseInfoForm"></BasicForm>
          <BasicTable @register="registerImageTable" :data-source="state.base.produceImgOutputs">
            <template #bodyCell="{ column, record }">
              <template v-if="column.dataIndex == 'action'">
                <TableAction :actions="getTableActions(record)" />
              </template>
              <template v-else>
                <template v-if="column.dataIndex == 'fileName'">
                  <span class="table-a" @click="handlePreview(record)">{{ record.fileName }}</span>
                </template>
              </template>
            </template>
          </BasicTable>
        </Card>
      </div>
      <div class="ly-filing-detail-footer" v-if="hasBtnP('btn_review') && canEditable">
        <div class="footer-flex">
          <div>
            <a-form>
              <div class="flex justify-between gap-3">
                <!-- 工程资料维护 -->
                <a-form-item :label="t('dict.CustomsAffairsReview.engineeringMaintenanceData')">
                  <a-radio-group v-model:value="state.submit.engineeringInput" :disabled="!canEditable || state.auditResultMap[state.Id]?.enginerringDone">
                    <a-radio :value="AUDIT_ENUM.同意">{{ t('common.passThroughText') }}</a-radio>
                    <a-radio :value="AUDIT_ENUM.不同意">{{ t('common.notPassThroughText') }}</a-radio>
                  </a-radio-group>
                </a-form-item>
                <a-form-item :required="state.submit.engineeringInput === AUDIT_ENUM.不同意" :label="t('dict.CommonCol.remark')">
                  <a-input
                    v-model:value="state.submit.engineeringReviewRemarks"
                    :disabled="!canEditable || state.submit.engineeringInput !== AUDIT_ENUM.不同意 || state.auditResultMap[state.Id]?.enginerringDone"
                    :cols="100"
                    :rows="1" />
                </a-form-item>
              </div>
              <div class="flex justify-between gap-3">
                <!-- 生产资料维护 -->
                <a-form-item :label="t('dict.CustomsAffairsReview.productMaintenanceData')">
                  <a-radio-group v-model:value="state.submit.produceInput" :disabled="!canEditable || state.auditResultMap[state.Id]?.produceDone">
                    <a-radio :value="AUDIT_ENUM.同意">{{ t('common.passThroughText') }}</a-radio>
                    <a-radio :value="AUDIT_ENUM.不同意">{{ t('common.notPassThroughText') }}</a-radio>
                  </a-radio-group>
                </a-form-item>
                <a-form-item :required="state.submit.produceInput === AUDIT_ENUM.不同意" :label="t('dict.CommonCol.remark')">
                  <a-input
                    v-model:value="state.submit.produceReviewRemarks"
                    :disabled="!canEditable || state.submit.produceInput !== AUDIT_ENUM.不同意 || state.auditResultMap[state.Id]?.produceDone"
                    :cols="100"
                    :rows="1" />
                </a-form-item>
              </div>
            </a-form>
          </div>
        </div>
      </div>
    </ScrollContainer>
  </BasicPopup>
  <PreviewModal ref="filePreviewRef" />
</template>
<script lang="ts" setup>
  import { reactive, toRefs, ref, computed } from 'vue';
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { BasicTable, useTable, ActionItem, TableAction } from '/@/components/Table';
  import { getCsAffairsReviewDetail, reviewCsAffairs } from '/@/api/business/filingLogReview';
  import { updateEngineerFormConfig, productionFormConfig, imageTableColumn, loadUnitList } from './config';
  import { ScrollContainer } from '/@/components/Container';
  import Card from './Card.vue';
  import { formatTableDefaultText } from '/@/utils';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { BasicForm, useForm } from '/@/components/Form';
  import { downloadByUrl } from '/@/utils/file/download';
  import { useBaseStore } from '/@/store/modules/base';
  import { pick } from 'lodash-es';
  import { formatImageUrl } from '/@/views/productionDeal/fillings/maintain/components/detailPopupConfig';
  import { PreviewModal } from '/@/components/Upload';
  import MaterialNumberContent from '/@/views/engineering/filings/maintain/components/materialNumberContent.vue';

  const baseStore = useBaseStore();

  const { hasBtnP } = usePermission();

  const emits = defineEmits(['register', 'refresh']);

  enum AUDIT_ENUM {
    同意 = 11,
    不同意 = 12,
  }

  const { t } = useI18n();

  type InputValue = string | number | null;
  interface State {
    type: 'view' | 'add' | 'edit';
    currentIndex: number;
    base: any;
    Id: string;
    Ids: string[];
    qid: string;
    role: string;
    title: string;
    submit: {
      auditType: '0' | '1';
      engineeringInput: InputValue;
      engineeringReviewRemarks: string;
      produceInput: InputValue;
      produceReviewRemarks: string;
      isNotice: '0' | '1';
      noticeGcId: string;
      noticeScId: string;
      auditRmk: string;
      noticeGcName: string;
      noticeScName: string;
    };
    opsList: [
      {
        value: 0;
        label: string; // 不同意
      },
      {
        value: 1;
        label: string; // 同意
      },
    ];
    language: string | number;
    loading: boolean;
    btnLoading: boolean;
    langList: any[];
    engineeringLangOptions: any[];
    /** 审核过的id列表 */
    auditIds: string[];
    auditResultMap: {
      [id: string]: {
        engineeringInput?: string | number | null;
        engineeringReviewRemarks?: string;
        enginerringDone?: undefined | null | boolean;
        produceInput?: string | number | null;
        produceReviewRemarks?: string;
        produceDone?: undefined | null | boolean;
      };
    };
  }

  const state = reactive<State>({
    Id: '',
    currentIndex: 0,
    Ids: [],
    qid: '',
    title: '',
    type: 'add',
    role: '',
    base: {},
    submit: {
      auditType: '1',
      engineeringInput: null,
      engineeringReviewRemarks: '',
      produceInput: null,
      produceReviewRemarks: '',
      isNotice: '1',
      noticeScId: '',
      noticeGcId: '',
      noticeGcName: '',
      noticeScName: '',
      auditRmk: '',
    },
    opsList: [
      {
        value: 0,
        label: t('common.disagree'),
      },
      {
        value: 1,
        label: t('common.agree'),
      },
    ],
    language: 1,
    loading: false,
    btnLoading: false,
    langList: [],
    engineeringLangOptions: [],
    auditIds: [],
    auditResultMap: {},
  });

  const filePreviewRef = ref<any>(null);

  const canEditable = computed(() => {
    // 已经审核过的id列表中包含当前id，则不能编辑
    return (state.type === 'edit' || state.type === 'add') && !state.auditIds.includes(state.Id);
  });

  const { title } = toRefs(state);

  const { createMessage } = useMessage();

  // 备案需求
  const filingsDemandFormConfig: any[] = [
    {
      label: '产品内部料号',
      field: 'insidePartNumber',
      component: 'Input',
      componentProps: {
        placeholder: '',
        disabled: true,
      },
    },
    {
      label: '工厂',
      field: 'factory',
      component: 'Input',
      componentProps: {
        placeholder: '',
        disabled: true,
      },
    },
    {
      label: '出货方式',
      field: 'shipmentType',
      component: 'Input',
      componentProps: {
        placeholder: '',
        disabled: true,
      },
    },
    {
      label: '出货备案法人',
      field: 'sellCorporation',
      component: 'Input',
      componentProps: {
        placeholder: '',
        disabled: true,
      },
    },
    {
      label: '备案语言',
      field: 'filingsLanguage',
      component: 'Select',
      componentProps: {
        placeholder: '',
        disabled: true,
        showArrow: false,
        options: state.langList,
      },
    },
    {
      label: '直接客户料号',
      field: 'immediateCustomerPartNumber',
      component: 'Input',
      componentProps: {
        placeholder: '',
        disabled: true,
      },
    },
    {
      label: '终端客户料号',
      field: 'terminalCustomerPartNumber',
      component: 'Input',
      componentProps: {
        placeholder: '',
        disabled: true,
      },
    },
    {
      label: '直接客户名称',
      field: 'immediateCustomerName',
      component: 'Input',
      componentProps: {
        placeholder: '',
        disabled: true,
      },
    },
    {
      label: '申请备案时间',
      field: 'applyDate',
      // component: 'Input',
      component: 'DatePicker',
      componentProps: {
        placeholder: '',
        disabled: true,
        valueFormat: 'YYYY-MM-DD',
      },
    },
    {
      label: 'PD',
      field: 'pdPersonName',
      component: 'Input',
      componentProps: {
        placeholder: '',
        disabled: true,
      },
    },
    {
      label: '生产维护人',
      field: 'produceCreateName',
      component: 'Input',
      componentProps: {
        placeholder: '',
        disabled: true,
      },
    },
  ];

  const [registerPopup, { closePopup, changeLoading }] = usePopupInner(init);
  const [registerImageTable] = useTable({
    columns: imageTableColumn,
    useSearchForm: false,
    ellipsis: true,
    canResize: false,
    pagination: false,
    showTableSetting: false,
    actionColumn: {
      width: 50,
      title: t('common.action'),
      dataIndex: 'action',
    },
    transformCellText: ({ text }) => {
      return formatTableDefaultText(text);
    },
  });
  const [registerBaseInfoForm, { setFieldsValue: setFilingFieldsValue, updateSchema }] = useForm({
    schemas: filingsDemandFormConfig,
    layout: 'vertical',
    labelWidth: '100%',
    baseColProps: {
      span: 4,
    },
    baseRowStyle: {
      'margin-left': '4px',
      'margin-right': '4px',
    },
    i18nConfig: {
      moduleCode: 'CAApplyColumn',
    },
  });
  const [registerEngineerBaseInfoForm, { setFieldsValue: setEngineerFieldsValue, resetSchema: resetEngineerSchema }] = useForm({
    schemas: updateEngineerFormConfig(),
    layout: 'vertical',
    labelWidth: '100%',
    baseColProps: {
      span: 8,
    },
    i18nConfig: {
      moduleCode: 'CustomsAffairsEngineeringColumn',
    },
  });
  const [registerProductionBaseInfoForm, { setFieldsValue: setProductionFieldsValue }] = useForm({
    schemas: productionFormConfig,
    layout: 'vertical',
    labelWidth: '100%',
    baseColProps: {
      span: 8,
    },
    i18nConfig: {
      moduleCode: 'CustomsAffairsProduceColumn',
    },
  });

  function getTableActions(record): ActionItem[] {
    return [
      {
        // label: '下载',
        label: t('component.upload.download'),
        onClick: handleDownload.bind(null, record),
      },
    ];
  }

  async function init(data) {
    state.loading = true;
    state.btnLoading = false;
    state.Id = data.id || data.ids[0];
    state.Ids = data.ids || [];
    state.qid = data.qid;
    state.role = data.role;
    state.type = data.type || 'add';
    state.title = data.title + t('views.filings.demand');
    state.currentIndex = 0;
    state.submit = {
      auditType: '1',
      engineeringInput: null,
      engineeringReviewRemarks: '',
      produceInput: null,
      produceReviewRemarks: '',
      isNotice: '0',
      noticeScId: '',
      noticeGcId: '',
      noticeGcName: '',
      noticeScName: '',
      auditRmk: '',
    };
    state.auditIds = [];
    state.auditResultMap = {};
    await loadUnitList();
    const list = (await baseStore.getDictionaryData('FilingLanguage')) as any[];
    state.langList = (list || []).map(i => {
      return {
        id: Number(i.enCode),
        fullName: i.fullName,
      };
    });
    updateSchema({
      label: '备案语言',
      field: 'filingsLanguage',
      component: 'Select',
      componentProps: {
        placeholder: '',
        disabled: true,
        showArrow: false,
        options: state.langList,
      },
    });
    getFillDetail();
  }

  function toggleLanguage(v) {
    state.language = v;
    const list = state.base.engineeringOutputs?.length && state.base.engineeringOutputs.filter(item => item.filingsLanguage == v);
    if (list) {
      resetEngineerSchema(updateEngineerFormConfig(v));
      setEngineerFieldsValue({
        ...list[0],
      });
    }
  }

  // 文件预览
  function handlePreview({ fileUrl, fileName }) {
    // 文件预览
    const params = {
      name: fileName,
      url: fileUrl,
    };
    filePreviewRef.value?.init(params);
  }
  // 文件下载
  function handleDownload({ fileUrl, fileName }) {
    downloadByUrl({ url: fileUrl, fileName });
  }

  async function getFillDetail() {
    changeLoading(true);
    try {
      const params = [state.Ids[state.currentIndex]];
      const r = await getCsAffairsReviewDetail(params as any);
      if (r.code == 200) {
        //  如果备案语音是中英文的数据，就先显示中文数据
        const baseInfo = r.data[0];

        /** 恢复上一次审核状态 */
        if (!state.auditResultMap[state.Id]) {
          state.auditResultMap[state.Id] = {};
        }
        const auditResultMap = state.auditResultMap[state.Id];
        Object.assign(state.auditResultMap[state.Id], {
          engineeringInput: auditResultMap.engineeringInput || baseInfo?.engineeringReviewStatus,
          engineeringReviewRemarks: auditResultMap.engineeringReviewRemarks || baseInfo?.engineeringReviewRemarks,
          enginerringDone: auditResultMap.enginerringDone || baseInfo?.engineeringReviewStatus === AUDIT_ENUM.同意,
          produceInput: auditResultMap.produceInput || baseInfo?.produceReviewStatus,
          produceReviewRemarks: auditResultMap.produceReviewRemarks || baseInfo?.produceReviewRemarks,
          produceDone: auditResultMap.produceDone || baseInfo?.produceReviewStatus === AUDIT_ENUM.同意,
        });
        initSubmitData();

        const engineeringOutputs = (baseInfo?.engineeringOutputs || []).map(item => {
          return {
            ...item,
            singleMaterialNumbers: Array.isArray(item.singleMaterialNumbers) ? item.singleMaterialNumbers.join(',') : item.singleMaterialNumbers,
            secrecyMaterialWeight:
              item.secrecyMaterialWeight === null || item.secrecyMaterialWeight === undefined || Number.isNaN(item.secrecyMaterialWeight)
                ? ''
                : Number(item.secrecyMaterialWeight).toFixed(7),
          };
        });
        baseInfo.engineeringOutputs = engineeringOutputs;
        state.engineeringLangOptions = engineeringOutputs.map((item: any) => {
          const target = state.langList.find(el => `${el.id}` === `${item.filingsLanguage}`);
          return {
            ...target,
          };
        });

        baseInfo.produceOutputs = (Array.isArray(baseInfo.produceOutputs) ? baseInfo.produceOutputs : []).map((item: any) => {
          return {
            ...item,
            // 纯产品重量达到小数后七位时，有可能会被转换成科学计数法，不利于展示，因为调用以下转换方法，确保是数字展示
            productWeight: convertScientificNumber(item.productWeight),
            backProductWeight: convertScientificNumber(item.backProductWeight),
            wasteWeight: convertScientificNumber(item.wasteWeight),
          };
        });

        baseInfo.produceImgOutputs = (Array.isArray(baseInfo.produceImgOutputs) ? baseInfo.produceImgOutputs : []).map(item => {
          return {
            ...item,
            fileUrl: formatImageUrl(item.fileUrl),
          };
        });

        state.submit.noticeGcId = baseInfo?.noticeGcId;
        state.submit.noticeScId = baseInfo?.noticeScId;
        state.base = baseInfo;

        toggleLanguage((engineeringOutputs[0] || {}).filingsLanguage || '');
        setFilingFieldsValue(baseInfo);
        setProductionFieldsValue((baseInfo?.produceOutputs?.length && baseInfo.produceOutputs[0]) || {});
      }
      changeLoading(false);
      state.loading = false;
    } catch (error) {
      console.log(error);
      closePopup();
      changeLoading(false);
      state.loading = false;
    }
  }

  /**
   * 将科学计数法的小数转换为普通小数
   * @param num
   */
  function convertScientificNumber(num: number | string | undefined): string {
    if (num === undefined) {
      return '';
    }

    const number = typeof num === 'string' ? Number(num) : num;

    // 处理科学计数法并转换为普通字符串
    let str = number.toLocaleString('fullwide', {
      useGrouping: false,
      maximumFractionDigits: 20,
    });

    // 处理仍可能存在的科学计数法（如极小/极大数）
    if (str.includes('e')) {
      const [m, e] = str.split('e');
      const exponent = Number.parseInt(e, 10);
      const [intPart, decPart = ''] = m.split('.');
      const digits = intPart + (decPart || '');

      if (exponent > 0) {
        str = digits.padEnd(exponent + 1, '0');
      } else {
        str = '0.' + digits.padStart(Math.abs(exponent) + digits.length - 1, '0');
      }
    }

    // 拆分整数和小数部分
    let [integer, decimal = ''] = str.split('.');
    decimal = decimal.substring(0, 7); // 保留最多7位小数

    // 删除末尾无效零
    decimal = decimal.replace(/0+$/, '');

    // 拼接最终结果
    return decimal ? `${integer}.${decimal}` : integer;
  }

  function initSubmitData() {
    const auditResult = state.auditResultMap[state.Id];
    Object.assign(state.submit, {
      engineeringInput: auditResult?.engineeringInput || null,
      engineeringReviewRemarks: auditResult?.engineeringReviewRemarks || '',
      produceInput: auditResult?.produceInput || null,
      produceReviewRemarks: auditResult?.produceReviewRemarks || '',
    });
  }

  function handlePrev() {
    state.currentIndex--;
    state.Id = state.Ids[state.currentIndex];
    initSubmitData();
    getFillDetail();
  }
  function handleNext() {
    if (state.currentIndex < state.Ids.length - 1) {
      state.currentIndex++;
      state.Id = state.Ids[state.currentIndex];
      initSubmitData();
      getFillDetail();
    }
  }

  // function handleCancel() {
  //   closePopup();
  // }
  async function handleSave() {
    const { Id, submit } = state;
    const params = pick(
      {
        id: Id,
        ...submit,
      },
      ['id', 'engineeringInput', 'engineeringReviewRemarks', 'produceInput', 'produceReviewRemarks'],
    );

    if (
      (params.engineeringInput === AUDIT_ENUM.不同意 && params.engineeringReviewRemarks === '') ||
      (params.produceInput === AUDIT_ENUM.不同意 && params.produceReviewRemarks === '')
    ) {
      // 不同意 备注必填
      return createMessage.warning(t('common.remarksRequiredTip'));
    }

    state.auditResultMap[params.id] = {
      engineeringInput: params.engineeringInput,
      produceInput: params.produceInput,
      engineeringReviewRemarks: params.engineeringReviewRemarks,
      produceReviewRemarks: params.produceReviewRemarks,
    };

    state.btnLoading = true;
    changeLoading(true);

    reviewCsAffairs(params as any)
      .then(res => {
        state.auditIds.push(params.id);
        createMessage.success(res?.msg || t('common.saveSuccessText'));
        emits('refresh');
        if (state.currentIndex >= state.Ids.length - 1) {
          return closePopup();
        }
        handleNext();
      })
      .catch(() => {})
      .finally(() => {
        state.btnLoading = false;
        changeLoading(false);
      });
  }
</script>

<style lang="less">
  .ly-filing-detail {
    :deep(.ant-table-wrapper) {
      padding: 0 !important;
    }

    &-concat {
      display: flex;
      gap: 20px;

      &-item {
        flex: 1;
      }
    }

    .ant-form .ant-form-item {
      margin-bottom: 8px;

      + .ant-form-item {
        flex: 1;
      }
    }

    &-footer {
      position: sticky;
      bottom: 0;
      z-index: 1000;
      background: #fff;
      padding: 8px 12px;
      border-radius: 2px;
      border-top: 1px solid #f0f0f0;

      :deep(.ant-card-body) {
        padding: 12px 12px 8px !important;
      }
    }

    .h2 {
      font-size: 14px;
      font-weight: bold;
      display: flex;
      gap: 10px;
      margin-bottom: 4px;
    }

    .tag {
      width: 50px;
      border-radius: 2px;
      background: rgb(255 123 0 / 10%);
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 8px;
      padding: 2px 8px;
      color: #ff7b00;
      font-size: 12px;
    }

    .footer-flex {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-shrink: 0;
      gap: 20px;

      > div {
        width: 100%;
      }
    }
    // 覆写组件样式
    :deep(.lydc-basic-table-action button i) {
      font-size: 18px;
    }

    :deep(.ant-card-body) {
      width: 100%;
      padding: 12px 12px 8px !important;
    }

    :deep(.ant-table-thead > tr > th) {
      border-top: 1px solid rgb(0 0 0 / 6%);
    }

    :deep(.ant-table-thead > tr:first-child > th) {
      border-top: none;
    }

    :deep(.ant-table-thead > tr > th:not(:last-child, .ant-table-selection-column)::before) {
      position: absolute;
      top: 50%;
      right: 0;
      width: 1px;
      height: 1.6em;
      background-color: rgb(0 0 0 / 6%);
      transform: translateY(-50%);
      transition: background-color 0.3s;
      content: '';
    }
  }
</style>
