<!-- 厂区数据弹窗 -->
<template>
  <div class="absolute top-0 left-0">
    <template v-for="(info, idx) in infos" :key="idx">
      <!-- 左边 -->
      <template v-if="info.mode === 'start'">
        <div class="absolute" :style="`left:${info.left};top:${info.top};`">
          <div class="flex justify-start">
            <img :src="star" alt="" />
            <div class="text-[#fff] text-20px ml-8px">{{ info.name }}</div>
          </div>
          <!-- 内容 -->
          <div class="flex flex-col mt-12px info-item">
            <div v-for="(content, cidx) in info.list" :keys="cidx" class="w-[100%] flex justify-between py-12px">
              <div class="text-[#fff] text-20px">{{ content.name }}</div>
              <div class="text-[#fff] text-20px ml-8px">{{ content.value }}</div>
            </div>
          </div>
        </div>
        <!-- 线条 -->
        <div
          class="absolute h-[2px] bg-[#fff] opacity-80"
          :style="`width:${info.line.width};left:${info.left};top:calc(${info.top} + 12px);transform: rotate(${info.line.angle}deg); transform-origin: 0%;${info.line.style}`" />
      </template>
      <!-- 右边 -->
      <template v-else>
        <div class="absolute" :style="`right:${info.right};top:${info.top};`">
          <div class="flex justify-end">
            <div class="text-[#fff] text-18px mr-8px">{{ info.name }}</div>
            <img :src="star" alt="" />
          </div>
          <!-- 内容 -->
          <div class="flex flex-col mt-12px info-item">
            <div v-for="(content, cidx) in info.list" :keys="cidx" class="w-[100%] flex justify-between py-12px">
              <div class="text-[#fff] text-18px">{{ content.name }}</div>
              <div class="text-[#fff] text-18px ml-8px">{{ content.value }}</div>
            </div>
          </div>
        </div>
        <!-- 线条 -->
        <div
          class="absolute h-[2px] bg-[#fff] opacity-80"
          :style="`width:${info.line.width};right:${info.right};top:calc(${info.top} + 12px);transform: rotate(${info.line.angle}deg); transform-origin: 0%;${info.line.style}`" />
      </template>
    </template>
  </div>
</template>

<script lang="ts" setup>
  import star from './static/star.svg';

  const infos = [
    {
      name: '深圳模切',
      left: '80%',
      top: '60%',
      mode: 'start',
      list: [
        { name: '平湖一厂', value: '96.7%' },
        { name: '平湖二厂', value: '96.4%' },
        { name: '平湖三厂', value: '93.4%' },
        { name: '平湖五厂', value: '91.7%' },
        { name: '平湖六厂', value: '93.3%' },
        { name: '平湖七厂', value: '95.8%' },
        { name: '平湖九厂', value: '95.0%' },
      ],
      line: { angle: -170, width: '10%', style: '' },
    },
    {
      name: '成都模切',
      right: '60%',
      top: '30%',
      list: [{ name: '成都模切', value: '97.2%' }],
      line: { angle: 200, width: '25.5%', top: '40%', style: 'transform-origin: 100%;' },
    },
    {
      name: '东台模切',
      left: '88%',
      top: '8%',
      mode: 'start',
      list: [
        { name: '东台制二', value: '94.6%' },
        { name: '东台制三', value: '93.6%' },
      ],
      line: { angle: -237, width: '25%', top: '40%' },
    },
    {
      name: '苏州模切',
      left: '85%',
      top: '35%',
      mode: 'start',
      list: [{ name: '苏州模切', value: '93.3%' }],
      line: { angle: -218, width: '13%', top: '40%' },
    },
    {
      name: '郑州模切',
      right: '40%',
      top: '20%',
      list: [{ name: '郑州模切', value: '95.5%' }],
      line: { angle: 230, width: '15.5%', top: '40%', style: 'transform-origin: 100%;' },
    },
    {
      name: '越南模切',
      right: '42%',
      top: '70%',
      list: [{ name: '越南模切', value: '95.1%' }],
      line: { angle: 128, width: '10%', top: '40%', style: 'transform-origin: 100%;' },
    },
    {
      name: '印度模切',
      right: '60%',
      top: '80%',
      list: [{ name: '印度模切', value: '81.3%' }],
      line: { angle: 124, width: '15%', top: '40%', style: 'transform-origin: 100%;' },
    },
  ];
</script>

<style lang="less" scoped>
  .info-item {
    width: 10vw;
    padding: 9px 18px;
    border: 0.84px solid #2b95e5;
    background: #050b23;
    box-shadow: 0 0 33.2px 0 rgb(34 120 207 / 80%) inset;
  }
</style>
