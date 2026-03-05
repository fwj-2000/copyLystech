<template>
  <div class="tempCard">
    <div class="tempCard-header">
      <img :src="procTemp" alt="工序模板图标" />
      <div class="tempCard-header-desc">
        <p class="tempCard-header-desc-title text-ellipsis">
          <a-tooltip>
            <template #title> {{ data.processNames || '--' }}</template>
            {{ data.processNames || '--' }}
          </a-tooltip>
        </p>
        <div class="tempCard-header-desc-tags text-ellipsis">
          <div class="tempCard-header-desc-tags-item orgIcon text-ellipsis">
            {{ data.orgName || '--' }}
          </div>
          <div class="tempCard-header-desc-tags-item text-ellipsis">
            {{ data.operationTypeName || '--' }}
          </div>
        </div>
        <p class="tempCard-header-desc-name text-ellipsis">{{ t('dict.CommonCol.creatorUserName') }} ：{{ data.creatorUserName }}</p>
        <p class="tempCard-header-desc-date">{{ t('dict.CommonCol.creatorTime') }} ： {{ dayjs(data.creatorTime).tz().format('YYYY-MM-DD HH:MM:ss') }}</p>
      </div>
      <div class="tempCard-header-switch">
        <a-switch v-model:checked="data.status" :checkedValue="1" :unCheckedValue="2" size="small" class="basic-group-item-switch" @change="toggleFn" />
      </div>
    </div>
    <div class="tempCard-footer">
      <a-button class="action-btn copy" type="text" size="small" @click="copyFn">{{ t('common.copyText') }}</a-button>
      <span class="line">|</span>
      <a-button class="action-btn view" type="text" size="small" @click="viewFn">{{ t('common.previewText') }}</a-button>
      <span class="line">|</span>
      <a-button class="action-btn edit" type="text" size="small" @click="editFn">{{ t('common.editText') }}</a-button>
      <span class="line">|</span>
      <a-button class="action-btn del" type="text" size="small" @click="delFn">{{ t('common.delText') }}</a-button>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import dayjs from 'dayjs';
  import procTemp from '/@/assets/svg/report/procTemp.svg';
  import { useI18n } from '/@/hooks/web/useI18n';

  const { t } = useI18n();

  const props = defineProps({
    data: { type: Object, default: () => {} },
  });
  const emit = defineEmits(['delFn', 'editFn', 'viewFn', 'toggleFn', 'copyFn']);

  function toggleFn() {
    emit('toggleFn');
  }

  function delFn() {
    emit('delFn');
  }

  function viewFn() {
    emit('viewFn');
  }

  function editFn() {
    emit('editFn');
  }

  function copyFn() {
    emit('copyFn');
  }
</script>
<style lang="less" scoped>
  .tempCard {
    position: relative;
    min-height: 184px;
    border-radius: 4px;
    border: 1px solid #e9e9e9;
    background: #fff;
    box-shadow: 0 2px 8px 0 rgb(0 0 0 / 9%);

    &-header {
      display: flex;
      flex: 1 1 auto;
      justify-content: space-around;
      padding: 24px 16px 0 14px;
      position: relative;

      img {
        max-width: 48px;
        width: 48px;
        height: 48px;
      }

      &-switch {
        width: 32px;
      }

      &-desc {
        display: grid;
        flex: 1;
        color: #666;
        font-size: 14px;
        font-weight: 400;
        line-height: 24px;
        padding-left: 16px;
        box-sizing: border-box;

        &-title {
          color: rgb(0 0 0 / 85%);
          font-size: 16px;
          font-style: normal;
          font-weight: 500;
          box-sizing: border-box;
        }

        &-tags {
          padding: 4px 0 2px;
          line-height: 20px;

          &-item {
            display: inline-block;
            color: #ff7b00;
            font-size: 12px;
            background: rgb(255 123 0 / 10%);
            margin-right: 8px;
            padding: 0 6px;
            border-radius: 4px;
          }
        }
      }
    }

    &-footer {
      display: flex;
      width: 100%;
      height: 48px;
      position: absolute;
      bottom: 0;
      left: 0;
      background-color: #f6f6f6;
      align-items: center;
      justify-content: space-around;
      border-top: 1px solid #e9e9e9;
    }
  }

  .action-btn {
    font-size: 14px;
  }

  .copy {
    color: #344481;
  }

  .edit {
    color: #344481;
  }

  .view {
    color: #344481;
  }

  .del {
    color: #999;
  }

  .line {
    color: #e8e8e8;
  }

  .orgIcon {
    background: rgb(24 144 255 / 8%);
    color: #1890ff;
  }
</style>
