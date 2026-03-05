<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    :showOkBtn="true"
    :okText="t('common.submit')"
    :okButtonProps="{ class: 'mr-12px' }"
    :title="t('common.batchUpdate')"
    @ok="handleSave"
    class="full-popup"
    :closeFunc="handleClose">
    <div ref="containerRef" class="h-full requirement-pop p-10px">
      <Grid />
    </div>
  </BasicPopup>
</template>

<script lang="ts" setup>
  import { nextTick, ref } from 'vue';
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { cloneDeep } from 'lodash-es';
  import { updateImmediateCustomer } from '/@/api/business/immediateCustomer';
  import { getColumns, editRules } from './modifyPopupConfig';
  import { useVbenVxeGrid, VxeGridProps } from '/@/adapter/vxe-table';
  import { trimPasteContent } from '/@/utils/trimPasteContent';

  const emits = defineEmits(['register', 'reload']);

  const { t } = useI18n();

  const { createMessage } = useMessage();
  const containerRef = ref<HTMLDivElement>();

  const gridOptions: VxeGridProps = {
    columns: getColumns() as any,
    height: 'auto',
    editConfig: {
      trigger: 'dblclick',
      mode: 'row',
    },
    editRules,
    rowConfig: {
      keyField: '_X_ROW_KEY',
    },
    areaConfig: {
      multiple: true, // 是否启用多区域选取功能
    },
    proxyConfig: {
      enabled: false,
    },
    toolbarConfig: {
      enabled: false,
    },
    clipConfig: {
      isPaste: true,
      beforePasteMethod: data => {
        const { targetAreas } = data;
        // 粘帖前的校验处理
        if (targetAreas.length === 0) {
          return false;
        }
        const { cols } = targetAreas[0];

        for (const col of cols) {
          if (
            // 不是可编辑单元格，禁止粘帖，判断`col.editRender.enabled === false`是因为在配置`editRender.name`的情况下，可以开启编辑，但是此时`col.editRender.enabled`可能为`undefined`
            !col.editRender ||
            col.editRender.enabled === false ||
            col.editRender.props?.disabled === true
          ) {
            createMessage.warning(t('common.noPastingTip'));
            return false;
          }
        }

        return true;
      },
    },
    pagerConfig: {
      enabled: false,
    },
  };
  const [Grid, gridApi] = useVbenVxeGrid({ gridOptions });

  const [registerPopup, { closePopup, changeLoading }] = usePopupInner(init);

  async function init(data: { rows: Array<any> }) {
    Array.isArray(data?.rows) ? gridApi.grid.reloadData(cloneDeep(data.rows)) : closePopup();
    nextTick(() => {
      // 监听黏贴事件，去除首尾空格，或其他不可视字符
      containerRef.value && containerRef.value.addEventListener('paste', trimPasteContent);
    });
  }

  function handleClose() {
    // 关闭前，取消监听
    containerRef.value && containerRef.value.removeEventListener('paste', trimPasteContent);
    return true;
  }

  async function handleSave() {
    if (await gridApi.grid.validate(true)) {
      return createMessage.warning(t('dict.SalesSiteColumn.requiredTip'));
    }
    const list = gridApi.getDataSource();

    changeLoading(true);
    return updateImmediateCustomer(list)
      .then(() => {
        createMessage.success(t('sys.api.operationSuccess'));
        closePopup();
      })
      .catch(() => {})
      .finally(() => {
        emits('reload');
        changeLoading(false);
      });
  }
</script>

<style lang="less" scoped>
  :deep(.lydc-basic-table-action button i) {
    font-size: 18px;
  }

  .requirement-pop {
    display: flex;
    flex-direction: column;
    padding-bottom: 10px;
  }

  :deep(.border-right) {
    border-right: 1px solid rgb(228 228 231);
  }
</style>
