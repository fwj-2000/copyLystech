<!-- 项目阶段&客户 -->
<template>
  <div class="w-[100%] h-[100%] bg-[#fff] fc-shadow flex flex-col justify-start items-start">
    <MetricItem title="项目阶段&客户" @click-title="goPath('/dashboard/customerService/projectPhase')">
      <div class="w-[100%] h-[100%] gap-row-2 flex justify-start">
        <div class="w-[50%] h-[100%] fc-border-sm">
          <ProjectPhase v-bind="props" ref="projectPhaseRef" />
        </div>
        <div class="w-[50%] h-[100%] fc-border-sm">
          <CustomNum v-bind="props" ref="customNumRef" />
        </div>
      </div>
    </MetricItem>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { useMetricContent } from '/@/views/dashboard/customerService/hooks/useMetricContent';

  import ProjectPhase from './ProjectPhase.vue';
  import CustomNum from './CustomNum.vue';
  import MetricItem from '/@/views/dashboard/customerService/components/Layout/MetricItem.vue';

  const props = defineProps({
    searchFormValue: {
      type: Object as PropType<Record<string, any>>,
      default: () => ({}),
    },
    searchLoading: {
      type: Boolean,
      default: false,
    },
  });

  const projectPhaseRef = ref<any>();
  const customNumRef = ref<any>();

  const fetchData = () => {
    projectPhaseRef.value?.fetchData();
    customNumRef.value?.fetchData();
  };

  const [, { goPath }] = useMetricContent({
    componentProps: props,
  });

  defineExpose({
    fetchData,
  });
</script>

<style scoped>
  /* Add your styles here */
</style>
