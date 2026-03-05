import type Dayjs from 'dayjs';
import type { VxeGridPropTypes } from '/@/components/VxeTable';
import { getFactoryList } from '/@/api/customerSerivce';
import { getStatus, getQuantityStatus } from '/@/components/CustomComponents/src/material/Constant';
// import { useBaseStore } from '/@/store/modules/base';
import dayjs from 'dayjs';
import { h } from 'vue';
import duration from 'dayjs/plugin/duration';
import { useI18n } from '/@/hooks/web/useI18n';
import { getStatusLabel } from '/@/views/business/report/utils';
import { useBaseStore } from '/@/store/modules/base';

const { t } = useI18n();
const baseStore = useBaseStore();
dayjs.extend(duration);

const IS_OPTION_LIST = [
  { id: 1, fullName: t('dict.TransferEnum.Yes'), theme: 'green' },
  { id: 0, fullName: t('dict.TransferEnum.No'), theme: 'gray' },
];

const isClaimEnumSTATUS = [
  { id: 0, fullName: t('common.no'), theme: 'gray' },
  { id: 1, fullName: t('common.yes'), theme: 'green' },
];

const supplierSTATUS = [
  { id: 1, fullName: t('dict.SMAConfirmStatus.Satisfy'), theme: 'green' }, //满足
  { id: 2, fullName: t('dict.SMAConfirmStatus.NotSatisfy'), theme: 'red' }, //不满足
];

const engineeringVerifySTATUS = [
  { id: 10, fullName: t('comon.reSendSample'), theme: 'blue' }, //重新送样
  { id: 11, fullName: t('common.importText'), theme: 'green' }, //导入
  { id: 12, fullName: t('common.ending'), theme: 'red' }, //结束
];
/**
 * 处理状态筛选
 */
export const statusOptions = [
  { label: t('common.todoText'), value: 6 },
  { label: t('common.doneText'), value: 7 },
];

/**
 * 计算两个时间之间相差的天数、小时数、分钟数和秒数
 * @param startTime 开始时间字符串
 * @param endTime 结束时间字符串
 * @returns 格式化的字符串，例如 '1天2小时3分4秒'
 */
export function calculateTimeDifference(startTime: Dayjs.ConfigType, endTime: Dayjs.ConfigType): string {
  const start = dayjs(startTime).tz();
  const end = dayjs(endTime).tz();

  if (!startTime || !endTime || !(start.isValid() && end.isValid())) {
    return '';
  }

  const duration = dayjs.duration(end.diff(start));
  return `${Math.floor(duration.asDays())}天${duration.hours()}小时${duration.minutes()}分${duration.seconds()}秒`;
}

export const vxeTableColumns: VxeGridPropTypes.Columns = [
  { type: 'checkbox', field: 'checkbox', width: '50' },
  {
    title: t('common.baseinfo'),
    field: 'baseinfo',
    align: 'center',
    children: [
      {
        title: t('dict.MaterialDevelopApplyReportColumn.applyNumber'),
        field: 'applyNumber',
        showOverflow: 'tooltip',
        width: '160',
      },
      {
        title: t('dict.MaterialDevelopApplyReportColumn.insidePartNumber'),
        field: 'insidePartNumber',
        showOverflow: 'tooltip',
        width: '220',
      },
      {
        title: '旧版成品编码',
        field: 'insideNumberOld',
        showOverflow: 'tooltip',
        width: '200',
      },
      {
        title: '工厂',
        field: 'factoryName',
        showOverflow: 'tooltip',
        width: '220',
      },
      {
        title: t('dict.MaterialDevelopApplyReportColumn.applyUserName'),
        field: 'applyUserName',
        showOverflow: 'tooltip',
        width: '200',
      },
      {
        title: '申请时间',
        field: 'applyDate',
        cellRender: {
          name: 'Date',
        },
        showOverflow: 'tooltip',
        width: '220',
      },
      {
        title: t('dict.MaterialDevelopApplyReportColumn.purchaseUserName'),
        field: 'purchaseUserName',
        showOverflow: 'tooltip',
        width: '220',
      },
      {
        title: '是否客指',
        field: 'isCustomerRefersEnum',
        i18nField: 'isCustomerRefers',
        width: '120',
        cellRender: {
          name: 'Tag',
          options: IS_OPTION_LIST,
        },
      },
      {
        title: '状态',
        field: 'statusEnum',
        width: 100,
        cellRender: {
          name: 'Tag',
          options: getStatus('statusEnum'),
        },
      },
      { title: '当前节点', field: 'currentNode', width: 160 },
      {
        title: '当前处理人',
        field: 'currentProcessor',
        width: 230,
        filters: [{ data: '' }],
        filterRender: {
          name: 'CustomUserSelect',
        },
      },
      {
        title: '节点详情',
        field: 'nodeDetail',
        width: 100,
        slots: {
          default: 'nodeDetail',
        },
      },
    ],
  },
  {
    title: t('common.DemandMaterialsInformation'),
    field: 'DemandMaterialsInformation',
    align: 'center',
    children: [
      {
        title: '开发类型',
        field: 'developmentType',
        filters: [{ data: '' }],
        filterRender: { name: 'Input' },
        width: '130',
      },
      {
        title: '材料归属',
        field: 'materialAreaName',
        width: '130',
        filters: [{ data: '' }],
        filterRender: { name: 'Input' },
      },
      {
        title: '材料类型',
        field: 'materialClassName',
        filters: [{ data: '' }],
        filterRender: { name: 'Input' },
        width: '130',
      },
      { title: '被替/备选料号', field: 'alternativeMaterialNumber', width: '170' },
      {
        title: '材料描述',
        field: 'materialDesc',
        width: '170',
        filters: [{ data: '' }],
        filterRender: { name: 'Input' },
      },
    ],
  },
  {
    title: t('common.recommendedSuppliersAndMaterialsInformation'),
    field: 'recommendedSuppliersAndMaterialsInformation',
    align: 'center',
    children: [
      {
        title: '供应商名称',
        field: 'supplierName',
        filters: [{ data: '' }],
        filterRender: { name: 'Input' },
        width: '180',
      },
      {
        title: '供应商材料编码',
        field: 'mMaterialsCode',
        filters: [{ data: '' }],
        filterRender: { name: 'Input' },
        width: '180',
      },
      {
        title: '供应商材料信息',
        field: 'sMInformation',
        width: '180',
      },
      {
        title: '备注(供应商&材料信息)',
        field: 'supplierRemarks',
        width: '180',
      },
      {
        title: '验证优先级',
        field: 'verificationOrder',
        width: '120',
      },
      {
        title: '材料内部料号(采购推荐)',
        field: 'rrMaterialCode',
        width: '170',
      },
    ],
  },
  {
    title: t('common.Material_Review'),
    field: 'MaterialReview',
    align: 'center',
    children: [
      {
        title: '工程审核结论',
        field: 'supplierStatusEnum',
        width: '120',
        filters: [{ data: '' }],
        filterRender: {
          name: 'ASelect',
          props: {
            fieldNames: {
              label: 'fullName',
              value: 'id',
            },
            options: supplierSTATUS,
          },
        },
        cellRender: {
          name: 'Tag',
          options: supplierSTATUS,
        },
      },
      {
        title: '原因',
        field: 'conclusionRemarks',
        width: '170',
      },
    ],
  },
  {
    title: t('common.SpecificationsAndDeliveryDate'),
    field: 'SpecificationsAndDeliveryDate',
    align: 'center',
    children: [
      {
        title: '申请规格',
        field: 'applySpec',
        width: '120',
      },
      {
        title: '要求交期',
        field: 'deliveryDate',
        width: '110',
        cellRender: {
          name: 'Date',
          format: 'YYYY-MM-DD',
        },
      },
      {
        title: '送样规格',
        field: 'sendSpec',
        width: '120',
      },
      {
        title: '送样交期',
        field: 'expectedSampleDate',
        width: '180',
        cellRender: {
          name: 'Date',
          format: 'YYYY-MM-DD',
        },
      },
      {
        title: '交期是否满足',
        field: 'isDeliveryEnum',
        width: '100',
        filters: [{ data: '' }],
        filterRender: {
          name: 'ASelect',
          props: {
            fieldNames: {
              label: 'fullName',
              value: 'id',
            },
            options: supplierSTATUS,
          },
        },
        cellRender: {
          name: 'Tag',
          options: supplierSTATUS,
        },
      },
    ],
  },
  {
    title: t('routes.qualityAssurance-newMateria-registation'),
    field: 'newMateriaRegistation',
    align: 'center',
    children: [
      {
        title: '送样记录',
        field: 'number',
        width: '150',
      },
      {
        title: '材料流水编码',
        field: 'materialNumber',
        width: '150',
      },
      {
        title: '宽度mm*长度m',
        field: 'widthOrLong',
        width: '130',
      },
      {
        title: '卷数(R)',
        field: 'qty',
        width: '120',
      },
      {
        title: '是否领取',
        field: 'isClaimEnum',
        filters: [{ data: '' }],
        filterRender: {
          name: 'ASelect',
          props: {
            fieldNames: {
              label: 'fullName',
              value: 'id',
            },
            options: isClaimEnumSTATUS,
          },
        },
        cellRender: {
          name: 'Tag',
          options: isClaimEnumSTATUS,
        },
        width: 100,
      },
      {
        title: '领取人',
        field: 'claimUserName',
        filters: [{ data: '' }],
        filterRender: {
          name: 'CustomUserSelect',
        },
        width: '180',
      },
      {
        title: '领取日期',
        field: 'claimDate',
        width: '120',
        cellRender: {
          name: 'Date',
          format: 'YYYY-MM-DD',
        },
      },
      {
        title: '备注(材料领取)',
        field: 'claimRemarks',
        width: '150',
      },
    ],
  },
  {
    title: t('routes.qualityAssurance-newMateria-check'),
    field: 'newMateriaCheck',
    align: 'center',
    children: [
      {
        title: '检验结果',
        field: 'iqcStatusEnum',
        filters: [{ data: '' }],
        filterRender: {
          name: 'ASelect',
          props: {
            fieldNames: {
              label: 'fullName',
              value: 'enCode',
            },
            options: getQuantityStatus('iqcStatusEnum'),
          },
        },
        cellRender: {
          name: 'Tag',
          options: getQuantityStatus('iqcStatusEnum'),
        },
        width: 130,
      },
      {
        title: '检验报告',
        field: 'testReportName',
        width: 130,
        slots: { default: 'testReportName' },
      },
      {
        title: '实测数据',
        field: 'fieldTest',
        width: '130',
      },
      {
        title: '检验备注',
        field: 'iqcRemarks',
        width: '130',
      },
      {
        title: 'IQC检验记录',
        field: 'iqcTestReportId',
        slots: {
          default: 'iqcTestReportId',
        },
        width: 130,
      },
    ],
  },
  {
    title: t('dict.BisReportColumn.ev'),
    field: 'EngineeringVerification',
    align: 'center',
    children: [
      {
        title: '检验结果判定',
        field: 'pdCheckStatusEnum',
        filters: [{ data: '' }],
        filterRender: {
          name: 'ASelect',
          props: {
            fieldNames: {
              label: 'fullName',
              value: 'id',
            },
            options: getQuantityStatus('pdCheckStatusEnum'),
          },
        },
        cellRender: {
          name: 'Tag',
          options: getQuantityStatus('pdCheckStatusEnum'),
        },
        width: 130,
      },
      { title: '备注(验证结果判定)', field: 'pdCheckRemarks', width: 150 },
      {
        title: '验证结果',
        field: 'pdVerifyStatusEnum',
        filters: [{ data: '' }],
        filterRender: {
          name: 'ASelect',
          props: {
            fieldNames: {
              label: 'fullName',
              value: 'id',
            },
            options: engineeringVerifySTATUS,
          },
        },
        cellRender: {
          name: 'Tag',
          options: engineeringVerifySTATUS,
        },
        width: 130,
      },
      { title: '备注(验证结果)', field: 'pdVerifyRemarks', width: 150 },
    ],
  },
  {
    title: t('dict.MaterialDevelopApplyReportNewColumn.pVerifyStatus'),
    field: 'ProcurementConclusion',
    align: 'center',
    children: [
      {
        title: '采购结论',
        field: 'pVerifyStatusEnum',
        filters: [{ data: '' }],
        filterRender: {
          name: 'ASelect',
          props: {
            fieldNames: {
              label: 'fullName',
              value: 'id',
            },
            options: getQuantityStatus('pVerifyStatusEnum'),
          },
        },
        cellRender: {
          name: 'Tag',
          options: getQuantityStatus('pVerifyStatusEnum'),
        },
        width: 130,
      },
      { title: '备注(采购结论)', field: 'returnPdRemarks', width: 150 },
    ],
  },
  {
    title: t('dict.BisReportColumn.nmi'),
    field: 'newMateriaImport',
    align: 'center',
    children: [
      {
        title: '是否导入',
        field: 'isImportEnum',
        filters: [{ data: '' }],
        filterRender: {
          name: 'ASelect',
          props: {
            fieldNames: {
              label: 'fullName',
              value: 'id',
            },
            options: isClaimEnumSTATUS,
          },
        },
        cellRender: {
          name: 'Tag',
          options: isClaimEnumSTATUS,
        },
        width: 100,
      },
    ],
  },
  {
    title: t('common.MaterialCodeEntry'),
    field: 'MaterialCodeEntry',
    align: 'center',
    children: [
      {
        title: '材料内部料号(新建)',
        field: 'materialCode',
        width: 180,
      },
    ],
  },
];

export const schema = [
  {
    fieldName: 'applyNumber',
    label: '',
    component: 'Input',
    componentProps: {
      placeholder: t('dict.MaterialDevelopApplyReportColumn.applyNumber'),
      allowClear: true,
    },
  },
  {
    fieldName: 'factoryId',
    i18nField: 'CommonCol.factory',
    label: '',
    component: 'ApiSelect',
    componentProps: {
      placeholder: '工厂',
      api: getFactoryList,
      resultField: 'data',
      allowClear: true,
      showSearch: true,
      apiSearch: {
        show: true,
        searchName: 'factory',
      },
      valueField: 'Id',
      immediate: false,
      filterOption: false,
      nameFormat: ['Code', '/', 'Name'],
    },
  },
  {
    fieldName: 'insidePartNumber',
    label: '',
    component: 'Input',
    componentProps: {
      placeholder: t('dict.MaterialDevelopApplyReportColumn.insidePartNumber'),
      allowClear: true,
    },
  },
  {
    fieldName: 'status',
    label: '',
    component: 'Select',
    componentProps: {
      placeholder: '状态',
      options: getStatus(),
      allowClear: true,
    },
  },
  {
    fieldName: 'materialCode',
    label: '',
    component: 'Input',
    componentProps: {
      placeholder: '材料内部料号',
      submitOnPressEnter: true,
      allowClear: true,
    },
  },
  {
    fieldName: 'insideNumberOld',
    label: '',
    component: 'Input',
    componentProps: {
      placeholder: '旧版成品编码',
      allowClear: true,
    },
  },
  {
    label: '',
    fieldName: 'materialNumber',
    component: 'Input',
    componentProps: {
      placeholder: '材料流水编码',
      submitOnPressEnter: true,
      allowClear: true,
    },
  },
  {
    fieldName: 'applyUserName',
    label: '',
    component: 'Input',
    componentProps: {
      placeholder: t('dict.MaterialDevelopApplyReportColumn.applyUserName'),
      allowClear: true,
    },
  },
  {
    label: '',
    fieldName: 'purchaseUserId',
    i18nField: 'purchaseUserName',
    component: 'CustomUserSelect',
    componentProps: {
      placeholder: '开发采购',
      submitOnPressEnter: true,
      allowClear: true,
    },
  },
  {
    fieldName: 'pickerVal',
    label: '',
    labelWidth: 100,
    component: 'RangePicker',
    componentProps: {
      format: 'YYYY-MM-DD',
      submitOnPressEnter: true,
      placehoder: [''],
      allowClear: true,
    },
  },
];
