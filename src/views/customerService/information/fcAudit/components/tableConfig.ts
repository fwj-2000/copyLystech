import { getFactoryList } from '/@/api/customerSerivce/index';
import { useI18n } from '/@/hooks/web/useI18n';
const { t } = useI18n();

export const endCols = [
  {
    title: t('dict.CommonCol.creatorUserName'),
    field: 'creatorUserName',
    width: '220',
  },
  {
    title: t('dict.CommonCol.creatorTime'),
    field: 'creatorTime',
    width: '220',
    cellRender: {
      name: 'Date',
    },
  },
  {
    title: t('dict.CommonCol.updateUser'),
    field: 'lastModifyUserName',
    width: '220',
  },
  {
    title: t('dict.CommonCol.updateTime'),
    field: 'lastModifyTime',
    width: '220',
    cellRender: {
      name: 'Date',
    },
  },
];
export const commonCols = [
  { type: 'checkbox', field: 'checkbox', width: 60 },
  {
    field: 'approverGroupName',
    title: t('common.groupName'),
    width: 200,
  },
  {
    field: 'factory',
    title: t('dict.CommonCol.factoryName'),
    width: 200,
  },
];
export const listCols = [
  {
    field: 'approverType',
    title: t('dict.ApproverType'),
    width: 200,
  },
  {
    field: 'mainProcess',
    title: t('dict.CommonCol.mainProcess'),
    width: 200,
  },
];
