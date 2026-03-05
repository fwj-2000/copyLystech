<script setup lang="ts">
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { waitGetColumns, waitGetSchema } from '/@/views/qualityAssurance/cpk/cpkIdentification/config';
  import { cancelCpkTag, getCpkTag, postCpkExportTag } from '/@/api/qualityAssurance/cpk';
  import { reactive, toRefs } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import ExportModal from '/@/components/ExportModal/index.vue';
  import { useModal } from '/@/components/Modal';
  import { usePermission } from '/@/hooks/web/usePermission';
  import SAPFactoryForm from './SAPFactoryForm.vue';
  import TagForm from './TagForm.vue';
  import { isEmpty } from '/@/utils/is';
  import { useMessage } from '/@/hooks/web/useMessage';

  const { t } = useI18n();
  const { hasBtnP } = usePermission();

  defineOptions({ name: 'qualityAssurance-cpk-cpkIdentification' });

  const { createMessage } = useMessage();

  const [registerExportModal, { openModal: openExportModal }] = useModal();
  const [registerSyncSAP, { openModal: openSyncSAP }] = useModal();
  const [registerTagForm, { openModal: openTagForm }] = useModal();

  const state = reactive<Record<string, any>>({
    activeKey: '1',
    tomakeCacheList: [],
    waitCacheList: [],
    doneCacheList: [],
    index: 0,
  });

  const { activeKey } = toRefs(state);

  const [
    Wait,
    {
      reload: waitReload,
      getSelectRowKeys: waitGetSelectRowKeys,
      setLoading: waitSetLoading,
      clearSelectedRowKeys: waitClearSelectedRowKeys,
      getFetchParams: waitGetFetchParams,
    },
  ] = useVbenVxeGrid({
    formOptions: {
      collapsed: true,
      showCollapseButton: true,
      submitOnChange: false,
      submitOnEnter: true,
      commonConfig: {
        componentProps: {},
        labelClass: 'w-0',
      },
      schema: waitGetSchema(),
      wrapperClass: 'grid grid-cols-5 gap-4',
      i18nConfig: {
        moduleCode: 'CPKColumn',
        transferRange: ['placeholder'],
      },
    },
    gridOptions: {
      id: 'qualityAssurance-cpk-cpkIdentification-list-wait',
      columns: waitGetColumns(),
      api: getCpkTag,
      showIndexColumn: true,
      i18nConfig: {
        moduleCode: 'CPKColumn',
      },
      rowConfig: {
        keyField: 'woId',
      },
      beforeFetch: params => {
        return {
          ...params,
          dataFilter: 1,
        };
      },
      afterFetch: data => {
        state.waitCacheList = data.list;
      },
    },
  });

  const [
    Done,
    {
      reload: doneReload,
      getSelectRowKeys: doneGetSelectRowKeys,
      setLoading: doneSetLoading,
      clearSelectedRowKeys: doneClearSelectedRowKeys,
      getFetchParams: doneGetFetchParams,
    },
  ] = useVbenVxeGrid({
    formOptions: {
      collapsed: true,
      showCollapseButton: true,
      submitOnChange: false,
      submitOnEnter: true,
      commonConfig: {
        componentProps: {},
        labelClass: 'w-0',
      },
      schema: waitGetSchema(),
      wrapperClass: 'grid grid-cols-5 gap-4',
      i18nConfig: {
        moduleCode: 'CPKColumn',
        transferRange: ['placeholder'],
      },
    },
    gridOptions: {
      id: 'qualityAssurance-cpk-cpkIdentification-list-wait',
      columns: waitGetColumns(),
      api: getCpkTag,
      showIndexColumn: true,
      i18nConfig: {
        moduleCode: 'CPKColumn',
      },
      rowConfig: {
        keyField: 'woId',
      },
      beforeFetch: params => {
        return {
          ...params,
          dataFilter: 2,
        };
      },
      afterFetch: data => {
        state.waitCacheList = data.list;
      },
    },
  });

  function reloadTable() {
    if (state.activeKey == 1) {
      waitReload();
    } else if (state.activeKey == 2) {
      doneReload();
    }
  }

  function handleTagForm() {
    const ids = waitGetSelectRowKeys();
    if (isEmpty(ids)) {
      return createMessage.warning(t('common.selectText'));
    }
    openTagForm(true, {
      ids,
    });
  }

  function handleTag(flag) {
    doneSetLoading(true);
    // 取消标识
    const keys = doneGetSelectRowKeys();
    console.log(keys, 'keyskeyskeyskeys');
    cancelCpkTag(keys)
      .then(({ code, data }) => {
        if (code !== 200) return;
        reloadTable();
        doneClearSelectedRowKeys();
      })
      .finally(() => {
        doneSetLoading(false);
      });
    //   if (flag === 'enabled') {
    //     waitSetLoading(true);
    //     // 标识
    //     const keys = waitGetSelectRowKeys();
    //     postCpkTag(keys)
    //       .then(({ code, data }) => {
    //         if (code !== 200) return;
    //         reloadTable();
    //         waitClearSelectedRowKeys();
    //       })
    //       .finally(() => {
    //         waitSetLoading(false);
    //       });
    //   } else {

    //   }
  }
  //导出
  async function handleExport(dataFilter) {
    openExportModal(true, {
      api: postCpkExportTag,
      listQuery: {
        ...(dataFilter == 1 ? await waitGetFetchParams() : await doneGetFetchParams()),
        dataFilter,
      },
      exportOptions: waitGetColumns(),
      nameProps: 'title',
      idProps: 'field',
      // i18nConfig: {
      //   moduleCode: 'FactorySapColumn',
      // },
    });
  }

  function handleSyncSapFactory() {
    openSyncSAP(true, {});
  }

  // function handleInvocationSAP() {
  //   postSAPFactory().then(({ code, data }) => {
  //     if (code == 200) {
  //       console.log('🚀 ~  ~ data: ', data);
  //       debugger;
  //     }
  //   });
  // }
</script>

<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <a-tabs @change="reloadTable" v-model:activeKey="activeKey" class="h-full">
          <a-tab-pane key="1" :tab="t('common.waitSign')" class="h-full">
            <Wait>
              <template #toolbar-actions>
                <a-space>
                  <a-button v-if="hasBtnP('btn_tag')" type="primary" @click="handleTagForm">{{ t('dict.PurchaseQuotation.Tag') }}</a-button>
                  <a-button v-if="hasBtnP('btn_syncSAP')" type="primary" @click="handleSyncSapFactory" ghost>{{ t('common.syncSAPWorkId') }}</a-button>
                  <!--                  <a-button @click="handleLocation">仓位代码维护</a-button>-->
                  <a-button v-if="hasBtnP('btn_download')" @click="handleExport('1')">{{ t('common.batchExport') }}</a-button>
                  <!--                  <a-button @click="handleInvocationSAP">调用SAP开关</a-button>-->
                </a-space>
              </template>
              <template #tag>
                <LydcTag theme="gray" :text="t('common.waitSign')" />
              </template>
            </Wait>
          </a-tab-pane>
          <a-tab-pane key="2" :tab="t('common.doneSign')" class="h-full">
            <Done>
              <template #toolbar-actions>
                <a-space>
                  <a-button v-if="hasBtnP('btn_cancalTag')" type="primary" @click="handleTag('disabled')">{{ t('common.cancelSign') }}</a-button>
                  <a-button v-if="hasBtnP('btn_download')" @click="handleExport('2')">{{ t('common.batchExport') }}</a-button>
                </a-space>
              </template>
              <template #tag>
                <LydcTag theme="green" :text="t('common.doneSign')" />
              </template>
            </Done>
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>
    <ExportModal @register="registerExportModal" />
    <TagForm @register="registerTagForm" @reload="waitReload" />
    <SAPFactoryForm @register="registerSyncSAP" />
  </div>
</template>

<style scoped lang="less">
  @import url('/src/design/page.less');
</style>
