import { cloneDeep } from 'lodash-es';
import { useI18n } from '/@/hooks/web/useI18n';
import { getFactoryList } from '/@/api/basicData/productCodeApply';
import { useBaseStore } from '/@/store/modules/base';
import { getYearWeek } from '/@/views/productionPlan/main/materialPlan/weekTime';
import dayjs from 'dayjs';

const { t } = useI18n();
const baseStore = useBaseStore();

// 主页form配置
export function getFormSchema() {
  return [
    {
      fieldName: 'searchDate',
      label: '',
      component: 'WeekPicker',
      componentProps: {
        placeholder: t('dict.FcDataColumn.searchDate'),
        valueFormat: 'YYYY-ww',
      },
      // defaultValue: getYearWeek(),
      defaultValue: dayjs(new Date()),
    },
    {
      fieldName: 'innerMaterialCode',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: '产品内部料号',
      },
    },
    {
      fieldName: 'factory',
      label: '',
      component: 'ApiSelect',
      componentProps: {
        api: getFactoryList,
        showSearch: true,
        apiSearch: {
          show: true,
          searchName: 'keyword',
        },
        resultField: 'data',
        labelField: 'Name',
        valueField: 'Code',
        immediate: true,
        placeholder: t('dict.CommonCol.factoryName'),
      },
    },
    {
      fieldName: 'project',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: '项目名称',
      },
    },
  ];
}

// 主页表格column配置
export const column = [
  {
    field: 'checkbox',
    type: 'checkbox',
    width: '50',
    align: 'center',
  },
  // {
  //   field: 'seq',
  //   title: t('component.table.index'),
  //   type: 'seq',
  //   width: '50',
  //   align: 'center',
  // },
  {
    title: '日期',
    field: 'date',
    // filters: [{ data: '' }],
    // filterRender: {
    //   name: 'Input',
    // },
    width: 120,
  },
  {
    title: '加单单号',
    field: 'addWorkOrderNo',
    // sortable: true,
    // filters: [{ data: '' }],
    // filterRender: {
    //   name: 'Input',
    // },
    width: 140,
  },
  // {
  //   title: '是否公开',
  //   field: 'isOpen',
  //   filters: [{ data: '' }],
  //   filterRender: {
  //     name: 'ApiSelect',
  //     searchField: 'isOpen',
  //     props: {
  //       api: () => baseStore.getDictionaryData('isOpen'),
  //       labelField: 'fullName',
  //       valueField: 'enCode',
  //       immediate: true,
  //       showSearch: true,
  //       filterOption: false,
  //     },
  //   },
  //   cellRender: {
  //     name: 'Tag',
  //     options: [
  //       { id: 2, fullName: '否', theme: 'red', rowKey: 'statusDesc' },
  //       { id: 1, fullName: '是', theme: 'green', rowKey: 'statusDesc' },
  //     ],
  //   },
  //   width: 120,
  // },
  {
    title: '加单状态',
    field: 'addWorkOrderStatus',
    width: 120,
  },
  {
    title: '状态',
    field: 'status',
    width: 100,
  },
  {
    title: 'SAP工单号',
    field: 'SAPNo',
    width: 120,
  },
  {
    title: '工单号',
    field: 'workOrderNo',
    width: 120,
  },
  {
    title: '产品内部料号',
    field: 'innerMaterialCode',
    width: 140,
  },
  {
    title: '旧版成品编码',
    field: 'oldProductCode',
    width: 160,
  },
  {
    title: '工单数量',
    field: 'workOrderNumber',
    width: 120,
  },
  {
    title: '加单时间',
    field: 'addWorkOrderTime',
    width: 140,
  },
  {
    title: 'PCC编号',
    field: 'PCCNo',
    width: 120,
  },
  {
    title: 'PCC版本号',
    field: 'PCCVersion',
    width: 120,
  },
  {
    title: '开工时间',
    field: 'startTime',
    width: 140,
  },
  {
    title: '是否连机',
    field: 'IsOnline',
    width: 120,
  },
  {
    title: '开工状态',
    field: 'startStatus',
    width: 120,
  },
  {
    title: '工艺',
    field: 'craft',
    width: 120,
  },
  {
    title: '楼层',
    field: 'floor',
    width: 120,
  },
  {
    title: '材料信息',
    field: 'materialInfo',
    width: 140,
  },
  {
    title: '车间计划备注',
    field: 'workshopPlanRemark',
    width: 140,
  },
  {
    title: '下单员备注',
    field: 'orderOfficerRemark',
    width: 140,
  },
];

export const PlaceOrderColumn = [
  {
    field: 'seq',
    title: t('component.table.index'),
    type: 'seq',
    width: '50',
    align: 'center',
  },
  {
    title: '日期',
    field: 'date',
    width: 140,
    editRender: {
      name: 'DatePicker',
      props: {
        format: 'YYYY-MM-DD',
        valueFormat: 'YYYY-MM-DD', // 写了输出的值就是该格式的，不写输出的值就是时间戳格式的
      },
    },
  },
  {
    title: '加单状态',
    field: 'addWorkOrderStatus',
    width: 120,
    editRender: {
      name: 'Input',
    },
  },
  {
    title: 'SAP工单号',
    field: 'SAPNo',
    width: 140,
    editRender: {
      name: 'Input',
    },
  },
  {
    title: '开工时间',
    field: 'startTime',
    width: 140,
    editRender: {
      name: 'Input',
    },
  },
  {
    title: '是否连机',
    field: 'isOnline',
    width: 120,
    editRender: {
      name: 'ASelect',
      cacheField: 'isRubberPartDesc',
      props: {
        fieldNames: {
          label: 'fullName',
          value: 'enCode',
        },
        options: [
          { fullName: '是', enCode: 1 },
          { fullName: '否', enCode: 0 },
        ],
      },
    },
  },
  {
    title: '开工状态',
    field: 'startStatus',
    width: 120,
    editRender: {
      name: 'Input',
    },
  },
  {
    title: '材料信息',
    field: 'materialInfo',
    width: 120,
    editRender: {
      name: 'Input',
    },
  },
  {
    title: '车间计划备注',
    field: 'workshopPlanRemark',
    width: 120,
    editRender: {
      name: 'Input',
    },
  },
  {
    title: '下单员备注',
    field: 'orderOfficerRemark',
    width: 120,
    editRender: {
      name: 'Input',
    },
  },
  {
    title: '工单号',
    field: 'workOrderNo',
    width: 120,
  },
  {
    title: '产品内部料号',
    field: 'innerMaterialCode',
    width: 140,
  },
  {
    title: '旧版成品编码',
    field: 'oldProductCode',
    width: 140,
  },
  {
    title: '工单数量',
    field: 'workOrderNumber',
    width: 140,
  },

  {
    title: '加单时间',
    field: 'addWorkOrderTime',
    width: 140,
  },
  {
    title: 'PCC编号',
    field: 'PCCNo',
    width: 130,
  },
  {
    title: 'PCC版本号',
    field: 'PCCVersion',
    width: 140,
  },
  {
    title: '工艺',
    field: 'craft',
    width: 120,
  },
  {
    title: '楼层',
    field: 'floor',
    width: 120,
  },
];

export const PlaceOrderColumnEditRules = {
  date: [{ required: true, message: t('common.required') }],
  addWorkOrderStatus: [{ required: true, message: t('common.required') }],
  SAPNo: [{ required: true, message: t('common.required') }],
  startTime: [{ required: true, message: t('common.required') }],
  isOnline: [{ required: true, message: t('common.required') }],
  startStatus: [{ required: true, message: t('common.required') }],
  materialInfo: [{ required: true, message: t('common.required') }],
  orderOfficerRemark: [{ required: true, message: t('common.required') }],
};
