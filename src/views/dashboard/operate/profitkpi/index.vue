<!-- 损益KPI -->
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
          isHideBU: true,
          organizeKeyword: '',
          getOrganizationApi: getSyOrganization,
          disabledDate: (current: Dayjs) => {
            return current && current < dayjs('2023-01-01').tz();
          },
        }">
        <template #timeDimension>
          <a-form-item name="timeDimension">
            <a-select v-model:value="searchFormValue.timeDimension">
              <a-select-option value="week">周</a-select-option>
              <a-select-option value="month">月</a-select-option>
            </a-select>
          </a-form-item>
        </template>
        <template #right>
          <a-form-item v-if="searchFormValue.timeDimension === TimeDimension.MONTH" name="dimension">
            <a-select v-model:value="searchFormValue.dimension">
              <a-select-option value="cz">产值</a-select-option>
              <a-select-option value="xz">销值</a-select-option>
            </a-select>
          </a-form-item>
          <a-button v-for="(item, idx) in jumpButtonOptions" :key="idx" type="primary" class="mr-8px" @click="go(item.getPathUrl(searchFormValue))">
            {{ item.title }}
          </a-button>
          <a-button ghost type="primary" class="mx-8px" :loading="exportLoading" @click="downloadFile">导出</a-button>

          <!-- 上传按钮 -->
          <a-dropdown placement="bottomLeft" :trigger="['click']" v-if="searchFormValue.timeDimension === TimeDimension.WEEK">
            <a-button class="ml-12px" type="primary" ghost :loading="dataImportloading">数据导入</a-button>
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

          <!-- 模板下载 -->
          <a-dropdown placement="bottomLeft" :trigger="['click']" v-if="searchFormValue.timeDimension === TimeDimension.WEEK">
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
          <div class="flex ml-8px">
            <span> 取数时间：{{ searchFormValue.timeDimension === 'week' ? '每周三' : '每月11号' }}</span>
            <a-popover placement="right">
              <template #content>
                <p v-if="searchFormValue.timeDimension === 'week'">周损益取自周KPI的实际数，以及经管导入的目标数</p>
                <p v-else>数据来源：海波龙系统</p>
              </template>
              <img :src="vectorSvg" width="18px" class="ml-8px" />
            </a-popover>
          </div>
        </template>
      </SearchForm>
    </div>
    <!-- 内容加载封装组件 -->
    <div class="dashboard-content-container">
      <SpinContent
        v-bind="{
          loading,
          isEmptyData,
          isRequestError,
          showList: false,
        }">
        <!-- 报表表格 -->
        <BasicTable class="table-wrapper" @register="registerTable">
          <template v-slot:bodyCell="{ column, record }">
            <!-- 可跳转 -->
            <template
              v-if="
                column.cellType === ETableCellSlotType.LINK &&
                column.getPathUrl({
                  searchFormValue,
                  record,
                  column,
                })
              ">
              <span class="text-hover" @click="handleGo({ column, record })">
                {{ record[column.dataIndex as string] }}
              </span>
            </template>
          </template>
        </BasicTable>
      </SpinContent>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import dayjs, { Dayjs } from 'dayjs';
  import { ref } from 'vue';
  import { BasicColumn, useTable, BasicTable } from '/@/components/Table';
  import { useSearchForm } from '/@/hooks/web/useSearchForm';
  import { useGo } from '/@/hooks/web/usePage';
  import { useRouteQuery } from '/@/views/dashboard/operate/hooks/useRouteQuery';
  import { getSyOrganization } from '/@/api/dashbord/operate';
  import { getProfitKpiList, getProfitandlosReportexport, getProfitandlosExportTemplate } from '/@/api/dashbord/report';
  import { downloadByUrl } from '/@/utils/file/download';
  import SingleUpload from '/@/views/dashboard/operate/components/SingleUpload.vue';
  import vectorSvg from '/@/assets/svg/report/vector_primary.svg';

  import {
    allColumnsOptions,
    ALLCustomHeaderCellColor,
    monthColumnsOptions,
    getWeekColumnsOptions,
    EColumnsType,
    ETableCellSlotType,
    jumpButtonOptions,
    ALLWEEKCellColor,
    uploadButtonList,
    templateDownloadList,
  } from './config';

  import { SearchForm } from '/@/views/dashboard/operate/components/SearchForm/index';
  import { SpinContent } from '/@/views/dashboard/operate/components/styleItem/index';
  import { TimeDimension } from '../types';
  import { cloneDeep, isEmpty, merge } from 'lodash-es';
  import { useDownload } from '/@/views/dashboard/hooks/useDownload';

  defineOptions({ name: 'dashboard-operate-profitkpi' });

  const go = useGo();
  const columns = ref<BasicColumn[]>([]); // 表头配置
  const dataSource = ref<any[]>([]);

  const { routeQuery } = useRouteQuery();

  const exportLoading = ref(false);
  const dataImportloading = ref(false);

  // 接口请求参数
  const getParams = () => {
    const dateDimQuery = getTrendQueryParams();
    return {
      orgCode: searchFormValue.orgCode,
      dimension: searchFormValue.timeDimension === TimeDimension.MONTH ? searchFormValue.dimension : searchFormValue.timeDimension,
      startDim: dateDimQuery.startDim,
      endDim: dateDimQuery.endDim,
    };
  };

  // 导出文件
  const downloadFile = () => {
    exportLoading.value = true;
    getProfitandlosReportexport(getParams())
      .then(res => {
        const { url, fileName = '损益报表.xlsx' } = res.data;
        downloadByUrl({ url, fileName });
      })
      .finally(() => {
        exportLoading.value = false;
      });
  };

  const { loading: templateDownloading, downloadFile: templateDownloadFile } = useDownload({
    requestApi: getProfitandlosExportTemplate,
  });

  // 将多级表头数据平铺
  function transformData(data: any[]) {
    const result: any[] = [];
    data.forEach(item => {
      const newItem = {
        ...item,
      };
      if (searchFormValue.timeDimension === TimeDimension.MONTH) {
        item.monthList.forEach((monthData, monthIndex) => {
          monthData.vlist.forEach((vlistItem, vlistIndex) => {
            vlistItem.values.map((item, idx) => {
              const key = `month${monthIndex}Vlist${vlistIndex}Item${idx}`;
              newItem[key] = item.values;
            });
          });
        });
      }
      // 周维度数据处理
      if (searchFormValue.timeDimension === TimeDimension.WEEK) {
        item.weekList.forEach(weekData => {
          newItem[`amount${weekData.key}`] = weekData.amount;
          newItem[`propor${weekData.key}`] = weekData.propor;
        });
      }
      result.push(newItem);
    });
    return result;
  }

  const getTableData = () => {
    return new Promise((resolve, reject) => {
      getProfitKpiList(getParams())
        .then(res => {
          const { data } = res;
          const list = data.list ?? data;
          resolve({ data: { list } });
          if (isEmpty(list)) return;
          const dataList = transformData(list);
          columns.value = getColumns(dataList);
          dataSource.value = dataList;
        })
        .catch(error_ => {
          reject(error_);
        });
    });
  };
  // 使用维度搜索hooks
  const defaultDate = dayjs().tz().subtract(45, 'day');
  const { loading, searchFormValue, isRequestError, isEmptyData, getTrendQueryParams } = useSearchForm({
    defaultDate,
    isTrendData: true,
    isRangePicker: true,
    defaultSearchFormValue: {
      orgCode: 'MQ',
      dateRange: [dayjs(defaultDate).tz().subtract(4, 'week'), dayjs(defaultDate).tz()],
      timeDimension: TimeDimension.WEEK,
      dimension: 'cz',
      ...routeQuery,
    },
    searchReqMth: getTableData,
  });
  // 跳转
  const handleGo = ({ column, record }) => {
    const { getPathUrl } = column;
    const url =
      (getPathUrl &&
        getPathUrl({
          searchFormValue,
          record: record,
          column: column,
        })) ||
      '';
    if (url) {
      go(url);
    }
  };

  // 计算合并信息
  const getComputeRowSpans = (data, dataIndex) => {
    const spans = data.map(() => 1); // 初始化每行的 rowSpan 为 1
    let currentIdx = 0;
    let startIdx = 0;
    while (currentIdx < data.length - 1) {
      if (data[currentIdx][dataIndex] === data[currentIdx + 1][dataIndex]) {
        spans[startIdx] += 1;
        spans[currentIdx + 1] = 0; // 被合并的行不需要显示
      } else {
        startIdx = currentIdx + 1;
      }
      currentIdx++;
    }
    return spans;
  };

  // 获取表头配置信息
  const getColumns = (data: any): BasicColumn[] => {
    const columnsOptions = searchFormValue.timeDimension === TimeDimension.MONTH ? monthColumnsOptions : getWeekColumnsOptions(searchFormValue, data);
    return columnsOptions
      .map(item => {
        return merge(cloneDeep(allColumnsOptions[item.dataIndex as string] || {}), item);
      })
      .reduce((pre, cur) => {
        const { type = EColumnsType.NORAML, isRowSpan = false, sortable = false, baseInfo, dataIndex, children = [] } = cur;
        if (type === EColumnsType.MONTH_LIST) {
          // 特殊字段处理，每天的数据项
          const dataList = data[0][dataIndex as string] || [];
          return [
            ...pre,
            ...dataList.map((month, monthIndex) => ({
              align: 'center',
              title: month.monthKey,
              customHeaderCell: () => ({
                style: {
                  backgroundColor: ALLCustomHeaderCellColor[monthIndex] || ALLCustomHeaderCellColor[0],
                },
              }),
              children: month.vlist.map((vlist, vlistIndex) => ({
                title: vlist.key,
                customHeaderCell: () => ({
                  style: {
                    backgroundColor: ALLCustomHeaderCellColor[monthIndex] || ALLCustomHeaderCellColor[0],
                  },
                }),
                children: vlist.values.map((item, idx) => ({
                  title: item.keys,
                  dataIndex: `month${monthIndex}Vlist${vlistIndex}Item${idx}`,
                  ...baseInfo,
                  customHeaderCell: () => ({
                    style: {
                      backgroundColor: ALLCustomHeaderCellColor[monthIndex] || ALLCustomHeaderCellColor[0],
                    },
                  }),
                  sorter: (a, b) => {
                    const aValue = Number.parseFloat(a[`month${monthIndex}Vlist${vlistIndex}Item${idx}`]) || 0;
                    const bValue = Number.parseFloat(b[`month${monthIndex}Vlist${vlistIndex}Item${idx}`]) || 0;
                    return aValue - bValue;
                  },
                  sortDirections: ['descend', 'ascend'],
                })),
              })),
            })),
          ];
        } else if (type === EColumnsType.WEEK_LIST) {
          // 特殊字段处理，每天的数据项
          const dataList = data[0][dataIndex as string] || [];
          return [
            ...pre,
            ...dataList.map((week, weekIndex) => ({
              align: 'center',
              title: week.key,
              customHeaderCell: () => ({
                style: {
                  backgroundColor: ALLWEEKCellColor[weekIndex % 2] || ALLWEEKCellColor[0],
                },
              }),
              children: [
                { title: '金额', dataIndex: `amount${week.key}` },
                { title: '占比', dataIndex: `propor${week.key}` },
              ].map(item => ({
                ...baseInfo,
                title: item.title,
                dataIndex: item.dataIndex,
                customHeaderCell: () => ({
                  style: {
                    backgroundColor: ALLWEEKCellColor[weekIndex % 2] || ALLWEEKCellColor[0],
                  },
                }),
              })),
            })),
          ];
        } else if (type === EColumnsType.BLOCK) {
          return [
            ...pre,
            {
              dataIndex,
              ...baseInfo,
              customCell: (_, index) => {
                const list = getComputeRowSpans(data, dataIndex);
                return { rowSpan: list[index || 0] };
              },
            },
          ];
        } else {
          if (!isEmpty(children)) {
            const res = [
              ...pre,
              {
                ...cur,
                children: children.map(child => {
                  const { isRowSpan = false, sortable = false, baseInfo } = allColumnsOptions[child.dataIndex as string] || {};
                  return {
                    ...baseInfo,
                    ...child,
                    dataIndex: child.dataIndex,
                    customHeaderCell: cur.customHeaderCell,
                    ...(sortable
                      ? {
                          sorter: (a, b) => {
                            const aValue = Number.parseFloat(a[dataIndex as string]) || 0;
                            const bValue = Number.parseFloat(b[dataIndex as string]) || 0;
                            return aValue - bValue;
                          },
                        }
                      : {}),
                    ...(isRowSpan
                      ? {
                          customCell: (_, index) => {
                            const list = getComputeRowSpans(data, dataIndex);
                            return { rowSpan: list[index || 0] };
                          },
                        }
                      : {}),
                  };
                }),
              },
            ];
            return res;
          }
          return [
            ...pre,
            {
              dataIndex,
              ...baseInfo,
              ...(sortable
                ? {
                    sorter: (a, b) => {
                      const aValue = Number.parseFloat(a[dataIndex as string]) || 0;
                      const bValue = Number.parseFloat(b[dataIndex as string]) || 0;
                      return aValue - bValue;
                    },
                  }
                : {}),
              ...(isRowSpan
                ? {
                    customCell: (_, index) => {
                      const list = getComputeRowSpans(data, dataIndex);
                      return { rowSpan: list[index || 0] };
                    },
                  }
                : {}),
            },
          ];
        }
      }, []) as BasicColumn[];
  };

  // @ts-ignore 注册表格hook
  const [registerTable] = useTable({
    columns,
    dataSource,
    pagination: false,
    useSearchForm: false,
    showTableSetting: false,
    showIndexColumn: false,
    bordered: true,
    striped: true,
    immediate: false,
    onChange: (_, __, ___, { currentDataSource }) => {
      columns.value = getColumns(currentDataSource);
    },
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
  @import url('../../../../design/dashboard.less');

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
    font-size: 12px;
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
      padding: 4px 8px !important;
    }
  }
</style>
