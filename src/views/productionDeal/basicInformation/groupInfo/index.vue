<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <Grid>
          <template #toolbar-actions>
            <a-space>
              <a-button v-auth="'btn_add'" type="primary" @click="addOrUpdateHandle()"> {{ t('common.add2Text') }} </a-button>
              <a-button v-auth="'btn_batchRemove'" @click="handleDeleteList()"> {{ t('common.batchDelText') }} </a-button>
              <vShowDropdown>
                <template #overlay>
                  <button @click="batchImportOrExport({ key: 'import' })" v-auth="'btn_upload'">{{ t('common.batchImport') }} </button>
                  <button @click="batchImportOrExport({ key: 'export' })" v-auth="'btn_download'">{{ t('common.batchExport') }} </button>
                </template>
                <a-button v-if="hasBtnP('btn_upload') || hasBtnP('btn_download')">{{ t('common.batchImportOrExport') }}</a-button>
              </vShowDropdown>
            </a-space>
          </template>
          <template #action="{ row }">
            <TableAction outside :actions="getTableActions(row)" />
          </template>
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
  import { ActionItem } from '/@/components/Table';
  import { useI18n } from '/@/hooks/web/useI18n';
  import TableAction from '/@/components/Table/src/components/TableAction.vue';
  import { getGroupInfo, deleteGroupInfo, blukDeleteGroupInfo, exportGroupInfoExcel } from '/@/api/productionDeal/groupInfo';
  import { useModal } from '/@/components/Modal';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { message } from 'ant-design-vue';
  import { dateUtil } from '/@/utils/dateUtil';
  import { usePermission } from '/@/hooks/web/usePermission';

  import add from './components/add.vue';
  import ExportModal from '/@/components/ExportModal/index.vue';
  import ImportModal from './components/ImportModal.vue';
  import vShowDropdown from '/@/components/VShowDropdown/src/vShowDropdown.vue';
  defineOptions({ name: 'productionDeal-basicInformation-groupInfo' });
  const { t } = useI18n();
  const [registerForm, { openModal: openFormModal }] = useModal();
  const [registerExportModal, { openModal: openExportModal }] = useModal();
  const [registerImportModal, { openModal: openImportModal }] = useModal();
  const { hasBtnP } = usePermission();
  const columns = [
    { field: 'checkbox', width: 50, type: 'checkbox' },
    { title: '组别编码', field: 'Code' },
    { title: '组别名称', field: 'Name' },
    { title: '所属组织', field: 'OrgName' },
    { title: '主管工号', field: 'DirectorJobNumber' },
    { title: '组长工号', field: 'GroupJobNumber' },
    { title: '物料员工号', field: 'MaterialOfficerJobNumber' },
    { title: '额定人员', field: 'RatedPersonnelJobNumber' },
    { title: '组内人员', field: 'GroupMembersName', width: 200, i18nField: 'GroupMembersIds' },
    { title: '工作描述', field: 'Description' },
    {
      title: '是否启用',
      field: 'Status',
      cellRender: {
        name: 'Tag',
        options: [
          { id: 2, fullName: t('common.disableText'), theme: 'red' },
          { id: 1, fullName: t('common.enableText'), theme: 'green' },
        ],
      },
    },
    { title: '备注', field: 'Remark' },
    { title: '创建人', field: 'CreatorUserName' },
    {
      title: '创建时间',
      field: 'CreatorTime',
      cellRender: {
        name: 'Date',
        format: 'YYYY-MM-DD HH:mm:ss',
      },
    },
    { title: '修改人', field: 'LastModifyUserName' },
    {
      title: '修改时间',
      field: 'LastModifyTime',
      cellRender: {
        name: 'Date',
        format: 'YYYY-MM-DD HH:mm:ss',
      },
    },
    {
      title: t('common.action'),
      field: 'action',
      slots: { default: 'action' },
      width: 100,
      fixed: 'right',
    },
  ];

  const searchFormSchema = [
    {
      fieldName: 'Code',
      label: '',
      component: 'Input',
      defaultValue: '',
      componentProps: {
        placeholder: t(['common.inputPlaceholder', 'dict.GroupInfoColumn.Code']), //'请输入组别编码'
      },
      colProps: { span: 3 },
    },
    {
      fieldName: 'Name',
      label: '',
      component: 'Input',
      defaultValue: '',
      componentProps: {
        placeholder: t(['common.inputPlaceholder', 'dict.GroupInfoColumn.Name']), //'请输入组别名称'
      },
      colProps: { span: 4 },
    },
    {
      fieldName: 'DirectorJobNumber',
      label: '',
      component: 'Input',
      defaultValue: '',
      componentProps: {
        placeholder: t(['common.inputPlaceholder', 'dict.GroupInfoColumn.DirectorJobNumber']), //'请输入主管工号'
      },
      colProps: { span: 4 },
    },
    {
      fieldName: 'MaterialOfficerJobNumber',
      label: '',
      component: 'Input',
      defaultValue: '',
      componentProps: {
        placeholder: t(['common.inputPlaceholder', 'dict.GroupInfoColumn.MaterialOfficerJobNumber']), //'请输入物料员工号'
      },
      colProps: { span: 5 },
    },
    {
      fieldName: 'pickerVal',
      label: '',
      component: 'RangePicker',
      componentProps: {
        format: 'YYYY-MM-DD',
        placeholder: ['打印开始时间', '打印结束时间'],
        width: '400px',
      },
    },
  ];
  const [Grid, { getSelectRowKeys, reload, getFetchParams }] = useVbenVxeGrid({
    formOptions: {
      showCollapseButton: false,
      // 是否在字段值改变时提交表单
      submitOnChange: false,
      submitOnEnter: true,
      commonConfig: {
        componentProps: {},
        labelClass: 'w-0',
      },
      wrapperClass: 'grid grid-cols-6 gap-4',
      schema: searchFormSchema,
      i18nConfig: {
        moduleCode: 'GroupInfoColumn',
        transferRange: ['placeholder'],
      },
    },
    gridOptions: {
      id: 'productionDeal-basicInformation-groupInfo-list',
      columns: columns,
      api: getGroupInfo,
      showIndexColumn: true,
      i18nConfig: {
        moduleCode: 'GroupInfoColumn',
      },
      rowConfig: {
        keyField: 'Id',
      },
      beforeFetch: params => {
        const _params = {
          ...params,
        };
        if (params.pickerVal) {
          _params.StartTime = dateUtil(params.pickerVal[0]).valueOf();
          _params.EndTime = dateUtil(params.pickerVal[1]).valueOf();
          delete _params.pickerVal;
        }
        return _params;
      },
    },
  });

  function getTableActions(record): ActionItem[] {
    return [
      {
        icon: 'icon-ym icon-ym-btn-edit',
        onClick: addOrUpdateHandle.bind(null, record.Id),
        auth: 'btn_edit',
      },
      {
        icon: 'icon-ym icon-ym-delete',
        modelConfirm: {
          title: t('common.delText'),
          onOk: handleDelete.bind(null, record),
        },
        auth: 'btn_batchRemove',
      },
    ];
  }

  const { createMessage, createConfirm } = useMessage();

  //新增或者修改
  function addOrUpdateHandle(id = '') {
    openFormModal(true, { id });
  }

  //单个删除
  function handleDelete(record: Recordable) {
    deleteGroupInfo(record.Id).then(res => {
      createMessage.success(res.msg);
      reload();
    });
  }

  //批量删除
  async function handleDeleteList() {
    const list = getSelectRowKeys();
    if (list?.length === 0) {
      return message.warning(t('common.selectDelDatasTip'));
    } else {
      createConfirm({
        iconType: 'warning',
        title: t('common.tipTitle'),
        content: t('common.beforeDelTip'),
        onOk: async () => {
          const { code } = await blukDeleteGroupInfo(list);
          if (code == 200) {
            message.warning(t('common.delSuccess'));
          }
          reload();
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
  function handleExport() {
    const listQuery = {
      ...getFetchParams(),
    };
    openExportModal(true, {
      api: exportGroupInfoExcel,
      listQuery,
      exportOptions: columns,
      nameProps: 'title',
      idProps: 'field',
      i18nConfig: {
        moduleCode: 'GroupInfoColumn',
      },
    });
  }
</script>

<style scoped lang="less">
  .pldr {
    color: #ff7b00;
  }
</style>
