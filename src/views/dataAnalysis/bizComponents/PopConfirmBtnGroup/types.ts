export interface ActionItem {
  key: string; // 唯一标识
  label: string; // 按钮文字
  auth?: string; // 权限码 (v-auth)
  show?: boolean | ((params: any) => boolean); // 显示逻辑：可以是布尔值，也可以是根据当前参数判断的函数
  // Popconfirm 配置
  popconfirm?: {
    title: string | ((params: any) => string); // 确认框文案，支持动态生成
    placement?: 'top' | 'right' | 'bottom' | 'left';
  };
  // 核心逻辑
  api: (params: any) => Promise<any>; // 调用的接口
  // 参数转换器：有时候接口参数名(week)和页面参数名(endDim)不一样，这里做一层映射
  paramsMap?: (commonParams: any) => any;
  // 样式
  type?: 'primary' | 'default' | 'dashed' | 'text';
  danger?: boolean;
}
