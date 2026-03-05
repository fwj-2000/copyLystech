<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    :showCancelBtn="true"
    :show-ok-btn="true"
    title="打印"
    cancel-text="返回"
    ok-text="打印"
    :destroyOnClose="true"
    @ok="handleSubmit"
    class="full-popup !h-full bg-white">
    <ScrollContainer style="background: #fff">
      <div class="pb-200px" ref="printRef">
        <div id="printJS-form">
          <saleTemplate id="saleTemplate" :data="state.printData"></saleTemplate>
        </div>
      </div>
    </ScrollContainer>
  </BasicPopup>
</template>
<script setup lang="ts">
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { reactive, ref } from 'vue';
  import { ScrollContainer } from '/@/components/Container';
  import saleTemplate from './saleTemplate.vue';
  import printStyle from './printStyle';
  import { getIpqcapplyById } from '/@/api/productionDeal/ipqc';

  const printRef = ref();
  const state = reactive({
    printData: [] as any,
  });

  const [registerPopup] = usePopupInner(init);
  function handleSubmit() {
    handlePrint();
  }

  function handlePrint() {
    const print = printRef.value.innerHTML + printStyle;
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

  async function getIpqcapplyByIdFn(id) {
    try {
      const { data, code } = await getIpqcapplyById(id);
      if (code === 200) {
        return data;
      }
      return [];
    } catch (error) {
      console.error(error, 'getIpqcapplyByIdFn is error');
    }
  }

  async function init({ title, ids }) {
    state.printData = await getIpqcapplyByIdFn(ids[0]);
  }
</script>
