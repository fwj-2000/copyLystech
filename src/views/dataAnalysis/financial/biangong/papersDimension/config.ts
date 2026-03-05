import { h } from 'vue';
import { allColumnsOptions, commonBatchMenuItems, templateDownloadFile } from '../config';
import { commonMediumTextOption, commonMiniTextOption, commonDateTimeSecondOption } from '/@/views/dataAnalysis/components/BaseVxeTable/config';

import PapersImport from './PapersImport.vue';
import { BaseVxeTableTypes } from '/@/views/dataAnalysis/components/BaseVxeTable/types';
import { MenuItemType } from '/@/views/dataAnalysis/components/BatchMenu/types';
import { useDownload } from '/@/views/dashboard/hooks/useDownload';
import { getDimensionDownload } from '/@/api/dataAnalysis/financial';
import { downloadByUrl } from '/@/utils/file/download';
import { useMessage } from '/@/hooks/web/useMessage';

import SingleUploadComponent from '/@/views/dataAnalysis/components/SingleUpload.vue';

const { createMessage } = useMessage();

// 批量导入导出菜单
export const batchMenuItems: MenuItemType[] = [
  // 底稿数据
  {
    label: '底稿数据',
    key: 'papers',
    auth: 'btn_upload-paper',
    children: [
      {
        label: '模版下载',
        key: 'papersDownload',
        clickMethod: () => {
          return templateDownloadFile({
            params: {
              fileName: '维度底稿导入模板',
            },
          });
        },
      },
      {
        label: h(PapersImport, {}),
        key: 'papersImport',
      },
    ],
  },
  ...commonBatchMenuItems,
  // end
];

const afterUploadHandle = resData => {
  if (resData.isOk) {
    const url = resData.url;
    const fileName = resData.fileName;
    downloadByUrl({ url, fileName });
    // createMessage.success('操作成功');
  } else {
    createMessage.error('上传失败');
  }
};

// 上传按钮配置
export const statisticButtonList = () => {
  /** 批量导入菜单 */
  const { downloadFile: DownloadProfitandlosTemplate } = useDownload({
    requestApi: getDimensionDownload,
  });

  return [
    {
      label: '月损益成本',
      key: 'UnitCost',
      children: [
        {
          label: '模版下载',
          key: 'UnitCostTemplate',
          clickMethod: () => {
            return DownloadProfitandlosTemplate({ fileName: '月损益成本或工单成本通用模板' });
          },
        },
        {
          label: h(SingleUploadComponent, {
            api: '/api/report/dimension/UnitCost',
            buttonText: '导入',
            afterUpload: afterUploadHandle,
          }),
          key: 'UnitCostImport',
        },
      ],
    },
    {
      label: '工单成本',
      key: 'WorkOrderCost',
      children: [
        {
          label: '模版下载',
          key: 'WorkOrderCostTemplate',
          clickMethod: () => {
            return DownloadProfitandlosTemplate({ fileName: '月损益成本或工单成本通用模板' });
          },
        },
        {
          label: h(SingleUploadComponent, {
            api: '/api/report/dimension/WorkOrderCost',
            buttonText: '导入',
            afterUpload: afterUploadHandle,
          }),
          key: 'WorkOrderCostImport',
        },
      ],
    },
    {
      label: '全码最新结单工厂',
      key: 'QueryLatestFactory',
      children: [
        {
          label: '模版下载',
          key: 'QueryLatestFactoryTemplate',
          clickMethod: () => {
            return DownloadProfitandlosTemplate({ fileName: '全码最新结单工厂模板' });
          },
        },
        {
          label: h(SingleUploadComponent, {
            api: '/api/report/dimension/QueryLatestFactory',
            buttonText: '导入',
            afterUpload: afterUploadHandle,
          }),
          key: 'QueryLatestFactoryImport',
        },
      ],
    },
    {
      label: '六码最新结单工厂',
      key: 'QueryLatestFactorySixCode',
      children: [
        {
          label: '模版下载',
          key: 'QueryLatestFactorySixCodeTemplate',
          clickMethod: () => {
            return DownloadProfitandlosTemplate({ fileName: '六码最新结单工厂模板' });
          },
        },
        {
          label: h(SingleUploadComponent, {
            api: '/api/report/dimension/QueryLatestFactorySixCode',
            buttonText: '导入',
            afterUpload: afterUploadHandle,
          }),
          key: 'QueryLatestFactorySixCodeImport',
        },
      ],
    },
    // {
    //   api: '/api/report/dimension/UnitCost',
    //   buttonText: '月损益成本',
    //   downloading: true,
    // },
    // {
    //   api: '/api/report/dimension/WorkOrderCost',
    //   buttonText: '工单成本',
    //   downloading: true,
    // },
    // {
    //   api: '/api/report/dimension/QueryLatestFactory',
    //   buttonText: '全码最新结单工厂',
    //   downloading: true,
    // },
    // {
    //   api: '/api/report/dimension/QueryLatestFactorySixCode',
    //   buttonText: '六码最新结单工厂',
    //   downloading: true,
    // },
  ];
};

// SAP状态更新
export const sapOptions = [
  {
    label: '反接收',
    value: '1',
  },
  {
    label: '已接收',
    value: '2',
  },
  {
    label: '已结算',
    value: '3',
  },
  {
    label: '反结算',
    value: '4',
  },
];

// 获取表头配置
export const getAllColumns = (): BaseVxeTableTypes.Columns => {
  const columns: BaseVxeTableTypes.Columns = [
    {
      field: 'Status',
      title: 'Sap状态',
      headerAlign: 'center',
      width: 100,
    },
    {
      field: 'Year',
      title: '年份',
    },
    {
      field: 'EntdateQ',
      title: '季度',
    },
    {
      field: 'BuName',
      title: 'bu',
    },
    {
      field: 'EntdateMo',
      title: '核算月份',
    },
    {
      field: 'EntdateWk',
      title: '周期',
    },
    {
      field: 'Budat',
      title: '工单技术关闭日期',
    },
    {
      field: 'Idat2a',
      title: '下达日期',
    },
    {
      field: 'Factory',
      title: '厂区',
    },
    {
      field: 'WorkShop',
      title: '车间',
    },
    {
      field: 'Auart',
    },
    {
      field: 'AuartDm',
    },
    {
      field: 'Aufnr',
      title: '订单号',
    },
    {
      field: 'Matnr',
      title: '成品编码',
    },
    {
      field: 'Zj10m',
      title: '十码',
    },
    {
      field: 'Zj6m',
      title: '中间6码',
    },
    {
      field: 'Znbxm',
      title: '内部项目',
    },
    {
      field: 'Xxm',
      title: '小项目',
    },
    {
      field: 'Zzdkh',
      title: '客户划分类型',
    },
    {
      field: 'Zcplb',
      title: '产品类别',
    },
    {
      field: 'Bom',
      title: '是否有BOM',
    },
    {
      field: 'Gamng',
      title: '订单数量',
    },
    {
      field: 'Wemnga',
      title: '良品入库数量',
    },
    {
      field: 'Sj',
      title: '产值单价',
    },
    {
      field: 'PriceRange',
      title: '区间单价',
    },
    {
      field: 'Zcpcz',
      title: '成品产值',
    },
    {
      field: 'Zbjzcb',
      title: '标准总成本(含损耗)',
    },
    {
      field: 'Bzbge',
      title: '标准-边贡额',
    },
    {
      field: 'Bzzz',
      title: '标准变动制费合计',
    },
    {
      field: 'Zmbcb',
      title: '标准零损耗材料成本',
    },
    {
      field: 'Zbzcb2',
      title: '标准含损耗材料成本',
    },
    {
      field: 'Szjrg',
      title: '标准-直接人工',
    },
    {
      field: 'Bzbdzf',
      title: '标准-其他变动制费',
    },
    {
      field: 'Smjf',
      title: '标准-变动模具费',
    },
    {
      field: 'Bzgdzz',
      title: '标准-固定制费',
    },
    {
      field: 'Zsjzcb',
      title: '实际总成本',
    },
    {
      field: 'Sjbge',
      title: '实际边贡额',
    },
    {
      field: 'Bgsse',
      title: '边贡损失额',
      width: 100,
    },
    {
      field: 'Sjzf',
      title: '实际变动制费合计',
    },
    {
      field: 'Zsjje',
      title: '实际材料成本',
    },
    {
      field: 'ZZjrg',
      title: '实际-直接人工',
    },
    {
      field: 'Sjbdzf',
      title: '实际-其他变动制费',
    },
    {
      field: 'ZMjf',
      title: '实际-变动模具费',
    },
    {
      field: 'Sjgdzf',
      title: '实际-固定制费',
    },
    {
      field: 'Bzdwcb',
      title: '标准单位成本',
    },
    {
      field: 'Sjdwcb',
      title: '实际单位成本',
    },
    {
      field: 'Pccdwclcb0sh',
      title: '标准单位材料成本(0损耗)',
    },
    {
      field: 'PccdwclcbHsh',
      title: '标准单位材料成本(含损耗)',
    },
    {
      field: 'Sjcldwcb',
      title: '实际单位材料成本',
    },
    {
      field: 'Bzrgdwcb',
      title: '标准单位人工成本',
    },
    {
      field: 'Sjrgdwcb',
      title: '实际单位人工成本',
    },
    {
      field: 'Shsse0',
      title: '标准材料损失',
    },
    {
      field: 'ShsseH',
      title: '实际材料损失',
    },
    {
      field: 'Zclcs',
      title: '材料超损',
    },
    {
      field: 'Rgsse',
      title: '人工损失',
    },
    {
      field: 'Bzmle',
      title: '标准毛利额',
    },
    {
      field: 'Sjmle',
      title: '实际毛利额',
    },
    {
      field: 'Mlecy',
      title: '毛利额差异',
    },
    {
      field: 'Bzmll',
      title: '标准毛利率',
    },
    {
      field: 'Sjmll',
      title: '实际毛利率',
    },
    {
      field: 'Zmlvcy',
      title: '毛利率差异',
    },
    {
      field: 'Bzbgl',
      title: '标准边贡率',
    },
    {
      field: 'Sjbgl',
      title: '实际边贡率',
    },
    {
      field: 'Zbglcy',
      title: '边贡率差异',
    },
    {
      field: 'Bgdcl',
      title: '边贡达成率',
    },
    {
      field: 'Bzclzb',
      title: '标准材料占比',
    },
    {
      field: 'Sjclzb',
      title: '实际材料占比',
    },
    {
      field: 'Clzbcy',
      title: '材料占比差异',
    },
    {
      field: 'Bzrgzb',
      title: '标准人工占比',
    },
    {
      field: 'Sjrgzb',
      title: '实际人工占比',
    },
    {
      field: 'Rgzbcy',
      title: '人工占比差异',
    },
    {
      field: 'Bzmqrgzb',
    },
    {
      field: 'Sjmqrgzb',
    },
    {
      field: 'Mqrgzbcy',
    },
    {
      field: 'Bzsgrgzb',
    },
    {
      field: 'Sjsgrgzb',
    },
    {
      field: 'Sgrgzbcy',
    },
    {
      field: 'Bzshl',
      title: '标准损耗率',
    },
    {
      field: 'Sjshl',
      title: '实际损耗率',
    },
    {
      field: 'Zshlcy',
      title: '损耗率差异',
    },
    {
      field: 'YieldRate',
      title: '入库良率',
    },
    {
      field: 'Yield',
      title: '3.8手工良率',
    },
    {
      field: 'Bzfqxlkh',
      title: '标准分切效率(K/H)',
    },
    {
      field: 'Bzmqxlkh',
      title: '标准模切效率(K/H)',
    },
    {
      field: 'Bzsgxlkh',
      title: '标准手工效率(K/H)',
    },
    {
      field: 'Bzbzxlkh',
      title: '标准包装效率(K/H)',
    },
    {
      field: 'Sjfqxlkh',
      title: '实际分切效率(K/H)',
    },
    {
      field: 'Sjmqxlkh',
      title: '实际模切效率(K/H)',
    },
    {
      field: 'Mqxldc',
      title: '模切效率达成',
    },
    {
      field: 'Sjsgxlkh',
      title: '实际手工效率(K/H)',
    },
    {
      field: 'Sgxldc',
      title: '手工效率达成',
    },
    {
      field: 'Sjbzxlkh',
    },
    {
      ...commonMediumTextOption,
      field: 'Zzrgcs',
      title: '工程师',
    },
    {
      field: 'Zxlxm',
      title: '新老项目',
    },
    {
      field: 'Verid',
      title: '生产版本',
    },
    {
      field: 'Stlal',
    },
    {
      field: 'Zrr',
      title: '车间责任人',
    },
    {
      field: 'Abtei',
      title: '业务范围',
    },
    {
      field: 'Werks',
      title: '工厂',
    },
    {
      field: 'Dispo',
      title: 'MRP控制者',
    },
    {
      field: 'Isbian',
      title: '是否纳入边贡指标',
    },
    {
      field: 'Bzfqgs',
      title: '标准分切工时',
    },
    {
      field: 'Bzmqgs',
      title: '标准模切工时',
    },
    {
      field: 'Bzsggs',
      title: '标准手工工时',
    },
    {
      field: 'Bzbzgs',
      title: '标准包装工时',
    },
    {
      field: 'Bzgshj',
      title: '标准工时合计',
    },
    {
      field: 'Sjfqgs',
      title: '实际分切工时',
    },
    {
      field: 'Sjmqgs',
      title: '实际模切工时',
    },
    {
      field: 'Sjsggs',
      title: '实际手工工时',
    },
    {
      field: 'Sjbzgs',
      title: '实际包装工时',
    },
    {
      field: 'Sjgshj',
      title: '实际工时合计',
    },
    {
      field: 'Zmfcb',
    },
    {
      field: 'Zsjclcb',
    },
    {
      field: 'Zclsjsh',
    },
    {
      field: 'Cpx',
    },
    {
      ...commonDateTimeSecondOption,
      field: 'ModifieTime',
      width: 130,
      title: '更新时间',
    },
    {
      field: 'ModifiedBy',
      title: '更新人',
    },
    {
      field: 'Provider',
    },
    {
      field: 'Analysis',
    },
    {
      field: 'Measures',
    },
    {
      field: 'Other1',
    },
    {
      field: 'Other2',
    },
    {
      field: 'Other3',
    },
    {
      field: 'Other4',
    },
    {
      field: 'Other5',
    },
    {
      field: 'LargeProject',
    },
  ];
  return columns.map(item => {
    return {
      ...(allColumnsOptions[item.field as string] ?? {}),
      ...item,
    };
  });
};
// 维度分组 跳转过来要显示的列
export const syncGetColumns = (): BaseVxeTableTypes.Columns => {
  const columns: BaseVxeTableTypes.Columns = [
    {
      ...commonMiniTextOption,
      field: 'EntdateWk',
      title: '周期',
    },

    {
      ...commonMiniTextOption,

      field: 'Factory',
      title: '厂区',
    },
    {
      ...commonMiniTextOption,

      field: 'WorkShop',
      title: '车间',
    },
    {
      ...commonMiniTextOption,
      field: 'Xxm',
      title: '小项目',
    },
    {
      field: 'Zzdkh',
      title: '客户划分类型',
      width: 120,
    },
    {
      field: 'Zcplb',
      title: '产品类别',
    },
    {
      ...commonMediumTextOption,
      field: 'Zzrgcs',
      title: '工程师',
    },
    {
      field: 'Zxlxm',
      title: '新老项目',
    },
    // 产品线??
    {
      field: 'Aufnr',
      title: '订单号',
    },
    {
      field: 'Matnr',
      title: '成品编码',
    },
    {
      field: 'Shsse0',
      title: '标准材料损失',
    },
    {
      field: 'ShsseH',
      title: '实际材料损失',
    },
    {
      field: 'Zclcs',
      title: '材料超损',
    },
    {
      field: 'Rgsse',
      title: '人工损失',
    },
    {
      field: 'Bzbgl',
      width: 65,
      title: '标准边贡率',
    },
    {
      field: 'Sjbgl',
      width: 65,
      title: '实际边贡率',
    },
    {
      field: 'Zbglcy',
      title: '边贡率差异',
    },
    {
      field: 'Bgdcl',
      width: 65,
      title: '边贡达成率',
    },
    {
      field: 'Bzshl',
      width: 65,
      title: '标准损耗率',
    },
    {
      field: 'Sjshl',
      width: 65,
      title: '实际损耗率',
    },
    {
      field: 'Zshlcy',
      width: 65,
      title: '损耗率差异',
    },
    {
      field: 'Provider',
    },
    {
      field: 'Analysis',
    },
    {
      field: 'Measures',
    },
    // 提供人 ???
    // 原因分析	改善对策
  ];
  return columns.map(item => {
    return {
      ...(allColumnsOptions[item.field as string] ?? {}),
      ...item,
    };
  });
};
