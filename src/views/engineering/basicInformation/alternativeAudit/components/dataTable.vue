<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <Grid>
          <template #toolbar-actions>
            <a-space>
              <template v-if="props.type === TABS_ENUM.待处理">
                <!-- 同意 -->
                <a-button v-auth="'btn_agree'" type="primary" @click="handleAgree">
                  {{ t('common.agree') }}
                </a-button>
                <!-- 驳回 -->
                <a-button v-auth="'btn_reject'" type="primary" ghost @click="handleReject">
                  {{ t('common.rejectText') }}
                </a-button>
              </template>
              <!-- 导出 -->
              <a-button v-auth="'btn_download'" @click="handleExport">{{ t('common.batchExport') }}</a-button>
            </a-space>
          </template>

          <template #nodeDetail="{ row }">
            <div class="text-orange-400 cursor-pointer" @click="handleNodeModal(row)"> {{ t('common.detailText') }} </div>
          </template>
          <template #changeRecord="{ row }">
            <div class="text-orange-400 cursor-pointer" @click="handleShowChangeRecord(row)"> {{ t('common.detailText') }} </div>
          </template>
        </Grid>
      </div>
    </div>
    <!-- 导出 界面 -->
    <ExportModal @register="registerExportModal" />
    <!-- 节点详情 界面 -->
    <NodeModal @register="registerNodeModal" />
    <!-- 驳回 -->
    <RejectModal @register="registerRejectModal" @reload="reload" />
    <!-- 变更记录 -->
    <RecordModal @register="registerRecordModal" />
  </div>
</template>

<script lang="ts" setup>
  import type { VxeGridPropTypes } from '/@/components/VxeTable';

  import { computed } from 'vue';
  import { omit } from 'lodash-es';
  import { getFormConfig, mainProcessOptions, getMainProcessOptions } from '/@/views/engineering/basicInformation/alternative/config';
  import { TABS_ENUM, getTodoColumns, getDoneColumns } from '../config';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useModal } from '/@/components/Modal';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { reject, getList, commit, exportExcel } from '/@/api/engineering/alternative';
  import { getNodeDetail } from '/@/api/engineering/ecn';

  import ExportModal from '/@/components/ExportModal/index.vue';
  import { NodeModal, RejectModal } from '/@/components/CustomComponents';
  import RecordModal from '/@/views/engineering/basicInformation/alternative/components/recordModal.vue';

  const props = defineProps({
    type: {
      type: String as PropType<`${TABS_ENUM}`>,
      default: TABS_ENUM.待处理,
    },
    columns: {
      type: Array as PropType<VxeGridPropTypes.Columns>,
      default: () => [],
    },
  });

  const [registerExportModal, { openModal: openExportModal }] = useModal();
  const [registerNodeModal, { openModal: openNodeModal }] = useModal();
  const { createMessage, createConfirm } = useMessage();

  const { t } = useI18n();

  /** 当前页面是为`待处理`页面 */
  const isTodoTab = computed(() => props.type === TABS_ENUM.待处理);

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
      wrapperClass: 'grid grid-cols-6 gap-4',
      schema: getFormConfig(),
      i18nConfig: {
        moduleCode: 'AltMaterialColumn',
        transferRange: ['placeholder'],
      },
    },
    gridOptions: {
      columns: isTodoTab.value ? getTodoColumns() : getDoneColumns(),
      api: getTableData,
      pagerConfig: {
        autoHidden: false,
      },
      i18nConfig: {
        moduleCode: 'AltMaterialColumn',
      },
    },
  });

  const { getSelectRowKeys, getFetchParams, reload, clearSelectedRowKeys } = gridApi;

  async function getTableData(params: any) {
    if (mainProcessOptions.length === 0) {
      await getMainProcessOptions();
    }

    return getList({ ...params, dataFilter: props.type }).then(res => {
      const list = Array.isArray(res?.data?.list) ? res.data.list : [];
      if (list.length > 0) {
        list.forEach(item => {
          item.mainProcessName = mainProcessOptions.find(item => item.value === item.value)?.label || '';
        });
      }
      return res;
    });
  }

  function handleNodeModal(record) {
    openNodeModal(true, {
      api: getNodeDetail,
      id: record.id,
    });
  }

  // 导出
  const handleExport = async () => {
    const params = await getFetchParams();
    const { pager } = gridApi.grid.getProxyInfo()!;
    // const columns = gridApi.grid.getColumns();

    const originColumns = isTodoTab.value ? getTodoColumns() : getDoneColumns();

    const columns = originColumns.reduce((list: Array<any>, item) => {
      if (item.type) {
        return list;
      }
      if (!Array.isArray(item.children) || item.children.length === 0) {
        list.push(item);
      } else {
        list.push(
          ...item.children.map(c => {
            return {
              ...c,
              title: `${c.title}(${item.title})`,
            };
          }),
        );
      }
      return list;
    }, []);

    openExportModal(true, {
      listQuery: { ...params, ...omit(pager, 'total') },
      api: (params: any) => exportExcel({ ...params, dataFilter: props.type }),
      exportOptions: columns,
      nameProps: 'title',
      idProps: 'field',
      i18nConfig: {
        moduleCode: '',
      },
    });
  };

  /**
   * 同意
   */
  function handleAgree() {
    const idList = getSelectRowKeys() || [];

    if (idList.length === 0) {
      return createMessage.info(t('common.selectText'));
    }

    return createConfirm({
      iconType: 'warning',
      title: t('common.tipTitle'),
      content: t('common.agreenOperationText'),
      onOk: async () => {
        try {
          const { msg, code } = await commit(idList);
          if (code === 200) {
            clearSelectedRowKeys();
            createMessage.success(msg);
            reload();
          }
        } catch (e) {
          clearSelectedRowKeys();
          reload();
        }
      },
    });
  }

  const [registerRejectModal, { openModal: openRejectModal }] = useModal();
  /**
   * 驳回
   */
  const handleReject = async () => {
    const idList = getSelectRowKeys() || [];

    if (idList.length === 0) {
      return createMessage.info(t('common.selectText'));
    }
    return openRejectModal(true, {
      api: reject,
      beforeFetch: params => {
        return {
          ids: idList,
          rejectRemark: params.rejectRemark,
        };
      },
    });
  };

  const [registerRecordModal, { openModal: openRecordModal }] = useModal();
  /** 变更记录 */
  function handleShowChangeRecord(row: any) {
    openRecordModal(true, {
      id: row.id,
    });
  }
</script>
