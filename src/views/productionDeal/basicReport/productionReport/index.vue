<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-search-box">
        <BasicForm @register="registerForm" @submit="getData" @reset="getData" />
      </div>

      <div class="lydc-content-dashboard-content bg-white">
        <Panel :title="t('dict.CommonCol.workOrdersView')" :showExpand="showWorkOrder" @expandClick="showWorkOrder = !showWorkOrder">
          <WorkOrderBlock v-show="showWorkOrder" :workOrderStatus="workOrderStatus" :orderQty="orderQty" @changeWorkOrderStatus="changeWorkOrderStatus" />

          <div class="chart-block mt-[20px]">
            <div class="chart-title">
              <div>{{ t('dict.CommonCol.workOrdersQty') }}</div>
              <div @click="showChart = !showChart" class="collapse-expand ml-[12px]">
                <span>{{ showChart ? t('component.form.fold') : t('common.expandAll') }}</span>
                <img :src="showChart ? collapse : expand" class="icon" alt="" />
              </div>
            </div>
            <div class="h-[220px]" v-show="showChart">
              <Chart :options="options" height="100%" style="height: 100%; width: 100%" />
            </div>
          </div>
        </Panel>

        <div class="table-block h-[700px]">
          <Grid>
            <template #toolbar-actions>
              <a-space>
                <a-button v-auth="'btn_download'" class="mr-12px" @click="handleExport">{{ t('common.batchExport') }}</a-button>
              </a-space>
            </template>
            <template #routeMap="{ row }">
              <div class="route-block">
                <div class="route-item" v-for="(item, index) in row.routeDataList" :key="index" @click="handleOpenRoughGrind(row.workOrderNo, item.nodeId)">
                  <div class="route-line">
                    <div class="line-content">{{ item.processName }}</div>
                    <div class="right-arrow" v-if="index !== row.routeDataList.length - 1"> → </div>
                  </div>
                  <div class="route-line">
                    <div class="line-content">
                      <div :class="['rate-block', item.completionRate === 0 ? 'gray-rate' : 'blue-rate']">
                        <div class="rate-left">{{ item.completionRate }}%</div>
                        <div class="rate-right">{{ t('dict.CommonCol.achievementRate') }}</div>
                      </div>
                    </div>
                    <div class="right-arrow" v-if="index !== row.routeDataList.length - 1"> → </div>
                  </div>
                  <div class="route-line">
                    <div class="line-content">
                      <!-- <div :class="['rate-block', index === 1 ? 'red-rate' : 'green-rate']"> -->
                      <div :class="['rate-block', item.goodRate === 0 ? 'gray-rate' : 'green-rate']">
                        <div class="rate-left">{{ item.goodRate }}%</div>
                        <div class="rate-right">{{ t('dict.CommonCol.yield') }}</div>
                      </div>
                    </div>
                    <div class="right-arrow" v-if="index !== row.routeDataList.length - 1"> → </div>
                  </div>
                </div>
              </div>
            </template>
          </Grid>
        </div>
      </div>
    </div>
    <RoughGrindModal @register="registerRoughGrind"> </RoughGrindModal>
    <ExportModal @register="registerExportModal" @export="exportAction" />
  </div>
</template>

<script setup lang="ts">
  import { onMounted, ref } from 'vue';
  import dayjs from 'dayjs';
  import { Chart } from '/@/components/Chart';
  import { useI18n } from '/@/hooks/web/useI18n';
  import Panel from './components/Panel.vue';
  import WorkOrderBlock from './components/WorkOrderBlock.vue';
  import RoughGrindModal from './components/RoughGrindModal.vue';
  import { BasicForm, useForm } from '/@/components/Form';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import ExportModal from '/@/components/ExportModal/index.vue';
  import { columns } from './components/config';
  import { downloadByUrl } from '/@/utils/file/download';
  import { getOverviewData, getProducereport, producereportExport } from '/@/api/productionDeal/productionReport';
  import { useModal } from '/@/components/Modal';
  import { useMessage } from '/@/hooks/web/useMessage';
  import collapse from '/@/assets/images/collapse.png';
  import expand from '/@/assets/images/expand.png';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { useBaseStore } from '/@/store/modules/base';

  defineOptions({ name: 'productionDeal-basicReport-productionReport' });
  const { t } = useI18n();

  const { createMessage } = useMessage();
  const { hasBtnP } = usePermission();
  const baseStore = useBaseStore();
  const options = ref({});
  const workOrderStatus = ref(['notStarted']);
  const orderQty = ref({
    notStartedQty: 0,
    inProgressQty: 0,
    completedQty: 0,
    delayQty: 0,
  });
  const qtyXAxisList = ref([]);
  const qtyYAxisList = ref([]);
  const showWorkOrder = ref(true);
  const showChart = ref(true);

  const [registerRoughGrind, { openModal: openRoughGrind }] = useModal();
  const [registerExportModal, { openModal: openExportModal, closeModal }] = useModal();

  const [registerForm, { getFieldsValue }] = useForm({
    baseColProps: { span: 4 },
    showActionButtonGroup: true,
    showAdvancedButton: false,
    compact: true,
    autoAdvancedLine: 1,
    actionColOptions: {
      span: 4,
    },
    schemas: [
      {
        field: 'pickerVal',
        label: '',
        component: 'DateRange',
        componentProps: {
          format: 'YYYY-MM-DD',
          placeholder: [t('dict.CommonCol.startTime'), t('dict.CommonCol.endTime')],
        },
        i18nField: 'workOrderDate',
        defaultValue: [dayjs().subtract(6, 'day').startOf('day').valueOf(), dayjs().startOf('day').valueOf()],
      },
      // 工单编号
      {
        field: 'workOrderNo',
        label: '',
        component: 'Input',
        componentProps: {
          placeholder: '工单编号',
        },
      },
      // 工单类型
      // {
      //   field: 'workOrderType',
      //   label: '',
      //   component: 'Input',
      //   componentProps: {
      //     placeholder: '工单类型',
      //   },
      //   i18nField: 'workOrderTypeName',
      // },
      {
        field: 'workOrderType',
        label: '',
        component: 'ApiSelect',
        componentProps: {
          placeholder: '工单类型',
          api: () => baseStore.getDictionaryData('WorkOrder.Type'),
          labelField: 'fullName',
          valueField: 'enCode',
          showSearch: true,
          filterOption: false,
        },
        i18nField: 'workOrderTypeName',
      },
      // 内部料号
      {
        field: 'productCode',
        label: '',
        component: 'Input',
        componentProps: {
          placeholder: '内部料号',
        },
      },
      {
        field: 'factoryMoldNo',
        label: '',
        component: 'Input',
        componentProps: {
          placeholder: '厂内模号',
        },
      },
    ],
    fieldMapToTime: [['pickerVal', ['startDate', 'endDate']]],
    i18nConfig: {
      moduleCode: 'ProduceReportColumn',
      transferRange: ['placeholder'],
    },
  });

  const [Grid, { reload, getFetchParams }] = useVbenVxeGrid({
    gridOptions: {
      id: 'productionDeal-basicReport-productionReport-list',
      columns,
      showIndexColumn: true,
      api: getProducereport,
      height: 700,
      pagerConfig: {
        autoHidden: false,
      },
      proxyConfig: {
        response: {
          total: 'data.pagination.Total',
        },
      },
      beforeFetch: params => {
        return {
          ...params,
          ...getFieldsValue(),
          type: getType(),
        };
      },
      i18nConfig: {
        moduleCode: 'ProduceReportColumn',
      },
    },
  });

  const handleOpenRoughGrind = (workOrderNo, nodeId) => {
    if (!hasBtnP('btn_detail')) return createMessage.warning(t('common.noViewingPermission'));
    openRoughGrind(true, { workOrderNo, nodeId });
  };

  const changeWorkOrderStatus = status => {
    let index = workOrderStatus.value.indexOf(status);
    if (index === -1) {
      workOrderStatus.value.push(status);
    } else {
      workOrderStatus.value.splice(index, 1);
    }
    getData();
  };

  const getType = () => {
    const typeObj = {
      notStarted: 0,
      inProgress: 1,
      completed: 2,
      delayed: 3,
    };
    let arr: number[] = [];
    if (workOrderStatus.value.length > 0) {
      workOrderStatus.value.forEach(item => {
        if (typeObj.hasOwnProperty(item)) {
          arr.push(typeObj[item]);
        }
      });
    }
    return arr.join(',');
  };

  const handleGetOverviewData = async () => {
    const { data } = await getOverviewData({
      ...getFieldsValue(),
      type: getType(),
    });
    const { completedQty, delayQty, inProgressQty, notStartedQty } = data;
    orderQty.value = { completedQty, delayQty, inProgressQty, notStartedQty };
    qtyXAxisList.value = data.qtyList.map(item => dayjs(item.date).format('MM/DD'));
    qtyYAxisList.value = data.qtyList.map(item => item.qty);
  };

  const getData = async () => {
    await handleGetOverviewData();
    // 加载表格数据
    initChart();
    reload();
  };

  const initChart = () => {
    options.value = {
      xAxis: {
        type: 'category',
        data: qtyXAxisList.value,
      },
      yAxis: {
        type: 'value',
        minInterval: 1,
        splitLine: {
          // y轴刻度线为虚线
          lineStyle: {
            type: 'dashed',
          },
        },
      },
      // 鼠标划上去提示
      tooltip: {
        trigger: 'axis',
      },
      series: [
        {
          name: '',
          data: qtyYAxisList.value,
          type: 'bar', // 柱状图
          itemStyle: {
            color: 'rgba(56, 116, 255)', // 柱子背景颜色
          },
          label: {
            show: true, // 显示标签
            position: 'top', // 标签位置为顶部
          },
        },
      ],
      grid: {
        left: '30',
        right: '24',
        bottom: '24',
        top: '24',
        containLabel: true,
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
          handleIcon:
            'image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAEISURBVHgB7ZfNDYJAEIWHpQCWnwI8kXDTSmxBO9BO6IAWtBL1RMLJO//cAWcxHhQTngkJMdmXbLKZfZlvH1xmiRaSgRrjOF4ZhhEJIdZ938vPc66deB2DILgj/SCwgpqmebFtWzqOQwx/O++6juq6pjRNK95vELggQJw09DxP8hpBhyZc40uR67qSLxghPVHw1rKsSZ+UUn3yNQGCwINRTFs57cAnQDD4pSRJoNrs4LmkwRqswRqswRqswX8I9n0fqs0C5mFPja2TvrZtCRWa+FqW5aSpaRo1ZZ4JEATmJPuiKCoF/5Zc1fI8pyzLKgYfkJ4/PWF4xA15ux01ef6KG0N36BNmMT0A12ZlPEm02ecAAAAASUVORK5CYII=',
          handleStyle: {
            borderWidth: 0,
          },
        },
      ],
    };
  };

  // 批量导出
  const handleExport = async () => {
    openExportModal(true, {
      listQuery: {
        ...(await getFetchParams()),
        ...getFieldsValue(),
        type: getType(),
      },
      exportOptions: columns,
      nameProps: 'title',
      idProps: 'field',
    });
  };
  const exportAction = query => {
    producereportExport(query).then(res => {
      if (!res.data.url) return;
      downloadByUrl({ url: res.data.url });
      closeModal();
    });
  };

  onMounted(async () => {
    setTimeout(() => {
      getData();
    }, 300);
  });
</script>

<style scoped lang="less">
  .lydc-content-dashboard-content {
    overflow: scroll;
    flex: 1;

    ::v-deep(.subtitle-container) {
      padding-bottom: 0;
    }

    .chart-block {
      .chart-title {
        line-height: 24px;
        font-size: 14px;
        margin-bottom: 10px;
        display: flex;
        align-items: center;

        .collapse-expand {
          display: flex;
          align-items: center;
          color: #ff7b00;
          font-size: 14px;
          line-height: 24px;
          cursor: pointer;

          .icon {
            width: 10px;
          }
        }
      }
    }

    .route-block {
      display: flex;
      padding-left: 16px;

      .route-item {
        margin-right: 6px;

        &:last-child {
          margin-right: 0;
        }

        .route-line {
          display: flex;
          align-items: center;
          min-height: 22px;

          .line-content {
            width: 100%;

            .rate-block {
              display: flex;
              width: 86px;
              border-radius: 38px;
              color: #fff;
              font-size: 12px;
              line-height: 18px;
              height: 18px;

              .rate-left {
                width: 34px;
                border-radius: 38px;
                text-align: center;
              }

              .rate-right {
                flex: 1;
                text-align: center;
              }
            }

            .blue-rate {
              background: rgb(24 144 255 / 10%);

              .rate-left {
                background: #1890ff;
              }

              .rate-right {
                color: #1890ff;
              }
            }

            .green-rate {
              background: rgb(82 196 26 / 10%);

              .rate-left {
                background: #52c41a;
              }

              .rate-right {
                color: #52c41a;
              }
            }

            .gray-rate {
              background: #e6e6e6;
              color: #1a1a1a;

              .rate-left {
                background: #e6e6e6;
              }
            }

            .red-rate {
              background: rgb(255 77 79 / 10%);

              .rate-left {
                background: #ff4d4f;
              }

              .rate-right {
                color: #ff4d4f;
              }
            }
          }
        }
      }
    }
  }
</style>
