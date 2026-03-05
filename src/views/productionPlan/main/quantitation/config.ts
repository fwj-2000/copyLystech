import { STATUS_OPTIONS } from '/@/components/CustomComponents/src/quality/Constant';
import { useI18n } from '/@/hooks/web/useI18n';
import { useUserStore } from '/@/store/modules/user';

const { t } = useI18n();

export function getNodeRemarkValue(row: any, nodeKey: string) {
  const raw = row?.nodeRemark;
  if (!raw) return '';

  try {
    const arr = typeof raw === 'string' ? JSON.parse(raw) : raw;
    if (!Array.isArray(arr)) return '';

    const hit = arr.find((i: any) => i?.node === nodeKey);
    return hit?.remark || '';
  } catch (e) {
    return '';
  }
}

export function getUnReviewColumns() {
  return [
    {
      type: 'checkbox',
      field: 'checkbox',
    },
    {
      title: '单号',
      field: 'applyNo',
      width: 150,
    },
    { title: '需求类型', field: 'demandType', i18nField: 'CommonCol.demandType', width: 150 },
    {
      title: '产品内部料号',
      field: 'innerMaterialNumber',
      width: 200,
    },
    {
      title: '终端项目代码',
      field: 'terminalCustomerProjectCode',
      width: 160,
    },
    {
      title: '特殊备注',
      field: 'engineeringRemarks',
      width: 200,
      showOverflow: 'ellipsis',
      slots: {
        default: 'engineeringRemarks',
      },
    },
    {
      title: '量试订单评审',
      field: 'pdReview',
      slots: {
        default: 'pdReview',
      },
      width: 120,
    },
    {
      title: '状态',
      field: 'status',
      i18nField: 'CommonCol.status',
      width: 100,
      cellRender: {
        name: 'Tag',
        options: STATUS_OPTIONS,
      },
    },
    {
      title: '当前节点',
      field: 'currentNodeName',
      i18nField: 'CommonCol.currentNode',
      width: 160,
    },
    {
      title: '当前处理人',
      field: 'currentProcessor',
      i18nField: 'CommonCol.currentNodeUser',
      width: 220,
    },
    {
      title: '节点记录',
      field: 'nodeDetail',
      i18nField: 'CommonCol.nodeDetail',
      width: 120,
      slots: {
        default: 'nodeDetail',
      },
    },
    {
      title: '生产类型',
      field: 'productionTypeDesc',
      width: 120,
    },
    // {
    //   title: '交期时间',
    //   field: 'requirementProduction',
    //   i18nField: 'deliveryDateTime',
    //   width: 120,
    //   cellRender: {
    //     name: 'Date',
    //     format: 'YYYY-MM-DD',
    //   },
    // },
    {
      title: '直接客户简称',
      field: 'immediateCustomerName',
      width: 120,
    },
    // {
    //   title: '客户要求',
    //   field: 'customerRequestDesc',
    //   width: 120,
    // },
    {
      title: '直接客户料号',
      field: 'immediateCustomerPartNumber',
      width: 160,
    },
    {
      title: '终端客户料号',
      field: 'terminalCustomerPartNumber',
      width: 160,
    },
    {
      title: '终端项目阶段',
      field: 'projectPhase',
      width: 160,
    },
    {
      title: '需求数量(PCS)',
      field: 'peakQty',
      width: 180,
    },
    {
      title: '客户要求交期',
      field: 'customerDeliveryTime',
      i18nField: 'customerDeliveryDateTime',
      width: 120,
      cellRender: {
        name: 'Date',
        format: 'YYYY-MM-DD',
      },
    },
    {
      title: 'PD',
      field: 'pdName',
      width: 180,
    },
    {
      title: '工厂',
      field: 'factory',
      width: 180,
    },
    {
      title: '需求备注',
      field: 'pmDesc',
      width: 180,
      showOverflow: 'ellipsis',
      formatter: ({ row }) => getNodeRemarkValue(row, 'PDTLeaderReview'),
    },
    {
      title: '申请人',
      field: 'applyUserName',
      i18nField: 'CommonCol.applyUser',
      width: 220,
    },
    {
      title: '申请时间',
      field: 'applyDate',
      i18nField: 'CommonCol.applyTime',
      width: 200,
      cellRender: {
        name: 'Date',
      },
    },
    // 操作行
    {
      title: t('common.action'),
      width: '60',
      field: 'action',
      fixed: 'right',
      slots: {
        default: 'action',
      },
    },
  ];
}

export function getUnReviewFormConfig(todo: boolean) {
  return {
    collapsed: true,
    showCollapseButton: true,
    submitOnChange: false,
    submitOnEnter: true,
    commonConfig: {
      componentProps: {},
      labelClass: 'w-0',
    },
    wrapperClass: 'grid grid-cols-5 gap-4',
    i18nConfig: {
      moduleCode: 'EngineeringInformationColumn',
      transferRange: ['placeholder'],
    },
    schema: [
      {
        label: '',
        fieldName: 'applyNo',
        component: 'Input',
        componentProps: {
          placeholder: '单号',
          submitOnPressEnter: true,
        },
      },
      {
        label: '',
        fieldName: 'innerMaterialNumber',
        component: 'Input',
        componentProps: {
          placeholder: '产品内部料号',
          submitOnPressEnter: true,
        },
      },
      {
        label: '',
        fieldName: 'terminalCustomerPartNumber',
        component: 'Input',
        componentProps: {
          placeholder: '终端客户料号',
          submitOnPressEnter: true,
        },
      },
      {
        label: '',
        fieldName: 'currentProcessorId',
        i18nField: 'CommonCol.currentNodeUser',
        component: 'CustomUserSelect',
        componentProps: {
          defaultValue: todo ? useUserStore().getUserInfo.userId : undefined,
          placeholder: '当前处理人',
          submitOnPressEnter: true,
        },
      },
      {
        label: '',
        fieldName: 'terminalCustomerProjectCode',
        component: 'Input',
        componentProps: {
          placeholder: '终端项目代码',
          submitOnPressEnter: true,
        },
      },
      {
        label: '',
        fieldName: 'immediateCustomerName',
        component: 'Input',
        componentProps: {
          placeholder: '直接客户简称',
          submitOnPressEnter: true,
        },
      },
    ],
  };
}

export function getPackageColumns() {
  return [
    {
      title: '单号',
      field: 'applyNo',
      width: 180,
    },
    {
      title: '产品内部料号',
      field: 'innerMaterialNumber',
      editRow: false,
      width: 200,
    },
    {
      title: '特殊备注',
      field: 'engineeringRemarks',
      width: 200,
      showOverflow: 'ellipsis',
      slots: {
        default: 'engineeringRemarks',
      },
    },
    {
      title: '直接客户料号',
      field: 'immediateCustomerPartNumber',
      editRow: false,
      width: 130,
    },
    {
      title: '终端客户料号',
      field: 'terminalCustomerPartNumber',
      editRow: false,
      width: 130,
    },
    {
      title: '工厂',
      field: 'factory',
      editRow: false,
      width: 150,
    },
    {
      title: '客户要求交期',
      field: 'customerDeliveryTime',
      i18nField: 'customerDeliveryDateTime',
      editRow: false,
      width: 130,
      cellRender: {
        name: 'Date',
        format: 'YYYY-MM-DD',
      },
    },
    // {
    //   title: '库存',
    //   field: 'isHaveStockDesc',
    //   // editRow: false,
    //   width: 120,
    //   editRender: {
    //     name: 'InputNumber',
    //   },
    // },
    {
      title: '库存数量(PCS)',
      field: 'stockNum',
      editRender: {
        name: 'InputNumber',
        props: {
          min: 0,
        },
      },
      width: 180,
    },
    {
      title: '需求数量(PCS)',
      field: 'peakQty',
      editRow: false,
      editDynamicDisabled: false,
      width: 180,
    },
    {
      title: '排产数量(PCS)',
      field: 'demandQty',
      editRender: {
        name: 'InputNumber',
      },
      width: 140,
    },
    {
      title: '要求材料回厂时间',
      field: 'requirementRegression',
      editRender: {
        name: 'DatePicker',
        props: {
          valueFormat: 'YYYY-MM-DD',
          format: 'YYYY-MM-DD',
        },
      },
      width: 140,
    },
    {
      title: '要求排产时间',
      field: 'requirementProduction',
      editRender: {
        name: 'DatePicker',
        props: {
          valueFormat: 'YYYY-MM-DD',
          format: 'YYYY-MM-DD',
        },
      },
      width: 140,
    },
    {
      title: '下一节点处理人',
      field: 'mcPlanUserId',
      i18nField: 'CommonCol.nextHandler',
      titleSuffix: {
        message: '当【库存数量】<【需求数量】时，下一节点处理人为：物料计划\n' + '当【库存数量】≥【需求数量】时，下一节点处理人为：交货计划',
      },
      i18nParams: [t('dict.ProjectMembersTypeEnum.MCPerson')],
      width: 190,
      editRender: {
        name: 'CustomUserSelect',
        cacheField: 'mcPlanUserName',
      },
    },
    {
      title: '备注',
      field: 'remark',
      editRender: {
        name: 'Textarea',
        props: {
          minRows: 1,
          maxRows: 5,
        },
      },
      width: 140,
    },
    {
      title: '产品描述',
      field: 'productDesc',
      editRow: false,
      width: 200,
    },
  ];
}
