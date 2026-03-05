<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-search-box">
        <BasicForm @register="registerForm">
          <template #formFooter>
            <a-button type="primary" class="ml-3" @click="searchFn">{{ t('common.queryText') }}</a-button>
            <a-button class="ml-3" @click="resetFn">{{ t('common.resetText') }}</a-button>
          </template>
        </BasicForm>
      </div>
      <div class="lydc-content-wrapper-content bg-white">
        <Grid>
          <template #toolbar-actions>
            <a-space class="btn-block">
              <a-button @click="exportFn">
                <template #icon>
                  <VerticalAlignBottomOutlined />
                </template>
                {{ t('common.exportText') }}</a-button
              >
            </a-space>
          </template>
        </Grid>
      </div>
    </div>
    <ExportModal @register="registerExportModal" />
  </div>
</template>

<script lang="ts" setup>
  import ExportModal from '/@/components/ExportModal/index.vue';
  import { onMounted } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { useModal } from '/@/components/Modal/index.js';
  import { BasicForm, useForm } from '/@/components/Form';
  import { exportSameProblem, getSameProblem } from '/@/api/qms/mrb';
  import { VerticalAlignBottomOutlined } from '@ant-design/icons-vue';
  import { columns, schemas } from './config';

  defineOptions({ name: 'qms-mrb-repeatBad' });

  const { t } = useI18n();

  const [registerExportModal, { openModal: openExportModal }] = useModal();

  const [registerForm, { getFieldsValue, resetFields }] = useForm({
    baseColProps: { span: 4 },
    showResetButton: true,
    showSubmitButton: true,
    autoSubmitOnEnter: true,
    schemas,
    fieldMapToTime: [['dateVal', ['startTime', 'endTime']]],
    i18nConfig: {
      moduleCode: 'MrbApplyColumn',
      transferRange: ['placeholder'],
    },
  });
  const [Grid, gridApi] = useVbenVxeGrid({
    gridOptions: {
      columns,
      virtualXConfig: {
        enabled: false,
      },
      virtualYConfig: {
        enabled: false,
      },
      rowConfig: {
        keyField: 'id',
      },
      height: '100%',
      api: params => getSameProblem({ ...params, ...getFieldsValue() }),
      i18nConfig: {
        moduleCode: 'MrbApplyColumn',
      },
    },
  });

  function searchFn() {
    gridApi?.query();
  }

  function resetFn() {
    resetFields();
    setTimeout(() => {
      gridApi?.query();
    }, 300);
  }

  function exportFn(): void {
    openExportModal(true, {
      api: exportSameProblem,
      listQuery: {
        ...getFieldsValue(),
      },
      nameProps: 'title',
      idProps: 'field',
      exportOptions: columns,
      i18nConfig: {
        moduleCode: 'MrbApplyColumn',
      },
    });
  }
  onMounted(() => {
    gridApi.query();
  });
</script>

<style lang="less" scoped>
  .btn-block button {
    display: flex;
    align-items: center;
  }
</style>
