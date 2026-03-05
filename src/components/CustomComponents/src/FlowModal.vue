<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    :showCancelBtn="false"
    :showOkBtn="false"
    :maskClosable="true"
    defaultFullscreen
    :footer="null"
    :closable="true"
    :keyboard="true">
    <template #title>
      <div class="ml-16px">
        <Subtitle title="查看工艺路线图" style="padding-bottom: 0" />
      </div>
    </template>
    <div class="modal-content">
      <div v-if="isPreview">{{ t('dict.CommonCol.ctrlTipText') }}</div>
      <div ref="lfElRef" class="logic-flow-container"></div>
    </div>
  </BasicModal>
</template>

<script lang="ts" setup>
  import type { Ref } from 'vue';
  import { ref, unref, nextTick } from 'vue';
  import LogicFlow from '@logicflow/core';
  import '@logicflow/core/dist/style/index.css';
  import '@logicflow/extension/lib/style/index.css';
  import { flowPlugin } from './flowPlugin/index';
  import { createFlowChartContext } from '/@/components/FlowChart/src/useFlowContext';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { Subtitle } from '/@/components/Subtitle';
  import { useI18n } from '/@/hooks/web/useI18n';
  const { t } = useI18n();
  const [registerModal, { changeLoading }] = useModalInner(init);

  defineExpose({ getData });

  const lfElRef = ref(null) as any;

  const lfInstance = ref(null) as Ref<LogicFlow | null>;
  const isPreview = ref(false);
  createFlowChartContext({
    logicFlow: lfInstance as unknown as LogicFlow,
  });
  async function init(data) {
    await nextTick();
    if (data.isPreview) {
      isPreview.value = true;
    }

    const lfEl = unref(lfElRef);
    if (!lfEl) {
      return;
    }
    lfInstance.value = new LogicFlow({
      container: lfEl,
      // width: 900,
      // height: 400,
      // grid: false,
      background: {
        color: '#F5F7FA',
      },
      grid: {
        size: 10,
        visible: false,
        type: 'mesh',
        config: {
          color: '#fff',
          thickness: 1,
        },
      },
      adjustNodePosition: false, // 是否允许拖动节点。
      textEdit: false, // 是否开启文本编辑。
      stopZoomGraph: false, // 禁止缩放画布。
      // stopScrollGraph: true, // 禁止鼠标滚动移动画布。
      stopMoveGraph: false, // 禁止拖动画布。
      hideAnchors: true, // 隐藏锚点。
      adjustEdge: false,
      autoExpand: true,
      hoverOutline: false,
      // isSilentMode: true, // 静默模式
      keyboard: {
        enabled: true,
      },
      edgeType: 'better-line',
      plugins: [flowPlugin],
    });
    const logic = unref(lfInstance)!;
    logic.setTheme({
      polyline: {
        stroke: 'rgb(130, 179, 102)',
        strokeWidth: 1,
      },
      arrow: {
        offset: 4, // 箭头垂线长度
        verticalLength: 2, // 箭头底线长度
      },
    });
    onRender(data);
    // const { transformModel } = logic.graphModel;
    // transformModel.zoom(1);
    // logic.graphModel.transformModel.translate(400, 200);
    // transformModel.focusOn(600, 200, 350, 400);
    // logic.resetZoom();
    // logic.fitView();
    // logic.resize();
    // transformModel.focusOn(600, 400, 1200, 800);
    // logic.zoom(0.8, [-200, -50]);
    // const config = logic.getEditConfig();
  }
  async function onRender(options) {
    await nextTick();
    const lf = unref(lfInstance);
    if (!lf) {
      return;
    }
    changeLoading(true);
    const { data } = await options.flowApi(options.flowId);
    const { nodes, edges } = data;
    const processNodeList = (nodes && nodes.map(item => ({ ...item, processId: item?.properties?.processId, properties: JSON.parse(item.properties) }))) || [];
    const processEdges = (edges && edges.map(item => ({ ...item, properties: JSON.parse(item.properties) }))) || [];
    const flow = {
      nodes: processNodeList,
      edges: processEdges,
    };
    if (isPreview.value) {
      let isUniline = true;
      const { edges, nodes } = JSON.parse(JSON.stringify(flow));
      let x = 50;
      let y = 50;
      let currentEdge = edges.find(edge => edge.sourceNodeId === 'start-node');
      const arrangedNodeIds = new Set();
      while (currentEdge) {
        const sourceNodeId = currentEdge.sourceNodeId;
        const targetNodeId = currentEdge.targetNodeId;
        const sourceNode = nodes.find(n => n.id === sourceNodeId);
        if (sourceNode && !arrangedNodeIds.has(sourceNodeId)) {
          sourceNode.x = x;
          sourceNode.y = y;
          // sourceNode.text = sourceNode.text.value;
          sourceNode.type == 'flow-node' ? (sourceNode.type = 'flow-node-preview') : '';
          arrangedNodeIds.add(sourceNodeId);
          x += 250;
        }
        const targetNode = nodes.find(n => n.id === targetNodeId);
        if (targetNode && !arrangedNodeIds.has(targetNodeId)) {
          targetNode.x = x;
          targetNode.y = y;
          // targetNode.text = targetNode.text.value;
          targetNode.type == 'flow-node' ? (targetNode.type = 'flow-node-preview') : '';
          arrangedNodeIds.add(targetNodeId);
          const isFinishNode = targetNode.type === 'finish-node';
          if (isFinishNode) {
            break;
          }
          x += 250;
        }
        if (edges.filter(edge => edge.sourceNodeId === targetNodeId).length > 1) {
          currentEdge = null;
          isUniline = false;
          break;
        }
        currentEdge = edges.filter(edge => edge.sourceNodeId === targetNodeId)[0];
      }
      if (isUniline) {
        edges.forEach(edge => {
          delete edge.pointsList;
          delete edge.startPoint;
          delete edge.endPoint;
          if (edge.text) {
            edge.text = edge.text.value;
          }
        });
        flow.nodes = nodes;
        flow.edges = edges;
      }
    }
    lf.render(flow);
    lf.fitView();
    changeLoading(false);
  }
  function getData() {
    const lf = unref(lfInstance);
    if (!lf) {
      return;
    }
    const { nodes, edges } = unref(lf)?.getGraphData();
    const processNodeList = nodes.map(item => ({ ...item, ...item?.properties, properties: JSON.stringify(item.properties) }));
    const processEdges = edges.map(item => ({ ...item, ...item.properties, properties: JSON.stringify(item.properties) }));
    return {
      nodes: processNodeList,
      edges: processEdges,
    };
  }
</script>
<style lang="less" scoped>
  .flow-chart {
    // position: relative;
    // width: 1200px;
    margin: 0 auto;
    height: 100%;
    padding-top: 16px;

    .box {
      border-radius: 8px;
      border: 1px solid #e6e6e6;
      // margin-top: -18px;
      overflow: hidden;
      // margin: 16px 0;
      .tool-bar {
        // width: 1190px;
        height: 48px;
        flex-shrink: 0;
        border-radius: 8px 8px 0 0;
        background: #fff;
        // box-shadow: 0 0 10px 1px rgb(228, 224, 219);
        border-bottom: 1px solid #e6e6e6;
      }

      .container-wrapper {
        height: calc(100% - 48px);
      }
    }
  }

  :deep(.lf-graph) {
    background: #f5f7fa !important;
    box-shadow: 0 2px 4px 0 rgb(0 0 0 / 2%), 0 1px 6px -1px rgb(0 0 0 / 2%), 0 1px 2px 0 rgb(0 0 0 / 3%);
  }

  .modal-content {
    height: 85vh; /* 90% 的视口高度 */
  }

  .logic-flow-container {
    height: 100%;
  }
</style>
