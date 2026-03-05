/**
 * 这里封装导出一些看板可重复使用两次以上的样式组件
 * 注：不在这些组件里处理业务逻辑！！！
 */
import { withInstall } from '/@/utils';
import type { ExtractPropTypes } from 'vue';
import ValueListCompo from './src/ValueList.vue';
import SpinContentCompo from './src/SpinContent.vue';
import CompoHeadCompo from './src/CompoHead.vue';
import GroupItemDataCompo from './src/GroupItemData.vue';
import GroupItemHeadCompo from './src/GroupItemHead.vue';
import { valueListProps, spinContentProps, compoHeadProps, groupItemDataProps, groupItemHeadProps } from './src/props';

export const ValueList = withInstall(ValueListCompo);
export const SpinContent = withInstall(SpinContentCompo);
export const CompoHead = withInstall(CompoHeadCompo);
export const GroupItemData = withInstall(GroupItemDataCompo);
export const GroupItemHead = withInstall(GroupItemHeadCompo);

// 导出组件 props 类型定义
export declare type ValueListProps = Partial<ExtractPropTypes<typeof valueListProps>>;
export declare type SpinContentProps = Partial<ExtractPropTypes<typeof spinContentProps>>;
export declare type CompoHeadProps = Partial<ExtractPropTypes<typeof compoHeadProps>>;
export declare type GroupItemDataProps = Partial<ExtractPropTypes<typeof groupItemDataProps>>;
export declare type GroupItemHeadProps = Partial<ExtractPropTypes<typeof groupItemHeadProps>>;
