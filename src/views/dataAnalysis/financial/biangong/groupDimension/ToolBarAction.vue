<!-- 操作按钮组 -->
<template>
  <a-space>
    <!-- <p class="rank-header">模切BG制程边贡损失额排名榜（可针对不同维度进行选择分析）</p> -->
    <a-button type="primary" @click="setModalProps({ open: true })">查看分析</a-button>
  </a-space>
  <!-- 分析彈窗组件 -->
  <BasicModal
    v-bind="{
      footer: null,
      draggable: true,
      visible: false,
    }"
    class="analysis-dialog"
    @register="registerModal"
    style="width: 50vw">
    <template #title>
      <div class="flex justify-start">
        <span>Top</span>
        <div class="w-[74px] mx-[8px]">
          <a-input-number v-model:value="topNum" :min="0" :max="props.dataSource.length"> </a-input-number>
        </div>
        <span>分析</span>
      </div>
    </template>
    <div>
      <!-- xxx厂区（带上厂区搜索框值）： 从新老项目，By车间，By成品编码维度分析														
**周/月/年/季度 （WK27，累计前面的日期）边贡较**周/月/年/季度（目标列头上选的日期），制程 做差/做好（负数/正数 ）0.5%（列：制程提升，行：实际%），边贡 损失/提升 （负数/正数）1.36万（列：提升金额，行：实际%）														
1、损耗制程 做好/做差（负数/正数 ）0.9%，导致材料下降/上升（负数/正数 ）0.4%，材料节约/损失（负数/正数 ）1.09万														
2、人工 做好/做差 （负数/正数 ）0.1%，主要模切段制程做好/做差 （负数/正数 ）0.3%，节约/损失（负数/正数 ）0.81万；手工段制程提升/损失（负数/正数 ）0.2%，节约/损失（负数/正数 ）0.54万														 -->
      <div>
        <span v-if="!dimensionType.includes('厂区')" class="f-w-800">{{ SyOrganization[`${formParams().orgCode}`] }}：</span>
        从 <span class="f-w-800">{{ dimensionType.length > 0 ? dimensionType.join(' by') : '' }} </span> 维度分析
      </div>
      <p v-for="(item, idx) in analysisInfo" :key="idx" class="bg-[#f2f2f2] mb-8px py-6px px-12px">
        <template v-for="(content, cidx) in item" :key="cidx">
          <div v-if="item[cidx].category === '边贡'">
            {{ idx + 1 + '）' }}
            <span class="f-w-800" v-for="(item, itemidx) in dimensionType" :key="itemidx"> {{ (content[`dimesionType_keys_${item}`] ?? '') + ' ' }} </span>

            {{ item[cidx].preTime }}边贡较{{ item[cidx].nextTime.replace('目标', '') }}， 制程{{ item[cidx]['vList_keys_制程提升'] > 0 ? '做好' : '做差'
            }}{{ formatterRate(Math.abs(item[cidx]['vList_keys_制程提升'])) }}， 边贡{{ item[cidx]['vList_keys_提升金额'] > 0 ? '提升' : '损失'
            }}{{ formatterNumber(Math.abs(item[cidx]['vList_keys_提升金额'])) }}万
          </div>

          <span v-if="item[cidx].category === '损耗'">
            a、损耗制程{{ item[cidx]['vList_keys_制程提升'] > 0 ? '做差' : '做好' }}
            {{ formatterRate(Math.abs(item[cidx]['vList_keys_制程提升'])) }}
          </span>
          <span v-if="item[cidx].category === '材料'">
            导致材料{{ item[cidx]['vList_keys_制程提升'] > 0 ? '上升' : '下降' }}{{ formatterRate(Math.abs(item[cidx]['vList_keys_制程提升'])) }}， 材料{{
              item[cidx]['vList_keys_提升金额'] > 0 ? '损失' : '节约'
            }}{{ formatterNumber(Math.abs(item[cidx]['vList_keys_提升金额'])) }}万
          </span>

          <span v-if="item[cidx].category === '人工'">
            <br />
            b、人工{{ item[cidx]['vList_keys_制程提升'] > 0 ? '做差' : '做好' }}{{ formatterRate(Math.abs(item[cidx]['vList_keys_制程提升'])) }}，
          </span>
          <span v-if="item[cidx].category === '模切'">
            主要模切段制程{{ item[cidx]['vList_keys_制程提升'] > 0 ? '做差' : '做好' }}{{ formatterRate(Math.abs(item[cidx]['vList_keys_制程提升'])) }}，
            {{ item[cidx]['vList_keys_提升金额'] > 0 ? '损失' : '节约' }}{{ formatterNumber(Math.abs(item[cidx]['vList_keys_提升金额'])) }}万；
          </span>
          <span v-if="item[cidx].category === '手工'">
            手工段制程{{ item[cidx]['vList_keys_制程提升'] > 0 ? '做好' : '做差' }}{{ formatterRate(Math.abs(item[cidx]['vList_keys_制程提升'])) }}，
            {{ item[cidx]['vList_keys_提升金额'] > 0 ? '损失' : '节约' }}{{ formatterNumber(Math.abs(item[cidx]['vList_keys_提升金额'])) }}万
          </span>
        </template>
      </p>
    </div>
  </BasicModal>
</template>

<script lang="ts" setup>
  import { ref, computed } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import XEUtils from 'xe-utils';

  const props = defineProps({
    // 表格数据
    dataSource: {
      type: Array as PropType<Recordable<any>[]>,
      required: true,
    },
    SyOrganization: {
      type: Object as PropType<Recordable<any>>,
      required: true,
    },
    formParams: {
      type: Function as PropType<() => { dimensionType: string; orgCode: string }>,
      required: true,
    },
  });

  const topNum = ref<number>(5);
  const [registerModal, { setModalProps }] = useModalInner();
  const analysisInfo = computed(() => {
    const info = props.dataSource.slice(0, topNum.value);
    return info;
  });

  const formatterNumber = cellValue => {
    return XEUtils.commafy(cellValue, { digits: 0 });
  };
  const formatterRate = cellValue => {
    return `${XEUtils.commafy(Number(cellValue), { digits: 1 })}%`;
  };

  const dimensionType = computed(() => {
    let arr = dimensionTypeKeyMap(props.formParams().dimensionType);
    arr = arr.map(item => dimType[item]);
    let str = arr;
    // let str = arr.length > 0 ? arr.join(' by') : '';
    return str;
  });

  const dimensionTypeKeyMap = str => {
    if (typeof str !== 'string') return [];
    if (str.includes(';')) return str.split(';');
    return str ? [str] : [];
  };

  const dimType = {
    factory: '厂区',
    znbxm: '项目',
    workshop: '车间',
    zzdkh: '客户',
    zcplb: '产品类别',
    zj6m: '中间6码',
    zj10m: '中间10码',
    matnr: '成品编号',
    zzrgcs: '工程师',
    cpx: '产品线',
    zxlxm: '新老项目',
    xxm: '小项目',
    largeproject: '大项目',
    other1: '通用1',
    other2: '通用2',
    other3: '通用3',
    other4: '通用4',
    other5: '通用5',
    aufnr: '订单号',
  };
</script>
<style lang="less" scoped>
  .rank-header {
    color: #1a1a1a;
    font-size: 16px;
    font-weight: 700;
  }
</style>

<style lang="less">
  .analysis-dialog .ant-modal-body > .scrollbar {
    padding: 24px !important;
  }

  .f-w-800 {
    font-weight: 800;
  }
</style>
