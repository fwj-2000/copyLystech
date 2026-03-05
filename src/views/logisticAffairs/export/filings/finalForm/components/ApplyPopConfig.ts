import { useI18n } from '/@/hooks/web/useI18n';
import { FILING_TYPE_ENUM } from '../config';
import { getunitList } from '/@/api/common/constant';

const { t } = useI18n();

/** 单位列表 */
export const unitList: Array<any> = [];
async function loadUnitList() {
  return getunitList({ keyword: '' }).then(res => {
    const list = res.data || [];
    unitList.push(...list);
  });
}

const dictPromiseResolveList: Array<any> = [];
let isLoaded = false;
/** 提前加载下拉选项，用于复制和显示处理 */
export async function getDict() {
  if (dictPromiseResolveList.length === 0) {
    // Promise.all([loadUnitList()])
    loadUnitList()
      .catch(e => {
        console.warn('🚀 ~ getDict.catch ~ e:', e);
      })
      .finally(() => {
        dictPromiseResolveList.forEach(resolve => resolve());
        isLoaded = true;
      });
  }
  return isLoaded ? Promise.resolve() : new Promise(resolve => dictPromiseResolveList.push(resolve));
}
await getDict();

export const columnsMap = {
  [FILING_TYPE_ENUM.出口内地备案表]: [
    {
      title: '项目名称',
      field: 'terminalCustomerProjectCode',
      disabled: true,
      width: 160,
    },
    {
      title: '客户料号',
      field: 'immediateCustomerPartNumber',
      disabled: true,
      width: 160,
    },
    {
      title: '客户备案品名',
      field: 'goodsName',
      width: 160,
      editRender: {
        name: 'Input',
        props: {},
      },
    },
    {
      title: '规格尺寸(MM)',
      field: 'specSize',
      width: 160,
      editRender: {
        name: 'Input',
        props: {},
      },
    },
    {
      title: '客户商品编码',
      field: 'goodsCode',
      width: 160,
      editRender: {
        name: 'Input',
        props: {},
      },
    },
    {
      title: '客户备案单重(KG)',
      field: 'weight',
      width: 160,
      editRender: {
        name: 'Input',
        props: {},
      },
    },
    {
      title: '申报要素',
      field: 'declElements',
      width: 300,
      editRender: {
        name: 'Textarea',
        props: {
          autosize: { minRows: 4, maxRows: 4 },
        },
      },
    },
    {
      title: '产品内部料号',
      field: 'insidePartNumber',
      disabled: true,
      width: 200,
    },
    {
      title: '客户',
      field: 'immediateCustomerName',
      disabled: true,
      width: 160,
    },
    {
      title: '口岸',
      field: 'prot',
      formatter: ({ row }) => row.protName || row.prot,
      width: 160,
    },
    {
      title: '账册类型',
      field: 'accountType',
      width: 160,
      editRender: {
        name: 'Input',
        props: {},
      },
    },
    {
      title: '申报单位',
      field: 'declUnit',
      width: 160,
      editRender: {
        name: 'ASelect',
        props: {
          options: unitList,
          fieldNames: { label: 'Name', value: 'Code' },
        },
      },
    },
    {
      title: '法定单位',
      field: 'legalUnit',
      width: 160,
      editRender: {
        name: 'ASelect',
        props: {
          options: unitList,
          fieldNames: { label: 'Name', value: 'Code' },
        },
      },
    },
    {
      title: '客服',
      field: 'customersName',
      disabled: true,
      width: 180,
    },
    {
      title: '备注',
      field: 'remark',
      width: 200,
      editRender: {
        name: 'Input',
        props: {},
      },
    },
    {
      title: '材质成分',
      field: 'materialQuality',
      width: 300,
      editRender: {
        name: 'Textarea',
        props: {
          autosize: { minRows: 4, maxRows: 4 },
        },
      },
    },
    {
      title: '原产国',
      field: 'originCountry',
      width: 160,
      editRender: {
        name: 'Input',
        props: {},
      },
    },
    {
      title: '境内货源地',
      field: 'goodDomesticSource',
      width: 160,
      editRender: {
        name: 'Input',
        props: {},
      },
    },
  ],
  [FILING_TYPE_ENUM.出港备案表]: [
    {
      title: '项目名称',
      field: 'terminalCustomerProjectCode',
      disabled: true,
      width: 160,
    },
    {
      title: '客户料号',
      field: 'immediateCustomerPartNumber',
      disabled: true,
      width: 160,
    },
    {
      title: '产品内部料号',
      field: 'insidePartNumber',
      width: 200,
      disabled: true,
    },
    {
      title: '品名',
      field: 'goodsName',
      width: 160,
      editRender: {
        name: 'Input',
        props: {},
      },
    },
    {
      title: '客户商品编码',
      field: 'goodsCode',
      width: 160,
      editRender: {
        name: 'Input',
        props: {},
      },
    },
    // {
    //   title: 'CIQ代码',
    //   field: 'ciqCode',
    //   width: 160,
    //   editRender: {
    //     name: 'Input',
    //     props: {},
    //   },
    // },
    {
      title: '单重(KG)',
      field: 'weight',
      width: 160,
      editRender: {
        name: 'Input',
        props: {},
      },
    },
    {
      title: '申报要素',
      field: 'declElements',
      width: 300,
      editRender: {
        name: 'Textarea',
        props: {
          autosize: { minRows: 4, maxRows: 4 },
        },
      },
    },
    {
      title: '规格尺寸',
      field: 'specSize',
      width: 160,
      editRender: {
        name: 'Input',
        props: {},
      },
    },
    {
      title: '材质成分',
      field: 'materialQuality',
      width: 300,
      editRender: {
        name: 'Textarea',
        props: {
          autosize: { minRows: 4, maxRows: 4 },
        },
      },
    },
    {
      title: '用途',
      field: 'purpose',
      width: 300,
      editRender: {
        name: 'Textarea',
        props: {
          autosize: { minRows: 4, maxRows: 4 },
        },
      },
    },
    {
      title: '申报单位',
      field: 'declUnit',
      width: 160,
      editRender: {
        name: 'ASelect',
        props: {
          options: unitList,
          fieldNames: { label: 'Name', value: 'Code' },
        },
      },
    },
    {
      title: '法定单位',
      field: 'legalUnit',
      width: 160,
      editRender: {
        name: 'ASelect',
        props: {
          options: unitList,
          fieldNames: { label: 'Name', value: 'Code' },
        },
      },
    },
    {
      title: '原产国',
      field: 'originCountry',
      width: 160,
      editRender: {
        name: 'Input',
        props: {},
      },
    },
    {
      title: '地区',
      field: 'area',
      width: 160,
      editRender: {
        name: 'Input',
        props: {},
      },
    },
    {
      title: '客服',
      field: 'customersName',
      width: 180,
      disabled: true,
    },
  ],
};

export function getEditTableColumn(type: `${FILING_TYPE_ENUM}` = FILING_TYPE_ENUM.出口内地备案表) {
  const columns = columnsMap[type];

  return [
    {
      field: 'seq',
      title: t('component.table.index'),
      type: 'seq',
      width: '50',
      align: 'center',
    },
    ...(columns || []),
    {
      title: t('common.action'),
      width: 60,
      slots: { default: 'action' },
      fixed: 'right',
      field: 'action',
    },
  ];
}

export const editRules = {
  goodsName: [{ required: true, message: t('common.required') }],
  specSize: [{ required: true, message: t('common.required') }],
  goodsCode: [{ required: true, message: t('common.required') }],
  weight: [{ required: true, message: t('common.required') }],
  declElements: [{ required: true, message: t('common.required') }],
  declUnit: [{ required: true, message: t('common.required') }],
  legalUnit: [{ required: true, message: t('common.required') }],
  // ciqCode: [{ required: true, message: t('common.required') }],
};
