<template>
  <div class="flow-chart h-full" :class="prefixCls">
    <div class="box h-full">
      <CustomToorBar class="tool-bar justify-start" :prefixCls="prefixCls" v-if="toolbar" @clone-node="handleCloneNode" @delete-node="handleDeleteNode" />
      <div class="container-wrapper flex h-full">
        <CommonNodePanel :lf="lf" :api="getMrbList" />
        <div ref="flowRef" class="w-full h-full"></div>
        <!-- <RightDrawer @register="registerDetailDetail" @update="updateProperties" /> -->
        <CommonPropertiesPanel v-bind="state" ref="CommonPropertiesPanel" @update="updateProperties" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { ref, reactive } from 'vue';
  import LogicFlow from '@logicflow/core';
  import '@logicflow/core/dist/style/index.css';
  import '@logicflow/extension/lib/style/index.css';
  import { flowPlugin } from './flowPlugin/index';
  import { PageWrapper } from '/@/components/Page';
  import CommonNodePanel from './flowPlugin/CommonNodePanel.vue';
  import CommonPropertiesPanel from './flowPlugin/CommonPropertiesPanel.vue';
  import { CustomToorBar } from '/@/components/FlowChart';
  import { createFlowChartContext } from '/@/components/FlowChart/src/useFlowContext';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { getProcessNodeList } from '/@/api/productionPlan/processRoute';
  import { useDrawer } from '/@/components/Drawer';
  import RightDrawer from './flowPlugin/RightDrawer.vue';
  import { Menu } from '@logicflow/extension';
  import { useBaseStore } from '/@/store/modules/base';
  const baseStore = useBaseStore();
  const flowBranchType = await baseStore.getDictionaryData('FlowBranchType');
  export default {
    props: {
      toolbar: {
        type: Boolean,
        default: true,
      },
      flowId: {
        type: String,
        default: '',
      },
      flowApi: {
        type: Function,
        default: () => {},
      },
      initNode: {
        type: Boolean,
        default: false,
      },
    },
    setup() {
      const count = ref(0);
      const currentNode = ref(null);
      const lf = ref() as any;
      const flow = ref({});
      const CommonPropertiesPanel = ref() as any;
      const state = reactive({
        id: '',
        title: '',
        form: {},
        type: '',
      });
      const defaultNodeList = [
        {
          type: 'start-node',
          // x: 400,
          y: 200,
          id: 'start-node',
          text: '开始',
        },
        {
          type: 'finish-node',
          // x: 400,
          y: 400,
          id: 'finish-node',
          text: '结束',
        },
      ];

      createFlowChartContext({
        logicFlow: lf as unknown as LogicFlow,
      });
      const { prefixCls } = useDesign('flow-chart');

      const [registerDetailDetail, { openDrawer }] = useDrawer();
      function getMrbList() {
        return baseStore.getDictionaryData('flowNodeType');
      }
      return {
        state,
        flow,
        count,
        currentNode,
        lf,
        CommonPropertiesPanel,
        prefixCls,
        defaultNodeList,
        getProcessNodeList,
        registerDetailDetail,
        openDrawer,
        getMrbList,
      };
    },
    async mounted() {
      const logic = new LogicFlow({
        container: this.$refs.flowRef as any,
        grid: {
          size: 10,
          visible: false,
          type: 'mesh',
          config: {
            color: '#fff',
            thickness: 1,
          },
        },
        // adjustNodePosition: false, // 是否允许拖动节点。
        textEdit: true, // 是否开启文本编辑。
        // textEditable: true,
        // stopZoomGraph: true, // 禁止缩放画布。
        stopScrollGraph: true, // 禁止鼠标滚动移动画布。
        // stopMoveGraph: true, // 禁止拖动画布。
        keyboard: {
          enabled: true,
        },
        edgeType: 'better-line',
        plugins: [flowPlugin, Menu],
      });
      logic.on('node:click,edge:click', this.handleClick);
      logic.on('blank:click', this.handleBlankClick);
      logic.extension.menu.setMenuConfig({
        nodeMenu: [
          {
            className: 'lf-menu-delete',
            text: '删除',
            callback(node) {
              logic.deleteNode(node.id);
            },
          },
          // {
          //   text: 'edit',
          //   className: 'lf-menu-item',
          //   callback (node) {
          //     this.editText(node.id)
          //   }
          // },
          {
            text: '复制',
            className: 'lf-menu-item',
            callback(node) {
              logic.cloneNode(node.id);
            },
          },
        ],
        edgeMenu: [
          {
            className: 'lf-menu-delete',
            text: '删除',
            callback(node) {
              logic.deleteEdge(node.id);
            },
          },
        ],
      });

      logic.graphModel.transformModel.zoom(0.9);
      // logic.fitView();
      this.lf = logic;
      logic.setTheme({
        nodeText: {
          color: '#1a1a1a', // ✅ 正确格式
          fontSize: 14,
          fontFamily: 'Arial',
        },
      });
      this.fetchNodeList();
    },
    methods: {
      // 安全处理节点属性解析
      safeParse(str, fallback = {}) {
        try {
          return JSON.parse(str);
        } catch {
          return fallback;
        }
      },
      async fetchNodeList() {
        let { data } = await this.flowApi(this.flowId);
        const { nodes, edges } = data;
        const processNodeList =
          nodes?.length &&
          nodes.map(item => {
            console.log(item, 'item-NOde');
            // useFlowSetting.getStateVal('dictKey');
            const properties = this.safeParse(item.properties);

            return { ...item, ...item.properties, properties } || [];
          });

        const processEdges =
          edges?.length &&
          edges.map(item => {
            const properties = this.safeParse(item.properties);
            item.type = 'better-line'; // 固定为 better-line 线的节点类型
            return { ...item, ...item.properties, properties } || [];
          });

        const flow = {
          nodes: nodes?.length ? processNodeList : [],
          edges: edges?.length ? processEdges : [],
        };
        this.flow = flow;
        this.lf.render(flow);
        // }
      },
      handleClick(eventData) {
        const { data } = eventData;
        console.log(data, '666');
        let formVal = {};
        let title = '';
        if (data.type == 'start-node' || data.type == 'finish-node') return;
        if (data.type === 'better-line') {
          formVal = this.lf.getEdgeModelById(data.id).getProperties();
          title = '线属性';
        } else {
          formVal = this.lf.getNodeModelById(data.id).getProperties();
          title = data.text?.value;
        }
        // { id: data.id, title, form: formVal, type: data.type }
        this.state.id = data.id;
        this.state.title = title;
        this.state.form = formVal;
        this.state.type = data.type;
        // this.openDraw(data);
        this.CommonPropertiesPanel.init(this.state);
      },
      handleBlankClick(e, val) {
        this.CommonPropertiesPanel.init('');
      },
      openDraw(data) {
        console.log(data, 'openDraw');
        let formVal = {};
        let title = '';
        if (data.type === 'better-line') {
          formVal = this.lf.getEdgeModelById(data.id).getProperties();
          title = '线属性';
        } else {
          formVal = this.lf.getNodeModelById(data.id).getProperties();
          title = data.text.value;
        }
        this.openDrawer(true, { id: data.id, title, form: formVal, type: data.type });
      },
      getData() {
        const { nodes, edges } = this.lf?.getGraphData();
        console.log(nodes, edges, 'getData');
        const processNodeList = nodes.map(item => {
          const _item = { ...item?.properties, ...item, properties: JSON.stringify(item.properties) };
          _item.name = _item.text?.value;
          return _item;
        });
        const processEdges = edges.map(item => ({ ...item.properties, ...item, properties: JSON.stringify(item.properties) }));
        return {
          nodes: processNodeList,
          edges: processEdges,
        };
      },
      // 更新节点、线的属性
      updateProperties(id, type, key, value, dataSource) {
        const form = {};
        form[`${key}`] = value || '';
        if (type == 'better-line') {
          const { condition = '', branchType = '' } = dataSource;
          const edge = this.lf.getEdgeModelById(id);
          const branchTypelist = flowBranchType.filter(item => item.enCode == branchType);
          const branchTypeName = branchTypelist.length ? branchTypelist[0].fullName : '';
          const lineText = branchType ? `(${branchTypeName})` + condition : condition;
          edge.updateText(lineText || '');
          edge.setProperties({
            // ...form,}
            ...dataSource,
            // stroke: '#FF4D4F',
          });
          this.lf.setTheme({
            edgeText: {
              fontSize: 12,
              stroke: value === 'NG' ? '#FF4D4F' : '',
            },
          });
        } else {
          this.lf.getNodeModelById(id).setProperties({ ...form });
        }
      },
      handleCloneNode() {
        const { edges, nodes } = this.lf.getSelectElements(false);
        if (nodes.length) {
          this.lf.cloneNode(nodes[0].id);
        }
      },
      handleDeleteNode() {
        const { edges, nodes } = this.lf.getSelectElements(false);
        if (nodes.length) {
          this.lf.deleteNode(nodes[0].id);
        }
        if (edges.length) {
          this.lf.deleteEdge(edges[0].id);
        }
      },
    },
    components: {
      PageWrapper,
      CommonNodePanel,
      CustomToorBar,
      RightDrawer,
      // PropertiesPanel,
      CommonPropertiesPanel,
    },
    expose: ['getData'],
  };
</script>
<style lang="less" scoped>
  .flow-chart {
    margin: 0 auto;
    height: 100%;
    padding-top: 16px;

    .box {
      border-radius: 8px;
      border: 1px solid #e6e6e6;
      overflow: hidden;

      .tool-bar {
        height: 48px;
        flex-shrink: 0;
        border-radius: 8px 8px 0 0;
        background: #fff;
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
</style>
