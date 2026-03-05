import { FormSchema } from '/@/components/Table';
import { procRuleTempEnum } from '/@/views/productionPlan/procruleTemp/types';
import { config } from '../config';

function getFieldWidth(item) {
  if (['operatorId', 'productCode'].includes(item.fieldEnName)) {
    return 220;
  } else if ([3, 2].includes(item.dataType)) {
    return 120;
  } else {
    return '';
  }
}
export function usePrePrintModel({ pageType, operationType }) {
  let curConfig = config[pageType || operationType];
  const { getTableColumns, getTableData, getDetails, addTableItem, deleteTableItem, formSchema } = curConfig;

  const searchFormSchema: FormSchema[] = formSchema;
  // 获取表头数据
  async function getTableColumnsFn(params) {
    try {
      const { code, data } = await getTableColumns(params || { operationType, pageType });
      if (code === 200) {
        if (!data.length) return [];
        const _columns = data.map(item => {
          return {
            width: getFieldWidth(item),
            title: item.fieldCnName,
            dataIndex: item.fieldEnName,
            dataType: item.dataType,
            format: procRuleTempEnum[item.dataType] === 'DateType' ? 'date|YYYY-MM-DD hh:mm:ss' : '',
          };
        });
        if (pageType === 'StartWork') {
          _columns.unshift(
            { title: '执行工序', dataIndex: 'processName', dataType: 1 },
            { title: '处理人', dataIndex: 'handleUser', dataType: 1 },
            { title: '处理时间', dataIndex: 'handleTime', dataType: 5 },
            { title: '开工日期', dataIndex: 'startWorkTime', dataType: 5 },
            { title: '状态', dataIndex: 'status', dataType: 1 },
            {
              title: '节点记录',
              field: 'nodeDetail',
              dataIndex: 'CommonCol.nodeDetail',
              width: 160,
              slots: {
                default: 'nodeDetail',
              },
            },
          );
        } else if (operationType != 'SplitPrint') {
          _columns.unshift({ title: '执行工序', dataIndex: 'processName', dataType: 1 }, { title: '状态', dataIndex: 'status', dataType: 1 });
        }

        return _columns;
      } else {
        return [];
      }
    } catch (error) {
      console.error('获取表格列数据失败:', error);
      return [];
    }
  }

  return {
    searchFormSchema,
    getTableColumns: getTableColumnsFn,
    getTableData,
    addTableItem,
    deleteTableItem,
    getDetails,
  };
}
