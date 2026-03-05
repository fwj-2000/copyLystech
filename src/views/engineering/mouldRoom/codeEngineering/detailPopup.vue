<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    :showOkBtn="false"
    :okText="t('common.submitText')"
    :title="t('common.detailText')"
    destroyOnClose
    class="full-popup">
    <ScrollContainer>
      <div class="pop-item">
        <subtitle :title="t('common.baseinfo')"></subtitle>
        <BasicForm @register="registerForm"></BasicForm>
      </div>
      <div class="pop-item">
        <subtitle :title="t('dict.ElectrodeBomColumn')"></subtitle>
        <Grid style="height: 300px"> </Grid>
      </div>
    </ScrollContainer>
  </BasicPopup>
</template>
<script lang="ts" setup>
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { BasicForm, useForm } from '/@/components/Form';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { baseFrorm, electrodebomColumn } from './config';
  import { ScrollContainer } from '/@/components/Container';
  import { Subtitle } from '/@/components/Subtitle';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';

  const { t } = useI18n();
  const emits = defineEmits(['register', 'reload']);

  const [Grid, gridApi] = useVbenVxeGrid({
    gridOptions: {
      id: 'engineering-mouldRoom-codeEngineering-electrodebomList',
      columns: electrodebomColumn,
      pagerConfig: {
        autoHidden: true,
      },
      toolbarConfig: {
        enabled: false,
      },
      rowConfig: {
        keyField: '_X_ROW_KEY',
      },
      i18nConfig: {
        moduleCode: 'MoldProgramColumn',
      },
    },
  });

  const [registerForm, { setFieldsValue }] = useForm({
    layout: 'vertical',
    labelWidth: 220,
    schemas: baseFrorm,
    baseColProps: {
      span: 6,
    },
    i18nConfig: {
      moduleCode: 'MoldProgramColumn',
      transferRange: ['placeholder', 'label'],
    },
  });

  const [registerPopup] = usePopupInner(init);

  async function init(data) {
    setFieldsValue({
      bomVersion: data.bomVersion,
      partNo: data.partNo,
      partName: data.partName,
      quantity: data.quantity,
      category: data.category,
      material: data.material,
      remark: data.remark,
      creatorUserName: data.creatorUserName,
      routeMap: data.routeMap,
    });
    gridApi.grid.reloadData(data.bomList);
  }
</script>

<style lang="less" scoped>
  .pop-item {
    border-bottom: 10px solid #f0f0f0;
    padding: 20px;
  }
</style>
