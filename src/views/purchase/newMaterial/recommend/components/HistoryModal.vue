<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :width="800" :minHeight="300" :title="t('common.viewHistory')" :showOkBtn="false" destroy-on-close>
    <div class="supplier-history-wrap">
      <div class="mt-16px" v-for="(item, i) in state.list" :key="i">
        <!-- 采购信息 -->
        <div class="pl-10px">
          <span>{{ t('dict.MaterialDevelopmentApplySonNode.MaterialRecommend') }}:</span>
          <span class="ml-5px mr-10px">{{ item.recommendUserName }}</span>
          <span class="gray-500">{{ item.recommendDateTime }}</span>
        </div>
        <!-- 工程信息 -->
        <SupplierItem :key="i" resultPosition="bottom" :values="item" type="detailed" :role="state.role || '1'" :recommendType="2" :orderStatus="1">
          <template #beforeResult>
            <div>
              <span>{{ t('dict.MaterialDevelopmentApplySonNode.EngineeringReview') }}:</span>
              <span class="ml-5px mr-10px">{{ item.reviewUserName }}</span>
              <span class="gray-500">{{ item.reviewDateTime }}</span>
            </div>
          </template>
        </SupplierItem>
      </div>
      <lydc-empty v-if="!state.list.length" />
    </div>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { reactive } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  // import { useMessage } from '/@/hooks/web/useMessage';
  import SupplierItem from './metarialReplay/Supplier.vue';
  import { useI18n } from '/@/hooks/web/useI18n';

  const { t } = useI18n();
  const state = reactive<{
    list: any[];
    role: '1' | '2';
  }>({
    list: [],
    role: '1',
  });
  const emit = defineEmits(['register', 'reload']);
  // const { createMessage } = useMessage();
  const [registerModal, { changeLoading }] = useModalInner(init);

  function init(data) {
    state.list = [];
    state.role = data.role || '1';
    getSupplyHistory(data);
  }

  /**
   * @description 获取供应商信息历史记录
   * */
  async function getSupplyHistory(data) {
    changeLoading(true);
    const params = data.params;
    params.flg = data.role == 1; // 是采购才显示供应商信息
    const r = await data.api(data.params);
    state.list = r.data || [];
    changeLoading(false);
  }
</script>
<style lang="less" scoped>
  .supplier-history-wrap {
    background: #f7f7f7;
    padding: 10px 10px 2px;
    margin-bottom: 10px;
    border-radius: 8px;
    position: relative;
  }
</style>
