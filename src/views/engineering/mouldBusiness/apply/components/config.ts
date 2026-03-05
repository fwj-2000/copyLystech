import { useBaseStore } from '/@/store/modules/base';
import { getSelectList } from '/@/api/business/shippingspace';
import { getCostcenterlist, getInnermaterialnumberlist } from '/@/api/engineering/mould';
import { getMoldpurposelist } from '/@/api/engineering/costCenter';
import { getSapFactoryList } from '/@/api/purchase/supplierInformation';
import { getFactorySap, getProductType } from '/@/api/engineering/pcc';
import { useI18n } from '/@/hooks/web/useI18n';
import mitt from '/@/utils/mitt';
import { MD5 } from 'crypto-js';
// import { useMessage } from '/@/hooks/web/useMessage';
import { nextTick } from 'vue';
import { getPartNumberFactoryList } from '/@/api/basicData/factory';

// const { createMessage } = useMessage();
const { t } = useI18n();
const baseStore = useBaseStore();
/* 联动逻辑
料号 insidePartNumber》 
字段：insideProjectCode、immediateCustomerCode、factory、salespersonId、moldPurchaseId；
字段远程值：sapFactory、costCenter、costAttribution；
下拉选项：productTypeApplylist

模具类型 moldType》
字段：moldRemark

模具用途 moldUse》
远程字段：costCenter、costAttribution

工厂 factory》
字段：costCenter、costAttribution
远程字段：sapFactory
下拉选项：productTypeApplylist

业务类型 businessType》
远程字段：sapFactory
字段：costCenter、costAttribution

是否报税 isBonded》
远程字段：sapFactory

成本中心 costCenter》
字段：costAttribution
*/
type Events = {
  insidePartNumberChange: { val; data; row };
  moldUseChange: { val; data; row };
  moldTypeChange: { val; data; row };
  factoryChange: { val; data; row };
  businessTypeChange: { val; data; row };
  isBondedChange: { val; data; row };
  costCenterChange: { val; data; row };
};
// export const testEmitter = mitt();
// testEmitter.on('test', e => alert(e));
export const applyAddEmitter = mitt<Events>(); //推断为 Emitter<Events>
export const MODULE_TEMPLATE = {
  moldDrawingsId: null,
  moldNo: null,
  // urgentLevel: '1',
  urgentLevel: null,
  // urgentLevelName: t('dict.urgentLevel.1'),
  urgentLevelName: '',
  moldType: null,
  moldTypeName: null,
  estimateLifespan: null,
  insidePartNumber: null,
  moldRemark: null,
  insideProjectCode: null,
  immediateCustomerCode: null,
  factory: null,
  factoryName: null,
  isBonded: null,
  businessType: null,
  sapFactory: null,
  moldPurchaseId: null,
  moldPurchaseName: null,
  moldUse: null,
  costCenter: null,
  costAttribution: null,
  productType: null,
  productTypeName: null,
  mainMaterialThickness: null,
  projectPhase: null,
  quantity: 1,
  // quantity: null,
  salespersonId: null,
  salespersonName: null,
  requireDeliveryTime: null,
};
//代理请求，减少表格编辑框的重复请求
export class ApiCacheProxy {
  cache: Map<any, any>;
  constructor() {
    // 使用 Map 来存储缓存数据，键为 API 请求的标识，值为请求的结果数据
    this.cache = new Map();
  }

  // 实现代理方法，传入 API 请求的 Promise 和一个唯一的 API 标识
  async get(apiPromise, _userKey, apiParam?: object) {
    const method = MD5(apiPromise.toString()).toString();
    let params = ''; //
    // 有实质性参数
    if (
      typeof apiParam === 'object' &&
      apiParam !== null &&
      Object.keys(apiParam).length > 0 &&
      Object.values(apiParam).every(value => {
        // 都不为空
        return value !== null && value !== undefined && value !== '';
      })
    ) {
      params = MD5(JSON.stringify(apiParam)).toString();
    }

    const apiKey = method + params;
    // 判断是否已经缓存了该 API 的数据
    if (this.cache.has(apiKey)) {
      // 如果缓存存在，直接返回缓存的数据
      return this.cache.get(apiKey);
    }

    //没缓存，但该api已经存过一个不同参数缓存版本
    let existOne = this.cache.keys().find(x => x.startsWith(method));
    if (existOne !== void 0 && existOne != apiKey) {
      this.clear(existOne);
    }
    try {
      // 如果未缓存，执行 API 请求的 Promise
      const result = await apiPromise(apiParam);
      // 将请求结果缓存
      this.cache.set(apiKey, result);
      // 返回请求结果
      return result;
    } catch (error) {
      // 捕获请求错误
      console.error('API Proxy request error:', error);
      throw error; // 重新抛出错误，以便调用者可以处理
    }
  }

  // 可选：实现一个方法来清除特定 API 的缓存
  clear(apiKey) {
    if (this.cache.has(apiKey)) {
      this.cache.delete(apiKey);
    }
  }

  // 可选：实现一个方法来清除所有缓存
  clearAll() {
    this.cache.clear();
  }
}
export const proxy = new ApiCacheProxy();
export const BATCH_COLUMNS: any[] = [
  {
    title: '模具料号',
    field: 'moldNo',
    width: 260,
    editRender: {
      enabled: true,
      name: 'Input',
      props: {
        placeholder: t('common.example') + ': CF-JFDA114ABCD-AD001',
      },
    },
    slots: {
      edit: 'moldNo',
    },
  },
  {
    title: '产品内部料号',
    field: 'insidePartNumber',
    width: 220,
    formatter: 'ApiSelect',
    editRender: {
      name: 'ApiSelect',
      cacheField: 'insidePartNumber',
      props: {
        api: getInnermaterialnumberlist,
        params: {
          pageSize: 20,
        },
        showSearch: true,
        apiSearch: {
          show: true,
          searchName: 'InnerMaterialNumber',
        },
        resultField: 'data',
        labelField: 'insidePartNumber',
        valueField: 'insidePartNumber',
        filterOption: false,
        notFoundContent: null,
        dynamicDisabled: (row: any) => {
          return !!row.insidePartNumberOld;
        },
        onChange: (val, data, { row }) => {
          console.log('🚀 ~ onChange ~ type, data, row: ', val, data, row);
          applyAddEmitter.emit('insidePartNumberChange', { val, data, row });
          // testEmitter.emit('test', { test: 'test' });
        },
      },
    },
  },
  {
    title: '旧版成品编码',
    field: 'insidePartNumberOld',
    width: 180,
    editRender: {
      name: 'Input',
      props: {
        dynamicDisabled: (row: any) => {
          return !!row.insidePartNumber;
        },
        onChange: (_e: InputEvent, { row }) => {
          setInsideProjectCodeByOldPartNumber(row);
        },
      },
    },
  },
  {
    title: '模具类型',
    field: 'moldType',
    i18nField: 'moldTypeName',
    width: 180,
    formatter: 'ApiSelect',
    editRender: {
      name: 'ApiSelect',
      cacheField: 'moldTypeName',
      props: {
        api: () => baseStore.getDictionaryData('MoldApply.MoldType'),
        showSearch: false,
        // preciseParam: 'materialWidth',
        filterOption: false,
        notFoundContent: null,
        resultField: 'data',
        labelField: 'fullName',
        valueField: 'enCode',
        immediate: true,
        onChange: (val, data, { row }) => {
          row.moldType = val || '';
          row.moldTypeName = data?.label || '';
          applyAddEmitter.emit('moldTypeChange', { val, data, row });
          // row.moldRemark = data.label;
        },
      },
    },
  },
  {
    title: '模具用途',
    field: 'moldUse',
    width: 180,
    formatter: 'ApiSelect',
    editRender: {
      name: 'ApiSelect',
      cacheField: 'moldUse',
      props: {
        api: getMoldpurposelist.bind(null, { status: 1 }),
        showSearch: false,
        // preciseParam: 'materialWidth',
        filterOption: false,
        notFoundContent: null,
        resultField: 'data',
        labelField: 'moldPurpose',
        valueField: 'moldPurpose',
        immediate: true,
        onChange: (val, data, { row }) => {
          applyAddEmitter.emit('moldUseChange', { val, data, row });
        },
      },
    },
  },
  {
    title: '预估寿命(KPCS)',
    field: 'estimateLifespan',
    isEdit: true,
    width: 150,
    editRender: {
      name: 'InputNumber',
      props: { min: 0, precision: 0 },
    },
  },
  {
    title: '项目阶段',
    field: 'projectPhase',
    i18nField: 'projectPhaseName',
    formatter: 'ApiSelect',
    width: 200,
    editRender: {
      name: 'ApiSelect',
      cacheField: 'projectPhaseName',
      props: {
        api: () => baseStore.getDictionaryData('MoldApply.ProjectPhase'),
        labelField: 'fullName',
        valueField: 'enCode',
        immediate: true,
        filterOption: true,
        onChange: (e, data, { row }) => {
          row.projectPhase = e || '';
          row.projectPhaseName = data?.label || '';
        },
      },
    },
  },
  {
    title: '主材厚度(MM)',
    field: 'mainMaterialThickness',
    isEdit: true,
    width: 140,
    editRender: {
      name: 'InputNumber',
      props: { min: 0 },
    },
  },
  {
    title: '工厂',
    field: 'factory',
    i18nField: 'factoryName',
    formatter: 'ApiSelect',
    width: 180,
    editRender: {
      name: 'ApiSelect',
      cacheField: 'factoryName',
      props: {
        api: getPartNumberFactoryList,
        rowParams: {
          partNumber: 'insidePartNumber',
        },
        showSearch: false,
        // preciseParam: 'materialWidth',
        filterOption: false,
        resultField: 'data',
        labelField: 'Name',
        valueField: 'Code',
        immediate: true,
        onChange: (val, data, { row }) => {
          row.factory = val || '';
          row.factoryName = data?.label || '';
          applyAddEmitter.emit('factoryChange', { val, data, row });
          setPeronByFactory(row, data);
          // row.sapFactory = '';
          // row.sapFactoryName = '';
          // row.sapFactoryOptions = ((await baseStore.getDictionaryData(v + 'SapFactory')) || []).map(el => {
          //   return {
          //     value: el.enCode,
        },
      },
    },
    onRowChange: getSapFactory,
  },
  {
    title: '业务类型',
    field: 'businessType',
    i18nField: 'CommonCol.businessType',
    formatter: 'ApiSelect',
    width: 180,
    editRender: {
      name: 'ApiSelect',
      cacheField: 'businessTypeName',
      props: {
        api: () => baseStore.getDictionaryData('SapFactoryMaterial', true),
        filterOption: false,
        notFoundContent: null,
        immediate: true,
        labelField: 'fullName',
        valueField: 'enCode',
        onChange: (val, data, { row }) => {
          row.businessType = val || '';
          row.businessTypeName = data?.label || '';
          applyAddEmitter.emit('businessTypeChange', { val, data, row });
        },
      },
    },
  },
  {
    field: 'isBonded',
    i18nField: 'CommonCol.isBonded',
    title: '是否保税',
    width: 180,
    className: 'form-required',
    // defaultValue: false,
    editRender: {
      name: 'ASelect',
      props: {
        options: [
          {
            fullName: '是',
            enCode: true,
          },
          {
            fullName: '否',
            enCode: false,
          },
        ],
        fieldNames: {
          value: 'enCode',
          label: 'fullName',
        },
        onChange: (val, data, { row }) => {
          applyAddEmitter.emit('isBondedChange', { val, data, row });
        },
      },
    },
  },
  {
    field: 'sapFactory',
    title: 'SAP工厂代码',
    width: 200,
    formatter: 'ApiSelect',
    editRender: {
      name: 'ApiSelect',
      cacheField: 'sapFactoryName',
      props: {
        disabled: true,
        api: proxy.get(getSapFactoryList, 'sapfactory'),
        apiSearch: {
          show: true,
          searchName: 'keyword',
        },
        resultField: 'data',
        labelField: 'code',
        valueField: 'code',
        // nameFormat: ['name', '(', 'code', ')'],
        showSearch: true,
        immediate: true,
        filterOption: false,
        notFoundContent: null,
      },
    },
  },
  {
    field: 'shippingSpaceCode',
    title: '仓位',
    width: 200,
    formatter: 'ApiSelect',
    editRender: {
      name: 'ApiSelect',
      cacheField: 'shippingSpaceName',
      props: {
        // disabled: true,
        api: getSelectList, //proxy.get(, 'shippingSpaceCode'),
        params: { status: 1, type: 3 },
        rowParams: {
          factoryCode: 'factory',
          sapFactoryCode: 'sapFactory',
        },
        apiSearch: {
          show: true,
          searchName: 'shippingSpace',
        },
        resultField: 'data',
        labelField: 'shippingSpaceName',
        valueField: 'shippingSpaceCode',
        nameFormat: ['shippingSpaceCode', '/', 'shippingSpaceName'],
        showSearch: true,
        immediate: true,
        filterOption: false,
        notFoundContent: null,
        delay: 0,
        onChange: (_val, data, { row }) => {
          row.shippingSpaceCode = data?.value || '';
          row.shippingSpaceName = data?.label || '';
        },
      },
    },
  },
  {
    title: '产品类型',
    field: 'productType',
    i18nField: 'productTypeName',
    width: 180,
    formatter: 'ApiSelect',
    editRender: {
      name: 'ApiSelect',
      cacheField: 'productTypeName',
      props: {
        api: getProductType,
        params: {
          pageSize: 20,
        },
        showSearch: true,
        apiSearch: {
          show: true,
          searchName: 'productCategory',
        },
        rowParams: {
          factory: 'factory',
          bussniessType: 'businessType',
        },
        resultField: 'data',
        labelField: 'productCategory',
        valueField: 'id',
        filterOption: false,
      },
    },
  },
  {
    title: '要求交期',
    field: 'requireDeliveryTime',
    width: 180,
    editRender: {
      name: 'DatePicker',
      props: {
        valueFormat: 'YYYY-MM-DD',
      },
    },
  },
  {
    title: '紧急程度',
    field: 'urgentLevel',
    i18nField: 'urgentLevelName',
    formatter: 'ApiSelect',
    defaultVal: '1',
    width: 180,
    // customRender: ({ record }) => {
    //   return record.urgentLevel ? String(record.urgentLevel) : '';
    // },
    editRender: {
      name: 'ApiSelect',
      cacheField: 'urgentLevelName',
      props: {
        labelField: 'fullName',
        valueField: 'enCode',
        filterOption: true,
        immediate: true,
        api: () => baseStore.getDictionaryData('MoldApply.UrgentLevel', true),
        onChange: (e, data, { row }) => {
          row.urgentLevel = e || '';
          row.urgentLevelName = data?.label || '';
        },
      },
    },
  },
  {
    title: '模具采购',
    field: 'moldPurchaseId',
    width: 180,
    editRender: {
      cacheField: 'moldPurchaseName',
      name: 'CustomUserSelect',
    },
  },
];
export const ADD_COLUMNS: any[] = [
  {
    type: 'checkbox',
    width: 50,
  },
  { title: '模具图纸', field: 'moldDrawings', width: 180, i18nField: 'moldDrawingsName', slots: { default: 'moldDrawings' } },
  {
    title: '模具料号',
    field: 'moldNo',
    width: 260,
    editRender: {
      enabled: true,
      name: 'Input',
      props: {},
    },
    // titlePrefix: {
    //   content: t('common.example') + ': CF-ASDQ111A-AS001',
    // },
    slots: {
      edit: 'moldNo',
    },
  },
  {
    title: '产品内部料号',
    field: 'insidePartNumber',
    width: 220,
    formatter: 'ApiSelect',
    editRender: {
      name: 'ApiSelect',
      cacheField: 'insidePartNumber',
      props: {
        api: getInnermaterialnumberlist,
        showSearch: true,
        apiSearch: {
          show: true,
          searchName: 'innerMaterialNumber',
        },
        params: {
          pageSize: 20,
        },
        resultField: 'data',
        labelField: 'insidePartNumber',
        valueField: 'insidePartNumber',
        filterOption: false,
        notFoundContent: null,
        dynamicDisabled: (row: any) => {
          return !!row.insidePartNumberOld;
        },
        onChange: (val, data, { row }) => {
          console.log('🚀 ~ onChange ~ type, data, row: ', val, data, row);
          applyAddEmitter.emit('insidePartNumberChange', { val, data, row });
        },
      },
    },
  },
  {
    title: '旧版成品编码',
    field: 'insidePartNumberOld',
    width: 180,
    editRender: {
      name: 'Input',
      props: {
        dynamicDisabled: (row: any) => {
          return !!row.insidePartNumber;
        },
        onChange: (_e: InputEvent, { row }) => {
          setInsideProjectCodeByOldPartNumber(row);
        },
      },
    },
  },
  {
    title: '内部项目代码',
    field: 'insideProjectCode',
    width: 180,
    editRender: {
      name: 'Input',
      props: {
        placeholder: t('common.autoCarry'),
        // disabled: true,
      },
    },
  },
  {
    title: '直接客户代码',
    field: 'immediateCustomerCode',
    isEdit: true,
    inputType: '',
    cpmType: 'Input',
    width: 180,
    editRender: {
      name: 'Input',
      props: {
        dynamicDisabled: (row: any) => {
          // 料号为旧版成品编码时，允许PD手动填写，并且是必填
          return !row.insidePartNumberOld;
        },
      },
    },
  },
  {
    title: '模具类型',
    field: 'moldType',
    i18nField: 'moldTypeName',
    formatter: 'ApiSelect',
    width: 180,
    editRender: {
      name: 'ApiSelect',
      cacheField: 'moldTypeName',
      props: {
        api: () => baseStore.getDictionaryData('MoldApply.MoldType'),
        showSearch: false,
        // preciseParam: 'materialWidth',
        filterOption: false,
        notFoundContent: null,
        resultField: 'data',
        labelField: 'fullName',
        valueField: 'enCode',
        immediate: true,
        onChange: (val, data, { row }) => {
          row.moldType = val || '';
          row.moldTypeName = data?.label || '';
          applyAddEmitter.emit('moldTypeChange', { val, data, row });
          // row.moldRemark = data.label;
        },
      },
    },
  },
  {
    title: '模具备注',
    field: 'moldRemark',
    width: 180,
    editRender: {
      name: 'Input',
    },
  },
  {
    title: '模具用途',
    field: 'moldUse',
    formatter: 'ApiSelect',
    width: 180,
    editRender: {
      name: 'ApiSelect',
      cacheField: 'moldUse',
      props: {
        api: () => proxy.get(getMoldpurposelist, 'moldUse', { status: 1 }),
        showSearch: false,
        // preciseParam: 'materialWidth',
        filterOption: false,
        notFoundContent: null,
        resultField: 'data',
        labelField: 'moldPurpose',
        valueField: 'moldPurpose',
        immediate: true,
        onChange: (val, data, { row }) => {
          applyAddEmitter.emit('moldUseChange', { val, data, row });
        },
      },
    },
  },
  {
    title: '预估寿命(KPCS)',
    field: 'estimateLifespan',
    isEdit: true,
    width: 150,
    editRender: {
      name: 'InputNumber',
      props: { min: 0, precision: 0 },
    },
  },
  {
    title: '项目阶段',
    field: 'projectPhase',
    i18nField: 'projectPhaseName',
    formatter: 'ApiSelect',
    width: 200,
    editRender: {
      name: 'ApiSelect',
      cacheField: 'projectPhaseName',
      props: {
        api: () => baseStore.getDictionaryData('MoldApply.ProjectPhase'),
        labelField: 'fullName',
        valueField: 'enCode',
        immediate: true,
        filterOption: true,
        onChange: (e, data, { row }) => {
          row.projectPhase = e || '';
          row.projectPhaseName = data?.label || '';
        },
      },
    },
  },
  {
    title: '主材厚度(MM)',
    field: 'mainMaterialThickness',
    isEdit: true,
    width: 140,
    editRender: {
      name: 'InputNumber',
      props: { min: 0 },
    },
  },
  {
    title: '工厂',
    field: 'factory',
    i18nField: 'factoryName',
    formatter: 'ApiSelect',
    width: 180,
    editRender: {
      name: 'ApiSelect',
      cacheField: 'factoryName',
      props: {
        api: (params: any) => proxy.get(getPartNumberFactoryList, 'factory', params),
        rowParams: {
          partNumber: 'insidePartNumber',
        },
        showSearch: false,
        // preciseParam: 'materialWidth',
        filterOption: false,
        resultField: 'data',
        labelField: 'Name',
        valueField: 'Code',
        immediate: true,
        onChange: (val, data, { row }) => {
          row.factory = val || '';
          row.factoryName = data?.label || '';
          applyAddEmitter.emit('factoryChange', { val, data, row });
          setPeronByFactory(row, data);
        },
      },
    },
    // onRowChange: getSapFactory,
  },
  {
    title: '业务类型',
    field: 'businessType',
    i18nField: 'CommonCol.businessType',
    formatter: 'ApiSelect',
    width: 180,
    editRender: {
      name: 'ApiSelect',
      cacheField: 'businessTypeName',
      props: {
        api: () => baseStore.getDictionaryData('SapFactoryMaterial', true),
        filterOption: false,
        notFoundContent: null,
        immediate: true,
        labelField: 'fullName',
        valueField: 'enCode',
        onChange: (val, data, { row }) => {
          row.businessType = val || '';
          row.businessTypeName = data?.label || '';
          applyAddEmitter.emit('businessTypeChange', { val, data, row });
        },
      },
    },
    // onRowChange: getSapFactory,
  },
  {
    field: 'isBonded',
    title: '是否保税',
    i18nField: 'CommonCol.isBonded',
    className: 'form-required',
    defaultValue: false,
    width: 180,
    editRender: {
      name: 'ASelect',
      props: {
        options: [
          {
            fullName: t('common.yes'),
            enCode: true,
          },
          {
            fullName: t('common.no'),
            enCode: false,
          },
        ],
        fieldNames: {
          value: 'enCode',
          label: 'fullName',
        },
        onChange: (val, data, { row }) => {
          row.isBonded = data ? val : '';
          row.isBondedName = data?.label || '';
          applyAddEmitter.emit('isBondedChange', { val, data, row });
        },
      },
    },
    // onRowChange: getSapFactory,
  },
  {
    field: 'sapFactory',
    title: 'SAP工厂代码',
    width: 200,
    formatter: 'ApiSelect',
    editRender: {
      name: 'ApiSelect',
      cacheField: 'sapFactoryName',
      props: {
        disabled: true,
        api: () => proxy.get(getSapFactoryList, 'sapfactory'), //getSapFactoryList,
        apiSearch: {
          show: true,
          searchName: 'keyword',
        },
        afterFetch: res => {
          //去重
          res.data = res.data.filter((item, index, self) => {
            return self.findIndex(i => i.code === item.code) === index;
          });
        },
        resultField: 'data',
        labelField: 'code',
        valueField: 'code',
        // nameFormat: ['name', '(', 'code', ')'],
        showSearch: true,
        immediate: true,
        filterOption: false,
        notFoundContent: null,
      },
    },
  },
  {
    field: 'shippingSpaceCode',
    title: '仓位',
    width: 200,
    formatter: 'ApiSelect',
    editRender: {
      name: 'ApiSelect',
      cacheField: 'shippingSpaceName',
      props: {
        // disabled: true,
        api: getSelectList, //proxy.get(getSelectList, 'shippingSpaceCode'),
        params: { status: 1, type: 3 },
        rowParams: {
          factoryCode: 'factory',
          sapFactoryCode: 'sapFactory',
        },
        apiSearch: {
          show: true,
          searchName: 'shippingSpaceName',
        },
        resultField: 'data',
        labelField: 'shippingSpaceName',
        valueField: 'shippingSpaceCode',
        nameFormat: ['shippingSpaceCode', '/', 'shippingSpaceName'],
        showSearch: true,
        immediate: true,
        filterOption: false,
        notFoundContent: null,
        delay: 0,
        onChange: (_val, data, { row }) => {
          row.shippingSpaceCode = data?.value || '';
          row.shippingSpaceName = data?.label || '';
        },
      },
    },
  },
  {
    title: '产品类型',
    field: 'productType',
    i18nField: 'productTypeName',
    formatter: 'ApiSelect',
    width: 180,
    editRender: {
      name: 'ApiSelect',
      cacheField: 'productTypeName',
      props: {
        api: getProductType,
        params: {
          pageSize: 20,
        },
        showSearch: true,
        apiSearch: {
          show: true,
          searchName: 'productCategory',
        },
        rowParams: {
          factory: 'factory',
          bussniessType: 'businessType',
        },
        resultField: 'data',
        labelField: 'productCategory',
        valueField: 'id',
        filterOption: false,
      },
    },
  },
  {
    title: '要求交期',
    field: 'requireDeliveryTime',
    width: 180,
    editRender: {
      name: 'DatePicker',
      props: {
        valueFormat: 'YYYY-MM-DD',
      },
    },
  },
  {
    title: '紧急程度',
    field: 'urgentLevel',
    i18nField: 'urgentLevelName',
    formatter: 'ApiSelect',
    defaultVal: 1,
    width: 180,
    // customRender: ({ record }) => {
    //   return record.urgentLevel ? String(record.urgentLevel) : '';
    // },
    editRender: {
      name: 'ApiSelect',
      cacheField: 'urgentLevelName',
      props: {
        labelField: 'fullName',
        valueField: 'enCode',
        filterOption: true,
        immediate: true,
        api: () => baseStore.getDictionaryData('MoldApply.UrgentLevel', true),
        onChange: (val, data, { row }) => {
          row.urgentLevel = val || '';
          row.urgentLevelName = data?.label || '';
        },
      },
    },
  },
  {
    title: '模具采购',
    field: 'moldPurchaseId',
    width: 180,
    editRender: {
      cacheField: 'moldPurchaseName',
      name: 'CustomUserSelect',
    },
  },
  {
    title: '销售',
    field: 'salespersonId',
    i18nField: 'salespersonName',
    width: 180,
    editRender: {
      cacheField: 'salespersonName',
      name: 'CustomUserSelect',
    },
  },
  {
    title: '成本中心',
    field: 'costCenter',
    isEdit: true,
    inputType: '',
    width: 260,
    cpmType: 'ApiSelect',
    editRender: {
      name: 'ApiSelect',
      // dynamicOptionsField: 'costCenterOptions',
      props: {
        api: async param => {
          if (!param.moldPurpose || !param.factory || !param.businessType) {
            return;
          }
          return proxy.get(getCostcenterlist, 'costCenter', param);
        },
        rowParams: {
          factory: 'factory',
          moldPurpose: 'moldUse',
          businessType: 'businessType',
        },
        resultField: 'data',
        valueField: 'costCenter',
        labelField: 'costCenter',
        filterOption: true,
        immediate: true,
        onChange: (val, data, { row }) => {
          applyAddEmitter.emit('costCenterChange', { val, data, row });
        },
      },
    },
  },
  {
    title: '费用归属',
    field: 'costAttribution',
    width: 180,
    editRender: {
      name: 'Input',
      props: {
        disabled: true,
        min: 0,
        placeholder: t('common.autoCarry'),
      },
    },
  },
  {
    title: '数量',
    field: 'quantity',
    width: 180,
    editRender: {
      name: 'InputNumber',
      props: { min: 1 },
    },
  },
];

/* 联动逻辑
  料号 insidePartNumber》
  字段：insideProjectCode、immediateCustomerCode、factory、salespersonId、moldPurchaseId；
  字段远程值：sapFactory、costCenter、costAttribution；
  下拉选项：productTypeApplylist

  模具类型 moldType》
  字段：moldRemark

  模具用途 moldUse》
  远程字段：costCenter、costAttribution

  工厂 factory》
  字段：costCenter、costAttribution
  远程字段：sapFactory
  下拉选项：productTypeApplylist

  业务类型 businessType》
  远程字段：sapFactory
  字段：costCenter、costAttribution

  是否报税 isBonded》
  远程字段：sapFactory

  成本中心 costCenter》
  字段：costAttribution
  */
console.log(applyAddEmitter);
applyAddEmitter.on('insidePartNumberChange', async obj => {
  const { val, row } = obj;
  await onInsidePartNumberChange(val, row);
}); // 'e' 推断为 'obj'
applyAddEmitter.on('businessTypeChange', async obj => {
  const { row } = obj;
  await businessOrfactoryOrUseChange(row);
  await getSapFactory(row);
});
applyAddEmitter.on('factoryChange', async obj => {
  const { row } = obj;
  // 工厂发生变化，清空仓位
  row.shippingSpaceCode = '';
  row.shippingSpaceName = '';
  await businessOrfactoryOrUseChange(row);
  await getSapFactory(row);
});
applyAddEmitter.on('isBondedChange', async obj => {
  const { row } = obj;
  await getSapFactory(row);
});
applyAddEmitter.on('moldUseChange', async obj => {
  const { row } = obj;
  await businessOrfactoryOrUseChange(row);
});
applyAddEmitter.on('moldTypeChange', (_data: { data: any; row: any }) => {
  // row.moldRemark = data?.label;
});
applyAddEmitter.on('costCenterChange', ({ data, row }) => {
  row.costAttribution = data?.department;
});

async function onInsidePartNumberChange(val, row) {
  try {
    const { data } = val ? await getInnermaterialnumberlist({ InnerMaterialNumber: val }) : [{}];
    const obj = val ? data[0] : {};
    row.insideProjectCode = obj.insideProjectCode;
    row.immediateCustomerCode = obj.immediateCustomerCode;
    row.productType = obj.productType;
    row.productTypeName = obj.productTypeName;
    row.factory = obj.factory;
    row.factoryName = obj.factoryName;
    // state.productTypeApplylist = state.productTypelist.filter(x => !x.Factory || x.Factory == obj.factory);
    row.moldPurchaseId = obj.moldPurchaseId;
    row.salespersonId = obj.salespersonId;
    // row.insidePartNumberOld = obj.insidePartNumberOld;
    // await getSapFactory(getDataSource()[i]); //更新sap工厂代码
    // await partNumberOrUseChange(getDataSource()[i]); //成本中心、费用归属
    console.log('onInsidePartNumberChange', row);
    nextTick(() => {
      row.productTypeName = obj.productTypeName;
      row.salespersonName = obj.salespersonIdName;
      row.moldPurchaseName = obj.moldPurchaseIdName;
      row.factoryName = obj.factoryName;
      applyAddEmitter.emit('factoryChange', { val: obj.factory, data: {}, row });
    });
  } catch (error) {
    console.error(error);
  }
}

//factory moldUse --- costCenter costAttribution 联动
async function businessOrfactoryOrUseChange(record) {
  if (record.factory && record.moldUse && record.businessType) {
    const { data, code } = await getCostcenterlist({ factory: record.factory, moldPurpose: record.moldUse, businessType: record.businessType });
    if (code === 200) {
      if (data.length >= 1) {
        record.costCenter = data[0].costCenter;
        record.costAttribution = data[0].department;
      } else {
        record.costCenterOptions = [];
        record.costCenter = null;
        record.costAttribution = null;
      }
    }
  } else {
    record.costCenter = null;
    record.costAttribution = null;
  }
}
export async function getSapFactory(record) {
  console.log('getSapFactory', record);
  const { businessType: materialType, factory: factoryCode, isBonded } = record;
  if ([materialType, factoryCode, isBonded].every(value => value != null && value != undefined)) {
    //清空仓位编码
    record.shippingSpaceCode = null;
    record.shippingSpaceName = null;
    const { code, data } = await getFactorySap({
      isBonded,
      materialType,
      factoryCode,
    });
    if (code == 200 && data) {
      record.sapFactory = data?.Code;
      record.sapFactoryName = data?.Name;
    } else {
      record.sapFactory = null;
      record.sapFactoryName = null;
    }
  }
}

// 去除空格并转换为大写
export function toUpperAndRemoveSpaces(input: string) {
  return input.replaceAll(/\s+/g, '').toUpperCase();
}

/**
 * 模具编码的校验规则：新模 CF-ASDQ111A-AS001，15位字母数字组成， 其中第2位为-，第12位为-，后三位为数字；旧模 14 位数字字母组成
 * @param str
 * @param isNewMold
 * @returns
 */
export const validateMoldCode = (str: string, isNewMold = true) => {
  const reg = isNewMold ? /^([A-Z]{2})-([A-Za-z0-9]{8})-([A-Za-z0-9]{2})(\d{3})$/ : /^([A-Z]{2})-([A-Za-z0-9]{7})-([A-Za-z0-9]{2})(\d{3})$/;
  return reg.test(str);
};

/**
 * 通过工厂设置人员
 * @param row
 * @param factoryOption
 */
export function setPeronByFactory(
  row: any,
  factoryOption: undefined | null | { Members: Array<{ configType: string; memberId: string; memberName: string }> },
) {
  const members = factoryOption?.Members;

  if (!Array.isArray(members) || members.length === 0) {
    Object.assign(row, {
      moldPurchaseId: '',
      moldPurchaseName: '',
      salespersonId: '',
      salespersonName: '',
    });
    return false;
  }

  const moldPurchase = members.find(m => m.configType === 'MoldPurchasing');
  const salesPerson = members.find(m => m.configType === 'SalePerson');

  Object.assign(row, {
    moldPurchaseId: moldPurchase?.memberId || '',
    moldPurchaseName: moldPurchase?.memberName || '',
    salespersonId: salesPerson?.memberId || '',
    salespersonName: salesPerson?.memberName || '',
  });

  return true;
}

/**
 * 手动输入【旧版成品编码】(可编辑状态下)，自动设置【内部项目代码】，取开头`xxx-`之后的后三位（即提取第一个`-`之后三个字符）
 * - 如：
 *  > `800-NBA031-A0-0`，取`NBA`
 *  > `632-RBF002-B1-2`，取`RBF`
 */
function setInsideProjectCodeByOldPartNumber(row: any) {
  // 获取旧版成品编码
  const oldPartNumber = row.insidePartNumberOld;
  if (!oldPartNumber) {
    row.insideProjectCode = '';
    return;
  }
  // 使用正则表达式匹配`xxx-`后面的内容，并提取前三位
  // 正则规则：提取第一个`-`之后的三个字符
  const match = oldPartNumber.match(/(?<=-)(\w{0,3})/);
  row.insideProjectCode = match?.[1] ?? '';
}

/**
 * 如果复制内容`pasteCells`的数据的行数，小于黏贴行数`rows.length`，则复制`pasteCells`当前的内容平铺，将`pasteCells`行数扩展至和`rows.length`一致
 * @param pasteCells
 * @param rows
 */
export function expandPasteCells(pasteCells: Array<Array<string>>, rows: Array<any>) {
  const pasteCellsLength = pasteCells.length;
  const rowsLength = rows.length;
  // 实现内容平铺扩展逻辑
  if (pasteCellsLength < rowsLength) {
    const extendedPasteCells: Array<Array<string>> = [];
    // 循环填充粘贴内容直到与目标行数一致
    for (let i = 0; i < rowsLength; i++) {
      // 使用模运算确保内容循环平铺，当i超过pasteCells长度时，重新从0开始
      const originalRowIndex = i % pasteCellsLength;
      // 创建新数组并复制原始数据，避免引用问题
      extendedPasteCells.push([...pasteCells[originalRowIndex]]);
    }
    return extendedPasteCells;
  }
  return pasteCells;
}

/** 模具申请类型，分为：新模、旧模 */
export enum MOLD_APPLY_TYPE {
  新模 = '0',
  旧模 = '1',
}

/** 【开模/新增】校验规则 */
export function getAddEeditRules(props: { moldNoType: `${MOLD_APPLY_TYPE}` }) {
  return {
    // insidePartNumber和insidePartNumberOld至少填一个
    insidePartNumber: [
      {
        validator: ({ row }) => {
          if (!row.insidePartNumberOld && !row.insidePartNumber) {
            return new Error(t('dict.MoldApply.requiredInsidePartNumberOrOld'));
          }
        },
        message: t('dict.MoldApply.requiredInsidePartNumberOrOld'),
      },
    ],
    insidePartNumberOld: [
      {
        validator: ({ row }) => {
          if (!row.insidePartNumberOld && !row.insidePartNumber) {
            return new Error(t('dict.MoldApply.requiredInsidePartNumberOrOld'));
          }
        },
        message: t('dict.MoldApply.requiredInsidePartNumberOrOld'),
      },
    ],
    // moldNo需要必填且符合模具编码规则
    moldNo: [
      {
        required: true,
        message: t('sys.validate.textRequiredSuffix'),
      },
      {
        validator: ({ cellValue }) => {
          if (!validateMoldCode(cellValue, `${props.moldNoType}` === MOLD_APPLY_TYPE.新模)) {
            return new Error(t('dict.MoldApply.invalidMoldNoFormat'));
          }
        },
        message: t('dict.MoldApply.invalidMoldNoFormat'),
      },
    ],
    // 内部项目代码
    insideProjectCode: [{ required: true, message: t('sys.validate.textRequiredSuffix') }],
    immediateCustomerCode: [
      {
        validator: ({ cellValue, row }) => {
          // 料号为旧版成品编码时，允许PD手动填写，并且是必填
          if (row.insidePartNumberOld && !cellValue) {
            return new Error(t('dict.MoldApply.immediateCustomerCodeRequired'));
          }
        },
        message: t('dict.MoldApply.immediateCustomerCodeRequired'),
      },
    ],
    urgentLevel: [{ required: true, message: t('sys.validate.textRequiredSuffix') }],
    moldType: [{ required: true, message: t('sys.validate.textRequiredSuffix') }],
    // moldRemark: [{ required: true, message: t('sys.validate.textRequiredSuffix') }],
    factory: [{ required: true, message: t('sys.validate.textRequiredSuffix') }],
    isBonded: [{ required: true, message: t('sys.validate.textRequiredSuffix') }],
    businessType: [{ required: true, message: t('sys.validate.textRequiredSuffix') }],
    sapFactory: [{ required: true, message: t('sys.validate.textRequiredSuffix') }],
    moldPurchaseId: [
      { required: true, message: t('sys.validate.textRequiredSuffix') },
      {
        validator: ({ cellValue, row, $grid }) => {
          // 存在相同的模具图纸(moldDrawings: Array<{ filePath: string }>)的数据，则采购人员必须相同
          const { moldDrawings } = row;
          if (Array.isArray(moldDrawings) && moldDrawings.length > 0) {
            const rowDrawingPaths = moldDrawings.map(item => item.filePath).join(',');
            const allData = $grid.getFullData();
            const flag = allData.some((item: any) => {
              const itemDrawingPaths = (item.moldDrawings || []).map(el => el.filePath).join(',');
              return itemDrawingPaths === rowDrawingPaths && item.moldPurchaseId !== cellValue;
            });
            if (flag) {
              return new Error(t('dict.MoldApply.mustSamePurchasePerson'));
            }
          }
          return true;
        },
        message: t('dict.MoldApply.mustSamePurchasePerson'),
      },
    ],
    moldUse: [{ required: true, message: t('sys.validate.textRequiredSuffix') }],
    costCenter: [{ required: true, message: t('sys.validate.textRequiredSuffix') }],
    costAttribution: [{ required: true, message: t('sys.validate.textRequiredSuffix') }],
    productType: [{ required: true, message: t('sys.validate.textRequiredSuffix') }],
    mainMaterialThickness: [{ required: true, message: t('sys.validate.textRequiredSuffix') }],
    projectPhase: [{ required: true, message: t('sys.validate.textRequiredSuffix') }],
    salespersonId: [{ required: true, message: t('sys.validate.textRequiredSuffix') }],
    requireDeliveryTime: [{ required: true, message: t('sys.validate.textRequiredSuffix') }],
    quantity: [{ required: true, message: t('sys.validate.textRequiredSuffix') }],
    estimateLifespan: [
      { required: true, message: t('sys.validate.textRequiredSuffix') },
      {
        validator: ({ cellValue }) => {
          if (Number.isNaN(+cellValue) || +cellValue <= 0) {
            return new Error(t('common.gtZero'));
          }
        },
      },
    ],
    shippingSpaceCode: [{ required: true, message: t('sys.validate.textRequiredSuffix') }],
  };
}
