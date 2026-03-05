<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    :showOkBtn="true"
    :showCancelBtn="true"
    :title="state.type == 'add' ? t('common.add2Text') : t('common.editText')"
    destroyOnClose
    :okText="t('common.submit')"
    @ok="handleSubmit"
    class="full-popup">
    <div class="detail">
      <Subtitle :title="t('common.baseinfo')" />
      <BasicForm @register="registerAuditForm" class="">
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
  </BasicPopup>
</template>
<script setup lang="ts">
  import { Subtitle } from '/@/components/Subtitle';
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { BasicForm, useForm } from '/@/components/Form';
  import { reactive, ref, computed, unref, nextTick } from 'vue';
  import { useBaseStore } from '/@/store/modules/base';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { getMachinelCodeList } from '/@/api/qms/iqc/abnormalTimelinessMonitoring';
  import { getInnermaterialnumberlist } from '/@/api/basicData/processrulestemplate';
  import { addTechnical, updateTechnical } from '/@/api/qms/technicalTransformation';
  import dayjs from 'dayjs';
  import { useUserStore } from '/@/store/modules/user';

  const { t } = useI18n();

  const emit = defineEmits(['reload', 'register']);

  const { createMessage } = useMessage();
  const baseStore = useBaseStore();
  const [registerPopup, { closePopup, changeLoading }] = usePopupInner(init);

  const userStore = useUserStore();
  const getUserInfo = computed(() => userStore.getUserInfo || {});

  const isUseOptions = [
    { label: t('dict.isBonded.1'), value: 1 },
    { label: t('dict.isBonded.2'), value: 0 },
  ];

  const state = reactive({
    type: 'add',
    materialList: [],
    id: '',
    techItemList: [] as any[],
    factoryArea: '',
  });

  const handleObj = ref({
    // id: '',
    // techItemList: [] as any[],
    machineNo: '',
    innerMaterialCode: '',
    creatorUserName: '',
    creatorTime: '',
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
        component: 'ApiSelect',
        componentProps: {
          api: getMachinelCodeList,
          showSearch: true,
          apiSearch: {
            show: true,
            searchName: 'machineNo',
          },
          resultField: 'data',
          labelField: 'machineNo',
          valueField: 'machineNo',
          filterOption: false,
          notFoundContent: null,
          immediate: true,
          beforeFetch: async params => {
            await nextTick();
            params = {
              ...params,
              factoryArea: state.factoryArea,
            };
            return params;
          },
        },
        // required: true,
        rules: [{ required: true, trigger: 'blur', message: '必填' }],
      },
      {
        field: 'innerMaterialCode',
        label: t('dict.TechInfoColumn.innerMaterialCode'),
        component: 'ApiSelect',
        // slot: 'innerMaterialCode',
        componentProps: {
          api: getInnermaterialnumberlist,
          showSearch: true,
          apiSearch: {
            show: true,
            searchName: 'searchKey',
          },
          resultField: 'data',
          labelField: 'name',
          valueField: 'code',
          filterOption: false,
          notFoundContent: null,
          immediate: true,
        },
        // required: true,
        rules: [{ required: true, trigger: 'blur', message: '必填' }],
      },
      {
        field: 'creatorUserName',
        label: t('dict.TechInfoColumn.creatorUserName'),
        component: 'Input',
        slot: 'creatorUserName',
        // componentProps: {
        //   enable: true,
        // },
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
      //   pagerConfig: {
      //     autoHidden: false,
      //   },
      columns: getColumns(),
      i18nConfig: {
        moduleCode: 'TechInfoColumn',
      },
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

  async function init({ type, data, factoryArea }) {
    changeLoading(true);
    handleObj.value.machineNo = '';
    handleObj.value.innerMaterialCode = '';
    state.type = type || 'add';
    state.factoryArea = factoryArea;
    if (state.type == 'add') {
      handleObj.value.creatorUserName = unref(getUserInfo).userName + '/' + unref(getUserInfo).userAccount;
      setFieldsValue(handleObj.value);
      clearValidate();
    }
    await getTechnicalList().finally(() => {
      changeLoading(false);
    });
    if (!data) return;
    if (state.type == 'edit') {
      updateSchema({ field: 'machineNo', componentProps: { disabled: true } });
      updateSchema({ field: 'innerMaterialCode', componentProps: { disabled: true } });
    }
    const { id, creatorTime, creatorUserName, innerMaterialCode, machineNo, techItemList } = data;
    state.id = id;
    state.techItemList = updateData(state.techItemList, techItemList);
    handleObj.value.creatorTime = dayjs(creatorTime).format('YYYY-MM-DD HH:mm:ss');
    handleObj.value.creatorUserName = creatorUserName;
    handleObj.value.innerMaterialCode = innerMaterialCode;
    handleObj.value.machineNo = machineNo;
    setFieldsValue(handleObj.value);

    setTimeout(() => {
      gridApi.reloadData(state.techItemList);
    }, 1000);
  }

  async function getTechnicalList() {
    const res = (await baseStore.getDictionaryData('TechUpdateItem')) as any[];
    state.techItemList = res.map(item => ({
      key: item.enCode,
      value: item.fullName,
      isUse: 1,
      unUseReason: '',
    }));
    gridApi.reloadData(state.techItemList);
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
      },
      {
        title: '是否使用',
        field: 'isUse',
        // editRender: {
        //   name: 'ASelect',
        //   props: {
        //     options: isUseOptionList,
        //   },
        // },
        slots: { default: 'isUse' },
      },
      {
        title: '未使用原因',
        field: 'unUseReason',
        // editRender: {
        //   name: 'Input',
        // },
        slots: { default: 'unUseReason' },
      },
    ];
  }

  async function handleSubmit() {
    const values = await validateFields();
    if (!values) return;
    changeLoading(true);
    // 判断技改表格
    const isValid = checkUnuseReason(state.techItemList);
    if (isValid) {
      if (state.type == 'add') {
        addTechnicalFn();
      } else {
        updateTechnicalFn();
      }
    }
    changeLoading(false);
  }

  async function addTechnicalFn() {
    const { innerMaterialCode, machineNo } = getFieldsValue();
    const { code, msg } = await addTechnical({
      // ...getFieldsValue(),
      innerMaterialCode,
      machineNo,
      factoryArea: state.factoryArea,
      techItemList: state.techItemList,
    });
    if (code === 200) {
      createMessage.success(msg);
      closePopup();
      emit('reload');
    }
  }

  async function updateTechnicalFn() {
    const { innerMaterialCode, machineNo } = getFieldsValue();
    const { code, msg } = await updateTechnical({
      innerMaterialCode,
      machineNo,
      id: state.id,
      factoryArea: state.factoryArea,
      techItemList: state.techItemList,
    });
    if (code === 200) {
      createMessage.success(msg);
      closePopup();
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
