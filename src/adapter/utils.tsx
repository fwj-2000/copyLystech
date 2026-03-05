import { h, nextTick } from 'vue';
import { formatToDate } from '/@/utils/dateUtil';
import { LydcInput, LydcInputNumber, LydcSelect, LydcTag, LydcDatePicker, LydcDateRange } from '/@/components/Lydc';
import { Input, Select, Textarea } from 'ant-design-vue';
import type { VxeColumnPropTypes, VxeTableDefines } from 'vxe-table';
import type { VxeGlobalRendererHandles } from 'vxe-pc-ui';
import XEUtils from 'xe-utils';
import { ApiSelect } from '/@/components/Form';
import { isArray, isEmpty, isObject, isFunction, isNullOrUnDef } from '/@/utils/is';
import CustomUserSelect from '/@/components/Lydc/Organize/src/CustomUserSelect.vue';
import { cloneDeep, set } from 'lodash-es';
import { WangEditor } from '/@/components/WangEditor/index';
import HtmlRender from '/@/components/WangEditor/src/htmlRender.vue';
import { formatWithOriginalDecimals } from '/@/utils/baseinfo/number';

export function dateRenderTableDefault(renderOpts, { column, row }) {
  if (!column.cellType) {
    // `cellType`设置为`string`，复制或者导出到excel时，将时间统一转为文本格式
    column.cellType = 'string';
  }
  const cellTime = row[column.field];
  if (!cellTime) return ''; // 当不存在值时，不显示数据
  const { format } = renderOpts;
  const dateFormat = format || 'YYYY-MM-DD HH:mm:ss'; // 添加默认时间格式
  const formatTime = formatToDate(cellTime, dateFormat);
  nextTick(() => {
    if (!row.copyData) {
      row.copyData = {};
    }
    // 增加复制数据
    column.copyDataRow = column.field;
    row.copyData[column['field']] = formatTime;
  });
  return h('span', formatTime);
}

export function tagRenderTableDefault(renderOpts, { column, row }) {
  const currentValue = row[column.field];
  // 空数据的情况下，不做渲染处理
  if (currentValue == 'undefined' || currentValue == null) {
    return '';
  }
  const { options } = renderOpts;
  const option = options.find(item => item.id == currentValue);
  // 没有配置options的情况下，直接采用rowKey的值或是field的值
  const text = option ? option.fullName || row[option.rowKey] : row[options[0].rowKey] || row[column.field];
  nextTick(() => {
    column.copyDataRow = column.field;
    set(row, `copyData.${column['field']}`, text);
  });
  return text
    ? h(LydcTag, {
        theme: option?.theme || 'blue',
        text: text,
      })
    : '';
}

export function inputRenderTableEdit(renderOpts, params) {
  const { $table, column, row } = params;
  const { editRender } = column;
  if (editRender) {
    editRender.autoFocus = true;
  }
  const { props } = editRender;
  // 处理动态的disabled
  if (props?.dynamicDisabled && isFunction(props.dynamicDisabled)) {
    const isDisabled = props.dynamicDisabled(row);
    props.disabled = isDisabled;
  }
  return h(Input, {
    class: 'w-full',
    allowClear: true,
    ...renderOpts.props,
    value: params.row[params.column.field],
    'onUpdate:value': (value: any) => {
      // 把表格行数据修改
      params.row[params.column.field] = value;
      // 更新状态
      $table.updateStatus(params);
    },
    onChange: (...args) => {
      const { props } = renderOpts;
      props?.onChange?.(...args, params);
    },
    onKeydown: (...args) => {
      const { props } = renderOpts;
      props?.onKeydown?.(...args, params);
    },
  });
}

// 可编辑激活模板
export function customUserSelectRenderTableEdit(renderOpts, params) {
  const { $table, row, column } = params;
  let disabled = false;
  if (column.editRender.props?.dynamicDisabled && isFunction(column.editRender.props?.dynamicDisabled)) {
    const isDisabled = column.editRender.props.dynamicDisabled(row);
    disabled = isDisabled;
  }
  return h(CustomUserSelect, {
    class: 'w-full',
    disabled,
    ...renderOpts.props,
    value: params.row[params.column.field],
    label: params.row[`${params.column.field.replaceAll('Id', '')}Name`],
    'onUpdate:value': (value: any, option) => {
      // 把表格行数据修改
      params.row[params.column.field] = value;
      // 若是多选，则对全称进行拼接；单选则直接对返回的对象进行取值
      const fullName = isArray(option) ? option.map(item => item.fullName).join(',') : option?.fullName;
      const { field } = params.column;
      const convertedField = field.includes('Id') ? field.replaceAll('Id', 'Name') : `${field}Name`;
      // 设置对应的 Name 字段
      params.row[renderOpts.cacheField || convertedField] = fullName;
      // 设置 copyData 相关
      column.copyDataRow = convertedField;
      set(row, `copyData.${convertedField}`, fullName);
      // 更新状态
      $table.updateStatus(params);
    },
    onChange: (...args) => {
      const { props } = renderOpts;
      props?.onChange?.(...args, params);
    },
  });
}

// 可编辑显示模板
export function customUserSelectRenderTableCell(renderOpts, params) {
  const { row, column } = params;
  if (renderOpts.cacheField) {
    return h('span', row[renderOpts.cacheField]);
  } else {
    // eg: lastModifyId --> lastModifyName
    // row[`${params.column.field.replaceAll("Id", "")}Name`]
    const fieldName = params.column.field.replaceAll('Id', '') + 'Name';
    nextTick(() => {
      // 增加复制数据
      column.copyDataRow = fieldName;
      set(row, `copyData.${fieldName}`, row[fieldName]);
    });
    return h('span', row[fieldName]);
  }
}

/**
 * 用户选择 - 列筛选
 */
export function customUserSelectFilterRender(defaultProps?: { [key: string]: any }) {
  return function (
    renderOpts: VxeColumnPropTypes.FilterRender & {
      name: string;
    },
    params: VxeGlobalRendererHandles.RenderFilterParams,
  ) {
    const { column } = params;
    const { attrs } = renderOpts;
    return [
      h(
        'div',
        {
          class: 'vxe-table--filter-antd-wrapper',
        },
        column.filters.map((option, oIndex) => {
          const optionValue = option.data;
          return h(CustomUserSelect, {
            key: oIndex,
            ...attrs,
            ...getCellEditFilterProps(renderOpts, params, optionValue, defaultProps),
            ...getFilterOns(renderOpts, params, option, () => {
              // 处理 change 事件相关逻辑
              handleConfirmFilter(params, !!option.data, option);
            }),
          });
        }),
      ),
    ];
  };
}

export function apiSelectRenderTableEdit(renderOpts, params) {
  renderOpts.autoFocus = '.ant-select-selection-search-input';
  const { $table, column, row } = params;
  const { props } = column.editRender;
  // 添加当前行数据的入参配置
  if (props?.rowParams) {
    const formatParams = props.params || {};
    Object.entries(props.rowParams).forEach(([key, value]) => {
      formatParams[key] = row[value];
    });
    // 如果原来有参数，则合并参数，否则直接赋值
    if (isObject(props.params)) {
      Object.assign(cloneDeep(props.params), formatParams);
      // props.params = { ...props.params, ...formatParams };
    } else {
      props.params = formatParams;
    }
  }
  // 处理动态的disabled
  if (props?.dynamicDisabled && isFunction(props?.dynamicDisabled)) {
    const isDisabled = props.dynamicDisabled(row);
    props.disabled = isDisabled;
  }

  // 启用`isDefaultLabel(boolean)`时，会自动将`cacheField`，赋值给`ApiSelect`的`defaultLabel`，将会options中未查询到数据的情况下，默认添加一条数据
  if (renderOpts.isDefaultLabel && renderOpts.cacheField) {
    props.defaultLabel = row[renderOpts.cacheField];
  }

  let options = renderOpts.options || renderOpts.props?.options || [];
  if (renderOpts?.dynamicOptionsField) {
    options = params.row[renderOpts.dynamicOptionsField]; // 添加动态options
  }

  return h(ApiSelect, {
    class: 'w-full',
    options: options,
    ...renderOpts.props,
    value: params.row[params.column.field],
    'onUpdate:value': (value: any, option) => {
      // 把表格行数据修改
      params.row[params.column.field] = value;
      if (!option && value !== undefined) return;
      let cacheFieldValue; // 设置cacheField的值
      if (value == undefined) {
        cacheFieldValue = '';
      } else if (option && isArray(option)) {
        cacheFieldValue = option.map(item => item.label).join(',');
      } else if (option?.label) {
        cacheFieldValue = option.label;
      } else {
        return;
      }
      const cacheFieldLabel = renderOpts.cacheField || `${params.column.field}Name`;
      params.row[cacheFieldLabel] = cacheFieldValue;
      // 更新状态
      $table.updateStatus(params);
    },
    onOptionsChange: options => {
      const value = params.row[params.column.field];
      const target = options.find(item => item.value === value);
      if (options.length > 0 && target) {
        if (renderOpts.cacheField) {
          params.row[renderOpts.cacheField] = target?.label;
        } else {
          params.row[`${params.column.field}Name`] = target?.label;
        }
      }
    },
    onChange: (...args) => {
      const { props } = renderOpts;
      props?.onChange?.(...args, params);
    },
    afterFetch: (...args) => {
      props.afterFetch?.(...args, params);
    },
  });
}

export function dateRangeFilterRender(defaultProps?: { [key: string]: any }) {
  return function (
    renderOpts: VxeColumnPropTypes.FilterRender & {
      name: string;
    },
    params: VxeGlobalRendererHandles.RenderFilterParams,
  ) {
    const { column } = params;
    const { attrs } = renderOpts;
    return [
      h(
        'div',
        {
          class: 'vxe-table--filter-antd-wrapper',
        },
        column.filters.map((option, oIndex) => {
          const optionValue = option.data;
          return h(LydcDateRange, {
            key: oIndex,
            ...attrs,
            ...getCellEditFilterProps(renderOpts, params, optionValue, defaultProps),
            ...getFilterOns(renderOpts, params, option, () => {
              // 处理 change 事件相关逻辑
              handleConfirmFilter(params, !!option.data, option);
            }),
          });
        }),
      ),
    ];
  };
}

export function inputNumberRenderTableCell(renderOpts, params) {
  const { row } = params;
  // 速率类型特殊处理
  const fieldValue = row[params.column.field];
  if (isNullOrUnDef(fieldValue)) {
    return '';
  }
  if (renderOpts.props?.rate) {
    return h('span', fieldValue);
  }
  // 千分位处理
  if (renderOpts.props?.thousands) {
    const thousandsValue = formatWithOriginalDecimals(fieldValue, renderOpts.props || {});
    return h('span', thousandsValue);
  }
  return h('span', row[renderOpts.cacheField] || row[`${params.column.field}Name`] || row[params.column.field]);
}

export function aSelectRenderTableEdit(renderOpts, params) {
  const { $table, row } = params;
  const { props } = renderOpts;
  let options = renderOpts.options || renderOpts.props?.options || [];
  if (renderOpts?.dynamicOptionsField) {
    options = params.row[renderOpts.dynamicOptionsField]; // 添加动态options
  }
  if (props?.dynamicDisabled && isFunction(props.dynamicDisabled)) {
    const isDisabled = props.dynamicDisabled(row);
    props.disabled = isDisabled;
  }
  return h(Select, {
    class: 'w-full',
    options: options,
    ...renderOpts.props,
    value: params.row[params.column.field],
    'onUpdate:value': (value: any) => {
      // 把表格行数据修改
      params.row[params.column.field] = value;
      // 更新状态
      $table.updateStatus(params);
    },
    onChange: (...args) => {
      const { props } = renderOpts;
      props?.onChange?.(...args, params);
    },
  });
}

export function aSelectRenderTableCell(renderOpts, params) {
  const value = params.row[params.column.field];
  // const options = renderOpts.options || renderOpts.props?.options || [];
  let options = renderOpts.options || renderOpts.props?.options || [];
  if (renderOpts?.dynamicOptionsField) {
    options = params.row[renderOpts.dynamicOptionsField]; // 添加动态options
  }
  const fieldNames = renderOpts.fieldNames || renderOpts.props?.fieldNames || {};
  params.column.copyDataRow = params.column.field;
  try {
    if (options.length > 0) {
      let option;
      if (fieldNames && !isEmpty(fieldNames)) {
        option = options.find((item: any) => item[fieldNames['value']] === value);
      } else {
        option = options.find((item: any) => item.value === value);
      }
      set(params.row, `copyData.${params.column.field}`, option?.label || option[fieldNames['label']]);
      return h('span', option?.label || option[fieldNames['label']]);
    }
  } catch (error) {
    set(params.row, `copyData.${params.column.field}`, value);
    return h('span', value);
  }
  set(params.row, `copyData.${params.column.field}`, value);
  return h('span', value);
}

export function numRenderTableCell(renderOpts, { column, row }) {
  let numberValue = row[column.field];
  if (!numberValue) return numberValue;
  const _props = renderOpts.props || {};
  _props.thousands = _props.thousands || true; // 默认开启千分位
  _props.round = _props.round || false; // 默认不四舍五入
  if (_props.thousands) {
    numberValue = formatWithOriginalDecimals(numberValue);
    return h('span', numberValue);
  }
  return numberValue;
}

export function inputFilterRender(defaultProps?: { [key: string]: any }) {
  return function (
    renderOpts: VxeColumnPropTypes.FilterRender & {
      name: string;
    },
    params: VxeGlobalRendererHandles.RenderFilterParams,
  ) {
    const { column } = params;
    const { attrs } = renderOpts;
    return [
      h(
        'div',
        {
          class: 'vxe-table--filter-antd-wrapper',
        },
        column.filters.map((option, oIndex) => {
          const optionValue = option.data;
          return h(LydcInput, {
            key: oIndex,
            ...attrs,
            ...getCellEditFilterProps(renderOpts, params, optionValue, defaultProps),
            ...getFilterOns(renderOpts, params, option, () => {
              // 处理 change 事件相关逻辑
              handleConfirmFilter(params, !!option.data, option);
            }),
          });
        }),
      ),
    ];
  };
}

export function apiSelectFilterRender(defaultProps?: { [key: string]: any }) {
  return function (
    renderOpts: VxeColumnPropTypes.FilterRender & {
      name: string;
    },
    params: VxeGlobalRendererHandles.RenderFilterParams,
  ) {
    const { column } = params;
    const { attrs } = renderOpts;
    return [
      h(
        'div',
        {
          class: 'vxe-table--filter-antd-wrapper',
        },
        column.filters.map((option, oIndex) => {
          const optionValue = option.data;
          return h(ApiSelect, {
            key: column.field + oIndex, // 防止缓存
            ...attrs,
            ...getCellEditFilterProps(renderOpts, params, optionValue, defaultProps),
            ...getFilterOns(renderOpts, params, option, () => {
              // 处理 change 事件相关逻辑
              handleConfirmFilter(params, !!option.data, option);
            }),
          });
        }),
      ),
    ];
  };
}

export function aSelectFilterRender(defaultProps?: { [key: string]: any }) {
  return function (
    renderOpts: VxeColumnPropTypes.FilterRender & {
      name: string;
    },
    params: VxeGlobalRendererHandles.RenderFilterParams,
  ) {
    const { column } = params;
    const { attrs } = renderOpts;
    return [
      h(
        'div',
        {
          class: 'vxe-table--filter-antd-wrapper',
        },
        column.filters.map((option, oIndex) => {
          const optionValue = option.data;
          return h(LydcSelect, {
            key: oIndex,
            ...attrs,
            ...getCellEditFilterProps(renderOpts, params, optionValue, defaultProps),
            ...getFilterOns(renderOpts, params, option, () => {
              // 处理 change 事件相关逻辑
              handleConfirmFilter(params, !!option.data, option);
            }),
          });
        }),
      ),
    ];
  };
}

export function createFilterRender(defaultProps?: { [key: string]: any }) {
  return function (
    renderOpts: VxeColumnPropTypes.FilterRender & {
      name: string;
    },
    params: VxeGlobalRendererHandles.RenderFilterParams,
  ) {
    const { column } = params;
    const { attrs } = renderOpts;
    return [
      h(
        'div',
        {
          class: 'vxe-table--filter-antd-wrapper',
        },
        column.filters.map((option, oIndex) => {
          const optionValue = option.data;
          console.log({
            ...getCellEditFilterProps(renderOpts, params, optionValue, defaultProps),
          });
          return h(LydcInput, {
            key: oIndex,
            ...attrs,
            ...getCellEditFilterProps(renderOpts, params, optionValue, defaultProps),
            ...getFilterOns(renderOpts, params, option, () => {
              // 处理 change 事件相关逻辑
              handleConfirmFilter(params, !!option.data, option);
            }),
          });
        }),
      ),
    ];
  };
}

export function inputNumberRenderTableEdit(renderOpts, params) {
  const { $table, column, row } = params;
  const { editRender } = column;
  const { props } = renderOpts;

  if (editRender) {
    editRender.autoFocus = true;
  }
  // console.log('🚀 ~ inputNumberRenderTableEdit ~ props.dynamicDisabled: ');
  // 处理动态的disabled
  if (props?.dynamicDisabled && isFunction(props.dynamicDisabled)) {
    const isDisabled = props.dynamicDisabled(row);
    props.disabled = isDisabled;
  }
  return h(LydcInputNumber, {
    class: 'w-full',
    ...renderOpts.props,
    value: params.row[params.column.field],
    'onUpdate:value': (value: any) => {
      // 把表格行数据修改
      params.row[params.column.field] = value;
      // 更新状态
      $table.updateStatus(params);
    },
    onChange: (...args) => {
      props?.onChange?.(...args, params);
    },
  });
}

export function textareaRenderTableEdit(renderOpts, params) {
  const { $table, column } = params;
  const { editRender } = column;
  if (editRender) {
    editRender.autoFocus = true;
  }
  return h(Textarea, {
    class: 'w-full',
    autoSize: { minRows: 1, maxRows: 3 },
    ...renderOpts.props,
    value: params.row[params.column.field],
    'onUpdate:value': (value: any) => {
      // 把表格行数据修改
      params.row[params.column.field] = value;
      // 更新状态
      $table.updateStatus(params);
    },

    onKeydown: (e: KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        // 阻止文本域回车换行冒泡 到vxe-table
        e.stopPropagation();
      }
    },
  });
}

export function editorRenderTableEdit(renderOpts, params) {
  const { column } = params;
  const { editRender } = column;
  if (editRender) {
    editRender.autoFocus = true;
  }
  return h(WangEditor, {
    class: 'w-full',
    ...renderOpts.props,
    value: params.row[params.column.field],
    'onUpdate:value': (value: any) => {
      params.row[`${params.column.field}Name`] = value;
    },
    onDestroyed: editor => {
      const html = editor.getHtml();
      params.row[`${params.column.field}`] = html;
    },
  });
}

export function datePickerRenderTableEdit(renderOpts, params) {
  const { $table, row } = params;
  const { props } = renderOpts;

  // 处理动态的disabled
  if (props?.dynamicDisabled && isFunction(props.dynamicDisabled)) {
    const isDisabled = props.dynamicDisabled(row);
    props.disabled = isDisabled;
  }

  return h(LydcDatePicker, {
    class: 'w-full',
    // showTime: true,
    ...renderOpts.props,
    value: params.row[params.column.field],
    'onUpdate:value': (value: any) => {
      let formatTime = value;
      if (!isNullOrUnDef(value)) {
        const { props } = renderOpts;
        const dateFormat = props?.valueFormat || 'x';
        formatTime = dateFormat ? formatToDate(value, dateFormat) : value;
      }
      // 把表格行数据修改
      params.row[params.column.field] = formatTime;
      // 更新状态
      $table.updateStatus(params);
    },
    onChange: (...args) => {
      const { props } = renderOpts;
      props?.onChange?.(...args, params);
    },
  });
}

export function datePickerFilterRender(defaultProps?: { [key: string]: any }) {
  return function (
    renderOpts: VxeColumnPropTypes.FilterRender & {
      name: string;
    },
    params: VxeGlobalRendererHandles.RenderFilterParams,
  ) {
    const { column } = params;
    const { attrs } = renderOpts;
    return [
      h(
        'div',
        {
          class: 'vxe-table--filter-antd-wrapper',
        },
        column.filters.map((option, oIndex) => {
          const optionValue = option.data;
          return h(LydcDatePicker, {
            key: oIndex,
            ...attrs,
            ...getCellEditFilterProps(renderOpts, params, optionValue, defaultProps),
            ...getFilterOns(renderOpts, params, option, () => {
              // 处理 change 事件相关逻辑
              handleConfirmFilter(params, !!option.data, option);
            }),
          });
        }),
      ),
    ];
  };
}

export function datePickerRenderTableCell(renderOpts, { column, row }) {
  const cellTime = row[column.field];
  if (!cellTime) return '';
  const { props } = renderOpts;
  const dateFormat = props?.valueFormat || props?.format || 'YYYY-MM-DD';
  const formatTime = formatToDate(cellTime, dateFormat);
  if (row.copyData) {
    nextTick(() => {
      // 增加复制数据
      column.copyDataRow = column.field;
      row.copyData[column['field']] = formatTime;
    });
  }
  return h('span', formatTime);
}

// 备注显示
export function remarkTableRenderCell(renderOpts, { column, row }) {
  const { nodeCode } = renderOpts;
  const remarks = row[column.field];
  const returnValue = getNodeRemark(remarks, nodeCode) || '';
  nextTick(() => {
    // 增加复制数据
    column.copyDataRow = column.field;
    set(row, `copyData.${column['field']}`, returnValue);
  });
  return h('span', returnValue);
}

// 设置Editor
export function editorTableRenderCell(renderOpts, { column, row }) {
  // const { nodeCode } = renderOpts;
  // const remarks = row[column.field];
  // const returnValue = getNodeRemark(remarks, nodeCode) || '';
  return <HtmlRender row={row} column={column} />;
}

function handleConfirmFilter(params: VxeGlobalRendererHandles.RenderFilterParams, checked: boolean, option: VxeTableDefines.FilterOption) {
  const { $panel } = params;
  $panel.changeOption(null, checked, option);
}

function getCellEditFilterProps(
  renderOpts: any,
  _params: VxeGlobalRendererHandles.RenderEditParams | VxeGlobalRendererHandles.RenderFilterParams,
  value: any,
  defaultProps?: { [prop: string]: any },
) {
  return XEUtils.assign({}, defaultProps, renderOpts.props, { [getModelProp(renderOpts)]: value });
}

function getFilterOns(renderOpts: any, params: VxeGlobalRendererHandles.RenderFilterParams, option: VxeTableDefines.FilterOption, changeFunc: Function) {
  return getOns(
    renderOpts,
    params,
    (value: any) => {
      // 处理 model 值双向绑定
      option.data = value;
    },
    changeFunc,
  );
}

function getModelProp(renderOpts: VxeGlobalRendererHandles.RenderOptions) {
  let prop = renderOpts.name === 'ASwitch' ? 'checked' : 'value';
  return prop;
}

function getOns(
  renderOpts: VxeGlobalRendererHandles.RenderOptions,
  params: VxeGlobalRendererHandles.RenderParams,
  inputFunc?: Function,
  changeFunc?: Function,
) {
  const { events } = renderOpts;
  const modelEvent = getModelEvent(renderOpts);
  const changeEvent = getChangeEvent(renderOpts);
  const isSameEvent = changeEvent === modelEvent;
  const ons: { [type: string]: Function } = {};
  XEUtils.objectEach(events, (func: Function, key: string) => {
    ons[getOnName(key)] = function (...args: any[]) {
      func(params, ...args);
    };
  });
  if (inputFunc) {
    ons[getOnName(modelEvent)] = function (targetEvnt: any) {
      inputFunc(targetEvnt);
      if (events?.[modelEvent]) {
        events[modelEvent](params, targetEvnt);
      }
      if (isSameEvent && changeFunc) {
        changeFunc(targetEvnt);
      }
    };
  }
  if (!isSameEvent && changeFunc) {
    ons[getOnName(changeEvent)] = function (...args: any[]) {
      changeFunc(...args);
      if (events?.[changeEvent]) {
        events[changeEvent](params, ...args);
      }
    };
  }
  return ons;
}

function getModelEvent(renderOpts: VxeGlobalRendererHandles.RenderOptions) {
  let type = renderOpts.name === 'ASwitch' ? 'update:checked' : 'update:value';
  return type;
}

function getChangeEvent(_renderOpts: any) {
  return 'change';
}

function getOnName(type: string) {
  return 'on' + type.substring(0, 1).toLocaleUpperCase() + type.substring(1);
}

/**
 * 模糊匹配
 * @param params
 */
export function defaultFuzzyFilterMethod(params: VxeGlobalRendererHandles.FilterMethodParams) {
  const { option, row, column } = params;
  const { data } = option;
  const cellValue = XEUtils.get(row, column.field);
  return XEUtils.toValueString(cellValue).indexOf(data) > -1;
}

export function handleRecallCopyMethod({ row, column, cellValue }) {
  if (row.copyData && column.copyDataRow) {
    return row.copyData[column.copyDataRow];
  } else if (typeof column.formatter === 'function') {
    return column.formatter({ cellValue, row, column });
  } else {
    return cellValue;
  }
}

export function processUrl(url) {
  // 提取路径部分（忽略查询参数和哈希）
  const pathname = url.split(/[#?]/)[0];
  // 获取文件名并提取小写扩展名
  const fileName = pathname.split('/').pop();
  const ext = fileName.includes('.') ? fileName.split('.').pop().toLowerCase() : '';
  // 图片扩展名列表
  const imageExtensions = ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp'];

  // 如果是图片扩展名，直接返回原链接
  if (imageExtensions.includes(ext)) {
    return url;
  }

  // 非图片链接处理：将 https 替换为 http（不区分大小写）
  return url.replace(/^https:/i, 'http:');
}

export function http2s(url) {
  return url.replace(/^http:/i, 'https:');
}
export function getViewportDimensions() {
  if (typeof window.innerWidth === 'number') {
    return { width: window.innerWidth, height: window.innerHeight };
  }
  const isStandardMode = document.compatMode === 'CSS1Compat';
  const element = isStandardMode ? document.documentElement : document.body;
  return { width: element.clientWidth, height: element.clientHeight };
}

/**
 * 获取节点的备注信息
 * @param cellValue [{"node":"节点code","remark":"备注信息"}],
 * */
export function getNodeRemark(cellValue: string, nodeCode: string) {
  if (!nodeCode || isEmpty(cellValue) || cellValue == '') {
    return '';
  }
  try {
    const remarkList = JSON.parse(cellValue || '[]');
    if (isArray(remarkList)) {
      return remarkList.find(item => item.node === nodeCode)?.remark || '';
    }
    return '';
  } catch (error) {
    console.error('cellValue格式错误', error);
    return '';
  }
}
