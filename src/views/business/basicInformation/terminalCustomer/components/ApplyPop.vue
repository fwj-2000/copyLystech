<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    @ok="handleSaveAction"
    :title="state.type == 'add' ? t('common.addText') : t('common.editText')"
    showOkBtn
    :okText="t('common.submit')"
    :okButtonProps="{ class: 'mr-12px' }"
    destroyOnClose>
    <div>
      <div class="flex justify-between p-10px pt-0">
        <Subtitle placement="vxe" :title="t('common.terminalInfo')"></Subtitle>
        <div class="flex" v-if="state.type == 'add'">
          <AddCustomRows @submit="addColumn" />
        </div>
      </div>
      <BasicTable @register="registerTable" :dataSource="state.tableList">
        <template #bodyCell="{ column, index, record }">
          <template v-if="column.compType == 'ApiSelect'">
            <ApiSelect
              :api="getCodeList"
              :show-search="false"
              :params="{ mainProcess: state.tempList[index].mainProcess }"
              v-model:value="state.tempList[index][column.dataIndex]"
              result-field="data"
              value-field="id"
              label-field="fullName"
              :filter-option="false"
              :not-found-content="null"
              :immediate="true" />
          </template>
          <template v-if="column.key != 'action'">
            <template v-if="column.compType == 'Input'">
              <lydc-input v-model:value="state.tempList[index][column.dataIndex]" :disabled="column?.disabled || state.type == 'view'" />
            </template>
            <template v-if="column.compType == 'Select'">
              <lydc-select
                v-model:value="state.tempList[index][column.dataIndex]"
                :options="column.options || state[column.optionsName]"
                :defaultValue="column.defaultValue"
                :disabled="column?.disabled || state.type == 'view' || (state.type == 'add' && column.dataIndex === 'status')"
                @change="(id, data) => onChange(index, column, id)" />
            </template>
          </template>
          <template v-else>
            <TableAction :actions="getTableActions(index, record)" />
          </template>
        </template>
      </BasicTable>
    </div>
  </BasicPopup>
</template>
<script lang="ts" setup>
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { onMounted, reactive } from 'vue';
  import { cloneDeep } from 'lodash-es';
  import { BasicColumn, BasicTable, useTable, TableAction, ActionItem } from '/@/components/Table';
  import { update, create, getDetail, getCodeList } from '/@/api/business/terminalCustomer';
  import ApiSelect from '/@/components/Form/src/components/ApiSelect.vue';
  import { StatusList } from '../config';
  import { getMainProcess } from '/@/utils/business/index';
  import { useI18n } from 'vue-i18n';
  import { Subtitle } from '/@/components/Subtitle';
  import { AddCustomRows } from '/@/components/AddCustomRows';

  const { t } = useI18n();

  const emit = defineEmits(['register', 'reload']);
  const [registerPopup, { closePopup, changeLoading }] = usePopupInner(init);

  interface StateType {
    tempList: any[];
    tableList: any[];
    type: 'edit' | 'add' | 'view';
    mainProcessList: any[];
    line: number;
  }

  const templateState = [
    {
      remarks: '',
      status: 1,
      terminalCustomerCode: '',
      terminalCustomerName: '',
      terminalCustomerFullName: '',
      mainProcess: 1,
    },
  ];

  const state = reactive<StateType>({
    tempList: cloneDeep(templateState),
    tableList: cloneDeep(templateState),
    type: 'add',
    mainProcessList: [],
    line: 1,
  });

  onMounted(async () => {
    state.mainProcessList = await getMainProcess(1);
  });

  const columns: BasicColumn[] = [
    {
      title: '主要制程',
      dataIndex: 'mainProcess',
      width: 170,
      compType: 'Select',
      optionsName: 'mainProcessList',
    },
    {
      title: '编码',
      dataIndex: 'terminalCustomerCode',
      width: 180,
      compType: 'ApiSelect',
    },
    {
      title: '简称',
      dataIndex: 'terminalCustomerName',
      width: 170,
      compType: 'Input',
    },
    {
      title: '全称',
      dataIndex: 'terminalCustomerFullName',
      width: 200,
      compType: 'Input',
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 200,
      compType: 'Select',
      options: StatusList,
    },
    {
      title: '备注',
      dataIndex: 'remarks',
      width: 170,
      compType: 'Input',
    },
  ];
  const [registerTable, { setProps }] = useTable({
    columns,
    immediate: false,
    useSearchForm: false,
    showTableSetting: false,
    resizeHeightOffset: 20,
    pagination: false,
    i18nConfig: {
      moduleCode: 'TerminalCustomerColumn',
    },
  });
  function getTableActions(index, Record): ActionItem[] {
    if (state.type == 'add') {
      return [
        {
          icon: 'icon-ym icon-ym-btn-copy',
          onClick: handleCopy.bind(null, index),
        },
        {
          color: 'error',
          icon: 'icon-ym icon-ym-delete',
          disabled: state.tableList.length <= 1,
          modelConfirm: {
            onOk: handleDelete.bind(null, index),
          },
        },
      ];
    }
    return [];
  }
  function handleDelete(index) {
    state.tableList.splice(index, 1);
    state.tempList.splice(index, 1);
  }
  function handleCopy(index) {
    state.tableList.splice(index, 0, cloneDeep(state.tempList[index]));
    state.tempList.splice(index, 0, cloneDeep(state.tempList[index]));
  }
  function addColumn() {
    for (let i = 0; i < state.line; i++) {
      state.tableList.push({
        ...cloneDeep(templateState[0]),
      });
      state.tempList.push({
        ...cloneDeep(templateState[0]),
      });
    }
  }

  function onChange(index, column, e) {
    state.tempList[index][column.dataIndex] = e;
    if (column.dataIndex == 'mainProcess') {
      state.tempList[index].terminalCustomerCode = '';
      state.tableList[index].terminalCustomerCode = '';
    }
  }
  async function getDetailAPI(id) {
    const r = await getDetail(id);
    if (r.code == 200) {
      state.tableList = [cloneDeep(r.data)];
      state.tempList = [cloneDeep(r.data)];
    }
    changeLoading(false);
  }

  async function init(data) {
    changeLoading(true);
    state.type = data.type || 'add';
    if (data.id) {
      getDetailAPI(data.id);
    } else {
      setProps({
        actionColumn: {
          dataIndex: 'action',
          width: 80,
          title: t('common.action'),
        },
      });
      state.tableList = cloneDeep(templateState);
      state.tempList = cloneDeep(templateState);
      changeLoading(false);
    }
  }

  async function handleSaveAction() {
    let _data = state.tempList;
    let methods = create;
    if (state.type != 'add') {
      methods = update;
      _data = _data[0];
    }
    const r = await methods(_data);
    if (r.code === 200) {
      closePopup();
      emit('reload');
    }
  }
</script>
