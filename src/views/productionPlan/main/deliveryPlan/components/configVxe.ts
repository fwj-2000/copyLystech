import { STATUS_OPTIONS } from '/@/components/CustomComponents/src/quality/Constant';
import dayjs from 'dayjs';
import { useI18n } from '/@/hooks/web/useI18n';

const { t } = useI18n();

// 导出一个函数，用于获取表格的列
export function getColumns() {
  return [
    {
      title: '产品内部料号',
      field: 'innerMaterialNumber',
      width: 220,
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
      title: '需求数量(PCS)',
      field: 'peakQty',
      width: 130,
    },
    {
      title: '预估材料交期',
      field: 'estimatedMaterialsTime',
      i18nField: 'estimatedMaterialsDateTime',
      width: 130,
      cellRender: {
        name: 'Date',
        format: 'YYYY-MM-DD',
      },
    },
    {
      title: '备注(材料交期)',
      field: 'mcRemark',
      width: 130,
    },
  ];
}

// 设置表格动态表头相关信息
export function setDynamicTitle(
  sourceList,
  ops?: {
    editable?: boolean;
    planType: '1' | '2';
    dynamicPrefix: string;
  },
) {
  const dynamicKeys = {}; // 配置字段
  let _list: any = [];
  if (ops?.planType == '1') {
    // 模切列
    _list = [
      // {
      //   type: 'expand',
      //   field: 'expand',
      //   width: 60,
      //   slots: {
      //     content: 'expand',
      //   },
      // },
      ...getColumns(),
      // 下一节点处理人(主计划)
      {
        title: '下一节点处理人(主计划)',
        field: 'mainPlanUserId',
        i18nField: 'CommonCol.nextHandler',
        i18nParams: [t('common.MC')],
        width: 190,
        editRender: {
          name: 'CustomUserSelect',
          cacheField: 'mainPlanUserName',
        },
      },
      {
        title: '交付计划',
        field: 'diecuttingPlanRemark',
        width: 220,
        editRender: {
          name: 'Input',
        },
      },
      {
        title: '备注',
        field: 'remark',
        i18nField: 'CommonCol.remark',
        width: 220,
        editRender: {
          name: 'Input',
        },
      },
    ];
    // _list = _list.filter(item => item.field !== 'mcRemark');
    // _list.map(item => {
    //   if (item.field === 'mcRemark') {
    //     item.field = 'diecuttingRemark';
    //     item.title = '备注';
    //     item.editRender = {
    //       name: 'Input',
    //     }
    //   }
    // });
  } else {
    // 交货列
    _list = (sourceList || []).map(item => {
      const _time = dayjs(item.deliveryPlanTime).tz().format('YYYY/MM/DD');
      dynamicKeys[ops?.dynamicPrefix + _time] = '';
      const _item: any = {
        title: _time,
        field: ops?.dynamicPrefix + _time,
        width: 180,
        i18nField: 'DISABLED',
        editRender: {
          name: 'InputNumber',
          props: {
            allowClear: true,
            min: 0,
            onChange: (v, d, p) => {
              console.log(v, d, p);
            },
          },
        },
      };
      return _item;
    });
    _list = [
      // {
      //   type: 'expand',
      //   field: 'expand',
      //   width: 60,
      //   slots: {
      //     content: 'expand',
      //   },
      // },
      {
        title: '状态',
        field: 'status',
        i18nField: 'CommonCol.status',
        width: 150,
        cellRender: {
          name: 'Tag',
          options: STATUS_OPTIONS,
        },
      },
      {
        title: '销售意见',
        field: 'handleOpinion',
        i18nField: 'CommonCol.handleOpinion',
        width: 160,
      },
      ...getColumns(),
      // 下一节点处理人(商务)
      {
        title: '下一节点处理人(商务)',
        field: 'applyUserName',
        i18nField: 'CommonCol.nextHandler',
        i18nParams: [t('common.business')],
        width: 190,
      },
      {
        title: '交付合计(PCS)',
        field: 'deliveryPlanQty',
        width: 180,
      },
      {
        title: '交付计划',
        field: 'deliveryPlan',
        i18nField: 'diecuttingPlanRemark',
        width: 180,
        editRender: {
          name: 'Input',
        },
      },
      {
        title: '备注(模切计划)', // 模切计划的备注remark转过来的
        field: 'diecuttingRemark',
        i18nField: 'dcRemark',
        // editRender: {
        //   name: 'Input',
        // },
        width: 180,
      },
      ..._list,
      {
        title: '备注',
        field: 'deliveryPlanRemark',
        i18nField: 'CommonCol.remark',
        editRender: {
          name: 'Input',
        },
        width: 180,
      },
    ];
  }

  return {
    dynamicKeys,
    column: _list,
  };
}
