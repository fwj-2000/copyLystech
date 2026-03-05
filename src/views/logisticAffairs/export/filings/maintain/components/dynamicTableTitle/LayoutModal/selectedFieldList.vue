<template>
  <div class="p-12px">
    <div>
      <h2 class="text-16px font-bold mt-8px inline-block">
        {{ t('dict.CustomsAffairsMoldeRelative.selectedFields') }}
      </h2>
      <!-- <a-button v-if="!disabled && props.isKSLZ" type="primary" style="padding: 4px 10px; float: right" @click="addDeclElements">
        <PlusOutlined style="transform: translateY(-3px)" />
        {{ t('dict.CustomsAffairsFinalVersion.declElements') }}
      </a-button> -->
    </div>

    <a-input v-model:value="searchKeyword" class="w-full" @change="debounceSearchFn">
      <template #suffix>
        <SearchOutlined style="color: rgb(0 0 0 / 35%)" />
      </template>
    </a-input>
    <span class="selected-count"> {{ t('component.lydc.common.selected') }}: {{ props.data.length }} </span>
    <template v-if="dataList.length > 0">
      <ScrollContainer style="height: calc(100% - 96px)">
        <Draggable v-model="dataList" handle=".option-drag" :itemKey="getDraggableKey" @end="handleDragEnd">
          <template #item="{ element, index }">
            <div class="flex items-center justify-between option-drag cursor-move">
              <div class="flex-1 mt-10px w-0px">
                <div class="flex items-center justify-between mb-5px">
                  <span>{{ t(`dict.CAMoldeRelativeSystemField.${element.systemField}`) }}</span>
                  <span class="flex items-center">
                    <span class="mr-5px">{{ t('common.editText') }}</span>
                    <Switch v-model:checked="element.isUpdate" :checkedValue="1" :unCheckedValue="0" />
                  </span>
                </div>
                <LydcSelect
                  v-model:value="element.moldeField"
                  show-search
                  :fieldNames="{ value: 'enCode', label: 'fullName' }"
                  allowClear
                  :placeholder="t('common.selectPlaceholder')"
                  :options="allFieldList"
                  :filter-option="(input: string, option: any) => option.fullName.includes(input) || option.enCode.includes(input)"
                  style="width: 100%" />
              </div>
              <a-button v-if="!disabled" type="link" style="padding: 4px 10px" @click="() => deleteItem(element.uid)">
                <DeleteOutlined style="color: #ff4d4f" />
              </a-button>
            </div>
          </template>
        </Draggable>
      </ScrollContainer>
    </template>
    <template v-else>
      <lydc-empty />
    </template>
  </div>
</template>

<script lang="ts" setup>
  import { ref, onMounted, watch } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useBaseStore } from '/@/store/modules/base';
  import { useDebounceFn } from '@vueuse/core';
  import { buildUUID } from '/@/utils/uuid';
  // import { useMessage } from '/@/hooks/web/useMessage';

  import { ScrollContainer } from '/@/components/Container';
  import { SearchOutlined, DeleteOutlined /** PlusOutlined */ } from '@ant-design/icons-vue';
  import { Switch } from 'ant-design-vue';
  import { LydcSelect } from '/@/components/Lydc';
  import Draggable from 'vuedraggable';

  const { t } = useI18n();
  const baseStore = useBaseStore();
  // const { createMessage } = useMessage();

  const allFieldList = ref<Array<any>>([]);

  const props = defineProps({
    data: {
      type: Array as PropType<Array<{ moldeField: string; systemField: string; translateField: string; isUpdate: 0 | 1; uid: string }>>,
      default: () => [],
    },
    disabled: {
      type: Boolean,
      default: true,
    },
    /** 如果是`昆山立臻(KSLZ)`，则可以添加多个申报要素字段 */
    isKSLZ: {
      type: Boolean,
      default: false,
    },
  });

  const emits = defineEmits(['update:data']);

  const dataList = ref<Array<any>>([]);
  watch(
    () => props.data,
    () => {
      handleSearch();
    },
  );

  const searchKeyword = ref<string>('');
  function handleSearch() {
    dataList.value = searchKeyword.value
      ? props.data.filter(item => t(`dict.CAMoldeRelativeSystemField.${item.systemField}`).includes(searchKeyword.value))
      : [...props.data];
  }

  const debounceSearchFn = useDebounceFn(handleSearch, 800);

  function deleteItem(uid: string) {
    const index = getDataListIndexByUid(uid);
    const list = [...props.data];
    list.splice(index, 1);
    emits('update:data', list);
  }

  // function addDeclElements() {
  //   // 如果是`昆山立臻(KSLZ)`，则可以添加多个申报要素字段
  //   const list = [
  //     {
  //       moldeField: '',
  //       systemField: 'deNumber',
  //       translateField: '',
  //       isUpdate: 1,
  //     },
  //     {
  //       moldeField: '',
  //       systemField: 'deProject',
  //       translateField: '',
  //       isUpdate: 1,
  //     },
  //     {
  //       moldeField: '',
  //       systemField: 'deValue',
  //       translateField: '',
  //       isUpdate: 1,
  //     },
  //   ];

  //   // 最多只能存在14组申报要素的字段，判断`deNumber`、`deProject`、`deValue`是否有任意一个字段到达14个
  //   const fieldCountMap = { deNumber: 0, deProject: 0, deValue: 0 };
  //   const fieldList = ['deNumber', 'deProject', 'deValue'];
  //   for (const item of props.data) {
  //     if (fieldList.includes(item.systemField)) {
  //       fieldCountMap[item.systemField]++;
  //       if (fieldCountMap[item.systemField] >= 14) {
  //         return createMessage.warning(t('common.maximumQuantityTip', [14]));
  //       }
  //     }
  //   }

  //   emits('update:data', [...props.data, ...list]);
  // }

  /**
   * 或者拖曳元素的key
   * @param arg
   */
  function getDraggableKey(item: any) {
    if (!item.uid) {
      item.uid = buildUUID();
    }
    return item.uid;
  }

  function handleDragEnd() {
    emits(
      'update:data',
      [...props.data].sort((a, b) => getDataListIndexByUid(a.uid) - getDataListIndexByUid(b.uid)),
    );
  }

  function getDataListIndexByUid(uid: string) {
    return dataList.value.findIndex(item => item.uid === uid);
  }

  onMounted(() => {
    baseStore.getDictionaryData('CustomsAffairsMoldeField').then(res => {
      const list = (res as Array<any>) || [];
      allFieldList.value = [...(list || [])];
    });
  });
</script>

<style scoped lang="less">
  .selected-count {
    color: #1a1a1ab2;
  }
</style>
