<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    :showOkBtn="true"
    :okText="t('common.saveText')"
    :title="title"
    destroyOnClose
    @ok="handleSave($event, 0)"
    @close="handleVisibleChange"
    class="full-popup p-10px">
    <!-- <template #appendToolbar>
      <a-button @click="handleSave($event, 1)" class="ml-10px" v-if="state.routeStatus !== 1" type="primary">{{ t('common.publish') }}</a-button>
    </template> -->
    <CommonFlowChart ref="flowChartRef" v-if="state.processId" :init-node="false" :flowId="state.processId" :flowApi="getFlowDetail" />
  </BasicPopup>
</template>
<script lang="ts" setup>
  import { reactive, toRefs, onMounted, ref, onUnmounted } from 'vue';
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { useI18n } from '/@/hooks/web/useI18n';
  import CommonFlowChart from '/@/components/CustomComponents/src/CommonFlowChart.vue';
  import { getRouteDetail, saveRouteDetail } from '/@/api/productionPlan/processRoute';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { getFlowDetail, saveFlowDetail } from '/@/api/coreCommon/flow';

  const emits = defineEmits(['register', 'refresh']);

  const { t } = useI18n();
  const { createMessage } = useMessage();

  interface State {
    listQuery: any;
    title: string;
    processId: string;
    processData: any;
    routeStatus: string | number;
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
  });
  const flowChartRef = ref();

  const { title } = toRefs(state);

  const [registerPopup, { closePopup }] = usePopupInner(init);
  function init(data: any = {}) {
    state.title = t('配置流程节点');
    state.processId = data.id || '';
    state.routeStatus = data.routeStatus || '';
    // fetchProcessData();
  }
  function handleSave(e, val) {
    const list = flowChartRef.value.getData();
    const { nodes } = list;
    console.log(nodes, 'handleSave');
    // const startNode = nodes.length && nodes.find(item => item.type === 'start-node');
    // const finishNode = nodes.length && nodes.find(item => item.type === 'finish-node');
    // if (!startNode) {
    //   createMessage.warning('请添加开始节点');
    //   return false;
    // }
    // if (!finishNode) {
    //   createMessage.warning('请添加结束节点');
    //   return false;
    // }
    if (!nodes.length) {
      createMessage.warning('请添加工序节点');
      return false;
    }
    const params = {
      id: state.processId,
      routeStatus: val,
      ...list,
    };
    saveFlowDetail(params)
      .then(res => {
        closePopup();
        createMessage.success(res?.msg || '保存成功');
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
