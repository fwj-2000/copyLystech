import { isFunction } from '/@/utils/is';
import { set } from 'lodash-es';

export function getRules() {
  return {
    insideCode: [
      {
        validator: async ({ col, row, $grid }, data) => {
          if (row.materialTypeFromManufacturer) {
            return new Error('料号和新材料厂商型号只能输入一个');
          }
          if (!data) {
            return new Error('请选择正确的料号');
          }
          const {
            editRender: {
              props: { valueField, onChange },
            },
          } = col;
          if (isFunction(onChange)) {
            onChange(data[valueField], data, { row, $grid });
          }
        },
      },
    ],
    materialTypeFromManufacturer: [
      {
        validator: () => {},
      },
    ],
    materialDescription: [
      {
        validator: () => {},
      },
    ],
    useQty: [
      {
        validator: ({ col, cell, row, $grid }) => {
          const {
            editRender: {
              props: { onChange },
            },
          } = col;
          if (isFunction(onChange)) {
            onChange(cell, { row, $grid });
          }
        },
      },
    ],
    defectRate: [
      {
        validator: ({ col, cell, row, $grid }) => {
          const {
            editRender: {
              props: { onChange },
            },
          } = col;
          if (isFunction(onChange)) {
            onChange(cell, { row, $grid });
          }
        },
      },
    ],
    purchaserId: [
      {
        validator: ({ col, row }, data) => {
          // 设置复制数据
          col.copyDataRow = col.field.replaceAll('Id', 'Name');
          set(row, `copyData.${col['field'].replaceAll('Id', 'Name')}`, `${data.RealName}/${data.Account}`);
          row.purchaserName = `${data.RealName}/${data.Account}`;
          row.purchaserId = data.Id;
        },
      },
    ],
    purchasingUnit: [
      {
        validator: () => {},
      },
    ],
    hasPriceName: [
      {
        validator: () => {},
      },
    ],
    price: [
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
