<template>
  <div class="tree-container">
    <a-input :placeholder="t('dict.CommonCol.PESC')" style="margin-bottom: 16px" v-model:value="searchText" @change="handleSearch">
      <template #prefix>
        <i class="icon-ym icon-ym-search" style="color: #ccc"></i>
      </template>
    </a-input>

    <!-- 预先渲染所有可能的搜索结果（始终存在，通过v-show控制显示） -->
    <div v-show="showSearchResults" class="search-results">
      <div v-for="item in allItems" :key="item.key" class="search-item" v-show="isItemVisible(item)">
        <a class="ep-draggable-item" :tid="item.tid" :label="item.label">
          {{ item.title }}
        </a>
      </div>
    </div>

    <!-- 默认树形结构显示 -->
    <ul class="tree-ul" v-show="showDefaultTree">
      <TreeNode v-for="(node, index) in treeData" :key="index" :node="node" @edit="handleEdit" @add-child="handleAddChild" @delete="handleDelete" />
    </ul>
    <!-- 添加父级按钮 -->
    <!-- <div class="add-parent-container">
      <a-button class="add-parent-btn" type="primary" @click="showAddParentInput = true" v-show="!showAddParentInput">
        <template #icon><PlusOutlined /></template>
        添加字段
      </a-button>
      <div class="add-parent-input" v-show="showAddParentInput">
        <a-input v-model:value="newParentTitle" placeholder="请输入父级标题" @pressEnter="confirmAddParent" ref="parentInputRef" />
        <div class="add-parent-buttons">
          <a-button @click="cancelAddParent">取消</a-button>
          <a-button type="primary" @click="confirmAddParent">确认</a-button>
        </div>
      </div>
    </div> -->
    <!-- 搜索无结果提示 -->
    <!-- <div v-show="searchText && !hasSearchResults" class="no-result">没有找到匹配的项目</div> -->
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted } from 'vue';
  import TreeNode from './TreeNode.vue';
  import { PlusOutlined } from '@ant-design/icons-vue';
  import {
    getPrintTemplateAllText,
    addSystemText,
    adSystemTextType,
    updateSystemTextType,
    DesignSysField,
    getlistbyprintcategory,
  } from '/@/api/system/printTemplate';
  import { useI18n } from '/@/hooks/web/useI18n';
  const { t } = useI18n();

  interface TreeNodeData {
    title?: string;
    key?: string;
    tid?: string;
    label?: string;
    customText?: string;
    custom?: boolean;
    type?: string;
    fontSize?: number;
    width?: number;
    children?: TreeNodeData[];
    [x: string]: any;
  }

  const props = defineProps({
    templateData: { type: Object, default: null },
    getTreeData: { type: Function, default: () => {} },
    newFieldItems: { type: Array, default: () => [] },
  });
  let treeData = ref<TreeNodeData[]>([]);

  const emit = defineEmits(['edit', 'add-child', 'delete', 'add-parent', 'updateTreeData']);

  const searchText = ref('');
  const showAddParentInput = ref(false);
  const newParentTitle = ref('');
  const parentInputRef = ref();

  // 扁平化所有节点用于搜索（只执行一次）
  const flattenNodes = (nodes: TreeNodeData): TreeNodeData[] => {
    let result: TreeNodeData[] = [];
    nodes.forEach(node => {
      if (node.children) {
        result = result.concat(flattenNodes(node.children));
      } else {
        result.push(node);
      }
    });
    return result;
  };

  const allItems = computed(() => {
    return flattenNodes(treeData.value);
  });

  // 判断单个项目是否匹配搜索条件
  const isItemMatch = (item: TreeNodeData) => {
    if (!searchText.value) return false;
    const searchTerm = searchText.value.toLowerCase();
    return item.title?.toLowerCase().includes(searchTerm) || item.label?.toLowerCase().includes(searchTerm);
  };

  // 判断单个项目是否应该显示
  const isItemVisible = (item: TreeNodeData) => {
    return !searchText.value || isItemMatch(item);
  };

  // 是否有搜索结果
  const hasSearchResults = computed(() => {
    return searchText.value && allItems.value.some(isItemMatch);
  });

  // 是否显示搜索结果
  const showSearchResults = computed(() => {
    return searchText.value && hasSearchResults.value;
  });

  // 是否显示默认树形结构
  const showDefaultTree = computed(() => {
    return !searchText.value || !hasSearchResults.value;
  });

  const handleSearch = () => {
    // 可以在这里添加额外的搜索处理逻辑
  };

  const handleEdit = (node: TreeNodeData, newTitle: string) => {
    emit('edit', node, newTitle);
    updateSystemTextType(node.key, { name: node.newTitle }).then(res => {
      getList();
    });
  };

  const handleAddChild = (parentNode: TreeNodeData, childTitle: string) => {
    emit('add-child', parentNode, childTitle);
    addSystemText({
      name: parentNode.title,
      value: parentNode.title,
      parentId: parentNode.parent.key,
    }).then(res => {
      getList();
    });
  };

  const handleDelete = (node: TreeNodeData) => {
    emit('delete', node);
    DesignSysField(node.key).then(res => {
      getList();
    });
  };

  const confirmAddParent = () => {
    if (newParentTitle.value.trim()) {
      emit('add-parent', newParentTitle.value);
      showAddParentInput.value = false;
      adSystemTextType({ name: newParentTitle.value }).then(res => {
        getList();
        newParentTitle.value = '';
      });
    }
  };

  const getList = () => {
    if (props.templateData?.firstCategoryCode) {
      console.log(props.templateData.firstCategoryCode, 'props.templateData.firstCategoryCode');
      treeData.value = [];
      getlistbyprintcategory(props.templateData.firstCategoryCode).then(res => {
        treeData.value = transformData([...res.data, ...props.newFieldItems]);
        emit('updateTreeData', treeData.value);
      });
    }
  };
  const cancelAddParent = () => {
    newParentTitle.value = '';
    showAddParentInput.value = false;
  };
  function transformData(data) {
    return [
      {
        title: '系统字段',
        key: 'xiTongZiDuan',
        tid: ``,
        selectable: false,
        label: '系统字段',
        children:
          data.map((child, childIndex) => ({
            title: child.name,
            key: child.code,
            tid: `providerTextModule1.${child.code}`,
            parentId: child.parentId,
            label: child.name,
            customText: child.name, // 使用value字段，如果没有则用name
            custom: true,
            type: 'text',
            options: {
              textContentVerticalAlign: 'middle',
              height: 20,
              testData: child.name,
              fontSize: 12,
              hideTitle: true,
              field: child.code,
              zIndex: 1,
            },
          })) || [],
      },
    ];
  }
  onMounted(() => {
    getList();
  });
</script>

<style scoped>
  .tree-container {
    font-family: Arial, sans-serif;
    user-select: none;
    width: 100%;
    height: 100%;
  }

  .tree-ul {
    list-style: none;
    padding-left: 0;
    margin: 0;
    height: calc(100% - 50px);
    overflow: visible auto; /* 宽度溢出直接显示 */ /* 高度溢出滚动 */
  }

  .tree-ul::-webkit-scrollbar {
    display: none;
  }

  .search-results {
    display: flex;
    flex-direction: column;
    gap: 4px;
    height: calc(100% - 50px);
    overflow-y: auto;
  }

  .search-item {
    padding: 8px 16px;
    border-radius: 4px;
    background-color: #f5f5f5;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .search-item:hover {
    background-color: #e8e8e8;
  }

  .no-result {
    padding: 16px;
    text-align: center;
    color: #999;
  }

  .ep-draggable-item {
    color: #1a1a1a;
    display: inline-block;
    width: 100%;
  }

  .add-parent-container {
    margin-top: 16px;
  }

  .add-parent-input {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-top: -20px;
  }

  .add-parent-buttons {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
  }

  .add-parent-btn {
    width: 100%;
    background: #fff;
    border: 1px solid #dbdbdb;
    color: #ff7b00;
    height: 32px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
