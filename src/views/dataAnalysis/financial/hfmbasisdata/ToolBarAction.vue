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
          v-model:value="topStatus"
          placeholder="请选择"
          style="width: 100px"
          @change="handleChange"
          :options="[
            { label: '全部', value: '全部' },
            { label: '已推送', value: '已推送' },
            { label: '未推送', value: '未推送' },
          ]"></a-select>
      </div>
    </template>
    <div>
      <p v-for="(content, cidx) in analysisInfo" :keys="cidx" class="flex justify-between bg-[#f2f2f2] mb-8px py-6px px-12px">
        <span>
          {{ `${cidx + 1}）` }} <span class="font-bold"> {{ content.factory }}</span>
        </span>
        <span>
          {{ content.desc }}
          <span>
            <CloseCircleOutlined v-if="content.status !== '成功'" style="color: red; font-size: 16px" />
            <CheckCircleOutlined v-else style="color: green; font-size: 16px" />
          </span>
        </span>
      </p>
    </div>
  </BasicModal>
</template>

<script lang="ts" setup>
  import { ref, computed } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { pushhfmsituation } from '/@/api/dataAnalysis/financial';
  import { CloseCircleOutlined, CheckCircleOutlined } from '@ant-design/icons-vue';
  const props = defineProps({
    formParams: {
      type: Function as PropType<() => Recordable<any>>,
      required: true,
    },
  });
  const dataSource = ref<{ factory: string; desc: string; status: string }[]>([]);
  const topStatus = ref<string>('全部');
  const [registerModal, { setModalProps: setModalPropsFn }] = useModalInner();

  const analysisInfo = computed(() => {
    if (topStatus.value === '全部') {
      const info = dataSource.value;
      return info;
    } else if (topStatus.value === '已推送') {
      const info = dataSource.value.filter(item => item.status === '成功');
      return info;
    } else if (topStatus.value === '未推送') {
      const info = dataSource.value.filter(item => !item.status);
      return info;
    }
  });
  const handleChange = (val: string) => {
    topStatus.value = val;
  };

  const setModalProps = async () => {
    const { data } = await pushhfmsituation({ week: props.formParams().week });
    dataSource.value = data;
    setModalPropsFn({ open: true });
  };
</script>

<style lang="less">
  .analysis-dialog .ant-modal-body > .scrollbar {
    padding: 24px !important;
  }
</style>
