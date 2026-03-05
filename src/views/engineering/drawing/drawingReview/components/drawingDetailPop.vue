<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    :showOkBtn="false"
    :showCancelBtn="false"
    :title="t('dict.DrawingsReviewColumn')"
    destroyOnClose
    class="full-popup p-10px">
    <template #title>
      <span class="min-w-[95px]">{{ t('dict.DrawingsReviewColumn') }}</span>
    </template>
    <template #appendToolbar>
      <a-space class="toggle-current">
        <a-button
          @click="
            () => {
              closePopup();
              emit('reload');
            }
          "
          >{{ t('common.cancel') }}
        </a-button>
        <a-button
          v-auth="'btn_edit'"
          v-if="sign !== 'detail' && current?.reviewNode == 'Engineering' && current.status != 3"
          :disabled="userInfo.userId !== current.handlerId"
          @click="handleSave('save')"
          >{{ t('dict.SMAApplyStatus.Storage') }}
        </a-button>
        <a-button
          v-auth="'btn_edit'"
          v-if="sign !== 'detail' && current.status != 3"
          :disabled="userInfo.userId !== current.handlerId"
          type="primary"
          @click="handleSave('submit')"
          >{{ t('common.submitText') }}{{ cacheList.length > 1 && currentIndex !== cacheList.length - 1 ? t('dict.Common.andNext') : '' }}
        </a-button>
        <a-button preIcon="icon-ym icon-ym-left" @click="changeCurrent('pre')"></a-button>
        <div class="state-box">
          <span>{{ currentIndex + 1 }}</span>
          / {{ total }}
        </div>
        <a-button preIcon="icon-ym icon-ym-right" @click="changeCurrent('next')"></a-button>
      </a-space>
    </template>
    <ScrollContainer>
      <div class="p-12px" style="border-bottom: 8px solid #f5f5f5">
        <Subtitle :title="t('common.baseinfo')" />
        <div class="lydc-content-wrapper-search-box">
          <div class="content-header-wraper">
            <template v-for="item in headerMsg">
              <template v-if="item.dataIndex === 'originCode'">
                <div class="item-box" :key="item.value">
                  <div class="item-box-label">{{ item.label }}：</div>
                  <div class="item-box-value" style="margin-right: 10px">{{ item.value }} </div>
                  <a-tag color="success" v-if="item.originType == '1'">{{ current?.demandTypeName }} </a-tag>
                  <a-tag color="warning" v-if="item.originType == '2'">{{ current?.demandTypeName }} </a-tag>
                  <a-tag color="processing" v-if="item.originType == '3'">{{ current?.demandTypeName }} </a-tag>
                </div>
              </template>
              <template v-else-if="item.dataIndex === 'status'">
                <div class="item-box" v-if="item.value" :key="item.value">
                  <div class="item-box-label">{{ item.label }}：{{ item.status }}</div>
                  <a-tag color="processing" v-if="item.value == '1'">{{ t('dict.DrawingsReviewColumn.notReviewed') }} </a-tag>
                  <a-tag color="warning" v-if="item.value == '2'">{{ t('dict.Flow.NodeStatus.2') }} </a-tag>
                  <a-tag color="success" v-if="item.value == '3'">{{ t('dict.DrawingsReviewColumn.reviewed') }} </a-tag>
                </div>
              </template>
              <template v-else-if="item.dataIndex === 'desensitizedDrawingsName'">
                <div class="item-box" v-if="item.value">
                  <div class="item-box-label">{{ item.label }}：</div>
                  <div class="item-box-value">
                    <a-button type="link" @click="handlePreviewDese" preIcon="icon-ym icon-ym-comment-file">
                      {{ item.value }}
                    </a-button>
                    <div
                      v-auth="'btn_download_pic'"
                      style="color: #ff7b00; cursor: pointer"
                      @click.stop="handleDownload"
                      class="icon-ym icon-ym-download"></div>
                  </div>
                </div>
              </template>
              <template v-else-if="item.dataIndex === 'reviewNode'">
                <div class="item-box" v-if="item.value">
                  <div class="item-box-label">{{ item.label }}：</div>
                  <a-tag>{{ item.value }}</a-tag>
                </div>
              </template>
              <template v-else-if="item.dataIndex === 'openDetail'">
                <div class="item-box" v-if="current.status != 3">
                  <div class="item-box-label">{{ item.label }}：</div>
                  <div class="item-box-value">
                    <a-button type="link" @click="routeDetail" preIcon="icon-ym icon-ym-report-icon-preview-pdf">
                      {{ item.value }}
                    </a-button>
                  </div>
                </div>
              </template>
              <template v-else-if="item.dataIndex === 'remark'">
                <div class="item-box">
                  <div class="item-box-label">{{ item.label }}：</div>
                  <div class="item-box-value">
                    <span v-if="item.value" style="color: #ff7b00">{{ item.value }}</span>
                    <span v-else>{{ t('dict.ResistStaticElectricityEnum.Nothing') }}</span>
                  </div>
                </div>
              </template>
              <template v-else>
                <div class="item-box" v-if="item.value">
                  <div class="item-box-label">{{ item.label }}：</div>
                  <div class="item-box-value">{{ item.value }}</div>
                </div>
              </template>
            </template>
          </div>
        </div>
      </div>
      <div class="p-12px" style="border-bottom: 8px solid #f5f5f5">
        <Subtitle :title="t('dict.MrbApplyColumn.reviewResultName')" />
        <BasicForm @register="registerForm" />
      </div>
      <div class="wrap-content">
        <div class="content-item">
          <div class="top-container">
            <div class="title-box">
              <Subtitle :title="t('dict.DrawingsReviewColumn.issue')" />
            </div>
            <a-space>
              <a-button
                v-auth="'btn_edit'"
                v-if="sign !== 'detail' && beforeEPM && current.status != 3"
                :disabled="userInfo.userId !== current.handlerId"
                @click="handleUploadAttach"
                >{{ t('dict.PurchaseQuotationColumn.UploadAttachment') }}
              </a-button>
              <!--	            添加问题-->
              <a-button
                v-auth="'btn_edit'"
                v-if="sign !== 'detail' && beforeEPM && current.status != 3"
                :disabled="userInfo.userId !== current.handlerId"
                @click="handleAddQuestion"
                >{{ t('dict.DrawingsReviewColumn.addQuestion') }}
              </a-button>
            </a-space>
          </div>
          <div class="question-list">
            <BasicTable @register="registerTable">
              <template #bodyCell="{ column, index, text }">
                <template v-if="column.dataIndex === 'issueDetailImage'">
                  <ImageUpload
                    v-if="text && text !== 'null' && text.length > 0"
                    :api="uploadPCCImg"
                    width="110px"
                    height="110px"
                    :value="text"
                    disabled
                    style="min-height: 115px; margin-bottom: 0"
                    :maxNumber="1">
                    <template #removeIcon>
                      <div></div>
                    </template>
                  </ImageUpload>
                  <p v-else>/</p>
                </template>
                <template v-else-if="column.dataIndex === 'scenarioImage'">
                  <!--                <img v-if="text && text !== 'null' && text.length > 0" :src="text[0]" />-->
                  <ImageUpload
                    v-if="text && text !== 'null' && text.length > 0"
                    :api="uploadPCCImg"
                    width="110px"
                    height="110px"
                    :value="text"
                    disabled
                    style="min-height: 115px; margin-bottom: 0"
                    :maxNumber="1" />
                  <p v-else>/</p>
                </template>
                <template v-else-if="column.dataIndex === 'action'">
                  <TableAction :actions="getTableActions(index)" />
                </template>
              </template>
              <template v-if="current.attachmentName" #footer>
                <div class="summary-box">
                  <div class="box-left">
                    <b>附件:</b>
                    <a-button type="link" @click="handlePreview" preIcon="icon-ym icon-ym-comment-file">{{ current.attachmentName }} </a-button>
                  </div>
                  <div class="box-right">
                    <a-button type="link" @click="handleHistory" preIcon="icon-ym icon-ym icon-ym-extend-history">
                      {{ t('dict.DrawingsReviewColumn.historyRecord') }}
                    </a-button>
                  </div>
                </div>
              </template>
            </BasicTable>
          </div>
        </div>
        <div class="content-item">
          <div class="top-container">
            <div class="title-box">
              <Subtitle :title="t('dict.DrawingsReview.ReviewOpinion')" />
            </div>
          </div>
          <template v-if="(current?.reviewNode == 'Engineering' && comments.length <= 0) || current.reviewNode === 'PdLeaderCheck'">
            <Empty class="empty-center" :description="t('dict.DrawingsReviewColumn.noReviewComments')" />
          </template>
          <template v-else>
            <div class="time-content">
              <Timeline style="margin: 16px 0 0 15px" :reverse="true">
                <Timeline.Item color="green" v-for="item in comments">
                  <div class="time-item">
                    <div class="name-time">
                      <div class="name-box">
                        <div class="name">{{ item.reviewUserName }}</div>
                        <div class="position">{{ item.nodeHandler }}</div>
                      </div>
                      <div class="time">{{ dayjs(item.creatorTime).tz().format('YYYY-MM-DD HH:mm:ss') }}</div>
                    </div>
                    <div class="content-box">
                      <div
                        >{{ item.nodeHandler?.includes('EPMPerson') ? t('dict.DrawingsReviewColumn.customer') : '' }}{{ t('dict.ECNColumn.reviewComments') }}:
                        {{ ReviewOpinion.find(val => val.enCode === item.reviewOpinion)?.fullName }}
                      </div>
                      <div
                        >{{ item.nodeHandler?.includes('EPMPerson') ? t('dict.DrawingsReviewColumn.customer') : ''
                        }}{{ t('dict.ShippingSpaceColumn.remarks') }}: {{ item.remark }}</div
                      >
                    </div>
                  </div>
                </Timeline.Item>
                <Timeline.Item color="green" v-if="current.status != 3 && state.sign !== 'detail' && current.reviewNode !== 'PdLeaderCheck'">
                  <div class="time-item">
                    <div class="name-time">
                      <div class="name-box">
                        <div class="name">{{ userInfo.userName }}</div>
                        <div class="position">{{ current.nodeHandler }}</div>
                      </div>
                    </div>
                    <div class="content-box">
                      <div class="ipt-box">
                        <span class="ipt-label"
                          >{{ current.reviewNode?.includes('EPMReview') ? t('dict.DrawingsReviewColumn.customer') : ''
                          }}{{ t('dict.ECNColumn.reviewComments') }}:
                        </span>
                        <a-select
                          v-if="current.reviewNode !== 'PdLeaderCheck'"
                          class="ipt-content"
                          v-model:value="reviewOpinion"
                          :fieldNames="{ label: 'fullName', value: 'enCode' }"
                          :options="ReviewOpinion"
                          :placeholder="t('dict.DrawingsReviewColumn.selectOpinion')" />
                      </div>
                      <div class="ipt-box">
                        <span class="ipt-label"
                          >{{ current.reviewNode?.includes('EPMReview') ? t('dict.DrawingsReviewColumn.customer') : ''
                          }}{{ t('dict.SalesForecastColumn.remark') }}:
                        </span>
                        <a-textarea
                          v-if="current.reviewNode !== 'PdLeaderCheck'"
                          class="ipt-content"
                          v-model:value="remark"
                          :auto-size="{ minRows: 1, maxRows: 5 }"
                          :placeholder="t('dict.DrawingsReviewColumn.enterContent')" />
                      </div>
                    </div>
                  </div>
                </Timeline.Item>
              </Timeline>
            </div>
          </template>
        </div>
      </div>
      <Form @register="registerFormQus" @reload="tableReload" />
    </ScrollContainer>
    <DetailListModal @register="registerDetailList" />
    <QuestionModal ref="questionRef" @reload="tableReload" />
    <QuestionModalView ref="questionViewRef" />
    <Preview ref="filePreviewRef" />
    <FileListModal @register="registerFileList" />
    <UploadModal v-bind="uploadState" @register="registerUploadAttach" ref="uploadAttachRef" @success="setFileData(current)" />
    <AttachHistory
      @register="registerAttachHistory"
      @reload="
        () => {
          getInitData(current);
        }
      " />
  </BasicPopup>
</template>
<script setup lang="ts">
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { computed, nextTick, onMounted, reactive, ref, toRefs, unref } from 'vue';
  import { Empty, message, Timeline } from 'ant-design-vue';
  import TitleStick from '/@/views/basicData/encodingSettings/components/titleLeftStick.vue';
  import { BasicForm, FormSchema, useForm } from '/@/components/Form';
  import { BasicColumn, BasicTable, TableAction, useTable } from '/@/components/Table';
  import DetailListModal from '../components/DetailListModal.vue';
  import QuestionModal from '../components/QuestionModal.vue';
  import QuestionModalView from './QuestionModalView.vue';
  import UploadAttach from './UploadAttach.vue';
  import AttachHistory from './AttachHistory.vue';
  import dayjs from 'dayjs';
  import { Subtitle } from '/@/components/Subtitle';
  import { ScrollContainer } from '/@/components/Container';
  import {
    delDrawingsReviewContent,
    getDrawingsReviewContent,
    getDrawingsReviewDetail,
    getDrawingsReviewRecordList,
    postDrawingsReviewCommit,
    postDrawingsReviewResult,
    postDrawingsReviewUploadAttach,
  } from '/@/api/engineering/drawingReview';
  import { useBaseStore } from '/@/store/modules/base';
  import { getAuthCache } from '/@/utils/auth';
  import { USER_INFO_KEY } from '/@/enums/cacheEnum';
  import { UserInfo } from '/#/store';
  import Preview from '/@/views/basicData/productCodeApply/components/Preview.vue';
  import { useModal } from '/@/components/Modal';
  import Form from './Form.vue';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { downloadByUrl } from '/@/utils/file/download';
  import { downloadDrawingshistory } from '/@/api/basicData/productCodeApply';
  import Template from '/@/views/engineering/pcc/pccApply/components/Template.vue';
  import { uploadPCCImg } from '/@/api/sys/upload';
  import { ImageUpload, UploadModal } from '/@/components/Upload';
  import { getNodeRemark } from '/@/adapter/utils';
  import { FileListModal } from '/@/components/Upload';
  import { CURRENT_RM_NODE } from '../config';
  import { getDrawingsHistory } from '/@/api/common/files';
  const { t } = useI18n();

  const [registerFormQus, { openModal: openFormModal }] = useModal();
  const [registerAttachHistory, { openModal: openAttachHistory }] = useModal();
  const [registerDetailList, { openModal: openDetailList }] = useModal();
  const [registerUploadAttach, { openModal: openUploadAttach }] = useModal();
  const emit = defineEmits(['reload', 'register']);
  const filePreviewRef = ref<any>(null);

  const { hasBtnP } = usePermission();

  interface StateType {
    total: number;
    currentIndex: number;
    list: any[];
    comments: any[];
    DFMList: any[];
    MakeEngineeringInfoList: any[];
    ReviewResultList: any[];
    current: object;
    reviewNode: string;
    userInfo: UserInfo;
    reviewOpinion: string | undefined;
    remark: string;
    cacheList: any[];
    headerMsg: any[];
    ReviewOpinion: any[];
  }

  const modalRef = ref(null);
  const questionRef = ref(null);
  const questionViewRef = ref(null);
  const uploadAttachRef = ref(null);
  const state = reactive<StateType>({
    total: 10,
    currentIndex: 1,
    current: {},
    cacheList: [],
    list: [],
    DFMList: [],
    MakeEngineeringInfoList: [],
    ReviewResultList: [],
    ReviewOpinion: [],
    reviewNode: '',
    userInfo: {},
    comments: [],
    headerMsg: [],
    reviewOpinion: undefined,
    remark: '',
    sign: '',
    issueTypeList: [],
  });

  // 在EPM之前的节点 工程评审 、PD Leader复核
  const beforeEPM = computed(() => state?.current?.reviewNode == 'Engineering' || state.current?.reviewNode?.includes('PdLeaderCheck'));

  /** 如果当前节点是`PD Leader复核`，则`评审结论`和`是否提DFM`不可编辑 **/
  const isPdLeaderCheck = computed(() => state.current?.reviewNode?.includes('PdLeaderCheck'));

  const uploadState = reactive({
    title: t('dict.DrawingsReviewColumn.uploadDrawingReviewAttachments'),
    param: {},
    mutiple: false,
    api: postDrawingsReviewUploadAttach,
  });
  const baseStore = useBaseStore();
  const schemas: FormSchema[] = [
    {
      field: 'reviewResult',
      label: t('dict.DrawingsReview.ReviewResult'),
      component: 'Select',
      colProps: {
        span: 3,
      },
      dynamicDisabled: () => {
        if (isPdLeaderCheck.value) {
          return true;
        }
        return !beforeEPM.value;
      },
      componentProps: {
        placeholder: t('dict.DrawingsReview.ReviewResult'),
        onChange: e => {
          console.log(e, 'eeeee');
          if (e == '2') {
            // 不通过
            setFieldsValue({
              dfm: '1',
            });
            // updateSchema([
            //   {
            //     field: 'dfm',
            //     dynamicDisabled: true,
            //   },
            //   {
            //     field: 'makeEngineeringInfo',
            //
            //   },
            // ]);
          } else {
            // 通过
            setFieldsValue({
              makeEngineeringInfo: '1',
            });
            // updateSchema([
            //   {
            //     field: 'dfm',
            //     dynamicDisabled: false,
            //   },
            //   {
            //     field: 'makeEngineeringInfo',
            //     dynamicDisabled: true,
            //   },
            // ]);
          }
        },
        options: state.ReviewResultList,
        fieldNames: { value: 'enCode' },
      },
      rules: [{ required: true, trigger: 'blur', message: t('common.required') }],
    },
    // 工程资料能否制作
    {
      field: 'makeEngineeringInfo',
      label: t('dict.DrawingsReviewColumn.canPrepareEngineeringMaterials'),
      component: 'Select',
      componentProps: {
        placeholder: t('dict.DrawingsReviewColumn.canPrepareEngineeringMaterials'),
        options: state.MakeEngineeringInfoList,
        fieldNames: { value: 'enCode' },
      },
      dynamicDisabled: params => {
        const { model } = params;
        if (!beforeEPM.value) return true;
        if (model.reviewResult == '2') {
          return false;
        }
        console.log(params, 'paramsparamsparamsparams');
        return true;
      },
      rules: [{ required: true, trigger: 'blur', message: t('common.required') }],
      colProps: {
        span: 4,
      },
    },
    // 是否提DFM
    {
      field: 'dfm',
      label: t('dict.DrawingsReviewColumn.submitDFMInquiry'),
      component: 'Select',
      dynamicDisabled: params => {
        if (current.value.nodeHandler?.includes('PdLeaderCheck')) return true;
        if (isPdLeaderCheck.value) {
          return true;
        }
        const { model } = params;
        if (model.reviewResult == '1') {
          return false;
        }
        if (!beforeEPM.value) return true;
        console.log(params, 'paramsparamsparamsparams');
        return true;
      },
      componentProps: {
        placeholder: t('dict.DrawingsReviewColumn.submitDFMInquiry'),
        options: state.DFMList,
        fieldNames: { value: 'enCode' },
      },
      colProps: {
        span: 4,
      },
      rules: [{ required: true, trigger: 'blur', message: t('common.required') }],
    },
    {
      field: 'pdLeader',
      label: 'PD Leader',
      component: 'CustomUserSelect',
      colProps: {
        span: 6,
      },
      // disabled: true,
      componentProps: {
        // disabled: true,
        placeholder: 'PD Leader',
        allowClear: true,
        showSearch: true,
      },
      ifShow: false,
      // ifShow: computed(() => state.current?.reviewNode?.includes('工程评审')),
      rules: [{ required: true, trigger: 'blur', message: t('common.required') }],
    },
    {
      field: 'epm',
      label: 'EPM',
      component: 'CustomUserSelect',
      componentProps: {
        placeholder: 'EPM',
        allowClear: true,
        showSearch: true,
      },
      // dynamicDisabled: () => {
      //   if(!beforeEPM.value) return true
      // },
      // ifShow: false,
      ifShow: computed(() => state.current?.reviewNode?.includes(t('dict.MoldFlowNode.PdReview'))),
      colProps: {
        span: 6,
      },
      rules: [{ required: true, trigger: 'blur', message: t('common.required') }],
    },
    // 工程经理
    {
      field: 'pdManager',
      label: t('dict.MaterialDevelopApplyReportColumn.pdManagerName'),
      component: 'CustomUserSelect',
      componentProps: {
        placeholder: t('dict.MaterialDevelopApplyReportColumn.pdManagerName'),
        allowClear: true,
        showSearch: true,
      },
      // dynamicDisabled: () => {
      //   if(!beforeEPM.value) return true
      // },
      ifShow: false,
      // ifShow: computed(() => state.current?.reviewNode?.includes('EPM评审')),
      colProps: {
        span: 6,
      },
      // dynamicDisabled: () => {
      //   if(!beforeEPM.value) return true
      // },
      rules: [{ required: true, trigger: 'blur', message: t('common.required') }],
    },
    // 运营
    // {
    //   field: 'operation',
    //   label: t('routes.dashboard-operate'),
    //   component: 'CustomUserSelect',
    //   componentProps: {
    //     placeholder: t('routes.dashboard-operate'),
    //     allowClear: true,
    //     showSearch: true,
    //   },
    //   ifShow: false,
    //   // ifShow: computed(() => state.current?.reviewNode?.includes('工程经理评审')),
    //   // colProps: {
    //   //   span: 4,
    //   // },
    //   rules: [{ required: true, trigger: 'blur', message: t('common.required') }],
    // },
  ];

  const columns: BasicColumn[] = [
    // {
    //   title: '评审人',
    //   dataIndex: 'reviewUserName',
    //   width: 120,
    // },
    // {
    //   title: '评审时间',
    //   dataIndex: 'reviewDate',
    //   format: 'date|YYYY-MM-DD HH:mm:ss',
    //   width: 120,
    // },
    // 问题类型
    {
      title: t('dict.DrawingsReview.IssueType'),
      dataIndex: 'issueType',
      width: 120,
      customRender: ({ text, record }) => {
        const item = state.issueTypeList.find(item => item.enCode == text);
        return item?.fullName || '/';
      },
    },
    // 问题详情
    {
      title: t('dict.DrawingsReviewColumn.problemDetails'),
      dataIndex: 'issueDetail',
      width: 120,
    },
    // 建议方案
    {
      title: t('dict.DrawingsReviewColumn.suggestedPlan'),
      dataIndex: 'scenario',
      width: 120,
    },
    // 问题图片
    {
      title: t('dict.DrawingsReviewColumn.problemPicture'),
      dataIndex: 'issueDetailImage',
      width: 120,
    },
    // 建议方案图片
    {
      title: t('dict.DrawingsReviewColumn.suggestedPlanPicture'),
      dataIndex: 'scenarioImage',
      width: 120,
    },
  ];
  const [registerPopup, { closePopup, changeLoading }] = usePopupInner(init);
  const [registerForm, { updateSchema, validateFields, setProps, setFieldsValue, resetFields }] = useForm({
    schemas: schemas,
    layout: 'vertical',
    labelWidth: '100%',
    baseColProps: {
      span: 8,
    },
  });

  const { total, currentIndex, current, cacheList, list, ReviewResultList, ReviewOpinion, userInfo, remark, reviewOpinion, comments, headerMsg, sign } =
    toRefs(state);
  const [registerTable, { reload }] = useTable({
    api: getDrawingsReviewContent,
    columns,
    // canResize: true,
    useSearchForm: false,
    pagination: false,
    showTableSetting: false,
    immediate: false,
    resizeHeightOffset: 60,
    // isCanResizeParent: true,
    beforeFetch: params => {
      const {
        current: { id },
      } = state;
      if (id) {
        params.id = id;
      }
    },
    afterFetch: data => {
      state.list = data;
    },
    actionColumn: {
      width: 90,
      title: t('views.business.quota.action'),
      dataIndex: 'action',
    },
  });

  const [registerFileList, { openModal: openFileListModal }] = useModal();

  function getReviewDetail(current) {
    if (current?.detailId) {
      return getDrawingsReviewDetail({
        id: current.detailId,
      });
    }
    return getDrawingsReviewDetail({
      originType: current.originType,
      originCode: current.originCode,
      insidePartNumber: current.insidePartNumber,
    });
  }

  function tableReload({ id }) {
    if (id) {
      state.current.id = id;
    }
    reload();
  }

  function handleUploadAttach() {
    console.log('上传附件');
    const { id, originCode, originType, insidePartNumber } = state.current;
    uploadState.param = {
      reviewId: id,
      originCode,
      originType,
      insidePartNumber,
    };
    openUploadAttach(true, {
      reviewId: id,
      originCode,
      originType,
      insidePartNumber,
    });
  }

  function getReviewRecord(current) {
    return getDrawingsReviewRecordList({
      insidePartNumber: current.insidePartNumber,
      id: current.id,
    });
  }

  async function getInitData(current) {
    await getTypeOptions();
    updateSchema([
      {
        field: 'epm',
        ifShow: false,
      },
      {
        field: 'pdLeader',
        ifShow: false,
      },
      {
        field: 'pdManager',
        ifShow: false,
      },
      {
        field: 'operation',
        ifShow: false,
      },
    ]);
    state.headerMsg = buildCurrentMsg(current);
    const p1 = getReviewDetail(current);
    const p2 = getReviewRecord(current);
    Promise.all([p1, p2]).then(async ([{ code: dCode, data: dData }, { code: rCode, data: rData }]) => {
      if (dCode === 200) {
        state.current = {
          ...dData,
          detailId: dData.id,
        };
        state.headerMsg = buildCurrentMsg(state.current);
        console.log(state.current, 77777);
        console.log('🚀 ~ Promise.all ~ dData:', dData);

        // await resetFields();
        updateSchema([
          {
            field: 'reviewResult',
            componentProps: {
              options: state.ReviewResultList,
              fieldNames: { value: 'enCode' },
            },
          },
          {
            field: 'makeEngineeringInfo',
            componentProps: {
              options: state.MakeEngineeringInfoList,
              fieldNames: { value: 'enCode' },
            },
          },
          {
            field: 'dfm',
            componentProps: {
              options: state.DFMList,
              fieldNames: { value: 'enCode' },
            },
          },
        ]);

        // 如果不等于开始节点 或者 状态 === 3
        if (dData.reviewNode == 'Engineering') {
          updateSchema([
            {
              field: 'epm',
              ifShow: true,
              componentProps: {
                disabled: state.sign === 'detail',
              },
            },
            {
              field: 'pdLeader',
              ifShow: true,
              componentProps: {
                // disabled: true,
              },
            },
          ]);
          setFieldsValue({
            epm: dData.epm,
            pdLeader: dData.pdLeader,
          });
        } else if (dData.reviewNode?.includes('EPMReview')) {
          console.log(666);
          const schema = {
            field: 'pdManager',
            ifShow: true,
            componentProps: {
              // disabled: true,
            },
          };
          if (state.sign === 'detail') {
            schema.componentProps = {
              disabled: true,
            };
          }
          console.log(dData);
          updateSchema(schema);
          setFieldsValue({
            pdManager: dData.pdManager,
          });
        } else if (dData.reviewNode?.includes('EngineeringManagerReview')) {
          // const schema = {
          //   field: 'operation',
          //   ifShow: true,
          //   componentProps: {
          //     // disabled: true,
          //   },
          // };
          // if (state.sign === 'detail') {
          //   schema.componentProps = {
          //     disabled: true,
          //   };
          // }
          // updateSchema(schema);
          // setFieldsValue({
          //   operation: dData.operation,
          // });
        } else if (dData.reviewNode?.includes('PdLeaderCheck')) {
          const schema = {
            field: 'epm',
            ifShow: true,
            componentProps: {
              disabled: true,
            },
          };
          if (state.sign === 'detail') {
            schema.componentProps = {
              disabled: true,
            };
          }
          updateSchema(schema);

          setFieldsValue({
            epm: dData.epm,
          });
        }
        if (state.sign == 'detail' || !dData.reviewNode == 'Engineering' || dData.status == '3') {
          console.log(233322323);
          setFieldsValue({
            reviewResult: dData.reviewResult,
            makeEngineeringInfo: dData.makeEngineeringInfo,
            dfm: dData.dfm,
          });

          console.log(state.ReviewResultList, 'state.ReviewResultListstate.ReviewResultListstate.ReviewResultListstate.ReviewResultList');

          updateSchema([
            {
              field: 'reviewResult',
              componentProps: {
                disabled: true,
                options: state.ReviewResultList,
                fieldNames: { value: 'enCode' },
              },
            },
            {
              field: 'makeEngineeringInfo',
              componentProps: {
                disabled: true,
                options: state.MakeEngineeringInfoList,
                fieldNames: { value: 'enCode' },
              },
            },
            {
              field: 'dfm',
              componentProps: {
                disabled: true,
                options: state.DFMList,
                fieldNames: { value: 'enCode' },
              },
            },
          ]);

          // nextTick(() => {
          //   setTimeout(() => {
          //     setProps({
          //       disabled: true,
          //     });
          //   }, 50);
          // });
        } else if (dData.status == '2') {
          console.log(999);
          setFieldsValue({
            reviewResult: dData.reviewResult,
            makeEngineeringInfo: dData.makeEngineeringInfo,
            dfm: dData.dfm,
          });
        } else {
          console.log(888, dData);
          setFieldsValue({
            reviewResult: dData.reviewResult,
            makeEngineeringInfo: dData.makeEngineeringInfo,
            dfm: dData.dfm,
          });
        }
        reload();
      }
      if (rCode === 200) {
        state.comments = rData;
      }
      changeLoading(false);
    });
  }

  function setFileData(current) {
    getReviewDetail(current).then(res => {
      const data = res.data;
      state.current.attachmentName = data.attachmentName || '';
      state.current.attachmentId = data.attachmentId || '';
    });
  }

  async function init(data) {
    changeLoading(true);
    const { detailId } = data;
    state.sign = data.sign;
    state.remark = '';
    state.reviewOpinion = undefined;
    state.userInfo = getAuthCache(USER_INFO_KEY);
    console.log('data->popup', data);
    if (detailId) {
      const { code, data: res } = await getReviewDetail({
        detailId,
      });
      if (code === 200) {
        console.log(66666);
        state.total = 1;
        state.current = res;
        state.currentIndex = 0;
        getInitData(res);
      }
      return;
    }
    const { cacheList, index } = data;
    state.total = cacheList.length;
    const current = cacheList[index];
    console.log('🚀 ~ init ~ current:', current);
    state.cacheList = cacheList;
    state.currentIndex = index;
    changeLoading(true);
    getInitData(current);
  }

  async function getTypeOptions() {
    setProps({
      disabled: false,
    });
    state.DFMList = await baseStore.getDictionaryData('DrawingsReview.DFM');
    state.MakeEngineeringInfoList = await baseStore.getDictionaryData('DrawingsReview.MakeEngineeringInfo');
    state.ReviewResultList = await baseStore.getDictionaryData('DrawingsReview.ReviewResult');
    state.ReviewOpinion = await baseStore.getDictionaryData('DrawingsReview.ReviewOpinion');
    console.log(ReviewResultList);
    return await updateSchema([
      {
        field: 'reviewResult',
        componentProps: {
          options: state.ReviewResultList,
          fieldNames: { value: 'enCode' },
        },
      },
      {
        field: 'makeEngineeringInfo',
        componentProps: {
          options: state.MakeEngineeringInfoList,
          fieldNames: { value: 'enCode' },
        },
      },
      {
        field: 'dfm',
        componentProps: {
          options: state.DFMList,
          fieldNames: { value: 'enCode' },
        },
      },
    ]);
  }

  async function handleSave(type) {
    const { reviewNode, originType, originCode, insidePartNumber, id } = state.current;
    changeLoading(true);
    try {
      const res = await validateFields();
      // 如果是PD, 调用保存审批结论
      if (reviewNode == 'Engineering') {
        const params = {
          originType,
          originCode,
          insidePartNumber,
          id,
          ...res,
        };
        if (type == 'save') {
          params.saveAndCommit = false;
        }
        if (type == 'submit') {
          params.saveAndCommit = true;
        }
        const { code, msg } = await postDrawingsReviewResult(params);
        if (code === 200) {
          message.success(msg);
          if (state.cacheList.length > 1 && state.currentIndex !== state.cacheList.length - 1) {
            changeCurrent('next');
          } else {
            closePopup();
            emit('reload');
          }
          // getInitData(state.cacheList[state.currentIndex]);
          // if (state.continueChecked) changeCurrent('next');
        }
      } else if (reviewNode?.includes('PdLeaderCheck')) {
        const params = {
          reviewId: id,
          ...res,
        };
        const { code, msg } = await postDrawingsReviewCommit(params);
        if (code === 200) {
          message.success(msg);
          // getInitData(state.cacheList[state.currentIndex]);
          if (state.cacheList.length > 1 && state.currentIndex !== state.cacheList.length - 1) {
            changeCurrent('next');
          } else {
            closePopup();
            emit('reload');
          }
          // if (state.continueChecked) changeCurrent('next');
        }
      } else {
        // 不是PD，也不是PD Leader复核
        const params = {
          reviewOpinion: unref(reviewOpinion),
          remark: unref(remark),
          reviewId: id,
          ...res,
        };
        const { code, msg } = await postDrawingsReviewCommit(params);
        if (code === 200) {
          message.success(msg);
          if (state.cacheList.length > 1 && state.currentIndex !== state.cacheList.length - 1) {
            changeCurrent('next');
          } else {
            closePopup();
            emit('reload');
          }
        }
      }
    } catch (e) {
    } finally {
      changeLoading(false);
    }
  }

  function buildCurrentMsg(current) {
    if (!current) return closePopup();
    console.log(current, '当前行数据');
    const message = [
      {
        label: t('dict.DrawingsReviewColumn.originCode'),
        dataIndex: 'originCode',
        originType: current.originType,
        value: current.originCode,
      },
      {
        label: t('dict.SalesForecastColumn.insidePartNumber'),
        dataIndex: 'insidePartNumber',
        value: current.insidePartNumber,
      },
      {
        label: t('dict.CommonCol.remark'),
        dataIndex: 'remark',
        value: getNodeRemark(current.nodeRemark, CURRENT_RM_NODE),
      },
      {
        label: t('dict.DrawingsReviewColumn.terminalCustomerPartNumber'),
        dataIndex: 'terminalCustomerCode',
        value: current.terminalCustomerPartNumber,
      },
      {
        label: t('dict.MoldApplySubColumn.currentNodeName'),
        dataIndex: 'reviewNodeName',
        value: current.reviewNodeName,
      },
      {
        label: t('common.insiderProjectCode'),
        dataIndex: 'insideProjectCode',
        value: current.insideProjectCode,
      },
      {
        label: t('dict.QuotationRequirementsColumn.FactoryName'),
        dataIndex: 'factory',
        value: current.factory,
      },
      {
        label: t('dict.MrbApplyColumn.creatorUserId'),
        dataIndex: 'applyUserName',
        value: current.applyUserName,
      },
      {
        label: t('dict.SalesForecastColumn.handlerName'),
        dataIndex: 'handlerName',
        value: current.handlerName,
      },
      {
        label: t('dict.CloudMeasureColumn.materialDesc'),
        dataIndex: 'productDesc',
        value: current.productDesc,
      },
      {
        label: t('dict.SampleApplyColumn.status'),
        dataIndex: 'status',
        value: current.status,
      },
      {
        label: t('dict.PartNumberApplyDrawingsType.DesensitizedDrawings'),
        dataIndex: 'desensitizedDrawingsName',
        value: current.desensitizedDrawingsName,
      },
      {
        label: t('dict.DrawingsReviewColumn.openDetail'),
        dataIndex: 'openDetail',
        value: t('common.viewDetails'),
      },
    ];
    return message;
  }

  const getTableActions = index => {
    const btnAuth: any = [];
    const viewBtn = {
      icon: 'icon-ym icon-ym-btn-preview',
      onClick: handleView.bind(null, index),
    };
    const editBtn = {
      icon: 'icon-ym icon-ym-extend-pencil',
      onClick: handleEdit.bind(null, index),
    };
    const delBtn = {
      icon: 'icon-ym icon-ym-delete',
      onClick: onDelete.bind(null, index),
    };
    const { status, reviewNode } = state.current;
    if (status && status == '3') {
      btnAuth.push(viewBtn);
      return btnAuth;
    }
    switch (reviewNode) {
      case 'Engineering':
        if (hasBtnP('btn_edit')) {
          btnAuth.push(editBtn);
        }
        if (hasBtnP('btn_del_qs')) {
          btnAuth.push(delBtn);
        }
        break;
      case 'PdLeaderCheck':
        if (hasBtnP('btn_edit')) {
          btnAuth.push(editBtn);
        }
        if (hasBtnP('btn_del_qs')) {
          btnAuth.push(delBtn);
        }
        break;
      case 'EPMReview':
        if (hasBtnP('btn_edit')) {
          btnAuth.push(editBtn);
        }
        break;
    }
    // 默认具备查看权限
    if (!btnAuth.length) {
      btnAuth.push(viewBtn);
    }
    return btnAuth;
  };

  // 打开图纸详情弹窗
  // function handleFileModal() {
  //   openFileListModal(true, {
  //     listApi: getDrawingsHistory,
  //     useQuery: true,
  //     insidePartNumber: state.current.insidePartNumber,
  //     keyFieldName: 'insidePartNumber',
  //     downloadApi: downloadDrawingshistory,
  //   });
  // }

  async function handleDownload() {
    const {
      data: { name, url },
    } = await downloadDrawingshistory({
      Id: state.current.desensitizedDrawingsId,
    });
    downloadByUrl({ url: url, target: '_blank', fileName: name });
  }

  function handleEdit(index) {
    const data = {
      current: state.current,
      cacheList: state.list,
      index,
    };
    // questionRef.value.setVisible(true, data, 'edit');
    openFormModal(true, {
      ...data,
      sign: 'edit',
    });
  }

  function handleView(index) {
    const data = {
      current: state.current,
      cacheList: state.list,
      index,
    };
    openFormModal(true, {
      ...data,
      sign: 'edit',
      disabled: true,
    });
    // if (!questionViewRef.value) return;
    // questionViewRef.value.setVisible(true, data);
  }

  async function onDelete(index) {
    const id = unref(list)[index]['id'];
    const { code, msg } = await delDrawingsReviewContent(id);
    if (code === 200) {
      message.success(msg);
      reload();
    }
  }

  /**
   *
   * @param type 'pre' | 'next'
   */
  function changeCurrent(type: 'pre' | 'next') {
    const index = unref(currentIndex);
    // 上一个
    if (type === 'pre') {
      if (index === 0) {
        return message.warning(t('common.firstOneTip'));
      }
      state.currentIndex = index - 1;
      getInitData(state.cacheList[index - 1]);
    }
    // 下一个
    if (type === 'next') {
      if (index === state.cacheList.length - 1) {
        return message.warning(t('common.lastOneTip'));
      }
      state.currentIndex = index + 1;
      getInitData(state.cacheList[index + 1]);
    }
  }

  function routeDetail() {
    // modalRef.value.setVisible(true, state.current);
    openDetailList(true, { ...state.current });
  }

  function handlePreview() {
    console.log('handlePreview');
    console.log(current);
    const currentVal = state.current;
    console.log(currentVal);
    const params = {
      name: currentVal.attachmentName,
      Id: currentVal.attachmentId,
      previewType: 'localPreview',
      noCache: false,
      isCopy: 0,
    };
    console.log(params);
    filePreviewRef.value?.init(params);
  }

  function handlePreviewDese() {
    console.log('handlePreviewDese');
    console.log(current);
    const currentVal = state.current;
    console.log(currentVal);
    const params = {
      name: currentVal.desensitizedDrawingsName,
      Id: currentVal.desensitizedDrawingsId,
      previewType: 'localPreview',
      noCache: false,
      isCopy: 0,
    };
    console.log(params);
    filePreviewRef.value?.init(params);
  }

  function handleAddQuestion() {
    const data = {
      current: state.current,
      cacheList: state.list,
    };
    openFormModal(true, {
      ...data,
      sign: 'add',
    });
    // questionRef?.value?.setVisible(true, data, 'add');
  }

  function handleHistory() {
    console.log(state.current);
    openAttachHistory(true, { ...state.current });
  }

  async function getOps() {
    state.issueTypeList = await baseStore.getDictionaryData('DrawingsReview.IssueType');
  }

  onMounted(() => {
    getOps();
  });
</script>
<style lang="less" scoped>
  .toggle-current {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .state-box {
    margin: 0 10px;
  }

  .title-box {
    margin-top: 12px;
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-left: 20px;

    .modal-title {
      color: #1a1a1a;

      /* 中文/标题16 */

      font-size: 16px;
      font-style: normal;
      font-weight: 700;
      line-height: 24px; /* 150% */
    }
  }

  .type-box {
    display: flex;
    padding: 2px 8px;
    justify-content: center;
    align-items: center;
    gap: 8px;
    border-radius: 2px;
    background: rgb(82 196 26 / 10%);
    color: #52c41a;
    text-align: center;

    /* 中文/正文(注释)12 */

    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: 20px; /* 166.667% */
  }

  .href-preview {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    //padding: 0px !important;
  }

  :deep(.href-preview .ant-btn) {
    padding: 0;
    height: 0;
  }

  :deep(.ant-descriptions-item) {
    padding: 2px 0;
  }

  .wrap-content {
    padding: 12px;
    display: flex;
    flex-direction: row;
    width: 100%;
    height: calc(100% - 66px);

    .content-item {
      display: flex;
      //flex: 1;
      width: 63%;
      //border-bottom: 1px solid #dbdbdb;
      flex-direction: column;
    }

    .question-list {
      height: 100%;
    }

    .empty-center {
      padding-top: 40px;
    }

    .content-item:first-child {
      padding-right: 12px;
      box-sizing: border-box;
      //border-right: 1px solid #dbdbdb;
    }

    .top-container {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: flex-start;
      //height: 60px;
      width: 100%;

      .title-box {
        margin: 4px;
        margin-left: 8px;
      }
    }
  }

  .bottom-toolbar {
    position: absolute;
    bottom: 0;
    height: 66px;
    padding: 18px 16px;
    box-sizing: border-box;
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }

  .time-item {
    display: flex;
    flex-direction: column;
  }

  .name-time {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    .name-box {
      display: flex;
      flex-direction: row;
      margin-bottom: 8px;

      .name {
        color: #1a1a1a;

        /* 中文/正文14 */

        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: 22px; /* 157.143% */
      }

      .position {
        display: flex;
        padding: 1px 4px;
        justify-content: center;
        align-items: center;
        margin-left: 4px;
        color: #ff7b00;
        text-align: center;

        /* 中文/正文(注释)12 */

        font-size: 12px;
        font-style: normal;
        font-weight: 400;
        line-height: 20px; /* 166.667% */
        border-radius: 2px;
        background: rgb(255 123 0 / 10%);
      }
    }

    .time {
      color: #999;

      /* 中文/正文14 */

      font-size: 14px;
      font-style: normal;
      font-weight: 400;
      line-height: 22px; /* 157.143% */
    }
  }

  .content-box {
    border-radius: 4px;
    background: #f7f7f7;
    width: 100%;
    padding: 8px;

    div:first-child {
      margin-bottom: 4px;
    }

    .ipt-box {
      display: flex;
      flex-direction: row;
      align-items: center;

      .ipt-content {
        width: 220px;
        margin-left: 10px;
      }
    }
  }

  .time-content {
    height: calc(100% - 88px);
    overflow-y: auto;
  }

  :deep(.lydc-basic-table-action button i) {
    font-size: 18px;
  }

  //:deep(.ant-form-item-control) {
  //  //min-width: 143px;
  //  min-width: 100%;
  //}

  .drawing {
    :deep(.lydc-basic-form) {
      width: 100%;
    }

    :deep(.ant-form-item-control-input) {
      width: 100%;
    }

    :deep(.ant-row) {
      width: 100%;
    }
  }

  .item-box {
    display: inline-flex;
    width: max-content;
    margin-right: 55px;
    margin-top: 5px;
    margin-bottom: 5px;
    align-items: center;

    div {
      display: inline-block;
      width: max-content;
    }

    .item-box-label {
      color: #666;
    }

    .item-box-value {
      color: #1a1a1a;
    }
  }

  .summary-box {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    margin-top: 10px;
  }

  .ellipsis-text {
    width: max-content;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .box-left {
    width: max-content;
    display: flex;
    flex-direction: row;
    align-items: center;

    b {
      width: max-content;
      margin-right: 10px;
    }
  }

  :deep(.ant-table-summary) {
    width: 100%;
  }

  :deep(.lydc-basic-form .ant-form-item:not(.ant-form-item-with-help)) {
    margin: 0;
  }
</style>
