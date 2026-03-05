import type { VxeGridPropTypes } from '/@/components/VxeTable';
import { useI18n } from '/@/hooks/web/useI18n';

const { t } = useI18n();

/**
 * 列表配置
 */
export const columns: VxeGridPropTypes.Columns = [
  {
    field: 'seq',
    title: '序号',
    type: 'seq',
    width: '50',
    align: 'center',
  },
  // 档案分组
  {
    title: '档案分组',
    field: 'archiveGroup',
    showOverflow: 'tooltip',
    minWidth: '160',
  },
  // 厂区
  {
    title: '厂区',
    field: 'factory',
    showOverflow: 'tooltip',
    minWidth: '160',
  },
  // 部门
  {
    title: '部门',
    field: 'department',
    showOverflow: 'tooltip',
    minWidth: '160',
  },
  // 直/间接分类
  {
    title: '直/间接分类',
    field: 'directClassify',
    showOverflow: 'tooltip',
    minWidth: '160',
  },
  // 岗位名称
  {
    title: '岗位名称',
    field: 'postName',
    showOverflow: 'tooltip',
    minWidth: '220',
  },
  // 工作性质
  {
    title: '工作性质',
    field: 'natureEmployment',
    showOverflow: 'tooltip',
    minWidth: '160',
  },
  // 年月份
  {
    title: '年月份',
    field: 'yearMonthStr',
    showOverflow: 'tooltip',
    minWidth: '220',
  },
  // 人数
  {
    title: '人数',
    field: 'peopleNumber',
    showOverflow: 'tooltip',
    minWidth: '160',
  },
  // 操作
  {
    title: t('common.action'),
    field: 'action',
    slots: { default: 'action' },
    width: 80,
    fixed: 'right',
  },
];
