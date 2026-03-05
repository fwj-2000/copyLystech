<template>
  <Cascader v-model:value="innerValue" v-bind="getBindValue" :options="options" :showSearch="true" @change="onChange">
    <template #displayRender="{ labels, selectedOptions }">
      <span v-for="(label, index) in labels" :key="selectedOptions[index]">
        <span v-if="index === labels.length - 1">
          {{ label }}
        </span>
        <span v-else>{{ label }} /</span>
      </span>
    </template>
  </Cascader>
</template>

<script lang="ts" setup>
  import { ref, computed, unref, onMounted, watch, nextTick } from 'vue';
  import Cascader from './Cascader.vue';
  import { getFactoryAreaList } from '/@/api/basicData/factoryArea';
  // import { getDepartmentSelectorByAuth } from '/@/api/permission/organize';

  import { useAttrs } from '/@/hooks/core/useAttrs';

  defineOptions({ name: 'lydcOrganizeCascader', inheritAttrs: false });
  const props = defineProps({
    api: Function,
    default: () => [],
  });
  const emit = defineEmits(['update:value', 'change']);

  const options = ref([]);
  const innerValue = ref([]);

  watch(
    () => props.api,
    async newApi => {
      if (!newApi) return;
      try {
        const { code, data } = await newApi();
        if (code === 200) {
          nextTick(() => {
            options.value = data.list;
          });
        }
      } catch (error) {
        console.error('API call failed:', error);
      }
    },
    { immediate: true }, // 立即执行
  );

  async function getFactoryAreaListFn() {
    const { code, data } = await getFactoryAreaList({});
    if (code === 200) {
      options.value = data.list;
    }
  }

  const attrs = useAttrs({ excludeDefaultKeys: false });

  const getBindValue = computed(() => ({ ...unref(attrs), showCheckedStrategy: 'SHOW_CHILD' }));

  function onChange(val, option) {
    emit('update:value', val);
    emit('change', val, option);
  }

  onMounted(() => {
    getFactoryAreaListFn();
  });
</script>
