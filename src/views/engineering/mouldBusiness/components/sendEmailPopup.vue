<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    :showOkBtn="true"
    :okText="t('common.sendText')"
    :show-cancel-btn="true"
    :title="state.title"
    destroyOnClose
    class="full-popup pb-10px"
    @ok="handleSubmitFn">
    <div class="email h-full">
      <div class="email-header">
        <Subtitle :title="state.title" class="ml-10px"></Subtitle>
      </div>
      <div class="email-content">
        <div>
          <BasicForm labelAlign="right" :schemas="schemas" @register="registerForm" class="p-12px">
            <template #drawing>
              <div class="drawings-name">
                <a-tooltip placement="top" v-for="item in state.moldDrawings" :title="item.fileName" class="text-ellipsis">
                  <a class="table-a" @click="() => handlePreview(item)">
                    {{ item.fileName }}
                    <i class="icon-ym icon-ym-btn-download" @click.stop="handleFileDownload(item)"></i>
                  </a>
                </a-tooltip>
              </div>
            </template>
          </BasicForm>
        </div>

        <Grid style="height: calc(100% - 52px)">
          <template #action="{ rowIndex, row }">
            <TableAction :actions="getTableActions(row, rowIndex)" />
          </template>
        </Grid>
      </div>
    </div>
  </BasicPopup>
  <Preview ref="filePreviewRef" />
</template>
<script setup lang="ts">
  import { ref, reactive, nextTick } from 'vue';
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { Subtitle } from '/@/components/Subtitle';
  import { ActionItem } from '/@/components/Table';
  import {
    getVxeProcurementColumns,
    purchaseTypeOptions,
    handleSupplierChange,
    MOLD_MODIFY_TYPE,
    ITEM_TYPE_ENUM,
    getPurchaseTypeOptions,
  } from './sendEmailConfig';
  import { BasicForm, FormSchema, useForm } from '/@/components/Form';
  import Preview from '/@/components/Upload/src/components/Preview.vue';
  import { compareprices, purchase, resendPurchaseEmail, getSuppliersByNames, getEmaildatalist } from '/@/api/engineering/mould';
  import { splitArrayIntoChunks } from '/@/utils/splitArrayIntoChunks';
  import { useMessage } from '/@/hooks/web/useMessage';
  import TableAction from '/@/components/Table/src/components/TableAction.vue';
  import dayjs from 'dayjs';
  import { omit } from 'lodash-es';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { getUserInfoList } from '/@/api/permission/user';
  import { getUserListByAccountList } from '/@/api/business/salesForecast';
  import { downloadFile } from '/@/utils/file/download';
  import { useRoute } from 'vue-router';

  const emits = defineEmits(['reload']);

  const state = reactive({
    title: '',
    dataSource: [] as any,
    columns: [] as any,
    tableData: [] as any,
    contactsList: {} as { [key: string]: any[] },
    supplierId: '',
    supplierType: '',
    moldDrawings: [] as Array<{ fileName: string; filePath: string }>,
  });

  const route = useRoute();
  const { t } = useI18n();
  const { createMessage, createConfirm } = useMessage();
  /** 是否重新发送 */
  const isResend = ref(false);

  const [registerForm, { getFieldsValue, validate }] = useForm({
    labelWidth: 60,
    rowProps: {
      gutter: 46,
    },
  });
  const schemas: FormSchema[] = [
    {
      field: 'subject',
      labelWidth: 100,
      component: 'Input',
      label: t('common.theme') + ':',
      rules: [{ required: true, message: t('common.theme'), trigger: 'blur' }],
    },
    {
      field: 'drawing',
      labelWidth: 100,
      component: 'Input',
      label: t('common.attachment') + ':',
      slot: 'drawing',
    },
  ];
  const [registerPopup, { closePopup, changeLoading, changeOkLoading }] = usePopupInner(init);

  const [Grid, gridApi] = useVbenVxeGrid({
    showSearchForm: false,
    formOptions: undefined,
    gridOptions: {
      id: `${route.path.slice(1).replaceAll('/', '-')}-sendEamil`,
      editConfig: {
        enabled: true,
        trigger: 'dblclick',
        mode: 'row',
      },
      rowConfig: {
        keyField: '_X_ROW_KEY',
      },
      columns: getVxeProcurementColumns(state.title === t('dict.MoldFlowNode.Purchase')),
      editRules: {
        supplier: [{ required: true, message: t('sys.validate.textRequiredSuffix') }],
        designatedEngReviewerId: [
          {
            validator({ cellValue, row }) {
              if (!cellValue && row.supplierType != 'External') {
                return new Error(t('sys.validate.textRequiredSuffix'));
              }
            },
          },
        ],
        deliveryAddress: [{ required: true, message: t('sys.validate.textRequiredSuffix') }],
        purchaseType: [{ required: true, message: t('sys.validate.textRequiredSuffix') }],
      },
      pagerConfig: {
        enabled: false,
      },
      toolbarConfig: {
        enabled: true,
        refresh: false,
      },
      customConfig: {
        allowVisible: false,
      },
      clipConfig: {
        isPaste: true,
        afterPasteMethod: handleAfterPaster,
      },
      i18nConfig: {
        moduleCode: 'MoldApplyColumn',
      },
    },
    gridEvents: {
      headerCellDblclick: headerCellDblclick,
      // @ts-ignore
      'cell-delete-value': ({ cellAreas }) => {
        const { cols, rows } = cellAreas[0];
        if (cols.some((col: any) => col.field === 'supplier')) {
          rows.forEach((row: any) => {
            handleSupplierChange(void 0, void 0, row);
          });
        }
      },
    },
  });

  function handleAfterPaster({ targetAreas, pasteCells }) {
    if (targetAreas.length === 0) {
      return false;
    }
    const { cols, rows } = targetAreas[0];

    // 当黏贴只有一行有数据时，将粘贴的数据填充到每一行
    const pasteCellData = [...pasteCells];
    if (pasteCellData.length === 1 && rows.length > 1) {
      const target = pasteCells[0];
      pasteCellData.length = 0;
      pasteCellData.push(...Array.from({ length: rows.length }).fill(target));
    }

    // 供应商复制处理
    handleAfterSupplier(cols, rows, pasteCellData);

    // 用户复制黏贴处理
    handleAfterPasterUser(cols, rows, { id: 'designatedEngReviewerId', name: 'designatedEngReviewerName' });

    // 采购类型复制黏贴处理
    handleAfterPurchaseType(cols, rows);
  }

  function handleAfterSupplier(cols, rows, pasteCells) {
    const targetIndex = cols.findIndex((item: any) => item.field === 'supplier');
    if (targetIndex == -1) return false;

    // 处理请求参数
    const list = pasteCells.map((item: any) => item[targetIndex]);
    const chunks = splitArrayIntoChunks(list, 500);

    const promiseList: Array<Promise<any>> = [];
    // 收集请求
    chunks.forEach(item => {
      promiseList.push(getSuppliersByNames(item));
    });
    // 执行请求并且赋值
    Promise.all(promiseList).then(res => {
      const data = res.reduce((prev, cur) => {
        return prev.concat(cur.data);
      }, []);

      const dataList = rows.map((item: any, index: number) => {
        const targetValue = pasteCells?.[index]?.[targetIndex] || '';
        const dataItem = data.find((unit: any) => unit.name === targetValue);
        if (targetValue) {
          handleSupplierChange(targetValue, dataItem, item);
        }
        return Object.assign(item, {
          supplier: dataItem?.name || '',
        });
      });
      if (dataList.length == 0) return false;
      nextTick(() => {
        gridApi.grid.setRow(dataList);
      });
    });
  }

  /**
   * 复制黏贴用户处理
   * @param cols 复制的列配置
   * @param rows 复制的行内容
   * @param pasteCellData 复制的内容
   * @param fieldConfig 赋值字段配置
   */
  function handleAfterPasterUser(cols: Array<{ field: string }>, rows: Array<any>, fieldConfig: { id: string; name: string }) {
    const targetIndex = cols.findIndex((item: any) => item.field === fieldConfig.id);
    if (targetIndex == -1 || rows.length === 0) return false;

    const { idList, accountList } = rows.reduce<{ idList: Array<string>; accountList: Array<string> }>(
      (obj, item: { [key: string]: string }) => {
        const value = item[fieldConfig.id] || '';
        // 如果是外部供应商，直接将内容复制给字段即可
        if (item.supplierType === 'External') {
          item[fieldConfig.name] = value;
          return obj;
        }

        // 内部供应商梳理
        // 如果是纯数字组成，则是id，否则按照accountList计算
        if (value && /^\d+$/.test(value)) {
          obj.idList.push(value);
        } else if (value) {
          const account = value.split('/').pop() || '';
          account && obj.accountList.push(account);
        }
        return obj;
      },
      { idList: [], accountList: [] },
    );

    Promise.all([
      idList.length > 0 ? getUserInfoList([...new Set(idList)]) : Promise.resolve({ data: [] }),
      accountList.length > 0 ? getUserListByAccountList([...new Set(accountList)]) : Promise.resolve({ data: {} }),
    ]).then(res => {
      const userList = [
        ...(res[0]?.data?.list || []),
        ...Object.values(res[1]?.data || {}).map((item: any) => ({ ...item, fullName: item.MergeName, id: item.Id })),
      ];
      rows.forEach((row: any) => {
        if (row.supplierType === 'External') {
          const value = row[fieldConfig.id] || '';
          return Object.assign(row, { [fieldConfig.id]: value, [fieldConfig.name]: value });
        }

        const target = userList.find(item => item.id === row[fieldConfig.id] || item.fullName === row[fieldConfig.id]);
        Object.assign(row, { [fieldConfig.id]: target?.id || '', [fieldConfig.name]: target?.fullName || '' });
      });
    });
  }

  /**
   * 复制黏贴采购类型处理
   * @param cols
   * @param rows
   */
  function handleAfterPurchaseType(cols: Array<{ field: string }>, rows: Array<any>) {
    const targetIndex = cols.findIndex((item: any) => item.field === 'purchaseType');
    if (targetIndex == -1) return false;

    for (const row of rows) {
      const targetValue = row.purchaseType || '';
      const dataItem = purchaseTypeOptions.find((unit: any) => unit.value === targetValue || unit.label === targetValue);
      if (targetValue) {
        row.purchaseType = dataItem?.value || '';
        row.purchaseTypeName = dataItem?.label || '';
      }
    }
  }

  function headerCellDblclick({ column }) {
    // 匹配出不需要双击的字段
    const exIncludes = getVxeProcurementColumns(true)
      .filter(item => {
        return !item?.editRender?.enabled;
      })
      .map(item => item.field);
    if (exIncludes.includes(column.field)) {
      return false;
    }

    const tableData = gridApi.getDataSource();
    const targetValue = tableData[0][column.field];
    if (!targetValue) {
      return false;
    }

    tableData.forEach(item => {
      if (column.field === 'supplier') {
        item.supplier = targetValue;
        handleAfterSupplier([column], [item], [[targetValue]]);
      } else if (column.field === 'designatedEngReviewerId') {
        item['designatedEngReviewerId'] = targetValue;
        item['designatedEngReviewerName'] = tableData[0]['designatedEngReviewerName'] || '';
      } else if (column.field === 'purchaseType') {
        item['purchaseType'] = targetValue;
        item['purchaseTypeName'] = tableData[0]['purchaseTypeName'] || '';
      } else {
        item[column.field] = targetValue;
      }
    });
  }

  async function init(data) {
    await getPurchaseTypeOptions();

    const { title, ids, dataSource: _dataSource, columns } = data;
    state.title = title;
    isResend.value = data.isResend || false;
    state.moldDrawings = _dataSource.flatMap(item => {
      const detailList = item.detailList || [];
      // 只有【单据类型】为【新增】，或者【修改类型】包含【模具图纸】，才需要展示【模具图纸】数据
      for (const el of detailList) {
        if (`${el.itemType}` !== ITEM_TYPE_ENUM.新增 && el.modifyType.every((type: number | string) => `${type}` !== MOLD_MODIFY_TYPE.模具图纸)) {
          return [];
        }
      }
      return item.moldDrawings || [];
    });

    state.columns = columns;

    gridApi.reloadColumn(state.columns);
    try {
      changeLoading(true);
      const { data, code } = await getEmaildatalist(ids);
      if (code === 200) {
        const list = data.map(item => ({
          ...item,
          supplierSapCode: item.supplier || '',
          supplier: item.supplierName || '',
        }));
        state.tableData = list;
        gridApi.reloadData(list);
      }
    } finally {
      changeLoading(false);
    }
  }

  function getTableActions(record, index): ActionItem[] {
    return [
      {
        icon: 'icon-ym icon-ym-delete',
        onClick: handleDeleteItem.bind(null, record, index),
        disabled: state.tableData.length <= 1,
      },
    ];
  }

  const handleDeleteItem = (record, _index) => {
    createConfirm({
      iconType: 'warning',
      title: t('common.tipTitle'),
      content: t('common.delTip'),
      onOk: () => {
        gridApi.grid.remove(record);
        createMessage.success(t('common.delSuccess'));
      },
    });
  };

  async function handleSubmitFn() {
    const fieldsValue = await validate();
    const errMap = await gridApi.validate(true);
    if (!fieldsValue) return;
    if (errMap) return;
    try {
      const params: any = gridApi.getDataSource();

      changeLoading(true);
      changeOkLoading(true);
      let api: null | ((data: any) => Promise<any>) = null;
      if (state.title === t('dict.MoldFlowNode.Purchase')) {
        api = isResend.value ? resendPurchaseEmail : purchase;
      } else {
        api = compareprices;
      }
      const { code, msg } = await api({
        subject: getFieldsValue().subject,
        list: params.map(item => {
          return {
            ...omit(item, 'copyData'),
            supplierName: item.supplier || '',
            supplier: item.supplierSapCode || item.supplier || '',
          };
        }),
        dataHtml: setHtmlFn(),
      });
      if (code === 200) {
        createMessage.success(msg);
        emits('reload');
        closePopup();
        return;
      }
      createMessage.error(msg);
    } catch (error) {
      console.error('error:', error);
    } finally {
      changeLoading(false);
      changeOkLoading(false);
    }
  }

  async function handleFileDownload(item: { fileName: string; filePath: string }) {
    downloadFile({ url: item.filePath, fileName: item.fileName });
  }

  function transfromVal(dataIndex, val) {
    if (!val) return '';
    if (state.title === t('dict.MoldFlowNode.Purchase') && dataIndex.includes('poNo')) {
      return 'PONOVALUE';
    }
    if (dataIndex.includes('Time') || dataIndex.includes('Date')) {
      return dayjs(val).format('YYYY-MM-DD');
    } else if (dataIndex.includes('purchaseType')) {
      return purchaseTypeOptions.find((unit: any) => unit.value === val)?.label || '';
    } else {
      return val;
    }
  }
  function setHtmlFn() {
    let columns = state.columns.map(item => ({
      dataIndex: item.field,
      ...item,
    }));
    if (state.title === t('dict.MoldFlowNode.Purchase')) {
      columns = [{ title: 'PO单号', dataIndex: 'poNo', disabled: true, isEdit: true, inputType: '', placeholder: 'PO单号' }, ...columns];
    }
    columns = columns.filter(d => !['designatedEngReviewerId', 'seq', 'action'].includes(d.dataIndex)); //过滤掉联系人

    // 排序，把【供应商(`supplier`)】排到【模具料号(`moldNo`)】后面，其余字段保持原位置不变
    const supplierIndex = columns.findIndex(d => d.dataIndex === 'supplier');
    const moldNoIndex = columns.findIndex(d => d.dataIndex === 'moldNo');
    if (supplierIndex !== -1 && moldNoIndex !== -1) {
      // 先保存supplier字段，再进行删除和插入操作
      const supplierColumn = columns[supplierIndex];
      columns.splice(supplierIndex, 1);
      // 注意：由于删除了supplier字段，如果supplier在moldNo前面，moldNo的索引会减1
      const newMoldNoIndex = supplierIndex < moldNoIndex ? moldNoIndex - 1 : moldNoIndex;
      columns.splice(newMoldNoIndex + 1, 0, supplierColumn);
    }

    // 构建表头的 HTML
    const theadHtml = columns.map(header => `<th style="padding: 8px; text-align: left">${header.title}</th>`).join('');

    const map = gridApi.getDataSource().reduce((acc, cur) => {
      const key = cur.supplierSapCode || cur.supplier || '';
      if (!acc.has(key)) {
        acc.set(key, { ids: [], html: [] });
      }
      acc.get(key).ids.push(cur.applyId);
      acc
        .get(key)
        .html.push(`<tr>${columns.map(cell => '<td style="padding: 8px">' + transfromVal(cell.dataIndex, cur[cell.dataIndex]) + '</td>').join('')}</tr>`);
      return acc;
    }, new Map<string, { ids: Array<string>; html: Array<string> }>());

    const result: Array<{ ids: Array<string>; html: string }> = [];
    for (const item of map) {
      const [_, value] = item;
      result.push({
        ids: value.ids,
        html: `<table border="1" style="border-collapse: collapse; width: 100%">
            <thead>
              <tr>${theadHtml}</tr>
            </thead>
            <tbody>
              ${value.html.join('')}
            </tbody>
          </table>`,
      });
    }

    return result;
  }

  const filePreviewRef = ref<InstanceType<typeof Preview>>();
  function handlePreview(item: { fileName: string; filePath: string }) {
    filePreviewRef.value &&
      filePreviewRef.value.init({
        url: item.filePath,
        version: 2,
        // @ts-ignore
        name: item.fileName,
      });
  }
</script>

<style lang="less" scoped>
  .email {
    height: 100vh;

    &-header {
      padding-top: 10px;
      display: flex;
      align-items: top;
    }

    &-content {
      height: 60%;
    }
  }

  .drawings-name {
    display: flex;
    align-items: baseline;
    flex-wrap: nowrap;

    a {
      position: relative;
      display: inline-block;
      max-width: 95%;
      padding-right: 20px;
      margin-right: 14px;

      .icon-ym-btn-download {
        position: absolute;
        right: 0;
        color: #333;
        cursor: pointer;
      }
    }
  }

  .disabled-class {
    pointer-events: none;
  }

  :deep(div.vxe-grid) {
    padding-top: 0;
  }
</style>
