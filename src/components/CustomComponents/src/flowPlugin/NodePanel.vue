<template>
  <div class="approve-node-panel h-full">
    <a-input-search
      class="search-box w-99px mt-16px"
      :placeholder="t('common.enterKeyword')"
      v-model:value="state.processKey"
      allowClear
      @change="debounceSearch"
      @search="debounceSearch" />

    <ScrollContainer v-loading="loading" style="height: calc(100% - 50px)">
      <!-- <div v-for="(item, key) in state.approveNodeList" :key="key" class="approve-node" :style="item.style" @mousedown="dragNode(item)"> -->
      <!-- <div
        v-for="(item, key) in [ ...state.approveNodeList, ...state.approveNodeList, ...state.approveNodeList ]"
        :key="key"
        class="approve-node"
        :style="item.style"
        @mousedown="dragNode(item)"> -->
      <div v-for="item in state.processList" :key="item.id" class="approve-node" @mousedown="dragNode(item)">
        <img v-if="item?.icon" style="width: 18px; height: 18px" :src="item?.icon" />
        <div class="node-label">{{ item.label }}</div>
      </div>
    </ScrollContainer>
  </div>
</template>

<script setup lang="ts">
  import { reactive, onMounted, ref } from 'vue';
  // import { approveNodes } from '../../config';
  // import processNodeIcon from './icons/process_node_icon.svg';
  import { useI18n } from 'vue-i18n';
  import { debounce } from 'lodash-es';
  import { ScrollContainer } from '/@/components/Container';
  import startNodeIcon from './icons/start_node_icon.png';
  import finishNodeIcon from './icons/finish_node_icon.png';

  const { t } = useI18n();

  const emits = defineEmits(['search']);

  const props = defineProps({
    lf: Object,
    api: {
      type: Function,
      default: () => {},
    },
  });

  const state = reactive({
    approveNodeList: [] as any,
    processKey: '',
    processList: [] as any,
  });

  const loading = ref(false);

  const dragNode = item => {
    console.log(item, 'item11');
    props?.lf?.dnd?.startDrag({
      type: item.type, //'html-node'
      text: item.label,
      properties: {
        processId: item.id,
        processTypeDesc: item.processTypeDesc,
        // ...item
      },
    });
  };

  const handleSearch = () => {
    loading.value = true;
    if (!props?.api) {
      loading.value = false;
      return;
    }
    props?.api(state.processKey).then(res => {
      const list = (res?.data || []).map(c => {
        return {
          ...c,
          type: 'flow-node',
          label: c.name,
        };
      });
      console.log(list);
      state.processList = [
        {
          type: 'start-node',
          label: '开始',
          icon: startNodeIcon,
        },
        {
          type: 'finish-node',
          label: '结束',
          icon: finishNodeIcon,
        },
        ...list,
      ];
      loading.value = false;
    });
  };

  const debounceSearch = debounce(handleSearch, 300);

  onMounted(() => {
    state.processKey = '';
    handleSearch();
    // const nodeList = [] as any[];
    // approveNodes.forEach(item => {
    //   nodeList.push({
    //     type: item.type,
    //     label: item.label,
    //     style: item.style,
    //   });
    // });
    // console.log(nodeList, 'nodeList');
    // state.approveNodeList = nodeList;
  });
</script>

<style lang="less" scoped>
  .approve-node-panel {
    // width: 168px;
    overflow: auto;
    // height: calc(100vh - 220px);
    // padding: 0 10px;
    user-select: none;
    // position: absolute;
    // top: 10px;
    // left: 10px;
    // width: 70px;
    // padding: 20px 10px;
    background-color: white;
    // box-shadow: 0 0 10px 1px rgb(228, 224, 219);
    border-right: 1px solid #e6e6e6;
    // border-radius: 6px;
    text-align: center;
    z-index: 101;
    // display: flex;
    flex-direction: column;
    align-items: center;
    flex: none;
    position: relative;

    .search-box {
      // width: 140px;
      // position: absolute;
      // top: 0;
      // left: 12px;
      width: 180px;
      // position: sticky; // 搜索框是否固定
      top: 0;
      left: 12px;

      /* margin: 12px; */
      padding: 16px 12px 0;
      background: #fff;
      box-sizing: content-box;
      margin-top: 0;
    }

    .approve-node {
      /* display: inline-block; */
      box-sizing: border-box;

      /* padding: 10px;
      margin: 5px; */
      color: #fff;
      overflow: hidden;
      display: flex;
      width: 184px;
      // height: 40px;
      // padding: 12px 16px;
      align-items: center;
      gap: 8px;
      flex-shrink: 0;
      border-radius: 4px;
      background: #f1f1f1;
      margin: 16px 12px;
      justify-content: flex-start;
      padding: 8px 12px;

      .node-label {
        font-size: 14px;
        color: #000;
        // margin-top: 8px;
        text-align: left;
        word-break: break-all;
        // overflow: hidden;
        // white-space: nowrap;
        // text-overflow: ellipsis;
      }
    }
  }

  /* .approve-node .node-shape {
  width: 64px;
  height: 64px;
  cursor: pointer;
} */

  /* .approve-node .node-label {
  font-size: 14px;
  color: #000000;
  margin-top: 8px;
  text-align: center;
} */

  /* .node-end {
  position: relative;
}
.node-end:after {
  content: "";
  position: absolute;
  width: 10px;
  height: 10px;
  background: red;
  top: 10px;
  left: 10px;
  cursor: pointer;
} */
</style>
