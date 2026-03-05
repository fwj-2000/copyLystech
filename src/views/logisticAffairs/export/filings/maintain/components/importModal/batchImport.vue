<template>
  <div class="import-container">
    <div class="batch-import">
      <div class="title" v-if="props.tplInfo.title">
        <span></span>
        {{ props.tplInfo.title }}
      </div>
      <!-- 多选才需要出现 -->
      <div class="w-full flex" v-if="props.multiplyList.length">
        <div>{{ t('component.lydc.userSelect.modalTitle') }}：</div>
        <lydc-select class="flex-1" v-model:value="state.multiplyKey" :options="props.multiplyList"></lydc-select>
      </div>
      <div class="tpl-card">
        <h3 class="title">{{ t('common.BasicInformation') }}</h3>
        <BasicForm @register="registerForm" />
      </div>
      <div class="tpl-card">
        <div class="name">{{ t('component.batchImport.step1') }}</div>
        <div class="desc">{{ t('component.batchImport.step1Tip') }}</div>
        <div class="download">
          <i class="icon-ym icon-ym-download mr-10px"></i>
          <!-- <a-button class="name" @click="handleDownloadTemplate">{{ t('component.batchImport.downloadEmptyTamplate') }}</a-button> -->
          <a-button class="name" @click="handleDownloadNotMade">{{ t('dict.CustomsAffairsApply.downloadNotMade') }}</a-button>
        </div>
      </div>
      <div class="tpl-card">
        <div class="name">{{ t('component.batchImport.step2') }}</div>
        <div class="desc">{{ t('component.batchImport.step2Tip') }}</div>
        <div class="upload-box">
          <a-upload-dragger
            v-feature
            :class="state.uploadStatus === UploadStatus.Error ? 'upload-error' : '111'"
            style="background: #fff; border: none"
            v-bind="uploadOptions"
            :disabled="state.uploadStatus !== UploadStatus.BeforeUploading || spinning">
            <a-spin :spinning="spinning">
              <div class="flex" style="height: 100%">
                <template v-if="state.uploadStatus === UploadStatus.BeforeUploading">
                  <div style="display: block">
                    <div class="upload">
                      <div class="flex">
                        <img :src="uploadIcon" />
                      </div>
                      <a-button type="primary" ghost>{{ t('component.upload.choose') }}</a-button>
                    </div>
                    <div class="desc" style="margin-top: 12px">{{ t('component.batchImport.fileTip') }}</div>
                  </div>
                </template>
                <template v-if="state.uploadStatus === UploadStatus.Uploading">
                  <div class="uploading">
                    <div class="uploading-title">
                      <div class="mr-20px">{{ state.uploadFileInfo.name }}</div>
                      <LoadingOutlined style="color: #1890ff" />
                      {{ procedure }}%
                    </div>
                    <div class="item-gray">{{ t('component.upload.fileSize') }}： {{ formatFileSize(state.uploadFileInfo.size || 0) }} </div>
                    <a-progress :percent="procedure" size="small" stroke-color="#1890ff" />
                    <a-button @click="handleStopUploadFile">{{ t('component.batchImport.cancle') }}</a-button>
                  </div>
                </template>
                <template v-if="state.uploadStatus === UploadStatus.Error">
                  <div class="error-info">
                    <p class="filename flex ct-start">
                      {{ state.uploadFileInfo.name || t('common.systemDefaultFile') + '.xls' }}
                      <img :src="errorSvg" style="margin-left: 12px" />
                    </p>
                    <p class="info">{{ t('component.upload.fileSize') }}： {{ formatFileSize(state.uploadFileInfo.size || 0) }}</p>
                    <div class="btn-container">
                      <a-upload v-feature v-bind="uploadOptions">
                        <a-button>{{ t('common.reselect') }}</a-button>
                      </a-upload>
                      <a-button danger style="margin-left: 20px" @click="handleRemoveFile" v-if="state.uploadStatus !== UploadStatus.Error"
                        >{{ t('common.delText') }}
                      </a-button>
                    </div>
                  </div>
                </template>
              </div>
            </a-spin>
          </a-upload-dragger>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import type { UploadProps } from 'ant-design-vue';

  import { onMounted, reactive, ref, onUpdated, watch, nextTick } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { formatFileSize } from '/@/utils/file/base64Conver';
  import { saveBatchData } from '/@/api/basicData/productCodeApply';
  import { LoadingOutlined } from '@ant-design/icons-vue';
  import errorSvg from '/@/assets/svg/report/error.svg';
  import { UploadStatus } from './typing';
  import { message, UploadFile } from 'ant-design-vue';
  import { getUserSettingInfo } from '/@/api/permission/userSetting';
  import { downloadTemplate, importQuantitationApply } from '/@/api/business/quantitation';
  import { downloadByUrl } from '/@/utils/file/download';
  import uploadIcon from '/@/assets/images/uploadxls.png';
  import { AxiosCanceler } from '/@/utils/http/axios/axiosCancel';
  import { useGlobSetting } from '/@/hooks/setting';
  import { BasicForm, useForm } from '/@/components/Form';
  import { getCustomsAffairsMoldeRelativeList, downloadUnMake } from '/@/api/logisticAffairs/customsAffairsMake';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useUserStore } from '/@/store/modules/user';
  import { useLocalStorage } from '@vueuse/core';
  import Cryptojs from 'crypto-js';

  const globSetting = useGlobSetting();
  const userStore = useUserStore();

  // 初始化取消控制器
  const axiosCanceler = new AxiosCanceler();
  const { t } = useI18n();
  const { createMessage } = useMessage();
  const emits = defineEmits(['update', 'change']);

  /** 复核人缓存的key */
  const LOCAL_STORAGE_KEY = 'logisticAffairs-filings-maintain-import-makeReviewUserId';
  /** 秘钥 */
  const SECRET_KEY = 'logisticAffairs-filings-maintain-import-makeReviewUserId-secret';
  /** 获取缓存对象 */
  const storedReviewUserData = useLocalStorage<{ [key: string]: string }>(
    LOCAL_STORAGE_KEY,
    {},
    {
      serializer: {
        read: value => {
          try {
            // 解密取值
            const decrypted = Cryptojs.AES.decrypt(value, SECRET_KEY).toString(Cryptojs.enc.Utf8);
            return JSON.parse(decrypted);
          } catch (e) {
            console.log('解密失败', e);
            return {};
          }
        },
        write: value => {
          // 加密保存
          const encrypted = Cryptojs.AES.encrypt(JSON.stringify(value), SECRET_KEY).toString();
          return encrypted;
        },
      },
    },
  );

  const userInfo = ref({
    realName: '',
    organize: '',
    id: '',
  });

  const procedure = ref(1);

  const spinning = ref<boolean>(false);

  const props = defineProps({
    tplInfo: {
      type: Object,
      default: () => {
        return {
          title: '',
          url: '',
          template: '',
        };
      },
    },
    columns: {
      type: Array,
      default: () => {
        return [];
      },
    },
    version: {
      type: String,
      default: '1',
    },
    templateApi: {
      type: Function,
      default: downloadTemplate,
    },
    templateUrl: {
      type: String,
      default: '',
    },
    previewApi: {
      type: Function,
      default: importQuantitationApply,
    },
    importSaveApi: {
      type: Function,
      default: saveBatchData,
    },
    usePolling: {
      type: Boolean,
      default: false,
    },
    apiParams: {
      type: Object,
      default: () => {
        return {};
      },
    },
    multiKey: {
      type: String,
      default: '',
    },
    multiplyList: {
      type: Array,
      default: () => {
        return [];
      },
    },
    beforeUpload: {
      type: Function as PropType<UploadProps['beforeUpload']>,
      default: () => {
        return true;
      },
    },
  });

  const loading = ref<boolean>(false);

  const state: {
    uploadStatus: any;
    uploadFileInfo: UploadFile;
    tableData: any[];
    BatchCode: string;
    pagination: {
      total: number;
      current: number;
      size: number;
    };
    multiplyKey: string;
  } = reactive({
    pagination: {
      total: 0,
      current: 1,
      size: 10,
    },
    BatchCode: '',
    uploadStatus: UploadStatus.BeforeUploading,
    uploadFileInfo: {} as UploadFile,
    tableData: [],
    multiplyKey: props.multiKey,
  });

  watch(
    () => state.multiplyKey,
    v => {
      emits('change', v);
    },
  );
  watch(
    () => props.multiKey,
    v => {
      state.multiplyKey = v;
    },
  );

  onMounted(() => {
    getUserInfo().then(setDefaultMakeReviewUserIdToForm);
  });

  onUpdated(() => {
    if (props.multiplyList.length && state.multiplyKey == '') {
      state.multiplyKey = props.multiKey;
    }
  });
  let uploadInterval;
  // 自定义上传
  const customRequest = async info => {
    const formData = await validate();
    if (!formData) {
      createMessage.warning(t('dict.SalesSiteColumn.requiredTip'));
      return false;
    }

    if (props.multiplyList.length && state.multiplyKey == '') {
      return message.info(t('component.batchImport.selectUserTip'));
    }
    procedure.value = 1;
    uploadInterval = setInterval(() => {
      if (procedure.value >= 99) return clearInterval(uploadInterval);
      procedure.value = procedure.value + 1;
    }, 100);
    try {
      // spinning.value = true;
      loading.value = true;
      state.uploadFileInfo = info.file;
      state.uploadStatus = UploadStatus.Uploading;
      // 添加自定义传参
      const params = new FormData();
      params.append('file', info.file);
      params.append('customerConfigId', formData.customerConfigId);
      params.append('makeReviewUserId', formData.makeReviewUserId);
      const r = await props.previewApi(params, state.multiplyKey);
      const BatchCode = r.data.BatchCode || r.data.batchCode;
      const List = r.data.List || r.data.list;
      state.pagination.total = List.length;
      state.tableData = List || [];
      procedure.value = 100;
      emits('update', BatchCode, state.tableData);
      setTimeout(() => {
        state.uploadStatus = UploadStatus.Success;
      }, 100);
    } catch (e) {
      console.log('导入失败', e);
      if (props.usePolling) {
        emits('update', null);
        state.uploadStatus = UploadStatus.Success;
        return;
      }
      state.uploadStatus = UploadStatus.Error;
    } finally {
      loading.value = false;
      spinning.value = false;
      clearInterval(uploadInterval);
    }
  };
  const uploadOptions = {
    name: 'file',
    maxCount: 1,
    showUploadList: false,
    customRequest,
    beforeUpload: async file => {
      const formData = await validate();
      if (!formData) {
        createMessage.warning(t('dict.SalesSiteColumn.requiredTip'));
        return false;
      }

      // return Promise.resolve(file);
      return file;
    },
  };

  /** 下载空的数据模板 */
  const handleDownloadTemplate = async () => {
    const formData = await validate(['customerConfigId']);
    if (!formData) {
      createMessage.warning(t('dict.SalesSiteColumn.requiredTip'));
      return false;
    }

    let _params: any = formData.customerConfigId;
    if (props.version === '2') {
      window.open(`${globSetting.apiUrl}${props.templateUrl}`);
      return;
    }
    props.templateApi(_params).then(res => {
      downloadByUrl({ url: res?.data?.url });
    });
  };

  const getUserInfo = async () => {
    return getUserSettingInfo().then(res => {
      const { data } = res;

      userInfo.value = data;
    });
  };
  // 取消上传
  const handleStopUploadFile = () => {
    // // 或者取消所有pending请求
    axiosCanceler?.removeAllPending();
    // 状态清理
    if (uploadInterval) {
      clearInterval(uploadInterval);
      procedure.value = 1;
    }
    state.uploadStatus = UploadStatus.BeforeUploading;
    loading.value = false;
    spinning.value = false;
    message.info(t('component.batchImport.cancleTip'));
  };
  // 删除文件
  const handleRemoveFile = () => {
    state.uploadStatus = UploadStatus.BeforeUploading;
  };

  function clearUploadStatus() {
    state.uploadStatus = UploadStatus.BeforeUploading;
  }

  const [registerForm, { validate, setFieldsValue }] = useForm({
    schemas: [
      {
        field: 'customerConfigId',
        label: t('common.customerTemplate'),
        component: 'ApiSelect',
        componentProps: {
          api: getCustomsAffairsMoldeRelativeList,
          showSearch: true,
          apiSearch: {
            show: true,
            searchName: 'keyword',
          },
          resultField: 'data.list',
          labelField: 'moldeName',
          valueField: 'id',
          filterOption: false,
          notFoundContent: null,
          immediate: true,
          allowClear: false,
        },
        rules: [
          {
            required: true,
            trigger: 'blur',
          },
        ],
      },
      {
        field: 'makeReviewUserId',
        label: t('views.filings.reviewer'),
        component: 'CustomUserSelect',
        required: true,
        componentProps: {
          showSearch: true,
          placeholder: '',
          onChange: (value: string) => {
            setMakeReviewUserIdToLocalStorage(value);
          },
        },
        rules: [
          { required: true, trigger: 'blur' },
          {
            validator(_rule, value, callback) {
              // 复核人不能指定自己
              if (value === userStore.getUserInfo.userId) {
                callback(t('dict.CustomsAffairsReview.selectReviewerTip'));
              } else {
                callback();
              }
            },
            trigger: 'blur',
          },
        ],
      },
    ],
    labelWidth: 80,
  });

  /** 下载未制作数据模版 */
  async function handleDownloadNotMade() {
    const formData = await validate(['customerConfigId']);
    if (!formData) {
      createMessage.warning(t('dict.SalesSiteColumn.requiredTip'));
      return false;
    }
    downloadUnMake({ ...props.apiParams?.templateApiParams, customerConfigId: formData.customerConfigId }).then(res => {
      downloadByUrl({ url: res?.data?.url });
    });
  }

  /** 在缓存中保存当前选中的`复核人` */
  function setMakeReviewUserIdToLocalStorage(userId: string) {
    const loginUserId = userInfo.value.id;
    if (loginUserId) {
      storedReviewUserData.value[loginUserId] = userId || '';
    }
  }

  /** 从缓存中获取上次选中的`复核人` */
  function getMakeReviewUserIdFromLocalStorage() {
    if (!userInfo.value.id) {
      return '';
    }
    return storedReviewUserData.value[userInfo.value.id] || '';
  }

  /** 给表单设置上次用户选中的`复核人` */
  function setDefaultMakeReviewUserIdToForm() {
    nextTick(() => {
      const userId = getMakeReviewUserIdFromLocalStorage();
      userId && setFieldsValue({ makeReviewUserId: userId });
    });
  }

  defineExpose({
    multiplyKey: state.multiplyKey,
    clearUploadStatus,
  });
</script>

<style lang="less" scoped>
  @bodyHeight: calc(100% - 103px);

  .import-container {
    width: 100%;
    background-color: #fff;
    display: flex;
    justify-content: center;

    .batch-import {
      width: 50vw;

      .title {
        color: #1a1a1a;
        font-size: 14px;
        font-style: normal;
        font-weight: 700;
        line-height: 22px; /* 157.143% */
        display: flex;
        align-items: center;

        span {
          display: inline-block;
          width: 2px;
          height: 14px;
          background-color: #ff7b00;
          border-radius: 2px;
          margin-right: 8px;
        }
      }

      .tpl-card {
        margin-top: 16px;
        padding: 25px 28px;
        background-color: #f7f7f7;
        border-radius: 8px;

        .name {
          color: #1a1a1a;

          /* 中文/正文14 */
          font-size: 14px;
          font-style: normal;
          font-weight: 400;

          + .name {
            margin-left: 5px;
          }
        }

        .desc {
          margin-top: 2px;
          color: #999;
          font-size: 13px;
          font-style: normal;
          font-weight: 400;
          line-height: 20px; /* 153.846% */
        }

        .upload-box {
          background-color: #fff;
          padding: 0;
          text-align: center;
          margin-top: 12px;
          border-radius: 4px;
          border: 1px dashed #dbdbdb;

          .error-info {
            text-align: left;

            .filename {
              color: #1a1a1a;
              // margin-bottom: 16px;
            }

            .info {
              color: #999;
              margin-top: 16px;
              margin-bottom: 4px;
            }
          }

          :deep(.upload-error) {
            border-color: #ff4d4f;
          }
        }

        .upload,
        .download {
          margin-top: 12px;
        }
      }
    }
  }

  :deep(.ant-spin-nested-loading) {
    height: 100%;
  }

  :deep(.ant-spin-container) {
    height: 100%;
  }

  :deep(.ant-card-body) {
    padding: 0;
    height: 100%;
  }

  .header-container {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding-right: 10px;
    padding-left: 12px;
    padding-top: 14px;
  }

  .uploading {
    width: 25vw;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  .uploading-title {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    color: #1a1a1a;
    margin-right: 30px;
    margin-bottom: 16px;
  }

  .item-gray {
    color: #999;
  }

  :deep(.upload-error) {
    border-color: #ff4d4f;
  }
</style>
