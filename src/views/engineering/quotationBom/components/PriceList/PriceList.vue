<script setup lang="ts">
  import { useVbenVxeGrid } from '/@/effects/plugins/vxe-table';
  import { Subtitle } from '/@/components/Subtitle';
  import { getColumn } from '/@/views/engineering/quotationBom/components/PriceList/config';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { usePermission } from '/@/hooks/web/usePermission';

  const { hasColumnP } = usePermission();

  const { t } = useI18n();

  const [Grid, gridApi] = useVbenVxeGrid({
    gridOptions: {
      id: 'engineering-quotationBom-makeQuotation-edit-process',
      columns: getColumn(hasColumnP),
      showIndexColumn: true,
      height: '',
      minHeight: 350,
      i18nConfig: {
        moduleCode: 'PartNumberApplyColumn',
      },
      pagerConfig: {
        enabled: false,
      },
      toolbarConfig: {
        enabled: false,
      },
      keyboardConfig: {
        isClip: true, // 是否开启复制粘贴
        isEdit: true, // 是否开启任意键进入编辑（功能键除外）
        isDel: true, // 是否开启删除键功能
        isEsc: true, // 是否开启Esc键关闭编辑功能
      },
    },
  });

  defineExpose({
    reloadData: gridApi.reloadData,
  });
</script>

<template>
  <Subtitle :title="t('common.costProportion')" />
  <Grid></Grid>
</template>
