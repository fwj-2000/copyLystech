<template>
  <!-- 左侧列表 -->
  <div class="basic-block" ref="Tblock">
    <div class="basic-header">
      <Subtitle :title="t('common.baseinfo')" />
    </div>

    <LydcInput :prefixIcon="'icon-ym icon-ym-search'" v-model:value="searchKey" style="width: 95%; margin-bottom: 12px" @change="onSearchKeyChangeFn" />
    <ScrollContainer class="pb-80px" v-if="!isShowSetting">
      <draggable
        :list="searchKey ? filterTemplist : state.operationList"
        :animation="300"
        handle=".option-drag"
        item-key="name"
        class="basic-group"
        ghost-class="ghost">
        <template #item="{ element }">
          <div class="basic-group-item option-drag" v-if="!element.isHideItem">
            <div class="basic-group-item-desc">
              <!-- <div style="display: flex;"> -->
              <img :src="dragSvg" alt="拖拽" />
              <!-- </div> -->
              <p class="ml-10px text-ellipsis" :class="element.isRequired ? 'isRequired' : ''" style="max-width: 130px">
                <a-tooltip>
                  <template #title> {{ formatLabel(element) || '--' }}</template>
                  {{ formatLabel(element) }}
                  <!-- {{ element.fieldCnName || '--' }} -->
                </a-tooltip>
              </p>
            </div>
            <div class="setting-btn">
              <a-switch v-model:checked="element.status" :checkedValue="1" :unCheckedValue="2" size="small" class="basic-group-item-switch" />
              <a-popover placement="bottomRight" trigger="click" overlayClassName="popover-class" :getPopupContainer="() => Tblock">
                <template #content>
                  <settingPanel
                    v-model:isDisabled="element.isDisabled"
                    v-model:isRequired="element.isRequired"
                    v-model:isShowForm="element.isShowForm"
                    v-model:isShowTable="element.isShowTable"></settingPanel>
                </template>
                <i class="ym-custom ym-custom-settings"> </i>
              </a-popover>
            </div>
          </div>
        </template>
      </draggable>
    </ScrollContainer>
  </div>
</template>
<script setup lang="ts">
  import { reactive, watch, ref, onMounted, computed } from 'vue';
  import dragSvg from '/@/assets/svg/report/drag.svg';
  import Subtitle from '/@/components/Subtitle/src/Subtitle.vue';
  import draggable from 'vuedraggable';
  import { ScrollContainer } from '/@/components/Container';
  import { TempItem } from '/@/views/productionPlan/procruleTemp/types';
  import { useI18n } from '/@/hooks/web/useI18n';
  import settingPanel from '../components/settingPanel.vue';
  const { t } = useI18n();
  const searchKey = ref();
  const isShowSetting = ref(false);
  const Tblock = ref();
  const props = defineProps<{
    tempList: TempItem[];
    operationType: string;
  }>();

  const state = reactive({
    operationList: [] as any, // 通过operationType分类后的list
  });

  const emit = defineEmits(['onChange']);

  function onSearchKeyChangeFn() {}
  const filterTemplist: any = computed(() => {
    const _templist = state.operationList.filter(item => {
      return item.fieldCnName.includes(searchKey.value);
    });
    return _templist.length ? _templist : state.operationList;
  });

  watch(
    () => props.operationType,
    val => {
      if (!val) {
        return;
      }
      state.operationList = props.tempList.map(item => {
        item.isHideItem = !item.operationTypes.includes(val);
        item.status = item.isHideItem ? 2 : item.status;
        return item;
      });
    },
    {
      immediate: true,
    },
  );

  watch(
    () => state.operationList,
    val => {
      emit('onChange', val);
    },
    {
      deep: true,
    },
  );

  watch(
    () => props.tempList,
    val => {
      console.log('tempList changed', ' props.tempList,');
      if (!val) return;
      state.operationList = val;
    },
    {
      deep: true,
    },
  );

  function formatLabel(item: TempItem) {
    const label = t(`dict.CommonCol.${item.fieldEnName}`);
    if (label && label.includes('dict.CommonCol.')) {
      return item.fieldCnName;
    }
    return label || item.fieldCnName;
  }

  onMounted(() => {
    state.operationList = props.tempList;
  });
</script>

<style lang="less" scoped>
  .title-box {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-bottom: 16px;

    .modal-title {
      color: #1a1a1a;
      font-size: 16px;
      font-style: normal;
      font-weight: 700;
      line-height: 24px;
    }
  }

  .basic-block {
    min-width: 290px;
    border-radius: 8px;
    border: 1px solid #e6e6e6;
    padding: 12px 0 12px 12px;
  }

  .basic-header {
    display: flex;
    align-items: baseline;
  }

  .basic-group {
    height: 90%;
    padding-bottom: 60px;
    padding-right: 12px;
  }

  .basic-group-item {
    position: relative;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    width: 100%;
    border-radius: 4px;
    background: #f1f1f1;
    margin-bottom: 12px;
    align-items: center;
    height: 40px;
    padding: 0 16px;

    &-switch {
      width: 32px;
    }

    &-desc {
      display: flex;
      align-items: center;
    }
  }

  .isRequired::after {
    content: '*';
    color: red;
    font-weight: 600;
  }

  .option-drag {
    cursor: move;
  }

  :deep(.ant-tabs) {
    height: 100%;
  }

  :deep(.ant-tabs-content-holder) {
    height: 100%;
    overflow-y: auto;
  }

  .ant-tabs-content-holder::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 2px;
  }

  .ant-tabs-content-holder::-webkit-scrollbar-thumb {
    background: #e1e1e1;
    border-radius: 2px;
  }

  .setting-btn {
    display: flex;
    align-items: center;

    i {
      font-size: 18px;
      margin-left: 4px;
      color: #999;
      cursor: pointer;

      &:hover {
        color: #333;
      }
    }
  }

  .setting-block {
    border-radius: 4px;
    border-top: 1px dashed #e5e5e5;
    padding: 16px 16px 0 0;
  }

  .setting-item {
    width: 210px;
    display: flex;
    align-items: baseline;
    flex-wrap: no-warp;
    margin-bottom: 18px;

    span {
      color: #333;
      font-size: 14px;
      display: inline-block;
      min-width: 80px;
    }
  }

  :deep(.popover-class) {
    left: 30px !important;
  }
</style>
