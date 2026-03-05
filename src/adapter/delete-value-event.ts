import { isNullOrUnDef } from '/@/utils/is';

/**
 * 清除表格单元格中的名称字段值
 * 当用户按下Delete键时触发，用于清除与ID字段关联的名称字段
 * @param params 包含单元格区域信息的参数
 * @param params.cellAreas 单元格区域数组，包含选中的行和列信息
 */
export function deleteCellValueName(params: { cellAreas: Array<{ rows: Array<any>; cols: Array<any> }> }) {
  const { rows, cols } = params.cellAreas[0];
  rows.forEach(row => {
    cols.forEach(column => {
      // 支持按delete按键删除Name
      const { field } = column;
      if (!isNullOrUnDef(row[`${field}Name`])) {
        row[`${field}Name`] = null;
      }
      // 清除将Id替换为Name的字段值（如将userId转为userName）
      const cacheField = column?.editRender?.cacheField || field.replace('Id', 'Name');
      if (cacheField !== field && !isNullOrUnDef(row[`${cacheField}`])) {
        row[`${cacheField}`] = null;
      }
    });
  });
}
