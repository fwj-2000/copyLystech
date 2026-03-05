import type { FormActionType } from '/@/components/Form';

import { useBaseStore } from '/@/store/modules/base';

/**
 * @description 从联合类型中提取出数组类型
 */
type PickArray<T> = T extends Array<any> ? T : never;

const baseStore = useBaseStore();

/**
 * @description 从数据字典中，获取并设置筛选表单中`select`的可选项
 * @param formInstance 表单实例
 * @param dictCode 字典编码
 * @param field 筛选字段名称
 */
export async function setSearchFormOpiotns(formInstance: FormActionType, dictCode: string, field: string) {
  if (!formInstance || !dictCode || !field) {
    throw new Error('缺少参数');
  }

  return baseStore.getDictionaryData(dictCode, true).then(options => {
    formInstance.updateSchema({
      field,
      componentProps: {
        options: (options as PickArray<typeof options>).map(item => ({ id: item.enCode, fullName: item.fullName })),
      },
    });
  });
}

/**
 * @description 从数据字典中，获取并返回选项列表
 * @param dictCode 字典编码
 * @returns 选项列表
 */
export function getOptions(dictCode: string) {
  const options: Array<any> = [];
  dictCode &&
    baseStore.getDictionaryData(dictCode).then(list => {
      (list as PickArray<typeof options>).forEach(item => {
        options.push({
          ...item,
          id: item.enCode,
          fullName: item.fullName,
          value: item.enCode,
          label: item.fullName,
        });
      });
    });
  return options;
}
