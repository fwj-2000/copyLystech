<!-- 操作按钮组 -->
<template>
  <a-space>
    <a-button type="primary" @click="setModalProps">查看分析</a-button>
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
    style="width: 40vw">
    <template #title>
      <div class="flex justify-start">
        <a-select
          v-model:value="topNum"
          placeholder="请选择"
          style="width: 100px"
          @change="handleChange"
          :options="[
            { label: '全部', value: '全部' },
            { label: '已推送', value: '已推送' },
            { label: '未推送', value: '未推送' },
          ]"></a-select>
        <!-- <span>Top</span> -->
        <!-- <div class="w-[74px] mx-[8px]">
          <a-input-number v-model:value="topNum" :max="dataSource.length"> </a-input-number>
        </div> -->
        <!-- <span>分析</span> -->
      </div>
    </template>
    <div>
      <p v-for="(item, idx) in analysisInfo" :key="idx" class="flex justify-between bg-[#f2f2f2] mb-8px py-6px px-12px">
        <span v-for="(content, cidx) in item" :keys="cidx">
          <template v-if="content.type === 'text'">
            {{ `${idx + 1}）` }} <span :style="content.style || {}"> {{ content.content }}</span>
          </template>
          <template v-if="content.type === 'value'">
            <span :style="content.style || {}">
              {{ content.content }}
              <CloseCircleOutlined v-if="content.content === '未推送'" style="color: red; font-size: 16px" />
              <CheckCircleOutlined v-else style="color: green; font-size: 16px" />
            </span>
          </template>
        </span>
      </p>
    </div>
  </BasicModal>
</template>

<script lang="ts" setup>
  import { ref, computed } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { pushweeksituation } from '/@/api/dataAnalysis/financial';
  import { CSSProperties } from 'vue';
  import { CloseCircleOutlined, CheckCircleOutlined } from '@ant-design/icons-vue';
  const props = defineProps({
    formParams: {
      endDim: {
        type: String,
        default: '',
      },
      type: Object as PropType<Recordable<any>>,
      // type: Function as PropType<() => Recordable<any>>,
      required: true,
    },
  });
  const dataSource = ref<{ factory: string; desc: string }[]>([]);
  const topNum = ref<string>('全部');
  const [registerModal, { setModalProps: setModalPropsFn }] = useModalInner();

  const analysisInfo = computed(() => {
    if (topNum.value === '全部') {
      const info = dataSource.value;
      return getAnalysisInfo(info);
    } else if (topNum.value === '已推送') {
      const info = dataSource.value.filter(item => item.desc === '已推送');
      return getAnalysisInfo(info);
    } else if (topNum.value === '未推送') {
      const info = dataSource.value.filter(item => item.desc === '未推送');
      return getAnalysisInfo(info);
    }
  });
  const handleChange = (val: string) => {
    topNum.value = val;
  };
  const setModalProps = async () => {
    const { data } = await pushweeksituation({ week: props.formParams.endDim });
    dataSource.value = data;
    setModalPropsFn({ open: true });
  };

  const getAnalysisInfo = info => {
    const res: {
      type: 'text' | 'value';
      content: string | number;
      style?: CSSProperties;
    }[][] = [];
    info.forEach(item => {
      res.push([
        {
          type: 'text',
          content: item.factory,
          style: {
            fontWeight: 'bold',
          },
        },
        {
          type: 'value',
          content: item.desc,
        },
      ]);
    });
    return res;
  };
</script>

<style lang="less">
  .analysis-dialog .ant-modal-body > .scrollbar {
    padding: 24px !important;
  }
</style>
