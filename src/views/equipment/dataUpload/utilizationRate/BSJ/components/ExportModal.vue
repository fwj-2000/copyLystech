<template>
    <BasicModal v-bind="$attrs" @register="registerModal" title="导出数据" @ok="handleSubmit" destroyOnClose
        class="export-modal">
        <template #insertFooter>
            <div class="footer-tip">提示:系统将导出列表中选中的数据</div>
        </template>
        <a-form :colon="false" labelAlign="left" :labelCol="{ style: { width: '90px' } }">
            <a-form-item>
                <a-radio-group v-model:value="dataType">
                    <a-radio :value="0">当前页面数据</a-radio>
                    <a-radio :value="1">全部页面数据</a-radio>
                </a-radio-group>
            </a-form-item>
            <div class="export-line">
                <p class="export-label">列表数据<span>请选择导出字段</span></p>
            </div>
            <a-checkbox :indeterminate="isIndeterminate" v-model:checked="checkAll"
                @change="handleCheckAllChange">全选</a-checkbox>
            <a-checkbox-group v-model:value="checkedList" class="options-list" @change="handleCheckedChange">
                <a-checkbox v-for="item in columnList" :key="item.id" :value="item.id" class="options-item">
                    {{ item.fullName }}
                </a-checkbox>
            </a-checkbox-group>
        </a-form>
    </BasicModal>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { BasicModal, useModalInner } from '/@/components/Modal';
import { exportData } from '../../../../../../api/equipment/aoiUpload';
import { useMessage } from '/@/hooks/web/useMessage';
import { downloadByUrl } from '/@/utils/file/download';

const [registerModal, { closeModal, changeOkLoading }] = useModalInner(init);
const { createMessage } = useMessage();

const dataType = ref(0);
const isIndeterminate = ref(false);
const checkAll = ref(false);
const columnList = ref<any[]>([
    { fullName: '机台号', id: 'equipmentNumber' },
    { fullName: '产品料号', id: 'productCode' },
    { fullName: '主料单据号', id: 'mainNumber' },
    { fullName: '辅料单据号', id: 'auxiliaryNumber' },
    { fullName: '开始时间', id: 'startTime' },
    { fullName: '结束时间', id: 'endTime' },
    { fullName: '单卷运行时间(秒)', id: 'singleRunTime' },
    { fullName: '单卷稼动率', id: 'singleUtilization' },
    { fullName: '机台稼动率', id: 'equipmentUtilization' },
    { fullName: '设定速度', id: 'setSpeed' },
    { fullName: '设定数量', id: 'setQty' },
    { fullName: '实际数量', id: 'realQty' },
    { fullName: '抛料数量', id: 'throwQty' },
    { fullName: '设备名称', id: 'equipmentName' },
    { fullName: '供应商', id: 'supplier' },
    { fullName: '设备出厂编号', id: 'equipmentCode' },
    { fullName: '位置', id: 'position' },
    { fullName: '本地时间', id: 'localDate' },
    { fullName: '上传时间', id: 'creatorTime' },
]);
const checkedList = ref<string[]>([]);
const defaultCheckedList = ref<string[]>([]);
const listQuery = ref({});

function init(data) {
    dataType.value = 0;
    checkedList.value = columnList.value.map(o => o.id);
    handleCheckedChange(checkedList.value);
    listQuery.value = data.listQuery;
}

function handleCheckAllChange(e) {
    const val = e.target.checked;
    checkedList.value = val ? columnList.value.map(o => o.id) : defaultCheckedList.value;
    isIndeterminate.value = val ? false : !!defaultCheckedList.value.length;
}

function handleCheckedChange(val) {
    const checkedCount = val.length;
    checkAll.value = checkedCount === columnList.value.length;
    isIndeterminate.value = !!checkedCount && checkedCount < columnList.value.length;
}

function handleSubmit() {
    if (!checkedList.value.length) return createMessage.warning('请至少选择一个导出字段');
    changeOkLoading(true);
    let query = {
        ...listQuery.value,
        dataType: dataType.value,
        selectKey: checkedList.value.join(','),
    };

    exportData('BSJ', query)
        .then(res => {
            changeOkLoading(false);
            if (!res.data.url) return;
            downloadByUrl({ url: res.data.url });
            closeModal();
        })
        .catch(() => {
            changeOkLoading(false);
        });
}
</script>
