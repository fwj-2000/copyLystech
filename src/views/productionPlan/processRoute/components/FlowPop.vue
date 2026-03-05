<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    :showOkBtn="state.routeStatus !== 1"
    :okText="t('common.saveText')"
    :title="title"
    destroyOnClose
    @ok="handleSave($event, 0)"
    @close="handleVisibleChange"
    class="full-popup p-10px">
    <template #appendToolbar>
      <a-button @click="handleSave($event, 1)" class="ml-10px" type="primary">{{ t('common.publish') }}</a-button>
    </template>
    <FlowChart
      ref="flowChartRef"
      v-if="state.processId"
      :init-node="true"
      :flowId="state.processId"
      :flowApi="getRouteDetail"
      :circulationType="state.circulationType" />
  </BasicPopup>
</template>
<script lang="ts" setup>
  import { reactive, toRefs, onMounted, ref, onUnmounted } from 'vue';
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { useI18n } from '/@/hooks/web/useI18n';
  import FlowChart from '/@/components/CustomComponents/src/FlowChart.vue';
  import { getRouteDetail, saveRouteDetail } from '/@/api/productionPlan/processRoute';
  import { useMessage } from '/@/hooks/web/useMessage';

  const emits = defineEmits(['register', 'refresh']);

  const { t } = useI18n();
  const { createMessage } = useMessage();

  interface State {
    listQuery: any;
    title: string;
    processId: string;
    processData: any;
    routeStatus: string | number;
    circulationType: number;
  }

  const state = reactive<State>({
    listQuery: {
      category: 'Web',
      keyword: '',
      type: '',
      enabledMark: '',
      routeStatus: '',
    },
    title: '',
    processId: '',
    processData: {},
    routeStatus: '',
    circulationType: 1,
  });
  const flowChartRef = ref();

  const { title } = toRefs(state);

  const [registerPopup, { closePopup }] = usePopupInner(init);
  function init(data) {
    console.log(data, 'data----------------');
    state.title = data?.title + t('dict.ProcessRouteColumn.processRouteId');
    state.processId = data?.id || '';
    state.routeStatus = data?.routeStatus || '';
    // fetchProcessData();
    state.circulationType = data.circulationType;
  }
  function handleSave(e, val) {
    console.log(e, val);
    const list = flowChartRef.value.getData();
    const { nodes } = list;
    const startNode = nodes.length && nodes.find(item => item.type === 'start-node');
    const finishNode = nodes.length && nodes.find(item => item.type === 'finish-node');
    if (!startNode) {
      createMessage.warning('请添加开始节点');
      return false;
    }
    if (!finishNode) {
      createMessage.warning('请添加结束节点');
      return false;
    }
    console.log(list, 'nodes.length');
    if (startNode && finishNode && nodes.length == 2) {
      createMessage.warning('请添加工序节点');
      return false;
    }
    const params = {
      id: state.processId,
      routeStatus: val,
      ...list,
    };
    saveRouteDetail(params)
      .then(res => {
        closePopup();
        createMessage.success(res?.msg || '保存成功');
        emits('refresh');
      })
      .catch(err => {
        console.log(err, 'err');
      });
  }
  function handleVisibleChange(v) {
    if (!v) {
      state.processId = '';
      emits('refresh');
    }
  }

  onMounted(() => {});
</script>

<style lang="less" scoped>
  :deep(.lydc-basic-table-action button i) {
    font-size: 18px;
  }
</style>
