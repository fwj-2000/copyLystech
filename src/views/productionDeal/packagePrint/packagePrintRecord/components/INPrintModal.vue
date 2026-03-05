<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    :title="activeKey === 'OUT' ? 'OUT包装标签打印' : 'IN包装标签打印'"
    okText="打印"
    :showCancelBtn="false"
    :width="700">
    <div class="block-item">
      <div class="block-label">标签扫描</div>
      <LydcInput :suffixIcon="'icon-ym icon-ym-scanCode'" v-model:value="state.labelScan" :placeholder="t('common.scanText')" @Keydown="handlerInputKeydown" />
    </div>
    <BasicForm @register="registerForm"> </BasicForm>
    <div class="numbers">
      <div class="total-number">总数量：111</div>
      <div class="scan-number">扫描数量：222</div>
    </div>

    <Grid>
      <template #action="{ row }">
        <TableAction outside :actions="getTableActions(row)" />
      </template>
    </Grid>
    <template #insertFooter>
      <a-button type="primary" ghost class="ml-12px">清空</a-button>
    </template>
  </BasicModal>
</template>
<script setup lang="ts">
  import { ref } from 'vue';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { getRepairmoldpage } from '/@/api/engineering/mould';
  import { BasicForm, useForm } from '/@/components/Form';
  import { getPackLabelInfoForPrint } from '/@/api/productionDeal/packagePrint';

  import { useI18n } from '/@/hooks/web/useI18n';
  import { useBaseStore } from '/@/store/modules/base';

  const baseStore = useBaseStore();

  const props = defineProps({
    activeKey: {
      type: String,
      default: '',
    },
  });
  const { t } = useI18n();

  const state = ref({
    printBoxType: '', // 箱子类型
    labelScan: '', // 标签扫描
  });

  const [registerModal, { closeModal, changeOkLoading }] = useModalInner(init);

  const formSchemas = [
    {
      field: 'printBoxType',
      label: '箱子类型',
      component: 'ApiSelect',
      componentProps: {
        api: async () => {
          return {
            data: await baseStore.getDictionaryData('PrintBoxType'),
          };
        },
        resultField: 'data',
        labelField: 'fullName',
        valueField: 'enCode',
        showSearch: true,
        filterOption: false,
        defaultFirstOption: true,
      },
    },
  ];

  const [registerForm, { setFieldsValue, updateSchema, resetFields, getFieldsValue }] = useForm({
    schemas: formSchemas,
    layout: 'vertical',
    labelWidth: 220,
    baseColProps: {
      span: 24,
    },
    // i18nConfig: {
    //   moduleCode: 'RepairMoldColumn',
    //   transferRange: ['placeholder', 'label'],
    // },
  });

  const columns = [
    {
      title: 'IN',
      field: 'IN',
      width: 180,
    },
    {
      title: 'Qty',
      field: 'documentNumber',
      width: 180,
    },
    {
      title: 'SPN',
      field: 'documentNumber',
    },
    {
      title: '操作',
      field: 'action',
      slots: { default: 'action' },
      width: 60,
      fixed: 'right',
    },
  ];

  const [Grid, gridApi] = useVbenVxeGrid({
    gridOptions: {
      id: 'engineering-mouldRoom-moldDrawingReview-list',
      columns,
      api: getRepairmoldpage,
      height: 300,
      toolbarConfig: {
        enabled: false,
      },
      pagerConfig: {
        autoHidden: true,
      },
      // showIndexColumn: true,
      // i18nConfig: {
      //   moduleCode: 'RepairMoldColumn',
      // },
    },
  });

  function getTableActions(row) {
    return [
      // 删除
      {
        icon: 'icon-ym icon-ym-delete',
        tooltip: t('dict.ProgressStatusEnum.8'),
        onClick: handleDelete.bind(null, row),
        // auth: 'btn_edit',
      },
    ];
  }

  const handleDelete = row => {
    gridApi.grid.remove(row);
  };

  async function init() {}

  // const handlePackTypeChange = e => {
  //   // 1-'片料' 2-卷料
  //   const newColumn =
  //     e === '1'
  //       ? columns
  //       : columns.map(item => {
  //           if (item.field === 'IN') {
  //             return {
  //               ...item,
  //               title: 'PE',
  //               field: 'PE',
  //             };
  //           } else {
  //             return { ...item };
  //           }
  //         });
  //   gridApi.reloadColumn(newColumn);
  // };

  const handlerInputKeydown = async (e: any) => {
    if (e.keyCode !== 13) return;
    const val = e.target._value;
    const arr = val.split('!') || [];
    if (arr.length < 2) {
      return;
    }
    const params = {
      // PackType: state.value.packType,
      InnerMaterialCode: arr[1],
    };
    const { data } = await getPackLabelInfoForPrint(params);
    // setFieldsValue(data);
  };
</script>
<style lang="scss" scoped>
  .block-item {
    margin-bottom: 12px;

    .block-label {
      margin-bottom: 8px;
    }
  }
  // .package-block {
  //   display: flex;
  //   .block-left {
  //     display: flex;
  //     flex-wrap: wrap;
  //     .block-item {
  //       // display: flex;
  //       // align-items: center;
  //       width: 30%;
  //       margin-right: 12px;
  //       margin-bottom: 12px;
  //       &:last-child {
  //         margin-right: 0;
  //       }
  //       .block-label {
  //         width: 70px;
  //         margin-bottom: 4px;
  //       }
  //       .block-content {
  //         width: 100%;
  //       }
  //       .template-block {
  //         display: flex;
  //         align-items: center;
  //       }
  //     }
  //     .block-scan {
  //       width: 66%;
  //     }
  //   }
  //   .block-right {
  //     flex: 1;
  //     .btn-block {
  //       width: 100%;
  //       display: flex;
  //       justify-content: flex-end;
  //     }
  //   }
  // }
  .numbers {
    display: flex;
    margin-bottom: 10px;
    .total-number {
      margin-right: 20px;
    }
  }
</style>
