<!--  -->
<template>
  <div class="item">
    <div class="title">DL1</div>
    <div class="content">
      <p>手工、包装、全检员</p>
    </div>
  </div>
  <div class="item">
    <div class="title">DL2</div>
    <div class="content">
      <p>学徒、模切工、技术员及手工班组长、模切班组长等</p>
    </div>
  </div>
  <div class="item">
    <div class="title">IDL1</div>
    <div class="content">
      <p>间接员工（仓管、品质员工、生产物料员辅助人员等）</p>
    </div>
  </div>
  <div class="item">
    <div class="title">IDL2</div>
    <div class="content">
      <p>运营体系内的职员</p>
    </div>
  </div>
  <div class="item">
    <div class="title">IDL3</div>
    <div class="content">
      <p>职能体系内的职员+员工（物流员工/行政员工等)</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
</script>

<style lang="less" scoped>
.item {
  &:first-child {
    .title {
      margin-top: 0;
    }
  }

  .title {
    color: #1A1A1A;
    font-family: "Noto Sans SC";
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 14px;
    /* 87.5% */
    letter-spacing: -0.32px;
    margin: 16px 0 11px 0;
  }

  .content {
    color: var(---, #666);
    font-family: "Microsoft YaHei UI";
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: 20px;
    /* 166.667% */
    padding: 12px 16px;
    background-color: #F2F2F2;
    border-radius: 4px;
  }
}
</style>