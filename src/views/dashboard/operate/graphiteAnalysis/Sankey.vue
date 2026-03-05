<!-- 桑基图 -->
<template>
  <div :class="['w-[100%]', 'h-[100%]', 'sankey']">
    <div class="download-box">
      <div @click="downloadSankey" class="download">
        <DownloadOutlined class="download-icon" />
        <div class="download-text">图形下载</div>
      </div>
    </div>
    <div style="width: 100%; overflow: auto">
      <div :class="[projectNo ? `project-${projectNo}` : 'project-main', 'mb-10px', 'pb-10px', analysisFactor.length > 10 ? 'w-[180%]' : 'w-[100%]']">
        <div class="project-no">{{ projectNo }}</div>
        <!-- <Chart ref="chartRef" :options="options" style="width: 100%; height: 70%" /> -->
        <Chart ref="chartRef" :options="options" style="width: 100%; height: 70%" height="450px" />
        <div class="pl-[10px] pr-[120px] flex justify-between item-center" style="width: 100%">
          <div class="w-[80px] flex text-center" v-for="(item, index) in analysisFactor" :key="index">{{ item }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, watch, nextTick } from 'vue';
  import { Chart } from '/@/components/Chart';
  import { DownloadOutlined } from '@ant-design/icons-vue';
  import html2canvas from 'html2canvas';
  defineOptions({ name: 'dashboard-operate-graphiteAnalysis-sankey' });

  const props = defineProps({
    nodes: {
      type: Array,
      default: () => [],
    },
    links: {
      type: Array,
      default: () => [],
    },
    analysisFactor: {
      type: Array,
      default: () => [],
    },
    projectNo: {
      type: String,
      default: '',
    },
  });

  const options = ref({});
  const chartRef = ref();

  const downloadSankey = () => {
    const htmlContent = props.projectNo ? document.getElementsByClassName(`project-${props.projectNo}`)[0] : document.getElementsByClassName('project-main')[0];
    html2canvas((htmlContent as any)!).then(canvas => {
      // 处理 canvas
      const imgData = canvas.toDataURL('image/png');
      var link = document.createElement('a');
      link.href = imgData;
      link.download = `自定义分析因子-${props.projectNo ? props.projectNo : 'main'}.png`; // 设置下载文件名
      document.body.appendChild(link);
      link.click(); // 触发下载
      document.body.removeChild(link); // 移除链接元素
    });
  };

  const setOptions = () => {
    nextTick(() => {
      options.value = {
        tooltip: {
          trigger: 'item',
          triggerOn: 'mousemove',
        },
        grid: {
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
        },
        // toolbox: {
        //   show: true,
        //   feature: {
        //     saveAsImage: {
        //       show: true,
        //       type: 'png', // 支持的图片格式：png、jpeg
        //       pixelRatio: 2, // 导出的图片分辨率比例，默认是 1
        //       backgroundColor: '#fff', // 图表的背景色
        //     },
        //   },
        // },
        series: {
          type: 'sankey',
          layout: 'none',
          top: 0,
          left: 40,
          right: 180,
          // nodeGap: 14,
          // layoutIterations: 0, // 自动优化列表，尽量减少线的交叉，为0就是按照数据排列
          data: props.nodes, // 节点
          links: props.links, // 节点之间的连线
          draggable: false,
          focusNodeAdjacency: 'allEdges', // 鼠标划上时高亮的节点和连线，allEdges表示鼠标划到节点上点亮节点上的连线及连线对应的节点
          lineStyle: {
            color: 'source',
            curveness: 0.5,
          },
          label: {
            fontSize: 14,
            color: '#666',
          },
          itemStyle: {
            normal: {
              borderWidth: 0,
            },
          },
        },
      };

      const instance = chartRef?.value && chartRef?.value.getInstance();
      // 重置并重新绘制图表
      if (instance) {
        instance?.resize();
      }
    });
  };

  watch(
    () => props.nodes,
    () => {
      setOptions();
    },
    { immediate: true, deep: true },
  );
</script>

<style lang="less" scoped>
  .sankey {
    ::-webkit-scrollbar {
      height: 10px; /* 调整滚动条高度 */
    }
  }

  .download-box {
    display: flex;
    justify-content: flex-end;

    .download {
      display: flex;
      align-items: center;
      margin-right: 20px;
      cursor: pointer;

      .download-icon {
        font-size: 22px;
        margin-right: 2px;
      }

      .download-text {
        color: red;
        font-size: 14px;
      }
    }
  }

  .project-no {
    font-size: 18px;
  }
</style>
