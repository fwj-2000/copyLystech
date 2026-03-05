import type { RouteLocationNormalized, RouteRecordNormalized } from 'vue-router';
import type { App, Component } from 'vue';

import { unref } from 'vue';
import { isArray, isExist, isNullOrUnDef, isObject } from '/@/utils/is';
import { cloneDeep, isEqual, mergeWith, unionWith } from 'lodash-es';
import { useI18n } from '/@/hooks/web/useI18n';
import { useLocaleStoreWithOut } from '/@/store/modules/locale';
const localeStore = useLocaleStoreWithOut();
const locale = localeStore.getLocale;
export const noop = () => {};

/**
 * @description:  Set ui mount node
 */
export function getPopupContainer(node?: HTMLElement): HTMLElement {
  return (node?.parentNode as HTMLElement) ?? document.body;
}

/**
 * Add the object as a parameter to the URL
 * @param baseUrl url
 * @param obj
 * @returns {string}
 * eg:
 *  let obj = {a: '3', b: '4'}
 *  setObjToUrlParams('www.baidu.com', obj)
 *  ==>www.baidu.com?a=3&b=4
 */
export function setObjToUrlParams(baseUrl: string, obj: any): string {
  let parameters = '';
  for (const key in obj) {
    parameters += key + '=' + encodeURIComponent(obj[key]) + '&';
  }
  parameters = parameters.replace(/&$/, '');
  return /\?$/.test(baseUrl) ? baseUrl + parameters : baseUrl.replace(/\/?$/, '?') + parameters;
}

export function kebabToCamelCase(str: string): string {
  return str
    .split('-')
    .filter(Boolean)
    .map((word, index) => (index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)))
    .join('');
}

/**
 递归合并两个对象。
 Recursively merge two objects.
 @param target 目标对象，合并后结果存放于此。The target object to merge into.
 @param source 要合并的源对象。The source object to merge from.
 @returns 合并后的对象。The merged object.
 */
export function deepMerge<T extends object | null | undefined, U extends object | null | undefined>(target: T, source: U): T & U {
  return mergeWith(cloneDeep(target), source, (objValue, srcValue) => {
    if (isObject(objValue) && isObject(srcValue)) {
      return mergeWith(cloneDeep(objValue), srcValue, (prevValue, nextValue) => {
        // 如果是数组，合并数组(去重) If it is an array, merge the array (remove duplicates)
        return isArray(prevValue) ? unionWith(prevValue, nextValue, isEqual) : undefined;
      });
    }
  });
}

export function openWindow(url: string, opt?: { target?: TargetContext | string; noopener?: boolean; noreferrer?: boolean }) {
  const { target = '_blank', noopener = true, noreferrer = true } = opt || {};
  const feature: string[] = [];

  noopener && feature.push('noopener=yes');
  noreferrer && feature.push('noreferrer=yes');

  window.open(url, target, feature.join(','));
}

// dynamic use hook props
export function getDynamicProps<T extends Record<string, unknown>, U>(props: T): Partial<U> {
  const ret: Recordable = {};

  Object.keys(props).map(key => {
    ret[key] = unref((props as Recordable)[key]);
  });

  return ret as Partial<U>;
}

export function getRawRoute(route: RouteLocationNormalized): RouteLocationNormalized {
  if (!route) return route;
  const { matched, ...opt } = route;
  return {
    ...opt,
    matched: (matched
      ? matched.map(item => ({
          meta: item.meta,
          name: item.name,
          path: item.path,
        }))
      : undefined) as RouteRecordNormalized[],
  };
}

// https://github.com/vant-ui/vant/issues/8302
type EventShim = {
  new (...args: any[]): {
    $props: {
      onClick?: (...args: any[]) => void;
    };
  };
};

export type WithInstall<T> = T & {
  install(app: App): void;
} & EventShim;

export type CustomComponent = Component & { displayName?: string };

export const withInstall = <T extends CustomComponent>(component: T, alias?: string) => {
  (component as Record<string, unknown>).install = (app: App) => {
    const compName = component.name || component.displayName;
    if (!compName) return;
    app.component(compName, component);
    if (alias) {
      app.config.globalProperties[alias] = component;
    }
  };
  return component as WithInstall<T>;
};

// 开始：解决老的vue2动态导入文件语法vite不支持的问题
const allModules = import.meta.glob('../views/**/*.vue');
export function importViewsFile(path): Promise<any> {
  if (path.startsWith('/')) {
    path = path.substring(1);
  }
  let page = '',
    realPage = '';
  if (path.endsWith('.vue')) {
    page = `../views/${path}`;
    realPage = `../views/${path}`;
  } else {
    page = `../views/${path}.vue`;
    realPage = `../views/${path}/index.vue`;
  }
  return new Promise((resolve, reject) => {
    let flag = true;
    for (const path in allModules) {
      if (path == page || path == realPage) {
        flag = false;
        allModules[path]().then(mod => {
          resolve(mod);
        });
      }
    }
    if (flag) {
      reject('该文件不存在:' + page);
    }
  });
}
// 结束：解决老的vue2动态导入文件语法 vite不支持的问题

export function formatTableDefaultText(text) {
  if (text && text?.type) return text;
  if (`${text}` == 'null' || `${text}` == 'undefined') return '/';
  return text.length || typeof text === 'number' ? text : ['/'];
}

export const getMenuId = route => {
  const { meta } = route;
  return meta?.modelId;
};

/**
 * 国际化转换code
 * @param moduleCode 国际化业务code
 * @param i18nFieldCode
 * */
export function transformI18nCode(moduleCode, i18nFieldCode) {
  switch (i18nFieldCode) {
    case 'action':
      return 'common.action';
    case 'seq':
      return 'component.table.index';
    default:
      // i18nFieldCode判断是否是通用的
      let _moduleCode = i18nFieldCode.indexOf('CommonCol') > -1 ? '' : `.${moduleCode}`;
      if (!moduleCode) {
        return `dict.CommonCol.${i18nFieldCode}`;
      }
      return `dict${_moduleCode}.${i18nFieldCode}`;
  }
}

/**
 * 国际化转换
 * @param moduleCode
 * @param i18nFieldCode 国际化code
 * @param params 追加参数
 * */
export function transformI18n(moduleCode, i18nFieldCode, params?: Record<string, unknown> | Array<unknown>) {
  const { t } = useI18n();
  let text = t(transformI18nCode(moduleCode, i18nFieldCode), (params as any) ?? []);
  // if (text === transformI18nCode(moduleCode, i18nFieldCode) && (text.endsWith('Desc') || text.endsWith('Name'))) {
  //   text = t(text.replace(/Desc|Name/, ''));
  // }
  return text;
}

/**
 * BasicTable表头国际化
 * @param columns 表头列表
 * @param i18nModuleCode 国际化code
 * */
export function transformI18nBasicTable(columns: any[], i18nModuleCode: string = '') {
  if (!columns) return [];
  try {
    return columns.map(el => {
      if (!el.baseTitle) {
        el.baseTitle = el.customTitle || el.title;
      }

      // 特殊表头和自定义表头，不做处理
      if (!el.dataIndex) {
        return el;
      }

      const i18nFieldCode = el.i18nField || el.dataIndex;
      const tCode = transformI18nCode(i18nModuleCode, i18nFieldCode);
      const resultText = transformI18n(i18nModuleCode, i18nFieldCode);

      if (resultText === tCode) return el;
      if (isChinese(resultText) && resultText !== el.baseTitle && locale === 'zh_CN') {
        el.customTitle = el.baseTitle;
      } else {
        if (!isChinese(el.customTitle)) {
          if (el?.customTitle !== el.baseTitle) {
            el.customTitle = resultText;
          } else if (!isChinese(resultText)) {
            el.customTitle = resultText;
          }
        } else {
          el.customTitle = resultText;
        }
      }
      el.title = el.customTitle; // 右上角表格的动态表头值
      return el;
    });
  } catch (error) {
    console.error('transformI18nVxeTable error', error);
    return columns;
  }
}

/**
 * 判断是否包含中文的
 * @param str 待判断的字符串
 * @returns
 */
function isChinese(str: string): boolean {
  // return /^[\u4e00-\u9fa5]+$/.test(str);
  return /[\u4e00-\u9fa5]/.test(str);
}

/**
 * vxe表头column处理
 * @param el 每列数据
 * @param i18nModuleCode 国际化code
 * @param i18nFieldCode fieldCode
 * @param i18nParams 参数
 * */
export function transformI18nColumn(el, i18nModuleCode, i18nFieldCode, i18nParams) {
  const tCode = transformI18nCode(i18nModuleCode, i18nFieldCode);
  const resultText = transformI18n(i18nModuleCode, i18nFieldCode, i18nParams);
  if (resultText === tCode) return el;
  if (isChinese(resultText) && resultText !== el.baseTitle && locale === 'zh_CN') {
    el.title = el.baseTitle;
  } else {
    if (!isChinese(el.title)) {
      if (el?.title !== el.baseTitle) {
        el.title = resultText;
      } else if (!isChinese(resultText)) {
        el.title = resultText;
      }
    } else {
      el.title = resultText;
    }
  }
  // 多级表头递归处理
  if (el.children && el.children.length > 0) {
    el.children = transformI18nVxeTable(el.children, i18nModuleCode);
  }
}

/**
 * vxe表头国际化
 * @param columns 表头列表
 * @param i18nModuleCode 国际化code
 * @param otherConfig 其他配置
 * */
export function transformI18nVxeTable(columns: any[], i18nModuleCode: string = '', otherConfig = null) {
  if (!columns) return [];
  // if (!i18nModuleCode || i18nModuleCode == '') return columns;
  try {
    return columns.map(el => {
      if (!el.baseTitle) {
        el.baseTitle = el.title;
      }
      // 特殊表头和自定义表头，不做处理
      if (el.type) {
        return el;
      }
      const { i18nField, field, i18nParams } = el;
      const i18nFieldCode = i18nField || field;
      const originWidth = el.width || el.minWidth;
      if (isNullOrUnDef(originWidth)) {
        el.minWidth = 180; // 兼容basicTable转换新表时，不设宽度引起的异常
        if (otherConfig) {
          el.minWidth = otherConfig?.minWidth || el.minWidth;
        }
      }
      if (otherConfig && otherConfig.resizeable) {
        delete el.minWidth;
      }
      // 表头翻译处理
      transformI18nColumn(el, i18nModuleCode, i18nFieldCode, i18nParams);
      return el;
    });
  } catch (error) {
    console.error('transformI18nVxeTable error', error);
    return columns;
  }
}

/**
 * BasicForm国际化
 * @param list form.schema列表配置
 * @param i18Config 配置参数
 * */
export function transformI18nBasicForm(
  list: any[],
  i18Config: {
    moduleCode: string;
    transferRange: string[];
    excludeFields?: string[];
  },
) {
  if (!list) return [];
  const i18nModuleCode = i18Config?.moduleCode;
  try {
    const excludeFields = Array.isArray(i18Config?.excludeFields) ? i18Config.excludeFields : [];

    return list.map(el => {
      if (excludeFields.includes(el.field || el.fieldName)) {
        return el;
      }

      if (!el.baseTitle) {
        el.baseTitle = el.label;
      }
      switch (el.component) {
        case 'DateRange':
        case 'RangePicker':
          // 特殊组件
          const { t } = useI18n();
          const placeholderText = [t('component.lydc.dateRange.startPlaceholder'), t('component.lydc.dateRange.endPlaceholder')];
          if (el.componentProps) {
            el.componentProps.placeholder = el.componentProps.placeholder || placeholderText;
          } else {
            el.componentProps = {
              placeholder: placeholderText,
            };
          }
          break;
        default:
          // 优先使用i18nField
          let i18nFieldCode = el.i18nField || el.field || el.fieldName;
          const transferRange = el?.transferRange || i18Config?.transferRange || 'label';
          if (i18nModuleCode) {
            // 如果当前i18nField字段为DISABLED，则不走国际化配置,保持当前标题
            if (el.i18nField === 'DISABLED') {
              break;
            }
            if (transferRange.indexOf('placeholder') > -1 && el.componentProps) {
              const placrhoderI18nFieldCode = el.componentProps.i18nField || i18nFieldCode;
              if (isExist(el.componentProps.customPlaceholder)) {
                el.componentProps.placeholder = el.componentProps.customPlaceholder;
              } else {
                el.componentProps.placeholder = transformI18n(i18nModuleCode, placrhoderI18nFieldCode);
              }
              // if(el.fieldName){
              //
              // }else {
              // }
            }
            if (transferRange.indexOf('label') > -1) {
              el.label = transformI18n(i18nModuleCode, i18nFieldCode);
            }
          } else {
            const defaultCode = `dict.CommonCol.${i18nFieldCode}`;
            const resultText = transformI18n(i18nModuleCode, i18nFieldCode);
            console.log(resultText, 'resultText++');
            if (isChinese(resultText) && resultText !== el.baseTitle && locale === 'zh_CN') {
              el.label = el.baseTitle;
            } else {
              if (!isChinese(el.label)) {
                // 只对未处理过的字段做翻译赋值
                if (el.baseTitle !== el.label && defaultCode !== resultText && el.label) {
                  el.label = resultText;
                }
              } else if (defaultCode !== resultText && el.label) {
                el.label = resultText;
              }
              if (defaultCode !== resultText && el.componentProps) {
                el.componentProps.placeholder = resultText;
              }
            }
          }

          break;
      }
      return el;
    });
  } catch (error) {
    console.error('transformI18nBasicForm error', error);
    return list;
  }
}
