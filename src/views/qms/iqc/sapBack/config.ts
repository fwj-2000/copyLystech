import type { VxeGridPropTypes } from '/@/components/VxeTable';
import { useI18n } from '/@/hooks/web/useI18n';
import { FormSchema } from '/@/components/Form';
import { iQCAuditResultOptions } from '../iqcInputReview/config';

const { t } = useI18n();

export const columns: VxeGridPropTypes.Columns = [
  {
    field: 'checkbox',
    type: 'checkbox',
    sortable: true,
    width: '50',
    align: 'center',
  },
  {
    field: 'seq',
    title: t('component.table.index'),
    sortable: true,
    type: 'seq',
    width: '50',
    align: 'center',
  },
  {
    title: 'IQC单号',
    field: 'testNo',
    // formatter: ({ cellValue }) => {
    sortable: true,
    //   const fullName = mainProcessList.find(item => item.enCode === cellValue).fullName;
    //   return fullName;
    // },
  },
  {
    title: 'lot No.',
    field: 'lotNo',
    sortable: true,
  },
  {
    title: '内部物料编码',
    field: 'innerMaterialCode',
    sortable: true,
    filters: [
      {
        data: '',
      },
    ],
    filterRender: {
      name: 'Input',
      props: {
        // options: executionResultOptions,
      },
    },
  },
  {
    title: '审核人',
    field: 'auditUserName',
    sortable: true,
  },
  {
    title: '检验结果',
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
    title: '审核时间',
    field: 'auditTime',
    sortable: true,
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD HH:mm:ss',
    },
  },
  {
    title: t('common.action'),
    field: 'action',
    fixed: 'right',
    width: '80',
    slots: {
      default: 'action',
    },
  },
];

export const schemas: FormSchema[] = [
  {
    field: 'testNo',
    label: '',
    // label: 'IQC单号',
    component: 'Input',
    componentProps: {
      placeholder: 'IQC',
      allowClear: true,
    },
  },
  {
    field: 'lotNo',
    label: '',
    // label: 'lotNo',
    component: 'Input',
    componentProps: {
      allowClear: true,
    },
  },
];
