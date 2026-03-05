<template>
  <Subtitle class="subtitle" :title="t('common.metariaInfo')" />
  <BasicInfo
    layout="vertical"
    :columns="3"
    :config="props.source.isCustomerRefers == 1 ? referMaterailCols : materailCols"
    :i18nConfig="{ moduleCode: 'MaterialDevelopApplyColumn' }"
    :data-source="props.source"></BasicInfo>
  <!-- <Subtitle class="subtitle" :title="t('common.projectInfo')" />
  <BasicInfo
    layout="vertical"
    :columns="3"
    :config="projectCols"
    :data-source="props.source"
    :i18nConfig="{ moduleCode: 'MaterialDevelopApplyColumn' }"></BasicInfo> -->
  <Subtitle class="subtitle" :title="t('common.attachment')" />
  <div class="grid grid-cols-5 gap-4" v-if="props.source.fileJson && props.source.fileJson.length > 0">
    <div v-for="(item, index) in props.source.fileJson" :key="index" class="item-list">
      <div class="flex items-center">
        <a @click.stop="handlePreview(item)" class="item-file-name ellipsis mr-2 truncate">{{ item.fileName }}</a>
        <div class="flex space-x-0.5 flex-shrink-0">
          <a-button type="link" @click="handleDownloadImg(item)">
            <template #icon>
              <i class="icon-ym icon-ym-btn-download"></i>
            </template>
          </a-button>
        </div>
      </div>
    </div>
  </div>
  <div class="no-attachment" v-else>
    {{ t('common.noAttachment') }}
  </div>

  <Subtitle class="subtitle" :title="t('common.baseinfo')" />
  <BasicInfo
    layout="vertical"
    :columns="3"
    :config="baseCols"
    :data-source="props.source"
    :i18nConfig="{ moduleCode: 'MaterialDevelopApplyColumn' }"></BasicInfo>

  <PreviewModal ref="filePreviewRef" />
</template>
<script lang="ts" setup>
  import { BasicInfo } from '/@/components/CustomComponents';
  import { Subtitle } from '/@/components/Subtitle';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { ref } from 'vue';
  import { PreviewModal } from '/@/components/Upload';
  import { downloadFile } from '/@/utils/file/download';

  const { t } = useI18n();
  const filePreviewRef = ref<InstanceType<typeof PreviewModal> | null>(null);

  const props = defineProps({
    source: {
      type: Object,
      default: () => {
        return {};
      },
    },
  });

  // 下载附件
  function handleDownloadImg(item) {
    downloadFile({ url: item.filePath, target: '_blank', fileName: item.fileName });
  }

  // 预览附件
  function handlePreview(item) {
    const params = {
      name: item.fileName,
      url: item.filePath,
      previewType: 'localPreview',
      noCache: false,
      isCopy: 0,
      version: 2,
    };
    filePreviewRef.value?.init(params);
  }

  const baseCols = [
    { title: '产品内部料号', dataIndex: 'insidePartNumber' },
    { title: '旧版成品编码', dataIndex: 'insideNumberOld' },
    { title: '终端项目代码', dataIndex: 'terminalProject' },
    { title: '工厂', dataIndex: 'factoryName' },
    { title: '申请规格', dataIndex: 'applySpec' },
    { title: '要求交期', dataIndex: 'deliveryDate', format: 'date|YYYY-MM-DD' },
    { title: '终端客户信息', dataIndex: 'terminalCustomerName' },
    { title: '产品线', dataIndex: 'productLineCode' },
    { title: '产品类型', dataIndex: 'productTypeName' },
    { title: '项目现阶段', dataIndex: 'projectStage' },
    { title: '是否NUD', dataIndex: 'isNUDDesc' },
    { title: '预估项目总量(W)', dataIndex: 'estimateTotal' },
    { title: '预计量产月份', dataIndex: 'estimateProductionDateTime', format: 'date|YYYY-MM' },
    { title: '产品长度(MM)', dataIndex: 'productSizeLong' },
    { title: '产品宽度(MM)', dataIndex: 'productSizeWide' },
    { title: '用量(M2/KPCS)', dataIndex: 'consumption' },
    { title: '预估总面积(M2)', dataIndex: 'productArea' },
    { title: 'PD经理', dataIndex: 'pdManagerName' },
    { title: '技术中心', dataIndex: 'technologyName' },
    { title: '开发采购', dataIndex: 'purchaseUserName' },
    { title: '申请人', dataIndex: 'applyUserName' },
    { title: '申请时间', dataIndex: 'applyDateTime' },
    { title: '备注', dataIndex: 'remarks', baseCols: { cols: 24 } },
  ];
  const materailCols = [
    { title: '开发原因', dataIndex: 'developmentReason', baseCols: { cols: 24 } },
    { title: '开发类型', dataIndex: 'developmentType' },
    { title: '材料归属', dataIndex: 'materialAreaName' },
    { title: '材料类型', dataIndex: 'materialClassName' },
    { title: '被替/备选料号', dataIndex: 'alternativeMaterialNumber' },
    { title: '用途', dataIndex: 'purposeType' },
    { title: '应用场景', dataIndex: 'applicationScenarios' },
    { title: '基材厚度(MM)', dataIndex: 'materialThickness' },
    { title: '总厚度(MM)', dataIndex: 'materialThicknessTotal' },
    { title: '颜色', dataIndex: 'colour' },
    { title: '基材类型', dataIndex: 'materialQualityName' },
    { title: '结构组成', dataIndex: 'singleDoubleLayer' },
    { title: '涂层类型', dataIndex: 'coatingType' },
    { title: '抗静电功能', dataIndex: 'resistStaticElectricityType' },
    { title: '抗静电值', dataIndex: 'resistStaticElectricity', baseCols: { cols: 16 } },
    { title: '克重(G)', dataIndex: 'gram' },
    { title: '被贴物/材料', dataIndex: 'beingPostedMaterial' },
    { title: '残粘要求', dataIndex: 'residualAdhesionRate' },
    { title: '实配要求', dataIndex: 'realMatchRange', baseCols: { cols: 24 } },
    { title: '实配测试方法', dataIndex: 'realMatchTest', baseCols: { cols: 24 } },
    { title: '其他要求', dataIndex: 'otherRequirements', baseCols: { cols: 24 } },
    { title: '材料描述', dataIndex: 'materialDesc', baseCols: { cols: 24 } },
  ];
  const referMaterailCols = [
    { title: '原厂商型号', dataIndex: 'materialModelNumber' },
    { title: '其他要求', dataIndex: 'otherRequirements' },
  ];
</script>
<style lang="less" scoped>
  .subtitle {
    padding-bottom: 5px;
    margin-top: 15px;

    &:first-child {
      margin-top: 0;
    }
  }

  .item-list {
    padding: 5px 0;
  }

  .item-file-name {
    color: #1890ff;
    text-decoration: none;
    max-width: 200px;

    &:hover {
      text-decoration: underline;
      cursor: pointer;
    }
  }

  .no-attachment {
    color: #666;
    font-size: 14px;
    padding: 5px 0;
  }
</style>
