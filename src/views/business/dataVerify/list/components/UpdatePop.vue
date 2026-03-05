<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    :showCancelBtn="true"
    :showOkBtn="true"
    :okButtonText="t('common.sendText')"
    :title="state.fileName"
    destroyOnClose
    @ok="handleSave"
    class="full-popup">
    <template #centerToolbar>
      <a-button v-if="state.fileId" class="ml-3" type="primary" ghost @click="handleSave('save')">保存校验</a-button>
      <UploadBtn
        v-else
        ref="uploadRef"
        type="primary"
        accept=".xls,.xlsx"
        :buttonProps="{ ghost: true }"
        class="ml-3"
        :customUpload="handleUpload"
        :title="t('common.uploadFile')" />
    </template>
    <div class="h-full p-10px">
      <Grid></Grid>
    </div>
  </BasicPopup>
</template>
<script lang="ts" setup>
  import { reactive } from 'vue';
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { getUploadPreview, updateexceldetail, importData } from '/@/api/business/dataVerify';
  import { transformTableWithErrors } from './updateConfig';
  import { UploadBtn } from '/@/components/Upload';
  const emits = defineEmits(['register', 'refresh']);

  const [registerPopup, { closePopup, changeLoading, changeOkLoading }] = usePopupInner(init);

  const [Grid, { reloadData, reloadColumn, getDataSource }] = useVbenVxeGrid({
    gridOptions: {
      id: 'business-dataVerify-list-edit',
      columns: [],
      toolbarConfig: {
        enabled: false,
      },
      pagerConfig: {
        enabled: false,
      },
      editConfig: {
        trigger: 'dblclick',
        mode: 'row',
      },
      clipConfig: {
        isPaste: true,
        afterPasteMethod: handleAfterPaster,
      },
      cellStyle: ({ row, columnIndex }) => {
        if (row.errMsg) {
          const { _errorDetails } = row;
          const isError = _errorDetails.find(item => item.colIndex === columnIndex);
          if (isError) {
            return { color: 'red' };
          }
        }
        return {};
      },
    },
  });

  const state = reactive<any>({
    fileId: '', // 文件ID
    fileName: '', // 文件名称
  });

  function handleAfterPaster({ targetAreas }) {
    if (targetAreas.length === 0) {
      return;
    }
  }

  async function init(data) {
    state.fileName = '';
    state.fileId = '';
    if (data.id && data.id != '') {
      getDetail(data.id);
    } else {
      state.fileName = t('common.addText');
      reloadColumn([]);
      reloadData([]);
    }
  }

  function getDetail(id) {
    changeLoading(true);
    getUploadPreview({ id })
      .then(res => {
        const { data } = res;
        state.fileId = id;
        state.fileName = data.fileName;
        data.excelArray.splice(0, 1); // 去掉表头
        const advancedTable = transformTableWithErrors(data);
        state.transColumns = advancedTable.headers;
        reloadColumn(advancedTable.headers);
        reloadData(advancedTable.tableData);
      })
      .finally(() => {
        changeLoading(false);
      });
  }

  // 文件上传
  function handleUpload(file) {
    changeLoading(true);
    importData({ files: file })
      .then(res => {
        const { data } = res;
        state.fileId = data;
        getDetail(data);
        emits('refresh');
      })
      .finally(() => {
        changeLoading(false);
      });
  }

  const { t } = useI18n();
  async function handleSave(type) {
    changeLoading(true);
    changeOkLoading(true);
    try {
      // 抓取表格数据
      const tableData = getDataSource();
      const _columns = JSON.parse(JSON.stringify(state.transColumns));
      _columns.splice(0, 1); // 去掉校验信息列
      let data = tableData.map(row => {
        let subRowArr: any = [];
        _columns.forEach(header => {
          subRowArr.push(row[header.field]);
        });
        return subRowArr;
      });
      // 补充第一行空数据
      const firstLine = _columns.map(() => {
        return '';
      });
      data.unshift(firstLine);
      const params = {
        id: state.fileId,
        excelData: data,
      };
      const res = await updateexceldetail(params);
      if (type == 'save') {
        // 刷新数据
        getDetail(state.fileId);
      } else {
        emits('refresh');
        closePopup();
      }
    } finally {
      changeLoading(false);
      changeOkLoading(false);
    }
  }
</script>
