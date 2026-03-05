<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <VxeBasicTable>
          <template #iqcTestReportId="{ row }">
            <span class="table-a" @click="handleiqcTestReport(row)"> {{ t('common.viewDetails') }} </span>
          </template>

          <template #testReportName="{ row }">
            <span class="table-a" @click="handleFileView(row)">{{ t('common.viewDetails') }}</span>
          </template>

          <template #nodeDetail="{ row }">
            <span class="table-a" @click="handleNodeModal(row)">{{ t('common.viewDetails') }}</span>
          </template>

          <template #toolbar-actions>
            <a-button type="primary" v-auth="'btn_download'" @click="handleOpenExportModal">{{ t('common.batchExport') }}</a-button>
          </template>

          <template #mdCheckId="{ row }">
            <span v-if="row.mdCheckId" class="table-a" @click="() => showDevlopApplyDetail(row.mdCheckId)">{{ t('common.detailText') }}</span>
          </template>

          <template #mdPurchaseId="{ row }">
            <span v-if="row.mdPurchaseId" class="table-a" @click="() => showMdPurchaseDetail(row.mdPurchaseId)">{{ t('common.detailText') }}</span>
          </template>

          <template #mdRepeatedlyId="{ row }">
            <span v-if="row.mdRepeatedlyId" class="table-a" @click="() => showMdRepeatedDetail(row.mdRepeatedlyId)">{{ t('common.detailText') }}</span>
          </template>

          <template #mdSqeId="{ row }">
            <span v-if="row.mdSqeId" class="table-a" @click="() => showDevlopApplyDetail(row.id)">{{ t('common.detailText') }}</span>
          </template>

          <template #mdMcId="{ row }">
            <span v-if="row.mdMcId" class="table-a" @click="() => showMcDetail(row.mdMcId)">{{ t('common.detailText') }}</span>
          </template>

          <template #mdIqcId="{ row }">
            <span v-if="row.mdIqcId" class="table-a" @click="() => showDevlopApplyDetail(row.id)">{{ t('common.detailText') }}</span>
          </template>

          <template #mdEngineeringId="{ row }">
            <span v-if="row.mdEngineeringId" class="table-a" @click="() => showDevlopApplyDetail(row.id)">{{ t('common.detailText') }}</span>
          </template>

          <template #mdPurchaseCheckId="{ row }">
            <span v-if="row.mdPurchaseCheckId" class="table-a" @click="() => showDevlopApplyDetail(row.id)">{{ t('common.detailText') }}</span>
          </template>

          <template #mdImportId="{ row }">
            <span v-if="row.mdImportId" class="table-a" @click="() => showMdImportDetail(row.mdImportId)">{{ t('common.detailText') }}</span>
          </template>

          <template #documentControlId="{ row }">
            <span v-if="row.documentControlId" class="table-a" @click="() => showDocumentControlDetail(row.documentControlId)">{{
              t('common.detailText')
            }}</span>
          </template>
        </VxeBasicTable>
      </div>
    </div>

    <!-- 审核详情, 材料登记详情, 材料检测详情, 材料验证导入处理详情, 采购结论处理详情 -->
    <DevlopApplyDetailPop @register="registerDevlopApplyDetail" />

    <!-- 采购推荐详情 -->
    <MdPurchaseDetailPopup @register="registerMdPurchaseDetail" />

    <!-- 工程复核详情 -->
    <MdRepeatedDetailPop @register="registerMdRepeatedDetail" />

    <!-- 新材料导入 -->
    <MdImportDetail @register="registerMdImportDetail" />
    <!-- 材料送样确认 -->
    <MdMcDetailPop @register="registerMdMcDetail" />
    <!-- 新材料体系处理详情 -->
    <DocumentControlDetail @register="registerDocumentControlDetail" />
    <ExportModal @register="registerExportModal" />
    <NodeModal @register="registerNodeModal"></NodeModal>
    <FileListModal @register="registerFile"></FileListModal>
    <HistoryModal @register="registerHistoryModal" />
  </div>
</template>

<script lang="ts" setup>
  import { FileListModal } from '/@/components/Upload';
  import { onMounted } from 'vue';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { vxeTableColumns, schema } from './config';
  import { getReport, exportReport } from '/@/api/engineering/newMateriaReport';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { usePopup } from '/@/components/Popup';
  import { useModal } from '/@/components/Modal';
  import { omit } from 'lodash-es';
  import { fileDownload, getReports } from '/@/api/quanlity/newMetarialCheck';
  import { getNodelist } from '/@/api/engineering/newMateria';
  import DevlopApplyDetailPop from '/@/views/engineering/newMateria/devlop/components/addPop.vue';
  import MdPurchaseDetailPopup from '/@/views/purchase/newMaterial/recommend/components/DetailPopup.vue';
  import MdRepeatedDetailPop from '/@/views/engineering/newMateria/confirm/components/DetailPopup.vue';
  import MdImportDetail from '/@/views/purchase/newMaterial/import/components/DetailPopup.vue';
  import DocumentControlDetail from './components/documentControlDetail.vue';
  import MdMcDetailPop from '/@/views/purchase/newMaterial/confirm/components/DetailPopup.vue';
  import ExportModal from '/@/components/ExportModal/index.vue';
  import { NodeModal, RemarkModal } from '/@/components/CustomComponents';
  import { usePermission } from '/@/hooks/web/usePermission';
  import HistoryModal from '../../../qualityAssurance/newMateria/check/components/HistoryModal.vue';

  defineOptions({ name: 'engineering-newMateria-report' });

  const { t } = useI18n();
  const { hasBtnP } = usePermission();
  const [registerFile, { openModal: openFileList }] = useModal();
  const [registerMdMcDetail, { openPopup: openMdMcDetail }] = usePopup();
  const [registerMdPurchaseDetail, { openPopup: openMdPurchaseDetail }] = usePopup();
  const [registerNodeModal, { openModal: openNodeModal }] = useModal();
  const [registerMdRepeatedDetail, { openPopup: openMdRepeatedDetail }] = usePopup();
  const [registerHistoryModal, { openModal: openHistoryModal }] = useModal();

  const [VxeBasicTable, tableRef] = useVbenVxeGrid({
    formOptions: {
      collapsed: true,
      showCollapseButton: true,
      // 是否在字段值改变时提交表单
      submitOnChange: false,
      // 按下回车时是否提交表单
      submitOnEnter: true,
      commonConfig: {
        componentProps: {},
        labelClass: 'w-0',
      },
      wrapperClass: 'grid grid-cols-6 gap-4',
      schema,
    },
    gridOptions: {
      id: 'engineering-newMateria-report-list',
      rowConfig: {
        keyField: '_X_ROW_KEY',
      },
      showIndexColumn: true,
      border: true,
      columns: handleColumn(vxeTableColumns),
      keyboardConfig: {
        isBack: false,
      },
      formConfig: {
        enabled: false,
      },
      pagerConfig: {
        autoHidden: false,
      },
      // @ts-ignore
      api: getReport,
      toolbarConfig: {
        refresh: true,
        custom: true,
      },
      i18nConfig: {
        moduleCode: 'MaterialDevelopApplyReportColumn',
      },
    },
  });

  function filterColumnsWithLodash(data, excludedFields) {
    return _.transform(
      data,
      (result, item) => {
        if (_.includes(excludedFields, item.field)) return;

        const newItem = _.cloneDeep(item);

        if (_.has(newItem, 'children') && _.size(newItem.children)) {
          newItem.children = filterColumnsWithLodash(newItem.children, excludedFields);
          if (_.isEmpty(newItem.children)) {
            _.unset(newItem, 'children');
          }
        }

        result.push(newItem);
      },
      [],
    );
  }

  function handleColumn(columns) {
    const hasPermission = hasBtnP('newMateria-report');
    console.log('🚀 ~ handleColumn ~ hasPermission: newMateria-report', hasPermission);
    if (hasPermission) {
      return columns;
    }
    const filterArray = ['supplierName', 'mMaterialsCode'];
    // 没有权限只展示部分列
    // return reject(columns, item => filterArray.includes(item.field));
    return filterColumnsWithLodash(columns, filterArray);
  }

  /**
   * 采购推荐详情
   * @param id
   */
  function showMdPurchaseDetail(id: string) {
    openMdPurchaseDetail(true, {
      ids: [id],
      type: 'view',
    });
  }

  /**
   * 工程复核
   * @param id
   */
  function showMdRepeatedDetail(id: string) {
    openMdRepeatedDetail(true, {
      ids: [id],
      type: 'view',
    });
  }

  /**
   * 送样确认
   * @param id
   */
  function showMcDetail(id: string) {
    openMdMcDetail(true, {
      id,
      type: 'detailed',
    });
  }

  const [registerDevlopApplyDetail, { openPopup: openDevlopApplyDetail }] = usePopup();
  /**
   * 审核、材料登记、材料检测、材料验证导入处理详情、采购结论处理详情
   * @param id
   */
  function showDevlopApplyDetail(id: string) {
    openDevlopApplyDetail(true, {
      id,
      type: 'detailed',
    });
  }

  const [registerMdImportDetail, { openPopup: openMdImportDetail }] = usePopup();
  /**
   * 新材料导入
   * @param id
   */
  function showMdImportDetail(id: string) {
    openMdImportDetail(true, {
      id,
      type: 'detailed',
    });
  }

  function handleiqcTestReport(record) {
    openHistoryModal(true, {
      id: record.sendSamplesRecordId,
    });
  }

  function handleFileView(record) {
    openFileList(true, {
      id: record.sendSamplesRecordId,
      downloadApi: fileDownload,
      listApi: getReports,
    });
  }

  function handleNodeModal(record) {
    openNodeModal(true, {
      api: getNodelist,
      id: record.id,
      fetchSetting: {
        listField: 'mianBillFlow.flowNodeInstanceHisList',
      },
    });
  }

  const [registerDocumentControlDetail, { openPopup: openDocumentControlDetail }] = usePopup();
  function showDocumentControlDetail(id: string) {
    openDocumentControlDetail(true, {
      ids: [id],
      type: 'detailed',
    });
  }

  const [registerExportModal, { openModal: openExportModal }] = useModal();
  function handleOpenExportModal() {
    const { pager } = tableRef.grid.getProxyInfo()!;
    const filters = tableRef.grid.getCheckedFilters().reduce((pre, item) => {
      pre[item.field] = Array.isArray(item.datas) ? item.datas.join() : item.datas;
      return pre;
    }, {});
    // 平铺vxeTableColumns 每个对象的children，title要拼接父级信息,但是第一个父级：基础信息不拼接
    let index = 0;
    const exportOptions = vxeTableColumns.reduce((pre: any[], item) => {
      if (item.children) {
        item.children.forEach(child => {
          pre.push({
            title: `${index == 0 ? '' : item.title}${child.title}`,
            field: child.field,
          });
        });
      } else {
        pre.push({
          title: item.title,
          field: item.field,
        });
      }
      index++;
      return pre;
    }, []);
    openExportModal(true, {
      listQuery: { ...filters, ...omit(pager, 'total') },
      api: (query: any) => exportReport({ ...query, id: query.selectIds }),
      exportOptions: exportOptions,
      nameProps: 'title',
      idProps: 'field',
      // selectIds: checkedList.map(item => item.id)
      i18nConfig: {
        moduleCode: 'MaterialDevelopApplyReportColumn',
      },
    });
  }
</script>

<style lang="less" scoped>
  @import url('/src/design/page.less');
</style>
