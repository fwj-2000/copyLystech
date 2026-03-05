<template>
  <BasicModal :width="720" v-bind="$attrs" @register="registerModal" canFullscreen draggable :title="t('dict.ECN.Dept')" @ok="handleSubmit" destroy-on-close>
    <div class="wrapper">
      <a-checkbox-group
        v-model:value="value"
        @change="
          e => {
            if (!e.includes('16')) {
              otherValue = '';
            }
          }
        "
        style="width: 100%">
        <a-checkbox v-for="item in checkList" :value="item.enCode">{{ item.fullName }} </a-checkbox>
      </a-checkbox-group>
      <a-input :placeholder="t('common.inputPlaceholder')" v-if="value.includes('16')" style="width: 60%" v-model:value="otherValue" />
    </div>
  </BasicModal>
</template>

<script setup lang="ts">
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { onMounted, reactive, toRefs } from 'vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { usePermission } from '/@/hooks/web/usePermission';
  import Template from '/@/views/engineering/pcc/pccApply/components/Template.vue';
  import { useBaseStore } from '/@/store/modules/base';

  const { t } = useI18n();
  const { createMessage } = useMessage();
  const { hasBtnP } = usePermission();
  const emit = defineEmits(['submit', 'register']);

  const [registerModal, { closeModal, changeLoading, changeOkLoading }] = useModalInner(init);

  const baseStore = useBaseStore();

  const state = reactive({
    checkList: [],
    value: [],
    otherValue: '',
    type: '',
  });

  const { checkList, value, otherValue } = toRefs(state);

  onMounted(() => {
    getTypeOps();
  });

  async function getTypeOps() {
    state.checkList = await baseStore.getDictionaryData('ECN.Dept');
  }

  function init(data) {
    console.log(data);
    state.type = data.type || 'default';
    state.countersignList = data.countersignList;
    state.value = [];
    data.countersignList.map(item => {
      state.value.push(item.key);
      if (item.key == 16) {
        state.otherValue = item.value;
      }
    });
  }

  function handleSubmit() {
    const data = [];
    state.checkList.forEach(item => {
      state.value.forEach(value => {
        if (item.enCode === value) {
          const target = {
            key: item.enCode,
            value: item.fullName,
            otherValue: '',
          };
          const prop = state.countersignList.find(item => item.key === value);
          if (prop) {
            target.userId = prop.userId;
          }
          if (item.enCode == 16) {
            target.value = state.otherValue || item.fullName;
          }
          data.push(target);
        }
      });
    });
    emit('submit', {
      countersignList: data,
      type: state.type,
    });
  }
</script>

<style lang="less" scoped>
  .wrapper {
    height: 400px;
  }

  :deep(.ant-checkbox-wrapper) {
    margin: 5px 8px 5px 0;
  }
</style>
