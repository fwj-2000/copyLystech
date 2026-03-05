<template>
  <BasicModal
    :title="state.title"
    canFullscreen
    :draggable="true"
    v-bind="$attrs"
    :width="1100"
    @register="registerModal"
    destroy-on-close
    :cancelText="t('common.closeText')"
    :show-ok-btn="false">
    <Grid :style="{ minHeight: '550px' }">
      <template #file="{ row }">
        <a @dblclick="handlePreview(row)">{{ row.originFileName || row.fileName }}</a>
      </template>
      <template #action="{ row }">
        <a-button type="link" @click="handleHistoryDownload(row)">{{ t('component.upload.download') }} </a-button>
      </template>
    </Grid>
    <PreviewModal ref="filePreviewRef" />
  </BasicModal>
</template>

<script lang="ts" setup>
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { reactive, ref } from 'vue';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { PreviewModal } from '/@/components/Upload';
  import { downloadFile } from '/@/utils/file/download';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { get } from 'lodash-es';
  import { isBoolean } from '/@/utils/is';
  const { t } = useI18n();

  const emit = defineEmits(['changeLoading', 'register']);
  const [registerModal] = useModalInner(initData);

  const state = reactive<any>({
    useMerge: true,
    usePath: false,
    downloadApi: null,
    title: t('component.upload.title'),
  });

  const columns = ref([
    {
      title: t('component.upload.version'),
      field: 'version',
      formatter: ({ cellValue }) => {
        return `T${cellValue}`;
      },
      width: 80,
    },
    {
      title: t('dict.CommonCol.status'),
      field: 'status',
      width: 100,
      cellRender: {
        name: 'Tag',
        options: [
          {
            id: 0,
            fullName: t('common.disableText'),
            theme: 'red',
          },
          {
            id: 1,
            fullName: t('common.enableText'),
            theme: 'green',
          },
          {
            id: 2,
            fullName: t('common.disableText'),
            theme: 'red',
          },
        ],
      },
    },
    {
      title: t('component.upload.name'),
      field: 'originFileName',
      slots: {
        default: 'file',
      },
      minWidth: 200,
    },
    { title: t('component.upload.time'), field: 'creatorTime', width: 180, cellRender: { name: 'Date' } },
    {
      title: t('component.upload.user'),
      field: 'creatorUserName',
      width: 180,
    },
    {
      title: t('common.action'),
      field: 'action',
      slots: {
        default: 'action',
      },
      width: 180,
    },
  ]);

  const [Grid, gridApi] = useVbenVxeGrid({
    gridOptions: {
      id: 'component-upload-fileModal',
      columns: columns.value,
      rowConfig: {
        keyField: 'id',
      },
      toolbarConfig: {
        enabled: false,
      },
      pagerConfig: {
        autoHidden: false,
        enabled: false,
      },
      position: 'modal',
    },
  });
  const { reloadData, setGridOptions, setLoading } = gridApi;

  const filePreviewRef = ref<any | null>(null);
  async function handlePreview(item) {
    const params = {
      name: item.originFileName || item.fileName,
      Id: item.id,
      previewType: 'localPreview',
      noCache: false,
      isCopy: 0,
    };
    if (state.usePath) {
      delete params.Id;
      params.url = item.path || item.filePath;
    }
    filePreviewRef.value?.init(params);
  }

  function initData(data: {
    id: string; // 主键
    keyFieldName: string; // 主键字段名
    listApi: Function; // 获取文件列表接口
    resultField: string; // 返回结果字段
    useQuery: boolean; // 是否使用查询
    hideVersion: boolean; // 是否隐藏版本列
    usePath: boolean; // 是否使用路径下载
    useMerge: boolean; // 是否合并单元格
    downloadApi: Function; // 下载接口
    title: string; // 标题
  }) {
    console.log(data);
    setLoading(true);
    state.title = data.title || t('component.upload.title');
    state.downloadApi = data.downloadApi;
    state.hideVersion = isBoolean(data.hideVersion);
    state.usePath = isBoolean(data.usePath);
    state.useMerge = isBoolean(data.useMerge);
    if (isBoolean(data.hideVersion)) {
      for (let i = 0; i < columns.value.length; i++) {
        if (columns.value[i].field == 'version') {
          columns.value.splice(i, 1);
          continue;
        }
      }
    }
    getFileList(data);
  }

  // 请求文件列表
  function getFileList(data) {
    let param;
    const keyFieldName = data.keyFieldName || 'id';
    if (data.useQuery) {
      param = {
        [keyFieldName]: data[keyFieldName],
      };
    } else {
      param = data[keyFieldName];
    }
    data
      .listApi(param)
      .then(({ data: retData }) => {
        let list = retData;
        if (data.resultField) {
          list = get(retData, data.resultField);
        }
        reloadData(list);
        mergeCells(list);
      })
      .finally(() => {
        setLoading(false);
      });
  }
  // 处理合并
  function mergeCells(data) {
    if (state.useMerge) {
      // 修改表格配置
      setGridOptions({
        mergeCells: [...getMergeCellInfo('version', data), ...getMergeCellInfo('status', data, 'version')] as any,
      });
    }
  }

  /**
   * 获取单元格合并信息
   * @param mergeKey 需要合并的列字段
   * @param data 表格数据
   * @param preMergeKey 上一次合并的列字段，只有上一次合并的字段相同，才能合并
   */
  function getMergeCellInfo(mergeKey: string, data: Array<any>, preMergeKey?: string): Array<{ row: number; col: number; rowspan: number; colspan: number }> {
    const merges: any = [];
    const headers = columns.value.map(item => item.field);
    if (data.length === 0) return merges;

    // 获取合并字段的列索引（从0开始）
    const colIndex = headers.indexOf(mergeKey);
    if (colIndex === -1) return merges;
    let startRow = 0;
    let currentValue = data[0][mergeKey];
    let currentPreMergeValue = preMergeKey ? data[0][preMergeKey] : undefined;

    for (let row = 1; row <= data.length; row++) {
      // 当前值（处理最后一行）
      const rowValue = row < data.length ? data[row][mergeKey] : null;
      if (row === data.length || rowValue !== currentValue || (preMergeKey && data?.[row]?.[preMergeKey] !== currentPreMergeValue)) {
        const span = row - startRow;
        if (span > 1) {
          merges.push({
            row: startRow,
            col: colIndex,
            rowspan: span,
            colspan: 1,
          });
        }
        startRow = row;
        currentValue = rowValue;
        currentPreMergeValue = preMergeKey ? data?.[row]?.[preMergeKey] : undefined;
      }
    }

    return merges;
  }

  //  处理下载
  async function handleHistoryDownload(val) {
    if (state.usePath) {
      return downloadFile({ url: val.filePath, target: '_blank', fileName: val.fileName, originFileName: val.originFileName });
    }
    const {
      data: { name, url },
    } = await state.downloadApi(val.id);
    downloadFile({ url: url, target: '_blank', fileName: name });
  }
</script>
<style lang="less" scoped>
  .content-box {
    padding: 10px 40px;
    height: 74vh;
    overflow-y: scroll;
  }

  .bottom-box {
    position: relative;
    background: #fff;
    box-shadow: 0 -5px 15px -3px rgb(0 0 0 / 12%), 0 -5px 12px -3px rgb(0 0 0 / 15%), 0 -2px 4px -3px rgb(0 0 0 / 25%);
  }

  .bottom-submit {
    display: flex;
    bottom: 0;
    height: 66px;
    width: 100%;
    padding: 16px;
    flex-direction: row;
    justify-content: space-between;
  }

  .row-margin {
    margin-bottom: 10px;
  }

  .btn-not-primary {
    color: #ff7b00;
    border: 1px solid #ff7b00;
  }

  .form-pd {
    padding: 0 15px 15px;
  }

  :deep(.ant-form-item) {
    margin-bottom: 12px !important;
  }

  //:deep(.lydc-basic-form) {
  //  margin-bottom: 12px;
  //}
  .title-stick {
    display: flex;
    align-items: center;
    margin-bottom: 10px;

    .gun {
      border-radius: 2px;
      background: #ff7b00;
      width: 2px;
      height: 14px;
      margin-right: 10px;
    }

    .title {
      color: #1a1a1a;
      font-size: 14px;
      font-style: normal;
      font-weight: 700;
      line-height: 22px; /* 157.143% */
    }
  }

  :deep(.ant-collapse-content > .ant-collapse-content-box) {
    padding: 0;
  }

  :deep(.pic-list .ant-table-thead > tr > th, .ant-table tfoot > tr > th, .ant-table tfoot > tr > td) {
    padding: 8px;
  }

  :deep(.pic-list .ant-table-tbody > tr > td) {
    padding: 8px;
  }

  //:deep(.ant-table .ant-table-cell) {
  //  white-space: nowrap;
  //  overflow: hidden;
  //  text-overflow: ellipsis;
  //}

  :deep(.ant-table .ant-table-cell) {
    white-space: normal !important;
  }

  :deep(.pic-list .ant-btn) {
    padding: 0;
  }
</style>
