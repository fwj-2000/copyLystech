<!-- 表格内容 -->
<template>
  <BasicTable class="table-wrapper" @register="registerTable"></BasicTable>
</template>

<script lang="ts" setup>
  import { ref, watch } from 'vue';

  import { columnOptions } from './config';
  import { useTable, BasicTable, BasicColumn } from '/@/components/Table';
  import { EColumnsType } from '/@/views/dashboard/types';

  interface IProps {
    dataList: any[];
    currentYear: string;
    lastYear: string;
  }
  const props = withDefaults(defineProps<IProps>(), {});

  const dataSource = ref<any[]>([]);
  const columns = ref<BasicColumn[]>([]);

  // 动态生成表头配置
  const setColumns = (data: any[]) => {
    const { currentYear, lastYear } = props;
    columns.value = columnOptions.reduce((pre, cur) => {
      const { dataIndex = '', type = EColumnsType.NORAML, headerCellBgColor = '' } = cur;
      const record = data[0] || {};
      if (type === EColumnsType.DATE_VALUE_LIST) {
        // if (isEmpty(record[dataIndex as string])) return pre;
        const children = record[dataIndex as string].map((item: any) => {
          return {
            dataIndex: item.dateS,
            title: item.dateS.substring(4),
            width: 60,
            align: 'auto',
            customCell: () => {
              return {
                style: 'text-align: right;',
              };
            },
            customHeaderCell: () => ({
              style: {
                'text-align': 'center',
                backgroundColor: headerCellBgColor,
              },
            }),
          };
        });
        pre.push({
          ...cur,
          title: cur.title === '当年数据' ? currentYear : lastYear,
          children,
        });
      } else {
        pre.push(cur);
      }
      return pre;
    }, [] as BasicColumn[]);
  };

  // 设置表格数据
  const setDataSource = (data: any[]) => {
    dataSource.value = data.map(item => {
      return columnOptions.reduce((pre, cur) => {
        const { type = EColumnsType.NORAML } = cur;
        const dataIndex: string = cur.dataIndex as string;
        if (type === EColumnsType.DATE_VALUE_LIST) {
          return {
            ...pre,
            ...item[dataIndex].reduce((p, c) => {
              return {
                ...p,
                [c.dateS]: c.valueS,
              };
            }, {}),
          };
        }
        return {
          ...pre,
          [dataIndex]: item[dataIndex],
        };
      }, {});
    });
  };

  // @ts-ignore 忽略注册表格实例化过深错误
  const [registerTable] = useTable({
    columns,
    dataSource,
    pagination: false,
    useSearchForm: false,
    showTableSetting: false,
    showIndexColumn: false,
    canResize: false,
    bordered: false,
    striped: true,
  });

  watch(
    () => props.dataList,
    dataList => {
      setColumns(dataList);
      setDataSource(dataList);
    },
    { deep: true, immediate: false },
  );
</script>

<style lang="less" scoped>
  :deep(.ant-spin-container) {
    min-height: 0 !important;
  }

  .dashboard-content-container {
    padding: 0 !important;

    :deep(.ant-spin-container) {
      min-height: 20vh !important;
    }

    .empty-wrapper {
      min-height: 60vh;
    }
  }

  :deep(.ant-table-thead > tr) {
    font-size: 12px;

    & > th {
      font-weight: 700;
      white-space: pre-wrap;

      /* 允许换行 */
      word-break: break-word;

      /* 自动断词 */
      text-align: center !important;
      // border-color: @borderColor !important;
      padding: 4px 8px !important;
    }
  }

  :deep(.ant-table-tbody > tr) {
    font-size: 13px;

    &:first-child {
      & > td {
        padding: 0 !important;
      }
    }

    & > td {
      /* 自动断词 */
      padding: 4px 8px !important;
    }
  }
</style>
