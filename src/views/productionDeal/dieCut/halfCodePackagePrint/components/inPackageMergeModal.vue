<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    :title="t('dict.CommonCol.inPackageMerge')"
    destroy-on-close
    showOkBtn
    @ok="handleSubmit"
    width="800px"
    :minHeight="80">
    <div class="mb-12px flex-box">
      <div>{{ t('dict.CommonCol.scanQRCode') }}：</div>
      <div class="w-2/3">
        <LydcInput
          class="translate-input"
          :suffixIcon="'icon-ym icon-ym-scanCode'"
          v-model:value="translateInput"
          :placeholder="t('dict.CommonCol.scanQRCode')"
          @Keydown="handlerInputKeydown" />
      </div>
    </div>
    <Grid>
      <template #action="{ row }">
        <TableAction outside :actions="getTableActions(row)" />
      </template>
    </Grid>
  </BasicModal>
  <designindex v-show="false" ref="designindexPrint" />
</template>
<script setup lang="ts">
  import { ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { TableAction } from '/@/components/Table';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import designindex from '/@/views/system/printTemplate/components/LydcPrintDesign/src/designIndex.vue';
  import { getPrintTemplateDetail, mergePackage, getPackDetail } from '/@/api/productionDeal/packagePrint';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { message } from 'ant-design-vue';

  const translateInput = ref('');
  interface DesignindexPrintType {
    clickTemplate: (data: any) => void;
    previewPrint: (data: any) => void;
  }

  const designindexPrint = ref<DesignindexPrintType>();
  const emit = defineEmits(['register', 'added', 'reload', 'openPrintSN']);
  const { t } = useI18n();

  const [registerModal, { closeModal, changeLoading, changeOkLoading }] = useModalInner(init);

  const column = [
    {
      title: '内包标签',
      field: 'uniqueCodeInPack',
      width: 180,
    },
    {
      title: '直接客户',
      field: 'immediateCustomerName',
      width: 180,
    },
    {
      title: '内部料号',
      field: 'innerMaterialCode',
      width: 180,
    },
    {
      title: '数量',
      field: 'qty',
      width: 80,
    },
    {
      title: '操作',
      field: 'action',
      slots: { default: 'action' },
      width: 60,
      fixed: 'right',
    },
  ];

  const [Grid, { getDataSource, remove, loadData }] = useVbenVxeGrid({
    gridOptions: {
      id: 'productionDeal-dieCut-halfCodePackagePrint-snList',
      columns: column,
      toolbarConfig: {
        enabled: false,
      },
      pagerConfig: {
        autoHidden: true,
      },
      height: 500,
      showIndexColumn: true,
    },
  });

  async function init() {
    document.getElementsByClassName('translate-input')[0]?.querySelector('input')?.focus();
    translateInput.value = '';
  }

  // 操作
  function getTableActions(row) {
    return [
      {
        icon: 'icon-ym icon-ym-delete',
        onClick: handledelete.bind(null, row),
        toolTip: t('common.delText'),
      },
    ];
  }

  const handledelete = row => {
    remove(row);
  };

  const handlerInputKeydown = async (e: any) => {
    if (e.keyCode !== 13) return;
    const val = e.target._value;
    translateInput.value = '';
    handlerInputChangeFn(val);
  };

  const codePrefix = (code: string, strLen: number) => {
    return code ? code.slice(0, strLen) : '';
  };

  const handlerInputChangeFn = async (inPackCode: string) => {
    const tableList = getDataSource();
    if (tableList.some(item => item.uniqueCodeInPack === inPackCode)) return message.error(t('dict.CommonCol.innerPackageLabelExists'));
    changeLoading(true);
    const { data } = await getPackDetail({ inPackCode }).finally(() => {
      changeLoading(false);
    });
    if (!data || !data.length) return message.error(t('dict.CommonCol.dataNotExist'));
    // 根据料号前缀判断料号是否一致
    if (tableList.length && codePrefix(data[0].innerMaterialCode, 10) !== codePrefix(tableList[0].innerMaterialCode, 10)) {
      return message.error(t('dict.CommonCol.scanConsistentTip'));
    }
    loadData([data[0], ...tableList]);
  };

  //提交

  async function handleSubmit() {
    const tableList = getDataSource();
    if (tableList.length < 2) return message.error(t('dict.CommonCol.innerPackageNumberTip'));
    changeOkLoading(true);
    const { msg, code, data } = await mergePackage(tableList.map(item => item.uniqueCodeInPack)).finally(() => {
      changeOkLoading(false);
    });
    if (code === 200) {
      message.success(msg);
      closeModal();
      emit('reload');
      getPrintTemplateDetail(data.templateId).then(res => {
        if (designindexPrint.value && designindexPrint.value.clickTemplate) {
          designindexPrint.value.clickTemplate(res.data);
          designindexPrint.value.previewPrint([data]);
        }
      });
    }
  }
</script>

<style lang="less" scoped>
  :deep(.icon-ym-scanCode) {
    color: #ff7b00 !important;
  }

  .flex-box {
    display: flex;
    align-items: center;
  }
</style>
