<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    @ok="handleSaveAction"
    :showOkBtn="false"
    :cancelButtonProps="{ class: 'mr-12px' }"
    :okText="t('common.submitText')"
    destroyOnClose
    :cancelText="t('common.cancelText')"
    :title="t('routes.purchase-basicInformation-materialReview')"
    class="full-popup top-0">
    <template #centerToolbar>
      <a-button @click="handelReject" ghost type="primary">{{ t('common.rejectText') }} </a-button>
      <a-button @click="handleSaveAction" class="mx-12px" type="primary">{{ t('common.agree') }} </a-button>
    </template>
    <ScrollContainer class="scroll-container">
      <Card>
        <Subtitle :title="t('dict.AttachmentInformation')" style="padding-bottom: 0; margin-bottom: 16px" />
        <div class="files">
          <div class="files-item" v-for="(item, index) in uploadFileList" :key="index">
            <div class="item-list">
              <a class="item-file-name ellipsis mr-10px" @click.stop="handlePreview(item)">{{ item.fileName }}</a>
              <div>
                <a-button type="link" @click="handleDownloadFile(item)">
                  <template #icon>
                    <i class="icon-ym icon-ym-btn-download"></i>
                  </template>
                </a-button>
              </div>
            </div>
          </div>
        </div>
      </Card>
      <Card class="table-card">
        <Grid class="grid-box">
          <template #toolbar-actions>
            <Subtitle :title="t('dict.ReviewInformation')" placement="vxe" />
          </template>
          <template #deliveryTerms="{ row }">
            <div>{{ getDeliveryTermName(row.deliveryTerms) }}</div>
          </template>
          <template #deliveryTermsOriginalCurrency="{ row }">
            <div>{{ getDeliveryTermName(row.deliveryTermsOriginalCurrency) }}</div>
          </template>
          <template #quotationType="{ row }">
            <div>{{ getQuotationTypeName(row.quotationType) }}</div>
          </template>
          <template #purchasingWay="{ row }">
            <div>{{ getPurchaseWayName(row.purchasingWay) }}</div>
          </template>
          <template #priceType="{ row }">
            <div>{{ getPriceTypeName(row.priceType) }}</div>
          </template>
          <template #priceTypeOriginalCurrency="{ row }">
            <div>{{ getPriceTypeName(row.priceTypeOriginalCurrency) }}</div>
          </template>
        </Grid>
      </Card>
    </ScrollContainer>
  </BasicPopup>
  <PreviewModal ref="filePreviewRef" />
  <Revocation @register="registerForm" @rejectSuccess="rejectSuccess" />
</template>
<script setup lang="ts">
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { ref, onMounted } from 'vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { purchasequotationCommit, getPurchasequotationDetail } from '/@/api/finance/materialPrice';
  import { Subtitle } from '/@/components/Subtitle';
  import { ScrollContainer } from '/@/components/Container';
  import { PreviewModal } from '/@/components/Upload';
  import { useModal } from '/@/components/Modal';
  import Revocation from './Revocation.vue';

  import { Card } from 'ant-design-vue';

  import { useI18n } from '/@/hooks/web/useI18n';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { column } from './CONFIG';
  import { downloadByUrl, downloadFile } from '/@/utils/file/download';
  import { useBaseStore } from '/@/store/modules/base';

  defineOptions({
    name: 'AttachmentReviewPopup',
  });

  const emit = defineEmits(['register', 'reload']);

  const { createMessage } = useMessage();
  const { t } = useI18n();
  const baseStore = useBaseStore();
  const uploadFileList = ref<{ fileName: string; filePath: string }[]>([]);
  const id = ref(0);

  const [Grid, gridApi] = useVbenVxeGrid({
    gridOptions: {
      id: 'purchase-basicInformation-materialReview-reviewList',
      columns: column,
      api: getPurchasequotationDetail,
      toolbarConfig: {
        refresh: false,
        zoom: true,
      },
      position: 'modal',
      pagerConfig: {
        autoHidden: false,
      },
      proxyConfig: {
        response: {
          result: 'data.materialPageList.list',
          total: 'data.materialPageList.pagination.Total',
        },
      },
      beforeFetch: params => {
        return {
          ...params,
          id: id.value,
        };
      },
      afterFetch: data => {
        data.fileList.forEach(item => {
          if (!uploadFileList.value.some(value => value.fileName === item.fileName)) {
            const params = {
              fileName: item.fileName,
              filePath: item.filePath,
            };
            uploadFileList.value.push(params);
          }
        });
      },
    },
  });

  const [registerPopup, { closePopup, changeLoading }] = usePopupInner(init);
  const [registerForm, { openModal: openFormModal }] = useModal();

  const filePreviewRef = ref();
  async function handlePreview(item) {
    const version = item.filePath.indexOf('http') > -1 ? 1 : 2; // 文件附带http的话，是旧版地址
    if (version == 1 && item.filePath.indexOf('https') < 0) {
      item.filePath = item.filePath.replace('http', 'https');
    }
    const params = {
      name: item.fileName,
      filePath: item.filePath,
      // previewType: 'localPreview',
      // noCache: false,
      // isCopy: 0,
      version: version,
      resize: true,
    };
    filePreviewRef.value?.init(params);
  }

  function handleDownloadFile(item) {
    // downloadByUrl({ url: item.filePath, fileName: item.fileName });
    downloadFile({ filePath: item.filePath, fileName: item.fileName });
  }

  async function init(data) {
    uploadFileList.value = [];
    id.value = data;
    gridApi.reload();
  }

  function handelReject() {
    const ids = gridApi.getDataSource().map(item => item.id);
    openFormModal(true, { ids });
  }

  function rejectSuccess() {
    closePopup();
    emit('reload');
  }

  function handleSaveAction() {
    changeLoading(true);
    const fileList = uploadFileList.value.map(item => {
      return {
        filePath: item.filePath,
        fileName: item.fileName,
      };
    });
    purchasequotationCommit({
      fileList,
      id: id.value,
    })
      .then(({ code, msg }) => {
        if (code === 200) {
          createMessage.success(msg);
          closePopup();
          emit('reload');
        } else {
          createMessage.error(msg);
        }
      })
      .finally(() => {
        changeLoading(false);
      });
  }

  const getDeliveryTermName = code => {
    return code !== undefined && code !== null ? deliveryTermsList.value.find(item => item.enCode.toString() === code.toString())?.fullName : '';
  };
  const getQuotationTypeName = code => {
    return code !== undefined && code !== null ? quotationTypeList.value.find(item => item.enCode.toString() === code.toString())?.fullName : '';
  };
  const getPurchaseWayName = code => {
    return code !== undefined && code !== null ? purchaseWayList.value.find(item => item.enCode.toString() === code.toString())?.fullName : '';
  };
  const getPriceTypeName = code => {
    return code !== undefined && code !== null ? priceTypeList.value.find(item => item.enCode.toString() === code.toString())?.fullName : '';
  };

  const deliveryTermsList = ref<any>([]);
  const quotationTypeList = ref<any>([]);
  const purchaseWayList = ref<any>([]);
  const priceTypeList = ref<any>([]);
  onMounted(async () => {
    deliveryTermsList.value = await baseStore.getDictionaryData('PurchaseQuotation.DeliveryTerms');
    quotationTypeList.value = await baseStore.getDictionaryData('PurchaseQuotation.QuotationType');
    purchaseWayList.value = await baseStore.getDictionaryData('PurchaseQuotation.PurchaseWay');
    priceTypeList.value = await baseStore.getDictionaryData('PurchaseQuotation.PriceType');
  });
</script>
<style lang="less" scoped>
  .scroll-container {
    height: 100%;
    background: #ebeef5;

    ::v-deep(.scrollbar__view) {
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    .files {
      display: flex;
      flex-wrap: wrap;

      .files-item {
        width: 33%;
        margin-top: 4px;

        .item-list {
          display: flex;
          align-items: center;

          a {
            // 省略号
            width: 80%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
      }
    }

    .table-card {
      flex: 1;
      display: flex;
      flex-direction: column;

      ::v-deep(.ant-card-body) {
        height: 100%;
        display: flex;
        flex-direction: column;
      }

      .grid-box {
        flex: 1;
      }
    }

    .ant-card {
      border-radius: 0;
    }
  }

  :deep(.scroll-container div.ant-card-body) {
    padding: 16px;
  }
</style>
