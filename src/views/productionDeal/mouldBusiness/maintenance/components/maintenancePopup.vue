<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    :showOkBtn="state.show.submit"
    :okText="t('common.submit')"
    :title="title"
    destroyOnClose
    @ok="() => handleSave(true)"
    class="full-popup">
    <template #centerToolbar>
      <a-button v-if="state.show.submit" @click="handleSave(false)" type="primary" ghost>{{ t('common.temporarySave') }}</a-button>
    </template>

    <div class="h-full requirement-pop p-10px">
      <div class="lydc-content-wrapper-search-box pt-8px mb-16px">
        <Subtitle :title="t('common.baseinfo')" />
        <BasicForm @register="registerForm" />
      </div>

      <Grid style="height: calc(100% - 206px)">
        <template #toolbar-actions>
          <Subtitle :title="t('common.moldMaintenanceInfo')" placement="vxe" :extra="{ show: state.type != 'view' }" @add-column="addRow"></Subtitle>
        </template>
        <!-- 原因分析 开始 -->
        <template #causeAnalysis="{ row }">
          {{ row.otherCauseAnalysis || row.causeAnalysisName }}
        </template>
        <template #dynamicSelect="{ row }">
          <DynamicSelect
            v-model:value="row.causeAnalysis"
            v-model:label="row.causeAnalysisName"
            v-model:options="row.reasonOptions"
            v-model:otherContent="row.otherCauseAnalysis"
            :other-value="REASON_ENUM.其他" />
        </template>
        <!-- 原因分析 结束 -->

        <template #drawingsName="{ row }">
          <span v-if="row.drawingsId" class="table-a" @click="() => handlePreviewDrawing(row)">
            {{ row.drawingsName }}
          </span>
          <FileCell v-else :list="row.fileJson" @click="handlePreview" />
        </template>

        <template #action="{ row, rowIndex }">
          <TableAction :outside="true" :actions="getTableActions(row, rowIndex)" />
        </template>
      </Grid>

      <PreviewModal ref="filePreviewRef" />
    </div>
    <UploadBtn ref="uploadRef" type="link" :maxFileSize="1" @success="afterUpload"></UploadBtn>
  </BasicPopup>
</template>

<script lang="ts" setup>
  import { reactive, toRefs, nextTick, ref } from 'vue';
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useUserStore } from '/@/store/modules/user';
  import { cloneDeep, pick } from 'lodash-es';
  import { addMoldBusinessMaintenance, getDetail, temporaryStorage, getMoldNoList } from '/@/api/productionDeal/mouldBusinessMaintenance';
  import { schemas, getEditTableColumn, editRules, TYPE_ENUM, handleMoldNoChange } from './maintenancePopupConfig';
  import { buildUUID } from '/@/utils/uuid';
  import {
    reasonOptions,
    REASON_ENUM,
    // MOLD_STATUS_ENUM,
    DEMAND_TYPE_ENUM,
    repairOptions,
    parsePattern,
    editStatuList,
  } from '../config';
  import { getUserInfoList } from '/@/api/permission/user';
  import { getUserListByAccountList } from '/@/api/business/salesForecast';
  import { formatToDateTime } from '/@/utils/dateUtil';
  import { PreviewModal, UploadBtn, FileCell } from '/@/components/Upload';

  import { BasicForm, useForm } from '/@/components/Form';
  import { useVbenVxeGrid, VxeGridProps } from '/@/adapter/vxe-table';
  import { Subtitle } from '/@/components/Subtitle';
  import { TableAction, ActionItem } from '/@/components/Table';
  // import { AddCustomRows } from '/@/components/AddCustomRows';
  import DynamicSelect from './dynamicSelect.vue';

  const emits = defineEmits(['register', 'reload']);

  interface State {
    type: `${TYPE_ENUM}`;
    systemId: string;
    applyNo: string;
    show: {
      submit: boolean;
    };
    title: string;
    parentId: string;
    base: any;
    line: number;
    validate: string;
    initFields: any;
    fileList: Array<FormData>;
    loading: boolean;
  }

  const { t } = useI18n();
  const state = reactive<State>({
    type: TYPE_ENUM.新增,
    show: {
      submit: true,
    },
    systemId: '',
    applyNo: '',
    title: t('common.addText'),
    parentId: '',
    base: {},
    line: 1,
    validate: '',
    initFields: {
      moldStatus: '',
      reason: '',
      causeAnalysis: '',
      causeAnalysisName: '',
      otherCauseAnalysis: '',
      reasonOptions,
      demandType: DEMAND_TYPE_ENUM.在库维修,
    },
    fileList: [],
    loading: false,
  });
  const { title } = toRefs(state);

  const userStore = useUserStore();
  const { createMessage, createConfirm } = useMessage();

  const [registerForm, { /** getFieldsValue, */ setFieldsValue }] = useForm({
    labelWidth: '100%',
    layout: 'vertical',
    baseColProps: {
      span: 6,
    },
    // i18nConfig: {
    //   moduleCode: 'MoldRepairApplyColumn',
    //   transferRange: ['label'],
    // },
    // @ts-ignore
    schemas,
  });

  const gridOptions: VxeGridProps = {
    id: 'productionDeal-mouldBusiness-maintenance-maintencePopup-edit',
    columns: getEditTableColumn() as any,
    // @ts-ignore
    showIndexColumn: true,
    editConfig: {
      trigger: 'dblclick',
      mode: 'row',
      beforeEditMethod: ({ row }) => !row.status || editStatuList.includes(`${row.status}` as any),
    },
    editRules,
    rowConfig: {
      keyField: '_X_ROW_KEY',
    },
    areaConfig: {
      multiple: true, // 是否启用多区域选取功能
    },
    data: [],
    proxyConfig: {
      enabled: false,
    },
    clipConfig: {
      isPaste: true,
      afterPasteMethod: handleAfterPaster,
    },
    // @ts-ignore
    i18nConfig: {
      moduleCode: 'MoldRepairApplyColumn',
    },
    pagerConfig: {
      enabled: false,
    },
    position: 'modal',
    toolbarConfig: {
      refresh: false,
      zoom: true,
    },
    customConfig: {
      allowVisible: false,
    },
  };
  const [Grid, gridApi] = useVbenVxeGrid({ gridOptions });

  const [registerPopup, { closePopup, changeOkLoading, changeLoading }] = usePopupInner(init);

  /**
   * 初始化
   * @param0 type 新增(add)、编辑(edit)、详情(view)
   */
  async function init(data: { type: `${TYPE_ENUM}` } & Partial<Record<string, any>>) {
    changeLoading(true);
    state.fileList.length = 0;
    state.systemId = data.id;
    state.applyNo = data.moldRepairApplyNo;
    state.title = data.title || getTitle(state.type) || state.title;
    handleDisabled(data);
    await nextTick(async () => {
      setFieldsValue({
        moldRepairApplyNo: '',
        documentPreparer: `${userStore.getUserInfo.userName}/${userStore.getUserInfo.userAccount}`,
        requestingDepartment: userStore.getUserInfo.departmentName || '--',
        creatorDateTime: '',
      });
      if (state.systemId) {
        await getTableData();
      }
    });
    changeLoading(false);
  }

  // 处理禁用
  function handleDisabled(data) {
    state.type = data.type || TYPE_ENUM.新增;
    state.show.submit = state.type !== TYPE_ENUM.详情;
    if (state.type === TYPE_ENUM.详情) {
      gridApi.setGridOptions({ editConfig: { enabled: false } });
      gridApi.reloadColumn(getEditTableColumn().slice(0, -1));
      return;
    }
    if (state.type === TYPE_ENUM.新增) {
      return addRow(1);
    }
    gridApi.setGridOptions({ editConfig: { enabled: true } });
    gridApi.reloadColumn(getEditTableColumn());
  }

  function getTitle(type?: `${TYPE_ENUM}`) {
    if (type === TYPE_ENUM.新增) {
      return t('common.addText');
    } else if (type === TYPE_ENUM.编辑) {
      return t('common.editText');
    } else {
      return t('common.detailText');
    }
  }

  async function getTableData() {
    return getDetail(state.applyNo)
      .then(res => {
        const dataList = (res.data || []).map(item => {
          return {
            ...item,
            reasonOptions: reasonOptions,
          };
        });

        if (dataList[0]) {
          const target = dataList[0];
          setFieldsValue({
            moldRepairApplyNo: target.moldRepairApplyNo || '',
            documentPreparer: target.documentPreparerName || target.documentPreparer || '',
            requestingDepartment: target.requestingDepartment || '--',
            creatorDateTime: target.creatorTime ? formatToDateTime(target.creatorTime) : '',
          });
        }

        setTimeout(() => {
          gridApi.grid.reloadData(dataList);
        }, 100);

        if (dataList.every(item => !editStatuList.includes(`${item.status}` as any))) {
          setTimeout(() => {
            gridApi.setGridOptions({ editConfig: { enabled: false } });
            gridApi.reloadColumn(getEditTableColumn().slice(0, -1));
            state.type = TYPE_ENUM.详情;
            state.title = getTitle(state.type) || state.title;
            state.show.submit = false;
          });
        }
      })
      .catch(e => {
        console.warn('🚀 ~ returngetDetail ~ e:', e);
      });
  }

  function getTableActions(row: any, index: number): ActionItem[] {
    return [
      {
        label: '',
        icon: 'icon-ym icon-ym-btn-upload',
        tooltip: t('component.upload.uploadFile'),
        onClick: handleUpload.bind(null, row),
      },
      {
        label: '',
        icon: 'icon-ym icon-ym-btn-add',
        tooltip: t('common.add1Text'),
        onClick: addRow.bind(null, 1, index),
      },
      {
        label: '',
        icon: 'icon-ym icon-ym-btn-copy',
        tooltip: t('common.copy'),
        onClick: handleCopy.bind(null, row),
      },
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
    // gridApi.grid.remove(row);
  }

  const uploadRef = ref();
  const currentUploadId = ref('');
  /**
   * 上传图纸
   * @param row 行数据
   */
  function handleUpload(row: any) {
    currentUploadId.value = row._X_ROW_KEY;
    uploadRef.value?.click();
  }

  function afterUpload(fileList) {
    const list = getDataSource();
    const fileListBackup = cloneDeep(fileList);
    const index = list.findIndex(el => el._X_ROW_KEY == currentUploadId.value);
    list[index].fileJson = fileListBackup;
    createMessage.success(t('component.upload.uploadSuccess'));
    uploadRef.value.clearUploadFileList();
    gridApi.reloadData(list);
  }

  // 增加列
  function addRow(line: number, index = -1) {
    const list: Array<any> = [];
    for (let i = 0; i < line; i++) {
      list.push({
        _X_ROW_KEY: buildUUID(),
        ...cloneDeep(state.initFields),
      });
    }

    setTimeout(() => {
      const originList = getDataSource();
      if (index === -1) {
        originList.push(...list);
        gridApi.grid.reloadData(originList);
      } else if (index > -1) {
        originList.splice(index + 1, 0, ...list);
        gridApi.grid.reloadData(originList);
      }
    });
  }

  function handleCopy(row: any) {
    const item = cloneDeep(row);
    item._X_ROW_KEY = buildUUID();
    if (item.id) {
      delete item.id;
    }
    const list = getDataSource();
    const index = list.findIndex(el => el._X_ROW_KEY == row._X_ROW_KEY);
    list.splice(index, 0, item);
    gridApi.grid.reloadData(list);
  }

  function getDataSource() {
    return cloneDeep(gridApi.grid.getFullData());
  }

  // 获取需要传值给后端的有效字段
  function getEnableCols() {
    const fields: Array<string> = [];
    gridApi.grid
      .getColumns()
      .slice(1, -1)
      .forEach((el: any) => {
        if (!el.disabled) {
          fields.push(el.field);
        }
      });
    return fields.concat(['fileList', 'otherCauseAnalysis']);
  }

  async function checkDrawings(list: Array<any>) {
    const moldNoList: Array<string> = list.reduce((ls, item) => {
      if (item.moldNo && !item.fileJson) {
        ls.push(item.moldNo);
      }
      return ls;
    }, []);

    if (moldNoList.length === 0) {
      return true;
    }

    return new Promise<boolean>(resolve => {
      createConfirm({
        iconType: 'warning',
        title: t('common.tipTitle'),
        content: t('dict.MoldRepairApply.submitDrawingsNameTip', [moldNoList.join(',')]),
        onOk: async () => {
          return resolve(true);
        },
        onCancel: () => {
          return resolve(false);
        },
      });
    });
  }

  /** 保存 */
  async function handleSave(isSubmit = false) {
    if (isSubmit && (await gridApi.grid.validate(true))) {
      return createMessage.warning(t('dict.SalesSiteColumn.requiredTip'));
    }

    // 提取出提交字段
    const listField: any = getEnableCols().concat('fileJson', 'id');
    const originList = gridApi.grid.getFullData();

    if (isSubmit) {
      const flag = await checkDrawings(originList);
      if (!flag) {
        return false;
      }
    }

    // const formData = new FormData();
    // list.forEach((el, index) => {
    //   listField.forEach((field: string) => {
    //     if ((field === 'demandReturnDate' || field === 'inboundDate') && el[field]) {
    //       formData.append(`list[${index}].${field}`, formatToDateTime(el[field], 'YYYY-MM-DD'));
    //     } else if (el[field]) {
    //       formData.append(`list[${index}].${field}`, el[field]);
    //     }
    //   });
    //   el.fileJson && typeof el.fileJson === 'object' && formData.append(`list[${index}].fileJson`, JSON.stringify(el.fileJson));
    //   el.drawingsId && formData.append(`list[${index}].drawingsId`, el.drawingsId);
    //   formData.append(`list[${index}].id`, el.id || '');
    // });

    const list = originList.map(el => {
      const obj = pick(el, listField);
      if (obj.demandReturnDate) {
        obj.demandReturnDate = formatToDateTime(obj.demandReturnDate, 'YYYY-MM-DD');
      }
      if (obj.inboundDate) {
        obj.inboundDate = formatToDateTime(obj.inboundDate, 'YYYY-MM-DD');
      }
      return obj;
    });

    changeLoading(true);
    state.loading = true;
    changeOkLoading(true);
    const api = isSubmit ? addMoldBusinessMaintenance : temporaryStorage;

    // formData.append('demandType', DEMAND_TYPE_ENUM.在库维修);
    api({ list, demandType: DEMAND_TYPE_ENUM.在库维修 })
      .then(() => {
        createMessage.success(t('sys.api.operationSuccess'));
        emits('reload');
        closePopup();
      })
      .finally(() => {
        changeLoading(false);
        state.loading = false;
        changeOkLoading(false);
      });
  }

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
      for (let i = 0; i < rows.length; i++) {
        pasteCellData.push(target);
      }
    }

    // 找出粘贴的第几列，如粘贴料号，粘贴区域第0列就是料号，对应excel也是第0列

    // 模具料号
    handleAfterPasterMoldNo(cols, rows);

    // 原因分析
    handleAfterPasterCauseAnalysis(cols, rows, pasteCells);

    // 维修类型
    handleAfterPasterRepairType(cols, rows, pasteCells);

    // 模具采购员
    handleAfterPasterMoldPurchaser(cols, rows);

    return true;
  }

  /** 原因分析 复制处理 */
  function handleAfterPasterCauseAnalysis(cols: Array<{ field: string }>, rows: Array<any>, pasteCells: any) {
    const targetIndex = cols.findIndex((item: any) => item.field === 'causeAnalysis');
    if (targetIndex == -1) return false;

    const dataList = rows.map((item, index) => {
      const [targetValue, otherContent] = parsePattern(pasteCells?.[index]?.[targetIndex] || '');
      const target = reasonOptions.find(unit => unit.label === targetValue || unit.value === targetValue);
      return Object.assign(item, {
        causeAnalysis: target?.value || '',
        causeAnalysisName: (target?.label || '') + (otherContent ? `(${otherContent})` : ''),
        otherCauseAnalysis: otherContent,
      });
    });
    if (dataList.length == 0) return false;
    nextTick(() => {
      gridApi.grid.setRow(dataList);
    });
  }

  /** 维修类型 复制处理 */
  function handleAfterPasterRepairType(cols: Array<{ field: string }>, rows: Array<any>, pasteCells: any) {
    const targetIndex = cols.findIndex((item: any) => item.field === 'repairType');
    if (targetIndex == -1) return false;

    const dataList = rows.map((item, index) => {
      const targetValue = pasteCells?.[index]?.[targetIndex] || '';
      const target = repairOptions.find(unit => unit.label === targetValue || unit.value === targetValue);
      return Object.assign(item, {
        repairType: target?.value || '',
      });
    });
    if (dataList.length == 0) return false;
    nextTick(() => {
      gridApi.grid.setRow(dataList);
    });
  }

  /** 模具采购员 复制处理 */
  async function handleAfterPasterMoldPurchaser(cols: Array<{ field: string }>, rows: Array<any>) {
    const targetIndex = cols.findIndex((item: any) => item.field === 'moldPurchaser');
    if (targetIndex == -1 || rows.length === 0) return false;

    const { idList, accountList } = rows.reduce(
      (obj: { idList: Array<string>; accountList: Array<string> }, item: { [key: string]: string }) => {
        const value = item.moldPurchaser || '';
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
      accountList.length > 0 ? getUserListByAccountList([...new Set(accountList as Array<string>)]) : Promise.resolve({ data: {} }),
    ]).then(res => {
      const userList = [
        ...(res[0]?.data?.list || []),
        ...Object.values(res[1]?.data || {}).map((item: any) => ({ ...item, fullName: item.MergeName, id: item.Id })),
      ];
      rows.forEach((row: any) => {
        const target = userList.find(item => item.id === row.moldPurchaser || item.fullName === row.moldPurchaser);
        Object.assign(row, { moldPurchaser: target?.id || '', moldPurchaserName: target?.fullName || '' });
      });
    });
  }

  /**
   * 模具料号 - 赋值黏贴处理
   */
  function handleAfterPasterMoldNo(cols: Array<{ field: string }>, rows: Array<any>) {
    const targetIndex = cols.findIndex((item: any) => item.field === 'moldNo');
    if (targetIndex == -1 || rows.length === 0) return false;

    const tableData = gridApi.getDataSource();
    const list: Array<string> = [];
    rows.forEach(row => {
      const target = tableData.find(item => item.moldNo === row.moldNo && item._X_ROW_KEY !== row._X_ROW_KEY);
      if (target) {
        handleMoldNoChange(target, { row, $grid: gridApi.grid });
      } else {
        list.push(row);
        getMoldNoList({ moldPartNumber: row.moldNo, pageSize: 1 }).then(res => {
          const item = res?.data?.[0] || {};
          handleMoldNoChange(item, { row, $grid: gridApi.grid });
        });
      }
    });
  }

  const filePreviewRef = ref<InstanceType<typeof PreviewModal>>();
  function handlePreviewDrawing(row: { drawingsId: string; drawingsName: string }) {
    filePreviewRef.value &&
      filePreviewRef.value.init({
        Id: row.drawingsId,
        previewType: 'localPreview',
        filePath: '',
        url: '',
        fileList: [],
        // @ts-ignore
        name: row.drawingsName,
      });
  }
  async function handlePreview(item) {
    const params = {
      name: item.fileName,
      filePath: item.filePath,
      version: 2,
    };
    // @ts-ignore
    filePreviewRef.value?.init(params);
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
