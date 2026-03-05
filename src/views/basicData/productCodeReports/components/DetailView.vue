<template>
  <a-card v-if="visible" class="lydc-content-wrapper-search-box p-12px mb-16px" style="border-bottom: 1px solid #dbdbdb">
    <div class="title-stick">
      <div class="gun"></div>
      <div class="title">基础信息</div>
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
          placeholder="请选择内部项目代码"
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
          placeholder="请选择直接客户信息"
          :fieldNames="{
            label: 'fullName',
            value: 'customerCode',
          }"
          @search="handleImmediateCustomerCodeSearch"></lydc-select>
      </template>
    </BasicForm>
  </a-card>
  <a-card style="margin-top: 10px">
    <Row>
      <Col :span="24" style="padding-right: 10px">
        <div class="title-stick">
          <div class="gun"></div>
          <div class="title">生命周期</div>
        </div>
        <a-tabs v-model:activeKey="activeKey">
          <a-tab-pane key="1" tab="图纸">
            <a-collapse v-model:activeKey="collapse">
              <a-collapse-panel key="1" header="脱敏图纸" :forceRender="true">
                <template #extra>
                  <a-button type="link" v-auth="'btn_upload_pic'" @click.stop="handleUploadPic"
                    >{{ desensitizedPicList.length > 0 ? '图纸升版' : '上传图纸' }}
                  </a-button>
                </template>
                <a-table :dataSource="desensitizedPicList" :columns="columns" :pagination="false" class="pic-list" bordered>
                  <template #bodyCell="{ column, record, text }">
                    <template v-if="column.dataIndex === 'status'">
                      <!--                  <a-tag v-if="text == 1">启用</a-tag>-->
                      <!--                  <a-tag v-if="text == 2">禁用</a-tag>-->
                      <LydcTag v-if="text == 1" theme="green" text="启用"></LydcTag>
                      <LydcTag v-if="text == 2" theme="red" text="禁用"></LydcTag>
                    </template>
                    <template v-else-if="column.dataIndex === 'originFileName'">
                      <a @click="handlePreview(record)">{{ text }}</a>
                    </template>
                    <template v-else-if="column.dataIndex === 'creatorTime'">
                      {{ dayjs(text).tz().format('YYYY-MM-DD HH:mm:ss') }}
                    </template>
                    <template v-else-if="column.dataIndex === 'action'">
                      <a-button type="link" v-auth="'btn_upload_pic'" @click="handleUpload(record)">上传 </a-button>
                    </template>
                    <template v-else-if="column.dataIndex === 'enable'">
                      <a-button v-if="record.status == 2" type="link" v-auth="'btn_enable'">启用 </a-button>
                      <a-button v-if="record.status == 1" type="link" disabled>禁用 </a-button>
                    </template>
                    <template v-else-if="column.dataIndex === 'download'">
                      <a-button type="link" v-auth="'btn_download_pic'" @click="handleHistoryDownload(record)">下载 </a-button>
                    </template>
                    <template v-else-if="column.dataIndex === 'delete'">
                      <a-button type="link" v-auth="'btn_delete_dese_pic'" @click="handleDeletePic(record)">删除 </a-button>
                    </template>
                  </template>
                </a-table>
              </a-collapse-panel>
              <a-collapse-panel key="2" header="客户原图" :forceRender="true">
                <template #extra>
                  <a-button type="link" v-auth="'btn_upload_pic'" @click.stop="handleUploadPic"
                    >{{ customerPicList.length > 0 ? '图纸升版' : '上传图纸' }}
                  </a-button>
                </template>
                <a-table :dataSource="customerPicList" :columns="customColumns" :pagination="false" class="pic-list" bordered>
                  <template #bodyCell="{ column, record, text }">
                    <template v-if="column.dataIndex === 'status'">
                      <!--                  <a-tag v-if="text == 1">启用</a-tag>-->
                      <!--                  <a-tag v-if="text == 2">禁用</a-tag>-->
                      <LydcTag v-if="text == 1" theme="green" text="启用"></LydcTag>
                      <LydcTag v-if="text == 2" theme="red" text="禁用"></LydcTag>
                    </template>
                    <template v-else-if="column.dataIndex === 'originFileName'">
                      <a @click="handlePreview(record)">{{ text }}</a>
                    </template>
                    <template v-else-if="column.dataIndex === 'creatorTime'">
                      {{ dayjs(text).tz().format('YYYY-MM-DD HH:mm:ss') }}
                    </template>
                    <template v-else-if="column.dataIndex === 'action'">
                      <a-button type="link" v-auth="'btn_upload_pic'" @click="handleUpload(record)">上传 </a-button>
                    </template>
                    <template v-else-if="column.dataIndex === 'enable'">
                      <a-button v-if="record.status == 2" type="link" v-auth="'btn_enable'" @click="handleEnable(record)">启用 </a-button>
                      <a-button v-if="record.status == 1" type="link" disabled>禁用 </a-button>
                    </template>
                    <!--                    <template v-else-if="column.dataIndex === 'download'">-->
                    <!--                      <a-button type="link"-->
                    <!--                                @click="handleHistoryDownload(record)"-->
                    <!--                      >下载-->
                    <!--                      </a-button>-->
                    <!--                    </template>-->
                    <template v-else-if="column.dataIndex === 'delete'">
                      <a-button type="link" v-auth="'btn_delete_cust_pic'" @click="handleDeletePic(record)">删除 </a-button>
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
          <a-tab-pane key="2" tab="报价" force-render>
            <a-list size="small" bordered :data-source="state.quotaList">
              <template #renderItem="{ item: value, index }">
                <a-list-item>
                  <a-list-item-meta
                    style="cursor: pointer"
                    @click="handleAutoQuery(value)"
                    :description="`申请人: ${value.ApplyUserName} 客户: ${value.TerminalCustomerCode} 报价需求单号: ${value.ApplyCode}`">
                    <template #avatar>
                      {{ index + 1 }}
                      {{ dayjs(value.CreatorTime).tz().format('YYYY-MM-DD HH:mm:ss') }}
                    </template>
                  </a-list-item-meta>
                </a-list-item>
              </template>
            </a-list>
          </a-tab-pane>
        </a-tabs>
      </Col>
      <!--      <Col :span="6" style="padding-left: 10px; border-left: 1px solid #dbdbdb">-->
      <!--        <div class="title-stick">-->
      <!--          <div class="gun"></div>-->
      <!--          <div class="title">产品图片</div>-->
      <!--        </div>-->
      <!--        <ImageUpload-->
      <!--          :api="uploadProductCodeImg"-->
      <!--          :uploadParams="{-->
      <!--            Id: id,-->
      <!--          }"-->
      <!--          :disabled="!hasBtnP('btn_edit')"-->
      <!--          width="180px"-->
      <!--          height="180px"-->
      <!--          :value="fileList"-->
      <!--          style="min-height: 200px"-->
      <!--          :maxnumber="1"-->
      <!--          @change="handleFileChange" />-->
      <!--      </Col>-->
    </Row>
  </a-card>
  <UploadModal
    @register="registerUpload"
    @getTable="
      () => {
        getDrawingList(state.current.Id);
      }
    " />
  <Preview ref="filePreviewRef" />
</template>

<script lang="ts" setup>
  import { FormSchema, useForm, BasicForm } from '/@/components/Form';
  import {
    deleteDrawings,
    downloadDrawingshistory,
    enableDrawings,
    getCustomerList,
    getDrawingshistory,
    getFactoryList,
    getPartNumberApplyDetail,
    getProjectList,
    getQuotationRequirementsList,
    postPartNumberApply,
    putCustomerList,
  } from '/@/api/basicData/productCodeApply';
  import { nextTick, reactive, ref, toRefs, computed, watchEffect } from 'vue';
  import { Row, Col, message } from 'ant-design-vue';
  import { useUserStore } from '/@/store/modules/user';
  import { useDebounceFn } from '@vueuse/core';
  import { useBaseStore } from '/@/store/modules/base';
  import { uploadProductCodeImg } from '/@/api/sys/upload';
  import { ImageUpload } from '/@/components/Upload';
  import dayjs from 'dayjs';
  import { useMessage } from '/@/hooks/web/useMessage';
  import UploadModal from '/@/views/basicData/productCodeApply/components/uploadModal.vue';
  import { ModalComponent } from '/@/views/basicData/encodingSettings/types';
  import Preview from '/@/views/basicData/productCodeApply/components/Preview.vue';
  import { copyTextToClipboard } from '/@/views/basicData/productCodeApply/utils/copyTextToClipboard';
  import { useRouter } from 'vue-router';
  import { downloadByUrl } from '/@/utils/file/download';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { useModal } from '/@/components/Modal';
  import { BasicColumn } from '/@/components/Table';
  import { getBaseDataTerminalCustomerList } from '/@/api/finance/wageRate';
  const { createMessage } = useMessage();
  const { hasBtnP } = usePermission();
  const emit = defineEmits(['changeLoading', 'register']);

  const baseStore = useBaseStore();
  const userStore = useUserStore();
  const router = useRouter();
  const userInfo = userStore.getUserInfo;

  const [registerUpload, { openModal: openUpload }] = useModal();

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
  const modalRef = ref<ModalComponent | null>(null);
  const filePreviewRef = ref<any | null>(null);

  const columns: BasicColumn[] = [
    {
      title: '版本',
      dataIndex: 'version',
      key: 'version',
      width: 50,
      customCell: (record, index, column) => {
        const rowSpan = getRowSpan(record, index);
        return { rowSpan };
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      customCell: (record, index, column) => {
        const rowSpan = getRowSpan(record, index);
        return { rowSpan };
      },
    },
    {
      title: '名称',
      width: 230,
      dataIndex: 'originFileName',
      key: 'originFileName',
    },
    { title: '上传时间', dataIndex: 'creatorTime', width: 180 },
    {
      title: '上传人',
      dataIndex: 'creatorUserName',
      width: 220,
    },
    // {
    //   title: '操作',
    //   dataIndex: 'action',
    //   colSpan: 4,
    //   width: 60,
    //   customCell: (record, index, column) => {
    //     const rowSpan = getRowSpan(record, index);
    //     return { rowSpan };
    //   },
    // },
    // {
    //   title: '',
    //   colSpan: 0,
    //   width: 60,
    //   dataIndex: 'enable',
    //   customCell: (record, index, column) => {
    //     const rowSpan = getRowSpan(record, index);
    //     return { rowSpan };
    //   },
    // },
    // {
    //   title: '',
    //   colSpan: 0,
    //   width: 60,
    //   dataIndex: 'download',
    // },
    // {
    //   title: '',
    //   colSpan: 0,
    //   width: 60,
    //   dataIndex: 'delete',
    // },
  ];

  const customColumns: BasicColumn[] = [
    {
      title: '版本',
      dataIndex: 'version',
      key: 'version',
      width: 50,
      customCell: (record, index, column) => {
        const rowSpan = getCustomerRowSpan(record, index);
        return { rowSpan };
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      customCell: (record, index, column) => {
        const rowSpan = getCustomerRowSpan(record, index);
        return { rowSpan };
      },
    },
    {
      title: '名称',
      width: 230,
      dataIndex: 'originFileName',
      key: 'originFileName',
    },
    { title: '上传时间', dataIndex: 'creatorTime', width: 180 },
    {
      title: '上传人',
      dataIndex: 'creatorUserName',
      width: 220,
    },
    // {
    //   title: '操作',
    //   dataIndex: 'action',
    //   colSpan: 3,
    //   width: 80,
    //   customCell: (record, index, column) => {
    //     const rowSpan = getCustomerRowSpan(record, index);
    //     return { rowSpan };
    //   },
    // },
    // {
    //   title: '',
    //   colSpan: 0,
    //   width: 80,
    //   dataIndex: 'enable',
    //   customCell: (record, index, column) => {
    //     const rowSpan = getCustomerRowSpan(record, index);
    //     return { rowSpan };
    //   },
    // },
    // // {
    // //   title: "",
    // //   colSpan: 0,
    // //   dataIndex: "download"
    // // },
    // {
    //   title: '',
    //   colSpan: 0,
    //   width: 80,
    //   dataIndex: 'delete',
    // },
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
  const [registerForm, { setFieldsValue, validateFields, updateSchema }] = useForm({
    baseColProps: {
      span: 4,
    },
    schemas: getFormSchema(),
    layout: 'vertical',
    labelWidth: 220,
    disabled: isReview,
  });

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
    console.log(item);
    const params = {
      name: item.fileName,
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

  async function getQuotaList(record) {
    const { data, code } = await getQuotationRequirementsList({
      InsidePartNumber: record.InsidePartNumber,
    });
    if (code === 200) {
      state.quotaList = data;
    }
  }
  const handleInsideProjectCodeSearch = useDebounceFn(async val => {
    const { code, data } = await getProjectList({ InsideProjectCode: val });

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

  function getFormSchema(): FormSchema[] {
    return [
      {
        field: 'MainProcess',
        label: '主要制程',
        component: 'Select',
        componentProps: {
          placeholder: '请选择',
          disabled: true,
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
        field: 'Factory',
        label: '工厂',
        component: 'Select',
        componentProps: {
          placeholder: '请选择工厂',
          showSearch: true,
          filterOption: (input: string, option: any) => {
            return option.Name.toLowerCase().indexOf(input.toLowerCase()) >= 0;
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
                return Promise.reject('值不能为空');
              }
              if (/^(?:[0-9][1-9]|0[A-Z])$/.test(value)) {
                return Promise.resolve();
              } else {
                return Promise.reject('请输入正确的终端料号版本');
              }
            },
          },
        ],
      },
      {
        field: 'Config',
        label: 'Config',
        component: 'Input',
        componentProps: { placeholder: '请输入', disabled: true, maxLength: 2 },
        rules: [
          {
            trigger: 'blur',
            required: true,
            validator: (_, value) => {
              if (!value) {
                return Promise.reject('值不能为空');
              }
              if (value.includes('I') || value.includes('O')) {
                return Promise.reject('值不能为I或者O');
              }
              if (/^(?:[0-9]{2})$/.test(value)) {
                return Promise.resolve();
              } else {
                return Promise.reject('请输入正确的Config');
              }
            },
          },
        ],
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
        field: 'ImmediateCustomerPartNumber',
        label: '直接客户料号',
        component: 'Input',
        componentProps: { placeholder: '请输入直接客户料号' },
      },
      {
        field: 'ImmediateCustomerPartVersion',
        label: '直接客户料号版本',
        component: 'Input',
        componentProps: { placeholder: '请输入直接客户料号版本' },
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
      {
        field: 'Remark',
        label: '备注',
        component: 'Input',
        componentProps: { placeholder: '请输入备注' },
        colProps: {
          span: 8,
        },
      },
      {
        field: 'InsidePartNumberOld',
        label: '旧产品内部料号',
        component: 'Input',
        componentProps: { placeholder: '/', disabled: true },
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
      MainProcess,
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
      Status: '未审核',
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

    getFactoryList({}).then(({ code: factoryCode, data: factoryList }) => {
      if (factoryCode === 200) {
        updateSchema({
          field: 'Factory',
          componentProps: {
            options: factoryList.map(item => ({
              ...item,
              Name: `${item.Name}(${item.Code})`,
            })),
            fieldNames: { value: 'Code', label: 'Name' },
          },
        });
      }
    });
  };

  function initData(val) {
    getDrawingList(val.Id);
    getQuotaList(val);
    emit('changeLoading', true);
    getPartNumberApplyDetail(val.Id).then(({ code, data }) => {
      nextTick(async () => {
        const mainProcessOption = await baseStore.getDictionaryData('MainProcess');
        const shipPattern = await baseStore.getDictionaryData('ShipPattern');

        const process = mainProcessOption.find(item => item.enCode === data.MainProcess);

        const pattern = shipPattern.find(item => item.fullName === process.fullName);
        const l = await baseStore.getDictionaryData(pattern.enCode);

        // setFieldsValue({
        //   ProductLineCode: data.ProductLineCode + '/' + data.ProductLineName,
        // });
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

        state.current = data;
        console.log(data.ProductImage);
        state.fileList = data.ProductImage;
        setFieldsValue({
          ...data,
          ProductLineCode: val.ProductLineCode + '/' + val.ProductLineName,
        });
        emit('changeLoading', false);
      });
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
  }

  function handleUpload(record) {
    openUpload(true, {
      Id: state.current?.Id,
      Version: record.version,
    });
  }

  function handleEnable(record) {
    console.log(record.id);
    console.log(record);
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

  function handleUploadPic() {
    // const modalVal = modalRef.value!;
    // modalVal.setVisible(true);
    openUpload(true, {
      Id: state.current?.Id,
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

  async function buildParams() {
    const values = await validateFields();
    if (!values) return;
    delete values.Status;
    values.Id = state.current.Id;
    values.ProductImage = state.fileList;
    console.log(values);
    return values;
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

  //:deep(.lydc-basic-form) {
  //  margin-bottom: 12px;
  //}
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

  //:deep(.ant-table .ant-table-cell) {
  //  white-space: nowrap;
  //  overflow: hidden;
  //  text-overflow: ellipsis;
  //}

  :deep(.ant-table .ant-table-cell) {
    white-space: normal !important;
  }

  :deep(.pic-list .ant-btn) {
    padding: 0;
  }
</style>
