<template>
  <div class="detail-content">
    <BasicForm @register="registerForm" @reset="resetData" @submit="queryData" />
    <div v-for="(item, index) in state.factoryList" :key="index">
      <bigTitle :title="`${item.Address}-${item.Line}`" />
      <!-- <chart :options="newChartOptions" height="257px" /> -->
      <CustomChart :options="item" />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { reactive, nextTick, onMounted } from 'vue';
  import bigTitle from './bigTitle.vue';
  // import chart from '/@/components/Chart/src/Chart.vue';
  import CustomChart from './CustomChart.vue';
  // import { chartOptions } from './config';
  import { BasicForm, useForm } from '/@/components/Form';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useRoute } from 'vue-router';
  // import { getVisualDevList } from '/@/api/onlineDev/visualDev';
  import dayjs from 'dayjs';
  import { fetchEnvironment, fetchEnvironmentTrend } from '/@/api/dashbord/production';

  const { t } = useI18n();
  const route = useRoute();

  interface State {
    factoryEumn: Array<any>;
    formData: any;
    factoryList: Array<any>;
  }
  // const newChartOptions = reactive(chartOptions);
  const state = reactive<State>({
    factoryEumn: [],
    formData: {
      factory: '',
      startTime: 0,
      endTime: 0,
    },
    factoryList: [],
  });
  const [registerForm, { updateSchema, getFieldsValue, setFieldsValue, resetFields }] = useForm({
    schemas: [
      {
        field: 'orgCode',
        component: 'Select',
        label: t('views.dashboard.production.temperatureHumidityMonitor.factory'),
        componentProps: {
          placeholder: '请选择',
          options: [],
        },
      },
      {
        field: 'pickerVal',
        label: t('views.dashboard.production.temperatureHumidityMonitor.selectTime'),
        component: 'DateRange',
        defaultValue: [dayjs().tz().subtract(1, 'day').startOf('d'), dayjs().tz()],
        colProps: {
          // style: {
          //   'min-width': '330px'
          // }
        },
      },
    ],
    baseColProps: { span: 6 },
    showActionButtonGroup: true,
    showAdvancedButton: true,
    compact: true,
    labelWidth: 70,
    fieldMapToTime: [['pickerVal', ['startTime', 'endTime']]],
  });
  // 重置方法
  const resetData = () => {
    state.formData = {
      ...getFieldsValue(),
      orgCode: route.query?.orgCode,
    };
    console.log(state.formData, 'xxx');
    setFieldsValue(state.formData);
    queryData(state.formData);
  };
  // 查询方法
  const queryData = async (val): Promise<void> => {
    console.log(state, val);
    const params = {
      ...val,
      startTime: val.startTime ? dayjs(val.startTime).tz().valueOf() : '',
      endTime: val.endTime ? dayjs(val.endTime).tz().valueOf() : '',
    };
    const res = await fetchEnvironmentTrend(params);
    console.log(res, 212);
    // let { factoryList } = toRefs(state);
    state.factoryList = res?.data?.model || [];
  };

  const init = async () => {
    resetFields();
    const res = await fetchEnvironment();
    nextTick(() => {
      res?.data && res?.data?.model.length
        ? (state.factoryEumn = res?.data?.model.map(item => {
            return {
              ...item,
              id: item.Factory,
              fullName: item.Factory,
            };
          }))
        : (state.factoryEumn = []);

      updateSchema([
        {
          field: 'orgCode',
          componentProps: {
            placeholder: '请选择',
            options: state.factoryEumn,
          },
        },
      ]);
    });
    state.formData = {
      ...getFieldsValue(),
      orgCode: route.query?.orgCode,
    };
    console.log(state.formData, 'xxx');
    setFieldsValue(state.formData);
    queryData(state.formData);
  };

  onMounted(() => {
    init();
  });
</script>

<style lang="less" scoped>
  .detail-content {
    padding-top: 26px;
    background-color: #fff;
    height: 100%;
    overflow: hidden auto;
  }
</style>
