<!-- 平铺页分组数据封装 -->
<template>
  <!-- 工厂信息 -->
  <a-row :gutter="[12, 12]" class="dashboard-layout-group-container">
    <a-col v-for="(groupInfo, gidx) in list" :key="gidx" v-bind="groupInfo.colConfig">
      <div class="group-item">
        <GroupItemHead
          v-bind="{
          groupName: groupInfo.group as string || '',
          groupValue: getGroupValue(groupInfo),
          title: props.title,
          trendUrl: props.trendUrl,
          orgCode: groupInfo.factoryList[0].ParentOrgCode as string || '',
          popoverInfoList: props.popoverInfoList,
          searchFormValue: props.searchFormValue,
        }">
          <template #groupHeadLeft>
            <slot name="groupHeadLeft" :info="groupInfo.factoryList[0]"></slot>
          </template>
        </GroupItemHead>
        <div class="item-content-container flex all-start">
          <slot name="groupItemData" :groupInfo="groupInfo">
            <GroupItemData
              v-for="(info, idx) in groupInfo.factoryList"
              :key="idx"
              class="item-content-wrapper"
              v-bind="{
                info,
                listData: props.listData,
                component: props.chartComponent,
                trendUrl: props.trendUrl,
                extraInfo: props.extraInfo,
              }">
              <template #itemHeadLeft>
                <slot name="itemHeadLeft" :info="info"></slot>
              </template>
              <template #itemHeadRight>
                <slot name="itemHeadRight" :info="info"></slot>
              </template>
              <template #groupItemHead>
                <slot name="groupItemHead" :info="info"></slot>
              </template>
            </GroupItemData>
          </slot>
        </div>
      </div>
    </a-col>
  </a-row>
</template>

<script lang="ts" setup>
  import { ref, watch } from 'vue';
  import { groupBy, isEmpty } from 'lodash-es';
  import { isFunction } from '/@/utils/is';
  import { Component } from 'vue';

  import { GroupItemData, GroupItemHead } from '/@/views/dashboard/operate/components/styleItem/index';
  import { SearchFormValueType, PopoverInfoList } from '/@/views/dashboard/operate/types';

  const list: any = ref([]);
  const props = defineProps({
    title: {
      type: String,
      default: '',
    },
    trendUrl: {
      type: String,
      default: '',
    },
    groupValueKey: {
      type: String,
      default: '',
    },
    chartComponent: {
      type: Object as PropType<Component>,
      default: null,
    },
    listData: {
      type: Array,
      default: () => [],
    },
    popoverInfoList: {
      type: Array as PropType<PopoverInfoList[]>,
      default: () => [],
    },
    searchFormValue: {
      type: Object as PropType<SearchFormValueType>,
      default: () => ({}),
    },
    getColConfig: {
      type: Function as PropType<(group: String, block: any[]) => {}>,
      default: () => [],
    },
    formatModelMth: {
      type: Function as PropType<(item: any) => {}>,
      default: () => () => ({}),
    }, // 将后台返回的 model 数据字段格式化成指定的key值
    extraInfo: {
      type: Object as PropType<any>,
      default: () => ({}),
    }, // 额外的信息
  });

  const getColConfig = (group, factoryList) => {
    const config = props.getColConfig(group, factoryList);
    if (!isEmpty(config)) return config;
    const block = factoryList.length;
    const xlConfig = {
      1: 9,
      2: 18,
      3: 24,
    };
    const lgConfig = {
      1: 12,
      2: 24,
      3: 24,
    };
    return {
      xs: 24,
      sm: block * 12,
      md: block * 12,
      lg: lgConfig[block],
      xl: xlConfig[block],
      xxl: block * 6,
    };
  };

  const getGroupValue = groupInfo => {
    if (!props.groupValueKey || isEmpty(groupInfo.factoryList)) {
      return;
    }
    return groupInfo.factoryList[0][props.groupValueKey];
  };

  watch(
    () => props.listData,
    () => {
      const groupObj = groupBy(props.listData, (item: any) => item.ParentOrgName);
      console.log('groupObj: ', groupObj);
      const groupInfo = Object.keys(groupObj).reduce((pre, cur) => {
        return [
          ...pre,
          {
            group: cur,
            factoryList: groupObj[cur].map((item: any) => item.OrgCode),
          },
        ];
      }, []);

      // 定义指定的排序顺序
      const order = `["模切BU1", "模切BU2", "模切BU3", "模切BU4", "模切BU5", "印度BU", "越南BU", "注塑BU"]`;
      list.value = groupInfo
        .map(item => {
          const factoryList = item.factoryList
            .map(OrgCode => {
              return props.listData.find((factoryItem: any) => {
                return factoryItem.OrgCode === OrgCode;
              });
            })
            .filter(item => item)
            .map((item: any) => ({
              // 将后台返回的 model 信息字段key映射成新的字段
              ...(props.formatModelMth && isFunction(props.formatModelMth) ? props.formatModelMth(item) : {}),
              ...item,
            }));
          return {
            group: item.group,
            colConfig: getColConfig(item.group, factoryList),
            factoryList,
          };
        })
        .filter(item => !['模切BG', 'COO2'].includes(item.group))
        .sort((a, b) => {
          const indexA = order.indexOf(a.group);
          const indexB = order.indexOf(b.group);
          if (indexA === -1) return 1;
          if (indexB === -1) return -1;
          return indexA - indexB;
        });
    },
    { immediate: true },
  );
</script>
