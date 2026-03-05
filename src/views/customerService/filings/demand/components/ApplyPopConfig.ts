import type { VxeGridPropTypes } from 'vxe-table';

import { useI18n } from '/@/hooks/web/useI18n';
import { getinnermaterialnumberlist } from '/@/api/customerSerivce/index';
import { getFactoryList, getPartNumberFactoryList } from '/@/api/basicData/factory';
import { getHarhorList } from '/@/api/basicData/harhor';
import { useBaseStore } from '/@/store/modules/base';
import { nextTick } from 'vue';
import { pastePartNumberFactorys } from '/@/utils/pasterPartNumberFactorys';
import { SOURCE_TYPE_ENUM } from '../config';

const { t } = useI18n();
const baseStore = useBaseStore();

export const langList: Array<any> = [];
async function getLangList() {
  return baseStore.getDictionaryData('FilingLanguage').then((res: Array<any>) => {
    const list = (res || []).map(item => {
      return {
        ...item,
        enCode: +item.enCode,
      };
    });
    langList.push(...list);
  });
}

export const shipmentList: Array<any> = [];
async function getShipmentList() {
  return baseStore.getDictionaryData('ShipmentType').then((res: Array<any>) => {
    const list = res || [];
    shipmentList.push(...list);
  });
}

export const factoryList: Array<any> = [];
async function loadFactoryList() {
  return getFactoryList().then(res => {
    const list = res.data || [];
    factoryList.push(...list);
  });
}

export async function getDict() {
  return Promise.all([loadFactoryList(), getLangList()]).then(() => {
    return getShipmentList();
  });
}

export function getEditTableColumn(): VxeGridPropTypes.Columns {
  return [
    {
      type: 'checkbox',
      width: 50,
    },
    {
      field: 'seq',
      title: t('component.table.index'),
      type: 'seq',
      width: '50',
      align: 'center',
    },
    {
      title: '数据来源',
      field: 'sourceType',
      width: 80,
      formatter: ({ row }) => {
        return row.sourceTypeName || row.sourceType || '';
      },
    },
    {
      title: '产品内部料号',
      field: 'insidePartNumber',
      width: 180,
      editRender: {
        name: 'ApiSelect',
        props: {
          api: getinnermaterialnumberlist,
          showSearch: true,
          apiSearch: {
            show: true,
            searchName: 'InnerMaterialNumber',
          },
          resultField: 'data',
          labelField: 'InnerMaterialNumber',
          valueField: 'InnerMaterialNumber',
          filterOption: false,
          dynamicDisabled: (row: any) => {
            // 如果来源类型(`sourceType`)不是`自建`, 则不允许编辑
            return row.sourceType !== SOURCE_TYPE_ENUM.自建;
          },
          onChange: (_, option, params) => {
            handleInsidePartNumberChange(option, params);
          },
        },
      },
    },
    {
      title: '工厂',
      field: 'factory',
      width: 180,
      formatter: 'ApiSelect',
      editRender: {
        name: 'ApiSelect',
        // cacheField: 'factoryName',
        props: {
          api: getPartNumberFactoryList,
          showSearch: true,
          rowParams: {
            partNumber: 'insidePartNumber',
          },
          apiSearch: {
            show: true,
            searchName: 'Name',
          },
          resultField: 'data',
          labelField: 'Name',
          valueField: 'Code',
          filterOption: false,
          onChange: (_, _data: any, { row }) => {
            Array.isArray(_data.Members) && Object.assign(row, getPersonByFactory(_data.Members));
          },
          dynamicDisabled: (row: any) => {
            // 如果来源类型(`sourceType`)不是`自建`, 则不允许编辑
            return row.sourceType !== SOURCE_TYPE_ENUM.自建;
          },
        },
        // name: 'ASelect',
        // props: {
        //   options: factoryList,
        //   fieldNames: { label: 'Name', value: 'Code' },
        //   // onChange()
        // },
      },
    },
    {
      title: '出货备案法人',
      field: 'sellCorporation',
      width: 180,
      editRender: {
        name: 'Input',
      },
    },
    {
      title: '备案语言',
      field: 'filingsLanguage',
      width: 180,
      editRender: {
        name: 'ASelect',
        props: {
          options: langList,
          fieldNames: { label: 'fullName', value: 'enCode' },
        },
      },
    },
    {
      title: '口岸',
      field: 'prot',
      width: 180,
      formatter: 'ApiSelect',
      editRender: {
        name: 'ApiSelect',
        cacheField: 'protName',
        props: {
          api: getHarhorList,
          showSearch: true,
          apiSearch: {
            show: true,
            searchName: 'harhorName',
          },
          resultField: 'data',
          labelField: 'Name',
          valueField: 'Id',
          filterOption: false,
        },
      },
    },
    {
      title: '出货方式',
      field: 'shipmentType',
      width: 180,
      editRender: {
        name: 'ASelect',
        props: {
          options: shipmentList,
          fieldNames: { label: 'fullName', value: 'enCode' },
        },
      },
    },
    {
      title: '下一节点处理人(关务)',
      field: 'customsPersonId',
      i18nField: 'CommonCol.nextHandler',
      i18nParams: [t('dict.CAApplyColumn.customsPersonName')],
      editRender: {
        name: 'CustomUserSelect',
        cacheField: 'customsPersonName',
      },
    },
    {
      title: 'PD',
      field: 'pdPersonId',
      width: 160,
      editRender: {
        name: 'CustomUserSelect',
      },
    },
    {
      title: '直接客户料号',
      field: 'immediateCustomerPartNumber',
      width: 160,
      editRender: {
        name: 'Input',
        props: { disabled: true, placeholder: t('common.autoCarry') },
      },
    },
    {
      title: '终端客户料号',
      field: 'terminalCustomerPartNumber',
      width: 160,
      editRender: {
        name: 'Input',
        props: { disabled: true, placeholder: t('common.autoCarry') },
      },
    },
    {
      title: '直接客户信息',
      field: 'immediateCustomerName',
      width: 160,
      editRender: {
        name: 'Input',
        props: { disabled: true, placeholder: t('common.autoCarry') },
      },
    },
    {
      title: t('common.action'),
      width: 100,
      slots: { default: 'action' },
      fixed: 'right',
      field: 'action',
    },
  ];
}

export const editRules: any = {
  insidePartNumber: [{ required: true, message: t('common.required') }],
  factory: [{ required: true, message: t('common.required') }],
  sellCorporation: [{ required: true, message: t('common.required') }],
  filingsLanguage: [{ required: true, message: t('common.required') }],
  prot: [{ required: true, message: t('common.required') }],
  shipmentType: [{ required: true, message: t('common.required') }],
  pdPersonId: [{ required: true, message: t('common.required') }],
};

/**
 * 产品内部料号发生了改变
 */
export async function handleInsidePartNumberChange(option, { row, $grid }, isUpdateByFactory = true) {
  const {
    TerminalCustomerMaterialNumber,
    DutyId,
    DutyName,
    DirectCustomerMaterialNumber,
    DirectCustomerName,
    ProductArea,
    Prot,
    ProtName,
    ShipmentType,
    FilingsLanguage,
  } = option || {};

  const shipmentTarget = shipmentList.find(item => `${item.enCode}` === `${ShipmentType}` || item.fullName === ShipmentType);

  $grid.setRow(row, {
    terminalCustomerPartNumber: TerminalCustomerMaterialNumber || '',
    immediateCustomerPartNumber: DirectCustomerMaterialNumber || '',
    immediateCustomerName: DirectCustomerName || '',
    factory: ProductArea || '',
    factoryName: factoryList.find(item => item.Code === ProductArea)?.Name || '',
    pdPersonId: DutyId || '',
    pdPersonName: DutyName || '',
    prot: Prot || '',
    protName: ProtName || '',
    shipmentType: shipmentTarget?.enCode || '',
    shipmentTypeName: shipmentTarget?.fullName || '',
    filingsLanguage: FilingsLanguage || '',
  });
  nextTick(() => {
    $grid.setRow(row, { protName: ProtName || '', factoryName: factoryList.find(item => item.Code === ProductArea)?.Name || '' });
  });

  ProductArea &&
    isUpdateByFactory &&
    pastePartNumberFactorys({
      cols: [{ field: 'factory' }],
      rows: [row],
      fields: {
        partNumberField: 'insidePartNumber',
        factoryField: 'factory',
        factoryNameField: 'factoryName',
        factoryValueField: 'Code',
        factoryLabelField: 'Name',
      },
      pasteCells: [[ProductArea]],
      afterPaste({ row, factoryDetail }) {
        Array.isArray(factoryDetail.Members) && Object.assign(row, getPersonByFactory(factoryDetail.Members));
      },
    });
}

/** 根据工厂获取人员信息 */
export function getPersonByFactory(members: Array<{ configType: string; memberId: string; memberName: string }>) {
  if (!Array.isArray(members)) {
    return {
      pdPersonId: '',
      pdPersonName: '',
      customsPersonId: '',
      customsPersonName: '',
    };
  }

  const pdTarget = members.find(item => item.configType === 'PDPerson');
  const cpTarget = members.find(item => item.configType === 'CustomsPerson');
  return {
    pdPersonId: pdTarget?.memberId || '',
    pdPersonName: pdTarget?.memberName || '',
    customsPersonId: cpTarget?.memberId || '',
    customsPersonName: cpTarget?.memberName || '',
  };
}
