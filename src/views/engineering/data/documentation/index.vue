<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content">
        <BasicTable @register="registerTable">
          <template #tableTitle>
            <!-- <a-button v-auth="'btn_upload'" type="primary" @click="openUploadPop()">{{ t('component.upload.batchUpload') }}</a-button> -->
            <a-dropdown>
              <template #overlay>
                <a-menu @click="openUploadPop">
                  <!-- 成品资料上传 -->
                  <a-menu-item key="1">{{ t('dict.PCC.uploadFinishedProduct') }} </a-menu-item>
                  <!-- 半成品资料上传 -->
                  <a-menu-item key="3">{{ t('dict.PCC.uploadSemiFinishedProduct') }} </a-menu-item>
                </a-menu>
              </template>
              <a-button v-if="hasBtnP('btn_upload')" type="primary">{{ t('component.upload.batchUpload') }}</a-button>
            </a-dropdown>
            <a-button v-auth="'btn_download'" type="primary" ghost @click="downloadFn">{{ t('common.downloadEngineDrawingText') }}</a-button>
            <a-button v-auth="'btn_recall'" type="primary" ghost @click="revokeFn()">{{ t('common.revoke') }}</a-button>
            <a-button v-auth="'btn_submit'" type="primary" ghost @click="submitFn()">{{ t('common.submit') }}</a-button>
            <a-button v-auth="'btn_batchRemove'" type="primary" ghost @click="delFn()">{{ t('common.batchDelText') }}</a-button>
            <!-- 重新上传 -->
            <a-button v-auth="'btn_reUpload'" type="primary" ghost @click="openReUploadPop">{{ t('common.reUpload') }}</a-button>
          </template>
          <template #bodyCell="{ column, record }">
            <template v-if="column.dataIndex === 'record'">
              <a @click="handleNodeModal(record)" v-auth="'btn_detail'">{{ t('common.viewDetails') }}</a>
            </template>
            <template v-if="column.dataIndex === 'status'">
              <LydcTag :theme="STATUS_OPTIONS[record[column.dataIndex]].theme" :text="STATUS_OPTIONS[record[column.dataIndex]].fullName"></LydcTag>
            </template>
            <template v-if="column.dataIndex === 'version'">
              <span> {{ record[column.dataIndex] !== 'undefined' ? 'T' + record[column.dataIndex] : '/' }} </span>
            </template>
            <template v-if="column.key === 'fileName'">
              <!--              <a :href="record.filePath">{{ record.fileName }}</a>-->
              <a-button @click.stop="handlePreview(record)" type="link">{{ record.fileName }} </a-button>
            </template>
          </template>
        </BasicTable>
      </div>
    </div>

    <ExportModal @register="registerExportModal" />
    <UploadPopup @register="registerUploadPopup" @reload="reload" />
    <PreviewModal ref="filePreviewRef" />
    <NodeModal @register="registerNodeModal"></NodeModal>
    <ECNConfirmModal @register="registerConfirmEcn" @close="reload" />
  </div>
</template>

<script setup lang="ts">
  import { BasicTable, useTable } from '/@/components/Table';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useModal } from '/@/components/Modal';
  import { usePopup } from '/@/components/Popup';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { ref } from 'vue';
  import ExportModal from '/@/components/ExportModal/index.vue';
  import { PreviewModal } from '/@/components/Upload';
  import { ModalComponent } from '/@/views/basicData/encodingSettings/types';
  import { COLUMNS, SEARCH_FORM_SCHEMA, STATUS_OPTIONS } from './config';
  import UploadPopup from './component/uploadPopup.vue';
  import { getEngineeringdocapply, withdraw } from '/@/api/engineering/engineeringReview';
  import { NodeModal } from '/@/components/CustomComponents';
  import { getNodeDetail } from '/@/api/engineering/ecn';
  import { formatTableDefaultText } from '/@/utils';
  import { bulkCommitEngineeringDocApply, bulkDeleteEngineeringDocApply } from '/@/api/engineering/pcc';
  import ECNConfirmModal from '/@/views/engineering/data/documentation/component/ECNConfirmModal.vue';
  import { cloneDeep, pick } from 'lodash-es';
  import { http2s, processUrl } from '/@/adapter/utils';
  import { useDownloadQueue } from '/@/hooks/files/useDownloadQueue';
  import { usePermission } from '/@/hooks/web/usePermission';

  defineOptions({ name: 'engineering-data-documentation' });
  const filePreviewRef = ref<ModalComponent | null>(null);
  const { t } = useI18n();
  const { hasBtnP } = usePermission();

  const { createMessage, createConfirm } = useMessage();
  const [registerNodeModal, { openModal: openNodeModal }] = useModal();
  const [registerExportModal, { openModal: openExportModal }] = useModal();
  const [registerUploadPopup, { openPopup: openUploadPopup }] = usePopup();
  const [registerConfirmEcn, { openModal: openConfirmEcn, closeModal: closeConfirmEcn }] = useModal();

  const [registerTable, { getSelectRows, getRowSelection, getSelectRowKeys, clearSelectedRowKeys, reload, getFetchParams, getDataSource }] = useTable({
    api: getEngineeringdocapply,
    title: '',
    columns: COLUMNS,
    rowKey: 'id',
    canResize: true,
    formConfig: {
      labelWidth: 100,
      schemas: SEARCH_FORM_SCHEMA,
      autoAdvancedLine: 1, //自动展开行
      i18nConfig: {
        moduleCode: 'PCCColumn',
        transferRange: ['placeholder'],
      },
    },
    striped: true,
    useSearchForm: true, //使用搜索表单
    showTableSetting: false, //刷新按钮,默认打开
    bordered: true, //显示表格边框
    showIndexColumn: true, //显示序号
    pagination: {
      pageSize: 30,
      size: 'small',
    },
    rowSelection: {
      type: 'checkbox',
      onChange: (a, b) => {},
    },
    transformCellText: ({ text }) => formatTableDefaultText(text),
    i18nConfig: {
      moduleCode: 'PCCColumn',
    },
  });

  function handleNodeModal(record) {
    openNodeModal(true, {
      api: getNodeDetail,
      id: record.id,
      fetchSetting: {
        listField: 'flowNodeInstanceHisList',
      },
    });
  }

  /** 上传资料：1 是成品  3 是半成品 */
  function openUploadPop({ key }: { key: '1' | '3' }) {
    openUploadPopup(true, { engineeringType: key });
  }

  async function handlePreview(record) {
    const params = {
      name: record.fileName,
      url: record.filePath,
      previewType: 'localPreview',
      noCache: false,
      isCopy: 0,
    };
    filePreviewRef.value?.init(params);
  }

  function submitFn() {
    const list = getSelectRows();
    const _ids = list.map(item => item.id);
    if (!_ids.length) return createMessage.warning(t('dict.PCCColumn.PleaseSelectTheSubmissionObjectTip'));
    const tips = t('dict.PCCColumn.whetherToSubmitOrNot');
    createConfirm({
      iconType: 'warning',
      title: t('common.tipTitle'),
      content: tips,
      onOk: async () => {
        const { data, code, msg } = await bulkCommitEngineeringDocApply(_ids);
        if (code === 200) {
          createMessage.warning(msg);
          // reload();
          clearSelectedRowKeys();
          openConfirmEcn(true, cloneDeep(list));
        } else {
          createMessage.error(msg);
        }
      },
    });
  }

  function delFn() {
    const _ids = getSelectRowKeys();
    if (!_ids.length) return createMessage.warning(t('dict.PCCColumn.pleaseChooseToDeleteTheObject'));
    const tips = t('common.delTip');
    createConfirm({
      iconType: 'warning',
      title: t('common.tipTitle'),
      content: tips,
      onOk: async () => {
        const { data, code, msg } = await bulkDeleteEngineeringDocApply(_ids);
        if (code === 200) {
          createMessage.warning(msg);
          reload();
          clearSelectedRowKeys();
        } else {
          createMessage.error(msg);
        }
      },
    });
  }

  function revokeFn() {
    const _ids = getSelectRowKeys();
    if (!_ids.length) return createMessage.warning(t('common.pleaseChooseToWithdrawTheObject'));
    const tips = t('common.withdrawSelectedData');
    createConfirm({
      iconType: 'warning',
      title: t('common.tipTitle'),
      content: tips,
      onOk: async () => {
        const { data, code, msg } = await withdraw(_ids);
        if (code === 200) {
          createMessage.warning(msg);
          reload();
          clearSelectedRowKeys();
        } else {
          createMessage.error(msg);
        }
      },
    });
  }

  // 下载文件
  const { startDownload } = useDownloadQueue();
  function downloadFn() {
    let rows = getSelectRows();
    startDownload(rows);
  }

  /** 打开重新上传弹窗 */
  function openReUploadPop() {
    const rows = getSelectRows();
    if (rows.length === 0) {
      return createMessage.warning(t('common.selectText'));
    }

    if (rows.some(row => +row.status !== 4 && +row.status !== 5)) {
      // 状态`驳回(5)`、`撤回(4)`的数据才能使用【重新上传】的功能，否则，不允许该操作
      return createMessage.warning(t('dict.PCC.reUploadRestrictionTips'));
    }

    // 校验: 只能勾选同类型的文件
    const engineeringType = `${rows[0].EngineeringType || '1'}`;
    if (
      rows.some(row => {
        // 如果行数据不存在`EngineeringType`属性，是旧数据，旧数据只有`成品`，因此视为`成品(1)`
        // 如果存在，则`1`为成品，`3`为半成品，以此校验区分
        const rowEngineeringType = `${row.EngineeringType || '1'}`;
        return rowEngineeringType !== engineeringType;
      })
    ) {
      return createMessage.warning(t('dict.PCC.reUploadEngineeringTypeTips'));
    }

    // 校验：判断勾选数据的`资料类型(docType)`是否相同，如果不同，提示用户只能重新上传同类型的文件；
    // const docTypes = rows[0].docType;
    // if (rows.some(row => row.docType !== docTypes)) {
    //   return createMessage.warning(t('dict.PCC.reUploadDocTypeTips'));
    // }

    openUploadPopup(true, {
      isReUpload: true,
      list: rows.map(row => {
        const [FactoryName, FactoryCode] = (row.factory || '').split('/');
        row.FactoryCode = FactoryCode || '';
        row.FactoryName = FactoryName || '';
        return pick(row, ['id', 'insidePartNumber', 'docType', 'version', 'fileName', 'FactoryCode', 'FactoryName']);
      }),
      engineeringType,
    });
  }
</script>
