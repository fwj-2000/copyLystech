import { cloneDeep } from 'lodash-es';
import { getFactory } from '/@/api/engineering/newMateria';
import { useI18n } from '/@/hooks/web/useI18n';

const { t } = useI18n();

export const formSchemas = [
  {
    field: 'factoryCode',
    i18nField: 'FactoryName',
    label: '',
    component: 'ApiSelect',
    componentProps: {
      placeholder: '工厂',
      api: getFactory,
      showSearch: true,
      apiSearch: {
        show: true,
        searchName: 'factoryCode',
      },
      resultField: 'data',
      valueField: 'Code',
      labelField: 'Name',
      immediate: true,
      nameFormat: ['Code', '/', 'Name'],
    },
  },
  {
    field: 'insideProjectCode',
    label: '',
    component: 'Input',
    componentProps: {
      placeholder: '项目',
    },
    i18nField: 'InsideProjectCode',
  },
  {
    field: 'customerProductStage',
    label: '',
    component: 'Input',
    componentProps: {
      placeholder: '客户产品阶段',
    },
    i18nField: 'CustomerProductStage',
  },
  {
    field: 'directCustomer',
    label: '',
    component: 'Input',
    componentProps: {
      placeholder: '直接客户',
    },
    i18nField: 'DirectCustomer',
  },
];

export const lineChartOptions: echarts.EChartsOption = {
  tooltip: {
    trigger: 'axis',
  },
  legend: {
    data: [
      t('dict.NpiShipmentOnlineColumn.TotalNumberOfParts'),
      t('dict.NpiShipmentOnlineColumn.NumberofShipments'),
      t('dict.NpiShipmentOnlineColumn.NumberOfFeedbacks'),
      'IQC OK',
      'IQC NG',
      t('dict.CommonCol.onlineOK'),
      t('dict.CommonCol.onlineNG'),
    ],
  },
  yAxis: [
    {
      type: 'value',
    },
  ],
  dataZoom: [
    {
      type: 'inside', // 对 y 轴进行缩放
      yAxisIndex: [0], // 指定控制哪个 y 轴
    },
    {
      type: 'slider',
      dataBackground: {
        areaStyle: {
          color: 'rgba(0,0,0,0.03)',
        },
      },
      // 底部缩放配置
      selectedDataBackground: {
        areaStyle: {
          color: 'rgba(0,0,0,0.1)',
        },
        lineStyle: {
          color: 'rgba(0,0,0,0.1)',
        },
      },
      borderColor: '#FFF',
      fillerColor: 'rgba(33,33,33, 0.01)',
      moveHandleStyle: {
        opacity: 0,
      },
      handleIcon:
        'image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAEISURBVHgB7ZfNDYJAEIWHpQCWnwI8kXDTSmxBO9BO6IAWtBL1RMLJO//cAWcxHhQTngkJMdmXbLKZfZlvH1xmiRaSgRrjOF4ZhhEJIdZ938vPc66deB2DILgj/SCwgpqmebFtWzqOQwx/O++6juq6pjRNK95vELggQJw09DxP8hpBhyZc40uR67qSLxghPVHw1rKsSZ+UUn3yNQGCwINRTFs57cAnQDD4pSRJoNrs4LmkwRqswRqswRqswX8I9n0fqs0C5mFPja2TvrZtCRWa+FqW5aSpaRo1ZZ4JEATmJPuiKCoF/5Zc1fI8pyzLKgYfkJ4/PWF4xA15ux01ef6KG0N36BNmMT0A12ZlPEm02ecAAAAASUVORK5CYII=',
      handleStyle: {
        borderWidth: 0,
      },
    },
  ],
};

// 主页表格column配置
export const columns = [
  { title: '序号', type: 'seq', field: 'index', width: 40 },
  {
    title: '工厂',
    field: 'factoryName',
    width: 110,
    i18nField: 'FactoryName',
  },
  {
    title: '项目',
    field: 'insideProjectCode',
    // width: 120,
    i18nField: 'InsideProjectCode',
    minWidth: '',
  },
  {
    title: '客户产品阶段',
    field: 'customerProductStage',
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    // width: 130,
    minWidth: '',
    i18nField: 'CustomerProductStage',
  },
  {
    title: '直接客户',
    field: 'directCustomerName',
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    minWidth: '',
    i18nField: 'DirectCustomer',
  },
  {
    title: '总料件数',
    field: 'totalNumberOfParts',
    sortable: true,
    width: 90,
    i18nField: 'TotalNumberOfParts',
  },
  {
    title: '已出货数',
    field: 'numberofShipments',
    sortable: true,
    width: 90,
    i18nField: 'NumberofShipments',
  },
  {
    title: '已反馈数',
    field: 'numberOfFeedbacks',
    sortable: true,
    width: 90,
    i18nField: 'NumberOfFeedbacks',
  },
  {
    title: 'IQC OK',
    field: 'okNumberOfIqc',
    sortable: true,
    width: 80,
  },
  {
    title: 'IQC NG',
    field: 'ngNumberOfIqc',
    sortable: true,
    width: 80,
  },
  {
    title: 'IQC通过率',
    field: 'iQCPassRate',
    sortable: true,
    width: 100,
    i18nField: 'CommonCol.IQCPassRate',
    slots: {
      default: 'iQCPassRate',
    },
  },
  {
    title: '上线OK',
    field: 'okNumberOfOnline',
    sortable: true,
    width: 80,
    i18nField: 'CommonCol.onlineOK',
  },
  {
    title: '上线NG',
    field: 'ngNumberOfOnline',
    sortable: true,
    width: 80,
    i18nField: 'CommonCol.onlineNG',
  },
  {
    title: '上线通过率',
    field: 'onlinePassRate',
    sortable: true,
    width: 100,
    i18nField: 'OnlinePassRate',
    slots: {
      default: 'onlinePassRate',
    },
  },
];

export function getExportColumn() {
  return cloneDeep(columns).toSpliced(0, 1);
}
