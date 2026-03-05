<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    :showOkBtn="!isDetail"
    :showCancelBtn="true"
    :title="title"
    :destroyOnClose="true"
    :showFooter="false"
    @ok="handleSubmit">
    <div class="!h-[100%]">
      <div class="p-12px pb-0">
        <BasicForm class="basic-form" @register="registerForm" @submit="getworkallocationlistFn">
          <!-- <template #submitBefore>
            <a-button type="primary" class="mr-8px">请假人员</a-button>
          </template> -->
        </BasicForm>
        <Subtitle :title="t('dict.CommonCol.dataAnalysisResults')"></Subtitle>
      </div>
      <Grid style="height: calc(100% - 10px)">
        <template #expandContent="{ row }">
          <div class="expand-outsize">
            <div class="expand">
              <div class="expand-content">
                <ExpandBlock :title="t('dict.CommonCol.dataOptimizationLogic')">
                  <div class="logic">
                    <div class="logic-item">
                      <!-- 6码精确查找 -->
                      <span class="logic-label">{{ t('dict.OptimalScheduleColumn.accurateSearchCode') }}：</span>
                      <span class="logic-value">{{ exitValue(row.accurateSearchCode) }}</span>
                    </div>
                    <div class="logic-item">
                      <!-- 6码模糊查找 -->
                      <span class="logic-label">{{ t('dict.OptimalScheduleColumn.fuzzySearchCode') }}：</span>
                      <span class="logic-value">{{ exitValue(row.fuzzySearchCode) }}</span>
                    </div>
                    <div class="logic-item">
                      <!-- 工艺代码相似度 -->
                      <span class="logic-label">{{ t('dict.OptimalScheduleColumn.processCodeSimilarity') }}：</span>
                      <span class="logic-value">{{ exitValue(row.processCodeSimilarity) }}</span>
                    </div>
                    <div class="logic-item">
                      <!-- 同类型工艺产品品名 -->
                      <span class="logic-label">{{ t('dict.CommonCol.productNameSimilarCraftProducts') }}：</span>
                      <span class="logic-value">{{ exitValue(row.sameProcessProductCode) }}</span>
                    </div>
                  </div>
                </ExpandBlock>
                <!-- OEE良率维度 -->
                <ExpandBlock :title="t('dict.CommonCol.OEEYieldDimension')">
                  <!-- 良率 -->
                  <ExpandItem :list="getExpandContent1(row)" :rateType="t('dict.targetRateType.1')"> </ExpandItem>
                </ExpandBlock>
                <!-- OEE效率维度 -->
                <ExpandBlock :title="t('dict.CommonCol.OEEEfficiencyDimension')">
                  <!-- 效率 -->
                  <ExpandItem :list="getExpandContent2(row)" :rateType="t('dict.CommonCol.efficiency')"> </ExpandItem>
                </ExpandBlock>
                <!-- OEE稼动率维度 -->
                <ExpandBlock :title="t('dict.CommonCol.OEEUtilizationRateDimension')">
                  <!-- 稼动率 -->
                  <ExpandItem :list="getExpandContent3(row)" :rateType="t('dict.targetRateType.2')"> </ExpandItem>
                </ExpandBlock>
              </div>
            </div>
          </div>
        </template>
        <template #machineOperator="{ row }">
          <!-- <a-select
            show-search
            v-model:value="row.machineOperator"
            :filterOption="
              (input, option) => {
                return filterOption(input, option, row);
              }
            "
            @focus="getMachineOperator($event, row)">
            <a-select-option v-for="(item, index) in row.personOptions" :key="index" :value="item.id">{{ item.name }}</a-select-option>
          </a-select> -->
          <div v-if="isDetail">{{ row.machineOperatorName }}</div>
          <a-select
            v-else
            show-search
            v-model:value="row.machineOperator"
            @search="machineOperatorSearch($event, row)"
            :filter-option="false"
            :not-found-content="null"
            @focus="getMachineOperator($event, row)">
            <a-select-option v-for="(item, index) in row.personOptions" :key="index" :value="item.id">{{ item.name }}</a-select-option>
          </a-select>
        </template>
        <template #action="{ row }">
          <TableAction outside :actions="getTableActions(row)" />
        </template>
      </Grid>
    </div>
  </BasicPopup>
</template>
<script lang="ts" setup>
  import { reactive, toRefs, nextTick, ref } from 'vue';
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { useI18n } from '/@/hooks/web/useI18n';
  import Subtitle from '/@/components/Subtitle/src/Subtitle.vue';
  import { BasicForm, useForm } from '/@/components/Form';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { columns, exitValue } from './config';
  import ExpandBlock from './ExpandBlock.vue';
  import ExpandItem from './ExpandItem.vue';
  import { getgrouplist, getworkallocationlist, workallocation, getuserlistselector, getdutypersonlist } from '/@/api/qms/personnelArrangementOptimiz';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { TableAction } from '/@/components/Table';
  import { debounce, uniq } from 'lodash-es';

  const emits = defineEmits(['register', 'reload']);
  const { createMessage } = useMessage();
  interface State {
    title: string;
    id: string;
    baseColSource: any[];
    factoryArea: string;
  }

  const state = reactive<State>({
    title: '',
    id: '',
    baseColSource: [],
    factoryArea: '',
  });
  const isDetail = ref(false);
  const { title } = toRefs(state);
  const { t } = useI18n();
  const [registerPopup, { closePopup, changeLoading }] = usePopupInner(init);

  const [registerForm, formApi] = useForm({
    baseColProps: { span: 6 },
    showActionButtonGroup: true,
    showAdvancedButton: false,
    compact: true,
    autoAdvancedLine: 1,
    actionColOptions: {
      span: 4,
    },
    labelWidth: 80,
    labelAlign: 'right',
    submitButtonOptions: {
      text: t('dict.CommonCol.intelligentDispatch'),
      //@ts-ignore
      ghost: true,
    },
    showResetButton: false,
    i18nConfig: {
      moduleCode: 'OptimalScheduleColumn',
      transferRange: ['placeholder', 'label'],
    },
    schemas: [
      {
        field: 'scheduleData',
        label: '生产日期',
        component: 'DatePicker',
        required: true,
      },
      {
        field: 'classes',
        component: 'Select',
        label: '班次',
        required: true,
        componentProps: {
          options: [
            { id: 1, fullName: t('common.dayShift') },
            { id: 2, fullName: t('dict.NightShift') },
          ],
        },
        i18nField: 'classesName',
      },
      {
        field: 'groupInfoIds',
        label: '组别',
        component: 'ApiSelect',
        required: true,
        componentProps: {
          mode: 'multiple',
          api: getgrouplist,
          resultField: 'data',
          labelField: 'name',
          valueField: 'id',
          beforeFetch: async params => {
            await nextTick();
            params = {
              ...params,
              factoryArea: state.factoryArea,
            };
            return params;
          },
        },
        i18nField: 'CommonCol.group',
      },
    ],
  });

  const [Grid, gridApi] = useVbenVxeGrid({
    gridOptions: {
      id: 'qms-intelligentButler-personnelArrangementOptimiz-scheduleList',
      // showIndexColumn: true,
      columns,
      editConfig: {
        trigger: 'dblclick',
        mode: 'row',
      },
      pagerConfig: {
        autoHidden: true,
      },
      mouseConfig: {
        area: false,
      },
      rowConfig: {
        isCurrent: false,
        isHover: false,
      },
      columnConfig: {
        isCurrent: false,
        isHover: false,
      },
      expandConfig: {
        accordion: true,
        lazy: true,
        loadMethod: data => {
          return new Promise((resolve, reject) => {
            setTimeout(() => {
              resolve({ expandContent: { data: 123 } });
            }, 1000);
          });
        },
      },
      toolbarConfig: {
        enabled: false,
      },
      scrollY: {
        enabled: false,
      },
      cellClassName: ({ row, column }) => {
        if (column.field === 'machineOperator' && !row.machineOperator) {
          return 'active-cell';
        }
      },
      spanMethod(data) {
        const { row, $rowIndex: rowIndex, column, visibleData } = data;
        const spanFields = ['machineOperator', 'machineNo'];
        const diffField = 'machineNo';
        const cellValue = row[diffField];

        if (cellValue && spanFields.includes(column.field)) {
          const prevRow = visibleData[rowIndex - 1];

          // 如果上一行存在且相同，则合并到首行
          if (prevRow && prevRow[diffField] === cellValue) {
            return { rowspan: 0, colspan: 0 };
          }

          // 计算连续相同值的行数
          let countRowspan = 1;
          while (rowIndex + countRowspan < visibleData.length && visibleData[rowIndex + countRowspan][diffField] === cellValue) {
            countRowspan++;
          }

          if (countRowspan > 1) {
            return { rowspan: countRowspan, colspan: 1 };
          }
        }
      },
      i18nConfig: {
        moduleCode: 'OptimalScheduleColumn',
      },
    },
  });

  function getTableActions(row) {
    return [
      // 删除
      {
        icon: 'icon-ym icon-ym-delete',
        tooltip: t('dict.ProgressStatusEnum.8'),
        onClick: handleDelete.bind(null, row),
        disabled: isDetail.value,
        // auth: 'btn_edit',
      },
    ];
  }

  const machineOperatorSearch = debounce(async (e, row) => {
    const filterOptions = personList.value.filter(item => item.name.indexOf(e) >= 0);
    const tableList = gridApi.getDataSource();
    const machineOperatorList = tableList.map(item => item.machineOperator);
    if (filterOptions.length) {
      row.personOptions = filterOptions.filter(item => !machineOperatorList.includes(item.id) || item.id === row.machineOperator);
    } else {
      const { data } = await getuserlistselector({ keyword: e, currentPage: 1, pageSize: 20 });
      row.personOptions = data.list
        .map(item => {
          return {
            id: item.id,
            name: item.fullName,
          };
        })
        .filter(item => !machineOperatorList.includes(item.id) || item.id === row.machineOperator);
    }
  }, 500);

  const getMachineOperator = (e, row) => {
    const tableList = gridApi.getDataSource();
    const machineOperatorList = tableList.map(item => item.machineOperator);
    row.personOptions = uniq([...row.personOptions, ...personList.value]).filter(
      item => !machineOperatorList.includes(item.id) || item.id === row.machineOperator,
    );
  };

  const handleDelete = row => {
    gridApi.grid.remove(row);
  };

  const personList = ref<any[]>([]);
  const getdutypersonlistFn = async params => {
    const { data } = await getdutypersonlist(params);
    personList.value = data;
  };

  async function getworkallocationlistFn() {
    const values = await formApi.validate();
    if (!values) return;
    const params = { ...values, groupInfoIds: values.groupInfoIds.join(','), factoryArea: state.factoryArea };
    changeLoading(true);

    await getdutypersonlistFn(params);

    const { code, msg, data } = await getworkallocationlist(params).finally(() => {
      changeLoading(false);
    });
    const tableList = data.map(item => {
      return {
        ...item,
        scheduleData: values.scheduleData,
        classes: values.classes,
        groupInfoIds: values.groupInfoIds.join(','),
        personOptions: personList.value,
      };
    });
    gridApi.reloadData(tableList);
    if (code === 200) {
      createMessage.success(msg);
      return;
    }
    createMessage.error(msg);
  }

  function getExpandContent1(row) {
    const data = [
      { rate: row.yieldRate1, userName: row.yieldRateOperator1 },
      { rate: row.yieldRate2, userName: row.yieldRateOperator2 },
      { rate: row.yieldRate3, userName: row.yieldRateOperator3 },
    ];
    return data;
  }
  function getExpandContent2(row) {
    const data = [
      { rate: row.efficiency1, userName: row.efficiencyOperator1 },
      { rate: row.efficiency2, userName: row.efficiencyOperator2 },
      { rate: row.efficiency3, userName: row.efficiencyOperator3 },
    ];
    return data;
  }
  function getExpandContent3(row) {
    const data = [
      { rate: row.operationRate1, userName: row.operationRateOperator1 },
      { rate: row.operationRate2, userName: row.operationRateOperator2 },
      { rate: row.operationRate3, userName: row.operationRateOperator3 },
    ];
    return data;
  }

  async function handleSubmit() {
    const tableList = gridApi.getDataSource();
    if (!tableList.length) {
      return createMessage.warning(t('dict.CommonCol.dataDoesNotExist'));
    }
    changeLoading(true);
    const { code, msg } = await workallocation(tableList).finally(() => {
      changeLoading(false);
    });
    if (code === 200) {
      createMessage.success(msg);
      emits('reload');
      closePopup();
      return;
    }
    createMessage.error(msg);
  }

  function init({ type, row, factoryArea }) {
    if (type === 'detail') {
      isDetail.value = true;
      formApi.setProps({
        submitButtonOptions: {
          ghost: false,
          disabled: true,
        },
      });
      nextTick(() => {
        formApi.resetSchema([
          {
            field: 'scheduleData',
            label: '生产日期',
            component: 'DatePicker',
            required: true,
            componentProps: { disabled: true },
          },
          {
            field: 'classes',
            component: 'Select',
            label: '班次',
            required: true,
            componentProps: {
              disabled: true,
              options: [
                { id: 1, fullName: t('common.dayShift') },
                { id: 2, fullName: t('dict.NightShift') },
              ],
            },
            i18nField: 'classesName',
          },
        ]);

        formApi.setFieldsValue({
          scheduleData: row.scheduleData,
          classes: row.classes,
          groupInfoIds: row.groupInfoIds && row.groupInfoIds.split(','),
        });
        gridApi.reloadData([row]);
      });
    } else {
      isDetail.value = false;
      state.factoryArea = factoryArea;
    }
  }
</script>

<style lang="less" scoped>
  ::v-deep .scrollbar__view {
    height: 100% !important;

    & > div {
      height: 90% !important;
    }
  }

  ::v-deep .vxe-body--expanded-cell {
    padding-left: 12px !important;
    width: 100vh;
    max-width: 1200px;
    position: sticky;
    left: 0;
    top: 0;
    overflow: hidden;
  }

  .expand-outsize {
    width: 100%;
    position: sticky;
    left: 0;
    overflow: hidden;
    margin: 12px 0;
  }

  .expand {
    min-height: 200px;
    width: 100%;
    overflow-x: auto;
  }

  .expand-content {
    border-bottom: 1px solid #e8e8e8;
  }

  .logic {
    display: flex;

    .logic-item {
      flex: 1;
      font-size: 14px;

      .logic-label {
        color: rgb(26 26 26 / 70%);
      }

      .logic-value {
        color: #1a1a1a;
      }
    }
  }

  ::v-deep(.active-cell) {
    background: #ffdab7;
  }
</style>
