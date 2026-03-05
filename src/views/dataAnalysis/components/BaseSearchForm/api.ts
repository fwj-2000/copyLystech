import { unref } from 'vue';
import { ISearchFormState, TFormItemOption } from './types';
import { isFunction, set } from 'lodash-es';

// 组件api
class Api {
  public state = {} as ISearchFormState;
  mount(state) {
    this.state = state;
  }

  // 设置内部属性值
  setState = (key, value) => {
    set(this.state, key, value);
  };
  // 获取某一个内部属性值整个item
  getFormSignItem = (key: string) => {
    const { filterOptions, formOptions } = this.state;
    const allOptions = [...unref(filterOptions), ...unref(formOptions)];
    return allOptions.filter(item => item.key === key)[0];
  };

  // 获取表单参数
  getFormParams = () => {
    let params: any = {};
    const { filterOptions, formOptions, searchFormValue } = this.state;
    const allOptions = [...unref(filterOptions), ...unref(formOptions)];
    allOptions.forEach((item: TFormItemOption & { options }) => {
      if (!item) return;
      const { isHide = false, getParam, options = [] } = item ?? {};
      if (isHide) return;
      const value = searchFormValue[item.key] ?? '';
      if (isFunction(getParam)) {
        params = {
          ...params,
          ...getParam(value, searchFormValue, options),
        };
      } else {
        params[item.key] = value;
      }
    });
    return params;
  };
}
export default Api;
