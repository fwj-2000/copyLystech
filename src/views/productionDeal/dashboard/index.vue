<template>
  <div class="screen" ref="cjDrawerRef">
    <div class="screen-container">
      <div class="screen-header">
        <selectCpm></selectCpm>
        <descBlock></descBlock>
        <statusBlock></statusBlock>
        <statusIcon></statusIcon>
      </div>
      <div class="navbar text-right">
        <a-button @click="toggleFullscreen" size="large"> {{ isFullscreen ? '退出全屏' : '全屏' }} </a-button>
      </div>
      <div class="screen-content">
        <div class="card-block">
          <div v-for="item in state.list" :class="`cursor-pointer card-item ${item.className}`" @click="goDetailFn(item)">
            <div class="card-item-header">
              <div class="card-item-header-left">
                <div> 产线/Line </div>
                <div> {{ item.line }} </div>
              </div>
              <div class="card-item-header-right">
                <div> 状态/status </div>
                <div> {{ item.status }} </div>
              </div>
            </div>
            <div class="card-item-content">
              <div class="card-item-content-item text-left">
                <div>{{ item.tr }}</div>
                <div class="content-text">投入</div>
                <div class="content-text">quty to input</div>
              </div>
              <div class="card-item-content-item text-center">
                <div>{{ item.cc }}</div>
                <div class="content-text">产出</div>
                <div class="content-text">quty to input</div>
              </div>
              <div class="card-item-content-item text-right">
                <div>{{ item.lv }}</div>
                <div class="content-text">良率</div>
                <div class="content-text">quty to input</div>
              </div>
            </div>
            <div class="card-item-footer">
              <template v-if="item.name">
                <div>{{ item.type }}</div>
                <div>{{ item.name }}</div>
                <div>送检时间：{{ item.date }}</div>
              </template>
              <template v-else> 暂无检测信息 </template>
            </div>
          </div>
        </div>
      </div>
      <div class="screen-footer"> </div>
    </div>
  </div>
</template>
<script setup lang="ts">
  import selectCpm from './component/selectCpm.vue';
  import descBlock from './component/descBlock.vue';
  import statusBlock from './component/statusBlock.vue';
  import statusIcon from './component/statusIcon.vue';

  import { ref, reactive } from 'vue';
  import { useFullscreen } from './hooks/useFullscreen';
  import { useRouter } from 'vue-router';

  const router = useRouter();
  const cjDrawerRef = ref<HTMLElement | null>(null);
  const { isFullscreen, toggleFullscreen } = useFullscreen(cjDrawerRef);

  const colorStutusMap = {
    0: 'defaultTheme',
    1: 'normalTheme',
    2: 'warningTheme',
    3: 'errorTheme',
  };
  const state = reactive({
    list: [
      {
        line: 'av-56656',
        status: '1',
        tr: '1',
        cc: '11',
        lv: '5%',
        type: '量产中',
        name: '尺寸收件',
        date: '2025年1月16日14:03:40',
        className: 'success-card',
      },
      {
        line: '10086',
        status: '2',
        tr: '1',
        cc: '1199',
        lv: '51%',
        type: '待送检',
        name: '包装外观',
        date: '2025年1月16日14:03:40',
        className: 'warning-card',
      },
      { line: '10086', status: '2', tr: '1', cc: '1199', lv: '51%', type: '待送检', name: '包装外观', date: '2025年1月16日14:03:40', className: 'normal-card' },
      {
        line: '10086',
        status: '2',
        tr: '1',
        cc: '1199',
        lv: '51%',
        type: '待送检',
        name: '包装外观',
        date: '2025年1月16日14:03:40',
        className: 'warning-card',
      },
      {
        line: '10086',
        status: '2',
        tr: '1',
        cc: '1199',
        lv: '51%',
        type: '待送检',
        name: '包装外观',
        date: '2025年1月16日14:03:40',
        className: 'warning-card',
      },
      {
        line: '10086',
        status: '2',
        tr: '1',
        cc: '1199',
        lv: '51%',
        type: '待送检',
        name: '包装外观',
        date: '2025年1月16日14:03:40',
        className: 'warning-card',
      },
      {
        line: '10086',
        status: '2',
        tr: '1',
        cc: '1199',
        lv: '51%',
        type: '待送检',
        name: '包装外观',
        date: '2025年1月16日14:03:40',
        className: 'warning-card',
      },
    ],
  });

  const goDetailFn = item => {
    console.log(item);
    router.push('/productionDeal/ipqcDashboardDetail');
  };
</script>

<style lang="less" scoped>
  .screen {
    background-color: #06144a;
    height: 100%;
    overflow: auto;

    &-container {
      min-width: 1200px;
    }
  }

  .screen-header {
    display: flex;
    height: 136px;
    align-items: center;
    background-color: #071d56;
    font-size: 14px;
    padding: 0 20px 0 0;

    &-selectBlock {
      min-width: 200px;
    }

    &-descBlock {
      width: 100%;
    }
  }

  .card-block {
    padding: 10px;
    flex: none !important;
    overflow: auto !important;
    display: grid !important;
    grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
    grid-gap: 20px 24px;
  }

  .number-class {
    font-family: Roboto, sans-serif;
    font-size: 14px;
    font-style: normal;
    font-weight: 700;
    letter-spacing: 0.8px;
  }

  .card-item {
    color: #fff;
    height: 280px;
    font-weight: 600;

    &:hover {
      transform: scale(1.01);
    }

    &-header {
      display: flex;
      justify-content: space-between;
      padding: 10px;
      height: 64px;
    }

    &-content {
      display: flex;
      height: 162px;
      flex: 1;
      justify-content: space-between;
      padding: 0 10px;
      padding-top: 20px;

      &-item {
        font-size: 28px;
        font-weight: 600;
      }
    }

    &-footer {
      padding: 0 10px;
      margin: 0 10px;
      display: flex;
      align-items: center;
      height: 54px;
      transform: translateY(-20px);
    }
  }

  .success-card {
    background: rgb(0 140 63 / 40%);
    color: #00d539;

    .card-item-header {
      color: #00d539;
      background-color: rgb(0 140 63 / 40%);
    }

    .card-item-footer {
      background: rgb(0 140 63 / 20%);
    }
  }

  .warning-card {
    background: rgb(255 166 0 / 30%);
    color: #ffa600;

    .card-item-header {
      color: #ffa600;
      background-color: rgb(255 166 0 / 30%) !important;
    }

    .card-item-footer {
      background: rgb(255 166 0 / 20%);
    }
  }

  .normal-card {
    background: rgb(255 255 255 / 25%) !important;
    color: #fff;

    .card-item-header {
      color: #fff;
      background-color: rgb(255 255 255 / 30%);
    }

    .card-item-footer {
      background: rgb(255 255 255 / 20%);
    }
  }

  .content-text {
    color: #fff;
    font-size: 14px;
  }
</style>
