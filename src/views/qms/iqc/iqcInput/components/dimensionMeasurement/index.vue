<template>
  <div class="h-full">
    <Grid v-loading="isLoading">
      <template #toolbar-actions>
        <a-space>
          <a-button type="primary" @click="selectDetectionItemFn">
            {{ t('common.selectDetectionItems') }}
          </a-button>
        </a-space>
      </template>
      <template #edit_checkItem="data">
        <vxe-input v-model="data.row.checkItem" clearable v-if="isChecKItemEditFn(data)"></vxe-input>
        <span v-else>
          {{ data.row.checkItem }}
        </span>
      </template>
      <template #default_checkItem="data">
        {{ data.row.checkItem }}
      </template>
      <template #file="{ row }">
        <UploadItem v-model:file-list="row.fileList" :uploadParams="{ maxCount: 1 }" @change="e => handleUpload(row, e)"></UploadItem>
      </template>
      <template #action="{ row }">
        <TableAction :outside="true" :actions="getTableActions(row)" />
      </template>
    </Grid>
    <CheckDetailModal @register="registerCheckDetailModal" @onSelect="getCheckDetailFn"></CheckDetailModal>
    <CheckInputModal @register="registerCheckInputModal" @onSelect="getCheckDetailFn"></CheckInputModal>
  </div>
</template>
<script setup lang="ts">
  import { ref, reactive, onMounted } from 'vue';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { getColumn, COLUMN_TEMPLATE } from './config';
  import { cloneDeep } from 'lodash-es';
  import { buildUUID } from '/@/utils/uuid';
  import CheckDetailModal from '/@/views/productionDeal/mouldBusiness/inspectionMnt/components/checkDetailModal.vue';
  import CheckInputModal from '../CheckInputModal.vue';
  import { useModal } from '/@/components/Modal';
  import { getGroupbylist } from '/@/api/productionDeal/badCode';
  import { TableAction, ActionItem } from '/@/components/Table';
  import { getapplyordertestitem, getMeasReportData, saveTestitem } from '/@/api/qms/iqc';
  import { useMessage } from '/@/hooks/web/useMessage';
  import UploadItem from '/@/views/qms/mrb/mrbApply/components/mrbApplyPop/UploadItem.vue';
  import { isEmpty } from '/@/utils/is';
  const { t } = useI18n();

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

  interface State {
    title: string;
    groupbyMap: {};
    groupbyDataSource: any[];
    tableDataSource: any[];
    checkDetail: any[];
    checkDetailList: any[];
    fileList: any[];
  }
  const state = reactive<State>({
    title: t('common.visualInspection'),
    groupbyMap: {},
    groupbyDataSource: [],
    tableDataSource: [],
    checkDetail: [],
    checkDetailList: [],
    fileList: [],
  });
  const isLoading = ref(false);
  const { createMessage, createConfirm } = useMessage();
  let lastTableDataJson = ''; // 上一次提交json
  let curTableDataJson = ''; // 当前提交json

  // 检测项
  const [registerCheckDetailModal, { openModal: openCheckDetailModal }] = useModal();
  // 手动录入
  const [registerCheckInputModal, { openModal: openCheckInputModal }] = useModal();

  const [Grid, gridApi] = useVbenVxeGrid({
    // api: params => confirmPageList({ ...params, isConfirm: false }),
    gridEvents: {},
    gridOptions: {
      columns: getColumn(),
      virtualXConfig: {
        enabled: false,
      },
      virtualYConfig: {
        enabled: false,
      },
      mouseConfig: {
        area: false,
      },
      editConfig: {
        trigger: 'dblclick',
        mode: 'row',
        showAsterisk: true,
      },
      editRules: {
        checkItem: [
          {
            required: true,
            trigger: 'blur',
          },
        ],
      },
      toolbarConfig: {
        refresh: false,
      },
      rowConfig: {
        keyField: '_X_ROW_KEY',
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

  function isChecKItemEditFn({ row }) {
    const hasItem = Object.values(state.groupbyMap).includes(row.checkItem);
    return !hasItem;
  }
  function getTableActions(row): ActionItem[] {
    return [
      // {
      //   // label: '手工录入',
      //   icon: 'icon-ym icon-ym-btn-edit',
      //   tooltip: t('手工录入'),
      //   onClick: handleEdit.bind(null, row),
      // },
      {
        // label: '删除',
        color: 'error',
        tooltip: t('common.delText'),
        icon: 'icon-ym icon-ym-delete',
        onClick: handleDelete.bind(null, row),
      },
    ];
  }

  async function handleUpload(row, data) {
    if (!data.length) {
      // 删除逻辑
      gridApi.grid.setRow(row, {
        haveReport: 0,
        reportName: '',
        reportPath: '',
      });
      return;
    }

    const file = data[0];
    const params = {
      name: file.name ? file.name : file.originFileName,
      path: file.fullPath,
    };
    isLoading.value = true;
    try {
      const { data, code } = await getMeasReportData(params);
      if (code === 200) {
        gridApi.grid.setRow(row, {
          haveReport: 1,
          ...data,
          testResult: data.result,
          reportName: params.name,
          reportPath: params.path,
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      isLoading.value = false;
    }
  }
  function handleEdit(row) {
    openCheckInputModal(true, { dataSource: state.groupbyDataSource, checkDetail: state.checkDetail });
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
  function initSaveStatus() {
    lastTableDataJson = curTableDataJson = JSON.stringify(getParamsFn());
  }

  async function getApplyordertestitemFn() {
    const { code, data } = await getapplyordertestitem(props.params);
    if (code === 200) {
      if (!data.length) return;
      state.checkDetail = data.map(item => {
        item.testResult = item.testResult || 'OK';
        return item.badCode;
      });
      data.forEach(item => {
        if (item.reportName) {
          // 上传组件回显需要的格式
          item.fileList = [
            {
              fullPath: item.reportPath,
              originFileName: item.reportName,
              name: item.reportName,
            },
          ];
        }
      });

      gridApi.grid.reloadData(data);
      setTimeout(() => {
        lastTableDataJson = JSON.stringify(getParamsFn());
      }, 300);
    }
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
