<template>
  <div class="p-12px">
    <h2 class="text-16px font-bold mt-8px">
      {{ t('dict.CustomsAffairsMoldeRelative.fieldSelection') }}
    </h2>

    <a-input v-model:value="searchKeyword" class="w-full mb-5px" @change="debounceSearchFn">
      <template #suffix>
        <SearchOutlined style="color: rgb(0 0 0 / 35%)" />
      </template>
    </a-input>
    <template v-if="fieldList.length > 0">
      <!-- <a-checkbox :indeterminate="isIndeterminate" :disabled="props.disabled" v-model:checked="checkAll" class="mt-10px" @change="handleCheckAllChange"
        >{{ t('common.selectAll') }}
      </a-checkbox> -->
      <ScrollContainer style="height: calc(100% - 84px)">
        <!-- <a-checkbox-group v-model:value="checkedList" :disabled="props.disabled" class="options-list" @change="handleCheckedChange">
          <a-checkbox v-for="item in fieldList" :key="item.enCode" :value="item.enCode" class="options-item">
            <span :title="item.fullName">{{ item.fullName }}</span>
          </a-checkbox>
        </a-checkbox-group> -->
        <a-button
          v-for="item in fieldList"
          :key="item.enCode"
          :type="checkedList.includes(item.enCode) ? 'link' : 'text'"
          :disabled="props.disabled"
          class="options-item">
          <span>{{ item.fullName }}</span>
          <span>
            <PlusOutlined class="btn-icon" :title="t('common.add1Text')" @click="handleAdd(item.enCode)" />
            <!-- <DeleteOutlined
              class="btn-icon"
              :title="t('common.delText')"
              :style="{ color: props.disabled ? '' : '#ed6f6f' }"
              @click="handleDelete(item.enCode)" /> -->
          </span>
        </a-button>
      </ScrollContainer>
    </template>
    <template v-else>
      <lydc-empty />
    </template>
  </div>
</template>

<script lang="ts" setup>
  import { ref, onMounted, watch, toRaw } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useBaseStore } from '/@/store/modules/base';
  import { useDebounceFn } from '@vueuse/core';
  import { useMessage } from '/@/hooks/web/useMessage';

  import { ScrollContainer } from '/@/components/Container';
  import { SearchOutlined, PlusOutlined } from '@ant-design/icons-vue';

  const props = defineProps({
    data: {
      type: Array as PropType<Array<{ systemField: string; moldeField: string; translateField: string; isUpdate: 0 | 1 }>>,
      default: () => [],
    },
    disabled: {
      type: Boolean,
      default: true,
    },
  });

  const emits = defineEmits(['update:data']);

  const { t } = useI18n();
  const baseStore = useBaseStore();
  const { createMessage } = useMessage();

  const allFieldList = ref<Array<any>>([]);
  const fieldList = ref<Array<any>>([]);
  // const isIndeterminate = ref<boolean>(false);
  // const checkAll = ref<boolean>(false);
  const checkedList = ref<string[]>([]);

  watch(
    () => props.data,
    () => {
      checkedList.value = props.data.map(item => item.systemField);
    },
    { immediate: true, deep: true },
  );

  const searchKeyword = ref<string>('');
  function handleSearch() {
    fieldList.value = searchKeyword.value ? allFieldList.value.filter(item => item.fullName.includes(searchKeyword.value)) : [...allFieldList.value];
    // handleCheckedChange(checkedList.value);
  }

  const debounceSearchFn = useDebounceFn(handleSearch, 800);

  // 选中所有的值
  // function handleCheckAllChange(e) {
  //   const val = e.target.checked;
  //   checkedList.value = val ? fieldList.value.map(o => o.enCode) : [];
  //   isIndeterminate.value = !val;

  //   formatFiltetSetValue();

  //   emitUpdateData();
  // }

  // function handleCheckedChange(val: string[]) {
  //   const checkedCount = val.length;
  //   checkAll.value = checkedCount === fieldList.value.length;
  //   isIndeterminate.value = !!checkedCount && checkedCount < fieldList.value.length;
  //   formatFiltetSetValue();
  //   emitUpdateData();
  // }

  // function formatFiltetSetValue() {
  //   // 存在搜索项时，特殊处理
  //   if (searchKeyword.value) {
  //     const val = checkedList.value;
  //     const originList = props.data.reduce((list: Array<string>, item) => {
  //       if (fieldList.value.every(o => o.enCode !== item.systemField)) {
  //         list.push(item.systemField);
  //       }
  //       return list;
  //     }, []);
  //     const newList = val.filter(item => !originList.includes(item));
  //     checkedList.value = [...originList, ...newList];
  //   }
  // }

  // function emitUpdateData() {
  //   const propsData = props.data;
  //   let index = -1;
  //   // 允许重复字段，需要结合下标获取对应的元素
  //   const list = checkedList.value.map(item => {
  //     const target = propsData.find((o, i) => {
  //       const flag = o.systemField === item;
  //       if (flag) {
  //         const flag2 = i > index;
  //         index = flag2 ? i : index;
  //         return flag2;
  //       }

  //       return flag;
  //     });
  //     if (target) return target;

  //     return {
  //       moldeField: '',
  //       systemField: item,
  //       translateField: '',
  //       isUpdate: 1,
  //     };
  //   });

  //   emits('update:data', list);
  // }

  /**
   * 新增
   * @param enCode
   */
  function handleAdd(enCode: string) {
    if (props.disabled) {
      return false;
    }

    // 统计当前已选数据中，存在相同`enCode`的数量，最多只存在14个相同的
    const count = props.data.filter(item => item.systemField === enCode).length;
    if (count >= 14) {
      createMessage.warning(t('common.maximumQuantityTip', [14]));
      return false;
    }

    emits('update:data', [...toRaw(props.data), { moldeField: '', systemField: enCode, translateField: '', isUpdate: 1 }]);
    createMessage.success(t('sys.api.operationSuccess'));
  }

  /** 删除 */
  // function handleDelete(enCode: string) {
  //   if (props.disabled) {
  //     return false;
  //   }

  //   emits(
  //     'update:data',
  //     props.data.filter(item => item.systemField !== enCode),
  //   );
  //   createMessage.success(t('sys.api.operationSuccess'));
  // }

  onMounted(() => {
    baseStore.getDictionaryData('CAMoldeRelativeSystemField').then(res => {
      const list = (res as Array<any>) || [];
      fieldList.value = list;
      allFieldList.value = [...(list || [])];
    });
  });
</script>

<style lang="less" scoped>
  :deep(.ant-checkbox-group.options-list) {
    white-space: break-spaces;
    width: 100%;
    overflow: hidden;
  }

  :deep(.options-item) {
    width: 100%;
    cursor: auto;
    display: flex;
    align-items: center;
    justify-content: space-between;

    // +.options-item {
    //   margin-top: 5px;
    // }

    .btn-icon {
      cursor: pointer;
      transition: opacity 0.2s;

      + .btn-icon {
        margin-left: 5px;
      }

      &:hover {
        opacity: 0.6;
      }
    }

    // .ant-checkbox + span {
    //   display: inline-block;
    //   width: 100%;
    //   overflow: hidden;
    //   text-overflow: ellipsis;
    //   white-space: nowrap;
    // }
  }
</style>
