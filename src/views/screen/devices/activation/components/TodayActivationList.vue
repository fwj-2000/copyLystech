<template>
  <div class="screen-content-table" v-loading="isLoading">
    <div class="screen-content-header pl-12px">
      <lydc-date-range v-model:value="state.searchInfo.timeRange" format="YYYY-MM-DD" allowClear :placeholder="['开始时间', '结束时间']" />
      <LydcSelect
        v-model:value="state.searchInfo.brand"
        :fieldNames="{ options: 'options1' }"
        placeholder="请选择"
        showSearch
        allowClear
        class="!w-160px m-l-16px"
        :options="state.brandList" />
      <!-- <LydcInput
        class="m-l-16px"
        suffixIcon="icon-ym icon-ym-search"
        v-model:value="state.searchInfo.brand"
        @pressEnter="handleSearch"
        allow-clear
        placeholder="请输入品牌"
        style="width: 260px" /> -->

      <a-button class="ml-12px" @click="handleSearch">查询</a-button>
      <a-button class="ml-12px" @click="handleReset">重置</a-button>
    </div>
    <!-- 表头 -->
    <div>
      <!-- 导出 -->
      <a-button class="ml-12px" @click="handleExport">导出</a-button>
    </div>
    <div class="screen-content-thead" ref="theadRef">
      <div v-for="item in columns" :key="item.dataIndex" :style="{ flex: item.width ? 'none' : 1, width: item.width, paddingRight: '20px' }">
        {{ item.title }}
      </div>
    </div>
    <!-- 内容区域 -->
    <div class="screen-content-tbody" ref="tbodyRef" @scroll="syncScroll" v-if="state.tableData.length">
      <div v-for="(row, rowIndex) in state.tableData" :key="row.key" :class="{ 'active-row': equipmentCode && row.equipmentCode === equipmentCode }">
        <div v-for="col in columns" :key="col.dataIndex" :style="{ flex: col.width ? 'none' : 1, width: col.width }">
          <span v-if="col.dataIndex === 'status'">
            {{ state.equipmentStatusDataMap[row[col.dataIndex]] }}
          </span>
          <span v-else>
            {{ row[col.dataIndex] }}
          </span>
        </div>
      </div>
    </div>
    <ScreenNoData v-else class="w-full h-full" />
  </div>
  <ExportModal @register="registerExportModal" />
</template>
<script setup lang="ts">
  import { ref, reactive, Ref, onMounted, watch } from 'vue';
  import { useDevices } from './hooks/useDevices';
  import { useModal } from '/@/components/Modal';
  import ExportModal from '/@/components/ExportModal/index.vue';
  import { exportOperationrateExcel, getBrandlist, getOperationratelist } from '/@/api/equipment/operationrate';
  import ScreenNoData from './screenNoData.vue';
  import { downloadByUrl } from '/@/utils/file/download';
  import CategoryChart from '/@/views/dashboard/production/downtimeAnalysis/components/categoryChart.vue';

  interface ISearchInfo {
    timeRange?: string[];
    brand?: string;
  }

  interface Istate {
    tableData: any[];
    equipmentStatusDataMap: { [key: string]: string };
    searchInfo: ISearchInfo;
    brandList: any[];
  }
  interface IColumn {
    title: string;
    dataIndex: string;
    key: string;
    width: string;
  }

  interface IActivationData {
    id: number;
  }

  const emit = defineEmits(['onDateChange']);

  const props = withDefaults(
    defineProps<{
      data: IActivationData[];
      factoryAreaId: string;
      category: string;
    }>(),
    {
      data: () => [],
      factoryAreaId: '',
      category: '',
    },
  );

  const state = reactive<Istate>({
    tableData: [],
    brandList: [],
    equipmentStatusDataMap: {},
    searchInfo: {},
  });
  const isLoading = ref<Boolean>(false);
  const equipmentCode = ref<string>(''); // 设备编号
  const theadRef = ref<HTMLElement | null>(null);
  const tbodyRef = ref<HTMLElement | null>(null);
  const [registerExportModal, { openModal: openExportModal }] = useModal();

  const columns: IColumn[] = [
    { title: '设备品牌', dataIndex: 'brand', key: 'brand', width: '' },
    { title: '设备编号', dataIndex: 'equipmentCode', key: 'equipmentCode', width: '' },
    { title: '当前状态', dataIndex: 'status', key: 'status', width: '' },
    { title: '固资状态', dataIndex: 'useStatus', key: 'useStatus', width: '' },
    { title: '稼动率', dataIndex: 'operationRate', key: 'operationRate', width: '120px' },
    { title: '运行时间', dataIndex: 'runningTimeStr', key: 'runningTime', width: '' },
    // { title: '空闲时间', dataIndex: 'freeTimeStr', key: 'freeTime', width: '' },
    { title: '理论时间', dataIndex: 'theoreticalTimeStr', key: 'theoreticalTime', width: '' },
  ];

  watch([() => props.factoryAreaId, () => props.category], () => {
    if (state.searchInfo.timeRange?.length) {
      getOperationratelistFn();
    } else {
      init();
    }
  });
  watch(
    () => props.data,
    val => {
      if (!state.searchInfo.timeRange?.length) {
        state.searchInfo.brand = '';
        init(val);
      }
    },
  );

  // 同步滚动函数
  const syncScroll: (e: Event) => void = () => {
    if (theadRef.value && tbodyRef.value) {
      theadRef.value.scrollLeft = tbodyRef.value.scrollLeft;
    }
  };
  function handleSearch(): void {
    getOperationratelistFn();
  }

  function handleReset(): void {
    state.searchInfo = {
      timeRange: [],
      brand: '',
    };
    getOperationratelistFn();
  }
  async function handleExport(): Promise<void> {
    isLoading.value = true;
    try {
      const { data } = await exportOperationrateExcel({
        category: props.category,
        factoryAreaId: props.factoryAreaId,
        startTime: state.searchInfo?.timeRange?.[0],
        endTime: state.searchInfo?.timeRange?.[1],
      });
      const { url, name: fileName } = data;
      downloadByUrl({ url, fileName });
    } catch (error) {
    } finally {
      isLoading.value = false;
    }
  }

  async function getOperationratelistFn(): Promise<void> {
    try {
      isLoading.value = true;
      const { code, data } = await getOperationratelist({
        factoryAreaId: props.factoryAreaId,
        startTime: state.searchInfo?.timeRange?.[0],
        endTime: state.searchInfo?.timeRange?.[1],
        brand: state.searchInfo.brand,
        category: props.category,
      });
      if (code === 200) {
        const { operationRateList, timeOperationRateList } = data;
        init(operationRateList, true);
        emit('onDateChange', timeOperationRateList);
      }
    } finally {
      isLoading.value = false;
    }
  }

  async function init(data: any[] = [], isSearch: boolean = false): Promise<void> {
    const { getEquipmentStatusMap } = await useDevices();
    const equipmentStatusData: any = await getEquipmentStatusMap('equipmentStatus');
    state.equipmentStatusDataMap = equipmentStatusData.equipmentStatusDataMap;
    if (isSearch) {
      state.tableData = data;
    } else {
      state.tableData = props.data;
    }
  }

  function setEquipmentCode(key: string = ''): void {
    equipmentCode.value = key;
    console.log(equipmentCode.value, '点击了设备编号');
  }
  async function getBrandlistFn() {
    const { code, data } = await getBrandlist({});
    if (code === 200) {
      state.brandList = data.map((item: any) => ({
        fullName: item,
        id: item,
      }));
    }
  }
  onMounted(async () => {
    getBrandlistFn();
    init();
  });
  defineExpose({
    setEquipmentCode,
  });
</script>

<style lang="less" scoped>
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
        background: url('/@/assets/images/screen/screen-line.png') no-repeat;
        background-size: 100% 2%;
        background-position: center bottom;

        div {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 40px;
          padding: 10px 0;
          text-align: center;
          flex-shrink: 0; /* 防止列宽被压缩 */
          min-width: 100px; /* 设置最小宽度 */
        }
      }
    }

    .active-row {
      background: rgb(255 255 255 / 30%) !important;
    }
  }
</style>
