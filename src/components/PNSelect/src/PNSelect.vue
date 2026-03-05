<template>
  <div :class="[$attrs.class, 'select-tag-list']" v-if="buttonType === 'button'">
    <a-button preIcon="icon-ym icon-ym-btn-add" @click="openSelectModal">{{ modalTitle }}</a-button>
    <div class="tags">
      <a-tag class="!mt-10px" :closable="!disabled" v-for="(item, i) in options" :key="item.id" @close="onTagClose(i)">{{ item.fullName }}</a-tag>
    </div>
  </div>
  <a-input @paste="$emit('paste', $event)" v-bind="getSelectBindValue" v-model:value="innerValue" @change="onChange" v-else>
    <template #addonAfter>
      <div style="cursor: pointer" @click="openSelectModal">
        <SearchOutlined />
      </div>
    </template>
  </a-input>
  <a-modal
    v-model:visible="visible"
    :title="modalTitle"
    :width="1000"
    class="transfer-modal"
    @ok="handleSubmit"
    centered
    :maskClosable="false"
    :keyboard="false">
    <template #closeIcon>
      <ModalClose :canFullscreen="false" @cancel="handleCancel" />
    </template>
    <div class="transfer__body">
      <BasicTable @register="registerTable">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'Status'">
            <a-tag v-if="record.Status == '1'" color="success">生效</a-tag>
            <a-tag v-if="record.Status == '2'" color="error">失效</a-tag>
            <a-tag v-if="record.Status == '3'" color="default">未审核</a-tag>
          </template>
        </template>
      </BasicTable>
    </div>
  </a-modal>
</template>
<script lang="ts" setup>
  import { computed, nextTick, reactive, ref, unref, watch } from 'vue';
  import { cloneDeep, pick } from 'lodash-es';
  import { PNSelectProps } from '/@/components/Lydc/Organize/src/props';
  import { useAttrs } from '/@/hooks/core/useAttrs';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { ScrollActionType } from '/@/components/Container';
  import ModalClose from '/@/components/Modal/src/components/ModalClose.vue';
  import { Form } from 'ant-design-vue';
  import { SearchOutlined } from '@ant-design/icons-vue';
  import { BasicColumn, BasicTable, FormProps, useTable } from '/@/components/Table';
  import { getEnablePartNumberApply, getPartNumberApply } from '/@/api/basicData/productCodeApply';

  defineOptions({ name: 'LydcUserSelect', inheritAttrs: false });
  const emit = defineEmits(['update:value', 'change', 'labelChange']);
  const attrs: any = useAttrs({ excludeDefaultKeys: false });
  const { t } = useI18n();
  const finish = ref<boolean>(false);
  const isAsync = ref<boolean>(false);
  const activeKey = ref('');
  const visible = ref(false);
  const innerValue = ref<string>('');
  const pagination = reactive({
    keyword: '',
    currentPage: 1,
    pageSize: 20,
  });
  const ableList = ref<any[]>([]);

  const columns: BasicColumn[] = [
    { title: '产品内部料号', dataIndex: 'InsidePartNumber', width: 250 },
    { title: '内部项目代码', dataIndex: 'InsideProjectCode', width: 140 },
    { title: '直接客户料号', dataIndex: 'ImmediateCustomerPartNumber', width: 120 },
    {
      title: '直接客户信息',
      dataIndex: 'ImmediateCustomerCode',
      width: 220,
      customRender: ({ record }) => {
        return `${record.ImmediateCustomerName}(${record.ImmediateCustomerCode})`;
      },
    },
    { title: '直接客户项目代码', dataIndex: 'ImmediateCustomerProjectCode', width: 120 },
    {
      title: '终端客户信息',
      dataIndex: 'TerminalCustomerCode',
      width: 120,
      customRender: ({ record }) => {
        return `${record.TerminalCustomerName}(${record.TerminalCustomerCode})`;
      },
    },
    { title: '终端客户料号', dataIndex: 'TerminalCustomerPartNumber', width: 120 },
    {
      title: '出货形态',
      dataIndex: 'ShipPatternName',
      width: 120,
      customRender: ({ record }) => {
        return `${record.ShipPatternName}(${record.ShipPattern})`;
      },
    },
    { title: 'Config', dataIndex: 'Config', width: 110 },
    { title: '工厂', dataIndex: 'Factory', width: 110 },
    {
      title: '产品线',
      dataIndex: 'ProductLineName',
      width: 170,
      customRender: ({ record }) => {
        return `${record.ProductLineName}/${record.ProductLineCode}`;
      },
    },
    {
      title: '主要制程',
      dataIndex: 'MainProcess',
      width: 120,
      customRender: ({ text }) => {
        if (text == '1') return '模切';
        if (text == '2') return '冲压';
        if (text == '3') return 'CNC';
      },
    },
    { title: '终端项目代码', dataIndex: 'TerminalCustomerProjectCode', width: 150 },
    { title: '产品描述', dataIndex: 'ProductDesc', width: 220 },
    { title: '直接客户料号版本', dataIndex: 'ImmediateCustomerPartVersion', width: 160 },
    { title: '旧版成品编码', dataIndex: 'InsidePartNumberOld', width: 150 },
    { title: '客户原图', dataIndex: 'CustomerDrawingsName', width: 120 },
    { title: '脱敏图纸', dataIndex: 'DesensitizedDrawingsName', width: 120 },
    { title: '预留码', dataIndex: 'ReserveCode', width: 70 },
    { title: '状态', dataIndex: 'Status', width: 120 },
    { title: '备注', dataIndex: 'Remark', width: 120 },
  ];

  const [registerTable, { getForm, getSelectRows }] = useTable({
    api: getEnablePartNumberApply,
    columns,
    rowKey: 'Id',
    useSearchForm: true,
    formConfig: getFormConfig(),
    showTableSetting: false,
    rowSelection: { type: props.type },
    isCanResizeParent: true,
    canResize: true,
    clickToRowSelect: true,
  });
  function getFormConfig(): Partial<FormProps> {
    return {
      schemas: [
        {
          field: 'InsidePartNumber',
          label: '',
          component: 'Input',
          componentProps: {
            placeholder: '产品内部料号',
          },
        },
        {
          field: 'ImmediateCustomerPartNumber',
          label: '',
          component: 'Input',
          componentProps: {
            placeholder: '直接客户料号',
          },
        },
        {
          field: 'TerminalCustomerPartNumber',
          label: '',
          component: 'Input',
          componentProps: {
            placeholder: '终端料号',
          },
        },
      ],
    };
  }

  const infiniteBody = ref<Nullable<ScrollActionType>>(null);
  const ableQuery = reactive<Recordable>({ ids: [] });
  const options = ref<any[]>([]);
  const loading = ref(false);
  const selectedData = ref<any[]>([]);
  const formItemContext = Form.useInjectFormItemContext();
  const sysPNList = ref<any[]>([
    {
      id: 'currentUser',
    },
  ]);

  const props = defineProps(PNSelectProps);
  const getSelectBindValue = computed(() => ({
    ...pick(props, ['placeholder', 'disabled', 'size']),
    class: unref(attrs).class ? 'w-full ' + unref(attrs).class : 'w-full',
    placeholder: '请选择产品内部料号',
  }));
  watch(
    () => props.value,
    () => {
      setValue();
    },
    { immediate: true },
  );

  watch(
    () => activeKey.value,
    val => {
      if (!val) return;
      pagination.keyword = '';
      isAsync.value = false;
      initData();
    },
  );
  watch(
    () => visible.value,
    val => {
      if (!val) activeKey.value = '';
    },
  );

  function setValue() {
    innerValue.value = props.value;
    return;
    if (!props.value || !props.value.length) return setNullValue();
    const ids = props.multiple ? (props.value as any[]) : [props.value];
    if (!Array.isArray(ids)) return;
    const hasSysItem = ids.some(o => o === 'currentUser');
    // getUserInfoList(unref(ids)).then(res => {
    //   if (!props.value || !props.value.length) return setNullValue();
    //   const selectedList: any[] = res.data.list;
    //   if (hasSysItem) selectedList.push(...sysPNList.value);
    //   const innerIds = selectedList.map(o => o.id);
    //   innerValue.value = props.multiple ? innerIds : innerIds[0];
    //   options.value = cloneDeep(selectedList);
    //   selectedData.value = cloneDeep(selectedList);
    //   const labels = selectedData.value.map(o => o.fullName).join();
    //   emit('labelChange', labels);
    // });
  }
  function setNullValue() {
    innerValue.value = props.multiple ? [] : undefined;
    options.value = [];
    selectedData.value = [];
    emit('labelChange', '');
  }
  async function initData() {
    ableList.value = [];
    if (props.selectType === 'all') {
      if (activeKey.value === '1') return getAllList();
      if (activeKey.value === '2') {
        loading.value = true;
        // getOrganization({ keyword: pagination.keyword, organizeId: '0' }).then(res => {
        //   ableList.value = res.data;
        // });
        loading.value = false;
      }
      if (activeKey.value === '3') {
        // loading.value = true;
        // getSubordinates(pagination.keyword).then(res => {
        //   ableList.value = res.data;
        //   loading.value = false;
        // });
      }
      if (activeKey.value === '4') {
        ableList.value = cloneDeep(sysPNList.value);
      }
    }
  }
  function handleSubmit() {
    // const ids = unref(selectedData).map(o => o.id);
    const row = getSelectRows();
    console.log(row);
    options.value = unref(row);
    innerValue.value = row[0].InsidePartNumber;
    emit('update:value', row[0].InsidePartNumber || {});
    emit(
      'change',
      row.map(item => item.InsidePartNumber),
      row,
    );
    formItemContext.onFieldChange();
    handleCancel();
  }
  function getAllList() {
    loading.value = true;
    // if (pagination.keyword) nodeId.value = '0';
    // getImUserSelector(nodeId.value, pagination).then(res => {
    //   if (pagination.keyword) {
    //     if (res.data.list.length < pagination.pageSize) finish.value = true;
    //     treeData.value = [...treeData.value, ...res.data.list];
    //   } else {
    //     treeData.value = res.data.list;
    //     if (treeData.value.length && nodeId.value == '0') {
    //       getTree().setExpandedKeys([treeData.value[0].id]);
    //     }
    //   }
    loading.value = false;
    // });
  }
  function openSelectModal() {
    if (props.disabled) return;
    visible.value = true;
    isAsync.value = false;
    pagination.keyword = '';
    pagination.currentPage = 1;
    activeKey.value = '1';
    if (props.selectType === 'all') return setValue();
    if (props.selectType === 'custom') {
      ableQuery.ids = props.ableIds;
    } else {
      const suffix = '--' + getAbleKey(props.selectType);
      let ableIds = !props.ableRelationIds ? [] : Array.isArray(props.ableRelationIds) ? props.ableRelationIds : [props.ableRelationIds];
      ableQuery.ids = ableIds.map(o => o + suffix);
    }
    ableList.value = [];
    finish.value = false;
    // getAbleList();
    nextTick(() => {
      bindScroll();
      setValue();
    });
  }
  function handleCancel() {
    visible.value = false;
  }
  function bindScroll() {
    const bodyRef = infiniteBody.value;
    const vBody = bodyRef?.getScrollWrap();
    vBody?.addEventListener('scroll', () => {
      if (vBody.scrollHeight - vBody.clientHeight - vBody.scrollTop <= 200 && !loading.value && !finish.value) {
        pagination.currentPage += 1;
        props.selectType === 'all' ? getAllList() : getAbleList();
      }
    });
  }
  function getAbleList() {
    loading.value = true;
    const query = { pagination, ...ableQuery };
    // getSelectedUserList(query).then(res => {
    //   if (res.data.list.length < pagination.pageSize) finish.value = true;
    //   ableList.value = [...ableList.value, ...res.data.list];
    //   loading.value = false;
    // });
  }
  function getAbleKey(selectType) {
    if (selectType === 'dep') return 'department';
    if (selectType === 'pos') return 'position';
    return selectType;
  }
  function onChange(_val, option) {
    selectedData.value = option ?? [];
    handleSubmit();
  }
</script>
