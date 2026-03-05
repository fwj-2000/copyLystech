<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <a-tabs @change="reloadTable" v-model:activeKey="activeKey">
          <a-tab-pane key="1" :tab="t('common.todoText')">
            <Grid>
              <template #toolbar-actions>
                <a-button v-auth="'btn_review'" type="primary" @click="handleApprove('unReview', -1)">
                  {{ t('routes.engineering-drawing-drawingReview') }}
                </a-button>
                <a-button v-auth="'btn_batchDFM'" type="primary" ghost @click="handleBatchDFMReview">{{ t('common.batchDFM') }} </a-button>
                <a-button v-auth="'btn_download'" @click="handleUnReviewExport">{{ t('views.business.quota.export') }} </a-button>
                <a-button v-auth="'btn_generate_PPT'" @click="generatePPT">{{ t('dict.DrawingsReviewColumn.isCreatePPT') }} </a-button>
                <a-button v-auth="'btn_download_attach'" @click="downloadAttach">{{ t('dict.DrawingsReviewColumn.downloadAttachment') }}</a-button>
                <a-button v-auth="'btn_transfer'" @click="handleTransfer"> {{ t('common.transfer') }} </a-button
                ><a-button v-auth="'btn_reject'" @click="handleReject"> {{ t('common.rejectText') }} </a-button>
              </template>
              <template #dfm="{ row }">
                <a-tag>{{ DFMList.find(item => item.enCode == row.dfm)?.fullName }}</a-tag>
              </template>
              <template #reviewResult="{ row }">
                <a-tag>{{ reviewResultList.find(item => item.enCode == row.reviewResult)?.fullName }}</a-tag>
              </template>
              <template #makeEngineeringInfo="{ row }">
                <a-tag>{{ MakeEngineeringInfoList.find(item => item.enCode == row.makeEngineeringInfo)?.fullName }}</a-tag>
              </template>
              <template #desensitizedDrawingsName="{ row }">
                <template v-if="row.desensitizedDrawingsName">
                  <a-tooltip :title="t('common.clickView', [t('common.newDraw')])">
                    <FileDoneOutlined class="table-a mr-5px" @click="handleDesensitizeList(row)" />
                  </a-tooltip>
                  <span class="table-a" @click="handlePreview(row)">{{ row.desensitizedDrawingsName }}</span>
                </template>
              </template>
              <template #nodeDetail="{ row }">
                <span class="table-a" @click="handleNodeModal(row)"> {{ t('common.viewDetails') }} </span>
              </template>
              <template #action="{ $rowIndex }">
                <TableAction :outside="true" :actions="getunReviewActions($rowIndex)" />
              </template>
            </Grid>
          </a-tab-pane>
          <a-tab-pane key="2" :tab="t('common.doneText')">
            <GridDone>
              <template #toolbar-actions>
                <a-space>
                  <a-button v-auth="'btn_download'" @click="handleReviewExport">{{ t('views.business.quota.export') }} </a-button>
                  <a-button v-auth="'btn_recall'" type="primary" ghost @click="handleBatchRevocation">{{ t('common.revoke') }} </a-button>
                </a-space>
              </template>
              <template #dfm="{ row }">
                <a-tag>{{ DFMList.find(item => item.enCode == row.dfm)?.fullName }}</a-tag>
              </template>
              <template #reviewResult="{ row }">
                <a-tag>{{ reviewResultList.find(item => item.enCode == row.reviewResult)?.fullName }}</a-tag>
              </template>
              <template #makeEngineeringInfo="{ row }">
                <a-tag>{{ MakeEngineeringInfoList.find(item => item.enCode == row.makeEngineeringInfo)?.fullName }}</a-tag>
              </template>
              <template #nodeDetail="{ row }">
                <span class="table-a" @click="handleNodeModal(row)"> {{ t('common.viewDetails') }} </span>
              </template>
              <template #desensitizedDrawingsName="{ row }">
                <template v-if="row.desensitizedDrawingsName">
                  <a-tooltip :title="t('common.clickView', [t('common.newDraw')])">
                    <FileDoneOutlined class="table-a mr-5px" @click="handleDesensitizeList(row)" />
                  </a-tooltip>
                  <span class="table-a" @click="handlePreview(row)">{{ row.desensitizedDrawingsName }}</span>
                </template>
              </template>
              <template #action="{ $rowIndex }">
                <TableAction :outside="true" :actions="getReviewActions($rowIndex)" />
              </template>
            </GridDone>
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>
    <DrawingDetailPop @close="reloadTable(activeKey)" @reload="reloadTable(activeKey)" @register="registerDrawingDetail" />
    <ExportModal @register="registerExportModal" />
    <Revocation @register="registerForm" @reload="reloadTable(activeKey)" />
    <!--    <Turn @register="registerTurnForm" @reload="reloadTable(activeKey)" />-->
    <NodeModal @register="registerNodeModal"></NodeModal>
    <Preview ref="filePreviewRef" />
    <TransferModal @register="registerTransferModal" @reload="reloadTable(activeKey)" />
    <DetailPopup @register="registerDetailPopup" @reload="reloadTable" />
    <EPMBatchReview @register="registerEPMBatchReviewPopup" @reload="reloadTable" />
    <FileListModal @register="registerFileList"></FileListModal>
    <RejectModal @register="registerRejectModal" @reload="reloadTable" />
  </div>
</template>

<script setup lang="ts">
  import { ActionItem, BasicColumn, BasicTable, FormProps, TableAction, useTable } from '/@/components/Table';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { reactive, ref, toRefs } from 'vue';
  import {
    drawingsreviewCreatePPT,
    exportDrawingsReviewUnreviewedList,
    getDrawingsReviewUnreviewedList,
    postDrawingsReviewReviewTransfer,
  } from '/@/api/engineering/drawingReview';
  import DrawingDetailPop from './components/drawingDetailPop.vue';
  import { usePopup } from '/@/components/Popup';
  import { cloneDeep } from 'lodash-es';
  import ExportModal from '/@/components/ExportModal/index.vue';
  import { useModal } from '/@/components/Modal';
  import { useBaseStore } from '/@/store/modules/base';
  import { useRoute } from 'vue-router';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { downloadByUrl, downloadFile } from '/@/utils/file/download';
  import { useUserStore } from '/@/store/modules/user';
  import { getDrawingsReviewApplypage, getDrawingsReviewDfmpage, rejectResult } from '/@/api/engineering/engineeringReview';
  import Revocation from '/@/views/engineering/drawing/engineeringReview/components/Revocation.vue';
  import Turn from '/@/views/engineering/drawing/engineeringReview/components/Turn.vue';
  import { downloadDrawingshistory } from '/@/api/basicData/productCodeApply';
  import Preview from '/@/views/basicData/productCodeApply/components/Preview.vue';
  import { getNodeDetail } from '/@/api/engineering/ecn';
  import { TransferModal, NodeModal, RejectModal } from '/@/components/CustomComponents';
  import { useRouteParams } from '/@/hooks/core/useRouteParams';
  import { DRAWING_STATUS_OPTIONS, STATUS_OPTIONS } from '/@/utils/status/index';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { CURRENT_RM_NODE } from './config';
  import DetailPopup from '/@/views/engineering/drawing/components/DetailPopup.vue';
  import { isEmpty, isNullOrUnDef } from '/@/utils/is';
  import { ModeTypeEnum } from '/@/enums/modeEnum';
  import EPMBatchReview from '../components/EPMBatchReview.vue';
  import { FileDoneOutlined } from '@ant-design/icons-vue';
  import { fileDownload } from '/@/api/purchase/importMateria';
  import { getDrawingsHistory, getFileInfoHistory } from '/@/api/common/files';
  import { FileListModal } from '/@/components/Upload';

  const { t } = useI18n();

  const [registerTransferModal, { openModal: openTransferModal }] = useModal();
  const [registerDrawingDetail, { openPopup: openDrawingDetail }] = usePopup();
  const [registerExportModal, { openModal: openExportModal }] = useModal();
  const [registerForm, { openModal: openFormModal }] = useModal();
  const [registerTurnForm, { openModal: openTurnFormModal }] = useModal();
  const [registerNodeModal, { openModal: openNodeModal }] = useModal();
  const [registerDetailPopup, { openPopup: openDetailPopup }] = usePopup();
  const [registerEPMBatchReviewPopup, { openPopup: openEPMBatchReviewPopup }] = usePopup();
  const [registerFileList, { openModal: openFileList }] = useModal();
  const [registerRejectModal, { openModal: openRejectModal }] = useModal();

  const baseStore = useBaseStore();
  const route = useRoute();
  const { createMessage } = useMessage();

  const userStore = useUserStore();
  const userInfo = userStore.getUserInfo;
  const filePreviewRef = ref<any | null>(null);

  defineOptions({ name: 'engineering-drawing-drawingReview' });

  const IS_GENERATE_PPT = [
    { id: 1, fullName: t('dict.isCreatePPT.1'), theme: 'green' },
    { id: 0, fullName: t('dict.isCreatePPT.0'), theme: 'gray' },
  ];

  const formConfig = {
    schema: [
      {
        label: '',
        fieldName: 'originCode',
        component: 'Input',
        componentProps: {
          placeholder: '来源单号',
        },
      },
      {
        label: '',
        fieldName: 'insidePartNumber',
        component: 'Input',
        componentProps: {
          placeholder: '产品内部料号',
        },
      },
      {
        label: '',
        fieldName: 'insidePartNumberOld',
        component: 'Input',
        componentProps: {
          placeholder: '旧版成品编码',
        },
      },
      {
        label: '',
        fieldName: 'originType',
        component: 'ApiSelect',
        componentProps: {
          placeholder: '来源类型',
          submitOnPressEnter: true,
          api: () => baseStore.getDictionaryData('DrawingsReview.OriginType'),
          labelField: 'fullName',
          valueField: 'enCode',
        },
      },
      {
        label: '',
        fieldName: 'terminalCustomerPartNumber',
        component: 'Input',
        componentProps: {
          placeholder: '终端客户料号',
        },
      },
      // {
      //   label: '',
      //   field: 'applyCode',
      //   component: 'Input',
      //   componentProps: {
      //     placeholder: '来源单号',
      //     submitOnPressEnter: true,
      //   },
      // },
      {
        label: '',
        fieldName: 'factory',
        component: 'Input',
        componentProps: {
          placeholder: '工厂',
        },
      },
      {
        label: '',
        fieldName: 'insideProjectCode',
        component: 'Input',
        componentProps: {
          placeholder: '内部项目代码',
        },
      },
      {
        label: '',
        fieldName: 'isCreatePPT',
        component: 'ApiSelect',
        componentProps: {
          placeholder: '生成PPT',
          submitOnPressEnter: true,
          api: () => baseStore.getDictionaryData('isCreatePPT'),
          labelField: 'fullName',
          valueField: 'enCode',
        },
      },
      {
        label: '',
        fieldName: 'reviewResult',
        component: 'ApiSelect',
        componentProps: {
          placeholder: '评审结论',
          api: () => baseStore.getDictionaryData('DrawingsReview.ReviewResult', true),
          labelField: 'fullName',
          valueField: 'enCode',
        },
      },
      {
        label: '',
        fieldName: 'makeEngineeringInfo',
        component: 'ApiSelect',
        componentProps: {
          placeholder: '工程资料能否制作',
          api: () => baseStore.getDictionaryData('DrawingsReview.MakeEngineeringInfo', true),
          labelField: 'fullName',
          valueField: 'enCode',
        },
      },
      // 是否提DFM
      {
        label: '',
        fieldName: 'dfm',
        component: 'ApiSelect',
        componentProps: {
          placeholder: t('DrawingsReview.DFM'),
          api: () => baseStore.getDictionaryData('DrawingsReview.DFM', true),
          labelField: 'fullName',
          valueField: 'enCode',
        },
      },
    ],
    i18nConfig: {
      moduleCode: 'DrawingsReviewColumn',
      transferRange: ['placeholder'],
    },
  };

  const reviewFormConfig = {
    schema: [
      {
        label: '',
        fieldName: 'originCode',
        component: 'Input',
        componentProps: {
          placeholder: '来源单号',
        },
      },
      {
        label: '',
        fieldName: 'insidePartNumber',
        component: 'Input',
        componentProps: {
          placeholder: '产品内部料号',
        },
      },
      {
        label: '',
        fieldName: 'insidePartNumberOld',
        component: 'Input',
        componentProps: {
          placeholder: '旧版成品编码',
        },
      },
      {
        label: '',
        fieldName: 'originType',
        component: 'ApiSelect',
        componentProps: {
          placeholder: '来源类型',
          submitOnPressEnter: true,
          api: () => baseStore.getDictionaryData('DrawingsReview.OriginType'),
          labelField: 'fullName',
          valueField: 'enCode',
        },
      },
      {
        label: '',
        fieldName: 'terminalCustomerPartNumber',
        component: 'Input',
        componentProps: {
          placeholder: '终端客户料号',
        },
      },
      // {
      //   label: '',
      //   field: 'applyCode',
      //   component: 'Input',
      //   componentProps: {
      //     placeholder: '来源单号',
      //     submitOnPressEnter: true,
      //   },
      // },
      {
        label: '',
        fieldName: 'factory',
        component: 'Input',
        componentProps: {
          placeholder: '工厂',
        },
      },
      {
        label: '',
        fieldName: 'insideProjectCode',
        component: 'Input',
        componentProps: {
          placeholder: '内部项目代码',
        },
      },
    ],
    i18nConfig: {
      moduleCode: 'DrawingsReviewColumn',
      transferRange: ['placeholder'],
    },
  };

  function handleNodeModal(record) {
    openNodeModal(true, {
      api: getNodeDetail,
      id: record.id,
      fetchSetting: {
        listField: 'flowNodeInstanceHisList',
      },
    });
  }

  const unReviewColumns = [
    { field: 'checkbox', width: 50, type: 'checkbox' },
    {
      title: '产品内部料号',
      field: 'insidePartNumber',
      width: 200,
    },
    {
      title: '旧版成品编码',
      field: 'insidePartNumberOld',
      width: 200,
    },
    {
      title: '评审结论',
      field: 'reviewResult',
      width: 80,
      slots: {
        default: 'reviewResult',
      },
    },
    {
      title: '工程资料能否制作',
      field: 'makeEngineeringInfo',
      width: 120,
      i18nField: 'canPrepareEngineeringMaterials',
      slots: {
        default: 'makeEngineeringInfo',
      },
    },
    {
      title: '是否提DFM',
      field: 'dfm',
      width: 80,
      i18nField: 'submitDFMInquiry',
      slots: {
        default: 'dfm',
      },
    },
    {
      title: '生成PPT',
      field: 'isCreatePPT',
      width: 80,
      cellRender: {
        name: 'Tag',
        options: IS_GENERATE_PPT,
      },
    },
    {
      title: '来源单号',
      field: 'originCode',
      width: 180,
    },
    { title: '来源类型', field: 'demandTypeName', width: 120 },
    {
      title: '脱敏图纸',
      field: 'desensitizedDrawingsName',
      width: 260,
      slots: {
        default: 'desensitizedDrawingsName',
      },
    },
    {
      title: '状态',
      field: 'status',
      width: 120,
      cellRender: {
        name: 'Tag',
        options: DRAWING_STATUS_OPTIONS,
      },
    },
    {
      title: '当前节点',
      field: 'reviewNodeName',
      width: 160,
    },
    {
      title: '节点记录',
      field: 'nodeDetail',
      width: 160,
      sorter: true,
      slots: {
        default: 'nodeDetail',
      },
    },
    {
      title: '当前处理人',
      field: 'handlerName',
      width: 220,
    },
    {
      title: '申请人',
      field: 'originApplyUserName',
      width: 220,
    },
    {
      title: '内部项目代码',
      field: 'insideProjectCode',
      width: 160,
    },
    {
      title: '终端客户料号',
      field: 'terminalCustomerPartNumber',
      width: 160,
    },
    {
      title: '产品描述',
      field: 'productDesc',
      width: 220,
    },
    {
      title: '工厂',
      field: 'factoryName',
      formatter: ({ row }) => {
        return `${row.factory}/${row.factoryName}`;
      },
      width: 160,
    },
    // {
    //   title: '备注',
    //   field: 'nodeRemark',
    //   i18nField: 'CommonCol.remark',
    //   cellRender: {
    //     name: 'Remark',
    //     nodeCode: CURRENT_RM_NODE,
    //   },
    // },
    {
      title: '操作',
      field: 'action',
      slots: { default: 'action' },
      width: 100,
      fixed: 'right',
    },
  ];

  const reviewColumns = [
    { field: 'checkbox', width: 50, type: 'checkbox' },
    {
      title: '产品内部料号',
      field: 'insidePartNumber',
      width: 200,
    },
    {
      title: '旧版成品编码',
      field: 'insidePartNumberOld',
      width: 160,
    },
    {
      title: '评审结论',
      field: 'reviewResult',
      width: 80,
      slots: {
        default: 'reviewResult',
      },
    },
    {
      title: '工程资料能否制作',
      field: 'makeEngineeringInfo',
      i18nField: 'canPrepareEngineeringMaterials',
      width: 120,
      slots: {
        default: 'makeEngineeringInfo',
      },
    },
    {
      title: '是否提DFM',
      field: 'dfm',
      i18nField: 'submitDFMInquiry',
      width: 80,
      slots: {
        default: 'dfm',
      },
    },
    {
      title: '来源单号',
      field: 'originCode',
      width: 180,
    },
    { title: '来源类型', field: 'demandTypeName', width: 120 },
    {
      title: '状态',
      field: 'status',
      width: 120,
      cellRender: {
        name: 'Tag',
        options: DRAWING_STATUS_OPTIONS,
      },
    },
    {
      title: '当前节点',
      field: 'reviewNodeName',
      width: 160,
    },
    {
      title: '节点记录',
      field: 'nodeDetail',
      width: 160,
      sorter: true,
      slots: {
        default: 'nodeDetail',
      },
    },
    {
      title: '评审结束时间',
      field: 'reviewDate',
      width: 200,
      cellRender: {
        name: 'Date',
      },
    },
    {
      title: '脱敏图纸',
      field: 'desensitizedDrawingsName',
      width: 260,
      slots: {
        default: 'desensitizedDrawingsName',
      },
    },
    {
      title: '当前处理人',
      field: 'handlerName',
      width: 200,
    },
    {
      title: '申请人',
      field: 'originApplyUserName',
      width: 200,
    },
    {
      title: '内部项目代码',
      field: 'insideProjectCode',
      width: 200,
    },
    {
      title: '终端客户料号',
      field: 'terminalCustomerPartNumber',
      width: 200,
    },
    {
      title: '产品描述',
      field: 'productDesc',
      width: 200,
    },
    {
      title: '工厂',
      field: 'factoryName',
      formatter: ({ row }) => {
        return `${row.factory}/${row.factoryName}`;
      },
      width: 160,
    },
    {
      title: '备注',
      field: 'nodeRemark',
      i18nField: 'CommonCol.remark',
      cellRender: {
        name: 'Remark',
        nodeCode: CURRENT_RM_NODE,
      },
    },
    {
      title: '操作',
      field: 'action',
      slots: { default: 'action' },
      width: 100,
      fixed: 'right',
    },
  ];

  const [
    Grid,
    {
      reload: unReviewReload,
      getSelectRows: getUnReviewSelectRows,
      getSelectRowKeys: getUnReviewSelectRowKeys,
      clearSelectedRowKeys: clearUnReviewSelectRow,
      getFetchParams: unReviewFetchParams,
    },
  ] = useVbenVxeGrid({
    formOptions: {
      collapsed: true,
      showCollapseButton: true,
      submitOnChange: false,
      submitOnEnter: true,
      commonConfig: {
        componentProps: {},
        labelClass: 'w-0',
      },
      wrapperClass: 'grid grid-cols-5 gap-4',
      ...formConfig,
    },
    gridOptions: {
      api: getDrawingsReviewDfmpage,
      columns: unReviewColumns,
      id: 'engineering-drawing-drawingReview-todo',
      rowConfig: {
        keyField: 'id',
      },
      showIndexColumn: true,
      beforeFetch: params => {
        params.dataFilter = 3;
        return params;
      },
      afterFetch: data => {
        state.cacheUnReviewData = data.list;
      },
      i18nConfig: {
        moduleCode: 'DrawingsReviewColumn',
      },
    },
  });

  const [GridDone, { reload: reviewReload, getSelectRows: reviewGetSelectRows, getFetchParams: reviewFetchParams }] = useVbenVxeGrid({
    formOptions: {
      collapsed: true,
      showCollapseButton: true,
      submitOnChange: false,
      submitOnEnter: true,
      commonConfig: {
        componentProps: {},
        labelClass: 'w-0',
      },
      wrapperClass: 'grid grid-cols-5 gap-4',
      ...reviewFormConfig,
    },
    gridOptions: {
      api: getDrawingsReviewDfmpage,
      columns: reviewColumns,
      id: 'engineering-drawing-drawingReview-done',
      rowConfig: {
        keyField: 'id',
      },
      showIndexColumn: true,
      beforeFetch: params => {
        params.dataFilter = 4;
        return params;
      },
      afterFetch: data => {
        state.cacheReviewData = data.list;
      },
      i18nConfig: {
        moduleCode: 'DrawingsReviewColumn',
      },
    },
  });

  interface StateType {
    activeKey: string;
    cacheUnReviewData: any[];
    cacheReviewData: any[];
    DFMList: any[];
    reviewResultList: any[];
    statusList: any[];
    MakeEngineeringInfoList: any[];
  }

  const state = reactive<StateType>({
    activeKey: '1',
    cacheUnReviewData: [],
    cacheReviewData: [],
    DFMList: [],
    reviewResultList: [],
    statusList: [],
    MakeEngineeringInfoList: [],
  });

  const { activeKey, DFMList, reviewResultList, statusList, MakeEngineeringInfoList } = toRefs(state);

  function reloadTable(e) {
    console.log('🚀 ~ reloadTable ~ e: ', e);
    if (isNullOrUnDef(e)) e = state.activeKey;
    if (e == 1) {
      unReviewReload();
    } else {
      reviewReload();
    }
  }

  function handleDesensitizeList(row) {
    openFileList(true, {
      id: row.desensitizedDrawingsId,
      keyFieldName: 'id',
      params: {
        current: true,
      },
      downloadApi: fileDownload,
      useQuery: true,
      usePath: true,
      useMerge: false,
      listApi: getFileInfoHistory,
    });
  }

  function getunReviewActions(index): ActionItem[] {
    return [
      // {
      // 	icon: 'icon-ym icon-ym-turn',
      // 	onClick: handleReject.bind(null, 'unReview', index),
      // 	auth: 'btn_detail',
      // },
      {
        icon: 'icon-ym icon-ym-btn-preview',
        onClick: handleApprove.bind(null, 'unReview', index),
        auth: 'btn_detail',
      },
    ];
  }

  function getReviewActions(index): ActionItem[] {
    return [
      {
        icon: 'ym-custom ym-custom-backup-restore',
        onClick: handleRevocation.bind(null, index),
        // auth: 'btn_detail',
      },
      {
        icon: 'icon-ym icon-ym-btn-preview',
        onClick: handleApprove.bind(null, 'review', index),
        auth: 'btn_detail',
      },
    ];
  }

  function handleRevocation(index) {
    openFormModal(true, { ...state.cacheReviewData[index] });
  }

  function handleBatchRevocation() {
    const rows = reviewGetSelectRows();
    if (isEmpty(rows)) return createMessage.warning(t('common.selectText'));
    openFormModal(true, { list: rows });
  }

  function handleReject(type, index) {
    const rowKeys = getUnReviewSelectRowKeys();
    openRejectModal(true, {
      api: rejectResult,
      ids: rowKeys,
    });
  }

  function handleApprove(type: 'unReview' | 'review', index) {
    console.log('🚀 ~ handleApprove ~ type: ', type);
    const params = {
      index,
    };
    if (type === 'unReview') {
      params.cacheList = state.cacheUnReviewData;
      params.mode = ModeTypeEnum.EDIT;
      if (index == -1) {
        params.index = 0;
        const rows = getUnReviewSelectRows();
        if (rows.length !== 0) {
          params.cacheList = rows;
        }
      }
    } else if (type === 'review') {
      params.cacheList = state.cacheReviewData;
      if (index == -1) {
        params.index = 0;
        const rows = getSelectRows();
        if (rows.length !== 0) {
          params.cacheList = rows;
        }
      }
      params.mode = ModeTypeEnum.VIEW;
    }

    if (params.cacheList.length === 0) return createMessage.warning('当前列表没有待处理图纸');
    console.log(params);
    // openDrawingDetail(true, params);
    openDetailPopup(true, params);
  }

  async function getTypeOps() {
    state.DFMList = await baseStore.getDictionaryData('DrawingsReview.DFM');
    state.MakeEngineeringInfoList = await baseStore.getDictionaryData('DrawingsReview.MakeEngineeringInfo');
    state.reviewResultList = await baseStore.getDictionaryData('DrawingsReview.ReviewResult');
    state.statusList = await baseStore.getDictionaryData('DrawingsReview.Status');
  }

  function handleUnReviewExport() {
    const exportColumns = cloneDeep(unReviewColumns);
    const index = exportColumns.findIndex(item => item.field === 'desensitizedDrawingsName');
    openExportModal(true, {
      api: exportDrawingsReviewUnreviewedList,
      listQuery: {
        dataFilter: 3,
        ...unReviewFetchParams(),
      },
      exportOptions: exportColumns.toSpliced(index, 1),
      nameProps: 'title',
      idProps: 'field',
      i18nConfig: {
        moduleCode: 'DrawingsReviewColumn',
      },
    });
  }

  function handlePreview(record) {
    const params = {
      name: record.desensitizedDrawingsName,
      Id: record.desensitizedDrawingsId,
      previewType: 'localPreview',
      noCache: false,
      isCopy: 0,
    };
    filePreviewRef.value?.init(params);
  }

  function handleBatchDFMReview() {
    const rows = getUnReviewSelectRows();
    if (rows[0].reviewNode !== 'EPMReview') return createMessage.warning(t('dict.Common.pleaseSelectDataOfEPMNode'));
    if (isEmpty(rows)) return createMessage.warning(t('common.selectText'));
    const isSame = rows.every(item => item.reviewNode === rows[0].reviewNode);
    if (!isSame) return createMessage.warning(t('dict.Common.pleaseSelectDataOfTheSameType'));
    openEPMBatchReviewPopup(true, {
      list: rows,
    });
  }

  function handleReviewExport() {
    const exportColumns = cloneDeep(reviewColumns);
    const index = exportColumns.findIndex(item => item.field === 'desensitizedDrawingsName');
    openExportModal(true, {
      api: exportDrawingsReviewUnreviewedList,
      listQuery: {
        dataFilter: 4,
        ...reviewFetchParams(),
      },
      exportOptions: exportColumns.toSpliced(index, 1),
      nameProps: 'title',
      idProps: 'field',
      i18nConfig: {
        moduleCode: 'DrawingsReviewColumn',
      },
    });
  }

  async function generatePPT() {
    const selectRows = getUnReviewSelectRows();
    if (selectRows.length === 0) {
      createMessage.warning(t('common.selectRowsToGenerate'));
    } else if (selectRows.length >= 1) {
      const allEqual = selectRows.every(item => item.originCode === selectRows[0].originCode);
      console.log(allEqual);
      if (selectRows.length !== 1 && !allEqual) return createMessage.warning(t('common.selectRowsWithSameSourceOrderNumber'));
      console.log(555);
      drawingsreviewCreatePPT(getUnReviewSelectRowKeys())
        .then(res => {
          const { data } = res;
          console.log(data);
          const { name, url } = data;
          console.log(name, url);
          downloadByUrl({ url: url, target: '_blank', fileName: name });
        })
        .finally(() => {
          clearUnReviewSelectRow();
          reloadTable(state.activeKey);
        });
    }
  }

  async function downloadAttach() {
    const selectRows = getUnReviewSelectRows();
    if (selectRows.length === 0) {
      createMessage.warning(t('common.selectRowsToDownload'));
    } else if (selectRows.length >= 1) {
      selectRows.forEach(item => {
        if (item.attachmentId) {
          downloadDrawingshistory({
            Id: item.attachmentId,
          }).then(({ data: { name, url } }) => {
            downloadByUrl({ url: url, target: '_blank', fileName: name });
          });
        } else if (!isNullOrUnDef(item.dfmAttachments) && !isEmpty(item.dfmAttachments)) {
          item.dfmAttachments.forEach((value, index) => {
            setTimeout(() => {
              downloadFile({ url: value.filePath, target: '_blank', fileName: value.fileName });
            }, (index + 1) * 1000);
          });
        }
      });
    }
  }

  // 处理转办

  // 转办
  function handleTransfer() {
    const idList = getUnReviewSelectRowKeys();
    if (!idList.length) return createMessage.warning(t('common.selectText'));
    openTransferModal(true, {
      id: idList || [],
      submitCallback: async data => {
        const { id } = data;
        const r = await postDrawingsReviewReviewTransfer({
          idList: id,
          remark: data.remark,
          handlerId: data.transferUser,
        });
        return r;
      },
    });
  }

  useRouteParams({ id: {}, openDetail: {} }, params => {
    getTypeOps();
    const id = params.id;
    if (id) {
      openDetailPopup(true, {
        cacheList: [
          {
            id: id,
          },
        ],
        index: 0,
        mode: ModeTypeEnum.EDIT,
      });
    }
  });
  //
  // useRouteParams({ id: {}, sign: {} }, params => {
  //   if (!params.id) return;
  //   // openDrawingDetail(true, { detailId: params.id });
  //   getDrawingsReviewUnreviewedList({ id: params.id }).then(res => {
  // 	  if (!res.data?.list?.length) {
  // 		  getDrawingsReviewApplypage({ id: params.id }).then(res1 => {
  // 			  if (!res1.data?.list?.length) return createMessage.warning(t('dict.DrawingsReviewColumn.jumpDetailDataNotExists'));
  // 			  openDrawingDetail(true, { index: 0, cacheList: res.data.list });
  // 		  });
  // 	  } else {
  // 		  // 这里加个else, 解决res.data.list为空数组时,进入详情弹窗报错
  // 		  openDrawingDetail(true, { index: 0, cacheList: res.data.list }); //{detailId: params.id,sign:params.sign??'detail'});
  // 	  }
  //   });
  // });
</script>

<style lang="less" scoped>
  @import url('/src/design/page.less');

  :deep(.lydc-basic-modal .ant-modal .ant-modal-body > .scrollbar) {
    padding: 0 !important;
  }
</style>
