<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    :okText="t('common.saveText')"
    destroyOnClose
    :cancelText="t('common.cancel')"
    :title="activeKey === 'pending' ? t('common.approval') : t('common.detailText')"
    :showOkBtn="false"
    class="full-popup pb-10px top-0">
    <template #appendToolbar>
      <!-- 驳回 -->
      <a-button v-auth="'btn_reject'" v-if="activeKey === 'pending'" type="primary" ghost @click="handleReject" class="mx-12px">{{
        t('common.rejectText')
      }}</a-button>
      <a-button v-auth="'btn_edit'" type="primary" v-if="activeKey === 'pending'" @click="handleSubmit(0)" class="mx-12px">{{ t('common.submit') }}</a-button>
      <a-button v-auth="'btn_edit'" type="primary" v-if="activeKey === 'pending' && handleType === 'bulk'" @click="handleSubmit(1)" class="ml-12px">{{
        t('common.submitAndNext')
      }}</a-button>
    </template>
    <ScrollContainer>
      <a-card class="lydc-content-wrapper-search-box p-12px mb-16px" style="border-bottom: 1px solid #dbdbdb">
        <div class="title-stick">
          <div class="gun"></div>
          <div class="title">{{ t('common.baseinfo') }}</div>
        </div>
        <BasicForm @register="registerBasicInfoForm"> </BasicForm>

        <!-- <Grid style="height: auto"> </Grid> -->

        <!-- <BasicForm @register="registerForm"> </BasicForm> -->
      </a-card>

      <a-card style="margin-top: 10px">
        <div class="upload-file-title">
          <div class="title-stick">
            <div class="gun"></div>
            <div class="title">{{ t('common.uploadFile') }}</div>
          </div>
        </div>

        <AttachmentGrid style="height: auto">
          <template #AttachmentName="{ row }">
            <div class="table-a" @click="handlePreview(row.attachmentUrl, row.attachmentName)">{{ row.attachmentName }}</div>
          </template>
          <template #action="{ row }">
            <TableAction :actions="getAttachmentTableActions(row)" />
          </template>
        </AttachmentGrid>
      </a-card>

      <a-card class="lydc-content-wrapper-search-box p-12px mb-16px" style="border-bottom: 1px solid #dbdbdb">
        <div class="upload-file-title">
          <div class="title-stick">
            <div class="gun"></div>
            <div class="title">{{ t('common.DFMFile') }}</div>
          </div>
          <a-button v-if="activeKey === 'pending' && status === '1'" v-auth="'btn_edit'" class="ml-12px" ghost type="primary" @click="handleUpload">{{
            t('common.uploadFile')
          }}</a-button>
        </div>
        <DFMGrid style="height: auto">
          <template #AttachmentName="{ row }">
            <div class="table-a" @click="handlePreview(row.attachmentUrl, row.attachmentName)">{{ row.attachmentName }}</div>
          </template>
          <template #action="{ row }">
            <TableAction outside :actions="getTableActions(row)" />
          </template>
        </DFMGrid>
      </a-card>
    </ScrollContainer>
  </BasicPopup>
  <PreviewModal ref="filePreviewRef" />
  <UploadModal @register="registerUpload" @get-table="getDrawingList" :single="true" :title="t('common.uploadFile')" />
  <RejectModal @register="registerRejectModal" />
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { BasicForm, useForm } from '/@/components/Form';
  import { ScrollContainer } from '/@/components/Container';
  import { useUserStore } from '/@/store/modules/user';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useModal } from '/@/components/Modal';
  import { uploadfiles } from '/@/api/basic/common';
  import { getRepairmoldDetail, repairmoldAudit, repairmoldReject } from '/@/api/engineering/mould';
  import { TableAction } from '/@/components/Table';
  import { downloadFn } from '/@/views/engineering/mouldRoom/newMold/util';
  import UploadModal from '/@/views/engineering/mouldRoom/components/UploadModal.vue';
  import { PreviewModal } from '/@/components/Upload';
  import { detailFormSchemas, formSchema, getDetailGridColumn, getDetailAttachmentGridColumn } from '../config';
  import { RejectModal } from '/@/components/CustomComponents';

  const { t } = useI18n();
  const { hasBtnP } = usePermission();
  const emit = defineEmits(['reload', 'register']);

  const userStore = useUserStore();
  const userInfo = userStore.getUserInfo;
  const { createMessage } = useMessage();

  const [registerPopup, { closePopup, changeLoading }] = usePopupInner(init);
  const [registerUpload, { openModal: openUpload }] = useModal();
  const [registerRejectModal, { openModal: openRejectModal }] = useModal();

  const handleType = ref('');
  const ids = ref<number[]>([]);
  const currentIndex = ref(0);
  const activeKey = ref('');
  const status = ref('');
  const filePreviewRef = ref<any | null>(null);

  // 基础信息form表单
  const [registerBasicInfoForm, { setFieldsValue: basicSetFieldsValue, validateFields: basicInfo, updateSchema }] = useForm({
    schemas: detailFormSchemas,
    layout: 'vertical',
    labelWidth: 220,
    baseColProps: {
      span: 6,
    },
    i18nConfig: {
      moduleCode: 'RepairMoldColumn',
      transferRange: ['placeholder', 'label'],
    },
  });

  // 第一个表格
  // const [Grid, gridApi] = useVbenVxeGrid({
  //   gridOptions: {
  //     id: 'engineering-mouldRoom-repairMoldApproval-list-problem',
  //     columns: getDetailGridColumn(),
  //     pagerConfig: {
  //       autoHidden: true,
  //     },
  //     toolbarConfig: {
  //       enabled: false,
  //     },
  //     rowConfig: {
  //       keyField: '_X_ROW_KEY',
  //     },
  //     i18nConfig: {
  //       moduleCode: 'RepairMoldColumn',
  //     },
  //   },
  // });

  // 与会人员 form表单
  // const [registerForm, { setFieldsValue: personSetFieldsValue }] = useForm({
  //   schemas: formSchema,
  //   layout: 'vertical',
  //   labelWidth: 220,
  //   baseColProps: {
  //     span: 4,
  //   },
  //   i18nConfig: {
  //     moduleCode: 'RepairMoldColumn',
  //     transferRange: ['placeholder', 'label'],
  //   },
  // });

  // 第二个表格
  const [AttachmentGrid, attachmentGridApi] = useVbenVxeGrid({
    gridOptions: {
      id: 'engineering-mouldRoom-repairMoldApproval-list-uploadFile',
      columns: getDetailAttachmentGridColumn(),
      pagerConfig: {
        autoHidden: true,
      },
      toolbarConfig: {
        enabled: false,
      },
      i18nConfig: {
        moduleCode: 'RepairMoldColumn',
      },
    },
  });

  const handlePreview = (filePath, fileName) => {
    if (!hasBtnP('btn_detail')) return createMessage.warning('当前账号暂无查看权限');
    const params = {
      name: fileName,
      filePath: filePath,
      previewType: 'localPreview',
      version: 2,
    };
    filePreviewRef.value?.init(params);
  };

  // 第二个表格-操作
  const getAttachmentTableActions = row => {
    return [
      {
        icon: 'icon-ym icon-ym-download',
        auth: 'btn_download',
        tooltip: t('common.downloadText'),
        onClick: handowDownload.bind(null, row.attachmentUrl, row.attachmentName),
      },
    ];
  };

  // 第二个表格-操作-下载
  const handowDownload = (filePath, fileName) => {
    downloadFn(filePath, fileName);
  };

  // 模流分析
  const [DFMGrid, DFMGridApi] = useVbenVxeGrid({
    gridOptions: {
      id: 'engineering-mouldRoom-repairMoldApproval-list-uploadDFM',
      columns: getDetailAttachmentGridColumn(),
      pagerConfig: {
        autoHidden: true,
      },
      toolbarConfig: {
        enabled: false,
      },
      rowConfig: {
        keyField: '_X_ROW_KEY',
      },
      i18nConfig: {
        moduleCode: 'RepairMoldColumn',
      },
    },
  });

  function getTableActions(row) {
    return [
      {
        icon: 'icon-ym icon-ym-delete',
        tooltip: t('common.delText'),
        auth: 'btn_edit',
        disabled: status.value != '1',
        onClick: handleDelete.bind(null, row),
      },
      {
        icon: 'icon-ym icon-ym-download',
        auth: 'btn_download',
        tooltip: t('common.downloadText'),
        onClick: handleDownload.bind(null, row),
      },
    ];
  }

  function handleUpload() {
    if (DFMGridApi.getDataSource().length > 0) {
      createMessage.warning(t('common.uploadOneDFMTip'));
      return;
    }
    openUpload(true, {
      api: uploadfiles,
    });
  }

  const handleDelete = row => {
    DFMGridApi.grid.remove(row);
  };

  const handleDownload = row => {
    const { attachmentName, attachmentUrl } = row;
    downloadFn(attachmentUrl, attachmentName);
  };

  // 上传附件后的回调
  function getDrawingList(list) {
    const drawingList = list.map(item => {
      return {
        attachmentName: item.originFileName,
        attachmentSize: item.fileSize,
        attachmentUrl: item.fullPath,
        uploadUserName: userInfo.userName,
        uploadUserId: userInfo.userId,
        uploadTime: new Date().getTime(),
      };
    });
    // for (let i = 0; i < drawingList.length; i++) {
    //   DFMGridApi.grid.insertAt(drawingList[i], -1);
    // }
    const newList = [...DFMGridApi.getDataSource(), ...(drawingList || [])];
    DFMGridApi.grid.loadData(newList);
  }

  const getDetail = async id => {
    const { data } = await getRepairmoldDetail(id);
    status.value = data.status.toString();
    const { problemImageName, problemImageUrl, productImageUrl, productImageName } = data;

    const problemImage = problemImageUrl
      ? problemImageUrl.split(',').map((item, index) => {
          return {
            url: item,
            originFileName: problemImageName.split(',')[index],
            fullPath: item,
          };
        })
      : [];
    const productImage = productImageUrl
      ? productImageUrl.split(',').map((item, index) => {
          return {
            url: item,
            originFileName: productImageName.split(',')[index],
            fullPath: item,
          };
        })
      : [];

    // 基础信息
    basicSetFieldsValue({
      moldNo: data.moldNo,
      projectName: data.projectName,
      productName: data.productName,
      pdUserId: data.pdUserId,
      orderDate: data.orderDate,
      successTime: data.successTime,
      targetNumber: data.targetNumber,
      currentNumber: data.currentNumber,
      moldRepairType: data.moldRepairType,
      isMoldFinish: data.isMoldFinish && data.isMoldFinish.toString(),
      urgentLevel: data.urgentLevel && data.urgentLevel.toString(),
      isModifyDraw: data.isModifyDraw && data.isModifyDraw.toString(),
      drawBeforeVersion: data.drawBeforeVersion,
      drawAfterVersion: data.drawAfterVersion,
      estimatedImportTime: data.estimatedImportTime,
      reviewUserId: data.reviewUserId,
      productImage,
      problemImage,
    });
    // 问题描述表格
    // gridApi.grid.reloadData(data.problemList);
    // 与会人员Form
    // personSetFieldsValue({
    //   meetPersonIds: data.meetPersonIds ? data.meetPersonIds.split(',') : [],
    //   dqeUserId: data.dqeUserId,
    //   pdLeaderId: data.pdLeaderId,
    //   teLeaderId: data.teLeaderId,
    //   rdLeaderId: data.rdLeaderId,
    //   moldUndertakerId: data.moldUndertakerId,
    // });
    // 附件上传表格
    attachmentGridApi.grid.reloadData(data.attachmentList);
    // DFM文件表格
    if (data.dfmAttaList) {
      DFMGridApi.grid.reloadData(data.dfmAttaList);
    }
  };

  async function init(data) {
    handleType.value = data.handleType;
    ids.value = data.ids;
    activeKey.value = data.activeKey;
    changeLoading(true);
    await getDetail(ids.value[0]);
    changeLoading(false);
  }

  const handleReject = async () => {
    const id = ids.value[currentIndex.value];
    openRejectModal(true, {
      api: repairmoldReject,
      ids: [id],
    });
  };

  const handleSubmit = async type => {
    // type 0-提交 1-提交并下一个
    const uploadFileInfo = DFMGridApi.getDataSource();
    // if (!uploadFileInfo.length) {
    //   createMessage.warning(t('common.DFMUploadTip'));
    //   return;
    // }
    const params = uploadFileInfo.length
      ? {
          ...uploadFileInfo[0],
          id: ids.value[currentIndex.value],
        }
      : {
          id: ids.value[currentIndex.value],
        };
    changeLoading(true);
    const { code, msg } = await repairmoldAudit(params).finally(() => {
      changeLoading(false);
    });
    if (type === 0) {
      if (code === 200) {
        createMessage.success(msg);
        emit('reload');
        closePopup();
        return;
      }
      createMessage.error(msg);
    } else {
      if (code === 200) {
        createMessage.success(msg);
      } else {
        createMessage.error(msg);
        return;
      }
      if (currentIndex.value >= ids.value.length) {
        createMessage.warning(t('common.alreadyAtTheLastDataEntry'));
        return;
      }
      currentIndex.value++;
      const currentId = ids.value[currentIndex.value];
      changeLoading(true);
      await getDetail(currentId).finally(() => {
        changeLoading(false);
      });
      DFMGridApi.reloadData([]);
    }
  };
</script>
<style lang="less" scoped>
  .full-popup {
    ::v-deep(.vxe-table--body-wrapper) {
      height: auto !important;
    }
  }

  .title-stick {
    display: flex;
    align-items: center;

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

    //&:before {

    //}
    :deep(.ant-upload-list-picture-card-container) {
      width: 250px;
      height: 250px;
    }

    :deep(.ant-upload.ant-upload-select-picture-card) {
      width: 250px;
      height: 250px;
    }

    :deep(.ant-upload) {
      width: 250px;
      height: 250px;
    }
  }

  .upload-file-title {
    display: flex;
    align-items: center;
  }
</style>
