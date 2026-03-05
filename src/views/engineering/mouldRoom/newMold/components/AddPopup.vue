<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    @ok="handleSaveAction(2)"
    destroyOnClose
    :showOkBtn="false"
    :cancelText="t('common.cancel')"
    :title="handleTyle === 'add' ? t('common.add2Text') : t('common.editText')"
    class="full-popup pb-10px top-0">
    <template #appendToolbar>
      <a-button v-auth="'btn_edit'" class="ml-10px" type="primary" ghost @click="handleSaveAction(0)">{{ t('common.draft') }}</a-button>
      <a-button v-auth="'btn_edit'" type="primary" class="mx-12px" @click="handleSaveAction(1)">{{ t('common.submit') }}</a-button>
    </template>
    <ScrollContainer>
      <!-- 基础信息 -->
      <a-card class="lydc-content-wrapper-search-box p-12px mb-16px" style="border-bottom: 1px solid #dbdbdb">
        <div class="title-stick">
          <div class="gun"></div>
          <div class="title">{{ t('common.baseinfo') }}</div>
        </div>
        <BasicForm @register="registerBasicInfoForm"> </BasicForm>
      </a-card>

      <!-- DFM附件上传 -->
      <a-card class="lydc-content-wrapper-search-box p-12px mb-16px" style="border-bottom: 1px solid #dbdbdb">
        <div class="upload-file-title">
          <div class="title-stick">
            <div class="gun"></div>
            <div class="title">{{ t('dict.NewMoldColumn.DFMAttachment') }}</div>
          </div>
          <a-button v-auth="'btn_edit'" class="ml-12px" type="primary" ghost @click="handleDFMUpload">{{
            t('dict.DrawingsReviewColumn.attachmentUpload')
          }}</a-button>
        </div>
        <DFMGrid style="height: auto">
          <template #Status="{ row, $rowIndex }">
            <a-switch v-model:checked="row.enabledStatus" :disabled="row.enabledStatus === true" @change="statusChange($event, row, $rowIndex)" />
          </template>
          <!-- DFM原件 -->
          <template #AttachmentName="{ row }">
            <div class="table-a" @click="handlePreview(row.attachmentUrl, row.attachmentName)">{{ row.attachmentName }}</div>
          </template>
          <!-- DFM客户回复件 -->
          <template #DfmDeliveryAttaName="{ row }">
            <div class="table-a" @click="handlePreview(row.dfmDeliveryAttaUrl, row.dfmDeliveryAttaName)">{{ row.dfmDeliveryAttaName }}</div>
          </template>
          <template #action="{ row }">
            <TableAction outside :actions="getDFMTableActions(row)" />
          </template>
        </DFMGrid>
      </a-card>

      <!-- 客户图纸上传 -->
      <a-card class="lydc-content-wrapper-search-box p-12px mb-16px" style="border-bottom: 1px solid #dbdbdb">
        <div class="upload-file-title">
          <div class="title-stick">
            <div class="gun"></div>
            <div class="title">{{ t('dict.PartNumberApplyDrawingsType.CustomerDrawings') }}</div>
          </div>
          <a-button v-auth="'btn_edit'" class="ml-12px" type="primary" ghost @click="handleUpload('customer')">{{
            t('dict.DrawingsReviewColumn.attachmentUpload')
          }}</a-button>
        </div>
        <CustomerGrid style="height: auto">
          <template #AttachmentName="{ row }">
            <div class="table-a" @click="handlePreview(row.attachmentUrl, row.attachmentName)">{{ row.attachmentName }}</div>
          </template>
          <template #action="{ row }">
            <TableAction outside :actions="getTableActions(row, 'CustomerGrid')" />
          </template>
        </CustomerGrid>
      </a-card>

      <!-- 报价单附件上传 -->
      <a-card class="lydc-content-wrapper-search-box p-12px mb-16px" style="border-bottom: 1px solid #dbdbdb">
        <div class="upload-file-title">
          <div class="title-stick">
            <div class="gun"></div>
            <div class="title">{{ t('dict.NewMoldColumn.quotationAttachment') }}</div>
          </div>
          <a-button v-auth="'btn_edit'" class="ml-12px" type="primary" ghost @click="handleUpload('quotation')">{{
            t('dict.DrawingsReviewColumn.attachmentUpload')
          }}</a-button>
        </div>
        <QuotationGrid style="height: auto">
          <template #AttachmentName="{ row }">
            <div class="table-a" @click="handlePreview(row.attachmentUrl, row.attachmentName)">{{ row.attachmentName }}</div>
          </template>
          <template #action="{ row }">
            <TableAction outside :actions="getTableActions(row, 'QuotationGrid')" />
          </template>
        </QuotationGrid>
      </a-card>

      <!-- 模流分析附件上传 -->
      <a-card class="lydc-content-wrapper-search-box p-12px mb-16px" style="border-bottom: 1px solid #dbdbdb">
        <div class="upload-file-title">
          <div class="title-stick">
            <div class="gun"></div>
            <div class="title">{{ t('dict.ESIFileType.7') }}</div>
          </div>
          <a-button v-auth="'btn_edit'" class="ml-12px" type="primary" ghost @click="handleUpload('moldFlow')">{{
            t('dict.DrawingsReviewColumn.attachmentUpload')
          }}</a-button>
        </div>
        <MoldFlowGrid style="height: auto">
          <template #AttachmentName="{ row }">
            <div class="table-a" @click="handlePreview(row.attachmentUrl, row.attachmentName)">{{ row.attachmentName }}</div>
          </template>
          <template #action="{ row }">
            <TableAction outside :actions="getTableActions(row, 'MoldFlowGrid')" />
          </template>
        </MoldFlowGrid>
      </a-card>
    </ScrollContainer>
  </BasicPopup>
  <PreviewModal ref="filePreviewRef" />
  <UploadModal @register="registerUpload" @get-table="getDrawingList" :title="uploadModalTitleFn()" :single="true" />
  <UploadModals
    @register="registerDFMUpload"
    @get-table="getDFMDrawingList"
    :title1="t('dict.NewMoldColumn.DFMPart')"
    :title2="t('dict.NewMoldColumn.DFMCustomerReply')"
    :single="true" />
</template>
<script lang="ts" setup>
  import { reactive, ref } from 'vue';
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
  import { uploadProgramCode, newmold, newmoldDetail } from '/@/api/engineering/mould';
  import UploadModal from '/@/views/engineering/mouldRoom/components/UploadModal.vue';
  import UploadModals from '/@/views/engineering/mouldRoom/components/UploadModals.vue';
  import { TableAction } from '/@/components/Table';
  import { detailFormSchemas, getGridColumn } from '../config';
  import { PreviewModal } from '/@/components/Upload';
  import dayjs from 'dayjs';
  import { downloadFn } from '../util';
  import { buildUUID } from '/@/utils/uuid';
  import { message } from 'ant-design-vue';

  const { t } = useI18n();
  const { hasBtnP } = usePermission();
  const emit = defineEmits(['reload', 'register']);

  const userStore = useUserStore();
  const userInfo = userStore.getUserInfo;
  const { createMessage } = useMessage();

  const [registerUpload, { openModal: openUpload }] = useModal();
  const [registerDFMUpload, { openModal: openDFMUpload }] = useModal();

  const uploadModalType = ref('');
  const filePreviewRef = ref<any | null>(null);

  const [registerBasicInfoForm, { setFieldsValue, validateFields, updateSchema }] = useForm({
    schemas: detailFormSchemas,
    layout: 'vertical',
    labelWidth: 220,
    baseColProps: {
      span: 6,
    },
    i18nConfig: {
      moduleCode: 'NewMoldColumn',
      transferRange: ['placeholder', 'label'],
    },
  });

  const state: any = reactive({
    title: t('dict.PartNumberApplyColumn.singApple'),
    InsideProjectCodeOption: [],
    shipPattern: [],
    fileList: [],
    imgList: [],
    ImmediateCustomerCodeOption: [],
    mainProcess: '',
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

  const uploadModalTitleFn = () => {
    switch (uploadModalType.value) {
      case 'customer':
        return t('dict.PartNumberApplyDrawingsType.CustomerDrawings');
      case 'quotation':
        return t('dict.NewMoldColumn.quotationAttachment');
      case 'moldFlow':
        return t('dict.ESIFileType.7');
      default:
        return;
    }
  };

  // DFM附件
  const [DFMGrid, DFMGridApi] = useVbenVxeGrid({
    gridOptions: {
      id: 'engineering-mouldRoom-newMold-list-uploadDFM',
      columns: getGridColumn('DFMGrid'),
      pagerConfig: {
        autoHidden: true,
      },
      toolbarConfig: {
        enabled: false,
      },
      rowConfig: {
        keyField: 'uuid',
      },
      i18nConfig: {
        moduleCode: 'NewMoldColumn',
      },
    },
  });

  const addDFMFile = (dfmAttaList, dfmDeliveryAttaList) => {
    DFMGridApi.getDataSource().forEach(item => {
      item.enabledStatus = false;
    });
    const listItem = {
      attachmentUrl: dfmAttaList[0] && dfmAttaList[0].fullPath,
      attachmentName: dfmAttaList[0] && dfmAttaList[0].originFileName,
      attachmentSize: dfmAttaList[0] && dfmAttaList[0].fileSize,
      dfmDeliveryAttaUrl: dfmDeliveryAttaList[0] && dfmDeliveryAttaList[0].fullPath,
      dfmDeliveryAttaName: dfmDeliveryAttaList[0] && dfmDeliveryAttaList[0].originFileName,
      dfmDeliveryAttaSize: dfmDeliveryAttaList[0] && dfmDeliveryAttaList[0].fileSize,
      uploadUserName: userInfo.userName,
      uploadUserId: userInfo.userId,
      uploadTime: Date.now(),
      enabledStatus: true,
      uuid: buildUUID(),
    };
    const newList = DFMGridApi.getDataSource();
    newList.unshift(listItem);
    DFMGridApi.grid.loadData(newList);
  };

  const updateDFMFile = (dfmAttaList, dfmDeliveryAttaList) => {
    const currentDFM = DFMGridApi.getDataSource().find(item => item.uuid === DFMuuid.value);
    const dfmAttaFile = dfmAttaList[0];
    const dfmDeliveryAttaFile = dfmDeliveryAttaList[0];
    let newItem = {};
    if (dfmAttaList.length && !dfmDeliveryAttaList.length) {
      // 更新DFM原件
      newItem = {
        ...currentDFM,
        attachmentUrl: dfmAttaFile.fullPath,
        attachmentName: dfmAttaFile.originFileName,
        attachmentSize: dfmAttaFile.fileSize,
      };
    }
    if (!dfmAttaList.length && dfmDeliveryAttaList.length) {
      // 更新DFM客户原附件
      newItem = {
        ...currentDFM,
        dfmDeliveryAttaUrl: dfmDeliveryAttaFile.fullPath,
        dfmDeliveryAttaName: dfmDeliveryAttaFile.originFileName,
        dfmDeliveryAttaSize: dfmDeliveryAttaFile.fileSize,
      };
    }
    if (dfmAttaList.length && dfmDeliveryAttaList.length) {
      // 更新DFM原件和DFM客户原附件
      newItem = {
        ...currentDFM,
        attachmentUrl: dfmAttaFile.fullPath,
        attachmentName: dfmAttaFile.originFileName,
        attachmentSize: dfmAttaFile.fileSize,
        dfmDeliveryAttaUrl: dfmDeliveryAttaFile.fullPath,
        dfmDeliveryAttaName: dfmDeliveryAttaFile.originFileName,
        dfmDeliveryAttaSize: dfmDeliveryAttaFile.fileSize,
      };
    }
    const newList = DFMGridApi.getDataSource().map(item => (item.uuid === DFMuuid.value ? newItem : item));
    DFMGridApi.grid.loadData(newList);
  };

  const getDFMDrawingList = (dfmAttaList, dfmDeliveryAttaList) => {
    if (DFMuuid.value) {
      if (!dfmAttaList.length && !dfmDeliveryAttaList.length) return;
      // 上传某行的附件
      updateDFMFile(dfmAttaList, dfmDeliveryAttaList);
    } else {
      // 新增DFM附件
      addDFMFile(dfmAttaList, dfmDeliveryAttaList);
    }
  };

  // 客户图纸
  const [CustomerGrid, CustomerGridApi] = useVbenVxeGrid({
    gridOptions: {
      id: 'engineering-mouldRoom-newMold-list-uploadCustomer',
      columns: getGridColumn('CustomerGrid'),
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
        moduleCode: 'NewMoldColumn',
      },
    },
  });

  // 报价单附件
  const [QuotationGrid, QuotationGridApi] = useVbenVxeGrid({
    gridOptions: {
      id: 'engineering-mouldRoom-newMold-list-uploadQuotation',
      columns: getGridColumn('QuotationGrid'),
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
        moduleCode: 'NewMoldColumn',
      },
    },
  });

  // 模流分析
  const [MoldFlowGrid, MoldFlowGridApi] = useVbenVxeGrid({
    gridOptions: {
      id: 'engineering-mouldRoom-newMold-list-uploadMoldFlow',
      columns: getGridColumn('MoldFlow'),
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
        moduleCode: 'NewMoldColumn',
      },
    },
  });

  function getDrawingList(list) {
    const drawingList = list.map(item => {
      return {
        attachmentName: item.originFileName,
        attachmentSize: item.fileSize,
        attachmentUrl: item.fullPath,
        uploadUserName: userInfo.userName,
        uploadUserId: userInfo.userId,
        uploadTime: Date.now(),
      };
    });

    switch (uploadModalType.value) {
      case 'customer': {
        const newCustomerList = [...(drawingList || []), ...CustomerGridApi.getDataSource()];
        CustomerGridApi.grid.loadData(newCustomerList);
        return;
      }

      case 'quotation': {
        const newQuotationList = [...(drawingList || []), ...QuotationGridApi.getDataSource()];
        QuotationGridApi.grid.loadData(newQuotationList);
        return;
      }

      case 'moldFlow': {
        const newMoldFlowList = [...(drawingList || []), ...MoldFlowGridApi.getDataSource()];
        MoldFlowGridApi.grid.loadData(newMoldFlowList);
        return;
      }

      default:
        return;
    }
  }

  const statusChange = (e, row, currentIndex) => {
    DFMGridApi.getDataSource().forEach((item, index) => {
      if (currentIndex !== index) {
        item.enabledStatus = false;
      }
    });
  };

  const [registerPopup, { closePopup, changeLoading }] = usePopupInner(init);

  function getDFMTableActions(row) {
    return [
      {
        icon: 'icon-ym icon-ym-delete',
        tooltip: t('common.delText'),
        auth: 'btn_edit',
        onClick: handleDelete.bind(null, row, 'DFMGrid'),
      },
      {
        icon: 'icon-ym icon-ym-download',
        auth: 'btn_download',
        tooltip: t('dict.NewMoldColumn.originalDownload'),
        onClick: handleDFMDownload.bind(null, row.attachmentUrl, row.attachmentName),
      },
      {
        icon: 'icon-ym icon-ym-download',
        auth: 'btn_download',
        tooltip: t('dict.NewMoldColumn.downloadCustomerReply'),
        onClick: handleDFMDownload.bind(null, row.dfmDeliveryAttaUrl, row.dfmDeliveryAttaName),
      },
    ];
  }

  function getTableActions(row, type) {
    return [
      {
        icon: 'icon-ym icon-ym-delete',
        tooltip: t('common.delText'),
        auth: 'btn_edit',
        onClick: handleDelete.bind(null, row, type),
      },
      {
        icon: 'icon-ym icon-ym-download',
        auth: 'btn_download',
        tooltip: t('common.downloadText'),
        onClick: handleDownload.bind(null, row),
      },
    ];
  }

  const handleDelete = (row, type) => {
    switch (type) {
      case 'DFMGrid':
        DFMGridApi.grid.remove(row);
        return;
      case 'CustomerGrid':
        CustomerGridApi.grid.remove(row);
        return;
      case 'QuotationGrid':
        QuotationGridApi.grid.remove(row);
        return;
      case 'MoldFlowGrid':
        MoldFlowGridApi.grid.remove(row);
        return;
      default:
        return;
    }
  };

  const handleDFMDownload = (filePath, fileName) => {
    downloadFn(filePath, fileName);
  };

  const handleDownload = row => {
    const { attachmentName, attachmentUrl } = row;
    downloadFn(attachmentUrl, attachmentName);
  };

  const DFMuuid = ref('');
  const handleDFMUpload = () => {
    const rows = DFMGridApi.getSelectRowKeys();
    if (rows.length > 1) return message.warning(t('dict.NewMoldColumn.selectOneItemTip'));
    if (rows.length) {
      DFMuuid.value = rows[0];
    } else {
      DFMuuid.value = '';
    }
    openDFMUpload(true, {
      Id: state.id,
      api: uploadProgramCode,
    });
  };

  function handleUpload(type: string) {
    uploadModalType.value = type;
    openUpload(true, {
      api: uploadfiles,
    });
  }

  const detailId = ref('');
  const handleTyle = ref('');

  function isExist(value: any) {
    return value !== undefined && value !== null && value !== '';
  }
  async function init(info) {
    handleTyle.value = info.type;
    updateSchema([
      {
        field: 'moldType',
        componentProps: {
          onChange: async value => {
            // 新模默认为V0
            setFieldsValue({ version: value === '1' ? 'V0' : '' });
          },
        },
      },
    ]);
    if (info.type === 'add') {
      // 新增
      detailId.value = '';
    } else {
      detailId.value = info.id;
      changeLoading(true);
      const { data } = await newmoldDetail(info.id);
      changeLoading(false);
      const {
        moldType,
        factoryMoldNo,
        moldNo,
        projectName,
        productName,
        pdUserId,
        orderDate,
        successTime,
        isModifyDraw,
        urgentLevel,
        factoryArea,
        t0DeliveryDate,
        outsourceOrInternally,
        remark,
        dfmAttaList,
        customerDrawAttaList,
        quotationAttatList,
        mfaAttaList,
        version,
      } = data;
      setFieldsValue({
        moldType: isExist(moldType) && String(moldType),
        factoryMoldNo,
        moldNo,
        projectName,
        productName,
        pdUserId,
        orderDate,
        successTime,
        isModifyDraw: isExist(isModifyDraw) && String(isModifyDraw),
        urgentLevel: isExist(urgentLevel) && String(urgentLevel),
        factoryArea,
        t0DeliveryDate,
        outsourceOrInternally,
        remark,
        version,
      });
      DFMGridApi.grid.reloadData(
        dfmAttaList.map(item => {
          return {
            ...item,
            uuid: buildUUID(),
            enabledStatus: item.enabledStatus === 1,
          };
        }),
      );
      CustomerGridApi.grid.reloadData(customerDrawAttaList);
      QuotationGridApi.grid.reloadData(quotationAttatList);
      MoldFlowGridApi.grid.reloadData(mfaAttaList);
    }
  }

  const handleSaveAction = async type => {
    const values = await validateFields();
    const dfmAttaList = DFMGridApi.getDataSource().map(item => {
      return {
        ...item,
        enabledStatus: item.enabledStatus ? 1 : 2,
      };
    });
    const customerDrawAttaList = CustomerGridApi.getDataSource();
    const quotationAttatList = QuotationGridApi.getDataSource();
    const mfaAttaList = MoldFlowGridApi.getDataSource();
    const params = {
      id: detailId.value,
      ...values,
      isModifyDraw: isExist(values.isModifyDraw) ? values.isModifyDraw : '1',
      t0DeliveryDate: dayjs(values.t0DeliveryDate).format('YYYY-MM-DD'),
      dfmAttaList,
      customerDrawAttaList,
      quotationAttatList,
      mfaAttaList,
      type,
    };
    changeLoading(true);
    const { code, msg } = await newmold(params).finally(() => {
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
