<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <Grid>
          <template #toolbar-actions>
            <a-button type="primary" v-auth="'btn_add'" @click="handleApply">
              {{ t('common.add') }}
            </a-button>
            <vShowDropdown>
              <template #overlay>
                <button @click="batchImportOrExport({ key: 'import' })" v-if="hasBtnP('btn_upload')">{{ t('common.batchImport') }} </button>
                <button @click="batchImportOrExport({ key: 'export' })" v-if="hasBtnP('btn_download')">{{ t('common.batchExport') }} </button>
              </template>
              <a-button v-if="hasBtnP('btn_upload') || hasBtnP('btn_download')">{{ t('common.batchImportOrExport') }}</a-button>
            </vShowDropdown>
            <a-button v-auth="'btn_remove'" @click="handleDel">{{ t('views.business.quota.delete') }}</a-button>
          </template>
          <!-- <template #bodyCell="{ column, text, record }">
            <template v-if="column.dataIndex === 'status'">
              <template v-if="text == '1'">
                <Badge color="#87d068" :text="STATE_MAP[text]" />
              </template>
              <template v-if="text == '0'">
                <Badge color="#f50" :text="STATE_MAP[text]" />
              </template>
            </template>
            <template v-else-if="column.key === 'action'">
              <TableAction :actions="getTableActions(record)" />
            </template>
          </template> -->
          <template #action="{ row }">
            <TableAction outside :actions="getTableActions(row)" />
          </template>
        </Grid>
      </div>
    </div>
    <ExportModal @register="registerExportModal" />
    <ApplyPop @register="registerApply" @reload="reload" />
    <EditPop @register="registerEdit" @reload="reload" />
    <ImportModal @register="registerImportPop" @refresh="reload"></ImportModal>
  </div>
</template>

<script setup lang="ts">
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { Badge } from 'ant-design-vue';
  import { ActionItem, BasicTable, FormProps, TableAction, useTable } from '/@/components/Table';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { onMounted } from 'vue';
  import { useBaseStore } from '/@/store/modules/base';
  import { useModal } from '/@/components/Modal';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { cloneDeep } from 'lodash-es';
  import ExportModal from '/@/components/ExportModal/index.vue';
  import { ImportModal } from '/@/components/ImportModal';
  import ApplyPop from './components/ApplyPop.vue';
  import EditPop from './components/EditPop.vue';
  import {
    bulkdeleteBaseDataLaborrate,
    delBaseDataLaborrate,
    downloadBaseDataLaborrateImportTemplate,
    getBaseDataLaborrate,
    importLaborrate,
    importLaborrateExportExcel,
    saveBaseDataLaborrate,
    getBaseDataProcessAllist,
  } from '/@/api/purchase/rateOfWork';
  import { usePopup } from '/@/components/Popup';
  import { bignumber, add } from 'mathjs';
  import { getTemplateDownload, importExcel, saveBatchData } from '/@/api/basicData/productCodeApply';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { importList } from '/@/views/finance/basicInformation/rateOfWork/CONFIG';
  import vShowDropdown from '/@/components/VShowDropdown/src/vShowDropdown.vue';
  defineOptions({ name: 'finance-basicInformation-rateOfWork' });

  const { hasBtnP } = usePermission();

  const { createMessage, createConfirm } = useMessage();
  const [registerImportModal, { openModal: openImportModal }] = useModal();
  const [registerExportModal, { openModal: openExportModal, closeModal }] = useModal();
  const [registerApply, { openPopup: openApplyPop }] = usePopup();
  const [registerEdit, { openPopup: openEditPop }] = usePopup();
  const [registerImportPop, { openPopup: openImportPopup }] = usePopup();
  const baseStore = useBaseStore();

  const STATE_MAP = [
    { id: '1', fullName: '启用', theme: 'green' },
    { id: '0', fullName: '停用', theme: 'red' },
  ];

  const { t } = useI18n();
  const columns = [
    { type: 'checkbox', field: 'checkbox', width: 50 },
    {
      title: '主要制程',
      field: 'mainProcessDesc',
      width: 180,
    },
    {
      title: '工序',
      field: 'workingProcedure',
      width: 200,
    },
    {
      title: '供应商',
      field: 'supplierName',
      width: 150,
    },
    {
      title: '规格',
      field: 'specifications',
      width: 180,
    },
    {
      title: '是否启用',
      field: 'status',
      width: 120,
      cellRender: {
        name: 'Tag',
        options: STATE_MAP,
      },
    },
    {
      title: t('dict.LaborRateTypeEnum.1'),
      field: 'LaborRateTypeEnumd',
      // width: 240,
      children: [
        { title: t('dict.LaborRateColumn.fixedCost'), field: '1.fixedCost', width: 150 },
        { title: t('dict.LaborRateColumn.changeCost'), field: '1.changeCost', width: 150 },
        { title: t('dict.LaborRateColumn.count'), field: '1.count', width: 150 },
      ],
    },
    {
      title: t('dict.LaborRateTypeEnum.2'),
      // width: 200,
      field: 'LaborRateTypeEnumd2',
      children: [
        { title: t('dict.LaborRateColumn.fixedCost'), field: '2.fixedCost', width: 150 },
        { title: t('dict.LaborRateColumn.changeCost'), field: '2.changeCost', width: 150 },
        { title: t('dict.LaborRateColumn.count'), field: '2.count', width: 150 },
      ],
    },
    {
      title: t('dict.LaborRateTypeEnum.3'),
      field: 'LaborRateTypeEnumd3',
      // width: 200,
      children: [
        { title: t('dict.LaborRateColumn.fixedCost'), field: '3.fixedCost', width: 150 },
        { title: t('dict.LaborRateColumn.changeCost'), field: '3.changeCost', width: 150 },
        { title: t('dict.LaborRateColumn.count'), field: '3.count', width: 150 },
      ],
    },
    {
      title: t('dict.LaborRateTypeEnum.4'),
      field: 'LaborRateTypeEnumd4',
      // width: 200,
      children: [
        { title: t('dict.LaborRateColumn.fixedCost'), field: '4.fixedCost', width: 150 },
        { title: t('dict.LaborRateColumn.changeCost'), field: '4.changeCost', width: 150 },
        { title: t('dict.LaborRateColumn.count'), field: '4.count', width: 150 },
      ],
    },
    {
      title: t('dict.LaborRateTypeEnum.5'),
      field: 'LaborRateTypeEnumd5',
      // width: 200,
      children: [
        { title: t('dict.LaborRateColumn.fixedCost'), field: '5.fixedCost', width: 150 },
        { title: t('dict.LaborRateColumn.changeCost'), field: '5.changeCost', width: 150 },
        { title: t('dict.LaborRateColumn.count'), field: '5.count', width: 150 },
      ],
    },
    {
      title: t('dict.LaborRateTypeEnum.6'),
      field: 'LaborRateTypeEnumd6',
      // width: 200,
      children: [
        { title: t('dict.LaborRateColumn.fixedCost'), field: '6.fixedCost', width: 150 },
        { title: t('dict.LaborRateColumn.changeCost'), field: '6.changeCost', width: 150 },
        { title: t('dict.LaborRateColumn.count'), field: '6.count', width: 150 },
      ],
    },
    {
      title: t('dict.LaborRateTypeEnum.7'),
      field: 'LaborRateTypeEnumd7',
      // width: 200,
      children: [
        { title: t('dict.LaborRateColumn.fixedCost'), field: '7.fixedCost', width: 150 },
        { title: t('dict.LaborRateColumn.changeCost'), field: '7.changeCost', width: 150 },
        { title: t('dict.LaborRateColumn.count'), field: '7.count', width: 150 },
      ],
    },
    {
      title: t('dict.LaborRateTypeEnum.8'),
      field: 'LaborRateTypeEnumd8',
      // width: 200,
      children: [
        { title: t('dict.LaborRateColumn.fixedCost'), field: '8.fixedCost', width: 150 },
        { title: t('dict.LaborRateColumn.changeCost'), field: '8.changeCost', width: 150 },
        { title: t('dict.LaborRateColumn.count'), field: '8.count', width: 150 },
      ],
    },
    {
      title: t('dict.LaborRateTypeEnum.9'),
      field: 'LaborRateTypeEnumd9',
      // width: 200,
      children: [
        { title: t('dict.LaborRateColumn.fixedCost'), field: '9.fixedCost', width: 150 },
        { title: '变动制费(H)', field: '9.changeCost', width: 150 },
        { title: t('dict.LaborRateColumn.count'), field: '9.count', width: 150 },
      ],
    },
    {
      title: '创建人',
      field: 'creatorUserName',
      width: 200,
    },
    {
      title: '创建时间',
      field: 'creatorTime',
      width: 200,
      cellRender: {
        name: 'Date',
      },
    },
    {
      title: '修改人',
      field: 'lastModifyUserName',
      width: 200,
    },
    {
      title: '修改时间',
      field: 'lastModifyTime',
      width: 200,
      cellRender: {
        name: 'Date',
      },
    },
    { title: '操作', field: 'action', slots: { default: 'action' }, width: 80, fixed: 'right' },
  ];

  // const [registerTable, { reload, getForm, getSelectRowKeys, setSelectedRowKeys, getFetchParams }] = useTable({
  //   api: getBaseDataLaborrate,
  //   columns,
  //   bordered: true,
  //   rowKey: 'id',
  //   useSearchForm: true,
  //   formConfig: getFormConfig(),
  //   rowSelection: {
  //     type: 'checkbox',
  //   },
  //   afterFetch: data => {
  //     const cloneData = cloneDeep(data);
  //     const afterData = cloneData.map(item => {
  //       // 处理费率
  //       // 接受数组，转成 1.fixedCost 1.changeCost 1.count  2.fixedCost 2.changeCost 2.count
  //       item.laborRateDetailedOutputs.forEach(value => {
  //         item['' + value.laborRateType + '.' + 'fixedCost'] = value.fixedCost;
  //         item['' + value.laborRateType + '.' + 'changeCost'] = value.changeCost;

  //         item['' + value.laborRateType + '.' + 'count'] = add(bignumber(value.fixedCost), bignumber(value.changeCost)).toString();
  //       });
  //       return {
  //         ...item,
  //       };
  //     });
  //     return afterData;
  //   },
  //   actionColumn: {
  //     width: 70,
  //     title: t('views.business.quota.action'),
  //     dataIndex: 'action',
  //   },
  //   i18nConfig: {
  //     moduleCode: 'LaborRateColumn',
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
      schema: getFormConfig(),
      i18nConfig: {
        moduleCode: 'SampleApplyColumn',
        transferRange: ['placeholder'],
      },
    },
    gridOptions: {
      id: 'labor-rate-list',
      columns: columns,
      api: getBaseDataLaborrate,
      useSearchForm: true,
      bordered: true,
      showIndexColumn: true,
      rowConfig: { keyField: 'id' },
      afterFetch: data => {
        data.list.map(item => {
          // 处理费率
          // 接受数组，转成 1.fixedCost 1.changeCost 1.count  2.fixedCost 2.changeCost 2.count
          item.laborRateDetailedOutputs.forEach(value => {
            item[value.laborRateType + '.fixedCost'] = value.fixedCost;
            item[value.laborRateType + '.changeCost'] = value.changeCost;
            item[value.laborRateType + '.count'] = add(bignumber(value.fixedCost), bignumber(value.changeCost)).toString();
          });
          return {
            ...item,
          };
        });
      },
      i18nConfig: { moduleCode: 'LaborRateColumn' },
    },
  });

  const { reload, getSelectRowKeys, getFetchParams, clearSelectedRowKeys } = gridApi;

  function batchImportFile() {
    openImportPopup(true, {
      importPreviewApi: importLaborrate,
      importSaveApi: saveBaseDataLaborrate,
      templateApi: downloadBaseDataLaborrateImportTemplate,
      previewColumn: importList,
      apiParams: {
        importSave: {
          isoperation: hasBtnP('btn_review') ? 1 : 0,
        },
      },
    });
  }

  function batchImportOrExport({ key }) {
    const openMethod = key === 'import' ? batchImportFile : handleExport;
    openMethod();
  }

  function getFormConfig(): any {
    return [
      // {
      //   fieldName: 'code',
      //   component: 'Input',
      //   label: '',
      //   i18nField: 'supplierCode',
      //   componentProps: {
      //     submitOnPressEnter: true,
      //   },
      // },
      {
        fieldName: 'supplierName',
        component: 'Input',
        label: '',
        i18nField: 'supplierName',
        componentProps: {
          // placeholder: t('dict.SampleApplyColumn.supplierName'),
          submitOnPressEnter: true,
        },
      },
      // {
      //   fieldName: 'shortName',
      //   component: 'Input',
      //   label: '',
      //   componentProps: {
      //     submitOnPressEnter: true,
      //   },
      // },
      {
        fieldName: 'status',
        label: '',
        component: 'Select',
        componentProps: {
          placeholder: t('common.status'),
          options: [
            { enCode: '0', fullName: t('common.disableText') },
            { enCode: '1', fullName: t('common.enableText') },
          ],
          fieldNames: { value: 'enCode', label: 'fullName' },
        },
      },
      {
        fieldName: 'workingProcedure',
        label: '',
        component: 'ApiSelect',
        i18nField: 'CommonCol.process',
        componentProps: {
          api: getBaseDataProcessAllist,
          placeholder: '工序',
          showSearch: true,
          apiSearch: {
            show: true,
            searchName: 'keyword',
          },
          resultField: 'data',
          labelField: 'code',
          valueField: 'code',
          nameFormat: ['code', ' / ', 'name'],
          filterOption: false,
          notFoundContent: null,
          immediate: true,
        },
      },
      // {
      //   fieldName: 'workingProcedure',
      //   component: 'Select',
      //   label: '',
      //   i18nField: 'CommonCol.process',
      //   componentProps: {
      //     // placeholder: t('dict.SampleApplyColumn.supplierName'),
      //     submitOnPressEnter: true,
      //   },
      // },
    ];
  }

  function handleApply() {
    openApplyPop(true, {});
  }

  async function handleDel() {
    const selectKeys = getSelectRowKeys();
    if (selectKeys.length === 0) return createMessage.error(t('common.deleteObjectText'));
    createConfirm({
      iconType: 'warning',
      title: t('common.tipTitle'),
      content: t('common.beforeDelTip'),
      onOk: async () => {
        try {
          const { code, msg } = await bulkdeleteBaseDataLaborrate(selectKeys);
          if (code === 200) {
            clearSelectedRowKeys();
            createMessage.success(msg);
            reload();
          }
        } catch (e) {
          clearSelectedRowKeys();
          reload();
        }
      },
    });
  }

  function handleExport() {
    const exportColumns = [];
    columns.forEach(item => {
      if (item.field) {
        exportColumns.push(item);
      }
    });
    openExportModal(true, {
      listQuery: {
        ...getFetchParams(),
      },
      api: importLaborrateExportExcel,
      exportOptions: exportColumns,
      nameProps: 'title',
      idProps: 'field',
      i18nConfig: {
        moduleCode: 'LaborRateColumn',
      },
    });
  }

  function getTableActions(record): ActionItem[] {
    return [
      {
        icon: 'icon-ym icon-ym-btn-preview',
        onClick: handleEdit.bind(null, record),
        auth: 'btn_detail',
      },
      {
        icon: 'icon-ym icon-ym-delete',
        modelConfirm: {
          onOk: onDelete.bind(null, record.id),
          auth: 'btn_remove',
        },
      },
    ];
  }

  function handleEdit(record) {
    openEditPop(true, record);
  }

  async function onDelete(id) {
    const { code, msg } = await delBaseDataLaborrate(id);
    if (code === 200) {
      createMessage.success(msg);
      reload();
    }
  }

  // onMounted(() => {
  //   getOps();
  // });

  // async function getOps() {
  //   const { updateSchema } = getForm();
  //   updateSchema({
  //     field: 'status',
  //     componentProps: {
  //       options: [
  //         {
  //           enCode: '0',
  //           fullName: t('common.disableText'),
  //         },
  //         {
  //           enCode: '1',
  //           fullName: t('common.enableText'),
  //         },
  //       ],
  //       fieldNames: { value: 'enCode' },
  //     },
  //   });
  // }

  function handleImport() {
    openImportModal(true, {});
  }
</script>

<style lang="less" scoped>
  :deep(.icon-ym) {
    font-size: 18px;
  }
</style>

<style scoped lang="less">
  @import url('/src/design/page.less');
</style>
