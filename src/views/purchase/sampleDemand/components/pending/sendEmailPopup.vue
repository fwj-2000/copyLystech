<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    :showOkBtn="true"
    :okText="t('common.sendEmail')"
    :title="t('common.sendEmail')"
    @ok="() => handleSend()"
    class="full-popup">
    <div class="h-full requirement-pop p-10px">
      <div class="lydc-content-wrapper-search-box pt-8px">
        <Subtitle :title="t('common.sendEmail')" />
        <BasicForm @register="registerForm" />
      </div>
      <Grid style="height: calc(100vh - 160px)" />
    </div>
  </BasicPopup>
</template>

<script lang="ts" setup>
  import type { VxeTableGridOptions } from '/@/adapter/vxe-table';

  import { nextTick } from 'vue';
  // import { splitArrayIntoChunks } from '/@/utils/splitArrayIntoChunks';
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { pick } from 'lodash-es';
  import { BasicForm, useForm } from '/@/components/Form';
  import { sendEmail, getApplyDatas } from '/@/api/engineering/sample';
  import { schemas, getEditTableColumn, editRules } from './configVxe';
  import { Subtitle } from '/@/components/Subtitle';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  // import { getSuppliersByNames } from '/@/api/engineering/mould';

  const emits = defineEmits(['register', 'reload']);

  const { t } = useI18n();

  const { createMessage } = useMessage();

  const [registerForm, { getFieldsValue, validate }] = useForm({
    baseColProps: {
      span: 24,
    },
    layout: 'horizontal',
    i18nConfig: {
      moduleCode: 'QuantitativeApplyColumn',
      transferRange: ['label'],
    },
    schemas,
  });

  const gridOptions: DeepPartial<VxeTableGridOptions<any>> = {
    id: 'purchase-sampleDemand-Pending-sendEmail-list-grid',
    columns: getEditTableColumn() as any,
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
    toolbarConfig: {
      enabled: true,
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
    return getApplyDatas(data.ids, true)
      .then(res => {
        const resData = (res.data || []).sort(
          // 根据传入的id顺序进行排序
          (a: { id: string }, b: { id: string }) => data.ids.indexOf(a.id) - data.ids.indexOf(b.id),
        );

        gridApi.grid.reloadData(resData);
      })
      .catch(() => {
        closePopup();
      })
      .finally(() => {
        changeLoading(false);
        // initSupplierList();
      });
  }

  // const supplierList: Array<any> = [];
  // const supplierColumn = {
  //   title: '供应商简称',
  //   field: 'supplierId',
  //   width: 200,
  //   i18nField: 'supplierName',
  //   editRender: {
  //     name: 'ASelect',
  //     cacheField: 'supplierName',
  //     props: {
  //       options: [] as Array<{ label: string; value: string }>,
  //       showSearch: true,
  //       filterOption: (inputValue: string, option: any) => option.label.includes(inputValue),
  //     },
  //   },
  // };
  // async function initSupplierList() {
  //   if (supplierList.length === 0) {
  //     await getSupplierList({ pageSize: 10000 }).then(res => {
  //       supplierList.push(...res.data);
  //     });
  //   }

  //   const columns = gridApi.grid.getColumns();
  //   const targetIndex = columns.findIndex(el => el.field === 'supplierId');
  //   if (targetIndex !== -1) {
  //     supplierColumn.editRender.props.options = supplierList.map(item => ({ label: item.shortName, value: item.id }));
  //     columns.splice(targetIndex, 1, supplierColumn as any);
  //     gridApi.reloadColumn(columns);
  //   }
  // }

  async function handleSend() {
    const flag = await validate();
    if (!flag) {
      return false;
    }

    if (await gridApi.grid.validate(true)) {
      return createMessage.warning(t('dict.SalesSiteColumn.requiredTip'));
    }

    const formData = getFieldsValue();
    const list = gridApi.grid.getFullData().map(item => pick(item, ['id', 'supplierId', 'supplierName']));

    changeOkLoading(true);
    return sendEmail(list, formData.themeText)
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

  function handleAfterPaster({ targetAreas, pasteCells }) {
    if (!targetAreas.length) return false;

    const { cols, rows } = targetAreas[0];
    if (!rows.length) return false;

    const pasteCellData = [...(pasteCells || [])];
    if (pasteCellData.length === 1 && rows.length > 1) {
      const oneRow = pasteCellData[0];
      pasteCellData.length = 0;
      for (let i = 0; i < rows.length; i++) pasteCellData.push(oneRow);
    }

    let targetIndex = cols.findIndex((c: any) => c.field === 'supplierName');
    if (targetIndex === -1) {
      targetIndex = cols.findIndex((c: any) => c.field === 'supplierId');
    }
    if (targetIndex === -1) return false;

    const dataSource = gridApi.getDataSource();

    const dataList = rows.map((row: any, index: number) => {
      const targetValue = pasteCellData?.[index]?.[targetIndex] || '';
      const dataItem = dataSource.find(unit => unit.supplierName === targetValue);

      return Object.assign(row, dataItem ? { supplierId: dataItem.supplierId, supplierName: dataItem.supplierName } : { supplierId: '', supplierName: '' });
    });

    if (!dataList.length) return false;

    nextTick(() => {
      gridApi.grid.setRow(dataList);
    });

    return true;
  }
</script>

<style lang="less" scoped>
  :deep(.lydc-basic-table-action button i) {
    font-size: 18px;
  }

  .requirement-pop {
    display: flex;
    flex-direction: column;
    padding-bottom: 10px;
  }
</style>
