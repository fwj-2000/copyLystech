import type { VxeGridPropTypes } from '/@/components/VxeTable';

import { enableStatusOptions } from '../config';
import { useI18n } from '/@/hooks/web/useI18n';

const { t } = useI18n();

export const columns: VxeGridPropTypes.Columns = [
  {
    field: 'seq',
    title: t('component.table.index'),
    type: 'seq',
    width: '50',
    align: 'center',
  },
  // 变更前状态
  { title: t('dict.altMaterial.enableBefore'), field: 'enableBefore', width: 120, cellRender: { name: 'Tag', options: enableStatusOptions } },
  // 变更后状态
  { title: t('dict.altMaterial.enableAfter'), field: 'enableAfter', width: 120, cellRender: { name: 'Tag', options: enableStatusOptions } },
  // 变更前优先级
  { title: t('dict.altMaterial.priorityBefore'), field: 'priorityBefore', width: 120 },
  // 变更后优先级
  { title: t('dict.altMaterial.priorityAfter'), field: 'priorityAfter', width: 120 },
  // 调整原因
  { title: t('dict.altMaterial.updateRemark'), field: 'updateRemark', minWidth: 120 },
  // 操作人
  { title: t('dict.PlanScheduleReportColumn.OperatorName'), field: 'creatorUserName', width: 160 },
  // @ts-ignore 操作时间
  { title: t('dict.processRetrospectReport.ProduceDate'), field: 'creatorTime', width: 160, cellRender: { name: 'Date', format: 'YYYY-MM-DD HH:mm:ss' } },
];
