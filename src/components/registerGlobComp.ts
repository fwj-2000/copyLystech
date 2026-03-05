import type { App } from 'vue';
import { Button } from './Button';
import { IconFont } from './IconFont';

import {
  Input,
  InputNumber,
  Layout,
  Form,
  Switch,
  Dropdown,
  Menu,
  Select,
  Table,
  Checkbox,
  Tabs,
  Collapse,
  Card,
  Tooltip,
  Row,
  Col,
  Popconfirm,
  Divider,
  Alert,
  AutoComplete,
  Cascader,
  Rate,
  Slider,
  Avatar,
  Tag,
  Space,
  Steps,
  Popover,
  Radio,
  Progress,
  Image,
  Upload,
  Pagination,
  Modal,
  Transfer,
  Spin,
  DatePicker,
  List,
  ListItem,
} from 'ant-design-vue';
import VXEUI from 'vxe-pc-ui';
import 'vxe-pc-ui/lib/style.css';
import VXETable from 'vxe-table';
import 'vxe-table/lib/style.css';
import '/@/plugins/vxe/extend-cell-area/vxe-table-extend-cell-area.es6.min';
import '/@/plugins/vxe/extend-cell-area/vxe-table-extend-cell-area.min.css';
import componentSetting from '/@/settings/componentSetting';

import { BasicHelp, BasicCaption } from '/@/components/Basic';
import { LydcAlert } from '/@/components/Lydc/Alert';
import { LydcAreaSelect } from '/@/components/Lydc/AreaSelect';
import { LydcAutoComplete } from '/@/components/Lydc/AutoComplete';
import { LydcButton } from '/@/components/Lydc/Button';
import { LydcCron } from '/@/components/Lydc/Cron';
import { LydcCascader } from '/@/components/Lydc/Cascader';
import { LydcCheckbox, LydcCheckboxSingle } from '/@/components/Lydc/Checkbox';
import { LydcColorPicker } from '/@/components/Lydc/ColorPicker';
import { LydcDatePicker, LydcDateRange, LydcTimePicker, LydcTimeRange } from '/@/components/Lydc/DatePicker';
import { LydcDivider } from '/@/components/Lydc/Divider';
import { LydcEmpty } from '/@/components/Lydc/Empty';
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
import { LydcUploadFile, LydcUploadImg, LydcUploadImgSingle, LydcUploadBtn } from '/@/components/Lydc/Upload';
import { Tinymce } from '/@/components/Tinymce/index';
import { WangEditor } from '/@/components/WangEditor/index';
import { LydcNumberRange } from '/@/components/Lydc/NumberRange';
import { LydcRelationFormAttr } from '/@/components/Lydc/RelationFormAttr';
import { LydcPopupSelect, LydcPopupTableSelect } from '/@/components/Lydc/PopupSelect';
import { LydcPopupAttr } from '/@/components/Lydc/PopupAttr';
import { LydcCalculate } from '/@/components/Lydc/Calculate';
import { LydcLocation } from '/@/components/Lydc/Location';
import { LydcIframe } from '/@/components/Lydc/Iframe';
import { LydcTag } from '/@/components/Lydc/Tag';

const LydcTinymceEditor = Tinymce;
LydcTinymceEditor.name = 'LydcTinymceEditor';
const LydcEditor = WangEditor;
LydcEditor.name = 'LydcEditor';
const LydcGroupTitle = BasicCaption;
LydcGroupTitle.name = 'LydcGroupTitle';

export function registerGlobComp(app: App) {
  app
    .use(Input)
    .use(InputNumber)
    .use(Button)
    .use(Layout)
    .use(Form)
    .use(Switch)
    .use(Dropdown)
    .use(Menu)
    .use(Select)
    .use(Table)
    .use(Checkbox)
    .use(Tabs)
    .use(Card)
    .use(Collapse)
    .use(Tooltip)
    .use(Row)
    .use(Col)
    .use(Popconfirm)
    .use(Popover)
    .use(Divider)
    .use(Slider)
    .use(Rate)
    .use(Alert)
    .use(AutoComplete)
    .use(Cascader)
    .use(Avatar)
    .use(Tag)
    .use(Space)
    .use(Steps)
    .use(Radio)
    .use(Progress)
    .use(Image)
    .use(Upload)
    .use(BasicHelp)
    .use(Transfer)
    .use(Spin)
    .use(DatePicker)
    .use(Pagination)
    .use(Modal)
    .use(List)
    .use(ListItem)
    .use(IconFont)
    .use(LydcAlert)
    .use(LydcRate)
    .use(LydcSlider)
    .use(LydcAreaSelect)
    .use(LydcAutoComplete)
    .use(LydcButton)
    .use(LydcCron)
    .use(LydcCascader)
    .use(LydcCheckbox)
    .use(LydcCheckboxSingle)
    .use(LydcColorPicker)
    .use(LydcDatePicker)
    .use(LydcDateRange)
    .use(LydcTimePicker)
    .use(LydcTimeRange)
    .use(LydcDivider)
    .use(LydcEmpty)
    .use(LydcGroupTitle)
    .use(LydcIconPicker)
    .use(LydcInput)
    .use(LydcTextarea)
    .use(LydcInputNumber)
    .use(LydcLink)
    .use(LydcOrganizeSelect)
    .use(LydcDepSelect)
    .use(LydcPosSelect)
    .use(LydcGroupSelect)
    .use(LydcRoleSelect)
    .use(LydcUserSelect)
    .use(LydcUsersSelect)
    .use(LydcFactoryAreaSelect)
    .use(LydcCustomUserSelect)
    .use(LydcOpenData)
    .use(LydcQrcode)
    .use(LydcBarcode)
    .use(LydcRadio)
    .use(LydcSelect)
    .use(LydcSign)
    .use(LydcSignature)
    .use(LydcSwitch)
    .use(LydcText)
    .use(LydcTreeSelect)
    .use(LydcEditor)
    .use(LydcRelationFormAttr)
    .use(LydcPopupSelect)
    .use(LydcPopupTableSelect)
    .use(LydcPopupAttr)
    .use(LydcNumberRange)
    .use(LydcCalculate)
    .use(LydcUploadFile)
    .use(LydcUploadImg)
    .use(LydcUploadImgSingle)
    .use(LydcUploadBtn)
    .use(LydcLocation)
    .use(LydcTag)
    .use(LydcIframe)
    .use(VXETable)
    .use(VXEUI);

  // 设置授权信息
  VXEUI.setConfig({
    // showAuthLog: true, // 是否在控制台显示授权信息，专业版支持关闭
    // authId: authId, // 获取授权后在官网登录后进入个人中心查看
    // onAuth(e) {
    //   // 打印授权状态
    //   console.log(e.status);
    // },
    ...componentSetting.vxeTable,
  });
}
