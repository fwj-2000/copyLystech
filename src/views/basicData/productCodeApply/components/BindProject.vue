<template>
  <div class="pop-item">
    <div class="title-stick">
      <div class="flex justify-start items-center">
        <Subtitle style="width: max-content" placement="vxe" :title="t('dict.PartNumberApplyColumn.InsideProjectCodeList')"> </Subtitle>
        <div class="mr-10px">
          <span class="mr-5px">{{ t('dict.PartNumberApplyColumn.IsSharePart') }}:</span>
          <a-switch v-model:checked="isSharePart" checkedValue="1" unCheckedValue="0" :disabled="props.disabled" />
        </div>
        <ApiSelect
          v-if="!props.disabled"
          :api="getprojectlist"
          :show-search="true"
          :always-load="true"
          :api-search="{
            show: true,
            searchName: 'code',
          }"
          v-model:value="currentValue"
          result-field="data"
          value-field="InsideProjectCode"
          label-field="InsideProjectCode"
          :filter-option="false"
          :not-found-content="null"
          :immediate="true"
          style="width: 200px"
          :disabled="isSharePart === IS_SHARE_ENUM.否"
          :placeholder="t('dict.PartNumberApply.selectProject')"
          @change="handleChange" />
      </div>
      <div class="list">
        <div v-for="item in selectedList" :key="item.InsideProjectCode + item.Status">
          <span :style="{ opacity: item.Status === STATUS_ENUM.启用 ? 1 : 0.6 }">{{ item.InsideProjectCode }}</span>
          <span v-if="!props.disabled" class="table-a" @click="() => handleChangStatus(item)">
            {{ item.Status === STATUS_ENUM.启用 ? t('dict.enableStatus.2') : t('dict.enableStatus.1') }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import ApiSelect from '/@/components/Form/src/components/ApiSelect.vue';
  import Subtitle from '/@/components/Subtitle/src/Subtitle.vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { getprojectlist } from '/@/api/business/quantitation';
  import { cloneDeep } from 'lodash-es';

  const props = defineProps({
    /** 是否禁止编辑 */
    disabled: {
      type: Boolean,
      default: true,
    },
    /** 内部项目代码 */
    insideProjectCode: {
      type: String,
      default: '',
    },
  });

  /** 绑定状态枚举 */
  enum STATUS_ENUM {
    启用 = '1',
    禁用 = '2',
  }

  /** 是否共用件枚举 */
  enum IS_SHARE_ENUM {
    否 = '0',
    是 = '1',
  }

  const { t } = useI18n();
  const { createMessage } = useMessage();

  /** 是否共用件，0为否，1为是 */
  const isSharePart = ref<`${IS_SHARE_ENUM}`>(IS_SHARE_ENUM.否);
  const currentValue = ref(undefined);
  /** 选中的项目列表，InsideProjectCode为内部项目代码，1为启用，2为禁用 */
  const selectedList = ref<{ InsideProjectCode: string; Status: `${STATUS_ENUM}` }[]>([]);

  /**
   * 初始化选中项目数据
   * @param data.list 选中的项目列表
   * @param data.isSharePart 是否共用件
   */
  function init(data: { list: Array<{ InsideProjectCode: string; Status: `${STATUS_ENUM | 1 | 2}` }>; isSharePart: `${IS_SHARE_ENUM}` }) {
    selectedList.value = cloneDeep(data.list).map(item => ({
      ...item,
      Status: `${item.Status}`,
    }));
    isSharePart.value = data.isSharePart || IS_SHARE_ENUM.否;
  }

  /** 选中项目处理 */
  function handleChange(value: string) {
    currentValue.value = undefined;
    if (!value) {
      return;
    }
    if (value === props.insideProjectCode) {
      createMessage.warn(t('dict.PartNumberApply.isInsideProjectCode', [value]));
      return;
    }

    selectedList.value.some(item => item.InsideProjectCode === value)
      ? createMessage.warn(t('common.somethingExist', [value]))
      : selectedList.value.push({ InsideProjectCode: value, Status: STATUS_ENUM.启用 });
  }

  /**
   * 状态改变
   * @param data
   */
  function handleChangStatus(data: { InsideProjectCode: string; Status: `${STATUS_ENUM}` }) {
    if (props.disabled) {
      return;
    }
    data.Status = data.Status === STATUS_ENUM.启用 ? STATUS_ENUM.禁用 : STATUS_ENUM.启用;
  }

  /** 获取绑定项目的数据 */
  function getValues() {
    return {
      list: [...selectedList.value].map(item => ({
        ...item,
        Status: +item.Status,
      })),
      isSharePart: isSharePart.value,
    };
  }

  defineExpose({
    init,
    getValues,
  });
</script>

<style scoped lang="less">
  .list {
    display: flex;
    flex-wrap: wrap;
    margin: 20px 0;

    & > div {
      font-size: 16px;
      transition: all 0.3s;
      margin-right: 20px;
    }

    .table-a {
      color: #1890ff;
      cursor: pointer;
      margin-left: 8px;
    }
  }
</style>
