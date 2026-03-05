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
      <a-checkbox :indeterminate="isIndeterminate" v-model:checked="checkAll" @change="handleCheckAllChange">全选</a-checkbox>
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
  import { exportEquipmentExcel } from '/@/api/equipment/information';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { downloadByUrl } from '/@/utils/file/download';

  const [registerModal, { closeModal, changeOkLoading }] = useModalInner(init);
  const { createMessage } = useMessage();

  const dataType = ref(0);
  const isIndeterminate = ref(false);
  const checkAll = ref(false);
  const columnList = ref<any[]>([
    { fullName: '工厂', id: 'FactoryArea' },
    { fullName: '设备类型', id: 'Type' },
    { fullName: '设备分类', id: 'Category' },
    { fullName: '设备编码', id: 'Code', align: 'center' },
    { fullName: '固定资产编码', id: 'AssetCode' },
    { fullName: '固定资产名称', id: 'Name' },
    { fullName: '规格型号', id: 'Specification' },
    { fullName: '机身序列号', id: 'SerialNumber' },
    { fullName: '设备制造商', id: 'SupplierName' },
    { fullName: '实物是否存在', id: 'Exist' },
    { fullName: '使用状态', id: 'UseStatus' },
    { fullName: '设备型号', id: 'EquipmentModel' },
    { fullName: '物理位置', id: 'Position' },
    { fullName: '使用部门', id: 'DepartmentId' },
    { fullName: '是否启用', id: 'Status' },
    { fullName: '线体', id: 'LineInfoName' },
    { fullName: '责任人', id: 'DutyUserName' },
    { fullName: '是否专用设备', id: 'UseSpecial' },
    { fullName: '使用年限', id: 'ServiceLife' },
    { fullName: '到厂时间', id: 'ArrivalTime' },
    { fullName: '财务折旧', id: 'Depreciation' },
    { fullName: '所属组织', id: 'OrgName' },
    { fullName: '备注', id: 'Remark' },
    { fullName: '创建人', id: 'CreatorUserName' },
    { fullName: '创建时间', id: 'CreatorTime' },
    { fullName: '修改人', id: 'LastModifyUserName' },
    { fullName: '修改时间', id: 'LastModifyTime' },
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
    exportEquipmentExcel(query)
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
