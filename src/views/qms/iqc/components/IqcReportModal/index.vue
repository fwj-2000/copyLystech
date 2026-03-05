<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    :title="t('common.testReport')"
    :draggable="true"
    showOkBtn
    @ok="handleSubmit"
    :width="1000"
    :okText="t('common.exportText')">
    <div ref="printRef" class="report-block">
      <ScrollContainer class="h-full">
        <Subtitle :title="t('common.baseinfo')" />
        <BasicInfo
          :columns="3"
          :config="BASICINFOCOLS"
          :data-source="state.basicData"
          :i18nConfig="{ moduleCode: 'IQCApplyColumn' }"
          class="pl-10px"></BasicInfo>
        <div>
          <DynamicTable ref="inspectioninfoRef" moduleCode="IQCApplyColumn" />
        </div>
        <Subtitle :title="t('common.packagingInspection')" v-if="!isEmpty(state.packageData)" />
        <Descriptions v-bind="descOptions" v-if="!isEmpty(state.packageData)">
          <Descriptions.Item v-for="item in PACKINFOCOLS" :label="item.title" :key="item.dataIndex">
            <div v-if="state.packageData">
              <div v-if="item.dataIndex === 'attachmentName'">
                <UploadItem
                  v-if="state.packageData?.attachmentName"
                  :fileList="getFileList(state.packageData)"
                  :uploadParams="{
                    maxCount: 1,
                    showUploadBtn: false,
                    showUploadList: {
                      showPreviewIcon: true,
                      showRemoveIcon: false,
                      showDownloadIcon: true,
                    },
                  }"></UploadItem>
              </div>
              <div v-else>
                {{ state.packageData[item.dataIndex] ? state.packageData[item.dataIndex] : '/' }}
              </div>
            </div>
          </Descriptions.Item>
        </Descriptions>
        <div>
          <DynamicTable ref="visualInspectionRef" moduleCode="IQCApplyColumn" />
        </div>
        <div>
          <DynamicTable ref="dimensionMeasurementRef" moduleCode="IQCApplyColumn" />
        </div>
        <BasicInfo
          :columns="3"
          :config="OTHERINFOCOLS"
          :data-source="state.basicData"
          class="pl-10px"
          :i18nConfig="{ moduleCode: 'IQCApplyColumn' }"></BasicInfo>
      </ScrollContainer>
    </div>
  </BasicModal>
</template>

<script setup lang="ts">
  import { Descriptions } from 'ant-design-vue';
  import { Subtitle } from '/@/components/Subtitle';
  import { reactive, ref, unref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { ScrollContainer } from '/@/components/Container';
  import { BasicInfo } from '/@/components/CustomComponents';
  import { PACKINFOCOLS, BASICINFOCOLS, OTHERINFOCOLS, DIMENSIONMEASUREMENT_COLUMNS, INSPECTIONINFO_COLUMNS, VISUALINSPECTION_COLUMNS } from './config';
  import DynamicTable from '/@/views/qms/mrb/mrbApply/components/mrbApplyPop/DynamicTable.vue';
  import { gettestreportdata } from '/@/api/qms/iqc';
  import UploadItem from '/@/views/qms/mrb/mrbApply/components/mrbApplyPop/UploadItem.vue';
  import { htmlToImage } from '/@/utils/htmlToImage';
  import { isEmpty } from '/@/utils/is';
  interface IState {
    data: any;
    basicData: any;
    packageData: any;
  }

  const state = reactive<IState>({
    data: {},
    basicData: {},
    packageData: {},
  });
  const inspectioninfoRef = ref(); // 检验批信息
  const dimensionMeasurementRef = ref(); // 尺寸检测
  const visualInspectionRef = ref(); // 外观检测
  const printRef = ref(); // 打印区域
  const emits = defineEmits(['reload']);
  const { t } = useI18n();
  const { createMessage } = useMessage();
  const [registerModal, { closeModal, changeLoading }] = useModalInner(init);

  const descOptions = {
    bordered: true,
    size: 'small',
    column: { xs: 1, sm: 1, md: 1 },
    labelStyle: { color: '#999', fontSize: '14px' },
    contentStyle: { color: '#1A1A1A', fontSize: '14px', width: '600px' },
  };
  async function init({ data, title }) {
    const { id } = data;
    // state.title = title;
    const result: any = await getTestreportdataFn({ id });
    if (!result) {
      closeModal();
      return createMessage.error(t('common.noData'));
    }
    const { purchaseReceiptOrders, testItems } = result;

    let dimensionData = [];
    let visualInspectionData = [];
    unref(inspectioninfoRef)?.initFn({
      title: t('common.inspectionInfo'),
      columns: INSPECTIONINFO_COLUMNS,
      data: purchaseReceiptOrders || [],
      moduleCode: 'IQCApplyColumn',
    });

    if (testItems && testItems.length) {
      testItems.forEach(item => {
        if (item.testProjectName === '尺寸') {
          dimensionData = item.testItems;
        } else if (item.testProjectName === '外观') {
          visualInspectionData = item.testItems;
        }
      });
    }

    unref(dimensionMeasurementRef)?.initFn({
      title: t('common.dimensionMeasurement'),
      columns: DIMENSIONMEASUREMENT_COLUMNS,
      data: dimensionData || [],
      moduleCode: 'IQCApplyColumn',
    });
    unref(visualInspectionRef)?.initFn({
      title: t('common.visualInspection'),
      columns: VISUALINSPECTION_COLUMNS,
      data: visualInspectionData || [],
      moduleCode: 'IQCApplyColumn',
    });
  }

  async function getTestreportdataFn(params) {
    changeLoading(true);
    try {
      const { data, code, msg } = await gettestreportdata(params);
      if (code === 200) {
        state.data = data;
        const { baseInfo, applyOrderPackage } = data;
        state.basicData = baseInfo || {};
        state.packageData = applyOrderPackage || {};
        return data;
      }
    } catch (error) {
      console.log(error);
    } finally {
      changeLoading(false);
    }
  }

  function handleSubmit() {
    handleDownloadImage();
  }

  async function handleDownloadImage() {
    try {
      await htmlToImage(printRef.value, 'document.png');
    } catch (error) {
      console.error('Error generating image:', error);
    }
  }

  function getFileList(item) {
    const fileList = [{ fullPath: item.attachmentPath, originFileName: item.attachmentName, name: item.attachmentName }];
    return fileList;
  }
</script>
<style lang="less" scoped>
  // ::v-deep .report-block {
  // }
  .lydc-subtitle-container {
    padding: 0 !important;
  }

  .scrollbar {
    padding: 0 !important;
  }
</style>
