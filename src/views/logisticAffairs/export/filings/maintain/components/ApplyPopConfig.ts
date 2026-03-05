import { useI18n } from '/@/hooks/web/useI18n';
import { getunitList } from '/@/api/common/constant';
import { getinnermaterialnumberlist } from '/@/api/customerSerivce/index';
import { getFactoryList } from '/@/api/basicData/factory';
import { useBaseStore } from '/@/store/modules/base';
import { http2s } from '/@/adapter/utils';
import { getAppEnvConfig } from '/@/utils/env';

const { t } = useI18n();
const baseStore = useBaseStore();

/** 单位列表 */
export const unitList: Array<any> = [];
async function loadUnitList() {
  return getunitList({ keyword: '' }).then(res => {
    const list = res.data || [];
    unitList.push(...list);
  });
}

export const factoryList: Array<any> = [];
async function loadFactoryList() {
  return getFactoryList().then(res => {
    const list = res.data || [];
    factoryList.push(...list);
  });
}

export const langList: Array<any> = [];
async function getLangList() {
  return baseStore.getDictionaryData('FilingLanguage').then((res: Array<any>) => {
    const list = res || [];
    langList.push(...list);
  });
}

const dictPromiseResolveList: Array<any> = [];
let isLoaded = false;
/** 提前加载下拉选项，用于复制和显示处理 */
export async function getDict() {
  if (dictPromiseResolveList.length === 0) {
    Promise.all([loadUnitList(), loadFactoryList(), getLangList()])
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

export function getEditTableColumn(columns: Array<any> = []) {
  return [
    {
      field: 'seq',
      title: t('component.table.index'),
      type: 'seq',
      width: '50',
      align: 'center',
    },
    ...columns,
    {
      title: t('common.action'),
      width: 60,
      slots: { default: 'action' },
      fixed: 'right',
      field: 'action',
    },
  ];
}

export const editRules = {};

export const fieldConfigMap = {
  insidePartNumber: {
    name: 'ApiSelect',
    props: {
      api: getinnermaterialnumberlist,
      showSearch: true,
      disabled: true,
      apiSearch: {
        show: true,
        searchName: 'InnerMaterialNumber',
      },
      resultField: 'data',
      labelField: 'InnerMaterialNumber',
      valueField: 'InnerMaterialNumber',
      filterOption: false,
      onChange: (_, option, params) => {
        handleInsidePartNumberChange(option, params);
      },
    },
  },
  declarationUnit: {
    name: 'ASelect',
    formComponentName: 'Select',
    props: {
      options: unitList,
      fieldNames: { label: 'Name', value: 'Code' },
    },
  },
  legalUnit: {
    name: 'ASelect',
    formComponentName: 'Select',
    props: {
      options: unitList,
      fieldNames: { label: 'Name', value: 'Code' },
    },
  },
  purchaser: {
    name: 'CustomUserSelect',
  },
  language: {
    name: 'ASelect',
    formComponentName: 'Select',
    props: {
      options: langList,
      fieldNames: { label: 'fullName', value: 'enCode' },
    },
  },
  productPicture: {
    name: 'ImageUpload',
    isSlot: true,
    // editSlot: 'imgUpload',
    defaultSlot: 'imgUpload',
    enabled: false,
    props: {
      version: 2,
    },
  },
  labelImage: {
    name: 'ImageUpload',
    isSlot: true,
    // editSlot: 'imgUpload',
    defaultSlot: 'imgUpload',
    enabled: false,
    props: {
      version: 2,
    },
  },
  declarationElementsYw: {
    name: 'Textarea',
    minWidth: 500,
    span: 12,
    // props: {
    //   autosize: false
    // }
  },
  declarationElementsZh: {
    name: 'Textarea',
    minWidth: 500,
    span: 12,
    // props: {
    //   autosize: false
    // }
  },
  materialQuality: {
    name: 'Textarea',
    minWidth: 300,
    span: 12,
    // props: {
    //   autosize: false
    // }
  },
  materialQualityYw: {
    name: 'Textarea',
    minWidth: 300,
    span: 12,
    // props: {
    //   autosize: false
    // }
  },
  purpose: {
    name: 'Textarea',
    minWidth: 300,
    span: 12,
    // props: {
    //   autosize: false
    // }
  },
};

export function handleInsidePartNumberChange(option, { row, $grid }) {
  const { TerminalCustomerMaterialNumber, DutyId, DutyName, DirectCustomerMaterialNumber, DirectCustomerName, ProductArea } = option || {};
  $grid.setRow(row, {
    terminalCustomerPartNumber: TerminalCustomerMaterialNumber || '',
    immediateCustomerPartNumber: DirectCustomerMaterialNumber || '',
    immediateCustomerName: DirectCustomerName || '',
    factory: ProductArea || '',
    factoryName: factoryList.find(item => item.Code === ProductArea)?.Name || '',
    pdPersonId: DutyId || '',
    pdPersonName: DutyName || '',
  });
}

function normalizeUrls(urls: any): string[] {
  if (Array.isArray(urls)) {
    return urls;
  }
  if (typeof urls === 'string') {
    return urls.split(',').filter(Boolean);
  }
  return [];
}

function processItemUrl(item: string): string {
  const { VITE_GLOB_API_URL } = getAppEnvConfig();
  if (item.startsWith('https')) {
    return item;
  }
  if (item.startsWith('http')) {
    return http2s(item);
  }
  return VITE_GLOB_API_URL + `/api/Information/FileInfo/Download/${item}`;
}
/**
 * 将图片路径由`,`分割的字符串转化为数组
 * @param urls
 */
export function formatImageStringToList(urls: string, isOnlyShow = false) {
  if (typeof urls !== 'string') {
    return urls;
  }
  // const list = Array.isArray(urls) ? urls : urls ? urls.split(',').filter(Boolean) : [];
  // const { VITE_GLOB_API_URL } = getAppEnvConfig();
  // const imgList = !isOnlyShow
  //   ? list.map((item: string) => item.replaceAll(/^(.*)(?=DocumentFile)/g, ''))
  //   : list.map((item: string) =>
  //       item.startsWith('https') ? item : item.startsWith('http') ? http2s(item) : VITE_GLOB_API_URL + '/api/Information/FileInfo/Download/' + item,
  //     );
  const list = normalizeUrls(urls);
  const imgList = isOnlyShow ? list.map(processItemUrl) : list.map((item: string) => item.replaceAll(/^(.*)(?=DocumentFile)/g, ''));
  return imgList;
}

/**
 * 获取表格列配置
 * @param list
 */
export function getColumns(list: Array<{ systemField: string; moldeField: string; translateField: string; isUpdate: 0 | 1; jsonId: string }>) {
  return getEditTableColumn(
    list.map(item => {
      const fieldConfig = fieldConfigMap[item.systemField];
      return {
        title: item.translateField,
        field: item.jsonId,
        width: fieldConfig?.minWidth || 180,
        editRender: {
          enabled: Boolean(item.isUpdate) && fieldConfig?.enabled !== false,
          name: fieldConfig?.isSlot ? '' : fieldConfig?.name || 'Input',
          props: fieldConfig?.props || {},
        },
        ...(fieldConfig?.isSlot ? { slots: { default: fieldConfig?.defaultSlot, edit: fieldConfig?.editSlot } } : {}),
      };
    }),
  );
}
