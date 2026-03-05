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
import { exportUnitExcel } from '/@/api/basicData/exchangeRate';
import { useMessage } from '/@/hooks/web/useMessage';
import { downloadByUrl } from '/@/utils/file/download';

const [registerModal, { closeModal, changeOkLoading }] = useModalInner(init);
const { createMessage } = useMessage();

const dataType = ref(0);
const isIndeterminate = ref(false);
const checkAll = ref(false);
const columnList = ref<any[]>([
    { fullName: '持有货币', id: 'HoldCurrency', },
    { fullName: '兑换货币', id: 'ExchangeCurrency', },
    { fullName: '当前汇率', id: 'ExchangeRateNow', },
    { fullName: '有效期始', id: 'ValidityDateStart', },
    { fullName: '状态', id: 'StatusName', },
    { fullName: '有效期末', id: 'ValidityDateEnd', },
    { fullName: '维护日期', id: 'EnterEnd', },
    { fullName: '所属组织', id: 'OrgName', },
    { fullName: '创建人', id: 'CreatorUserName', },
    { fullName: '创建时间', id: 'CreatorTime', },
    { fullName: '修改人', id: 'LastModifyUserName', },
    { fullName: '修改时间', id: 'LastModifyTime', },
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
    exportUnitExcel(query)
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
