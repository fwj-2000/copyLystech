<template>
  <div class="data-point">
    <span class="label mr-3">{{ getLable(base.label) }}: </span>
    <a-spin :spinning="showLoading">
      <span class="value">{{ base.value }}</span>
    </a-spin>
  </div>
</template>
<script lang="ts" setup>
  import { onMounted, reactive, ref, watch } from 'vue';
  import dayjs from 'dayjs';
  import { useBaseStore } from '/@/store/modules/base';
  import { transformI18n } from '/@/utils';

  defineOptions({ name: 'BasicInfoValueItem' });
  const baseStore = useBaseStore();
  const props = defineProps({
    info: {
      type: Object,
      default: () => {},
    },
    sourceVal: {
      type: [String, Number],
      default: '',
    },
    i18nConfig: {
      type: Object,
      default: () => {
        return {
          moduleCode: '',
        };
      },
    },
  });
  const base = reactive({
    label: props.info.title || '',
    value: (props.info.dataIndex || '').trim(),
  });

  // 获取label的值
  function getLable(item) {
    if (props.i18nConfig) {
      const { moduleCode } = props.i18nConfig;
      if (moduleCode && moduleCode != '') {
        const field = props.info.field || props.info.dataIndex || props.info.i18nField;
        return transformI18n(moduleCode, field);
      }
    }
    return item;
  }

  const showLoading = ref(true);

  // 针对value值做处理
  async function toVal(item) {
    showLoading.value = true;
    const _val = props.sourceVal;
    const { format } = item;
    if (_val && format) {
      if (/^date/.test(format)) {
        base.value = dayjs(_val).tz().format(format.split('|')[1]);
        return (showLoading.value = false);
      }
      // 数据字典
      if (/^enCode/.test(format)) {
        const _code = format.split('|')[1];
        const baseList: any = await baseStore.getDictionaryData(_code);
        base.value = (baseList.find(item => item.enCode == _val) || {}).fullName || _val;
        showLoading.value = false;
      }
    } else {
      showLoading.value = false;
    }
  }

  watch(
    () => props.sourceVal,
    () => {
      toVal(props.info);
    },
  );

  onMounted(() => {
    toVal(props.info);
  });
</script>

<style scoped>
  .data-point .value {
    color: rgb(26 26 26 / 70%);

    /* font-size: 14px; */
    font-weight: bold;
  }
</style>
