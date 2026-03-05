import type { VxeGridPropTypes } from '/@/components/VxeTable';

import { useI18n } from '/@/hooks/web/useI18n';
const { t } = useI18n();
export const column: VxeGridPropTypes.Columns = [
  {
    field: 'checkbox',
    type: 'checkbox',
    width: '50',
    align: 'center',
  },
  {
    title: t('dict.imageType'), //'图片类型',
    field: 'imageTypeName',
    width: 100,
  },
  {
    title: t('dict.CommonCol.scenePicture'), //'现场图片',
    field: 'sceneImage',
    width: 100,
    slots: {
      default: 'sceneImage',
    },
  },
  {
    title: t('dict.ProcessColumn.mainProcess'), //'主要制成',
    field: 'mainProcessName',
    width: 100,
  },
  {
    title: '工厂',
    field: 'factoryName',
    i18nField: 'factory',
    width: 160,
    formatter: ({ row }) => {
      return [row.factory, row.factoryName].filter(Boolean).join('/');
    },
  },
  {
    title: t('dict.PurchaseQuotationColumn.region'), //'区域',
    field: 'region',
    minWidth: 100,
  },
  {
    title: '上传人',
    field: 'creatorUserName',
    minWidth: 200,
  },
  {
    title: '上传时间',
    field: 'creatorTime',
    minWidth: 150,
    cellRender: {
      name: 'Date',
    },
  },
  {
    title: '修改人',
    field: 'lastModifyUserName',
    minWidth: 200,
  },
  {
    title: '修改时间',
    field: 'lastModifyTime',
    minWidth: 150,
    cellRender: {
      name: 'Date',
    },
  },
  {
    title: t('common.action'),
    field: 'action',
    fixed: 'right',
    slots: {
      default: 'action',
    },
    width: 80,
  },
];
