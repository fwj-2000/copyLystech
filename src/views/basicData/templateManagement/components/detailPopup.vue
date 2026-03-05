<script setup lang="ts">
  import { AddCustomRows } from '/@/components/AddCustomRows';
  import { Subtitle } from '/@/components/Subtitle';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { ActionItem, TableAction } from '/@/components/Table';
  import { computed, nextTick, reactive, ref, toRaw } from 'vue';
  import { DETAIL_PAGE_TYPE_ENUM, getColumns } from './detailConfig';
  import { useVbenVxeGrid } from '/@/effects/plugins/vxe-table';
  import { editRules } from '/@/views/business/basicInformation/workCenter/components/detailConfig';
  import { buildUUID } from '/@/utils/uuid';
  import { cloneDeep, debounce } from 'lodash-es';
  // import { editWorkCenter, saveWorkCenter } from '/@/api/purchase/supplierInformation';
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { FileCell, PreviewModal, UploadBtn } from '/@/components/Upload';
  import { saveTemplateManagement } from '/@/api/basicData/templateManage';
  import { isEmpty } from '/@/utils/is';

  const { createMessage, createConfirm } = useMessage();

  const [registerPopup, { closePopup, /** changeOkLoading, */ changeLoading }] = usePopupInner(init);

  const uploadRef = ref();
  const currentUploadId = ref('');
  const filePreviewRef = ref<any | null>(null);

  async function init(data: { type: string; rows?: Array<string> }) {
    state.type = data.type;
    await nextTick();
    await gridApi.reloadColumn(pageInfo.value.columns);

    if (state.type === DETAIL_PAGE_TYPE_ENUM.新增) return false;
    if (isEmpty(data.rows)) {
      closePopup();
      return false;
    }
    const list = data.rows.map(item => {
      const target = {
        moduleEnCodeName: item.moduleFullName,
        ...toRaw(item),
        file: [
          {
            fileName: item.fileName,
            filePath: item.filePath,
          },
        ],
      };
      return target;
    });
    getTableData(list);
  }

  const state = reactive({
    type: DETAIL_PAGE_TYPE_ENUM.新增,
    initFields: {},
  });

  const pageInfo = computed(() => {
    const columns = getColumns();

    if (state.type == DETAIL_PAGE_TYPE_ENUM.新增) {
      return {
        title: t('common.add2Text'),
        saveFn: handleSaveInAdd,
        columns,
      };
    } else if (state.type == DETAIL_PAGE_TYPE_ENUM.修改) {
      // 修改时，只显示`序号(seq)`、`半成品料号(semiFinishedProductsPartNumber)`、`物料类型(materialTypeCode)`、`半成品描述(semiFinishedProductsDesc)`、`生产类型(productionType)`、`备注(remarks)`、`操作列(action)`
      return {
        title: t('common.modify'),
        saveFn: handleSaveInModify,
        columns: disableColumn(columns),
      };
    }
    return { title: '', saveFn: () => Promise.resolve(), columns };
  });

  async function handleSaveInAdd() {
    let list;
    try {
      list = gridApi.getDataSource().map(el => {
        if (!el.file || el.file.length === 0) {
          throw new Error('请上传文件');
        }
        console.log(el);
        const target = {
          ...el,
          ...el.file[0],
        };
        delete target.file;
        delete target.id;
        return target;
      });

      return saveTemplateManagement(list).then(() => {
        closePopup();
      });
    } catch (e) {
      changeLoading(false);
      return createMessage.warning(e.message);
    }
  }

  async function handleSaveInModify() {
    // const listField: any = getEnableCols();
    const list = gridApi.getDataSource().map(el => {
      if (!el.file || el.file.length === 0) {
        throw new Error('请上传文件');
      }
      console.log(el);
      const target = {
        ...el,
        ...el.file[0],
      };
      delete target.file;
      return target;
    });
    return saveTemplateManagement(list).then(() => {
      closePopup();
    });
  }

  const { t } = useI18n();
  const emits = defineEmits(['register', 'reload']);

  const isAddNewItem = computed(() => {
    return state.type == DETAIL_PAGE_TYPE_ENUM.新增;
  });

  const [Grid, gridApi] = useVbenVxeGrid({
    gridOptions: {
      id: 'basicData-templateManagement',
      columns: getColumns(),
      height: 'auto',
      keepSource: true,
      editConfig: {
        trigger: 'dblclick',
        mode: 'row',
      },
      editRules,
      rowConfig: {
        keyField: 'id',
      },
      areaConfig: {
        multiple: true, // 是否启用多区域选取功能
      },
      data: [state.initFields],
      proxyConfig: {
        enabled: false,
      },
      toolbarConfig: {
        enabled: false,
      },
      // clipConfig: {
      // 	isPaste: true,
      // 	afterPasteMethod: handleAfterPaster,
      // },
      i18nConfig: {
        // moduleCode: 'WorkCenterColumn',
      },
      pagerConfig: {
        enabled: false,
      },
    },
  });

  const handleUpload = debounce(async row => {
    currentUploadId.value = row.id;
    uploadRef.value?.click();
  }, 1000);

  function afterUpload(fileList) {
    console.log('🚀 ~ afterUpload ~ fileList: ', fileList);
    const list = getDataSource();
    const fileListBackup = cloneDeep(fileList);
    const index = list.findIndex(el => el.id == currentUploadId.value);
    console.log('🚀 ~  ~ currentUploadId.value: ', currentUploadId.value);
    console.log('🚀 ~ afterUpload ~ list: ', list);

    const { file } = list[index];
    if (file && file.length) {
      // 如果当前的行数据已经有数据了，则进行拼接
      list[index].file = file.concat(fileListBackup);
    } else {
      list[index].file = fileListBackup;
    }
    console.log('🚀 ~ afterUpload ~ list: ', list);
    createMessage.success(t('component.upload.uploadSuccess'));
    uploadRef.value.clearUploadFileList();
    gridApi.reloadData(list);
  }

  async function handlePreview(item) {
    const params = {
      name: item.fileName,
      filePath: item.filePath,
      version: 2,
    };
    filePreviewRef.value?.init(params);
  }

  function disableColumn(columns) {
    console.log('🚀 ~ disableColumn ~ columns: ', columns);
    return columns
      .map(item => {
        if (item.field === 'factory' || item.field === 'sapCode') {
          delete item.editRender;
          delete item.formatter;
        }
        return item;
      })
      .filter(item => item.field !== 'action');
  }

  function getTableData(rows: Array<string>) {
    const rawRows = cloneDeep(toRaw(rows));
    gridApi.reloadData(rawRows);
    setTimeout(() => {
      console.log(gridApi.getDataSource(), 'gridApi.getDataSource()gridApi.getDataSource()gridApi.getDataSource()');
    }, 1000);
  }

  // 删除数据
  function handleDelete(row: any) {
    createConfirm({
      iconType: 'warning',
      title: t('common.tipTitle'),
      content: t('common.batchDelTip'),
      onOk: () => {
        gridApi.remove(row);
        return Promise.resolve();
      },
    });
  }

  // 增加列
  function addColumn(line, index = -1) {
    const list = getDataSource();
    const addList: Array<any> = [];
    for (let i = 0; i < line; i++) {
      addList.push({
        id: buildUUID(),
        ...state.initFields,
      });
    }
    if (index === -1) {
      list.push(...addList);
    } else {
      list.splice(index + 1, 0, ...addList);
    }
    gridApi.reloadData(list);
  }

  function handleCopy(row: any) {
    const item = cloneDeep(row);
    item.id = buildUUID();
    const list = getDataSource();
    const index = list.findIndex(el => el.id == row.id);
    list.splice(index, 0, item);
    gridApi.reloadData(list);
  }

  function getDataSource() {
    return cloneDeep(gridApi.getDataSource());
  }

  function getTableActions(row: any, rowIndex: number): ActionItem[] {
    const list: ActionItem[] = [
      {
        label: '上传附件',
        onClick: handleUpload.bind(null, row),
      },
      {
        label: '',
        icon: 'icon-ym icon-ym-btn-add',
        onClick: addColumn.bind(null, 1, rowIndex),
      },
      {
        label: '',
        icon: 'icon-ym icon-ym-btn-copy',
        onClick: handleCopy.bind(null, row),
      },
      {
        label: '',
        color: 'error',
        icon: 'icon-ym icon-ym-delete',
        onClick: handleDelete.bind(null, row),
      },
    ];

    return isAddNewItem.value ? list : list.slice(2);
  }

  async function handleSave() {
    // if (await gridApi.grid.validate(true)) {
    // 	return createMessage.warning(t('dict.SalesSiteColumn.requiredTip'));
    // }
    changeLoading(true);
    return pageInfo.value
      .saveFn()
      .then(() => {
        createMessage.success(t('sys.api.operationSuccess'));
        emits('reload');
        // closePopup();
      })
      .finally(() => {
        changeLoading(false);
      });
  }

  // function getEnableCols() {
  //   const excludeFields: Array<string> = ['id'];
  //   const fields: Array<string> = [];
  //   gridApi.grid
  //     .getColumns()
  //     .slice(1, -1)
  //     .forEach((el: any) => {
  //       if (!el.disabled && !excludeFields.includes(el.field)) {
  //         fields.push(el.field);
  //       }
  //     });
  //   return fields;
  // }
</script>

<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    :showOkBtn="true"
    :okText="t('common.saveText')"
    :title="pageInfo.title"
    @ok="handleSave"
    class="full-popup">
    <div class="h-full requirement-pop p-10px">
      <Subtitle :title="t('common.template')" class="mt-8px" :extra="{ show: isAddNewItem, hideAdd: true }">
        <template #extra>
          <AddCustomRows @submit="addColumn" style="display: inline-flex" />
        </template>
      </Subtitle>
      <Grid>
        <template #action="{ row, rowIndex }">
          <TableAction :outside="true" :actions="getTableActions(row, rowIndex)" />
        </template>
        <template #files="{ row }">
          <FileCell :list="row.file" @click="handlePreview"></FileCell>
        </template>
      </Grid>
    </div>
    <UploadBtn ref="uploadRef" type="link" uploadPath="TemplateFile" :maxFileSize="30" @success="afterUpload"></UploadBtn>
    <!-- 上传文件，最大为30M -->
    <PreviewModal ref="filePreviewRef" />
  </BasicPopup>
</template>
