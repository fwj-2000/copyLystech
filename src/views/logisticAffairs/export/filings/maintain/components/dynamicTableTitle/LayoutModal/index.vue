<template>
  <BasicModal
    v-bind="$attrs"
    :width="1200"
    @register="registerModal"
    :title="t('common.customerTemplate')"
    @ok="handleSubmit"
    destroyOnClose
    class="customs-affairs-molde-relative-layout-modal">
    <div v-loading="loading" class="list">
      <!-- 添加模板 -->
      <MoldeList ref="modleListRef" :data="moldeList" class="item" @change="handleMoldeListChange" @selected="handleSelectedMoldeItem" />
      <!-- 绑定直接客户 -->
      <CustomerList class="item" v-model:data="currentItem.immediateCustomerCodes" :disabled="disabled" />
      <!-- 字段选择 -->
      <FieldList class="item" v-model:data="currentItem.moldeJsonList" :disabled="disabled" />
      <!-- 已选字段 -->
      <SelectedFieldList class="item" v-model:data="currentItem.moldeJsonList" :disabled="disabled" :isKSLZ="currentItem.moldeCode === 'KSLZ'" />
    </div>
  </BasicModal>
</template>

<script lang="ts" setup>
  import { ref, nextTick, computed } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { cloneDeep, omit } from 'lodash-es';
  import { getCustomsAffairsMoldeRelativeList, updateCustomsAffairsMoldeRelativeCustomsMolde } from '/@/api/logisticAffairs/customsAffairsMake';
  import { useMessage } from '/@/hooks/web/useMessage';

  import { BasicModal, useModalInner } from '/@/components/Modal';
  import MoldeList from './moldeList.vue';
  import CustomerList from './customerList.vue';
  import FieldList from './fieldList.vue';
  import SelectedFieldList from './selectedFieldList.vue';

  const emit = defineEmits(['reload', 'register']);
  const { t } = useI18n();
  const moldeList = ref<Array<any>>([]);
  const { createMessage } = useMessage();

  const [registerModal, { changeOkLoading }] = useModalInner(init);

  const modleListRef = ref();

  function init(_data: any) {
    moldeList.value = [];
    currentItem.value = {};
    getList();
  }

  const loading = ref<boolean>(false);
  async function getList() {
    loading.value = true;
    return getCustomsAffairsMoldeRelativeList({ currentPage: 1, pageSize: 1000 })
      .then(res => {
        handleMoldeListChange(res.data.list);

        nextTick(() => {
          // 初始化选中数据
          modleListRef.value.setCurrentEditItemIndex(-1);
        });
      })
      .catch(() => {})
      .finally(() => {
        loading.value = false;
      });
  }

  function handleMoldeListChange(list: any) {
    moldeList.value = (Array.isArray(list) ? list : []).map(item => {
      return {
        ...item,
        immediateCustomerCodes: Array.isArray(item.immediateCustomerCodeList) ? item.immediateCustomerCodeList : [],
        moldeJsonList: Array.isArray(item.moldeJsonList) ? item.moldeJsonList : [],
      };
    });
  }

  const currentItem = ref<any>({});
  function handleSelectedMoldeItem(index: number) {
    const target = moldeList.value[index];
    if (!target) {
      return false;
    }

    if (!Array.isArray(target.immediateCustomerCodes)) {
      target.immediateCustomerCodes = [];
    }
    currentItem.value = target;
  }

  const disabled = computed(() => {
    // return !currentItem.value.id && !currentItem.value._id;
    return !currentItem.value.id;
  });

  function handleSubmit() {
    const list = [cloneDeep(currentItem.value)].map(item => {
      return omit(item, ['immediateCustomerCodeList']);
    });

    changeOkLoading(true);
    updateCustomsAffairsMoldeRelativeCustomsMolde(list as any)
      .then(() => {
        createMessage.success(t('sys.api.operationSuccess'));
        emit('reload');
        handleReload();
      })
      .finally(() => {
        changeOkLoading(false);
      });
  }

  function handleReload() {
    moldeList.value = [];
    getList().then(() => {
      if (!currentItem.value?.id) {
        return false;
      }
      const index = moldeList.value.findIndex(item => item.id === currentItem.value.id);
      if (index > -1) {
        modleListRef.value.setCurrentEditItemIndex(index);
        handleSelectedMoldeItem(index);
      }
    });
  }
</script>

<style lang="less" scoped>
  .list {
    display: flex;
    height: 500px;
    position: relative;

    .item {
      flex: 2;
      width: 0;

      + .item {
        border-left: 1px solid rgb(219 219 219);
      }

      &:last-child {
        flex: 3;
        width: 0;
      }
    }
  }
</style>

<style lang="less">
  .customs-affairs-molde-relative-layout-modal {
    .ant-modal-header {
      margin-bottom: 0;
    }

    .ant-modal-footer {
      margin-top: 0;
    }

    .ant-modal-body > .scrollbar.scroll-container {
      padding-top: 0;
    }
  }
</style>
