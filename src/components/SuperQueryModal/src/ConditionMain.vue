<template>
  <div class="condition-main">
    <div class="mb-10px" v-if="state.conditionList.length">
      <span class="mr-10px">分组匹配逻辑</span>
      <lydc-select v-model:value="state.matchLogic" placeholder="请选择" :options="logicOptions" class="!w-68px" />
    </div>
    <div class="condition-list" v-for="(item, index) in state.conditionList" :key="index">
      <a-row :gutter="8">
        <a-col :span="6" class="!flex align-middle flex-nowrap">
          <span class="leading-32px mr-10px">条件逻辑</span>
          <lydc-select v-model:value="item.logic" placeholder="请选择" :options="logicOptions" class="!flex-1" />
        </a-col>
        <a-col :span="5">
          <a-button preIcon="icon-ym icon-ym-btn-add" @click="addItem(index)" class="!w-full">添加条件</a-button>
        </a-col>
        <a-col :span="5">
          <a-button preIcon="icon-ym icon-ym-nav-close" @click="delGroup(index)">删除分组</a-button>
        </a-col>
      </a-row>
      <a-row :gutter="8" v-for="(child, childIndex) in item.groups" :key="index + childIndex" class="mt-10px">
        <a-col :span="1" style="line-height: 32px" class="text-center">{{ getCurrentIndex(index, childIndex) }}、</a-col>
        <a-col :span="6">
          <lydc-select
            v-model:value="child.field"
            :options="fieldOptions"
            placeholder="请选择"
            showSearch
            allowClear
            :fieldNames="{ options: 'options1' }"
            @change="(val, data) => onFieldChange(val, data, child, index, childIndex)" />
        </a-col>
        <a-col :span="4">
          <lydc-select
            v-model:value="child.symbol"
            placeholder="运算符号"
            :options="getSymbolOptions(child)"
            :dropdownMatchSelectWidth="false"
            @change="(val, data) => onSymbolChange(val, data, child)" />
        </a-col>
        <a-col :span="4" v-if="showFieldValueType">
          <lydc-select
            v-model:value="child.fieldValueType"
            :options="sourceTypeOptions"
            placeholder="请选择"
            :disabled="child.disabled"
            @change="child.fieldValue = undefined" />
        </a-col>
        <a-col :span="8" v-if="child.fieldValueType === 1">
          <lydc-select
            v-model:value="child.fieldValue"
            :options="valueFieldOptions"
            placeholder="请选择"
            showSearch
            allowClear
            :fieldNames="{ options: 'options1' }"
            :disabled="child.disabled" />
        </a-col>
        <a-col :span="showFieldValueType ? 8 : 11" v-if="child.fieldValueType !== 1">
          <template v-if="child.lydcKey === 'InputNumber'">
            <lydc-number-range v-model:value="child.fieldValue" :precision="child.precision" :disabled="child.disabled" v-if="child.symbol == 'between'" />
            <lydc-input-number v-model:value="child.fieldValue" :precision="child.precision" :disabled="child.disabled" placeholder="请输入" v-else />
          </template>
          <template v-else-if="child.lydcKey === 'ApiSelect'">
            <ApiSelect v-model:value="child.fieldValue" :key="child.field" v-bind="child.__config__.attrs"></ApiSelect>
          </template>
          <template v-else-if="['CustomUserSelect'].includes(child.lydcKey)">
            <custom-user-select v-model:value="child.fieldValue" allowClear :multiple="child.multiple" :disabled="child.disabled" />
          </template>
          <template v-else-if="['DatePicker'].includes(child.lydcKey)">
            <lydc-date-range
              v-model:value="child.fieldValue"
              :format="child.format || 'YYYY-MM-DD HH:mm'"
              allowClear
              :disabled="child.disabled"
              v-if="child.symbol == 'between'" />
            <lydc-date-picker v-model:value="child.fieldValue" :format="child.format || 'YYYY-MM-DD HH:mm'" allowClear :disabled="child.disabled" v-else />
          </template>
          <template v-else-if="['Select'].includes(child.lydcKey)">
            <lydc-select
              v-model:value="child.fieldValue"
              placeholder="请选择"
              showSearch
              allowClear
              :options="child.options"
              :fieldNames="child.props"
              :multiple="child.multiple"
              :disabled="child.disabled" />
          </template>
          <template v-else>
            <a-input v-model:value="child.fieldValue" placeholder="请输入" allowClear :disabled="child.disabled" />
          </template>
        </a-col>
        <a-col :span="2" class="text-center">
          <a-tooltip placement="top" :title="`基于空白格和换行符对数据进行拆分，同时沿用筛选条件和运算符号`">
            <SubnodeOutlined @click="splitPasteData(child.fieldValue, index, childIndex)" class="mr-3px" />
          </a-tooltip>
          <i class="icon-ym icon-ym-btn-clearn" @click="delItem(index, childIndex)" />
        </a-col>
      </a-row>
    </div>
    <div class="query-noData" v-show="!state.conditionList.length && isSuperQuery">
      <Empty></Empty>
      <div class="noData-txt">
        <span>没有任何查询条件</span>
        <a-divider type="vertical"></a-divider>
        <span class="link-text" @click="addGroup">点击新增</span>
      </div>
    </div>
    <span class="link-text mt-10px inline-block" @click="addGroup()" v-show="state.conditionList.length || !isSuperQuery">
      <i class="icon-ym icon-ym-btn-add text-14px mr-4px"></i>添加分组
    </span>
  </div>
</template>

<script lang="ts" setup>
  import { reactive, ref } from 'vue';
  import { getDictionaryDataSelector } from '/@/api/systemData/dictionary';
  import { getDataInterfaceRes } from '/@/api/systemData/dataInterface';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { cloneDeep } from 'lodash-es';
  import { dyOptionsList } from '/@/components/FormGenerator/src/helper/config';
  import { isEmpty } from '/@/utils/is';
  import { getParamList } from '/@/utils/lydc';
  import { SubnodeOutlined } from '@ant-design/icons-vue';
  import { Empty } from 'ant-design-vue';
  import CustomUserSelect from '../../Lydc/Organize/src/CustomUserSelect.vue';
  import { ApiSelect } from '../../Form';
  import { notSupportList, notStringSymbolOptions, logicOptions, baseSymbolOptions, sourceTypeOptions } from './utils/conditionUtils';

  const props = defineProps({
    isSuperQuery: { type: Boolean, default: false },
    defaultAddEmpty: { type: Boolean, default: false },
    showFieldValueType: { type: Boolean, default: false },
    valueFieldOptions: { type: Array, default: () => [] },
  });
  defineExpose({
    init,
    confirm,
  });

  const { createMessage } = useMessage();
  const emptyChildItem = {
    field: '',
    symbol: '==',
    lydcKey: '',
    fieldValueType: props.showFieldValueType ? 1 : 2,
    fieldValue: undefined,
    fieldValueLydcKey: '',
    cellKey: +new Date(),
  };
  const emptyItem = { logic: 'and', groups: [emptyChildItem] };
  // const state = reactive<State>({
  //   conditionList: [],
  //   matchLogic: 'and',
  // });
  const state = defineModel('state', {
    type: Object,
    default: () => ({
      conditionList: [],
      matchLogic: 'and',
    }),
  });
  const fieldOptions = ref<any[]>([]);

  function init(data) {
    // updateConditionList(data);
    const _fieldOptions = data.fieldOptions.filter(o => !notSupportList.includes(o.__config__.lydcKey));
    fieldOptions.value = buildOptions(_fieldOptions);
    if (!state.value.conditionList.length && props.defaultAddEmpty) addGroup();
  }
  // function updateConditionList(data) {
  //   state.value.conditionList = cloneDeep(data.conditionList || []);
  //   state.value.matchLogic = data.matchLogic || 'and';
  // }
  function buildOptions(componentList) {
    componentList.forEach(cur => {
      cur.disabled = false;
      const config = cur.__config__;
      if (dyOptionsList.includes(config.lydcKey)) {
        if (config.dataType === 'dictionary' && config.dictionaryType) {
          cur.options = [];
          getDictionaryDataSelector(config.dictionaryType).then(res => {
            cur.options = res.data.list;
          });
        }
        if (config.dataType === 'dynamic' && config.propsUrl) {
          cur.options = [];
          const query = { paramList: getParamList(config.templateJson) };
          getDataInterfaceRes(config.propsUrl, query).then(res => {
            cur.options = Array.isArray(res.data) ? res.data : [];
          });
        }
      }
    });
    return componentList;
  }

  // 获取当前的序号
  function getCurrentIndex(index, childIndex) {
    let currentIndex = 0;
    for (let i = 0; i < index; i++) {
      currentIndex += state.value.conditionList[i].groups.length;
    }
    return currentIndex + childIndex + 1;
  }

  function onFieldChange(val, data, item, index, childIndex) {
    item.cellKey = +new Date();
    if (item.fieldValueType != 1) {
      item.fieldValue = undefined;
      item.fieldValueLydcKey = '';
    }
    const newItem = cloneDeep(emptyChildItem);
    for (let key of Object.keys(newItem)) {
      newItem[key] = item[key];
    }
    if (!val) {
      item.lydcKey = '';
      item.symbol = undefined;
      item.disabled = false;
      return;
    }
    item = { ...newItem, ...data };
    const config = data.__config__;
    // if (item.lydcKey != config.lydcKey) item.symbol = undefined;
    // 如果是非字符串类型，symbol如果是选中了like、notLike，则置为等于
    if (item.cSharpType !== 'string') {
      if (['like', 'notLike'].includes(item.symbol)) {
        item.symbol = '==';
      }
    }
    item.lydcKey = config?.lydcKey || '';
    item.disabled = ['null', 'notNull'].includes(item.symbol);
    item.multiple = ['in', 'notIn'].includes(item.symbol);
    state.value.conditionList[index].groups[childIndex] = item;
  }
  function onSymbolChange(val, _data, item) {
    // 只有为空、不为空时，才置空fieldValue
    if (['null', 'notNull'].includes(val)) {
      item.fieldValue = undefined;
      item.disabled = true;
    } else {
      item.disabled = false;
    }
    item.multiple = ['in', 'notIn'].includes(val);
    if (props.showFieldValueType && ['null', 'notNull'].includes(val)) {
      item.fieldValueType = 1;
      item.fieldValueLydcKey = '';
    }
  }
  function addItem(index) {
    state.value.conditionList[index].groups.push(cloneDeep(emptyChildItem));
  }
  function delItem(index, childIndex) {
    state.value.conditionList[index].groups.splice(childIndex, 1);
  }
  function addGroup() {
    state.value.conditionList.push(cloneDeep(emptyItem));
  }
  function delGroup(index) {
    state.value.conditionList.splice(index, 1);
  }
  // 拆分粘贴数据,并基于该行的条件和逻辑复制出多行
  function splitPasteData(data, index, childIndex) {
    const item = state.value.conditionList[index].groups[childIndex];
    // 数据以空格或是换行符分隔
    const dataList = data ? data.toString().split(/[\s\n]+/) : [];
    if (!dataList || !dataList.length) return;
    const newItems = dataList.map(d => {
      const newItem = cloneDeep(emptyChildItem);
      newItem.field = item.field;
      newItem.symbol = item.symbol;
      newItem.lydcKey = item.lydcKey;
      newItem.fieldValueType = item.fieldValueType;
      newItem.fieldValue = d;
      return newItem;
    });
    state.value.conditionList[index].groups.splice(childIndex, 1, ...newItems);
    // 批量复制语句逻辑默认调整为or
    dataList.length > 1 ? (state.value.conditionList[index].logic = 'or') : '';
  }
  function getSymbolOptions(item) {
    if (item.cSharpType !== 'string') return notStringSymbolOptions;
    return baseSymbolOptions;
  }
  function exist() {
    let isOk = true;
    for (let i = 0; i < state.value.conditionList.length; i++) {
      const e = state.value.conditionList[i];
      for (let j = 0; j < e.groups.length; j++) {
        const child = e.groups[j];
        if (!child.field) {
          createMessage.warning('条件字段不能为空');
          isOk = false;
          return;
        }
        if (!child.symbol) {
          createMessage.warning('条件符号不能为空');
          isOk = false;
          return;
        }
        if (!['null', 'notNull'].includes(child.symbol) && ((!child.fieldValue && child.fieldValue !== 0) || isEmpty(child.fieldValue))) {
          createMessage.warning('数据值不能为空');
          isOk = false;
          return;
        }
      }
    }
    return isOk;
  }
  function confirm() {
    if (!exist()) return false;
    return {
      matchLogic: state.value.matchLogic,
      conditionList: cloneDeep(state.value.conditionList),
    };
  }
</script>
