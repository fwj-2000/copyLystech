<template>
  <div class="py-12px pr-12px">
    <a-button type="dashed" class="w-full" @click="addItem">
      <template #icon>
        <PlusOutlined :style="{ color: '#FF7B00', transform: 'translateY(-3px)' }" />
      </template>
      {{ t('dict.CustomsAffairsMoldeRelative.addCustomerTemplate') }}
    </a-button>

    <template v-if="props.data.length > 0">
      <ScrollContainer style="height: calc(100% - 32px)">
        <MoldeItem
          v-for="(item, index) in props.data"
          :key="item.id || item._id"
          :data="item"
          :class="{ 'current-edit-item': currentEditItemId === item.id || currentEditItemId === item._id }"
          @add="handleAddItemSuccess($event, index)"
          @remove="handleRemoveItemSuccess(index)"
          @click="handleSelectItem(item, index)" />
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
  import { cloneDeep } from 'lodash-es';
  import { buildBitUUID } from '/@/utils/uuid';
  import { useMessage } from '/@/hooks/web/useMessage';

  import { PlusOutlined } from '@ant-design/icons-vue';
  import MoldeItem from './moldeItem.vue';
  import { ScrollContainer } from '/@/components/Container';

  const props = defineProps({
    data: {
      type: Array as PropType<any[]>,
      default: () => {
        return [];
      },
    },
  });

  const emits = defineEmits(['change', 'selected']);

  const { t } = useI18n();
  const { createMessage } = useMessage();

  function addItem() {
    if (props.data.some(item => !item.id)) {
      return createMessage.warn(t('dict.CustomsAffairsMoldeRelative.addMoldeTip'));
    }

    const list = [...props.data];
    list.unshift({ _id: buildBitUUID(), moldeName: '', moldeCode: '' });
    emits('change', list);
  }

  function handleAddItemSuccess(itemData: any, index: number) {
    const list = [...props.data];
    Object.assign(list[index], itemData);
    emits('change', list);
  }

  function handleRemoveItemSuccess(index: number) {
    const list = [...props.data];
    list.splice(index, 1);
    emits('change', list);
  }

  function handleSelectItem(item: any, index: number) {
    if (!item.id) {
      return false;
    }
    emits('selected', index, item);
    handleEditItem(index);
  }

  const currentEditItemId = ref<number>(-1);
  function setCurrentEditItemIndex(index: number) {
    if (!props.data[index]) {
      return false;
    }
    const item = cloneDeep(props.data[index]);
    currentEditItemId.value = item.id || item._id;
  }

  function handleEditItem(index: number) {
    setCurrentEditItemIndex(index);
  }

  defineExpose({
    setCurrentEditItemIndex,
  });
</script>

<style scoped lang="less">
  .current-edit-item {
    border-color: #ff7b00;
  }
</style>
