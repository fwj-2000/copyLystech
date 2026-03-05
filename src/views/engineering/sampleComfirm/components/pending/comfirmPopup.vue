<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    :showOkBtn="true"
    :okText="t('common.submit')"
    :title="t('common.detailText')"
    @ok="handleSubmit"
    class="full-popup">
    <!-- <template #insertToolbar>
      <a-button class="mr-3" @click="handleSave(false)" type="primary" ghost>{{ t('common.temporarySave') }}</a-button>
    </template> -->
    <div class="h-full requirement-pop p-10px">
      <Grid>
        <template #buttons>
          <Subtitle :title="t('common.detailText')">
            <template #afterTitle>
              <a-button type="primary" class="mr-3 green-btn" ghost @click="handleChangeStatus(2)">{{ t('dict.OpinionTypeEnum.Satisfy') }}</a-button>
              <a-button type="primary" class="mr-3" ghost @click="handleChangeStatus(3)">{{ t('dict.OpinionTypeEnum.Discontent') }}</a-button>
              <a-button type="primary" danger ghost @click="handleChangeStatus(4)">{{ t('common.stopText') }}</a-button>
            </template>
          </Subtitle>
        </template>
      </Grid>
    </div>
  </BasicPopup>
</template>

<script lang="ts" setup>
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { pick } from 'lodash-es';
  import { getApplyDatas, confirmOpinion } from '/@/api/engineering/sample';
  import { getConfirmTableColumn, editRules, opinionOptions } from './configVxe';
  import { STATUS_ENUM } from '../../config';
  import { useVbenVxeGrid, VxeGridProps } from '/@/adapter/vxe-table';
  import { Subtitle } from '/@/components/Subtitle';

  const emits = defineEmits(['register', 'reload']);

  const { t } = useI18n();

  const { createMessage } = useMessage();

  const gridOptions: VxeGridProps = {
    // id: 'SampleComfirmVxeTable',
    columns: getConfirmTableColumn() as any,
    height: 'auto',
    editConfig: {
      trigger: 'dblclick',
      mode: 'row',
    },
    editRules,
    rowConfig: {
      keyField: '_X_ROW_KEY',
    },
    areaConfig: {
      multiple: true, // 是否启用多区域选取功能
    },
    proxyConfig: {
      enabled: false,
    },
    columnConfig: {
      // 最大冻结数
      maxFixedSize: 30,
    },
    toolbarConfig: {
      enabled: true,
      refresh: false,
      slots: {
        buttons: 'buttons',
      },
    },
    // customConfig: {
    //   storage: {
    //     resizable: true,
    //     sort: true,
    //     fixed: true
    //   }
    // },
    clipConfig: {
      isPaste: true,
    },
    // @ts-ignore
    i18nConfig: {
      moduleCode: 'SampleApplyColumn',
    },
    pagerConfig: {
      enabled: false,
    },
  };
  const [Grid, gridApi] = useVbenVxeGrid({ gridOptions });

  const [registerPopup, { closePopup, changeOkLoading, changeLoading }] = usePopupInner(init);

  async function init(data) {
    changeLoading(true);
    getApplyDatas(data.ids, true)
      .then(res => {
        const resData = (res.data || [])
          .map((item: any) => {
            return {
              ...item,
              opinion: STATUS_ENUM.待确认,
            };
          })
          .sort(
            // 根据传入的id顺序进行排序
            (a: { id: string }, b: { id: string }) => data.ids.findIndex((id: string) => id === a.id) - data.ids.findIndex((id: string) => id === b.id),
          );
        console.log(resData, 'resDataresData');
        gridApi.grid.reloadData(resData);
      })
      .catch(() => {
        closePopup();
      })
      .finally(() => {
        changeLoading(false);
      });
  }

  async function handleSubmit() {
    if (await gridApi.grid.validate(true)) {
      return createMessage.warning(t('dict.SalesSiteColumn.requiredTip'));
    }
    const list = gridApi.grid.getFullData().map(item => pick(item, ['id', 'reason', 'opinion']));
    changeOkLoading(true);
    return confirmOpinion(list)
      .then(() => {
        createMessage.success(t('sys.api.operationSuccess'));
        emits('reload');
        closePopup();
      })
      .catch(() => {})
      .finally(() => {
        changeOkLoading(false);
      });
  }

  function handleChangeStatus(status: number) {
    const opinionName = opinionOptions.find(item => item.value === status)?.label;
    if (!opinionName) {
      return false;
    }

    const records = gridApi.grid.getCheckboxRecords();
    gridApi.grid.setRow(records, { opinionName, opinion: status || '' });
  }
</script>

<style lang="less" scoped>
  :deep(.lydc-basic-table-action button i) {
    font-size: 18px;
  }

  :deep(div.lydc-subtitle-container) {
    padding-bottom: 0;
  }

  :deep(.vxe-table--fixed-left-wrapper, .vxe-table--fixed-right-wrapper) {
    z-index: 2 !important;
    height: calc(100% - 15px) !important;
  }

  .requirement-pop {
    display: flex;
    flex-direction: column;
    padding-bottom: 10px;
  }

  .green-btn,
  .green-btn:not(:disabled):hover {
    color: #52c41a;
    border-color: #52c41a;
  }
</style>
