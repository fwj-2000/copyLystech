<template>
  <div class="UpdateTime-container">
    <div class="log-title">
      <div class="orange-line"></div>
      <span class="log-title-text">{{ t('common.logTimeUpdate') }}</span>
    </div>
    <div class="tree-container">
      <a-spin :spinning="loading">
        <div v-for="(tree, index) in treeData" :key="tree.key || index" class="custom-tree-wrapper">
          <BasicTree
            :treeData="[tree]"
            :fieldNames="{ children: 'children', title: 'displayLabel', key: 'key' }"
            :showLine="true"
            :defaultExpandAll="false"
            @select="handleSelect"
            @expand="handleExpand"
            @collapse="handleCollapse"
            :selectedKeys="selectedKeys"
            :expandedKeys="expandedKeys"
            :expandOnClickNode="false">
            <!-- 只对有子节点的年份/月份节点添加点击处理 -->
            <template #title="item">
              <div class="tree-title-content" @click="handleTitleClick(item, $event)">
                {{ item.displayLabel }}
              </div>
            </template>
          </BasicTree>
        </div>
        <div v-if="!loading && treeData.length === 0" class="no-data">{{ t('common.UpdateLognoData') }}</div>
      </a-spin>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { useI18n } from '/@/hooks/web/useI18n';
  import BasicTree from '/@/components/Tree/src/BasicTree.vue';
  import { ref, onMounted, defineExpose } from 'vue';
  import { getUpdateTimeTree } from '/@/api/business/updateLogs';
  import moment from 'moment';
  const { t } = useI18n();
  const emit = defineEmits(['select-log']);
  const treeData = ref<any[]>([]);
  const loading = ref(false);
  const selectedKeys = ref<string[]>([]);
  const expandedKeys = ref<string[]>([]);
  const isManualSelection = ref(false);

  onMounted(() => {
    loadTimeTree();
  });

  const loadTimeTree = async () => {
    try {
      loading.value = true;
      const res = await getUpdateTimeTree();

      if (res.code === 200 && res.data) {
        treeData.value = formatTree(res.data);

        // 默认展开年份节点
        if (treeData.value.length > 0) {
          expandedKeys.value = [treeData.value[0].key];
        }
      } else {
        treeData.value = [];
      }
    } catch (error) {
      console.error('加载时间树失败:', error);
      treeData.value = [];
    } finally {
      loading.value = false;
    }
  };

  // 更新树数据的方法 - 保留所有匹配结果
  const updateTreeData = async (newData: any[]) => {
    try {
      loading.value = true;
      treeData.value = formatTree(newData);
    } catch (error) {
      console.error('更新时间树数据失败:', error);
    } finally {
      loading.value = false;
    }
  };

  const formatTree = (nodes: any[], level: 'year' | 'month' | 'day' = 'year', parentYear?: string, parentKey = '') => {
    return nodes.map((node, index) => {
      let displayLabel = node.label;
      const key = parentKey ? `${parentKey}-${index}` : `year-${index}`;

      if (level === 'year') {
        const currentYear = node.label;
        displayLabel = `${currentYear}年`;
        return {
          ...node,
          key,
          displayLabel,
          children: node.children ? formatTree(node.children, 'month', currentYear, key) : [],
        };
      } else if (level === 'month') {
        displayLabel = `${parentYear}年${node.label.padStart(2, '0')}月`;
        return {
          ...node,
          key,
          displayLabel,
          children: node.children ? formatTree(node.children, 'day', parentYear, key) : [],
        };
      } else {
        if (!Number.isNaN(Number(node.label))) {
          displayLabel = moment(Number(node.label)).format('YYYY年MM月DD日 HH:mm');
        }
        return {
          ...node,
          key: node.id || key,
          displayLabel,
          children: [],
          isDayLevel: true, // 标记为日级节点
        };
      }
    });
  };

  // 处理展开事件
  const handleExpand = (expandedKeysVal: string[]) => {
    expandedKeys.value = expandedKeysVal;
  };

  // 处理折叠事件
  const handleCollapse = (collapsedKeysVal: string[]) => {
    expandedKeys.value = expandedKeys.value.filter(key => !collapsedKeysVal.includes(key));
  };

  // 处理节点选择事件
  const handleSelect = (selectedKeysVal: string[]) => {
    if (selectedKeysVal.length > 0) {
      const selectedId = selectedKeysVal[0];
      selectedKeys.value = selectedKeysVal;
      isManualSelection.value = true;

      // 查找选中的是否是日级节点
      const isDayLevel = findIsDayLevel(treeData.value, selectedId);
      emit('select-log', selectedId, isDayLevel);
    }
  };

  // 查找节点是否是日级节点
  const findIsDayLevel = (nodes: any[], targetId: string): boolean => {
    for (const node of nodes) {
      if (node.key === targetId) {
        return node.isDayLevel || false;
      }
      if (node.children && node.children.length > 0) {
        const found = findIsDayLevel(node.children, targetId);
        if (found) return found;
      }
    }
    return false;
  };

  // 处理标题文字点击事件 - 只处理有子节点的年份/月份节点
  const handleTitleClick = (item: any, e: MouseEvent) => {
    // 只有有子节点的年份/月份节点才处理点击事件
    if (item.children && item.children.length > 0) {
      // 阻止事件冒泡到选择事件
      e.stopPropagation();

      const isExpanded = expandedKeys.value.includes(item.key);
      if (isExpanded) {
        handleCollapse([item.key]);
      } else {
        handleExpand([...expandedKeys.value, item.key]);
      }
    }
    // 日级节点不做处理，让选择事件正常触发
  };

  const setSelected = (id: string, manual = false) => {
    selectedKeys.value = id ? [id] : [];
    isManualSelection.value = manual;
  };

  const clearSelection = () => {
    selectedKeys.value = [];
    isManualSelection.value = false;
  };

  defineExpose({
    setSelected,
    clearSelection,
    updateTreeData,
    handleExpand,
    treeData,
  });
</script>

<style lang="less" scoped>
  .tree-title-content {
    width: 100%;
    padding: 2px 0;
    cursor: pointer;

    &:hover {
      background-color: rgb(255 123 0 / 10%);
    }
  }

  .no-data {
    text-align: center;
    padding: 20px;
    color: #999;
  }

  .UpdateTime-container {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 20px;
  }

  :deep(.ant-tree) {
    .ant-tree-node-content-wrapper {
      &:hover {
        color: #ff7b00 !important;
        background-color: transparent !important;
      }

      &.ant-tree-node-selected {
        color: #ff7b00 !important;
        background-color: transparent !important;
      }
    }
  }

  :deep(.lydc-tree .ant-tree .ant-tree-treenode.ant-tree-treenode-selected) {
    background-color: #f7f7f7;
  }

  :deep(.scrollbar__thumb) {
    height: 60%;
  }

  :deep(.ant-tree-list-holder-inner) {
    border-radius: 8px;
    background: #f7f7f7;
    width: 238px;
  }

  .tree-container {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  :deep(.ant-tree-treenode) {
    color: #1a1a1a;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 22px;
  }
</style>
