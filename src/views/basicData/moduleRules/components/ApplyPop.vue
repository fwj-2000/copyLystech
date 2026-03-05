<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    @ok="handleSaveAction"
    :title="state.type == 'add' ? t('common.add2Text') : t('common.editText')"
    showOkBtn
    :okText="t('common.submitText')"
    destroyOnClose>
    <template #insertToolbar>
      <AddCustomRows v-if="state.type == 'add'" @submit="addColumn" />
    </template>
    <div class="form-pd">
      <BasicTable @register="registerTable" :dataSource="state.tableList">
        <template #bodyCell="{ column, index, record }">
          <template v-if="column.key != 'action'">
            <template v-if="column.compType == 'Input'">
              <lydc-input v-model:value="state.tempList[index][column.dataIndex]" :disabled="column?.disabled || state.type == 'view'" />
            </template>
            <template v-if="column.compType == 'ApiSelect'">
              <ApiSelect
                :api="getNameList"
                :show-search="true"
                :api-search="{
                  show: true,
                  searchName: 'Name',
                }"
                v-model:value="state.tempList[index][column.dataIndex]"
                result-field="data"
                value-field="Name"
                label-field="Name"
                :filter-option="false"
                :not-found-content="null"
                :immediate="true" />
            </template>
            <template v-if="column.compType == 'Select'">
              <lydc-select
                v-model:value="state.tempList[index][column.dataIndex]"
                :options="column.options || state[column.optionsName]"
                :defaultValue="column.defaultValue"
                :fieldNames="{
                  value: 'enCode',
                  label: 'Label',
                }"
                :disabled="column?.disabled || state.type == 'view'"
                @change="(id, data) => onChange(index, column, id, data)" />
            </template>
            <template v-if="column.dataIndex == 'ModuleFullName'">
              {{ state.tempList[index][column.dataIndex] || t('dict.CommonCol.fromSysTip') }}
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
  import { reactive, toRefs } from 'vue';
  import { message } from 'ant-design-vue';
  import { cloneDeep, debounce } from 'lodash-es';
  import { BasicColumn, BasicTable, useTable, TableAction, ActionItem } from '/@/components/Table';
  import { getNameList, update, create } from '/@/api/basicData/moduleRules';
  import ApiSelect from '/@/components/Form/src/components/ApiSelect.vue';
  import { useBaseStore } from '/@/store/modules/base';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { AddCustomRows } from '/@/components/AddCustomRows';
  const { t } = useI18n();
  const baseStore = useBaseStore();

  const emit = defineEmits(['register', 'reload']);
  const [registerPopup, { closePopup, changeLoading }] = usePopupInner(init);

  interface StateType {
    tempList: any[];
    tableList: any[];
    type: 'edit' | 'add' | 'view';
    moduleCodeList: any[];
  }

  const templateState = [
    {
      ModuleEnCode: '',
      IDField: '',
      RuleName: '',
      ModuleFullName: '',
    },
  ];

  const state = reactive<StateType>({
    tempList: cloneDeep(templateState),
    tableList: cloneDeep(templateState),
    type: 'add',
    moduleCodeList: [],
  });

  const columns: BasicColumn[] = [
    {
      title: '模块编码',
      dataIndex: 'ModuleEnCode',
      width: 180,
      compType: 'Select',
      optionsName: 'moduleCodeList',
    },
    {
      title: 'ID字段',
      dataIndex: 'IDField',
      width: 170,
      compType: 'Input',
    },
    {
      title: '规则名称',
      dataIndex: 'RuleName',
      width: 170,
      compType: 'ApiSelect',
    },
    {
      title: '模块名称',
      dataIndex: 'ModuleFullName',
      width: 200,
    },
  ];
  const [registerTable, { reload }] = useTable({
    columns,
    immediate: false,
    useSearchForm: false,
    showTableSetting: false,
    pagination: false,
    i18nConfig: {
      moduleCode: 'BusinessRuleColumn',
    },
  });
  function getTableActions(index, Record) {
    if (state.type == 'add' || state.type == 'edit') {
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
  }
  function handleDelete(index) {
    state.tableList.splice(index, 1);
    state.tempList.splice(index, 1);
  }
  function handleCopy(index) {
    state.tableList.push(cloneDeep(state.tempList[index]));
    state.tempList.push(cloneDeep(state.tempList[index]));
  }
  function handleEdit(id, index) {
    // openPopup(true, {
    //   id,
    //   index,
    //   ids: state.tableList.map(el => {
    //     return el.id;
    //   }),
    // });
  }
  function addColumn() {
    state.tableList.push({
      ...cloneDeep(templateState[0]),
    });
    state.tempList.push({
      ...cloneDeep(templateState[0]),
    });
  }

  async function onChange(index, column, e, data?: any) {
    // state.tempList[index][column.dataIndex] = e.target.value;
    if (column.compType == 'Select') {
      state.tempList[index].ModuleFullName = data.fullName;
    }
  }

  async function init(data) {
    changeLoading(true);
    state.type = data.type || 'add';
    state.tableList = cloneDeep(data.list || templateState);
    state.tempList = cloneDeep(data.list || templateState);
    state.moduleCodeList = ((await baseStore.getDictionaryData('Module')) as any[]).map(item => {
      item.Label = item.enCode + '/' + item.fullName;
      return item;
    });
    setTimeout(() => {
      changeLoading(false);
    }, 100);
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
<style scoped lang="less">
  .form-pd {
    padding: 12px 24px;
  }
</style>
