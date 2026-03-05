<template>
  <div class="super-query-popover">
    <div class="super-query-header">
      <!-- <a-popover placement="bottom" trigger="click" overlayClassName="plan-popover" v-model:open="popoverVisible">
        <a-button>方案选择<DownOutlined /></a-button>
        <template #content>
          <div class="plan-list" v-if="planList.length">
            <div class="plan-list-item" v-for="(item, i) in planList" :key="i" @click="selectPlan(item)">
              <p class="plan-list-name">{{ item.fullName }} </p>
              <i class="icon-ym icon-ym-nav-close" @click.stop="delPlan(item.id, i)"></i>
            </div>
          </div>
          <div class="noData-txt" v-else>暂无数据</div>
        </template>
      </a-popover> -->
      <div class="super-query-header-tip">
        查询条件数：<span class="font-bold">{{ searchFieldLen }}/50</span> 条
      </div>
    </div>
    <ConditionMain v-model:state="conditionState" ref="conditionMainRef" isSuperQuery class="super-query-main" />
    <!-- <lydcInput placeholder="请输入方案名称" v-model:value="state.planName" :maxlength="50"></lydcInput>
    <a-button @click="addPlan">保存方案</a-button> -->
    <div class="super-query-footer">
      <div class="flex"></div>
      <div>
        <a-button @click="closeModal" class="mr-8px">{{ t('common.cancelText') }}</a-button>
        <a-button type="primary" ghost @click="handleReset" class="mr-8px">{{ t('common.resetText') }}</a-button>
        <a-button type="primary" @click="handleSubmit">{{ t('common.searchText') }}</a-button>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { reactive, nextTick, ref, watch, computed } from 'vue';
  import { cloneDeep } from 'lodash-es';
  import { useI18n } from '/@/hooks/web/useI18n';
  import ConditionMain from './ConditionMain.vue';

  defineOptions({
    name: 'SuperQueryWrap',
  });

  interface State {
    planList: any[];
    popoverVisible: boolean;
    fieldOptions: any[];
    planName: string;
  }
  const emit = defineEmits(['superQuery', 'close']);
  const { t } = useI18n();
  const conditionMainRef = ref();

  const props = defineProps({
    columnsOps: {
      type: Array,
      default: () => [],
    },
    init: {
      type: Number,
      default: false,
    },
    // 目标类型
    targetType: {
      type: String,
      default: 'vxeTable',
    },
  });
  const emptyChildItem = () => {
    return { field: '', symbol: '==', lydcKey: '', fieldValueType: 2, fieldValue: undefined, fieldValueLydcKey: '', cellKey: +new Date() };
  };

  const conditionState = reactive({
    conditionList: [
      {
        logic: 'and',
        groups: [emptyChildItem()],
      },
    ],
    matchLogic: 'and',
  });

  const state = reactive<State>({
    planList: [],
    popoverVisible: false,
    fieldOptions: [],
    planName: '',
  });

  const searchFieldLen = computed(() => {
    let len = 0;
    conditionState.conditionList.forEach(item => {
      len += item.groups.length;
    });
    return len;
  });

  watch(
    () => props.init,
    () => {
      init({ columnOptions: props.columnsOps });
    },
    { immediate: true, deep: true },
  );

  // 初始化
  function init(data) {
    state.popoverVisible = false;
    changeLoading(true);
    const _fieldOptions = formatFieldOptions(data.columnOptions);
    state.fieldOptions = _fieldOptions;
    nextTick(() => {
      conditionMainRef.value?.init({ conditionList: conditionState.conditionList, matchLogic: conditionState.matchLogic, fieldOptions: _fieldOptions });
    });
  }
  // 格式化字段选项
  function formatFieldOptions(columnOptions) {
    // vxe-table
    if (props.targetType == 'vxeTable') {
      return columnOptions
        .filter(item => {
          // 过掉功能性列
          if (item.type) {
            return false;
          }
          // 若是有些slots需要配置，则强制开启enbaled
          const { aqpFilter } = item;
          if (aqpFilter && aqpFilter.enabled == true) {
            return true;
          }
          // 过滤掉有slots插槽的列
          if (item.slots) {
            return false;
          }
          // 过滤掉配置了不显示的列
          if (aqpFilter && aqpFilter.enabled == false) {
            return false;
          }
          return true;
        })
        .map(item => {
          const _item: any = {
            __config__: {
              lydcKey: 'Input', // 默认是文本框
            },
            id: item.field,
            fullName: item.title,
            cSharpType: 'string', // 默认是string
          };
          // 其他的渲染形态
          const otherRender = item.aqpFilter || item.filterRender || item.cellRender;
          if (otherRender) {
            _item.__config__.lydcKey = otherRender.name;
            _item.__config__.attrs = otherRender.props || {};
            _item.id = otherRender.searchField || item.field;
            _item.cSharpType = otherRender.cSharpType || 'string';
            switch (otherRender.name) {
              case 'ASelect':
                _item.__config__.lydcKey = 'Select';
                _item.__config__.attrs = otherRender.props;
                _item.options = otherRender.props.options;
                break;
              case 'Date':
              case 'DatePicker':
                _item.__config__.lydcKey = 'DatePicker';
                _item.cSharpType = 'DateTime';
                _item.format = otherRender.props?.format || '';
                break;
              case 'Tag':
              case 'VxeSelect':
                _item.__config__.lydcKey = 'Select';
                _item.options = otherRender.options;
                break;
              case 'CustomUserSelect':
                _item.__config__.lydcKey = 'CustomUserSelect';
                _item.__config__.attrs = otherRender.props || {};
                break;
              case 'Number':
              case 'InputNumber':
                _item.__config__.lydcKey = 'InputNumber';
                _item.__config__.attrs = otherRender.props;
                _item.cSharpType = 'int';
                break;
              default:
                break;
            }
          }
          return _item;
        });
    }
    return cloneDeep(columnOptions);
  }

  // 通用功能
  // 加载
  function changeLoading(loading: boolean) {
    console.log('Loading:', loading);
  }
  // 重置
  function handleReset() {
    conditionState.conditionList = [{ logic: 'and', groups: [emptyChildItem()] }];
    conditionState.matchLogic = 'and';
    conditionMainRef.value?.init({ conditionList: conditionState.conditionList, matchLogic: conditionState.matchLogic, fieldOptions: state.fieldOptions });
    emit('superQuery', '');
  }
  // 提交
  function handleSubmit() {
    const values = conditionMainRef.value?.confirm();
    if (!values) return;
    conditionState.conditionList = values.conditionList || [];
    conditionState.matchLogic = values.matchLogic;
    const query = {
      matchLogic: conditionState.matchLogic,
      conditionList: conditionState.conditionList,
    };
    let str = JSON.stringify(query);
    if (!conditionState.conditionList.length) str = '';
    emit('superQuery', str);
  }
  // 关闭弹窗
  function closeModal() {
    state.planName = '';
    state.popoverVisible = false;
    emit('close', { init });
  }
</script>
<style lang="less" scoped>
  .super-query-popover {
    min-width: 900px;
  }

  .super-query-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;

    &-tip {
      // background: @primary-color;
      // color: #fff;
      background: rgb(255 123 0 / 10%);
      padding: 5px 10px;
      border: 1px solid @primary-color;
    }
  }

  .super-query-main {
    max-height: 400px;
    margin-bottom: 10px;
    padding: 10px;
    background: #f7f7f7;
    overflow-y: auto;
  }

  .super-query-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 10px;
  }
</style>
