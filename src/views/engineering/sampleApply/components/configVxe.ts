import { getSpaceList, getInnerMaterialNumbers } from '/@/api/engineering/sample';
import { getQuantitationApplyDetailByMaterial } from '/@/api/business/quantitation';
import { getPartNumberFactoryList } from '/@/api/basicData/factory';

import { getMetarialCode } from '/@/api/business/material';
import { getunitList } from '/@/api/common/constant';
import { useI18n } from '/@/hooks/web/useI18n';
import { nextTick } from 'vue';
import Decimal from 'decimal.js';
import { getMaterialCode } from '/@/api/structure/materialCode';

const { t } = useI18n();

/**
 * 新增页面 - 表单配置
 */
export const schemas = [
  {
    field: 'applyUserName',
    label: '申请人',
    component: 'Input',
    i18nField: 'CommonCol.applyUser',
    componentProps: { placeholder: '申请人', maxlength: 50, disabled: true },
  },
  {
    field: 'applyDateTime',
    label: '申请时间',
    component: 'Input',
    i18nField: 'CommonCol.applyTime',
    componentProps: { placeholder: '申请时间', maxlength: 50, disabled: true },
  },
];

/**
 * 新增页面 - 获取表格列配置
 * @returns
 */
export const getEditTableColumn = () => [
  {
    title: t('component.table.index'),
    type: 'seq',
    field: 'seq',
    minWidth: 50,
  },
  {
    title: '产品内部料号',
    field: 'insidePartNumber',
    width: 240,
    formatter: 'ApiSelect',
    editRender: {
      name: 'ApiSelect',
      props: {
        api: getQuantitationApplyDetailByMaterial,
        showSearch: true,
        apiSearch: {
          show: true,
          searchName: 'innerMaterialNumber',
        },
        params: {
          pageSize: 20,
          partNumberStatus: 1,
        },
        resultField: 'data',
        labelField: 'InsidePartNumber',
        valueField: 'InsidePartNumber',
        filterOption: false,
        onChange: (_, data, params) => {
          const {
            $grid: { setRow },
            row,
          } = params;
          const item = handleInnerPartNumberItem(data);
          setRow(row, item);
          nextTick(() => {
            setRow(row, { factoryName: item.factoryName, applyShippingSpaceId: '', applyShippingSpaceName: '' });
          });
          getRelatedPersonnel(row).then(res => {
            setRow(row, res);
          });
        },
      },
    },
  },
  {
    title: '旧版成品编码',
    field: 'insideNumberOld',
    width: 160,
    editRender: {
      name: 'Input',
      props: {
        placeholder: '',
        // 填写旧版成品编码时，清空内部料号及 handleInnerPartNumberItem 带出的信息
        onChange: (_: string, { row, $grid }) => {
          if (row.insideNumberOld) {
            $grid.setRow(row, {
              insidePartNumber: '',
              factoryId: '',
              factoryName: '',
              factoryCode: '',
              description: '',
              terminalProjectCode: '',
              personEngineeringId: '',
              personEngineeringName: '',
            });
          }
        },
      },
    },
  },

  {
    title: '终端项目代码',
    field: 'terminalProjectCode',
    width: 200,
    require: true,
    editRender: {
      name: 'Input',
      props: {
        placeholder: '',
        dynamicDisabled: row => {
          // 有产品内部料号时禁用
          if (row.insidePartNumber) {
            return true;
          }
          // 无产品内部料号（比如填写了旧版成品编码时被清空），允许编辑
          return false;
        },
      },
    },
  },
  {
    title: '工厂',
    field: 'factoryId',
    i18nField: 'factoryName',
    width: 240,
    formatter: 'ApiSelect',
    editRender: {
      name: 'ApiSelect',
      cacheField: 'factoryName',
      props: {
        api: getPartNumberFactoryList,
        placeholder: '请选择',
        filterOption: false,
        showSearch: true,
        rowParams: {
          partNumber: 'insidePartNumber',
        },
        apiSearch: {
          show: true,
          searchName: 'factory',
        },
        resultField: 'data',
        labelField: 'Name',
        valueField: 'Id',
        immediate: true,
        nameFormat: ['Code', '/', 'Name'],
        onChange: (_, data, params) => {
          const {
            $grid: { setRow },
            row,
          } = params;
          setRow(row, {
            factoryName: data?.label || '',
            factoryCode: data?.Code || '',
            applyShippingSpaceId: '',
            applyShippingSpaceName: '',
            ...getPDPersonByMembers(data?.Members),
          });
          getRelatedPersonnel(row).then(res => {
            setRow(row, res);
          });
        },
      },
    },
  },
  {
    title: '申请仓位',
    field: 'applyShippingSpaceId',
    width: 200,
    i18nField: 'applyShippingSpaceName',
    formatter: 'ApiSelect',
    editRender: {
      name: 'ApiSelect',
      cacheField: 'applyShippingSpaceName',
      props: {
        api: getSpaceList,
        showSearch: true,
        apiSearch: {
          show: true,
          searchName: 'shippingSpace',
        },
        rowParams: {
          factoryId: 'factoryId',
        },
        resultField: 'data',
        labelField: 'shippingSpaceName',
        valueField: 'id',
        nameFormat: ['shippingSpaceCode', '/', 'shippingSpaceName'],
        filterOption: false,
      },
    },
  },
  {
    title: '材料八码',
    field: 'innerMaterialNumber',
    width: 200,
    formatter: 'ApiSelect',
    editRender: {
      name: 'ApiSelect',
      props: {
        api: getMaterialCode,
        showSearch: true,
        apiSearch: {
          show: true,
          searchName: 'shortMaterialCode',
        },
        immediate: true,
        params: {
          pageSize: 20,
        },
        placeholder: '',
        resultField: 'data',
        labelField: 'shortMaterialCode',
        valueField: 'shortMaterialCode',
        filterOption: false,
        onChange: (_, data, params) => {
          const {
            $grid: { setRow },
            row,
          } = params;
          // setRow(row, { innerExternalNumber: data.OriginalModelNumber || '' });
          getRelatedPersonnel(row).then(res => {
            setRow(row, res);
          });
        },
      },
    },
  },
  {
    title: '原厂商型号',
    field: 'innerExternalNumber',
    width: 160,
    editRender: {
      name: 'Input',
      props: {
        placeholder: '',
      },
    },
  },
  {
    title: '产品长度(MM)',
    field: 'productSizeLong',
    width: 160,
    editRender: {
      name: 'InputNumber',
      props: {
        onChange: (_: number, { row }) => {
          row.productArea = computeProductArea(row);
        },
      },
    },
  },
  {
    title: '产品宽度(MM)',
    field: 'productSizeWide',
    width: 160,
    editRender: {
      name: 'InputNumber',
      props: {
        onChange: (_: number, { row }) => {
          row.productArea = computeProductArea(row);
        },
      },
    },
  },
  {
    title: '产品面积(M2)',
    field: 'productArea',
    helpMessage: '【产品长度(MM)*产品宽度(MM)】/1000000',
    width: 200,
  },
  {
    title: '产品描述',
    field: 'description',
    width: 260,
    editRender: {
      name: 'Input',
    },
  },
  {
    title: '申请宽度(MM)',
    field: 'applySizeWide',
    width: 160,
    editRender: {
      name: 'InputNumber',
      props: {
        onChange: (_: number, { row }) => {
          row.applyArea = computeApplyArea(row);
        },
      },
    },
  },
  {
    title: '申请长度(M)',
    field: 'applySizeLong',
    width: 160,
    editRender: {
      name: 'InputNumber',
      props: {
        onChange: (_: number, { row }) => {
          row.applyArea = computeApplyArea(row);
        },
      },
    },
  },
  {
    title: '申请数量',
    field: 'qty',
    width: 160,
    require: true,
    editRender: {
      name: 'InputNumber',
      props: {
        onChange: (_: number, { row }) => {
          row.applyArea = computeApplyArea(row);
        },
      },
    },
  },
  {
    title: '数量单位',
    field: 'measurementUnitId',
    width: 200,
    i18nField: 'measurementUnit',
    formatter: 'ApiSelect',
    require: true,
    editRender: {
      name: 'ApiSelect',
      cacheField: 'measurementUnit',
      props: {
        api: getunitList,
        showSearch: true,
        resultField: 'data',
        valueField: 'Id',
        labelField: 'Name',
        filterOption: false,
        immediate: true,
        disabled: false,
      },
    },
  },
  {
    title: '申请面积(M2)',
    field: 'applyArea',
    helpMessage: '【申请宽度*申请长度*申请数量】/1000',
    width: 200,
  },
  {
    title: '成品打样数量(KPCS)',
    field: 'finishedProductQty',
    require: true,
    editRender: {
      name: 'InputNumber',
    },
    width: 200,
  },
  {
    title: '要求到样日期',
    field: 'requestArrivalDate',
    width: 160,
    require: true,
    editRender: {
      name: 'DatePicker',
      props: {
        valueFormat: 'YYYY-MM-DD',
        showTime: false,
      },
    },
  },
  {
    title: '所处阶段',
    field: 'currentStageNew',
    width: 160,
    editRender: {
      name: 'Input',
    },
  },
  {
    title: 'PD',
    field: 'personEngineeringId',
    i18nField: 'personEngineeringName',
    width: 200,
    editRender: {
      cacheField: 'personEngineeringName',
      name: 'CustomUserSelect',
    },
  },
  {
    title: '下一节点处理人(采购)',
    field: 'purchaseUserId',
    i18nField: 'CommonCol.nextHandler',
    i18nParams: [t('common.purchaser')],
    width: 200,
    editRender: {
      cacheField: 'purchaseUserName',
      name: 'CustomUserSelect',
    },
  },
  {
    title: '备注',
    field: 'remark',
    width: 200,
    editRender: {
      name: 'Input',
    },
  },
  {
    title: t('common.action'),
    width: 80,
    slots: { default: 'action' },
    fixed: 'right',
    field: 'action',
  },
];

/**
 * 新增页面 - 表格列校验规则
 */
export const editRules = {
  applyShippingSpaceId: [{ required: true, message: t('common.required') }],
  // insidePartNumber: [{ required: true, message: t('common.required') }],
  factoryId: [{ required: true, message: t('common.required') }],
  finishedProductQty: [{ required: true, message: t('common.required') }],
  requestArrivalDate: [{ required: true, message: t('common.required') }],
  personEngineeringId: [{ required: true, message: t('common.required') }],
  purchaseUserId: [{ required: true, message: t('common.required') }],
  terminalProjectCode: [{ required: true, message: t('common.required') }],
  qty: [{ required: true, message: t('common.required') }],
  measurementUnitId: [{ required: true, message: t('common.required') }],
};

/**
 * 根据传入的参数，返回对应的数字
 * @param val 需要转化为数字的值
 * @returns 返回的数字
 */
export function getNumber(val: any) {
  return Number.isNaN(+val) ? 0 : +val;
}

/**
 * 根据数据中的`产品长度(MM)`和`产品宽度(MM)`，计算相应的`产品面积(M2)`
 * @param row 行数据
 * @returns 产品面积
 */
export function computeProductArea(row: { productSizeLong: number; productSizeWide: number }) {
  // 产品面积：【产品长度(MM)*产品宽度(MM)】/1000000
  return Decimal.mul(getNumber(row.productSizeLong), getNumber(row.productSizeWide)).div(1000000).toNumber();
}

/**
 * 根据数据中的`申请宽度(MM)`、`申请长度(M)`和`申请数量`，计算相应的`产品面积(M2)`
 * @param row 行数据
 * @returns 申请面积
 */
export function computeApplyArea(row: { applySizeWide: number; applySizeLong: number; qty: number }) {
  // 申请面积：【申请宽度*申请长度*申请数量】/1000
  return Decimal.mul(getNumber(row.applySizeWide), getNumber(row.applySizeLong)).mul(getNumber(row.qty)).div(1000).toNumber();
}

/**
 * 当`产品内部料号`发生改变后，执行相应的数据处理
 * @param data 产品内部料号信息
 */
export function handleInnerPartNumberItem(data: any): any {
  const { FactoryId, FactoryFullName, Factory, Members, ProductDesc, FactoryName, TerminalCustomerProjectCode } = data;
  // const EPM = Members.find(item => item.configType == 'PDPerson');
  const _item: any = {
    // personEngineeringName: EPM?.memberName,
    // personEngineeringId: EPM?.memberId,
    factoryId: FactoryId,
    factoryName: FactoryFullName || FactoryName || Factory,
    factoryCode: Factory,
    description: ProductDesc || '',
    terminalProjectCode: TerminalCustomerProjectCode || '',
    insideNumberOld: '',
    ...getPDPersonByMembers(Members),
  };
  return _item;
}

/** 获取`PD`的人员信息 */
function getPDPersonByMembers(members: Array<{ configType: string; memberId: string; memberName: string }>) {
  if (!Array.isArray(members)) {
    return {
      personEngineeringId: '',
      personEngineeringName: '',
    };
  }

  const target = members.find(item => item.configType === 'PDPerson');
  return {
    personEngineeringId: target?.memberId,
    personEngineeringName: target?.memberName,
  };
}

/**
 * 获取`PD`和`采购`的人员信息
 * @param data
 */
export async function getRelatedPersonnel(data: any) {
  const result = {
    purchaseUserId: '',
    purchaseUserName: '',
    // personEngineeringId: '',
    // personEngineeringName: '',
  };
  if (!data) {
    return Promise.resolve(result);
  }
  const { innerMaterialNumber, insidePartNumber, factoryId } = data;
  if (!innerMaterialNumber && !insidePartNumber && !factoryId) {
    return Promise.resolve(result);
  }
  return getInnerMaterialNumbers([{ innerMaterialNumber, insidePartNumber, factoryId }]).then(res => {
    const resData = res.data[0];
    // result.personEngineeringId = resData.PersonId;
    // result.personEngineeringName = resData.PersonName;
    result.purchaseUserId = resData.MaterialsPersonId;
    result.purchaseUserName = resData.MaterialsPersonName;
    return result;
  });
}
