<template>
  <section class="template">
    <!-- 标题 -->
    <section class="title">
      <img class="logo" :src="logoImg" />
      <section>
        <h1 class="main-title">{{ props.baseInfo.insidePartNumber || '' }} {{ t('dict.PCCApplyColumn.processControlCard') }}</h1>
        <h2 class="sub-title">Process Control Card</h2>
      </section>
    </section>

    <!-- 基础信息、生产信息、工艺信息、模具料号 -->
    <section class="flex pt-20px justify-between flex-start">
      <section style="width: 24%">
        <!-- 基础信息 -->
        <Subtitle :title="t('common.baseinfo')" />
        <LabelValueItem v-for="item in baseInfoSchema" :key="item.field" :data="props.baseInfo" :schema="item" />
      </section>
      <section style="width: 24%">
        <!-- 生产信息 -->
        <!-- 当前标题不需要显示，隐藏起来，用`opacity: 0;`实现隐藏效果，并且保留原本的占位高度，保持布局 -->
        <Subtitle :title="t('dict.PCCApplyColumn.productionInformation')" style="opacity: 0" />
        <LabelValueItem v-for="item in prodInfoSchema" :key="item.field" :data="props.prodInfo" :schema="item" />
      </section>
      <section style="width: 24%">
        <!-- 工艺信息 -->
        <Subtitle :title="t('dict.PCCApplyColumn.processInformation')" />
        <LabelValueItem v-for="item in technologyInfoSchema" :key="item.field" :data="props.technologyInfo" :schema="item" />
        <StepDistanceGroup :list="props.technologyInfo.technologyList" />
      </section>
      <section style="width: 24%">
        <!-- 模具料号 -->
        <Subtitle :title="t('dict.CommonCol.moldNo')" />
        <MoldNoList :list="props.moldNoList" />
      </section>
    </section>

    <!-- 工艺流程 -->
    <Table :title="t('common.process')" :columns="technologyColumns" :data="props.technologyTableData" :footerData="technologyTableFooterData">
      <template #afterTitle>
        <span class="after-title-item">
          {{ `${t('dict.PCCApplyColumn.singleRefuelingDuration')}：${technologyTableForm.singleRefuelingDuration || ''}` }}
        </span>
        <span class="after-title-item">
          {{ `${t('dict.PCCApplyColumn.downtimeOneHour')}：${technologyTableForm.downtimeOneHour || ''}` }}
        </span>
        <span class="after-title-item">
          {{ `${t('dict.PCCApplyColumn.utilizationRate')}：${technologyTableForm.utilizationRate || ''}%` }}
        </span>
      </template>
    </Table>

    <!-- 半成品 -->
    <Table :title="t('dict.CommonCol.SemiFinishedProduct')" :columns="semiFinishedProductColumns" :data="props.semiFinishedTableData" :showDivider="true" />

    <!-- 测试条 -->
    <Table :title="t('common.testStrip')" :columns="testStripColumns" :data="props.testStripTableData" :showDivider="true" />

    <!-- 强制换页 -->
    <!-- <div class="page-break"></div> -->

    <!-- 材料 -->
    <Table :title="t('dict.ProcessSchedulingColumn.material')" :columns="materialColumns" :data="props.materialTableData" :showDivider="true" />

    <!-- 强制换页 -->
    <!-- <div class="page-break"></div> -->

    <!-- 包规&包材 -->
    <Table
      :title="t('common.packageMetaria')"
      :columns="isShipPatternR ? packCustomColumns : packBaseColumns"
      :data="isShipPatternR ? props.packageData?.packingMaterialCustomList : props.packageData?.packingMaterialFixedList">
      <template #afterTitle>
        <span class="after-title-item">
          {{ `${props.packageData?.packageSpecQty || 0} ${isShipPatternR ? t('dict.PCCColumn.PCSVolume') : t('dict.PCCColumn.PCSStrip')}` }}
        </span>
      </template>
    </Table>
    <Table v-if="isShipPatternR" :columns="packBaseColumns" :data="props.packageData?.packingMaterialFixedList" :showDivider="false" />

    <!-- 工艺流程详述 -->
    <Table :title="t('dict.PCCApplyColumn.processFlowDetails')" :columns="technologyDetailColumns" :data="props.technologyDetailTableData" />

    <!-- 变更履历 -->
    <Table :title="t('dict.PCCApplyColumn.changeHistory')" :columns="changeHistoryColumns" :data="props.changeHistoryTableData" />
  </section>
</template>

<script lang="ts" setup>
  import { computed } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import {
    baseInfoSchema,
    prodInfoSchema,
    technologyInfoSchema,
    technologyColumns,
    materialColumns,
    packBaseColumns,
    packCustomColumns,
    technologyDetailColumns,
    changeHistoryColumns,
    testStripColumns,
    semiFinishedProductColumns,
  } from './templateConfig';
  import logoImg from '/@/assets/images/lydc1.png';

  import { Subtitle } from '/@/components/Subtitle';
  import LabelValueItem from './components/labelValueItem.vue';
  import StepDistanceGroup from './components/stepDistanceGroup.vue';
  import MoldNoList from './components/moldNoList.vue';
  import Table from './components/table.vue';

  const { t } = useI18n();

  const props = defineProps({
    /** 基础信息 */
    baseInfo: {
      type: Object,
      default: () => ({}),
    },
    /** 生产信息 */
    prodInfo: {
      type: Object,
      default: () => ({}),
    },
    /** 工艺信息 */
    technologyInfo: {
      type: Object,
      default: () => ({}),
    },
    /** 模具料号 */
    moldNoList: {
      type: Array as PropType<string[]>,
      default: () => [],
    },
    /** 工艺流程 */
    technologyTableData: {
      type: Array as PropType<any[]>,
      default: () => [],
    },
    technologyTableForm: {
      type: Object,
      default: () => ({}),
    },
    /** 材料表格数据 */
    materialTableData: {
      type: Array as PropType<Array<any>>,
      default: () => [],
    },
    /** 测试条表格数据 */
    testStripTableData: {
      type: Array as PropType<Array<any>>,
      default: () => [],
    },
    /** 包规 & 包材 */
    packageData: {
      type: Object,
      default: () => ({}),
    },
    /** 工艺流程详述 */
    technologyDetailTableData: {
      type: Array,
      default: () => [],
    },
    /** 变更履历 */
    changeHistoryTableData: {
      type: Array,
      default: () => [],
    },
    /** 半成品表格数据 */
    semiFinishedTableData: {
      type: Array,
      default: () => [],
    },
  });

  const technologyTableFooterData = computed(() => {
    const list = technologyColumns.map((item, index) => {
      if (index === 0) {
        return t('component.table.summary');
      }
      if (item.field && item.field === 'defectRate') {
        const sum = getSum(props.technologyTableData, item.field);
        return (isNaN(sum) ? 0 : sum.toFixed(2)) + '%';
      }
      if (item.field && item.field === 'adjustmentTime') {
        return getSum(props.technologyTableData, item.field);
      }
      return '';
    });
    return list;
  });

  const isShipPatternR = computed(() => {
    return props.packageData?.shipPattern === 'R';
  });

  function getSum(list: Array<any>, field: string) {
    return list.reduce((acc: number, cur) => +acc + +(cur[field] || 0), 0);
  }
</script>

<style lang="less">
  @media all {
    .page-break {
      display: block;
    }
  }

  @media print {
    /* 隐藏所有滚动条 */
    ::-webkit-scrollbar {
      display: none !important;
    }

    html,
    body,
    .print-wrap {
      height: auto !important;
      overflow: visible !important;
      -webkit-print-color-adjust: exact;
    }

    .page-break {
      display: block;
      page-break-before: always;
      page-break-inside: avoid;
      break-before: page;
    }
  }

  @page {
    // 页码
    @bottom-right {
      content: 'Page ' counter(page) '/' counter(pages);
      font-size: 10px;
    }

    size: a4 portrait;
    margin: 20px;
    margin-bottom: 2cm;
  }
</style>

<style scoped lang="less">
  .template {
    padding: 0 20px;
    font-size: 8px;
  }

  .title {
    height: 64px;
    color: #1a1a1a;
    background-color: #ebebeb;
    position: relative;
    font-size: 12px;

    .logo {
      width: 104px;
      height: 44px;
      object-fit: contain;
      position: absolute;
      top: 10px;
      left: 10px;
    }

    > section {
      width: 100%;
      height: 100%;
      padding-top: 10px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }

    .main-title {
      font-weight: 700;
    }

    .sub-title {
      font-weight: 400;
    }
  }

  :deep(.lydc-subtitle-container div.title div, .subtitle-container div.title div) {
    font-size: 9px;
    line-height: 10px;
  }

  // :deep(.lydc-subtitle-container, .subtitle-container) {
  //   padding-bottom: 8px;
  // }

  .after-title-item {
    font-weight: 500;

    + .after-title-item {
      margin-left: 20px;
    }
  }
</style>
