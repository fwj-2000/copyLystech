import { useI18n } from '/@/hooks/web/useI18n';
const { t } = useI18n();
import XEUtils from 'xe-utils';

export enum COLUMN_TYPE_ENUM {
  KEYS_VALUES = 'keys_values',
  WEEKS = 'weeks',
  TOTAL = 'total',
}
// 表单配置
export const getHrTrainFormConfig = () => {
  return [
    {
      fieldName: 'month',
      label: '',
      labelWidth: 100,
      component: 'RangePicker',
      componentProps: {
        format: 'YYYY-MM',
      },
    },
    {
      label: '',
      fieldName: 'orgCode',
      component: 'Select',
      componentProps: {
        allowClear: true,
      },
    },
    {
      label: '',
      fieldName: 'creatorUserAccount',
      component: 'Select',
      componentProps: {
        allowClear: true,
      },
    },
    {
      label: '',
      fieldName: 'creatorUserId',
      component: 'Select',
      componentProps: {
        allowClear: true,
      },
    },
  ];
};

export const getHrTrainPageColumns = () => {
  const column = [
    {
      field: 'dept',
      title: t('dict.Module.Department'),
      width: 70,
    },
    {
      width: 60,
      field: 'metrics',
      title: t('dict.hrBisColumn.month'), //'月份',
    },
    {
      headerAlign: 'center',
      field: 'list',
      columnType: COLUMN_TYPE_ENUM.KEYS_VALUES,
      getChildrenConfig: () => ({
        align: 'right',
        headerAlign: 'left',
        width: '80',
      }),
    },
  ];

  return column;
};
/** 格式化数据列表 */
export function formatDataList({ columns, data }) {
  const res = data.map((item: { list: Array<{ keys: string; value?: string | number }> } & Recordable<any>) => {
    const columnData = columns.reduce((pre: any, cur: any) => {
      const { field, columnType } = cur ?? {};
      if (columnType === COLUMN_TYPE_ENUM.KEYS_VALUES) {
        return {
          ...pre,
          ...(item[field] ?? []).reduce((pre: any, cur: any) => {
            const key = `${field}_${cur.keys}`;
            return {
              ...pre,
              [key]: XEUtils.round(cur.values ?? 0, 2),
            };
          }, {}),
        };
      }
      return {
        ...pre,
        [field]: item[field],
      };
    }, {});
    return {
      ...item,
      ...columnData,
    };
  });
  return res;
}
/** 获取列配置列表 */
export function getColumnsConfigList({ data, columns }: { data: any; columns: Array<any> }) {
  const allColumns: Array<any> = columns.reduce((pre, cur) => {
    const { field, columnType, getChilrenTitle, getChildrenConfig } = cur ?? {};
    if (columnType === COLUMN_TYPE_ENUM.KEYS_VALUES) {
      const fieldStr = field as string;
      const firstList = data[0][fieldStr];
      const columns = firstList.map((item: any) => {
        const obj = {
          ...cur,
          field: `${fieldStr}_${item.keys}`,
          title: typeof getChilrenTitle === 'function' ? getChilrenTitle({ key: item.keys }) : item.keys,
          minWidth: 80,
          ...(typeof getChildrenConfig === 'function' ? getChildrenConfig(cur, item) : {}),
        };
        return obj;
      });
      return pre.concat(columns);
    }
    return pre.concat([cur]);
  }, [] as Array<any>);
  return allColumns;
}
export const spanMethodFun = ({ row, rowIndex, column, visibleData }) => {
  const spanFields = ['dept'];
  const cellValue = row[column.field];
  if (cellValue && spanFields.includes(column.field)) {
    const prevRow = visibleData[rowIndex - 1];
    let nextRow = visibleData[rowIndex + 1];
    if (prevRow && prevRow[column.field] === cellValue) {
      return { rowspan: 0, colspan: 0 };
    } else {
      let countRowspan = 1;
      while (nextRow && nextRow[column.field] === cellValue) {
        nextRow = visibleData[++countRowspan + rowIndex];
      }
      if (countRowspan > 1) {
        return { rowspan: countRowspan, colspan: 1 };
      }
    }
  }
};
export const dataMock = {
  code: 200,
  msg: '操作成功',
  data: [
    {
      dept: '生产',
      metrics: '人数',
      list: [
        {
          keys: '2025-09',
          values: 196,
        },
        {
          keys: '2025-10',
          values: 196,
        },
      ],
    },
    {
      dept: '生产',
      metrics: '金额',
      list: [
        {
          keys: '2025-09',
          values: 77678.49,
        },
      ],
    },
    {
      dept: '生产',
      metrics: '人均',
      list: [
        {
          keys: '2025-09',
          values: 396.3188265306122,
        },
      ],
    },
    {
      dept: '品质',
      metrics: '人数',
      list: [
        {
          keys: '2025-09',
          values: 5,
        },
      ],
    },
  ],
  timestamp: 1760337459,
};
