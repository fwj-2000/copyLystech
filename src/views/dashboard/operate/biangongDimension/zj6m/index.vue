<!-- 中间六码维度 -->
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
          <a-popconfirm title="确定全部导出" @confirm="downloadFile">
            <a-button type="primary" class="ml-12px" :loading="exportLoading" ghost>全部导出</a-button>
          </a-popconfirm>
        </template>
      </SearchForm>
    </div>
    <!-- 内容加载封装组件 -->
    <div class="dashboard-content-container">
      <!-- 报表表格 -->
      <BasicTable v-if="searchFormValue.orgCode" class="table-wrapper" @register="registerTable">
        <template v-slot:bodyCell="{ column, record }">
          <!-- 可跳转 -->
          <template v-if="column.cellType === ETableCellSlotType.LINK">
            <span class="text-hover" @click="handleGo({ column, record })">
              {{ record[column.dataIndex as string] }}
            </span>
          </template>
        </template>
      </BasicTable>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import dayjs from 'dayjs';
  import { useSearchTable } from '/@/views/dashboard/operate/hooks/useSearchTable';
  import { useGo } from '/@/hooks/web/usePage';
  import { BasicColumn } from '/@/components/Table';
  import { getDimensionSixcodedi, getDimensionExportSixcodedi } from '/@/api/dashbord/report';
  import { getSyOrganization } from '/@/api/dashbord/operate';
  import { cloneDeep, merge } from 'lodash-es';

  import {
    columnsOptions,
    allColumnsOptions,
    DEFAULT_IS_BAIN,
    isBainOptions,
    EColumnsType,
    ALLCustomBaseHeaderCellColor,
    ALLCustomActualHeaderCellColor,
    ETableCellSlotType,
    customValueCell,
    customNumberValueCell,
  } from './config';
  import { searchConditionMap } from '../config';
  import { BasicTable } from '/@/components/Table';
  import { SearchForm } from '/@/views/dashboard/operate/components/SearchForm/index';
  import { TimeDimension } from '/@/views/dashboard/operate/types';
  import { downloadByUrl } from '/@/utils/file/download';

  defineOptions({ name: 'dashboard-operate-biangongDimension-zj6m' });

  const defaultDate = dayjs().tz().subtract(1, 'week');
  const VNodes = (_, { attrs }) => attrs.vnodes;
  const go = useGo();

  // 导出excel
  const downloadFile = () => {
    exportLoading.value = true;
    getDimensionExportSixcodedi(searchInfo.value)
      .then(res => {
        const { url, fileName } = res.data;
        downloadByUrl({ url, fileName });
      })
      .finally(() => {
        exportLoading.value = false;
      });
  };

  // 导出excel
  const getExportParams = (columns, tableList) => {
    return {
      columns: columns.reduce((pre, cur) => {
        if (cur.children) {
          return [...pre, ...cur.children];
        }
        return [pre, cur];
      }, []),
      tableList,
      fileName: '六码维度报表',
    };
  };
  // 获取表头配置信息
  const getColumns = (data: any): BasicColumn[] => {
    return columnsOptions
      .map(item => {
        return merge(cloneDeep(allColumnsOptions[item.dataIndex as string] || {}), item);
      })
      .reduce((pre, cur, cidx) => {
        const { type = EColumnsType.NORAML, baseInfo, dataIndex, children = [] } = cur;
        if (type === EColumnsType.MONTH_LIST) {
          const dataList = data[0][dataIndex as string] || [];
          const cellColor = cidx % 2 === 0 ? ALLCustomBaseHeaderCellColor : ALLCustomActualHeaderCellColor;
          return [
            ...pre,
            ...dataList.map((item, idx) => ({
              title: item.monthKey,
              customHeaderCell: () => ({
                style: {
                  backgroundColor: cellColor[idx % 2],
                },
              }),
              children: item.vlist.map((list, vIdx) => {
                const customValueCellMth = list.keys.includes('手工效率') ? customNumberValueCell : customValueCell;
                return {
                  title: list.keys,
                  dataIndex: `${dataIndex}month${idx}Vlist${vIdx}`,
                  customHeaderCell: () => ({
                    style: {
                      backgroundColor: cellColor[idx % 2],
                    },
                  }),
                  ...baseInfo,
                  ...customValueCellMth,
                };
              }),
            })),
          ];
        }
        return [
          ...pre,
          {
            dataIndex,
            ...baseInfo,
            ...(children ? { children } : {}),
          },
        ];
      }, []) as BasicColumn[];
  };

  const setTableData = dataSource => {
    const dataList: any[] = [];
    dataSource.forEach(item => {
      const newItem = {
        ...item,
      };
      item.actualList.forEach((monthData, monthIndex) => {
        monthData.vlist.forEach((vlistItem, vlistIndex) => {
          const key = `actualListmonth${monthIndex}Vlist${vlistIndex}`;
          newItem[key] = vlistItem.values;
        });
      });
      item.standardList.forEach((monthData, monthIndex) => {
        monthData.vlist.forEach((vlistItem, vlistIndex) => {
          const key = `standardListmonth${monthIndex}Vlist${vlistIndex}`;
          newItem[key] = vlistItem.values;
        });
      });
      dataList.push(newItem);
    });
    return dataList;
  };

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
      dateRange: [dayjs(defaultDate).tz().subtract(3, 'week'), dayjs(defaultDate).tz()],
      timeDimension: TimeDimension.WEEK,
    },
    withoutPagination: true,
    getExportParams,
    getColumns,
    setTableData,
    api: getDimensionSixcodedi,
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
