<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    :showOkBtn="state.mode != 'view'"
    :okText="t('common.submit')"
    :okButtonProps="{ class: 'mr-12px' }"
    :title="t('routes.business-basicInformation-projectFiles-qsDeal')"
    @ok="handleSave(true)"
    class="full-popup">
    <!-- 暂存按钮移至centerToolbar插槽，这样顺序就是：取消，暂存，提交 -->
    <template #centerToolbar>
      <a-button v-if="state.mode != 'view'" class="ml-12px" @click="handleSave(false)" type="primary" ghost>{{ t('common.temporarySave') }}</a-button>
    </template>
    <div class="h-full requirement-pop">
      <Subtitle :title="t('common.qsInfo')" class="mt-2px"> </Subtitle>
      <Grid>
        <template #action="{ row }">
          <TableAction :outside="true" :actions="getTableActions(row)" />
        </template>
        <template #files="{ row }">
          <span class="table-a" @click="handlePreview(row)">{{ row.problemReleaseFiles ? t('common.searchDetail') : '' }}</span>
        </template>
      </Grid>
    </div>
    <PreviewModal ref="filePreviewRef" />
  </BasicPopup>
</template>
<script lang="ts" setup>
  import { reactive, ref } from 'vue';
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { TableAction, ActionItem } from '/@/components/Table';
  import { cloneDeep, pick } from 'lodash-es';
  import { handleProblem, temporaryStorage } from '/@/api/business/projectQsDeal';
  import { getQsDetail } from '/@/api/business/projectQs';
  import { Subtitle } from '/@/components/Subtitle';
  import { useVbenVxeGrid, VxeGridProps } from '/@/adapter/vxe-table';
  import { columnsAdd } from '../config';
  import { PreviewModal } from '/@/components/Upload';

  const emits = defineEmits(['register', 'refresh']);

  interface State {
    mode: 'add' | 'edit' | 'view';
    base: any;
    line: number;
    validate: string;
    initFields: any;
  }

  const { t } = useI18n();
  const state = reactive<State>({
    mode: 'add',
    base: {},
    line: 1,
    validate: '',
    initFields: {},
  });

  const { createMessage } = useMessage();

  const gridOptions: VxeGridProps = {
    id: 'business-basicInformation-projectFiles-qsPublish-edit',
    columns: columnsAdd,
    height: 'auto',
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
    scrollX: { enabled: true },
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
  const { reloadColumn, reloadData } = gridApi;

  const [registerPopup, { closePopup, changeLoading }] = usePopupInner(init);

  // 初始化
  async function init(data) {
    state.mode = data.mode || 'add';
    // 判断当前的环境
    const detailcolumn = cloneDeep(columnsAdd);
    if (state.mode == 'view') {
      detailcolumn.pop();
    }
    reloadColumn(detailcolumn);
    handleDetail(data.list);
  }

  function getTableActions(row): ActionItem[] {
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

  // 文件预览
  const filePreviewRef = ref<any | null>(null);
  async function handlePreview(item) {
    const params = {
      fileList: item.problemReleaseFiles,
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

  async function handleSave(type) {
    changeLoading(true);
    const pickFields = ['id', 'analysisConclusion', 'problemHandleProgress'];
    const list = gridApi.grid.getFullData().map(el => pick(el, pickFields));
    // 参数
    let methods = type ? handleProblem : temporaryStorage;
    methods(list)
      .then(() => {
        changeLoading(false);
        createMessage.success(t('sys.api.operationSuccess'));
        emits('refresh');
        closePopup();
      })
      .catch(err => {
        console.error(err);
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
