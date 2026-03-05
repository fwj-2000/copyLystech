<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white p-10px">
        <Grid> </Grid>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { onMounted } from 'vue';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { getreport } from '/@/api/productionDeal/productionWorkReport';
  import { alllistbyfactory } from '/@/api/engineering/mould';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { getFormSchema, columns } from './config';
  import { useMessage } from '/@/hooks/web/useMessage';

  const { t } = useI18n();
  defineOptions({ name: 'productionDeal-basicReport-productionWorkReport' });
  const { createMessage } = useMessage();

  const [Grid, gridApi] = useVbenVxeGrid({
    formOptions: {
      collapsed: true,
      showCollapseButton: false,
      // 是否在字段值改变时提交表单
      submitOnChange: false,
      // 按下回车时是否提交表单
      submitOnEnter: true,
      commonConfig: {
        componentProps: {},
        labelClass: 'w-0',
      },
      wrapperClass: 'grid grid-cols-5 gap-4',
      schema: getFormSchema(),
      // i18nConfig: {
      //   moduleCode: 'CuttingSnColumn',
      //   transferRange: ['placeholder'],
      // },
    },
    gridOptions: {
      id: 'productionDeal-basicReport-productionWorkReport-list',
      columns,
      api: getreport,
      showIndexColumn: true,
      // i18nConfig: {
      //   moduleCode: 'CuttingSnColumn',
      // },
      rowConfig: {
        keyField: '_X_ROW_KEY',
      },
      beforeFetch: params => {
        if (params.creatorTime) {
          params.startTime = params.creatorTime[0];
          params.endTime = params.creatorTime[1];
          delete params.creatorTime;
        }
        return params;
      },
    },
  });

  const getProcessList = async val => {
    const { data } = await alllistbyfactory({ factoryArea: val });
    gridApi.updateSchema([
      {
        fieldName: 'processName',
        componentProps: {
          options: data,
        },
      },
    ]);
  };

  onMounted(() => {
    // 切换工厂获取执行工序下拉数据
    gridApi.updateSchema([
      {
        fieldName: 'factory',
        componentProps: {
          onChange: async e => {
            getProcessList(e);
          },
        },
      },
    ]);
  });
</script>

<style lang="less" scoped>
  ::v-deep(textarea) {
    resize: none; /* 禁止拖动改变大小 */
  }

  .lydc-content-wrapper {
    position: absolute;
  }

  .btn-wrapper {
    margin-top: 16px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }

  .left-btn {
    display: flex;

    button {
      margin-right: 16px;
    }

    // 选择第二个按钮
    button:nth-child(2) {
      border: #ff7b00 solid 1px;
      color: #ff7b00;
    }
  }
</style>
