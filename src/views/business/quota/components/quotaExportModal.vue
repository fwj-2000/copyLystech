<template>
  <BasicModal v-bind="$attrs" @register="registerModal" title="导出数据" @ok="handleSubmit" destroyOnClose class="export-modal">
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
      <a-checkbox :indeterminate="isIndeterminate" v-model:checked="checkAll" @change="handleCheckAllChange">全选 </a-checkbox>
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
  import { useMessage } from '/@/hooks/web/useMessage';
  import { downloadByUrl } from '/@/utils/file/download';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { exportQuotationRequirementsExcel } from '/@/api/business/quota';

  const [registerModal, { closeModal, changeOkLoading }] = useModalInner(init);
  const { createMessage } = useMessage();
  const dataType = ref(0);
  const { t } = useI18n();
  const isIndeterminate = ref(false);
  const checkAll = ref(false);
  const columnList = ref<any[]>([
    { fullName: t('views.business.quota.batchCode'), id: 'ApplyCode' },
    {
      fullName: t('views.business.quota.internalPartNumber'),
      id: 'InsidePartNumber',
      width: 150,
    },
    { fullName: t('views.business.quota.projectLeader'), id: 'ProjectLeaderName' },
    { fullName: t('views.business.quota.urgencyLevel'), id: 'UrgencyLevel' },
    { fullName: t('views.business.quota.totalQuantity'), id: 'TotalQty' },
    // { fullName: t('views.business.quota.desensitizedDrawing'), id: 'DesensitizedDrawingName' },
    {
      fullName: t('views.business.quota.unitQuantity'),
      id: 'UnitQty',
    },
    {
      fullName: t('views.business.quota.tenderFactoryQuantity'),
      id: 'TenderFactoryQty',
    },
    {
      fullName: t('views.business.quota.productionCycle'),
      id: 'ProductionCycle',
    },
    {
      fullName: t('views.business.quota.requireDate'),
      id: 'RequireDate',
    },
    {
      fullName: t('views.business.quota.expectedProductionDate'),
      id: 'ExpectedProductionDate',
    },
    {
      fullName: t('views.business.quota.peakQuantity'),
      id: 'PeakQty',
    },
    {
      fullName: t('views.business.quota.peakMonth'),
      id: 'PeakMonth',
    },
    {
      fullName: t('views.business.quota.terminalCustomerCode'),
      id: 'TerminalCustomerCode',
    },
    {
      fullName: t('views.business.quota.terminalCustomerProjectCode'),
      id: 'TerminalCustomerProjectCode',
    },
    {
      fullName: t('views.business.quota.terminalCustomerPartNumber'),
      id: 'TerminalCustomerDrawingNumber',
    },
    { fullName: t('views.business.quota.status'), id: 'Status' },
    {
      fullName: t('views.business.quota.applyUser'),
      id: 'ApplyUserName',
    },
    {
      fullName: t('views.business.quota.applyDept'),
      id: 'ApplyDeptName',
    },
    {
      fullName: t('views.business.quota.applyDate'),
      id: 'ApplyDate',
    },
    {
      fullName: t('views.business.quota.lastModifyUser'),
      id: 'LastModifyUserName',
    },
    {
      fullName: t('views.business.quota.lastModifyDate'),
      id: 'FLastModifyTime',
    },
    {
      fullName: t('views.business.quota.productDesc'),
      id: 'ProductDesc',
    },
    {
      fullName: t('views.business.quota.lineRemark'),
      id: 'LineRemark',
    },
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
    exportQuotationRequirementsExcel(query)
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
