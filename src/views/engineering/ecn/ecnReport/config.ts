import type { VxeGridPropTypes } from 'vxe-table';

import { useI18n } from '/@/hooks/web/useI18n';
import { STATUS_OPTIONS } from '/@/utils/status/index';
import { isNullOrUnDef } from '/@/utils/is';
import { set } from 'lodash-es';

const { t } = useI18n();

export function waitGetColumns(): VxeGridPropTypes.Columns {
  return [
    {
      title: t('common.baseinfo'),
      field: 'baseinfo',
      align: 'center',
      children: [
        {
          title: '工厂',
          field: 'factoryName',
          width: 140,
        },
        {
          title: '产品内部料号',
          filters: [{ data: '' }],
          filterRender: {
            name: 'Input',
          },
          field: 'insidePartNumber',
          width: 180,
        },
        {
          title: 'ECR单号',
          field: 'ecrNumber',
          width: 120,
        },
        {
          title: 'ECN单号',
          field: 'ecnNumber',
          width: 120,
        },
        {
          title: '变更来源',
          field: 'changeSource',
          width: 170,
        },
        {
          title: '变更原因',
          field: 'changeReason',
          width: 170,
        },
        {
          title: '变更等级',
          field: 'changeLevel',
          width: 100,
        },
        {
          title: '资料类型',
          field: 'documentType',
          width: 100,
        },
        {
          title: '变更后版本',
          field: 'version',
          formatter: ({ cellValue, column, row }) => {
            const { field } = column;
            column.copyDataRow = field;
            let value;
            if (isNullOrUnDef(cellValue)) {
              value = '/';
            } else {
              value = `T${cellValue}`;
            }
            set(row, `copyData.${column.field}`, value);
            return value;
          },
          width: 120,
        },
        {
          title: 'PD',
          field: 'pdName',
          width: 100,
        },
        {
          title: '申请人',
          field: 'applyUserName',
          width: 100,
        },
        {
          title: '申请时间',
          field: 'applyDate',
          cellRender: {
            name: 'Date',
            format: 'YYYY-MM-DD HH:mm',
          },
          width: 100,
        },
      ],
    },
    {
      title: 'ECR申请',
      field: 'ecrApply',
      align: 'center',
      children: [
        {
          title: '状态',
          field: 'ECRApplyNode.status',
          width: 120,
          cellRender: {
            name: 'Tag',
            options: STATUS_OPTIONS,
          },
        },
        {
          title: '处理时间',
          cellRender: {
            name: 'Date',
            format: 'YYYY-MM-DD HH:mm:ss',
          },
          field: 'ECRApplyNode.endTime',
          width: 160,
        },
        {
          title: '处理时长',
          field: 'ECRApplyNode.duration',
          width: 160,
        },
        {
          title: '处理人',
          field: 'ECRApplyNode.handlerName',
          width: 180,
        },
        {
          title: '详情',
          field: 'ECRApplyNode',
          width: 80,
          slots: { default: 'ECRApplyNode' },
        },
      ],
    },
    {
      title: 'ECR审核',
      field: 'ecrReview',
      align: 'center',
      children: [
        {
          title: '状态',
          field: 'ECREngineeringReview.status',
          width: 120,
          cellRender: {
            name: 'Tag',
            options: STATUS_OPTIONS,
          },
        },
        {
          title: '处理时间',
          cellRender: {
            name: 'Date',
            format: 'YYYY-MM-DD HH:mm:ss',
          },
          field: 'ECREngineeringReview.endTime',
          width: 160,
        },
        {
          title: '处理时长',
          field: 'ECREngineeringReview.duration',
          width: 160,
        },
        {
          title: '处理人',
          field: 'ECREngineeringReview.handlerName',
          width: 180,
        },
        {
          title: '详情',
          field: 'ECREngineeringReview',
          width: 80,
          slots: { default: 'ECREngineeringReview' },
        },
      ],
    },
    {
      title: 'ECN申请',
      field: 'ecnApply',
      align: 'center',
      children: [
        {
          title: '状态',
          field: 'ApplyNode.status',
          width: 120,
          cellRender: {
            name: 'Tag',
            options: STATUS_OPTIONS,
          },
        },
        {
          title: '处理时间',
          cellRender: {
            name: 'Date',
            format: 'YYYY-MM-DD HH:mm:ss',
          },
          field: 'ApplyNode.endTime',
          width: 160,
        },
        {
          title: '处理时长',
          field: 'ApplyNode.duration',
          width: 160,
        },
        {
          title: '处理人',
          field: 'ApplyNode.handlerName',
          width: 180,
        },
        {
          title: '详情',
          field: 'ApplyNode',
          width: 80,
          slots: { default: 'ApplyNode' },
        },
      ],
    },
    {
      title: 'ECN审核',
      field: 'ecnReview',
      align: 'center',
      children: [
        {
          title: '状态',
          field: 'Leader.status',
          width: 120,
          cellRender: {
            name: 'Tag',
            options: STATUS_OPTIONS,
          },
        },
        {
          title: '处理时间',
          cellRender: {
            name: 'Date',
            format: 'YYYY-MM-DD HH:mm:ss',
          },
          field: 'Leader.endTime',
          width: 160,
        },
        {
          title: '处理时长',
          field: 'Leader.duration',
          width: 160,
        },
        {
          title: '处理人',
          field: 'Leader.handlerName',
          width: 180,
        },
        {
          title: '详情',
          field: 'Leader',
          width: 80,
          slots: { default: 'Leader' },
        },
      ],
    },
    {
      title: '物料统计',
      field: 'materialCount',
      align: 'center',
      children: [
        {
          title: '状态',
          field: 'PMC.status',
          width: 120,
          cellRender: {
            name: 'Tag',
            options: STATUS_OPTIONS,
          },
        },
        {
          title: '处理时间',
          cellRender: {
            name: 'Date',
            format: 'YYYY-MM-DD HH:mm:ss',
          },
          field: 'PMC.endTime',
          width: 160,
        },
        {
          title: '处理时长',
          field: 'PMC.duration',
          width: 160,
        },
        {
          title: '处理人',
          field: 'PMC.handlerName',
          width: 180,
        },
        {
          title: '详情',
          field: 'PMC',
          width: 80,
          slots: { default: 'PMC' },
        },
      ],
    },
    {
      title: '物料处理',
      field: 'materialHandle',
      align: 'center',
      children: [
        {
          title: '状态',
          field: 'MaterialHandle.status',
          width: 120,
          cellRender: {
            name: 'Tag',
            options: STATUS_OPTIONS,
          },
        },
        {
          title: '处理时间',
          cellRender: {
            name: 'Date',
            format: 'YYYY-MM-DD HH:mm:ss',
          },
          field: 'MaterialHandle.endTime',
          width: 160,
        },
        {
          title: '处理时长',
          field: 'MaterialHandle.duration',
          width: 160,
        },
        {
          title: '处理人',
          field: 'MaterialHandle.handlerName',
          width: 180,
        },
        {
          title: '详情',
          field: 'MaterialHandle',
          width: 80,
          slots: { default: 'MaterialHandle' },
        },
      ],
    },
    {
      title: '部门会签',
      field: 'countersign',
      align: 'center',
      children: [
        {
          title: '状态',
          field: 'Countersign.status',
          width: 120,
          cellRender: {
            name: 'Tag',
            options: STATUS_OPTIONS,
          },
        },
        {
          title: '处理时间',
          cellRender: {
            name: 'Date',
            format: 'YYYY-MM-DD HH:mm:ss',
          },
          field: 'Countersign.endTime',
          width: 160,
        },
        {
          title: '处理时长',
          field: 'Countersign.duration',
          width: 160,
        },
        {
          title: '处理人',
          field: 'Countersign.handlerName',
          width: 180,
        },
        {
          title: '详情',
          field: 'Countersign',
          width: 80,
          slots: { default: 'Countersign' },
        },
      ],
    },
    {
      title: '最终变更意见',
      field: 'finalHandle',
      align: 'center',
      children: [
        {
          title: '状态',
          field: 'FinalHandle.status',
          width: 120,
          cellRender: {
            name: 'Tag',
            options: STATUS_OPTIONS,
          },
        },
        {
          title: '处理时间',
          cellRender: {
            name: 'Date',
            format: 'YYYY-MM-DD HH:mm:ss',
          },
          field: 'FinalHandle.endTime',
          width: 160,
        },
        {
          title: '处理时长',
          field: 'FinalHandle.duration',
          width: 160,
        },
        {
          title: '处理人',
          field: 'FinalHandle.handlerName',
          width: 180,
        },
        {
          title: '详情',
          field: 'FinalHandle',
          width: 80,
          slots: { default: 'FinalHandle' },
        },
      ],
    },
    {
      title: '工程经理审核',
      field: 'manager',
      align: 'center',
      children: [
        {
          title: '状态',
          field: 'Manager.status',
          width: 120,
          cellRender: {
            name: 'Tag',
            options: STATUS_OPTIONS,
          },
        },
        {
          title: '处理时间',
          cellRender: {
            name: 'Date',
            format: 'YYYY-MM-DD HH:mm:ss',
          },
          field: 'Manager.endTime',
          width: 160,
        },
        {
          title: '处理时长',
          field: 'Manager.duration',
          width: 160,
        },
        {
          title: '处理人',
          field: 'Manager.handlerName',
          width: 180,
        },
        {
          title: '详情',
          field: 'Manager',
          width: 80,
          slots: { default: 'Manager' },
        },
      ],
    },
    {
      title: '品质经理审核',
      field: 'qAManager',
      align: 'center',
      children: [
        {
          title: '状态',
          field: 'QAManager.status',
          width: 120,
          cellRender: {
            name: 'Tag',
            options: STATUS_OPTIONS,
          },
        },
        {
          title: '处理时间',
          cellRender: {
            name: 'Date',
            format: 'YYYY-MM-DD HH:mm:ss',
          },
          field: 'QAManager.endTime',
          width: 160,
        },
        {
          title: '处理时长',
          field: 'QAManager.duration',
          width: 160,
        },
        {
          title: '处理人',
          field: 'QAManager.handlerName',
          width: 180,
        },
        {
          title: '详情',
          field: 'QAManager',
          width: 80,
          slots: { default: 'QAManager' },
        },
      ],
    },
    {
      title: '运营经理审核',
      field: 'operationManager',
      align: 'center',
      children: [
        {
          title: '状态',
          field: 'OperationManager.status',
          width: 120,
          cellRender: {
            name: 'Tag',
            options: STATUS_OPTIONS,
          },
        },
        {
          title: '处理时间',
          cellRender: {
            name: 'Date',
            format: 'YYYY-MM-DD HH:mm:ss',
          },
          field: 'OperationManager.endTime',
          width: 160,
        },
        {
          title: '处理时长',
          field: 'OperationManager.duration',
          width: 160,
        },
        {
          title: '处理人',
          field: 'OperationManager.handlerName',
          width: 180,
        },
        {
          title: '详情',
          field: 'OperationManager',
          width: 80,
          slots: { default: 'OperationManager' },
        },
      ],
    },
    {
      title: '确认执行',
      field: 'executeConfirm',
      align: 'center',
      children: [
        {
          title: '状态',
          field: 'ExecuteConfirm.status',
          width: 120,
          cellRender: {
            name: 'Tag',
            options: STATUS_OPTIONS,
          },
        },
        {
          title: '处理时间',
          cellRender: {
            name: 'Date',
            format: 'YYYY-MM-DD HH:mm:ss',
          },
          field: 'ExecuteConfirm.endTime',
          width: 160,
        },
        {
          title: '处理时长',
          field: 'ExecuteConfirm.duration',
          width: 160,
        },
        {
          title: '处理人',
          field: 'ExecuteConfirm.handlerName',
          width: 180,
        },
        {
          title: '详情',
          field: 'ExecuteConfirm',
          width: 80,
          slots: { default: 'ExecuteConfirm' },
        },
      ],
    },
  ];
}

export function getFormConfig(): any {
  return {
    collapsed: true,
    showCollapseButton: false,
    // 是否在字段值改变时提交表单
    submitOnChange: false,
    // 按下回车时是否提交表单
    submitOnEnter: true,
    // fieldMappingTime: [['date', ['start', 'end']]],
    commonConfig: {
      componentProps: {},
      labelClass: 'w-0',
    },
    wrapperClass: 'grid grid-cols-5 gap-4',
    schema: [
      {
        label: '',
        fieldName: 'ecnNumber',
        component: 'Input',
        componentProps: {
          placeholder: 'ECN单号',
          i18nField: 'applyCode',
        },
      },
      {
        label: '',
        fieldName: 'pd',
        component: 'Input',
        componentProps: {
          placeholder: 'PD',
        },
      },
      {
        label: '',
        fieldName: 'applyUserName',
        component: 'Input',
        componentProps: {
          placeholder: t('dict.QuotationRequirementsColumn.ApplyUserName'),
        },
      },
      // {
      //   label: '',
      //   fieldName: 'status',
      //   component: 'ApiSelect',
      //   componentProps: {
      //     placeholder: '状态',
      //     api: () => baseStore.getDictionaryData('Flow.BillStatus'),
      //     labelField: 'fullName',
      //     valueField: 'enCode',
      //   },
      // },
    ],
    i18nConfig: {
      moduleCode: 'ECNColumn',
      transferRange: ['placeholder'],
    },
  };
}
