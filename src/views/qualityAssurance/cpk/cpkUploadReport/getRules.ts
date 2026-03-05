/*
 * @Author: wenzhenjin
 * @Date: 2025-05-14 08:45:23
 * @LastEditors: wenzhenjin
 * @LastEditTime: 2025-05-22 16:07:42
 * @FilePath: \lydc.server.web\src\views\engineering\quotationBom\components\Material\getRules.ts
 */
import { set } from 'lodash-es';

export function getRules() {
  return {
    technician: [
      {
        // validator: (...rest) => {
        validator: ({ col, cell, row }, data) => {
          console.log('🚀 ~ validator ~ data: ', data);
          // 设置复制数据
          col.copyDataRow = col.field.replaceAll('Id', 'Name');
          set(row, `copyData.${col['field'].replaceAll('Id', 'Name')}`, `${data.RealName}/${data.Account}`);

          row.technicianName = `${data.RealName}/${data.Account}`;
          row.technician = [data.Id];
        },
      },
    ],
    qe: [
      {
        // validator: (...rest) => {
        validator: ({ col, cell, row }, data) => {
          console.log('🚀 ~ validator ~ data: ', data);
          // 设置复制数据
          col.copyDataRow = col.field.replaceAll('Id', 'Name');
          set(row, `copyData.${col['field'].replaceAll('Id', 'Name')}`, `${data.RealName}/${data.Account}`);

          row.qeName = `${data.RealName}/${data.Account}`;
          row.qe = [data.Id];
        },
      },
    ],
    pd: [
      {
        // validator: (...rest) => {
        validator: ({ col, cell, row }, data) => {
          console.log('🚀 ~ validator ~ data: ', data);
          // 设置复制数据
          col.copyDataRow = col.field.replaceAll('Id', 'Name');
          set(row, `copyData.${col['field'].replaceAll('Id', 'Name')}`, `${data.RealName}/${data.Account}`);

          row.pdName = `${data.RealName}/${data.Account}`;
          row.pd = [data.Id];
        },
      },
    ],
    epmQpm: [
      {
        // validator: (...rest) => {
        validator: ({ col, cell, row }, data) => {
          console.log('🚀 ~ validator ~ data: ', data);
          // 设置复制数据
          col.copyDataRow = col.field.replaceAll('Id', 'Name');
          set(row, `copyData.${col['field'].replaceAll('Id', 'Name')}`, `${data.RealName}/${data.Account}`);

          row.epmQpmName = `${data.RealName}/${data.Account}`;
          row.epmQpm = [data.Id];
        },
      },
    ],
  };
}
