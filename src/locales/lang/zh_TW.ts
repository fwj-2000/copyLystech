import antdLocale from 'ant-design-vue/es/locale/zh_TW';
import zhTWCustomLocale from './zh_TW.json';
// vxetable 翻译
import VxeTableZhTW from 'vxe-pc-ui/lib/language/zh-TW';

(antdLocale as any).Calendar.timePickerLocale.rangePlaceholder = ['開始時間', '結束時間'];

export default {
  message: {
    ...zhTWCustomLocale,
    ...VxeTableZhTW,
    antdLocale,
  },
};
