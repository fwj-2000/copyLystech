<template>
  <div class="business-button-group" style="display: inline-flex; gap: 8px">
    <template v-for="action in visibleActions" :key="action.key">
      <a-popconfirm
        v-if="action.popconfirm"
        :title="getPopconfirmTitle(action)"
        :placement="action.popconfirm.placement || 'right'"
        @confirm="handleAction(action)">
        <a-button v-auth="action.auth" :type="action.type || 'primary'" :danger="action.danger" :loading="loadingMap[action.key]">
          {{ action.label }}
        </a-button>
      </a-popconfirm>

      <a-button
        v-else
        v-auth="action.auth"
        :type="action.type || 'primary'"
        :danger="action.danger"
        :loading="loadingMap[action.key]"
        @click="handleAction(action)">
        {{ action.label }}
      </a-button>
    </template>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import type { ActionItem } from './types';

  const props = defineProps<{
    actions: ActionItem[]; // 配置数组
    params: Record<string, any>; // 页面通用的参数对象 (commonParams)
  }>();

  const emit = defineEmits(['success', 'error']);
  const { createMessage } = useMessage();

  // 维护所有按钮的 loading 状态，key 是 action.key
  const loadingMap = ref<Record<string, boolean>>({});

  // 计算当前显示的按钮
  const visibleActions = computed(() => {
    return props.actions.filter(item => {
      if (typeof item.show === 'function') {
        return item.show(props.params);
      }
      return item.show !== false; // 默认为 true
    });
  });

  // 获取动态的确认文案
  const getPopconfirmTitle = (action: ActionItem) => {
    const { title } = action.popconfirm || {};
    if (typeof title === 'function') {
      return title(props.params);
    }
    return title || '确定进行此操作吗？';
  };

  // 核心执行逻辑
  const handleAction = async (action: ActionItem) => {
    const { key, api, paramsMap } = action;

    // 1. 开启 loading
    loadingMap.value[key] = true;
    try {
      // 2. 准备参数：如果有映射函数就用映射后的，否则直接用 props.params
      const apiParams = paramsMap ? paramsMap(props.params) : props.params;

      // 3. 调用接口
      const res = await api(apiParams);

      // 4. 统一处理结果
      if (res.code === 200) {
        createMessage.success(res.msg);
        emit('success', { key, res }); // 通知父组件刷新表格
      } else {
        createMessage.error(res.msg);
        emit('error', { key, res });
      }
    } catch (error) {
      console.error(error);
    } finally {
      // 5. 关闭 loading
      loadingMap.value[key] = false;
    }
  };
</script>
