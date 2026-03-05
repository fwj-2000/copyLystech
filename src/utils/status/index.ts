/*
 * @Author: wenzhenjin
 * @Date: 2025-04-01 08:53:11
 * @LastEditors: zengjianyu zeng.jian.yu@lingyiitech.com
 * @LastEditTime: 2025-11-12 13:09:06
 * @FilePath: \lydc.server.web\src\utils\status\index.ts
 */
import { useI18n } from '/@/hooks/web/useI18n';

const { t } = useI18n();

export const STATUS_OPTIONS = [
  { id: 0, fullName: t('dict.Flow.BillStatus.0'), theme: 'gray', rowKey: 'statusDesc' },
  { id: 1, fullName: t('dict.Flow.BillStatus.1'), theme: 'gray', rowKey: 'statusDesc' },
  { id: 2, fullName: t('dict.Flow.BillStatus.2'), theme: 'blue', rowKey: 'statusDesc' },
  { id: 3, fullName: t('dict.Flow.BillStatus.3'), theme: 'green', rowKey: 'statusDesc' },
  { id: 4, fullName: t('dict.Flow.BillStatus.4'), theme: 'yellow', rowKey: 'statusDesc' },
  { id: 5, fullName: t('dict.Flow.BillStatus.5'), theme: 'yellow', rowKey: 'statusDesc' },
  { id: 6, fullName: t('dict.Flow.BillStatus.6'), theme: 'red', rowKey: 'statusDesc' },
  { id: 7, fullName: t('common.todoText'), theme: 'gray', rowKey: 'statusDesc' },
];

export const DRAWING_STATUS_OPTIONS = [
  { id: 0, fullName: t('dict.DrawingsReview.Status.0'), theme: 'gray', rowKey: 'statusDesc' },
  { id: 1, fullName: t('dict.DrawingsReview.Status.1'), theme: 'gray', rowKey: 'statusDesc' },
  { id: 2, fullName: t('dict.DrawingsReview.Status.2'), theme: 'blue', rowKey: 'statusDesc' },
  { id: 3, fullName: t('dict.DrawingsReview.Status.3'), theme: 'green', rowKey: 'statusDesc' },
  { id: 4, fullName: t('dict.DrawingsReview.Status.4'), theme: 'yellow', rowKey: 'statusDesc' },
  { id: 5, fullName: t('dict.DrawingsReview.Status.5'), theme: 'yellow', rowKey: 'statusDesc' },
  { id: 6, fullName: t('dict.DrawingsReview.Status.6'), theme: 'red', rowKey: 'statusDesc' },
];

export const AGREE_OPTIONS = [
  { id: 0, theme: 'gray', fullName: t('dict.Flow.NodeStatus.1'), rowKey: 'statusDesc' },
  { id: 1, fullName: t('common.agree'), theme: 'green', rowKey: 'statusDesc' },
  { id: 2, fullName: t('common.disagree'), theme: 'red', rowKey: 'statusDesc' },
  { id: 3, fullName: t('dict.Flow.BillStatus.3'), theme: 'green', rowKey: 'statusDesc' },
  { id: 4, fullName: t('dict.Flow.NodeAction.2'), theme: 'yellow', rowKey: 'statusDesc' },
];

export const ENABLE_OPTIONS = [
  // { id: 0, theme: 'gray', fullName: t('dict.Flow.NodeStatus.1'), rowKey: 'statusDesc' },
  { id: 1, fullName: t('dict.FileInfoStatus.1'), theme: 'green', rowKey: 'statusDesc' },
  { id: 2, fullName: t('dict.FileInfoStatus.2'), theme: 'red', rowKey: 'statusDesc' },
];
