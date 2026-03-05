/**
 * 1:默认 2:待收货 3:待入库 4: 在库 5：封存 6：报废 7：终止 8：其他 9：汇总 10 临时收货
 */
type TABSKEY = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10';

export interface TabOption {
  key: TABSKEY;
  label: string | ((params?: any) => string); // 假设 t 是一个函数
  columns: typeof billColumns;
  id: string;
}

/**
 *  查看弹框的类型
 *  @param actionLog：操作日志
 *  @param repairRecord 维修记录
 *  @param  useRecord 领用记录
 *  @param  returnRecord 归还记录
 * */
type BILLACTIONVIEW = 'actionLog' | 'repairRecord' | 'useRecord' | 'returnRecord';
