<template>
  <div class="approve-node-panel h-full">
    <!-- <a-input-search
      class="search-box w-99px mt-16px"
      :placeholder="t('common.enterKeyword')"
      v-model:value="state.processKey"
      allowClear
      @change="debounceSearch"
      @search="debounceSearch" /> -->

    <ScrollContainer v-loading="loading" style="height: calc(100% - 50px)">
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
    props?.lf?.dnd?.startDrag({
      type: item.type,
      text: item.label,
      properties: {
        processId: item.id,
        processTypeDesc: item.nodeTypeName,
        ...item,
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
      const data = res?.data || res;
      let list = [];
      if (data.length) {
        list = (data || []).map(c => {
          const flowObj = {
            ...c,
            type: 'editable-node',
            nodeType: c.enCode,
            nodeTypeName: c.fullName,
            label: c.name || c.fullName,
          };
          if (flowObj.nodeType === 'start-node') {
          }
          return flowObj;
        });
      }
      state.processList = [...list];
      console.log(list);
      loading.value = false;
    });
  };

  const debounceSearch = debounce(handleSearch, 300);

  onMounted(() => {
    state.processKey = '';
    handleSearch();
  });
</script>

<style lang="less" scoped>
  .approve-node-panel {
    overflow: auto;
    user-select: none;
    background-color: white;
    border-right: 1px solid #e6e6e6;
    text-align: center;
    z-index: 101;
    flex-direction: column;
    align-items: center;
    flex: none;
    position: relative;

    .search-box {
      width: 180px;
      top: 0;
      left: 12px;
      padding: 16px 12px 0;
      background: #fff;
      box-sizing: content-box;
      margin-top: 0;
    }

    .approve-node {
      box-sizing: border-box;
      color: #fff;
      overflow: hidden;
      display: flex;
      width: 184px;
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
        text-align: left;
        word-break: break-all;
      }
    }
  }
</style>
