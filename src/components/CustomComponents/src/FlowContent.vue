<template>
  <!-- <div> -->
  <div v-if="isPreview">{{ t('dict.CommonCol.ctrlTipText') }}</div>
  <div ref="lfElRef" class="logic-flow-container"></div>
  <!-- </div> -->
</template>

<script lang="ts" setup>
  import type { Ref } from 'vue';
  import { ref, unref, nextTick } from 'vue';
  import LogicFlow from '@logicflow/core';
  import '@logicflow/core/dist/style/index.css';
  import '@logicflow/extension/lib/style/index.css';
  import { flowPlugin } from './flowPlugin/index';
  import { createFlowChartContext } from '/@/components/FlowChart/src/useFlowContext';
  import { useI18n } from '/@/hooks/web/useI18n';
  const { t } = useI18n();
  defineExpose({ getData, init });

  const lfElRef = ref(null) as any;
  const isPreview = ref(false);
  const lfInstance = ref(null) as Ref<LogicFlow | null>;

  createFlowChartContext({
    logicFlow: lfInstance as unknown as LogicFlow,
  });
  async function init(data) {
    console.log(data, 'data初始化了----------');
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
    console.log(logic, 'graphModel');
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
    // const { offsetWidth, offsetHeight } = lfElRef.value;
    lf.fitView();
  }
  function getData() {
    const lf = unref(lfInstance);
    if (!lf) {
      return;
    }
    const { nodes, edges } = unref(lf)?.getGraphData();
    const processNodeList = nodes.map(item => {
      const _item = { ...item, ...item?.properties, properties: JSON.stringify(item.properties) };
      if (_item.type === 'start-node') {
        _item.id = 'start-node';
      } else if (_item.type === 'finish-node') {
        _item.id = 'finish-node';
      }
      return _item;
    });
    const processEdges = edges.map(item => ({ ...item, ...item.properties, properties: JSON.stringify(item.properties) }));
    return {
      nodes: processNodeList,
      edges: processEdges,
    };
  }
</script>
<style lang="less" scoped>
  :deep(.lf-graph) {
    background: #f5f7fa !important;
    box-shadow: 0 2px 4px 0 rgb(0 0 0 / 2%), 0 1px 6px -1px rgb(0 0 0 / 2%), 0 1px 2px 0 rgb(0 0 0 / 3%);
  }

  .logic-flow-container {
    height: 100%;
    width: 100%;
  }
</style>
