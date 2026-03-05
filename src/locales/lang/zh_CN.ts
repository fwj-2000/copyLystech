import antdLocale from 'ant-design-vue/es/locale/zh_CN';
import zhCNCustomLocale from './zh_CN.json';
// vxetable 翻译
import VxeTableZhCN from 'vxe-pc-ui/lib/language/zh-CN';

export default {
  message: {
    ...zhCNCustomLocale,
    ...VxeTableZhCN,
    antdLocale,
  },
};
