<template>
  <div class="pop-item">
    <div class="title-stick">
      <div class="flex flex-start items-center">
        <Subtitle style="width: 100px" placement="vxe" :title="t('common.factory')"> </Subtitle>
        <ApiSelect
          v-if="!props.disabled"
          v-model:value="currentFactory"
          placeholder="请选择绑定工厂"
          :api="getFactoryList"
          :show-search="true"
          :api-search="{
            show: true,
            searchName: 'factory',
          }"
          :before-fetch="beforeFactoryFetch"
          :style="{ width: '300px' }"
          :filter-option="false"
          :immediate="false"
          :always-load="true"
          result-field="data"
          value-field="Code"
          label-field="Name"
          @change="handleChange" />
      </div>
      <div class="factory-list">
        <div v-for="(item, index) in factories" :key="index">
          {{ item.value }}/{{ item.label }}
          <span v-if="!props.disabled" class="table-a" @click="factories.splice(index, 1)">{{ t('common.unbind') }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { ref, watch } from 'vue';
  import ApiSelect from '/@/components/Form/src/components/ApiSelect.vue';
  import Subtitle from '/@/components/Subtitle/src/Subtitle.vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { getFactoryList } from '/@/api/customerSerivce/index';
  import { useMessage } from '/@/hooks/web/useMessage';
  const { t } = useI18n();
  const { createMessage } = useMessage();
  const props = defineProps({
    mainProcess: {
      type: String,
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    factoryNames: {
      type: Array,
      default: () => [],
    },
  });

  const currentFactory = ref(undefined);
  const factories = ref<{ value: string; label: string }[]>([]);

  const beforeFactoryFetch = (params: any) => {
    const _p = params || {};
    _p.mainProcess = props.mainProcess;
    return _p;
  };

  watch(
    () => [props.factoryNames],
    () => {
      if (props.factoryNames && props.factoryNames.length > 0) {
        factories.value = props.factoryNames.map((item: string) => {
          const _item = item.split('/');
          return {
            value: _item[0],
            label: _item[1],
          };
        });
      }
    },
    {
      immediate: true,
    },
  );

  // 工厂变动
  function handleChange(value, option) {
    if (!value) return;

    // 去重已有数据
    if (factories.value.some(item => item.value === value)) {
      currentFactory.value = undefined;
      return;
    }

    factories.value.push(option);
    currentFactory.value = undefined;
  }

  function validateFactory() {
    if (factories.value.length === 0) {
      createMessage.info(t('common.selectPlaceholder', [t('common.factory')]));
      return false;
    }
    return factories.value.map(item => item.value);
  }

  defineExpose({
    validateFactory,
  });
</script>
<style scoped lang="less">
  .factory-list {
    display: flex;
    gap: 30px;
    flex-wrap: wrap;
    margin: 20px 0;

    & > div {
      font-size: 16px;
      transition: all 0.3s;
    }

    .table-a {
      color: #1890ff;
      cursor: pointer;
    }
  }
</style>
