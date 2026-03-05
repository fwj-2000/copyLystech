import antdLocale from 'ant-design-vue/es/locale/en_US';
import enCustomLocale from './en_US.json';
// vxetable 翻译
import VxeTableEnUS from 'vxe-pc-ui/lib/language/en-US';

export default {
  message: {
    ...enCustomLocale,
    ...VxeTableEnUS,
    antdLocale,
  },
  dateLocale: null,
  dateLocaleName: 'en_US',
};
