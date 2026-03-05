import { useI18n } from '/@/hooks/web/useI18n';
import type { VxeGridPropTypes } from '/@/components/VxeTable';

const { t } = useI18n();

export const STATUS_OPTIONS = [
  { id: 'OK', fullName: 'OK', theme: 'green' }, // ok
  { id: 'NG', fullName: 'NG', theme: 'red' }, // ng
];

export const HASREPORT_STATUS_OPTIONS = [
  { id: 0, fullName: '否', theme: 'red' }, // ng
  { id: 1, fullName: '是', theme: 'green' }, // ok
];

export const COLUMN_TEMPLATE = {
  badCode: '',
  badName: '',
  ngNumber: 0,
  samplingNumber: 0,
  haveReport: 0,
  reportName: '',
  reportPath: '',
  testResult: 'OK',
  remark: '',
};

export function getFormConfig() {
  return [
    {
      fieldName: 'innerMaterialNumber',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: '材料内部料号',
        allowClear: true,
      },
      width: 100,
    },
    {
      fieldName: 'innerExternalNumber',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: '原厂商型号',
        allowClear: true,
      },
    },
    {
      fieldName: 'confirmStatus',
      label: '',
      component: 'Select',
      i18nField: 'CommonCol.status',
      componentProps: {
        placeholder: '状态',
        // options: statusOptions,
        allowClear: true,
      },
    },
    {
      fieldName: 'purchaseUserName',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: '采购',
        allowClear: true,
      },
    },
  ];
}

export function getColumn(): VxeGridPropTypes.Columns {
  return [
    {
      field: 'seq',
      title: t('component.table.index'),
      type: 'seq',
      width: 50,
      align: 'center',
    },
    {
      title: '检测项目',
      field: 'badName',
      sortable: true,
      // slots: { edit: 'edit_checkItem', default: 'default_checkItem' },
    },
    // 抽样数
    {
      title: '抽样数',
      field: 'samplingNumber',
      width: 120,
      editRender: {
        name: 'InputNumber',
      },
    },
    // NG数
    {
      title: 'NG数',
      field: 'ngNumber',
      width: 120,
      editRender: {
        name: 'InputNumber',
        props: {
          placeholder: '',
          rowParams: {
            testResult: 'testResult',
          },

          onChange: (e, params) => {
            const {
              $grid: { setRow },
              row,
            } = params;
            if (e) {
              row.testResult = 'NG';
            } else {
              row.testResult = 'OK';
            }
            // const item = handleInnerPartNumberItem(data);
            setRow(row);
            // nextTick(() => {
            //   row.factory = item.factory;
            // });
          },
        },
      },
    },
    // 是否有报告
    {
      title: '是否有报告',
      field: 'haveReport',
      sortable: true,
      // width: 120,
      cellRender: {
        name: 'Tag',
        options: HASREPORT_STATUS_OPTIONS,
      },
    },
    {
      title: '检测结果',
      field: 'testResult',
      sortable: true,
      // width: 150,
      cellRender: {
        name: 'Tag',
        options: STATUS_OPTIONS,
      },
      // slots: {
      //   default: data => {
      //     const checkResultList: any = [];
      //     if (!data?.data) return '';
      //     data.data.forEach(item => {
      //       checkResultList.push(item.checkResult);
      //     });
      //     if (checkResultList.includes('NG')) {
      //       return h('div', { class: 'ng-class' }, 'NG');
      //     } else {
      //       return h('div', { class: 'ok-class' }, 'OK');
      //     }
      //   },
      // },
    },
    // 附件
    {
      title: t('dict.CommonCol.reportName'),
      field: 'reportPath',
      sortable: true,
      width: 300,
      slots: {
        default: 'file',
      },
    },
    // 操作行
    {
      title: t('common.action'),
      width: 120,
      field: 'action',
      fixed: 'right',
      slots: {
        default: 'action',
      },
    },
  ];
}
