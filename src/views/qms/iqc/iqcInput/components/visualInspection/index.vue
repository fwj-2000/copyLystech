<template>
  <div class="h-full">
    <Grid v-loading="isLoading">
      <template #toolbar-actions>
        <a-space>
          <AddCustomRows @submit="addColumn" />
          <a-button type="primary" @click="selectDetectionItemFn">
            {{ t('common.selectDetectionItems') }}
          </a-button>
        </a-space>
      </template>
      <template #edit_badName="data">
        <vxe-input v-model="data.row.badName" clearable v-if="isBadNameEditFn(data)"></vxe-input>
        <span v-else>
          {{ data.row.badName }}
        </span>
      </template>
      <template #default_badName="data">
        {{ data.row.badName }}
      </template>

      <template #action="{ row }">
        <TableAction :outside="true" :actions="getTableActions(row)" />
      </template>
    </Grid>
    <CheckDetailModal @register="registerCheckDetailModal" @onSelect="getCheckDetailFn"></CheckDetailModal>
  </div>
</template>
<script setup lang="ts">
  import { ref, reactive, onMounted, nextTick } from 'vue';
  import { useVbenVxeGrid, VxeGridProps } from '/@/adapter/vxe-table';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { getColumn, COLUMN_TEMPLATE } from './config';
  import { AddCustomRows } from '/@/components/AddCustomRows';
  import { cloneDeep } from 'lodash-es';
  import { buildUUID } from '/@/utils/uuid';
  import CheckDetailModal from '/@/views/productionDeal/mouldBusiness/inspectionMnt/components/checkDetailModal.vue';
  import { useModal } from '/@/components/Modal';
  import { getGroupbylist } from '/@/api/productionDeal/badCode';
  import { TableAction, ActionItem } from '/@/components/Table';
  import { getapplyordertestitem, saveTestitem } from '/@/api/qms/iqc';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { isEmpty } from '/@/utils/is';
  let lastTableDataJson = ''; // 上一次提交json
  let curTableDataJson = ''; // 当前提交json
  // 获取清单数据的参数
  const props = withDefaults(
    defineProps<{
      params?: {
        [key: string]: any;
      };
    }>(),
    {
      params: () => ({}),
    },
  );

  const { t } = useI18n();
  interface State {
    title: string;
    groupbyMap: {};
    groupbyDataSource: any[];
    tableDataSource: any[];
    checkDetail: any[];
    checkDetailList: any[];
    canEdit: boolean;
  }
  const state = reactive<State>({
    title: t('common.visualInspection'),
    groupbyMap: {},
    groupbyDataSource: [],
    tableDataSource: [],
    checkDetail: [],
    checkDetailList: [],
    canEdit: false,
  });
  const isLoading = ref(false);
  const { createMessage, createConfirm } = useMessage();

  const [registerCheckDetailModal, { openModal: openCheckDetailModal }] = useModal();

  const [Grid, gridApi] = useVbenVxeGrid({
    gridEvents: {},
    gridOptions: {
      columns: getColumn(state.canEdit),
      virtualXConfig: {
        enabled: false,
      },
      virtualYConfig: {
        enabled: false,
      },
      spanMethod(data) {
        let spanFields: string[] = ['lastTestResult'];
        const { $rowIndex: rowIndex, column, visibleData } = data;
        if (spanFields.includes(column.field)) {
          if (rowIndex === 0) {
            return { rowspan: visibleData.length, colspan: 1 };
          } else {
            return { rowspan: 0, colspan: 0 };
          }
        }
      },
      editConfig: {
        trigger: 'dblclick',
        mode: 'row',
        showAsterisk: true,
      },
      editRules: {
        badName: [
          {
            trigger: 'blur',
            validator: ({ row }) => {
              const ErrorText = handleValidate(row);
              if (ErrorText) {
                return new Error('失败');
              }
            },
          },
        ],
      },
      rowConfig: {
        keyField: '_X_ROW_KEY',
      },
      toolbarConfig: {
        refresh: false,
      },
      pagerConfig: {
        enabled: false,
      },
      i18nConfig: {
        moduleCode: 'IQCApplyColumn',
        transferRange: ['placeholder'],
      },
    },
  });

  function isBadNameEditFn({ row }) {
    const hasItem = Object.values(state.groupbyMap).includes(row.badName);
    return !hasItem;
  }
  // 数据校验
  function handleValidate(row) {
    // const { insideProjectCode, desensitizedDrawingsId } = row;
    // if (!desensitizedDrawingsId) {
    //   return t('common.insiderNumTip');
    // }
    // if (insideProjectCode != getFieldsValue().insideProjectCode) {
    //   return t('commomn.insiderNymErrorTip');
    // }
    return false;
  }
  function getTableActions(row): ActionItem[] {
    return [
      // {
      //   label: '',
      //   icon: 'icon-ym icon-ym-btn-copy',
      //   onClick: handleCopy.bind(null, row),
      // },
      {
        label: '',
        color: 'error',
        icon: 'icon-ym icon-ym-delete',
        onClick: handleDelete.bind(null, row),
      },
    ];
  }

  function handleDelete(row) {
    state.checkDetail = state.checkDetail.filter(item => item !== row.badCode);
    gridApi.grid.remove(row);
  }
  function transformOptionsFn(data) {
    const checkoutItemMap = {};
    data.forEach(item => {
      checkoutItemMap[item.Code] = item.Description;
    });
    return checkoutItemMap;
  }

  function setTableList(data) {
    let list = getDataSource();
    const _list: any[] = [];
    state.checkDetail.forEach((item: any) => {
      if (item && item !== undefined) {
        // 检查是否已存在相同的 badName
        const isDuplicate = list.some(existingItem => existingItem.badName === state.groupbyMap[item]);
        if (isDuplicate) return;
        const _item: any = cloneDeep(COLUMN_TEMPLATE);
        _item._X_ROW_KEY = buildUUID();
        _item.badName = state.groupbyMap[item];
        _item.badCode = item;
        _item.ngNumber = 0;
        _item.testResult = 'OK';
        _item.lastTestResult = 0;
        _list.push(_item);
      }
    });
    gridApi.grid.insert(_list);
  }
  function getCheckDetailFn(data) {
    if (!data) return;
    let checkDetail: any = [];
    data.forEach((o: any) => {
      if (o.checkedArr?.length) {
        checkDetail = checkDetail.concat(o.checkedArr);
      }
    });
    state.checkDetail = checkDetail;
    setTableList(checkDetail);
  }

  async function getGroupbylistFn(checkProjectCode) {
    try {
      const { data, code } = await getGroupbylist({ checkProjectCode });
      if (code === 200) {
        let _list = [];
        data.forEach(o => {
          _list = _list.concat(o.list);
        });
        state.groupbyMap = transformOptionsFn(_list);
        state.groupbyDataSource = data;
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function openCheckDetailModalFn() {
    openCheckDetailModal(true, { dataSource: state.groupbyDataSource, checkDetail: state.checkDetail });
  }
  function selectDetectionItemFn() {
    openCheckDetailModalFn();
  }
  function getDataSource() {
    return cloneDeep(gridApi.grid.getFullData());
  }

  function addColumn(line) {
    const list = getDataSource();
    for (let i = 0; i < line; i++) {
      list.push({
        _X_ROW_KEY: buildUUID(),
        ...COLUMN_TEMPLATE,
      });
    }
    gridApi.grid.reloadData(list);
  }

  async function getApplyordertestitemFn() {
    const { code, data } = await getapplyordertestitem(props.params);
    if (code === 200) {
      if (!data.length) return;
      state.checkDetail = data.map(item => {
        item.testResult = item.testResult || 'OK';
        return item.badCode;
      });
      gridApi.grid.reloadData(data);
      setTimeout(() => {
        lastTableDataJson = JSON.stringify(getParamsFn());
      }, 300);
    }
  }

  function initSaveStatus() {
    lastTableDataJson = curTableDataJson = JSON.stringify(getParamsFn());
  }

  function checkUnsavedDataFn(): Promise<boolean> {
    return new Promise(resolve => {
      const tableData = getParamsFn();
      if (!isEmpty(tableData)) {
        curTableDataJson = JSON.stringify(tableData);
      }
      if (lastTableDataJson === curTableDataJson) {
        return resolve(true);
      }
      createConfirm({
        iconType: 'warning',
        title: t('内容未保存，是否保存？'),
        onOk: async () => {
          const flag: boolean = (await submitFn()) ?? false;
          resolve(flag);
        },
        onCancel: () => {
          resolve(true);
        },
      });
    });
  }

  async function submitFn() {
    const result = await gridApi.validateFn();
    const { code, applyId } = props.params;
    if (!result) return;
    const tableData = await gridApi.getDataSource();
    const reqParams = {
      applyId,
      testProjectCode: code,
      testItems: tableData,
    };
    return await saveTestitemFn(reqParams);
  }
  async function saveTestitemFn(params) {
    isLoading.value = true;
    try {
      const { code, msg } = await saveTestitem(params);
      if (code === 200) {
        createMessage.success(msg);
        initSaveStatus();
        return true;
      }
    } catch (error) {
      createMessage.error(String(error));
    } finally {
      isLoading.value = false;
    }
  }
  function getParamsFn() {
    return gridApi.getDataSource();
  }
  function reloadFn() {
    gridApi.reload();
  }

  onMounted(() => {
    getApplyordertestitemFn();
    const { code } = props.params;
    !state.groupbyDataSource.length && getGroupbylistFn(code);
  });

  defineExpose({
    submitFn, // 提交函数
    checkUnsavedDataFn, // 检查未保存
    getParamsFn,
    reloadFn,
    gridApi,
  });
</script>

<style lang="less">
  .ok-class {
    background: rgb(82 196 26 / 10%);
    color: #52c41a;
    width: 90px;
    font-size: 16px;
    text-align: center;
    line-height: 30px;
    border-radius: 4px;
    position: relative;

    &::before {
      content: '';
      position: absolute;
      left: 20px;
      top: 50%;
      transform: translateY(-50%);
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #52c41a;
    }
  }

  .ng-class {
    background: rgb(255 77 79 / 10%);
    color: #ff4d4f;
    width: 90px;
    font-size: 16px;
    text-align: center;
    line-height: 30px;
    border-radius: 4px;
    position: relative;

    &::before {
      content: '';
      position: absolute;
      left: 20px;
      top: 50%;
      transform: translateY(-50%);
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #ff4d4f;
    }
  }
</style>
