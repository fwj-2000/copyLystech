<template>
  <BasicModal
    v-bind="$attrs"
    :width="900"
    :height="600"
    :title="t('dict.PartNumberApplyColumn.record')"
    destroyOnClose
    class="batch-modal"
    :showOkBtn="false"
    @register="registerModal">
    <div style="height: 500px">
      <Grid>
        <template #attachFileNames="{ row }">
          <template v-if="Array.isArray(row.attachFileNames) && row.attachFileNames.length > 0">
            <span v-for="(name, index) in row.attachFileNames" class="text-orange-400 cursor-pointer block" @click="handlePreview(row, name, index)">
              {{ name }}
            </span>
          </template>
        </template>
      </Grid>
    </div>

    <Preview ref="filePreviewRef" />
  </BasicModal>
</template>
<script lang="ts" setup>
  import { nextTick, ref } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { getChangeLog } from '/@/api/productionDeal/mouldBusinessMaintenance';

  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import Preview from '/@/components/Upload/src/components/Preview.vue';

  const emit = defineEmits(['reload']);
  const { t } = useI18n();

  const [registerModal] = useModalInner(init);
  const repairId = ref<string>('');

  const recordColumns = [
    // 变更前维修类型
    { title: t('dict.MoldRepairApplyColumn.beforeTypeName'), field: 'beforeTypeName', width: 200 },
    // 操作人
    // { title: t('dict.CommonCol.operator'), field: 'creatorUserName', width: 200 },
    // 操作时间
    // { title: t('dict.CommonCol.operatingTime'), field: 'creatorTime', width: 200, cellRender: { name: 'Date' } },
    // 变更后维修类型
    { title: t('dict.MoldRepairApplyColumn.afterTypeName'), field: 'afterTypeName', width: 200 },
    // 变更原因
    { title: t('dict.MoldRepairApplyColumn.changeReason'), field: 'changeReason', width: 200 },
    // 模具处理方式
    { title: t('dict.MoldLedgerColumn.handlingMethod'), field: 'dealTypeName', width: 200 },
    // 变更附件
    { title: t('dict.MoldRepairApplyColumn.attachFileNames'), field: 'attachFileNames', width: 400, slots: { default: 'attachFileNames' } },
    // 操作人
    { title: t('dict.CommonCol.operator'), field: 'lastModifyUserName', width: 200 },
    // 操作时间
    { title: t('dict.CommonCol.operatingTime'), field: 'lastModifyTime', width: 200 },
  ];

  const [Grid, gridApi] = useVbenVxeGrid({
    formOptions: undefined,
    gridOptions: {
      api: (params: any) => {
        if (repairId.value) {
          return getChangeLog({ ...params, repairId: repairId.value }).then(res => {
            const list = res?.data?.list || [];
            res.data.list = list.map(item => {
              item.attachFileNames = item.attachFileNames?.split(',') || [];
              item.attachFileIds = item.attachFileIds?.split(',') || [];
              return item;
            });
            return res;
          });
        } else {
          return Promise.resolve({ data: { list: [] }, total: 0 });
        }
      },
      showOverflow: false,
      showIndexColumn: true,
      // @ts-ignore
      treeConfig: false,
      mouseConfig: {
        area: false,
      },
      rowConfig: {
        keyField: '_X_ROW_KEY',
      },
      // @ts-ignore
      columns: recordColumns,
      keyboardConfig: {
        isBack: false,
      },
      toolbarConfig: {
        refresh: false,
        custom: false,
      },
      position: 'modal',
    },
  });

  /**
   * @description 初始化修改记录
   * @param data 修改数据列表
   */
  function init(data: { id: string }) {
    // nextTick(() => {
    //   const [list, mergeCells] = formatData(data);
    //   gridApi.grid.reloadData(list);
    //   setTimeout(gridApi.grid.setMergeCells, 0, mergeCells);
    // });
    repairId.value = data.id;
    nextTick(() => {
      gridApi.grid.commitProxy('query');
    });
  }

  const filePreviewRef = ref<any | null>(null);
  async function handlePreview(row: any, name: string, index: number) {
    const id = row.attachFileIds[index];

    if (!id) {
      return false;
    }

    const params = {
      name: name,
      Id: id,
      previewType: 'localPreview',
      noCache: false,
      isCopy: 0,
      // previewApi: Promise.resolve(),
    };
    filePreviewRef.value?.init(params);
  }
</script>
