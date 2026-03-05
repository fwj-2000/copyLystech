import { VxeGridPropTypes } from 'vxe-pc-ui/types/components/grid';
import { useI18n } from '/@/hooks/web/useI18n';

const { t } = useI18n();

// popup 基本属性配置
export const attrs = {
  class: 'full-popup',
  title: t('routes.customerService-information-fcDataAudit'),
  showCancelBtn: false,
  extra: {
    show: true,
  },
};

// vxe表格表头配置
export const columns: DeepPartial<VxeGridPropTypes.Columns<any>> = [
  { type: 'seq', field: 'seq', width: 70 },
  {
    title: '客户代码',
    minWidth: 100,
    field: 'FIELD2',
    slots: { default: 'Version' },
  },
  {
    title: '工厂',
    minWidth: 100,
    field: 'FIELD3',
  },
  {
    title: '客服',
    minWidth: 100,
    field: 'FIELD4',
  },
  {
    title: '内部项目',
    field: 'FIELD5',
    minWidth: 120,
  },
  {
    title: '项目阶段',
    minWidth: 120,
    field: 'FIELD6',
  },
  {
    title: '内部编号',
    minWidth: 160,
    field: 'FIELD7',
  },
  {
    title: '中间料号',
    minWidth: 160,
    field: 'FIELD8',
  },
  {
    title: '产地',
    minWidth: 100,
    field: 'FIELD9',
  },
  {
    title: '用量',
    minWidth: 80,
    field: 'FIELD10',
  },
  {
    title: 'VIM/JIT',
    minWidth: 100,
    field: 'FIELD11',
  },
  {
    title: '交易币种',
    minWidth: 100,
    field: 'FIELD12',
  },
  {
    title: '产品类别',
    minWidth: 100,
    field: 'FIELD13',
  },
];
