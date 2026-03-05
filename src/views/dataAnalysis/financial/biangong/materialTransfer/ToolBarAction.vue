<!-- 操作按钮组 -->
<template>
  <a-space>
    <p class="rank-header">模切BG制程边贡损失额排名榜（可针对不同维度进行选择分析）</p>
    <a-button v-auth="'btn_viewAnalysis'" type="primary" @click="setModalProps({ open: true })">查看分析</a-button>
  </a-space>
  <!-- 分析彈窗组件 -->
  <BasicModal
    v-bind="{
      footer: null,
      draggable: true,
      visible: false,
    }"
    class="analysis-dialog"
    @register="registerModal"
    style="width: 50vw">
    <template #title>
      <div class="flex justify-start">
        <span>Top</span>
        <div class="w-[74px] mx-[8px]">
          <a-input-number v-model:value="topNum" :max="props.dataSource.length"> </a-input-number>
        </div>
        <span>分析</span>
      </div>
    </template>
    <div>
      <p v-for="(item, idx) in analysisInfo" :key="idx" class="bg-[#f2f2f2] mb-8px py-6px px-12px">
        <span v-for="(content, cidx) in item" :keys="cidx">
          <template v-if="content.type === 'text'">
            {{ content.content }}
          </template>
          <template v-if="content.type === 'value'">
            <span :style="content.style || {}">{{ content.content }}</span>
          </template>
        </span>
      </p>
    </div>
  </BasicModal>
</template>

<script lang="ts" setup>
  import { ref, computed } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { getAnalysisInfo } from './utils';

  const props = defineProps({
    // 表格数据
    dataSource: {
      type: Array as PropType<Recordable<any>[]>,
      required: true,
    },
  });

  const topNum = ref<number>(5);
  const [registerModal, { setModalProps }] = useModalInner();
  const analysisInfo = computed(() => {
    const info = props.dataSource.slice(0, topNum.value);
    return getAnalysisInfo(info);
  });
</script>

<style lang="less" scoped>
  .rank-header {
    color: #1a1a1a;
    font-size: 16px;
    font-weight: 700;
  }
</style>

<style lang="less">
  .analysis-dialog .ant-modal-body > .scrollbar {
    padding: 24px !important;
  }
</style>
