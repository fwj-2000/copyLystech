import { isFunction, isNullOrUnDef } from '/@/utils/is';

export function getRules() {
  return {
    semiFinished: [
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
            console.log(12312312312);
            onChange(data[valueField], data, { row });
          }
        },
      },
    ],
    preparation: [
      {
        validator: ({ cell, row }) => {
          if (isNullOrUnDef(cell) || cell === '') return;
          row.preparation = cell;
        },
      },
    ],
    materialDosage: [
      {
        validator: ({ cell, row }) => {
          if (isNullOrUnDef(cell) || cell === '') return;
          row.materialDosage = cell;
        },
      },
    ],
    qty: [
      {
        validator: ({ cell, row }) => {
          if (isNullOrUnDef(cell) || cell === '') return;
          row.qty = cell;
        },
      },
    ],
    unit: [
      {
        validator: ({ cell, row }) => {
          if (isNullOrUnDef(cell) || cell === '') return;
          row.unit = cell;
        },
      },
    ],
    remarks: [
      {
        validator: ({ cell, row }) => {
          if (isNullOrUnDef(cell) || cell === '') return;
          row.remarks = cell;
        },
      },
    ],
  };
}
