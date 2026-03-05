<template>
  <div class="tem-container h-full">
    <a-button @click="handlePrint" class="signs print">打印</a-button>
    <a-button @click="handleAffix" v-if="showBtn" class="signs">盖章</a-button>
    <div ref="printRef" class="tem_list">
      <h1>广东领益智造股份有限公司</h1>
      <h2>报 价 单</h2>
      <h4>TO：</h4>
      <p class="title"> 感谢惠顾，现将贵公司所需配件报价如下：</p>
      <p class="lip">一、产品价格</p>
      <div class="table-box">
        <a-table :data-source="tableData" :columns="columns" size="small" :pagination="false" bordered />
      </div>
      <p class="lip">二、通讯联络</p>
      <div class="content1">
        <div class="item">
          <span>需方联系人员：</span>
          <span>丰梦琪</span>
        </div>
        <div class="item">
          <span>供方联系人员：</span>
          <span>应白梦</span>
        </div>
        <div class="item">
          <span>需方联系电话：</span>
          <span>13802141322</span>
        </div>
        <div class="item">
          <span>供方联系电话：</span>
          <span>13802141322</span>
        </div>
        <div class="item">
          <span>需方传真号码：</span>
          <span>010-88888888</span>
        </div>
        <div class="item">
          <span>供方传真号码：</span>
          <span>021-88888888</span>
        </div>
        <div class="item">
          <span>供方地址：</span>
          <span>北京市海淀区西直门北大街42号</span>
        </div>
        <div class="item">
          <span>供方地址：</span>
          <span>上海市青浦区</span>
        </div>
        <div class="item">
          <span>供方邮编：</span>
          <span>100000</span>
        </div>
        <div class="item">
          <span>供方邮编：</span>
          <span>201799</span>
        </div>
      </div>
      <div class="temdate">日 期：2017-11-29</div>
      <div class="seal">盖 章：</div>
      <Vue3DraggableResizable :draggable="showBtn" :w="150" :h="150" :resizable="false" v-if="showSin">
        <img src="" />
        <div class="signBtn">
          <a-button @click="handleSubmit" v-if="showBtn">确认</a-button>
          <a-button @click="handleCancel" v-if="showBtn">取消</a-button>
        </div>
      </Vue3DraggableResizable>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { reactive, toRefs, ref } from 'vue';
  import printStyle from '../printData/components/printStyle';
  import Vue3DraggableResizable from 'vue3-draggable-resizable';

  defineOptions({ name: 'extend-signet' });

  const state = reactive({
    showBtn: true,
    showSin: false,
    tableData: [
      {
        order: '1',
        name: '服务器硬件',
        standards: '联想',
        num: '5',
        unit: '台',
        unitprice: '20000.00',
        total: '100000.00',
        remarks: '',
      },
      {
        order: '2',
        name: '数据库正版',
        standards: 'SQLServer',
        num: '5',
        unit: '套',
        unitprice: '9998.00',
        total: '49990.00',
        remarks: '',
      },
      {
        order: '3',
        name: 'OA内部管理系统',
        standards: '定制',
        num: '5',
        unit: '套',
        unitprice: '	390000.00',
        total: '	390000.00',
        remarks: '',
      },
      {
        order: '4',
        name: '进销存管理系统',
        standards: '定制',
        num: '5',
        unit: '套',
        unitprice: '260000.00',
        total: '260000.00',
        remarks: '',
      },
      {
        order: '5',
        name: '	服务费',
        standards: '',
        num: '5',
        unit: '年',
        unitprice: '80000.00',
        total: '80000.00',
        remarks: '',
      },
      {
        order: '6',
        name: '差旅费用',
        standards: '',
        num: '5',
        unit: '年',
        unitprice: '60000.00',
        total: '80000.00',
        remarks: '',
      },
    ],
  });
  const printRef = ref();
  const { tableData, showBtn, showSin } = toRefs(state);
  const columns = [
    { title: '序号', align: 'center', customRender: ({ index }) => index + 1, width: 50 },
    { title: '品名', dataIndex: 'name', key: 'name', width: 150 },
    { title: '规格', dataIndex: 'standards', key: 'standards', width: 100 },
    { title: '数量', dataIndex: 'num', key: 'num', width: 60 },
    { title: '单位', dataIndex: 'unit', key: 'unit', width: 60 },
    { title: '单价', dataIndex: 'unitprice', key: 'unitprice', width: 60 },
    { title: '金额', dataIndex: 'total', key: 'total', width: 60 },
    { title: '备注', dataIndex: 'remarks', key: 'remarks', width: 100 },
  ];

  function handlePrint() {
    const print = printRef.value.innerHTML + printStyle;
    const iframe: any = document.createElement('IFRAME');
    iframe.setAttribute('style', 'position:absolute;width:0px;height:0px;left:-500px;top:-500px;');
    document.body.appendChild(iframe);
    let doc = iframe.contentWindow.document;
    iframe.onload = function () {
      iframe.contentWindow.print();
      document.body.removeChild(iframe);
    };
    doc.write(print);
    doc.close();
  }
  function handleAffix() {
    state.showSin = true;
  }
  function handleSubmit() {
    state.showBtn = false;
  }
  function handleCancel() {
    state.showSin = false;
  }
</script>
<style lang="less" scoped>
  .tem-container {
    background: @app-main-background;
    overflow: auto;
    position: relative;
    padding: 0;
    .signs {
      position: absolute;
      right: 10px;
      top: 70px;
      &.print {
        top: 20px;
      }
    }
    .tem_list {
      width: 800px;
      margin: 0 auto;
      background: @component-background;
      color: @text-color-label;
      position: relative;
      padding: 0 40px 15px;
      font-size: 12px;
      position: relative;
    }

    h1 {
      padding-top: 36px;
      font-size: 24px;
    }
    h2 {
      font-size: 18px;
    }
    h1,
    h2 {
      text-align: center;
      color: @text-color-label;
      font-weight: 700;
    }
    .title {
      border-bottom: 2px dashed #000;
      padding-left: 30px;
      line-height: 30px;
      font-size: 12px;
    }
    .lip {
      padding: 20px 0;
    }
    .table-box {
      padding: 0 1px 0 0;
    }
    .demo-form-inline {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
    }
    .temdate {
      text-align: right;
      margin: 20px 60px;
    }
    .seal {
      text-align: right;
      margin: 10px 120px;
      padding-bottom: 40px;
    }
    .signBtn {
      display: flex;
      justify-content: space-between;
    }
    .content1 {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      .item {
        width: 345px;
        padding: 8px 0;
        border-bottom: 1px solid @border-color-base1;
        span {
          font-size: 12px;
          padding: 10px 0;
          color: @text-color-label;
        }
      }
    }
    .vdr-container.active {
      border: unset;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
</style>
