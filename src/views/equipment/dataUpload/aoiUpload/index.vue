<template>
    <div class="lydc-content-wrapper">
        <div class="lydc-content-wrapper-center">
            <div class="lydc-content-wrapper-content">
                <BasicTable @register="registerTable">
                    <template #expandedRowRender="{ record }">
                        <span>尺寸: </span>
                        <span v-for="item in record.Entities" :key="item.id">{{item.name}}:{{ item.value }}; </span>
                    </template>
                    <template #tableTitle>
                        <a-button type="primary" @click="handleExport"><i
                                class="icon-ym icon-ym-btn-download button-preIcon">
                            </i>{{ t('common.exportText') }}</a-button>

                    </template>
                    <!-- <template #bodyCell="{ column, record }">
                        <template v-if="column.dataIndex === 'facade1'">
                            <a-tag :color="record.facade1 == 1 ? 'success' : 'error'">{{ record.facade1 == 1 ?
                                'OK' : 'NG'
                                }}</a-tag>
                        </template>
                        <template v-if="column.dataIndex === 'facade2'">
                            <a-tag :color="record.facade2 == 1 ? 'success' : 'error'">{{ record.facade2 == 1 ?
                                'OK' : 'NG'
                                }}</a-tag>
                        </template>
                        <template v-if="column.dataIndex === 'facade3'">
                            <a-tag :color="record.facade3 == 1 ? 'success' : 'error'">{{ record.facade3 == 1 ?
                                'OK' : 'NG'
                                }}</a-tag>
                        </template>
                        <template v-if="column.dataIndex === 'facade4'">
                            <a-tag :color="record.facade4 == 1 ? 'success' : 'error'">{{ record.facade4 == 1 ?
                                'OK' : 'NG'
                                }}</a-tag>
                        </template>
                        <template v-if="column.dataIndex === 'facade5'">
                            <a-tag :color="record.facade5 == 1 ? 'success' : 'error'">{{ record.facade5 == 1 ?
                                'OK' : 'NG'
                                }}</a-tag>
                        </template>
                        <template v-if="column.dataIndex === 'facade6'">
                            <a-tag :color="record.facade6 == 1 ? 'success' : 'error'">{{ record.facade6 == 1 ?
                                'OK' : 'NG'
                                }}</a-tag>
                        </template>
                        <template v-if="column.dataIndex === 'facade7'">
                            <a-tag :color="record.facade7 == 1 ? 'success' : 'error'">{{ record.facade7 == 1 ?
                                'OK' : 'NG'
                                }}</a-tag>
                        </template>
                        <template v-if="column.dataIndex === 'facade8'">
                            <a-tag :color="record.facade8 == 1 ? 'success' : 'error'">{{ record.facade8 == 1 ?
                                'OK' : 'NG'
                                }}</a-tag>
                        </template> 
                    </template>-->
                    <!-- <template #bodyCell="{ column, record }">
                        <template v-if="column.dataIndex === 'action'">
                            <TableAction :actions="getTableActions(record)" />
                        </template>
</template> -->
                </BasicTable>
            </div>
        </div>
        <ExportModal @register="registerExportModal" />
    </div>
</template>

<script setup lang="ts">

import { BasicTable, useTable, BasicColumn, FormSchema } from '/@/components/Table';
import { getPage,exportDataAOI } from '../../../../api/equipment/aoiUpload';
import { useI18n } from '/@/hooks/web/useI18n';
import { useModal } from '/@/components/Modal';
import ExportModal from '/@/components/ExportModal/index.vue';


const { t } = useI18n();
const [registerExportModal, { openModal: openExportModal }] = useModal();

const searchFormSchema: FormSchema[] = [
    {
        field: 'type',
        label: '',
        component: 'Input',
        defaultValue: '',
        componentProps: {
            placeholder: '请输入类型'
        },
        colProps: { span: 5 }
    },
    {
        field: 'equipmentName',
        label: '',
        component: 'Input',
        defaultValue: '',
        componentProps: {
            placeholder: '请输入设备名称'
        },
        colProps: { span: 5 }
    },
    {
        field: 'equipmentCode',
        label: '',
        component: 'Input',
        defaultValue: '',
        componentProps: {
            placeholder: '请输入设备出厂编号'
        },
        colProps: { span: 5 }
    },
    {
        field: 'productCode',
        label: '',
        component: 'Input',
        componentProps: {
            placeholder: '请输入产品料号'
        },
        colProps: { span: 5 }
    },
    {
        field: 'serialNumber',
        label: '',
        component: 'Input',
        componentProps: {
            placeholder: '请输入序列号'
        },
        colProps: { span: 5 }
    }
];

const columns: BasicColumn[] = [
    { title: '类型', dataIndex: 'type', width: 150 },
    { title: '设备名称', dataIndex: 'equipmentName', width: 150 },
    { title: '设备供应商', dataIndex: 'equipmentSupplier', width: 250 },
    { title: '设备出厂编号', dataIndex: 'equipmentCode', width: 150 },
    { title: '设备位置', dataIndex: 'equipmentPosition', width: 150 },
    { title: '测试时间', dataIndex: 'testingTime', width: 150, format: 'date|YYYY-MM-DD HH:mm:ss' },
    { title: '产品料号', dataIndex: 'productCode', width: 150 },
    { title: '序列号', dataIndex: 'serialNumber', width: 150 },
    { title: '判定结果', dataIndex: 'judgeResult', width: 150 },
    { title: '打印结果', dataIndex: 'printResult', width: 150 },
    { title: '上传时间', dataIndex: 'creatorTime', width: 180, format: 'date|YYYY-MM-DD HH:mm:ss', },
];

const [registerTable, { getFetchParams }] = useTable({
    api: getPage,
    columns,
    rowKey: 'id',
    useSearchForm: true,//使用搜索表单
    bordered: true,//显示表格边框
    expandRowByClick: true,

    formConfig: {//搜索框
        labelWidth: 100,
        schemas: searchFormSchema,
        autoAdvancedLine: 1,//自动展开行
    },
    pagination: {
        pageSize: 30,
        size: "small",
        // simple: true
    },
    i18nConfig: {
        moduleCode: 'AOIUploadColumn', // 上图流程中的业务moduleCode+‘Column‘
      },
});

  //导出
  const handleExport = async () => {
    openExportModal(true, {
      api: exportDataAOI,
      listQuery: {
        ...getFetchParams(),
      },
      nameProps: 'title',
      idProps: 'dataIndex',
      exportOptions: columns,
      i18nConfig: {
        moduleCode: 'AOIUploadColumn',
      },
    });
  };
</script>