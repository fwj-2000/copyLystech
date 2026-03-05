<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    :showOkBtn="true"
    :showCancelBtn="true"
    title="CPK报告上传"
    :destroyOnClose="true"
    :ok-text="t('common.submit')"
    :confirmLoading="loading"
    class="h-full"
    @ok="handleSubmit">
  </BasicPopup>
</template>
<script setup lang="ts">
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { reactive, toRefs, nextTick, computed } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { isEmpty, isNullOrUnDef } from '/@/utils/is';
  import { cloneDeep, compact, defaultsDeep, isError } from 'lodash-es';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { requestIdleCallbackAdapter } from '/@/utils/polyfills';
  import { getUploadReportColumn } from '/@/views/qualityAssurance/cpk/cpkUploadReport/config';

  const emit = defineEmits(['register', 'reload']);

  const { t } = useI18n();
  const { createMessage } = useMessage();

  const [Grid, { loadData, reloadData, getDataSource, reloadColumn }] = useVbenVxeGrid({
    gridOptions: {
      id: 'qualityAssurance-cpk-cpkUploadReport-uploadReport',
      columns: getUploadReportColumn(),
      showIndexColumn: true,
      editConfig: {
        trigger: 'dblclick',
        mode: 'row',
      },
      toolbarConfig: {
        enabled: true,
      },
      scrollY: {
        enabled: false,
      },
      pagerConfig: {
        enabled: false,
      },
      keyboardConfig: {
        isClip: true, // 是否开启复制粘贴
        isEdit: true, // 是否开启任意键进入编辑（功能键除外）
        isDel: true, // 是否开启删除键功能
        isEsc: true, // 是否开启Esc键关闭编辑功能
      },
      rowConfig: {
        keyField: 'id',
      },
      clipConfig: {
        isPaste: true,
        beforePasteMethod: handleBeforePaster,
      },
    },
  });
</script>
