import { TableData } from './types';
export function useTableData(props: any) {
  const processOriginData = (data: TableData[], tableId: string, matchField: string) => {
    return data.map((row, index) => ({
      ...row,
      [matchField]: row[matchField] ?? row.seq ?? index + 1,
      id: row.id || `temp_${tableId}_${index}`,
    }));
  };

  const findRowByMatchField = (data: TableData[], matchField: string, matchValue: any) => {
    return data.find(row => {
      const rowValue = row[matchField];
      return rowValue != null && String(rowValue) === String(matchValue);
    });
  };

  return {
    processOriginData,
    findRowByMatchField,
  };
}
