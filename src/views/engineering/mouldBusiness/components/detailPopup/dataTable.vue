<template>
  <Grid>
    <template #buttons>
      <Subtitle :title="t('dict.MoldApply.MoldInfo')" class="pb-none" />
      <!-- 上传图纸按钮 -->
      <a-button v-if="isCanEdit" type="primary" size="mini" @click="() => openUpload(true, {})">
        {{ t('common.uploadDrawingText') }}
      </a-button>
      <!-- 下载图纸 -->
      <a-button v-else type="primary" size="mini" ghost @click="() => handleDownload()">
        {{ t('common.downloadDrawingText') }}
      </a-button>
    </template>

    <!-- 脱敏图纸 -->
    <template #drawingshistory="{ row }">
      <a class="table-a" @click="handleDrawView(row)">{{ t('common.viewDetails') }}</a>
    </template>

    <template #moldNo="{ row }">
      <a-input v-model:value="row.moldNo" />
    </template>

    <template #moldDrawings="{ row }">
      <FileListCell :row="row" :list="row.moldDrawings" />
    </template>
  </Grid>

  <UploadModal v-bind="uploadState" @register="registerUpload" @success="updateMoldsDrawing" />
  <FileListModal @register="registerFile" />
</template>

<script lang="ts" setup>
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { COLUMNS, getEditRules, handleAfterPaster, getDetailColumns } from './config';
  import { downloadDrawings } from '../config';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useModal } from '/@/components/Modal';
  import { uploadfiles } from '/@/api/basic/common';
  import { ref, reactive } from 'vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { deleteCellValueName } from '/@/adapter/delete-value-event';
  import { fileDownload } from '/@/api/basicData/processrulestemplate';
  import { getDrawingshistory } from '/@/api/basicData/productCodeApply';
  import { beforeFileUpload, isDisableEdit } from '/@/views/engineering/mouldBusiness/components/config';

  import Subtitle from '/@/components/Subtitle/src/Subtitle.vue';
  import { UploadModal, FileListModal } from '/@/components/Upload';
  import FileListCell from '../fileListCell.vue';

  const { t } = useI18n();
  const { createMessage } = useMessage();

  const uploadState = reactive({
    title: t('common.uploadMoldDrawings'),
    param: {},
    mutiple: true,
    api: (form: FormData) => {
      const fileForm = new FormData();
      for (const file of form.getAll('file')) {
        fileForm.append('fileList', file);
      }
      return uploadfiles(fileForm);
    },
    beforeUpload: beforeFileUpload,
  });

  /** 是否允许编辑 */
  const isCanEdit = ref(false);

  const [Grid, gridApi] = useVbenVxeGrid({
    showSearchForm: false,
    gridOptions: {
      id: 'engineering-mouldBusiness-apply-detail',
      showIndexColumn: true,
      columns: COLUMNS,
      pagerConfig: {
        enabled: false,
      },
      editRules: {},
      editConfig: {
        trigger: 'dblclick',
        mode: 'row',
        showIcon: true,
      },
      customConfig: {
        allowVisible: false,
      },
      toolbarConfig: {
        enabled: true,
        refresh: false,
        custom: true,
        slots: {
          buttons: 'buttons',
        },
      },
      i18nConfig: {
        moduleCode: 'MoldApplyColumn',
      },
      clipConfig: {
        isPaste: true,
        beforePasteMethod: ({ targetAreas }) => {
          const { cols, rows } = targetAreas[0];
          for (const row of rows) {
            for (const col of cols) {
              if (isDisableEdit({ row, column: col })) {
                createMessage.warning(t('common.noPastingTip'));
                return false;
              }
            }
          }
          return true;
        },
        afterPasteMethod: handleAfterPaster,
      },
      keyboardConfig: {
        delMethod: ({ row, column }) => {
          const { field, editRender } = column;
          // 判断是否禁止编辑，如果禁止编辑，则不执行删除
          if (editRender?.props?.disabled || (typeof editRender?.props?.dynamicDisabled === 'function' && editRender?.props?.dynamicDisabled(row))) {
            return false;
          }
          row[field] = null;
        },
      },
    },
    gridEvents: {
      headerCellDblclick: headerCellDblclick,
      // @ts-ignore
      'cell-delete-value': ({ cellAreas }) => {
        const { cols, rows } = cellAreas[0];
        deleteCellValueName({ cellAreas: [{ cols, rows }] });
        handleAfterPaster({
          currentAreas: [{ cols, rows }],
          pasteCells: new Array(rows.length).fill(new Array(cols.length).fill('')),
          $grid: gridApi,
        });
      },
    },
  });

  function headerCellDblclick({ column }) {
    if (!isCanEdit.value) {
      return false;
    }

    // 匹配出不需要双击的字段
    if (column?.editRender?.props?.disabled) {
      return false;
    }

    const tableData = gridApi.getDataSource();
    const targetValue = tableData[0][column.field];
    if (!targetValue) {
      return false;
    }
    const rows = tableData.slice(1);
    const nameFile = column.editRender.cacheField;
    const targetName = tableData[0][nameFile];
    rows.forEach(item => {
      if (typeof column.editRender?.props?.dynamicDisabled === 'function' && column.editRender.props.dynamicDisabled(item)) {
        return false;
      }

      item[column.field] = targetValue;
      if (nameFile) {
        item[nameFile] = targetName;
      }
    });
    if (column.field !== 'moldPurchaseId' && column.field !== 'salespersonId') {
      handleAfterPaster({ currentAreas: [{ cols: [column], rows }], $grid: gridApi, pasteCells: new Array(rows.length).fill([targetValue]) });
    }
  }

  const [registerUpload, { openModal: openUpload }] = useModal();
  /** 上传模具图纸 */
  function updateMoldsDrawing(_id: string, { data }: { data: Array<any> }) {
    if (!data) {
      return false;
    }
    const list = data.map(item => ({
      ...item,
      fileName: item.originFileName,
      filePath: item.fullPath,
    }));
    const tableData = gridApi.getDataSource();
    for (const item of tableData) {
      item.moldDrawings = list;
    }
  }

  /** 下载图纸 */
  function handleDownload() {
    const rows = gridApi.getSelectRows();
    if (rows.length === 0) {
      return createMessage.warning(t('common.selectText'));
    }
    // 取出`rows`的每个元素中的`moldDrawings: Array<{ filePath: string, fileName: string }>`，并且根据`filePath`去重
    const drawings = rows.reduce<{ filePath: string; fileName: string }[]>((prev, cur) => {
      Array.isArray(cur.moldDrawings) &&
        cur.moldDrawings.forEach((item: any) => {
          prev.every(i => i.filePath !== item.filePath) && prev.push(item);
        });
      return prev;
    }, []);

    downloadDrawings(drawings);
  }

  /**
   * 获取表格数据，如果开启了校验，校验失败会返回`false`
   * @param isValidate 是否开始校验，默认`false`
   */
  async function getDataSource(isValidate = false) {
    if (isValidate && (await gridApi.validate(true))) {
      createMessage.warn(t('dict.CommonCol.enterRequiredFields'));
      return false;
    }
    return gridApi.getDataSource();
  }

  /**
   * 加载表格数据
   * @param list 表格数据
   * @param isCanEdit 是否可编辑
   */
  async function reloadData(list: Array<any>, isEdit = false, isDetail = false) {
    return gridApi.reloadData(list).then(() => {
      isCanEdit.value = isEdit;
      gridApi.setGridOptions({
        editConfig: {
          trigger: isCanEdit.value ? 'dblclick' : 'manual',
          showIcon: isCanEdit.value,
        },
        editRules: getEditRules({ moldNoType: list[0].moldNoType }),
      });

      if (isCanEdit.value) {
        // 如果是可编辑的，不允许勾选，因为编辑模式进入界面，必须是同一套图纸的数据
        gridApi.reloadColumn(COLUMNS.filter(col => col.type !== 'checkbox'));
      } else if (isDetail) {
        // 如果是单纯展示详情，需要展示【单据类型】、【修改类型】、【修改原因】
        gridApi.reloadColumn(getDetailColumns());
      }
    });
  }

  const [registerFile, { openModal: openFileList }] = useModal();
  function handleDrawView(record: any) {
    openFileList(true, {
      id: record.id,
      downloadApi: fileDownload,
      listApi: () =>
        getDrawingshistory(
          {
            InsidePartNumber: record.insidePartNumber,
            DrawingsType: 'DesensitizedDrawings',
            id: record.insidePartNumberId,
          },
          record.insidePartNumberId,
        ),
    });
  }

  defineExpose({
    getDataSource,
    reloadData,
  });
</script>

<style scoped lang="less">
  div.pb-none {
    padding-bottom: 0;
  }
</style>
