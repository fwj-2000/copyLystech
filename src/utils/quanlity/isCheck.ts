import { message } from 'ant-design-vue';

export function handleCheckType(list) {
  const currentType = list[0].demandType;
  for (let i = 1; i < list.length; i++) {
    if (list[i].demandType !== currentType) {
      message.info('请选择相同类型的需求~');
      return false;
    }
  }
  return true;
}
