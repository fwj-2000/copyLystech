<template>
  <BasicModal
    :title="t('dict.CommonCol.productStageMaintenance')"
    canFullscreen
    :draggable="true"
    v-bind="$attrs"
    :width="1000"
    @register="registerModal"
    @ok="handleSubmit"
    destroy-on-close
    :showOkBtn="true"
    :cancelText="t('common.closeText')">
    <div class="terminal-customer">
      <div class="terminal-customer-item">
        <div class="item-label">{{ t('dict.CommonCol.terminalCustomerProjectCode') }}</div>
        <div class="item-value">{{ state.terminalCustomerCode }}</div>
      </div>
      <div class="terminal-customer-item">
        <div class="item-label">{{ t('dict.TerminalCustomerColumn.terminalCustomerName') }}</div>
        <div class="item-value">{{ state.terminalCustomerName }}</div>
      </div>
      <div class="terminal-customer-item">
        <div class="item-label">{{ t('dict.TerminalCustomerColumn.terminalCustomerFullName') }}</div>
        <div class="item-value">{{ state.terminalCustomerFullName }}</div>
      </div>
    </div>

    <div class="phase-maintenance">
      <div class="maintenance-left">
        <div class="title-stick">
          <div class="gun"></div>
          <div class="title">{{ t('dict.CommonCol.productLine') }}</div>
        </div>

        <div class="product-line-select">
          <a-select class="select" ref="select" @change="addProduct" v-model:value="selectValue" :placeholder="t('dict.CommonCol.chooseAddProductLine')">
            <a-select-option :value="item.Code" v-for="(item, index) in productLineList" :key="index">{{ item.Name }}</a-select-option>
          </a-select>
          <!-- <div class="add" @click="addProduct">＋</div> -->
        </div>

        <div class="products">
          <div
            :class="['product-item', currentIndex === index ? 'active-item' : '']"
            v-for="(item, index) in dataList"
            :key="item.uuid"
            @click="selectProduct(index)">
            <span class="product-name">{{ item.productLineName }}</span>
            <a-popover title="" trigger="hover" placement="bottom">
              <template #content>
                <p class="cursor-pointer" @click.stop="deleteProductLine(index)">{{ t('common.delText') }}</p>
              </template>
              <div>...</div>
            </a-popover>
            <!-- <img src="/@/assets/svg/delete.svg" class="icon-delete" alt="" @click.stop="deleteProductLine(index)" /> -->
          </div>
        </div>
      </div>

      <div class="maintenance-right">
        <ProductPhaseGrid ref="ProductPhaseGridRef" @updateList="updateList" />
      </div>
    </div>
  </BasicModal>
</template>

<script lang="ts" setup>
  import { ref, nextTick } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { buildUUID } from '/@/utils/uuid';
  import { useMessage } from '/@/hooks/web/useMessage';
  import ProductPhaseGrid from './ProductPhaseGrid.vue';
  import { getProductStageListv2, productStageCreateOrUpdateV2 } from '/@/api/business/terminalCustomer';
  import { getProductLineCode } from '/@/api/basicData/productLine';
  const { t } = useI18n();

  const emit = defineEmits(['reload']);
  const [registerModal, { closeModal, changeLoading }] = useModalInner(initData);
  const { createMessage, createConfirm } = useMessage();
  const selectValue = ref(undefined);
  const ProductPhaseGridRef = ref();
  const state = ref({
    terminalCustomerId: '',
    terminalCustomerCode: '',
    terminalCustomerName: '',
    terminalCustomerFullName: '',
  });
  const dataList = ref<any[]>([]);
  const currentIndex = ref(0);
  const productLineList = ref<any[]>([]);

  const addProduct = () => {
    if (dataList.value.some(item => item.productLineCode === selectValue.value)) {
      nextTick(() => {
        selectValue.value = undefined;
      });
      createMessage.warning(t('dict.CommonCol.cannotAddSameLines'));
      return;
    }
    const product = productLineList.value.find(item => item.Code === selectValue.value);
    dataList.value.push({
      uuid: buildUUID(),
      productLineName: product.Name,
      productLineCode: product.Code,
      productStageList: [{ customerProductStage: '', internalProductStage: '' }],
    });
    currentIndex.value = dataList.value.length - 1;
    nextTick(() => {
      selectValue.value = undefined;
    });
    setGridTableData();
  };

  const setGridTableData = async () => {
    const dataItem = dataList.value[currentIndex.value];
    await ProductPhaseGridRef.value.setTableData(dataItem ? dataItem.productStageList : []);
  };

  const selectProduct = index => {
    currentIndex.value = index;
    setGridTableData();
  };

  const updateList = data => {
    dataList.value[currentIndex.value].productStageList = data;
  };

  const deleteProductLine = index => {
    createConfirm({
      iconType: 'warning',
      title: t('common.tipTitle'),
      content: t('dict.CommonCol.deleteTip'),
      onOk: async () => {
        dataList.value.splice(index, 1);
        currentIndex.value = 0;
        setGridTableData();
      },
    });
  };

  const checkTable = async () => {
    let validatPass = true;
    for (let i = 0; i < dataList.value.length; i++) {
      const productStageList = dataList.value[i].productStageList;
      for (let j = 0; j < productStageList.length; j++) {
        if (!productStageList[j].customerProductStage || !productStageList[j].internalProductStage) {
          currentIndex.value = i;
          await setGridTableData();
          ProductPhaseGridRef.value.validate(true);
          validatPass = false;
          break;
        }
      }
    }
    return validatPass;
  };

  const hasSameCustomerProductStage = async () => {
    let validatCustomerProductStage = true;
    for (let i = 0; i < dataList.value.length; i++) {
      const productStageList = dataList.value[i].productStageList;
      const values = productStageList.map(item => item.customerProductStage);
      const uniqueValues = new Set(values);
      const hasDuplicate = values.length !== uniqueValues.size;
      if (hasDuplicate) {
        createMessage.warning(t('dict.CommonCol.customerProductStageNotRepeated'));
        currentIndex.value = i;
        await setGridTableData();
        ProductPhaseGridRef.value.validate(true);
        validatCustomerProductStage = false;
        break;
      }
    }
    return validatCustomerProductStage;
  };

  const handleSubmit = async () => {
    // 校验必填并跳转未填写页面
    if (!(await checkTable())) return;
    // 检验客户阶段录入的数据不能重复，内部的阶段可以重复
    if (!(await hasSameCustomerProductStage())) return;
    const params = {
      terminalCustomerId: state.value.terminalCustomerId,
      productLineList: dataList.value.map(item => {
        return {
          productLineCode: item.productLineCode,
          productStageList: item.productStageList.map(productStage => {
            return {
              id: productStage.id,
              customerProductStage: productStage.customerProductStage,
              internalProductStage: productStage.internalProductStage,
            };
          }),
        };
      }),
    };
    changeLoading(true);
    const { code, msg } = await productStageCreateOrUpdateV2(params).finally(() => {
      changeLoading(false);
    });
    if (code === 200) {
      createMessage.success(msg);
      emit('reload');
      closeModal();
      return;
    }
    createMessage.error(msg);
  };

  const getProductLineCodeFn = async mainProcess => {
    const { data } = await getProductLineCode(' ', mainProcess);
    productLineList.value = data;
  };

  const resetData = () => {
    currentIndex.value = 0;
    nextTick(() => {
      selectValue.value = undefined;
    });
    dataList.value = [];
  };

  async function initData(row) {
    resetData();
    const { terminalCustomerCode, terminalCustomerName, terminalCustomerFullName, mainProcess, id } = row;
    state.value = { terminalCustomerCode, terminalCustomerName, terminalCustomerFullName, terminalCustomerId: id };
    getProductLineCodeFn(mainProcess);
    changeLoading(true);
    const { data } = await getProductStageListv2({ terminalCustomerId: id }).finally(() => {
      changeLoading(false);
    });
    if (data && data.length) {
      dataList.value = data[0].productLineList.map(item => {
        return {
          ...item,
          uuid: buildUUID(),
        };
      });
      setGridTableData();
    }
  }
</script>
<style lang="less" scoped>
  ::-webkit-scrollbar {
    display: none;
    width: 0;
    height: 0;
    color: transparent;
    background-color: transparent;
  }

  .terminal-customer {
    display: flex;
    padding-bottom: 16px;
    border-bottom: 1px solid #dbdbdb;

    .terminal-customer-item {
      flex: 1;
      display: flex;
      margin-right: 16px;
      color: #1a1a1a;
      font-size: 14px;

      &:last-child {
        margin-right: 0;
      }

      .item-label {
        padding: 10px 16px;
        background-color: #f0f0f0;
        font-weight: 700;
      }

      .item-value {
        padding: 10px 16px;
        flex: 1;
        border: 1px solid #f0f0f0;
      }
    }
  }

  .phase-maintenance {
    display: flex;
    height: 450px;

    .maintenance-left {
      width: 244px;
      padding: 16px 16px 16px 0;
      border-right: 1px solid #dbdbdb;
      display: flex;
      flex-direction: column;
      height: 100%;
      overflow: hidden;

      .title-stick {
        display: flex;
        align-items: center;

        .gun {
          border-radius: 2px;
          background: #ff7b00;
          width: 2px;
          height: 14px;
          margin-right: 10px;
        }

        .title {
          color: #1a1a1a;
          font-size: 14px;
          font-style: normal;
          font-weight: 700;
          line-height: 22px; /* 157.143% */
        }
      }

      .product-line-select {
        margin-top: 8px;
        display: flex;
        align-items: center;

        .select {
          flex: 1;
        }

        .add {
          width: 30px;
          height: 30px;
          border: 1px solid #ff7b00;
          border-radius: 4px;
          color: #ff7b00;
          display: flex;
          justify-content: center;
          align-items: center;
          margin-left: 16px;
          line-height: 30px;
          cursor: pointer;
        }
      }

      .products {
        margin-top: 20px;
        flex: 1;
        overflow: scroll;

        .product-item {
          display: flex;
          align-items: center;
          padding: 8px 12px;
          background-color: #f7f7f7;
          border-radius: 4px;
          margin-bottom: 12px;

          &:last-child {
            margin-bottom: 0;
          }

          .product-name {
            color: #1a1a1a;
            font-size: 14px;
            flex: 1;
          }

          .icon-delete {
            width: 14px;
            height: 14px;
          }
        }

        .active-item {
          background-color: rgb(255 123 0 / 6%);
          border: 1px solid #ff7b00;
        }
      }
    }

    .maintenance-right {
      padding-top: 10px;
      flex: 1;
      overflow: hidden;
    }
  }
</style>
