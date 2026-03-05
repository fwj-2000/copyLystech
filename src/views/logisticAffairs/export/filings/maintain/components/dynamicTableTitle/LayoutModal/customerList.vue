<template>
  <div class="p-12px">
    <h2 class="text-16px font-bold mt-8px">
      {{ t('dict.CustomsAffairsMoldeRelative.bindDirectCustomers') }}
    </h2>

    <div v-if="!disabled" class="w-full flex items-center justify-between">
      <ApiSelect
        :api="getCustomerList"
        :show-search="true"
        :api-search="{
          show: true,
          searchName: 'keyword',
        }"
        v-model:value="state.customCode"
        result-field="data"
        value-field="customerCode"
        label-field="customerCode"
        :filter-option="false"
        :not-found-content="null"
        :immediate="true"
        style="width: 200px"
        @change="handleSelectCustomerCode" />
      <a-button type="primary" ghost class="ml-8px" @click="handleAdd">{{ t('common.add1Text') }}</a-button>
    </div>

    <template v-if="props.data.length > 0">
      <ScrollContainer style="height: calc(100% - 64px)">
        <div v-for="(item, index) in props.data" :key="item" class="flex items-center justify-between customer-item">
          <span class="text-ellipsis" :title="item"> {{ item }} </span>
          <a-button v-if="!disabled" type="link" @click="deleteItem(index)">
            <CloseOutlined style="transform: translateY(-3px)" />
          </a-button>
        </div>
      </ScrollContainer>
    </template>
    <template v-else>
      <lydc-empty />
    </template>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { getCustomerList } from '/@/api/customerSerivce/index';
  import { cloneDeep } from 'lodash-es';
  import { useMessage } from '/@/hooks/web/useMessage';

  import ApiSelect from '/@/components/Form/src/components/ApiSelect.vue';
  import { CloseOutlined } from '@ant-design/icons-vue';
  import { ScrollContainer } from '/@/components/Container';

  const props = defineProps({
    data: {
      type: Array as PropType<string[]>,
      default: () => [],
    },
    disabled: {
      type: Boolean,
      default: true,
    },
  });

  const emits = defineEmits(['update:data']);

  const state = ref<{
    customCode: string;
    customCodeOption: any;
  }>({
    customCode: '',
    customCodeOption: {},
  });

  const { t } = useI18n();
  const { createConfirm, createMessage } = useMessage();

  function handleSelectCustomerCode(_item: string, option: any) {
    state.value.customCodeOption = option;
  }

  function deleteItem(index: number) {
    const list = cloneDeep(props.data);
    createConfirm({
      iconType: 'warning',
      title: t('common.tipTitle'),
      content: t('common.sureToDeleteText'),
      onOk: async () => {
        list.splice(index, 1);
        emits('update:data', list);
        return;
      },
    });
  }

  function handleAdd() {
    if (!state.value.customCode) {
      return false;
    }

    const value = state.value.customCode;
    if (props.data.includes(value)) {
      return createMessage.warn(t('dict.CustomsAffairsMoldeRelative.CustomCodeDuplicationTip'));
    }

    const list = cloneDeep(props.data);
    list.push(value);
    state.value.customCode = '';
    state.value.customCodeOption = {};

    emits('update:data', list);
  }
</script>

<style scoped lang="less">
  .customer-item {
    &:first-child {
      margin-top: 5px;
    }
  }
</style>
