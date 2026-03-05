<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    :showOkBtn="state.mode != 'view'"
    :okText="t('common.submit')"
    :okButtonProps="{ class: 'mr-12px' }"
    :title="title"
    @ok="handleSave(true)"
    class="full-popup">
    <template #centerToolbar>
      <a-button v-if="state.mode != 'view'" class="ml-12px" @click="handleSave(false)" type="primary" ghost>{{ t('common.temporarySave') }}</a-button>
    </template>
    <div class="h-full requirement-pop">
      <Subtitle :title="t('common.qsInfo')" placement="vxe" :extra="{ show: state.mode == 'add' }" @addColumn="addColumn"> </Subtitle>
      <Grid>
        <template #action="{ row }">
          <TableAction :outside="true" :actions="getTableActions(row)" />
        </template>
        <template #files="{ row }">
          <span class="table-a" @click="handlePreview(row)">{{ row.problemReleaseFiles ? t('common.searchDetail') : '' }}</span>
        </template>
      </Grid>
    </div>
    <UploadBtn ref="uploadRef" type="link" accept="image/*" @success="afterUpload"></UploadBtn>
    <PreviewModal ref="filePreviewRef" />
  </BasicPopup>
</template>
<script lang="ts" setup>
  import { reactive, toRefs, ref } from 'vue';
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { TableAction, ActionItem } from '/@/components/Table';
  import { cloneDeep, debounce, pick } from 'lodash-es';
  import { getQsDetail, publishProblem, temporaryStorage } from '/@/api/business/projectQs';
  import { Subtitle } from '/@/components/Subtitle';
  import { useVbenVxeGrid, VxeGridProps } from '/@/adapter/vxe-table';
  import { buildUUID } from '/@/utils/uuid';
  import { columnsAdd } from '../config';
  import { UploadBtn, PreviewModal } from '/@/components/Upload';

  const emits = defineEmits(['register', 'refresh']);

  interface State {
    mode: 'add' | 'edit' | 'view';
    title: string;
    base: any;
    line: number;
    validate: string;
    initFields: any;
  }

  const { t } = useI18n();
  const state = reactive<State>({
    mode: 'add',
    title: '',
    base: {},
    line: 1,
    validate: '',
    initFields: {},
  });
  const { title } = toRefs(state);

  const { createMessage } = useMessage();

  const gridOptions: VxeGridProps = {
    id: 'business-basicInformation-projectFiles-qsPublish-edit',
    columns: columnsAdd,
    data: [state.initFields],
    editConfig: {
      trigger: 'dblclick',
      mode: 'row',
      beforeEditMethod() {
        return state.mode == 'add';
      },
    },
    rowConfig: {
      keyField: '_X_ROW_KEY',
    },
    keyboardConfig: {
      isClip: true,
      isEdit: true,
      isDel: true,
      isEsc: true,
    },
    proxyConfig: {
      enabled: false,
    },
    toolbarConfig: {
      enabled: false,
    },
    clipConfig: {
      isPaste: true,
      // afterPasteMethod: handleAfterPaster,
    },
    i18nConfig: {
      moduleCode: 'ProblemColumn',
    },
    showIndexColumn: true,
    pagerConfig: {
      enabled: false,
    },
    position: 'modal',
  };
  const [Grid, gridApi] = useVbenVxeGrid({ gridOptions });
  const { reloadColumn, getDataSource, reloadData } = gridApi;

  const [registerPopup, { closePopup, changeLoading }] = usePopupInner(init);

  // 初始化
  async function init(data) {
    state.mode = data.mode || 'add';
    // 判断当前的环境
    const detailcolumn = cloneDeep(columnsAdd);
    switch (state.mode) {
      case 'add':
        state.title = t('common.addText');
        break;
      case 'edit':
        state.title = t('common.editText');
        break;
      case 'view':
        state.title = t('common.detailText');
        detailcolumn.pop();
        break;
      default:
        break;
    }
    reloadColumn(detailcolumn);
    handleDetail(data.list);
  }

  function getTableActions(row): ActionItem[] {
    return [
      {
        label: t('common.upFiles'),
        onClick: handleUpload.bind(null, row),
      },
      {
        label: '',
        icon: 'icon-ym icon-ym-btn-copy',
        tooltip: t('common.copyText'),
        onClick: handleCopy.bind(null, row),
        ifShow: state.mode == 'add',
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

  const uploadRef = ref();
  const currentUploadId = ref('');
  const uploadLoading = ref(false);
  // 上传数据
  const handleUpload = debounce(async row => {
    if (uploadLoading.value) return;
    uploadLoading.value = true;
    currentUploadId.value = row._X_ROW_KEY;
    uploadRef.value?.click();
  }, 1000);
  // 拿到上传后的图片进行处理
  function afterUpload(fileList) {
    uploadLoading.value = false;
    const list = getDataSource();
    const index = list.findIndex(el => el._X_ROW_KEY == currentUploadId.value);
    const { problemReleaseFiles, initFiles = [] } = list[index];
    if (problemReleaseFiles && problemReleaseFiles.length) {
      // 如果当前的行数据已经有数据了，则进行拼接
      list[index].problemReleaseFiles = initFiles.concat(fileList);
    } else {
      list[index].problemReleaseFiles = fileList;
    }
    createMessage.success(t('component.upload.uploadSuccess'));
    reloadData(list);
  }
  // 文件预览
  const filePreviewRef = ref<any | null>(null);
  async function handlePreview(row) {
    const params = {
      // name: item.fileName,
      // filePath: item.filePath,
      fileList: row.problemReleaseFiles,
      version: 2,
    };
    filePreviewRef.value?.init(params);
  }

  // 获取详情
  async function handleDetail(list) {
    if (list && list.length) {
      changeLoading(true);
      try {
        const res = await getQsDetail(list.map(el => el.id));
        if (res.code == 200) {
          const { data } = res;
          reloadData(
            (data || []).map(el => {
              el._X_ROW_KEY = el.id;
              el.problemReleaseFiles = el.problemReleaseFiles || [];
              el.initFiles = el.problemReleaseFiles || [];
              return el;
            }),
          );
        }
        changeLoading(false);
      } catch (error) {
        console.error(error);
        closePopup();
      }
    }
  }

  // 删除数据
  function handleDelete(row) {
    gridApi.grid.remove(row);
  }
  // 增加列
  function addColumn(line) {
    const list = getDataSource();
    for (let i = 0; i < line; i++) {
      list.push({
        _X_ROW_KEY: buildUUID(),
        ...state.initFields,
      });
    }
    gridApi.grid.reloadData(list);
  }
  function handleCopy(row) {
    const item = cloneDeep(row);
    item._X_ROW_KEY = buildUUID();
    const list = getDataSource();
    const index = list.findIndex(el => el._X_ROW_KEY == row._X_ROW_KEY);
    list.splice(index, 0, item);
    gridApi.grid.reloadData(list);
  }

  async function handleSave(type) {
    changeLoading(true);
    const pickFields = [
      'id',
      'seriousness',
      'problemReleaseFiles',
      'stage',
      'component',
      'problemDesc',
      'dutyUserId',
      'projectUserId',
      'occurDate',
      'planDate',
      'isEsiNotActuallyProblem',
      'isEsiOmissionProblem',
      'remarks',
    ];
    const list = gridApi.grid.getFullData().map(el => pick(el, pickFields));
    // 参数
    let methods = type ? publishProblem : temporaryStorage;
    methods(list)
      .then(() => {
        changeLoading(false);
        createMessage.success(t('sys.api.operationSuccess'));
        emits('refresh');
        closePopup();
      })
      .catch(() => {
        changeLoading(false);
      });
  }
</script>

<style lang="less">
  .requirement-pop {
    display: flex;
    flex-direction: column;
    padding: 10px 12px;
  }
</style>
