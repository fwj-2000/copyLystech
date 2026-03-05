<!-- 分布明细表格 -->
<template>
  <!-- 报表表格 -->
  <div class="h-[44px] flex justify-start mt-[-44px]">
    <span class="font-bold">当前周无单价料件</span>
    <a-button type="primary" class="ml-12px" :loading="exportNoLoading" ghost @click="exportNo">导出</a-button>
  </div>
  <div class="w-[100%] h-[60vh] overflow-hidden vxe-table">
    <BaseVxeTable @register="register" />
  </div>
</template>

<script lang="ts" setup>
  import { ref, reactive, computed } from 'vue';
  import { useBaseVxeTable } from '/@/views/dashboard/commonComponents/BaseVxeTable/useBaseVxeTable';
  import { getNofpricedetails, exportnofpricedetails } from '/@/api/dashbord/report';

  import BaseVxeTable from '/@/views/dashboard/commonComponents/BaseVxeTable/index.vue';
  import type { VxeGridProps } from 'vxe-table';
  import { useDownload } from '/@/views/dashboard/hooks/useDownload';

  const props = defineProps({
    searchParams: {
      type: Object as PropType<Record<string, any>>,
      default: () => ({}),
    },
  });

  const attrs = reactive<VxeGridProps<any>>({
    proxyConfig: {
      autoLoad: true,
      response: {
        total: 'data.pagination.total',
      },
    },
  });

  const searchParams = computed(() => {
    return props.searchParams;
  });

  const columns = ref([{ field: 'FProduct', title: '料号', minWidth: 300 }]);

  const [register] = useBaseVxeTable({
    immediateQuery: true,
    searchFormValue: searchParams,
    columns,
    attrs,
    getParams: () => {
      return searchParams.value;
    },
    api: getNofpricedetails,
  });

  const { downloadFile, loading: exportNoLoading } = useDownload({
    requestApi: exportnofpricedetails,
  });

  const exportNo = () => {
    const { dimension, orgCode } = searchParams.value;
    downloadFile({ dimension, selectKey: 'FProduct', orgCode }, `${dimension}无单价物料.xls`);
  };
</script>
