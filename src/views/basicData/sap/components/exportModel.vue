<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="t('component.excel.exportModalTitle')" @ok="handleSubmit" destroyOnClose class="export-modal">
    <template #insertFooter>
      <div class="footer-tip">{{ t('common.tipTitle') + ':' + t('common.systemWillExportAllSelectedDatas') }}</div>
    </template>
    <a-form :colon="false" labelAlign="left" :labelCol="{ style: { width: '90px' } }">
      <a-form-item>
        <a-radio-group v-model:value="dataType">
          <a-radio :value="0">{{ t('common.currentPageDatas') }}</a-radio>
          <a-radio :value="1">{{ t('common.allPageDatas') }}</a-radio>
        </a-radio-group>
      </a-form-item>
      <div class="export-line">
        <p class="export-label"
          >{{ t('common.listDatas') }}<span>{{ t('component.exportModal.selectField') }}</span></p
        >
      </div>
      <a-checkbox :indeterminate="isIndeterminate" v-model:checked="checkAll" @change="handleCheckAllChange">{{ t('common.selectAll') }}</a-checkbox>
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
  import { exportFactorySapExcel } from '/@/api/basicData/sap';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { downloadByUrl } from '/@/utils/file/download';
  import { useI18n } from '/@/hooks/web/useI18n';

  const [registerModal, { closeModal, changeOkLoading }] = useModalInner(init);
  const { t } = useI18n();
  const { createMessage } = useMessage();
  const dataType = ref(0);
  const isIndeterminate = ref(false);
  const checkAll = ref(false);
  const columnList = ref<any[]>([
    // 序号
    { fullName: t('component.table.index'), id: 'id' },
    // '工厂编码'
    { fullName: t('dict.FactorySapColumn.factoryCode'), id: 'factoryCode' },
    // '工厂类型'
    { fullName: t('dict.FactorySapColumn.type'), id: 'typeName' },
    // '业务类型'
    { fullName: t('dict.FactorySapColumn.materialName'), id: 'materialName' },
    // 'SAP代码'
    { fullName: t('dict.FactorySapColumn.sapCompanyCode'), id: 'code' },
    // '是否保税'
    { fullName: t('dict.CommonCol.isBonded'), id: 'isBondedName' },
    // 创建人
    { fullName: t('dict.FactorySapColumn.creatorUserName'), id: 'creatorUserName' },
    // '创建时间'
    { fullName: t('dict.FactorySapColumn.creatorTime'), id: 'creatorTime', format: 'YYYY-MM-DD HH:mm:ss' },
    // { fullName: '修改人', id: 'lastModifyUserId' },
    // { fullName: '修改时间', id: 'lastModifyTime', format: 'YYYY-MM-DD HH:mm:ss' },
    // '备注'
    { fullName: t('dict.FactorySapColumn.remark'), id: 'remark' },
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
    if (!checkedList.value.length) return createMessage.warning(t('common.atLeastOneExportField'));
    changeOkLoading(true);
    let query = {
      ...listQuery.value,
      dataType: dataType.value,
      selectKey: checkedList.value.join(','),
    };
    exportFactorySapExcel(query)
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

<style lang="less" scoped>
  :deep(.ant-checkbox-group.options-list) {
    white-space: pre-line;
  }
</style>
