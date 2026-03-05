<script lang="ts" setup>
  import { useI18n } from '/@/hooks/web/useI18n';
  import { getConfirmPriceList } from '/@/api/business/priceConfirmation';
  import { getColumnsView, getFormSchema } from '/@/views/business/priceConfirmation/CONFIG';
  import { reactive } from 'vue';
  import { usePopup } from '/@/components/Popup';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import AgreeDetailPopup from '/@/views/business/priceConfirmation/components/AgreeDetailPopup.vue';

  const [registerAgreeDetailPopup, { openPopup: openAgreeDetailPopup }] = usePopup();

  const { t } = useI18n();

  const state = reactive({
    waitCacheList: [],
  });

  const [Grid, { reload }] = useVbenVxeGrid({
    formOptions: {
      collapsed: true,
      showCollapseButton: true,
      // 是否在字段值改变时提交表单
      submitOnChange: false,
      // 按下回车时是否提交表单
      submitOnEnter: true,
      // fieldMappingTime: [['date', ['start', 'end']]],
      commonConfig: {
        componentProps: {},
        labelClass: 'w-0',
      },
      wrapperClass: 'grid grid-cols-5 gap-4',
      schema: getFormSchema(),
      // i18nConfig: {
      // 	moduleCode: 'QuotationRequirementsColumn',
      // 	transferRange: ['placeholder'],
      // },
    },
    gridOptions: {
      columns: getColumnsView(),
      api: getConfirmPriceList,
      showIndexColumn: true,
      rowConfig: {
        keyField: 'id',
      },
      i18nConfig: {
        moduleCode: 'QuotationRequirementsColumn',
      },
      beforeFetch: params => {
        params.dataFilter = 4;
        return params;
      },
      afterFetch: data => {
        state.waitCacheList = data.list;
      },
    },
  });

  function handleDetail(record) {
    openAgreeDetailPopup(true, { record, mode: 'view' });
  }
</script>

<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <Grid>
          <template #qrApplyCode="{ row }">
            <span class="table-a" @dblclick="handleDetail(row)">{{ row.qrApplyCode }}</span>
          </template>
        </Grid>
      </div>
    </div>
    <AgreeDetailPopup @register="registerAgreeDetailPopup" @reload="reload" @colse="reload" />
  </div>
</template>
