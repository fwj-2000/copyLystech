<!--
 * @Author: wenzhenjin
 * @Date: 2025-05-16 13:52:17
 * @LastEditors: wenzhenjin
 * @LastEditTime: 2025-05-20 14:12:09
 * @FilePath: \lydc.server.web\src\views\business\basicInformation\workCenter\index.vue
-->
<script lang="ts" setup>
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { getColumn, getFormConfig } from '/@/views/business/basicInformation/workCenter/config';
  import { getWorkCenterList, EnableWorkCenter, DisableWorkCenter, getWorkCenterfromsap } from '/@/api/purchase/supplierInformation';
  import { DETAIL_PAGE_TYPE_ENUM, STATUS_ENUM } from '/@/views/engineering/basicInformation/semifinishedproducts/config';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useModal } from '/@/components/Modal';
  import { usePopup } from '/@/components/Popup';
  import ExportModal from '/@/components/ExportModal/index.vue';
  import DetailPopup from './components/detailPopup.vue';

  defineOptions({ name: 'business-basicInformation-workCenter' });

  const { t } = useI18n();
  const { createMessage } = useMessage();

  const [registerExportModal, { openModal: openExportModal }] = useModal();
  const [registerDetailPopup, { openPopup: openDetailPopup }] = usePopup();

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
      wrapperClass: 'grid grid-cols-5 gap-4',
      schema: getFormConfig(),
      i18nConfig: {
        moduleCode: 'WorkCenterColumn',
        transferRange: ['placeholder'],
      },
    },
    gridOptions: {
      id: 'business-basicInformation-workCenter-list',
      columns: getColumn(),
      api: getWorkCenterList,
      pagerConfig: {
        autoHidden: false,
      },
      i18nConfig: {
        moduleCode: 'WorkCenterColumn',
      },
    },
  });

  const { getSelectRowKeys, getSelectRows, getFetchParams, reload, setLoading } = gridApi;

  const handleEdit = (type: string) => {
    if (type === DETAIL_PAGE_TYPE_ENUM.新增) {
      return openDetailPopup(true, { type });
    }

    const selectedRows = getSelectRows() || [];
    console.log('🚀 ~ handleEdit ~ selectedRows:', selectedRows);
    if (selectedRows.length === 0) {
      return createMessage.warning(t('common.selectText'));
    }
    return openDetailPopup(true, { type, rows: selectedRows });
  };
  // 更改状态
  async function handleChangeStatus(status: number) {
    const selectRows = getSelectRows() || [];
    if (selectRows.length === 0) {
      return createMessage.info(t('common.selectText'));
    }
    const ids = selectRows.filter(item => item.enableStatusEnum !== status).map(item => item.id);

    if (ids.length === 0 && selectRows.length > 0) {
      return status === STATUS_ENUM.启用
        ? createMessage.warning(t('dict.semifinishedproducts.enableTip'))
        : createMessage.warning(t('dict.semifinishedproducts.disableTip'));
    }

    const api = status === STATUS_ENUM.启用 ? EnableWorkCenter : DisableWorkCenter;

    setLoading(true);
    api(ids)
      .then(() => {
        createMessage.success(t('sys.api.operationSuccess'));
        reload();
      })
      .finally(() => {
        setLoading(false);
      });
  }
  function handleSyncSAP() {
    setLoading(true);
    getWorkCenterfromsap({})
      .then(() => {
        createMessage.success(t('sys.api.operationSuccess'));
        reload();
      })
      .finally(() => {
        setLoading(false);
      });
  }
</script>

<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <Grid>
          <template #toolbar-actions>
            <a-space>
              <a-button type="primary" v-auth="'btn_add'" @click="() => handleEdit(DETAIL_PAGE_TYPE_ENUM.新增)">
                {{ t('common.add2Text') }}
              </a-button>
              <a-button type="primary" ghost v-auth="'btn_upgradeVersion'" @click="() => handleEdit(DETAIL_PAGE_TYPE_ENUM.升版)">
                {{ t('common.upgrade') }}
              </a-button>
              <a-button v-auth="'btn_edit'" @click="() => handleEdit(DETAIL_PAGE_TYPE_ENUM.修改)">
                {{ t('common.modify') }}
              </a-button>
              <a-button v-auth="'btn_enable'" @click="() => handleChangeStatus(STATUS_ENUM.启用)">
                {{ t('dict.enableStatus.1') }}
              </a-button>
              <a-button type="primary" ghost danger v-auth="'btn_disable'" @click="() => handleChangeStatus(STATUS_ENUM.禁用)">
                {{ t('dict.enableStatus.2') }}
              </a-button>
              <a-button v-auth="'btn_syncSAP'" @click="handleSyncSAP"> 同步SAP </a-button>
            </a-space>
          </template>
        </Grid>
      </div>
    </div>
    <ExportModal @register="registerExportModal" />
    <DetailPopup @register="registerDetailPopup" @reload="reload" />
  </div>
</template>
