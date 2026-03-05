import { getProductionType } from '/@/utils/business/index';
import { useI18n } from '/@/hooks/web/useI18n';
const { t } = useI18n();

export const endCols = [
  {
    title: t('dict.CommonCol.creatorUserName'),
    field: 'creatorUserName',
    showOverflow: true,
    width: '180',
  },
  {
    title: t('dict.CommonCol.creatorTime'),
    field: 'creatorTime',
    showOverflow: true,
    width: '120',
    cellRender: {
      name: 'Date',
    },
  },
  {
    title: t('dict.CommonCol.updateUser'),
    field: 'lastModifyUserName',
    showOverflow: true,
    width: '180',
  },
  {
    title: t('dict.CommonCol.updateTime'),
    field: 'lastModifyTime',
    showOverflow: true,
    width: '120',
    cellRender: {
      name: 'Date',
    },
  },
];

export const commonCols = [
  { type: 'checkbox', field: 'checkbox', width: 45 },
  {
    field: 'insideProjectCode',
    title: t('dict.ProjectMembersGroupColumn.insideProjectCode'),
    width: 100,
    showOverflow: true,
  },
  {
    field: 'immediateCustomerName',
    title: t('dict.ProjectMembersGroupColumn.immediateCustomerName'),
    width: 160,
    showOverflow: true,
  },
  {
    field: 'immediateCustomerCode',
    title: t('dict.ProjectMembersGroupColumn.immediateCustomerCode'),
    width: 100,
    showOverflow: true,
  },
  {
    field: 'materialPartsNumber',
    title: t('dict.ProjectMembersGroupColumn.materialPartsNumber'),
    width: 100,
    showOverflow: true,
  },
  {
    field: 'factory',
    title: t('dict.ProjectMembersGroupColumn.factoryName'),
    width: 140,
    showOverflow: true,
    formatter: ({ cellValue, row }) => {
      return cellValue + '/' + row.factoryName;
    },
  },
];

// 编辑模式：如果是PDT的团队，还需要加多两个自定义字段
export const pdtCols = [
  {
    field: 'productionType',
    title: t('dict.ProjectMembersGroupColumn.productionTypeDesc'),
    minWidth: 100,
    showOverflow: true,
    // formatter 配置
    formatter: ({ cellValue, row }) => {
      const item = getProductionType.find(item => item.value == row.productionType);
      return item ? item.label : cellValue;
    },
    editRender: {
      name: 'ASelect',
      field: 'productionType',
      props: {
        options: getProductionType,
      },
    },
  },
  {
    field: 'pdName',
    title: 'PD',
    minWidth: 140,
    showOverflow: true,
    editRender: {
      name: 'ACustomUserSelect',
      field: 'pdId',
      // 自定义编辑渲染组件的事件处理
      events: {
        change: ({ row }, value, $event) => {
          row.pdId = value;
          row.pdName = $event.fullName;
        },
      },
    },
  },
];

// 查看模式：如果是PDT的团队，还需要加多两个自定义字段
export const pdtColsName = [
  {
    title: t('dict.ProjectMembersGroupColumn.productionTypeDesc'),
    field: 'productionTypeDesc',
    // formatter: ({ cellValue, row }) => {
    //   const item = getProductionType.find(item => item.value == row.productionType);
    //   return item ? item.label : cellValue;
    // },
    width: 80,
  },
  {
    title: 'PD',
    field: 'pdName',
    width: 160,
  },
];
