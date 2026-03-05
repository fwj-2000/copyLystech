<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content">
        <BasicTable @register="registerTable">
          <template #tableTitle>
            <a-button type="primary" preIcon="icon-ym icon-ym-btn-add" @click="addOrUpdateHandle()"> {{ t('common.addText') }}</a-button>
            <a-button danger> {{ t('common.batchDelText') }} </a-button>
          </template>
          <template #bodyCell="{ column, record, text }">
            <template v-if="column.dataIndex === 'planType'"> {{ state.maintenPlanTypeList.find(c => c.id == text)?.fullName }} </template>
            <template v-if="column.dataIndex === 'status'">
              <!-- 1,未保养2,保养中 3,已保养 -->
              <a-tag v-if="text === 1" color="default"><Badge color="#999999" />{{ state.maintenanceStatusList.find(c => c.id == text)?.fullName }}</a-tag>
              <a-tag v-else-if="text === 2" color="blue"><Badge color="blue" />{{ state.maintenanceStatusList.find(c => c.id == text)?.fullName }}</a-tag>
              <a-tag v-else :color="'green'"><Badge color="green" />{{ state.maintenanceStatusList.find(c => c.id == text)?.fullName }}</a-tag>
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
    <add @register="registerModel" @reload="reload" />
    <detail @register="registerPopup" @reload="reload" />
  </div>
</template>

<script lang="ts" setup>
  import { onMounted, reactive } from 'vue';
  import { useModal } from '/@/components/Modal';
  import { usePopup } from '/@/components/Popup';
  import { BasicTable, useTable, BasicColumn, FormSchema, ActionItem, TableAction } from '/@/components/Table';
  import { getPage, deleteMaintenance } from '/@/api/equipment/maintenance';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useBaseStore } from '/@/store/modules/base';
  import { Badge } from 'ant-design-vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import add from './components/add.vue';
  import detail from './components/detail.vue';

  const [registerModel, { openModal }] = useModal();
  const [registerPopup, { openPopup }] = usePopup();
  const baseStore = useBaseStore();
  const { t } = useI18n();

  interface State {
    maintenPlanTypeList: any[];
    equipmentClassList: any[];
    maintenanceStatusList: any[];
  }

  const state = reactive<State>({
    maintenPlanTypeList: [],
    equipmentClassList: [],
    maintenanceStatusList: [],
  });

  const columns: BasicColumn[] = [
    { title: '保养计划编码', dataIndex: 'code' },
    { title: '项目名称', dataIndex: 'itemsName' },
    { title: '计划类型', dataIndex: 'planType' },
    { title: '设备名称', dataIndex: 'equipmentName' },
    { title: '状态', dataIndex: 'status' },
    { title: '计划保养时间', dataIndex: 'planTime', format: 'date|YYYY-MM-DD HH:mm:ss' },
    { title: '设备分类', dataIndex: 'equipmentCategory' },
    { title: '设备编码', dataIndex: 'equipmentCode' },
    { title: '规格型号', dataIndex: 'equipmentSpe' },
    { title: '机身序列号', dataIndex: 'equipmentSN' },
    { title: '设备制造商', dataIndex: 'equipmentSupplierName' },
    { title: '设备位置', dataIndex: 'equipmentPosition' },
    { title: '厂区', dataIndex: 'factoryArea' },
    { title: '到厂时间', dataIndex: 'arrivalTime', format: 'date|YYYY-MM-DD HH:mm:ss' },
    { title: '创建人', dataIndex: 'creatorUserName' },
    { title: '创建时间', dataIndex: 'creatorTime', format: 'date|YYYY-MM-DD HH:mm:ss' },
  ];

  const { createMessage, createConfirm } = useMessage();

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
      autoAdvancedLine: 1, //自动展开行
      i18nConfig: {
        moduleCode: 'MaintenanceColumn',
        transferRange: ['placeholder'], // 可以配置表单的`label`和`placeholder`，或者只配置其中的一项
      },
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
      moduleCode: 'MaintenanceColumn',
    },
  });

  function getTableActions(record): ActionItem[] {
    return [
      {
        icon: 'icon-ym icon-ym-btn-edit',
        onClick: detailText.bind(null, record.id),
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

  function addOrUpdateHandle(id = '') {
    openModal(true, {
      id,
      equipmentClassList: state.equipmentClassList,
      maintenPlanTypeList: state.maintenPlanTypeList,
    });
  }

  function detailText(id) {
    openPopup(true, {
      id,
      equipmentClassList: state.equipmentClassList,
      maintenPlanTypeList: state.maintenPlanTypeList,
    });
  }

  function handleDelete(id) {
    let list: any[] = [];
    list.push(id);
    deleteMaintenance(list).then(res => {
      createMessage.success(res.msg);
      reload();
    });
  }

  onMounted(async () => {
    //设备分类
    const equipmentClassList = ((await baseStore.getDictionaryData('EquipmentClass')) as any[]).map(i => {
      return {
        id: i.enCode,
        fullName: i.fullName,
      };
    });
    state.equipmentClassList = equipmentClassList;
    //计划类型
    const maintenPlanTypeList = ((await baseStore.getDictionaryData('maintenPlanType')) as any[]).map(i => {
      return {
        id: i.enCode,
        fullName: i.fullName,
      };
    });
    state.maintenPlanTypeList = maintenPlanTypeList;
    //状态
    const maintenanceStatusList = ((await baseStore.getDictionaryData('maintenanceStatus')) as any[]).map(i => {
      return {
        id: i.enCode,
        fullName: i.fullName,
      };
    });
    state.maintenanceStatusList = maintenanceStatusList;
  });
</script>
