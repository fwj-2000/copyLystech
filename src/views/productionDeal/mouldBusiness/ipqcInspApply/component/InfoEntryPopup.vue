<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    :showOkBtn="!isViewModel"
    :showCancelBtn="true"
    :title="state.title"
    :destroyOnClose="true"
    :showFooter="false"
    @ok="handleSubmit"
    :ok-text="t('common.submit')"
    class="full-popup">
    <template #insertToolbar>
      <div class="scroll-tab">
        <div class="scroll-tab-item" v-for="item in operaList" @click="scrollToSection(item.ref)">
          <div class="scroll-tab-item-btn" :class="{ 'active-btn': item.ref === active }">
            {{ item.name }}
          </div>
        </div>
      </div>
      <a-button v-auth="'btn_print'" type="primary" ghost class="mr-12px" @click="handleHistoryFn" v-if="isAddModel">{{
        t('common.introduceHistoricalData')
      }}</a-button>
      <a-button v-auth="'btn_infoEntry'" type="primary" class="mr-12px" @click="handleSubmit(0)" v-if="isAddModel">{{ t('common.temporarySave') }}</a-button>
      <div v-auth="'btn_print'" @click="handleDownloadImage" class="print-icon" v-if="isViewModel">
        <i class="ym-custom ym-custom-download"></i>
      </div>
      <div v-auth="'btn_print'" @click="handlePrint" class="print-icon" v-if="isViewModel">
        <i class="ym-custom ym-custom-printer"></i>
      </div>
    </template>
    <ScrollContainer style="background: #ebeef5">
      <div class="mt-16px" style="height: 400px">
        <basicInfo ref="basicInfoRef" id="basicInfoRef" :tableData="historyData"></basicInfo>
        <dynamicTable ref="externalsRef" id="externalsRef" :tableData="historyData"></dynamicTable>
        <dynamicTable ref="dimensionsRef" id="dimensionsRef" :tableData="historyData"></dynamicTable>
        <dynamicTable ref="packageSpecificationRef" id="packageSpecificationRef" :tableData="historyData"></dynamicTable>
        <dynamicTable ref="angleRef" id="angleRef" :tableData="historyData"></dynamicTable>
        <dynamicTable ref="heightRef" id="heightRef" :tableData="historyData"></dynamicTable>
        <finalDeterminationResult ref="finalDeterminationResultRef" id="finalDeterminationResultRef" :tableData="historyData"></finalDeterminationResult>
      </div>
    </ScrollContainer>
  </BasicPopup>

  <div ref="printRef" class="download-class">
    <saleTemplate ref="downloadRef" id="saleTemplate" :data="state.cacheData"></saleTemplate>
  </div>
</template>
<script setup lang="ts">
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import basicInfo from './basicInfo.vue';
  import { computed, nextTick, onMounted, reactive, ref, unref } from 'vue';
  import { ScrollContainer } from '/@/components/Container';
  import dynamicTable from './dynamicTable/index.vue';
  import {
    externals_columns,
    dimensions_columns,
    packageSpecification_columns,
    height_columns,
    angle_columns,
    DIMENSIONS_MODULE_TEMPLATE,
    ANGLE_MODULE_TEMPLATE,
    HEIGHT_MODULE_TEMPLATE,
    EXTERNALS_MODULE_TEMPLATE,
  } from './dynamicTable/config';
  import { addIpqcapply, getDraftlist, getIpqcapplyById } from '/@/api/productionDeal/ipqc';
  import finalDeterminationResult from './finalDeterminationResult.vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import printStyle from './printTemplatePopup/printStyle';
  import saleTemplate from './printTemplatePopup/saleTemplate.vue';
  import html2canvas from 'html2canvas';
  import { useI18n } from '/@/hooks/web/useI18n';

  const { t } = useI18n();
  interface State {
    title: string;
    id: string;
    type: 'add' | 'edit' | 'view';
    cacheData: any;
  }
  const state = reactive<State>({
    title: '',
    id: '',
    type: 'add',
    cacheData: [],
  });
  const printRef = ref();
  const downloadRef = ref();
  const isAddModel = computed(() => state.type === 'add');
  const isEditModel = computed(() => state.type === 'edit');
  const isViewModel = computed(() => state.type === 'view');
  const emits = defineEmits(['reload']);
  const operaList = [
    { name: '基础信息', ref: 'basicInfoRef' },
    { name: '外观', ref: 'externalsRef' },
    { name: '尺寸', ref: 'dimensionsRef' },
    { name: '包规', ref: 'packageSpecificationRef' },
    { name: '角度', ref: 'angleRef' },
    { name: '高度', ref: 'heightRef' },
    // { name: '最终判定结果', ref: 'finalDeterminationResultRef' },
  ];
  const [registerPopup, { closePopup, changeLoading }] = usePopupInner(init);
  const { createMessage, createConfirm } = useMessage();

  const title = ref('');
  const basicInfoRef = ref();
  const externalsRef = ref();
  const dimensionsRef = ref();
  const packageSpecificationRef = ref();
  const angleRef = ref();
  const heightRef = ref();
  const finalDeterminationResultRef = ref();
  const active = ref('basicInfoRef');
  const historyData = ref();
  const scrollToSection = refName => {
    active.value = refName;
    const idName = refName;
    if (idName) {
      const el = document.querySelector(`#${idName}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  async function handleHistoryFn() {
    if (state.id) return createMessage.warning('当前无可引用数据');
    const data = await getDraftlistFn();
    if (!data) return;
    state.cacheData = data;
    initSettingFn(state.cacheData);
  }

  async function getDraftlistFn() {
    changeLoading(true);
    try {
      const { data, code } = await getDraftlist({});
      if (code === 200) {
        if (data) {
          return data;
        } else {
          createMessage.warning('当前无可引用数据');
        }
        return [];
      }
    } catch (error) {
      console.error(error, 'getDraftlistFn:error');
    } finally {
      changeLoading(false);
    }
  }

  async function getIpqcapplyByIdFn() {
    try {
      const { data, code } = await getIpqcapplyById(state.id);
      if (code === 200) {
        return data;
      }
      return [];
    } catch (error) {
      console.error(error, 'getIpqcapplyByIdFn is error');
    }
  }
  /**
   * 将数据中的字段转换为字符串
   * @param data 数据
   * @param toStringFieldList 需要转换为字符串的字段列表
   * @returns 转换后的数据
   */
  function formartDataField(data, toStringFieldList) {
    if (!toStringFieldList.length) return data;
    return data.map(item => {
      toStringFieldList.forEach(field => {
        if (item[field]) {
          item[field] = item[field].toString();
        }
      });
      return item;
    });
  }

  /**
   * 提取数据中的字段
   * @param dataSource 数据源
   * @param templateFields 需要提取的字段列表
   * @returns 提取后的数据
   */
  function extractedData(dataSource, templateFields) {
    const extractedData = Object.keys(templateFields).reduce((acc, field) => {
      if (dataSource.hasOwnProperty(field)) {
        acc[field] = dataSource[field];
      }
      return acc;
    }, {});
    return [extractedData];
  }

  async function init(data) {
    state.title = t('common.detectionInfo') + data.title;
    state.id = data.id;
    state.type = data.type;
    state.cacheData = data.cacheData || {};
    if (state.id && !data.cacheData) {
      state.cacheData = await getIpqcapplyByIdFn();
    }
    initSettingFn(state.cacheData);
  }

  function initSettingFn(cacheData) {
    nextTick(() => {
      unref(basicInfoRef).init({ tableData: cacheData, openModel: state.type });
      unref(finalDeterminationResultRef).init({ tableData: cacheData, openModel: state.type });
      unref(externalsRef).init({
        title: '外观',
        columns: externals_columns,
        template: EXTERNALS_MODULE_TEMPLATE,
        tableData: cacheData.exteriorList,
        openModel: state.type,
        showActions: false,
        showAddBtn: false,
      });
      unref(dimensionsRef).init({
        title: '尺寸',
        columns: dimensions_columns,
        template: DIMENSIONS_MODULE_TEMPLATE,
        tableData: cacheData.sizeList,
        openModel: state.type,
      });
      unref(packageSpecificationRef).init({
        title: '包规',
        columns: packageSpecification_columns,
        template: EXTERNALS_MODULE_TEMPLATE,
        tableData: cacheData.packList,
        showActions: false,
        showAddBtn: false,

        openModel: state.type,
      });
      unref(angleRef).init({
        title: '角度',
        columns: angle_columns,
        template: ANGLE_MODULE_TEMPLATE,
        showAddBtn: false,
        showActions: false,
        tableData: formartDataField(extractedData(cacheData, ANGLE_MODULE_TEMPLATE), ['bladeType']),
        openModel: state.type,
      });
      unref(heightRef).init({
        title: '高度',
        columns: height_columns,
        template: HEIGHT_MODULE_TEMPLATE,
        showActions: false,
        showAddBtn: false,
        tableData: formartDataField(extractedData(cacheData, HEIGHT_MODULE_TEMPLATE), ['knifeHeightType']),
        openModel: state.type,
      });
    });
  }

  async function addIpqcapplyFn(params) {
    try {
      const { code } = await addIpqcapply(params);
      if (code === 200) {
        closePopup();
        createMessage.success('保存成功！');
        emits('reload');
      }
    } catch (error) {
      console.error(error, 'handleSubmit');
    }
  }

  async function handleSubmit(type = 1) {
    changeLoading(true);
    try {
      const [basicInfoList, exteriorList, dimensionsList, packageSpecificationList, angleList, heightList, finalDeterminationResultList] = await Promise.all([
        basicInfoRef.value.getParamsFn(type),
        externalsRef.value.getParamsFn(type),
        dimensionsRef.value.getParamsFn(type),
        packageSpecificationRef.value.getParamsFn(type),
        angleRef.value.getParamsFn(type),
        heightRef.value.getParamsFn(type),
        finalDeterminationResultRef.value.getParamsFn(type),
      ]);

      if ([basicInfoList, exteriorList, dimensionsList, packageSpecificationList, angleList, heightList, finalDeterminationResultList].includes(false)) {
        return;
      }
      const params = {
        type,
        ...basicInfoList,
        ...angleList[0],
        ...heightList[0],
        ...finalDeterminationResultList,
        exteriorList: exteriorList,
        sizeList: dimensionsList,
        packList: packageSpecificationList,
      };
      if (state.id) {
        params.id = state.id;
      }
      addIpqcapplyFn(params);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      changeLoading(false);
    }
  }

  function handlePrint() {
    const print = printRef.value.innerHTML + printStyle;
    const iframe: any = document.createElement('IFRAME');
    iframe.setAttribute('style', 'position:absolute;width:0px;height:0px;left:-400px;top:-500px;');
    document.body.appendChild(iframe);
    let doc = iframe.contentWindow.document;
    iframe.onload = function () {
      iframe.contentWindow.print();
      // document.body.removeChild(iframe);
      iframe.remove();
    };
    doc.write(print);
    doc.close();
  }
  async function handleDownloadImage() {
    changeLoading(true);
    try {
      // 1. 获取需要转换的DOM元素
      const element = printRef.value;

      // 2. 使用html2canvas生成canvas
      const canvas = await html2canvas(element, {
        useCORS: true, // 如果需要加载跨域图片
        scale: 2, // 提高分辨率
        logging: false, // 关闭日志
        backgroundColor: '#ffffff', // 设置背景色
      });

      // 3. 将canvas转换为图片URL
      const imageUrl = canvas.toDataURL('image/png', 1.0);

      // 4. 创建下载链接
      const link = document.createElement('a');
      link.download = 'document.png'; // 设置文件名
      link.href = imageUrl;

      // 5. 触发下载
      document.body.appendChild(link);
      link.click();
      // document.body.removeChild(link);
      link.remove();
    } catch (error) {
      console.error('Error generating image:', error);
      // 可以在这里添加错误提示
    } finally {
      changeLoading(false);
    }
  }

  onMounted(() => {});
</script>

<style lang="less" scoped>
  .scroll-tab {
    position: absolute;
    left: 310px;
    display: flex;
    border-left: 2px solid #e5e5e5;
    height: 40px;
    padding-left: 16px;

    &-item {
      width: 60px;
      height: 44px;
      line-height: 46px;
      margin-right: 12px;
      text-align: center;
    }
  }

  .active-btn {
    border-bottom: 4px solid @primary-color;
  }

  .print-icon {
    cursor: pointer;
    margin-right: 12px;

    i {
      font-size: 26px;

      &:hover {
        color: @primary-color;
      }
    }
  }

  .download-class {
    background: #fff;
    position: absolute;
    left: -9999px;
    top: 0;
    height: 120vh;
    padding: 20px;
  }
</style>
