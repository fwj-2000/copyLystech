import type { VxeGridPropTypes } from '/@/components/VxeTable';

import { isNullOrUnDef } from '/@/utils/is';

/** 图纸更新 - 表格列配置 */
export const moldDrawingColumns: VxeGridPropTypes.Columns = [
  {
    type: 'checkbox',
    width: 50,
  },
  {
    type: 'seq',
    width: 50,
  },
  {
    title: '模具图纸',
    field: 'moldDrawings',
    width: 200,
    slots: {
      default: 'moldDrawings',
    },
  },
  {
    title: '图纸来源',
    field: 'drawingSource',
    formatter: ({ row }) => row.drawingSourceName,
    width: 100,
  },
  {
    title: '模具料号',
    field: 'moldNo',
    width: 200,
  },
  {
    title: '产品内部料号',
    field: 'insidePartNumber',
    width: 160,
  },
  {
    title: '旧版内部料号',
    field: 'insidePartNumberOld',
    width: 160,
  },
  {
    title: '工厂',
    field: 'factory',
    width: 180,
    formatter: ({ row }) => {
      return [row.factory, row.factoryName].filter(Boolean).join('/');
    },
  },
  {
    title: '图纸版本',
    field: 'drawingVersion',
    width: 100,
    formatter: ({ cellValue }) => (isNullOrUnDef(cellValue) ? '' : `T${cellValue}`),
  },
  {
    title: '上传人',
    field: 'uploadProcessorName',
    i18nField: 'uploadProcessorId',
    width: 160,
  },
  {
    title: '上传时间',
    field: 'uploadProcessorDate',
    width: 160,
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD HH:mm:ss',
    },
  },
];
