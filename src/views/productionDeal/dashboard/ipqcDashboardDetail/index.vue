<template>
  <div class="screen" ref="cjDrawerRef">
    <div class="screen-header">
      <selectCpm></selectCpm>
      <descBlock style="max-width: 40%; min-width: 350px"></descBlock>
    </div>
    <div class="navbar text-right">
      <a-button @click="() => router.back()" size="large"> 返回 </a-button>
    </div>

    <div class="screen-content">
      <div class="screen-content-header">
        <div class="machineNo">C14-1-SGR223</div>
      </div>
      <div class="screen-content-table">
        <!-- 表头 -->
        <div class="screen-content-thead" ref="theadRef">
          <div v-for="item in columns" :key="item.dataIndex" :style="{ flex: item.width ? 'none' : 1, width: item.width }">
            {{ item.title }}
          </div>
        </div>
        <!-- 内容区域 -->
        <div class="screen-content-tbody" ref="tbodyRef" @scroll="syncScroll">
          <div v-for="(row, rowIndex) in tableData" :key="row.key">
            <div v-for="col in columns" :key="col.dataIndex" :style="{ flex: col.width ? 'none' : 1, width: col.width }">
              {{ row[col.dataIndex] }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import selectCpm from '../component/selectCpm.vue';
  import descBlock from '../component/descBlock.vue';
  import { useRouter } from 'vue-router';
  const router = useRouter();
  const cjDrawerRef = ref<HTMLElement | null>(null);

  const theadRef = ref<HTMLElement | null>(null);
  const tbodyRef = ref<HTMLElement | null>(null);

  // 同步滚动函数
  const syncScroll = () => {
    if (theadRef.value && tbodyRef.value) {
      theadRef.value.scrollLeft = tbodyRef.value.scrollLeft;
    }
  };

  const columns = [
    { title: '序号', dataIndex: 'serialNumber', key: 'serialNumber', width: '100px' },
    { title: '检测类型', dataIndex: 'inspectionType', key: 'inspectionType', width: '' },
    { title: '检测项目', dataIndex: 'inspectionItem', key: 'inspectionItem', width: '' },
    { title: '检测要求', dataIndex: 'inspectionRequirement', key: 'inspectionRequirement', width: '' },
    { title: '样本数量', dataIndex: 'sampleQuantity', key: 'sampleQuantity', width: '' },
    { title: '检测金额', dataIndex: 'inspectionAmount', key: 'inspectionAmount', width: '' },
    { title: '开始时间', dataIndex: 'startTime', key: 'startTime', width: '' },
    { title: '结果时间', dataIndex: 'endTime', key: 'endTime', width: '' },
  ];

  const tableData = [
    {
      key: '1',
      serialNumber: '1',
      inspectionType: 'B件',
      inspectionItem: '2101',
      inspectionRequirement: '尺寸',
      sampleQuantity: 3,
      inspectionAmount: 'OK',
      startTime: '2024-11-19 15:36:00',
      endTime: '2024-11-19 15:40:00',
    },
    {
      key: '2',
      serialNumber: '2',
      inspectionType: 'ZB型',
      inspectionItem: '外观',
      inspectionRequirement: '外观',
      sampleQuantity: 4,
      inspectionAmount: 'HG',
      startTime: '2024-11-19 15:38:00',
      endTime: '2024-11-19 15:40:00',
    },
    {
      key: '3',
      serialNumber: '3',
      inspectionType: 'SZ型',
      inspectionItem: '2101',
      inspectionRequirement: '外观',
      sampleQuantity: 6,
      inspectionAmount: 'OK',
      startTime: '2024-11-19 15:39:00',
      endTime: '2024-11-19 15:40:00',
    },
    {
      key: '4',
      serialNumber: '4',
      inspectionType: 'SZ型',
      inspectionItem: '2101',
      inspectionRequirement: '外观',
      sampleQuantity: 6,
      inspectionAmount: 'OK',
      startTime: '2024-11-19 15:39:00',
      endTime: '2024-11-19 15:40:00',
    },
    {
      key: '5',
      serialNumber: '5',
      inspectionType: 'SZ型',
      inspectionItem: '2101',
      inspectionRequirement: '外观',
      sampleQuantity: 6,
      inspectionAmount: 'OK',
      startTime: '2024-11-19 15:39:00',
      endTime: '2024-11-19 15:40:00',
    },
    {
      key: '6',
      serialNumber: '6',
      inspectionType: 'SZ型',
      inspectionItem: '2101',
      inspectionRequirement: '外观',
      sampleQuantity: 6,
      inspectionAmount: 'OK',
      startTime: '2024-11-19 15:39:00',
      endTime: '2024-11-19 15:40:00',
    },
    {
      key: '7',
      serialNumber: '7',
      inspectionType: 'SZ型',
      inspectionItem: '2101',
      inspectionRequirement: '外观',
      sampleQuantity: 6,
      inspectionAmount: 'OK',
      startTime: '2024-11-19 15:39:00',
      endTime: '2024-11-19 15:40:00',
    },
    {
      key: '8',
      serialNumber: '8',
      inspectionType: 'SZ型',
      inspectionItem: '2101',
      inspectionRequirement: '外观',
      sampleQuantity: 6,
      inspectionAmount: 'OK',
      startTime: '2024-11-19 15:39:00',
      endTime: '2024-11-19 15:40:00',
    },
    {
      key: '9',
      serialNumber: '9',
      inspectionType: 'SZ型',
      inspectionItem: '2101',
      inspectionRequirement: '外观',
      sampleQuantity: 6,
      inspectionAmount: 'OK',
      startTime: '2024-11-19 15:39:00',
      endTime: '2024-11-19 15:40:00',
    },
    {
      key: '6',
      serialNumber: '6',
      inspectionType: 'SZ型',
      inspectionItem: '2101',
      inspectionRequirement: '外观',
      sampleQuantity: 6,
      inspectionAmount: 'OK',
      startTime: '2024-11-19 15:39:00',
      endTime: '2024-11-19 15:40:00',
    },
    {
      key: '7',
      serialNumber: '7',
      inspectionType: 'SZ型',
      inspectionItem: '2101',
      inspectionRequirement: '外观',
      sampleQuantity: 6,
      inspectionAmount: 'OK',
      startTime: '2024-11-19 15:39:00',
      endTime: '2024-11-19 15:40:00',
    },
    {
      key: '8',
      serialNumber: '8',
      inspectionType: 'SZ型',
      inspectionItem: '2101',
      inspectionRequirement: '外观',
      sampleQuantity: 6,
      inspectionAmount: 'OK',
      startTime: '2024-11-19 15:39:00',
      endTime: '2024-11-19 15:40:00',
    },
    {
      key: '9',
      serialNumber: '9',
      inspectionType: 'SZ型',
      inspectionItem: '2101',
      inspectionRequirement: '外观',
      sampleQuantity: 6,
      inspectionAmount: 'OK',
      startTime: '2024-11-19 15:39:00',
      endTime: '2024-11-19 15:40:00',
    },
    {
      key: '6',
      serialNumber: '6',
      inspectionType: 'SZ型',
      inspectionItem: '2101',
      inspectionRequirement: '外观',
      sampleQuantity: 6,
      inspectionAmount: 'OK',
      startTime: '2024-11-19 15:39:00',
      endTime: '2024-11-19 15:40:00',
    },
    {
      key: '7',
      serialNumber: '7',
      inspectionType: 'SZ型',
      inspectionItem: '2101',
      inspectionRequirement: '外观',
      sampleQuantity: 6,
      inspectionAmount: 'OK',
      startTime: '2024-11-19 15:39:00',
      endTime: '2024-11-19 15:40:00',
    },
    {
      key: '8',
      serialNumber: '8',
      inspectionType: 'SZ型',
      inspectionItem: '2101',
      inspectionRequirement: '外观',
      sampleQuantity: 6,
      inspectionAmount: 'OK',
      startTime: '2024-11-19 15:39:00',
      endTime: '2024-11-19 15:40:00',
    },
    {
      key: '9',
      serialNumber: '9',
      inspectionType: 'SZ型',
      inspectionItem: '2101',
      inspectionRequirement: '外观',
      sampleQuantity: 6,
      inspectionAmount: 'OK',
      startTime: '2024-11-19 15:39:00',
      endTime: '2024-11-19 15:40:00',
    },
    {
      key: '6',
      serialNumber: '6',
      inspectionType: 'SZ型',
      inspectionItem: '2101',
      inspectionRequirement: '外观',
      sampleQuantity: 6,
      inspectionAmount: 'OK',
      startTime: '2024-11-19 15:39:00',
      endTime: '2024-11-19 15:40:00',
    },
    {
      key: '7',
      serialNumber: '7',
      inspectionType: 'SZ型',
      inspectionItem: '2101',
      inspectionRequirement: '外观',
      sampleQuantity: 6,
      inspectionAmount: 'OK',
      startTime: '2024-11-19 15:39:00',
      endTime: '2024-11-19 15:40:00',
    },
    {
      key: '8',
      serialNumber: '8',
      inspectionType: 'SZ型',
      inspectionItem: '2101',
      inspectionRequirement: '外观',
      sampleQuantity: 6,
      inspectionAmount: 'OK',
      startTime: '2024-11-19 15:39:00',
      endTime: '2024-11-19 15:40:00',
    },
    {
      key: '9',
      serialNumber: '9',
      inspectionType: 'SZ型',
      inspectionItem: '2101',
      inspectionRequirement: '外观',
      sampleQuantity: 6,
      inspectionAmount: 'OK',
      startTime: '2024-11-19 15:39:00',
      endTime: '2024-11-19 15:40:00',
    },
  ];

  const goDetailFn = item => {
    console.log(item);
  };
</script>

<style lang="less" scoped>
  .screen {
    background-color: #06144a;
    height: 100vh;
    overflow: hidden;
    padding-bottom: 24px;
  }

  .screen-header {
    display: flex;
    height: 136px;
    align-items: center;
    background-color: #071d56;
    font-size: 14px;
    padding: 0 20px 0 0;
    justify-content: space-between;

    &-selectBlock {
      min-width: 200px;
    }

    &-descBlock {
      width: 100%;
    }
  }

  .screen-content {
    color: #fff;
    padding: 30px;
    width: 100%;
    height: calc(100vh - 200px); /* 自适应高度 */
    display: flex;
    flex-direction: column;
    overflow: hidden;
    position: relative;
    box-shadow: 0 4px 10px rgb(82 131 223 / 66%);

    &-table {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      min-width: 100%; /* 确保表格宽度占满父容器 */
    }

    &-thead {
      display: flex;
      flex-wrap: nowrap;
      background: linear-gradient(180deg, rgb(92 180 249 / 0%) 0%, rgb(95 165 242 / 7%) 40.18%, rgb(78 140 231 / 18%) 72.73%, rgb(82 131 223 / 66%) 100%);
      overflow: hidden; /* 隐藏 thead 的滚动条 */
      div {
        height: 56px;
        line-height: 56px;
        text-align: center;
        font-weight: bold;
        flex-shrink: 0; /* 防止列宽被压缩 */
        min-width: 100px; /* 设置最小宽度 */
      }
    }

    &-tbody {
      flex: 1;
      overflow: auto; /* 允许横向和纵向滚动 */
      > div {
        display: flex;
        flex-wrap: nowrap;

        &:nth-child(odd) {
          background-color: #061036;
        }

        &:nth-child(even) {
          background-color: #081b47;
        }

        div {
          height: 40px;
          line-height: 40px;
          text-align: center;
          flex-shrink: 0; /* 防止列宽被压缩 */
          min-width: 100px; /* 设置最小宽度 */
        }
      }
    }
  }

  .machineNo {
    border: 1px solid #5ea0e2;
    padding: 10px 60px 10px 12px;
    margin-bottom: 20px;
    display: inline-block;
  }
</style>
