<script lang="ts" setup>
  import { computed, nextTick, reactive, ref, toRaw, toRefs } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import Subtitle from '/@/components/Subtitle/src/Subtitle.vue';
  import { useVbenForm } from '/@/adapter/form';
  import {
    getBaseFormSchema,
    getEPMConfirmReviewFormSchema,
    getEPMConfirmSchema,
    getEPMReviewFormSchema,
    getEPMReviewSchema,
    getPdLeaderOpinion,
    getPdLeaderOpinionReviewFormSchema,
    getPdLeaderReviewer,
    getPDOpinionReviewSchema,
    getQuestionColumns,
    getReviewFormSchema,
  } from '../components/config';
  import getEngineWorkSchema from './getCenterSchema/getEngineeringSChema';
  import getPdLeaderSchema from './getCenterSchema/getPdLeaderSchema';
  import { FileListModal, ImageUpload, PreviewModal } from '/@/components/Upload';
  import { useVbenVxeGrid } from '/@/effects/plugins/vxe-table';
  import { getDrawingsReviewDetail, getDrawingsReviewRecordList, postDrawingsReviewCommit } from '/@/api/engineering/drawingReview';
  import { useUserStore } from '/@/store/modules/user';
  import { TableAction } from '/@/components/Table';
  import { buildUUID } from '/@/utils/uuid';
  import { cloneDeep, merge, set } from 'lodash-es';
  import { ModalComponent } from '/@/views/basicData/encodingSettings/types';
  import { useModal } from '/@/components/Modal';
  import { fileDownload } from '/@/api/purchase/importMateria';
  import { getFileInfoHistory } from '/@/api/common/files';
  import DetailListModal from '/@/views/engineering/drawing/drawingReview/components/DetailListModal.vue';
  import ScrollContainer from '/@/components/Container/src/ScrollContainer.vue';
  import { requestIdleCallbackAdapter } from '/@/utils/polyfills';
  import { uploadFiles } from '/@/api/engineering/pcc';
  import { dateUtil } from '/@/utils/dateUtil';
  import { downloadFile } from '/@/utils/file/download';
  import { commitResult, rejectResult } from '/@/api/engineering/engineeringReview';
  import { isEmpty, isNullOrUnDef } from '/@/utils/is';
  import { ModeTypeEnum } from '/@/enums/modeEnum';
  import { RejectModal } from '/@/components/CustomComponents';
  import { useBaseStore } from '/@/store/modules/base';
  import History from './History.vue';
  import FileUploadList from './FileUploadList.vue';
  import { BasicPopPage } from '/@/components/Basic';

  const { t } = useI18n();
  const emit = defineEmits(['reload', 'register']);
  const { createMessage } = useMessage();
  const userStore = useUserStore();
  const baseStore = useBaseStore();

  const getUserInfo = computed(() => userStore.getUserInfo || {});

  const [registerPopup, { closePopup, changeLoading }] = usePopupInner(init);
  const [registerHistoryModal, { openModal: openHistoryModal, closeModal: closeHistoryModal }] = useModal();
  const [registerFileList, { openModal: openFileList }] = useModal();
  const [registerDetailList, { openModal: openDetailList }] = useModal();
  const [registerRejectModal, { openModal: openRejectModal }] = useModal();
  const filePreviewRef = ref<ModalComponent | null>(null);

  interface State {
    customerFileList: any[];
    customerReviewList: any[];
    talkReviewList: any[];
    mode: string;
    cacheList: any[];
    index: number;
  }

  const state = reactive<State>({
    customerFileList: [],
    customerReviewList: [],
    talkReviewList: [],
    mode: 'edit',
    cacheList: [],
    index: 0,
  });

  // 图纸评审	Engineering	1	启用
  // 不进入DFM评审结束	NoDFM	2	启用
  // PD Leader复核	PdLeaderCheck	3	启用
  // EPM评审	EPMReview	4	启用
  // EPM同意结束	EPMApproveEnd	5	启用
  // PD评审	PDOpinion	6	启用
  // PD评审结束	PDEnd	7	启用
  // PD Leader评审	PdLeaderOpinion	8	启用
  // EPM确认	EPMConfirm	9	启用
  // EPM确认结束	OperationReviewEnd	10	启用
  const currentData = computed(() => state['cacheList'][state.index]);

  const isEndStatus = computed(() => {
    const { value } = currentData;

    if (value?.status === 3) {
      return true;
    }

    const endStatuses = new Set(['NoDFM', 'EPMApproveEnd', 'PDEnd', 'OperationReviewEnd']);

    return endStatuses.has(value);
  });

  const ifShowEditAttach = computed(() => {
    const currentValue = state.cacheList[state.index];
    const reviewNode = currentValue?.reviewNode;

    if (state.mode === ModeTypeEnum.EDIT) {
      return true;
    }

    const allowedNodes = new Set(['Engineering', 'PdLeaderCheck']);
    return allowedNodes.has(reviewNode);
  });

  // watch(() => ifShowEditAttach, (newVal) => {
  // 	if(!newVal) setTableDisabled()
  // })

  const { customerFileList } = toRefs(state);

  // 状态跟踪
  const uploadState = reactive({
    activeUploads: 0,
    allFiles: [] as any[],
  });

  const { loading } = toRefs(state);
  const uploadProgress = computed(() => {
    return `${uploadState.activeUploads} / ${uploadState.allFiles.length}`;
  });

  const rowData = {
    issueType: null,
    issueDetail: null,
  };

  const [BaseInfoForm, { updateSchema, setState, setValues }] = useVbenForm({
    wrapperClass: 'grid-cols-24',
    commonConfig: {
      colon: false,
      formItemClass: 'col-span-4',
      labelClass: 'w-full justify-start',
    },
    schema: getBaseFormSchema(),
    layout: 'vertical',
    showDefaultActions: false,
    i18nConfig: {
      moduleCode: 'DrawingsReviewColumn',
      transferRange: ['label', 'placeholder'],
    },
  });

  const [CenterForm, { setState: centerSetState, getForm: centerGetForm, getValues, setValues: centerSetValues, updateSchema: centerUpdateSchema }] =
    useVbenForm({
      wrapperClass: 'grid-cols-24',
      commonConfig: {
        colon: false,
        formItemClass: 'col-span-4',
        labelClass: 'w-full justify-start',
        componentProps: {
          class: 'w-full',
        },
      },
      schema: [],
      layout: 'vertical',
      showDefaultActions: false,
      i18nConfig: {
        moduleCode: 'DrawingsReviewColumn',
        transferRange: ['label', 'placeholder'],
      },
    });

  const [ReviewForm, { setState: reviewSetState, getForm, getValues: reviewGetValues, setValues: reviewSetValues, validate: reviewValidate }] = useVbenForm({
    wrapperClass: 'grid-cols-24',
    commonConfig: {
      colon: false,
      formItemClass: 'col-span-24',
      labelClass: 'w-full justify-start',
      componentProps: {
        class: 'w-full',
      },
    },
    // schema: getReviewFormSchema(),
    schema: [],
    layout: 'vertical',
    showDefaultActions: false,
    i18nConfig: {
      moduleCode: 'DrawingsReviewColumn',
      transferRange: ['label', 'placeholder'],
    },
  });

  const [Grid, { reloadData, setGridOptions, loadData, getDataSource, setState: gridSetState, reloadColumn }] = useVbenVxeGrid({
    gridOptions: {
      id: 'engineering-PCCBeta-PCCDetail-fileUpload',
      columns: getQuestionColumns() as any,
      showIndexColumn: true,
      editConfig: {
        trigger: 'dblclick',
        mode: 'row',
      },
      cellConfig: {
        height: 170,
      },
      toolbarConfig: {
        enabled: false,
      },
      columnConfig: {
        resizable: true,
      },
      mouseConfig: {
        area: true, // 是否开启区域选取
      },
      areaConfig: {
        multiple: true, // 是否启用多区域选取功能
      },
      pagerConfig: {
        enabled: false,
      },
      keyboardConfig: {
        isClip: true, // 是否开启复制粘贴
        isEdit: true, // 是否开启任意键进入编辑（功能键除外）
        isDel: true, // 是否开启删除键功能
        isEsc: true, // 是否开启Esc键关闭编辑功能
        isEnter: false,
      },
      showOverflow: false,
      rowConfig: {
        keyField: 'uuid',
      },
      // editRules: getProcessRules(),
      height: '',
      data: [],
      clipConfig: {
        isPaste: true,
        excludeFields: ['issueDetailImage', 'scenarioImage'],
        // afterPasteMethod: handleAfterPaster,
        beforePasteMethod: ({ targetAreas, pasteCells, $grid }) => {
          console.log('🚀 ~ beforePasteMethod ~ $grid: ', $grid);
          const { cols, rows } = targetAreas[0];
          console.log('🚀 ~ beforePasteMethod ~ rows: ', rows);
          pasteCells.forEach((row, rowIndex) => {
            row.forEach(async (cell, colIndex) => {
              const col = cols[colIndex];
              const originRow = rows[rowIndex];
              console.log('🚀 ~  ~ originRow: ', originRow);

              const { field } = col;
              console.log('🚀 ~  ~ field: ', field);
              if (field === 'issueType') {
                const issueTypeList = await baseStore.getDictionaryData('DrawingsReview.IssueType');
                const target = issueTypeList.find(item => item.fullName === cell);
                if (isNullOrUnDef(target)) return createMessage.warning('粘贴数据无效');
                originRow.issueType = target.enCode;
                originRow.issueTypeName = target.fullName;
              }
              // 对查询结果进行特殊处理，如果当前是材料列，先存储料号。其他列进行校验
              // if (field === 'originPartNumber') {
              // }
              // 校验数据通过
            });
          });
          return false;
        },
      },
      i18nConfig: {
        moduleCode: 'DrawingsReviewColumn',
      },
    },
  });

  async function init(data: any) {
    centerSetState(() => {
      return {
        schema: [],
      };
    });
    state.cacheList = data.list || data.cacheList;
    state.index = data.index;
    state.mode = data.mode;
    await nextTick();
    changeLoading(true);
    state.loading = true;
    const detailPromise = getReviewDetail();
    const reviewListPromise = getReviewRecord();

    try {
      const [detail] = await Promise.all([detailPromise, reviewListPromise]);
      changeLoading(false);
      state.loading = false;
      const { data: detailData } = detail;
      // 评审记录
      // const { list: reviewList } = review;
      state['cacheList'][state.index] = {
        ...toRaw(currentData.value),
        ...detailData,
        reviewNode: detailData.reviewNode || currentData.value.reviewNode || 'Engineering',
      };
      await nextTick();
      // const isEditTable = getIsEditable()
      // if(!isEditTable) setTableDisabled()
      formatAttachment(detailData);
      handleTableDetail(detailData);
      // 初始化baseInfo表单
      handleBaseInfoData();
      formatSchema();
      // 初始化附件回复
      formatAttachReview();
      // 格式化问题表数据
    } catch (e) {
      console.error(e);
      changeLoading(false);
      state.loading = false;

      closePopup();
    }
  }

  function formatAttachment(data: any) {
    console.log(data.dfmAttachmentStr, 'data.dfmAttachmentStrdata.dfmAttachmentStr');
    // state.customerFileList = data.dfmAttachment || []
    if (data.dfmAttachmentStr && data.dfmAttachmentStr !== 'null') {
      state.customerFileList = JSON.parse(data.dfmAttachmentStr);
    } else {
      state.customerFileList = [];
    }

    if (data.replyAttachmentStr && data.replyAttachmentStr !== 'null') {
      state.customerReviewList = JSON.parse(data.replyAttachmentStr);
    } else {
      state.customerReviewList = [];
    }

    if (data.talkAttachmentStr && data.talkAttachmentStr !== 'null') {
      state.talkReviewList = JSON.parse(data.talkAttachmentStr);
    } else {
      state.talkReviewList = [];
    }
  }

  async function handleBaseInfoData() {
    console.log(
      JSON.parse(currentData.value.nodeRemark)?.find(item => item.node === 'PDTLeaderReview')?.remark,
      "JSON.parse(currentData.value.nodeRemark)?.find(item => item.node === 'PDTLeaderReview')?.remark",
    );
    console.log(currentData.value.nodeRemark, "JSON.parse(currentData.value.nodeRemark)?.find(item => item.node === 'PDTLeaderReview')?.remark");
    console.log(JSON.parse(currentData.value.nodeRemark), "JSON.parse(currentData.value.nodeRemark)?.find(item => item.node === 'PDTLeaderReview')?.remark");
    await nextTick();
    setValues({
      ...currentData.value,
      factory: [currentData.value?.factory, currentData.value?.factoryName].filter(Boolean).join('/'),
      remark: JSON.parse(currentData.value.nodeRemark)?.find(item => item.node === 'PDTLeaderReview')?.remark,
    });
  }

  function initTableData() {
    reloadData([
      {
        ...rowData,
        uuid: buildUUID(),
      },
      {
        ...rowData,
        uuid: buildUUID(),
      },
    ]);
  }

  /**
   * PD制作 reviewNode: Engineering --> 添加问题、引用历史记录、上传附件 下载 删除 上传问题
   */
  async function formatTable() {
    await nextTick();
    const { reviewNode } = currentData.value;
    if (reviewNode === 'Engineering') {
      // PD工程制作
      initTableData();
    }
  }

  async function formatAttachReview(): Promise<void> {
    if (!isShowReviewProposal.value) return;

    await nextTick();

    const { reviewNode } = currentData.value;

    const readonlyNodes = new Set(['EPMApproveEnd', 'OperationReviewEnd']);

    const schemaMap: Record<string, () => any[]> = {
      EPMReview: getEPMReviewFormSchema,
      EPMApproveEnd: getEPMReviewFormSchema,
      PDOpinion: getPDOpinionReviewSchema,
      PDEnd: getPDOpinionReviewSchema,
      PdLeaderOpinion: getPdLeaderOpinionReviewFormSchema,
      EPMConfirm: getEPMConfirmReviewFormSchema,
      OperationReviewEnd: getEPMConfirmReviewFormSchema,
      EPMConfirmEnd: getEPMConfirmReviewFormSchema,
    };

    let schema = schemaMap[reviewNode]?.() ?? [];

    // 设置查看模式
    if (readonlyNodes.has(reviewNode)) {
      state.mode = ModeTypeEnum.VIEW;
    }

    if (state.mode === ModeTypeEnum.VIEW) {
      schema = schema.map(item => {
        set(item, 'componentProps.disabled', true);
        return item;
      });
    }

    reviewSetState(() => ({ schema }));

    await nextTick();

    reviewSetValues({
      ourOpinion: undefined,
      ...currentData.value,
    });
  }

  async function handleSubmit(type) {
    let func = commitResult;
    const { originType, originCode, insidePartNumber, id } = currentData.value;
    const { reviewNode } = currentData.value;

    if (type === 'commit' && isShowReviewProposal.value && !(await reviewValidate()).valid) {
      createMessage.warn(t('dict.CommonCol.enterRequiredFields'));
      return false;
    }

    // 问题类型 和 问题详情 必须同时存在或者同时不存在
    if (
      type === 'commit' &&
      getDataSource().some(item => {
        return (!item.issueType && item.issueDetail) || (item.issueType && !item.issueDetail);
      })
    ) {
      createMessage.warn(t('dict.DrawingsReview.issueCheckTip'));
      return false;
    }

    const params = {
      ...currentData.value,
      ...(await getValues()),
      saveAndCommit: type === 'commit',
      contents: getDataSource().map(item => ({
        ...item,
        saveAndCommit: type === 'commit',
        originType,
        originCode,
        insidePartNumber,
        id,
        issueDetailImage: item?.issueDetailImage?.map(value => ({
          fileName: value.name || value.fileName,
          filePath: value.url || value.filePath,
        })),
        scenarioImage: item?.scenarioImage?.map(value => ({
          fileName: value.name || value.fileName,
          filePath: value.url || value.filePath,
        })),
      })),
      dfmAttachment: state.customerFileList,
    };
    changeLoading(true);
    state.loading = true;
    if (reviewNode !== 'Engineering') {
      func = postDrawingsReviewCommit;
      params.reviewId = currentData.value.id;
    }
    // 如果是EPMReview节点，参数新增客户意见 备注 客户回复附件
    if (reviewNode === 'EPMReview') {
      merge(params, {
        ...(await reviewGetValues()),
        replyAttachment: state.customerReviewList,
      });
    }
    // 如果是PDOpinion节点，参数新增客户意见 备注 我司意见 客户回复附件
    if (reviewNode === 'PDOpinion') {
      merge(params, {
        ...(await reviewGetValues()),
        replyAttachment: state.customerReviewList,
      });
    }
    // 如果是PdLeaderOpinion节点，参数新增客户意见 备注 我司意见 客户回复附件 沟通附件
    if (reviewNode === 'PdLeaderOpinion') {
      merge(params, {
        ...(await reviewGetValues()),
        replyAttachment: state.customerReviewList,
        talkAttachment: state.talkReviewList,
      });
    }
    func(params)
      .then(({ code, msg }) => {
        if (code === 200) {
          createMessage.success(msg);
          emit('reload');
          if (params.saveAndCommit) {
            // 判断是否还有未审核的
            if (state.index < state.cacheList.length - 1) {
              return handleChangePage('next');
            }
            closePopup();
          }
        }
      })
      .finally(() => {
        changeLoading(false);
        state.loading = false;
      });
  }

  /**
   * 重置form，根据不同的节点显示不同的form
   * node1、PD制作 reviewNode: Engineering --> 带出当前账号的领导为下一节点处理人(PD Leader) 填写EPM
   * node2、PD Leader复合 PdLeaderCheck --> 评审结论和是否提DFM不可编辑
   * node3、EPM评审 EPMReview --> 评审结论、工程资料制作、是否提DFM禁用 下一节点处理人(PD)
   * node4、PD Leader意见 PDLeaderReviewer -->  评审结论、工程资料制作、是否提DFM禁用 下一节点处理人(PD Leader)
   */

  const getSchemaByReviewNode = (reviewNode: string) => {
    const epmConfirmNodes = new Set(['EPMConfirm', 'EPMConfirmEnd', 'NoDFM', 'OperationReviewEnd', 'PDEnd', 'EPMApproveEnd']);

    if (reviewNode === 'Engineering') {
      // 工程图纸评审
      return getEngineWorkSchema(centerGetForm);
    }

    if (reviewNode === 'PdLeaderCheck') {
      return getPdLeaderSchema(centerGetForm);
    }

    if (reviewNode === 'EPMReview') {
      return getEPMReviewSchema();
    }

    if (reviewNode === 'PDOpinion') {
      return getPdLeaderReviewer();
    }

    if (reviewNode === 'PdLeaderOpinion') {
      return getPdLeaderOpinion();
    }

    if (epmConfirmNodes.has(reviewNode)) {
      return getEPMConfirmSchema();
    }

    return [];
  };

  const disableSchemaWhenView = (schema: any[], mode: ModeTypeEnum) => {
    if (mode !== ModeTypeEnum.VIEW) {
      return schema;
    }

    return schema.map(item => {
      set(item, 'componentProps.disabled', true);
      return item;
    });
  };

  const disableReviewResultWhenNotAllowed = (schema: any[], reviewNode: string) => {
    if (reviewNode === 'Engineering' || reviewNode === 'PdLeaderCheck') {
      return schema;
    }

    if (schema[0]) {
      set(schema[0], 'componentProps.disabled', true);
    }

    return schema;
  };

  const applySelectOptions = (schema: any[], reviewResultList: any[], makeEngineeringInfoList: any[], DFMList: any[]) => {
    return schema.map(item => {
      if (item.fieldName === 'reviewResult') {
        set(item, 'componentProps.fieldNames', {
          label: 'fullName',
          value: 'enCode',
        });
        set(item, 'componentProps.options', reviewResultList);
      } else if (item.fieldName === 'makeEngineeringInfo') {
        set(item, 'componentProps.fieldNames', {
          label: 'fullName',
          value: 'enCode',
        });
        set(item, 'componentProps.options', makeEngineeringInfoList);
      } else if (item.fieldName === 'dfm') {
        set(item, 'componentProps.fieldNames', {
          label: 'fullName',
          value: 'enCode',
        });
        set(item, 'componentProps.options', DFMList);
      }

      return item;
    });
  };

  const parseOptionalInt = (value: unknown): number | '' => (isNullOrUnDef(value) ? '' : Number.parseInt(String(value), 10));

  async function formatSchema(): Promise<void> {
    await nextTick();
    const { reviewNode } = currentData.value;
    if (!reviewNode) {
      createMessage.warning('初始化数据失败');
      return;
    }

    let schema = getSchemaByReviewNode(reviewNode);

    schema = disableSchemaWhenView(schema, state.mode);
    schema = disableReviewResultWhenNotAllowed(schema, reviewNode);

    const [DFMList, makeEngineeringInfoList, reviewResultList, reviewOpinionList] = await Promise.all([
      baseStore.getDictionaryData('DrawingsReview.DFM', true),
      baseStore.getDictionaryData('DrawingsReview.MakeEngineeringInfo', true),
      baseStore.getDictionaryData('DrawingsReview.ReviewResult', true),
      baseStore.getDictionaryData('DrawingsReview.ReviewOpinion'),
    ]);

    console.log(reviewOpinionList); // 保留获取结果（若后续使用可直接接入）

    const currentSchema = applySelectOptions(schema, reviewResultList, makeEngineeringInfoList, DFMList);

    centerSetState(() => ({
      schema: currentSchema,
    }));

    await nextTick();

    const { value: current } = currentData;
    const reviewResult = parseOptionalInt(current.reviewResult);
    const makeEngineeringInfo = parseOptionalInt(current.makeEngineeringInfo);
    const dfm = parseOptionalInt(current.dfm);

    centerSetValues({
      ...current,
      reviewResult,
      makeEngineeringInfo,
      dfm,
      epmConfirmer: current.epm,
    });
  }

  function handlePreview(item) {
    console.log('🚀 ~ handlePreview ~ item: ', item);
    const params = {
      name: item.fileName,
      url: item.filePath,
      previewType: 'localPreview',
      noCache: false,
      isCopy: 0,
    };
    console.log({
      name: item.fileName,
      url: item.filePath,
      previewType: 'localPreview',
      noCache: false,
      isCopy: 0,
    });
    filePreviewRef.value?.init(params);
  }

  function handleDownloadImg(item) {
    downloadFile({ url: item.filePath, target: '_blank', fileName: item.fileName });
  }

  function handleDeleteImg(index) {
    state.customerFileList.splice(index, 1);
  }

  function handleCustomReviewDeleteImg(index) {
    state.customerReviewList.splice(index, 1);
  }

  function handleTalkReviewDeleteImg(index) {
    state.talkReviewList.splice(index, 1);
  }

  function getReviewDetail() {
    return getDrawingsReviewDetail({
      id: currentData.value?.detailId || currentData.value?.id,
      originType: currentData.value?.originType,
      originCode: currentData.value?.originCode,
      insidePartNumber: currentData.value?.insidePartNumber,
    });
  }

  function getReviewRecord() {
    return getDrawingsReviewRecordList({
      insidePartNumber: currentData.value?.insidePartNumber,
      id: currentData.value?.id,
    });
  }

  function getAttachAction(row) {
    return [
      {
        icon: 'icon-ym icon-ym-btn-add',
        onClick: handleChangeTable.bind(null, 'addBaseIndex', row),
      },
      {
        icon: 'icon-ym icon-ym-btn-copy',
        onClick: handleChangeTable.bind(null, 'copy', row),
      },
      {
        icon: 'icon-ym icon-ym-delete',
        // auth: 'btn_remove',
        modelConfirm: {
          onOk: handleChangeTable.bind(null, 'delete', row),
        },
      },
    ];
  }

  type TableChangeType = 'addBaseIndex' | 'add' | 'copy' | 'delete';

  interface TableRow {
    uuid?: string;
    id?: string | number;
    [key: string]: unknown;
  }

  async function handleChangeTable(type: TableChangeType, row: TableRow = {}): Promise<void> {
    const fullData = getDataSource();
    const data = cloneDeep(fullData);

    const currentIndex = fullData.findIndex(item => item.uuid === row.uuid);

    const insertRow = (index: number, base: TableRow = rowData): void => {
      data.splice(index, 0, {
        ...base,
        uuid: buildUUID(),
      });
    };

    switch (type) {
      case 'addBaseIndex': {
        if (currentIndex === -1) break;
        insertRow(currentIndex + 1);
        break;
      }

      case 'add': {
        const insertIndex = Math.max(data.length - 1, 0);
        insertRow(insertIndex);
        break;
      }

      case 'copy': {
        if (currentIndex === -1) break;
        const copyData = cloneDeep(fullData[currentIndex]);
        delete copyData.id;
        insertRow(currentIndex + 1, copyData);
        break;
      }

      case 'delete': {
        if (currentIndex === -1) break;
        data.splice(currentIndex, 1);
        break;
      }

      default:
        break;
    }

    loadData(data);
  }

  // 是否显示评审意见
  const isShowReviewProposal = computed(() => {
    const reviewNode = currentData.value?.reviewNode;
    if (!reviewNode) return false;
    if (reviewNode === 'Engineering') return false;
    if (reviewNode === 'NoDFM') return false;
    if (reviewNode === 'PdLeaderCheck') return false;
    return true;
  });

  function handlePreviewInsidePartNumberDrawing() {
    filePreviewRef.value.init({
      name: currentData.value?.desensitizedDrawingsName,
      Id: currentData.value?.desensitizedDrawingsId,
      previewType: 'localPreview',
      noCache: false,
      isCopy: 0,
    });
  }

  // 打开脱敏图纸列表弹框
  function handleDesensitizeList() {
    openFileList(true, {
      id: currentData.value?.desensitizedDrawingsId,
      keyFieldName: 'id',
      params: {
        current: true,
      },
      downloadApi: fileDownload,
      useQuery: true,
      // usePath: true,
      useMerge: false,
      listApi: getFileInfoHistory,
    });
  }

  // function getIsEditable() {
  //   let flag = false;
  //   const currentValue = state['cacheList'][state.index];
  //   const reviewNode = currentValue?.reviewNode;
  //   if (state.mode === ModeTypeEnum.EDIT) {
  //     flag = true;
  //   }
  //   // reviewNode只能在Engineering和PdLeaderCheck显示，其他节点禁用
  //   if (reviewNode === 'Engineering' || reviewNode === 'PdLeaderCheck') {
  //     flag = true;
  //   } else {
  //     flag = false;
  //   }
  //   return flag;
  // }

  function routeDetail() {
    openDetailList(true, { ...currentData.value });
  }

  function beforeInstallUpload(file: File, fileList: File[]): boolean {
    const lastFile = fileList[fileList.length - 1];
    const shouldSkip = !lastFile || !fileList.length || file.name !== lastFile.name;
    if (!shouldSkip) {
      uploadState.activeUploads = 0;
      uploadState.allFiles = fileList;
      state.loading = true;

      const totalFiles = uploadState.allFiles.length;
      let completedUploads = 0;

      const handleUploadComplete = () => {
        completedUploads += 1;
        if (completedUploads === totalFiles) {
          nextTick(() => {
            state.loading = false;
          });
        }
      };

      for (const item of uploadState.allFiles) {
        requestIdleCallbackAdapter(() => {
          const formData = new FormData();
          formData.append('fileList', item);

          uploadFiles(formData)
            .then(({ code, msg, data }) => {
              if (code === 200 && data?.[0]) {
                const fileInfo = data[0];
                state.customerFileList.push({
                  fileName: fileInfo.originFileName,
                  filePath: fileInfo.fullPath,
                  creatorUserName: getUserInfo.value.userName,
                  creatorTime: dateUtil().valueOf(),
                });
                uploadState.activeUploads += 1;
              } else if (msg) {
                createMessage.error(msg);
              }
            })
            .catch(error => {
              createMessage.error(String(error));
            })
            .finally(handleUploadComplete);
        });
      }
      // 单一出口，避免 invariant return
      return false;
    }
  }

  async function handleTableDetail(data) {
    const { contents } = data;
    // 根据是否显示编辑功能，动态设置表格的编辑状态和列配置
    const columns = getQuestionColumns();
    gridSetState(() => {
      return {
        gridOptions: {
          editConfig: {
            enabled: ifShowEditAttach.value,
          },
          columns: ifShowEditAttach.value ? columns : columns.filter(item => item.field !== 'action'),
        },
      };
    });
    await nextTick();
    if (isNullOrUnDef(contents) || isEmpty(contents)) {
      // 如果contents为空，则初始化数据
      initTableData();
    } else {
      reloadData(
        contents.map(item => ({
          ...item,
          uuid: item.id,
          issueDetailImage: item?.issueDetailImage?.map(value => ({
            fileName: value.name || value.fileName,
            filePath: value.url || value.filePath,
          })),
          scenarioImage: item?.scenarioImage?.map(value => ({
            fileName: value.name || value.fileName,
            filePath: value.url || value.filePath,
          })),
        })),
      );
    }
    console.log('🚀 ~ handleTableDetail ~ ModeTypeEnum.VIEW: ', ModeTypeEnum.VIEW);
  }

  function beforeCustomerReviewUpload(file: File, fileList: File[]) {
    // beforeUpload每个文件上传都会跑一次，只判定在最后一个文件执行上传
    if (file.name !== fileList[fileList.length - 1].name) return;
    // const errorList = [];
    uploadState.activeUploads = 0;
    uploadState.allFiles = fileList;
    state.loading = true;
    fileList.forEach(item => {
      requestIdleCallbackAdapter(() => {
        const formData = new FormData();
        formData.append('fileList', item);
        uploadFiles(formData)
          .then(async ({ code, msg, data }) => {
            console.log('🚀 ~  ~ data: ', data);
            if (code == 200) {
              state.customerReviewList.push({
                fileName: data[0].originFileName,
                filePath: data[0].fullPath,
                creatorUserName: getUserInfo.value.userName,
                creatorTime: dateUtil().valueOf(),
              });
              uploadState.activeUploads = uploadState.activeUploads + 1;
              await nextTick();
              if (uploadState.activeUploads === uploadState.allFiles.length) {
                state.loading = false;
              }
            }
          })
          .finally(() => {});
      });
    });
    errorList.push(item);
    return false;
  }

  function handleHistorySubmit(selectRow) {
    const row = selectRow[0];
    if (!row) return createMessage.warning(t('dict.PCCApplyColumn.selectDataForVersionUpgrade'));
    console.log(row, 'rowrowrowrow');
    reloadData(row.contentList);
    closeHistoryModal();
  }

  function beforeTalkReviewUpload(file: File, fileList: File[]) {
    // beforeUpload每个文件上传都会跑一次，只判定在最后一个文件执行上传
    if (file.name !== fileList[fileList.length - 1].name) return;
    uploadState.activeUploads = 0;
    uploadState.allFiles = fileList;
    state.loading = true;
    fileList.forEach(item => {
      requestIdleCallbackAdapter(() => {
        const formData = new FormData();
        formData.append('fileList', item);
        uploadFiles(formData).then(async ({ code, msg, data }) => {
          console.log('🚀 ~  ~ data: ', data);
          if (code == 200) {
            state.talkReviewList.push({
              fileName: data[0].originFileName,
              filePath: data[0].fullPath,
              creatorUserName: getUserInfo.value.userName,
              creatorTime: dateUtil().valueOf(),
            });
            uploadState.activeUploads = uploadState.activeUploads + 1;
            await nextTick();
            if (uploadState.activeUploads === uploadState.allFiles.length) {
              state.loading = false;
            }
          }
        });
      });
    });
    return false;
  }

  function handleReject() {
    openRejectModal(true, {
      api: rejectResult,
      ids: [currentData.value.id],
    });
    // rejectResult({}).then(({code, msg,}) => {
    // 	if(code === 200){
    // 		createMessage.success(msg)
    // 	}
    // })
  }

  function setTableDisabled() {
    const cloumns = getQuestionColumns();
    reloadColumn(cloumns.filter(item => item.field !== 'action'));
  }

  function handleOpenHistory() {
    openHistoryModal(true, {});
  }

  function handleChangePage(type) {
    if (type == 'prev') {
      console.log('🚀 ~ handleChangePage ~ prev: ');
      // emits('change', 'prev');
      // emits('toPre');
      init({
        cacheList: state.cacheList,
        index: state.index - 1,
        // mode: state.mode,
      });
    } else {
      console.log('🚀 ~ handleChangePage ~ next: ');
      init({
        cacheList: state.cacheList,
        index: state.index + 1,
        mode: state.mode,
      });
      // emits('change', 'next');
      // emits('toNext');
    }
  }

  function handlePopupClose() {
    reviewSetState(() => {
      return {
        schema: [],
      };
    });
  }
</script>

<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    :showOkBtn="false"
    :title="t('common.detailText')"
    destroyOnClose
    class="full-popup p-10px pt-0px"
    @close="handlePopupClose">
    <template v-if="state.mode !== ModeTypeEnum.VIEW" #centerToolbar>
      <a-button v-if="!isEndStatus" type="primary" @click="handleSubmit('save')" ghost class="ml-12px" :loading="state.loading"
        >{{ t('common.temporarySave') }}
      </a-button>
      <a-button
        v-if="currentData?.reviewNode === 'EPMConfirm' && !isEndStatus"
        type="primary"
        @click="handleReject"
        ghost
        class="ml-12px"
        :loading="state.loading"
        >{{ t('common.rejectText') }}
      </a-button>
      <a-button v-if="!isEndStatus" type="primary" @click="handleSubmit('commit')" class="ml-12px" :loading="state.loading">{{ t('common.submit') }} </a-button>
      <BasicPopPage
        :config="{
          currentIndex: state.index,
          total: state.cacheList.length,
        }"
        class="ml-12px"
        @change="handleChangePage"></BasicPopPage>
    </template>
    <ScrollContainer>
      <Subtitle :title="t('common.baseinfo')" class="mt-8px" :extra="{ show: true, hideAdd: true }" />
      <BaseInfoForm>
        <template #desensitizedDrawingsName>
          <div class="w-full h-32px box-border py-4px px-11px leading-22px ipt-border flex justify-between" style="background: rgb(0 0 0 / 4%)">
            <div class="cursor-pointer" style="color: rgb(255 123 0 / 100%)" @click="handlePreviewInsidePartNumberDrawing"
              >{{ currentData?.desensitizedDrawingsName }}
            </div>
            <i class="icon-ym icon-ym-btn-preview cursor" @click="handleDesensitizeList" style="color: rgb(24 144 255 / 100%)"></i>
          </div>
        </template>
        <template #remark="slotProps">
          <!-- <div class="w-full h-32px box-border py-4px px-11px leading-22px ipt-border" style="background: rgb(0 0 0 / 4%);min-height: max-content;">
            <div class="cursor-pointer" style="color: rgb(255 123 0 / 100%)">{{ slotProps?.value }} </div>
          </div> -->
          <a-textarea class="cursor-pointer" disabled style="color: rgb(255 123 0 / 100%)" autosize :value="slotProps?.value" />
        </template>
        <template #history>
          <div class="w-full h-32px box-border py-4px px-11px leading-22px ipt-border" style="background: rgb(0 0 0 / 4%)">
            <div class="cursor-pointer" style="color: rgb(255 123 0 / 100%)" @click="routeDetail">{{ t('common.viewDetails') }} </div>
          </div>
        </template>
      </BaseInfoForm>
      <Subtitle :title="t('common.drawingReviewConclusion')" class="mt-8px" :extra="{ show: true, hideAdd: true }" />
      <CenterForm />
      <a-row class="mt-5px" style="height: calc(100% - 290px)">
        <a-col :span="isShowReviewProposal ? 18 : 24" class="h-full">
          <Subtitle :title="t('dict.DrawingsReviewColumn.issue')" class="mt-8px" :extra="{ show: true, hideAdd: true }">
            <template v-if="ifShowEditAttach" #afterTitle>
              <a-space>
                <!--								添加问题-->
                <a-button type="primary" @click="handleChangeTable('add')">{{ t('common.addQuestionsText') }} </a-button>
                <!--								引用历史记录-->
                <a-button type="primary" ghost @click="handleOpenHistory">{{ t('dict.PCCApplyColumn.referenceHistoryRecord') }} </a-button>
                <a-upload :multiple="true" :before-upload="beforeInstallUpload" :showUploadList="false">
                  <!--									上传附件-->
                  <a-button type="primary" ghost>{{ t('common.upFiles') }} </a-button>
                </a-upload>
              </a-space>
            </template>
          </Subtitle>
          <FileUploadList
            :items="customerFileList"
            :allow-delete="ifShowEditAttach"
            @preview="handlePreview"
            @download="handleDownloadImg"
            @delete="handleDeleteImg" />
          <Grid style="height: calc(100% - 100px)">
            <template #issueDetail="{ row, rowIndex }">
              <div class="editor-html" v-html="row.issueDetail"></div>
            </template>
            <template #issueDetailImage="{ row, rowIndex }">
              <ImageUpload
                :disabled="state.mode == 'view' || !ifShowEditAttach"
                version="2"
                v-model:value="row.issueDetailImage"
                updateType="all"
                :maxNumber="3"
                :api="null"
                class="h-70px mb-0" />
            </template>
            <template #scenario="{ row, rowIndex }">
              <div class="editor-html" v-html="row.scenario"></div>
            </template>
            <template #scenarioImage="{ row, rowIndex }">
              <ImageUpload
                :disabled="state.mode == 'view' || !ifShowEditAttach"
                version="2"
                v-model:value="row.scenarioImage"
                updateType="all"
                :maxNumber="3"
                :api="null"
                class="h-70px mb-0" />
            </template>
            <template #action="{ row }">
              <TableAction :outside="true" :actions="getAttachAction(row)" />
            </template>
          </Grid>
        </a-col>
        <a-col :span="6" v-if="isShowReviewProposal">
          <Subtitle :title="t('dict.DrawingsReview.ReviewOpinion')" class="mt-8px" :extra="{ show: true, hideAdd: true }">
            <template #extra>
              <a-upload v-if="currentData.reviewNode === 'EPMReview'" :multiple="true" :before-upload="beforeCustomerReviewUpload" :showUploadList="false">
                <a-button type="primary" ghost>{{ t('common.upFiles') }} </a-button>
              </a-upload>
              <a-upload v-if="currentData.reviewNode === 'PdLeaderOpinion'" :multiple="true" :before-upload="beforeTalkReviewUpload" :showUploadList="false">
                <a-button type="primary" ghost>{{ t('common.upFiles') }} </a-button>
              </a-upload>
            </template>
          </Subtitle>
          <ReviewForm>
            <template #customAttach="slotProps">
              <div class="customer-review-wrapper min-h-60px">
                <template v-for="(item, index) in state.customerReviewList">
                  <div class="attach-file-item flex justify-start">
                    <a @click.stop="handlePreview(item)" class="item-file-name ellipsis">{{ item.fileName }}</a>
                    <div>
                      <a-button type="link" @click="handleDownloadImg(item)">
                        <template #icon>
                          <i class="icon-ym icon-ym-btn-download"></i>
                        </template>
                      </a-button>
                      <a-button v-if="currentData.reviewNode === 'EPMReview'" type="link" @click="handleCustomReviewDeleteImg(index)">
                        <template #icon>
                          <i class="icon-ym icon-ym-delete"></i>
                        </template>
                      </a-button>
                    </div>
                  </div>
                </template>
              </div>
            </template>
            <template #communicationAttach="slotProps">
              <div class="customer-review-wrapper min-h-60px">
                <template v-for="(item, index) in state.talkReviewList">
                  <div class="attach-file-item flex justify-start">
                    <a @click.stop="handlePreview(item)" class="item-file-name ellipsis">{{ item.fileName }}</a>
                    <div>
                      <a-button type="link" @click="handleDownloadImg(item)">
                        <template #icon>
                          <i class="icon-ym icon-ym-btn-download"></i>
                        </template>
                      </a-button>
                      <a-button v-if="currentData.reviewNode === 'PdLeaderOpinion'" type="link" @click="handleTalkReviewDeleteImg(index)">
                        <template #icon>
                          <i class="icon-ym icon-ym-delete"></i>
                        </template>
                      </a-button>
                    </div>
                  </div>
                </template>
              </div>
            </template>
          </ReviewForm>
        </a-col>
      </a-row>
    </ScrollContainer>
    <PreviewModal ref="filePreviewRef" />
    <FileListModal @register="registerFileList"></FileListModal>
    <DetailListModal @register="registerDetailList" />
    <RejectModal @register="registerRejectModal" @reload="emit('reload')" />
    <History @register="registerHistoryModal" @submit="handleHistorySubmit" />
  </BasicPopup>
</template>

<style lang="less" scoped>
  :deep(.lydc-subtitle-container) {
    margin-bottom: 0;
  }

  :deep(.text-destructive) {
    color: #ff4d4f;
  }

  .ellipsis {
    overflow: hidden; /* 隐藏溢出的内容 */
    white-space: nowrap; /* 不换行 */
    text-overflow: ellipsis; /* 用省略号表示溢出的内容 */
    max-width: 75%;
  }

  :deep(.wang-editor-container .wang-editor-editor) {
    padding: 0;
  }

  :deep(.wang-editor-footer) {
    display: none;
  }

  .ipt-border {
    border: 1px solid rgb(217 217 217);
    border-radius: 4px;
  }

  :deep(.custom-attach) {
    background: rgb(242 242 242 / 100%);
    border-radius: 4px;
    padding-left: 4px;

    & > label {
      padding-left: 4px;
    }

    & > div {
      justify-content: start;
    }
  }

  :deep(.w-e-drop-panel) {
    position: fixed;
    left: 400px !important;
  }

  .editor-html {
    :deep(ul) {
      list-style: revert;
      padding: 14px !important;
    }

    :deep(ol) {
      list-style: auto;
      padding: 14px !important;
    }
  }

  :deep(.cell-start > div) {
    align-items: start !important;
  }
</style>
