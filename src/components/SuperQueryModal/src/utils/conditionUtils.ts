export const sourceTypeOptions = [
  { id: 1, fullName: '字段' },
  { id: 2, fullName: '自定义' },
];
export const logicOptions = [
  { id: 'and', fullName: 'and' },
  { id: 'or', fullName: 'or' },
];
export const baseSymbolOptions = [
  { id: '==', fullName: '等于' },
  { id: '<>', fullName: '不等于' },
  { id: '>=', fullName: '大于等于' },
  { id: '>', fullName: '大于' },
  { id: '<=', fullName: '小于等于' },
  { id: '<', fullName: '小于' },
  { id: 'like', fullName: '包含' },
  { id: 'notLike', fullName: '不包含' },
  { id: 'null', fullName: '为空' },
  { id: 'notNull', fullName: '不为空' },
];
export const notStringSymbolOptions = [
  { id: '==', fullName: '等于' },
  { id: '<>', fullName: '不等于' },
  { id: '>=', fullName: '大于等于' },
  { id: '>', fullName: '大于' },
  { id: '<=', fullName: '小于等于' },
  { id: '<', fullName: '小于' },
  { id: 'null', fullName: '为空' },
  { id: 'notNull', fullName: '不为空' },
];
export const rangeSymbolOptions = [
  { id: '>=', fullName: '大于等于' },
  { id: '>', fullName: '大于' },
  { id: '==', fullName: '等于' },
  { id: '<=', fullName: '小于等于' },
  { id: '<', fullName: '小于' },
  { id: '<>', fullName: '不等于' },
  { id: 'between', fullName: '介于' },
  { id: 'null', fullName: '为空' },
  { id: 'notNull', fullName: '不为空' },
];
export const selectSymbolOptions = [
  { id: '==', fullName: '等于' },
  { id: '<>', fullName: '不等于' },
  { id: 'in', fullName: '包含任意一个' },
  { id: 'notIn', fullName: '不包含任意一个' },
  { id: 'null', fullName: '为空' },
  { id: 'notNull', fullName: '不为空' },
];
export const switchSymbolOptions = [
  { id: '==', fullName: '等于' },
  { id: '<>', fullName: '不等于' },
];
export const locationSymbolOptions = [
  { id: 'like', fullName: '包含' },
  { id: 'notLike', fullName: '不包含' },
  { id: 'null', fullName: '为空' },
  { id: 'notNull', fullName: '不为空' },
];
export const relationFormSymbolOptions = [...switchSymbolOptions, { id: 'null', fullName: '为空' }, { id: 'notNull', fullName: '不为空' }];
export const useRangeSymbolList = ['calculate', 'inputNumber', 'rate', 'slider', 'datePicker', 'timePicker', 'createTime', 'modifyTime'];
export const useSelectSymbolList = [
  'radio',
  'checkbox',
  'select',
  'treeSelect',
  'cascader',
  'areaSelect',
  'organizeSelect',
  'depSelect',
  'posSelect',
  'userSelect',
  'usersSelect',
  'factoryAreaSelect',
  'roleSelect',
  'groupSelect',
  'createUser',
  'modifyUser',
  'currOrganize',
  'currPosition',
  'popupTableSelect',
];
export const useSwitchSymbolList = ['switch'];
export const useRelationFormSymbolList = ['relationForm', 'popupSelect'];
export const notSupportList = [
  'relationFormAttr',
  'popupAttr',
  'uploadFile',
  'uploadImg',
  'colorPicker',
  'editor',
  'link',
  'button',
  'text',
  'alert',
  'table',
  'sign',
  'signature',
];
