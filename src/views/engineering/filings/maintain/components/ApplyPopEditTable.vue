<template>
  <div class="box">
    <Subtitle :title="t('dict.FilingsApplyColumn.GcDataStatus1')" class="mt-8px" :extra="{ show: true, hideAdd: true }">
      <template #extra>
        <!-- <a-button type="primary" :loading="translating" class="mr-10px" @click="handleTranslate">
          {{ t('sys.lang.translate') }}
        </a-button> -->
      </template>
    </Subtitle>
    <Grid style="height: calc(100% - 56px)">
      <template #shortMaterialCodes="{ row }">
        <MaterialNumberContent :list="row.shortMaterialCodes" />
      </template>

      <template #action="{ row }">
        <TableAction :outside="true" :actions="getTableActions(row)" />
      </template>
    </Grid>
  </div>
</template>

<script lang="ts" setup>
  import { nextTick, reactive, ref } from 'vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { pick } from 'lodash-es';
  import { useVbenVxeGrid, VxeGridProps } from '/@/adapter/vxe-table';
  import { getEditTableColumn, editRules, unitList, formatTableData, PRODUCT_TYPE_ENUM, langList, handleShortMaterialCodeChange } from './ApplyPopConfig';
  import { getTranslateInfo } from '/@/api/engineering/customsAffairsEngineering';
  import { isNullOrUnDef } from '/@/utils/is';
  import { getInnerMaterialNumbers } from '/@/api/engineering/sample';
  import { handleDblClickHead } from '/@/adapter/paster-event';

  import { Subtitle } from '/@/components/Subtitle';
  import { TableAction, ActionItem } from '/@/components/Table';
  import MaterialNumberContent from './materialNumberContent.vue';

  const { t } = useI18n();

  interface State {
    ids: Array<any>;
    initFields: any;
  }

  const state = reactive<State>({
    ids: [],
    initFields: {
      insidePartNumber: '',
      factory: '',
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
    id: 'engineering-filings-maintain-edit',
    columns: getEditTableColumn() as any,
    height: 'auto',
    keepSource: true,
    showOverflow: false,
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
    // data: [{ ...state.initFields }],
    proxyConfig: {
      enabled: false,
    },
    // showOverflow: false,
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
        const { cols, rows } = targetAreas[0];

        for (const row of rows) {
          for (const col of cols) {
            if (
              // 不是可编辑单元格，禁止粘帖，判断`col.editRender.enabled === false`是因为在配置`editRender.name`的情况下，可以开启编辑，但是此时`col.editRender.enabled`可能为`undefined`
              !col.editRender ||
              col.editRender.enabled === false ||
              // 当产品类型不为【胶类】时，【最小包装方式】、【最小包装数量】不可编辑，也禁止粘帖
              (row.productType !== PRODUCT_TYPE_ENUM.胶类 && (col.field === 'minPackingMode' || col.field === 'minPackingQty')) ||
              // 当产品类型不为【铜箔】时．【金属箔厚度(mm)】不可编辑，也禁止粘帖
              (row.productType !== PRODUCT_TYPE_ENUM.铜箔类 && col.field === 'thickness')
            ) {
              createMessage.warning(t('common.noPastingTip'));
              return false;
            }
          }
        }

        return true;
      },
    },
    // @ts-ignore
    i18nConfig: {
      moduleCode: 'CustomsAffairsEngineeringColumn',
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
      'header-cell-dblclick': params => {
        handleDblClickHead(params, gridApi);
        handleAfterPaster({ targetAreas: [{ cols: [params.column], rows: gridApi.getDataSource() }] });
      },
    },
  } as any);

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

  function handleAfterPaster({ targetAreas }) {
    if (targetAreas.length === 0) {
      return false;
    }
    const { cols, rows } = targetAreas[0];

    // 产品类型 复制粘帖处理
    handleAfterPasterProductType(cols, rows);

    // 是否单面自粘 复制粘帖处理
    handleAfterPasterYesOrNo(cols, rows, 'isSelfPaste');

    // 是否为保密料号 复制粘帖处理
    handleAfterPasterYesOrNo(cols, rows, 'isSecrecyMaterial');

    // 是否设变 复制粘帖处理
    handleAfterPasterYesOrNo(cols, rows, 'isSetChange');

    // 重量单位 复制粘帖处理
    handleAfterPasterWeightUnit(cols, rows);

    // 主材材料八码 复制黏贴处理
    handleAfterPasterShortMaterialCode(cols, rows);

    return true;
  }

  /**
   * 产品类型复制粘帖处理
   * @param cols
   * @param rows
   */
  function handleAfterPasterProductType(cols: Array<{ field: string }>, rows: Array<any>) {
    const targetIndex = cols.findIndex((item: any) => item.field === 'productType');
    if (targetIndex == -1) return false;

    rows.forEach(row => {
      const target = row.productTypeOptions.find(item => item.enCode === row.productType || item.fullName === row.productType);
      row.productType = target?.enCode || '';
      row.productTypeName = target?.fullName || '';
    });
  }

  /**
   * `是否选项`复制粘帖处理
   * @param cols
   * @param rows
   * @param field
   */
  function handleAfterPasterYesOrNo(cols: Array<{ field: string }>, rows: Array<any>, field: string) {
    const targetIndex = cols.findIndex((item: any) => item.field === field);
    if (targetIndex == -1) return false;

    rows.forEach((row: any) => {
      const target = row.yesOrNoOptions.find((item: any) => +item.enCode === +row[field] || item.fullName === row[field]);
      row[field] = target ? target.enCode : '';
      row[`${field}Name`] = target?.fullName || '';
    });
  }

  /**
   * 重量单位 复制粘帖处理
   * @param cols
   * @param rows
   */
  function handleAfterPasterWeightUnit(cols: Array<{ field: string }>, rows: Array<any>) {
    const targetIndex = cols.findIndex((item: any) => item.field === 'weightUnit');
    if (targetIndex == -1) return false;

    rows.forEach(row => {
      const target = unitList.find(item => item.Code === row.weightUnit || item.Name === row.weightUnit);
      row.weightUnit = target?.Code || '';
      row.weightUnitName = target?.Name || '';
    });
  }

  /**
   * 主材材料八码 复制黏贴处理
   * @param cols
   * @param rows
   */
  function handleAfterPasterShortMaterialCode(cols: Array<{ field: string }>, rows: Array<any>) {
    const targetIndex = cols.findIndex((item: any) => item.field === 'shortMaterialCodes');
    if (targetIndex === -1) return false;

    const params: Array<{ innerMaterialNumber: string }> = [];
    const todoRow: Array<any> = [];

    // 获取需要查询详情的八码
    rows.forEach(row => {
      if (isNullOrUnDef(row.shortMaterialCodes)) {
        row.shortMaterialCodes = [];
        row.singleMaterialNumbers = [];
        return;
      }
      if (typeof row.shortMaterialCodes === 'string') {
        row.shortMaterialCodes = row.shortMaterialCodes?.split(',').filter(Boolean) || [];
      }
      todoRow.push(row);
      row.shortMaterialCodes.forEach(item => {
        params.every(el => el.innerMaterialNumber !== item) && params.push({ innerMaterialNumber: item });
      });
    });

    // 查询八码详情
    params.length > 0 &&
      getInnerMaterialNumbers(params).then(res => {
        const map = Array.isArray(res?.data)
          ? res.data.reduce((prev, cur) => {
              prev[cur.innerMaterialNumber] = cur.originalModelNumber || '';
              return prev;
            }, {})
          : {};

        // 对每一行的数据进行赋值处理
        todoRow.forEach(row => {
          row.materialNumberMap = { ...map };
          handleShortMaterialCodeChange(row.shortMaterialCodes, [], row);
        });
      });
  }

  const translating = ref<boolean>(false);
  async function confirmTranslate() {
    return new Promise(resolve => {
      createConfirm({
        iconType: 'warning',
        title: t('common.tipTitle'),
        content: t('dict.CustomsAffairsEngineering.translateTip'),
        onOk: () => {
          resolve(true);
          return Promise.resolve();
        },
        onCancel: () => {
          resolve(false);
          return Promise.resolve();
        },
      });
    });
  }
  /**
   * 获取翻译后的数据
   */
  async function handleTranslate() {
    if (translating.value || !(await confirmTranslate())) {
      return false;
    }

    const list = await getTableData(false);
    const tableData = list.filter(item => !item.isTranslate);
    if (tableData.length === 0) {
      return false;
    }

    translating.value = true;
    gridApi.setLoading(true);
    return getTranslateInfo({
      customsAffairsApplyId: state.ids.join(','),
      engineeringUpInputs: [tableData[0]],
    })
      .then(res => {
        createMessage.success(t('sys.api.operationSuccess'));
        const engineerData = (Array.isArray(res?.data) ? res.data : []).map((item: any) => {
          item.isTranslate = true;
          return item;
        });
        gridApi.grid.reloadData(formatTableData(tableData.concat(engineerData), true));
      })
      .catch(() => {})
      .finally(() => {
        translating.value = false;
        gridApi.setLoading(false);
      });
  }

  // 获取需要传值给后端的有效字段
  function getEnableCols() {
    const fields: Array<string> = [];
    gridApi.grid
      .getColumns()
      .slice(1)
      .forEach((el: any) => {
        fields.push(el.field);
      });
    return fields.concat([
      'id',
      'customsAffairsApplyId',
      'productTypeName',
      'isSelfPasteName',
      'isSingleMaterialName',
      'isSecrecyMaterialName',
      'isSetChangeName',
      'weightUnitName',
      'isTranslate',
    ]);
  }

  /**
   * 初始化表格数据
   * @param data
   * @param ids
   */
  function initTableData(data: Array<any>, ids: Array<string>) {
    nextTick(() => {
      state.ids = Array.isArray(ids) ? ids : (ids as string).split(',');
      gridApi.grid.reloadData(formatTableData(data, true));
    });
  }

  /**
   * 获取表格数据
   */
  async function getTableData(isValidate = true) {
    if (isValidate && (await gridApi.grid.validate(true))) {
      createMessage.warning(t('dict.SalesSiteColumn.requiredTip'));
      throw new Error(t('dict.SalesSiteColumn.requiredTip'));
    }

    const listField: any = getEnableCols();
    const list = gridApi.getDataSource().map(el => {
      const obj = pick(el, listField);
      if (typeof obj.singleMaterialNumbers === 'string') {
        obj.singleMaterialNumbers = obj.singleMaterialNumbers.split(',').filter(Boolean);
      }
      // 将长度(`specSizeLength`)】、【宽度(`specSizeWidth`)】、【厚度(`specSizeThickness`)】三个字段，加上单位`mm`，拼凑成【规格尺寸(`specSize`)】
      obj.specSize = `${obj.specSizeLength}mm*${obj.specSizeWidth}mm*${obj.specSizeThickness}mm`;
      return obj;
    });

    return list;
  }

  /**
   * 引用历史数据
   * @param refData 引用的数据
   */
  function qutaHistory(refData: any) {
    // 获取可编辑字段用于赋值操作
    const fields = getEditTableColumn().reduce(
      (list: Array<string>, curr) => {
        curr.editRender && list.push(curr.field);
        return list;
      },
      ['singleMaterialNumbers'],
    );

    // 获取原始数据
    const originData = gridApi.getDataSource().find(row => !row.isTranslate);

    if (!originData) {
      // 是否存在原始数据
      return false;
    }

    if (originData.filingsLanguage !== refData.filingsLanguage) {
      // 校验语言是否一致
      createMessage.warning(
        t('dict.CustomsAffairsEngineering.filingsLanguageTip', [
          langList.find(item => `${item.enCode}` === `${refData.filingsLanguage}`)?.fullName || refData.filingsLanguage,
          langList.find(item => `${item.enCode}` === `${originData.filingsLanguage}`)?.fullName || originData.filingsLanguage,
        ]),
      );
      return false;
    }

    // 引用数据赋值
    fields.forEach(field => {
      originData[field] = refData[field];
    });

    // 加载数据
    gridApi.grid.reloadData(formatTableData([{ ...originData }], true)).then(() => {
      createMessage.success(t('sys.api.operationSuccess'));
    });
  }

  defineExpose({
    initTableData,
    getTableData,
    qutaHistory,
    handleTranslate,
  });
</script>

<style scoped lang="less">
  .box {
    display: flex;
    flex-direction: column;
    padding-bottom: 10px;
    height: 100%;
  }
</style>
