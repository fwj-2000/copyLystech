export type Locale = 'en_US' | 'zh_CN' | 'zh_TW' | 'vi_VN';

export const messages: Record<Locale, Record<string, string>> = {
  en_US: {
    cancel: 'Cancel',
    collapse: 'Collapse',
    confirm: 'Confirm',
    expand: 'Expand',
    reset: 'Reset',
    submit: 'Submit',
  },
  zh_CN: {
    cancel: '取消',
    collapse: '收起',
    confirm: '确认',
    expand: '展开',
    reset: '重置',
    submit: '提交',
  },
  zh_TW: {
    cancel: '取消',
    collapse: '收起',
    confirm: '確認',
    expand: '展開',
    reset: '重置',
    submit: '提交',
  },
  vi_VN: {
    cancel: 'Hủy bỏ',
    collapse: 'Thu gọn',
    confirm: 'Xác nhận',
    expand: 'Mở rộng',
    reset: 'Đặt lại',
    submit: 'Giới thiệu',
  },
};

export const getMessages = (locale: Locale) => messages[locale];
