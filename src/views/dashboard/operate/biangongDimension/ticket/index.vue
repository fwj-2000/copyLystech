<!-- MC周报 -->
<template>
  <div class="dashboard-page-container">
    <!-- 表单筛选条件 -->
    <div class="dashboard-search-compo-header flex ct-between">
      <SearchForm
        v-bind="{
          searchFormValue,
          showOrganizeTreeSelect: true,
          showTimeDimension: false,
          isRangePicker: true,
          organizeKeyword: '',
          getOrganizationApi: getSyOrganization,
        }">
        <template #right>
          <div class="flex">
            <div class="flex px-6px" style="height: 32px; color: #1a1a1a; background-color: #e6e6e6">纳入边贡</div>
            <a-form-item name="isBian">
              <a-select ref="select" v-model:value="searchFormValue.isBian">
                <a-select-option v-for="item in isBainOptions" :key="item.value" :value="item.value">{{ item.label }}</a-select-option>
              </a-select>
            </a-form-item>
          </div>
          <div v-for="(option, idx) in searchParamOptionsList" :key="idx" class="flex">
            <div class="flex px-6px" style="height: 32px; color: #1a1a1a; background-color: #e6e6e6">{{ option.text }}</div>
            <a-form-item>
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
          <a-button type="primary" @click="reload">查询</a-button>
          <!-- 其他导入 -->
          <a-popover title="提示">
            <template #content>
              <p>数据导入成功需等待一两分钟再次查询</p>
            </template>
            <a-dropdown placement="bottomLeft" :trigger="['click']">
              <a-button class="ml-12px" type="primary" ghost>其他导入</a-button>
              <template #overlay>
                <a-menu>
                  <a-menu-item v-for="(item, idx) in otherUploadButtonList" :key="idx">
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
          <a-button class="ml-12px" type="primary" @click="go('/dashboard/financial/biangong/causeAnalysis')">原因分析</a-button>
          <SingleUpload v-for="(item, idx) in uploadButtonList" :key="idx" v-bind="item" />
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
          <a-popconfirm title="确定全部导出" @confirm="downloadFile">
            <a-button type="primary" class="ml-12px" :loading="exportLoading" ghost>全部导出</a-button>
          </a-popconfirm>
        </template>
      </SearchForm>
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
  import { useSearchTable } from '/@/views/dashboard/operate/hooks/useSearchTable';
  import { useRouteQuery } from '/@/views/dashboard/operate/hooks/useRouteQuery';
  import { useGo } from '/@/hooks/web/usePage';
  import { getDimensionWorknopage, getDimensionExportWorknodim, getDimensionDownload } from '/@/api/dashbord/report';
  import { getSyOrganization } from '/@/api/dashbord/operate';
  import { columnsOptions, DEFAULT_IS_BAIN, isBainOptions, templateDownloadList, uploadButtonList } from './config';
  import { uploadButtonList as otherUploadButtonList } from '../papers/config';

  import { BasicTable } from '/@/components/Table';
  import { SearchForm } from '/@/views/dashboard/operate/components/SearchForm/index';
  import { TimeDimension } from '/@/views/dashboard/operate/types';
  import { searchConditionMap } from '/@/views/dashboard/operate/biangongDimension/config';
  import { downloadByUrl } from '/@/utils/file/download';
  import { useDownload } from '/@/views/dashboard/hooks/useDownload';
  import SingleUpload from '/@/views/dashboard/operate/components/SingleUpload.vue';

  defineOptions({ name: 'dashboard-operate-biangongDimension-ticket' });

  const defaultDate = dayjs().subtract(1, 'week');
  const VNodes = (_, { attrs }) => attrs.vnodes;
  const { routeQuery } = useRouteQuery();
  const go = useGo();

  // 导出excel
  const getExportParams = () => {
    return {
      fileName: '工单维度报表',
    };
  };

  // 导出excel
  const downloadFile = () => {
    exportLoading.value = true;
    getDimensionExportWorknodim(searchInfo.value)
      .then(res => {
        const { url, fileName } = res.data;
        downloadByUrl({ url, fileName });
      })
      .finally(() => {
        exportLoading.value = false;
      });
  };

  const { loading: templateDownloading, downloadFile: templateDownloadFile } = useDownload({
    requestApi: getDimensionDownload,
  });
  const { searchInfo, searchFormValue, searchParamOptionsList, exportLoading, registerTable, reload, handleSelectAll } = useSearchTable({
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
      ...routeQuery,
      ...(routeQuery?.sixCodes ? { sixCodes: [routeQuery.sixCodes] } : {}),
    },
    columnsOptions,
    getExportParams,
    api: getDimensionWorknopage,
  });
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
</style>
