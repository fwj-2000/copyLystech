import { FormSchema } from '/@/components/Table';
import { procRuleTempEnum } from '/@/views/productionPlan/procruleTemp/types';
import { config, allWorkTypes } from './config';

export function useTallyModel({ workType, operationType, orgId }) {
  let curWorkType: any = null;
  let curConfig: any = null;
  if (operationType === 'Exchange') {
    // 流转
    curWorkType = allWorkTypes[workType];
    curConfig = config[operationType];
  } else {
    // 报工
    curWorkType = allWorkTypes[workType];
    curConfig = config[curWorkType] ? config[curWorkType] : config['diecut'];
  }

  const { getTableColumns, getTableData, getDetails, addTableItem, deleteTableItem, formSchema } = curConfig;

  const searchFormSchema: FormSchema[] = formSchema;

  // 获取表头数据
  async function getTableColumnsFn(params: any = { operationType }) {
    try {
      const { code, data } = await getTableColumns(params);
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
        if (operationType === 'Exchange') {
          _columns.unshift({ title: '执行工序', dataIndex: 'processName', dataType: 1 }, { title: '状态', dataIndex: 'labelStatus', dataType: 1 });
        } else {
          _columns.unshift(
            { title: '执行工序', dataIndex: 'processName', dataType: 1 },
            { title: '处理人', dataIndex: 'handleUser', dataType: 1 },
            { title: '处理时间', dataIndex: 'handleTime', dataType: 5 },
          );
        }

        return _columns;
      } else {
        return [];
      }
    } catch (error) {
      return [];
    }
  }

  function getFieldWidth(item) {
    if (['operatorId', 'productCode'].includes(item.fieldEnName)) {
      return 220;
    } else if ([3, 2].includes(item.dataType)) {
      return 120;
    } else {
      return '';
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
