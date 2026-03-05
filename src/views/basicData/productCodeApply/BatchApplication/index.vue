<!--  -->
<template>
  <div class="wrapper-container">
    <a-card style="height: 100%">
      <!-- 头部信息 -->
      <div class="header-container">
        <Descriptions title="批量申请成品编码" v-bind="descOptions">
          <Descriptions.Item label="申请人">
            {{ userInfo.realName }}
          </Descriptions.Item>
          <Descriptions.Item label="申请日期">
            {{ dayjs().format('YYYY-MM-DD') }}
          </Descriptions.Item>
          <Descriptions.Item label="申请部门">
            {{ userInfo.departmentName }}
          </Descriptions.Item>
        </Descriptions>
        <a-button type="primary" :disabled="!state.BatchCode" @click="handleSave">保存</a-button>
      </div>
      <!-- 上传成功 -->
      <div v-if="state.uploadStatus === UploadStatus.Success" class="success-body-container">
        <div ref="successBodyRef" class="table-wrapper">
          <a-table
            :loading="loading"
            class="table-content ant-table-striped"
            :row-class-name="(_record, index) => (index % 2 === 1 ? 'table-height table-striped' : 'table-height')"
            :columns="columns"
            :data-source="paginationList"
            :scroll="{ x: 3800 }"
            :pagination="false"
            rowKey="Id">
            <template #bodyCell="{ column, record, text }">
              <template v-if="column.dataIndex === 'ErrorMsg'">
                <template v-if="record.ErrorMsg">
                  <a-tooltip :title="text">
                    <div style="color: #ff4d4f; cursor: pointer">数据错误</div>
                  </a-tooltip>
                </template>
                <template v-else>
                  <div style="color: #52c41a">正确</div>
                </template>
              </template>
              <template v-else-if="column.dataIndex === 'ApplyReason'">
                {{ state.reasonTypeOption.find(item => item.enCode == text).fullName }}
              </template>
              <template v-else-if="column.dataIndex === 'ApplyDate'">
                {{ dayjs(record.ApplyDate).tz().format('YYYY-MM-DD HH:mm:ss') }}
              </template>
              <template v-else-if="column.dataIndex === 'ExpiryDate'">
                {{ dayjs(record.ExpiryDate).tz().format('YYYY-MM-DD HH:mm:ss') }}
              </template>
              <template v-else-if="column.dataIndex === 'Status'">
                {{ Number(record.Status) === 1 ? '生效' : '失效' }}
              </template>
            </template>
          </a-table>
        </div>
        <div class="foot-wrapper flex ct-between">
          <div class="flex ct-start">
            <a-pagination
              v-model:current="state.pagination.current"
              size="small"
              :total="state.pagination.total"
              show-size-changer
              showQuickJumper
              @showSizeChange="handleSizeChange" />
            <p class="pagination-total">
              共
              <span style="margin: 0 4px">{{ state.pagination.total }}</span>
              条数据
            </p>
          </div>
          <div class="flex ct-start">
            <div class="file-wrapper flex ct-between">
              <p class="name">{{ state.uploadFileInfo.name || '系统文件.xls' }}</p>
              <img :src="successSvg" />
            </div>
            <a-upload v-feature v-bind="uploadOptions">
              <a-button>重新上传</a-button>
            </a-upload>
          </div>
        </div>
      </div>
      <!-- 上传内容区域 -->
      <div v-else class="body-container">
        <div class="upload-wrapper">
          <!-- 上传区域 -->
          <a-upload-dragger
            v-feature
            :class="state.uploadStatus === UploadStatus.Error ? 'upload-error' : ''"
            v-bind="uploadOptions"
            :disabled="state.uploadStatus !== UploadStatus.BeforeUploading || spinning">
            <a-spin :spinning="spinning">
              <div class="flex" style="height: 100%">
                <template v-if="state.uploadStatus === UploadStatus.BeforeUploading">
                  <a-button type="link">选择文件</a-button>
                  <span style="margin-right: 15px">/</span>
                  将文件拖拽到此区域
                </template>
                <template v-if="state.uploadStatus === UploadStatus.Uploading">
                  <!--              <template v-if="state.uploadStatus === UploadStatus.BeforeUploading">-->
                  <div class="uploading">
                    <div class="uploading-title">
                      <div>{{ state.uploadFileInfo.name }}</div>
                      <LoadingOutlined style="color: #1890ff" />
                      {{ procedure }}%
                    </div>
                    <div class="item-gray">文件大小： {{ formatFileSize(state.uploadFileInfo.size || 0) }} </div>
                    <div class="item-gray">上传日期： {{ dayjs().tz().format('YYYY/MM/DD HH:mm:ss') }}</div>
                    <a-progress :percent="procedure" size="small" />
                  </div>
                </template>
                <template v-if="state.uploadStatus === UploadStatus.Error">
                  <div class="error-info">
                    <p class="filename flex ct-start">
                      {{ state.uploadFileInfo.name || '系统默认文件.xls' }}
                      <img :src="errorSvg" style="margin-left: 12px" />
                    </p>
                    <p class="info">文件大小： {{ formatFileSize(state.uploadFileInfo.size || 0) }}</p>
                    <p class="info" style="margin-bottom: 0">上传日期： {{ dayjs().tz().format('YYYY/MM/DD HH:mm:ss') }}</p>
                    <div class="btn-container">
                      <a-upload v-feature v-bind="uploadOptions">
                        <a-button>重新选择</a-button>
                      </a-upload>
                      <a-button danger style="margin-left: 20px" @click="handleRemoveFile">删除 </a-button>
                    </div>
                  </div>
                </template>
              </div>
            </a-spin>
          </a-upload-dragger>
        </div>
        <!-- 尾部提示信息 -->
        <div class="foot-wrapper flex ct-start">
          <p>支持xls和xlsx格式，最多只能上传1份文件</p>
        </div>
      </div>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
  import { computed, onMounted, reactive, ref } from 'vue';
  import { Descriptions, message, UploadFile } from 'ant-design-vue';
  import dayjs from 'dayjs';
  import { formatFileSize } from '/@/utils/file/base64Conver';
  import { importExcel, saveBatchData } from '/@/api/basicData/productCodeApply';
  import { LoadingOutlined } from '@ant-design/icons-vue';
  import errorSvg from '/@/assets/svg/report/error.svg';
  import successSvg from '/@/assets/svg/report/success.svg';

  import { UploadStatus } from '../types';
  import { TABLE_COLUMNS } from './config';
  import { getUserSettingInfo } from '/@/api/permission/userSetting';
  import { useRouter } from 'vue-router';
  import { findSection } from '/@/utils/findDepartment';
  import { useBaseStore } from '/@/store/modules/base';
  import { useUserStore } from '/@/store/modules/user';
  const baseStore = useBaseStore();

  const userStore = useUserStore();
  const userInfo = userStore.getUserInfo;

  const router = useRouter();

  const successBodyRef = ref<HTMLDivElement>();
  const successBodyHeight = ref('54vh');
  const procedure = ref(1);

  const spinning = ref<boolean>(false);

  const descOptions = {
    column: { xs: 1, sm: 2, md: 4 },
    labelStyle: { color: '#999', fontSize: '14px' },
    contentStyle: { color: '#1A1A1A', fontSize: '14px' },
  };

  const loading = ref<boolean>(false);
  // 自定义上传
  const customRequest = async info => {
    procedure.value = 1;
    const interval = setInterval(() => {
      if (procedure.value >= 99) return clearInterval(interval);
      procedure.value = procedure.value + 1;
    }, 100);
    try {
      spinning.value = true;
      loading.value = true;
      state.uploadFileInfo = info.file;
      state.uploadStatus = UploadStatus.Uploading;
      const {
        data: { BatchCode, List },
      } = await importExcel({ file: info.file });
      state.pagination.total = List.length;
      state.tableData = List;
      console.log(BatchCode);
      state.BatchCode = BatchCode;
      procedure.value = 100;
      setTimeout(() => {
        state.uploadStatus = UploadStatus.Success;
      }, 100);
    } catch (e) {
      console.log(e);
      state.uploadStatus = UploadStatus.Error;
    } finally {
      loading.value = false;
      spinning.value = false;
      clearInterval(interval);
    }
  };
  const uploadOptions = {
    name: 'file',
    maxCount: 1,
    showUploadList: false,
    customRequest,
  };
  onMounted(() => {
    getTypeOption();
    const TABLE_HEADER_HEIGHT = 76.8;
    const bodyHeight = successBodyRef?.value?.offsetHeight;
    successBodyHeight.value = bodyHeight ? bodyHeight - TABLE_HEADER_HEIGHT : 0;
  });

  const columns = TABLE_COLUMNS;

  // const descItems = [
  //   { lable: '申请人', content: computed(() => userInfo.value.realName) },
  //   { lable: '申请日期', content: dayjs().format('YYYY-MM-DD') },
  //   { lable: '申请部门', content: computed(() => userInfo.value.organize) },
  // ];

  // 表格分页展示列表
  const paginationList = computed(() => {
    const { size, current } = state.pagination;
    const startIdx = size * (current - 1);
    const endIdx = startIdx + size;
    return state.tableData.slice(startIdx, endIdx);
  });

  const state: {
    uploadStatus: UploadStatus;
    uploadFileInfo: UploadFile;
    tableData: any[];
    BatchCode: string;
    pagination: {
      total: number;
      current: number;
      size: number;
    };
  } = reactive({
    pagination: {
      total: 0,
      current: 1,
      size: 10,
    },
    reasonTypeOption: [],
    BatchCode: '',
    uploadStatus: UploadStatus.BeforeUploading,
    uploadFileInfo: {} as UploadFile,
    tableData: [],
  });

  const handleSizeChange = (_, size) => {
    state.pagination.size = size;
  };

  const getTypeOption = () => {
    baseStore.getDictionaryData('PartNumberApplyReason').then(res => {
      state.reasonTypeOption = res;
    });
  };

  // 删除文件
  const handleRemoveFile = () => {
    state.uploadStatus = UploadStatus.BeforeUploading;
  };
  const handleSave = async () => {
    loading.value = true;
    try {
      const { msg } = await saveBatchData(state.BatchCode, {});
      message.success(msg);
      router.push('/basicData/productCodeApply');
    } finally {
      loading.value = false;
    }
  };
</script>

<style lang="less" scoped>
  @bodyHeight: calc(100% - 103px);

  :deep(.ant-spin-nested-loading) {
    height: 100%;
  }

  :deep(.ant-spin-container) {
    height: 100%;
  }

  .wrapper-container {
    //padding: 16px;
    font-size: 14px;
    line-height: 22px;
    height: 100%;

    .success-body-container {
      height: @bodyHeight;

      .table-wrapper {
        height: calc(100% - 50px);

        .table-content {
          height: 100%;
        }
      }

      .foot-wrapper {
        //position: fixed;
        //bottom: 0;
        //right: 0;
        //width: 100vh;
        width: 100%;
        height: 66px;
        //padding: 16px 24px;
        padding-left: 14px;
        padding-right: 24px;
        background: #fff;
        // background: var(---, #fff);

        /* 悬停阴影（上） */
        box-shadow: 0 -5px 15px -3px rgb(0 0 0 / 12%), 0 -5px 12px -3px rgb(0 0 0 / 15%), 0 -2px 4px -3px rgb(0 0 0 / 25%);

        .file-wrapper {
          width: 240px;
          padding: 6px 8px;
          border-radius: 4px;
          border: 1px solid #dbdbdb;
          background: #fff;
          margin-right: 16px;

          .name {
            margin-right: 4px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }

        .pagination-total {
          color: #999;
          font-size: 14px;
          font-weight: 400;
          line-height: 22px;
          margin-left: 32px;
        }
      }
    }

    .body-container {
      height: @bodyHeight;
      padding: 12px;

      .foot-wrapper {
        color: #999;
        font-size: 14px;
        margin-top: 8px;
      }

      .upload-wrapper {
        height: calc(100% - 30px);

        .error-info {
          text-align: start;

          .btn-container {
            margin-top: 24px;
          }

          .filename {
            color: #1a1a1a;
            margin-bottom: 16px;
          }

          .info {
            color: #999;
            margin-bottom: 8px;
          }
        }
      }

      :deep(.ant-upload-drag) {
        background: none;
      }
    }

    :deep(.ant-descriptions-header) {
      color: #1a1a1a;
      font-weight: 700;
      margin-bottom: 10px;

      .ant-descriptions-title {
        line-height: 22px;

        &::before {
          content: '';
          display: inline-block;
          width: 2px;
          height: 14px;
          line-height: 22px;
          margin-right: 8px;
          border-radius: 2px;
          background: #ff7b00;
        }
      }
    }

    :deep(.ant-table-body) {
      //min-height: 58.5vh;
    }
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
    width: 20vw;
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
