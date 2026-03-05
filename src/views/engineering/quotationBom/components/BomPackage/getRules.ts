import { isFunction } from '/@/utils/is';
import { set } from 'lodash-es';

export function getRules() {
  return {
    insideCode: [
      {
        validator: async ({ col, row, $grid }, data) => {
          if (!data) {
            return new Error('请选择正确的料号');
          }
          const { editRender } = col;
          const props = editRender?.props;
          if (props && isFunction(props.onChange)) {
            props.onChange(data[props.valueField], data, { row, $grid });
          }
        },
      },
    ],
    materialDescription: [
      {
        validator: () => {},
      },
    ],
    packQty: [
      {
        validator: ({ cell, row }) => {
          row.packQty = cell;
        },
      },
    ],
    purchaserId: [
      {
        validator: ({ col, row }, data) => {
          if (!data) return;
          // 设置复制数据
          const field = col.field as string;
          const targetField = field.replaceAll('Id', 'Name');
          col.copyDataRow = targetField;
          set(row, `copyData.${targetField}`, `${data.RealName}/${data.Account}`);
          row.purchaserName = `${data.RealName}/${data.Account}`;
          row.purchaserId = data.Id;
        },
      },
    ],
  };
}
