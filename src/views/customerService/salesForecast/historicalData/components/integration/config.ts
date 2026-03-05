import type { VxeGridPropTypes } from '/@/components/VxeTable';

import { useI18n } from '/@/hooks/web/useI18n';
import { MATERIA_FORM_OPTIONS } from '/@/views/business/basicInformation/materialRatio/config';

const { t } = useI18n();

/**
 * 清单页 - 表格列配置
 */
export const vxeTableColumns: VxeGridPropTypes.Columns = [
  {
    field: 'checkbox',
    type: 'checkbox',
    width: '50',
    align: 'center',
  },
  {
    field: 'seq',
    title: t('component.table.index'),
    type: 'seq',
    width: '50',
    align: 'center',
  },
  // 版本
  {
    title: '版本',
    field: 'batchCode',
    showOverflow: 'tooltip',
    width: '120',
  },
  // 产品内部料号(新)
  // {
  //   title: '产品内部料号(新)',
  //   field: 'insidePartNumber',
  //   showOverflow: 'tooltip',
  //   minWidth: '220',
  // },
  // 产品内部料号(旧)
  {
    title: '产品内部料号(旧)',
    field: 'oldInsidePartNumber',
    showOverflow: 'tooltip',
    minWidth: '220',
  },
  // 直接客户代码
  {
    title: '直接客户代码',
    field: 'immediateCustomerCode',
    showOverflow: 'tooltip',
    minWidth: '220',
    editRender: { name: 'AInput', enabled: true },
  },
  // 片卷料形态
  // {
  //   title: '片卷料形态',
  //   field: 'shipPatternDesc',
  //   showOverflow: 'tooltip',
  //   minWidth: '120',
  //   editRender: { name: 'AInput', enabled: true },
  // },
  {
    title: '片卷料形态',
    field: 'shipPattern',
    showOverflow: 'tooltip',
    minWidth: '120',
    // @ts-ignore
    i18nField: 'shipPatternDesc',
    editRender: {
      enabled: false,
      name: 'ASelect',
      // @ts-ignore
      field: 'shipPattern',
      props: {
        style: 'width: 100%',
        options: MATERIA_FORM_OPTIONS.map(item => ({ ...item, value: item.id, label: item.fullName })),
        onChange: (_, data, { row }) => {
          Object.assign(row, {
            shipPatternDesc: data?.fullName || '',
            shipPattern: data?.value || '',
          });
        },
      },
    },
  },
  // 出货数量
  {
    title: '出货数量',
    field: 'historyShippedQty',
    showOverflow: 'tooltip',
    width: '120',
  },
  // 终端项目代码
  {
    title: '终端项目代码',
    field: 'terminalCustomerProjectCode',
    showOverflow: 'tooltip',
    width: '120',
    editRender: { name: 'AInput', enabled: true },
  },
  // 终端客户料号
  {
    title: '终端客户料号',
    field: 'terminalCustomerPartNumber',
    showOverflow: 'tooltip',
    width: '120',
  },
  // 导入人
  {
    title: '导入人',
    field: 'importUserName',
    showOverflow: 'tooltip',
    width: '220',
  },
  // 导入时间
  {
    title: '导入时间',
    field: 'importDate',
    showOverflow: 'tooltip',
    width: '160',
    cellRender: {
      name: 'Date',
      format: 'YYYY/MM/DD HH:mm:ss',
    },
  },
];
