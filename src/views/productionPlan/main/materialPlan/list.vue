<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <Grid>
          <template #toolbar-actions>
            <a-space>
              <a-button v-auth="'btn_edit'" type="primary" @click="handleEdit" v-if="activeKey === 'masterList' || activeKey === 'pending'">
                {{ t('common.updateText') }}
              </a-button>
              <!-- 分配BOM表 -->
              <a-button v-auth="'btn_asignBom'" type="primary" ghost @click="handleAssignBOM" v-if="activeKey === 'masterList'">
                {{ t('common.asignBom') }}
              </a-button>
              <!-- 分配材料 -->
              <a-button v-auth="'btn_asignmetaria'" type="primary" ghost @click="handleAllocateMaterials" v-if="activeKey === 'masterList'">
                {{ t('common.asignmetaria') }}
              </a-button>
              <!-- 下推PR单 -->
              <a-button v-auth="'btn_pushPR'" type="primary" ghost @click="handleReleasePR" v-if="activeKey === 'pending'">{{ t('common.pushPR') }}</a-button>
              <!-- 计算N周需求 -->
              <a-button v-auth="'btn_calDemand'" type="primary" ghost @click="handleCalculateDemand" v-if="activeKey === 'masterList'">
                {{ t('comon.calNDemand') }}
              </a-button>
              <!-- 批量导出-->
              <a-button v-auth="'btn_download'" class="mr-12px" block @click="handleExport">{{ t('common.batchExport') }}</a-button>
            </a-space>
          </template>
          <template #reqdLog="{ row }">
            <div class="table-a" @click="handleDetail(row, '要求排产数更新记录')">{{ t('common.viewDetails') }}</div>
          </template>
        </Grid>
      </div>
    </div>
    <ProdLogDetailModal @register="registerProdLogDetail" @reload="reload"> </ProdLogDetailModal>
    <ExportModal @register="registerExportModal" @export="exportAction" />
    <AssignBOMModal @register="registerAssignBOM" @reload="reload"> </AssignBOMModal>
    <AllocateMaterialsModal @register="registerAllocateMaterials" @reload="reload"> </AllocateMaterialsModal>
    <CalculateDemandModal @register="registerCalculateDemand" @reload="reload"> </CalculateDemandModal>
  </div>
</template>
<script lang="ts" setup>
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { computed, onMounted } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { getColumn, getFormSchema } from './config';
  import { useModal } from '/@/components/Modal';
  import { downloadByUrl } from '/@/utils/file/download';
  import ExportModal from '/@/components/ExportModal/index.vue';
  import AssignBOMModal from './components/AssignBOMModal.vue';
  import AllocateMaterialsModal from './components/AllocateMaterialsModal.vue';
  import CalculateDemandModal from './components/CalculateDemandModal.vue';
  import ProdLogDetailModal from '../masterSchedule/components/ProdLogDetailModal.vue';
  import { getWeekDays } from './weekTime';
  import { materialTotalpage, materialPartpage, materialTotalexport, materialPartexport } from '/@/api/mps/productionPlan/materialPlan';
  import { useMessage } from '/@/hooks/web/useMessage';
  import dayjs from 'dayjs';

  const { createMessage } = useMessage();

  const { t } = useI18n();

  const emit = defineEmits(['handleEdit', 'handleReleasePR', 'changeWeek']);
  const props = defineProps({
    activeKey: {
      type: String,
      default: 'masterList',
    },
    weeks: {
      type: Number as any,
      default: 0,
    },
  });
  const status = computed(() => {
    const masterDemandPlanStatusEnum = {
      pending: 1,
      processing: 2,
      handled: 3,
    };
    return masterDemandPlanStatusEnum[props.activeKey] || '';
  });

  const [registerExportModal, { openModal: openExportModal, closeModal }] = useModal();
  const [registerAssignBOM, { openModal: openAssignBOM }] = useModal();
  const [registerAllocateMaterials, { openModal: openAllocateMaterials }] = useModal();
  const [registerCalculateDemand, { openModal: openCalculateDemand }] = useModal();

  const getGridOps = () => {
    const _initOps = {
      id: 'pruductionPlan-main-materialPlan-list-' + props.activeKey,
      columns: [],
      api: props.activeKey === 'masterList' ? materialTotalpage : materialPartpage,
      showIndexColumn: true,
      i18nConfig: {
        moduleCode: 'MaterialDemandPlanColumn',
      },
      toolbarConfig: {
        expandAll: props.activeKey == 'masterList',
        defaultExpand: false,
        superQuery: true,
      },
      proxyConfig: {
        autoLoad: false,
        ajax: {
          queryAll: async () => {
            const formValues = await getFromValue();
            const weeksDayjs = dayjs(formValues.searchDate || props.weeks);
            const queryParamsAll = {
              searchDate: `${weeksDayjs.endOf('week').year()}WK${weeksDayjs.endOf('week').week().toString().padStart(2, '0')}`,
              pageSize: 999999999,
              currentPage: 1,
            };
            const queryParams = {
              ...queryParamsAll,
              queryType: status.value,
            };
            const { data } = props.activeKey === 'masterList' ? await materialTotalpage(queryParamsAll) : await materialPartpage(queryParams);
            let exportData = data.list;
            if (props.activeKey === 'masterList') {
              const listToTree = buildTreeFromFlatData(exportData);
              exportData = flattenTreeData(listToTree);
            }
            return {
              list: processExportData(exportData),
              total: data.pagination.total,
            };
          },
        },
      } as any,
      exportConfig: {
        type: 'xlsx',
        types: ['xlsx'],
        mode: 'current',
        modes: ['current', 'all'],
        isAllExpand: props.activeKey === 'masterList',
      },
      beforeFetch: params => {
        const weeksDayjs = dayjs(params.searchDate);
        const paramsObj = {
          ...params,
          // searchDate: params.searchDate && params.searchDate.replace('-', 'WK'),
          searchDate: `${weeksDayjs.endOf('week').year()}WK${weeksDayjs.endOf('week').week().toString().padStart(2, '0')}`,
        };
        return props.activeKey === 'masterList'
          ? { ...paramsObj }
          : {
              queryType: status.value,
              ...paramsObj,
            };
      },
      checkboxConfig: {
        labelField: 'checkbox',
        checkStrictly: true,
        showHeader: true,
      },
    };
    if (props.activeKey == 'masterList') {
      _initOps.treeConfig = {
        transform: true,
        expandAll: true,
        rowField: 'id',
        parentField: 'parentId',
      };
    }
    return _initOps;
  };
  const [Grid, gridApi] = useVbenVxeGrid({
    formOptions: {
      showCollapseButton: false,
      // 是否在字段值改变时提交表单
      submitOnChange: false,
      // 按下回车时是否提交表单
      submitOnEnter: true,
      commonConfig: {
        componentProps: {},
        labelClass: 'w-0',
      },
      wrapperClass: 'grid grid-cols-5 gap-4',
      schema: getFormSchema(props.activeKey),
      handleSubmit: reloadTable,
      handleReset,
      // i18nConfig: {
      //   moduleCode: 'RepairMoldColumn',
      //   transferRange: ['placeholder'],
      // },
    },
    gridOptions: getGridOps(),
  });
  const { reload, reloadColumn, getSelectRows, getSelectRowKeys, clearSelectedRowKeys, getFromValue, setLatestSubmissionValues, resetForm, setFieldValue } =
    gridApi;

  const handleAssignBOM = () => {
    const rows = getSelectRows();
    if (!rows.length) return createMessage.warning(t('common.selectText'));
    if (rows.length > 1) return createMessage.warning(t('tip.MPS.tip14')); // 请选择单条自制成品进行分配bom
    const data = rows[0];
    if (!data.purchaseQuantity) return createMessage.warning(t('tip.MPS.tip15')); // 请先配置申请数量
    if (data.produceType != '1') return createMessage.warning(t('tip.MPS.tip16')); // 请选择自制成品
    if (data.materialType != 1) return createMessage.warning(t('tip.MPS.tip16')); // 请选择自制成品
    openAssignBOM(true, {
      material: data.innerMaterialCode || data.pnOld,
      materialNum: data.purchaseQuantity,
      id: data.id,
    });
  };

  const [registerProdLogDetail, { openModal: openProdLogDetail }] = useModal();
  const handleDetail = (row, title) => {
    openProdLogDetail(true, { ...row, title });
  };

  // 分配材料
  const handleAllocateMaterials = () => {
    const rows = getSelectRows();
    if (!rows.length) return createMessage.warning(t('common.selectText'));
    if (rows.length > 1) return createMessage.warning(t('tip.MPS.tip17')); // 请选择单条数据进行分配材料
    // 若是存在分配中的料号，则不允许进行再次分配
    const rowItem = rows[0];
    if (rowItem.isReallocating) {
      return createMessage.warning(t('tip.MPS.tip18')); // 该料号处于材料分配中，请等审批结束再处理
    }
    if (rowItem.purchaseQuantity === 0) return createMessage.warning(t('tip.MPS.tip15')); // 请先配置申请数量
    openAllocateMaterials(true, {
      material: rowItem.innerMaterialCode,
      materialNum: rowItem.purchaseQuantity,
      id: rowItem.id,
    });
  };

  const handleCalculateDemand = () => {
    const rows = getSelectRows();
    if (!rows.length) return createMessage.warning(t('common.selectText'));
    const findItem = rows.some(item => item.materialType != 1);
    if (findItem) return createMessage.warning(t('tip.MPS.tip19')); // 请选择成品
    openCalculateDemand(true, {
      ids: rows.map(item => item.id),
    });
  };

  // 审核
  const handleEdit = async () => {
    const ids = getSelectRowKeys();
    if (!ids.length) return createMessage.warning(t('dict.CheckDataTip'));
    const rows = getSelectRows();
    const findItem = rows.some(item => item.materialType != 1);
    if (findItem) return createMessage.warning(t('tip.MPS.tip19')); // 请选择成品
    const fields = await getFromValue();
    emit('handleEdit', { ids: ids, searchDate: fields.searchDate });
  };

  const handleReleasePR = async () => {
    const ids = getSelectRowKeys();
    if (!ids.length) return createMessage.warning(t('dict.CheckDataTip'));
    const fields = await getFromValue();
    emit('handleReleasePR', { ids: ids, searchDate: fields.searchDate });
  };

  // 构建树形结构
  function buildTreeFromFlatData(flatData) {
    if (!Array.isArray(flatData) || flatData.length === 0) {
      return [];
    }
    // 创建ID到节点的映射
    const nodeMap = new Map();
    const tree = [];
    // 第一次遍历：创建所有节点
    flatData.forEach(item => {
      // 创建节点副本，添加空的children数组
      const node = {
        ...item,
        children: [],
      };
      nodeMap.set(item.id, node);
    });
    // 第二次遍历：建立父子关系
    flatData.forEach(item => {
      const node = nodeMap.get(item.id);
      if (item.parentId === '0') {
        // 根节点，直接添加到树中
        tree.push(node);
      } else {
        // 子节点，找到父节点并添加到其children中
        const parent = nodeMap.get(item.parentId);
        if (parent) {
          parent.children.push(node);
        } else {
          // 父节点不存在，作为根节点处理
          // console.warn(`找不到父节点 ${item.parentId}，将节点 ${item.id} 作为根节点`);
          tree.push(node);
        }
      }
    });
    return tree;
  }
  // 递归展开树形结构
  function flattenTreeData(treeData, result = []) {
    if (!Array.isArray(treeData)) {
      return result;
    }
    treeData.forEach(item => {
      // 复制当前节点，移除 children 属性
      const { children, _X_ROW_CHILD, ...rest } = item;
      result.push(rest);
      // 递归处理子节点
      if (children && children.length > 0) {
        flattenTreeData(children, result);
      }
    });
    return result;
  }
  // 处理把特殊列显示为文字
  const exportMaps = {
    materialDemandPlanStatus: {
      1: t('dict.MrpStatus.1'),
      2: t('dict.MrpStatus.2'),
      3: t('dict.MrpStatus.3'),
      4: t('dict.MrpStatus.4'),
      5: t('dict.MrpStatus.5'),
    },
    isBonded: { 1: t('common.yes'), 0: t('common.no') },
    vmi: { 1: t('dict.Bool.1'), 0: t('dict.Bool.2') },
  };
  function processExportData(data) {
    return data.map(item => ({
      ...item,
      materialDemandPlanStatus: exportMaps.materialDemandPlanStatus[item.materialDemandPlanStatus] || item.materialDemandPlanStatus,
      isBonded: exportMaps.isBonded[item.isBonded] || item.isBonded,
      vmi: exportMaps.vmi[item.vmi] || item.vmi,
      customerRequireDelivery: dayjs(item.customerRequireDelivery).format('YYYY-MM-DD'),
      requireSupplierDelivery: dayjs(item.requireSupplierDelivery).format('YYYY-MM-DD'),
    }));
  }

  // 批量导出
  const handleExport = async () => {
    gridApi.grid.openExport({
      excludeFields: ['checkbox', 'reqdLog'],
      filename: () => `${t('dict.MaterialDemandPlanColumn')}_${dayjs().format('YYYY-MM-DD')}`,
      beforeExportMethod: ({ $grid, options }) => {
        // 根据导出模式处理数据
        if (options.mode === 'current') {
          let tableData = $grid?.getFullData();
          if (props.activeKey === 'masterList') {
            tableData = flattenTreeData(tableData);
          }
          options.data = processExportData(tableData);
        }
      },
    });

    // const formValue = await getFromValue();
    // const weeksDayjs = dayjs(formValue.searchDate);
    // const yearWeekFormat = `${weeksDayjs.endOf('week').year()}WK${weeksDayjs.endOf('week').week().toString().padStart(2, '0')}`;
    // const paramsObj = {
    //   ...(await getFetchParams()),
    //   ...formValue,
    //   searchDate: yearWeekFormat,
    // };
    // openExportModal(true, {
    //   listQuery:
    //     props.activeKey === 'masterList'
    //       ? { ...paramsObj }
    //       : {
    //           ...paramsObj,
    //           queryType: status.value,
    //         },
    //   exportOptions: getColumn(props.activeKey).filter(item => item.field !== 'time'),
    //   nameProps: 'title',
    //   idProps: 'field',
    // });
  };
  const exportAction = query => {
    const exportApi = props.activeKey === 'masterList' ? materialTotalexport : materialPartexport;
    exportApi(query).then(res => {
      if (!res.data.url) return;
      downloadByUrl({ url: res.data.url });
      closeModal();
    });
  };

  async function reloadTable() {
    const fields = await getFromValue();
    setLatestSubmissionValues(fields);
    const weeks = getWeekDays(fields.searchDate);
    emit('changeWeek', fields.searchDate);
    weeks.unshift({
      title: '备库存',
      field: 'reserveStock',
      width: 80,
      cellRender: {
        name: 'Number',
      },
    });
    const dataList = getColumn(props.activeKey).map(item => {
      if (item.field === 'time') {
        return {
          ...item,
          children: weeks,
        };
      }
      return { ...item };
    });
    reloadColumn(dataList);
    reload();
  }

  // 当周次变化时,重置周次，并重新加载表格数据
  // async function handleWeekChange() {
  //   if (props.weeks) {
  //     const fields = await getFromValue();
  //     if (props.weeks !== fields.searchDate) {
  //       setFieldValue('searchDate', props.weeks);
  //       await setLatestSubmissionValues({ searchDate: props.weeks });
  //       reloadTable();
  //     }
  //   }
  // }

  async function handleReset() {
    await resetForm();
    emit('changeWeek', '');
    reloadTable();
  }
  const refreshTable = async weeks => {
    if (weeks) {
      await setFieldValue('searchDate', weeks);
    }
    clearSelectedRowKeys();
    reload();
  };

  onMounted(async () => {
    await setFieldValue('searchDate', props.weeks);
    reloadTable();
  });

  defineExpose({ refreshTable });
</script>

<style lang="less" scoped>
  .lydc-content-wrapper {
    position: absolute;
  }

  .btn-wrapper {
    margin-top: 16px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }

  .left-btn {
    display: flex;

    button {
      margin-right: 16px;
    }

    // 选择第二个按钮
    button:nth-child(2) {
      border: #ff7b00 solid 1px;
      color: #ff7b00;
    }
  }
</style>
