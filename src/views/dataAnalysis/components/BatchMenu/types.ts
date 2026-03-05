import { ItemType } from 'ant-design-vue';

// 批量导入/导出子菜单配置
export type MenuItemType = {
  auth?: string;
  children?: MenuItemType[];
  clickMethod?: (formParams: Record<string, any>) => Promise<void>;
} & ItemType;
