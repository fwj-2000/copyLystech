<!-- 搜索条件样式组件 -->
<template>
  <div v-show="!loading" class="flex ct-start max-w-[100%] py-12px">
    <a-form class="search-form flex ct-start flex-wrap">
      <!-- 组织结构下拉  -->
      <div v-if="props.showOrganizeTreeSelect" class="mr-12px">
        <TreeSelect
          v-model:value="props.searchFormValue.orgCode"
          v-bind="treeSelectOptions"
          :dropdownMatchSelectWidth="props.isHideBU ? 240 : 360"
          class="org-tree-select-compo"
          :treeData="organizeSelectList">
        </TreeSelect>
      </div>
      <slot name="left"></slot>
      <slot name="timeDimension">
        <a-form-item v-if="props.showTimeDimension" name="timeDimension">
          <a-select v-model:value="props.searchFormValue.timeDimension">
            <a-select-option value="day">天</a-select-option>
            <a-select-option value="week">周</a-select-option>
            <a-select-option value="month">月</a-select-option>
          </a-select>
        </a-form-item>
      </slot>
      <a-form-item v-if="props.showPeriodDimension" name="period">
        <a-select v-model:value="searchFormValue.period" style="min-width: 88px; text-align: left">
          <a-select-option value="2">全部</a-select-option>
          <a-select-option value="1">工作日</a-select-option>
          <a-select-option value="0">非工作日</a-select-option>
          <a-select-option value="3">上班日</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item v-if="props.isRangePicker" name="dateRange">
        <a-range-picker
          v-if="searchFormValue.timeDimension === TimeDimension.DAY"
          v-model:value="props.searchFormValue.dateRange"
          :allow-clear="false"
          :disabled="props.isDateDisabled"
          :disabledDate="props.disabledDate"></a-range-picker>
        <a-range-picker
          v-else
          v-model:value="props.searchFormValue.dateRange"
          :allow-clear="false"
          :disabled="props.isDateDisabled"
          :picker="props.searchFormValue.timeDimension"
          :disabledDate="props.disabledDate"></a-range-picker>
      </a-form-item>
      <a-form-item v-else name="date">
        <a-date-picker
          v-if="searchFormValue.timeDimension === TimeDimension.DAY"
          v-model:value="props.searchFormValue.date"
          :allow-clear="false"
          :disabled="props.isDateDisabled"
          :disabledDate="props.disabledDate"></a-date-picker>
        <a-date-picker
          v-else
          v-model:value="props.searchFormValue.date"
          :allow-clear="false"
          :disabled="props.isDateDisabled"
          :picker="searchFormValue.timeDimension"
          :disabledDate="props.disabledDate"></a-date-picker>
      </a-form-item>
      <slot name="right"></slot>
    </a-form>
  </div>
</template>

<script lang="ts" setup>
  import { ref, watch } from 'vue';
  import { getAllOrganization, getOrganization } from '/@/api/dashbord/operate';
  import { searchFormProps } from './props';

  import { TreeSelect } from 'ant-design-vue';

  import { TimeDimension } from '/@/views/dashboard/operate/types';
  import { isEmpty } from 'lodash-es';

  const props = defineProps(searchFormProps);
  console.log([props, 'searchFormProps']);

  const loading = ref(false);
  const emit = defineEmits(['update:noPermission']);

  // 树型下拉配置项
  const treeSelectOptions = ref({
    showSearch: true,
    dropdownStyle: { width: '220px', maxHeight: '400px', overflow: 'auto' },
    placeholder: '请选择',
    treeDefaultExpandAll: true,
    treeNodeFilterProp: 'label',
    ...props.treeAttrs,
  });

  const organizeSelectList = ref([]);
  const organizeMapInfo = ref<Record<string, string>>({}); // 组织代码和名称的映射关系
  const dateRangeCache = ref({
    [TimeDimension.DAY]: [],
    [TimeDimension.WEEK]: [],
    [TimeDimension.MONTH]: [],
    [TimeDimension.QUARTER]: [],
    [TimeDimension.YEAR]: [],
    ...props.defaultCatheData,
  }); // 日期范围选择缓存

  // 构建组织结构下拉菜单项
  const buildTree = (list: any) => {
    const map = new Map();
    const roots: any = [];

    // 遍历所有元素，并构建一个临时的 Map
    list.forEach(item => {
      map.set(item.id, { ...item, children: [] });
    });

    // 再次遍历所有元素，设置子节点
    list.forEach(item => {
      const parent = map.get(item.parentId);
      if (parent === undefined) {
        // 如果找不到父节点，则认为该节点是根节点
        roots.push(map.get(item.id));
      } else {
        // 否则，将该节点添加到其父节点的 children 数组中
        parent.children.push(map.get(item.id));
      }
    });

    return roots;
  };

  // 返回字段有大驼峰有小驼峰
  const getFieldValue = (info, key) => {
    const upperCaseKey = key.charAt(0).toUpperCase() + key.slice(1);
    return info[key] ?? info[upperCaseKey];
  };
  // 获取组织架构列表
  if (props.showOrganizeTreeSelect) {
    loading.value = true;
    const params = props?.organizeKeyword ? { keyword: props.organizeKeyword } : {};
    const api = props.getOrganizationApi || (props.isFetchAllOrgCode ? getAllOrganization : getOrganization);
    api(params).then(res => {
      const { data } = res;
      const list = data.list ?? data;

      loading.value = false;
      // 回调函数，可在此处理获取的数据
      props.afterGetOrganizationMth(res);

      // 将结果处理成下拉菜单的属性
      const MQInfo = list.find(item => getFieldValue(item, 'org_Code') === 'MQ') ?? { id: '' };
      const MQId = MQInfo.id || MQInfo.ID;
      const handleList = list.map(item => {
        const idValue = item.id || item.ID;
        return {
          id: idValue,
          parentId: getFieldValue(item, 'parent_Id'),
          value: getFieldValue(item, 'org_Code'),
          label: getFieldValue(item, 'org_Name'),
          displayName: getFieldValue(item, 'display_Name'),
          orgCode: getFieldValue(item, 'org_Code'),
          disabled: (props.isHideBU && `${getFieldValue(item, 'org_Level')}` === '3') || (props.isHideBG && idValue === MQId),
        };
      });

      organizeMapInfo.value = handleList.reduce((pre, cur) => ({ ...pre, [cur.value]: cur.label }), {});

      // 转换成树形结构数据
      const treeMenu = buildTree(handleList);
      organizeSelectList.value = treeMenu;
      // 无默认值 || 路由值不在下拉项默认选择第一项
      const allValues = handleList.map(item => item.value);
      const { orgCode } = props.searchFormValue;
      if (!orgCode || !allValues.includes(orgCode)) {
        const defaultOrgCode = getDefaultOrgCode(handleList);
        props.searchFormValue.orgCode = defaultOrgCode;
      }
      emit('update:noPermission', isEmpty(treeMenu));
    });
  }

  function getDefaultOrgCode(handleList) {
    return handleList.find(item => !item.disabled)?.orgCode || '';
  }

  watch(
    () => props.searchFormValue.timeDimension,
    (timeDimension, lastTimeDimension) => {
      const lastDateRange = dateRangeCache.value[timeDimension] || [];
      dateRangeCache.value[lastTimeDimension] = props.searchFormValue.dateRange as any;
      if (lastDateRange.length > 0) {
        props.searchFormValue.dateRange = lastDateRange as any;
      }
    },
  );

  defineExpose({
    organizeMapInfo: organizeMapInfo,
  });
</script>

<style lang="less" scoped>
  .search-form {
    position: relative;
    z-index: 2;
    width: 100%;
    gap: 12px 0;
    text-align: right;
    margin: 0;
    transition: height 0.5s ease-in-out;

    :deep(.ant-form-item) {
      margin: 0 12px 0 0;
    }
  }
</style>
