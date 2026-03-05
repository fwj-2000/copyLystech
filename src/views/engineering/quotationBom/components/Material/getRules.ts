/*
 * @Author: wenzhenjin
 * @Date: 2025-05-14 08:45:23
 * @LastEditors: wenzhenjin
 * @LastEditTime: 2025-05-22 16:07:42
 * @FilePath: \lydc.server.web\src\views\engineering\quotationBom\components\Material\getRules.ts
 */
import { isNullOrUnDef, isFunction } from '/@/utils/is';
import { set } from 'lodash-es';

export function getRules() {
  return {
    eightCode: [
      {
        validator: ({ cell, row, col, $grid }) => {
          if (isNullOrUnDef(cell)) {
            return new Error('请输入八码');
          }
          if (cell <= 0) {
            return new Error('请选择正确的八码');
          }
          row.eightCode = cell;
          const {
            editRender: {
              props: { onChange },
            },
          } = col;

          if (isFunction(onChange)) {
            onChange(cell, { row, isPaster: true, $grid });
          }
          return true;
        },
      },
    ],
    singleWidth: [
      {
        validator: ({ cell, row, col, $grid }) => {
          if (isNullOrUnDef(cell)) {
            return new Error('请输入宽度');
          }
          if (cell <= 0) {
            return new Error('请输入正确的宽度');
          }
          row.singleWidth = cell;
          const {
            editRender: {
              props: { onChange },
            },
          } = col;

          if (isFunction(onChange)) {
            onChange(cell, { row, isPaster: true, $grid });
          }
          return true;
        },
      },
    ],
    originInsideCode: [
      {
        validator: ({ col, cell, row }, data) => {
          if (isNullOrUnDef(cell)) {
            return new Error('请选择正确的料号');
          }
          const {
            editRender: {
              props: { valueField, onChange },
            },
          } = col;
          if (!data) {
            return new Error('请选择正确的料号');
          }
          if (isFunction(onChange)) {
            onChange(data[valueField], data, { row });
          }
        },
      },
    ],
    insideCode: [
      {
        validator: ({ cell, row }) => {
          row.insideCode = cell;
        },
      },
    ],
    materialDescription: [
      {
        validator: ({ cell, row }) => {
          row.materialDescription = cell;
        },
      },
    ],
    materialTypeFromManufacturer: [
      {
        validator: ({ row }) => {
          if (row.insideCode || row.originPartNumber) {
            row.materialTypeFromManufacturer = '';
            return new Error('当前已有料号，不可编辑新材料厂商型号');
          }
        },
      },
    ],
    singleStepDistance: [
      {
        validator: ({ col, cell, row }) => {
          row.singleStepDistance = cell;
          const {
            editRender: {
              props: { onChange },
            },
          } = col;
          if (cell && isFunction(onChange)) {
            onChange(cell, { row });
          }
        },
      },
    ],
    singleModulus: [
      {
        validator: ({ col, cell, row, $grid }) => {
          row.singleModulus = cell;
          const {
            editRender: {
              props: { onChange },
            },
          } = col;
          if (cell && isFunction(onChange)) {
            onChange(cell, { row, $grid });
          }
        },
      },
    ],
    materialDosage: [
      {
        validator: ({ col, cell, row, $grid }) => {
          row.materialDosage = +cell;
          const {
            editRender: {
              props: { onChange },
            },
          } = col;
          if (cell && isFunction(onChange)) {
            onChange(+cell, { row, $grid });
          }
        },
      },
    ],
    singleUseQty: [
      {
        validator: () => {},
      },
    ],
    singleProcessLosses: [
      {
        validator: () => {},
      },
    ],
    purchaserId: [
      {
        // validator: (...rest) => {
        validator: ({ col, row }, data) => {
          console.log('🚀 ~ validator ~ data: ', data);
          // 设置复制数据
          col.copyDataRow = col.field.replaceAll('Id', 'Name');
          set(row, `copyData.${col['field'].replaceAll('Id', 'Name')}`, `${data.RealName}/${data.Account}`);

          row.purchaserName = `${data.RealName}/${data.Account}`;
          row.purchaserId = data.Id;
        },
      },
    ],
    hasPriceName: [
      {
        validator: () => {},
      },
    ],
    cost: [
      {
        validator: () => {},
      },
    ],
  };
}
