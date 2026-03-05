<!-- 平铺页单个图表数据 -->
<template>
  <div class="w-[100%] h-[100%] flex gap-8px pb-8px">
    <!-- 出勤 -->
    <div class="w-[60%] h-[100%] flex gap-8px">
      <div class="w-[50%] h-[100%] info-wrapper idl-wrapper">
        <IDLInfo :info="props.info" />
      </div>
      <div class="w-[50%] h-[100%] info-wrapper idl-wrapper">
        <DLInfo :info="props.info" />
      </div>
    </div>
    <!-- 产值 -->
    <div class="warm-border w-[40%] h-[100%]">
      <Output :info="props.info" :isSingle="true" />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import dayjs from 'dayjs';
  import { provide } from 'vue';
  import { useGo } from '/@/hooks/web/usePage';
  import { objectToQueryParams } from '../../utils';

  import Output from './Chart/Output.vue';
  import DLInfo from './Chart/Attendance/DLInfo.vue';
  import IDLInfo from './Chart/Attendance/IDLInfo.vue';

  interface IProps {
    info: any;
    queryInfo: any;
  }

  const props = withDefaults(defineProps<IProps>(), {
    info: {},
    queryInfo: {},
  });
  const go = useGo();

  // 打开新标签页
  const goPage = (path, params = {}) => {
    if (!path) return;
    const { orgCode = '', date = dayjs().subtract(1, 'day'), timeDimension = 'day' } = props.queryInfo;
    // 构造路由参数
    const url = `${path}?${objectToQueryParams({
      orgCode,
      dimension: timeDimension,
      date: date.format('YYYY-MM-DD'),
      ...params,
    })}`;
    go(url);
  };

  // 打开人力出勤详情页
  const goPersonalDetailPage = (params = {}) => {
    const { date = dayjs().tz().subtract(2, 'day'), timeDimension = 'day' } = props.queryInfo;
    goPage('/dashboard/operate/attendanceRate/personnelDetail', {
      dimension: timeDimension,
      date: date.format('YYYY-MM-DD'),
      ...params,
    });
  };

  provide('goPersonalDetailPage', goPersonalDetailPage);
</script>

<style lang="less" scoped>
  .info-wrapper {
    border-radius: 2px;
    background: linear-gradient(180deg, #e9eeff 2.17%, #fff 100%);
    box-shadow: 0 0 4px 0 rgb(0 0 0 / 8%);

    &.idl-wrapper {
      background: linear-gradient(180deg, #e9eeff 2.17%, #fff 100%);
    }

    &.dl-wrapper {
      background: linear-gradient(180deg, #e5f9ff 2.17%, #fff 100%);
    }
  }
</style>
