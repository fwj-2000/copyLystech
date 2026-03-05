<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <Grid>
          <template #toolbar-actions>
            <a-space>
              <!-- TODO: 根据不同的`tab`，显示不同的按钮 -->
              <template v-if="props.tab === TABS_ENUM.待处理">
                <a-button v-auth="'btn_add'" type="primary" @click="handleConfirm">
                  {{ t('common.materialComfirm') }}
                </a-button>
              </template>
              <template v-else-if="props.tab === TABS_ENUM.已处理">
                <a-button v-auth="'btn_download'" @click="handleExport">{{ t('common.batchExport') }}</a-button>
              </template>
            </a-space>
          </template>

          <!-- TODO: 根据业务需求，自定义插槽组件 -->
          <template #nodeDetail="{ row }">
            <div class="table-a" @click="handleNodeModal(row)"> {{ t('common.viewDetails') }} </div>
          </template>
          <!-- TODO: 自定义操作列，根据业务确实是否需要 -->
          <template #action="{ row }">
            <TableAction outside :actions="getTableActions(row)" />
          </template>
        </Grid>
      </div>
    </div>

    <!-- TODO: 不需要覆盖整个页面的弹窗组件放在这里 -->
    <ExportModal @register="registerExportModal" />
    <NodeModal @register="registerNodeModal" />

    <!-- TODO: 将需要覆盖整个页面的弹窗组件放在这里，会被转移到容器下 -->
    <Teleport defer :to="`#${DOM_CONTAINER_ID}`">
      <ViewDetail @register="registerDetail" @reload="reload" />
    </Teleport>
  </div>
</template>

<script lang="ts" setup>
  import type { PropType } from 'vue';

  import { usePopup } from '/@/components/Popup';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useModal } from '/@/components/Modal';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { TableAction, ActionItem } from '/@/components/Table';
  import { getFormConfig, tableColumn } from './dataTableConfig';
  import { DOM_CONTAINER_ID, TABS_ENUM } from '../config';
  // TODO: 引入对应的`Api`接口
  import { getNodeList, exportExcel, confirmPageList } from '/@/api/engineering/sample';
  // TODO: 根据需要，引入对应的组件，以下示例常用组件
  import { useMessage } from '/@/hooks/web/useMessage';
  import ExportModal from '/@/components/ExportModal/index.vue';
  import { NodeModal } from '/@/components/CustomComponents';
  import ViewDetail from './viewPopup.vue';

  const props = defineProps({
    /** 列表类型 */
    tab: {
      type: String as PropType<`${TABS_ENUM}`>,
      required: true,
    },
  });
  const { createMessage } = useMessage();
  const { t } = useI18n();
  const i18nModuleCode = 'SampleApplyColumn'; // TODO: 国际化模块编码，根据业务设置

  const [Grid, gridApi] = useVbenVxeGrid({
    formOptions: {
      collapsed: true,
      commonConfig: {
        componentProps: {},
        labelClass: 'w-0',
      },
      wrapperClass: 'grid grid-cols-5 gap-4',
      schema: getFormConfig,
      i18nConfig: {
        moduleCode: i18nModuleCode,
        transferRange: ['placeholder'],
      },
    },
    gridOptions: {
      // TODO: 根据业务设置表格个性化设置的唯一标识
      id: `pageDemo-tabPage-${props.tab}-list`,
      columns: tableColumn,
      showIndexColumn: true,
      // TODO: 设置获取表格数据的`api`
      api: confirmPageList,
      beforeFetch: (params: any) => ({ ...params, isConfirm: props.tab === TABS_ENUM.已处理 }),
      pagerConfig: {
        autoHidden: false,
      },
      i18nConfig: {
        moduleCode: i18nModuleCode,
      },
    },
  });
  const { getFetchParams, reload } = gridApi;

  // TODO: 设置操作列按钮
  /** 获取操作列按钮 */
  function getTableActions(record: any): ActionItem[] {
    return [
      {
        icon: 'icon-ym icon-ym-btn-preview',
        auth: 'btn_detail',
        tooltip: t('common.view'),
        onClick: showDetail.bind(null, record),
      },
    ];
  }

  // TODO: 详情弹窗，demo使用，可直接删除
  const [registerDetail, { openPopup: openDetail }] = usePopup();
  /** 展示详情 */
  function showDetail(record: any) {
    openDetail(true, {
      ...record,
      isShowReplyInfo: true,
      isCanEdit: false,
    });
  }

  // TODO: 通用的节点详情查看组件，可根据需要保留或者删除
  const [registerNodeModal, { openModal: openNodeModal }] = useModal();
  /** 节点详情 */
  function handleNodeModal(record: any) {
    openNodeModal(true, {
      api: getNodeList,
      id: record.id,
    });
  }

  // TODO: 确认功能，根据业务需求可删除
  function handleConfirm() {
    createMessage.info(t('后续待补充...'));
  }

  // TODO: 通用的导出组件，可根据需要保留或者删除
  const [registerExportModal, { openModal: openExportModal }] = useModal();
  /** 导出 */
  async function handleExport() {
    const params = await getFetchParams();
    openExportModal(true, {
      // TODO: 设置导出的请求接口(`api`)及导出列(`exportOptions`)
      listQuery: params,
      api: exportExcel,
      exportOptions: tableColumn,
      idProps: 'field',
      i18nConfig: {
        moduleCode: i18nModuleCode,
      },
    });
  }

  defineExpose({
    // 抛出打开详情弹窗的方法
    openDetail,
  });
</script>
