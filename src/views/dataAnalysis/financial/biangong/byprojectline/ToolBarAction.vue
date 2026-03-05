<template>
  <a-space>
    <a-button type="primary" @click="openModal">查看分析</a-button>
  </a-space>
  <BasicModal
    v-bind="{
      footer: null,
      draggable: true,
      visible: false,
    }"
    class="analysis-dialog"
    @register="registerModal"
    style="width: 60vw">
    <template #title>
      <div class="flex justify-start items-center">
        <span>Top</span>
        <div class="w-[74px] mx-[8px]">
          <a-input-number v-model:value="topNum" :min="1" :max="factoryCount" size="small" />
        </div>
        <span>分析</span>
      </div>
    </template>
    <div>
      <span class="font-bold"> {{ formParams.endDim }}“{{ formParams.showType }}”{{ formParams.startDim }}结单分析：</span>
      <p v-for="(item, idx) in analysisInfo" :key="idx" class="bg-[#f2f2f2] mb-8px py-10px px-12px rounded-sm">
        <template v-for="(content, cidx) in item" :key="cidx">
          <template v-if="content.type === 'textTitle'">
            <span class="font-bold block mb-4px"> {{ content.content }}</span>
          </template>
          <template v-else-if="content.type === 'textContent'">
            <span class="pl-14px block leading-22px">{{ content.content }}</span>
          </template>
        </template>
      </p>
    </div>
  </BasicModal>
</template>

<script lang="ts" setup>
  import { ref, computed, PropType } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';

  const props = defineProps({
    dataSource: {
      type: Array as PropType<any[]>,
      required: true,
    },
    formParams: {
      type: Object as PropType<Recordable<any>>,
      required: true,
    },
  });

  const [registerModal, { setModalProps }] = useModalInner();
  const emit = defineEmits(['openModal']);
  const topNum = ref<number>(5);

  /**
   * 核心格式化工厂函数
   * @param val 输入值
   * @param options 配置项
   * @param options.isPercent 是否是百分比（如果是，则 * 100 并保留一位小数）
   * @param options.useAbs    是否取绝对值（去除正负号）
   * @param options.showPlus  是否对正数显示 "+" 号
   */
  const formatValue = (val: any, { isPct = false, useAbs = false, showPlus = false } = {}) => {
    const numVal = Number(val);
    if (val === undefined || val === null || isNaN(numVal)) return isPct ? '0.0' : '0'; // NOSONAR

    let resultNum = isPct ? Number((numVal * 100).toFixed(1)) : Math.round(numVal);
    if (useAbs) resultNum = Math.abs(resultNum);

    const str = isPct ? resultNum.toFixed(1) : String(resultNum);
    return showPlus && resultNum > 0 ? `+${str}` : str;
  };

  const formatPct = (v: any) => formatValue(v, { isPct: true, showPlus: true });
  const formatAmt = (v: any) => formatValue(v, { showPlus: true });
  const formatPctAbs = (v: any) => formatValue(v, { isPct: true, useAbs: true });
  const formatAmtAbs = (v: any) => formatValue(v, { useAbs: true });

  // --- 2. 逻辑辅助函数 ---
  const getActionName = (val: number, isCost: boolean, useLossWord = false) => {
    const isPositive = Number(val || 0) >= 0;
    if (isCost) {
      return isPositive ? (useLossWord ? '损失' : '做差') : '提升'; // NOSONAR
    }
    return isPositive ? '提升' : '做差';
  };

  const openModal = () => {
    emit('openModal');
    setModalProps({ open: true });
  };

  // 获取工厂总数
  const factoryCount = computed(() => {
    const row = props.dataSource.find(d => d.items === '边贡' && d.category === '制程提升%') || {};
    return Object.keys(row).filter(k => k.startsWith('list_') && k !== 'list_合计').length;
  });

  // --- 3. 核心分析逻辑 ---
  const analysisInfo = computed(() => {
    if (!props.dataSource.length) return [];

    const type = props.formParams.showType || '环比/同比';

    // 建立映射表，优化查询性能 O(1)
    const dataMap = new Map(props.dataSource.map(d => [`${d.items}_${d.category}`, d]));
    // console.log("🚀 ~ dataMap:", dataMap)
    const getRow = (item: string, cat: string) => dataMap.get(`${item}_${cat}`) || {};

    const rows = {
      bgPct: getRow('边贡', '制程提升%'),
      bgLoss: getRow('边贡', '制程损失'),
      laborPct: getRow('人工', '制程提升%'),
      laborLoss: getRow('人工', '制程损失'),
      lossPct: getRow('损耗', '制程提升%'),
      matLoss: getRow('材料', '制程损失'),
    };

    const factoryKeys = Object.keys(rows.bgPct).filter(k => k.startsWith('list_') && k !== 'list_合计');

    const factoryData = factoryKeys.map(key => ({
      name: key.replace('list_', ''),
      bgRate: Number(rows.bgPct[key] || 0),
      bgLoss: Number(rows.bgLoss[key] || 0),
      laborRate: Number(rows.laborPct[key] || 0),
      laborLoss: Number(rows.laborLoss[key] || 0),
      lossRate: Number(rows.lossPct[key] || 0),
      matLoss: Number(rows.matLoss[key] || 0),
    }));

    const topList = [...factoryData]
      .filter(f => f.bgRate >= 0)
      .sort((a, b) => b.bgRate - a.bgRate)
      .slice(0, topNum.value);
    const bottomList = [...factoryData]
      .filter(f => f.bgRate < 0)
      .sort((a, b) => a.bgRate - b.bgRate)
      .slice(0, topNum.value);

    const total = {
      bgRate: Number(rows.bgPct.list_合计 || 0),
      bgLoss: Number(rows.bgLoss.list_合计 || 0),
      laborRate: Number(rows.laborPct.list_合计 || 0),
      laborLoss: Number(rows.laborLoss.list_合计 || 0),
      lossRate: Number(rows.lossPct.list_合计 || 0),
      matLoss: Number(rows.matLoss.list_合计 || 0),
    };

    // 详情行构造器
    const renderDetail = (f: any, idx: number) => ({
      type: 'textContent',
      content: `${idx + 1}、${f.name}，制程边贡${type}${getActionName(f.bgRate, false)}${formatPct(f.bgRate)}%，制程${type}${getActionName(
        f.bgLoss,
        false,
      )}${formatAmt(f.bgLoss)}万（人工${type}${getActionName(f.laborRate, true)}${formatPctAbs(f.laborRate)}%，制程${getActionName(
        f.laborLoss,
        true,
      )}${formatAmtAbs(f.laborLoss)}万；损耗率${type}${getActionName(f.lossRate, true)}${formatPctAbs(f.lossRate)}%，材料${getActionName(
        f.matLoss,
        true,
        true,
      )}${formatAmtAbs(f.matLoss)}万）`,
    });

    return [
      // 1. BG维度
      [
        {
          type: 'textTitle',
          content: `一、BG维度制程边贡${type}${getActionName(total.bgRate, false)}${formatPct(total.bgRate)}%，制程边贡${getActionName(
            total.bgLoss,
            false,
          )}${formatAmt(total.bgLoss)}万`,
        },
        {
          type: 'textContent',
          content: `①、人工${type}${getActionName(total.laborRate, true)}${formatPct(total.laborRate)}%，损失金额${formatAmt(total.laborLoss)}万`,
        },
        {
          type: 'textContent',
          content: `②、损耗${type}${getActionName(total.lossRate, true)}${formatPct(total.lossRate)}%，材料${getActionName(
            total.matLoss,
            true,
            true,
          )}${formatAmt(total.matLoss)}万`,
        },
      ],
      // 2. 提升厂区
      [{ type: 'textTitle', content: `二、制程边贡${type}提升厂区：（${topList.map(f => f.name).join('、')}）` }, ...topList.map(renderDetail)],
      // 3. 做差厂区
      [{ type: 'textTitle', content: `三、制程边贡${type}做差厂区：（${bottomList.map(f => f.name).join('、')}）` }, ...bottomList.map(renderDetail)],
    ];
  });
</script>

<style lang="less" scoped>
  .analysis-dialog .ant-modal-body > .scrollbar {
    padding: 24px !important;
  }
</style>
