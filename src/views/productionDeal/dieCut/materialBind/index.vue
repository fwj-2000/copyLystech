<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white p-10px">
        <Grid>
          <template #toolbar-actions>
            <a-space>
              <!-- 叠料扫码 -->
              <a-button type="primary" v-auth="'btn_scanCode'" ghost @click="handleAdd">{{ t('dict.CommonCol.stackMaterialScanCode') }}</a-button>
              <a-button type="primary" v-auth="'btn_firstLineScan'" ghost @click="handlePipelineScan">{{ t('dict.CommonCol.firstLineScan') }}</a-button>
              <a-button type="primary" ghost v-auth="'btn_ALTStack'" @click="handleALTAdd">{{ t('dict.CommonCol.ALTStack') }}</a-button>
            </a-space>
          </template>
        </Grid>
      </div>
    </div>
    <AddModal @register="registerAdd" @reload="reload"></AddModal>
    <PipelineScanModal @register="registerPipelineScan" @reload="reload"></PipelineScanModal>
  </div>
</template>
<script lang="ts" setup>
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { getStackmaterial } from '/@/api/productionDeal/materialBind';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { getFormSchema, columns } from './config';
  import { useModal } from '/@/components/Modal';
  import AddModal from './components/AddModal.vue';
  import PipelineScanModal from './components/PipelineScanModal.vue';

  const { t } = useI18n();
  defineOptions({ name: 'productionDeal-dieCut-materialBind' });
  const [registerAdd, { openModal: openAddModal }] = useModal();
  const [registerPipelineScan, { openModal: openPipelineScanModal }] = useModal();
  const { createMessage } = useMessage();

  const [Grid, { reload, setFieldValue }] = useVbenVxeGrid({
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
        moduleCode: 'StackMaterialColumn',
        transferRange: ['placeholder'],
      },
    },
    gridOptions: {
      id: 'productionDeal-dieCut-materialBind-list',
      columns,
      api: getStackmaterial,
      showIndexColumn: true,
      i18nConfig: {
        moduleCode: 'StackMaterialColumn',
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

  // 叠料扫码
  const handleAdd = () => {
    openAddModal(true, {});
  };

  const handleALTAdd = () => {
    openAddModal(true, { fixedLayers: 4 });
  };

  // 一线流扫码
  const handlePipelineScan = () => {
    openPipelineScanModal(true, {});
  };
</script>

<style lang="less" scoped>
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
