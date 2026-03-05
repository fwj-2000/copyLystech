import { useI18n } from '/@/hooks/web/useI18n';
import type { VxeGridPropTypes } from '/@/components/VxeTable';
import { h } from 'vue';

const { t } = useI18n();

export const STATUS_OPTIONS = [
  { id: 'OK', fullName: 'OK', theme: 'green' }, // ok
  { id: 'NG', fullName: 'NG', theme: 'red' }, // ng
];

export const COLUMN_TEMPLATE = {
  badName: '',
  ngNumber: 0,
  remark: '',
  testResult: 'OK',
  lastTestResult: '',
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

export function getColumn(canEdit): VxeGridPropTypes.Columns {
  return [
    // {
    //   type: 'checkbox',
    //   field: 'checkbox',
    // },
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
      editRender: {
        //   enabled: canEdit,
        //   name: 'Input',
        //   props: {
        //     placeholder: '',
        //     disabled: false,
        //   },
      },
      slots: { edit: 'edit_badName', default: 'default_badName' },
      width: 260,
    },
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
    {
      title: '备注',
      field: 'remark',
      // width: 120,
      editRender: {
        name: 'Input',
        props: {
          placeholder: '',
        },
      },
    },
    {
      title: '检测结果',
      field: 'testResult',
      sortable: true,
      // width: 120,
      cellRender: {
        name: 'Tag',
        options: STATUS_OPTIONS,
      },
    },
    {
      title: '最终检测结果',
      field: 'lastTestResult',
      sortable: true,
      // width: 150,
      cellRender: {
        name: 'Tag',
        options: STATUS_OPTIONS,
      },
      slots: {
        // default: data => {
        //   const testResultList: any = [];
        //   if (!data?.data) return '';
        //   data.data.forEach(item => {
        //     testResultList.push(item.testResult);
        //   });
        //   if (testResultList.includes('NG')) {
        //     return h('div', { class: 'ng-class' }, 'NG');
        //   } else {
        //     return h('div', { class: 'ok-class' }, 'OK');
        //   }
        // },
        default: ({ row }) => {
          if (!row?.data?.length) return '';
          const hasNG = row.data.some(item => item.testResult === 'NG');
          const className = hasNG ? 'ng-class' : 'ok-class';
          const text = hasNG ? 'NG' : 'OK';
          return h('div', { class: className }, text);
        },
      },
    },
    // 操作行
    {
      title: t('common.action'),
      width: 60,
      field: 'action',
      fixed: 'right',
      slots: {
        default: 'action',
      },
    },
  ];
}
