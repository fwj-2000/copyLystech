<template>
  <BasicModal
    v-bind="$attrs"
    destroyOnClose
    @register="registerModal"
    :title="state.techId == '' ? t('common.add2Text') : t('common.editText')"
    showOkBtn
    @ok="handleSubmit"
    width="1200px">
    <div class="detail">
      <Subtitle :title="t('common.baseinfo')" />
      <BasicForm @register="registerAuditForm" class="">
        <template #machineNo="{ values }">
          <a-input v-model:value="values.machineNo" disabled style="width: 100%" />
        </template>
        <template #innerMaterialCode="{ values }">
          <a-input v-model:value="values.innerMaterialCode" disabled style="width: 100%" />
        </template>
        <template #creatorUserName="{ values }">
          <a-input v-model:value="values.creatorUserName" disabled style="width: 100%" />
        </template>
        <template #creatorTime="{ values }">
          <a-input v-model:value="values.creatorTime" disabled style="width: 100%" />
        </template>
      </BasicForm>
      <div>{{ t('dict.TechInfoColumn.techChange') }}：</div>
    </div>

    <Grid>
      <template #isUse="{ row }">
        <a-select v-model:value="row.isUse" :placeholder="t('common.chooseText')" :options="isUseOptions" />
      </template>
      <template #unUseReason="{ row }">
        <a-input v-model:value="row.unUseReason" :placeholder="t('common.inputTextPrefix')" :disabled="row.isUse == 1" />
      </template>
    </Grid>
  </BasicModal>
</template>
<script setup lang="ts">
  import { Subtitle } from '/@/components/Subtitle';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form';
  import { reactive } from 'vue';
  import { useBaseStore } from '/@/store/modules/base';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { addTechnical, updateTechnical } from '/@/api/qms/technicalTransformation';
  import dayjs from 'dayjs';

  const { t } = useI18n();

  const emit = defineEmits(['reload', 'register']);

  const { createMessage } = useMessage();
  const baseStore = useBaseStore();
  const [registerModal, { closeModal, changeLoading, changeOkLoading }] = useModalInner(init);

  const isUseOptions = [
    { label: t('dict.isBonded.1'), value: 1 },
    { label: t('dict.isBonded.2'), value: 0 },
  ];

  const state = reactive({
    type: 'add',
    materialList: [],
    id: '',
    techItemListOri: [] as any[],
    machineNo: '',
    techId: '',
    techItemList: [],
    innerMaterialCode: '',
    techCreatorName: '',
    techCreatorTime: '',
  });

  const [registerAuditForm, { getFieldsValue, setFieldsValue, validateFields, updateSchema, clearValidate }] = useForm({
    baseColProps: {
      span: 6,
    },
    layout: 'vertical',
    // @ts-ignore
    schemas: [
      {
        field: 'machineNo',
        label: t('dict.TechInfoColumn.machineNo'),
        component: 'Input',
        slot: 'machineNo',
      },
      {
        field: 'innerMaterialCode',
        label: t('dict.TechInfoColumn.innerMaterialCode'),
        component: 'Input',
        slot: 'innerMaterialCode',
      },
      {
        field: 'creatorUserName',
        label: t('dict.TechInfoColumn.creatorUserName'),
        component: 'Input',
        slot: 'creatorUserName',
      },
      {
        field: 'creatorTime',
        label: t('dict.TechInfoColumn.creatorTime'),
        component: 'Input',
        slot: 'creatorTime',
      },
    ],
  });

  const [Grid, gridApi] = useVbenVxeGrid({
    gridOptions: {
      id: 'qms-intelligentButler-technicalTransformation-tech-list',
      columns: getColumns(),
      i18nConfig: {
        moduleCode: 'TechInfoColumn',
      },
      height: 380,
      toolbarConfig: {
        enabled: false,
      },
      keyboardConfig: {
        isClip: false,
      },
      clipConfig: {
        isPaste: false,
      },
      mouseConfig: {
        area: false, // 是否开启区域选取
      },
      pagerConfig: {
        enabled: false,
      },
    },
  });

  function updateData(original, updates) {
    const updateMap = new Map();
    updates.forEach(item => {
      updateMap.set(item.key, item);
    });
    return original.map(item => {
      const updateItem = updateMap.get(item.key);
      if (updateItem) {
        return {
          ...item,
          isUse: updateItem.isUse,
          unUseReason: updateItem.unUseReason,
        };
      }
      return item;
    });
  }

  async function init({ techObj }) {
    changeLoading(true);
    state.machineNo = techObj.machineNo || '';
    state.innerMaterialCode = techObj.innerMaterialCode || '';
    state.techId = techObj.techId || '';
    state.techCreatorName = techObj.techCreatorName || '';
    state.techCreatorTime = techObj.techCreatorTime == '' ? '' : dayjs(techObj.techCreatorTime).format('YYYY-MM-DD HH:mm:ss');
    state.techItemList = techObj.techItemList || [];

    setFieldsValue({
      machineNo: state.machineNo,
      innerMaterialCode: state.innerMaterialCode,
      creatorUserName: state.techCreatorName,
      creatorTime: state.techCreatorTime,
    });
    await getTechnicalList().finally(() => {
      changeLoading(false);
    });
    // 新增
    if (state.techItemList.length == 0) return;
    // 修改
    state.techItemList = updateData(state.techItemListOri, state.techItemList);
    setTimeout(() => {
      gridApi.reloadData(state.techItemList);
    }, 300);
  }

  async function getTechnicalList() {
    const res = (await baseStore.getDictionaryData('TechUpdateItem')) as any[];
    state.techItemListOri = res.map(item => ({
      key: item.enCode,
      value: item.fullName,
      isUse: 1,
      unUseReason: '',
    }));
    gridApi.reloadData(state.techItemListOri);
  }

  function getColumns() {
    return [
      {
        field: 'seq',
        title: t('component.table.index'),
        type: 'seq',
        width: '80',
        align: 'center',
      },
      {
        title: '技改名称',
        field: 'value',
        minwidth: '150',
      },
      {
        title: '是否使用',
        field: 'isUse',
        minwidth: '150',
        slots: { default: 'isUse' },
      },
      {
        title: '未使用原因',
        field: 'unUseReason',
        minwidth: '150',
        slots: { default: 'unUseReason' },
      },
    ];
  }

  async function handleSubmit() {
    const values = await validateFields();
    if (!values) return;
    // 判断技改表格
    const isValid = checkUnuseReason(state.techItemList);
    if (isValid) {
      if (state.techId == '') {
        addTechnicalFn();
      } else {
        updateTechnicalFn();
      }
    }
  }

  async function addTechnicalFn() {
    const { innerMaterialCode, machineNo } = getFieldsValue();
    const tableData = await gridApi.getDataSource();
    changeOkLoading(true);
    const { code, msg } = await addTechnical({
      innerMaterialCode,
      machineNo,
      techItemList: tableData,
    }).finally(() => {
      changeOkLoading(false);
    });
    if (code === 200) {
      createMessage.success(msg);
      closeModal();
      emit('reload');
    }
  }

  async function updateTechnicalFn() {
    const { innerMaterialCode, machineNo } = getFieldsValue();
    const tableData = await gridApi.getDataSource();
    const { code, msg } = await updateTechnical({
      innerMaterialCode,
      machineNo,
      id: state.techId,
      techItemList: tableData,
    }).finally(() => {
      changeOkLoading(false);
    });
    if (code === 200) {
      createMessage.success(msg);
      closeModal();
      emit('reload');
    }
  }

  // 技改原因判空
  function checkUnuseReason(items) {
    for (const item of items) {
      if (item.isUse == 0) {
        if (item.unUseReason == '') {
          createMessage.error(`${item.value}` + t('tip.technicalTransformation.tip1'));
          return false; // 退出函数
        }
      }
    }
    return true; // 所有检查通过
  }
</script>

<style lang="less" scoped>
  .detail {
    padding: 10px;
    width: 100%;
  }

  :deep(.subtitle-container) {
    padding-bottom: 0;
  }

  :deep(.lydc-basic-popup-header) {
    padding-left: 12px;
  }
</style>
