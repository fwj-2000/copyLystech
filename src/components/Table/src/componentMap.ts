import type { Component } from 'vue';
import { Input, Textarea, Select, Checkbox, InputNumber, Switch, DatePicker, TimePicker, AutoComplete, Radio } from 'ant-design-vue';
import type { ComponentType } from './types/componentType';
import { ApiSelect } from '/@/components/Form';
import { LydcCustomUserSelect, LydcDepSelect } from '/@/components/Lydc/Organize';
import { LydcInputNumber } from '/@/components/Lydc';

const componentMap = new Map<ComponentType, Component>();

componentMap.set('Input', Input);
componentMap.set('Textarea', Textarea);
// componentMap.set('InputNumber', InputNumber);
componentMap.set('InputNumber', LydcInputNumber);
componentMap.set('Select', Select);
componentMap.set('ApiSelect', ApiSelect);
componentMap.set('CustomUserSelect', LydcCustomUserSelect);
componentMap.set('AutoComplete', AutoComplete);
componentMap.set('Switch', Switch);
componentMap.set('Checkbox', Checkbox);
componentMap.set('DatePicker', DatePicker);
componentMap.set('TimePicker', TimePicker);
componentMap.set('DepSelect', LydcDepSelect);

export function add(compName: ComponentType, component: Component) {
  componentMap.set(compName, component);
}

export function del(compName: ComponentType) {
  componentMap.delete(compName);
}

export { componentMap };
