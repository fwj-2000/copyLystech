<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    @ok="handleSaveAction"
    :cancelButtonProps="{ class: 'ml-12px' }"
    :title="title"
    showOkBtn
    :okText="t('common.saveText')"
    destroyOnClose>
    <template #insertToolbar>
      <AddCustomRows class="ml-12px" @submit="addColumn" />
    </template>
    <div class="form-pd">
      <BasicTable @register="registerTable" :dataSource="state.tableList">
        <template #bodyCell="{ column, index }">
          <template v-if="column.key != 'action'">
            <template v-if="column.compType == 'Input'">
              <lydc-input v-model:value="state.tempList[index][column.dataIndex]" :disabled="column?.disabled || state.type == 'view'" />
            </template>
            <template v-if="column.compType == 'Select'">
              <lydc-select
                v-model:value="state.tempList[index][column.dataIndex]"
                :options="column.options || state[column.optionsName]"
                :defaultValue="column.defaultValue"
                :fieldNames="{ value: 'enCode', label: 'fullName' }"
                :disabled="column?.disabled || state.type == 'view'"
                :placeholder="t('common.selectPlaceholder')" />
            </template>

            <template v-if="column.compType == 'ApiSelect'">
              <ApiSelect
                v-model:value="state.tempList[index][column.dataIndex]"
                :api="getFactoryList"
                :filterOption="false"
                :allowClear="true"
                showSearch
                :apiSearch="{ show: true, searchName: 'factory' }"
                resultField="data"
                labelField="Name"
                valueField="Code"
                :nameFormat="['Code', '/', 'Name']" />
            </template>
          </template>
          <template v-else>
            <TableAction :actions="getTableActions(index)" />
          </template>
        </template>
      </BasicTable>
    </div>
  </BasicPopup>
</template>
<script lang="ts" setup>
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { onMounted, reactive, computed } from 'vue';
  import { cloneDeep } from 'lodash-es';
  import { BasicColumn, BasicTable, useTable, TableAction, ActionItem } from '/@/components/Table';
  import { addSapFactory } from '/@/api/basicData/sap';
  import { getFactoryList } from '/@/api/customerSerivce';
  import { useBaseStore } from '/@/store/modules/base';
  import ApiSelect from '/@/components/Form/src/components/ApiSelect.vue';
  import { useI18n } from 'vue-i18n';
  import { AddCustomRows } from '/@/components/AddCustomRows';
  import { useMessage } from '/@/hooks/web/useMessage';
  const { createMessage } = useMessage();

  const baseStore = useBaseStore();
  const { t } = useI18n();

  const title = computed(() => {
    return (state.type == 'add' ? t('common.add2Text') : t('common.editText')) + t('dict.Module');
  });

  const emit = defineEmits(['register', 'reload']);
  const [registerPopup, { closePopup, changeLoading }] = usePopupInner(init);
  interface StateType {
    tempList: any[];
    tableList: any[];
    type: 'edit' | 'add' | 'view';
    moduleCodeList: any[];
    factoryTypeList: any[];
    factoryMaterialTypeList: any[];
  }

  const templateState = [
    {
      FactoryCode: '',
      Code: '',
      Type: '',
      Remark: '',
    },
  ];

  const state = reactive<StateType>({
    tempList: cloneDeep(templateState),
    tableList: cloneDeep(templateState),
    type: 'add',
    moduleCodeList: [],
    factoryTypeList: [],
    factoryMaterialTypeList: [],
  });

  const columns: BasicColumn[] = [
    {
      title: '工厂代码',
      dataIndex: 'FactoryCode',
      i18nField: 'factoryCode',
      width: 180,
      compType: 'ApiSelect',
      componentProps: { placeholder: '/' },
    },
    {
      title: 'SAP工厂名称',
      dataIndex: 'Name',
      width: 180,
      compType: 'Input',
      componentProps: { placeholder: '/' },
    },
    {
      title: 'SAP代码',
      dataIndex: 'Code',
      i18nField: 'code',
      width: 170,
      compType: 'Input',
      componentProps: { placeholder: '/' },
    },
    {
      title: 'SAP公司代码',
      dataIndex: 'SapCompanyCode',
      i18nField: 'sapCompanyCode',
      width: 170,
      compType: 'Input',
      componentProps: { placeholder: '/' },
    },
    {
      title: 'SAP公司名称',
      dataIndex: 'SapCompanyName',
      i18nField: 'sapCompanyName',
      width: 170,
      compType: 'Input',
      componentProps: { placeholder: '/' },
    },
    {
      title: 'PCC文件编码前缀',
      dataIndex: 'PccPrefix',
      i18nField: 'pccPrefix',
      width: 170,
      compType: 'Input',
      componentProps: { placeholder: '/' },
    },
    {
      title: '工厂类型',
      dataIndex: 'Type',
      i18nField: 'type',
      width: 170,
      compType: 'Select',
      optionsName: 'factoryTypeList',
    },
    {
      title: '业务类型',
      dataIndex: 'MaterialType',
      i18nField: 'materialType',
      width: 170,
      compType: 'Select',
      optionsName: 'factoryMaterialTypeList',
    },
    {
      title: '备注',
      dataIndex: 'Remark',
      i18nField: 'remark',
      width: 200,
      compType: 'Input',
    } as any,
  ];
  const [registerTable, { setProps }] = useTable({
    columns,
    immediate: false,
    useSearchForm: false,
    showTableSetting: false,
    pagination: false,
    i18nConfig: {
      moduleCode: 'FactorySapColumn',
    },
  });
  function getTableActions(index): ActionItem[] {
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
    state.tableList.push({
      ...cloneDeep(templateState[0]),
    });
    state.tempList.push({
      ...cloneDeep(templateState[0]),
    });
  }

  async function init(data) {
    changeLoading(true);
    state.type = data.type || 'add';
    setProps({
      actionColumn: {
        dataIndex: 'action',
        width: 80,
        title: t('common.action'),
      },
    });
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
    console.log(state.tempList, 'state.tempList');
    // 验证业务类型是否为空
    for (let i = 0; i < _data.length; i++) {
      const item = _data[i];
      if (!item.MaterialType || item.MaterialType?.trim?.() === '') {
        createMessage.error(`业务类型为必填项`);
        return;
      }
    }
    // 验证通过后再提交
    const r = await addSapFactory(_data);
    if (r.code === 200) {
      closePopup();
      createMessage.success(r.msg);
      emit('reload');
    }
  }

  onMounted(async () => {
    const list = await baseStore.getDictionaryData('SapFactoryMaterial');
    state.factoryTypeList = (await baseStore.getDictionaryData('SapFactoryType')) || [];
    state.factoryMaterialTypeList = list;
  });
</script>
<style scoped lang="less">
  .form-pd {
    padding: 12px 24px;
  }
</style>
