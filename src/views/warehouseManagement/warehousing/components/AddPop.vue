<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    :showOkBtn="true"
    :showCancelBtn="true"
    :title="title"
    :destroyOnClose="true"
    :showFooter="false"
    @ok="handleSubmit">
    <template #centerToolbar>
      <a-button type="primary" ghost class="ml-12px" @click="setLocalCacheDataFn">{{ t('common.temporarySave') }} </a-button>
    </template>
    <div class="!h-400px">
      <div class="info" ref="AddTableRef">
        <div>{{ t('dict.CommonCol.creatorUserName') }}：{{ getUserInfo.userName }}/{{ getUserInfo.userAccount }} </div>
        <div>{{ t('dict.DepartmentColumn') }} ：{{ getUserInfo.departmentName || '--' }}</div>
        <div>{{ t('dict.CommonCol.creatorTime') }} ：{{ dayjs().format('YYYY-MM-DD') }} </div>
      </div>
      <div class="warp">
        <div class="warp-left">
          <Subtitle :title="t('dict.CommonCol.inventoryInformation')" />
        </div>
        <div class="warp-right">
          {{ t('common.addText2') }}:
          <FilteredInput class="!w-120px" v-model:value="row" :placeholder="t('common.inputText')" input-type="number" :min="1" :max="50" />
          <a-button class="!ml-14px" @click="debounceOnChange">{{ t('common.add1Text') }}</a-button>
        </div>
      </div>
      <AddTable :dataSource="state.tableData"></AddTable>
    </div>
  </BasicPopup>
</template>
<script lang="ts" setup>
  import { reactive, toRefs, unref, ref, nextTick, onMounted, computed } from 'vue';
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  import Subtitle from '/@/components/Subtitle/src/Subtitle.vue';
  import { MODULE_TEMPLATE, ADD_COLUMNS } from './config';
  import { buildBitUUID } from '/@/utils/uuid';
  import { useDebounceFn } from '@vueuse/core';
  import AddTable from './addTable.vue';
  import { useUserStore } from '/@/store/modules/user';
  import dayjs from 'dayjs';
  import { FilteredInput } from '/@/components/FilteredInput';
  import { addWarehouse, getdraftlist } from '/@/api/warehouse/warehouse';

  const userStore = useUserStore();
  const emits = defineEmits(['register', 'reload']);
  interface State {
    title: string;
    mouldNo: string;
    id: string;
    orgId: string;
    processRouteItem: any;
    bindMaterialList: any[];
    tableData: any[];
    fileList: any[];
    costcenterlist: [];
    factoryList: [];
    productTypelist: [];
    innermaterialnumberList: [];
  }

  const state = reactive<State>({
    mouldNo: '',
    title: '',
    id: '',
    orgId: '',
    processRouteItem: {},
    bindMaterialList: [],
    tableData: [],
    fileList: [],
    costcenterlist: [],
    factoryList: [],
    productTypelist: [],
    innermaterialnumberList: [],
  });
  const row = ref();
  const AddTableRef = ref();
  const { title } = toRefs(state);
  const { t } = useI18n();
  const { createMessage, createConfirm } = useMessage();
  const [registerPopup, { closePopup }] = usePopupInner(init);

  const getUserInfo = computed(() => userStore.getUserInfo);

  function setLocalCacheDataFn() {
    handleSubmit(0);
  }

  function validateTableForm() {
    let errorArr: any = [];
    for (let index = 0; index < state.tableData.length; index++) {
      const element = state.tableData[index];
      errorArr = ADD_COLUMNS.filter(o => {
        return !element[o.dataIndex] && o.dataIndex != 'transformTag';
      });
      if (errorArr.length) return errorArr;
    }
    return errorArr;
  }

  async function handleSubmit(type = 1) {
    const validateArr = await validateTableForm();
    const notRequiredField = ['描述', '备注'].includes(validateArr[0].title);
    if (validateArr.length && !notRequiredField) {
      return createMessage.warning(validateArr[0].title + t('sys.validate.textRequiredSuffix'));
    }
    try {
      const { code, msg } = await addWarehouse({ list: state.tableData, type });
      if (code === 200) {
        state.tableData = [];
        closePopup();
        createMessage.success(msg);
        emits('reload');
      }
    } catch (error) {
      console.error(error, 'handleSubmit');
    }
  }

  function init({ data, title }) {
    state.title = title;
    state.tableData = data ? [data] : [];
    if (!state.tableData.length) getDraftlistFn();
  }

  const debounceOnChange = useDebounceFn(value => {
    addTableRowsFn(value);
  }, 200);

  function addTableRowsFn(arr: any = []) {
    let lens = 0;
    if (arr && arr.length) {
      lens = arr.length;
    } else {
      lens = row.value;
    }
    const data: any = [];
    for (let i = 0; i < lens; i++) {
      const obj = { ...MODULE_TEMPLATE, id: buildBitUUID() };
      if (arr.length) {
        obj.moldNo = arr[i];
      }
      data.push(obj);
    }

    state.tableData = state.tableData.concat(data);
    unref(AddTableRef)?.setTableData(state.tableData);
  }

  async function getDraftlistFn() {
    try {
      const { data, code } = await getdraftlist({});
      if (code === 200) {
        if (data?.length) {
          state.tableData = data;
        } else {
          state.tableData = [{ ...MODULE_TEMPLATE, id: 1 }];
        }
      }
    } catch (error) {
      console.error(error, 'getDraftlistFn:error');
    }
  }
</script>

<style lang="less" scoped>
  .info {
    display: flex;
    padding: 10px 22px;

    div {
      margin-right: 22px;
    }
  }

  .warp {
    display: flex;
    align-items: baseline;
    flex-wrap: nowrap;
    position: relative;
    padding: 0 10px;
    box-sizing: border-box;

    &-btn {
      display: flex;
      align-items: center;
    }

    &-left {
      flex: 1;
      display: flex;
      align-items: baseline;
      padding: 0 12px;
      min-width: 400px;
      flex-wrap: nowrap;
    }

    &-right {
      display: flex;
      align-items: center;
    }
  }

  .table-box {
    height: 100%;
    background-color: rgb(88 105 132);
  }
</style>
