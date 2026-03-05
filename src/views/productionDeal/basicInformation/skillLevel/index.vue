<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <Grid>
          <template #toolbar-actions>
            <a-button type="primary" @click="addOrUpdateHandle()"> {{ t('common.add2Text') }} </a-button>
            <!-- <a-button type="primary" @click="handleExport"><i class="icon-ym icon-ym-btn-download button-preIcon"> </i>{{ t('common.exportText') }} </a-button>
            <a-button @click="handleImport"><i class="icon-ym icon-ym-btn-upload button-preIcon"> </i>{{ t('common.importText') }} </a-button> -->
            <vShowDropdown>
              <template #overlay>
                <button @click="batchImportOrExport({ key: 'export' })">{{ t('common.batchExport') }} </button>
                <button @click="batchImportOrExport({ key: 'import' })">{{ t('common.batchImport') }} </button>
              </template>
              <a-button>{{ t('common.batchImportOrExport') }}</a-button>
            </vShowDropdown>
            <a-button danger @click="handleDeleteList()"> {{ t('common.batchDelText') }} </a-button>
          </template>
          <template #action="{ row }">
            <TableAction :actions="getTableActions(row)" />
          </template>
          <!-- <template #bodyCell="{ column, record }">
            <template v-if="column.dataIndex === 'Status'">
              <a-tag :color="record.Status === 1 ? 'success' : 'error'">{{ record.Status === 1 ? t('common.valid') : t('common.invalid') }}</a-tag>
            </template>
            <template v-if="column.dataIndex === 'action'">
              <TableAction :actions="getTableActions(record)" />
            </template>
          </template> -->
        </Grid>
      </div>
    </div>
    <add @register="registerForm" @reload="reload" />
    <ExportModal @register="registerExportModal" />
    <ImportModal @register="registerImportModal" @reload="reload" />
  </div>
</template>

<script setup lang="ts">
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { BasicTable, useTable, BasicColumn, FormSchema, ActionItem } from '/@/components/Table';
  import { useI18n } from '/@/hooks/web/useI18n';
  import TableAction from '/@/components/Table/src/components/TableAction.vue';
  import { getSkillLevel, deleteSkillLevel, blukDeleteSkillLevel, exportSkillLevelExcel } from '/@/api/productionDeal/skillLevel';
  import { getJobInfoList } from '../../../../api/productionDeal/jobInfo';
  import { useModal } from '/@/components/Modal';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { reactive, onMounted } from 'vue';
  import { message } from 'ant-design-vue';
  import { useBaseStore } from '/@/store/modules/base';
  import { formatTableDefaultText } from '/@/utils';
  import vShowDropdown from '/@/components/VShowDropdown/src/vShowDropdown.vue';
  import add from './components/add.vue';
  import ExportModal from '/@/components/ExportModal/index.vue';
  import ImportModal from './components/ImportModal.vue';

  const { t } = useI18n();
  const baseStore = useBaseStore();

  const STATUS = [
    { id: 1, fullName: t('common.valid'), theme: 'green' },
    { id: 2, fullName: t('common.invalid'), theme: 'red' },
  ];

  interface State {
    skillLevel: any[];
    jobInfoList: any[];
  }

  const state = reactive<State>({
    skillLevel: [],
    jobInfoList: [],
  });

  const [registerForm, { openModal: openFormModal }] = useModal();
  const [registerExportModal, { openModal: openExportModal }] = useModal();
  const [registerImportModal, { openModal: openImportModal }] = useModal();

  const columns = [
    { type: 'checkbox', field: 'checkbox', width: 50 },
    { title: '技能编码', field: 'Code', align: 'center' },
    { title: '技能名称', field: 'Name' },
    { title: '所属组织', field: 'OrgName' },
    { title: '所属岗位', field: 'JobInfoName' },
    {
      title: '是否启用',
      field: 'Status',
      cellRender: {
        name: 'Tag',
        options: STATUS,
      },
    },
    { title: '技能描述', field: 'Description' },
    { title: '技能等级', field: 'SkillLevelName' },
    { title: '创建人', field: 'CreatorUserName' },
    {
      title: '创建时间',
      field: 'CreatorTime',
      cellRender: {
        name: 'Date',
      },
    },
    { title: '修改人', field: 'LastModifyUserName' },
    {
      title: '修改时间',
      field: 'LastModifyTime',
      cellRender: {
        name: 'Date',
      },
    },
    { title: '操作', field: 'action', slots: { default: 'action' }, width: 80, fixed: 'right' },
  ];

  const searchFormSchema = [
    {
      fieldName: 'Code',
      label: '',
      component: 'Input',
      defaultValue: '',
      componentProps: {
        placeholder: t(['common.inputPlaceholder', 'dict.SkillLevelColumn.Code']), //'请输入技能编码',
      },
      colProps: { span: 4 },
    },
    {
      fieldName: 'Name',
      label: '',
      component: 'Input',
      defaultValue: '',
      componentProps: {
        placeholder: t(['common.inputPlaceholder', 'dict.SkillLevelColumn.Name']), //'请输入技能名称',
      },
      colProps: { span: 4 },
    },
    {
      fieldName: 'SkillLevel',
      label: '',
      component: 'Select',
      componentProps: {
        placeholder: t(['common.selectPlaceholder', 'dict.SkillLevelColumn.SkillLevel']), //'请选择技能等级',
      },
      colProps: { span: 4 },
    },
    {
      fieldName: 'pickerVal',
      label: '',
      component: 'RangePicker',
      componentProps: {
        format: 'YYYY-MM-DD',
        placeholder: ['打印开始时间', '打印结束时间'],
        submitOnPressEnter: true,
      },
    },
  ];

  //getRowSelection获取行id, reload刷新表单，getFetchParams获取表单数据
  // const [registerTable, { getRowSelection, reload, getFetchParams, getForm }] = useTable({
  //   api: getSkillLevel,
  //   title: '',
  //   columns,
  //   rowKey: 'Id',
  //   isCanResizeParent: true,
  //   canResize: true, //自适应高度
  //   formConfig: {
  //     //搜索框
  //     labelWidth: 100,
  //     schemas: searchFormSchema,
  //     fieldMapToTime: [['pickerVal', ['startTime', 'endTime']]],
  //     autoAdvancedLine: 1, //自动展开行
  //   },
  //   striped: true,
  //   useSearchForm: true, //使用搜索表单
  //   showTableSetting: true, //刷新按钮,默认打开

  //   showIndexColumn: true, //显示序号
  //   pagination: {
  //     pageSize: 30,
  //     size: 'small',
  //   },
  //   rowSelection: {
  //     type: 'checkbox',
  //   },
  //   actionColumn: {
  //     width: 70,
  //     title: '操作',
  //     dataIndex: 'action', //字段
  //     fixed: 'right', //显示在右边
  //   },
  //   transformCellText: ({ text }) => formatTableDefaultText(text),
  //   i18nConfig: {
  //     moduleCode: `SkillLevelColumn`,
  //   },
  // });

  const [Grid, gridApi] = useVbenVxeGrid({
    formOptions: {
      collapsed: false,
      showCollapseButton: false,
      submitOnChange: false,
      submitOnEnter: true,
      commonConfig: {
        componentProps: {},
        labelClass: 'w-0',
      },
      wrapperClass: 'grid grid-cols-5 gap-4',
      schema: searchFormSchema,
      i18nConfig: {
        moduleCode: 'SkillLevelColumn',
        transferRange: ['placeholder'],
      },
    },
    gridOptions: {
      id: 'productionDeal-basicInformation-jobInfo-list',
      columns: columns,
      api: getSkillLevel,
      isCanResizeParent: true,
      canResize: true, //自适应高度
      useSearchForm: true,
      bordered: true,
      showIndexColumn: true,
      striped: true,
      showTableSetting: true, //刷新按钮,默认打开
      transformCellText: ({ text }) => formatTableDefaultText(text),
      i18nConfig: {
        moduleCode: 'SkillLevelColumn',
      },
      pagerConfig: {
        pageSize: 30,
        size: 'small',
      },
    },
  });

  const { reload, getSelectRowKeys, getFetchParams, clearSelectedRowKeys } = gridApi;

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

  const { createMessage, createConfirm } = useMessage();

  //新增或者修改
  function addOrUpdateHandle(id = '') {
    openFormModal(true, { id, skillLevel: state.skillLevel, jobInfoList: state.jobInfoList });
  }

  //单个删除
  function handleDelete(record: Recordable) {
    deleteSkillLevel(record.Id).then(res => {
      createMessage.success(res.msg);
      reload();
      console.log('test');
    });
  }

  //批量删除
  async function handleDeleteList() {
    const list = getSelectRowKeys();
    if (list?.length === 0) {
      clearSelectedRowKeys();
      return message.warning(t('common.selectDelDatasTip'));
    } else {
      createConfirm({
        iconType: 'warning',
        title: t('common.tipTitle'),
        content: t('common.beforeDelTip'),
        onOk: async () => {
          try {
            const { code } = await blukDeleteSkillLevel(list);
            if (code == 200) {
              clearSelectedRowKeys();
              message.warning(t('common.delSuccess'));
            }
            reload();
          } catch (e) {
            clearSelectedRowKeys();
            reload();
            throw e;
          }
        },
      });
    }
  }

  function batchImportOrExport({ key }) {
    const openMethod = key === 'import' ? handleImport : handleExport;
    openMethod();
  }

  //导入
  function handleImport() {
    openImportModal(true, {});
  }

  //导出
  async function handleExport() {
    const listQuery = {
      ...(await getFetchParams()),
    };
    openExportModal(true, {
      api: exportSkillLevelExcel,
      listQuery,
      exportOptions: columns,
      nameProps: 'title',
      idProps: 'field',
      i18nConfig: {
        moduleCode: 'SkillLevelColumn',
      },
    });
  }

  onMounted(async () => {
    baseStore.getDictionaryData('SkillLevel').then(res => {
      state.skillLevel = res as any[];
      getForm().updateSchema({
        field: 'SkillLevel',
        componentProps: {
          options: res,
          fieldNames: { value: 'enCode' },
        },
      });
    });

    const optionList = await getJobInfoList();
    const jobInfos = optionList.data.map(i => {
      return {
        id: i.Id,
        fullName: i.Name,
      };
    });
    state.jobInfoList = jobInfos as any[];
  });
</script>

<style scoped lang="less">
  .pldr {
    color: #ff7b00;
  }
</style>
