import { useI18n } from '/@/hooks/web/useI18n';
const { t } = useI18n();

export const PushWorkOrderColumnEditRules = {
  date: [{ required: true, message: t('common.required') }],
  startTime: [{ required: true, message: t('common.required') }],
  isOnline: [{ required: true, message: t('common.required') }],
  startStatus: [{ required: true, message: t('common.required') }],
  materialInfo: [{ required: true, message: t('common.required') }],
  orderOfficer: [{ required: true, message: t('common.required') }],
  workOrderType: [{ required: true, message: t('common.required') }],
  MRPController: [{ required: true, message: t('common.required') }],
  startDate: [{ required: true, message: t('common.required') }],
};

export const PushWorkOrderColumn = [
  {
    field: 'seq',
    title: t('component.table.index'),
    type: 'seq',
    width: '50',
    align: 'center',
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
      cacheField: 'isOnline',
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
      name: 'ASelect',
      cacheField: 'isOnline',
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
    title: '下单员',
    field: 'orderOfficer',
    width: 120,
    editRender: {
      name: 'CustomUserSelect',
    },
  },
  {
    title: '工单类型',
    field: 'workOrderType',
    width: 120,
    editRender: {
      name: 'ASelect',
      cacheField: 'isOnline',
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
    title: 'MRP控制者',
    field: 'MRPController',
    width: 140,
    editRender: {
      name: 'CustomUserSelect',
    },
  },
  {
    title: '开工日期',
    field: 'startDate',
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
    title: '工单数量',
    field: 'workOrderNumber',
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
