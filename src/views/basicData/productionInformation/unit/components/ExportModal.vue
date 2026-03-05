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
  import { exportUnitExcel } from '/@/api/basicData/unit';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { downloadByUrl } from '/@/utils/file/download';
  import { useI18n } from '/@/hooks/web/useI18n';

  const [registerModal, { closeModal, changeOkLoading }] = useModalInner(init);
  const { createMessage } = useMessage();
  const { t } = useI18n();

  const dataType = ref(0);
  const isIndeterminate = ref(false);
  const checkAll = ref(false);
  const columnList = ref<any[]>([
    { fullName: t('dict.UnitColumn.Code'), id: 'Code' },
    { fullName: t('dict.UnitColumn.Name'), id: 'Name' },
    { fullName: t('dict.UnitColumn.OrgName'), id: 'OrgName' },
    { fullName: t('dict.UnitColumn.StatusName'), id: 'StatusName' },
    { fullName: t('dict.UnitColumn.Auxiliary'), id: 'Auxiliary' },
    { fullName: t('dict.UnitColumn.Conversion'), id: 'Conversion' },
    { fullName: t('dict.UnitColumn.DotNumber'), id: 'DotNumber' },
    { fullName: t('dict.UnitColumn.CreatorUserName'), id: 'CreatorUserName' },
    { fullName: t('dict.UnitColumn.CreatorTime'), id: 'CreatorTime' },
    { fullName: t('dict.UnitColumn.LastModifyUserName'), id: 'LastModifyUserName' },
    { fullName: t('dict.UnitColumn.LastModifyTime'), id: 'LastModifyTime' },
    { fullName: t('dict.UnitColumn.Remark'), id: 'Remark' },
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

<style lang="less" scoped>
  :deep(.ant-checkbox-group.options-list) {
    white-space: pre-line;
  }
</style>
