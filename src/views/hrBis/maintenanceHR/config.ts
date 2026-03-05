import { useI18n } from '/@/hooks/web/useI18n';
const { t } = useI18n();
import XEUtils from 'xe-utils';
enum COLUMN_TYPE_ENUM {
  NESTED_HEADER = 'nested_header',
}
import dayjs from 'dayjs';

// 表单配置
export const getHrTrainFormConfig = () => {
  return [
    {
      fieldName: 'month',
      label: '',
      labelWidth: 100,
      component: 'RangePicker',
      // defaultValue: [dayjs().subtract(1, 'month'), dayjs().subtract(0, 'month')],
      componentProps: {
        format: 'YYYY-MM',
      },
    },
    // {
    //   fieldName: 'month',
    //   label: '',
    //   component: 'DatePicker',
    //   componentProps: {
    //     format: 'YYYY-MM',
    //     allowClear: true,
    //   },
    // },
  ];
};

export const getHrTrainPageColumns = () => {
  const column = [
    {
      field: 'workNo',
      title: '创建人工号',
      width: 100,
    },
    {
      field: 'userName',
      title: '创建人姓名',
      width: 100,
    },
    {
      field: 'dept5',
      title: '05层级部门',
      width: 100,
    },
    {
      field: 'dept6',
      title: '06层级部门',
      width: 100,
    },
    {
      headerAlign: 'center',
      field: 'list',
      columnType: COLUMN_TYPE_ENUM.NESTED_HEADER,
      getChildrenConfig: (parentConfig: any, { parent, childField }: any) => {
        const isNumericField = ['peopleNum', 'amount', 'errorNum'].includes(childField);
        const align = isNumericField ? 'right' : 'left';
        return {
          align,
          headerAlign: 'left',
          // formatter: childField === 'amount' ? ({ cellValue }: any) => `${cellValue}` : '',
        };
      },
    },
  ];

  return column;
};

export function formatDataList({ columns, data }) {
  const res = data.map((item: { list: Array<{ keys: string; value?: string | number }> } & Recordable<any>) => {
    const columnData = columns.reduce((pre: any, cur: any) => {
      const { field, columnType } = cur ?? {};
      if (columnType === COLUMN_TYPE_ENUM.NESTED_HEADER) {
        // 处理嵌套表头结构：将对象数组转换为平铺字段
        const nestedData = item[field] ?? [];
        const flattenedData = nestedData.reduce((acc: any, nestedItem: any, index: number) => {
          Object.keys(nestedItem).forEach(key => {
            if (key !== 'monthTitle') {
              // monthTitle作为父级表头，其他字段作为子级
              const fieldKey = `${field}_${index}_${key}`;
              acc[fieldKey] = nestedItem[key];
            }
          });
          return acc;
        }, {});
        return {
          ...pre,
          ...flattenedData,
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
    const { field, columnType, getChildrenConfig } = cur ?? {};
    if (columnType === COLUMN_TYPE_ENUM.NESTED_HEADER) {
      // 处理嵌套表头结构
      const fieldStr = field as string;
      const firstList = data[0][fieldStr];

      // 为每个嵌套项创建父级表头
      const nestedColumns = firstList.map((nestedItem: any, index: number) => {
        const parentTitle = nestedItem.monthTitle.includes('月中')
          ? nestedItem.monthTitle.replace('月中', t('hrBis.monthMid'))
          : nestedItem.monthTitle.replace('月末', t('hrBis.monthEnd'));

        // 获取子字段（排除monthTitle）
        const childFields = Object.keys(nestedItem).filter(key => key !== 'monthTitle');

        // 为每个子字段创建子级表头
        const children = childFields.map(childField => {
          const childFieldName = `${fieldStr}_${index}_${childField}`;
          // 字段名到中文标题的映射
          const titleMap = {
            peopleNum: t('dict.hrBisColumn.peopleNum'), //'人数',
            amount: t('dict.hrBisColumn.amount'), //'归档金额',
            status: t('dict.hrBisColumn.status'), //'状态',
            errorNum: t('dict.hrBisColumn.errorNum'), //'异常人数',
          };

          // 基础配置
          const baseConfig = {
            field: childFieldName,
            title: titleMap[childField] || childField,
            minWidth: 80,
          };

          // 应用自定义配置
          const customConfig =
            typeof getChildrenConfig === 'function'
              ? getChildrenConfig(cur, {
                  parent: nestedItem,
                  childField,
                })
              : {};

          return {
            ...baseConfig,
            ...customConfig,
          };
        });

        // 返回父级表头配置
        return {
          ...cur,
          title: parentTitle,
          children,
          field: undefined, // 父级表头不需要field
        };
      });

      return pre.concat(nestedColumns);
    }
    return pre.concat([cur]);
  }, [] as Array<any>);
  return allColumns;
}
