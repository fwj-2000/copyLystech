<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <Grid>
          <template #toolbar-actions>
            <a-space>
              <LydcInput
                :suffixIcon="'icon-ym icon-ym-scanCode'"
                v-model:value="translateInput"
                :placeholder="t('dict.CommonCol.pleaseScan')"
                @Keydown="handlerInputKeydown" />
            </a-space>
          </template>
          <template #nodeDetail="{ row }">
            <span class="table-a" @click="handleNodeModal(row)"> {{ t('common.searchDetail') }} </span>
          </template>
          <template #action="{ rowIndex, row }">
            <TableAction :actions="getTableActions(row)" />
          </template>
        </Grid>
      </div>
    </div>
    <NodeModal @register="registerNodeModal"></NodeModal>
  </div>
</template>
<script setup lang="ts">
  import { onMounted, ref } from 'vue';
  import { router } from '/@/router/index';
  import { BasicTable, useTable, FormSchema, ActionItem } from '/@/components/Table';
  import { useI18n } from '/@/hooks/web/useI18n';
  import TableAction from '/@/components/Table/src/components/TableAction.vue';
  import { columns } from './components/config';
  import { getReceivepage, receive, receiveByDocumentNumber } from '/@/api/productionDeal/dieCutPerPrint';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { dateUtil } from '/@/utils/dateUtil';
  import { useModal } from '/@/components/Modal';
  import NodeModal from './components/NodeModal.vue';
  import { debounce } from 'lodash-es';
  import { useUserStore } from '/@/store/modules/user';
  defineOptions({ name: 'productionDeal-dieCut-receiveMaterials' });

  const [registerNodeModal, { openModal: openNodeModal }] = useModal();
  const { createMessage } = useMessage();
  const { t } = useI18n();
  const translateInput = ref('');
  const userStore = useUserStore();
  const searchFormSchema = [
    {
      fieldName: 'workOrderNo',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: '请输入工单编码',
      },
      colProps: { span: 4 },
    },
    {
      fieldName: 'handleUserId',
      label: '',
      component: 'CustomUserSelect',
      componentProps: {
        defaultValue: userStore.getUserInfo?.userId,
        placeholder: '请选择处理人',
        multiple: false,
        allowClear: true,
        showSearch: true,
      },
      // colProps: { span: 4 },
    },
    {
      fieldName: 'produceDate',
      label: '',
      component: 'RangePicker',
      componentProps: {
        placeholder: ['请选择开始时间', '请选择结束时间'],
        width: '400px',
      },
    },
  ];
  const [
    Grid,
    {
      getSelectRows,
      getSelectRowKeys,
      clearSelectedRowKeys,
      setLoading: waitSetLoading,
      reload,
      setFieldValue: waitSetFieldValue,
      getFetchParams,
      updateSchema,
    },
  ] = useVbenVxeGrid({
    formOptions: {
      collapsed: true,
      // 是否在字段值改变时提交表单
      submitOnChange: false,
      showCollapseButton: false,
      // 按下回车时是否提交表单
      submitOnEnter: true,
      commonConfig: {
        componentProps: {},
        labelClass: 'w-0',
      },
      wrapperClass: 'grid grid-cols-6 gap-4',
      schema: searchFormSchema,
    },
    gridOptions: {
      id: 'productionDeal-dieCut-receiveMaterials',
      columns: columns as any,
      showFooter: false,
      api: getReceivepage,
      i18nConfig: {
        moduleCode: 'SerialPortScreenParmColumn',
      },
      columnConfig: {
        isCurrent: true, // 启用列高亮
      },
      currentColumnConfig: {
        isFollowSelected: true, // 高亮跟随选中
      },
      beforeFetch: params => {
        const _params = {
          ...params,
        };
        if (params.RangePicker && params.RangePicker.length > 0) {
          _params.StartTime = dateUtil(params.RangePicker[0]).valueOf();
          _params.EndTime = dateUtil(params.RangePicker[1]).valueOf();
          delete _params.RangePicker;
        }
        return _params;
      },
    },
  });

  function getTableActions(record): ActionItem[] {
    console.log(record);
    return [
      {
        label: t('common.receiveMaterials'),
        // icon: 'icon-ym icon-ym-view',
        modelConfirm: {
          content: t('common.isAcceptMaterials'),
          onOk: handleReceiveMaterials.bind(null, record),
        },
        ifShow: record.status !== 4 && record.process,
        // onClick: handleReceiveMaterials.bind(null, record),
      },
    ];
  }
  async function handleReceiveMaterials(record) {
    console.log(record);
    try {
      const { code, data, msg } = await receive(record.id);
      if (code === 200) {
        console.log(data);
        createMessage.success(msg);
        reload();
      }
    } catch (error) {}
  }

  function handleNodeModal(record) {
    openNodeModal(true, record);
  }

  onMounted(() => {
    // getForm().setProps({
    //   showResetButton: false,
    //   submitButtonOptions: {
    //     text: t('common.searchText'),
    //   },
    // });
  });

  const handlerInputKeydown = async (e: any) => {
    if (e.keyCode !== 13) return;
    const val = e.target._value;
    const arr = val.split('!') || [];
    translateInput.value = arr[0];
    handlerInputChangeFn(arr[0]);
  };

  const handlerInputChangeFn = debounce(async val => {
    if (!val) return;
    const menuId = router.currentRoute.value.meta.modelId || '';
    const { code, msg } = await receiveByDocumentNumber({ documentNumber: val, menuId: menuId }).finally(() => {
      translateInput.value = '';
    });
    if (code === 200) {
      createMessage.success(msg);
      reload();
    }
  }, 300);
</script>

<style lang="less" scoped>
  ::v-deep(.ant-table-container) {
    padding: 0 0 0 10px !important;
  }

  :deep(.icon-ym-scanCode) {
    color: #ff7b00 !important;
  }
</style>
