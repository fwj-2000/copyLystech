<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-search-box">
        <BasicForm @register="registerForm" @submit="handleSearch" @reset="handleReset" />
      </div>

      <div class="lydc-content-dashboard-content">
        <div class="dashboard bg-white">
          <div class="dashboard-title">
            <Subtitle :title="t('common.baseinfo')" class="mr-[12px]"></Subtitle>
            <div @click="showGrid = !showGrid" class="collapse-expand">
              <span>{{ showGrid ? t('component.form.fold') : t('common.expandAll') }}</span>
              <img :src="showGrid ? collapse : expand" class="icon" alt="" />
            </div>
          </div>
          <!-- 表格v-show="showGrid" -->
          <Grid :class="[showGrid ? 'h-[350px]' : 'h-[226px]']"> </Grid>
        </div>
        <div class="dashboard mt-[20px] bg-white" v-loading="isLoading">
          <a-tabs class="lydc-content-wrapper-tabs bg-white h-full" v-model:activeKey="activeKey" @change="tabChange">
            <a-tab-pane key="0" :tab="t('dict.OEEDashboard')">
              <UtilizationAchievement :utilizationAchievementInfo="utilizationAchievementInfo" :activeKey="activeKey" />
            </a-tab-pane>
            <a-tab-pane key="1" :tab="t('dict.QuantityHourKanban')">
              <QuantityAchievement :quantityAchievementInfo="quantityAchievementInfo" :activeKey="activeKey" />
            </a-tab-pane>
            <a-tab-pane key="2" :tab="t('dict.CustomerComplaintDashboard')">
              <EfficiencyAchievement :customerComplaintList="customerComplaintList" :searchInfo="state" />
            </a-tab-pane>
          </a-tabs>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, ref, onBeforeUnmount, nextTick } from 'vue';
  import { useLocalStorage } from '@vueuse/core';
  import dayjs from 'dayjs';
  import Subtitle from '../abnormalReport/components/SubTitle.vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import QuantityAchievement from './components/QuantityAchievement.vue';
  import UtilizationAchievement from './components/UtilizationAchievement.vue';
  import EfficiencyAchievement from './components/EfficiencyAchievement.vue';
  import { ListByUserfactory } from '/@/api/productionPlan/processRoute';
  import {
    getProductionTableData,
    getMachinelCodeList,
    getQualityCustomerComplaintListApi,
    getProductionPlanBoardApi,
  } from '/@/api/qms/iqc/abnormalTimelinessMonitoring';
  import { BasicForm, useForm } from '/@/components/Form';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { columns, CLASSES_OPTIONS } from './components/config';
  import collapse from '/@/assets/images/collapse.png';
  import expand from '/@/assets/images/expand.png';
  import { getShiftType } from '/@/utils/time';
  import { isEmpty } from 'xe-utils';

  defineOptions({ name: 'qms-report-productionProgress' });
  const { t } = useI18n();

  const activeKey = ref('0');
  const isLoading = ref(false);
  const checkRowKeys = ref('');
  const state = ref<any>({
    innerMaterialCode: '',
    classes: '',
    workOrderNo: '',
    machineNo: '',
    planNumber: '',
    planQuantity: '',
    entDate: '',
    startTime: dayjs().startOf('day').valueOf(),
    endTime: dayjs().endOf('day').valueOf(),
    factoryArea: '',
  });
  // 数量工时达成看板
  const quantityAchievementInfo = ref({
    // 达成数量
    totalQuantityAchievement: 0,
    // 计划数量
    planQuantityAchievement: 0,
    // 数量达成率
    quantityAchievedList: {
      xAxisData: [],
      seriesData: [],
    },

    // 达成工时
    totalWorkTimeAchievement: 0,
    // 计划工时
    planWorkTimeAchievement: 0,
    // 工时达成率
    workTimeAchievedList: {
      xAxisData: [],
      seriesData: [],
    },
  });

  // 良率/稼动率达成看板/模切效率达成
  const utilizationAchievementInfo = ref({
    // 机台良率
    currentYieldRate: 0,
    // 目标良率
    targetYieldRate: 0,
    // 良率达成率
    yieldRateList: {
      xAxisData: [],
      seriesData: [],
    },

    // 当前稼动率
    currentUtilizationRate: 0,
    // 目标稼动率
    targetTieldRate: 0,
    // 稼动达成率
    utilizationRateList: {
      xAxisData: [],
      seriesData: [],
    },
    // 实际生产效率
    currentProductionEfficiencyRate: 0,
    // pcc标准效率
    pccStandardRate: 0,
    // 模切效率达成
    productionEfficiencyRateList: {
      xAxisData: [],
      seriesData: [],
    },
  });

  const showGrid = ref(false);
  const isInit = ref(true);
  const [registerForm, { setFieldsValue, getFieldsValue, updateSchema }] = useForm({
    baseColProps: { span: 4 },
    showActionButtonGroup: true,
    showAdvancedButton: true,
    compact: true,
    autoAdvancedLine: 1,
    // actionColOptions: {
    //   span: 4,
    // },
    schemas: [
      {
        field: 'factoryArea',
        label: '',
        component: 'ApiSelect',
        componentProps: {
          api: ListByUserfactory,
          placeholder: t('dict.TechInfoColumn.factoryAreaName'),
          showSearch: true,
          resultField: 'data',
          filterOption: (inputValue, path) => {
            return [path].some(option => option.label.includes(inputValue));
          },
          notFoundContent: null,
          immediate: true,
          labelField: 'Name',
          valueField: 'Code',
          defaultFirstOption: true,
          allowClear: false,
          onChange: e => {
            state.value.factoryArea = e;
            nextTick(async () => {
              gridApi.reload();
              const { data } = await getMachinelCodeList({ factoryArea: e });
              updateSchema({
                field: 'machineNo',
                componentProps: {
                  options: data,
                },
              });
            });
          },
        },
      },
      {
        field: 'pickerVal',
        label: '',
        component: 'DateRange',
        componentProps: {
          format: 'YYYY-MM-DD',
          placeholder: [t('dict.CommonCol.startTime'), t('dict.CommonCol.endTime')],
          // onChange: () => {
          //   getData();
          // },
        },
        // defaultValue: [dayjs().format('YYYY-MM-DD 00:00:00'), dayjs().format('YYYY-MM-DD 23:59:59')],
        defaultValue: [dayjs().startOf('day').valueOf(), dayjs().endOf('day').valueOf()],
      },
      // 机台
      {
        field: 'machineNo',
        label: '',
        component: 'Select',
        componentProps: {
          fieldNames: {
            value: 'machineNo',
            label: 'machineNo',
          },
          showSearch: true,
          apiSearch: {
            show: true,
            searchName: 'machineNo',
          },
          options: [],
          placeholder: t('dict.TechInfoColumn.machineNo'),
          onChange: e => {
            const { value } = useLocalStorage('qms-report-productionProgress', { machineNo: e });
            value.machineNo = e;
          },
        },
      },
      // 工号
      {
        field: 'workOrderNo',
        label: '',
        component: 'Input',
        componentProps: {
          placeholder: t('dict.EnterWorkOrderNumber'),
        },
      },
      // 班次
      {
        field: 'classes',
        component: 'Select',
        label: '',
        componentProps: {
          options: CLASSES_OPTIONS,
        },
      },
      // 料号
      {
        field: 'innerMaterialCode',
        label: '',
        component: 'Input',
        componentProps: {
          placeholder: t('dict.EnterPartNumber'),
        },
      },
    ],
    fieldMapToTime: [['pickerVal', ['startTime', 'endTime']]],
  });

  const [Grid, gridApi] = useVbenVxeGrid({
    gridEvents: {
      // currentChange
      radioChange: ({ row }) => {
        state.value.innerMaterialCode = row.innerMaterialCode;
        getProductionPlanBoard({
          machineNo: row.machineNo,
          workOrderNo: row.workOrderNo,
          innerMaterialCode: row.innerMaterialCode,
          planNumber: row.planNumber,
          planQuantity: row.planQuantity,
          entDate: row.entDate,
          classes: row.classes,
          startTime: dayjs(row.entDate),
          endTime: dayjs(row.entDate),
        });
        // 获取客诉质量数据
        getQualityCustomerComplaintList(row);
      },
    },
    gridOptions: {
      id: 'qms-report-productionProgress-list',
      columns,
      showIndexColumn: true,
      api: getProductionTableData,
      // radioConfig: {
      //   checkRowKey: checkRowKeys.value,
      // },
      toolbarConfig: {
        enabled: false,
      },
      rowConfig: {
        isCurrent: true,
        keyField: 'id',
      },
      scrollXConfig: {
        enabled: false,
      },
      scrollYConfig: {
        enabled: false,
      },
      pagerConfig: {
        autoHidden: false,
      },
      editConfig: {
        mode: 'cell',
      },
      mouseConfig: {
        selected: false,
        area: false,
      },
      beforeFetch: params => {
        const param = {
          ...params,
          ...getFieldsValue(),
        };
        param.factoryArea = state.value.factoryArea;
        return param;
      },
      afterFetch: data => {
        if (data.list?.length) {
          // 选中第一行
          const row = data.list[0];
          gridApi.grid.setCurrentRow(row);
          gridApi.grid.setRadioRow(row);

          state.value.innerMaterialCode = row.innerMaterialCode;
          state.value.workOrderNo = row.workOrderNo;
          state.value.machineNo = row.machineNo;
          state.value.planNumber = row.planNumber;
          state.value.planQuantity = row.planQuantity;
          state.value.entDate = row.entDate;
          state.value.classes = row.classes;

          // 获取数量/工时达成看板、良率/稼动率达成看板/模切效率达成数据
          const _params = {
            ...state.value,
            // startTime: row.endDate ? dayjs(row.endDate).format('YYYY-MM-DD') : '',
            // endTime: row.endDate ? dayjs(row.endDate).format('YYYY-MM-DD') : '',
          };
          if (row.endData) {
            _params.startTime = dayjs(row.endData);
            _params.endTime = dayjs(row.endData);
          }
          getProductionPlanBoard(_params);
          // 获取客诉质量数据
          getQualityCustomerComplaintList(row);
          // isInit.value = false;
        }
      },
    },
  });

  function handleSearch(values) {
    state.value = {
      ...values,
      startTime: values.startTime ? dayjs(values.startTime).startOf('day').valueOf() : '',
      endTime: values.endTime ? dayjs(values.endTime).endOf('day').valueOf() : '',
    };
    gridApi.query();
    // if (isInit.value) {
    //   gridApi.query();
    // } else {
    //   getData();
    // }
  }

  function handleReset() {
    // isInit.value = false;
    const factoryArea = state.value.factoryArea;
    setFieldsValue({
      factoryArea: factoryArea,
    });
    state.value = {
      innerMaterialCode: '',
      classes: '',
      workOrderNo: '',
      machineNo: '',
      startTime: dayjs().startOf('day').valueOf(),
      endTime: dayjs().endOf('day').valueOf(),
      factoryArea: factoryArea,
    };
    gridApi.grid.clearRadioRow();
    gridApi.grid.clearCurrentRow();
    getData();
  }

  const customerComplaintList = ref([]);
  const getQualityCustomerComplaintList = async (row: any = {}) => {
    const endTime = row.endTime || row.entDate || state.value.endTime || '';
    const _params = {
      ...state.value,
      startTime: dayjs(endTime).subtract(1, 'day').valueOf(),
      endTime: dayjs(endTime).subtract(90, 'day').valueOf(),
    };
    const res = await getQualityCustomerComplaintListApi(_params);
    customerComplaintList.value = res.data;
  };

  const getProductionPlanBoard = async (parmas = {}) => {
    const _params = {
      ...state.value,
      ...parmas,
    };
    isLoading.value = true;

    try {
      const res = await getProductionPlanBoardApi(_params);
      const {
        // 数量达成看板
        totalQuantityAchievement,
        planQuantityAchievement,
        quantityAchievedList,

        // 工时达成
        totalWorkTimeAchievement,
        planWorkTimeAchievement,
        workTimeAchievedList,

        // 良率看板
        currentYieldRate,
        targetYieldRate,
        yieldRateList,

        // 稼动率看板
        currentUtilizationRate,
        targetTieldRate,
        utilizationRateList,

        // 效率达成看板
        currentProductionEfficiencyRate,
        pccStandardRate,
        productionEfficiencyRateList,
      } = res.data;

      quantityAchievementInfo.value = {
        totalQuantityAchievement,
        planQuantityAchievement,
        quantityAchievedList: {
          xAxisData: quantityAchievedList.map(item => item.time),
          seriesData: quantityAchievedList.map(item => item.quantityAchievement),
        },

        totalWorkTimeAchievement,
        planWorkTimeAchievement,
        workTimeAchievedList: {
          xAxisData: workTimeAchievedList.map(item => item.time),
          seriesData: workTimeAchievedList.map(item => item.workTimeAchievement),
        },
      };

      utilizationAchievementInfo.value = {
        currentYieldRate,
        targetYieldRate,
        yieldRateList: {
          xAxisData: yieldRateList.map(item => item.time),
          seriesData: yieldRateList.map(item => item.yieldRate),
        },

        currentUtilizationRate,
        targetTieldRate,
        utilizationRateList: {
          xAxisData: utilizationRateList.map(item => item.time),
          seriesData: utilizationRateList.map(item => item.utilizationRate),
        },

        currentProductionEfficiencyRate,
        pccStandardRate,
        productionEfficiencyRateList: {
          xAxisData: productionEfficiencyRateList.map(item => item.time),
          seriesData: productionEfficiencyRateList.map(item => item.productionEfficiencyRate),
        },
      };
    } catch (err) {
      console.log(err);
    } finally {
      isLoading.value = false;
    }
  };

  const getData = () => {
    // 加载表格数据
    // gridApi.reload();
    gridApi.query();
    // // 获取数量/工时达成看板、良率/稼动率达成看板/模切效率达成数据
    // getProductionPlanBoard();
    // // 获取客诉质量数据
    // getQualityCustomerComplaintList();
  };

  const inactivityTimer = ref<ReturnType<typeof setTimeout>>();
  const resetTimer = () => {
    clearTimeout(inactivityTimer.value); // 清除之前的定时器
    inactivityTimer.value = setTimeout(() => {
      activeKey.value = '0';
    }, 5 * 60 * 1000);
  };

  const tabChange = () => {
    if (activeKey.value === '2') {
      nextTick(() => {
        const dashboardContent = document.querySelector('.lydc-content-dashboard-content');
        if (dashboardContent) {
          const efficiencyEle = dashboardContent.querySelector('.efficiency-achievement');
          if (efficiencyEle) {
            efficiencyEle.addEventListener('scroll', resetTimer);
          }
        }
      });
    }
  };

  const timer = ref<ReturnType<typeof setTimeout>>();
  onMounted(async () => {
    const { value: storeData } = useLocalStorage('qms-report-productionProgress', { machineNo: '' });
    // // state.value.startTime = dayjs().startOf('day').valueOf();
    // // state.value.endTime = dayjs().endOf('day').valueOf();
    state.value.machineNo = storeData.machineNo;
    state.value.classes = getShiftType();
    setFieldsValue({
      classes: state.value.classes,
      machineNo: state.value.machineNo,
    });
    // setTimeout(() => {
    //   gridApi.query();
    // }, 300);
    // 10分钟获取一下数据
    timer.value = setInterval(() => {
      getData();
    }, 10 * 60 * 1000);

    // 五分钟没有操作则返回主界面
    document.addEventListener('mousemove', resetTimer);
    document.addEventListener('keypress', resetTimer);
    const ele = document.getElementsByClassName('lydc-content-dashboard-content')[0];
    if (ele) {
      ele.addEventListener('scroll', resetTimer);
      // 页面一进来滚动到最底下
      // ele.scrollTo(0, ele.scrollHeight);
    }
    document.addEventListener('click', resetTimer);
  });

  const cleanupListeners = () => {
    // 清除定时器
    clearTimeout(inactivityTimer.value);
    clearTimeout(timer.value);
    // 清除监听事件
    document.removeEventListener('mousemove', resetTimer);
    document.removeEventListener('keypress', resetTimer);

    const dashboardContent = document.getElementsByClassName('lydc-content-dashboard-content')[0];
    if (dashboardContent) {
      dashboardContent.removeEventListener('scroll', resetTimer);

      const efficiencyEle = dashboardContent.querySelector('.efficiency-achievement');
      if (efficiencyEle) {
        efficiencyEle.removeEventListener('scroll', resetTimer);
      }
    }

    document.removeEventListener('click', resetTimer);
  };

  onBeforeUnmount(() => {
    cleanupListeners();
  });
</script>

<style scoped lang="less">
  .lydc-content-dashboard-content {
    overflow: scroll;
    flex: 1;

    ::v-deep(.subtitle-container) {
      padding-bottom: 0;
    }

    .dashboard {
      padding: 0 16px 16px;

      .dashboard-title {
        display: flex;
        align-items: center;
        padding-top: 16px;

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
  }
</style>
