<script setup lang="ts">
  import type { MathType } from 'mathjs';

  import { ref, reactive, nextTick, watch, defineAsyncComponent } from 'vue';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { getColumn, calculateSum, handleHalfFinishedPartChange, PRODUCTION_TYPE_ENUM, calculateUseQty } from './config';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { isNullOrUnDef } from '/@/utils/is';
  import { requestIdleCallbackAdapter } from '/@/utils/polyfills';
  import { buildUUID } from '/@/utils/uuid';
  import { cloneDeep, debounce, omit, compact, uniq } from 'lodash-es';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useModal } from '/@/components/Modal';
  import { getBatchSemiFinishedProductsByCode } from '/@/api/engineering/semifinishedproducts';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { useQuotaStore } from '/@/views/engineering/quotationBom/store/index';
  import { bignumber, chain, divide } from 'mathjs';
  import { expandPasteCells } from '../config';
  import { getLastDigits, queryUsersByAccountsCached } from '/@/views/engineering/quotationBom/utils/lookupCache';

  import Subtitle from '/@/components/Subtitle/src/Subtitle.vue';

  const TableAction = defineAsyncComponent(() => import('/@/components/Table').then(m => m.TableAction));
  const AddCustomRows = defineAsyncComponent(() => import('/@/views/engineering/pcc/pccApply/components/AddCustomRows.vue'));
  const UploadBtn = defineAsyncComponent(() => import('/@/components/Upload').then(m => m.UploadBtn));
  const FilesModal = defineAsyncComponent(() => import('./FilesModal.vue'));

  const props = defineProps({
    currentData: {
      type: Object as PropType<{ factory: string }>,
      default: {},
    },
  });

  const { t } = useI18n();
  const { createMessage } = useMessage();
  const { hasBtnP } = usePermission();
  const quotaStore = useQuotaStore();

  /** 当前制程损耗 */
  const processDepletion = ref<MathType>(bignumber(0));
  // 监听工艺的制程良率的变化
  watch(
    () => quotaStore.getFirstProcessFpy,
    newFpy => {
      // 根据制程良率计算制程损耗
      processDepletion.value = chain(bignumber(1))
        .subtract(divide(bignumber(newFpy || 0), bignumber(100)))
        .done();
      // 制程损耗发生了改变，对每一行数据重新进行处理
      const nextProcessDepletion = processDepletion.value.toString();
      const rows = gridApi.getDataSource();
      requestIdleCallbackAdapter(() => {
        rows.forEach(row => {
          if (+row.processDepletion !== +nextProcessDepletion) {
            row.processDepletion = nextProcessDepletion;
            calculateUseQty(row, processDepletion);
          }
        });
      });
    },
  );

  const sumCost = ref(0);
  const rowData = {
    halfFinishedPart: '',
    productionTypeName: '',
    halfFinishedPartDesc: '',
    useQty: '',
    machiningLoss: '',
    hasPrice: '',
    purchaserId: '',
    purchaseUnit: '',
    drawingFile: [],
    remarks: '',
  };

  const gridOptions: any = {
    id: 'engineering-quotationBom-makeQuotation-edit-halfFinished',
    showIndexColumn: true,
    columns: getColumn(props.currentData, processDepletion),
    data: [],
    editConfig: {
      trigger: 'dblclick',
      mode: 'row',
      beforeEditMethod: beforeEditMethod,
    },
    scrollY: {
      enabled: true,
      gt: 40,
    },
    mouseConfig: {
      area: true, // 是否开启区域选取
    },
    areaConfig: {
      multiple: true, // 是否启用多区域选取功能
    },
    pagerConfig: {
      enabled: false,
      pageSize: 1000,
    },
    keyboardConfig: {
      isClip: true, // 是否开启复制粘贴
      isEdit: true, // 是否开启任意键进入编辑（功能键除外）
      isDel: true, // 是否开启删除键功能
      isEsc: true, // 是否开启Esc键关闭编辑功能
    },
    showOverflow: true,
    keepSource: true,
    rowConfig: {
      keyField: 'uuid',
    },
    maxHeight: '760px',
    height: '',
    minHeight: '220px',
    clipConfig: {
      isPaste: true,
      // afterPasteMethod: handleAfterPaster,
      beforePasteMethod: handleBeforePaster,
    },
  };

  const [Grid, gridApi] = useVbenVxeGrid({
    gridOptions,
    gridEvents: {
      // @ts-ignore
      'cell-delete-value': ({ cellAreas }) => {
        const { rows, cols } = cellAreas[0];
        rows.forEach(row => {
          cols.forEach(column => {
            // 支持按delete按键删除Name
            const { field } = column;
            if (!isNullOrUnDef(row[`${field}Name`])) {
              row[`${field}Name`] = null;
            }
            const nameFieldById = field.replace('Id', 'Name');
            if (!isNullOrUnDef(row[`${nameFieldById}`])) {
              row[`${nameFieldById}`] = null;
            }
          });
        });
      },
    },
  });

  function getTableActions(row: any) {
    return [
      // 上传附件
      {
        label: t('common.uploadDrawingText'),
        onClick: handleUpload.bind(null, row),
      },
      // 新增一行
      {
        icon: 'icon-ym icon-ym-btn-add',
        onClick: handleAction.bind(null, 'addBaseIndex', row),
      },
      // 复制
      {
        icon: 'icon-ym icon-ym-btn-copy',
        onClick: handleAction.bind(null, 'copy', row),
      },
      // 删除
      {
        icon: 'icon-ym icon-ym-delete',
        modelConfirm: {
          onOk: handleAction.bind(null, 'delete', row),
        },
      },
    ];
  }

  /** 新增行 */
  function handleAddRows(rowCount: number) {
    const rows: Array<any> = [];
    for (let i = 0; i < rowCount; i++) {
      rows.push({
        ...rowData,
        drawingFile: [],
        uuid: buildUUID(),
        processDepletion: processDepletion.value.valueOf(),
      });
    }
    requestIdleCallbackAdapter(() => {
      gridApi.insertAt(rows, -1);
    });
  }

  /** 表格操作 */
  async function handleAction(type: string, row: any) {
    const fullData = gridApi.getDataSource();
    const data = cloneDeep(fullData);
    const findIndex = fullData.findIndex(item => item.uuid === row.uuid);

    if (type === 'addBaseIndex') {
      // 新增一行
      data.splice(findIndex + 1, 0, { ...rowData, drawingFile: [], uuid: buildUUID(), processDepletion: processDepletion.value.valueOf() });
      gridApi.loadData(data);
    } else if (type === 'copy') {
      // 复制
      const copyData = cloneDeep(row);
      delete copyData.id;
      data.splice(findIndex + 1, 0, { ...copyData, uuid: buildUUID() });
      gridApi.loadData(data);
    } else {
      // 删除
      gridApi.remove(row);
    }
  }

  /** 黏贴处理 */
  function handleBeforePaster({ targetAreas, pasteCells, $grid, currentAreas }: any): void {
    if (targetAreas.length === 0) {
      return;
    }

    const { rows, cols } = currentAreas[0];

    // 检验是否可以粘贴
    for (let i = 0; i < cols.length; i++) {
      const col = cols[i];
      const isEditable =
        col.editRender && col.editRender.enabled !== false && col.editRender.props?.disabled !== true && beforeEditMethod({ row: rows[i], column: col });

      if (!isEditable) {
        // 不是可编辑单元格，禁止粘贴
        createMessage.warning(t('common.noPastingTip'));
        return;
      }
    }

    expandPasteCells(pasteCells, rows);

    /** 半成品料号 复制内容列表 */
    const halfFinishedPartList: Array<{ value: string; row: any }> = [];
    /** 用户信息 复制内容列表 */
    const userInfoList: Array<{ value: string; row: any }> = [];

    pasteCells.forEach((cellValues: string[], rowIndex: number) => {
      const row = rows[rowIndex];
      cellValues.forEach((value: string, colIndex: number) => {
        const col = cols[colIndex];

        switch (col.field) {
          case 'halfFinishedPart':
            // 半成品料号 复制黏贴
            halfFinishedPartList.push({ value, row });
            break;

          case 'purchaserId':
            // 开发采购人员 复制黏贴
            userInfoList.push({ value, row });
            break;

          case 'materialDosage':
            // 模数 复制黏贴
            row[col.field] = value;
            handlePasteMaterialDosage(row, { row, $grid });
            break;

          default:
            row[col.field] = value;
            break;
        }
      });
    });

    if (halfFinishedPartList.length > 0) {
      handlePasteHalfFinishedPart(halfFinishedPartList);
    }

    if (userInfoList.length > 0) {
      handlePastePurchaserId(userInfoList);
    }
  }

  /**
   * 判断是否允许编辑
   * @param param0
   */
  function beforeEditMethod({ row, column }: { row: any; column: { field: string } }) {
    // 自制的半成品采购栏置灰，不允许编辑，
    if (row.productionType === PRODUCTION_TYPE_ENUM.自制 && column.field === 'purchaserId') {
      return false;
    }
    return true;
  }

  /**
   * 半成品料号 复制黏贴
   * @param list
   * @param list.index.value 复制的内容
   * @param list.index.row 当前行
   */
  function handlePasteHalfFinishedPart(list: Array<{ value: string; row: any }>) {
    getBatchSemiFinishedProductsByCode(list.map(item => item.value)).then(res => {
      const data: Array<any> = Array.isArray(res.data) ? res.data : [];
      if (!data.length) {
        return false;
      }
      list.forEach(item => {
        const target = data.find(el => el.semiFinishedProductsPartNumber === item.value);
        item.row['halfFinishedPart'] = target ? item.value : '';
        handleHalfFinishedPartChange(target || {}, { row: item.row, $grid: gridApi.grid });
      });
    });
  }

  /**
   * 模数 复制黏贴
   * @param row
   * @param value
   */
  function handlePasteMaterialDosage(row: any, value: any) {
    if (typeof +value === 'number' && !Number.isNaN(+value)) {
      row['materialDosage'] = +value;
      return true;
    }
    return false;
  }

  /**
   * 开发采购人员 复制黏贴
   * @param list
   * @param list.index.value 复制的内容
   * @param list.index.row 当前行
   */
  function handlePastePurchaserId(list: Array<{ value: string; row: any }>) {
    list.forEach(item => {
      item.value = getLastDigits(item.value);
    });
    const accounts = uniq(compact(list.map(item => item.value)));
    if (!accounts.length) return;

    queryUsersByAccountsCached(accounts).then(userMap => {
      list.forEach(item => {
        const target = userMap.get(item.value);
        if (!target) return;
        item.row['purchaserId'] = target.Id || '';
        item.row['purchaserName'] = [target.RealName, target.Account].filter(Boolean).join('/');
      });
    });
  }

  const state = reactive({
    disabled: false,
  });

  const uploadRef = ref<InstanceType<typeof UploadBtn>>();
  const currentUploadId = ref('');
  /** 上传附件 */
  const handleUpload = debounce(async row => {
    currentUploadId.value = row.uuid;
    uploadRef.value?.click();
  }, 1000);

  /** 上传成功后，赋值操作 */
  function afterUpload(fileList: Array<any>) {
    const list = gridApi.getDataSource();
    const fileListBackup = cloneDeep(fileList).map((item: any) => {
      return {
        ...item,
        fileUrl: item.filePath,
      };
    });
    const index = list.findIndex(el => el.uuid == currentUploadId.value);
    const { drawingFile } = list[index];
    if (drawingFile && drawingFile.length) {
      // 如果当前的行数据已经有数据了，则进行拼接
      list[index].drawingFile = drawingFile.concat(fileListBackup);
    } else {
      list[index].drawingFile = fileListBackup;
    }
    createMessage.success(t('component.upload.uploadSuccess'));
    uploadRef.value && uploadRef.value.clearUploadFileList();
    gridApi.reloadData(list);
  }

  const [registerFiles, { openModal: openFilesModal }] = useModal();
  /** 展示文件列表弹窗 */
  function showFilesModal(row: { drawingFile: Array<any> | undefined; halfFinishedPart: string | undefined; uuid: string }) {
    currentUploadId.value = row.uuid;
    Array.isArray(row.drawingFile) && openFilesModal(true, { ...row, disabled: state.disabled });
  }

  /** 文件详情弹窗中发生了改变 */
  function handleFilesModalChange(data: { drawingFile: Array<any> | undefined; uuid: string }) {
    const list = gridApi.getDataSource();
    const index = list.findIndex(el => el.uuid == currentUploadId.value);
    list[index].drawingFile = data.drawingFile;
  }

  /**
   * 设置禁用状态
   * @param disabled
   */
  function setDisabled(disabled: boolean) {
    state.disabled = disabled;
    nextTick(() => {
      const columns = getColumn(props.currentData, processDepletion);
      disabled && columns.pop();
      gridApi.reloadColumn(columns);
    });
  }

  /**
   * 获取表格数据
   */
  function getDataSource() {
    const list = gridApi.getDataSource().map(row => omit(row, ['uuid', 'children', 'copyData', '_X_ROW_CHILD']));

    const halfFinishedPartMap = new Map<string, number>();
    list.forEach((item, index) => {
      if (halfFinishedPartMap.has(item.halfFinishedPart)) {
        const message = t('dict.Quotation.sameHalfFinishedPartTip', [halfFinishedPartMap.get(item.halfFinishedPart)! + 1, index + 1]);
        createMessage.warning(message);
        throw new Error(message);
      }
      halfFinishedPartMap.set(item.halfFinishedPart, index);
    });
    return list;
  }

  /**
   * 加载数据
   * @param dataList
   */
  function reloadData(dataList: Array<any>) {
    return (
      Array.isArray(dataList) &&
      gridApi.reloadData(
        dataList.map(row => {
          return { ...row, uuid: buildUUID(), purchaserName: [row.purchaserName, row.purchaserAccount].filter(Boolean).join('/') };
        }),
      )
    );
  }

  defineExpose({
    semifinishedproductsApi: gridApi,
    getDataSource,
    reloadData,
    /** 计算`成本小计` */
    calculateSum: calculateSum.bind(null, gridApi.grid, sumCost),
    setDisabled,
  });
</script>

<template>
  <a-card>
    <Grid>
      <template #toolbar-actions>
        <Subtitle :title="t('dict.CommonCol.SemiFinishedProduct')" class="mt-8px" id="halfFinished" :extra="{ show: true, hideAdd: true }">
          <template #afterTitle>
            <a-space v-if="hasBtnP('price-material')">
              <a-divider type="vertical" class="ml-10px"></a-divider>
              <!-- 	成本小计/KPCS -->
              <div>
                {{ t('dict.QuotationColumn.costSubtotal') }}:<span style="color: #ff7b00" class="ml-10px">{{ sumCost }}</span>
              </div>
            </a-space>
          </template>
        </Subtitle>
      </template>
      <template #toolbar-tools>
        <AddCustomRows @submit="handleAddRows" />
      </template>
      <template #drawingFile="{ row }">
        <span v-if="Array.isArray(row.drawingFile) && row.drawingFile.length > 0" class="table-a" @click="() => showFilesModal(row)">
          {{ t('common.viewDetails') }}
        </span>
        <span v-else-if="row.productionType === PRODUCTION_TYPE_ENUM.自制">/</span>
        <span v-else>
          {{ t('common.pendingUpload') }}
        </span>
      </template>
      <template #action="{ row }">
        <TableAction outside :actions="getTableActions(row)" />
      </template>
    </Grid>
    <!-- 上传文件，最大为30M -->
    <UploadBtn ref="uploadRef" type="link" :maxFileSize="30" class="hidden" @success="afterUpload" />
    <FilesModal @register="registerFiles" @change="handleFilesModalChange" />
  </a-card>
</template>
