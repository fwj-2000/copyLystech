<template>
  <div class="lydc-content-wrapper">
    <TableLayout :columns="pageInfo.getColumns()" :schemas="pageInfo.schemas" :getDataApi="pageInfo.api">
      <!-- 通用 开始 -->
      <template #nodeDetail="{ row }">
        <div class="text-orange-400 cursor-pointer" @dblclick="handleNodeModal(row)">
          {{ t('component.nodeModal.modalTitle') }}
        </div>
      </template>
      <template #desensitizationDrawing="{ row }">
        <span v-if="row.desensitizedDrawingsName" class="table-a" @click="handleDesensitize(row)">{{ row.desensitizedDrawingsName }}</span>
      </template>
      <!-- 通用 结束 -->

      <!-- 模具制作(`mold_making`) 开始 -->
      <template #drawingsHistory="{ row }">
        <a class="table-a" @click="handleDrawingsHistory(row)">{{ t('common.viewDetails') }}</a>
      </template>
      <template #moldDrawingsName="{ row }">
        <a
          class="table-a"
          @click="
            () => {
              filePreviewRef && filePreviewRef.init({
                name: row.moldDrawingsName,
                Id: row.moldDrawingsId,
                previewType: 'localPreview',
                noCache: false,
                isCopy: 0,
              } as any);
            }
          ">
          {{ row.moldDrawingsName }}
        </a>
      </template>
      <!-- 模具制作(`mold_making`) 结束 -->

      <!-- 出货、生产制造 开始 -->
      <template #desensitizedDrawingsName="{ row }">
        <a-button @click.stop="handlePreview(row, { name: 'desensitizedDrawingsName', id: 'desensitizedDrawingsId' })" type="link"
          >{{ row.desensitizedDrawingsName }}
        </a-button>
      </template>
      <template #customerDrawingsName="{ row }">
        <a-button @click.stop="handlePreview(row, { name: 'customerDrawingsName', id: 'customerDrawingsId' })" type="link"
          >{{ row.customerDrawingsName }}
        </a-button>
      </template>
      <template #engineeringDrawingsName="{ row }">
        <a-button @click.stop="handlePreview(row, { name: 'engineeringDrawingsName', id: 'engineeringDrawingsId' })" type="link"
          >{{ row.engineeringDrawingsName }}
        </a-button>
      </template>
      <!-- 出货、生产制造 结束 -->
    </TableLayout>

    <PreviewModal ref="filePreviewRef" />
    <NodeModal @register="registerNodeModal" />
    <DrawingsHistoryModal @register="registerDrawingsHistoryModal" />
  </div>
</template>

<script lang="ts" setup>
  import { computed, ref } from 'vue';
  import { useTabs } from '/@/hooks/web/useTabs';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { snakeToCamel } from './utils';
  import { useRoute } from 'vue-router';
  import { DETAIL_PAGE_INFO_MAP } from './config/index';
  import { getNodeDetail } from '/@/api/engineering/ecn';
  import { useModal } from '/@/components/Modal';

  import TableLayout from './component/tableLayout.vue';
  import { PreviewModal } from '/@/components/Upload';
  import { NodeModal } from '/@/components/CustomComponents';
  import DrawingsHistoryModal from '/@/views/business/quantitation/assess/components/DrawViewModal.vue';

  defineOptions({ name: 'business-PMTData-detail' });

  const { t } = useI18n();

  const route = useRoute();

  const rowType = route.params.rowType as string;

  // 设置`tab`标题
  rowType && useTabs().setTitle(t(`dict.PMTData.${snakeToCamel(rowType)}Detail`));

  /** 页面信息 */
  const pageInfo = computed(() => {
    return (
      DETAIL_PAGE_INFO_MAP[rowType] || {
        getColumns: () => [],
        schemas: [],
        api: () => Promise.resolve({ data: [] }),
      }
    );
  });

  /** 文件预览组件实例 */
  const filePreviewRef = ref<InstanceType<typeof PreviewModal>>();
  /** 打开脱敏图纸 */
  function handleDesensitize(row: any) {
    const params = {
      previewType: 'localPreview',
      Id: row.desensitizedDrawingsId,
      fileName: row.desensitizedDrawingsName,
    };
    filePreviewRef.value?.init(params as any);
  }

  const [registerNodeModal, { openModal: openNodeModal }] = useModal();
  /** 节点详情 */
  function handleNodeModal(record: any) {
    openNodeModal(true, {
      api: getNodeDetail,
      id: record.id,
      fetchSetting: {
        listField: 'flowNodeInstanceHisList',
      },
    });
  }

  const [registerDrawingsHistoryModal, { openModal: openDrawingsGistoryModal }] = useModal();
  function handleDrawingsHistory(record: any) {
    openDrawingsGistoryModal(true, {
      id: record.insidePartNumberId,
      InsidePartNumber: record.innerMaterialNumber,
    });
  }

  function handlePreview(record: any, { name, id }) {
    const params = {
      name: record[name],
      Id: record[id],
      previewType: 'localPreview',
      noCache: false,
      isCopy: 0,
    };
    filePreviewRef.value?.init(params as any);
  }
</script>
