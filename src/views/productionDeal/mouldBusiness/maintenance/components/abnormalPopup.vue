<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    :showOkBtn="state.show.submit"
    :okText="t('common.submit')"
    :title="title"
    destroyOnClose
    @ok="() => handleSave(true)"
    class="full-popup">
    <template #centerToolbar>
      <a-button :loading="state.loading" v-if="state.show.submit" @click="handleSave(false)" type="primary" ghost>{{ t('common.temporarySave') }}</a-button>
    </template>
    <div class="h-full requirement-pop p-10px">
      <div class="lydc-content-wrapper-search-box pt-8px mb-16px">
        <Subtitle :title="t('common.baseinfo')" />
        <BasicForm @register="registerForm" />
      </div>
      <Grid style="height: calc(100% - 206px)">
        <template #toolbar-actions>
          <Subtitle :title="t('common.abnormalMoldInfo')" placement="vxe" :extra="{ show: state.type != 'view' }" @add-column="addRow"></Subtitle>
        </template>
        <!-- 异常类型 开始 -->
        <template #exceptionCategory="{ row }">
          {{ row.otherExceptionCategory || row.exceptionCategoryName }}
        </template>
        <template #dynamicSelect="{ row }">
          <DynamicSelect
            v-model:value="row.exceptionCategory"
            v-model:label="row.exceptionCategoryName"
            v-model:options="row.exceptionCategoryOptions"
            v-model:otherContent="row.otherExceptionCategory"
            :other-value="EXCEPTION_CATEGORY_ENUM.其他" />
        </template>
        <!-- 异常类型 结束 -->
        <template #action="{ row, rowIndex }">
          <TableAction :outside="true" :actions="getTableActions(row, rowIndex)" />
        </template>
      </Grid>
    </div>
  </BasicPopup>
</template>

<script lang="ts" setup>
  import { reactive, toRefs, nextTick } from 'vue';
  import { buildUUID } from '/@/utils/uuid';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useUserStore } from '/@/store/modules/user';
  import { cloneDeep, pick } from 'lodash-es';
  import { addMoldBusinessMaintenance, getDetail, temporaryStorage, getMoldNoList } from '/@/api/productionDeal/mouldBusinessMaintenance';
  import { schemas, getEditTableColumn, editRules, TYPE_ENUM, handleMoldNoChange } from './abnormalPopupConfig';
  import { exceptionCategoryOptions, EXCEPTION_CATEGORY_ENUM, DEMAND_TYPE_ENUM, parsePattern, editStatuList } from '../config';
  import { getUserInfoList } from '/@/api/permission/user';
  import { getUserListByAccountList } from '/@/api/business/salesForecast';
  import { formatToDateTime } from '/@/utils/dateUtil';
  import { getShipList as getShippingspacelist } from '/@/api/common/basedata';
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { TableAction, ActionItem } from '/@/components/Table';
  import { BasicForm, useForm } from '/@/components/Form';
  import { Subtitle } from '/@/components/Subtitle';
  import { useVbenVxeGrid, VxeGridProps } from '/@/adapter/vxe-table';
  import DynamicSelect from './dynamicSelect.vue';

  const emits = defineEmits(['register', 'reload']);

  interface State {
    type: `${TYPE_ENUM}`;
    systemId: string;
    applyNo: string;
    show: {
      submit: boolean;
    };
    title: string;
    parentId: string;
    base: any;
    line: number;
    validate: string;
    initFields: any;
    loading: boolean;
    isEdit: boolean;
  }

  const { t } = useI18n();
  const state = reactive<State>({
    type: TYPE_ENUM.新增,
    show: {
      submit: true,
    },
    systemId: '',
    applyNo: '',
    title: t('common.addText'),
    parentId: '',
    base: {},
    line: 1,
    validate: '',
    initFields: {
      exceptionCategory: EXCEPTION_CATEGORY_ENUM.刀钝,
      exceptionCategoryName: '',
      exceptionCategoryOptions,
      demandType: DEMAND_TYPE_ENUM.生产退模,
    },
    loading: false,
    isEdit: true,
  });
  const { title } = toRefs(state);

  const userStore = useUserStore();
  const { createMessage, createConfirm } = useMessage();

  const [registerForm, { /** getFieldsValue, */ setFieldsValue }] = useForm({
    labelWidth: '100%',
    layout: 'vertical',
    baseColProps: {
      span: 6,
    },
    // @ts-ignore
    schemas,
  });

  const gridOptions: VxeGridProps = {
    id: 'productionDeal-mouldBusiness-maintenance-abnormalPopup-edit',
    columns: getEditTableColumn() as any,
    // @ts-ignore
    showIndexColumn: true,
    editConfig: {
      trigger: 'dblclick',
      mode: 'row',
      beforeEditMethod: ({ row }) => !row.status || editStatuList.includes(`${row.status}` as any),
    },
    editRules,
    rowConfig: {
      keyField: '_X_ROW_KEY',
    },
    areaConfig: {
      multiple: true, // 是否启用多区域选取功能
    },
    proxyConfig: {
      enabled: false,
    },
    clipConfig: {
      isPaste: true,
      afterPasteMethod: handleAfterPaster,
    },
    // @ts-ignore
    i18nConfig: {
      moduleCode: 'MoldRepairApplyColumn',
    },
    pagerConfig: {
      enabled: false,
    },
    position: 'modal',
    toolbarConfig: {
      refresh: false,
      zoom: true,
    },
    customConfig: {
      allowVisible: false,
    },
  };
  const [Grid, gridApi] = useVbenVxeGrid({ gridOptions });

  const [registerPopup, { closePopup, changeOkLoading, changeLoading }] = usePopupInner(init);

  async function init(data) {
    changeLoading(true);
    state.initFields.exceptionCategoryName = exceptionCategoryOptions.find(item => item.value === EXCEPTION_CATEGORY_ENUM.刀钝)?.label || '';
    state.systemId = data.id;
    state.applyNo = data.moldRepairApplyNo;
    state.title = data.title || getTitle(state.type) || state.title;
    handleDisabled(data);
    await nextTick(async () => {
      setFieldsValue({
        moldRepairApplyNo: '',
        documentPreparer: `${userStore.getUserInfo.userName}/${userStore.getUserInfo.userAccount}`,
        requestingDepartment: userStore.getUserInfo.departmentName || '--',
        creatorDateTime: '',
      });

      if (state.systemId) {
        await getTableData();
      }
    });
    changeLoading(false);
  }

  // 处理禁用
  function handleDisabled(data) {
    state.type = data.type || TYPE_ENUM.新增;
    state.show.submit = state.type !== TYPE_ENUM.详情;
    if (state.type === TYPE_ENUM.详情) {
      gridApi.setGridOptions({ editConfig: { enabled: false } });
      gridApi.reloadColumn(getEditTableColumn().slice(0, -1));
      return;
    }
    if (state.type === TYPE_ENUM.新增) {
      return addRow(1);
    }
    gridApi.setGridOptions({ editConfig: { enabled: true } });
    gridApi.reloadColumn(getEditTableColumn());
  }

  function getTitle(type?: `${TYPE_ENUM}`) {
    if (type === TYPE_ENUM.新增) {
      return t('common.addText');
    } else if (type === TYPE_ENUM.编辑) {
      return t('common.editText');
    } else {
      return t('common.detailText');
    }
  }

  async function getTableData() {
    return getDetail(state.applyNo).then(res => {
      const dataList = (res.data || []).map(item => {
        // 生产人员 多选 对接口获取到的值做处理
        formatMultiplePerson(item, 'productionStaff', 'productionStaffName');
        // 组长 多选 对接口获取到的值做处理
        formatMultiplePerson(item, 'teamLeader', 'teamLeaderName');
        // 主管 多选 对接口获取到的值做处理
        formatMultiplePerson(item, 'supervisor', 'supervisorName');
        // 退料人 多选 对接口获取到的值做处理
        formatMultiplePerson(item, 'materialReturner', 'materialReturnerName');
        item.inShippingSpaceName = item.inShippingSpaceCode ? `${item.inShippingSpaceCode}/${item.inShippingSpaceName}` : '';
        item.outShippingSpaceName = item.outShippingSpaceCode ? `${item.outShippingSpaceCode}/${item.outShippingSpaceName}` : '';
        item.exceptionCategoryOptions = exceptionCategoryOptions;
        return item;
      });

      if (dataList[0]) {
        const target = dataList[0];
        setFieldsValue({
          moldRepairApplyNo: target.moldRepairApplyNo || '',
          documentPreparer: target.documentPreparerName || target.documentPreparer || '',
          requestingDepartment: target.requestingDepartment || '--',
          creatorDateTime: target.creatorTime ? formatToDateTime(target.creatorTime) : '',
        });
      }

      setTimeout(() => {
        gridApi.grid.reloadData(dataList);
      }, 100);

      if (dataList.every(item => !editStatuList.includes(`${item.status}` as any))) {
        setTimeout(() => {
          gridApi.setGridOptions({ editConfig: { enabled: false } });
          gridApi.reloadColumn(getEditTableColumn().slice(0, -1));
          state.type = TYPE_ENUM.详情;
          state.title = getTitle(state.type) || state.title;
          state.show.submit = false;
        });
      }
    });
  }

  function formatMultiplePerson(row: any, valueField: string, nameField: string) {
    if (!row[valueField]) {
      return false;
    }

    row[valueField] = row[valueField].split(',').filter(Boolean);
    // 人员多选组件的分割符为两个空格
    row[nameField] = row[nameField].split(',').filter(Boolean).join('  ');
  }

  function getTableActions(row: any, index: number): ActionItem[] {
    return [
      {
        label: '',
        icon: 'icon-ym icon-ym-btn-add',
        tooltip: t('common.add1Text'),
        onClick: addRow.bind(null, 1, index),
      },
      {
        label: '',
        icon: 'icon-ym icon-ym-btn-copy',
        tooltip: t('common.copy'),
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

  // 删除数据
  function handleDelete(row: any) {
    createConfirm({
      iconType: 'warning',
      title: t('common.tipTitle'),
      content: t('common.batchDelTip'),
      onOk: () => {
        gridApi.grid.remove(row);
        return Promise.resolve();
      },
    });
  }

  // 增加列
  function addRow(line: number, index = -1) {
    const list: Array<any> = [];
    for (let i = 0; i < line; i++) {
      list.push({
        _X_ROW_KEY: buildUUID(),
        ...cloneDeep(state.initFields),
        occurrenceTime: formatToDateTime(new Date(), 'YYYY-MM-DD HH:mm'),
      });
    }

    nextTick(() => {
      const originList = getDataSource();
      if (index === -1) {
        originList.push(...list);
        gridApi.grid.reloadData(originList);
      } else if (index > -1) {
        originList.splice(index + 1, 0, ...list);
        gridApi.grid.reloadData(originList);
      }
    });
  }

  function handleCopy(row: any) {
    const item = cloneDeep(row);
    item._X_ROW_KEY = buildUUID();
    if (item.id) {
      delete item.id;
    }
    const list = getDataSource();
    const index = list.findIndex(el => el._X_ROW_KEY == row._X_ROW_KEY);
    list.splice(index, 0, item);
    gridApi.grid.reloadData(list);
  }

  function getDataSource() {
    return cloneDeep(gridApi.grid.getFullData());
  }

  // 获取需要传值给后端的有效字段
  function getEnableCols() {
    const fields: Array<string> = [];
    gridApi.grid
      .getColumns()
      .slice(1, -1)
      .forEach((el: any) => {
        if (!el.disabled) {
          fields.push(el.field);
        }
      });
    return fields.concat(['otherExceptionCategory']);
  }

  /** 保存 */
  async function handleSave(isSubmit = false) {
    if (isSubmit && (await gridApi.grid.validate(true))) {
      return createMessage.warning(t('dict.SalesSiteColumn.requiredTip'));
    }

    // 提取出提交字段
    const listField: any = getEnableCols().concat('id');
    const originList = cloneDeep(gridApi.grid.getFullData());
    originList.forEach(el => {
      el.productionStaff = el.productionStaff?.toString();
      el.teamLeader = el.teamLeader?.toString();
      el.supervisor = el.supervisor?.toString();
      el.materialReturner = el.materialReturner?.toString();
    });

    const list = originList.map(el => {
      const obj = pick(el, listField);
      if (obj.occurrenceTime) {
        obj.occurrenceTime = formatToDateTime(obj.occurrenceTime, 'YYYY-MM-DD');
      }
      return obj;
    });

    // const formData = new FormData();
    // list.forEach((el, index) => {
    //   listField.forEach((field: string) => {
    //     if (field === 'occurrenceTime') {
    //       formData.append(`list[${index}].${field}`, formatToDateTime(el[field], 'YYYY-MM-DD HH:mm'));
    //     } else if (el[field]) {
    //       formData.append(`list[${index}].${field}`, el[field]);
    //     }
    //   });
    //   formData.append(`list[${index}].id`, el.id || '');
    // });
    // formData.append('demandType', DEMAND_TYPE_ENUM.生产退模);

    changeLoading(true);
    state.loading = true;
    changeOkLoading(true);
    const api = isSubmit ? addMoldBusinessMaintenance : temporaryStorage;
    api({ demandType: DEMAND_TYPE_ENUM.生产退模, list })
      .then(() => {
        createMessage.success(t('sys.api.operationSuccess'));
        emits('reload');
        closePopup();
      })
      .finally(() => {
        changeLoading(false);
        state.loading = false;
        changeOkLoading(false);
      });
  }

  function handleAfterPaster({ targetAreas, pasteCells }) {
    if (targetAreas.length === 0) {
      return false;
    }
    const { cols, rows } = targetAreas[0];

    // 当黏贴只有一行有数据时，将粘贴的数据填充到每一行
    const pasteCellData = [...pasteCells];
    if (pasteCellData.length === 1 && rows.length > 1) {
      const target = pasteCells[0];
      pasteCellData.length = 0;
      for (let i = 0; i < rows.length; i++) {
        pasteCellData.push(target);
      }
    }

    // 模具料号
    handleAfterPasterMoldNo(cols, rows);

    // 生产人员复制黏贴
    handleAfterPasterUser(cols, rows, { id: 'productionStaff', name: 'productionStaffName' });

    // 组长
    handleAfterPasterUser(cols, rows, { id: 'teamLeader', name: 'teamLeaderName' });

    // 主管
    handleAfterPasterUser(cols, rows, { id: 'supervisor', name: 'supervisorName' });

    // 工程/生技
    handleAfterPasterUser(cols, rows, { id: 'engineeringTechnician', name: 'engineeringTechnicianName' }, false);

    // 退料人
    handleAfterPasterUser(cols, rows, { id: 'materialReturner', name: 'materialReturnerName' });

    // 模具采购员
    handleAfterPasterUser(cols, rows, { id: 'moldPurchaser', name: 'moldPurchaserName' }, false);

    // 异常类别
    handleAfterPasterExceptionCategory(cols, rows, pasteCellData);

    // 调入仓库 复制粘帖处理
    handleAfterPasterShippingSpace(cols, rows, 'inShippingSpaceCode');

    // 调出仓库 复制粘帖处理
    handleAfterPasterShippingSpace(cols, rows, 'outShippingSpaceCode');

    return true;
  }

  /**
   * 复制黏贴用户处理
   * @param cols 复制的列配置
   * @param rows 复制的行内容
   * @param pasteCellData 复制的内容
   * @param fieldConfig 赋值字段配置
   * @param isMultiple 是否多选
   */
  function handleAfterPasterUser(cols: Array<{ field: string }>, rows: Array<any>, fieldConfig: { id: string; name: string }, isMultiple = true) {
    const targetIndex = cols.findIndex((item: any) => item.field === fieldConfig.id);
    if (targetIndex == -1 || rows.length === 0) return false;

    const { idList, accountList } = rows.reduce(
      (obj: { idList: Array<string>; accountList: Array<string> }, item: { [key: string]: string }) => {
        const values: Array<string> = [];

        if (isMultiple && item[fieldConfig.id]) {
          const delimiter = item[fieldConfig.id].includes(',') ? ',' : '  ';
          values.push(...(item[fieldConfig.id] || '').split(delimiter).filter(Boolean));
        } else {
          values.push(item[fieldConfig.id] || '');
        }

        values.forEach(value => {
          // 如果是纯数字组成，则是id，否则按照accountList计算
          if (value && /^\d+$/.test(value)) {
            obj.idList.push(value);
          } else if (value) {
            const account = value.split('/').pop() || '';
            account && obj.accountList.push(account);
          }
        });

        return obj;
      },
      { idList: [], accountList: [] },
    );

    Promise.all([
      idList.length > 0 ? getUserInfoList([...new Set(idList)]) : Promise.resolve({ data: [] }),
      accountList.length > 0 ? getUserListByAccountList([...new Set(accountList as Array<string>)]) : Promise.resolve({ data: {} }),
    ]).then(res => {
      const userList = [
        ...(res[0]?.data?.list || []),
        ...Object.values(res[1]?.data || {}).map((item: any) => ({ ...item, fullName: item.MergeName, id: item.Id })),
      ];
      if (isMultiple) {
        rows.forEach(row => {
          const delimiter = row[fieldConfig.id].includes(',') ? ',' : '  ';
          const values = row[fieldConfig.id].split(delimiter).filter(Boolean);
          const names: Array<string> = [];
          const ids = values.map((value: string) => {
            const target = userList.find(item => item.Id === value || item.MergeName === value);
            target && names.push(target.MergeName);
            return target?.Id || '';
          });
          Object.assign(row, { [fieldConfig.id]: ids || [], [fieldConfig.name]: names.join('  ') });
        });
      } else {
        rows.forEach((row: any) => {
          const target = userList.find(item => item.Id === row[fieldConfig.id] || item.MergeName === row[fieldConfig.id]);
          Object.assign(row, { [fieldConfig.id]: target?.Id || '', [fieldConfig.name]: target?.MergeName || '' });
        });
      }
    });
  }

  /** 异常类别 复制处理 */
  function handleAfterPasterExceptionCategory(cols: Array<{ field: string }>, rows: Array<any>, pasteCells: any) {
    const targetIndex = cols.findIndex((item: any) => item.field === 'exceptionCategory');
    if (targetIndex == -1) return false;

    const dataList = rows.map((item, index) => {
      const [targetValue, otherContent] = parsePattern(pasteCells?.[index]?.[targetIndex] || '');
      const target = exceptionCategoryOptions.find(unit => unit.label === targetValue || unit.value === targetValue);
      return Object.assign(item, {
        exceptionCategory: target?.value || '',
        exceptionCategoryName: (target?.label || '') + (otherContent ? `(${otherContent})` : ''),
        otherExceptionCategory: otherContent,
      });
    });
    if (dataList.length == 0) return false;
    nextTick(() => {
      gridApi.grid.setRow(dataList);
    });
  }

  /**
   * 模具料号 - 赋值黏贴处理
   */
  function handleAfterPasterMoldNo(cols: Array<{ field: string }>, rows: Array<any>) {
    const targetIndex = cols.findIndex((item: any) => item.field === 'moldNo');
    if (targetIndex == -1 || rows.length === 0) return false;

    const tableData = gridApi.getDataSource();
    const list: Array<string> = [];
    rows.forEach(row => {
      const target = tableData.find(item => item.moldNo === row.moldNo && item._X_ROW_KEY !== row._X_ROW_KEY);
      if (target) {
        handleMoldNoChange(target, { row, $grid: gridApi.grid });
      } else {
        list.push(row);
        getMoldNoList({ moldPartNumber: row.moldNo, pageSize: 1 }).then(res => {
          const item = res?.data?.[0] || {};
          handleMoldNoChange(item, { row, $grid: gridApi.grid });
        });
      }
    });
  }

  /**
   * 仓库 复制粘帖处理
   * @param cols
   * @param rows
   * @param field 仓库字段
   */
  function handleAfterPasterShippingSpace(cols: Array<{ field: string }>, rows: Array<any>, field: string) {
    const targetIndex = cols.findIndex((item: any) => item.field === field);
    if (targetIndex == -1 || rows.length === 0) return false;

    const tableData = gridApi.getDataSource();
    const nameField = field.replace('Code', 'Name');
    rows.forEach(row => {
      const target = tableData.find(item => item._X_ROW_KEY !== row._X_ROW_KEY && (item[field] === row[field] || item[nameField] === row[field]));
      if (target) {
        row[field] = target[field];
        row[nameField] = target[nameField];
      } else {
        getShippingspacelist({ shippingSpace: row[field] }).then(res => {
          const list = res?.data?.list || [];
          const data = list.find(item => item.shippingSpaceName === row[field] || item.shippingSpaceCode === row[field]);
          row[field] = data?.shippingSpaceCode || '';
          row[nameField] = data?.shippingSpaceName || '';
        });
      }
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
</style>
