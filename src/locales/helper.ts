import type { LocaleType } from '/#/config';

import { set } from 'lodash-es';

export const loadLocalePool: LocaleType[] = [];

export function setHtmlPageLang(locale: LocaleType) {
  document.querySelector('html')?.setAttribute('lang', locale);
}

export function setLoadLocalePool(cb: (loadLocalePool: LocaleType[]) => void) {
  cb(loadLocalePool);
}

export function genMessage(langs: Record<string, Record<string, any>>, prefix = 'lang') {
  const obj: Recordable = {};

  Object.keys(langs).forEach(key => {
    const langFileModule = langs[key].default;
    let fileName = key.replace(`./${prefix}/`, '').replace(/^\.\//, '');
    const lastIndex = fileName.lastIndexOf('.');
    fileName = fileName.substring(0, lastIndex);
    const keyList = fileName.split('/');
    const moduleName = keyList.shift();
    const objKey = keyList.join('.');

    if (moduleName) {
      if (objKey) {
        set(obj, moduleName, obj[moduleName] || {});
        set(obj[moduleName], objKey, langFileModule);
      } else {
        set(obj, moduleName, langFileModule || {});
      }
    }
  });
  return obj;
}

export function flattenObject(obj: any, prefix: string = ''): { [key: string]: string } {
  let result: { [key: string]: string } = {};

  // 遍历对象的所有属性
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      // 生成新的键
      const newKey = prefix ? `${prefix}.${key}` : key;

      // 如果属性值是对象且不是 null，递归扁平化
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        result = { ...result, ...flattenObject(obj[key], newKey) };
      } else {
        // 否则，将该值直接赋给新键
        result[newKey] = String(obj[key]);
      }
    }
  }

  return result;
}
