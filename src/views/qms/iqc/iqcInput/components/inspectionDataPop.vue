<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    :showOkBtn="!isViewModel"
    :showCancelBtn="true"
    :title="getTitle"
    :destroyOnClose="true"
    :showFooter="false"
    @ok="handleSubmit"
    :ok-text="t('common.submit')"
    class="full-popup">
    <div class="w-full h-full background-[#ebeef5] flex">
      <div class="w-[26%] h-full p-12px">
        <Subtitle class="subtitle" :title="t('common.baseinfo')" />
        <ScrollContainer class="h-full">
          <BasicInfo :columns="1" :config="basicInfoCols" :data-source="state.basicData" :i18nConfig="{ moduleCode: 'IQCApplyColumn' }"></BasicInfo>
        </ScrollContainer>
      </div>
      <div class="w-[74%] h-full border-[#ccc] p-12px border-l-1">
        <TablePanel ref="tablePanel" />
      </div>
    </div>
  </BasicPopup>
</template>
<script setup lang="ts">
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { computed, onMounted, reactive, ref, unref } from 'vue';
  import { ScrollContainer } from '/@/components/Container';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { Subtitle } from '/@/components/Subtitle';
  import { useForm } from '/@/components/Form';
  import { BasicInfo } from '/@/components/CustomComponents';
  import TablePanel from './TablePanel/index.vue';
  import { getApplyOrderDataEntry } from '/@/api/qms/iqc';
  interface IState {
    id: string;
    basicData: any;
  }

  const state = reactive<IState>({
    id: '',
    basicData: {},
  });
  const { t } = useI18n();
  const tablePanel = ref();
  const emits = defineEmits(['reload']);

  //表单
  const [registerForm, { validate }] = useForm({
    schemas: [{ field: 'type', component: 'Input', label: '类型' }],
    labelWidth: 80,
    baseColProps: { span: 6 },
    actionColOptions: { span: 24 },
    autoSubmitOnEnter: true,
    submitFunc: handleSubmit,
    i18nConfig: {
      moduleCode: 'IQCApplyColumn',
    },
  });

  const [registerPopup, { closePopup, changeLoading, changeOkLoading }] = usePopupInner(init);
  const basicInfoCols = [
    { title: 'IQC单号', dataIndex: 'testNo' },
    { title: '供应商编号', dataIndex: 'supplierNo' },
    { title: '供应商名称', dataIndex: 'supplierName' },
    { title: '内部物料编码', dataIndex: 'innerMaterialCode' },
    { title: '内部物料描述', dataIndex: 'innerMaterialDescription' },
    { title: '来料日期', dataIndex: 'materialInDate', format: 'date|YYYY-MM' },
    { title: '来料总数', dataIndex: 'materialInCount' },
    { title: '来料单位', dataIndex: 'materialInUnit' },
    { title: '材料归属', dataIndex: 'materialTypeBigName' },
    { title: '材料类型', dataIndex: 'materialTypeName' },
    { title: 'LotNo', dataIndex: 'lotNo' },
    { title: '检验数量', dataIndex: 'testCount' },
    { title: '采购单号', dataIndex: 'purchaseNo' },
    { title: '备注', dataIndex: 'remark' },
  ];

  const isViewModel = computed(() => state.type === 'view');
  const getTitle = t('common.inspectionData');

  onMounted(() => {});
  async function getApplyOrderDataEntryFn(params) {
    changeLoading(true);
    try {
      const { data, code } = await getApplyOrderDataEntry(params);
      if (code === 200) {
        const { testProjects } = data;
        state.basicData = data;
        if (!testProjects?.length) return;
        unref(tablePanel)?.init({ data: testProjects, applyId: state.id });
      }
      return [];
    } catch (error) {
      console.error(error, 'getBaseDataSupplierDetailFn is error');
    } finally {
      changeLoading(false);
    }
  }

  async function init({ row }) {
    const { id } = row;
    state.id = id;
    getApplyOrderDataEntryFn({ id });
  }

  async function handleSubmit(type = 1) {
    await unref(tablePanel).submitFn();
    emits('reload');
    closePopup();
  }
</script>

<style lang="less" scoped>
  .scroll-tab {
    position: absolute;
    left: 210px;
    display: flex;
    border-left: 2px solid #e5e5e5;
    height: 40px;
    padding-left: 20px;

    &-item {
      width: 60px;
      height: 44px;
      line-height: 46px;
      margin-right: 12px;
      text-align: center;
    }
  }

  .active-btn {
    border-bottom: 4px solid @primary-color;
  }

  .print-icon {
    cursor: pointer;
    margin-right: 12px;

    i {
      font-size: 26px;

      &:hover {
        color: @primary-color;
      }
    }
  }
</style>
