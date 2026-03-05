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
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { getCuttingsnList } from '/@/api/productionDeal/MQSNDataReport';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { getFormSchema, columns } from './config';
  import { useMessage } from '/@/hooks/web/useMessage';

  const { t } = useI18n();
  defineOptions({ name: 'productionDeal-basicReport-MQSNDataReport' });
  const { createMessage } = useMessage();

  const [Grid, gridApi] = useVbenVxeGrid({
    formOptions: {
      showCollapseButton: false,
      // 是否在字段值改变时提交表单
      submitOnChange: false,
      // 按下回车时是否提交表单
      submitOnEnter: true,
      commonConfig: {
        componentProps: {},
        labelClass: 'w-0',
      },
      wrapperClass: 'grid grid-cols-6 gap-4',
      schema: getFormSchema(),
      i18nConfig: {
        moduleCode: 'CuttingSnColumn',
        transferRange: ['placeholder'],
      },
    },
    gridOptions: {
      id: 'productionDeal-basicReport-MQSNDataReport-list',
      columns,
      api: getCuttingsnList,
      showIndexColumn: true,
      // virtualYConfig: {
      //   enabled: true,
      //   gt: 0,
      // },
      i18nConfig: {
        moduleCode: 'CuttingSnColumn',
      },
      rowConfig: {
        keyField: '_X_ROW_KEY',
      },

      beforeFetch: params => {
        params.serialNumbers = params.serialNumbers && params.serialNumbers.trim().split(/\s+/);
        if (params.serialNumbers && params.serialNumbers.length > 200) {
          createMessage.warning(t('dict.CommonCol.scanUp200SNs'));
          params.serialNumbers = null;
        }
        return params;
      },
      afterFetch: () => {
        gridApi.setFieldValue('serialNumbers', null);
      },
      scrollY: {
        enabled: false,
      },
      spanMethod(data) {
        const { row, $rowIndex: rowIndex, column, visibleData } = data;
        const spanFields = ['serialNumber', 'moldLayers', 'productCode'];
        const diffField = 'groupId';
        const cellValue = row[diffField];

        if (cellValue && spanFields.includes(column.field)) {
          const prevRow = visibleData[rowIndex - 1];

          // 如果上一行存在且相同，则合并到首行
          if (prevRow && prevRow[diffField] === cellValue) {
            return { rowspan: 0, colspan: 0 };
          }

          // 计算连续相同值的行数
          let countRowspan = 1;
          while (rowIndex + countRowspan < visibleData.length && visibleData[rowIndex + countRowspan][diffField] === cellValue) {
            countRowspan++;
          }

          if (countRowspan > 1) {
            return { rowspan: countRowspan, colspan: 1 };
          }
        }
      },
    },
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
