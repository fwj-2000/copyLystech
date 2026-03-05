<!-- 三阶明细页 -->
<template>
  <div class="h-[600px] mt-27px">
    <BaseVxeTable @register="register"> </BaseVxeTable>
  </div>
</template>

<script lang="ts" setup>
  import { ref, watch } from 'vue';
  import { columns } from './config';
  import { useBaseVxeTable } from '/@/views/dataAnalysis/components/BaseVxeTable/useBaseVxeTable';
  import { getDimension } from '/@/api/dataAnalysis/financial';

  import BaseVxeTable from '/@/views/dataAnalysis/components/BaseVxeTable/index.vue';
  import { getRowClassNameFuncByGroupKey } from '/@/views/dataAnalysis/components/BaseVxeTable/utils';

  const props = withDefaults(
    defineProps<{
      info: any;
    }>(),
    {
      info: {},
    },
  );

  const [register, { reloadData }] = useBaseVxeTable({
    isAutoQuery: false,
    immediateQuery: true,
    searchFormValue: ref({}),
    columns: ref(columns),
    attrs: {
      rowClassName: getRowClassNameFuncByGroupKey('category'),
      autoResize: false,
      pagerConfig: {
        enabled: false,
      },
      toolbarConfig: {
        zoom: false,
        custom: false,
      },
    },
    getParams: () => {
      return props.info;
    },
    api: getDimension,
  });

  watch(
    () => props.info,
    () => {
      reloadData(props.info);
    },
    {
      deep: true,
    },
  );
</script>
