<template>
  <div class="page-wrap">
    <bigTitle :title="t('views.dashboard.production.temperatureHumidityMonitor.abnormalFactory')" />
    <div class="row-wrap">
      <!-- <div v-for="(item, index) in state.abnormalList" :key="index" class="flex">
        <card :item="item" />
      </div> -->
      <a-row :gutter="[20, 20]">
        <a-col :xs="24" :sm="12" :md="8" :lg="8" :xl="6" :xxl="4" v-for="(item, index) in state.abnormalList"
          :key="index">
          <card :item="item" />
        </a-col>
      </a-row>
    </div>
    <bigTitle :title="t('views.dashboard.production.temperatureHumidityMonitor.normalFactory')" />
    <div class="row-wrap">
      <!-- <div v-for="(item, index) in state.normalList" :key="index">
        <card :item="item" :showImg="false" :classNames="['title-normal', 'content-normal']" />
      </div> -->
      <a-row :gutter="[20, 20]">
        <a-col :xs="24" :sm="12" :md="8" :lg="8" :xl="6" :xxl="4" v-for="(item, index) in state.normalList"
          :key="index">
          <card :item="item" :showImg="false" />
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, onMounted } from 'vue';
import bigTitle from './components/bigTitle.vue';
import card from './components/card.vue';
import { useI18n } from '/@/hooks/web/useI18n';
import { fetchEnvironment } from '/@/api/dashbord/production';

const { t } = useI18n();

const state = reactive({
  abnormalList: [] as any,
  normalList: [] as any,
});

state.abnormalList = [
  // {
  //   title: '平湖二厂',
  //   abnormalEquipment: 0,
  //   onLineEquipment: 30,
  //   offlineEquipment: 12,
  // },
  // {
  //   title: '平湖一厂',
  //   abnormalEquipment: 0,
  //   onLineEquipment: 30,
  //   offlineEquipment: 12,
  // },
  // {
  //   title: '平湖一厂',
  //   abnormalEquipment: 0,
  //   onLineEquipment: 30,
  //   offlineEquipment: 12,
  // },
  // {
  //   title: '平湖一厂',
  //   abnormalEquipment: 0,
  //   onLineEquipment: 10,
  //   offlineEquipment: 12,
  // },
  // {
  //   title: '平湖一厂',
  //   abnormalEquipment: 0,
  //   onLineEquipment: 30,
  //   offlineEquipment: 12,
  // },
  // {
  //   title: '平湖一厂',
  //   abnormalEquipment: 0,
  //   onLineEquipment: 10,
  //   offlineEquipment: 12,
  // },
];
state.normalList = [
  // {
  //   title: '公共区域',
  //   abnormalEquipment: 0,
  //   onLineEquipment: 30,
  //   offlineEquipment: 12,
  // },
  // {
  //   title: '平湖一厂',
  //   abnormalEquipment: 0,
  //   onLineEquipment: 30,
  //   offlineEquipment: 12,
  // },
  // {
  //   title: '平湖一厂',
  //   abnormalEquipment: 0,
  //   onLineEquipment: 30,
  //   offlineEquipment: 12,
  // },
  // {
  //   title: '平湖二厂',
  //   abnormalEquipment: 0,
  //   onLineEquipment: 10,
  //   offlineEquipment: 12,
  // },
  // {
  //   title: '平湖三厂',
  //   abnormalEquipment: 0,
  //   onLineEquipment: 30,
  //   offlineEquipment: 12,
  // },
  // {
  //   title: '平湖四厂',
  //   abnormalEquipment: 0,
  //   onLineEquipment: 10,
  //   offlineEquipment: 12,
  // },
];

const getEnvList = () => {
  fetchEnvironment()
    .then(res => {
      console.log(res);
      res?.data?.model.forEach(item => {
        if (item?.AbnormalDevices && item?.AbnormalDevices > 0) {
          state.abnormalList.push(item);
        } else {
          state.normalList.push(item);
        }
        // console.log(state.abnormalList, 'abnormalList')
        // console.log(state.normalList, 'normalList')
      });
    })
    .catch(err => {
      console.log(err);
    });
};

onMounted(() => {
  getEnvList();
});
</script>

<style lang="less" scoped>
.page-wrap {
  background-color: #fff;
  // width: 100%;
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;

  :deep(.ant-row) {
    width: 100%;
  }

  .row-wrap {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    margin: 15px 38px;
    width: calc(100% - 76px);
  }
}
</style>
