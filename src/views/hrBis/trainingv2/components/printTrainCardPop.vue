<template>
  <BasicPopup v-bind="$attrs" @register="registerPopup" title="打印三级安全教育卡" destroyOnClose>
    <template #insertToolbar>
      <!-- <lydc-input-number style="max-width: 180px" v-model:value="state.line" addon-before="添加行：" />-->
      <a-button @click="handlePrint" class="signs print">打印</a-button>
    </template>
    <ComponentToPrint ref="printRef" :employee="state.employee" />
    <!-- <ComponentToPrint ref="printRef" /> -->
  </BasicPopup>
</template>
<script lang="ts" setup>
  import { reactive, toRefs, ref, unref } from 'vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { cloneDeep, debounce } from 'lodash-es';
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { getPrintDataV2 } from '/@/api/hr/training/employee';
  import dayjs from 'dayjs';
  import { useVueToPrint } from 'vue-to-print';
  import ComponentToPrint from './ComponentToPrint.vue';

  defineOptions({ name: 'print-train-card-pop' });

  const printRef = ref();

  interface StateType {
    employee: any;
  }

  const templateState = {
    trainerName: '黄XX',
    trainerGender: '女',
    trainerBirthday: '19980207',
    entryDate: '2024-4-1',
    trainerDepartment: '生产部',
    jobNature: '手工',
    previousJob: '普工',
    title: '无',
    trainingLevel: '',
    signature: '黄XX',
    signatureDate: '2024-4-1',
  };

  const state = reactive<StateType>({
    employee: cloneDeep(templateState),
  });

  const [registerPopup, { closePopup, changeLoading }] = usePopupInner(init);

  async function init(data) {
    changeLoading(true);
    const r = await getPrintDataV2(data.id);
    if (r.code == 200) {
      state.employee = r.data;
    }
    changeLoading(false);
  }

  const { handlePrint } = useVueToPrint({
    content: printRef,
    documentTitle: '新员工三级安全教育卡',
    removeAfterPrint: true,
    pageStyle: `
      body {
        min-width: 210mm !important; /* 适配A4宽度 */
      }
    `,
  });
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
      margin-top: 3rem;
      display: block;
      page-break-before: always;
      break-before: page;
    }
  }

  @page {
    size: a4 portrait;
    margin: 0;
  }
</style>
