<template>
  <BasicModal v-bind="$attrs" :width="1000" @register="registerModal" @cancel="clearExpression" @ok="handleSubmit" title="打印设计">
    <div class="field-builder-container">
      <!-- 左侧可用字段列表 -->
      <div class="field-list">
        <h3>可用字段</h3>
        <a-input placeholder="搜索字段" v-model:value="searchText" allow-clear />
        <a-tree
          :expandedKeys="['xiTongZiDuan']"
          :tree-data="filteredFields"
          :field-names="{ key: 'key', title: 'label', children: 'children' }"
          @select="handleTreeSelect" />
      </div>

      <!-- 右侧表达式构建区 -->
      <div class="expression-builder">
        <h3>表达式构建</h3>
        <div class="expression-preview">
          <a-tag v-for="(item, index) in currentExpression" :key="index + new Date().getTime()" closable @close="removeFromExpression(index)">
            {{ item.label }}
          </a-tag>
          <span v-if="currentExpression.length === 0" class="placeholder">请从左侧选择字段</span>
        </div>

        <div class="expression-result">
          <a-textarea :rows="3" placeholder="拼接结果" v-model:value="expressionResult" readonly />
        </div>

        <div class="operator-buttons">
          <a-button-group>
            <a-button class="mr-5px" @click="addOperator('+')">+</a-button>
            <a-button class="mr-5px" @click="addOperator('-')">-</a-button>
            <a-button class="mr-5px" @click="addOperator('*')">*</a-button>
            <a-button class="mr-5px" @click="addOperator('/')">/</a-button>
            <a-button class="mr-5px" @click="addOperator('(')">(</a-button>
            <a-button class="mr-5px" @click="addOperator(')')">)</a-button>
            <a-button class="mr-5px" @click="addOperator(' ')">空格</a-button>
          </a-button-group>
        </div>
      </div>
    </div>
  </BasicModal>
</template>

<script lang="ts" setup>
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { ref, computed } from 'vue';
  import { Input, Tree, Tag, Button, ButtonGroup } from 'ant-design-vue';
  import type { DataNode } from 'ant-design-vue/es/tree';

  // 类型定义
  interface FieldItem extends DataNode {
    id: string;
    label: string;
    value?: string;
    [x: string]: any;
    children?: FieldItem[];
  }

  interface ExpressionItem {
    id: string;
    label: string;
    value: string;
  }

  const AInput = Input;
  const ATextarea = Input.TextArea;
  const ATree = Tree;
  const ATag = Tag;
  const AButton = Button;
  const AButtonGroup = Button.Group;

  const [registerModal, { closeModal, changeOkLoading }] = useModalInner(init);
  // 响应式数据
  const emit = defineEmits(['register', 'reload', 'expression-created']);
  const searchText = ref('');
  const currentExpression = ref<ExpressionItem[]>([]);
  const expressionResult = ref('');
  const selectedKeys = ref<string[]>([]);
  const props = defineProps({
    treeData: { type: Array as () => FieldItem[], default: () => [] },
  });
  // 添加一个查找字段的辅助函数
  const findFieldLabel = (key: string, items: FieldItem[]): string | undefined => {
    for (const item of items) {
      if (item.children) {
        const result = findFieldLabel(key, item.children);
        if (result) return result;
      } else {
        // 从 ${xxx} 中提取 xxx
        const fieldKey = key.replace(/^\$\{(.+)\}$/, '$1');
        if (item.key === fieldKey) {
          return item.label;
        }
      }
    }
    return undefined;
  };

  // 修改 init 函数中的对应部分
  function init(data) {
    if (data.options.field) {
      const field = data.options.field;
      // 首先检查整个字段是否已经被 ${} 包裹
      if (!field.startsWith('${') && !field.endsWith('}')) {
        // 如果没有被包裹，直接将整个字段包裹起来
        const wrappedField = `\${${field}}`;
        currentExpression.value = [
          {
            id: wrappedField,
            label: findFieldLabel(wrappedField, props.treeData) || field,
            value: wrappedField,
          },
        ];
        updateExpressionResult();
        return;
      }

      const matches = field.match(/\$\{[^}]+\}/g);
      currentExpression.value = [];
      if (matches) {
        // console.log(matches, 'matches');
        let lastIndex = 0;
        matches.forEach(match => {
          const index = field.indexOf(match, lastIndex);
          if (index > lastIndex) {
            // 如果中间有非变量文本，检查是否需要包裹
            const middleText = field.slice(lastIndex, index);
            if (middleText.trim()) {
              // 如果不是空白字符
              // 将非变量文本也包裹起来
              const wrappedMiddleText = `\${${middleText}}`;
              currentExpression.value.push({
                id: `str_${lastIndex}`,
                label: middleText,
                value: wrappedMiddleText,
              });
            } else {
              // 如果是空白字符，保持原样
              currentExpression.value.push({
                id: `str_${lastIndex}`,
                label: middleText,
                value: middleText,
              });
            }
          }
          // 查找对应的 label
          const foundLabel = findFieldLabel(match, props.treeData);
          currentExpression.value.push({
            id: match,
            label: foundLabel || match,
            value: match,
          });
          lastIndex = index + match.length;
        });

        // 处理最后剩余的文本
        if (lastIndex < field.length) {
          const remainingText = field.slice(lastIndex);
          if (remainingText.trim()) {
            // 如果不是空白字符
            const wrappedRemainingText = `\${${remainingText}}`;
            currentExpression.value.push({
              id: `str_${lastIndex}`,
              label: remainingText,
              value: wrappedRemainingText,
            });
          } else {
            currentExpression.value.push({
              id: `str_${lastIndex}`,
              label: remainingText,
              value: remainingText,
            });
          }
        }
      } else {
        // 如果没有匹配到任何 ${} 格式的内容，将整个字段包裹
        const wrappedField = `\${${field}}`;
        currentExpression.value = [
          {
            id: wrappedField,
            label: findFieldLabel(wrappedField, props.treeData) || field,
            value: wrappedField,
          },
        ];
      }
      updateExpressionResult();
    } else {
      currentExpression.value = [];
      expressionResult.value = '';
    }
  }

  // 计算属性 - 过滤字段
  const filteredFields = computed<FieldItem[]>(() => {
    if (searchText.value.trim() !== '') {
      const filter = (items: FieldItem[]): FieldItem[] => {
        return items
          .map(item => {
            if (item.children) {
              const filteredChildren = filter(item.children);
              if (filteredChildren.length > 0 || item.label.includes(searchText.value)) {
                return { ...item, children: filteredChildren };
              }
            } else if (item.label.includes(searchText.value)) {
              return item;
            }
            return null;
          })
          .filter(item => item !== null) as FieldItem[];
      };
      return filter(props.treeData);
    }
    return props.treeData;
  });

  // 处理树节点选择
  const handleTreeSelect = (selectedKeys: string[], { node, selected }: any) => {
    // 确保获取到节点数据
    if (node) {
      addToExpression({
        key: node.key,
        id: node.key,
        label: node.label,
        value: node.value || `\${${node.key}}`, // 默认值
      });
    }
  };

  // 方法 - 添加字段到表达式
  const addToExpression = (node: FieldItem) => {
    if (!node.children && node.value) {
      currentExpression.value.push({
        id: node.id,
        label: node.label,
        value: node.value,
      });
      updateExpressionResult();
    }
  };

  // 方法 - 从表达式中移除字段
  const removeFromExpression = (index: number) => {
    currentExpression.value.splice(index, 1);
    updateExpressionResult();
  };

  // 方法 - 添加操作符
  const addOperator = (op: string) => {
    currentExpression.value.push({
      id: `op_${Date.now()}`,
      label: op,
      value: op,
    });
    updateExpressionResult();
  };

  // 方法 - 清空表达式
  const clearExpression = () => {
    currentExpression.value = [];
    expressionResult.value = '';
    selectedKeys.value = [];
  };

  // 方法 - 更新表达式结果
  const updateExpressionResult = () => {
    expressionResult.value = currentExpression.value.map(item => item.value).join('');
  };

  // 方法 - 确认表达式
  const handleSubmit = () => {
    emit('expression-created', expressionResult.value);
    clearExpression();
    closeModal();
  };
</script>

<style scoped>
  .field-builder-container {
    display: flex;
    height: 500px;
  }

  .field-list {
    width: 30%;
    padding-right: 20px;
    border-right: 1px solid #eee;
  }

  .expression-builder {
    flex: 1;
    padding-left: 20px;
    display: flex;
    flex-direction: column;
  }

  .expression-preview {
    border: 1px dashed #ddd;
    padding: 10px;
    margin-bottom: 15px;
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .placeholder {
    color: #999;
    font-style: italic;
  }

  .expression-result {
    margin-bottom: 15px;
  }

  .operator-buttons {
    margin-bottom: 15px;
  }
</style>
