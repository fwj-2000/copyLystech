<template>
  <li class="tree-node" :style="{ '--level': level }">
    <div class="node-content" :class="{ 'has-children': hasChildren }">
      <span class="expand-icon" v-show="hasChildren" @click="toggleExpand">
        <i :class="{ 'ym-custom ym-custom-menu-down': isExpanded, 'ym-custom ym-custom-menu-right': !isExpanded }" style="color: #999"></i>
      </span>

      <!-- 节点标题 / 编辑框 -->
      <template v-if="!isEditing">
        <a class="ep-draggable-item node-title" :tid="node.tid" :label="node.label" :style="{ color: hasChildren ? '#1a1a1a' : '#666666' }">
          {{ node.title }}
        </a>
      </template>
      <template v-else>
        <a-input size="small" v-model:value="editValue" @pressEnter="confirmEdit" @blur="cancelEdit" style="width: 160px" />
      </template>

      <!-- 右侧更多按钮 -->
      <!-- <a-dropdown placement="bottomLeft" trigger="hover">
        <a-button type="text" size="small" style="margin-left: 8px"
          ><div style="position: relative">
            <i class="ym-custom ym-custom-dots-horizontal"></i>
            <div v-show="addingChild" class="add-child-container" :style="addChildStyle">
              <div class="add-child-title">添加子字段 <div class="add-child-title-child"></div></div>
              <div class="add-child-name">名称：</div>
              <a-input size="small" v-model:value="newChildValue" @pressEnter="confirmAddChild" placeholder="请输入子字段名称" style="margin-top: 4px" />
              <div style="margin-top: 20px; width: 100%; text-align: right">
                <a-button size="small" @click="cancelAddChild" style="background: #e7e7e7; border: none; color: #000">取消</a-button>
                <a-button size="small" type="primary" @click="confirmAddChild" style="margin-left: 8px">确认</a-button>
              </div>
            </div>
          </div>
        </a-button>
        <template #overlay>
          <a-menu v-if="!addingChild">
            <a-menu-item @click="startEdit">编辑</a-menu-item>
            <a-dropdown :trigger="['click']">
              <a class="ant-dropdown-link" @click.prevent>
                <a-menu-item v-if="node.children" @click="startAddChild($event)">添加子字段</a-menu-item>
              </a>
              <template #overlay> </template>
            </a-dropdown>
            <a-menu-item>
              <a-popconfirm title="确认删除该项吗？" ok-text="确认" cancel-text="取消" @confirm="confirmDelete">
                <span>删除</span>
              </a-popconfirm>
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown> -->
    </div>

    <!-- 添加子级输入框（下拉样式） -->

    <!-- 子节点 -->
    <ul class="children-container" v-show="isExpanded && hasChildren">
      <TreeNode
        v-for="child in node.children"
        :key="child.key"
        :node="child"
        :level="level + 1"
        @edit="emit('edit', $event)"
        @add-child="emit('add-child', $event)"
        @delete="emit('delete', $event)" />
    </ul>
  </li>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue';
  import type { PropType } from 'vue';

  interface TreeNodeData {
    title: string;
    key: string;
    tid: string;
    label: string;
    customText: string;
    custom: boolean;
    type: string;
    fontSize: number;
    width: number;
    children?: TreeNodeData[];
  }

  const props = defineProps({
    node: {
      type: Object as PropType<TreeNodeData>,
      required: true,
    },
    level: {
      type: Number,
      default: 0,
    },
  });

  const emit = defineEmits(['edit', 'add-child', 'delete']);

  const isExpanded = ref(true);
  const isEditing = ref(false);
  const editValue = ref(props.node.title);

  const addingChild = ref(false);
  const newChildValue = ref('');

  const hasChildren = computed(() => props.node.children);
  const mousePosition = ref({ x: 0, y: 0 });
  const addChildStyle = computed(() => ({
    left: `${mousePosition.value.x}px`,
    top: `${mousePosition.value.y}px`,
  }));

  const toggleExpand = () => {
    if (hasChildren.value) {
      isExpanded.value = !isExpanded.value;
    }
  };

  // 编辑
  const startEdit = () => {
    isEditing.value = true;
    editValue.value = props.node.title;
  };
  const confirmEdit = () => {
    isEditing.value = false;
    emit('edit', { ...props.node, newTitle: editValue.value });
  };
  const cancelEdit = () => {
    isEditing.value = false;
  };

  // 添加子字段
  const startAddChild = e => {
    // 记录鼠标位置
    mousePosition.value = {
      x: e.clientX,
      y: e.clientY,
    };
    addingChild.value = true;
    newChildValue.value = '';
  };
  const confirmAddChild = () => {
    if (newChildValue.value.trim()) {
      emit('add-child', { parent: props.node, title: newChildValue.value });
      addingChild.value = false;
    }
  };
  const cancelAddChild = () => {
    addingChild.value = false;
  };

  // 删除
  const confirmDelete = () => {
    emit('delete', props.node);
  };
</script>

<style scoped>
  .tree-node {
    --level: 0;

    margin: 4px 0;
  }

  .node-content {
    display: flex;
    align-items: center;
    padding: 4px 8px;
    padding-left: calc(16px + var(--level) * 16px);
    border-radius: 4px;
    transition: all 0.2s ease;
    position: relative;
  }

  .node-content.has-children {
    font-weight: 600;
  }

  .expand-icon {
    margin-right: 5px;
    width: 5px;
    height: 5px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .node-title {
    flex: 1;
    text-decoration: none;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .children-container {
    list-style: none;
    padding-left: 16px;
    margin: 0;
  }

  .add-child-container {
    position: fixed;
    width: 267px;
    height: 171px;
    padding: 16px;
    background: #fff;
    border: 1px solid #eee;
    border-radius: 4px;
    z-index: 999;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    box-shadow: 0 4px 10px 0 #ccc;
  }

  .add-child-title {
    position: relative;
    font-weight: bold;
    margin-bottom: 16px;
    margin-left: 10px;
  }

  .add-child-title-child {
    position: absolute;
    top: 4px;
    left: -10px;
    width: 2px;
    height: 14px;
    background: #ff7b00;
  }

  .add-child-name {
    margin-bottom: 4px;
  }
</style>
