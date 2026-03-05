<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    :showOkBtn="true"
    :okText="t('common.submit')"
    :title="title"
    @ok="handleSave"
    class="full-popup popup-top">
    <template #centerToolbar>
      <a-button class="ml-12px" @click="() => handleSave(false)" type="primary" ghost>{{ t('common.temporarySave') }}</a-button>
    </template>

    <div class="h-full requirement-pop p-10px">
      <Subtitle :title="title" class="mt-8px" :extra="{ show: false, hideAdd: true }" />
      <Grid>
        <template #action="{ row }">
          <TableAction :outside="true" :actions="getTableActions(row)" />
        </template>
      </Grid>
    </div>
  </BasicPopup>
</template>

<script lang="ts" setup>
  import { reactive, nextTick, ref } from 'vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { pick } from 'lodash-es';
  import { useVbenVxeGrid, VxeGridProps } from '/@/adapter/vxe-table';
  import { getEditTableColumn, editRules, getDict, unitList } from './ApplyPopConfig';
  import { FILING_TYPE_ENUM } from '../config';
  import { saveClearPort, temporaryStoragClearPort, saveInland, temporaryStoragInland, getDetail } from '/@/api/logisticAffairs/filingsFinalForm';

  import { TableAction, ActionItem } from '/@/components/Table';
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { Subtitle } from '/@/components/Subtitle';

  interface State {
    type: `${FILING_TYPE_ENUM}`;
    initFields: any;
  }

  const { t } = useI18n();
  const emits = defineEmits(['register', 'reload']);
  const title = ref<string>(t('views.finalFilingForm.exportMainlandFilingForm'));

  const state = reactive<State>({
    type: FILING_TYPE_ENUM.出口内地备案表,
    initFields: {
      insidePartNumber: '',
      customsAffairsApplyId: '',
      sellCorporation: '',
      filingsLanguage: '',
      prot: '',
      shipmentType: '',
      pdPersonId: '',
      immediateCustomerPartNumber: '',
      terminalCustomerPartNumber: '',
      immediateCustomerName: '',
    },
  });
  // 可编辑状态列表
  const { createMessage, createConfirm } = useMessage();

  const gridOptions: VxeGridProps = {
    columns: getEditTableColumn() as any,
    height: 'auto',
    keepSource: true,
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
    data: [{ ...state.initFields }],
    proxyConfig: {
      enabled: false,
    },
    showOverflow: false,
    toolbarConfig: {
      enabled: false,
    },
    clipConfig: {
      isPaste: true,
      afterPasteMethod: handleAfterPaster,
      beforePasteMethod: ({ targetAreas }) => {
        // 粘帖前的校验处理
        if (targetAreas.length === 0) {
          return false;
        }
        const { cols } = targetAreas[0];

        for (const col of cols) {
          if (
            // 不是可编辑单元格，禁止粘帖，判断`col.editRender.enabled === false`是因为在配置`editRender.name`的情况下，可以开启编辑，但是此时`col.editRender.enabled`可能为`undefined`
            !col.editRender ||
            col.editRender.enabled === false ||
            col.editRender.props?.disabled === true
          ) {
            createMessage.warning(t('common.noPastingTip'));
            return false;
          }
        }

        return true;
      },
    },
    // @ts-ignore
    i18nConfig: {
      moduleCode: 'CustomsAffairsFinalVersion',
    },
    pagerConfig: {
      enabled: false,
    },
  };
  const [Grid, gridApi] = useVbenVxeGrid({
    gridOptions,
    gridEvents: {
      // @ts-ignore
      'cell-delete-value': ({ row, column }) => {
        handleAfterPaster({ targetAreas: [{ cols: [column], rows: [row] }] });
      },
      'header-cell-dblclick': ({ column }) => {
        const includesFields = getEnableCols();

        const tableData = gridApi.getDataSource();

        if (!includesFields.includes(column.field)) return;
        if (tableData.length <= 1) return;
        const copyValue = tableData[0][column.field] || '';
        tableData.forEach((el: any, index: number) => {
          if (index === 0) {
            return false;
          }
          el[column.field] = copyValue;
        });
        handleAfterPaster({ targetAreas: [{ cols: [column], rows: tableData.slice(1) }] });
      },
    },
  });

  const [registerPopup, { closePopup, /** changeOkLoading, */ changeLoading }] = usePopupInner(init);

  async function init(data: { type: `${FILING_TYPE_ENUM}`; list?: Array<any> }) {
    await getDict();
    state.type = data.type;
    title.value =
      data.type === FILING_TYPE_ENUM.出口内地备案表 ? t('views.finalFilingForm.exportMainlandFilingForm') : t('views.finalFilingForm.outboundFilingForm');
    await gridApi.reloadColumn(getEditTableColumn(data.type) as any);

    return nextTick(() => {
      if (data.list && data.list.length > 0) {
        // gridApi.grid.reloadData(data.list);
        getTableData(data.list.map(item => item.customsAffairsApplyId));
      }
    });
  }

  function getTableData(ids: Array<string>) {
    changeLoading(true);
    getDetail(state.type, ids)
      .then(res => {
        // gridApi.grid.reloadData(res.data.filter((item: any) => `${item.finalVersionType}` === `${state.type}`));
        gridApi.grid.reloadData(res.data);
      })
      .finally(() => {
        changeLoading(false);
      });
  }

  function getTableActions(row: any): ActionItem[] {
    return [
      {
        label: '',
        color: 'error',
        icon: 'icon-ym icon-ym-delete',
        tooltip: t('common.delText'),
        onClick: handleDelete.bind(null, row),
      },
    ];
  }

  // 删除数据
  function handleDelete(row: any) {
    createConfirm({
      iconType: 'warning',
      title: t('common.tipTitle'),
      content: t('common.batchDelTip'),
      onOk: () => {
        gridApi.grid.remove(row);
        return Promise.resolve();
      },
    });
  }

  // 获取需要传值给后端的有效字段
  function getEnableCols() {
    const fields: Array<string> = [];
    gridApi.grid
      .getColumns()
      .slice(1, -1)
      .forEach((el: any) => {
        if (el.editRender && !el.editRender.disabled) {
          fields.push(el.field);
        }
      });
    return fields.concat(['customsAffairsApplyId', 'declUnitName', 'legalUnit', 'id']);
  }
  async function handleSave(isSubmit = true) {
    if (isSubmit && (await gridApi.grid.validate(true))) {
      return createMessage.warning(t('dict.SalesSiteColumn.requiredTip'));
    }

    const listField: any = getEnableCols();
    const list = gridApi.getDataSource().map(el => pick(el, listField));

    let api: any = null;
    if (state.type === FILING_TYPE_ENUM.出口内地备案表) {
      api = isSubmit ? saveInland : temporaryStoragInland;
    } else {
      api = isSubmit ? saveClearPort : temporaryStoragClearPort;
    }

    changeLoading(true);
    return api(list)
      .then(() => {
        createMessage.success(t('sys.api.operationSuccess'));
        emits('reload');
        // 如果不是`提交`，则不关闭当前编辑页面
        isSubmit && closePopup();
      })
      .finally(() => {
        changeLoading(false);
      });
  }

  function handleAfterPaster({ targetAreas }) {
    if (targetAreas.length === 0) {
      return false;
    }
    const { cols, rows } = targetAreas[0];

    // 当黏贴只有一行有数据时，将粘贴的数据填充到每一行
    // const pasteCellData = [...pasteCells];
    // if (pasteCellData.length === 1 && rows.length > 1) {
    //   const target = pasteCells[0];
    //   pasteCellData.length = 0;
    //   for (let i = 0; i < rows.length; i++) {
    //     pasteCellData.push(target);
    //   }
    // }

    handleAfterPasterUnit(cols, rows, 'declUnit');
    handleAfterPasterUnit(targetAreas[0].cols, rows, 'legalUnit');
    return true;
  }

  /**
   * 单位 复制粘帖处理
   * @param cols
   * @param rows
   */
  function handleAfterPasterUnit(cols: Array<{ field: string }>, rows: Array<any>, field: string) {
    const targetIndex = cols.findIndex((item: any) => item.field === field);
    if (targetIndex == -1) return false;

    rows.forEach(row => {
      const target = unitList.find(item => item.Code === row[field] || item.Name === row[field]);
      row[field] = target?.Code || '';
      row[`${field}Name`] = target?.Name || '';
    });
  }
</script>

<style lang="less" scoped>
  .popup-top {
    top: 0;
  }

  :deep(.lydc-basic-table-action button i) {
    font-size: 18px;
  }

  :deep(.basic-content-wrap) {
    display: inline-flex;
  }

  .basic-form {
    display: inline-block;
    width: 200px;
    margin-right: 8px;
  }

  .requirement-pop {
    display: flex;
    flex-direction: column;
    padding-bottom: 10px;
  }
</style>
