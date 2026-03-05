<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <Grid>
          <template #toolbar-actions>
            <a-space>
              <!-- 打印 -->
              <a-button type="primary" @click="handlePrint">打印</a-button>
            </a-space>
          </template>

          <template #action="{ row }">
            <TableAction outside :actions="getTableActions(row)" />
          </template>
        </Grid>
      </div>
    </div>
    <PEPrintModal @register="registerPEPrint" @reload="reload"></PEPrintModal>
    <INPrintModal @register="registerINPrint" @reload="reload" :activeKey="activeKey"></INPrintModal>
  </div>
</template>
<script lang="ts" setup>
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { ref, computed } from 'vue';
  import { repairmoldExport } from '/@/api/engineering/mould';
  import { ModalComponent } from '/@/views/basicData/encodingSettings/types';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { getColumn, getFormSchema } from './config';
  import { TableAction } from '/@/components/Table';
  import { useModal } from '/@/components/Modal';
  import { downloadByUrl } from '/@/utils/file/download';
  import PEPrintModal from './components/PEPrintModal.vue';
  import INPrintModal from './components/INPrintModal.vue';
  import { getPackLabelPage } from '/@/api/productionDeal/packagePrint';

  const { t } = useI18n();
  const { hasBtnP } = usePermission();
  const props = defineProps({
    activeKey: {
      type: String,
      default: 'pending',
    },
  });
  const status = computed(() => {
    const activeKeyObj = {
      PE: 1,
      IN: 2,
      OUT: 3,
    };
    return activeKeyObj[props.activeKey] || 1;
    // return props.activeKey === 'pending' ? 1 : 2;
  });

  const [registerPEPrint, { openModal: openPrintPEModal }] = useModal();
  const [registerINPrint, { openModal: openPrintINModal }] = useModal();

  const [Grid, { reload, getFetchParams }] = useVbenVxeGrid({
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
      wrapperClass: 'grid grid-cols-5 gap-4',
      schema: getFormSchema(),
      // i18nConfig: {
      //   moduleCode: 'RepairMoldColumn',
      //   transferRange: ['placeholder'],
      // },
    },
    gridOptions: {
      id: props.activeKey === 'pending' ? 'engineering-mouldRoom-repairMoldApproval-list-wait' : 'engineering-mouldRoom-repairMoldApproval-list-done',
      columns: getColumn(props.activeKey),
      api: getPackLabelPage,
      showIndexColumn: true,
      // i18nConfig: {
      //   moduleCode: 'RepairMoldColumn',
      // },
      beforeFetch: params => handleParams(params),
    },
  });

  // 处理参数
  function handleParams(params) {
    if (params.pickerVal) {
      params.StartTime = params.pickerVal[0];
      params.EndTime = params.pickerVal[1];
      delete params.pickerVal;
    }
    params.PrintType = status.value;
    return params;
  }

  // 操作
  function getTableActions(row) {
    return [
      {
        icon: 'icon-ym icon-ym-report-icon-preview-printPreview',
        onClick: handleEdit.bind(null, row),
        // auth: 'btn_edit',
        tooltip: '补打',
      },
    ];
  }

  // 打印
  const handlePrint = async () => {
    if (props.activeKey === 'PE') {
      openPrintPEModal(true, {});
    } else {
      openPrintINModal(true, {});
    }
  };

  // 编辑
  const handleEdit = row => {};

  defineExpose({ reload });
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

  //:deep(.lydc-basic-table-action button i) {
  //  font-size: 20px;
  //}
</style>
