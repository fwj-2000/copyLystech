<!-- 出勤概况 -->
<template>
  <div class="attendance-compo flex column all-start">
    <div class="compo-body">
      <div class="title flex row ct-start">
        <span> {{ t('views.dashboard.operate.projectProgress') }}</span>
        <img :src="vectorSvg" style="margin: 0 0 1px 4px" />
      </div>
    </div>
    <div class="table-container">
      <a-table
        class="table-content"
        size="middle"
        v-bind="tableOptions"
        :columns="columns"
        :data-source="data"
        :rowClassName="(_, index) => (index % 2 === 0 ? 'table-striped' : null)" />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { useI18n } from '/@/hooks/web/useI18n';
  import vectorSvg from '/@/assets/svg/report/vector.svg';
  const { t } = useI18n();

  const tableOptions = {
    pagination: false,
    scroll: { x: true },
  };

  const sortOptions = {
    sortDirections: ['descend', 'ascend'],
    defaultSortOrder: 'descend',
    sorter: (a, b) => a.age - b.age,
  };

  const columns = [
    { title: '序号', dataIndex: 'index', ...sortOptions },
    { title: '产品线', dataIndex: 'productLine', ...sortOptions },
    { title: '项目', dataIndex: 'project', ...sortOptions },
    { title: '阶段', dataIndex: 'stage', ...sortOptions },
    { title: '需求', dataIndex: 'demand', ...sortOptions },
    { title: '已完成', dataIndex: 'done', ...sortOptions },
    { title: '未下单', dataIndex: 'noOrderPlaced', ...sortOptions },
  ];
  const data = [
    {
      index: '1',
      productLine: 'IPEF',
      project: 'IPEF',
      stage: 'IPEF',
      demand: 'D9X-1P',
      done: 'P2',
      noOrderPlaced: 20,
    },
    {
      index: '2',
      productLine: 'IPEF',
      project: 'IPEF',
      stage: 'IPEF',
      demand: 'D9X-1P',
      done: 'P2',
      noOrderPlaced: 20,
    },
    {
      index: '3',
      productLine: 'IPEF',
      project: 'IPEF',
      stage: 'IPEF',
      demand: 'D9X-1P',
      done: 'P2',
      noOrderPlaced: 20,
    },
  ];
</script>

<style lang="less" scoped>
  @titleHight: 44px;

  .attendance-compo {
    position: relative;
    width: 100%;
    height: @report-operate-compo-height;
    border-radius: 3px;
    background: #fff;
    box-shadow: 0 6px 15px 0 rgb(0 0 0 / 5%);

    .table-container {
      width: 100%;
      height: calc(100% - @titleHight);
      padding: 0 6px;

      :deep(.ant-table) {
        td,
        th {
          white-space: nowrap;
        }
      }
    }

    .compo-body {
      width: 100%;
      padding-left: 16px;

      .value {
        width: 100;

        .item {
          margin-right: 24px;

          &:last-child {
            margin: 0;
          }

          .label {
            color: #666;
            font-size: 14px;
          }

          .value {
            text-align: center;
            font-style: normal;
            font-weight: 700;
            font-size: 24px;
            color: #1a1a1a;
          }
        }
      }

      .title {
        width: 100%;
        color: #1a1a1a;
        font-size: 14px;
        font-style: normal;
        font-weight: 700;
        line-height: normal;
        height: @titleHight;

        img {
          width: 16px;
          height: 16px;
        }
      }
    }
  }
</style>
