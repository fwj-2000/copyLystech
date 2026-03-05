<template>
  <div class="div0">
    <div class="div1">
      <div class="head">
        <div>
          <span>工单编号 ：</span>
          <span>{{ props.list.FManuOrder }}</span>
        </div>
      </div>
      <div class="body">
        <div>
          <span>产品编码 ：</span>
          <span>{{ props.list.FProduct }}</span>
        </div>
        <div>
          <span>首检结果 ：</span>
          <span>{{ props.list.f_judgeResult }}</span>
        </div>
        <div>
          <span>送检时间 ：</span>
          <span>{{ props.list.f_sendInspectTime }}</span>
        </div>
        <div>
          <span>检测时间 ：</span>
          <span>{{ props.list.s_oncreateTime }}</span>
        </div>
        <div>
          <span>检测人员 ：</span>
          <span>{{ props.list.fOperator }}</span>
        </div>
        <div>
          <span>工单数量 ：</span>
          <span>{{ props.list.Qty }}</span>
        </div>
        <div>
          <span>模切数量 ：</span>
          <span>{{ props.list.SQty }}</span>
        </div>
      </div>
    </div>
    <div class="div2">
      <div ref="chartRef" style="height: 334px"> </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, onMounted, Ref } from 'vue';
  import { useECharts } from '/@/hooks/web/useECharts';
  const chartRef = ref<HTMLDivElement | null>(null);
  const { setOptions } = useECharts(chartRef as Ref<HTMLDivElement>);
  const props = defineProps(['data', 'list']);

  onMounted(() => {
    setOptions({
      legend: {
        bottom: 15,
      },
      tooltip: {},
      dataset: {
        source: props.data,
      },
      xAxis: { type: 'category' },
      yAxis: {},
      series: [
        {
          type: 'bar',
          color: '#4B7BEC',
          barMaxWidth: 38,
        },
        {
          type: 'bar',
          color: '#FF8310',
          barMaxWidth: 38,
        },
      ],
    });
  });
</script>

<style lang="less" scoped>
  .div0 {
    width: 100%;
    height: 334px;
    padding: 20px;
  }

  .div1 {
    width: 28%;
    height: 334px;
    float: left;
    border: 1px solid #f0f0f0;
    background: #fafafa;
  }

  .div2 {
    width: 72%;
    height: 334px;
    float: right;
    border: 1px solid #f0f0f0;
    background: #fff;
  }

  .head {
    height: 38px;
    border-bottom: 1px solid #f0f0f0;
    display: flex;
  }

  .head div {
    padding: 8px 0 8px 16px;
    align-items: center;
    line-height: 22px;
  }

  .head div span {
    color: #1a1a1a;
    font-family: Roboto, sans-serif;
    font-size: 14px;
    font-style: normal;
    font-weight: 700;
    line-height: 22px;
  }

  .body {
    display: flex;
    width: 361px;
    padding: 24px 0 26px 16px;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    gap: 12px;
  }

  .body div {
    color: #4f4f4f;
    font-family: Roboto, sans-serif;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 22px;
  }

  .body div span {
    color: #1a1a1a;
    font-family: Roboto, sans-serif;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 22px;
  }
</style>
