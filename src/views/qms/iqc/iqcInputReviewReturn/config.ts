import type { VxeGridPropTypes } from '/@/components/VxeTable';
import { useI18n } from '/@/hooks/web/useI18n';
import { FormSchema } from '/@/components/Form';
import { iQCAuditResultOptions } from '../iqcInputReview/config';

const { t } = useI18n();

export const columns: VxeGridPropTypes.Columns = [
  // {
  //   field: 'checkbox',
  //   type: 'checkbox',
  //   width: '50',
  //   align: 'center',
  // },
  // sortable: true,
  {
    field: 'seq',
    title: t('component.table.index'),
    type: 'seq',
    width: '50',
    align: 'center',
    sortable: true,
  },
  {
    title: 'IQC单号',
    field: 'testNo',
    sortable: true,
  },
  {
    title: '原单审核结果',
    field: 'auditResult',
    cellRender: {
      name: 'Tag',
      options: iQCAuditResultOptions,
    },
    filterMultiple: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'ASelect',
      props: {
        options: iQCAuditResultOptions,
      },
    },
    sortable: true,
  },
  {
    title: '原单审核人',
    field: 'auditUserName',
  },
  {
    title: '原单审核时间',
    field: 'antiAuditTime',
    sortable: true,
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD HH:mm:ss',
    },
  },
  {
    title: '反审原因',
    field: 'antiAuditDescription',
  },
  {
    title: '反审人',
    field: 'antiAuditUserName',
    sortable: true,
  },
  {
    title: '反审时间',
    field: 'antiAuditTime',
    sortable: true,
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD HH:mm:ss',
    },
  },
  {
    title: t('common.action'),
    field: 'action',
    sortable: true,
    width: '60',
    fixed: 'right',
    slots: {
      default: 'action',
    },
  },
];

export const schemas: FormSchema[] = [
  {
    field: 'startTime',
    label: '',
    i18nField: 'CommonCol.startTime',
    component: 'DatePicker',
    componentProps: {
      placeholder: '请选择开始时间',
      sortable: true,
      allowClear: true,
    },
  },
  {
    field: 'endTime',
    label: '',
    i18nField: 'CommonCol.endTime',
    component: 'DatePicker',
    componentProps: {
      placeholder: '请选择结束时间',
      sortable: true,
      allowClear: true,
    },
  },
];
