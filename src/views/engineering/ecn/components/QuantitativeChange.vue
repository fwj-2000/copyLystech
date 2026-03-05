<template>
  <Subtitle class="mt-20px" :title="t('dict.ECNColumn.changeContent')" id="process-flow" />
  <Descriptions :labelStyle="{ width: '200px' }" bordered style="margin-top: 10px" :column="4" size="small">
    <DescriptionsItem :label="t('dict.ECN.ProjectPhase')" :span="4">
      <a-radio-group :disabled="mode !== 'edit'" v-model:value="baseState.projectPhase">
        <a-radio v-for="item in projectStage" :value="item.enCode">{{ item.fullName }} </a-radio>
      </a-radio-group>
    </DescriptionsItem>
    <DescriptionsItem :label="t('dict.ECN.ChangeLevel')" :span="4">
      <a-radio-group :disabled="mode !== 'edit'" v-model:value="baseState.changeLevel">
        <a-radio v-for="item in changeLevelList" :value="item.enCode">{{ item.fullName }} </a-radio>
      </a-radio-group>
    </DescriptionsItem>
    <DescriptionsItem :label="t('dict.ECNColumn.changeDetails')" :span="2" :contentStyle="{ width: '30%' }">
      <span>{{ t('common.beforeTheChange') }}</span>
      <a-textarea :disabled="mode !== 'edit'" :placeholder="t('dict.ECN.AttachmentType.3')" v-model:value="baseState.changeDescribeBehind" />
      <Divider />
      <a-upload-dragger v-feature :disabled="mode !== 'edit'" :multiple="true" name="file" :show-upload-list="false" :beforeUpload="beforeFormerUpload">
        <a-button :disabled="mode !== 'edit'" v-if="customerBeforeFileList.length <= 0">
          <UploadOutlined />
          {{ t('dict.PurchaseQuotationColumn.UploadAttachment') }}
        </a-button>
        <div v-else>
          {{ t('common.attachment') }}
          <template v-for="(item, index) in customerBeforeFileList">
            <div class="flex-row">
              <div class="ellipsis">
                <a @click.stop="handlePreview(item)">{{ item.name }}</a>
              </div>
              <i v-if="mode === 'edit'" @click.stop="handleDel(index)" class="icon-ym icon-ym-delete"></i>
              <div v-else @click.stop="handleDownload(item)" class="icon-ym icon-ym-download"></div>
            </div>
          </template>
        </div>
      </a-upload-dragger>
    </DescriptionsItem>
    <DescriptionsItem :labelStyle="{ display: 'none' }" :span="2" :contentStyle="{ width: '30%' }">
      <span>{{ t('common.afterTheChange') }}</span>
      <a-textarea :disabled="mode !== 'edit'" :placeholder="t('dict.ECN.AttachmentType.4')" v-model:value="baseState.changeDescribeAfter" />
      <Divider />
      <a-upload-dragger v-feature :disabled="mode !== 'edit'" :multiple="true" name="file" :show-upload-list="false" :beforeUpload="beforeAfterUpload">
        <a-button :disabled="mode !== 'edit'" v-if="customerAfterFileList.length <= 0">
          <UploadOutlined />
          {{ t('dict.PurchaseQuotationColumn.UploadAttachment') }}
        </a-button>
        <div v-else>
          {{ t('common.attachment') }}
          <template v-for="(item, index) in customerAfterFileList">
            <div class="flex-row">
              <div class="ellipsis">
                <a @click.stop="handlePreview(item)">{{ item.name }}</a>
              </div>
              <i v-if="mode === 'edit'" @click.stop="handleAfterDel(index)" class="icon-ym icon-ym-delete"></i>
              <div v-else @click.stop="handleDownload(item)" class="icon-ym icon-ym-download"></div>
            </div>
          </template>
        </div>
      </a-upload-dragger>
    </DescriptionsItem>
    <DescriptionsItem :label="t('dict.ECNColumn.relatedDocuments')" :span="4">
      <a-space>
        <a-button v-if="mode === 'edit'" type="primary" @click="handleDocumentDetail('edit')" ghost size="small">{{ t('dict.ECNColumn.unlink') }} </a-button>
        <span v-else @click="handleDocumentDetail('view')" class="link-text">{{ t('common.viewDetails') }}</span>
      </a-space>
    </DescriptionsItem>
    <DescriptionsItem :label="t('dict.ECNColumn.confirmationBeforeChanges')" :span="4">
      <div class="flex-row">
        <span class="mr-10px">{{ t('dict.ECNColumn.engineeringVerificationNeeded') }}</span>
        <a-radio-group :disabled="mode !== 'edit'" v-model:value="baseState.changeConfirm">
          <a-radio :value="true">{{ t('common.yes') }}</a-radio>
          <a-radio :value="false">{{ t('common.no') }}</a-radio>
        </a-radio-group>
        <!-- <a-switch :disabled="mode !== 'edit'" v-model:checked="baseState.changeConfirm" checked-children="是" un-checked-children="否" /> -->
      </div>
    </DescriptionsItem>
    <DescriptionsItem :label="t('dict.ECNColumn.impactAfterChanges')" :span="4">
      <div class="flex-row">
        <span class="mr-10px"> {{ t('dict.ECNColumn.impactOnEcoFriendlyMaterials') }} </span>
        <a-radio-group :disabled="mode !== 'edit'" v-model:value="baseState.effect">
          <a-radio :value="true">{{ t('common.yes') }}</a-radio>
          <a-radio :value="false">{{ t('common.no') }}</a-radio>
        </a-radio-group>
        <!-- <a-switch :disabled="mode !== 'edit'" v-model:checked="baseState.effect" checked-children="是" un-checked-children="否" /> -->
      </div>
    </DescriptionsItem>
    <DescriptionsItem :label="t('dict.ECNColumn.customerConfirmation')" :span="4">
      <a-radio-group :disabled="mode !== 'edit'" v-model:value="baseState.customerConfirm">
        <a-radio :value="true">{{ t('common.yes') }}</a-radio>
        <a-radio :value="false">{{ t('common.no') }}</a-radio>
      </a-radio-group>
      <!--      <a-switch v-model:checked="baseState.customerConfirm" checked-children="是" un-checked-children="否" checked-value="true" un-checked-value="false" />-->
      <!-- <a-switch :disabled="mode !== 'edit'" v-model:checked="baseState.customerConfirm" checked-children="是" un-checked-children="否" /> -->
    </DescriptionsItem>
    <DescriptionsItem class="flex-row" :span="4">
      <template #label>
        <div class="flex ct-between">
          {{ t('dict.ECN.Dept') }}
          <a-button v-if="mode === 'edit'" type="primary" ghost size="small" @click="addSignDeptModal">{{ t('dict.ECNColumn.select') }} </a-button>
        </div>
      </template>
      <a-row :gutter="[10, 8]">
        <a-col v-for="item in countersignList" class="flex-row" :span="6">
          <template v-if="item.key === 16">
            {{ item.otherValue }}:
            <lydc-custom-user-select
              :disabled="mode !== 'edit'"
              style="width: 70%"
              v-model:value="item.userId"
              :placeholder="item.otherValue"
              :allowClear="true"
              show-search />
          </template>
          <template v-else>
            <div style="margin-right: 10px"> {{ item.value }}: </div>
            <lydc-custom-user-select
              :disabled="mode !== 'edit'"
              style="width: 70%"
              v-model:value="item.userId"
              :placeholder="item.value"
              :allowClear="true"
              show-search />
          </template>
        </a-col>
        <!--        <a-col class="flex-row" :span="4"-->
        <!--          >商务:-->
        <!--          <lydc-custom-user-select style="width: 70%" v-model:value="baseState.origin" placeholder="商务" :allowClear="true" show-search />-->
        <!--        </a-col>-->
      </a-row>
    </DescriptionsItem>
    <DescriptionsItem label="PMC" :span="4">
      <a-row style="width: 100%">
        <a-col :span="8">
          <lydc-custom-user-select
            :disabled="mode !== 'edit'"
            style="width: 70%"
            v-model:value="baseState.pmc"
            placeholder="PMC"
            :allowClear="true"
            show-search />
        </a-col>
      </a-row>
    </DescriptionsItem>
    <DescriptionsItem :labelStyle="{ width: 'max-content' }" :label="t('dict.ECNColumn.filler')" :span="1">
      {{ writeName || getUserInfo.userName }}
    </DescriptionsItem>
    <DescriptionsItem :labelStyle="{ width: 'max-content' }" :label="t('dict.ECNColumn.fillingDate')" :span="1">
      {{ writeDate || dateUtil(new Date()).format('YYYY-MM-DD') }}
    </DescriptionsItem>
    <DescriptionsItem :labelStyle="{ width: 'max-content' }" :label="t('dict.MaterialDevelopApplyReportColumn.mdCheckUserName')" :span="1">
      {{ reviewName }}
    </DescriptionsItem>
    <DescriptionsItem :labelStyle="{ width: 'max-content' }" :label="t('dict.ECNColumn.reviewDate')" :span="1"> {{ reviewDate }} </DescriptionsItem>
  </Descriptions>
  <relevanceFile @register="registerRelevanceFile" @submit="handleRelevanceSubmit" />
  <SignDeptModal @register="registerSignDeptModal" @submit="handleSignDeptModalSubmit" />
  <Preview ref="filePreviewRef" />
</template>

<script lang="ts" setup>
  import { Descriptions, DescriptionsItem, Divider, message } from 'ant-design-vue';
  import { computed, nextTick, onMounted, reactive, ref, toRefs } from 'vue';
  import { Subtitle } from '/@/components/Subtitle';
  import { useBaseStore } from '/@/store/modules/base';
  import { UploadOutlined } from '@ant-design/icons-vue';
  import Template from '/@/views/engineering/pcc/pccApply/components/Template.vue';
  import { uploadInstallFile } from '/@/api/engineering/pcc';
  import relevanceFile from './relevanceFile.vue';
  import SignDeptModal from './SignDeptModal.vue';
  import { useModal } from '/@/components/Modal';
  import { propTypes } from '/@/utils/propTypes';
  import { dateUtil } from '../../../../utils/dateUtil';
  import { useUserStore } from '/@/store/modules/user';
  import { isEmpty } from '/@/utils/is';
  import { downloadByUrl } from '/@/utils/file/download';
  import Preview from '/@/views/engineering/pcc/pccApply/components/Preview.vue';
  import { useI18n } from '/@/hooks/web/useI18n';

  const emit = defineEmits(['getPartNumberList', 'register']);
  const { t } = useI18n();
  const props = defineProps({
    // 请求API的参数
    applyList: propTypes.object.def([]),
  });

  const userStore = useUserStore();
  const baseStore = useBaseStore();
  const state = reactive({
    baseState: {},
    projectStage: [],
    changeLevelList: [],
    customerBeforeFileList: [],
    customerAfterFileList: [],
    // 关联文件
    relevanceList: [],
    partNumberList: [],
    // 会签部门
    countersignList: [],
    mode: '',
    writeName: '',
    writeDate: '',
    reviewName: '',
    reviewDate: '',
  });
  const filePreviewRef = ref<any | null>(null);
  const getUserInfo = computed(() => userStore.getUserInfo || {});

  const {
    baseState,
    projectStage,
    changeLevelList,
    customerBeforeFileList,
    customerAfterFileList,
    countersignList,
    mode,
    writeName,
    writeDate,
    reviewName,
    reviewDate,
  } = toRefs(state);
  const [registerRelevanceFile, { openModal: openRelevanceFileModal, closeModal: closeRelevanceFileModal }] = useModal();
  const [registerSignDeptModal, { openModal: openSignDeptModal, closeModal: closeSignDeptModal }] = useModal();

  async function setState(data) {
    // console.log(getUserInfo.value, 'getUserInfo.value');
    // console.log(data, 'quantitave initData');
    const deptList = await baseStore.getDictionaryData('ECN.Dept');
    const {
      projectPhase,
      changeLevel,
      changeDescribeBehind,
      changeDescribeAfter,
      changeConfirm,
      customerConfirm,
      effect,
      pmc,
      attachmentList,
      mode,
      flowNodeInstanceHisList,
      partNumberList,
    } = data;
    state.baseState.projectPhase = projectPhase;
    state.baseState.changeLevel = changeLevel;
    state.baseState.changeDescribeBehind = changeDescribeBehind;
    state.baseState.changeDescribeAfter = changeDescribeAfter;
    state.baseState.pmc = pmc;
    state.baseState.changeConfirm = changeConfirm || false;
    state.baseState.customerConfirm = customerConfirm || false;
    state.baseState.effect = effect || false;

    state.partNumberList = partNumberList;

    if (flowNodeInstanceHisList && flowNodeInstanceHisList.length > 0) {
      const applyNodeTarget = flowNodeInstanceHisList.find(item => item.nodeCode === 'ApplyNode');
      const leaderNodeTarget = flowNodeInstanceHisList.find(item => item.nodeCode === 'Leader');

      if (applyNodeTarget) {
        state.writeName = applyNodeTarget.handlerName;
        state.writeDate = applyNodeTarget.creatorTime ? dateUtil(applyNodeTarget.creatorTime).format('YYYY-MM-DD') : '-';
      }
      if (leaderNodeTarget) {
        state.reviewName = leaderNodeTarget.handlerName;
        state.reviewDate = leaderNodeTarget.creatorTime ? dateUtil(leaderNodeTarget.creatorTime).format('YYYY-MM-DD') : '-';
      }
    } else {
      state.writeName = '';
      state.writeDate = '';
      state.reviewName = '-';
      state.reviewDate = '-';
    }
    let countersignList = data.countersignList || [];
    state.countersignList = countersignList.map(item => {
      const target = deptList.find(value => value.enCode === item.key);
      const msg = {
        otherValue: target?.fullName,
        value: target?.fullName,
        key: item.key,
        userId: item.userId,
      };
      if (item.key === '16') {
        msg.otherValue = item.value;
        msg.value = item.value;
      }
      return msg;
    });

    nextTick(() => {
      state.mode = mode;
    });

    if (!attachmentList || attachmentList.length <= 0) return;

    attachmentList.forEach((item, index) => {
      if (item.type == 3) {
        state.customerBeforeFileList.push({
          ...item,
          flagPath: item.path,
        });
      } else if (item.type == 4) {
        state.customerAfterFileList.push({
          ...item,
          flagPath: item.path,
        });
      }
    });
  }

  function init(data) {
    const { origin, mode } = data;
    if (mode === 'view') {
      setState(data);
    } else if (mode === 'edit') {
      setState({
        ...data,
        mode: 'edit',
      });
      // if (origin === "ECN") {
      //
      // }
    }
  }

  onMounted(() => {
    getTypeOps();
  });

  function beforeFormerUpload(file, fileList) {
    const waitList = [];
    fileList.forEach(item => {
      if (!state.customerBeforeFileList.find(value => value.name === item.name)) {
        const params = {
          file: item,
          filePath: 'PCC',
        };
        state.customerBeforeFileList.push(item);
        waitList.push(uploadInstallFile(params));
      }
    });
    Promise.all(waitList).then(list => {
      list.forEach(item => {
        const {
          data: { fileName, filePath },
        } = item;
        state.customerBeforeFileList.forEach(item => {
          if (item.name === fileName) {
            item.flagPath = filePath;
          }
        });
      });
    });
    return false;
  }

  function handleDocumentDetail(mode: 'edit' | 'view') {
    emit('getPartNumberList');
    if (mode === 'edit') {
      nextTick(() => {
        // console.log(props.applyList, "props.applyList");
        // console.log(state.relevanceList, "state.relevanceList");
        // let list = props.applyList;
        // const isRelevanceListEmpty = list.some(item => item.relatedFilesList);
        // console.log(isRelevanceListEmpty, 'isRelevanceListEmpty');
        // if (isRelevanceListEmpty && (state.relevanceList > 0)) {
        //   list = state.relevanceList;
        // }
        if (isEmpty(state.relevanceList)) {
          state.relevanceList = props.applyList;
        }
        openRelevanceFileModal(true, {
          pratNumber: state.relevanceList,
          mode,
        });
      });
    } else {
      // console.log(props.applyList, 'props.applyList');
      // console.log(state.relevanceList, "props.relevanceList");
      nextTick(() => {
        console.log(state);
        openRelevanceFileModal(true, {
          pratNumber: props.applyList || state.partNumberList,
          relevanceList: state.relevanceList,
          mode,
        });
      });
    }
  }

  function addSignDeptModal() {
    openSignDeptModal(true, {
      countersignList: state.countersignList,
    });
  }

  function beforeAfterUpload(file, fileList) {
    const waitList = [];
    fileList.forEach(item => {
      if (!state.customerAfterFileList.find(value => value.name === item.name)) {
        const params = {
          file: item,
          filePath: 'PCC',
        };
        state.customerAfterFileList.push(item);
        waitList.push(uploadInstallFile(params));
      }
    });
    Promise.all(waitList).then(list => {
      list.forEach(item => {
        const {
          data: { fileName, filePath },
        } = item;
        state.customerAfterFileList.forEach(item => {
          if (item.name === fileName) {
            item.flagPath = filePath;
          }
        });
      });
    });
    return false;
  }

  function handleDownload(item) {
    console.log(item);
    const { flagPath: url, name } = item;
    downloadByUrl({ url, target: '_blank', name });
  }

  async function getTypeOps() {
    state.projectStage = (await baseStore.getDictionaryData('ECN.ProjectPhase', '', true)).map(item => ({
      ...item,
      enCode: Number(item.enCode),
    }));
    state.changeLevelList = (await baseStore.getDictionaryData('ECN.ChangeLevel', '', true)).map(item => ({
      ...item,
      enCode: Number(item.enCode),
    }));
  }

  async function handlePreview(item) {
    console.log(item);
    // if (!item.flagPath) {
    //   const params = {
    //     file: item,
    //     filePath: 'PCC',
    //   };
    //   const {
    //     data: { filePath },
    //   } = await uploadInstallFile(params);
    //   item.flagPath = filePath;
    // }
    const params = {
      name: item.name,
      url: item.flagPath,
      previewType: 'localPreview',
      noCache: false,
      isCopy: 0,
    };
    filePreviewRef.value?.init(params);
  }

  function handleDel(index) {
    state.customerBeforeFileList.splice(index, 1);
  }

  function handleRelevanceSubmit(data) {
    state.relevanceList = data;
    closeRelevanceFileModal();
  }

  function handleSignDeptModalSubmit(data) {
    state.countersignList = data.countersignList;
    closeSignDeptModal();
  }

  function handleAfterDel(index) {
    state.customerAfterFileList.splice(index, 1);
  }

  function submit(isValidate = false) {
    const {
      baseState: { projectPhase, changeLevel },
    } = state;

    if (!projectPhase) return message.error(t('dict.ECNColumn.selectProjectPhase'));
    if (!changeLevel) return message.error(t('dict.ECNColumn.selectChangeLevel'));

    if (isValidate) {
      // 如果需要校验，则执行下方校验逻辑
      if (Array.isArray(state.countersignList) && state.countersignList.length > 0 && state.countersignList.some(item => !item.userId)) {
        // 会签部门如果选择了部门，则必须选择该部门的会签人
        return message.warning(t('dict.ECN.personRequired', [t('dict.ECN.Dept')]));
      }
    }

    const attachmentList = [];
    state.customerBeforeFileList.forEach(item => {
      attachmentList.push({
        type: 3,
        name: item.name,
        path: item.flagPath,
        ...item,
      });
    });
    state.customerAfterFileList.forEach(item => {
      attachmentList.push({
        type: 4,
        name: item.name,
        path: item.flagPath,
        ...item,
      });
    });
    return {
      ...state.baseState,
      countersignList: state.countersignList,
      relevanceList: state.relevanceList,
      attachmentList,
    };
  }

  defineExpose({
    init,
    submit,
  });
</script>

<style lang="less" scoped>
  .flex-row {
    display: flex;
    align-items: center;
    flex-direction: row;
    cursor: pointer;
  }

  :deep(.subtitle-container) {
    padding-bottom: 10px;
  }

  :deep(.ant-upload-drag) {
    background: #fff;
    border: none;
  }

  :deep(.ant-upload-btn) {
    text-align: left;
  }

  :deep(.ant-radio-disabled .ant-radio-inner::after) {
    background: rgb(255 123 0 / 70%);
  }

  :deep(.ant-radio-checked .ant-radio-inner) {
    border-color: rgb(255 123 0 / 70%) !important;
  }

  :deep(.ant-radio-disabled + span) {
    color: #1a1a1a;
  }

  :deep(.ant-checkbox-disabled + span) {
    color: #1a1a1a;
  }
</style>
