<template>
  <div ref="printRef" class="print-content" style="page-break-after: always">
    <div class="w-[200px] h-[200px]" style="width: 200px"> <lydc-qrcode width="200" :staticText="props.printComponentInfo?.LineCode" class="ml-20px" /></div>
    <div class="content-left">
      <div class="print-mask" :style="printComponentInfo">{{ props.printComponentInfo.LineName }}</div>
      <!-- <div class="print-mask" :style="printComponentInfo">这里要显示十个字并且</div> -->
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useUserStore } from '/@/store/modules/user';
  import { useVueToPrint } from 'vue-to-print';
  import dayjs from 'dayjs';

  const { t } = useI18n();
  const userStore = useUserStore();
  const userInfo = userStore.getUserInfo;

  const props = defineProps({
    printComponentInfo: {
      type: Object,
      default: () => ({}),
    },
  });
  const printComponentInfo = computed(() => {
    //根据printComponentInfo.LineName.length动态设置字体大小,长度为3时字体大小为66px,长度为4时字体大小为80px

    if (props.printComponentInfo?.LineName) {
      if (props.printComponentInfo.LineName.length <= 5) {
        return { fontSize: '90px' };
      } else {
        return { fontSize: '54px' };
      }
    } else {
      return { fontSize: '54px' };
    }
  });
  const printRef = ref();
  const { handlePrint } = useVueToPrint({
    content: () => printRef.value,
    documentTitle: '',
    removeAfterPrint: true,
    pageStyle: `
      body {
        min-width: 210mm !important; /* 适配A4宽度 */
      }
    `,
  });
  defineExpose({ handlePrint });
</script>
<style lang="less" scoped>
  .print-content {
    width: 570px;
    height: 281px;
    margin-left: 23px;
    padding: 30px;
    margin-bottom: 10px;
    background-color: #fff;
    display: flex;
    align-items: center;
    justify-content: space-around;

    .content-left {
      max-width: 270px;

      .print-mask {
        font-weight: bold;
        text-align: center;
        word-wrap: break-word; /* 强制长单词换行 */
        white-space: normal; /* 允许换行 */
      }
    }
  }
</style>
