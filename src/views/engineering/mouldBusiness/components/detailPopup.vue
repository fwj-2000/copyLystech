<template>
  <BasicPopup v-bind="$attrs" @register="registerPopup" :showOkBtn="false" :showCancelBtn="true" :title="title" :destroyOnClose="true" :showFooter="false">
    <template #insertToolbar>
      <!-- 模具审核添加下载图纸 -->
      <a-button class="mx-12px" v-auth="'btn_download'" @click="downloadFn" v-if="hasReviewPermission">{{ t('common.downloadDrawingText') }} </a-button>
    </template>
    <template #centerToolbar>
      <!-- 申请页面 没有hasReviewPermission 显示primary 按钮下载图纸 放后面 -->
      <a-button class="mx-12px" v-auth="'btn_download'" type="primary" @click="downloadFn" v-if="!hasReviewPermission"
        >{{ t('common.downloadDrawingText') }}
      </a-button>
      <template v-if="[0].includes(state.status)">
        <a-button class="mx-12px" v-auth="'btn_reject'" type="primary" ghost @click="() => rejectFn()">
          {{ t('common.rejectText') }}
        </a-button>
        <!-- <a-button class="mr-12px" v-auth="'btn_download'" type="primary" ghost @click="downloadFn">{{ t('common.downloadDrawingText') }}</a-button> -->
        <a-button class="mr-12px" v-auth="'btn_agree'" type="primary" @click="() => agreenFn()">{{ t('common.agree') }}</a-button>
      </template>
    </template>
    <div style="height: calc(100vh - 200px)">
      <Grid>
        <template #buttons>
          <Subtitle :title="t('dict.MoldApply.MoldInfo')" class="pd-0" />
        </template>

        <template #moldDrawingsId="{ row }">
          <a @click="() => handlePreviewFile(row)">
            {{ row.moldDrawingsName }}
          </a>
        </template>
      </Grid>
    </div>
  </BasicPopup>
  <Preview ref="filePreviewRef" />
  <rejectModal @register="registerRejectModal" />
</template>
<script lang="ts" setup>
  import { reactive, toRefs, ref, computed } from 'vue';
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import Subtitle from '/@/components/Subtitle/src/Subtitle.vue';
  import { bulkAuditagree, bulkAuditreject, getMoldapplyDetail } from '/@/api/engineering/mould';
  import { APPLY_DETAIL_COLUMNS } from './config';
  import Preview from '/@/views/basicData/productCodeApply/components/Preview.vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import rejectModal from '../components/rejectModal.vue';
  import { useModal } from '/@/components/Modal';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { fileDownload } from '/@/api/basicData/processrulestemplate';
  import { downloadFile } from '/@/utils/file/download';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';

  const { t } = useI18n();

  const filePreviewRef = ref<any>(null);
  const emits = defineEmits(['register', 'reload']);
  interface State {
    title: string;
    id: string;
    orgId: string;
    tableData: any;
    columns: any;
    status: any;
    moldDrawingsId: string;
  }

  const state = reactive<State>({
    title: '',
    id: '',
    orgId: '',
    tableData: [],
    columns: [],
    status: null,
    moldDrawingsId: '',
  });
  const { title } = toRefs(state);
  const { createMessage, createConfirm } = useMessage();
  const [registerRejectModal, { openModal: openRejectModal }] = useModal();
  const [registerPopup, { closePopup, changeLoading }] = usePopupInner(init);

  const [Grid, gridApi] = useVbenVxeGrid({
    showSearchForm: false,
    gridOptions: {
      id: 'engineering-mouldBusiness-detail-list',
      showIndexColumn: true,
      columns: APPLY_DETAIL_COLUMNS,
      pagerConfig: {
        enabled: false,
      },
      toolbarConfig: {
        enabled: true,
        refresh: false,
        custom: true,
        slots: {
          buttons: 'buttons',
        },
      },
      customConfig: {
        allowVisible: false,
      },
      i18nConfig: {
        moduleCode: 'MoldApplyColumn',
      },
    },
  });

  const { hasBtnP } = usePermission();
  const hasReviewPermission = computed(() => {
    return hasBtnP('btn_reject');
  });

  function init({ id, title, status }) {
    state.title = title;
    state.id = id;
    state.status = status;
    if (!id) return;
    getMoldapplyDetailFn(id);
  }

  async function getMoldapplyDetailFn(id) {
    changeLoading(true);
    try {
      const { data, code } = await getMoldapplyDetail(id);
      if (code === 200) {
        state.tableData = data.map(o => {
          o.urgentLevel = o.urgentLevel ? String(o.urgentLevel) : '';
          return o;
        });
        if (state.status === undefined) {
          state.status = data[0].status;
        }
        state.id = data[0].headId; //通过子id获取列表时，重新赋值id字段为表头id
        state.moldDrawingsId = data[0].moldDrawingsId; // 复制模具图纸id
        gridApi.reloadData(data);
        // getRowSpanRuleFn();
      }
    } catch (error) {
      console.error(error, 'getMoldapplyDetailFn error');
    } finally {
      changeLoading(false);
    }
  }

  function rejectFn() {
    openRejectModal(true, { ids: [state.id], rejectApi: bulkAuditreject });
  }

  function agreenFn() {
    const tips = t('common.agreenOperationText');
    createConfirm({
      iconType: 'warning',
      title: t('common.tipTitle'),
      content: tips,
      onOk: async () => {
        try {
          const { code, msg } = await bulkAuditagree([state.id]);
          if (code === 200) {
            createMessage.success(msg);
            initFn();
          } else {
            createMessage.error(msg);
          }
        } catch (e) {
          initFn();
        }
      },
    });
  }

  async function downloadFn() {
    const id = state.moldDrawingsId;
    try {
      const { data, code } = await fileDownload(id);
      if (code === 200) {
        downloadFile({ url: data.url, fileName: data.name });
      }
    } catch (error) {
      console.error(error);
    }
  }

  function handlePreviewFile(row: any) {
    filePreviewRef.value &&
      filePreviewRef.value.init({
        name: row.moldDrawingsName,
        Id: row.moldDrawingsId,
        previewType: 'localPreview',
        noCache: false,
        isCopy: 0,
      });
  }

  function initFn() {
    emits('reload');
    closePopup();
  }
</script>

<style lang="less" scoped>
  .warp {
    display: flex;
    align-items: baseline;
    flex-wrap: nowrap;
    position: relative;
    padding: 0 10px;
    box-sizing: border-box;

    &-btn {
      display: flex;
      align-items: center;
    }

    &-left {
      flex: 1;
      display: flex;
      align-items: baseline;
      padding: 0 12px;
      min-width: 400px;
      flex-wrap: nowrap;
    }
  }

  .table-box {
    height: 100%;
    background-color: rgb(88 105 132);
  }

  div.pd-0 {
    padding-bottom: 0;
  }
</style>
