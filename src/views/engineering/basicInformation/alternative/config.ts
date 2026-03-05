import type { VxeGridPropTypes } from '/@/components/VxeTable';

import { useI18n } from '/@/hooks/web/useI18n';
import { useBaseStore } from '/@/store/modules/base';
import { getFactoryList } from '/@/api/engineering/sample';
import { IS_ENABLE_LIST, FLOWSTATE_LIST } from '/@/components/CustomComponents/src/Constant';
import { getMaterialList } from '/@/api/purchase/materialBase';
import { getSupplierlist } from '/@/api/engineering/mould';

const baseStore = useBaseStore();

const { t } = useI18n();

export const enableStatusOptions = IS_ENABLE_LIST;

export const statusOptions = FLOWSTATE_LIST;

/**
 * 主要制程选项
 */
export const mainProcessOptions: Array<any> = [];
export const getMainProcessOptions = async () =>
  baseStore.getDictionaryData('MainProcess').then((res: Array<any>) => {
    mainProcessOptions.push(
      ...res.map(item => ({
        ...item,
        label: item.fullName,
        value: item.enCode,
      })),
    );
  });

export function getFormConfig() {
  return [
    {
      fieldName: 'orgCode',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: '被替代料八码',
        allowClear: true,
      },
      width: 100,
    },
    {
      fieldName: 'altCode',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: '替代料八码',
        allowClear: true,
      },
    },
    {
      fieldName: 'enable',
      label: '',
      component: 'Select',
      componentProps: {
        placeholder: '是否启用',
        options: enableStatusOptions,
        allowClear: true,
      },
    },
    {
      fieldName: 'creatorUserId',
      label: '',
      component: 'CustomUserSelect',
      i18nField: 'creatorUserName',
      componentProps: {
        placeholder: '创建人',
        allowClear: true,
      },
    },
    {
      fieldName: 'lastModifyUserId',
      label: '',
      component: 'CustomUserSelect',
      i18nField: 'lastModifyUserName',
      componentProps: {
        placeholder: '修改人',
        allowClear: true,
      },
    },
  ];
}

export function getColumn(): VxeGridPropTypes.Columns {
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
      width: 100,
      cellRender: {
        name: 'Tag',
        options: enableStatusOptions,
      },
    },
    {
      title: '状态',
      field: 'status',
      // @ts-ignore
      i18nField: 'CommonCol.statusName',
      sortable: true,
      width: 100,
      cellRender: {
        name: 'Tag',
        options: statusOptions,
      },
      filters: [{ data: '' }],
      filterRender: {
        name: 'ASelect',
        props: {
          options: statusOptions,
        },
      },
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
      width: 100,
    },
    {
      title: '变更记录',
      field: 'changeRecord',
      // @ts-ignore
      i18nField: 'CommonCol.changeRecord',
      // sortable: true,
      // filters: [{ data: '' }],
      // filterRender: { name: 'Input' },
      width: 100,
      slots: {
        default: 'changeRecord',
      },
    },
    {
      title: '工厂',
      field: 'factory',
      // sortable: true,
      formatter: ({ cellValue, row }) => row.factoryName || cellValue || '',
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
      width: 100,
    },
    {
      title: '节点记录',
      field: 'nodeDetail',
      // @ts-ignore
      i18nField: 'CommonCol.nodeDetail',
      width: 100,
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
      width: 150,
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
      width: 150,
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
      width: 100,
    },
    {
      title: t('common.action'),
      width: 60,
      slots: { default: 'action' },
      fixed: 'right',
      field: 'action',
    },
  ];
}

export function getImportColumn(): VxeGridPropTypes.Columns {
  return [
    // 被替代料 - 八码
    {
      title: t('dict.AltMaterialColumn.orgCode'),
      field: 'orgCode',
      width: 200,
    },
    // 替代料 - 八码
    {
      title: t('dict.AltMaterialColumn.altCode'),
      field: 'altCode',
      width: 200,
    },
    // 优先级
    {
      title: t('dict.AltMaterialColumn.priority'),
      field: 'priority',
      width: 100,
    },
    // 工厂
    {
      title: t('dict.AltMaterialColumn.factory'),
      field: 'factory',
      width: 100,
    },
    // 备注
    {
      title: t('dict.AltMaterialColumn.remark'),
      field: 'remark',
      width: 100,
    },
    // 主要制程
    {
      title: t('dict.AltMaterialColumn.mainProcess'),
      field: 'mainProcess',
      width: 100,
      formatter: ({ cellValue, row }) => row.mainProcessName || cellValue || '',
    },
    // 审核人
    {
      title: t('dict.AltMaterialColumn.reviewUser'),
      field: 'reviewUser',
      width: 100,
    },
  ];
}

/**
 * 编辑时，检测当前的行数据的`优先级`是否重复
 * @param row
 * @param tableData
 * @returns 返回重复的行数据，代表存在重复的优先级；返回`false`代表不重复
 */
export function checkPriority(row: any, tableData: Array<any>) {
  // 优先级需要校验 同个厂区(factory)，同个被替代料(orgCode)，优先级(priority)不能相同
  const target = tableData.find(item => {
    return item._X_ROW_KEY !== row._X_ROW_KEY && item.priority === row.priority && item.factory === row.factory && item.orgCode === row.orgCode;
  });

  if (target) {
    const tip = t('dict.altMaterial.priorityDuplication');
    // 设置`校验信息`
    row.checkMessage = tip;
    target.checkMessage = tip;
    return target;
  } else {
    row.checkMessage = '';
  }

  return false;
}

/**
 * 编辑时，检测表格中所有数据的`优先级`重复情况
 * @param tableData
 * @returns 返回`true`代表不存在重复，返回`false`带存在重复
 */
export function checkAllPriorityInTable(tableData: Array<any>) {
  const checkedList: Array<string> = [];
  return (
    tableData.length === 0 ||
    tableData.every((row: any) => {
      if (checkedList.includes(row._X_ROW_KEY)) {
        return true;
      }

      const target = checkPriority(row, tableData);
      checkedList.push(row._X_ROW_KEY);
      if (target) {
        checkedList.push(target._X_ROW_KEY);
        return false;
      }
      return true;
    })
  );
}

/**
 * 编辑时，检测当前的行数据的`工厂(factory)`、`被替代料八码(orgCode)`、`替代料八码(altCode)`
 * @param row
 * @param tableData
 */
export function checkSameTableData(row: any, tableData: Array<any>) {
  if (!row.factory || !row.altCode || !row.orgCode) {
    row.checkMessage = '';
    return false;
  }

  // 优先级需要校验 同个厂区(factory)，同个被替代料(orgCode)，优先级(priority)不能相同
  const target = tableData.find(item => {
    return item._X_ROW_KEY !== row._X_ROW_KEY && item.factory === row.factory && item.altCode === row.altCode && item.orgCode === row.orgCode;
  });

  if (target) {
    const tip = t('dict.AltMaterial.sameDataTip');
    // 设置`校验信息`
    row.checkMessage = tip;
    target.checkMessage = tip;
    return target;
  } else {
    row.checkMessage = '';
  }

  return false;
}

/**
 * 编辑时，检测表格所有数据的`工厂(factory)`、`被替代料八码(orgCode)`、`替代料八码(altCode)`
 * @param tableData
 * @returns 返回`true`代表不存在重复，返回`false`代表存在重复
 */
export function checkAllSameTableData(tableData: Array<any>) {
  const checkedList: Array<string> = [];
  return (
    tableData.length === 0 ||
    tableData.every((row: any) => {
      if (checkedList.includes(row._X_ROW_KEY)) {
        return true;
      }

      const target = checkSameTableData(row, tableData);
      checkedList.push(row._X_ROW_KEY);
      if (target) {
        checkedList.push(target._X_ROW_KEY);
        return false;
      }
      return true;
    })
  );
}
