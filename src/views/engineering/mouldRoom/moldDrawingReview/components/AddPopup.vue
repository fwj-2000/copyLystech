<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    :showOkBtn="hasBtnP('btn_edit')"
    :showCancelBtn="true"
    :title="handleType === 'add' ? t('common.add2Text') : t('common.editText')"
    :destroyOnClose="true"
    :showFooter="false"
    @ok="handleSave(1)"
    :okText="t('dict.Flow.NodeAction.1')"
    :okButtonProps="{ class: 'mr-12px，my-12px' }"
    class="full-popup pb-10px">
    <template #centerToolbar>
      <a-button v-auth="'btn_edit'" type="primary" ghost class="ml-12px" @click="handleSave(0)">{{ t('dict.SMAApplyStatus.Storage') }}</a-button>
    </template>
    <ScrollContainer>
      <a-card class="lydc-content-wrapper-search-box p-12px mb-16px" style="border-bottom: 1px solid #dbdbdb">
        <div class="title-stick">
          <div class="gun"></div>
          <div class="title">{{ t('common.baseinfo') }}</div>
        </div>
        <BasicForm @register="registerBasicInfoForm"> </BasicForm>

        <!-- 添加行 -->
        <!-- <AddCustomRows @submit="handleAddColumn" />
        <Grid style="height: auto">
          <template #action="{ row }">
            <TableAction outside :actions="getTableActions(row)" />
          </template>
        </Grid>

        <BasicForm @register="registerForm"> </BasicForm> -->
      </a-card>

      <a-card style="margin-top: 10px">
        <div class="upload-file-title">
          <div class="title-stick">
            <div class="gun"></div>
            <div class="title">{{ t('dict.DrawingsReviewColumn.attachmentUpload') }}</div>
          </div>
          <a-button class="ml-12px" v-auth="'btn_edit'" type="primary" ghost @click="handleUpload">{{
            t('dict.DrawingsReviewColumn.attachmentUpload')
          }}</a-button>
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
    </ScrollContainer>
  </BasicPopup>
  <PreviewModal ref="filePreviewRef" />
  <UploadModal @register="registerUpload" @get-table="getDrawingList" :title="t('dict.RepairMoldColumn.quotation')" :single="true" />
</template>
<script lang="ts" setup>
  import { ref, nextTick } from 'vue';
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { repairmold } from '/@/api/engineering/mould';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { BasicForm, useForm } from '/@/components/Form';
  import { ScrollContainer } from '/@/components/Container';
  import { useUserStore } from '/@/store/modules/user';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useModal } from '/@/components/Modal';
  import { getRepairmoldDetail } from '/@/api/engineering/mould';
  import UploadModal from '/@/views/engineering/mouldRoom/components/UploadModal.vue';
  import { PreviewModal } from '/@/components/Upload';
  // import { AddCustomRows } from '/@/components/AddCustomRows';
  import { TableAction } from '/@/components/Table';
  import { downloadFn } from '/@/views/engineering/mouldRoom/newMold/util';
  import { detailFormSchemas, formSchema, getDetailGridColumn, getDetailAttachmentGridColumn } from '../config';
  import { uploadfiles } from '/@/api/basic/common';
  import dayjs from 'dayjs';
  import { message } from 'ant-design-vue';

  const { t } = useI18n();
  const { hasBtnP } = usePermission();
  const emit = defineEmits(['reload', 'register']);

  const userStore = useUserStore();
  const userInfo = userStore.getUserInfo;
  const { createMessage } = useMessage();

  const [registerPopup, { closePopup, changeLoading }] = usePopupInner(init);
  const [registerUpload, { openModal: openUpload }] = useModal();

  const handleType = ref('');
  const detailId = ref('');
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
  //     id: 'engineering-mouldRoom-moldDrawingReview-list-problem',
  //     columns: getDetailGridColumn(),
  //     pagerConfig: {
  //       autoHidden: true,
  //     },
  //     editConfig: {
  //       trigger: 'click',
  //       mode: 'row',
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

  // 第一个表格-操作
  // function getTableActions(row) {
  //   return [
  //     // 删除
  //     {
  //       icon: 'icon-ym icon-ym-delete',
  //       tooltip: t('dict.ProgressStatusEnum.8'),
  //       onClick: handleDelete.bind(null, row),
  //       auth: 'btn_edit',
  //     },
  //   ];
  // }

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

  // 第一个表格-操作-删除
  // const handleDelete = row => {
  //   gridApi.grid.remove(row);
  // };

  // 第一个表格添加行
  // const handleAddColumn = n => {
  //   if (!hasBtnP('btn_edit')) return;
  //   for (let i = 0; i < n; i++) {
  //     gridApi.grid.insertAt(
  //       {
  //         problemDescription: '',
  //         repairSolution: '',
  //         repairTakeStock: '',
  //         improveJudge: '',
  //       },
  //       -1,
  //     );
  //   }
  // };

  // 与会人员 form表单
  // const [registerForm, { validateFields: personInfo, setFieldsValue: personSetFieldsValue }] = useForm({
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
      id: 'engineering-mouldRoom-moldDrawingReview-list-upload',
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

  // 第二个表格-操作
  const getAttachmentTableActions = row => {
    return [
      {
        icon: 'icon-ym icon-ym-download',
        auth: 'btn_download',
        tooltip: t('common.downloadText'),
        onClick: handowDownload.bind(null, row.attachmentUrl, row.attachmentName),
      },
      {
        icon: 'icon-ym icon-ym-delete',
        auth: 'btn_edit',
        tooltip: t('dict.ProgressStatusEnum.8'),
        onClick: handleAttachmentDelete.bind(null, row),
      },
    ];
  };

  // 第二个表格-操作-下载
  const handowDownload = (filePath, fileName) => {
    downloadFn(filePath, fileName);
  };

  // 第二个表格-操作-删除
  const handleAttachmentDelete = row => {
    attachmentGridApi.grid.remove(row);
  };

  // 第二个表格上传附件
  function handleUpload() {
    openUpload(true, {
      api: uploadfiles,
    });
  }

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
    //   attachmentGridApi.grid.insertAt(drawingList[i], 0);
    // }
    const newList = [...(drawingList || []), ...attachmentGridApi.getDataSource()];
    attachmentGridApi.grid.loadData(newList);
  }

  function isExist(value: any) {
    return value !== undefined && value !== null && value !== '';
  }

  async function init(dataInfo) {
    detailId.value = '';
    handleType.value = dataInfo.handleType;
    if (dataInfo.handleType === 'add') {
      // 新增
      // setTimeout(() => {
      //   gridApi.grid.insertAt(
      //     {
      //       problemDescription: '',
      //       repairSolution: '',
      //       repairTakeStock: '',
      //       improveJudge: '',
      //     },
      //     -1,
      //   );
      // }, 0);
    } else {
      detailId.value = dataInfo.id;
      // 编辑
      changeLoading(true);
      const { data } = await getRepairmoldDetail(dataInfo.id);
      const { problemImageName, problemImageUrl, productImageUrl, productImageName, attachmentList, problemList } = data;
      // 问题图片
      const problemImage = problemImageUrl
        ? problemImageUrl.split(',').map((item, index) => {
            return {
              url: item,
              name: problemImageName.split(',')[index],
            };
          })
        : [];
      // 产品图片
      const productImage = productImageUrl
        ? productImageUrl.split(',').map((item, index) => {
            return {
              url: item,
              name: productImageName.split(',')[index],
            };
          })
        : [];
      // 基础信息
      basicSetFieldsValue({
        moldNo: data.moldNo,
        oldMoldNo: data.oldMoldNo,
        projectName: data.projectName,
        productName: data.productName,
        pdUserId: data.pdUserId,
        orderDate: data.orderDate,
        successTime: data.successTime,
        targetNumber: data.targetNumber,
        currentNumber: data.currentNumber,
        moldRepairType: data.moldRepairType,
        isMoldFinish: isExist(data.isMoldFinish) && data.isMoldFinish.toString(),
        urgentLevel: isExist(data.urgentLevel) && data.urgentLevel.toString(),
        isModifyDraw: isExist(data.isModifyDraw) && data.isModifyDraw.toString(),
        drawBeforeVersion: data.drawBeforeVersion,
        drawAfterVersion: data.drawAfterVersion,
        estimatedImportTime: data.estimatedImportTime,
        reviewUserId: data.reviewUserId,
        productImage,
        problemImage,
      });
      // 问题描述表格
      // gridApi.grid.reloadData(problemList);
      // 与会人员 Form
      // personSetFieldsValue({
      //   meetPersonIds: data.meetPersonIds ? data.meetPersonIds.split(',') : [],
      //   dqeUserId: data.dqeUserId,
      //   pdLeaderId: data.pdLeaderId,
      //   teLeaderId: data.teLeaderId,
      //   rdLeaderId: data.rdLeaderId,
      //   moldUndertakerId: data.moldUndertakerId,
      // });
      // 附件上传表格
      attachmentGridApi.grid.reloadData(attachmentList);
      changeLoading(false);
    }
  }

  const getPageContent = async () => {
    // 基础信息数据
    const basicInfoValue = await basicInfo();
    // // 第一个表格数据
    // const problemList = gridApi.getDataSource();
    // // 与会人员
    // const personInfoValue = await personInfo();
    // // 第二个表格数据
    const attachmentList = attachmentGridApi.getDataSource();
    return {
      basicInfoValue,
      // problemList,
      // personInfoValue,
      attachmentList,
    };
  };

  const handleSave = async type => {
    // 类型 0=暂存，1=提交.
    const data = await getPageContent();
    if (!data.attachmentList.length) {
      return message.error(t('dict.CommonCol.uploadAttachmentTip'));
    }
    const problemImage = data.basicInfoValue.problemImage;
    const productImage = data.basicInfoValue.productImage;
    const problemImageList = (problemImage && problemImage.length && problemImage.flat(1)) || [];
    const productImageList = (productImage && productImage.length && productImage.flat(1)) || [];
    let params = {
      id: detailId.value,
      type,
      ...data.basicInfoValue,
      orderDate: dayjs(data.basicInfoValue.orderDate).format('YYYY-MM-DD'),
      successTime: dayjs(data.basicInfoValue.successTime).format('YYYY-MM-DD'),
      estimatedImportTime: dayjs(data.basicInfoValue.estimatedImportTime).format('YYYY-MM-DD'),
      // 问题点图片地址
      problemImageUrl: problemImageList.map(item => item.url).join(','),
      // 问题点图片名称
      problemImageName: problemImageList.map(item => item.name).join(','),
      productImageUrl: productImageList.map(item => item.url).join(','),
      productImageName: productImageList.map(item => item.name).join(','),
      // problemList: data.problemList.map(item => {
      //   return {
      //     problemDescription: item.problemDescription,
      //     repairSolution: item.repairSolution,
      //     repairTakeStock: item.repairTakeStock,
      //     improveJudge: item.improveJudge,
      //   };
      // }),
      // ...data.personInfoValue,
      // meetPersonIds: data.personInfoValue.meetPersonIds.join(','),
      attachmentList: data.attachmentList,
    };
    delete params.problemImage;
    delete params.productImage;
    if (handleType.value === 'add') {
      delete params.id;
    }
    changeLoading(true);
    const { code, msg } = await repairmold(params).finally(() => {
      changeLoading(false);
    });
    if (code === 200) {
      createMessage.success(msg);
      emit('reload');
      closePopup();
      return;
    }
    createMessage.error(msg);
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
