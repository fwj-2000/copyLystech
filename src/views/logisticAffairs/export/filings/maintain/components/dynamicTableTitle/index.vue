<template>
  <div class="flex" style="width: 400px">
    <div class="flex mr-5px"> {{ t('views.filings.customerText') }}: </div>
    <LydcSelect
      ref="selectRef"
      v-model:value="state.currentId"
      show-search
      :fieldNames="{ value: 'id', label: 'moldeName' }"
      style="width: 350px"
      allowClear
      :placeholder="t('common.selectPlaceholder')"
      :filter-option="false"
      :options="options"
      @search="debounceSearchFn"
      @change="change">
      <template #dropdownRender="{ menuNode: menu }">
        <v-nodes :vnodes="menu" />
        <div v-auth="'btn_edit'" v-if="props.type == 'edit'">
          <a-divider style="margin: 4px 0" />
          <div style="padding: 4px 8px; cursor: pointer" @mousedown="e => e.preventDefault()" @click="addItem">
            <a-button class="w-full">{{ t('common.editText') }}</a-button>
          </div>
        </div>
      </template>
      <template v-if="state.loading" #suffixIcon>
        <LoadingOutlined />
      </template>
    </LydcSelect>

    <LayoutModal ref="layoutModalRef" @register="registerModal" @reload="reload"></LayoutModal>
  </div>
</template>

<script lang="ts" setup>
  import { reactive, ref, onMounted, defineComponent } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { getCustomsAffairsMoldeRelativeList } from '/@/api/logisticAffairs/customsAffairsMake';
  import { useModal } from '/@/components/Modal';
  import { useDebounceFn } from '@vueuse/core';

  import { LydcSelect } from '/@/components/Lydc';
  import LayoutModal from './LayoutModal/index.vue';
  import { LoadingOutlined } from '@ant-design/icons-vue';

  const props = defineProps({
    type: {
      type: String,
      default: 'edit',
    },
  });

  const { t } = useI18n();

  const emit = defineEmits(['change', 'reload']);

  const state = reactive({
    templateList: [],
    currentId: '',
    loading: false,
  });

  const options = ref<Array<any>>([]);

  const change = (_e: string, data: any) => {
    // 拿到模板对应的值，传到父组件
    emit('change', data?.id, data);
  };

  const selectRef = ref<any>();
  const [registerModal, { openModal }] = useModal();
  const addItem = () => {
    selectRef.value?.getSelectRef().blur();
    setTimeout(() => {
      openModal(true, {});
    }, 180);
  };

  const searchKeyWord = ref('');
  const handleSearch = async (val: string) => {
    searchKeyWord.value = val;
    state.loading = true;
    return getCustomsAffairsMoldeRelativeList({ keyword: val })
      .then(res => {
        options.value = res.data.list;
      })
      .finally(() => {
        state.loading = false;
      });
  };

  const debounceSearchFn = useDebounceFn(handleSearch, 800);

  const reload = async () => {
    await handleSearch(searchKeyWord.value);
    emit('reload', state.templateList);
  };

  onMounted(() => {
    handleSearch('');
  });
</script>

<script lang="ts">
  export default defineComponent({
    components: {
      VNodes: (_, { attrs }) => {
        return attrs.vnodes;
      },
    },
  });
</script>
