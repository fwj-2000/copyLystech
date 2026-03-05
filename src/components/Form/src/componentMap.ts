import type { Component } from 'vue';
// Import directly to avoid circular init from the Upload barrel module
import BasicUpload from '/@/components/Upload/src/BasicUpload.vue';
import ImageUpload from '/@/components/Upload/src/components/ImageUpload.vue';
import type { ComponentType } from './types/index';

/**
 * Component list, register here to setting it in the form
 */
import { StrengthMeter } from '/@/components/StrengthMeter';
import { CountdownInput } from '/@/components/CountDown';
import ApiSelect from './components/ApiSelect.vue';
// lydc 组件
import {
  LydcAlert,
  LydcAreaSelect,
  LydcAutoComplete,
  LydcBarcode,
  LydcButton,
  LydcCalculate,
  LydcCascader,
  LydcCheckbox,
  LydcCheckboxSingle,
  LydcColorPicker,
  LydcCron,
  LydcDatePicker,
  LydcDateRange,
  LydcDepSelect,
  LydcDivider,
  LydcEditor,
  LydcTinymceEditor,
  LydcGroupSelect,
  LydcGroupTitle,
  LydcIconPicker,
  LydcIframe,
  LydcInput,
  LydcInputGroup,
  LydcInputNumber,
  LydcInputPassword,
  LydcInputSearch,
  LydcInputTable,
  LydcLink,
  LydcLocation,
  LydcMonthPicker,
  LydcNumberRange,
  LydcOpenData,
  LydcOrganizeSelect,
  LydcPopupAttr,
  LydcPopupSelect,
  LydcPopupTableSelect,
  LydcPosSelect,
  LydcQrcode,
  LydcRadio,
  LydcRate,
  LydcRelationForm,
  LydcRelationFormAttr,
  LydcRoleSelect,
  LydcSelect,
  LydcSign,
  LydcSignature,
  LydcSlider,
  LydcSwitch,
  LydcText,
  LydcTextarea,
  LydcTimePicker,
  LydcTimeRange,
  LydcTreeSelect,
  LydcUploadFile,
  LydcUploadImg,
  LydcUploadImgSingle,
  LydcUserSelect,
  LydcUsersSelect,
  LydcFactoryAreaSelect,
  LydcCustomUserSelect,
  LydcCustomOrganizeSelect,
  LydcWeekPicker,
  LydcTag,
} from '/@/components/Lydc';

const componentMap = new Map<ComponentType, Component>();

componentMap.set('StrengthMeter', StrengthMeter);
componentMap.set('InputCountDown', CountdownInput);

componentMap.set('InputGroup', LydcInputGroup);
componentMap.set('InputSearch', LydcInputSearch);
componentMap.set('MonthPicker', LydcMonthPicker);
componentMap.set('WeekPicker', LydcWeekPicker);
componentMap.set('ImageUpload', ImageUpload);
componentMap.set('Upload', BasicUpload);

componentMap.set('Alert', LydcAlert);
componentMap.set('AreaSelect', LydcAreaSelect);
componentMap.set('AutoComplete', LydcAutoComplete);
componentMap.set('Button', LydcButton);
componentMap.set('Cron', LydcCron);
componentMap.set('Cascader', LydcCascader);
componentMap.set('ColorPicker', LydcColorPicker);
componentMap.set('Checkbox', LydcCheckbox);
componentMap.set('LydcCheckboxSingle', LydcCheckboxSingle);
componentMap.set('DatePicker', LydcDatePicker);
componentMap.set('DateRange', LydcDateRange);
componentMap.set('TimePicker', LydcTimePicker);
componentMap.set('TimeRange', LydcTimeRange);
componentMap.set('Divider', LydcDivider);
componentMap.set('Editor', LydcEditor);
componentMap.set('TinymceEditor', LydcTinymceEditor);
componentMap.set('GroupTitle', LydcGroupTitle);
componentMap.set('Input', LydcInput);
componentMap.set('InputPassword', LydcInputPassword);
componentMap.set('Textarea', LydcTextarea);
componentMap.set('InputNumber', LydcInputNumber);
componentMap.set('IconPicker', LydcIconPicker);
componentMap.set('Link', LydcLink);
componentMap.set('OrganizeSelect', LydcOrganizeSelect);
componentMap.set('DepSelect', LydcDepSelect);
componentMap.set('PosSelect', LydcPosSelect);
componentMap.set('GroupSelect', LydcGroupSelect);
componentMap.set('RoleSelect', LydcRoleSelect);
componentMap.set('UserSelect', LydcUserSelect);
componentMap.set('UsersSelect', LydcUsersSelect);
componentMap.set('FactoryAreaSelect', LydcFactoryAreaSelect);
componentMap.set('CustomUserSelect', LydcCustomUserSelect);
componentMap.set('CustomOrganizeSelect', LydcCustomOrganizeSelect);
componentMap.set('Qrcode', LydcQrcode);
componentMap.set('Barcode', LydcBarcode);
componentMap.set('Radio', LydcRadio);
componentMap.set('Rate', LydcRate);
componentMap.set('Select', LydcSelect);
componentMap.set('ApiSelect', ApiSelect);
componentMap.set('Slider', LydcSlider);
componentMap.set('Sign', LydcSign);
componentMap.set('Signature', LydcSignature);
componentMap.set('Switch', LydcSwitch);
componentMap.set('Text', LydcText);
componentMap.set('TreeSelect', LydcTreeSelect);
componentMap.set('UploadFile', LydcUploadFile);
componentMap.set('UploadImg', LydcUploadImg);
componentMap.set('UploadImgSingle', LydcUploadImgSingle);
componentMap.set('BillRule', LydcInput);
componentMap.set('ModifyUser', LydcInput);
componentMap.set('ModifyTime', LydcInput);
componentMap.set('CreateUser', LydcOpenData);
componentMap.set('CreateTime', LydcOpenData);
componentMap.set('CurrOrganize', LydcOpenData);
componentMap.set('CurrPosition', LydcOpenData);
componentMap.set('RelationForm', LydcRelationForm);
componentMap.set('RelationFormAttr', LydcRelationFormAttr);
componentMap.set('PopupSelect', LydcPopupSelect);
componentMap.set('PopupTableSelect', LydcPopupTableSelect);
componentMap.set('PopupAttr', LydcPopupAttr);
componentMap.set('NumberRange', LydcNumberRange);
componentMap.set('Calculate', LydcCalculate);
componentMap.set('InputTable', LydcInputTable);
componentMap.set('Location', LydcLocation);
componentMap.set('Iframe', LydcIframe);
componentMap.set('Tag', LydcTag);

export function add(compName: ComponentType, component: Component) {
  componentMap.set(compName, component);
}

export function del(compName: ComponentType) {
  componentMap.delete(compName);
}

export { componentMap };
