<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white p-10px">
        <Grid>
          <template #stackMaterialSnCode="{ row }">
            <div class="stackMaterialSnCode">{{ row.stackMaterialSnCode }}</div>
          </template>
        </Grid>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { getSNRelationreport } from '/@/api/productionDeal/SNRelationReport';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { getFormSchema, columns } from './config';

  const { t } = useI18n();
  defineOptions({ name: 'productionDeal-dieCut-SNRelationReport' });

  const { createMessage } = useMessage();

  const [Grid, { setFieldValue }] = useVbenVxeGrid({
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
        moduleCode: 'SnRelationReportColumn',
        transferRange: ['placeholder'],
      },
    },
    gridOptions: {
      id: 'productionDeal-dieCut-SNRelationReport-list',
      columns,
      api: getSNRelationreport,
      showIndexColumn: true,
      i18nConfig: {
        moduleCode: 'SnRelationReportColumn',
      },

      spanMethod(data) {
        const { row, $rowIndex: rowIndex, column, visibleData } = data;
        const spanFields = ['stackMaterialSnCode', 'documentNumber'];
        const diffField = 'documentNumber';
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
      beforeFetch: params => {
        params.snCodes = params.snCodes && params.snCodes.trim().split(/\s+/);
        if (params.snCodes && params.snCodes.length > 200) {
          createMessage.warning(t('dict.CommonCol.scanUp200SNs'));
          params.snCodes = null;
        }
        return params;
      },
      afterFetch: () => {
        setFieldValue('snCodes', null);
      },
    },
  });
</script>

<style lang="less" scoped>
  ::v-deep(textarea) {
    resize: none; /* 禁止拖动改变大小 */
  }

  ::v-deep(.stackMaterialSnCode) {
    white-space: pre-line;
  }

  .lydc-content-wrapper {
    position: absolute;
  }
</style>
