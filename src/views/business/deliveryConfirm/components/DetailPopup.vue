<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    :showOkBtn="state.isEdit"
    :showCancelBtn="true"
    :okText="t('common.submitText')"
    :okButtonProps="{ class: 'mr-12px' }"
    :title="t('common.deliveryComfirm')"
    destroyOnClose
    @ok="handleSubmit"
    class="full-popup">
    <template #insertToolbar>
      <!-- <a-button class="mr-3" @click="handleSubmit('storage')" type="primary" ghost>暂存</a-button> -->
      <!-- <a-divider type="vertical" class="ml-10px"></a-divider> -->
    </template>
    <div class="p-10px h-full">
      <Subtitle :title="t('common.deliveryComfirm')">
        <template v-if="state.isEdit" #afterTitle>
          <a-button type="primary" ghost @click="handleStatus(11, t('common.agree'))" class="mr-3">{{ t('common.agree') }}</a-button>
          <a-button type="primary" ghost @click="handleStatus(12, t('common.disagree'))">{{ t('common.disagree') }}</a-button>
        </template>
      </Subtitle>
      <Grid style="height: calc(100% - 60px)" />
    </div>
  </BasicPopup>
</template>
<script setup lang="ts">
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { Subtitle } from '/@/components/Subtitle';
  import { reactive } from 'vue';
  import { getColumns, handleQuotaCols, sampleCols } from '../config';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { storageDetail, updatePMDetail, getPMDetails } from '/@/api/productionPlan/mainplan';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { dateUtil } from '/@/utils/dateUtil';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { pick } from 'lodash-es';

  const { createMessage } = useMessage();

  const emits = defineEmits(['reload']);
  const [registerPopup, { closePopup, changeLoading, changeOkLoading }] = usePopupInner(init);

  const state = reactive({
    total: 0,
    currentIndex: 0,
    ids: [],
    id: '',
    prefix: '_time_',
    /**
     * @description 是否可以编辑
     * @type { boolean }
     */
    isEdit: false,
  });

  const { t } = useI18n();

  const [Grid, gridApi] = useVbenVxeGrid({
    showSearchForm: false,
    gridOptions: {
      id: 'business-deliveryConfirm-edit',
      columns: getColumns() as any,
      height: 'auto',
      editConfig: {
        trigger: 'dblclick',
        mode: 'row',
        beforeEditMethod: () => state.isEdit,
      },
      checkboxConfig: {
        checkMethod: () => state.isEdit,
      },
      rowConfig: {
        keyField: 'id',
      },
      areaConfig: {
        multiple: true, // 是否启用多区域选取功能
      },
      // @ts-ignore
      proxyConfig: {
        enabled: false,
      },
      toolbarConfig: {
        enabled: false,
      },
      clipConfig: {
        isPaste: true,
      },
      pagerConfig: {
        enabled: false,
      },
      i18nConfig: {
        moduleCode: 'QuantitativeDeliveryConfirmColumn',
      },
      position: 'modal',
    },
  });

  const { clearSelectedRowKeys, getDataSource } = gridApi;

  async function init(data) {
    // `view`模式下，禁止编辑
    const isView = data.type === 'view';

    changeLoading(true);
    try {
      const r = await getPMDetails(pick(data, ['ids', 'applyNo', 'innerMaterialNumber']));
      if (r.code == 200) {
        const { demandType } = r.data[0];
        let _cols: any = [];
        let isPushCol = true; // 是否已经设置过动态表头
        const _list = r.data.map((item, i) => {
          item = {
            ...item,
            status: item.status ? item.status : '6',
          };
          // 量试
          isPushCol = i == 0;
          if (item.deliveryPlanList) {
            item.deliveryPlanList.map(el => {
              const _time = dateUtil(el.deliveryPlanTime).format('YYYY/MM/DD');
              item[state.prefix + _time] = el.deliveryPlanQty;
              // 添加动态表头
              if (isPushCol) {
                _cols.push({
                  title: _time,
                  field: state.prefix + _time,
                  width: 180,
                });
              }
            });
          }
          return item;
        });
        // 判断是否存在 `待确认(16)` 的数据项，如果是允许编辑
        state.isEdit = !isView && _list.some(getIsEdit);
        _cols = demandType == 'Quantitative' ? handleQuotaCols(_cols) : sampleCols;
        // 是否允许编辑
        gridApi.setGridOptions({ editConfig: { enabled: state.isEdit } });
        // 加载对应的列配置
        await gridApi.reloadColumn(_cols);
        // 加载数据
        gridApi.reloadData(_list);
      }
      changeLoading(false);
    } catch (error) {
      console.log(error);
      closePopup();
    }
  }

  /**
   * @description 判断是否可以编辑，数据状态为 `待确认(16)` ，则允许进行编辑
   * @param row 当前行数据
   */
  function getIsEdit(row: { status: number | string }) {
    // 数据状态为 `待确认(16)` ，则允许进行编辑
    return +row.status === 16;
  }

  function handleStatus(type, typeDesc) {
    const rows = gridApi.getSelectRows();
    if (rows.length > 0) {
      gridApi.grid.setRow(rows, { status: type, statusDesc: typeDesc });
    }
    clearSelectedRowKeys();
  }

  async function handleSubmit(type) {
    changeOkLoading(true);
    const params = getDataSource().map(item => {
      return {
        id: item.id,
        handleStatus: item.status,
        handleOpinion: item.handleOpinion,
      };
    });
    try {
      const r = type == 'storage' ? await storageDetail(params) : await updatePMDetail(params);
      if (r.code == 200) {
        createMessage.success(t('sys.api.operationSuccess'));
        closePopup();
        emits('reload');
      }
      changeOkLoading(false);
    } catch (error) {
      console.log(error);
      changeOkLoading(false);
    }
  }
</script>

<style scoped lang="less">
  :deep(.vxe-grid--layout-body-wrapper) {
    padding-left: 0;
    padding-right: 0;
  }
</style>
