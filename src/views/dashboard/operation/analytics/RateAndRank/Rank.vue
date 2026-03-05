<!-- 占比与排名 -->
<template>
  <div class="h-[100%]">
    <SpinContent
      v-bind="{
        loading,
        isEmptyData,
        isRequestError,
        showList: false,
      }">
      <div class="h-44px flex justify-start color-[#1A1A1A] font-bold">占比与排名</div>
      <div class="h-[calc(100%-44px)] overflow-y-auto">
        <div v-for="(item, idx) in rankList" :key="idx" class="w-[100%] h-[16%]">
          <div class="flex justify-between">
            <p>{{ item.orgName }}</p>
            <p>{{ item.rate.toFixed(1) }}%</p>
          </div>
          <div class="process-wrapper">
            <div class="process" :style="{ width: `${item.rate || 0}%`, marginLeft: `${item.offset}%` }"></div>
          </div>
        </div>
      </div>
    </SpinContent>
  </div>
</template>

<script lang="ts" setup>
  import { ref, watch, inject } from 'vue';
  import { getDatacollectionRank } from '/@/api/dashbord/report';

  import { SpinContent } from '/@/views/dashboard/operate/components/styleItem/index';

  interface IProps {
    searchFormValue: Record<string, any>;
    field: string;
    fieldName: string;
  }
  const props = withDefaults(defineProps<IProps>(), {});
  const getCommonParams = inject('getCommonParams', () => ({}));
  const emits = defineEmits(['update:show']);
  const rankList = ref<any[]>([]);
  const loading = ref<boolean>(true);
  const isEmptyData = ref<boolean>(false);
  const isRequestError = ref<boolean>(false);

  watch(
    [() => props.searchFormValue, () => props.field],
    () => {
      // 重新查询数据
      loading.value = true;
      const params = getCommonParams();
      getDatacollectionRank({
        ...params,
        field: props.field,
      })
        .then(res => {
          const { data } = res;
          const { buList, sbuList } = data;
          const dataList = buList.length > 1 ? buList : sbuList;
          if (dataList.length < 2) {
            emits('update:show', false);
            return; // 只有一个 BU 或 SBU 无数据，不做处理
          }
          emits('update:show', true);
          const allValue = dataList.reduce((pre, cur) => {
            return pre + cur.sValue;
          }, 0);
          let offset = 0;
          rankList.value = dataList.map(item => {
            const rate = (item.sValue / allValue) * 100;
            const res = {
              ...item,
              rate,
              offset,
            };
            offset += rate;
            return res;
          });
        })
        .catch(() => {
          isRequestError.value = true;
        })
        .finally(() => {
          loading.value = false;
        });
    },
    { deep: true, immediate: false },
  );
</script>

<style lang="less" scoped>
  :deep(.ant-spin-container) {
    min-height: 0 !important;
  }

  .process-wrapper {
    width: 100%;
    background-color: #e6e6e6;

    .process {
      max-width: 100%;
      width: 0%;
      height: 10px;
      background: linear-gradient(90deg, #1ee0e7 -20%, #1890ff 80%);
      background-size: 200% 100%;
      transition: all 0.5s linear;
    }
  }
</style>
