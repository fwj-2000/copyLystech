<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="t('dict.CommonCol.selectBusinessBG')" showOkBtn @ok="handleSubmit" :width="860">
    <Grid class="h-[550px]"></Grid>
  </BasicModal>
</template>
<script setup lang="ts">
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { getsapbusinessscopelist, businessscopeAdd } from '/@/api/equipment/equipmentLedger';

  import { useI18n } from '/@/hooks/web/useI18n';
  import { addGridColumn, getAddSchema } from '../config';

  const emit = defineEmits(['register', 'added', 'reload']);
  const { createMessage } = useMessage();
  const { t } = useI18n();

  const [Grid, gridApi] = useVbenVxeGrid({
    formOptions: {
      showCollapseButton: false,
      // 是否在字段值改变时提交表单
      submitOnChange: false,
      submitOnEnter: true,
      commonConfig: {
        componentProps: {},
        labelClass: 'w-0',
      },
      wrapperClass: 'grid grid-cols-3 gap-4',
      schema: getAddSchema(),
      i18nConfig: {
        moduleCode: 'BusinessScopeColumn',
        transferRange: ['placeholder'],
      },
    },
    gridOptions: {
      id: 'equipment-scopeMaintenance-add-list',
      api: getsapbusinessscopelist,
      columns: addGridColumn,
      proxyConfig: {
        response: {
          total: 'data.pagination.Total',
        },
        autoLoad: false,
      },
      rowConfig: {
        keyField: '_X_ROW_KEY',
      },
      i18nConfig: {
        moduleCode: 'BusinessScopeColumn',
      },
    },
  });

  const [registerModal, { closeModal, changeOkLoading }] = useModalInner(init);

  async function init(data) {
    gridApi.reload();
  }

  //提交
  async function handleSubmit() {
    let rows = gridApi.getSelectRows();
    if (rows.length === 0) {
      createMessage.warning(t('dict.CheckDataTip'));
      return;
    }
    changeOkLoading(true);
    const params = rows.map(item => {
      return {
        code: item.code,
        name: item.name,
      };
    });
    const res = await businessscopeAdd(params).finally(() => {
      changeOkLoading(false);
    });
    createMessage.success(res.msg);
    closeModal(); //关闭弹窗
    emit('reload');
  }
</script>
