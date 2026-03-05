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
              <a-button v-auth="'btn_downloadSAP'" @click="handleExport">
                {{ t('common.exportSAP') }}
              </a-button>
              <a-button v-auth="'btn_bind'" @click="handleBindFactory('bind')">
                {{ t('common.bind', [t('common.factory')]) }}
              </a-button>
              <a-button v-auth="'btn_unbind'" @click="handleBindFactory('unbind')">
                {{ t('common.unbind', [t('common.factory')]) }}
              </a-button>
            </a-space>
          </template>
          <!-- <template #action="{ rowIndex, row }">
            <i class="icon-ym icon-ym-btn-preview text-orange-400 cursor-pointer mx-1" @click="handleEdit(rowIndex, row)" />
          </template> -->
        </Grid>
      </div>
    </div>

    <ExportModal @register="registerExportModal" />
    <DetailPopup @register="registerDetailPopup" @reload="reload" />
    <BindFactoryModal @register="registerBindFactoryModal" @reload="reload" />
  </div>
</template>

<script lang="ts" setup>
  import { omit } from 'lodash-es';
  import { getList, bulkBackDisable, bulkbackenable, exportExcel, bindFactory, unbindFactory } from '/@/api/engineering/semifinishedproducts';
  import { usePopup } from '/@/components/Popup';
  import ExportModal from '/@/components/ExportModal/index.vue';
  import { getFormConfig, getColumn, DETAIL_PAGE_TYPE_ENUM, STATUS_ENUM, getDictOptions } from './config';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useModal } from '/@/components/Modal';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { BindFactoryModal } from '/@/components/CustomComponents';

  import DetailPopup from './components/detailPopup.vue';

  defineOptions({ name: 'engineering-basicInformation-semifinishedproducts' });

  const [registerExportModal, { openModal: openExportModal }] = useModal();
  const [registerDetailPopup, { openPopup: openDetailPopup }] = usePopup();

  const { t } = useI18n();
  const { createMessage } = useMessage();

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
        moduleCode: 'SemiFinishedProductsColumn',
        transferRange: ['placeholder'],
      },
    },
    gridOptions: {
      id: 'engineering-basicInformation-semifinishedproducts-list',
      columns: getColumn(),
      showIndexColumn: true,
      api: getList,
      pagerConfig: {
        autoHidden: false,
      },
      i18nConfig: {
        moduleCode: 'SemiFinishedProductsColumn',
      },
    },
  });

  const { getSelectRowKeys, getSelectRows, getFetchParams, reload, setLoading } = gridApi;

  const handleEdit = async (type: string) => {
    await getDictOptions();
    if (type === DETAIL_PAGE_TYPE_ENUM.新增) {
      return openDetailPopup(true, { type });
    }

    const selectedKeys = getSelectRowKeys() || [];
    if (selectedKeys.length === 0) {
      return createMessage.warning(t('common.selectText'));
    }
    return openDetailPopup(true, { type, ids: selectedKeys });
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

    const api = status === STATUS_ENUM.启用 ? bulkbackenable : bulkBackDisable;

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

  // 绑定工厂
  const [registerBindFactoryModal, { openModal: openBindFactoryModal }] = useModal();
  const handleBindFactory = async (type: 'bind' | 'unbind') => {
    const rows = getSelectRows() || [];
    if (rows.length === 0) {
      return createMessage.warning(t('common.selectText'));
    }
    // 不允许存在主要制程不一样的
    let mainProcess = rows[0].mainProcessEnum;
    if (rows.some(item => item.mainProcessEnum !== mainProcess)) {
      return createMessage.warning(t('dict.semifinishedproducts.bindFactoryTip'));
    }
    let params: any = {
      list: rows,
      mainProcess,
      type,
    };
    if (type === 'unbind') {
      params.submitApi = unbindFactory;
    } else {
      params.submitApi = bindFactory;
    }
    openBindFactoryModal(true, params);
  };

  // 导出
  const handleExport = async () => {
    const params = await getFetchParams();
    const { pager } = gridApi.grid.getProxyInfo()!;

    openExportModal(true, {
      listQuery: { ...params, ...omit(pager, 'total') },
      api: exportExcel,
      // exportOptions: getColumn().slice(2),
      // nameProps: 'title',
      // idProps: 'field',
      i18nConfig: {
        moduleCode: 'SemiFinishedProductsColumn',
      },
    });
  };
</script>
