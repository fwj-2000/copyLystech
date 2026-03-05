<script lang="ts" setup>
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { getColumn, getFormConfig } from '/@/views/engineering/basicInformation/alternativeView/config';
  import { getMainProcessOptions, mainProcessOptions } from '/@/views/engineering/basicInformation/alternative/config';
  import { getList } from '/@/api/engineering/alternative';
  import { useModal } from '/@/components/Modal';
  import RecordModal from '/@/views/engineering/basicInformation/alternative/components/recordModal.vue';
  import { useI18n } from '/@/hooks/web/useI18n';

  const { t } = useI18n();

  const [Grid, gridApi] = useVbenVxeGrid({
    formOptions: {
      collapsed: true,
      // 是否在字段值改变时提交表单
      submitOnChange: false,
      showCollapseButton: false,
      // 按下回车时是否提交表单
      submitOnEnter: true,
      commonConfig: {
        componentProps: {},
        labelClass: 'w-0',
      },
      wrapperClass: 'grid grid-cols-6 gap-4',
      schema: getFormConfig(),
      i18nConfig: {
        moduleCode: 'AltMaterialColumn',
        transferRange: ['placeholder'],
      },
    },
    gridOptions: {
      columns: getColumn(),
      api: getTableData,
      beforeFetch: (params: any) => {
        params.status = 3;
        return params;
      },
      pagerConfig: {
        autoHidden: false,
      },
      i18nConfig: {
        moduleCode: 'AltMaterialColumn',
      },
    },
  });

  async function getTableData(params: any) {
    if (mainProcessOptions.length === 0) {
      await getMainProcessOptions();
    }

    return getList({ ...params }).then(res => {
      const list = Array.isArray(res?.data?.list) ? res.data.list : [];
      if (list.length > 0) {
        list.forEach(item => {
          item.mainProcessName = mainProcessOptions.find(item => item.value === item.value)?.label || '';
        });
      }
      return res;
    });
  }

  const [registerRecordModal, { openModal: openRecordModal }] = useModal();
  /** 变更记录 */
  function handleShowChangeRecord(row: any) {
    openRecordModal(true, {
      id: row.id,
    });
  }
</script>

<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <Grid>
          <template #changeRecord="{ row }">
            <div class="text-orange-400 cursor-pointer" @click="handleShowChangeRecord(row)"> {{ t('common.detailText') }} </div>
          </template>
        </Grid>
      </div>
    </div>
    <RecordModal @register="registerRecordModal" />
  </div>
</template>
