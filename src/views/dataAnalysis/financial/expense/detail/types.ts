import { ItemType } from 'ant-design-vue';

export enum ETimeDimension {
  WEEK = 'week',
  MONTH = 'month',
}

export type MenuItemType = {
  children?: MenuItemType[];
  clickMethod?: () => Promise<void>;
} & ItemType;
