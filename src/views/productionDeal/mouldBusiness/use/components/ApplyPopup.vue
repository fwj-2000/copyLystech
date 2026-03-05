<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    :showOkBtn="!state.disabled"
    :okText="t('common.submit')"
    :title="t('common.addText')"
    @ok="() => handleSave(true)"
    class="full-popup">
    <template #centerToolbar>
      <a-button v-show="!state.disabled" :loading="state.loading" @click="handleSave(false)" type="primary" ghost class="mr-10px">{{
        t('common.temporarySave')
      }}</a-button>
    </template>
    <div class="h-full requirement-pop p-10px">
      <div class="lydc-content-wrapper-search-box pt-8px mb-16px">
        <Subtitle :title="t('common.baseinfo')" />
        <BasicForm @register="registerForm" />
      </div>
      <!-- 模具领用信息 -->
      <div v-show="showTable" class="flex-1 overflow-hidden">
        <Grid>
          <template #toolbar-actions>
            <Subtitle placement="vxe" :title="t('common.moIdUseInfo')" :extra="{ show: !state.disabled }" @add-column="handleAddColumn" />
          </template>
          <template #remainPer="{ row }">
            <div class="remain-tag" :class="calculatePercentageStyle(row)">{{ calculateRemainingLifePercentage(row) }}</div>
          </template>
          <template #action="{ row, rowIndex }">
            <TableAction :outside="true" :actions="getTableActions(row, rowIndex)" />
          </template>
        </Grid>
      </div>
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
  import { getDetail, applyMoId, addTempStorage } from '/@/api/productionDeal/moIdUse';
  import { useUserStore } from '/@/store/modules/user';
  import { addColumn, addSchema, editRules, calculateRemainingLifePercentage, calculatePercentageStyle, canEdit } from './config';
  import { buildUUID } from '/@/utils/uuid';
  import { useVbenVxeGrid, VxeGridProps } from '/@/adapter/vxe-table';
  import { Subtitle } from '/@/components/Subtitle';
  import { BasicForm, useForm } from '/@/components/Form';
  import { ref, reactive } from 'vue';
  import { getProductionPersonne } from '/@/api/warehouse/mainProder';

  const emits = defineEmits(['register', 'reload']);

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
    customConfig: {
      allowVisible: false,
      allowSort: true, // 允许拖拽排序
    },
  };
  const [Grid, gridApi] = useVbenVxeGrid({ gridOptions });
  const { getDataSource, setGridOptions, reloadColumn } = gridApi;
  const showTable = ref(false);

  const [registerPopup, { closePopup, changeLoading, changeOkLoading }] = usePopupInner(init);

  const userStore = useUserStore();
  const state = reactive({
    applyNo: '',
    mode: '',
    disabled: false,
    loading: false,
  });
  async function init(data) {
    changeLoading(true);
    showTable.value = false;
    state.mode = data.mode || 'add';
    handleDisabled(data);
    if (data.ids || data.applyNo) {
      handleDetail(data);
    } else {
      state.applyNo = '';
      const { getUserInfo } = userStore;
      setFieldsValue({
        applyUserName: getUserInfo.userName,
        receiveDeptName: getUserInfo.departmentName,
        applyDate: dateUtil(new Date()).format('YYYY-MM-DD'),
        reviewUserIds: [getUserInfo.managerId],
      });
      handleAddColumn(1);
      // 获取领料人
      getProductionPersonne(getUserInfo.userId).then(res => {
        if (res.data) {
          setFieldsValue({
            receiveMoldUserIds: res.data.receiveMoldUserIds,
          });
        }
        setTimeout(() => {
          changeLoading(false);
          showTable.value = true;
        }, 500);
      });
    }
  }

  // 处理置灰
  function handleDisabled(row) {
    const isDisabled = state.mode === 'view';
    state.disabled = isDisabled;
    //  ? true : !canEdit(row);
    if (isDisabled) {
      setProps({ disabled: true });
      const _cols = cloneDeep(addColumn);
      _cols.pop();
      setGridOptions({
        columns: _cols,
        editConfig: {
          enabled: false,
        },
        keyboardConfig: {
          isEdit: false,
          isPaste: false,
        },
      });
    } else {
      const _cols = cloneDeep(addColumn);
      setGridOptions({
        columns: _cols,
        editConfig: {
          enabled: true,
        },
        keyboardConfig: {
          isEdit: true,
          isPaste: true,
        },
      });
    }
    return state.disabled;
  }

  // 获取详情
  function handleDetail(data) {
    const params = data.applyNo ? [data.applyNo] : data.ids;
    getDetail(params)
      .then(res => {
        const { outputs } = res.data;
        const resData = (outputs || []).map((item: any) => {
          return {
            ...item,
          };
        });
        setFieldsValue(res.data);
        state.applyNo = res.data.moldReceiveApplyNo;
        gridApi.grid.reloadData(resData);
        setTimeout(() => {
          changeLoading(false);
          showTable.value = true;
        }, 300);
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
          receiveReason: t('common.produce'),
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
    item._X_ROW_KEY = buildUUID();
    const list = getDataSource();
    const index = list.findIndex(el => el._X_ROW_KEY == row._X_ROW_KEY);
    list.splice(index + 1, 0, item);
    gridApi.grid.reloadData(list);
    // gridApi.grid.insertAt(item, index + 1);
  }

  async function handleSave(isSubmit = false) {
    if (isSubmit) {
      // 表格校验
      const formValidate = await validate();
      if (!formValidate) {
        return createMessage.warning(t('dict.SalesSiteColumn.requiredTip'));
      }
      // 表单校验
      if (await gridApi.grid.validate(true)) {
        return createMessage.warning(t('dict.SalesSiteColumn.requiredTip'));
      }
    }
    changeOkLoading(true);
    state.loading = true;
    const { receiveMoldUserIds, affairsType, reviewUserIds } = getFieldsValue();
    const params: any = {
      moldReceiveApplyCrInputs: gridApi.grid
        .getFullData()
        .map(item =>
          pick(item, [
            'id',
            'moldVersion',
            'moldNumber',
            'outShippingSpaceCode',
            'callShippingSpaceCode',
            'temporaryOrder',
            'receiveReason',
            'plannedReceiveDate',
            'sapWorkOrder',
            'insidePartNumber',
            'remark',
            'workshopLocation',
          ]),
        ),
      receiveMoldUserIds,
      affairsType,
      reviewUserIds,
    };
    if (state.applyNo) {
      params.applyNo = state.applyNo;
    }
    const method = isSubmit ? applyMoId : addTempStorage;
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
      .catch(() => {})
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

  .remain-tag {
    width: 100%;
    height: 100%;
    border-radius: 4px;
    padding: 2px;

    &.red {
      background-color: rgb(255 77 79 / 20%);
      color: #ff4d4f;
    }

    &.yellow {
      background-color: rgb(255 123 0 / 20%);
      color: #faad14;
    }
  }
</style>
