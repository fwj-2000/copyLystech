<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    @ok="handleSaveAction"
    :showOkBtn="false"
    :title="t('routes.purchase-basicInformation-materialPrice')"
    destroyOnClose
    class="full-popup top-0">
    <template #centerToolbar>
      <a-space :size="10">
        <a-upload v-feature :multiple="true" name="file" :show-upload-list="false" :beforeUpload="beforeUpload">
          <a-button class="mt-1px" :loading="uploadLoading">{{ t('dict.PurchaseQuotationColumn.UploadAttachment') }}</a-button>
        </a-upload>
        <a-button @click="handleSaveAction" v-auth="'btn_detail'" type="primary">{{ t('common.submitText') }} </a-button>
      </a-space>
    </template>
    <ScrollContainer class="scroll-container">
      <Card>
        <Subtitle :title="t('dict.AttachmentInformation')" style="padding-bottom: 0; margin-bottom: 16px" />
        <div class="files">
          <div class="files-item" v-for="(item, index) in uploadFileList" :key="index">
            <div class="item-list">
              <a :title="item.fileName" class="item-file-name ellipsis mr-10px" @click.stop="handlePreview(item)">{{ item.fileName }}</a>
              <div>
                <a-button type="link" @click="handleDownloadFile(item)">
                  <template #icon>
                    <i class="icon-ym icon-ym-btn-download"></i>
                  </template>
                </a-button>
                <a-button type="link" @click="handleDeleteFile(index)">
                  <template #icon>
                    <i class="icon-ym icon-ym-delete"></i>
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
            <Subtitle :title="t('common.priceInformation')" placement="vxe" />
          </template>
        </Grid>
      </Card>
    </ScrollContainer>
  </BasicPopup>
  <PreviewModal ref="filePreviewRef" />
</template>
<script setup lang="ts">
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { ref } from 'vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { uploadfiles } from '/@/api/basic/common';
  import { purchasequotationCommit, getPurchasequotationDetail, downloadfile } from '/@/api/finance/materialPrice';
  import { Subtitle } from '/@/components/Subtitle';
  import { ScrollContainer } from '/@/components/Container';
  import { PreviewModal } from '/@/components/Upload';
  import { useBaseStore } from '/@/store/modules/base';
  import { cloneDeep, debounce } from 'lodash-es';

  import { Card } from 'ant-design-vue';

  import { useI18n } from '/@/hooks/web/useI18n';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { column } from './CONFIG';
  import { downloadByUrl } from '/@/utils/file/download';
  import { useGlobSetting } from '/@/hooks/setting';

  const baseStore = useBaseStore();

  defineOptions({
    name: 'AttachmentReviewPopup',
  });

  const emit = defineEmits(['register', 'reload']);

  const { createMessage } = useMessage();
  const { t } = useI18n();
  const globSetting = useGlobSetting();
  const [Grid, gridApi] = useVbenVxeGrid({
    gridOptions: {
      id: 'purchase-basicInformation-materialPrice-list-batch',
      columns: column,
      // api: getPurchasequotationDetail,
      api: getTableData,
      toolbarConfig: {
        refresh: false,
        zoom: true,
      },
      pagerConfig: {
        autoHidden: false,
      },
      proxyConfig: {
        autoLoad: false,
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
      position: 'modal',
    },
  });

  function formatOps() {
    const deliveryTerms = baseStore.getDictionaryData('PurchaseQuotation.DeliveryTerms');
    const PurchaseWay = baseStore.getDictionaryData('PurchaseQuotation.PurchaseWay');
    const QuotationType = baseStore.getDictionaryData('PurchaseQuotation.QuotationType');
    // PurchaseQuotation.QuotationType
    // const level = baseStore.getDictionaryData('ECN.ChangeLevel');
    // const docType = baseStore.getDictionaryData('EngineeringDocApply.DocType', true);
    return [deliveryTerms, PurchaseWay, QuotationType];
  }

  function formatItem(item, deliveryTermsOptions, purchaseWay, quotationTypeOptions) {
    const deliveryTerms = item.deliveryTerms;
    const deliveryTermsOriginalCurrency = item.deliveryTermsOriginalCurrency;
    const purchasingWay = item.purchasingWay;
    const quotationType = item.quotationType;
    // quotationType

    item.deliveryTerms = deliveryTermsOptions.find(val => val.enCode == deliveryTerms)?.fullName;
    item.deliveryTermsOriginalCurrency = deliveryTermsOptions.find(val => val.enCode == deliveryTermsOriginalCurrency)?.fullName;
    item.purchasingWay = purchaseWay.find(val => val.enCode == purchasingWay)?.fullName;
    item.quotationType = quotationTypeOptions.find(val => val.enCode == quotationType)?.fullName;
    return item;
  }

  async function getTableData({ currentPage = 1, pageSize = 10, id }) {
    changeLoading(true);
    gridApi.setLoading(false);
    return getPurchasequotationDetail({
      pageSize,
      currentPage,
      id,
    })
      .then(async ({ data }) => {
        const [deliveryTerms, PurchaseWay, QuotationType] = await Promise.all(formatOps());
        const {
          materialPageList: { list },
        } = data;
        // 将list.list数据展开处理，--> 节点Code.列名
        const formatList = list.map(item => {
          console.log('🚀 ~  ~ originitem: ', item);
          const target = {
            ...formatItem(cloneDeep(item), deliveryTerms, PurchaseWay, QuotationType),
            applyCode: data.applyCode,
            tariff: item.tariff ? item.tariff * 100 + '%' : null,
            reservedBuffer: item.reservedBuffer ? item.reservedBuffer * 100 + '%' : null,
            usdRmbGap: item.usdRmbGap ? (item.usdRmbGap * 100).toFixed(2) + '%' : null,
            proportionOfPriceReduction: item.proportionOfPriceReduction ? (item.proportionOfPriceReduction * 100).toFixed(2) + '%' : null,
            gap1: item.gap1 ? item.gap1.toFixed(2) + '%' : null,
            gap2: item.gap2 ? item.gap2.toFixed(2) + '%' : null,
            priceType: item.priceType ? (item.priceType == 1 ? t('dict.PurchaseQuotation.PriceType.1') : t('dict.PurchaseQuotation.PriceType.2')) : null,
            priceTypeOriginalCurrency: item.priceTypeOriginalCurrency
              ? item.priceTypeOriginalCurrency == 1
                ? t('dict.PurchaseQuotation.PriceType.1')
                : t('dict.PurchaseQuotation.PriceType.2')
              : null,
          };
          delete target.ecrList;
          delete target.list;
          return target;
        });
        changeLoading(false);
        return {
          data: {
            list: formatList,
            fileList: data.fileList,
            pagination: {
              total: data.materialPageList.pagination.Total,
            },
          },
        };
      })
      .finally(() => {
        changeLoading(false);
      });
  }

  const [registerPopup, { closePopup, changeLoading }] = usePopupInner(init);
  const uploadFileList = ref<{ fileName: string; filePath: string }[]>([]);
  const id = ref(0);

  const filePreviewRef = ref<any | null>(null);
  async function handlePreview(item) {
    const params = {
      name: item.fileName,
      filePath: item.filePath,
      previewType: 'localPreview',
      version: 2,
    };
    filePreviewRef.value?.init(params);
  }

  async function handleDownloadFile(item) {
    const { filePath, fileName } = item;
    window.open(`${globSetting.apiUrl}/api/Information/fileinfo/downloadfile?filePath=${filePath}&fileName=${fileName}`);
  }

  function handleDeleteFile(index) {
    uploadFileList.value.splice(index, 1);
  }

  async function init(data) {
    uploadFileList.value = [];
    id.value = data.id;
    gridApi.reload();
  }

  /** 上传文件 防抖; 防止上传多个文件时，直接调用`beforeUpload`，重复上传 */
  const debounceBeforeUpload = debounce(upload, 20);

  function beforeUpload(file: File, fileList: File[]) {
    debounceBeforeUpload(file, fileList);
    return false;
  }

  const uploadLoading = ref(false);
  function upload(_, fileList) {
    const waitList: any[] = [];
    fileList.forEach(item => {
      if (!uploadFileList.value.some(value => value.fileName === item.name)) {
        const params = {
          fileList: item,
        };
        waitList.push(uploadfiles(params));
      }
    });
    uploadLoading.value = true;
    Promise.all(waitList)
      .then(res => {
        res.forEach(item => {
          item.data.forEach(data_item => {
            uploadFileList.value.push({
              filePath: data_item.fullPath,
              fileName: data_item.originFileName,
            });
          });
        });
      })
      .finally(() => {
        uploadLoading.value = false;
      });

    return false;
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
