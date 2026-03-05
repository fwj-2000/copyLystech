<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content">
        <BasicTable @register="registerTable">
          <template #tableTitle>
            <a-button type="primary" preIcon="icon-ym icon-ym-btn-add" @click="addOrUpdateHandle(1)"> {{ t('common.addText') }}</a-button>
            <a-button danger @click="handleDeleteList()"> {{ t('common.batchDelText') }} </a-button>
          </template>
          <template #bodyCell="{ column, record, text }">
            <template v-if="column.dataIndex === 'result'">
              <a-tag :color="record.result === 1 ? 'success' : 'error'">
                <Badge :color="record.result === 1 ? '#87d068' : '#f50'" />{{ state.resultList.find(c => c.id == text)?.fullName }}</a-tag
              >
            </template>
            <template v-if="column.dataIndex === 'equipmentCategory'">
              {{ state.equipmentClassList.find(c => c.id == text)?.fullName }}
            </template>
            <template v-if="column.dataIndex === 'action'">
              <TableAction :actions="getTableActions(record)" />
            </template>
          </template>
        </BasicTable>
      </div>
    </div>
    <add @register="registerPop" @reload="reload" />
  </div>
</template>

<script lang="ts" setup>
  import { reactive, onMounted } from 'vue';
  import { BasicTable, useTable, BasicColumn, FormSchema, ActionItem, TableAction } from '/@/components/Table';
  import { usePopup } from '/@/components/Popup';
  import { getPage, deleteCheck } from '/@/api/equipment/spotCheck';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useBaseStore } from '/@/store/modules/base';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { Badge } from 'ant-design-vue';
  import add from './components/add.vue';

  const [registerPop, { openPopup }] = usePopup();

  const baseStore = useBaseStore();
  const { t } = useI18n();

  interface State {
    supplierList: any[];
    resultList: any[];
    equipmentClassList: any[];
    classesNameList: any[];
  }

  const state = reactive<State>({
    supplierList: [],
    resultList: [],
    equipmentClassList: [],
    classesNameList: [],
  });

  const columns: BasicColumn[] = [
    { title: '设备点检编码', dataIndex: 'code' },
    { title: '项目名称', dataIndex: 'name' },
    { title: '设备名称', dataIndex: 'equipmentName' },
    { title: '点检结果', dataIndex: 'result' },
    { title: '设备分类', dataIndex: 'equipmentCategory' },
    { title: '设备编码', dataIndex: 'equipmentCode' },
    { title: '规格型号', dataIndex: 'equipmentSpe' },
    { title: '机身序列号', dataIndex: 'equipmentSN' },
    { title: '设备制造商', dataIndex: 'equipmentSupplierName' },
    { title: '设备位置', dataIndex: 'equipmentPosition' },
    { title: '厂区', dataIndex: 'factoryArea' },
    { title: '创建人', dataIndex: 'creatorUserName' },
    { title: '创建时间', dataIndex: 'creatorTime', format: 'date|YYYY-MM-DD HH:mm:ss' },
  ];

  const searchFormSchema: FormSchema[] = [
    {
      field: 'code',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: '请输入设备点检编码',
      },
      colProps: { span: 4 },
    },
    {
      field: 'equipmentCode',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: '请输入设备编码',
      },
      colProps: { span: 4 },
    },
    {
      field: 'result',
      label: '',
      component: 'Select',
      componentProps: {
        placeholder: '请选择点检结果',
      },
      colProps: { span: 4 },
    },
    {
      field: 'pickerVal',
      label: '',
      component: 'DateRange',
      componentProps: {
        placeholder: [t('common.startTime'), t('common.endTime')],
      },
      colProps: { span: 5 },
    },
  ];

  const { createMessage, createConfirm } = useMessage();

  const [registerTable, { getRowSelection, reload, getForm }] = useTable({
    api: getPage,
    title: '',
    columns,
    rowKey: 'id',
    isCanResizeParent: true,
    canResize: true, //自适应高度
    formConfig: {
      //搜索框
      labelWidth: 100,
      schemas: searchFormSchema,
      fieldMapToTime: [['pickerVal', ['startTime', 'endTime']]],
      i18nConfig: {
        moduleCode: 'SpotCheckColumn',
        transferRange: ['placeholder'], // 可以配置表单的`label`和`placeholder`，或者只配置其中的一项
      },
      // autoAdvancedLine: 1, //自动展开行
    },
    // striped: true,//斑马纹
    useSearchForm: true, //使用搜索表单
    showTableSetting: true, //刷新按钮,默认打开

    showIndexColumn: true, //显示序号
    pagination: {
      pageSize: 50,
      size: 'small',
    },
    rowSelection: {
      type: 'checkbox',
    },
    actionColumn: {
      width: 80,
      title: '操作',
      dataIndex: 'action', //字段
      // fixed: 'right', //显示在右边
    },
    i18nConfig: {
      moduleCode: 'SpotCheckColumn',
    },
  });

  function getTableActions(record): ActionItem[] {
    return [
      {
        icon: 'icon-ym icon-ym-btn-edit',
        onClick: addOrUpdateHandle.bind(null, 2, record.id),
      },
      {
        icon: 'icon-ym icon-ym-delete',
        modelConfirm: {
          title: '删除',
          onOk: handleDelete.bind(null, record.id),
        },
      },
    ];
  }

  //新增或查看1为新增，2为查看
  function addOrUpdateHandle(type: number, id = '') {
    openPopup(true, {
      type,
      id,
      classesNameList: state.classesNameList,
      resultList: state.resultList,
    });
  }

  function handleDelete(record) {
    let list: any[] = [];
    list.push(record);
    deleteCheck(list).then(res => {
      createMessage.success(res.msg);
      reload();
    });
  }

  function handleDeleteList() {
    const list = getRowSelection().selectedRowKeys;
    console.log(list);
    if (list?.length === 0) {
      getRowSelection().selectedRowKeys = [];
      return createMessage.warning('请选中需要删除的行');
    } else {
      createConfirm({
        iconType: 'warning',
        title: t('common.tipTitle'),
        content: '此操作将永久删除该数据, 是否继续？',
        onOk: async () => {
          try {
            deleteCheck(list).then(res => {
              createMessage.success(res.msg);
              reload();
            });
          } catch (e) {
            getRowSelection().selectedRowKeys = [];
            reload();
            throw e;
          }
        },
      });
    }
  }

  onMounted(async () => {
    const result = ((await baseStore.getDictionaryData('spotCheckResult')) as any[]).map(i => {
      return {
        id: +i.enCode,
        fullName: i.fullName,
      };
    });
    state.resultList = result;
    getForm().updateSchema({
      field: 'result',
      componentProps: {
        options: result,
      },
    });

    const equipmentClassList = ((await baseStore.getDictionaryData('EquipmentClass')) as any[]).map(i => {
      return {
        id: i.enCode,
        fullName: i.fullName,
      };
    });
    state.equipmentClassList = equipmentClassList;

    const classesNameList = ((await baseStore.getDictionaryData('ClassesName')) as any[]).map(i => {
      return {
        id: +i.enCode,
        fullName: i.fullName,
      };
    });
    state.classesNameList = classesNameList;
  });
</script>
