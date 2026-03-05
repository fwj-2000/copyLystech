<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <Grid>
          <template #toolbar-actions>
            <a-space>
              <!-- 新增 -->
              <LydcButton v-auth="'btn_add'" type="primary" :onClick="() => handleDetail()"> {{ t('common.add2Text') }}</LydcButton>
              <vShowDropdown>
                <template #overlay>
                  <!-- 批量导入 -->
                  <LydcButton v-if="hasBtnP('btn_upload')" type="text" :onClick="handleImport">{{ t('common.batchImport') }}</LydcButton>
                  <!-- 批量导出 -->
                  <LydcButton v-if="hasBtnP('btn_download')" type="text" :onClick="handleExport">{{ t('common.batchExport') }}</LydcButton>
                </template>
                <LydcButton v-if="hasBtnP('btn_upload') || hasBtnP('btn_download')">{{ t('common.batchImportOrExport') }}</LydcButton>
              </vShowDropdown>
              <!-- 批量删除 -->
              <LydcButton v-auth="'btn_batchRemove'" :onClick="handleBatchDelete">
                {{ t('common.batchDelText') }}
              </LydcButton>
              <!-- 异步操作自动loading按钮 -->
              <LydcButton scope="page" :follow-scope="true" :onClick="asyncButton">联动异步Loading</LydcButton>
              <LydcButton scope="page" :follow-scope="true" :onClick="asyncButton">联动测试</LydcButton>
              <LydcButton :onClick="asyncButton">单个loading测试</LydcButton>
            </a-space>
          </template>

          <template #action="{ row }">
            <!-- 操作栏 -->
            <TableAction outside :actions="getTableActions(row)" />
          </template>
        </Grid>
      </div>
    </div>

    <!-- 新增/编辑弹窗 -->
    <FormModal @register="registerFormModal" @reload="reload" />
    <!-- 批量导入弹窗 -->
    <ImportModal @register="registerImportPop" @refresh="reload" />
    <!-- 批量导出弹窗 -->
    <ExportModal @register="registerExportModal" />
  </div>
</template>

<script lang="ts" setup>
  import type { ActionItem } from '/@/components/Table';

  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { columns, schema, importColumn } from './config';
  import { getOrigincountryList, bulkDeleteOriginCountry, exportExcel, downloadTemplate, saveImportData, importPreview } from '/@/api/basicData/originCountry';
  import { useModal } from '/@/components/Modal';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { usePopup } from '/@/components/Popup';

  import { TableAction } from '/@/components/Table';
  import FormModal from './components/formModal.vue';
  import ExportModal from '/@/components/ExportModal/index.vue';
  import { ImportModal } from '/@/components/ImportModal';
  import vShowDropdown from '/@/components/VShowDropdown/src/vShowDropdown.vue';
  // import { LydcButton } from '/@/components/Button';
  defineOptions({ name: 'pageDemo-basePage' });

  const { hasBtnP } = usePermission();
  const { t } = useI18n();
  const { createMessage, createConfirm } = useMessage();

  const [Grid, { reload, getSelectRowKeys, getFetchParams }] = useVbenVxeGrid({
    formOptions: {
      collapsed: false,
      showCollapseButton: false,
      submitOnChange: false,
      submitOnEnter: true,
      commonConfig: {
        componentProps: {},
        labelClass: 'w-0',
      },
      wrapperClass: 'grid grid-cols-6 gap-4',
      schema,
      i18nConfig: {
        moduleCode: 'OriginCountryColumn',
        transferRange: ['placeholder'],
      },
    },
    gridOptions: {
      id: 'pageDemo-basePage-list',
      columns,
      showIndexColumn: true,
      api: getOrigincountryList,
      pagerConfig: {
        autoHidden: false,
      },
      i18nConfig: {
        moduleCode: 'OriginCountryColumn',
      },
    },
  });

  function getTableActions(record: any): ActionItem[] {
    return [
      // 编辑
      {
        icon: 'icon-ym icon-ym-btn-edit',
        tooltip: t('common.edit'),
        onClick: handleDetail.bind(null, record),
        auth: 'btn_edit',
      },
      // 详情
      {
        icon: 'icon-ym icon-ym-btn-preview',
        tooltip: t('common.detailText'),
        onClick: handleDetail.bind(null, record, false),
      },
    ];
  }

  const [registerFormModal, { openModal: openFormModal }] = useModal();
  /** 新增/编辑/详情 */
  function handleDetail(row?: any, isEdit = true) {
    openFormModal(true, row ? { ...row, isEdit } : { isEdit });
  }

  const [registerImportPop, { openPopup: openImportPopup }] = usePopup();
  /** 批量导入 */
  function handleImport() {
    openImportPopup(true, {
      importPreviewApi: importPreview,
      importSaveApi: saveImportData,
      templateApi: downloadTemplate,
      previewColumn: importColumn,
      usePolling: false,
      apiParams: {
        importSave: {
          isoperation: hasBtnP('btn_upload') ? 1 : 0,
        },
      },
      i18nConfig: {
        moduleCode: 'OriginCountryColumn',
      },
    });
  }

  const [registerExportModal, { openModal: openExportModal }] = useModal();
  /** 批量导出 */
  async function handleExport() {
    const params = await getFetchParams();
    openExportModal(true, {
      listQuery: params,
      api: exportExcel,
      exportOptions: columns,
      nameProps: 'title',
      idProps: 'field',
      selectIds: getSelectRowKeys(),
      i18nConfig: {
        moduleCode: 'OriginCountryColumn',
      },
    });
  }

  /** 批量删除 */
  async function handleBatchDelete() {
    const ids = getSelectRowKeys();
    if (ids.length === 0) {
      createMessage.warning(t('common.selectDelDatasTip'));
    } else {
      createConfirm({
        iconType: 'warning',
        title: t('common.tipTitle'),
        content: t('common.batchDelTip'),
        onOk: () =>
          bulkDeleteOriginCountry(ids.map(item => item.id)).then(() => {
            createMessage.success(t('common.delSuccess'));
            reload();
          }),
      });
    }
  }

  /** 模拟异步操作 */
  async function asyncButton() {
    //模拟接口
    try {
      let res = await bulkDeleteOriginCountry([]);
      if (res) {
        //正常逻辑
        createMessage.success('异步操作完成');
        reload();
      }
    } catch (error) {
      console.log('异步操作失败');
    }
    // let res = await new Promise((resolve, reject) => {
    //   setTimeout(() => {
    //     reject(true);
    //   }, 3000);
    // });
  }
</script>
