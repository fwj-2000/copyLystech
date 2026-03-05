<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    :showOkBtn="state.showEditable"
    :showCancelBtn="true"
    :cancelButtonProps="{ class: 'mr-12px' }"
    :okText="t('common.submitText')"
    :title="t('common.engineMake')"
    destroyOnClose
    @ok="handleSubmit"
    class="full-popup">
    <template #insertToolbar>
      <div class="toggle-current flex" v-if="state.total > 1">
        <a-button preIcon="icon-ym icon-ym-left" @click="handleChangePage('pre')" :disabled="state.currentIndex < 1"></a-button>
        <div class="state-box m-2">
          <span>{{ state.currentIndex + 1 }}</span> / {{ state.total }}
        </div>
        <a-button preIcon="icon-ym icon-ym-right" @click="handleChangePage('next')" :disabled="state.currentIndex >= state.total - 1"></a-button>
        <a-divider type="vertical" class="ml-10px"></a-divider>
      </div>
      <template v-if="state.showEditable">
        <a-button class="mr-3" @click="handleHistory">{{ t('common.quotaHistory') }}</a-button>
        <a-button class="mr-3" @click="calTotal">{{ t('common.calText') }}</a-button>
        <!-- <a-button class="mr-3" @click="handleSubmit('storage')" type="primary" ghost>{{ t('common.temporarySave') }}</a-button> -->
      </template>
    </template>
    <template #centerToolbar>
      <template v-if="state.showEditable">
        <a-button type="primary" ghost @click="handleSubmit('storage')">{{ t('common.temporarySave') }}</a-button>
      </template>
    </template>
    <div ref="container" class="container-box p-10px">
      <div ref="bomContent" class="bom-content">
        <div class="drag-box">
          <div ref="divider" class="drag-ctrl"></div>
        </div>
        <ScrollContainer style="background: #fafafa">
          <div class="bom-header">
            <div class="title">
              <div style="cursor: pointer" @click="handleUnpack">
                <i v-if="isPack" class="icon-ym icon-ym-nav-prev icon-color" />
                <i v-else class="icon-ym icon-ym-nav-next icon-color" />
              </div>
              <Subtitle :title="t('common.Bom')" />
            </div>
            <div class="bom-list">
              <BasicTree
                :treeData="state.bomList"
                :checkable="false"
                :showLine="true"
                :defaultExpandAll="true"
                @dblclick="handleDblClick"
                :clickRowToExpand="true"
                :fieldNames="{
                  children: 'materials',
                  title: 'innerMaterialNumber',
                  key: 'id',
                }"></BasicTree>
            </div>
          </div>
        </ScrollContainer>
      </div>
      <div ref="mainContent" class="main-content">
        <div ref="navBox" class="main-nav" @click="handleScroll">
          <div class="nav-item active" data-index="base-info">{{ t('common.baseinfo') }} </div>
          <div class="nav-item" data-index="process-flow">{{ t('common.process') }} </div>
          <div class="nav-item" data-index="material">{{ t('common.metaria') }} </div>
          <div class="nav-item" data-index="packaging">{{ t('common.packageMetaria') }}</div>
        </div>
        <ScrollContainer ref="mainScroll" style="margin-top: 39px; padding-bottom: 40px">
          <a-card class="lydc-content-wrapper-search-box mb-16px" style="border-bottom: 1px solid #dbdbdb">
            <a-row :gutter="20">
              <a-col :span="18">
                <Subtitle :title="t('common.baseinfo')" id="base-info" />
                <BasicForm @register="registerBaseInfoForm" @field-value-change="(e, data) => handleBaseChange(e, data)">
                  <template #drawing>
                    <span @click="handleDrawView" class="link-a">{{ t('common.searchDetail') }}</span>
                  </template>
                </BasicForm>
              </a-col>
              <a-col :span="6">
                <a-button type="link" @click="handleAddTechnology">
                  <template #icon>
                    <PlusOutlined />
                  </template>
                  {{ t('common.stepNumber') }}
                </a-button>
                <ScrollContainer class="technology-box">
                  <a-row :gutter="[5, 0]" v-for="(item, index) in technologyList" :key="index" class="item-box">
                    <a-col :span="13">
                      <span :class="index == 0 ? 'span-required' : ''">{{ index + 1 }}、{{ index === 0 ? t('common.mainStep') : t('common.step') }}(MM)</span>
                      <lydc-input-number v-model:value="item.stepDistance" :placeholder="t('common.step')" />
                    </a-col>
                    <a-col :span="8">
                      <span :class="index == 0 ? 'span-required' : ''">{{ t('common.modules') }}</span>
                      <lydc-input-number v-model:value="item.modulus" :placeholder="t('common.modules')" />
                    </a-col>
                    <a-col :span="3">
                      <a-button type="link" style="width: 30px" @click="handleDeleteTechnology(index)">
                        <DeleteOutlined />
                      </a-button>
                    </a-col>
                  </a-row>
                </ScrollContainer>
              </a-col>
            </a-row>
          </a-card>
          <a-card class="lydc-content-wrapper-search-box" style="border-bottom: 1px solid #dbdbdb; margin-top: 10px">
            <div class="process-flow">
              <div style="display: flex; flex-direction: row; align-items: center">
                <Subtitle :title="t('common.process')" id="process-flow" />
                <!-- <BasicForm @register="registerTechnologyTableForm"></BasicForm> -->
              </div>
              <AddCustomRows :defaultValue="1" @submit="handleChangeTechnology('add', { rows: $event })" />
            </div>
            <div>
              <BasicTable @register="registerTechnologyEditTable">
                <template #bodyCell="{ column, record, index }">
                  <template v-if="column.dataIndex === 'action'">
                    <TableAction :actions="getTechnologyTableActions(index, record)" />
                  </template>
                </template>
                <template #summary>
                  <a-table-summary fixed="bottom">
                    <a-table-summary-row>
                      <a-table-summary-cell :col-span="2">{{ t('component.table.summary') }}: </a-table-summary-cell>
                      <a-table-summary-cell>
                        {{
                          getTechnologyDataSource()
                            .reduce((pre, next) => {
                              pre += Number(next.lineAdjustmentTime || 0);
                              return pre;
                            }, 0)
                            .toFixed(2)
                        }}H
                      </a-table-summary-cell>
                      <a-table-summary-cell>
                        {{
                          getTechnologyDataSource()
                            .reduce((pre, next) => {
                              pre += Number(next.defectiveRate || 0);
                              return pre;
                            }, 0)
                            .toFixed(2)
                        }}%
                      </a-table-summary-cell>
                    </a-table-summary-row>
                  </a-table-summary>
                </template>
              </BasicTable>
            </div>
          </a-card>
          <a-card class="lydc-content-wrapper-search-box" style="border-bottom: 1px solid #dbdbdb; margin-top: 10px">
            <div class="material">
              <Subtitle :title="t('common.metaria')" id="material" />
              <AddCustomRows :defaultValue="1" @submit="handleChangeMaterial('add', { rows: $event })" />
            </div>
            <div>
              <BasicTable @register="registerMaterialEditTable" @edit-change="handleMetarialChange">
                <template #bodyCell="{ column, record, index }">
                  <template v-if="column.dataIndex === 'stepDistanceNumber'">
                    <a-select
                      v-model:value="record[column.dataIndex]"
                      @change="
                        e => {
                          handleStepChange(e, record);
                        }
                      ">
                      <a-select-option v-for="(item, index) in technologyList" :key="index" :value="index + 1">
                        {{ `${index + 1}` }}
                      </a-select-option>
                    </a-select>
                  </template>
                  <template v-if="column.dataIndex === 'processNumber'">
                    <a-select v-model:value="record[column.dataIndex]" :allow-clear="true">
                      <a-select-option v-for="(_, index) in state.technologyTableList" :key="index" :value="_.value">
                        {{ index + 1 + '、' + _.label }}
                      </a-select-option>
                    </a-select>
                  </template>
                  <template v-else-if="column.dataIndex === 'action'">
                    <TableAction :actions="getMaterialTableActions(index, record)" />
                  </template>
                </template>
              </BasicTable>
            </div>
          </a-card>
          <a-card class="lydc-content-wrapper-search-box p-12px" style="border-bottom: 1px solid #dbdbdb; margin-top: 10px">
            <Package ref="packageRef" />
          </a-card>
        </ScrollContainer>
      </div>
    </div>

    <DrawMViewodal @register="registerDrawViewModal" />
    <Upgrade @register="registerQuotaModal" @submit="handleQuotaModal" />
  </BasicPopup>
</template>
<script setup lang="ts">
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { Subtitle } from '/@/components/Subtitle';
  import BasicTree from '/@/components/Tree/src/BasicTree.vue';
  import { ScrollContainer } from '/@/components/Container';
  import { nextTick, reactive, ref, toRaw, toRefs, unref } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form';
  import {
    getBaseInfoFormSchema,
    getMaterialColumns,
    materialRowData,
    technologyRowData,
    calUtilizationRate,
    packageFieldMap,
    packageCoreFieldMap,
  } from '../config';
  import { cloneDeep, includes } from 'lodash-es';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { AddCustomRows } from '/@/components/AddCustomRows';
  import BasicTable from '/@/components/Table/src/BasicTable.vue';
  import { ActionItem, BasicColumn, TableAction, useTable } from '/@/components/Table';
  import { buildUUID } from '/@/utils/uuid';
  import { getProcessAllList } from '/@/api/engineering/quotatios';
  import { getViewportOffset } from '/@/utils/domUtils';
  import { useModal } from '/@/components/Modal';
  import {
    getBomList,
    getBomDetail,
    storageBomDetail,
    saveBomDetail,
    delStep,
    delProcess,
    delPackMaterial,
    delMaterial,
    getRecordTransfer,
  } from '/@/api/engineering/info';
  import DrawMViewodal from '/@/views/business/quantitation/assess/components/DrawViewModal.vue';
  import { PlusOutlined, DeleteOutlined } from '@ant-design/icons-vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import Package from '/@/views/engineering/pcc/pccApply/components/Package.vue';
  import { message } from 'ant-design-vue';
  import Upgrade from '/@/views/engineering/pcc/pccApply/components/HistoryModal.vue';
  import { isNullOrUnDef } from '/@/utils/is';

  const { createMessage } = useMessage();
  const emits = defineEmits(['reload']);

  function buildId() {
    return '_id' + buildUUID();
  }

  /**
   * @description: 判断当前状态，是否为可编辑
   * @param {number} status
   * @return {boolean}
   * */
  function handleEditStatus(status?: number): boolean {
    if (isNullOrUnDef(status)) {
      state.showEditable = true;
      return true;
    }

    const editableList = [3, 4, 9];
    const isEditable = includes(editableList, status);

    state.showEditable = isEditable;
    return isEditable;
  }

  const [registerPopup, { closePopup, changeLoading }] = usePopupInner(init);
  const [registerQuotaModal, { openModal: openQuotaModal }] = useModal();
  const [registerDrawViewModal, { openModal: openDrawViewModal }] = useModal();

  const divider = ref<any>(null);
  const container = ref<any>(null);
  const bomContent = ref<any>(null);
  const mainContent = ref<any>(null);
  const navBox = ref<any>(null);
  const mainScroll = ref<any>(null);
  const packageRef = ref();

  let isDragging = false;

  const technologyItem = {
    stepDistance: '',
    modulus: '',
    number: 0,
    level: 0,
  };
  const state = reactive<any>({
    bomList: [],
    navIndex: 0,
    isPack: true,
    technologyList: [cloneDeep(technologyItem)],
    moldGenerate: '',
    toBeGenerateList: [],
    total: 0,
    currentIndex: 0,
    ids: [],
    id: '',
    type: 'add',
    technologyTableList: [],
    mainProcess: '',
    base: {},
    showEditable: false,
    isQuota: false,
  });

  const { t } = useI18n();

  const { isPack, technologyList } = toRefs(state);

  const [
    registerBaseInfoForm,
    {
      setFieldsValue: setBaseInfoFieldsValue,
      validateFields: validateBaseInfoFields,
      updateSchema: updateBaseInfoSchema,
      getFieldsValue: getBaseInfoFieldsValue,
      setProps: setBaseInfoProps,
    },
  ] = useForm({
    schemas: getBaseInfoFormSchema(),
    layout: 'vertical',
    labelWidth: 120,
    baseColProps: {
      span: 6,
    },
    i18nConfig: {
      moduleCode: 'EngineeringInformationColumn',
      transferRange: ['label', 'placeholder'],
    },
  });
  // 材料
  const [
    registerMaterialEditTable,
    {
      setTableData: setMaterTableData,
      getDataSource: getMaterialDataSource,
      updateTableDataRecord: updateMaterialTableDataRecord,
      insertTableDataRecord: insertMaterialTableDataRecord,
      deleteTableDataRecord: deleteMaterialTableDataRecord,
    },
  ] = useTable({
    columns: getMaterialColumns(),
    pagination: false,
    showTableSetting: false,
    striped: true,
    isCanResizeParent: true,
    canResize: false,
    autoCreateKey: true,
    actionColumn: {
      width: 120,
      title: '操作',
      dataIndex: 'action',
    },
    i18nConfig: {
      moduleCode: 'EngineeringInformationColumn',
    },
  });

  function getMaterialTableActions(index, record): ActionItem[] {
    return [
      {
        label: '',
        color: 'error',
        icon: 'icon-ym icon-ym-btn-add',
        onClick: handleChangeMaterial.bind(null, 'addBaseIndex', { index }),
      },
      {
        label: '',
        color: 'error',
        icon: 'icon-ym icon-ym-btn-copy',
        onClick: handleChangeMaterial.bind(null, 'copy', { index }),
      },
      {
        label: '',
        color: 'error',
        icon: 'icon-ym icon-ym-delete',
        modelConfirm: {
          onOk: handleChangeMaterial.bind(null, 'delete', { id: record.id }),
        },
      },
    ];
  }

  // 工序
  const [
    registerTechnologyEditTable,
    {
      setTableData: setTechnologyTableData,
      getDataSource: getTechnologyDataSource,
      updateTableData: updateTechnologyTableData,
      insertTableDataRecord: insertTechnologyTableDataRecord,
      deleteTableDataRecord: deleteTechnologyTableDataRecord,
    },
  ] = useTable({
    columns: getTechnologyColumns(),
    pagination: false,
    showTableSetting: false,
    striped: true,
    isCanResizeParent: true,
    canResize: false,
    autoCreateKey: true,
    resizeHeightOffset: 20,
    actionColumn: {
      width: 120,
      title: '操作',
      dataIndex: 'action',
    },
    i18nConfig: {
      moduleCode: 'EngineeringInformationColumn',
    },
  });

  function getTechnologyTableActions(index, record): ActionItem[] {
    return [
      {
        label: '',
        color: 'error',
        icon: 'icon-ym icon-ym-btn-add',
        onClick: handleChangeTechnology.bind(null, 'addBaseIndex', { index }),
      },
      {
        label: '',
        color: 'error',
        icon: 'icon-ym icon-ym-btn-copy',
        onClick: handleChangeTechnology.bind(null, 'copy', { index }),
      },
      {
        label: '',
        color: 'error',
        icon: 'icon-ym icon-ym-delete',
        modelConfirm: {
          onOk: handleChangeTechnology.bind(null, 'delete', { id: record.id }),
        },
      },
    ];
  }

  async function init(data) {
    setMaterTableData([handleMatarialDataItem(materialRowData, 1)]);
    setTechnologyTableData([
      {
        ...technologyRowData,
      },
    ]);
    registerMouseEvent();

    state.ids = data.ids || [];
    state.id = state.ids[0] || '';
    state.total = state.ids.length;
    state.type = data.type || 'add';
    handleTechnologyTableList();
    getDetail();
  }

  function handleMatarialDataItem(data, id?: number) {
    const _d = {
      ...data,
      disabled: {
        materialColor: true,
        qty: true,
        // purchaseUnit: true,
        // materialLength: true,
        // materialWidth: true,
        materialUtilization: true,
        machineFunctionHourQty: true,
        // materialCode: true,
        originPartNumber: true,
        materialDesc: true,
      },
    };
    if (id) {
      _d.id = buildId();
    }
    return _d;
  }

  // 处理列表数据格式
  function handleList(list, type?: 'metaria' | 'process' | '') {
    if (!list) return [];
    const _list = list.map(item => {
      const _item = {
        ...item,
        onEdit: true,
        editable: state.showEditable,
      };
      _item.id = _item.id || buildId();
      if (type == 'metaria') {
        _item.remarks = item.remark;
        _item.disabled = {
          materialColor: true,
          qty: true,
          // purchaseUnit: true,
          // materialLength: true,
          // materialWidth: true,
          materialUtilization: true,
          machineFunctionHourQty: true,
          materialDesc: true,
        };
        _item.width = item.width == 0 ? '' : item.width;
      }
      // if (type == 'process') {
      //   const flag = isTechnologyProcessCodeStartWith(item.processCode);
      //   console.log(flag);
      //   _item.disabled = {
      //     speed: flag,
      //     speedUnit: flag,
      //   };
      // }
      return _item;
    });
    return _list;
  }

  function handleShipPattern(base) {
    return base.packageRuleType == 1 ? 'P' : 'R';
  }
  // 包材
  function handlePackDetail(base) {
    const { engineeringPackagings, engineeringPackagingList, packageRuleQty } = base;
    const isEdit = handleEditStatus(base.status);
    if ((engineeringPackagings && engineeringPackagings.length) || (engineeringPackagingList && engineeringPackagingList.length) || packageRuleQty) {
      const packageParams = {
        packingMaterialFixedList: [],
        packingMaterialCustomList: [],
        packageSpecQty: packageRuleQty,
        config: {
          shipPattern: handleShipPattern(base),
          mode: isEdit ? 'edit' : 'view',
          source: 'quanlity',
          deleteApi: delPackMaterial,
        },
      };
      if (engineeringPackagings && engineeringPackagings.length) {
        // 转换字段
        packageParams.packingMaterialFixedList = engineeringPackagings.map(item => {
          const _item = {
            id: item.id,
            uuid: item.id,
          };
          Object.keys(packageFieldMap).forEach(key => {
            if (Object.hasOwn(item, key)) {
              _item[packageFieldMap[key]] = item[key];
            }
          });
          return _item;
        });
      }
      if (engineeringPackagingList && engineeringPackagingList.length) {
        packageParams.packingMaterialCustomList = engineeringPackagingList.map(item => {
          const _item = {
            id: item.id,
            uuid: item.id,
          };
          for (const key in packageCoreFieldMap) {
            if (Object.hasOwn(item, key)) {
              _item[packageCoreFieldMap[key]] = item[key];
            }
          }
          return _item;
        });
      }
      unref(packageRef)?.setTableData(packageParams);
    } else {
      unref(packageRef)?.init({
        shipPattern: handleShipPattern(base),
        mode: isEdit ? 'edit' : 'view',
        source: 'quanlity',
        deleteApi: delPackMaterial,
      });
    }
  }
  // 工艺
  function handleProcessDetail(engineeringProcesses) {
    if (engineeringProcesses && engineeringProcesses.length) {
      setTechnologyTableData(handleList(engineeringProcesses, 'process'));
    }
  }
  // 处理步距
  function handleStepDetail(engineeringStepDistances) {
    if (engineeringStepDistances && engineeringStepDistances.length) {
      state.technologyList = engineeringStepDistances;
    } else {
      state.technologyList = [
        {
          ...technologyItem,
        },
      ];
    }
  }
  // 处理材料
  function handleMetaria(engineeringMaterials) {
    if (engineeringMaterials && engineeringMaterials.length) {
      setMaterTableData(handleList(engineeringMaterials, 'metaria'));
    }
  }
  // 处理详情字段
  function handleDetail(base) {
    state.mainProcess = base.mainProcess;
    state.isQuota = false; // 初始化为非引用数据
    setBaseInfoFieldsValue(base);
    // setTechnologyTableFieldsValue(base);
    const { engineeringMaterials, engineeringProcesses, engineeringStepDistances } = base;
    handleMetaria(engineeringMaterials);
    handlePackDetail(base);
    handleProcessDetail(engineeringProcesses);
    handleStepDetail(engineeringStepDistances);
  }

  function handleDblClick(event, value) {
    const { id } = value;
    getBomDetail(id);
  }

  // 监听基础数据处理
  function handleBaseChange(e, data) {
    if (e == 'experimentType') {
      return updateBaseInfoSchema([
        {
          field: 'experimentDuration',
          componentProps: {
            disabled: data == 0,
          },
        },
        {
          field: 'experimentQty',
          componentProps: {
            disabled: data == 0,
          },
        },
      ]);
    }
    if (e == 'mould') {
      // 若是不需要开模，则无需填写交期
      if (data == 0) {
        setBaseInfoFieldsValue({
          estimatedMoldTime: '',
        });
      }
      updateBaseInfoSchema([
        {
          field: 'estimatedMoldTime',
          componentProps: {
            disabled: data == 0,
          },
        },
      ]);
    }
  }

  // 步距变化
  function handleStepChange(e, record) {
    const data = state.technologyList[e - 1];
    const { stepDistance, modulus } = data;
    const updateParam: any = {
      stepDistance: Number(stepDistance),
      modulus: Number(modulus),
    };
    updateMaterialTableDataRecord(record.id, updateParam);
    calQty(record);
  }
  // 获取不良率
  function getDefectRate() {
    return (
      (getTechnologyDataSource().reduce((pre, next) => {
        pre += Number(next.defectiveRate || 0);
        return pre;
      }, 0) || 0) / 100
    );
  }
  // 计算用量
  function calQty(record, defectRate?: number) {
    const { purchaseUnit, materialDosage, stepDistanceNumber } = record;
    const _defectRate = defectRate ?? getDefectRate(); // 不良率
    let useQty;
    if (purchaseUnit === 'PCS') {
      useQty = (1 / (1 - _defectRate)) * 1000;
    } else if (purchaseUnit === 'M') {
      // 获取步距
      const useStep = technologyList.value[Math.max(stepDistanceNumber - 1, 0)];
      if (useStep) {
        const { stepDistance, modulus } = useStep;
        useQty = stepDistance / modulus / (1 - _defectRate);
      }
    }
    useQty = (useQty || 0) * materialDosage;
    const params: any = { qty: useQty.toFixed(5) || '' };
    // 计算机动时间
    // const mainProcess = getTechnologyDataSource().find(el => {
    //   return el.processLevel == 1;
    // });
    // if (mainProcess) {
    //   const { capacity } = mainProcess;
    //   params.machineFunctionHourQty = (capacity || 0) * 10 * useQty;
    // }
    updateMaterialTableDataRecord(record.id, params);
  }
  // 计算利用率
  function calUtilizationRateToUpdate(record) {
    const { width, materialWidth } = record;
    const utilizationRate = calUtilizationRate({
      width,
      materialWidth,
    });
    updateMaterialTableDataRecord(record.id, {
      materialUtilization: utilizationRate,
    });
  }
  // 计算总量
  function calTotal() {
    const defectRate = getDefectRate();
    getMaterialDataSource().forEach(el => {
      // 更新用量
      calQty(el, defectRate);
      calUtilizationRateToUpdate(el);
    });
    nextTick(() => {
      message.success(t('sys.api.operationSuccess'));
    });
  }

  interface MaterialChangeContext {
    record: Record<string, any>;
    column: { key: string };
    value: string | number;
    data: Array<Record<string, any>>;
    index: number;
  }

  function handleMetarialChange({ record, column, value, data, index }: MaterialChangeContext): void {
    if (!data || !data.length) return;

    const { key } = column;

    if (key === 'materialCode') {
      const originPartNumber = String(value);
      const [, eightCode, calcWidth] = originPartNumber.split('-');
      const item = getMaterialDataSource()[index];
      const { editValueRefs } = item;
      const { materialDesc, materialLength, materialWidth, materialColor, purchaseUnit, shortMaterialCode } = data[0];

      let materialUtilization: number | '' = '';

      if (record.width) {
        materialUtilization = calUtilizationRate({
          width: record.width,
          materialWidth,
        });
      } else {
        createMessage.warning('请输入宽度');
      }

      const retNum = Number(calcWidth) - editValueRefs.width;
      const widthStr = editValueRefs.width?.toString().padStart(4, '0');
      const originPartNumberByWidth = widthStr && retNum > 3 ? `600-${eightCode}-${widthStr}` : originPartNumber;

      const params = {
        ...record,
        materialDesc,
        materialLength,
        materialWidth,
        purchaseUnit,
        materialColor,
        shortMaterialCode,
        materialUtilization,
        originPartNumber: originPartNumberByWidth,
      };

      updateMaterialTableDataRecord(record.id, params);

      nextTick(() => {
        calQty(item);
      });

      return;
    }

    if (key === 'width') {
      const originPartNumber = record.originPartNumber as string | undefined;

      if (value && originPartNumber) {
        const widthStr = String(value).padStart(4, '0');
        const head = originPartNumber.slice(0, -4);
        const params = {
          ...record,
          originPartNumber: `${head}${widthStr}`,
          materialUtilization: calUtilizationRate(record),
        };

        updateMaterialTableDataRecord(record.id, params);
      }

      return;
    }

    if (key === 'materialWidth') {
      calUtilizationRateToUpdate(record);
      return;
    }

    calQty(record);
  }

  // 计算机动时间
  // function calMachineFunctionHour(record, capacity) {
  //   nextTick(() => {
  //     if (record.processLevel) {
  //       const materialDataList = getMaterialDataSource();
  //       materialDataList.forEach(item => {
  //         const { editValueRefs, qty } = item;
  //         editValueRefs.machineFunctionHourQty = (capacity || 0) * 10 * qty;
  //       });
  //     }
  //   });
  // }

  async function getDetail() {
    changeLoading(true);
    try {
      const res = await getBomList([state.id]);
      const { data: resData } = res;
      if (resData && resData.length) {
        const base = resData[0].engineeringInformation;
        state.base = base;
        setBaseInfoProps({
          disabled: !handleEditStatus(base.status),
        });
        state.bomList = resData.map(item => {
          item.materials = item.materials.map(m => {
            return {
              id: item.id,
              innerMaterialNumber: m,
            };
          });
          return item;
        });
        handleDetail(base);
      }
    } catch (error) {
      console.error(error);
      if (state.type == 'view') {
        return closePopup();
      }
    } finally {
      handleTechnologyTableList();
    }
    changeLoading(false);
  }

  function handleChangePage(type) {
    if (type == 'pre') {
      state.currentIndex--;
    } else {
      state.currentIndex++;
    }
    state.id = state.ids[state.currentIndex];
    getDetail();
  }
  function handleUnpack() {
    bomContent.value.style.transition = 'all 0.5s';
    setTimeout(() => {
      if (state.isPack) {
        bomContent.value.style.flex = `0 0 10px`;
        mainContent.value.style.flex = `1 1 auto`;
        bomContent.value.style.transition = 'none';
        state.isPack = !state.isPack;
      } else {
        bomContent.value.style.flex = `0 0 280px`;
        mainContent.value.style.flex = `1 1 auto`;
        bomContent.value.style.transition = 'none';
        state.isPack = !state.isPack;
      }
    }, 100);
  }

  async function handleDeleteTechnology(index) {
    const tableData = getMaterialDataSource();
    const v = tableData.find(item => item.stepDistanceNumber === index + 1);
    if (v) return createMessage.warning(t('common.proceesDelTip'));
    const { id } = state.technologyList[index];
    if (id) {
      await delStep(id);
    }
    state.technologyList.splice(index, 1);
  }

  function handleAddTechnology() {
    state.technologyList.push(cloneDeep(technologyItem));
  }

  function registerMouseEvent() {
    divider.value.addEventListener('mousedown', e => {
      isDragging = true;
      document.body.style.userSelect = 'none';
      document.body.style.cursor = 'ew-resize';
    });
    document.addEventListener('mousemove', e => {
      if (!isDragging) return;

      const containerRect = container.value.getBoundingClientRect();
      const offsetX = e.clientX - containerRect.left;
      bomContent.value.style.flex = `0 0 20px`;
      mainContent.value.style.flex = `1 1 auto`;
      state.isPack = offsetX >= 140;
    });
    document.addEventListener('mouseup', () => {
      isDragging = false;
      document.body.style.userSelect = 'auto';
      document.body.style.cursor = 'default';
    });
  }

  function handleScroll(e) {
    const NAV_MAP = {
      'base-info': 0,
      material: 1,
      packaging: 2,
      'process-flow': 3,
      'process-flow-and-upload': 4,
      changeResume: 5,
    };
    const ele = e.target;
    const dataIndex = ele.dataset.index ?? '';
    const list = navBox.value.children;

    if (dataIndex == null || NAV_MAP[dataIndex] === state.navIndex) return;
    ele.classList.add('active');
    list[state.navIndex].classList.remove('active');
    state.navIndex = NAV_MAP[dataIndex];

    const target = document.querySelector(`#${dataIndex}`);
    // target.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
    const { top } = getViewportOffset(target);
    mainScroll.value.scrollTo(top - 230);
  }

  type MaterialChangeType = 'add' | 'update' | 'copy' | 'delete' | 'addBaseIndex';

  interface MaterialChangeData {
    rows?: number;
    index?: number;
    id: string | number;
    [key: string]: unknown;
  }

  async function handleChangeMaterial(type: MaterialChangeType, data: MaterialChangeData): Promise<void> {
    switch (type) {
      case 'add': {
        const rows = Number(data.rows) || 0;
        const dataList = Array.from({ length: rows }, () => handleMatarialDataItem(materialRowData, 1));
        if (dataList.length > 0) {
          insertMaterialTableDataRecord(dataList);
        }
        break;
      }

      case 'addBaseIndex': {
        const insertIndex = (data.index ?? 0) + 1;
        insertMaterialTableDataRecord(handleMatarialDataItem(materialRowData, 1), insertIndex);
        break;
      }

      case 'copy': {
        const index = data.index ?? 0;
        const copyData = getMaterialDataSource()[index];
        const insertIndex = index + 1;
        insertMaterialTableDataRecord(handleMatarialDataItem(copyData, 1), insertIndex);
        break;
      }

      case 'delete': {
        const id = String(data.id);
        if (!id.includes('_id')) {
          await delMaterial(id);
        }
        deleteMaterialTableDataRecord(id);
        break;
      }

      case 'update':
      default:
        break;
    }
  }

  function handleTechnologyTableList() {
    const data = getTechnologyDataSource();
    state.technologyTableList = data.map((item, index) => ({
      value: index + 1,
      label: item.processCode ? `${item.processCode}(${item.processName})` : '',
    }));
  }

  type TechnologyChangeType = 'add' | 'update' | 'copy' | 'delete' | 'addBaseIndex';

  interface TechnologyChangeData {
    rows?: number;
    index?: number;
    id: string;
    [key: string]: unknown;
  }

  async function handleChangeTechnology(type: TechnologyChangeType, data: TechnologyChangeData): Promise<void> {
    switch (type) {
      case 'add': {
        const rows = Number(data.rows) || 0;
        const dataList = Array.from({ length: rows }, () => ({
          ...technologyRowData,
          id: buildId(),
        }));

        insertTechnologyTableDataRecord(dataList);
        break;
      }

      case 'addBaseIndex': {
        insertTechnologyTableDataRecord(
          {
            ...technologyRowData,
            id: buildId(),
          },
          (data.index ?? 0) + 1,
        );
        break;
      }

      case 'copy': {
        const index = data.index ?? 0;
        const copyData = getTechnologyDataSource()[index];
        insertTechnologyTableDataRecord(
          {
            ...toRaw(copyData),
            id: buildId(),
          },
          index + 1,
        );
        break;
      }

      case 'delete': {
        const id = String(data.id);
        if (!id.includes('_id')) {
          await delProcess(id);
        }
        deleteTechnologyTableDataRecord(id);
        break;
      }

      case 'update':
      default:
        break;
    }

    handleTechnologyTableList();
  }

  async function handleSubmit(type) {
    changeLoading(true);
    const params: any = {
      id: state.id,
      isCover: state.isQuota,
      ...getBaseInfoFieldsValue(),
      // ...getTechnologyTableFieldsValue(),
      engineeringSteps: state.technologyList.map((item, index) => {
        item.number = index + 1;
        return item;
      }),
      // 当前序号赋值到工艺表中
      engineeringProcesses: getTechnologyDataSource().map((el, i) => {
        el.processNumber = i + 1;
        return el;
      }),
      engineeringPackagings: [],
      engineeringMaterials: getMaterialDataSource().map((el, i) => {
        el.materialNumber = i + 1;
        return el;
      }),
    };
    // getPackageDataSource(),
    // 从包材表格中获取数据，并转换字段赋值到 engineeringPackagings 字段
    const res = (await unref(packageRef)?.getDataSource()) || [];
    params.engineeringPackagings = res.packingMaterialFixedList.map((item, index) => {
      const _item: any = {
        id: item.id,
      };
      for (const key in packageFieldMap) {
        const _originkey = packageFieldMap[key];
        if (Object.hasOwn(item, _originkey)) {
          _item[key] = item[_originkey];
        }
      }
      _item.packagingNumber = index + 1;
      return _item;
    });
    if (res.packingMaterialCustomList) {
      params.engineeringPackagingList = res.packingMaterialCustomList.map((item, index) => {
        const _item: any = {
          id: item.id,
        };
        for (const key in packageCoreFieldMap) {
          const _originkey = packageCoreFieldMap[key];
          if (Object.hasOwn(item, _originkey)) {
            _item[key] = item[_originkey];

            if (_originkey === 'partNumber') {
              delete _item[_originkey]; // 删除原始字段
            }
          }
        }
        _item.packagingNumber = index + 1;
        return _item;
      });
    }
    params.packageRuleQty = res.packSpecQtyR || res.packSpecQtyPN;
    // 调用接口
    try {
      const r = type == 'storage' ? await storageBomDetail(params) : await saveBomDetail(params);
      if (r.code == 200) {
        createMessage.success(t('sys.api.operationSuccess'));
        emits('reload');
        closePopup();
        // 如果处理的是最后一条，则关闭，若不是，则跳转到下一条数据
        // if (state.currentIndex == state.ids.length - 1) {
        // } else {
        //   handleChangePage('next');
        // }
      }
    } finally {
      changeLoading(false);
    }
  }

  /**
   * 判断工序代码是否以指定字符开头
   * @param valueStr 工序代码
   * @param prefixList 指定字符列表，可选，默认为 `['1'、'4'、'5']`
   */
  function isTechnologyProcessCodeStartWith(valueStr: string, prefixList = ['1', '4', '5']) {
    return valueStr ? prefixList.some(code => valueStr.startsWith(code)) : false;
  }

  function getTechnologyColumns(): BasicColumn[] {
    return [
      {
        title: '工序代码',
        dataIndex: 'processCode',
        className: 'table-required',
        editComponent: 'ApiSelect',
        editComponentProps: {
          api: getProcessAllList,
          showSearch: true,
          apiSearch: {
            show: true,
            searchName: 'keyword',
          },
          params: {
            mainProcess: state.mainProcess || 1,
          },
          autoSelect: true,
          resultField: 'data',
          labelField: 'code',
          valueField: 'code',
          nameFormat: ['code', '(', 'name', ')'],
          // notFoundContent: null,
          immediate: true,
          placeholder: '工序',
          onChange: (_, data, record) => {
            nextTick(() => {
              handleTechnologyTableList();
            });
            if (!data) return;
            const { name, value } = data;
            const { editValueRefs } = record;
            record.processName = name;
            editValueRefs.processName = name;
            const index = getTechnologyDataSource().findIndex(item => item.id === record.id);
            const flag = isTechnologyProcessCodeStartWith(value.toString());
            updateTechnologyTableData(index, 'disabled', {
              ...record.disabled,
              speed: flag,
              speedUnit: flag,
            });
          },
        },
        editRow: true,
        width: 180,
      },
      {
        title: '调机时间(H)',
        className: 'table-required',
        dataIndex: 'lineAdjustmentTime',
        editRow: true,
        editComponent: 'InputNumber',
        editComponentProps: {
          placeholder: '调机时间(H)',
          min: 0,
        },
        width: 100,
      },
      {
        title: '不良率',
        className: 'table-required',
        dataIndex: 'defectiveRate',
        editRow: true,
        editComponent: 'InputNumber',
        editComponentProps: {
          placeholder: '自动带入',
          min: 0,
          rate: true,
        },
        width: 100,
      },
      {
        title: '产能(K/H)',
        className: 'table-required',
        dataIndex: 'capacity',
        editRow: true,
        editComponent: 'InputNumber',
        editComponentProps: {
          placeholder: '产能',
          // onChange: (capacity, data, record) => {
          //   calMachineFunctionHour(record, capacity);
          // },
        },
        width: 120,
      },
    ];
  }

  // 脱敏图纸处理
  function handleDrawView() {
    openDrawViewModal(true, {
      id: state.id,
      InsidePartNumber: state.base.innerMaterialNumber,
    });
  }

  // 引用历史记录
  function handleHistory() {
    openQuotaModal(true, {
      menuDocType: 'EngineeringInformation',
    });
  }
  // 基础信息引用覆盖
  function handleBaseQuotaDetail(base) {
    // 识别出可引用的字段并覆盖
    const fileds = {
      experimentType: base.experimentType || 0,
      experimentDuration: base.experimentDuration,
      experimentQty: base.experimentQty,
      mould: base.mould,
      estimatedMoldTime: base.estimatedMoldTime || '',
      engineeringRemarks: base.engineeringRemarks,
    };
    handleBaseChange('experimentType', fileds.experimentType);
    handleBaseChange('mould', fileds.mould);
    setBaseInfoFieldsValue(fileds);
    state.isQuota = true; // 设置为引用参数
  }
  // 对引用的料号进行覆盖处理
  async function handleQuotaModal(selectRow) {
    const row = selectRow;
    if (!row) return createMessage.warning(t('common.selectText'));
    const res = await getRecordTransfer(row.docId);
    if (res.code) {
      const { data } = res;
      handleBaseQuotaDetail(data);
      handlePackDetail(data);
      handleStepDetail(data.engineeringStepDistances);
      handleMetaria(data.engineeringMaterials);
      handleProcessDetail(data.engineeringProcesses);
      createMessage.success(t('sys.api.operationSuccess'));
      nextTick(() => {
        handleTechnologyTableList();
      });
    }
  }
</script>
<style scoped lang="less">
  .container-box {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
  }

  .bom-content {
    //width: 20%;
    flex: 0 0 280px;
    padding: 0 16px 16px 0;
    //margin-top: 45px;
    min-width: 5%;
    max-width: 60%;
    height: 100%;
    overflow-x: auto;
    position: relative;

    .drag-box {
      position: absolute;
      right: 10px;
      height: 100%;
      display: flex;
      align-items: center;

      .drag-ctrl {
        width: 3px;
        height: 200px;
        background: #ccc;
        cursor: ew-resize;
        top: 50%;
        transform: translate(-50%);
      }
    }
  }

  .main-content {
    flex: 5;
    overflow: auto hidden;
    height: 100%;
    flex-direction: column;
    position: relative;

    :deep(.ant-btn) {
      padding: 4px;
    }
  }

  .line {
    height: 1px;
    width: 100%;
    background: rgb(219 219 219);
    margin-bottom: 8px;
  }

  .icon-color {
    display: block;
    width: 40px;
    text-align: center;
    color: #ff7b00;
  }

  .bom-header {
    position: relative;
    height: 100%;

    & > .title {
      display: flex;
      //flex-direction: row;
      flex-flow: row-reverse wrap;
      justify-content: space-between;
      align-items: center;
      //padding-bottom: 5px;
      padding: 8px 0;
      background: #fff;
    }
  }

  .bom-list {
    //border-top: 1px solid #333;
    box-sizing: border-box;
    //height: 100%;
    //height: 600px;
  }

  .main-nav {
    display: flex;
    flex-direction: row;
    position: absolute;
    z-index: 11;
    align-items: center;
    justify-content: center;
    width: 100%;
    background: rgb(255 255 255 / 80%);
    border-bottom: 1px solid #dbdbdb;

    .nav-item {
      display: flex;
      padding: 8px 16px;
      flex-direction: column;
      align-items: center;
      gap: -3px;
      color: #666;
      cursor: pointer;
    }

    .active {
      border-bottom: 1px solid #ff7b00;
      color: #1a1a1a;
      transition: all 0.3s;
    }
  }

  :deep(.lydc-basic-form .ant-form-item:not(.ant-form-item-with-help)) {
    margin-bottom: 10px;
  }

  :deep(.ant-form-vertical .ant-form-item-label) {
    padding: 0 0 3px;
  }

  :deep(.subtitle-container) {
    padding-bottom: 0;
  }

  .technology-box {
    display: flex;
    height: 280px;
    width: 100%;
    box-sizing: border-box;
    background: #fafafa;
    padding: 0 5px;

    .item-box {
      display: flex;
      flex-direction: row;
      align-items: center;
      margin-top: 5px;
      margin-bottom: 5px;
    }
  }

  .mold-box {
    margin-top: 12px;
    display: flex;
    height: 320px;
    width: 100%;
    box-sizing: border-box;
    background: #fafafa;
    padding: 8px;

    .item-box {
      display: flex;
      flex-direction: row;
      align-items: center;
      margin-bottom: 5px;
      background: #f2f2f2;
      padding: 4px 8px;
    }
  }

  .center {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }

  .material {
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    :deep([data-v-1860833b] .lydc-basic-form .ant-form-item:not(.ant-form-item-with-help)) {
      margin-bottom: 0;
    }

    :deep(.subtitle-container .title) {
      width: max-content;
    }

    :deep(.basic-content-wrap div) {
      width: max-content;
    }
  }

  .technology-detail-wrapper {
    display: flex;
    flex-direction: column;

    .detail-wrapper {
      display: flex;
      flex-direction: row;
    }

    .left-detail {
      flex: 3;
    }

    .right-detail {
      flex: 2;
      display: flex;
      flex-direction: column;

      .agn-center {
        display: flex;
        align-items: center;
      }

      .message {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        padding: 4px 15px;
        border: 1px solid #dbdbdb;
        border-radius: 3px;
        margin: 0 5px;

        .name {
          color: #ff7b00;
        }
      }

      .engine-upload {
        margin: 5px 0;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
      }
    }
  }

  :deep(.lydc-tree) {
    background: #fafafa;
  }

  :deep(.ant-tree) {
    background: transparent;
  }

  :deep(.ant-tree-show-line .ant-tree-switcher) {
    background: transparent;
  }

  .link-a {
    color: #ff7b00;
    cursor: pointer;
  }

  :deep(.table-required) {
    & > span:first-child::before {
      display: inline-block;
      margin-inline-end: 4px;
      color: #ed6f6f;
      font-size: 14px;
      font-family: SimSun, sans-serif;
      line-height: 1;
      content: '*';
    }
  }

  :deep(.lydc-basic-popup-header) {
    padding-left: 12px;
  }
</style>
