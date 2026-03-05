<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    :showOkBtn="state.type == 'add' || state.type == 'edit'"
    :okText="t('common.submit')"
    :title="title"
    @ok="handleSave"
    @open-change="handleVisibleChange"
    class="full-popup top-0">
    <template #insertToolbar>
      <a-button v-for="(item, i) in funcsBtn" :key="i" :type="item.type" class="ml-3" @click="item.onclick">{{ item.text }}</a-button>
      <a-divider type="vertical" class="ml-10px"></a-divider>
      <div class="toggle-current flex" v-if="state.total > 1">
        <a-button preIcon="icon-ym icon-ym-left" @click="changeCurrent('pre')" :disabled="state.currentIndex < 1"></a-button>
        <div class="state-box m-2">
          <span>{{ state.currentIndex + 1 }}</span> / {{ state.total }}
        </div>
        <a-button preIcon="icon-ym icon-ym-right" @click="changeCurrent('next')" :disabled="state.currentIndex >= state.total - 1"></a-button>
        <a-divider type="vertical" class="ml-10px"></a-divider>
      </div>
    </template>
    <div>
      <div class="lydc-content-wrapper-search-box p-10px" style="border-bottom: 1px solid #dbdbdb">
        <Descriptions v-bind="descOptions">
          <Descriptions.Item label="申请人">
            {{ state.base.applyUserName || getUserInfo.userName }}
          </Descriptions.Item>
          <Descriptions.Item label="申请部门">
            {{ state.base.applyDeptName || getUserInfo.departmentName }}
          </Descriptions.Item>
          <Descriptions.Item label="申请日期">
            {{ state.base.applyDateTime || dayjs().format('YYYY-MM-DD') }}
          </Descriptions.Item>
        </Descriptions>
      </div>
      <BasicTable @register="registerTable" :columns="listColumn" :dataSource="state.tableList">
        <template #bodyCell="{ column, index, record }">
          <template v-if="column.key != 'action'">
            <template v-if="column.compType === 'InputNum'">
              <LydcInputNumber
                v-model:value="state.tempList[index][column.dataIndex]"
                :placeholder="column.placeholder || t('common.inputText')"
                type="number"
                :min="column.min"
                :disabled="column?.disabled || state.type == 'view'" />
            </template>
            <template v-if="column.compType == 'ApiSelect'">
              <ApiSelect
                v-model:value="state.tempList[index][column.dataIndex]"
                :disabled="column.disabled"
                :api="column.api"
                :show-search="true"
                :api-search="{
                  show: true,
                  searchName: column.searchKey || 'keyword',
                }"
                :params="column.params ? column.params(state.tempList[index]) : ''"
                :label-field="column?.fieldNames?.label"
                :value-field="column?.fieldNames?.value"
                :name-format="column.nameFormat || []"
                result-field="data"
                allowClear
                :filter-option="false"
                :immediate="true"
                @change="(id, data) => onChange(index, column, id, data)" />
            </template>
            <template v-if="column.compType == 'Input'">
              <lydc-input
                v-model:value="state.tempList[index][column.dataIndex]"
                :placeholder="column.placeholder || t('common.inputText')"
                :disabled="handleDisabledInput(column, index)" />
            </template>
            <template v-if="column.compType == 'Date'">
              <lydc-date-picker
                :value="state.tempList[index][column.dataIndex]"
                :defaultValue="column.defaultValue"
                :disabled="column?.disabled || state.type == 'view'"
                allowClear
                format="YYYY-MM-DD"
                @change="onChange(index, column, $event)" />
            </template>
            <template v-if="column.compType == 'Select'">
              <lydc-select
                v-if="column.mode == 'searchInput'"
                :value="state.tempList[index][column.dataIndex]"
                :options="state[column.optionsName] || state.searchRsList"
                :fieldNames="column.fieldNames"
                show-search
                :showArrow="false"
                allowClear
                :filter-option="false"
                :not-found-content="null"
                :defaultActiveFirstOption="true"
                :disabled="column?.disabled || state.type == 'view'"
                placeholder="请选择"
                @search="column.searchFunc"
                @focus="column.searchFunc($event.target.value)"
                @change="(id, data) => onChange(index, column, id, data)" />
              <lydc-select
                v-else
                :value="state.tempList[index][column.dataIndex]"
                :options="column.options || state[column.optionsName]"
                :defaultValue="column.defaultValue"
                :disabled="column?.disabled || state.type == 'view'"
                @change="(id, data) => onChange(index, column, id, data)" />
            </template>
            <template v-if="column.compType == 'UserSelect'">
              <lydc-custom-user-select
                v-model:value="state.tempList[index][column.dataIndex]"
                :multiple="false"
                placeholder="选择人员"
                showSearch
                :disabled="column?.disabled || state.type == 'view'"
                @change="(id, data) => onUserIdChange(id, data, index, column)" />
            </template>
          </template>
          <template v-else>
            <TableAction :actions="getTableActions(index, record)" />
          </template>
        </template>
      </BasicTable>
    </div>
  </BasicPopup>
  <Detail @register="registerDetailPop"></Detail>
</template>
<script lang="ts" setup>
  import { reactive, toRefs, computed } from 'vue';
  import dayjs from 'dayjs';
  import { BasicPopup, usePopupInner, usePopup } from '/@/components/Popup';
  import Detail from './Detail.vue';
  import ApiSelect from '/@/components/Form/src/components/ApiSelect.vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { BasicTable, useTable, TableAction, ActionItem } from '/@/components/Table';
  import { cloneDeep } from 'lodash-es';
  import {
    addStorage,
    add,
    batchAudit,
    batchUnAudit,
    replaySubmit,
    getStorageList,
    edited,
    getInsidePartNumberList,
    getAllById,
  } from '/@/api/engineering/sample';
  import { getEngineeringMaterialList } from '/@/api/engineering/info';
  import { debounce } from '/@/utils/debounce';
  import { message, Descriptions } from 'ant-design-vue';
  import { usePermission } from '/@/hooks/web/usePermission';
  import * as mathjs from 'mathjs';
  import { getFactoryList } from '/@/api/business/shippingspace';
  import { getSpaceList, getUnitList } from '/@/api/engineering/sample';

  import { columnOption, descOptions, getUnits, detailColumn } from './config';
  import { useUserStore } from '/@/store/modules/user';
  import { record } from 'zod';
  const userStore = useUserStore();
  const getUserInfo = computed(() => userStore.getUserInfo || {});

  const emits = defineEmits(['register', 'refresh']);

  interface State {
    type: 'view' | 'add' | 'edit' | 'audit';
    total: number;
    currentIndex: number;
    ids: [];
    base: any;
    listQuery: any;
    id: string;
    title: string;
    isDevPlatform: boolean;
    tableList: any[];
    tempList: any[];
    searchRsList: any[];
    factoryList: any[];
    spaceList: any[];
    stageList: any[];
    materiaList: any[];
    unitList: any[];
  }

  const { t } = useI18n();
  const state = reactive<State>({
    type: 'add',
    total: 0,
    currentIndex: 0,
    base: {
      applyUserName: '',
      applyDateTime: '',
      applyDeptName: '',
    },
    listQuery: {
      category: 'Web',
      keyword: '',
      type: '',
      enabledMark: '',
    },
    id: '',
    ids: [],
    title: '',
    isDevPlatform: false,
    tableList: [],
    tempList: [],
    searchRsList: [],
    factoryList: [],
    spaceList: [],
    unitList: [],
    materiaList: [],
    stageList: [
      {
        id: 1,
        fullName: '量试',
      },
      {
        id: 2,
        fullName: '量产',
      },
    ],
  });

  const { createMessage } = useMessage();

  const funcsBtn = computed(() => {
    if (state.type == 'add') {
      return [
        {
          text: '暂存',
          onclick: handleStorage,
        },
        {
          text: '插入一行数据',
          type: 'primary',
          onclick: addColumn,
        },
      ];
    } else {
      if (state.type == 'edit') {
        return [
          {
            text: '插入一行数据',
            type: 'primary',
            onclick: addColumn,
          },
        ];
      }
      // 未审核/已撤回
      if (state.base.status == '1') {
        return [
          {
            text: t('common.audit'),
            type: 'primary',
            auth: 'btn_review',
            onclick: handleAudit,
          },
          {
            text: t('common.editText'),
            auth: '',
            onclick: toEdit,
          },
        ];
      }
      if (state.base.status == '6') {
        return [
          {
            text: t('common.editText'),
            auth: '',
            onclick: toEdit,
          },
        ];
      }
      // 审核
      if (state.base.status == '2') {
        return [
          {
            text: '撤回',
            auth: 'btn_review',
            onclick: handleCallBack,
          },
        ];
      }
      // 处理中
      if (state.base.status == '3') {
        return [
          {
            text: t('common.submit'),
            type: 'primary',
            auth: '',
            onclick: handleResult,
          },
        ];
      }
    }
    return [];
  });
  const listColumn = computed(() => {
    if (state.type == 'add' || state.type == 'edit') {
      return menuTableColumns;
    }
    return detailColumn;
  });
  function getTableActions(index, Record): ActionItem[] {
    if (state.type == 'add' || state.type == 'edit') {
      return [
        {
          icon: 'icon-ym icon-ym-btn-copy',
          onClick: handleCopy.bind(null, index),
        },
        {
          color: 'error',
          icon: 'icon-ym icon-ym-delete',
          disabled: state.tableList.length <= 1,
          modelConfirm: {
            onOk: handleDelete.bind(null, index),
          },
        },
      ];
    }
    return [
      {
        icon: 'icon-ym icon-ym-edit',
        onClick: handleEdit.bind(null, Record.id, index),
      },
    ];
  }
  // 状态值流转
  // 申请：
  //    功能：暂存、提交、插入一行数据
  //    操作栏：删除、复制
  // 详情：列表字段比申请多了回复信息
  //   子模块：已确认/已入库/已审核
  //      功能：无
  //      操作栏：详情(进子详情)
  //   子模块：处理中
  //      功能：提交
  //      操作栏：编辑(进子详情)
  //   子模块：未审核
  //      功能：审核/上下
  //      操作栏：无
  //   子模块：已审核
  //      功能：撤回/上下
  //      操作栏：无

  // 表格配置
  const fetchDataBySearch = debounce(v => {
    getInsidePartNumberList(v)
      .then(res => {
        state.searchRsList = res?.data || [];
      })
      .catch(err => {
        state.searchRsList = [];
      });
  }, 500);
  // 材料清单
  const fetchMateriaBySearch = debounce(v => {
    getEngineeringMaterialList(v)
      .then(res => {
        state.materiaList = res?.data || [];
      })
      .catch(err => {
        state.materiaList = [];
      });
  }, 500);
  const menuTableColumns: any[] = [
    {
      title: '成品内部料号',
      dataIndex: 'insidePartNumber',
      width: 240,
      maxLength: 24,
      compType: 'Select',
      mode: 'searchInput',
      fieldNames: {
        value: 'InsidePartNumber',
        label: 'InsidePartNumber',
      },
      searchFunc: v => {
        fetchDataBySearch(v);
      },
    },
    {
      title: '生产工厂',
      dataIndex: 'factoryId',
      width: 200,
      compType: 'ApiSelect',
      api: getFactoryList,
      searchKey: 'factoryCode',
      fieldNames: {
        value: 'Code',
        label: 'Name',
      },
      nameFormat: ['Code', '/', 'Name'],
    },
    {
      title: '申请仓位',
      dataIndex: 'applyShippingSpaceId',
      width: 220,
      compType: 'ApiSelect',
      api: getSpaceList,
      params: record => {
        return { factoryId: record.factory };
      },
      searchKey: 'shippingSpace',
      fieldNames: {
        value: 'id',
        label: 'shippingSpaceCode',
      },
      nameFormat: ['shippingSpaceCode', '/', 'shippingSpaceName'],
    },
    { title: '责任工程师', dataIndex: 'personEngineeringId', width: 160, compType: 'UserSelect' },
    { title: '采购', dataIndex: 'purchaseUserId', width: 160, compType: 'UserSelect' },
    {
      title: '材料内部料号',
      dataIndex: 'innerMaterialNumber',
      width: 200,
      compType: 'Select',
      mode: 'searchInput',
      fieldNames: {
        value: 'materialCode',
        label: 'materialCode',
      },
      searchFunc: v => {
        fetchMateriaBySearch(v);
      },
      optionsName: 'materiaList',
    },
    { title: '原厂商型号', dataIndex: 'innerExternalNumber', width: 120, compType: 'Input', placeholder: '自动带入' },
    { title: '产品尺寸长(mm)', dataIndex: 'productSizeLong', width: 140, compType: 'InputNum', min: 0 },
    { title: '产品尺寸宽(mm)', dataIndex: 'productSizeWide', width: 140, compType: 'InputNum', min: 0 },
    { title: '应用描述', dataIndex: 'description', width: 140, compType: 'Input' },
    { title: '申请样品规格', dataIndex: 'specifications', width: 120, compType: 'Input' },
    { title: '申请数量', dataIndex: 'finishedProductQty', width: 120, compType: 'InputNum', min: 0 },
    { title: '计量单位', dataIndex: 'measurementUnitId', width: 120, compType: 'Select', optionsName: 'unitList' },
    { title: '成品打样数量（KPCS）', dataIndex: 'qty', width: 180, compType: 'InputNum', min: 0 },
    { title: '所处阶段', dataIndex: 'currentStage', width: 120, compType: 'Select', optionsName: 'stageList' },
    { title: '要求到样日期', dataIndex: 'requestArrivalDate', width: 140, compType: 'Date', format: 'date|YYYY/MM/DD' },
    { title: '备注', dataIndex: 'remark', width: 120, compType: 'Input' },
    {
      title: '终端客户',
      dataIndex: 'terminalCustomerCode',
      width: 160,
      customRender: ({ index }) => {
        const { terminalCustomerCode, terminalCustomerName } = state.tempList[index];
        if (terminalCustomerCode && terminalCustomerName) {
          return `${terminalCustomerCode}/${terminalCustomerName}`;
        }
        return t('common.autoCarry');
      },
    },
    {
      title: '内部项目代码',
      dataIndex: 'insideProjectCode',
      width: 200,
      customRender: ({ index }) => {
        const { insideProjectCode } = state.tempList[index];
        return insideProjectCode || t('common.autoCarry');
      },
    },
    {
      title: '直接客户',
      dataIndex: 'immediateCustomerCode',
      customRender: ({ index }) => {
        const { immediateCustomerCode, immediateCustomerName } = state.tempList[index];
        if (immediateCustomerCode && immediateCustomerName) {
          return `${immediateCustomerCode}/${immediateCustomerName}`;
        }
        return t('common.autoCarry');
      },
    },
    {
      title: '产品面积(m²)',
      dataIndex: 'productArea',
      width: 200,
      disabled: true,
      customRender: ({ index }) => {
        const { productSizeLong, productSizeWide } = state.tempList[index];
        if (productSizeWide && productSizeLong) {
          return (state.tempList[index].WasteWeight = mathjs.format((productSizeLong * productSizeWide) / 1000000, { precision: 7 }));
        }
        return '自动计算';
      },
    },
  ];
  function handleDelete(index) {
    state.tableList.splice(index, 1);
    state.tempList.splice(index, 1);
  }
  function handleCopy(index) {
    state.tableList.push(cloneDeep(state.tempList[index]));
    state.tempList.push(cloneDeep(state.tempList[index]));
  }
  function handleEdit(id, index) {
    openPopup(true, {
      id,
      index,
      ids: state.tableList.map(el => {
        return el.id;
      }),
    });
  }
  // 处理input框的置灰
  function handleDisabledInput(column, index) {
    if (column?.disabled) {
      return true;
    }
    if (state.type == 'view') {
      return true;
    }
    // 当前行的材料料号有值时，不允许编辑
    if (column.dataIndex == 'innerExternalNumber' && state.tempList[index].innerMaterialNumber) {
      return true;
    }
  }
  function addColumn() {
    state.tableList.push({
      ...cloneDeep(columnOption),
    });
    state.tempList.push({
      ...cloneDeep(columnOption),
    });
  }

  function toEdit() {
    state.tableList = cloneDeep(state.base.sampleApplyInformationOutputs);
    state.tempList = cloneDeep(state.tableList);
    state.type = 'edit';
  }

  const [registerPopup, { closePopup, changeOkLoading, changeLoading }] = usePopupInner(init);
  const [registerDetailPop, { openPopup }] = usePopup();
  const [registerTable] = useTable({
    immediate: false,
    pagination: false,
    showTableSetting: false,
    striped: true,
    showIndexColumn: true,
    resizeHeightOffset: 30,
    actionColumn: {
      width: 120,
      title: t('common.action'),
      dataIndex: 'action',
    },
  });

  const title = computed(() => {
    return state.type == 'add' ? '新增样品申请' : (state.type == 'edit' ? '编辑' : '查看' + (state.base.applyNumber || '')) + '样品详情';
  });
  async function init(data) {
    changeLoading(true);
    state.id = data.id;
    state.ids = data.ids || [];
    state.type = data.type || 'add';
    state.title = data.title + '样品申请';
    state.listQuery.category = 'Web';

    if (data.ids) {
      state.total = data.ids.length;
      state.currentIndex = data.index || 0;
      state.id = data.ids[state.currentIndex];
    }

    // 设置表格显示初始值
    if (state.type === 'add') {
      // 获取暂存数据，若无，自动填充第一行
      const r = await getStorageList();
      let _list = [];
      if (r.code == 200) {
        const { data } = r;
        if (data && data.sampleApplyInformationOutputs) {
          _list = data.sampleApplyInformationOutputs;
        }
      }
      state.tableList = _list.length
        ? _list
        : [
            {
              ...cloneDeep(columnOption),
            },
          ];
    } else {
      getDetail();
    }
    state.tempList = cloneDeep(state.tableList);
    changeLoading(false);

    state.unitList = await getUnits();
  }

  async function getDetail(id?: string) {
    const _id = id || state.id;
    const r = await getAllById(_id);
    if (r.code == 200) {
      state.base = r.data;
      state.tableList = r.data.sampleApplyInformationOutputs;
    }
  }

  async function onChange(index, column, e, data?: any) {
    if (column.compType == 'Input') {
      state.tempList[index][column.dataIndex] = e.target.value;
    } else if (column.compType == 'Select') {
      if (column.mode == 'searchInput') {
        if (column.dataIndex == 'insidePartNumber') {
          const { TerminalCustomerCode, TerminalCustomerName, ImmediateCustomerCode, ImmediateCustomerName, InsideProjectCode, PersonId, Factory } = data;
          state.tempList[index] = {
            ...state.tempList[index],
            [`${column.dataIndex}`]: e,
            terminalCustomerCode: TerminalCustomerCode,
            terminalCustomerName: TerminalCustomerName,
            immediateCustomerName: ImmediateCustomerName,
            immediateCustomerCode: ImmediateCustomerCode,
            insideProjectCode: InsideProjectCode,
            personEngineeringId: PersonId,
            factoryId: Factory,
          };
        } else {
          // 材料料号
          state.tempList[index][column.dataIndex] = e;
          state.tempList[index].innerExternalNumber = data.originalModelNumber;
        }
      } else {
        state.tempList[index][column.dataIndex] = e;
      }
    } else if (column.compType == 'Date') {
      state.tempList[index][column.dataIndex] = e;
    }
    switch (column.dataIndex) {
      case 'measurementUnitId':
        const { DotNumber } = data;
        state.tempList[index].DotNumber = DotNumber;
        break;
      // case 'applyShippingSpaceId':
      //   const { factoryId } = data;
      //   state.tempList[index].factoryId = factoryId;
      //   break;
      case 'factoryId':
        const { ManagerName, Id } = data;
        console.log(data);
        state.tempList[index].Factory = Id;
        state.tempList[index].SellCorporation = ManagerName;
        handleFactoryIdChange(index);
        break;
    }
  }

  /**
   * 根据工厂id获取人员id
   * @description 当某一行数据的`工厂id`发生变化时，判断当前行数据是否存在 `成品内部料号`，如果存在根据`成品内部料号`和`工厂id`获取人员id，并赋值给`人员id`
   * @param index 数据在临时列表(state.tempList)中的索引
   */
  function handleFactoryIdChange(index: number) {
    const { insidePartNumber, Factory: factoryId } = state.tempList[index];
    if (insidePartNumber && factoryId) {
      getInsidePartNumberList(insidePartNumber, factoryId)
        .then(res => {
          const data = res?.data?.[0];
          state.tempList[index].personEngineeringId = data && data.PersonId ? data.PersonId : '';
        })
        .catch(() => {
          state.tempList[index].personEngineeringId = '';
        });
    }
  }

  function onUserIdChange(id, data, index, column) {
    if (!id) {
      state.tempList[index][column.dataIndex] = '';
      state.tempList[index][column.extraKey] = '';
      return;
    }
    state.tempList[index][column.dataIndex] = id || '';
    column?.extraKey && (state.tempList[index][column.extraKey] = data?.fullName || '');
  }
  const { hasBtnP } = usePermission();
  async function handleSave() {
    changeOkLoading(true);
    const params: any = {
      isOperation: hasBtnP('btn_review') ? 1 : 0,
    };
    let r;
    try {
      if (state.type == 'edit') {
        params.sampleApplyInformationUpInputs = cloneDeep(state.tempList);
        r = await edited(state.id, params);
      } else {
        params.sampleApplyInformationCrs = cloneDeep(state.tempList);
        r = await add(params);
      }
      if (r.code == 200) {
        changeOkLoading(false);
        closePopup();
        createMessage.success(r?.msg || '提交成功');
      }
    } catch (error) {
      changeOkLoading(false);
    }
  }

  function handleStorage() {
    addStorage({
      sampleApplyInformationCrs: state.tempList,
    })
      .then(res => {
        changeOkLoading(false);
        closePopup();
        createMessage.success(res?.msg || '暂存成功');
      })
      .catch(err => {
        changeOkLoading(false);
      });
  }

  // 提交处理结果
  function handleResult() {
    replaySubmit(state.id).then(res => {
      if (res.code == 200) {
        message.success(t('sys.api.operationSuccess'));
        closePopup();
      }
    });
  }

  // 撤回
  function handleCallBack() {
    batchUnAudit([state.id]).then(res => {
      message.success(res.msg);
      closePopup();
    });
  }
  // 审核
  function handleAudit() {
    batchAudit([state.id]).then(res => {
      message.success(res.msg);
      closePopup();
    });
  }
  function changeCurrent(type) {
    if (type == 'pre') {
      state.currentIndex--;
    } else {
      state.currentIndex++;
    }
    state.id = state.ids[state.currentIndex];
    getDetail();
  }

  function handleVisibleChange(v) {
    if (!v) {
      emits('refresh');
    }
  }
</script>

<style lang="less">
  :deep(.lydc-basic-table-action button i) {
    font-size: 18px;
  }

  :deep(.ant-steps-item-title) {
    width: 100%;
  }

  .popup-inner {
    padding: 10px;
  }
</style>
