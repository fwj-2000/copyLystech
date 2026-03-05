<template>
  <BasicModal v-bind="$attrs" @register="registerModal" title="配置表单" :width="600" @ok="handleSubmit" class="add-config-modal">
    <a-form :colon="false" labelAlign="left" :labelCol="{ style: { width: '70px' } }">
      <a-form-item label="弹窗标题">
        <a-input v-model:value="dataForm.popupTitle" placeholder="请输入弹窗标题" />
      </a-form-item>
      <a-form-item label="弹窗类型">
        <lydc-select v-model:value="dataForm.popupType" placeholder="请选择弹窗类型" :options="popupTypeOptions" />
      </a-form-item>
      <a-form-item label="弹窗宽度">
        <a-select v-model:value="dataForm.popupWidth">
          <a-select-option v-for="item in popupWidthOptions" :key="item" :value="item">{{ item }}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="远端数据">
        <interface-modal :value="dataForm.interfaceId" :title="dataForm.interfaceName" :hasPage="1" @change="onInterfaceChange" />
      </a-form-item>
      <a-form-item label="参数设置" style="margin-bottom: 0"></a-form-item>
      <a-table :data-source="dataForm.templateJson" :columns="columns" size="small" :pagination="false">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'field'">
            <span class="required-sign">{{ record.required ? '*' : '' }}</span>
            {{ record.field }}{{ record.fieldName ? '(' + record.fieldName + ')' : '' }}
          </template>
          <template v-if="column.key === 'relationField'">
            <lydc-select
              v-model:value="record.relationField"
              placeholder="请选择表单字段"
              :options="formFieldsOptions"
              allowClear
              showSearch
              :fieldNames="{ options: 'options1' }"
              @change="onRelationFieldChange($event, record)" />
          </template>
        </template>
        <template #emptyText>
          <p class="leading-60px">暂无数据</p>
        </template>
      </a-table>
      <a-form-item label="设置列表字段" style="margin-bottom: 0" :labelCol="{ style: { width: '100px' } }"></a-form-item>
      <a-table :data-source="dataForm.columnOptions" :columns="columnOptionsColumns" size="small" :pagination="false">
        <template #bodyCell="{ column, record, index }">
          <template v-if="column.key === 'label'">
            <a-input v-model:value="record.label" placeholder="请输入列名" />
          </template>
          <template v-if="column.key === 'value'">
            <a-auto-complete
              v-model:value="record.value"
              placeholder="请输入字段"
              :options="options"
              @focus="onFocus(record.value)"
              @search="debounceOnSearch(record.value)" />
          </template>
          <template v-if="column.key === 'action'">
            <a-button class="action-btn" type="link" color="error" @click="handleDelItem(index, 'columnOptions')" size="small">删除</a-button>
          </template>
        </template>
        <template #emptyText>
          <p class="leading-60px">暂无数据</p>
        </template>
      </a-table>
      <div class="table-add-action" @click="handleAddColumnOption()">
        <a-button type="link" preIcon="icon-ym icon-ym-btn-add">新增</a-button>
      </div>
      <a-form-item label="设置列表字段" style="margin-bottom: 0" :labelCol="{ style: { width: '100px' } }"></a-form-item>
      <a-table :data-source="dataForm.relationOptions" :columns="relationOptionsColumns" size="small" :pagination="false">
        <template #bodyCell="{ column, record, index }">
          <template v-if="column.key === 'field'">
            <lydc-select v-model:value="record.field" placeholder="请选择表单字段" :options="childList" showSearch class="!w-124px" />
          </template>
          <template v-if="column.key === 'type'">
            <lydc-select v-model:value="record.type" placeholder="请选择映射来源" :options="typeOptions" @change="onTypeChange(record)" />
          </template>
          <template v-if="column.key === 'value'">
            <a-auto-complete
              v-model:value="record.value"
              placeholder="请输入字段"
              :options="options"
              @focus="onFocus(record.value)"
              @search="debounceOnSearch(record.value)"
              v-if="record.type == 1" />
            <a-input v-model:value="record.value" placeholder="请输入固定值" allowClear v-else />
          </template>
          <template v-if="column.key === 'action'">
            <a-button class="action-btn" type="link" color="error" @click="handleDelItem(index, 'relationOptions')" size="small">删除</a-button>
          </template>
        </template>
        <template #emptyText>
          <p class="leading-60px">暂无数据</p>
        </template>
      </a-table>
      <div class="table-add-action" @click="handleAddRelationOption()">
        <a-button type="link" preIcon="icon-ym icon-ym-btn-add">新增</a-button>
      </div>
    </a-form>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { ref, unref, computed, reactive, toRefs } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { getDrawingList } from '/@/components/FormGenerator/src/helper/db';
  import { InterfaceModal } from '/@/components/CommonModal';
  import { useDebounceFn } from '@vueuse/core';
  import { getDataInterfaceInfo } from '/@/api/systemData/dataInterface';

  interface State {
    options: any[];
    allOptions: any[];
  }

  const state = reactive<State>({
    options: [],
    allOptions: [],
  });
  const { options } = toRefs(state);
  const popupTypeOptions = [
    { id: 'dialog', fullName: '居中弹窗' },
    { id: 'drawer', fullName: '右侧弹窗' },
  ];
  const typeOptions = [
    { id: 1, fullName: '接口字段' },
    { id: 2, fullName: '固定值' },
  ];
  const columns = [
    { width: 50, title: '序号', align: 'center', customRender: ({ index }) => index + 1 },
    { title: '参数名称', dataIndex: 'field', key: 'field', width: 200 },
    { title: '表单字段', dataIndex: 'relationField', key: 'relationField' },
  ];
  const columnOptionsColumns = [
    { width: 50, title: '序号', align: 'center', customRender: ({ index }) => index + 1 },
    { title: '列名', dataIndex: 'label', key: 'label', width: 200 },
    { title: '字段', dataIndex: 'value', key: 'value' },
    { title: '操作', dataIndex: 'action', key: 'action', width: 50 },
  ];
  const relationOptionsColumns = [
    { width: 50, title: '序号', align: 'center', customRender: ({ index }) => index + 1 },
    { title: '目标表单字段', dataIndex: 'field', key: 'field', width: 150 },
    { title: '映射来源', dataIndex: 'type', key: 'type', width: 120 },
    { title: '映射值/业务对象', dataIndex: 'value', key: 'value', width: 130 },
    { title: '操作', dataIndex: 'action', key: 'action', width: 50 },
  ];

  const emit = defineEmits(['register', 'confirm']);
  const [registerModal, { closeModal }] = useModalInner(init);
  const dataForm = ref({
    popupTitle: '选择数据',
    popupType: 'dialog',
    popupWidth: '800px',
    interfaceId: '',
    interfaceName: '',
    templateJson: [],
    hasPage: true,
    pageSize: 20,
    columnOptions: [],
    relationOptions: [],
  });
  const childList = ref<any[]>([]);
  const popupWidthOptions = ['600px', '800px', '1000px', '40%', '50%', '60%', '70%', '80%'];
  const debounceOnSearch = useDebounceFn(onSearch, 300);

  const formFieldsOptions = computed(() => {
    const noAllowList = ['table', 'uploadImg', 'uploadFile', 'modifyUser', 'modifyTime'];
    let list: any[] = [];
    const loop = (data, parent?) => {
      if (!data) return;
      if (data.__config__ && data.__config__.lydcKey !== 'table' && data.__config__.children && Array.isArray(data.__config__.children)) {
        loop(data.__config__.children, data);
      }
      if (Array.isArray(data)) data.forEach(d => loop(d, parent));
      if (data.__vModel__ && !noAllowList.includes(data.__config__.lydcKey))
        list.push({
          id: data.__vModel__,
          fullName: data.__config__.label ? data.__vModel__ + '(' + data.__config__.label + ')' : data.__vModel__,
          ...data,
          disabled: false,
        });
    };
    loop(getDrawingList());
    return list;
  });

  function init(data) {
    dataForm.value = JSON.parse(JSON.stringify(data.addTableConf));
    childList.value = data.children
      .filter(o => o.__vModel__)
      .map(o => ({
        id: o.__vModel__,
        fullName: o.__config__.label,
      }));
    initFieldData();
  }
  function handleDelItem(index, key) {
    dataForm.value[key].splice(index, 1);
  }
  function handleAddColumnOption() {
    (dataForm.value.columnOptions as any).push({
      value: '',
      label: '',
    });
  }
  function handleAddRelationOption() {
    (dataForm.value.relationOptions as any).push({
      value: '',
      field: '',
      type: 1,
    });
  }
  function onTypeChange(record) {
    record.value = '';
  }
  function onInterfaceChange(id, row) {
    if (!id) {
      dataForm.value.interfaceId = '';
      dataForm.value.interfaceName = '';
      dataForm.value.templateJson = [];
      initFieldData();
      return;
    }
    if (dataForm.value.interfaceId === id) return;
    dataForm.value.interfaceId = id;
    dataForm.value.interfaceName = row.fullName;
    dataForm.value.templateJson = row.templateJson
      ? row.templateJson.map(o => ({
          ...o,
          relationField: '',
        }))
      : [];
    initFieldData();
  }
  function onRelationFieldChange(val, row) {
    if (!val) return (row.lydcKey = '');
    let list = unref(formFieldsOptions).filter(o => o.__vModel__ === val);
    if (!list.length) return (row.lydcKey = '');
    let item = list[0];
    row.lydcKey = item.__config__.lydcKey;
  }
  function handleSubmit() {
    emit('confirm', dataForm.value);
    closeModal();
  }
  function initFieldData() {
    if (!dataForm.value.interfaceId) return (state.allOptions = []);
    getDataInterfaceInfo(dataForm.value.interfaceId).then(res => {
      const data = res.data;
      let list = data.fieldJson ? JSON.parse(data.fieldJson) : [];
      state.allOptions = list.map(o => ({ ...o, value: o.defaultValue }));
    });
  }
  function onSearch(searchText: string) {
    state.options = state.allOptions.filter(o => o.value.toLowerCase().indexOf(searchText.toLowerCase()) !== -1);
  }
  function onFocus(searchText) {
    onSearch(searchText);
  }
</script>
<style lang="less">
  .add-config-modal {
    .ant-modal-body {
      & > .scrollbar {
        padding-bottom: 20px;
      }
    }
  }
</style>
