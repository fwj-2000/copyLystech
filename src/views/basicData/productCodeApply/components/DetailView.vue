<template>
  <!-- 基础信息 -->
  <div class="pop-item">
    <div class="title-stick">
      <div class="gun"></div>
      <div class="title">{{ t('common.baseinfo') }}</div>
    </div>
    <BasicForm @register="registerForm" :labelWidth="100">
      <template #InsideProjectCode="{ model, field }">
        <lydc-select
          show-search
          :show-arrow="false"
          :filter-option="false"
          v-model:value="model[field]"
          :options="InsideProjectCodeOption"
          :disabled="true"
          :not-found-content="null"
          :placeholder="t('common.insideProjectCodeTip')"
          :fieldNames="{
            label: 'InsideProjectCode',
            value: 'InsideProjectCode',
          }"
          @search="handleInsideProjectCodeSearch"
          @change="handleInsideProjectCodeChange"></lydc-select>
      </template>
      <template #ImmediateCustomerCode="{ model, field }">
        <lydc-select
          show-search
          :show-arrow="false"
          :filter-option="false"
          v-model:value="model[field]"
          :options="ImmediateCustomerCodeOption"
          :disabled="true"
          :not-found-content="null"
          :placeholder="t('dict.PartNumberApplyColumn.enterCustomerInformation')"
          :fieldNames="{
            label: 'fullName',
            value: 'customerCode',
          }"
          @search="handleImmediateCustomerCodeSearch"
          @change="handleImmediateCustomerCodeChange"></lydc-select>
      </template>
    </BasicForm>
  </div>
  <!-- 工厂 -->
  <BindFactory ref="factoryRef" :main-process="state.mainProcess" :disabled="isReview" :factoryNames="state.current.FactoryNames"></BindFactory>
  <!-- 共用件 - 项目绑定 -->
  <BindProject ref="bindProjectRef" :disabled="isReview" :insideProjectCode="state.current.InsideProjectCode" />
  <!-- 生命周期 -->
  <div class="pop-item min-h-520px">
    <div class="title-stick">
      <div class="gun"></div>
      <div class="title">{{ t('dict.PartNumberApplyColumn.lifeCycle') }}</div>
    </div>
    <a-tabs style="height: calc(100% - 22px)" v-model:activeKey="activeKey">
      <a-tab-pane key="1" :tab="t('component.upload.title')" class="h-460px">
        <a-collapse v-model:activeKey="collapse">
          <a-collapse-panel key="1" :header="t('dict.CommonCol.drawingshistory')" :forceRender="true">
            <template #extra>
              <a-button type="link" v-auth="'btn_upload_pic'" @click.stop="handleUploadPic"
                >{{ desensitizedPicList.length > 0 ? t('dict.PartNumberApplyColumn.upgradeOfDrawings') : t('common.uploadDrawingText') }}
              </a-button>
            </template>
            <a-table :dataSource="desensitizedPicList" :columns="columns" :pagination="false" class="pic-list" bordered>
              <template #bodyCell="{ column, record, text }">
                <template v-if="column.dataIndex === 'status'">
                  <LydcTag v-if="text == 1" theme="green" :text="t('dict.enableStatus.1')"></LydcTag>
                  <LydcTag v-if="text == 2" theme="red" :text="t('common.disableText')"></LydcTag>
                </template>
                <template v-else-if="column.dataIndex === 'originFileName'">
                  <a @click="handlePreview(record)">{{ text }}</a>
                </template>
                <template v-else-if="column.dataIndex === 'creatorTime'">
                  {{ dayjs(text).tz().format('YYYY-MM-DD HH:mm:ss') }}
                </template>
                <template v-else-if="column.dataIndex === 'action'">
                  <a-button type="link" v-auth="'btn_upload_pic'" @click="handleUpload(record)">{{ t('common.uploadText') }} </a-button>
                </template>
                <template v-else-if="column.dataIndex === 'enable'">
                  <a-button v-if="record.status == 2" type="link" v-auth="'btn_enable'" @click="handleEnable(record)">{{ t('dict.enableStatus.1') }} </a-button>
                  <a-button v-if="record.status == 1" type="link" disabled>{{ t('common.disableText') }} </a-button>
                </template>
                <template v-else-if="column.dataIndex === 'download'">
                  <a-button type="link" v-auth="'btn_download_pic'" @click="handleHistoryDownload(record)">{{ t('common.downloadText') }} </a-button>
                </template>
                <template v-else-if="column.dataIndex === 'delete'">
                  <a-button type="link" v-auth="'btn_delete_dese_pic'" @click="handleDeletePic(record)">{{ t('common.delText') }} </a-button>
                </template>
              </template>
            </a-table>
          </a-collapse-panel>
          <a-collapse-panel v-if="ifShowCustomImage" key="2" :header="t('common.customerOriginalImage')" :forceRender="true">
            <template #extra>
              <a-button type="link" v-auth="'btn_upload_pic'" @click.stop="handleUploadPic"
                >{{ customerPicList.length > 0 ? t('dict.PartNumberApplyColumn.upgradeOfDrawings') : t('common.uploadDrawingText') }}
              </a-button>
            </template>
            <a-table :dataSource="customerPicList" :columns="customColumns" :pagination="false" class="pic-list" bordered>
              <template #bodyCell="{ column, record, text }">
                <template v-if="column.dataIndex === 'status'">
                  <!--                  <a-tag v-if="text == 1">启用</a-tag>-->
                  <!--                  <a-tag v-if="text == 2">禁用</a-tag>-->
                  <LydcTag v-if="text == 1" theme="green" :text="t('dict.enableStatus.1')"></LydcTag>
                  <LydcTag v-if="text == 2" theme="red" :text="t('common.disableText')"></LydcTag>
                </template>
                <template v-else-if="column.dataIndex === 'originFileName'">
                  <a @click="handlePreview(record)">{{ text }}</a>
                </template>
                <template v-else-if="column.dataIndex === 'creatorTime'">
                  {{ dayjs(text).tz().format('YYYY-MM-DD HH:mm:ss') }}
                </template>
                <template v-else-if="column.dataIndex === 'action'">
                  <a-button type="link" v-auth="'btn_upload_pic'" @click="handleUpload(record)">{{ t('common.uploadText') }} </a-button>
                </template>
                <template v-else-if="column.dataIndex === 'enable'">
                  <a-button v-if="record.status == 2" type="link" v-auth="'btn_enable'" @click="handleEnable(record)">{{ t('dict.enableStatus.1') }} </a-button>
                  <a-button v-if="record.status == 1" type="link" disabled>{{ t('common.disableText') }} </a-button>
                </template>
                <template v-else-if="column.dataIndex === 'download'">
                  <a-button type="link" v-auth="'btn_download_customer_pic'" @click="handleHistoryDownload(record)">下载 </a-button>
                </template>
                <template v-else-if="column.dataIndex === 'delete'">
                  <a-button type="link" v-auth="'btn_delete_cust_pic'" @click="handleDeletePic(record)">{{ t('common.delText') }} </a-button>
                </template>
              </template>
            </a-table>
            <!--                <a-list size="small"-->
            <!--                        bordered-->
            <!--                        :data-source="customerPicList"-->
            <!--                >-->
            <!--                  <template #renderItem="{ item }">-->
            <!--                    <a-list-item>-->
            <!--                      <a-list-item-meta :description="item.originFileName">-->
            <!--                        <template #avatar>-->
            <!--                          {{ dayjs(item.CreatorTime).tz().format("YYYY-MM-DD HH:mm:ss") }}-->
            <!--                        </template>-->
            <!--                      </a-list-item-meta>-->
            <!--                      <template #actions>-->
            <!--                        <a @click="handlePreview(item)"-->
            <!--                           v-auth="'btn_preview'"-->
            <!--                           key="list-loadmore-edit"-->
            <!--                        >预览</a>-->
            <!--                        <a @click="handleDeletePic(item)"-->
            <!--                           v-auth="'btn_delete_cust_pic'"-->
            <!--                           key="list-loadmore-edit"-->
            <!--                        >删除</a>-->
            <!--                      </template>-->
            <!--                    </a-list-item>-->
            <!--                  </template>-->
            <!--                </a-list>-->
          </a-collapse-panel>
        </a-collapse>
      </a-tab-pane>
      <a-tab-pane key="2" :tab="t('dict.Quotation.ConfirmOriginType.1')">
        <LifeCycleTable type="1" :InsidePartNumber="state.current.InsidePartNumber" />
      </a-tab-pane>
      <a-tab-pane key="3" :tab="t('dict.CurrentStageEnum.Quantitative')">
        <LifeCycleTable type="2" :InsidePartNumber="state.current.InsidePartNumber" />
      </a-tab-pane>
      <a-tab-pane key="4" :tab="t('dict.Module.DrawingsReview')">
        <LifeCycleTable type="3" :InsidePartNumber="state.current.InsidePartNumber" />
      </a-tab-pane>
      <a-tab-pane key="5" tab="PCC">
        <LifeCycleTable type="4" :InsidePartNumber="state.current.InsidePartNumber" />
      </a-tab-pane>
      <a-tab-pane key="6" tab="ECN">
        <LifeCycleTable type="5" :InsidePartNumber="state.current.InsidePartNumber" />
      </a-tab-pane>
    </a-tabs>
  </div>
  <UploadModal @register="registerUpload" @getTable="getDrawingList(state.current.Id)" @close="getDrawingList(state.current.Id)" />
  <Preview ref="filePreviewRef" />
</template>

<script lang="ts" setup>
  import { BasicForm, FormSchema, useForm } from '/@/components/Form';
  import {
    deleteDrawings,
    downloadDrawingshistory,
    enableDrawings,
    getCustomerList,
    getDrawingshistory,
    getPartNumberApplyDetail,
    getProjectList,
    getQuotationRequirementsList,
    getSapCompanyCode,
  } from '/@/api/basicData/productCodeApply';
  import { computed, nextTick, reactive, ref, toRefs, watch, watchEffect } from 'vue';
  import { message } from 'ant-design-vue';
  import { useUserStore } from '/@/store/modules/user';
  import { useDebounceFn } from '@vueuse/core';
  import { useBaseStore } from '/@/store/modules/base';
  import dayjs from 'dayjs';
  import { useMessage } from '/@/hooks/web/useMessage';
  import UploadModal from '/@/views/basicData/productCodeApply/components/uploadModal.vue';
  import Preview from '/@/views/basicData/productCodeApply/components/Preview.vue';
  import { copyTextToClipboard } from '/@/views/basicData/productCodeApply/utils/copyTextToClipboard';
  import { useRouter, useRoute } from 'vue-router';
  import { downloadByUrl } from '/@/utils/file/download';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { useModal } from '/@/components/Modal';
  import { BasicColumn } from '/@/components/Table';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { getBaseDataTerminalCustomerList } from '/@/api/finance/wageRate';
  import LifeCycleTable from './lifeCycleTable.vue';
  import BindFactory from './BindFactory.vue';
  import BindProject from './BindProject.vue';

  const { createMessage, createConfirm } = useMessage();
  const { hasBtnP } = usePermission();
  const emit = defineEmits(['changeLoading', 'register']);
  const { t } = useI18n();

  const baseStore = useBaseStore();
  const userStore = useUserStore();
  const router = useRouter();
  const route = useRoute();
  const userInfo = userStore.getUserInfo;
  const factoryRef = ref<any>(null);
  /** 共用件 - 项目绑定处理 */
  const bindProjectRef = ref<InstanceType<typeof BindProject>>();

  const [registerUpload, { openModal: openUpload }] = useModal();

  const ifShowCustomImage = ref(false);

  watch(
    () => route.path,
    newVal => {
      if (newVal === '/basicData/productCodeApply') {
        ifShowCustomImage.value = true;
      }
    },
    {
      immediate: true,
    },
  );

  const props = defineProps({
    sign: { type: String, default: '' },
  });
  const isReview = computed(() => props.sign === 'review');
  watchEffect(() => {
    if (props.sign === 'edit') {
      nextTick(() => {
        getTypeOption();
      });
    }
  });
  const id = computed(() => state.current.Id);

  const state = reactive({
    ImmediateCustomerCodeOption: [],
    InsideProjectCodeOption: [],
    mainProcessOption: [],
    mainProcess: '',
    shipPattern: [],
    visible: false,
    activeKey: '1',
    collapse: ['1', '2'],
    fileList: [],
    current: {},
    customerPicList: [],
    desensitizedPicList: [],
    engineeringPicList: [],
    quotaList: [],
  });
  const filePreviewRef = ref<any | null>(null);

  const {
    activeKey,
    ImmediateCustomerCodeOption,
    InsideProjectCodeOption,
    visible,
    mainProcess,
    collapse,
    customerPicList,
    desensitizedPicList,
    engineeringPicList,
    quotaList,
    fileList,
  } = toRefs(state);
  const [registerForm, { setFieldsValue, validateFields, updateSchema, getFieldsValue, clearValidate }] = useForm({
    baseColProps: {
      span: 4,
    },
    schemas: getFormSchema(),
    layout: 'vertical',
    labelWidth: 220,
    disabled: isReview,
    i18nConfig: {
      moduleCode: 'PartNumberApplyColumn',
      transferRange: ['placeholder', 'label'],
      excludeFields: ['VSixtyTwoConfig', 'VSTC', 'VSSC', 'VSEC', 'Batch', 'VSTD', 'VSFD', 'CTF'],
    },
  });
  const columns: BasicColumn[] = [
    {
      title: t('component.upload.version'),
      dataIndex: 'version',
      key: 'version',
      width: 50,
      customCell: (record, index, column) => {
        const rowSpan = getRowSpan(record, index);
        return { rowSpan };
      },
      customRender: ({ text }) => {
        return text === 0 || text ? `T${text}` : '';
      },
    },
    {
      title: t('dict.PCCColumn.status'),
      dataIndex: 'status',
      key: 'status',
      width: 80,
      customCell: (record, index, column) => {
        const rowSpan = getRowSpan(record, index);
        return { rowSpan };
      },
    },
    {
      title: t('dict.MateriaLibraryColumn.fullName'),
      width: 230,
      dataIndex: 'originFileName',
      key: 'originFileName',
    },
    { title: t('component.upload.time'), dataIndex: 'creatorTime', width: 180 },
    {
      title: t('component.upload.user'),
      dataIndex: 'creatorUserName',
      width: 220,
    },
    {
      title: t('component.nodeModal.table.action'),
      dataIndex: 'action',
      colSpan: 4,
      width: 60,
      customCell: (record, index, column) => {
        const rowSpan = getRowSpan(record, index);
        return { rowSpan };
      },
    },
    {
      title: '',
      colSpan: 0,
      width: 60,
      dataIndex: 'enable',
      customCell: (record, index, column) => {
        const rowSpan = getRowSpan(record, index);
        return { rowSpan };
      },
    },
    {
      title: '',
      colSpan: 0,
      width: 60,
      dataIndex: 'download',
    },
    {
      title: '',
      colSpan: 0,
      width: 60,
      dataIndex: 'delete',
    },
  ];

  const customColumns: BasicColumn[] = [
    {
      title: t('component.upload.version'),
      dataIndex: 'version',
      key: 'version',
      width: 50,
      customCell: (record, index, column) => {
        const rowSpan = getCustomerRowSpan(record, index);
        return { rowSpan };
      },
      customRender: ({ text }) => {
        return text === 0 || text ? `T${text}` : '';
      },
    },
    {
      title: t('dict.PCCColumn.status'),
      dataIndex: 'status',
      key: 'status',
      width: 80,
      customCell: (record, index, column) => {
        const rowSpan = getCustomerRowSpan(record, index);
        return { rowSpan };
      },
    },
    {
      title: t('dict.MateriaLibraryColumn.fullName'),
      width: 230,
      dataIndex: 'originFileName',
      key: 'originFileName',
    },
    { title: t('component.upload.time'), dataIndex: 'creatorTime', width: 180 },
    {
      title: t('component.upload.user'),
      dataIndex: 'creatorUserName',
      width: 220,
    },
    {
      title: t('component.nodeModal.table.action'),
      dataIndex: 'action',
      colSpan: 3,
      width: 60,
      customCell: (record, index, column) => {
        const rowSpan = getCustomerRowSpan(record, index);
        return { rowSpan };
      },
    },
    {
      title: '',
      colSpan: 0,
      width: 60,
      dataIndex: 'enable',
      customCell: (record, index, column) => {
        const rowSpan = getCustomerRowSpan(record, index);
        return { rowSpan };
      },
    },
    {
      title: '',
      colSpan: 0,
      width: 60,
      dataIndex: 'download',
    },
    {
      title: '',
      colSpan: 0,
      width: 60,
      dataIndex: 'delete',
    },
  ];

  function getRowSpan(record, index) {
    if (index === 0 || record?.version !== state.desensitizedPicList[index - 1]?.version) {
      const count = state.desensitizedPicList.slice(index).filter(item => item.version === record.version).length;
      return count;
    }
    return 0;
  }

  function getCustomerRowSpan(record, index) {
    if (index === 0 || record?.version !== state.customerPicList[index - 1]?.version) {
      const count = state.customerPicList.slice(index).filter(item => item.version === record.version).length;
      return count;
    }
    return 0;
  }

  function getDrawingList(id) {
    // 客户图纸
    getDrawingshistory({
      id,
      DrawingsType: 'CustomerDrawings',
    }).then(({ data, code }) => {
      state.customerPicList = data;
    });

    // 脱敏图纸
    getDrawingshistory({
      id,
      DrawingsType: 'DesensitizedDrawings',
    }).then(({ data, code }) => {
      state.desensitizedPicList = data;
    });

    // 工程图纸
    getDrawingshistory({
      id,
      DrawingsType: 'EngineeringDrawings',
    }).then(({ data, code }) => {
      state.engineeringPicList = data;
    });
  }

  async function handlePreview(item) {
    const params = {
      name: item.originFileName,
      Id: item.id,
      previewType: 'localPreview',
      noCache: false,
      isCopy: 0,
    };
    filePreviewRef.value?.init(params);
  }

  function handleAutoQuery(record) {
    copyTextToClipboard(record.ApplyCode);
    message.success(`已将${record.ApplyCode}复制到剪贴板,自动跳转到报价需求页面`);
    setTimeout(() => {
      router.push({
        path: '/business/quota',
      });
    }, 1000);
  }

  // async function getQuotaList(record) {
  //   const { data, code } = await getQuotationRequirementsList({
  //     InsidePartNumber: record.InsidePartNumber,
  //   });
  //   if (code === 200) {
  //     state.quotaList = data;
  //   }
  // }
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
      state.ImmediateCustomerCodeOption = data.map(item => ({ ...item, fullName: `${item.name}(${item.customerCode})` }));
    }
  }, 300);

  function handleImmediateCustomerCodeChange(_value: string, option: any) {
    setFieldsValue({ ImmediateCustomerSapCode: option?.code || '' });
  }

  function getFormSchema(): FormSchema[] {
    return [
      {
        field: 'MainProcess',
        label: '主要制程',
        component: 'Select',
        componentProps: {
          disabled: true,
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
        componentProps: { placeholder: '请输入申请单号', disabled: true },
      },
      {
        field: 'InsidePartNumber',
        label: '产品内部料号',
        component: 'Input',
        componentProps: { placeholder: '请输入产品内部料号', disabled: true },
        rules: [
          {
            required: true,
            trigger: 'change',
            message: '必填',
            validator: () => Promise.resolve(),
          },
        ],
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
        componentProps: { placeholder: '请输入', disabled: true },

        rules: [
          {
            required: true,
            trigger: 'change',
            message: '必填',
          },
        ],
      },
      {
        field: 'TerminalCustomerCode',
        label: '终端客户信息',
        component: 'Select',
        componentProps: { placeholder: '自动带入', disabled: true },

        rules: [
          {
            required: true,
            trigger: 'change',
            message: '必填',
          },
        ],
      },
      {
        field: 'ProductLineCode',
        label: '产品线代码',
        component: 'Input',
        componentProps: { placeholder: '请输入', disabled: true },

        rules: [
          {
            required: true,
            trigger: 'blur',
            message: '必填',
          },
        ],
      },
      {
        field: 'InsideProjectCode',
        label: '内部项目代码',
        component: 'Select',
        slot: 'InsideProjectCode',
        componentProps: { placeholder: '请选择', disabled: true },

        rules: [
          {
            required: true,
            trigger: 'change',
            message: '必填',
          },
        ],
      },
      {
        field: 'TerminalCustomerPartNumber',
        label: '终端客户料号',
        component: 'Input',
        componentProps: { placeholder: '自动带入', disabled: true },
        rules: [
          {
            required: true,
            trigger: 'blur',
            message: '必填',
          },
        ],
      },
      {
        field: 'ProductDesc',
        label: '产品描述',
        component: 'Input',
        componentProps: { placeholder: '请输入产品描述' },
        colProps: {
          span: 8,
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
        field: 'TerminalCustomerPartVersion',
        label: '终端料号版本',
        component: 'Input',
        componentProps: { placeholder: '请输入终端料件版本号', disabled: true },
        required: true,
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
        componentProps: {
          placeholder: '请输入Config描述',
        },
      },
      {
        field: 'ShipPattern',
        label: '出货形态',
        component: 'Select',
        componentProps: { placeholder: '请选择', disabled: true },
        rules: [
          {
            required: true,
            trigger: 'blur',
            message: '必填',
          },
        ],
      },
      {
        field: 'AEPartNumber',
        label: 'AE料号',
        component: 'Input',
        componentProps: {
          placeholder: '请输入AE料号',
        },
      },
      {
        field: 'ImmediateCustomerCode',
        label: '直接客户信息',
        component: 'Select',
        slot: 'ImmediateCustomerCode',
        componentProps: { placeholder: '请选择', disabled: true },
        rules: [
          {
            required: true,
            trigger: 'change',
            message: '必填',
          },
        ],
      },
      {
        field: 'ReserveCode',
        label: '预留码',
        component: 'Input',
        componentProps: { placeholder: '请输入预留码', disabled: true },
      },
      {
        field: 'ImmediateCustomerProjectCode',
        label: '直接客户项目代码',
        component: 'Input',
        componentProps: { placeholder: '请输入直接客户项目代码' },
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
        componentProps: { placeholder: '请输入直接客户料号' },
      },
      {
        field: 'ImmediateCustomerPartNumber2',
        label: '直接客户料号2',
        component: 'Input',
        componentProps: { placeholder: '请输入直接客户料号2' },
      },
      {
        field: 'ImmediateCustomerPartVersion',
        label: '直接客户料号版本',
        component: 'Input',
        componentProps: { placeholder: '请输入直接客户料号版本' },
      },
      {
        field: 'ImmediateCustomerConfigDescription',
        label: '直接客户Config描述',
        component: 'Input',
        componentProps: { placeholder: '请输入直接客户Config描述' },
        colProps: {
          span: 12,
        },
      },
      {
        field: 'ExpiryDate',
        label: '失效日期',
        component: 'DatePicker',
        componentProps: { placeholder: '请选择失效日期' },
      },
      {
        field: 'Status',
        label: '状态',
        component: 'Select',
        componentProps: {
          placeholder: '',
          disabled: true,
          fieldNames: { value: 'enCode', label: 'fullName' },
          options: [
            {
              fullName: '启用',
              enCode: '1',
            },
            {
              fullName: '禁用',
              enCode: '2',
            },
            {
              fullName: '未审核',
              enCode: '3',
            },
          ],
        },
      },
      // {
      //   field: 'IsSharePart',
      //   label: '是否共用件',
      //   component: 'ApiSelect',
      //   componentProps: {
      //     api: () => baseStore.getDictionaryData('YesOrNo'),
      //     resultField: 'data',
      //     labelField: 'fullName',
      //     valueField: 'enCode',
      //     filterOption: false,
      //     notFoundContent: null,
      //     immediate: true,
      //   },
      // },
      // {
      //   field: 'InsidePartNumberOld',
      //   label: '旧产品内部料号',
      //   component: 'Input',
      //   componentProps: { placeholder: '/' },
      // },

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
      // {
      //   field: 'LastModifyUserName',
      //   label: '修改人',
      //   component: 'Input',
      //   componentProps: { placeholder: '请输入', disabled: true },
      // },
      // {
      //   field: 'LastModifyTime',
      //   label: '修改时间',
      //   component: 'DatePicker',
      //   componentProps: { placeholder: '请输入', disabled: true },
      // },
      {
        field: 'Remark',
        label: '备注',
        component: 'Input',
        componentProps: { placeholder: '请输入备注' },
        colProps: {
          span: 12,
        },
      },
    ];
  }

  const handleInsideProjectCodeChange = async val => {
    const { TerminalCustomerCode, TerminalCustomerProjectCode, MainProcess, ProductLineCode, ProductLineName } = state.InsideProjectCodeOption.find(
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
    ]);
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
      status: '未审核',
    });

    state.shipPattern = await baseStore.getDictionaryData('ShipPattern');
    // TerminalCustomer
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

  function handleUpload(record) {
    console.log('🚀 ~ handleUpload ~ record: ', record);
    console.log('🚀 state.current: ', state.current);
    console.log({
      Id: state.current?.Id,
      Version: record.version,
    });
    // InsidePartNumber
    openUpload(true, {
      Id: state.current?.Id,
      InsidePartNumber: state.current.InsidePartNumber,
      Version: record.version,
    });
  }

  function handleEnable(record) {
    if (record.status == '2') {
      // 启用
      enableDrawings(record.id)
        .then(({ code, msg }) => {
          if (code == 200) {
            createMessage.success(msg);
            getDrawingList(state.current.Id);
          }
        })
        .finally(e => {
          emit('changeLoading', false);
        });
    }
  }

  function initData(val) {
    // getQuotaList(val);
    emit('changeLoading', true);
    getPartNumberApplyDetail(val.Id)
      .then(({ code, data }) => {
        state.current = data;
        nextTick(async () => {
          const mainProcessOption = await baseStore.getDictionaryData('MainProcess');
          const shipPattern = await baseStore.getDictionaryData('ShipPattern');

          const process = mainProcessOption.find(item => item.enCode === data.MainProcess);

          const pattern = shipPattern.find(item => item.fullName === process.fullName);
          const l = await baseStore.getDictionaryData(pattern.enCode);
          state.mainProcess = data.MainProcess;

          handleImmediateCustomerCodeSearch(data.ImmediateCustomerCode);
          updateSchema([
            {
              field: 'ShipPattern',
              componentProps: {
                options: l,
                fieldNames: { value: 'enCode', label: 'fullName' },
                disabled: false,
              },
            },
          ]);

          state.fileList = data.ProductImage;
          setFieldsValue({
            ...data,
            ProductLineCode: val.ProductLineCode + '/' + val.ProductLineName,
          });
          bindProjectRef.value &&
            bindProjectRef.value.init({
              list: data.InsideProjectCodeList,
              isSharePart: data.IsSharePart,
            });
          emit('changeLoading', false);
        });
      })
      .finally(() => {
        emit('changeLoading', false);
        getDrawingList(val.Id);
      });
  }

  function setVisible(e, data) {
    state.visible = e;
    initData(data);
    if (e) {
      getTypeOption();
    }
  }

  function handleFileChange(e) {
    state.fileList = e;
    // if (!e || e.length <= 0) return;
    // putCustomerList({
    //   ...state.current,
    //   ProductImage: e,
    // }).then(({ code, msg }) => {
    //   if (code === 200) {
    //     createMessage.success(msg);
    //   }
    // });
  }

  function handleUploadPic() {
    openUpload(true, {
      Id: state.current?.Id,
      InsidePartNumber: state.current.InsidePartNumber,
      Version: null,
    });
  }

  async function handleHistoryDownload(val) {
    const {
      data: { name, url },
    } = await downloadDrawingshistory({
      Id: val.id,
    });
    downloadByUrl({ url: url, target: '_blank', fileName: name });
  }

  function handleDeletePic(val) {
    createConfirm({
      iconType: 'warning',
      title: t('common.tipTitle'),
      content: '此操作将永久删除该数据, 是否继续？',
      onOk: () => {
        emit('changeLoading', true);
        deleteDrawings(val.id)
          .then(({ code }) => {
            if (code === 200) {
              message.success(t('common.delSuccess'));
              getDrawingList(state.current.Id);
            }
          })
          .finally(e => {
            emit('changeLoading', false);
          });
      },
    });
  }

  async function buildParams() {
    const values = await validateFields();
    if (!values) return;
    const factories = factoryRef.value?.validateFactory();
    if (!factories) return;
    values.FactoryList = factories;
    delete values.status;
    values.Id = state.current.Id;
    values.ProductImage = state.fileList;
    console.log(values);

    const { list: InsideProjectCodeList, isSharePart: IsSharePart } = bindProjectRef.value ? bindProjectRef.value.getValues() : {};

    return {
      ...values,
      InsideProjectCodeList,
      IsSharePart,
    };
  }

  defineExpose({
    setVisible,
    initData,
    buildParams,
  });
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
  }

  :deep(.ant-collapse-content > .ant-collapse-content-box) {
    padding: 0;
  }

  :deep(.pic-list .ant-table-thead > tr > th, .ant-table tfoot > tr > th, .ant-table tfoot > tr > td) {
    padding: 8px;
  }

  :deep(.pic-list .ant-table-tbody > tr > td) {
    padding: 8px;
  }

  :deep(.ant-table .ant-table-cell) {
    white-space: normal !important;
  }

  :deep(.pic-list .ant-btn) {
    padding: 0;
  }
</style>
