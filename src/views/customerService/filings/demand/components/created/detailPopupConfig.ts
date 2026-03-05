import type { FormSchema } from '/@/components/Form';

import { getFactoryList } from '/@/api/engineering/sample';
import { statusOptions } from './config';

import { getinnermaterialnumberlist } from '/@/api/customerSerivce/index';
import { getHarhorList } from '/@/api/basicData/harhor';
import { useBaseStore } from '/@/store/modules/base';

const baseStore = useBaseStore();

/**
 * 申请表单配置
 */
export function getSchemas(setFieldsValue: any): Array<FormSchema> {
  return [
    {
      label: '来源单号',
      field: 'sourceNo',
      component: 'Input',
      componentProps: {
        disabled: true,
      },
    },
    {
      label: '备案需求单号',
      field: 'filingsApplyNo',
      component: 'Input',
      componentProps: {
        disabled: true,
      },
    },
    {
      label: '产品内部料号',
      field: 'insidePartNumber',
      component: 'ApiSelect',
      componentProps: {
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
        onChange: (_, option) => {
          const { TerminalCustomerMaterialNumber, DutyId, DutyName, DirectCustomerMaterialNumber, DirectCustomerName, ProductArea } = option || {};
          setFieldsValue({
            terminalCustomerPartNumber: TerminalCustomerMaterialNumber || '',
            immediateCustomerPartNumber: DirectCustomerMaterialNumber || '',
            immediateCustomerName: DirectCustomerName || '',
            factory: ProductArea || '',
            pdPersonId: DutyId || '',
            pdPersonName: DutyName || '',
          });
        },
      },
    },
    {
      label: '状态',
      field: 'status',
      component: 'Select',
      componentProps: {
        disabled: true,
        options: statusOptions,
        fieldNames: { label: 'fullName', value: 'id' },
      },
    },
    {
      label: '口岸',
      field: 'prot',
      component: 'ApiSelect',
      componentProps: {
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
    {
      label: '出货方式',
      field: 'shipmentType',
      component: 'ApiSelect',
      componentProps: {
        api: () => baseStore.getDictionaryData('ShipmentType'),
        showSearch: false,
        resultField: 'data',
        labelField: 'fullName',
        valueField: 'enCode',
        filterOption: false,
      },
    },
    {
      label: '出货备案法人',
      field: 'sellCorporation',
      component: 'Input',
      componentProps: {},
    },
    {
      label: '备案语言',
      field: 'filingsLanguage',
      component: 'ApiSelect',
      componentProps: {
        api: () => baseStore.getDictionaryData('FilingLanguage'),
        afterFetch: res => {
          console.warn('🚀 ~ getSchemas ~ res:', res);
          if (Array.isArray(res)) {
            return res.map(item => {
              return {
                ...item,
                enCode: +item.enCode,
              };
            });
          }
        },
        showSearch: false,
        resultField: 'data',
        labelField: 'fullName',
        valueField: 'enCode',
        filterOption: false,
      },
    },
    {
      label: '工厂',
      field: 'factory',
      component: 'ApiSelect',
      componentProps: {
        api: getFactoryList,
        showSearch: true,
        apiSearch: {
          show: true,
          searchName: 'Name',
        },
        resultField: 'data',
        labelField: 'Name',
        valueField: 'Code',
        filterOption: false,
      },
    },
    {
      label: '直接客户料号',
      field: 'immediateCustomerPartNumber',
      component: 'Input',
      componentProps: {
        disabled: true,
      },
    },
    {
      label: '终端客户料号',
      field: 'terminalCustomerPartNumber',
      component: 'Input',
      componentProps: {
        disabled: true,
      },
    },
    {
      label: '直接客户信息',
      field: 'immediateCustomerName',
      component: 'Input',
      componentProps: {
        disabled: true,
      },
    },
    {
      label: 'PD',
      field: 'pdPersonId',
      i18nField: 'pdPersonName',
      component: 'CustomUserSelect',
      componentProps: {},
    },
    {
      label: '客服',
      field: 'customersId',
      i18nField: 'customersName',
      component: 'CustomUserSelect',
      componentProps: {
        disabled: true,
      },
    },
    {
      label: '销售',
      field: 'salesId',
      i18nField: 'salesName',
      component: 'CustomUserSelect',
      componentProps: {
        disabled: true,
      },
    },
    {
      label: '销售',
      field: 'applyDate',
      component: 'DatePicker',
      componentProps: {
        disabled: true,
      },
    },
  ];
}
