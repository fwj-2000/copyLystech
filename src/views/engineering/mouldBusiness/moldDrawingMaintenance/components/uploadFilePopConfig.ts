import type { VxeGridPropTypes } from '/@/components/VxeTable';

import { useI18n } from '/@/hooks/web/useI18n';
import { isNullOrUnDef } from '/@/utils/is';

const { t } = useI18n();

export const columns: VxeGridPropTypes.Columns = [
  {
    title: '模具料号',
    field: 'moldNo',
    width: 150,
  },
  {
    title: '图纸版本',
    field: 'drawingVersion',
    width: 80,
    formatter: ({ cellValue }) => (isNullOrUnDef(cellValue) ? '' : `T${cellValue}`),
  },
  {
    title: '产品内部料号',
    field: 'insidePartNumber',
    width: 180,
  },
  {
    title: '旧版成品编码',
    field: 'insidePartNumberOld',
    width: 180,
  },
  {
    title: '工厂',
    field: 'factory',
    width: 150,
    formatter: ({ row }) => {
      return [row.factory, row.factoryName].filter(Boolean).join('/');
    },
  },
  {
    title: '模具图纸',
    field: 'moldDrawings',
    i18nField: 'moldDrawings',
    slots: {
      default: 'moldDrawings',
    },
  },
  {
    title: t('common.action'),
    fixed: 'right',
    field: 'action',
    width: 80,
    slots: { default: 'action' },
  },
];
