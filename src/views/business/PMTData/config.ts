import { useI18n } from '/@/hooks/web/useI18n';
import { COLUMN_TYPE_ENUM /** getStripeClassByFlowNode, getStripeClassByRowIndex */ } from './utils';
import { getFactoryList } from '/@/api/basicData/factory';
import { Tooltip } from 'ant-design-vue';
import { h } from 'vue';
import { get } from 'lodash-es';
import dayjs from 'dayjs';

const { t } = useI18n();

/** 表格列配置 */
export function getColumns() {
  return [
    // 工厂
    {
      field: 'FactoryName',
      title: t('dict.CommonCol.factory'),
      width: '80',
      className: 'bg-white',
    },
    // 终端客户
    {
      field: 'terminalCustomerName',
      title: t('dict.PMTData.TmlCus'),
      width: '80',
      className: 'bg-white',
    },
    // 项目代号(终端)
    {
      field: 'TmlCusPrjCode',
      title: t('dict.PMTData.TmlCusPrjCode'),
      width: '80',
      className: 'bg-white',
    },
    // 项目代号(内部)
    {
      field: 'PrjCode',
      title: t('dict.PMTData.PrjCode'),
      width: '80',
      className: 'bg-white',
    },
    // 阶段
    {
      field: 'customerProductStage',
      title: t('dict.PMTData.stage'),
      width: '80',
      className: 'bg-white',
    },
    // 产品线
    {
      field: 'productLineName',
      title: t('dict.CommonCol.productLine'),
      width: '100',
      className: 'bg-white',
    },
    // 流程节点
    {
      field: 'FlowNode',
      title: t('dict.PMTData.FlowNode'),
      width: '100',
      // className: (params: any) => getStripeClassByFlowNode(params),
    },
    // 指标
    {
      field: 'TitleList',
      title: t('dict.PMTData.quota'),
      columnType: COLUMN_TYPE_ENUM.KEYS_VALUES,
      align: 'center',
      getChilrenTitle: ({ key }) => {
        return key === 'Title1' ? t('dict.PMTData.quota') : 'Status';
      },
      getChildrenConfig: (_column: any, listItem: { keys: string; values: string }) => {
        return {
          width: listItem.keys === 'Title1' ? '100' : '130',
          slots: {
            default: ({ row, column }) => {
              // 获取指标路径
              const titleList = row.TitleList || [];
              const title: Array<string> = [row.FlowNode];
              if (column.field.startsWith('TitleList_')) {
                for (const titleItem of titleList) {
                  titleItem.values && title.push(titleItem.values);
                  if (`TitleList_${titleItem.keys}` === column.field) {
                    break;
                  }
                }
              }

              // 根据指标路径获取提示内容
              const tip = get(indexTipMap, title.join('.'));
              const cellRender = h('span', {}, row[column.field]);

              // 判断提示内容是否存在，以及是否为字符串
              return tip && typeof tip === 'string' ? h(Tooltip, { title: tip, class: 'cursor-help' }, () => cellRender) : cellRender;
            },
          },
          className: (/** { rowIndex } */) => {
            // return 'title-cell ' + getStripeClassByRowIndex(rowIndex);
            return 'title-cell ';
          },
        };
      },
    },
    // 数据列
    {
      field: 'List',
      title: t('dict.PMTData.List'),
      align: 'center',
      columnType: COLUMN_TYPE_ENUM.WEEKS,
      getSlots: () => {
        return {
          default: 'Link',
        };
      },
      getChilrenTitle: ({ key }) => (typeof key === 'string' ? key.slice(-4) : key),
      getChildrenConfig: () => ({ align: 'right', headerAlign: 'left', width: '80' /** className: ({ rowIndex }) => getStripeClassByRowIndex(rowIndex) */ }),
    },
    // 合计
    {
      field: 'Total',
      title: t('component.table.summary'),
      width: '80',
      align: 'right',
      headerAlign: 'left',
      columnType: COLUMN_TYPE_ENUM.TOTAL,
      // className: ({ rowIndex }) => getStripeClassByRowIndex(rowIndex),
      slots: {
        default: 'Link',
      },
    },
  ];
}

/** 表单筛选项配置 */
export function getFormConfig() {
  return [
    // 项目
    {
      fieldName: 'prjCode',
      label: '',
      component: 'Input',
      componentProps: { placeholder: t('dict.PMTData.PrjCode'), allowClear: true },
    },
    // 工厂
    {
      fieldName: 'factory',
      label: '',
      component: 'ApiSelect',
      componentProps: {
        placeholder: t('dict.CommonCol.factory'),
        api: getFactoryList,
        showSearch: true,
        apiSearch: {
          show: true,
          searchName: 'Name',
        },
        resultField: 'data',
        labelField: 'Name',
        valueField: 'Code',
        filterOption: false,
        allowClear: true,
      },
    },
    // 项目代号(终端)
    {
      fieldName: 'tmlCusPrjCode',
      label: '',
      component: 'Input',
      componentProps: { placeholder: t('dict.PMTData.TmlCusPrjCode'), allowClear: true },
    },
    // 产品线
    // {
    //   fieldName: 'productLineName',
    //   label: '',
    //   component: 'Input',
    //   componentProps: { placeholder: t('dict.CommonCol.productLine') },
    // },
    // 阶段
    {
      fieldName: 'stage',
      label: '',
      component: 'Input',
      componentProps: { placeholder: t('dict.PMTData.stage'), allowClear: true },
    },
    // 周期
    {
      fieldName: 'weekRange',
      label: '',
      component: 'ARangePicker',
      defaultValue: [dayjs().subtract(4, 'week'), dayjs()],
      componentProps: {
        placeholder: [t('component.lydc.timeRange.startPlaceholder'), t('component.lydc.timeRange.endPlaceholder')],
        picker: 'week',
        allowClear: false,
      },
    },
  ];
}

/** 指标提示 */
export const indexTipMap = {
  需求管理: {
    BOM: {
      阶段: '取项目阶段维护中的阶段数据，按阶段维护的日期范围来确认周次范围，以每个阶段的起始日期确认周次',
      BOM数: '按项目，阶段获取对产品料件数，每周完成',
      已受控图纸: '取料号已维护客图纸的数据',
      未受控图纸: '取料号未维护客图纸的数据',
    },
    正式需求: {
      需求料件: '取PM下达量试需求的料件数',
      '交付数量（KPCS)': '取PC回复的计划交付数量',
      需求料件取消: '量试需求状态为终止或撤回的料号数量',
      设变: '取ECN发起的料件数',
    },
  },
  报价管理: {
    报价: {
      需求料件: '取已建立报价需求数料件数',
      已完成: '已完成报价料件数',
    },
  },
  工程开发: {
    读图: {
      已完成: '已完成图纸评审（有图纸评审结论）的料件数',
      未完成: '未完成图纸评审（有图纸评审结论）的料件数',
      完成率: '已完成 / BOM数',
    },
    DFM: {
      已完成: 'DFM为是，已上传DFM附件或已添加问题的料件数',
      未完成: 'DFM为是，未上传DFM附件并且也未添加问题的料件数',
      完成率: '已完成 / BOM数',
    },
    PCC: {
      已完成: '已完成PCC审核的料件数',
      未完成: '未完成PCC审核的料件数',
      完成率: '已完成 / BOM数',
    },
    模具: {
      已完成: '已完成模具申请的料件数',
      未完成: '未完成模具申请的料件数',
      完成率: '已完成 / BOM数',
    },
  },
  '材料/模具请购': {
    PO交期达成: { 完成率: '取MC回复的交期及备注' },
    模具完成率: '取模具审核时间',
  },
  生产制造: {
    生产: {
      已排产: '总计待上机数',
      已上机: '实际开工料件数',
      完成率: '达成排产排产数 / 上机数',
      手工包装料件数: '手工预排产待产数',
      手工包装完成率: '手工入库数 / 手工预排产待产数',
      工单异常数: '关单时间晚于计划完工时间',
      工单异常率: '工单异常数 / 模切排产的排产数',
      跳票: '应上机而未上机',
      跳票率: '跳票数 / 模切排产的排产数',
    },
    'FAI/CPK': {
      已完成: '是否等待客户approve(是)',
      未完成: '正式需求料件数-已完成',
      完成率: '已完成 / 正式需求料件数',
    },
  },
  关务: {
    备案: {
      已完成: '关务完成备案表审核',
      未完成: '关务未完成备案表审核',
      完成率: '关务需求完成数 / 关务需求总数',
    },
  },
  出货: {
    出货: {
      已完成: '量试订单中已完全处理的料件数',
      未完成: '量试订单中未完全处理的料件数',
      完成率: '已完成出货料件数 / 量试订单中料件数,（按项目，阶段）',
    },
  },
  客户上线: {
    下游上线: {
      '客户端上线IQC通过数(KPCS)': '取NPI功能的IQC数 - 异常数',
      客户端上线IQC通过率: '通过数 / NPI功能的IQC数',
      上线使用: '取NPI功能的客户上线数',
      客户端上线使用率: '上线使用数 / 出货数量',
      客诉: '取客诉',
      客诉率: '发生过客诉的料件 / 总料件',
      客诉关闭率: '已完成客诉处理，结案的数据',
    },
  },
};
