<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    :title="t('component.excel.exportModalTitle')"
    @ok="handleSubmit"
    destroyOnClose
    class="export-modal"
    :afterClose="handleAfterClose">
    <template #insertFooter>
      <div class="footer-tip">{{ t('common.tipTitle') + ':' + t('common.systemWillExportAllSelectedDatas') }}</div>
    </template>
    <a-form :colon="false" labelAlign="left" :labelCol="{ style: { width: '90px' } }">
      <a-form-item>
        <a-radio-group v-model:value="dataType">
          <a-radio :value="0">{{ t('common.currentPageDatas') }}</a-radio>
          <a-radio :value="1">{{ t('common.allPageDatas') }}</a-radio>
          <a-radio :value="2" :disabled="!config.selectIds || !config.selectIds.length">{{ t('component.exportModal.currentSelectdData') }}</a-radio>
        </a-radio-group>
      </a-form-item>
      <!-- 如果不传key的话，就不显示字段选择模块 -->
      <div v-if="columnList.length">
        <div class="export-line">
          <p class="export-label"
            >{{ t('common.listDatas') }}<span>{{ t('component.exportModal.selectField') }}</span></p
          >
        </div>
        <a-checkbox :indeterminate="isIndeterminate" v-model:checked="checkAll" @change="handleCheckAllChange">{{ t('common.selectAll') }} </a-checkbox>
        <slot name="afterCheckAll" />
        <a-checkbox-group v-model:value="checkedList" class="options-list" @change="handleCheckedChange">
          <a-checkbox v-for="item in columnList" :key="item[config.idProps]" :value="item[config.idProps]" class="options-item">
            <span :title="item[config.nameProps]">{{ item[config.nameProps] }}</span>
          </a-checkbox>
        </a-checkbox-group>
      </div>
    </a-form>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { reactive, ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { downloadByUrl } from '/@/utils/file/download';
  import { transformI18nVxeTable } from '/@/utils/index';
  const props = defineProps({
    dataType: { type: Number, default: 0 },
  });
  const dataType = ref(0);
  defineOptions({ name: 'ExportModal' });

  const emit = defineEmits(['register', 'export']);
  const { t } = useI18n();

  const [registerModal, { closeModal, changeOkLoading }] = useModalInner(init);
  const { createMessage } = useMessage();
  const isIndeterminate = ref(false);
  const checkAll = ref(false);
  const columnList = ref<any[]>([]);
  const checkedList = ref<string[]>([]);
  const defaultCheckedList = ref<string[]>([]);
  const listQuery = ref({});
  const isSubmit = ref(false);

  const config = reactive<{
    api: null | CallableFunction; // 选中后导出用到的接口方法
    nameProps: string; // name展示的别名key
    idProps: string; // id获取的别名key
    selectIds: any[]; // 当前选择项的id
    beforeFetch: CallableFunction | null;
    // 自定义下载导出方法
    customDownload: CallableFunction | null;
  }>({
    api: null,
    nameProps: 'fullName',
    idProps: 'id',
    selectIds: [],
    beforeFetch: null,
    customDownload: null,
  });

  function getField(item: any) {
    return item.exportField || item[config.idProps] || item.field || item.dataIndex;
  }

  function init(data: {
    idProps?: string; // value指转义
    nameProps?: string; // label值转义
    exportOptions: any[]; // 传入的导出列表
    i18nConfig?: {
      moduleCode: string; // 国际化字段
    };
    listQuery: string;
    api: Function;
    selectIds: string[];
    beforeFetch: Function;
    defaultSelectedKeys?: string[]; // 需要默认选中的字段值
    customDownload?: CallableFunction | null;
    excludeFields?: string[]; // 需要去除的字段
  }) {
    isSubmit.value = false;
    // dataType.value = 0;
    dataType.value = props.dataType;
    config.idProps = data.idProps || config.idProps;
    config.nameProps = data.nameProps || config.nameProps;
    config.customDownload = data.customDownload || null;

    // 过滤出功能字段和操作栏
    // vxetable中type值表示为功能字段，如checkbox
    const removeFields = ['nodeDetail', 'action'].concat(data.excludeFields || []);
    const innderDefaultCheckedList: string[] = []; // 当用户不指定默认选中值时，需要默认选中的字段值
    const list = (data.exportOptions || [])
      .filter((el: any) => {
        return !removeFields.includes(getField(el)) && !el.type;
      })
      .map(item => {
        const itemField = getField(item);
        innderDefaultCheckedList.push(itemField);
        return {
          ...item,
          field: itemField,
        };
      });
    columnList.value = transformI18nVxeTable(list, data.i18nConfig?.moduleCode);

    listQuery.value = data.listQuery;
    config.api = data.api || null;
    config.selectIds = data.selectIds || [];
    // 获取当前的默认选值
    checkedList.value = data.defaultSelectedKeys || innderDefaultCheckedList;
    handleCheckedChange(checkedList.value);
    config.beforeFetch = data.beforeFetch;
  }

  // 选中所有的值
  function handleCheckAllChange(e) {
    const val = e.target.checked;
    checkedList.value = val ? columnList.value.map(o => o[config.idProps]) : defaultCheckedList.value;
    isIndeterminate.value = val ? false : !!defaultCheckedList.value.length;
  }

  function handleCheckedChange(val) {
    const checkedCount = val.length;
    checkAll.value = checkedCount === columnList.value.length;
    isIndeterminate.value = !!checkedCount && checkedCount < columnList.value.length;
  }

  function handleAfterClose() {
    if (isSubmit.value) {
      changeOkLoading(false);
    }
  }

  async function handleSubmit() {
    if (columnList.value.length && !checkedList.value.length) return createMessage.warning(t('common.atLeastOneExportField'));
    isSubmit.value = true;
    changeOkLoading(true); // 统一在handleAfterClose事件里面关闭loading
    let query = {
      ...listQuery.value,
      dataType: dataType.value,
      selectKey: checkedList.value.join(','),
    };
    if (config.beforeFetch) {
      query = config.beforeFetch(query);
    }
    config.selectIds && config.selectIds.length && (query['selectIds'] = config.selectIds.join(','));
    if (config.api) {
      // 如果有传入api，直接在当前组件进行调用
      const r = await config.api(query);
      const { code, data } = r;

      // 一次返回多个下载文件处理
      if (code == '200' && Array.isArray(data)) {
        if (typeof config.customDownload === 'function') {
          config.customDownload(data);
          return closeModal();
        }
      }
      if (code == '200' && data.url) {
        downloadByUrl({
          url: data.url,
        });
        createMessage.success(t('sys.api.operationSuccess'));
        return closeModal();
      }
      return createMessage.warn(t('sys.api.operationFailed'));
    }
    emit('export', query, config.selectIds);
  }
</script>

<style lang="less" scoped>
  :deep(.ant-checkbox-group.options-list) {
    white-space: pre-line;
  }
</style>
