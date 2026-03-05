<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <Grid>
          <template #toolbar-actions>
            <a-button type="primary" @click="addOrUpdateHandle()"> {{ t('common.add2Text') }} </a-button>
            <a-button @click="handleDeleteList()"> {{ t('common.batchDelText') }} </a-button>
          </template>
          <template #Status="{ rowIndex, row }">
            <a-tag :color="row.Status === 1 ? 'success' : 'error'">{{ row.Status === 1 ? t('common.valid') : t('common.invalid') }}</a-tag>
          </template>
          <template #action="{ rowIndex, row }">
            <TableAction :actions="getTableActions(row)" />
          </template>
        </Grid>
      </div>
    </div>
    <add @register="registerForm" @reload="reload" />
  </div>
</template>

<script setup lang="ts">
  import { ActionItem } from '/@/components/Table';
  import { useI18n } from '/@/hooks/web/useI18n';
  import TableAction from '/@/components/Table/src/components/TableAction.vue';
  import { getTargetRateConfig, deleteTargetRateConfig, blukDeleteTargetRateConfig } from '/@/api/productionDeal/targetRateConfig';
  import { useModal } from '/@/components/Modal';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { reactive, onMounted } from 'vue';
  import { message } from 'ant-design-vue';
  import { useBaseStore } from '/@/store/modules/base';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { dateUtil } from '/@/utils/dateUtil';
  import add from './components/add.vue';

  const { t } = useI18n();
  const baseStore = useBaseStore();

  interface State {
    packingType: any[];
  }

  const state = reactive<State>({
    packingType: [],
  });

  const [registerForm, { openModal: openFormModal }] = useModal();

  const columns = [
    { type: 'checkbox', field: 'checkbox', width: '50' },
    { title: '使用厂区', field: 'factoryAreaName' },
    { title: '配置类型', field: 'configTypeName' },
    { title: '目标率类型', field: 'targetRateTypeName' },
    { title: '绑定类型', field: 'bindingTypeName' },
    { title: '绑定值', field: 'bindingValue' },
    { title: '目标率', field: 'targetRate' },
    { title: '备注', field: 'remark' },
    { title: '创建人', field: 'creatorUserName' },
    {
      title: '创建时间',
      field: 'creatorTime',
      cellRender: {
        name: 'Date',
      },
    },
    { title: '修改人', field: 'lastModifyUserName' },
    {
      title: '修改时间',
      field: 'lastModifyTime',
      cellRender: {
        name: 'Date',
      },
    },
    {
      title: '操作',
      field: 'action',
      slots: { default: 'action' },
      width: '70',
      fixed: 'right',
    },
  ];

  const searchFormSchema = [
    {
      fieldName: 'pickerVal',
      label: '',
      component: 'RangePicker',
      componentProps: {
        format: 'YYYY-MM-DD',
        placeholder: ['打印开始时间', '打印结束时间'],
        width: '400px',
      },
    },
  ];

  //getSelectRowKeys获取行id, reload刷新表单，getFetchParams获取表单数据
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
      id: 'productionDeal-basicInformation-targetRateConfig',
      columns: columns as any,
      showIndexColumn: true,
      showFooter: false,
      api: getTargetRateConfig,
      i18nConfig: {
        moduleCode: `TargetRateConfigColumn`,
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
        if (params.pickerVal && params.pickerVal.length > 0) {
          _params.StartTime = dateUtil(params.pickerVal[0]).valueOf();
          _params.EndTime = dateUtil(params.pickerVal[1]).valueOf();
          delete _params.pickerVal;
        }
        return _params;
      },
    },
  });
  function getTableActions(record): ActionItem[] {
    return [
      {
        icon: 'icon-ym icon-ym-btn-edit',
        onClick: addOrUpdateHandle.bind(null, record.id),
      },
      {
        icon: 'icon-ym icon-ym-delete',
        modelConfirm: {
          title: t('common.delText'),
          onOk: handleDelete.bind(null, record),
        },
      },
    ];
  }

  const { createMessage, createConfirm } = useMessage();

  //新增或者修改
  function addOrUpdateHandle(id = '') {
    openFormModal(true, { id, packingType: state.packingType });
  }

  //单个删除
  function handleDelete(record: Recordable) {
    deleteTargetRateConfig(record.id).then(res => {
      createMessage.success(res.msg);
      reload();
    });
  }

  //批量删除
  async function handleDeleteList() {
    const list = getSelectRowKeys();
    if (list?.length === 0) {
      clearSelectedRowKeys();
      return message.warning(t('common.selectDelDatasTip'));
    } else {
      createConfirm({
        iconType: 'warning',
        title: t('common.tipTitle'),
        content: t('common.beforeDelTip'),
        onOk: async () => {
          try {
            const { code } = await blukDeleteTargetRateConfig(list);
            if (code == 200) {
              clearSelectedRowKeys();
              message.warning(t('common.delSuccess'));
            }
            reload();
          } catch (e) {
            console.log(e);

            clearSelectedRowKeys();
            reload();
          }
        },
      });
    }
  }

  onMounted(async () => {
    baseStore.getDictionaryData('PackingType').then(res => {
      state.packingType = res as any[];
      updateSchema([
        {
          field: 'PackingType',
          componentProps: {
            options: res,
            fieldNames: {
              label: 'fullName',
              value: 'enCode',
            },
          },
        },
      ]);
    });
  });
</script>

<style scoped lang="less">
  .pldr {
    color: #ff7b00;
  }
</style>
