import { Input, DatePicker } from 'ant-design-vue';

// lydc 组件
import { BasicCaption } from '/@/components/Basic';
import { LydcAlert } from '/@/components/Lydc/Alert';
import { LydcAreaSelect } from '/@/components/Lydc/AreaSelect';
import { LydcAutoComplete } from '/@/components/Lydc/AutoComplete';
import { LydcButton } from '/@/components/Lydc/Button';
import { LydcCron } from '/@/components/Lydc/Cron';
import { LydcCascader, LydcOrganizeCascader } from '/@/components/Lydc/Cascader';
import { LydcCheckbox, LydcCheckboxSingle } from '/@/components/Lydc/Checkbox';
import { LydcColorPicker } from '/@/components/Lydc/ColorPicker';
import { LydcDatePicker, LydcDateRange, LydcTimePicker, LydcTimeRange } from '/@/components/Lydc/DatePicker';
import { LydcDivider } from '/@/components/Lydc/Divider';
import { LydcIconPicker } from '/@/components/Lydc/IconPicker';
import { LydcInput, LydcTextarea } from '/@/components/Lydc/Input';
import { LydcInputNumber } from '/@/components/Lydc/InputNumber';
import { LydcLink } from '/@/components/Lydc/Link';
import { LydcOpenData } from '/@/components/Lydc/OpenData';
import {
  LydcOrganizeSelect,
  LydcDepSelect,
  LydcPosSelect,
  LydcGroupSelect,
  LydcRoleSelect,
  LydcUserSelect,
  LydcUsersSelect,
  LydcFactoryAreaSelect,
  LydcCustomUserSelect,
  LydcCustomOrganizeSelect,
} from '/@/components/Lydc/Organize';
import { LydcQrcode } from '/@/components/Lydc/Qrcode';
import { LydcBarcode } from '/@/components/Lydc/Barcode';
import { LydcRadio } from '/@/components/Lydc/Radio';
import { LydcSelect } from '/@/components/Lydc/Select';
import { LydcRate } from '/@/components/Lydc/Rate';
import { LydcSlider } from '/@/components/Lydc/Slider';
import { LydcSign } from '/@/components/Lydc/Sign';
import { LydcSignature } from '/@/components/Lydc/Signature';
import { LydcSwitch } from '/@/components/Lydc/Switch';
import { LydcText } from '/@/components/Lydc/Text';
import { LydcTreeSelect } from '/@/components/Lydc/TreeSelect';
import { LydcUploadFile, LydcUploadImg, LydcUploadImgSingle } from '/@/components/Lydc/Upload';
import { Tinymce } from '/@/components/Tinymce/index';
import { WangEditor } from '/@/components/WangEditor/index';
import { LydcRelationForm } from '/@/components/Lydc/RelationForm';
import { LydcRelationFormAttr } from '/@/components/Lydc/RelationFormAttr';
import { LydcPopupSelect, LydcPopupTableSelect } from '/@/components/Lydc/PopupSelect';
import { LydcPopupAttr } from '/@/components/Lydc/PopupAttr';
import { LydcNumberRange } from '/@/components/Lydc/NumberRange';
import { LydcCalculate } from '/@/components/Lydc/Calculate';
import { LydcInputTable } from '/@/components/Lydc/InputTable';
import { LydcLocation } from '/@/components/Lydc/Location';
import { LydcIframe } from '/@/components/Lydc/Iframe';
import { LydcTag } from '/@/components/Lydc/Tag';
import LydcInfoTitle from '/@/components/Lydc/InofTitle/index.vue';
import { LydcCalendar } from '/@/components/Lydc/Calendar';

const LydcInputPassword = Input.Password;
LydcInputPassword.name = 'LydcInputPassword';
const LydcInputGroup = Input.Group;
LydcInputGroup.name = 'LydcInputGroup';
const LydcInputSearch = Input.Search;
LydcInputSearch.name = 'LydcInputSearch';
const LydcEditor = WangEditor;
LydcEditor.name = 'LydcEditor';
const LydcTinymceEditor = Tinymce;
LydcTinymceEditor.name = 'LydcTinymceEditor';
const LydcGroupTitle = BasicCaption;
LydcGroupTitle.name = 'LydcGroupTitle';
const LydcMonthPicker = DatePicker.MonthPicker;
LydcMonthPicker.name = 'LydcMonthPicker';
const LydcWeekPicker = DatePicker.WeekPicker;
LydcWeekPicker.name = 'LydcWeekPicker';
LydcInfoTitle.name = 'LydcInfoTitle';

export {
  LydcAlert,
  LydcAreaSelect,
  LydcAutoComplete,
  LydcButton,
  LydcCron,
  LydcCascader,
  LydcColorPicker,
  LydcCheckbox,
  LydcCheckboxSingle,
  LydcDatePicker,
  LydcDateRange,
  LydcTimePicker,
  LydcTimeRange,
  LydcMonthPicker,
  LydcWeekPicker,
  LydcDivider,
  LydcEditor,
  LydcTinymceEditor,
  LydcGroupTitle,
  LydcIconPicker,
  LydcInput,
  LydcInputPassword,
  LydcInputGroup,
  LydcInputSearch,
  LydcTextarea,
  LydcInputNumber,
  LydcLink,
  LydcOpenData,
  LydcOrganizeSelect,
  LydcDepSelect,
  LydcPosSelect,
  LydcGroupSelect,
  LydcRoleSelect,
  LydcUserSelect,
  LydcUsersSelect,
  LydcFactoryAreaSelect,
  LydcCustomUserSelect,
  LydcCustomOrganizeSelect,
  LydcQrcode,
  LydcBarcode,
  LydcRadio,
  LydcRate,
  LydcSelect,
  LydcSlider,
  LydcSign,
  LydcSignature,
  LydcSwitch,
  LydcText,
  LydcTreeSelect,
  LydcUploadFile,
  LydcUploadImg,
  LydcUploadImgSingle,
  LydcRelationForm,
  LydcRelationFormAttr,
  LydcPopupSelect,
  LydcPopupTableSelect,
  LydcPopupAttr,
  LydcNumberRange,
  LydcCalculate,
  LydcInputTable,
  LydcLocation,
  LydcIframe,
  LydcInfoTitle,
  LydcOrganizeCascader,
  LydcTag,
  LydcCalendar,
};
