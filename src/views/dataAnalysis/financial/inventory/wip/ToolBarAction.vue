<!-- 操作按钮组 -->
<template>
  <a-space>
    <a-button type="primary" @click="setModal">查看分析</a-button>
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
          <a-input-number v-model:value="topNum" :min="0" @change="debouncedTopNumChange"> </a-input-number>
        </div>
        <span>分析</span>
      </div>
    </template>
    <div>
      <span class="f-w-800">{{ formParams().endDim ?? '' }} WIP结存情况</span>
    </div>

    <div class="bg-[#f2f2f2] mb-8px py-6px px-12px">
      <div v-for="(value, idx) in analysisInfo" :key="idx">
        <div class="mb-8px" v-html="value"></div>
      </div>
    </div>
  </BasicModal>
</template>

<script lang="ts" setup>
  import { ref, watch } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { getInventoryMakingAnalysis } from '/@/api/dataAnalysis/financial';
  import { debounce } from 'lodash-es';

  const props = defineProps({
    formParams: {
      type: Function as PropType<() => Recordable<any>>, // 修改为函数类型
      required: true,
    },
  });

  const topNum = ref<number>(5);
  const analysisInfo = ref<string[]>([]);
  const [registerModal, { setModalProps }] = useModalInner();

  // 添加缓存变量，记录上一次请求的参数
  let lastRequestParams = {
    formParams: {} as Recordable<any>,
    top: 5,
  };

  // 检查参数是否发生变化
  const hasParamsChanged = () => {
    return (
      topNum.value !== lastRequestParams.top || JSON.stringify(props.formParams()) !== JSON.stringify(lastRequestParams.formParams) // 调用函数
    );
  };

  // 更新缓存参数
  const updateLastRequestParams = () => {
    lastRequestParams = {
      formParams: { ...props.formParams() }, // 调用函数
      top: topNum.value,
    };
  };

  const setModal = async () => {
    // 检查参数是否变化，如果没变化则不请求
    if (!hasParamsChanged()) {
      setModalProps({ open: true });
      return;
    }

    try {
      let { code, data } = await getInventoryMakingAnalysis({ ...props.formParams(), top: topNum.value }); // 调用函数
      if (code === 200) {
        analysisInfo.value = getAnalysisInfo(data);
        setModalProps({ open: true });
        // 更新缓存参数
        updateLastRequestParams();
      }
    } catch (error) {
      console.error('获取分析数据失败', error);
    }
  };

  const fetchData = async () => {
    // 检查参数是否变化，如果没变化则不请求
    if (!hasParamsChanged()) {
      return;
    }

    try {
      let { code, data } = await getInventoryMakingAnalysis({ ...props.formParams(), top: topNum.value }); // 调用函数
      if (code === 200) {
        analysisInfo.value = getAnalysisInfo(data);
        // 更新缓存参数
        updateLastRequestParams();
      }
    } catch (error) {
      console.error('获取分析数据失败', error);
    }
  };

  const debouncedTopNumChange = debounce(fetchData, 300);

  const getAnalysisInfo = (info: string[]) => {
    const processedData = info.map((item: string, index: number) => {
      if (index === 0) {
        // 处理WIP值变化情况
        const wipMatch = item.match(/WIP([\+\-]?)(\d+)/);
        let transformed = item;
        if (wipMatch) {
          const [, sign] = wipMatch;
          const trend = sign === '-' ? '下降' : '上升';
          transformed = item.replace(`WIP${sign}`, `WIP${trend}`);
        }
        return `1、${transformed}`;
      } else if (index === 1) {
        // 处理好的厂区：添加a、和前缀说明
        return `a、降幅<span style="color: red;">好的</span>Top${topNum.value}厂区：` + item.split('：')[1];
      } else if (index === 2) {
        return `b、降幅<span style="color: red;">差的</span>Top${topNum.value}厂区：` + item.split('：')[1];
      } else if (index === 3) {
        return '2、WIP占产值比' + item;
      } else if (index === 4) {
        return `3、30天以上逾期工单Top${topNum.value}厂区：` + item.split('：')[1];
      } else {
        return `4、工单结单率Top${topNum.value}排名：` + item.split('：')[1];
      }
    });
    return processedData;
  };
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

  .f-w-800 {
    font-weight: 800;
  }
</style>
