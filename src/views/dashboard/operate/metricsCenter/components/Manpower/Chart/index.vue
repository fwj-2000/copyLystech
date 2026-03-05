<!--  -->
<template>
  <div class="flex w-[100%] h-[100%] pb-8px gap-6px">
    <!-- 出勤率&五大中心|模具厂 -->
    <Attendance
      class="w-[72%] h-[100%] warm-border"
      :operateInfo="(props.info.list || [{}])[0]"
      :centerInfo="props.info.list1 || []"
      :modelInfo="props.info.list2 || []"
      :queryInfo="props.queryInfo" />
    <!-- 人均产值 -->
    <div class="w-[28%] h-[100%] warm-border">
      <Output :info="(props.info.list3 || [{}])[0] || {}" :isSingle="false" />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import Attendance from './Attendance/index.vue';
  import Output from './Output.vue';

  interface IProps {
    info: any;
    queryInfo: any;
  }

  const props = withDefaults(defineProps<IProps>(), {
    info: {
      list: [],
      list2: [],
      list3: [],
      list4: [],
    },
  });
</script>
