<!-- 补录推送 -->
<template>
  <TableLayout class="biangong-table-layout">
    <template #toolbarLeft>
      <a-popconfirm placement="right" :title="`确认后将推送${endDimWeek}周数据到海波龙系统`" @confirm="syncHFMData">
        <a-button :loading="syncLoading" type="primary" v-if="isSyncBtnShow">推送</a-button>
      </a-popconfirm>
      <ToolBarAction :formParams="formParams" />
    </template>
  </TableLayout>
</template>

<script lang="ts" setup>
  import { reactive, ref, watch, onMounted, computed } from 'vue';
  import { formOptions, getAllColumns } from './config';
  import { useTableLayout } from '/@/views/dataAnalysis/components/TableLayout/useTableLayout';
  import type { VxeGridProps } from 'vxe-table';
  import { getHfmbasisdata, pushHfmdata } from '/@/api/dataAnalysis/financial';
  import { isEmpty } from 'lodash-es';
  defineOptions({ name: 'dataAnalysis-financial-hfmbasisdata' });
  import ToolBarAction from './ToolBarAction.vue';
  const attrs = reactive<VxeGridProps<any>>({
    proxyConfig: {
      autoLoad: true,
      response: {
        list: 'data.list',
        total: 'data.pagination.total',
      },
    },
    id: 'dataAnalysis-financial-hfmbasisdata-list',
  });
  const columns = ref(getAllColumns());
  const [TableLayout, api] = useTableLayout({
    formConfig: {
      formOptions,
    },
    tableConfig: {
      columns,
      attrs,
      getExportParams: () => {
        const { getFormParams } = api.searchFormApi;
        const { week } = getFormParams();
        const filename = `推送数据_${week}`;
        return {
          filename,
        };
      },
      api: getHfmbasisdata,
    },
  });

  import { useMessage } from '/@/hooks/web/useMessage';
  const { createMessage } = useMessage();

  const syncLoading = ref(false);
  const isSyncBtnShow = ref(false);

  const endDimWeek = computed(() => {
    const { getFormParams } = api.searchFormApi;
    const { week } = getFormParams();
    return week;
  });

  onMounted(() => {
    const { state } = api.searchFormApi;
    // 拉取项目下拉
    watch(
      [() => state.searchLoading, () => state.searchFormValue.orgCode],
      () => {
        if (!state.searchLoading && !isEmpty(state.searchFormValue)) {
          const options = (api.searchFormApi.getFormSignItem('orgCode') as any).options;
          isSyncBtnShow.value = options.find(item => item.value === state.searchFormValue.orgCode)?.level === 4;
        }
      },
      { immediate: true, deep: true },
    );
  });

  const syncHFMData = () => {
    const { week, orgCode } = api.searchFormApi.getFormParams();
    syncLoading.value = true;
    pushHfmdata({ week, orgCode })
      .then(res => {
        if (res.code === 200) {
          createMessage.success(res.msg);
        } else {
          createMessage.error(res.msg);
        }
      })
      .finally(() => {
        syncLoading.value = false;
      });
  };
  const formParams = () => {
    const { getFormParams } = api.searchFormApi;
    return getFormParams();
  };
</script>

<style lang="less" scoped>
  .biangong-table-layout {
    :deep(.vxe-header--column) {
      padding: 0 !important;

      // 合并 一级表头padding
      :deep(tr .col--group) {
        padding: 0 !important;
      }
    }
  }
</style>
