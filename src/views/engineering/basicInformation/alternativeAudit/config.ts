import type { VxeGridPropTypes } from '/@/components/VxeTable';

// import { h } from 'vue';
// import { isBoolean } from '/@/utils/is';
import { useI18n } from '/@/hooks/web/useI18n';
import { IS_ENABLE_LIST, FLOWSTATE_LIST } from '/@/components/CustomComponents/src/Constant';
import { getMaterialList } from '/@/api/purchase/materialBase';
import { getSupplierlist } from '/@/api/engineering/mould';
import { getFactoryList } from '/@/api/engineering/sample';
import { useBaseStore } from '/@/store/modules/base';

const { t } = useI18n();
const baseStore = useBaseStore();

export const enableStatusOptions = IS_ENABLE_LIST;

export const statusOptions = FLOWSTATE_LIST;

/**
 * @description tabs类型枚举
 */
export enum TABS_ENUM {
  待处理 = '3',
  已处理 = '4',
}

/**
 * 获取待处理表格列
 */
export function getTodoColumns(): VxeGridPropTypes.Columns {
  return [
    {
      type: 'checkbox',
      field: 'checkbox',
    },
    {
      field: 'seq',
      title: t('component.table.index'),
      type: 'seq',
      width: '50',
      align: 'center',
    },
    {
      title: '是否启用',
      field: 'enable',
      sortable: true,
      width: 200,
      cellRender: {
        name: 'Tag',
        options: enableStatusOptions,
      },
    },
    {
      title: '调整原因',
      field: 'updateRemark',
      // sortable: true,
      width: 200,
    },
    {
      title: '被替代料',
      field: 'replacedMaterial',
      // @ts-ignore
      i18nField: 'CommonCol.replacedMaterial',
      children: [
        {
          title: t('dict.PCCColumn.eightCode'),
          field: 'orgCode',
          // sortable: true,
          // filters: [{ data: '' }],
          // filterRender: { name: 'Input' },
          width: 200,
        },
        {
          title: t('dict.CommonCol.supplierShortName'),
          field: 'orgSupplier',
          formatter: ({ cellValue, row }) => row.orgSupplierName || cellValue || '',
          // sortable: true,
          filters: [{ data: '' }],
          filterRender: {
            name: 'ApiSelect',
            props: {
              api: getSupplierlist,
              apiSearch: {
                show: true,
                searchName: 'searchKey',
              },
              showSearch: true,
              filterOption: false,
              resultField: 'data',
              labelField: 'shortName',
              valueField: 'id',
              immediate: true,
              alwaysLoad: true,
            },
          },
          width: 200,
        },
        {
          title: t('dict.CheckMaintainColumn.materialTypeName'),
          field: 'orgType',
          formatter: ({ cellValue, row }) => row.orgTypeName || cellValue || '',
          // sortable: true,
          filters: [{ data: '' }],
          filterRender: {
            name: 'ApiSelect',
            props: {
              api: (params: any) => {
                return getMaterialList({ displayArea: 'MaterialWarehouse', ...params });
              },
              // apiSearch: {
              //   show: true,
              //   searchName: 'keyword',
              // },
              // showSearch: true,
              filterOption: false,
              resultField: 'data.list',
              labelField: 'fullName',
              valueField: 'id',
              immediate: true,
              alwaysLoad: true,
            },
          },
          width: 200,
        },
        {
          title: t('dict.MaterialDevelopApplyColumn.materialDesc'),
          field: 'orgDesc',
          width: 280,
        },
      ],
    },
    {
      title: '替代料',
      field: 'alternativeMaterials',
      // @ts-ignore
      i18nField: 'CommonCol.alternativeMaterials',
      children: [
        {
          title: t('dict.PCCColumn.eightCode'),
          field: 'altCode',
          // sortable: true,
          // filters: [{ data: '' }],
          // filterRender: { name: 'Input' },
          width: 200,
        },
        {
          title: t('dict.CommonCol.supplierShortName'),
          field: 'altSupplier',
          formatter: ({ cellValue, row }) => row.altSupplierName || cellValue || '',
          // sortable: true,
          filters: [{ data: '' }],
          filterRender: {
            name: 'ApiSelect',
            props: {
              api: getSupplierlist,
              apiSearch: {
                show: true,
                searchName: 'searchKey',
              },
              showSearch: true,
              filterOption: false,
              resultField: 'data',
              labelField: 'shortName',
              valueField: 'id',
              immediate: true,
              alwaysLoad: true,
            },
          },
          width: 200,
        },
        {
          title: t('dict.CheckMaintainColumn.materialTypeName'),
          field: 'altType',
          formatter: ({ cellValue, row }) => row.altTypeName || cellValue || '',
          // sortable: true,
          filters: [{ data: '' }],
          filterRender: {
            name: 'ApiSelect',
            props: {
              api: (params: any) => {
                return getMaterialList({ displayArea: 'MaterialWarehouse', ...params });
              },
              // apiSearch: {
              //   show: true,
              //   searchName: 'keyword',
              // },
              // showSearch: true,
              filterOption: false,
              resultField: 'data.list',
              labelField: 'fullName',
              valueField: 'id',
              immediate: true,
              alwaysLoad: true,
            },
          },
          width: 200,
        },
        {
          title: t('dict.MaterialDevelopApplyColumn.materialDesc'),
          field: 'altDesc',
          width: 280,
        },
      ],
    },
    {
      title: '优先级',
      field: 'priority',
      sortable: true,
      // filters: [{ data: '' }],
      // filterRender: { name: 'Input' },
      width: 200,
    },
    {
      title: '变更记录',
      field: 'changeRecord',
      // @ts-ignore
      i18nField: 'CommonCol.changeRecord',
      // sortable: true,
      // filters: [{ data: '' }],
      // filterRender: { name: 'Input' },
      width: 200,
      slots: {
        default: 'changeRecord',
      },
    },
    {
      title: '工厂',
      field: 'factory',
      formatter: ({ cellValue, row }) => row.factoryName || cellValue || '',
      // sortable: true,
      filters: [{ data: '' }],
      filterRender: {
        name: 'ApiSelect',
        props: {
          api: getFactoryList,
          apiSearch: {
            show: true,
            searchName: 'Name',
          },
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
      width: 200,
    },
    {
      title: '当前处理人',
      field: 'handlerName',
      // @ts-ignore
      i18nField: 'CommonCol.currentNodeUser',
      // sortable: true,
      filters: [{ data: '' }],
      filterRender: { name: 'Input' },
      width: 200,
    },
    {
      title: '当前节点',
      field: 'currentNodeName',
      // @ts-ignore
      i18nField: 'CommonCol.currentNode',
      // sortable: true,
      // filters: [{ data: '' }],
      // filterRender: { name: 'Input' },
      width: 200,
    },
    {
      title: '节点记录',
      field: 'nodeDetail',
      // @ts-ignore
      i18nField: 'CommonCol.nodeDetail',
      width: 200,
      slots: {
        default: 'nodeDetail',
      },
    },
    {
      title: '创建人',
      field: 'creatorUserName',
      // sortable: true,
      width: 200,
    },
    {
      title: '创建时间',
      field: 'creatorTime',
      // sortable: true,
      // filters: [{ data: '' }],
      // filterRender: { name: 'DatePicker' },
      width: 200,
      cellRender: {
        name: 'Date',
      },
    },
    {
      title: '修改人',
      field: 'lastModifyUserName',
      // sortable: true,
      width: 200,
    },
    {
      title: '修改时间',
      field: 'lastModifyTime',
      // sortable: true,
      // filters: [{ data: '' }],
      // filterRender: { name: 'DatePicker' },
      width: 200,
      cellRender: {
        name: 'Date',
      },
    },
    {
      title: '备注',
      field: 'remark',
      // sortable: true,
      width: 200,
    },
    {
      title: '主要制程',
      field: 'mainProcess',
      formatter: ({ cellValue, row }) => row.mainProcessName || cellValue || '',
      filters: [{ data: '' }],
      filterRender: {
        name: 'ApiSelect',
        props: {
          api: () => baseStore.getDictionaryData('MainProcess'),
          labelField: 'fullName',
          valueField: 'enCode',
          filterOption: false,
          notFoundContent: null,
          immediate: true,
        },
      },
      width: 200,
    },
  ];
}

/** 意见枚举 */
export enum OPINION_ENUM {
  同意 = '1',
  驳回 = '2',
}

/** 意见选项 */
export const opinionOptions = [
  { label: t('common.stopText'), value: OPINION_ENUM.同意, fullName: t('common.stopText'), id: OPINION_ENUM.同意, theme: 'green' },
  { label: t('common.stopText'), value: OPINION_ENUM.驳回, fullName: t('common.stopText'), id: OPINION_ENUM.驳回, theme: 'yellow' },
];

/**
 * 已处理表格列
 */
export function getDoneColumns(): VxeGridPropTypes.Columns {
  const list = getTodoColumns();

  // list.splice(3, 0, {
  //   title: '审核人意见',
  //   field: 'status',
  //   sortable: true,
  //   width: 200,
  //   cellRender: {
  //     name: 'Tag',
  //     options: opinionOptions,
  //   },
  //   filters: [{ data: '' }],
  //   filterRender: {
  //     name: 'ASelect',
  //     props: {
  //       options: opinionOptions,
  //     },
  //   },
  // });

  return list;
}
