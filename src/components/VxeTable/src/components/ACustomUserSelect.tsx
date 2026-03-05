import XEUtils from 'xe-utils';
import { createDefaultRender, createEditRender, createFormItemRender, createCellRender, isEmptyValue, getLabelValue } from './common';
import { VxeGlobalRendererHandles, VxeGlobalRendererOptions } from 'vxe-table';
import { isObject } from '/@/utils/is';

function getSelectCellValue(renderOpts: VxeGlobalRendererHandles.RenderTableCellOptions, params: VxeGlobalRendererHandles.RenderTableCellParams) {
  const { options = [], optionGroups, props = {}, optionProps = {}, optionGroupProps = {} } = renderOpts;
  const { row, column } = params;
  const labelProp = optionProps.label || 'label';
  const valueProp = optionProps.value || 'value';
  const groupOptions = optionGroupProps.options || 'options';
  const cellValue = XEUtils.get(row, column.field as string);
  if (!isEmptyValue(cellValue)) {
    if (isObject(cellValue)) {
      return getLabelValue(cellValue, labelProp);
    }
    return XEUtils.map(
      props.mode === 'multiple' ? cellValue : ([cellValue] as any),
      optionGroups
        ? value => {
            let selectItem;
            for (let index = 0; index < optionGroups.length; index++) {
              selectItem = XEUtils.find(optionGroups[index][groupOptions], item => item[valueProp] === value);
              if (selectItem) {
                break;
              }
            }
            return selectItem ? selectItem[labelProp] : value;
          }
        : value => {
            const selectItem = XEUtils.find(options, item => item[valueProp] === value);
            return selectItem ? selectItem[labelProp] : value;
          },
    ).join(', ');
  }
  return '';
}

export default {
  renderTableDefault: createDefaultRender({}, (_, params) => {
    return {
      params: XEUtils.get(params, 'row'),
    };
  }),
  renderTableEdit: createEditRender({}, (_, params) => {
    // 需要改造下customSelect
    const { props } = _;
    return {
      params: XEUtils.get(params, 'row'),
    };
  }),
  renderFormItemContent: createFormItemRender({}, (_, params) => {
    return {
      params: XEUtils.get(params, 'row'),
    };
  }),
  //   renderTableCell (renderOpts, params) {
  //     // console.log(renderOpts, 'renderTableCell-renderOpts')
  //     const { row, column } = params
  //     console.log(renderOpts, params, 'renderOpts, params')
  //     return <span>{ row[column.field] }</span>
  //   }
  renderTableCell: createCellRender(getSelectCellValue),
} as VxeGlobalRendererOptions;
