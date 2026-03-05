<script setup lang="ts">
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { getCpkPositionCodeList, postCpkPositionCodeDelete, postCpkPositionCodeBatchDelete, postCpkPositionCodeExport } from '/@/api/qualityAssurance/cpk';
  import { getColumns, getSchema } from './config';
  import { useI18n } from '/@/hooks/web/useI18n';
  import AddPopup from './components/AddPopup.vue';
  import { usePopup } from '/@/components/Popup';
  import { useModal } from '/@/components/Modal';
  import { ActionItem, TableAction } from '/@/components/Table';
  import { isEmpty } from '/@/utils/is';
  import { useMessage } from '/@/hooks/web/useMessage';
  import ExportModal from '/@/components/ExportModal/index.vue';
  const { t } = useI18n();

  const { createMessage, createConfirm } = useMessage();

  defineOptions({ name: 'qualityAssurance-cpk-cpkIdentificationSetting' });

  const [registerAddPopup, { openPopup: openAddPopup }] = usePopup();
  const [registerExportModal, { openModal: openExportModal, closeModal }] = useModal();
  const [Grid, { reload, getSelectRowKeys, getFetchParams }] = useVbenVxeGrid({
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
      schema: getSchema,
      i18nConfig: {
        moduleCode: 'CPKLocationColumn',
        transferRange: ['placeholder'],
      },
    },
    gridOptions: {
      id: 'qualityAssurance-cpk-cpkPositionCode',
      columns: getColumns as any,
      showIndexColumn: true,
      api: getCpkPositionCodeList,
      i18nConfig: {
        moduleCode: 'CPKLocationColumn',
      },
    },
  });

  function handleEdit(row) {
    openAddPopup(true, [row]);
  }

  function handleAdd() {
    openAddPopup(true, []);
  }

  function getAction(record, index): ActionItem[] {
    return [
      {
        icon: 'icon-ym icon-ym-btn-preview',
        onClick: handleEdit.bind(null, record),
        // auth: 'btn_detail',
      },
      {
        icon: 'icon-ym icon-ym-delete',
        // auth: 'btn_remove',
        modelConfirm: {
          onOk: handleSingDel.bind(null, record),
        },
      },
    ];
  }
  function handleBatchDel() {
    const keys = getSelectRowKeys();
    if (isEmpty(keys)) {
      return createMessage.warning(t('common.selectText'));
    }
    createConfirm({
      iconType: 'warning',
      title: t('common.tipTitle'),
      content: t('common.beforeDelTip'),
      onOk: async () => {
        try {
          postCpkPositionCodeBatchDelete(keys).then(({ code, msg }) => {
            if (code == 200) {
              createMessage.success(msg);
              reload();
            }
          });
        } catch (e) {
          reload();
          throw e;
        }
      },
    });
  }

  function handleSingDel(row) {
    postCpkPositionCodeDelete([row.id]).then(({ code, msg }) => {
      if (code == 200) {
        createMessage.success(msg);
        reload();
      }
    });
  }
  // 导出
  const handleExport = async () => {
    openExportModal(true, {
      api: postCpkPositionCodeExport,
      listQuery: await getFetchParams(),
      nameProps: 'title',
      idProps: 'field',
      exportOptions: getColumns,
      i18nConfig: {
        moduleCode: 'CPKLocationColumn',
      },
    });
  };
</script>

<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white h-full">
        <Grid>
          <template #toolbar-actions>
            <a-space>
              <a-button type="primary" @click="handleAdd"> {{ t('common.addText') }} </a-button>
              <a-button v-auth="'btn_download'" class="mr-12px" block @click="handleExport">{{ t('common.batchExport') }}</a-button>
              <a-button @click="handleBatchDel">{{ t('common.batchDelText') }} </a-button>
            </a-space>
          </template>
          <template #action="{ row, rowIndex }">
            <TableAction outside :actions="getAction(row, rowIndex)" />
          </template>
        </Grid>
      </div>
    </div>
    <AddPopup @register="registerAddPopup" @reload="reload" />
    <ExportModal @register="registerExportModal" />
  </div>
</template>
