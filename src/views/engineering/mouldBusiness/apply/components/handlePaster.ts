import { getUserIdByPhone } from '/@/api/permission/user';
import { expandPasteCells, proxy } from './config';
import { getSelectList } from '/@/api/business/shippingspace';
import { compact, isError, set } from 'lodash-es';
import { useBaseStore } from '/@/store/modules/base';
import { isFunction, isNullOrUnDef } from '/@/utils/is';
import { getFactoryList } from '/@/api/basicData/factory';
import { getProductType } from '/@/api/engineering/pcc';
import { useMessage } from '/@/hooks/web/useMessage';
import { getInnermaterialnumberlistByNumbers, getCostcenterlist } from '/@/api/engineering/mould';
import { useI18n } from '/@/hooks/web/useI18n';
import { getMoldpurposelist } from '/@/api/engineering/costCenter';

const baseStore = useBaseStore();
const { createMessage } = useMessage();
const { t } = useI18n();

/** 获取全部的工厂数据 */
const allFactoryList: Array<any> = [];

function getRules() {
  return {
    insidePartNumber: [
      {
        validator: async ({ col, row }, data: any) => {
          const {
            editRender: {
              props: { valueField, onChange },
            },
          } = col;
          if (isFunction(onChange)) {
            onChange(data?.[valueField] || '', data, { row });
          }
        },
      },
    ],
    insidePartNumberOld: [
      {
        validator: async ({ col, row }) => {
          const {
            editRender: {
              props: { onChange },
            },
          } = col;
          typeof onChange === 'function' && onChange(undefined, { row });
        },
      },
    ],
    moldType: [
      {
        validator: async ({ col, cell, row }) => {
          const options = (await baseStore.getDictionaryData('MoldApply.MoldType')) as Array<{ fullName: string; enCode: string }>;
          const data = options.find(item => item.fullName === cell || item.enCode === cell);
          const {
            editRender: {
              props: { valueField, onChange },
            },
          } = col;
          if (isFunction(onChange)) {
            onChange(data?.[valueField] || '', data ? { ...data, label: data.fullName, value: data.enCode } : undefined, { row });
          }
          return true;
        },
      },
    ],
    projectPhase: [
      {
        validator: async ({ col, cell, row }) => {
          const options = (await baseStore.getDictionaryData('MoldApply.ProjectPhase')) as Array<{ fullName: string; enCode: string }>;
          const data = options.find(item => item.fullName === cell || item.enCode === cell);
          const {
            editRender: {
              props: { valueField, onChange },
            },
          } = col;
          if (isFunction(onChange)) {
            onChange(data?.[valueField] || '', data ? { ...data, label: data.fullName, value: data.enCode } : undefined, { row });
          }
          return true;
        },
      },
    ],
    businessType: [
      {
        validator: async ({ col, cell, row }) => {
          const options = (await baseStore.getDictionaryData('SapFactoryMaterial', true)) as Array<{ fullName: string; enCode: string }>;
          const data = options.find(item => item.fullName === cell || item.enCode === cell);
          const {
            editRender: {
              props: { valueField, onChange },
            },
          } = col;
          if (isFunction(onChange)) {
            onChange(data?.[valueField] || '', data ? { ...data, label: data.fullName, value: data.enCode } : undefined, { row });
          }
          return true;
        },
      },
    ],
    urgentLevel: [
      {
        validator: async ({ col, cell, row }) => {
          const options = (await baseStore.getDictionaryData('MoldApply.UrgentLevel', true)) as Array<{ fullName: string; enCode: string }>;
          const data = options.find(item => item.fullName === cell || item.enCode === cell);
          const {
            editRender: {
              props: { valueField, onChange },
            },
          } = col;
          if (isFunction(onChange)) {
            onChange(data?.[valueField] || '', data ? { ...data, label: data.fullName, value: data.enCode } : undefined, { row });
          }
          return true;
        },
      },
    ],
    isBonded: [
      {
        validator: async ({ col, cell, row }) => {
          const options = [
            {
              fullName: t('common.yes'),
              enCode: true,
            },
            {
              fullName: t('common.no'),
              enCode: false,
            },
          ];
          const data = options.find(item => item.fullName === cell || item.enCode === cell);
          const {
            editRender: {
              props: { valueField, onChange },
            },
          } = col;

          if (!data) {
            row.isBonded = '';
            isFunction(onChange) && onChange(undefined, undefined, { row });
            return;
          }

          row.isBonded = data.enCode;

          if (isFunction(onChange)) {
            onChange(data[valueField], { ...data, label: data.fullName, value: data.enCode }, { row });
          }
          return true;
        },
      },
    ],
    factory: [
      {
        validator: async ({ col, cell, row }) => {
          if (isNullOrUnDef(cell)) {
            return new Error(t('common.incorrectData'));
          }
          if (allFactoryList.length === 0) {
            await getFactoryList().then(res => {
              allFactoryList.push(...res.data);
            });
          }
          const data = allFactoryList.find(item => item.Name === cell || item.Code === cell);
          const {
            editRender: {
              props: { valueField, onChange },
            },
          } = col;
          if (isFunction(onChange)) {
            onChange(data?.[valueField] || '', data ? { ...data, label: data.Name, value: data.Code } : undefined, { row });
          }
          return true;
        },
      },
    ],
    shippingSpaceCode: [
      {
        validator: async ({ col, cell, row }) => {
          if (isNullOrUnDef(cell)) {
            return new Error(t('common.incorrectData'));
          }
          const options: { data: Array<any> } = await getSelectList({ factoryCode: row.factory, sapFactoryCode: row.sapFactory, status: 1, type: 3 });
          const data = options.data?.find(
            item => `${item.shippingSpaceCode}/${item.shippingSpaceName}` === cell || item.shippingSpaceCode === cell || item.shippingSpaceName === cell,
          );
          const {
            editRender: {
              props: { valueField, onChange },
            },
          } = col;
          if (!data) {
            row.shippingSpaceName = '';
            row.shippingSpaceCode = '';
            isFunction(onChange) && onChange(undefined, undefined, { row });
            return;
          }

          row.shippingSpaceName = [data.shippingSpaceCode, data.shippingSpaceName].filter(Boolean).join('/');
          row.shippingSpaceCode = data.shippingSpaceCode;

          if (isFunction(onChange)) {
            onChange(data[valueField], { ...data, label: row.shippingSpaceName, value: row.shippingSpaceCode }, { row });
          }
          return true;
        },
      },
    ],
    productType: [
      {
        validator: async ({ col, cell, row }) => {
          const options: Array<any> = (await getProductType({ factory: row.factory, bussniessType: row.businessType }))?.data || [];
          if (isNullOrUnDef(cell)) {
            return new Error(t('common.incorrectData'));
          }
          const data = options.find(item => item.productCategory === cell || item.id === cell);
          const {
            editRender: {
              props: { valueField, onChange },
            },
          } = col;
          if (!data) {
            row.productTypeName = '';
            row.productType = '';
            isFunction(onChange) && onChange(undefined, undefined, { row });
            return;
          }
          row.productTypeName = data.productCategory;
          row.productType = data.id;

          if (isFunction(onChange)) {
            onChange(data[valueField], { ...data, label: data.productCategory, value: data.id }, { row });
          }
          return true;
        },
      },
    ],
    moldPurchaseId: [
      {
        validator: ({ col, row }, data: any) => {
          // 设置复制数据
          col.copyDataRow = col.field.replaceAll('Id', 'Name');
          const name = data ? `${data.RealName}/${data.Account}` : '';
          set(row, `copyData.${col['field'].replaceAll('Id', 'Name')}`, name);
          row.moldPurchaseName = name;
          row.moldPurchaseId = data?.Id;
        },
      },
    ],
    salespersonId: [
      {
        validator: ({ col, row }, data: any) => {
          // 设置复制数据
          col.copyDataRow = col.field.replaceAll('Id', 'Name');
          const name = data ? `${data.RealName}/${data.Account}` : '';
          set(row, `copyData.${col['field'].replaceAll('Id', 'Name')}`, name);
          row.salespersonName = name;
          row.salespersonId = data?.Id;
        },
      },
    ],
    moldUse: [
      {
        validator: async ({ col, row, cell }) => {
          const {
            editRender: {
              props: { onChange, valueField, labelField },
            },
          } = col;
          let options: Array<any> = [];
          const { data } = await proxy.get(getMoldpurposelist, 'moldUse', { status: 1 });
          options = data || [];

          const target = options.find(item => item[valueField] === cell || item[labelField] === cell);
          row.moldUse = target?.[valueField];
          row.moldUseName = target?.[labelField];

          if (isFunction(onChange)) {
            onChange(target?.[valueField], target, { row });
          }
        },
      },
    ],
    costCenter: [
      {
        validator: async ({ col, row, cell }) => {
          let options: Array<any> = [];
          if (row.factory && row.moldUse && row.businessType) {
            const { data } = await proxy.get(getCostcenterlist, 'costCenter', {
              factory: row.factory,
              businessType: row.businessType,
              moldPurpose: row.moldUse,
            });
            options = data || [];
          }

          const {
            editRender: {
              props: { onChange, valueField, labelField },
            },
          } = col;
          const target = options.find(item => item[valueField] === cell || item[labelField] === cell);
          row.costCenter = target?.[valueField];
          row.costCenterName = target?.[labelField];

          if (isFunction(onChange)) {
            onChange(target?.[valueField], target, { row });
          }
        },
      },
    ],
    estimateLifespan: [
      {
        validator: async ({ cell, row }) => {
          // 如果不是数字，或者不是整数，小于等于零，不通过校验
          // 【预估寿命】只能输入整数
          if (Number.isNaN(+cell) || !/^\d+$/.test(cell) || +cell <= 0) {
            row.estimateLifespan = '';
            return new Error(t('dict.MoldApply.estimateLifespanIntegerReuqired'));
          }
        },
      },
    ],
  };
}

/** 处理粘贴数据 */
export async function handleAfterPaster({ pasteCells, $grid, currentAreas }) {
  try {
    const editRules = getRules();
    const { cols, rows } = currentAreas[0];

    const extendedPasteCells = expandPasteCells(pasteCells, rows);

    // 收集粘贴的物料料号
    const materialFnList: Array<any> = [];
    // 收集粘贴的采购人员
    const purchaserFnList: Array<any> = [];
    // 校验数据
    for (let rowIndex = 0; rowIndex < extendedPasteCells.length; rowIndex++) {
      let row = extendedPasteCells[rowIndex];
      for (let colIndex = 0; colIndex < row.length; colIndex++) {
        let cell = row[colIndex];
        const col = cols[colIndex];
        const originRow = rows[rowIndex];

        const { field } = col;
        const rule = editRules[field];
        if (!rule) continue;
        const { validator } = rule[0];
        // 对查询结果进行特殊处理，如果当前是材料列，先存储料号。其他列进行校验
        if (field === 'insidePartNumber') {
          materialFnList.push({
            cell,
            fn: validator.bind(null, { col, cell, row: originRow, $grid }),
          });
          continue;
        }
        if (field === 'moldPurchaseId' || field === 'salespersonId') {
          purchaserFnList.push({
            cell,
            fn: validator.bind(null, { col, cell, row: originRow, $grid }),
          });
          continue;
        }
        const result = await validator({ col, cell, row: originRow, $grid });
        if (isNullOrUnDef(result)) continue;
        if (isError(result)) {
          originRow[field] = '';
          if (originRow[col.editRender.cacheField]) {
            originRow[col.editRender.cacheField] = '';
          }
          createMessage.warning(result?.message);
        }
        // 校验数据通过
      }
    }
    //重新执行粘贴的料号逻辑
    if (Array.isArray(materialFnList) && materialFnList.length > 0) {
      const keys = materialFnList.map(item => item.cell);
      // 查询料号结果,可能会去重
      await getInnermaterialnumberlistByNumbers(keys).then(({ data }) => {
        // 执行校验函数
        materialFnList.forEach(item => {
          const target = data.find(values => values.insidePartNumber === item.cell);
          // 将结果传入校验函数
          item.fn(target);
        });
      });
    }
    if (Array.isArray(purchaserFnList) && purchaserFnList.length > 0) {
      const keys = purchaserFnList
        .map(item => {
          return item ? item.cell.match(/(\d+)(?!.*\d)/)[0] : '';
        })
        .filter(Boolean);

      getUserIdByPhone({ accounts: compact(keys) }).then(({ data }) => {
        // 执行校验函数
        purchaserFnList.forEach(value => {
          const target = data.find(item => `${item.RealName}/${item.Account}` === value.cell);
          // 执行缓存函数
          value.fn(target);
        });
      });
      return false;
    }
  } catch (e) {
    console.error(e);
  }
  return false;
}
