<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    :showCancelBtn="true"
    :show-ok-btn="true"
    :title="state.title"
    cancel-text="返回"
    ok-text="打印"
    :destroyOnClose="true"
    @ok="handleSubmit"
    class="full-popup !h-full bg-white">
    <ScrollContainer style="background: #fff">
      <div class="pb-200px pt-12px" ref="printRef">
        <div id="printJS-form">
          <outboundTemplate id="saleTemplate" :data="state.printData"></outboundTemplate>
        </div>
      </div>
    </ScrollContainer>
  </BasicPopup>
</template>
<script setup lang="ts">
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { reactive, ref } from 'vue';
  import { ScrollContainer } from '/@/components/Container';
  import { getIpqcapplyById } from '/@/api/productionDeal/ipqc';
  import outboundTemplate from './outboundTemplate/index.vue';
  import printStyle1 from './outboundTemplate/printStyle1';
  import { getOutbounddetail } from '/@/api/warehouse/warehouse';

  const printRef = ref();
  const state = reactive({
    printData: [] as any,
    title: '打印预览',
  });

  const [registerPopup] = usePopupInner(init);

  function handleSubmit() {
    handlePrint();
  }

  function handlePrint() {
    const print = printRef.value.innerHTML + printStyle1;
    console.log(print);
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

  async function getoutboundDetailFn(id) {
    try {
      const { data, code } = await getOutbounddetail({ id });
      if (code === 200) {
        return data;
      }
      return [];
    } catch (error) {
      console.error(error, 'getoutboundDetail is error');
    }
  }

  async function init({ title, id }) {
    state.printData = await getoutboundDetailFn(id);
  }
</script>
