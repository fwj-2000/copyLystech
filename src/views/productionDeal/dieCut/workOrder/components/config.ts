import { BasicColumn } from '/@/components/Table';
import { useI18n } from '/@/hooks/web/useI18n';
import { getFactoryList } from '/@/api/engineering/sample';
const { t } = useI18n();

// 延期情况delaySituation
const DELAY_SITUATION_OPTIONS = [
  // 0-正常 1-延期
  { id: 0, theme: 'green', color: '#52C41A', fullName: t('dict.delaySituation.0'), rowKey: 'statusName' },
  { id: 1, theme: 'red', color: '#FF4D4F', fullName: t('dict.delaySituation.1'), rowKey: 'statusName' },
];
// 生产进度
const PLAN_PROGRESS_OPTIONS = [
  // 0-未开始 1-进行中 2-已完成
  { id: 0, theme: 'gray', color: '#999999', fullName: t('dict.planProgress.0'), rowKey: 'statusName' },
  { id: 1, theme: 'blue', color: '#1890FF', fullName: t('dict.planProgress.1'), rowKey: 'statusName' },
  { id: 2, theme: 'green', color: '#52C41A', fullName: t('dict.planProgress.2'), rowKey: 'statusName' },
];

export const baseColumns: BasicColumn[] = [
  { title: '工单号', dataIndex: 'workOrderNo' },
  { title: '模具编码', dataIndex: 'mouldNo' },
  { title: '数据来源', dataIndex: 'dataSourcesDesc', width: 100 },
  { title: '工单类型', dataIndex: 'workOrderTypeDesc', align: 'center', width: 100 },
  { title: 'BOM类型', dataIndex: 'bomTypeDesc', align: 'center', width: 100 },
  { title: '工单日期', dataIndex: 'workOrderDate', format: 'date|YYYY-MM-DD', width: 100 },
  { title: '关联工单', dataIndex: 'relationWorkOrderNo' },
  { title: '工艺路线优先类型', dataIndex: 'processRouteTypeDesc', align: 'center' },
  { title: '内部料号', dataIndex: 'productCode', width: 200 },
  { title: '数量', dataIndex: 'quantity', width: 90 },
  { title: '生产车间编码', dataIndex: 'produceWorkshopCode' },
  { title: '难度', dataIndex: 'difficulty', width: 90 },
  { title: 'B/非B工单', dataIndex: 'bOrderTypeDesc', width: 100 },
  { title: '备注', dataIndex: 'remark' },
];

export const columns = [
  { type: 'checkbox', field: 'checkbox', width: 50 },
  { title: '工单号', field: 'workOrderNo' },
  { title: '内部料号', field: 'productCode', width: 200 },
  { title: '模具编码', field: 'mouldNo' },
  {
    title: '厂区',
    field: 'factoryAreaName',
    filters: [{ data: '' }],
    filterRender: {
      name: 'ApiSelect',
      props: {
        api: getFactoryList,
        resultField: 'data',
        labelField: 'Name',
        valueField: 'Code',
        showSearch: true,
        immediate: true,
        alwaysLoad: true,
        filterOption: (input: string, option: { label: string }) => option.label.includes(input),
        notFoundContent: null,
      },
    },
    width: 90,
  },
  { title: '数据来源', field: 'dataSourcesDesc', width: 100 },
  {
    title: '生产进度',
    field: 'productionProgress',
    width: 100,
    // format: 'tag|' + JSON.stringify(PLAN_PROGRESS_OPTIONS),
    filters: [{ data: '' }],
    filterRender: {
      name: 'ASelect',
      props: {
        options: PLAN_PROGRESS_OPTIONS,
        fieldNames: {
          label: 'fullName',
          value: 'id',
        },
      },
    },
    cellRender: {
      name: 'Tag',
      options: PLAN_PROGRESS_OPTIONS,
    },
  },
  {
    title: '延期情况',
    field: 'delaySituation',
    width: 100,
    // format: 'tag|' + JSON.stringify(DELAY_SITUATION_OPTIONS),
    filters: [{ data: '' }],
    filterRender: {
      name: 'ASelect',
      props: {
        options: DELAY_SITUATION_OPTIONS,
        fieldNames: {
          label: 'fullName',
          value: 'id',
        },
      },
    },
    cellRender: {
      name: 'Tag',
      options: DELAY_SITUATION_OPTIONS,
    },
  },
  { title: '工单类型', field: 'workOrderTypeDesc', align: 'center', width: 100 },
  { title: 'BOM类型', field: 'bomTypeDesc', align: 'center', width: 100 },
  {
    title: '工单日期',
    field: 'workOrderDate',
    cellRender: {
      name: 'Date',
    },
    filters: [{ data: '' }],
    filterRender: {
      name: 'DatePicker',
    },
    width: 100,
  },
  { title: '关联工单', field: 'relationWorkOrderNo', slots: { default: 'relationWorkOrderNo' } },
  { title: '工艺路线优先类型', field: 'processRouteTypeDesc', align: 'center' },
  { title: '数量', field: 'quantity', width: 90 },
  { title: '生产车间编码', field: 'produceWorkshopCode' },
  { title: '难度', field: 'difficultyLevelName', width: 90, i18nField: 'difficulty' },
  { title: 'B/非B工单', field: 'bOrderTypeDesc', width: 100 },
  { title: '备注', field: 'remark' },
  {
    title: '计划开工时间',
    field: 'planStartTime',
    cellRender: {
      name: 'Date',
    },
    width: 140,
  },
  {
    title: '计划完工时间',
    field: 'planEndTime',
    cellRender: {
      name: 'Date',
    },
    width: 140,
  },
  { title: '计划数量', field: 'planQuantity', width: 100 },
  { title: '完成数量', field: 'successQuantity', width: 100 },
  { title: '创建人', field: 'creatorUserName', width: 90 },
  {
    title: '创建时间',
    field: 'creatorTime',
    cellRender: {
      name: 'Date',
    },
  },
  { title: '修改人', field: 'lastModifyUserName', width: 90 },
  {
    title: '修改时间',
    field: 'lastModifyTime',
    cellRender: {
      name: 'Date',
    },
  },
  { title: '操作', field: 'action', slots: { default: 'action' }, width: 100, fixed: 'right' },
];

export const importColumns: BasicColumn[] = [
  { title: 'excel行号', dataIndex: 'number', width: 120, key: 'number', sorter: true },
  { title: '数据', dataIndex: 'errorMsg', width: 100 },
  ...baseColumns,
];
