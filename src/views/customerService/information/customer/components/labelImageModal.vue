<template>
  <BasicModal
    :title="t('dict.CustomerColumn.labelImage')"
    canFullscreen
    :draggable="true"
    v-bind="$attrs"
    :width="1000"
    @register="registerModal"
    destroy-on-close
    :showOkBtn="false"
    :cancelText="t('common.closeText')">
    <div class="customer">
      <div class="customer-item">
        <div class="item-label">{{ t('dict.CustomerColumn.name') }}</div>
        <div class="item-value">{{ state.name }}</div>
      </div>
      <div class="customer-item">
        <div class="item-label">{{ t('dict.CustomerColumn.fullName') }}</div>
        <div class="item-value">{{ state.fullName }}</div>
      </div>
    </div>

    <div class="phase-maintenance">
      <div class="maintenance-left">
        <div class="title-stick">
          <div class="gun"></div>
          <div class="title">{{ t('dict.SceneType') }}</div>
        </div>

        <div class="sceneType-line-select">
          <a-select class="select" ref="select" v-model:value="selectValue" @change="addSceneType">
            <a-select-option :value="item.enCode" v-for="(item, index) in sceneTypeList" :key="index">{{ item.fullName }}</a-select-option>
          </a-select>
        </div>

        <div class="products">
          <div
            :class="['sceneType-item', 'cursor-pointer', currentIndex === index ? 'active-item' : '']"
            v-for="(item, index) in dataList"
            :key="item.sceneType"
            @click="selectSceneType(index)">
            <span class="sceneType-name">{{ item.sceneTypeName }}</span>
          </div>
        </div>
      </div>

      <div class="maintenance-right">
        <LabelImageGrid ref="LabelImageGridRef" />
      </div>
    </div>
  </BasicModal>
</template>

<script lang="ts" setup>
  import { ref, toRaw } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  import LabelImageGrid from './labelImageGrid.vue';
  import { getCustomerSceneTypeList } from '/@/api/business/customerCode';
  import { useBaseStore } from '/@/store/modules/base';

  const { t } = useI18n();
  const baseStore = useBaseStore();
  const emit = defineEmits(['reload']);
  const [registerModal, { changeLoading }] = useModalInner(init);
  const { createMessage } = useMessage();
  const selectValue = ref(undefined);
  const LabelImageGridRef = ref<InstanceType<typeof LabelImageGrid>>();
  const state = ref<any>({});
  const dataList = ref<Array<{ sceneType: string; sceneTypeName: string }>>([]);
  const currentIndex = ref(0);
  const sceneTypeList = ref<Array<{ enCode: string; fullName: string }>>([]);

  const addSceneType = () => {
    if (dataList.value.some(item => item.sceneType === selectValue.value)) {
      selectValue.value = undefined;
      createMessage.warning(t('dict.Customer.sceneTypeExist'));
      return;
    }
    const sceneType = sceneTypeList.value.find(item => item.enCode === selectValue.value);
    if (sceneType) {
      dataList.value.push({
        sceneType: sceneType.enCode,
        sceneTypeName: sceneType.fullName,
      });
      selectSceneType(dataList.value.length - 1);
      selectValue.value = undefined;
    }
  };

  /** 选中场景类型 */
  const selectSceneType = (index: number) => {
    currentIndex.value = index;
    LabelImageGridRef.value && LabelImageGridRef.value.reloadTableData(state.value.id, dataList.value?.[0]?.sceneType);
  };

  /** 获取场景类型字段项 */
  const getSceneTypeList = async () => {
    return sceneTypeList.value.length === 0
      ? baseStore.getDictionaryData('SceneType').then((res: Array<any>) => {
          sceneTypeList.value = res;
        })
      : Promise.resolve();
  };

  const resetData = () => {
    currentIndex.value = 0;
    selectValue.value = undefined;
    dataList.value = [];
  };

  function initData() {
    changeLoading(true);
    getSceneTypeList()
      .then(() => {
        return getCustomerSceneTypeList(state.value.id);
      })
      .then(res => {
        dataList.value = res.data;
        changeLoading(false);
        selectSceneType(0);
      })
      .catch(() => {
        changeLoading(false);
      });
  }

  async function init(row: any) {
    resetData();
    state.value = { ...toRaw(row) };
    initData();
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

  .customer {
    display: flex;
    padding-bottom: 16px;
    border-bottom: 1px solid #dbdbdb;

    .customer-item {
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

      .sceneType-line-select {
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

        .sceneType-item {
          display: flex;
          align-items: center;
          padding: 8px 12px;
          background-color: #f7f7f7;
          border-radius: 4px;
          margin-bottom: 12px;

          &:last-child {
            margin-bottom: 0;
          }

          .sceneType-name {
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
