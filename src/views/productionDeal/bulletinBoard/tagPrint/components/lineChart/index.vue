<template>
  <div ref="chartRef" :style="{ height: `${state.chartHeight}px` }"></div>
</template>
<script lang="ts" setup>
  import { onMounted, ref, Ref, nextTick, reactive } from 'vue';
  import { useECharts } from '/@/hooks/web/useECharts';
  import * as echarts from 'echarts';

  const chartRef = ref<HTMLDivElement | null>(null);
  const { setOptions } = useECharts(chartRef as Ref<HTMLDivElement>);
  const completionRef = ref(null) as any;
  const props = defineProps(['lines', 'fmac']);
  interface State {
    chartHeight: number;
    avg: string;
  }

  const state = reactive<State>({
    chartHeight: 0,
    avg: '',
  });

  async function init() {
    nextTick(() => {
      const height = (completionRef.value?.offsetHeight || 700) / 2;
      state.chartHeight = height > 200 ? height : 200;
    });
    state.avg = getAverage(props.lines);
  }

  function getAverage(arr) {
    if (arr.length === 0) return '0'; // 如果数组为空，返回0
    const sum = arr.reduce((acc, current) => acc + current, 0); // 累加数组元素
    if (sum > 0) {
      const arrLength = arr.filter(c => c > 0).length;
      return (sum / arrLength).toFixed(2); // 计算平均值
    } else {
      return '';
    }
  }

  onMounted(() => {
    init(),
      setOptions({
        title: {
          text: '运行时间  (机台号：' + props.fmac + ')',
          left: 12,
          top: 12,
          textStyle: {
            fontSize: 16,
            color: '#7A7A7A',
          },
          subtext: '汇总：' + state.avg + '%',
          subtextStyle: {
            fontSize: 14,
          },
        },

        tooltip: {
          trigger: 'axis',
          axisPointer: {
            lineStyle: {
              width: 1,
              color: '#ff7b00',
            },
          },
        },
        dataZoom: [
          {
            type: 'inside',
          },
          {
            type: 'slider',
            dataBackground: {
              areaStyle: {
                color: 'rgba(0,0,0,0.03)',
              },
            },
            // 底部缩放配置
            selectedDataBackground: {
              areaStyle: {
                color: 'rgba(0,0,0,0.1)',
              },
              lineStyle: {
                color: 'rgba(0,0,0,0.1)',
              },
            },
            borderColor: '#FFF',
            fillerColor: 'rgba(33,33,33, 0.01)',
            moveHandleStyle: {
              opacity: 0,
            },
            handleStyle: {
              borderWidth: 0,
            },
          },
        ],
        xAxis: {
          type: 'category',
          data: [
            '8:00-9:00',
            '9:00-10:00',
            '10:00-11:00',
            '11:00-12:00',
            '12:00-13:00',
            '13:00-14:00',
            '14:00-15:00',
            '15:00-16:00',
            '16:00-17:00',
            '17:00-18:00',
            '18:00-19:00',
            '19:00-20:00',
          ],
          axisLine: {
            lineStyle: {
              color: 'rgba(217, 217, 217, 1)',
            },
          },
          axisLabel: {
            color: 'rgba(140, 140, 140, 1)',
          },
        },
        yAxis: [
          {
            type: 'value',
            max: 100,
            axisLabel: {
              formatter: '{value} %',
            },
            splitNumber: 5,
            axisTick: {
              show: false,
            },
            splitArea: {
              show: true,
              areaStyle: {
                color: ['#fff', '#fff'],
              },
            },
            splitLine: {
              show: true,
              lineStyle: {
                type: 'dashed', // 设置为虚线
                color: '#ccc', // 可以自定义虚线的颜色
                width: 1, // 可以自定义虚线的宽度
              },
            },
          },
        ],
        // 曲线上下左右间距
        grid: { left: 20, right: '2%', top: 80, bottom: 50, containLabel: true },
        series: [
          {
            name: '目标',
            smooth: true,
            data: [85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85],
            type: 'line',
            symbol: 'none',
            stack: 'Total',
            lineStyle: {
              color: '#4B7BEC',
              width: 1,
              type: 'dashed',
            },
            areaStyle: {
              opacity: 0.3,
              // 曲线填充颜色
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: '#FFF',
                },
                {
                  offset: 1,
                  color: '#fff',
                },
              ]),
            },
            color: '#4B7BEC',
            // 曲线坐标点文案展示
            label: {
              show: true, // 显示标签
              position: 'top', // 标签位置
              offset: [0, -4],
              formatter: option => `${option.value || 0}%`, // 标签格式器，{c} 表示数据值
              // formatter: '{c}%' // 标签格式器，{c} 表示数据值
            },
          },
          {
            name: '实际',
            smooth: true,
            data: props.lines,
            type: 'line',
            areaStyle: {
              opacity: 0.3,
              // 曲线填充颜色
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: '#ff7b00',
                },
                {
                  offset: 1,
                  color: '#fff',
                },
              ]),
            },
            color: '#FF7B00',
            // 曲线坐标点文案展示
            label: {
              show: true, // 显示标签
              position: 'top', // 标签位置
              offset: [0, -4],
              formatter: option => `${option.value || 0}%`, // 标签格式器，{c} 表示数据值
              // formatter: '{c}%' // 标签格式器，{c} 表示数据值
            },
          },
        ],
        // 顶部标签
        legend: {
          top: 25,
          icon: 'circle',
          // itemWidth: 8,
          // itemHeight: 8,
          // itemGap: 10,
          itemStyle: {},
          textStyle: {
            fontSize: 12,
            // 必须，不然会出宽度不一致的bug
            backgroundColor: 'transparent',
            width: 72,
          },
        },
      });
  });
</script>
