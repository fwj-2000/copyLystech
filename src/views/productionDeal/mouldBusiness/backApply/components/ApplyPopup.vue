<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    :showOkBtn="state.isEdit"
    :okText="t('common.submit')"
    :title="title"
    @ok="() => handleSave(true)"
    class="full-popup">
    <template #centerToolbar>
      <a-button v-if="state.isEdit" class="mr-8px" :loading="state.loading" @click="handleSave(false)" type="primary" ghost>
        {{ t('common.temporarySave') }}
      </a-button>
    </template>
    <div class="h-full requirement-pop p-10px">
      <div class="lydc-content-wrapper-search-box pt-8px mb-16px">
        <Subtitle :title="t('common.baseinfo')" />
        <BasicForm @register="registerForm" />
      </div>
      <!-- 模具领用信息 -->
      <Grid class="flex-1">
        <template #toolbar-actions>
          <Subtitle placement="vxe" :title="t('common.baseinfo')" />
        </template>
        <template #action="{ row, rowIndex }">
          <TableAction :outside="true" :actions="getTableActions(row, rowIndex)" />
        </template>
      </Grid>
    </div>
  </BasicPopup>
</template>

<script lang="ts" setup>
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { pick, cloneDeep } from 'lodash-es';
  import { dateUtil } from '/@/utils/dateUtil';
  import { TableAction, ActionItem } from '/@/components/Table';
  import { getMoldRefundDetail, createMoldRefund, tempSaveMoldRefund } from '/@/api/productionDeal/moIdBackApply';
  import { useUserStore } from '/@/store/modules/user';
  import { addColumn, addSchema, editRules } from '../config';
  import { buildUUID } from '/@/utils/uuid';
  import { useVbenVxeGrid, VxeGridProps } from '/@/adapter/vxe-table';
  import { Subtitle } from '/@/components/Subtitle';
  import { BasicForm, FormSchema, useForm } from '/@/components/Form';
  import { computed, reactive } from 'vue';
  import { getProductionPersonne } from '/@/api/warehouse/mainProder';

  const emits = defineEmits(['register', 'reload']);
  const state = reactive({
    mode: 'add',
    isEdit: true,
    applyNo: '',
    loading: false,
  });
  const title = computed(() => {
    return state.mode == 'add' ? t('common.addText') : t('common.view');
  });

  const { t } = useI18n();
  const { createMessage } = useMessage();

  const [registerForm, { updateSchema, validate, getFieldsValue, setFieldsValue, setProps }] = useForm({
    baseColProps: { span: 4 },
    labelWidth: '200',
    layout: 'vertical',
    // i18nConfig: {
    //   moduleCode: 'QuantitativeApplyColumn',
    //   transferRange: ['label', 'placeholder'],
    // },
    schemas: addSchema,
  });

  const gridOptions: VxeGridProps = {
    id: 'productionDeal-mouldBusiness-use-apply',
    columns: addColumn,
    showIndexColumn: true,
    editConfig: {
      trigger: 'dblclick',
      mode: 'row',
    },
    rowConfig: {
      keyField: '_X_ROW_KEY',
    },
    customConfig: {
      allowVisible: false,
    },
    editRules,
    proxyConfig: {
      enabled: false,
    },
    toolbarConfig: {
      refresh: false,
      zoom: true,
    },
    clipConfig: {
      isPaste: true,
    },
    pagerConfig: {
      enabled: false,
    },
    i18nConfig: {
      moduleCode: 'MoldReceiveRefundColumn',
    },
    position: 'modal',
  };
  const [Grid, gridApi] = useVbenVxeGrid({ gridOptions });
  const { getDataSource, setGridOptions } = gridApi;

  const [registerPopup, { closePopup, changeLoading, changeOkLoading }] = usePopupInner(init);

  const userStore = useUserStore();
  async function init(data) {
    const { mode } = data;
    state.mode = mode;
    handleDisabled(data);
    if (data.ids) {
      handleDetail(data.ids);
    } else {
      state.applyNo = '';
      const { getUserInfo } = userStore;
      setFieldsValue({
        applyUserName: getUserInfo.userName,
        receiveDeptName: getUserInfo.departmentName,
        applyDateTime: dateUtil(new Date()).format('YYYY-MM-DD'),
      });
      handleAddColumn(1);
      // 获取领料人
      getProductionPersonne(getUserInfo.userId).then(res => {
        setFieldsValue({
          receiveMoldUserIds: res.data.receiveMoldUserIds,
        });
      });
    }
  }

  // 是否需要disabled
  function handleDisabled(data) {
    const { mode } = data;
    const isEdit = mode !== 'view';
    if (isEdit) {
      setProps({
        disabled: false,
      });
      setGridOptions({
        editConfig: {
          enabled: true,
        },
        keyboardConfig: {
          isEdit: true,
          isPaste: true,
        },
      });
    } else {
      setProps({
        disabled: true,
      });
      setGridOptions({
        editConfig: {
          enabled: false,
        },
        keyboardConfig: {
          isEdit: false,
          isPaste: false,
        },
      });
    }
    state.isEdit = isEdit;
    return isEdit;
  }

  // 获取详情
  function handleDetail(ids) {
    changeLoading(true);
    getMoldRefundDetail(ids)
      .then(res => {
        const { outputs } = res.data;
        const resData = (outputs || []).map((item: any) => {
          return {
            ...item,
            factoryCode: item.factory ? item.factory?.split('/')[0] : '',
          };
        });
        setFieldsValue(res.data);
        state.applyNo = res.data.moldRefundApplyNo;
        gridApi.grid.reloadData(resData);
      })
      .catch(() => {
        closePopup();
      })
      .finally(() => {
        changeLoading(false);
      });
  }

  function getTableActions(row, rowIndex): ActionItem[] {
    return [
      {
        label: '',
        icon: 'icon-ym icon-ym-btn-add',
        tooltip: t('common.addText'),
        onClick: handleAddColumn.bind(null, 1, rowIndex),
      },
      {
        label: '',
        icon: 'icon-ym icon-ym-btn-copy',
        tooltip: t('common.copyText'),
        onClick: handleCopy.bind(null, row),
      },
      {
        label: '',
        color: 'error',
        icon: 'icon-ym icon-ym-delete',
        tooltip: t('common.delText'),
        onClick: handleDelete.bind(null, row),
      },
    ];
  }
  /**
   * @description 删除整行
   * */
  function handleDelete(row) {
    gridApi.grid.remove(row);
  }
  /**
   * @description 新增
   * @param line 新增的行数
   * @param rowIndex 指定起增行
   * */
  function handleAddColumn(line, rowIndex?: number) {
    const list = getDataSource();
    if (rowIndex === undefined) {
      for (let i = 0; i < line; i++) {
        list.push({
          _X_ROW_KEY: buildUUID(),
        });
      }
    } else {
      list.splice(rowIndex + 1, 0, {
        _X_ROW_KEY: buildUUID(),
      });
    }
    gridApi.grid.reloadData(list);
  }
  /**
   * @description 复制整行
   * */
  function handleCopy(row) {
    const item = cloneDeep(row);
    const list = getDataSource();
    const index = list.findIndex(el => el._X_ROW_KEY == row._X_ROW_KEY);
    list.splice(index + 1, 0, item);
    gridApi.grid.reloadData(list);
  }

  async function handleSave(isSubmit = false) {
    let method = tempSaveMoldRefund;
    if (isSubmit) {
      if ((await gridApi.grid.validate(true)) || !(await validate())) {
        return createMessage.warning(t('dict.SalesSiteColumn.requiredTip'));
      }
      method = createMoldRefund;
    }
    changeOkLoading(true);
    state.loading = true;
    const { refundMoldUserIds, affairsType } = getFieldsValue();
    const params: any = {
      upInputs: gridApi.grid
        .getFullData()
        .map(item => pick(item, ['id', 'moldReceiveApplyId', 'plannedRefundDate', 'thisUseLife', 'temporaryOrder', 'callShippingSpaceCode'])),
      refundMoldUserIds,
      affairsType,
    };
    if (state.applyNo) {
      params.moldRefundApplyNo = state.applyNo;
    }
    return method(params)
      .then(res => {
        createMessage.success(t('sys.api.operationSuccess'));
        // 暂存不做退出
        if (isSubmit) {
          closePopup();
        } else {
          state.applyNo = res.data;
        }
      })
      .finally(() => {
        emits('reload');
        changeOkLoading(false);
        state.loading = false;
      });
  }
</script>

<style lang="less" scoped>
  :deep(.lydc-basic-table-action button i) {
    font-size: 18px;
  }

  .requirement-pop {
    display: flex;
    flex-direction: column;
    padding-bottom: 10px;
  }

  :deep(.border-right) {
    border-right: 1px solid rgb(228 228 231);
  }
</style>
