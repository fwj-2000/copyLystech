<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    class="full-popup"
    :showOkBtn="false"
    :showCancelBtn="true"
    :cancelButtonProps="{ class: 'my-12px mr-12px' }"
    :title="t('common.detailText')"
    :okText="t('common.submitText')"
    destroyOnClose>
    <template #centerToolbar>
      <a-space :size="12">
        <a-button @click="handleSaveAction('commit')" :loading="loading" type="primary">{{ t('common.submit') }} </a-button>
        <a-button ghost @click="handleSaveAction('save')" :loading="loading" type="primary">{{ t('common.temporarySave') }} </a-button>
      </a-space>
    </template>
    <div class="p-10px h-full">
      <BasicForm @register="registerForm" />
      <Grid style="height: calc(100% - 90px)">
        <template #action>
          <div></div>
        </template>
        <template #toolbar-tools>
          <a-space>
            <ModelConfirmButton
              v-bind="{
                modelConfirm: {
                  title: t('common.tipTitle'),
                  content: t('common.withdrawSelectedData'),
                  onOk: handleRecall.bind(null),
                },
                type: 'primary',
              }">
              <span>{{ t('common.revoke') }}</span>
            </ModelConfirmButton>
            <a-button @click="handleTerminate" type="primary" ghost>{{ t('common.stopText') }} </a-button>
          </a-space>
        </template>
        <!--      <template #status="{ row }">-->
        <!--        <LydcTag theme="gray" v-if="row.Status == 1">待提交 </LydcTag>-->
        <!--        <LydcTag theme="blue" v-if="row.Status == 2">处理中 </LydcTag>-->
        <!--        <LydcTag theme="green" v-if="row.Status == 3">结案 </LydcTag>-->
        <!--        <LydcTag theme="yellow" v-if="row.Status == 4">撤回 </LydcTag>-->
        <!--        <LydcTag theme="yellow" v-if="row.Status == 5">驳回 </LydcTag>-->
        <!--        <LydcTag theme="red" v-if="row.Status == 6">终止 </LydcTag>-->
        <!--      </template>-->
        <template #nodeDetail="{ row }">
          <span class="table-a" @click="handleNodeModal(row)"> {{ t('common.viewDetails') }} </span>
        </template>
      </Grid>
    </div>
    <NodeModal @register="registerNodeModal" />
    <StopModal @register="registerStopModal" />
  </BasicPopup>
</template>
<script setup lang="ts">
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { BasicForm, useForm } from '/@/components/Form';
  import { CURRENT_RM_NODE, QUOTA_TABLE_ROW_DATA, searchFormSchema } from '/@/views/business/quota/config';
  import { ActionItem } from '/@/components/Table';
  import { buildUUID } from '/@/utils/uuid';
  import { reactive, toRaw, nextTick, ref } from 'vue';
  import { getEnablePartNumberApply, getFactoryList } from '/@/api/basicData/productCodeApply';
  import { getUnitListByKeyword } from '/@/api/finance/materialPrice';
  import { getNodeDetail } from '/@/api/engineering/ecn';
  import { useModal } from '/@/components/Modal';
  import { ModelConfirmButton } from '/@/components/Button';
  import { NodeModal, StopModal } from '/@/components/CustomComponents';
  import {
    getQuotationRequirementsList,
    putQuotationRequirements,
    stopQuotationRequirements,
    withdrawQuotationRequirements,
    selectMultiple,
  } from '/@/api/business/quota';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { isEmpty } from '/@/utils/is';
  import { message } from 'ant-design-vue';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { STATUS_OPTIONS } from '/@/utils/status';
  import { getNodeRemark } from '/@/adapter/utils';
  import { splitArrayIntoChunks } from '/@/utils/splitArrayIntoChunks';
  import { getUserInfoList } from '/@/api/permission/user';
  import { getUserListByAccountList } from '/@/api/business/salesForecast';

  const emit = defineEmits(['reload', 'register']);

  const { createMessage } = useMessage();
  const { t } = useI18n();

  const columns = [
    {
      title: '',
      type: 'checkbox',
      field: 'select',
      minWidth: 40,
    },
    {
      title: '状态',
      field: 'Status',
      // slots: { default: 'status' },
      minWidth: 100,
      filters: [],
      cellRender: {
        name: 'Tag',
        options: STATUS_OPTIONS,
      },
    },
    {
      title: '节点记录',
      field: 'nodeDetail',
      slots: { default: 'nodeDetail' },
      minWidth: 100,
    },
    {
      title: '产品内部料号',
      field: 'InsidePartNumber',
      minWidth: 160,
      filters: [{ data: '' }],
      filterRender: { name: 'input' },
      formatter: 'ApiSelect',
      editRender: {
        name: 'ApiSelect',
        props: {
          api: getEnablePartNumberApply,
          showSearch: true,
          apiSearch: {
            show: true,
            searchName: 'keyword',
          },
          params: {
            statusTag: '1,3',
          },
          resultField: 'data.list',
          labelField: 'InsidePartNumber',
          valueField: 'InsidePartNumber',
          immediate: false,
          onChange: (_, data, params) => {
            const {
              $grid: { setRow },
              row,
            } = params;
            const { Factory, FactoryName, Members, TerminalCustomerPartNumber, ImmediateCustomerPartNumber, ProductDesc } = data;
            const project = Members.find(item => item.configType == 'PDTLeader');
            console.log(project, 'project');
            // row.ProjectLeader = project?.memberName;
            setRow(row, {
              ProjectLeaderName: project?.memberName,
              ProjectLeader: project?.memberId,
              Factory,
              FactoryName,
              TerminalCustomerPartNumber,
              ImmediateCustomerPartNumber,
              ProductDesc,
            });
          },
        },
      },
    },
    {
      title: '工厂',
      field: 'Factory',
      formatter: 'ApiSelect',
      minWidth: 120,
      filters: [{ data: '' }],
      filterRender: { name: 'input' },
      editRender: {
        name: 'ApiSelect',
        props: {
          api: getFactoryList,
          showSearch: true,
          apiSearch: {
            show: true,
            searchName: 'keyword',
          },
          resultField: 'data',
          labelField: 'Name',
          valueField: 'Code',
          immediate: true,
        },
      },
    },
    {
      title: '项目量(W)',
      field: 'TotalQty',
      minWidth: 130,
      editRender: {
        name: 'InputNumber',
      },
    },
    {
      title: '备注',
      field: 'LineRemark',
      filters: [{ data: '' }],
      filterRender: { name: 'input' },
      minWidth: 140,
      editRender: {
        name: 'Textarea',
      },
    },
    {
      title: '下一节点处理人(PDT Leader)',
      field: 'ProjectLeader',
      filters: [{ data: '' }],
      filterRender: { name: 'input' },
      minWidth: 150,
      i18nField: 'CommonCol.nextHandler',
      i18nParams: ['PDT Leader'],
      width: 220,
      editRender: {
        autofocus: '.ant-select-selection-search-input',
        name: 'CustomUserSelect',
        props: {
          immediate: false,
          allowClear: true,
          showSearch: true,
        },
      },
    },
    {
      title: '是否保税',
      field: 'IsBonded',
      minWidth: 100,
      editRender: {
        name: 'ASelect',
        props: {
          fieldNames: {
            label: 'fullName',
            value: 'enCode',
          },
          options: [
            { fullName: '是', enCode: 'true' },
            { fullName: '否', enCode: 'false' },
          ],
        },
      },
    },
    {
      title: '成本单位',
      field: 'CostUnit',
      minWidth: 100,
      formatter: 'ApiSelect',
      editRender: {
        name: 'ApiSelect',
        props: {
          api: getUnitListByKeyword,
          // placeholder: '请选择',
          showSearch: true,
          apiSearch: {
            show: true,
            searchName: 'keyword',
          },
          resultField: 'data',
          filterOption: false,
          notFoundContent: null,
          immediate: true,
          useChangeCopy: true,
          labelField: 'Name',
          valueField: 'Code',
          nameFormat: ['Name', '(', 'Code', ')'],
        },
      },
    },
    {
      title: '终端客户料号',
      field: 'TerminalCustomerPartNumber',
      filters: [{ data: '' }],
      filterRender: { name: 'input' },
      minWidth: 120,
      editRender: {
        name: 'Input',
      },
    },
    {
      title: '直接客户料号',
      field: 'ImmediateCustomerPartNumber',
      minWidth: 120,
      editRender: {
        name: 'Input',
      },
    },
    {
      title: '产品描述',
      field: 'ProductDesc',
      filters: [{ data: '' }],
      filterRender: { name: 'input' },
      minWidth: 180,
      editRender: {
        name: 'Input',
        enabled: false,
      },
    },
  ];

  const gridOptions = {
    id: 'business-quota-edit',
    columns,
    showIndexColumn: true,
    editConfig: {
      trigger: 'dblclick',
      mode: 'row',
      beforeEditMethod: handleBeforeEdit,
    },
    pagerConfig: {
      enabled: false,
    },
    scrollY: {
      enabled: true,
      gt: 0,
    },
    rowConfig: {
      keyField: 'Id',
    },
    filterConfig: {
      remote: false,
      filterMethod: filterMethod,
    },
    mouseConfig: {
      area: true, // 是否开启区域选取
    },
    areaConfig: {
      multiple: true, // 是否启用多区域选取功能
    },
    keyboardConfig: {
      isClip: true, // 是否开启复制粘贴
      isEdit: true, // 是否开启任意键进入编辑（功能键除外）
      isDel: true, // 是否开启删除键功能
      isEsc: true, // 是否开启Esc键关闭编辑功能
    },
    keepSource: true,
    data: [
      {
        InsidePartNumber: '',
        Factory: '',
        UnitQty: '1',
        LineRemark: '',
        ProjectLeader: '',
        IsBonded: 'false',
        CostUnit: 'PCS',
        TerminalCustomerPartNumber: '',
        ImmediateCustomerPartNumber: '',
        ProductDesc: '',
      },
    ],
    height: '100%',
    proxyConfig: {
      // ajax: {
      //   query: async ({ page }) => {
      //     return await getExampleTableApi({
      //       page: page.currentPage,
      //       pageSize: page.pageSize,
      //     });
      //   },
      // },
    },
    clipConfig: {
      isPaste: true,
      afterPasteMethod: handleAfterPaster,
      beforePasteMethod: ({ targetAreas }) => {
        return targetAreas.every(({ rows }) => {
          return rows.every((row: any) => handleBeforeEdit({ row } as any));
        });
      },
      // copyMethod: handleCopyMethod,
    },
    showOverflow: true,
    i18nConfig: {
      moduleCode: 'QuotationRequirementsColumn',
    },
    position: 'modal',
    toolbarConfig: {
      refresh: false,
    },
    customConfig: {
      allowVisible: false,
    },
  };

  const [Grid, gridApi] = useVbenVxeGrid({ gridOptions });

  const [registerPopup, { closePopup, changeLoading }] = usePopupInner(init);
  const [registerNodeModal, { openModal: openNodeModal }] = useModal();
  const [registerStopModal, { openModal: openStopModal }] = useModal();
  const [registerForm, { setFieldsValue, validate }] = useForm({
    schemas: searchFormSchema,
    labelWidth: 280,
    layout: 'vertical',
    baseColProps: {
      span: 4,
    },
    i18nConfig: {
      moduleCode: 'QuotationRequirementsColumn',
      transferRange: ['placeholder', 'label'],
    },
  });

  const state = reactive({
    cacheList: [],
    index: 0,
  });

  function init(data) {
    initData(data);
  }

  function handleColumFilter(keyName, unique) {
    gridOptions.columns.forEach(column => {
      if (column.field === keyName) {
        console.log(Array.from(unique.values()));
        column.filters = Array.from(unique.values());
      }
    });
  }

  function initData(data) {
    const { cacheList } = data;
    const datalist = cacheList.map(item => {
      return {
        ...item,
        LineRemark: getNodeRemark(item.nodeRemark, CURRENT_RM_NODE),
        uuid: item.Id,
        editable: true,
        onEdit: true,
        IsBonded: typeof item.IsBonded === 'boolean' ? item.IsBonded + '' : 'false',
      };
    });
    handleColumFilter(
      'Status',
      STATUS_OPTIONS.map(item => ({ label: item.fullName, value: item.id })),
    );
    gridApi.grid.reloadData(datalist);
    // const dataList = cacheList.map(item => {
    //   console.log(item.currentNode);
    //   if (item.currentNode !== 'ApplyNode' || item.Status == 6) {
    //     item.disabled = {
    //       InsidePartNumber: true,
    //       Factory: true,
    //       UnitQty: true,
    //       ProjectLeader: true,
    //       IsBonded: true,
    //       CostUnit: true,
    //       TerminalCustomerPartNumber: true,
    //       ImmediateCustomerPartNumber: true,
    //       ProductDesc: true,
    //       LineRemark: true,
    //     };
    //   } else {
    //     item.disabled = {
    //       TerminalCustomerPartNumber: true,
    //       ImmediateCustomerPartNumber: true,
    //       ProductDesc: true,
    //     };
    //   }
    //   return {
    //     ...item,
    //     uuid: item.Id,
    //     editable: true,
    //     onEdit: true,
    //     IsBonded: typeof item.IsBonded === 'boolean' ? item.IsBonded + '' : 'false',
    //   };
    // });
    // setTableData(dataList);
    setFieldsValue({
      ...cacheList[0],
      UrgencyLevel: Number(cacheList[0].UrgencyLevel),
    });
  }

  // const [
  //   registerTable,
  //   { setTableData, getDataSource, getSelectRowKeys, insertTableDataRecord, deleteTableDataRecord, updateTableDataRecord, updateTableData, reload, redoHeight },
  // ] = useTable({
  //   columns,
  //   rowKey: 'uuid',
  //   immediate: false,
  //   useSearchForm: false,
  //   showTableSetting: false,
  //   pagination: false,
  //   rowSelection: { type: 'checkbox' },
  //   resizeHeightOffset: 10,
  // });

  function filterMethod({ values, cellValue, row, column }) {
    const { field } = column;

    if (field === 'InsidePartNumber' || field === 'LineRemark' || field === 'TerminalCustomerPartNumber' || field === 'ProductDesc') {
      const { data } = column.filters[0];
      return cellValue.includes(data);
    }

    if (field === 'Status') {
      return values.includes(Number.parseInt(cellValue, 10));
    }

    if (field === 'Factory') {
      return row.FactoryName.includes(column.filters[0].data);
    }

    if (field === 'ProjectLeader') {
      return row.ProjectLeaderName.includes(column.filters[0].data);
    }

    return false;
  }

  function handleNodeModal(record) {
    openNodeModal(true, {
      api: getNodeDetail,
      id: record.Id,
      fetchSetting: {
        listField: 'flowNodeInstanceHisList',
      },
    });
  }

  async function handleRecall() {
    changeLoading(true);
    const keys = gridApi.grid.getCheckboxRecords(true).map(item => item.Id);
    const datalist = gridApi.grid.getFullData();
    const { cacheList } = state;
    console.log(cacheList);
    console.log(keys);
    if (isEmpty(keys)) return createMessage.error('请选择数据') && changeLoading(false);
    withdrawQuotationRequirements(keys)
      .then(({ code, msg }) => {
        if (code == 200) {
          createMessage.success(msg);
          const { ApplyCode } = datalist[0];
          getQuotationRequirementsList({
            ApplyCode,
          }).then(({ data }) => {
            initData({ cacheList: data });
          });
          // keys.forEach(key => {
          // const index = datalist.findIndex(item => item.uuid === key);
          // updateTableData(index, 'Status', 4)
          //   const list = cacheList.map(item => {
          //     return {
          //       ...item,
          //       Status: 4,
          //       disabled: {
          //         TerminalCustomerPartNumber: true,
          //         ImmediateCustomerPartNumber: true,
          //         ProductDesc: true,
          //       },
          //       uuid: item.Id,
          //       IsBonded: typeof item.IsBonded === 'boolean' ? item.IsBonded + '' : 'false',
          //       editable: true,
          //       onEdit: true,
          //     };
          //   });
          //   setTableData(list);
          // });
        } else {
          createMessage.error(msg);
        }
      })
      .finally(() => {
        changeLoading(false);
      });
  }

  function getTableActions(index, record): ActionItem[] {
    return [
      {
        label: '',
        color: 'error',
        icon: 'icon-ym icon-ym-delete',
        modelConfirm: {
          onOk: handleChangeTable.bind(null, 'delete', { uuid: record.uuid }),
        },
      },
    ];
  }

  function handleChangeTable(type: 'add' | 'update' | 'copy' | 'delete' | 'addBaseIndex', data) {
    switch (type) {
      case 'add': {
        const dataList = [];
        for (let i = 0; i < data.rows; i++) {
          dataList.push({
            ...QUOTA_TABLE_ROW_DATA,
            uuid: buildUUID(),
          });
        }
        gridApi.grid.insertTableDataRecord(dataList);
        break;
      }

      case 'addBaseIndex': {
        const rowData = {
          ...QUOTA_TABLE_ROW_DATA,
          uuid: buildUUID(),
        };
        gridApi.grid.insertTableDataRecord(rowData, data.index + 1);
        break;
      }

      case 'copy': {
        const copyData = gridApi.getDataSource()[data.index];
        gridApi.grid.insertTableDataRecord(
          {
            ...toRaw(copyData),
            uuid: buildUUID(),
          },
          data.index + 1,
        );
        break;
      }

      case 'delete': {
        gridApi.grid.deleteTableDataRecord(data.uuid);
        break;
      }

      case 'update': {
        break;
      }
    }
  }

  // function handleTerminate() {
  //   console.log(12312312);
  //   // const keys = getSelectRowKeys();
  //   // const datalist = getDataSource();
  //   // keys.forEach(key => {
  //   //   const index = datalist.findIndex(item => item.uuid === key);
  //   //   updateTableData(index, 'Status', 6);
  //   // });
  // }
  function handleTerminate() {
    const idList = gridApi.grid.getCheckboxRecords(true).map(item => item.Id) || [];
    if (idList.length) {
      return (
        openStopModal(true, {
          api: stopQuotationRequirements,
          idList,
          listParamName: 'ids',
          listParamValue: 'idList',
        }) && closePopup()
      );
    }
    message.info(t('common.selectText'));
  }

  const loading = ref<boolean>(false);
  function setLoading(val: boolean) {
    loading.value = val;
    changeLoading(val);
  }

  function handleSaveAction(type) {
    validate().then(async val => {
      if (!val) return;
      const list = gridApi.grid.getFullData();
      const { Purpose, DeliveryDate } = val;
      console.log(val, 'val');
      if (!Purpose) return createMessage.error('请输入报价用途');
      if (!DeliveryDate) return createMessage.error('请输入交货日期');
      setLoading(true);
      const datalist = list
        .filter(item => item.currentNode === 'ApplyNode')
        .map(item => {
          const target = {
            ...val,
            ...item,
            SaveAndCommit: type === 'commit',
          };
          delete target.id;

          return target;
        });
      if (datalist.length === 0) {
        setLoading(false);
        // closePopup()
        return createMessage.error('当前报价单无可提交数据');
      }
      putQuotationRequirements(datalist)
        .then(res => {
          if (res.code === 200) {
            createMessage.success(res.msg);
            // closePopup();
            emit('reload');
            if (type === 'commit') {
              closePopup();
            }
          }
        })
        .finally(() => {
          setLoading(false);
        });
    });
  }

  function handleBeforeEdit({ row, rowIndex, column, columnIndex }) {
    if (row.currentNode !== 'ApplyNode' || row.Status == 6) {
      return false;
    }
    return true;
  }

  async function handleAfterPaster({ targetAreas, pasteCells }) {
    if (!targetAreas.length) return;

    const { cols, rows } = targetAreas[0];

    handleAfterPasterUser(cols, rows, { id: 'ProjectLeader', name: 'ProjectLeaderName' });

    // 找出粘贴的第几列，如粘贴料号，粘贴区域第0列就是料号，对应excel也是第0列
    const targetIndex = cols.findIndex(item => item.field === 'InsidePartNumber');
    if (targetIndex === -1) return;

    const list = pasteCells.map(item => item[targetIndex]);
    const chunks = splitArrayIntoChunks(list, 1000);

    try {
      const res = await Promise.all(
        chunks.map(chunk =>
          selectMultiple({
            pageSize: 1000,
            InsidePartNumbers: chunk,
            statusTag: '1,3',
          }),
        ),
      );

      const data = res.reduce((prev, cur) => prev.concat(cur.data.list), []);

      const datalist = data.map((_item: any, index: number) => {
        const { Factory, FactoryName, Members, TerminalCustomerPartNumber, ImmediateCustomerPartNumber, ProductDesc, InsidePartNumber } = data[index];

        const project = Members.find(m => m.configType === 'PDTLeader');

        return {
          ProjectLeaderName: project?.memberName,
          ProjectLeader: project?.memberId,
          Factory,
          FactoryName: [Factory, FactoryName].filter(Boolean).join('/'),
          InsidePartNumber,
          TerminalCustomerPartNumber,
          ImmediateCustomerPartNumber,
          ProductDesc,
          IsBonded: 'false',
          CostUnit: 'PCS',
          UnitQty: '1',
        };
      });

      if (!datalist.length) {
        createMessage.warning('未识别到有效的料号');
        return;
      }

      await nextTick();

      rows.forEach(row => {
        const target = datalist.find(item => item.InsidePartNumber === row.InsidePartNumber);
        if (target) Object.assign(row, target);
      });
    } catch (e) {
      console.log(e);
      createMessage.error('查询料号信息失败');
    }
  }

  /**
   * 复制黏贴用户处理
   * @param cols 复制的列配置
   * @param rows 复制的行内容
   * @param fieldConfig 赋值字段配置
   */
  function handleAfterPasterUser(cols: Array<{ field: string }>, rows: Array<any>, fieldConfig: { id: string; name: string }) {
    const targetIndex = cols.findIndex((item: any) => item.field === fieldConfig.id);
    if (targetIndex == -1 || rows.length === 0) return false;

    const { idList, accountList } = rows.reduce<{ idList: Array<string>; accountList: Array<string> }>(
      (obj, item: { [key: string]: string }) => {
        const value = item[fieldConfig.id] || '';
        // 如果是纯数字组成，则是id，否则按照accountList计算
        if (value && /^\d+$/.test(value)) {
          obj.idList.push(value);
        } else if (value) {
          const account = value.split('/').pop() || '';
          account && obj.accountList.push(account);
        }
        return obj;
      },
      { idList: [], accountList: [] },
    );

    Promise.all([
      idList.length > 0 ? getUserInfoList([...new Set(idList)]) : Promise.resolve({ data: [] }),
      accountList.length > 0 ? getUserListByAccountList([...new Set(accountList)]) : Promise.resolve({ data: {} }),
    ]).then(res => {
      const userList = [
        ...(res[0]?.data?.list || []),
        ...Object.values(res[1]?.data || {}).map((item: any) => ({ ...item, fullName: item.MergeName, id: item.Id })),
      ];
      rows.forEach((row: any) => {
        const target = userList.find(item => item.id === row[fieldConfig.id] || item.fullName === row[fieldConfig.id]);
        Object.assign(row, { [fieldConfig.id]: target?.id || '', [fieldConfig.name]: target?.fullName || '' });
      });
    });
  }
</script>

<style lang="less" scoped>
  .table-a {
    color: #ff7b00;
    cursor: pointer;
  }
</style>
