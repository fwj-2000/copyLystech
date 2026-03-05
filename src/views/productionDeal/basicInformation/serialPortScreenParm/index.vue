<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <Grid>
          <template #toolbar-actions>
            <a-button type="primary" @click="openPopup(true, {})"> {{ t('common.add2Text') }} </a-button>
            <a-button @click="handleDeleteList()"> {{ t('common.batchDelText') }} </a-button>
          </template>
          <template #action="{ rowIndex, row }">
            <TableAction :actions="getTableActions(row)" />
          </template>
        </Grid>
      </div>
    </div>
    <add @register="registerForm" @reload="reload" />
    <ApplyPopup @register="registerApplyPop" @reload="reload" @colse="reload" />
  </div>
</template>

<script setup lang="ts">
  import { ActionItem, BasicColumn, BasicTable, FormSchema, useTable } from '/@/components/Table';
  import TableAction from '/@/components/Table/src/components/TableAction.vue';
  import { deleteSerialPortScreenParm, blukDeleteSerialPortScreenParm, getSerialPortScreenParm } from '/@/api/productionDeal/serialPortScreenParm';
  import { useModal } from '/@/components/Modal';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { message } from 'ant-design-vue';
  import add from './components/add.vue';
  import ApplyPopup from './components/applyPopup.vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { usePopup } from '/@/components/Popup';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { dateUtil } from '/@/utils/dateUtil';
  const { t } = useI18n();
  const [registerApplyPop, { openPopup }] = usePopup();

  const columns = [
    { type: 'checkbox', field: 'checkbox', width: '50' },
    { title: '内部料号', field: 'innerMaterialCode' },
    { title: '料轴号', field: 'materialAxisNo' },
    { title: '材料', field: 'material' },
    { title: '张力', field: 'tension' },
    { title: '放/收料', field: 'releaseOrReceiveMaterialName' },
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
      fieldName: 'innerMaterialCode',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: t('dict.CommonCol.startTime'),
      },
      colProps: { span: 4 },
    },
    {
      fieldName: 'pickerVal',
      label: '',
      component: 'RangePicker',
      componentProps: {
        format: 'YYYY-MM-DD',
        placeholder: [t('dict.CommonCol.startTime'), t('dict.CommonCol.endTime')],
      },
    },
  ];

  const { createMessage, createConfirm } = useMessage();
  const [registerForm, { openModal: openFormModal }] = useModal();
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
      id: 'productionDeal-basicInformation-serialPortScreenParm',
      columns: columns as any,
      showIndexColumn: true,
      showFooter: false,
      api: getSerialPortScreenParm,
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
        onClick: addOrUpdateHandle.bind(null, record),
      },
      {
        icon: 'icon-ym icon-ym-delete',
        modelConfirm: {
          title: '删除',
          onOk: handleDelete.bind(null, record),
        },
      },
    ];
  }

  function addOrUpdateHandle(record) {
    openFormModal(true, record);
  }

  //单个删除
  function handleDelete(record: Recordable) {
    deleteSerialPortScreenParm(record.id).then(res => {
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
            const { code } = await blukDeleteSerialPortScreenParm(list);
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
</script>

<style scoped lang="less">
  .pldr {
    color: #ff7b00;
  }
</style>
