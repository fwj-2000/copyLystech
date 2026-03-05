<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <a-tabs class="lydc-content-wrapper-tabs internal-tabs" style="height: 100%" destroyInactiveTabPane>
          <a-tab-pane :key="0" tab="待维护" style="height: 100%" class="lydc-tab-content">
            <Uncreated></Uncreated>
          </a-tab-pane>
          <a-tab-pane :key="1" tab="已维护" style="height: 100%" class="lydc-tab-content">
            <Createded></Createded>
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import Uncreated from './components/uncreated/index.vue';
  import Createded from './components/created/index.vue';

  defineOptions({ name: 'customerService-filings-demand' });
</script>
<style lang="less">
  .ant-tabs-content {
    height: 100%;

    & > div {
      height: 100%;
    }
  }

  .ant-tabs-nav-list {
    padding-left: 20px;
  }

  .internal-tabs {
    //   height: 100%;

    .ant-tabs-nav {
      margin-bottom: 2px;
    }

    //   .ant-tabs-nav-wrap {
    //     padding-left: 16px;
    //   }
    //   :deep(.ant-tabs-tabpane) {
    //     padding: 0;
    //     // overflow-x: hidden;
    //   }

    .lydc-basic-table-form-container {
      padding: 0 !important;

      .ant-form {
        padding: 10px 12px 0;
        margin-bottom: 12px;
        position: relative;

        &::after {
          background: @app-main-background;
          content: '';
          position: absolute;
          bottom: -10px;
          left: 0;
          width: 100%;
          height: 10px;
          // border-left: 16px solid transparent;
          // border-right: 16px solid transparent;
          // border-bottom: 16px solid #f2f2f2;
        }
      }

      .ant-table-wrapper {
        padding: 0 12px;
      }
    }

    //   .lydc-tab-content {
    //     height: 100%;

    //     & > div {
    //       height: 100%;
    //     }
    //     .lydc-content-wrapper-search-box {
    //       padding: 0 12px;
    //       margin-bottom: 10px;
    //       position: relative;
    //     }

    //     .lydc-basic-table {
    //       padding: 0 10px;
    //     }

    //     :deep(.lydc-basic-table-header) {
    //       padding: 0;
    //       height: 52px;
    //     }
    //   }

    .ant-btn {
      border-radius: 4px;
    }

    .lydc-input {
      border-radius: 4px;
    }
  }
</style>
