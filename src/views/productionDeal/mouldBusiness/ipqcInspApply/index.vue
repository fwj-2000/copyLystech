<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <!-- <BasicTable @register="registerTable">
          <template #tableTitle>
            <a-button v-auth="'btn_infoEntry'" type="primary" @click="handleInfoEntry">{{ t('dict.CommonCol.detectionInforInput') }}</a-button>
            <a-button v-auth="'btn_print'" @click="handlePrint">{{ t('common.printInspectionReport') }}</a-button>
          </template>
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'action'">
              <TableAction :actions="getTableActions(record)" />
            </template>
          </template>
        </BasicTable> -->
        <Grid>
          <template #toolbar-actions>
            <a-button v-auth="'btn_infoEntry'" type="primary" @click="handleInfoEntry">{{ t('dict.CommonCol.detectionInforInput') }}</a-button>
            <a-button v-auth="'btn_print'" @click="handlePrint">{{ t('common.printInspectionReport') }}</a-button>
          </template>
          <template #Status="{ rowIndex, row }">
            <a-tag :color="row.Status === 1 ? 'success' : 'error'">{{ row.Status === 1 ? t('common.valid') : t('common.invalid') }}</a-tag>
          </template>
          <template #action="{ rowIndex, row }">
            <TableAction :actions="getTableActions(row)" />
          </template>
        </Grid>
      </div>
    </div>
    <InfoEntryPopup @register="registerInfoEntryPopup" @reload="reload"></InfoEntryPopup>
    <printTemplatePopup @register="registerPrintPopup" @reload="reload"></printTemplatePopup>
  </div>
</template>

<script lang="ts" setup>
  import { onMounted } from 'vue';
  import { BasicTable, TableAction, useTable, ActionItem } from '/@/components/Table';
  import { columns, formConfig } from './config';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { usePopup } from '/@/components/Popup';
  import { formatTableDefaultText } from '/@/utils';
  import { usePermission } from '/@/hooks/web/usePermission';
  import InfoEntryPopup from './component/InfoEntryPopup.vue';
  import { getIpqcapply } from '/@/api/productionDeal/ipqc';
  import printTemplatePopup from './component/printTemplatePopup/index.vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { dateUtil } from '/@/utils/dateUtil';
  const { createMessage } = useMessage();
  defineOptions({ name: 'productionDeal-mouldBusiness-ipqcInspApply' });
  const { t } = useI18n();
  const { hasBtnP } = usePermission();

  // const [registerTable, { reload, getSelectRowKeys, getSelectRows, clearSelectedRowKeys, getFetchParams }] = useTable({
  //   api: getIpqcapply,
  //   columns,
  //   useSearchForm: true,
  //   striped: true,
  //   ellipsis: true,
  //   rowSelection: { type: 'checkbox' },
  //   clickToRowSelect: false,
  //   actionColumn: {
  //     width: 100,
  //     title: t('common.action'),
  //     dataIndex: 'action',
  //   },
  //   isCanResizeParent: true,
  //   canResize: true,
  //   pagination: {
  //     pageSize: 100,
  //   },
  //   formConfig: formConfig as any,
  //   transformCellText: ({ text }) => formatTableDefaultText(text),
  // });
  const [Grid, { getSelectRowKeys, reload }] = useVbenVxeGrid({
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
      schema: formConfig,
    },
    gridOptions: {
      id: 'productionDeal-mouldBusiness-inspectionMnt',
      columns: columns,
      showIndexColumn: true,
      showFooter: false,
      api: getIpqcapply,
      columnConfig: {
        isCurrent: true, // 启用列高亮
      },
      currentColumnConfig: {
        isFollowSelected: true, // 高亮跟随选中
      },
      beforeFetch: params => {
        const _params = {
          ...params,
        };
        if (params.pickerVal && params.pickerVal.length > 0) {
          _params.StartTime = dateUtil(params.pickerVal[0]).valueOf();
          _params.EndTime = dateUtil(params.pickerVal[1]).valueOf();
          delete _params.pickerVal;
        }
        return _params;
      },
    },
  });
  const [registerInfoEntryPopup, { openPopup: openInfoEntryPopup }] = usePopup();
  const [registerPrintPopup, { openPopup: openPrintPopup }] = usePopup();

  function handleInfoEntry() {
    openInfoEntryPopup(true, {
      title: t('common.enter'),
      type: 'add',
    });
  }

  function handlePrint() {
    const ids = getSelectRowKeys();
    if (ids && ids.length === 0) {
      return createMessage.warning(t('common.checkOperationText'));
    }
    if (ids && ids.length > 1) {
      return createMessage.warning(t('common.selectSingleDataTip'));
    }
    openPrintPopup(true, {
      title: t('common.printText'),
      ids: ids,
    });
  }

  function goEdit({ id }) {
    openInfoEntryPopup(true, {
      title: t('common.editText'),
      id,
      type: 'edit',
    });
  }
  function goDetail({ id }) {
    openInfoEntryPopup(true, {
      title: t('common.detailText'),
      id,
      type: 'view',
    });
  }

  function getTableActions(record): ActionItem[] {
    return [
      {
        icon: 'icon-ym icon-ym-edit',
        onClick: goEdit.bind(null, record),
        // auth: 'btn_edit',
      },
      {
        icon: 'icon-ym icon-ym-view',
        onClick: goDetail.bind(null, record),
        // auth: 'btn_detail',
      },
    ];
  }

  onMounted(() => {
    reload();
  });
</script>

<style lang="less" scoped>
  :deep(.lydc-content-wrapper-search-box) {
    margin-bottom: 0 !important;
  }

  :deep(.lydc-basic-table-action button i) {
    font-size: 18px;
  }

  .text-border {
    border-bottom: 1px solid #333;
    cursor: pointer;
  }

  .table-a {
    color: #ff7b00;
    cursor: pointer;
  }
</style>
