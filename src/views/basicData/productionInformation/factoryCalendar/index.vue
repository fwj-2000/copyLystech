<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-left" style="width: 400px">
      <LydcCalendar class="lydc-calendar" mode="month" @select="selectDate" :isShowHoliady="true" />
    </div>
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content">
        <BasicTable @register="registerTable" :searchInfo="searchInfo">
          <template #tableTitle>
            <a-button type="primary" preIcon="icon-ym icon-ym-btn-add" @click="addOrUpdateHandle()"> {{ t('common.add2Text') }} </a-button>
            <a-button @click="handleDeleteList()"> {{ t('common.batchDelText') }} </a-button>
            <a-button type="primary" @click="handleExport"><i class="icon-ym icon-ym-btn-download button-preIcon"> </i>{{ t('common.exportText') }} </a-button>
          </template>
          <template #bodyCell="{ column, record }">
            <template v-if="column.dataIndex === 'Status'">
              <a-tag :color="record.Status === 1 ? 'success' : 'error'">{{ record.Status === 1 ? t('common.valid') : t('common.invalid') }}</a-tag>
            </template>
            <template v-if="column.dataIndex === 'action'">
              <TableAction :actions="getTableActions(record)" />
            </template>
          </template>
        </BasicTable>
      </div>
    </div>
    <add @register="registerForm" @reload="reload" />
    <ExportModal @register="registerExportModal" />
    <ImportModal @register="registerImportModal" @reload="reload" />
  </div>
</template>
<script lang="ts" setup>
  import { BasicTable, useTable, BasicColumn, FormSchema, ActionItem } from '/@/components/Table';
  import { useI18n } from '/@/hooks/web/useI18n';
  import TableAction from '/@/components/Table/src/components/TableAction.vue';
  import { getFactoryCalendarList, deleteFactoryCalendar, blukDeleteFactoryCalendar, exportFactoryCalendarExcel } from '/@/api/basicData/factoryCalendar';
  import { useModal } from '/@/components/Modal';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { reactive, unref } from 'vue';
  import { message } from 'ant-design-vue';
  import { formatTableDefaultText } from '/@/utils';
  import dayjs from 'dayjs';
  import { getDateTimeUnit } from '/@/utils/lydc';
  import add from './components/add.vue';
  import ExportModal from '/@/components/ExportModal/index.vue';
  import ImportModal from './components/ImportModal.vue';
  import { LydcCalendar } from '/@/components/Lydc/Calendar';

  const { t } = useI18n();

  interface SearchInfo {
    Date: number | null;
  }

  const searchInfo = reactive<SearchInfo>({
    Date: null,
  });

  const [registerForm, { openModal: openFormModal }] = useModal();
  const [registerExportModal, { openModal: openExportModal }] = useModal();
  const [registerImportModal, { openModal: openImportModal }] = useModal();

  const columns: BasicColumn[] = [
    { title: '日期', dataIndex: 'Date', align: 'center', format: 'date|YYYY-MM-DD', width: 100 },
    { title: '周数', dataIndex: 'Weeks', width: 100 },
    { title: '星期', dataIndex: 'WeekdayName', width: 100 },
    { title: '班次', dataIndex: 'ClassesNames', width: 150 },
    { title: '生产线', dataIndex: 'ProductLineName' },
    { title: '机台', dataIndex: 'EquipmentNames', width: 240 },
    { title: '是否休息日', dataIndex: 'IsRestDayName', width: 100 },
    { title: '工作日数量', dataIndex: 'WeekdayNumber', width: 100 },
    { title: '工作小时数', dataIndex: 'WorkingHours', width: 100 },
    { title: '备注', dataIndex: 'Remark' },
    { title: '创建人', dataIndex: 'CreatorUserName' },
    { title: '创建时间', dataIndex: 'CreatorTime', format: 'date|YYYY-MM-DD HH:mm:ss' },
    { title: '修改人', dataIndex: 'LastModifyUserName' },
    { title: '修改时间', dataIndex: 'LastModifyTime', format: 'date|YYYY-MM-DD HH:mm:ss' },
  ];

  const searchFormSchema: FormSchema[] = [
    {
      field: 'EquipmentName',
      label: '',
      component: 'Input',
      defaultValue: '',
      componentProps: {
        placeholder: t(['common.inputPlaceholder', 'dict.FactoryCalendarColumn.EquipmentNames']), //'请输入机台',
      },
      colProps: { span: 4 },
    },
    {
      field: 'Weeks',
      label: '',
      component: 'Input',
      defaultValue: '',
      componentProps: {
        placeholder: t(['common.inputPlaceholder', 'dict.FactoryCalendarColumn.Weeks']), //'请输入周数',
      },
      colProps: { span: 5 },
    },
    {
      field: 'pickerVal',
      label: '',
      component: 'DateRange',
      componentProps: {
        format: 'YYYY-MM-DD',
        placeholder: ['打印开始时间', '打印结束时间'],
        width: '400px',
      },
    },
  ];

  //getRowSelection获取行id, reload刷新表单，getFetchParams获取表单数据
  const [registerTable, { getRowSelection, reload, getFetchParams, getForm }] = useTable({
    api: getFactoryCalendarList,
    title: '',
    columns,
    rowKey: 'Id',
    isCanResizeParent: true,
    canResize: true, //自适应高度
    formConfig: {
      //搜索框
      labelWidth: 100,
      schemas: searchFormSchema,
      fieldMapToTime: [['pickerVal', ['StartTime', 'EndTime']]],
      autoAdvancedLine: 1, //自动展开行
    },
    striped: true,
    useSearchForm: true, //使用搜索表单
    showTableSetting: true, //刷新按钮,默认打开
    bordered: true, //显示表格边框
    showIndexColumn: true, //显示序号
    pagination: {
      pageSize: 30,
      size: 'small',
    },
    rowSelection: {
      type: 'checkbox',
    },
    actionColumn: {
      width: 70,
      title: '操作',
      dataIndex: 'action', //字段
      fixed: 'right', //显示在右边
    },
    transformCellText: ({ text }) => formatTableDefaultText(text),
    i18nConfig: {
      moduleCode: `FactoryCalendarColumn`,
    },
  });

  function getTableActions(record): ActionItem[] {
    return [
      {
        icon: 'icon-ym icon-ym-btn-edit',
        onClick: addOrUpdateHandle.bind(null, record.Id),
      },
      {
        icon: 'icon-ym icon-ym-delete',
        modelConfirm: {
          title: t('common.delText'),
          onOk: handleDelete.bind(null, record),
        },
      },
    ];
  }

  function selectDate(date) {
    searchInfo.Date = unref(dayjs(date).tz().startOf(getDateTimeUnit('YYYY-MM-DD')).valueOf());
    getForm().resetFields();
  }

  const { createMessage, createConfirm } = useMessage();

  //新增或者修改
  function addOrUpdateHandle(id = '') {
    openFormModal(true, { id });
  }

  //单个删除
  function handleDelete(record: Recordable) {
    deleteFactoryCalendar(record.Id).then(res => {
      createMessage.success(res.msg);
      reload();
      console.log('test');
    });
  }

  //批量删除
  async function handleDeleteList() {
    const list = getRowSelection().selectedRowKeys;
    if (list?.length === 0) {
      getRowSelection().selectedRowKeys = [];
      return message.warning(t('common.selectDelDatasTip'));
    } else {
      createConfirm({
        iconType: 'warning',
        title: t('common.tipTitle'),
        content: t('common.beforeDelTip'),
        onOk: async () => {
          try {
            const { code } = await blukDeleteFactoryCalendar(list);
            if (code == 200) {
              getRowSelection().selectedRowKeys = [];
              message.warning(t('common.delSuccess'));
            }
            reload();
          } catch (e) {
            getRowSelection().selectedRowKeys = [];
            reload();
            throw e;
          }
        },
      });
    }
  }

  //导入
  function handleImport() {
    openImportModal(true, {});
  }

  //导出
  function handleExport() {
    const listQuery = {
      ...getFetchParams(),
    };
    openExportModal(true, {
      api: exportFactoryCalendarExcel,
      listQuery,
      exportOptions: columns,
      nameProps: 'title',
      idProps: 'field',
      i18nConfig: {
        moduleCode: 'FactoryCalendarColumn',
      },
    });
  }
</script>

<style scoped lang="less">
  ::v-deep(.ant-picker-calendar-full .ant-picker-panel .ant-picker-calendar-date-content) {
    min-height: 50px !important;
    height: auto !important;
  }

  .holiday-tag {
    color: red;
  }
</style>
