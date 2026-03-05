<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-search-box">
        <BasicForm @register="registerForm"> </BasicForm>
      </div>
      <div class="lydc-content-wrapper-content bg-white">
        <Grid>
          <template #toolbar-actions>
            <a-space>
              <a-button @click="batchReviewFn" ghost type="primary" v-auth="'btn_sapWrite'">{{ t('common.batchWriteSAP') }}</a-button>
            </a-space>
          </template>
          <template #action="{ row }">
            <TableAction :actions="getTableActions(row)" />
          </template>
        </Grid>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, nextTick, computed, unref, onMounted } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { BasicForm, useForm } from '/@/components/Form';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { columns, schemas } from './config.js';
  import { batchdecisionorder, getdecisionorderdata } from '/@/api/qms/iqc.js';
  import { TableAction } from '/@/components/Table/index.js';
  defineOptions({ name: 'qms-iqc-sapBack' });
  const { createMessage, createConfirm } = useMessage();
  const { t } = useI18n();

  const [registerForm, { getFieldsValue, resetFields, updateSchema }] = useForm({
    baseColProps: { span: 4 },
    showActionButtonGroup: true,
    showAdvancedButton: true,
    showResetButton: true,
    showSubmitButton: true,
    autoSubmitOnEnter: true,
    autoAdvancedLine: 1,
    submitFunc: () => searchFn(),
    resetFunc: resetFn,
    i18nConfig: {
      moduleCode: 'IQCApplyColumn',
      transferRange: ['placeholder'],
    },
    schemas,
  });

  const [Grid, gridApi] = useVbenVxeGrid({
    gridOptions: {
      columns,
      api: () => getdecisionorderdata({ ...getFieldsValue() }),
      i18nConfig: {
        moduleCode: 'IQCApplyColumn',
      },
    },
  });

  function batchReviewFn() {
    const grid = gridApi.grid;
    const selectRows = grid.getCheckboxRecords(true);
    if (!selectRows.length) return createMessage.error(t('common.selectText'));
    createConfirm({
      iconType: 'warning',
      title: t('common.tipTitle'),
      content: t('common.sapWriteTips'),
      onOk: () => {
        const ids = selectRows.map(item => item.id);
        batchdecisionorderFn(ids);
      },
    });
  }

  async function batchdecisionorderFn(params) {
    // changeLoading(true);
    try {
      const { code, msg } = await batchdecisionorder(params);
      if (code === 200) {
        return createMessage.success(msg);
      }
    } catch (error) {
      createMessage.error(String(error));
    } finally {
      // changeLoading(false);
    }
  }

  function getTableActions(row: any) {
    return [
      {
        icon: 'ym-diecut ym-diecut-swap',
        onClick: handleSapWrite.bind(null, row),
        tooltip: t('common.writeBackSap'),
        auth: 'btn_sapWrite',
      },
    ];
  }
  function handleSapWrite(data) {
    createConfirm({
      iconType: 'warning',
      title: t('common.tipTitle'),
      content: t('common.sapWriteTips'),
      onOk: () => {
        batchdecisionorderFn([data.id]);
      },
    });
  }

  function searchFn(): Promise<void> {
    return gridApi?.query();
  }

  function resetFn(): any {
    setTimeout(() => {
      searchFn();
    }, 300);
  }

  onMounted(() => {
    gridApi.query();
  });
</script>
