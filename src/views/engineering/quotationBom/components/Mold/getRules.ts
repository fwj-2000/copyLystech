/*
 * @Author: wenzhenjin
 * @Date: 2025-05-14 15:36:12
 * @LastEditors: wenzhenjin
 * @LastEditTime: 2025-05-21 20:07:37
 * @FilePath: \lydc.server.web\src\views\engineering\quotationBom\components\Mold\getRules.ts
 */

import { useBaseStore } from '/@/store/modules/base';
import { isNullOrUnDef, isFunction } from '/@/utils/is';

const baseStore = useBaseStore();

export function getRules() {
  return {
    moldType: [
      {
        validator: async ({ col, cell, row }) => {
          const options = await baseStore.getDictionaryData('MoldApply.MoldType');
          if (isNullOrUnDef(cell)) {
            return new Error('请输入模夹治具类型');
          }
          const data = options.find(item => item.fullName === cell);
          const {
            editRender: {
              props: { valueField, onChange },
            },
          } = col;
          if (!data) {
            return new Error('请选择正确的模夹治具类型');
          }

          if (isFunction(onChange)) {
            onChange(data[valueField], { ...data, label: data.fullName, value: data.enCode }, { row });
          }
          return true;
        },
      },
    ],
    price: [
      {
        validator: ({ col, cell, row, $grid }) => {
          if (isNullOrUnDef(cell)) {
            return new Error('请输入价格');
          }
          if (cell < 0) {
            return new Error('价格不能小于0');
          }
          row.price = cell;
          const {
            editRender: {
              props: { onChange },
            },
          } = col;
          if (isFunction(onChange)) {
            onChange(cell, { row, $grid });
          }
          return true;
        },
      },
    ],
    moldLifespan: [
      {
        validator: ({ col, cell, row, $grid }) => {
          // if (isNullOrUnDef(cell)) {
          //   return new Error('请输入价格');
          // }
          // if (cell < 0) {
          //   return new Error('价格不能小于0');
          // }
          row.moldLifespan = cell;
          const {
            editRender: {
              props: { onChange },
            },
          } = col;
          if (isFunction(onChange)) {
            onChange(cell, { row, $grid });
          }
          return true;
        },
      },
    ],
    cost: [
      {
        validator: () => {},
      },
    ],
  };
}
