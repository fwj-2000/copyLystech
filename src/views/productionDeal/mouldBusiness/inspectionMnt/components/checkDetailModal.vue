<template>
  <BasicModal v-bind="$attrs" @register="registerModal" showOkBtn @ok="handleSubmit">
    <template #title>
      <Subtitle title="检测清单" style="padding-bottom: 0" />
    </template>
    <div style="height: 400px">
      <a-checkbox v-model:checked="selectAll" @change="onSelectAllChangeFn">全选</a-checkbox>
      <Descriptions bordered class="pt-10px" :columns="24">
        <DescriptionsItem v-for="item in state.groupbylist" :key="item.code" :span="12">
          <template #label>
            <a-checkbox v-model:checked="item.checked" @change="onCheckClassCheckedFn(item)">{{ item.checkClass }}</a-checkbox>
          </template>
          <a-checkbox-group v-model:value="item.checkedArr" :options="transformOptionsFn(item.list)" @change="onCheckClassItemCheckedFn(item)" />
        </DescriptionsItem>
      </Descriptions>
    </div>
  </BasicModal>
</template>

<script setup lang="ts">
  import { computed, reactive, ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useBaseStore } from '/@/store/modules/base';
  import { Subtitle } from '/@/components/Subtitle';
  import { Descriptions, DescriptionsItem } from 'ant-design-vue';
  import { getGroupbylist } from '/@/api/productionDeal/badCode';

  const baseStore = useBaseStore();
  const { createMessage } = useMessage();
  const emit = defineEmits(['register', 'reload', 'onSelect']);
  interface State {
    groupbylist: any;
  }
  const state = reactive<State>({
    groupbylist: [],
  });
  const selectAll = ref(false);
  const [registerModal, { closeModal, changeLoading, changeOkLoading }] = useModalInner(init);

  function onCheckClassCheckedFn(item) {
    if (item.checked) {
      item.checkedArr = item.list.map(item => {
        return item.Code;
      });
      console.log(item, '选择队长');
    } else {
      item.checkedArr = [];
    }
  }

  function onCheckClassItemCheckedFn(item) {
    item.checked = item.checkedArr.length == item.list.length;
  }

  function onSelectAllChangeFn(e) {
    state.groupbylist = state.groupbylist.map(item => {
      item.checked = selectAll.value;
      if (selectAll.value) {
        item.checkedArr = item.list.map(j => {
          return j.Code;
        });
      } else {
        item.checkedArr = [];
      }
      return item;
    });
  }

  async function init({ dataSource, checkDetail = '' }) {
    state.groupbylist = dataSource;
    if (!dataSource) return;
    state.groupbylist = dataSource.map((item, i) => {
      item.checkedArr = item.list.map(item => {
        if (checkDetail.includes(item.Code)) {
          return item.Code;
        }
      });
      item.checked = item.checkedArr.length === item.list.length && !item.checkedArr.includes(undefined);
      return item;
    });
    console.log(state.groupbylist, ' state.groupbylist ');
  }

  function transformOptionsFn(data) {
    return data.map(item => {
      return { label: item.Description, value: item.Code };
    });
  }
  //提交
  function handleSubmit() {
    closeModal();
    emit('onSelect', state.groupbylist);
  }
</script>
