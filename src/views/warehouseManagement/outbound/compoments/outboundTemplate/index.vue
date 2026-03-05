<template>
  <div class="print print-area">
    <div class="print-header">
      <!-- <img src="/@/assets/images/lylogo2.png" alt="Logo" /> -->
      <div class="print-title">
        <h3>镒韬科技（东莞）有限公司</h3>
        <div>技术中心送货单</div>
      </div>
    </div>
    <div class="print-content">
      <div class="row">
        <div class="col">
          <div class="label">客户</div>
          <div class="value">{{ getName(data.customer) }}</div>
        </div>
        <div class="col">
          <div class="label">供应商名称</div>
          <div class="value">镒韬科技（东莞）有限公司</div>
        </div>
      </div>

      <div class="row">
        <div class="col">
          <div class="label">联系人</div>
          <div class="value">{{ getName(data.contactsName) }} </div>
        </div>
        <div class="col">
          <div class="label">地址</div>
          <div class="value"> {{ data.deliveryAddress }}</div>
        </div>
      </div>

      <div class="row">
        <div class="col">
          <div class="label">采购订单号</div>
          <div class="value order-style">{{ data.poNo }}</div>
        </div>
        <div class="col">
          <div class="label">货单</div>
          <div class="value order-style">{{ data.outboundNo }}</div>
        </div>
      </div>

      <div class="row">
        <div class="col">
          <div class="label">序号</div>
          <div class="sub-col">
            <div class="sub-label"> 工单号 </div>
          </div>
          <div class="sub-col">
            <div class="sub-label"> 模具编号 </div>
          </div>
        </div>
        <div class="col">
          <div class="sub-col label-span-block">
            <div class="sub-label label-span">
              <div>齿数</div>
              <div>模数</div>
            </div>
            <div class="sub-value"></div>
          </div>
          <div class="sub-col">
            <div class="sub-label"> 工程 </div>
          </div>
          <div class="sub-col">
            <div class="sub-label"> 数量/PCS </div>
          </div>
          <div class="sub-col">
            <div class="sub-label"> 备注 </div>
          </div>
        </div>
      </div>

      <div class="row order-style" v-for="(item, i) in getList(data.list)">
        <div class="col">
          <div class="label">{{ i + 1 }}</div>
          <div class="sub-col">
            <div class="sub-label"> {{ item.workOrderNo }} </div>
          </div>
          <div class="sub-col">
            <div class="sub-label"> {{ item.moldNo }} </div>
          </div>
        </div>
        <div class="col">
          <div class="sub-col label-span-block">
            <div class="sub-label label-span">
              <div>{{ item.teethQuantity || `&nbsp;` }}</div>
              <div>{{ item.modulus || `&nbsp;` }}</div>
            </div>
            <div class="sub-value"></div>
          </div>
          <div class="sub-col">
            <div class="sub-label"> {{ getPdName(item.pdName) }} </div>
          </div>
          <div class="sub-col">
            <div class="sub-label">{{ item.planStoreQuantity }} </div>
          </div>
          <div class="sub-col">
            <div class="sub-label"> {{ item.depiction }} </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <div class="label">送货人</div>
          <div class="value">{{ getName(data.deliveryPersonName) }}</div>
        </div>
        <div class="col">
          <div class="label">签收</div>
          <div class="value"></div>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <div class="label">日期</div>
          <div class="value">{{ dayjs(data.applyDate).format('YYYY/MM/DD') }}</div>
        </div>
        <div class="col">
          <div class="label"></div>
          <div class="value"></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
  import dayjs from 'dayjs';

  import { ref, reactive, toRefs, computed } from 'vue';
  const props = defineProps({
    data: {
      type: Object,
      default: () => {
        return {};
      },
    },
  });

  const defaultNumber = 4;
  const { data } = toRefs(props);

  function getPdName(name) {
    if (!name) return '';
    const _name = name.match(/\/?([\u4e00-\u9fa5]{2,})\//);
    return _name[1] ? _name[1] : '';
  }

  function getName(name) {
    if (!name) return '';
    const _name = name.match(/^[^/]+/)[0];
    return _name || '';
  }
  function getList(list: any[]) {
    const template = {
      documentNumber: '',
      moldNo: '',
      teethQuantity: '',
      modulus: '',
      pdName: '',
      planStoreQuantity: '',
      depiction: '',
    };
    if (!list) return Array.from({ length: defaultNumber }, () => ({ ...template }));
    const lens = list.length;
    let emptyTemplates: any = [];
    if (lens < defaultNumber) {
      emptyTemplates = Array.from({ length: defaultNumber - lens }, () => ({ ...template }));
    }
    return [...list, ...emptyTemplates];
  }
</script>

<style lang="less" scoped>
  .print {
    margin: 0 auto;
    width: 740px;
    text-align: left;
    padding-top: 10px;
  }

  .print-header {
    display: flex;
    justify-content: center;
    text-align: center;
    border-bottom: 1px solid #333;
  }

  .print-title {
    width: 100%;
  }

  .print-title div {
    height: 36px;
    line-height: 36px;
  }

  .print-title > div {
    height: 50px;
    line-height: 50px;
  }

  .print-content {
    width: 100%;
    border: 1px solid #333;
    border-bottom: none;
    border-top: none;
  }

  .row {
    min-height: 34px;
    line-height: 34px;
    display: flex;
    border-bottom: 1px solid #333;
    box-sizing: border-box;
  }

  .col {
    display: flex;
    width: 52%;
  }

  .col:last-child {
    width: 48%;
  }

  .col:last-child .value {
    border-right: none;
  }

  .label {
    border-right: 1px solid #333;
    width: 80px;
    min-width: 95px;
    text-align: left;
    padding-left: 6px;
    display: flex;
    justify-content: left;
    align-items: center;
  }

  .value {
    flex: 1;
    border-right: 1px solid #333;
    min-width: 140px;
    display: flex;
    padding-left: 12px;
  }

  .sub-col {
    flex: 1;
    border-right: 1px solid #333;
    text-align: center;
  }

  .sub-col:last-child {
    border-right: none;
  }

  .size-block {
    width: 210px;
  }

  .sub-label {
    text-align: left;
    padding-left: 6px;
    min-width: 90px;
    display: flex;
  }

  .label-span-block {
    max-width: 100px;
    min-width: 95px;
  }

  .label-span {
    padding-left: 0;
    max-width: 100px;
  }

  .label-span div {
    width: 50%;
    text-align: center;
  }

  .sub-label div {
    border-left: 1px solid #333;
  }

  .size-block-value {
    display: flex;
  }

  .size-block-value div {
    width: 33.33%;
    border-right: 1px solid #333;
  }

  .size-block-value div:last-child {
    border-right: none;
  }

  .remark {
    padding: 0 10px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .check-content {
    width: 100%;
  }

  .check-content-block {
    width: 100%;
    display: flex;
    border-bottom: 1px solid #333;
  }

  .check-content-block:last-child {
    border-bottom: none;
  }

  .check-block:last-child {
    border-bottom: none;
  }

  .check-info {
    min-width: 0;
    width: 76.8%;
    border-right: 1px solid #333;
    padding-left: 12px;
  }

  .check-result {
    display: flex;
    align-items: center;
    padding-left: 12px;
  }

  .check-block-title {
    width: 80%;
    text-align: center;
    border-right: 1px solid #333;
    font-size: 14px;
    font-weight: 600;
  }

  .check-block-content {
    width: 80%;
    text-align: left;
    border-right: 1px solid #333;
  }

  .exteriorList .sub-value,
  .packList .sub-value {
    padding-left: 12px;
    width: 100%;
  }

  .exteriorList .col {
    width: 100%;
  }

  .print-footer {
    padding-top: 24px;
  }

  .print-footer-info {
    display: flex;
    justify-content: space-between;
    margin-bottom: 14px;
  }

  .sign {
    position: relative;
  }

  .chgz-logo {
    position: absolute;
    top: -15px;
    right: -15px;
  }

  .bdr-0 {
    border-right: none;
  }

  .fs-12px {
    font-size: 12px;
  }

  .order-style {
    font-size: 14px;
    font-weight: 600;
  }
</style>
