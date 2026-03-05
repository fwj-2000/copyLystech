<!-- 底稿维度 -->
<template>
  <div class="dashboard-page-container">
    <!-- 表单筛选条件 -->
    <div class="dashboard-search-compo-header">
      <div class="w-[100%] flex flex-col items-start">
        <SearchForm
          v-bind="{
            searchFormValue,
            showOrganizeTreeSelect: true,
            showTimeDimension: false,
            isRangePicker: true,
            organizeKeyword: '',
            getOrganizationApi: getSyOrganization,
          }">
          <template #timeDimension>
            <a-form-item name="timeDimension">
              <a-select v-model:value="searchFormValue.timeDimension">
                <a-select-option value="week">周</a-select-option>
                <a-select-option value="month">月</a-select-option>
                <a-select-option value="quarter">季度</a-select-option>
                <a-select-option value="year">年</a-select-option>
              </a-select>
            </a-form-item>
          </template>
          <template #right>
            <div class="flex">
              <div class="flex px-6px" style="height: 32px; color: #1a1a1a; background-color: #e6e6e6">纳入边贡</div>
              <a-form-item name="isBian">
                <a-select ref="select" v-model:value="searchFormValue.isBian">
                  <a-select-option v-for="item in isBainOptions" :key="item.value" :value="item.value">{{ item.label }}</a-select-option>
                </a-select>
              </a-form-item>
            </div>
            <!-- 展开条件搜索 -->
            <a-button type="primary" class="mr-12px" @click="handleToggleExtend">
              {{ isExtendSelect ? '收起条件' : '展开条件' }}
              <span :class="['extend-btn ml-4px', { rotate: !isExtendSelect }]">
                <CaretUpOutlined />
              </span>
            </a-button>
            <a-button type="primary" ghost @click="reload">查询</a-button>
            <!-- 上传按钮 -->
            <a-popover title="提示">
              <template #content>
                <p>1.导入平台已有数据时必须填写所有列数据，否则已有数据列会被清空</p>
                <p>2.只可导入新数据和SAP状态为【反接收/反结算】数据</p>
              </template>
              <SingleUpload
                v-auth="'btn_upload-paper'"
                v-bind="{
                  api: '/api/report/dimension/importmanuscript',
                  buttonText: '底稿数据导入',
                }"></SingleUpload>
            </a-popover>

            <a-popover title="提示">
              <template #content>
                <p>数据导入成功需等待一两分钟再次查询</p>
              </template>
              <a-dropdown placement="bottomLeft" :trigger="['click']">
                <a-button class="ml-12px" type="primary" ghost :loading="otherImportloading">其他导入</a-button>
                <template #overlay>
                  <a-menu>
                    <a-menu-item v-for="(item, idx) in uploadButtonList" :key="idx">
                      <SingleUpload v-bind="item">
                        <template v-slot="{ loading }">
                          <div class="ml-12px" :loading="loading">
                            {{ item.buttonText }}
                          </div>
                        </template>
                      </SingleUpload>
                    </a-menu-item>
                  </a-menu>
                </template>
              </a-dropdown>
            </a-popover>

            <a-popconfirm title="确定全部导出" @confirm="downloadFile(searchInfo)">
              <a-button type="primary" class="ml-12px" :loading="exportLoading" ghost>导出</a-button>
            </a-popconfirm>

            <a-dropdown placement="bottomLeft" :trigger="['click']">
              <a-button class="ml-12px" type="primary" ghost :loading="noMaintenanceDownloading">未维护数据导出</a-button>
              <template #overlay>
                <a-menu>
                  <a-menu-item
                    v-for="(item, idx) in noMaintenanceDownloadList"
                    :key="idx"
                    @click="
                      noMaintenanceDownloadFile({
                        exportDim: item.exportDim,
                        startDim: searchInfo.startDim.substring(0, 4),
                        endDim: searchInfo.endDim.substring(0, 4),
                        orgCode: searchInfo.orgCode === '' ? searchInfo.bu : searchInfo.orgCode,
                      })
                    ">
                    {{ item.fileName }}
                  </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>

            <a-dropdown placement="bottomLeft" :trigger="['click']">
              <a-button class="ml-12px" type="primary" ghost :loading="statisticloading">统计结果</a-button>
              <template #overlay>
                <a-menu>
                  <a-menu-item v-for="(item, idx) in statisticButtonList" :key="idx">
                    <SingleUpload v-bind="item" :afterUpload="afterUploadHandle">
                      <template v-slot="{ loading }">
                        <div class="ml-12px" :loading="loading">
                          {{ item.buttonText }}
                        </div>
                      </template>
                    </SingleUpload>
                  </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
            <!-- 模板下载 -->
            <a-dropdown placement="bottomLeft" :trigger="['click']">
              <a-button class="ml-12px" type="primary" ghost :loading="templateDownloading">模版下载</a-button>
              <template #overlay>
                <a-menu>
                  <a-menu-item
                    v-for="(item, idx) in templateDownloadList"
                    :key="idx"
                    @click="
                      templateDownloadFile({
                        fileName: item.fileName,
                      })
                    ">
                    {{ item.fileName }}
                  </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
            <!-- 同步数据 -->
            <a-popconfirm title="确定同步" @confirm="syncData">
              <a-button type="primary" class="ml-12px" :loading="syncLoading">同步数据</a-button>
            </a-popconfirm>
            <!-- 更新Sap底稿状态 -->
            <a-dropdown v-if="showUpdateSap">
              <a-button type="primary" class="ml-12px" :loading="updateSapLoading">更新Sap底稿状态</a-button>
              <template #overlay>
                <a-menu>
                  <a-menu-item v-for="(item, idx) in sapOptions" :key="idx" @click="updateSapStatus(item.value)">
                    {{ item.label }}
                  </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
          </template>
        </SearchForm>
        <!-- 搜索条件 -->
        <div
          v-show="isExtendSelect"
          :class="['w-[100%] overflow-hidden flex flex-wrap gap-12px justify-start items-start mb-12px', isExtendSelect ? 'h-78px' : 'h-0']"
          style="transition: all 0.2s linear">
          <div v-for="(option, idx) in searchParamOptionsList" :key="idx" class="flex">
            <div class="flex px-6px" style="height: 32px; color: #1a1a1a; background-color: #e6e6e6">{{ option.text }}</div>
            <a-form-item class="">
              <lydc-select mode="multiple" v-model:value="searchFormValue[option.props]" v-bind="option.bind" :options="option.options" placeholder="">
                <template #dropdownRender="{ menuNode: menu }">
                  <div style="padding: 4px 8px; cursor: pointer" @mousedown="e => e.preventDefault()" @click="handleSelectAll(option)">
                    {{ option.selectAll ? '取消全选' : '全选' }}
                  </div>
                  <a-divider style="margin: 4px 0" />
                  <v-nodes :vnodes="menu" />
                </template>
              </lydc-select>
            </a-form-item>
          </div>
        </div>
      </div>
    </div>
    <!-- 内容加载封装组件 -->
    <div class="dashboard-content-container">
      <!-- 报表表格 -->
      <BasicTable v-if="searchFormValue.orgCode" class="table-wrapper" @register="registerTable"> </BasicTable>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import dayjs from 'dayjs';
  import { ref, nextTick, computed } from 'vue';
  import { useSearchTable } from '/@/views/dashboard/operate/hooks/useSearchTable';
  import { useDownload } from '/@/views/dashboard/hooks/useDownload';
  import {
    getDimensionManuscriptpage,
    getDimensionExportmanuscriptdim,
    getDimensionDownload,
    getNoMaintenanceDatadownload,
    dimensionSyncbgbase,
    updateSapFactory,
  } from '/@/api/dashbord/report';
  import { getSyOrganization } from '/@/api/dashbord/operate';
  import {
    columnsOptions,
    DEFAULT_IS_BAIN,
    isBainOptions,
    uploadButtonList,
    templateDownloadList,
    noMaintenanceDownloadList,
    statisticButtonList,
    sapOptions,
  } from './config';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { message } from 'ant-design-vue';

  import { BasicTable } from '/@/components/Table';
  import { SearchForm } from '/@/views/dashboard/operate/components/SearchForm/index';
  import SingleUpload from '/@/views/dashboard/operate/components/SingleUpload.vue';
  import { TimeDimension } from '/@/views/dashboard/operate/types';
  import { searchConditionMap } from '/@/views/dashboard/operate/biangongDimension/config';
  import { CaretUpOutlined } from '@ant-design/icons-vue';
  import { downloadByUrl } from '/@/utils/file/download';

  defineOptions({ name: 'dashboard-operate-biangongDimension-papers' });

  const defaultDate = dayjs().subtract(1, 'week');
  const { createMessage } = useMessage();
  const isExtendSelect = ref<boolean>(false);
  const syncLoading = ref<boolean>(false);
  const statisticloading = ref<boolean>(false);
  const otherImportloading = ref<boolean>(false);
  const updateSapLoading = ref<boolean>(false);
  const showUpdateSap = computed(() => {
    const { orgCode = '' } = searchFormValue;
    return orgCode.length >= 9;
  });
  const VNodes = (_, { attrs }) => attrs.vnodes;

  // 更新sap底稿状态
  const updateSapStatus = status => {
    const { startDim, endDim } = getTrendQueryParams();
    const params = {
      status,
      startDim,
      endDim,
      dimension: searchFormValue.timeDimension,
      orgCode: searchFormValue.orgCode,
    };
    updateSapLoading.value = true;
    const searchParams = new URLSearchParams(params as any);
    const queryString = searchParams.toString();
    updateSapFactory(queryString)
      .then(() => {
        message.success('更新成功');
        setTimeout(() => {
          reload();
        }, 2000);
      })
      .finally(() => {
        updateSapLoading.value = false;
      });
  };

  // 同步数据
  const syncData = () => {
    syncLoading.value = true;
    dimensionSyncbgbase()
      .then(res => {
        if (res.code === 200) {
          createMessage.success(res.msg);
        } else {
          createMessage.error(res.msg);
        }
      })
      .finally(() => {
        syncLoading.value = false;
      });
  };

  const { searchInfo, searchFormValue, searchParamOptionsList, registerTable, reload, handleSelectAll, redoHeight, getTrendQueryParams } = useSearchTable({
    defaultDate,
    defaultSearchFormValue: {
      ...Object.values(searchConditionMap).reduce((pre, cur) => {
        return {
          ...pre,
          [cur.props]: cur.default,
        };
      }, {}),
      isBian: DEFAULT_IS_BAIN,
      orgCode: '',
      dateRange: [dayjs(defaultDate).tz(), dayjs(defaultDate).tz()],
      timeDimension: TimeDimension.WEEK,
    },
    columnsOptions,
    api: getDimensionManuscriptpage,
  });

  const { loading: exportLoading, downloadFile } = useDownload({
    requestApi: getDimensionExportmanuscriptdim,
  });

  const { loading: templateDownloading, downloadFile: templateDownloadFile } = useDownload({
    requestApi: getDimensionDownload,
  });

  const { loading: noMaintenanceDownloading, downloadFile: noMaintenanceDownloadFile } = useDownload({
    requestApi: getNoMaintenanceDatadownload,
  });

  const handleToggleExtend = () => {
    isExtendSelect.value = !isExtendSelect.value;
    nextTick(() => {
      redoHeight();
    });
  };

  const afterUploadHandle = resData => {
    if (resData.isOk) {
      const url = resData.url;
      const fileName = resData.fileName;
      downloadByUrl({ url, fileName });
      createMessage.success('操作成功');
    } else {
      createMessage.error('上传失败');
    }
  };
</script>

<style lang="less">
  .table-wrapper {
    .hightlignt-row {
      td {
        background-color: #fff2e6;
      }
    }
  }
</style>

<style lang="less" scoped>
  @import url('../../../../../design/dashboard.less');

  @borderColor: #ccc;

  .dashboard-content-container {
    padding: 0 !important;

    :deep(.ant-spin-container) {
      min-height: 60vh;
    }

    .empty-wrapper {
      min-height: 60vh;
    }
  }

  :deep(.ant-form-item) {
    margin-bottom: 0 !important;
  }

  :deep(.ant-table-container) {
    font-size: 11px;
  }

  :deep(.ant-table-thead > tr) {
    & > th {
      font-weight: 700;
      white-space: pre-wrap;

      /* 允许换行 */
      word-break: break-word;

      /* 自动断词 */
      text-align: center !important;
      // border-color: @borderColor !important;
    }
  }

  :deep(.ant-table-tbody > tr) {
    &:first-child {
      & > td {
        padding: 0 !important;
      }
    }

    & > td {
      white-space: pre-wrap;

      /* 允许换行 */
      word-break: break-word;

      /* 自动断词 */
      border-color: @borderColor !important;
      padding: 3px 6px !important;
    }
  }

  .extend-btn {
    transition: all 0.2s linear;
    transform-origin: 50% 50%;

    &.rotate {
      transform: scaleY(-1);
    }
  }
</style>
