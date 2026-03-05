import { VxeGlobalRendererHandles } from 'vxe-table';
import XEUtils from 'xe-utils';
import { getLabelValue, isEmptyValue } from '/@/components/VxeTable/src/components/common';
import { isObject } from '/@/utils/is';

export function getSelectCellValue(renderOpts: VxeGlobalRendererHandles.RenderTableCellOptions, params: VxeGlobalRendererHandles.RenderTableCellParams) {
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
