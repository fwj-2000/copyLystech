<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    :showOkBtn="true"
    :showCancelBtn="true"
    :title="title"
    :destroyOnClose="true"
    :cancel-text="t('common.back')"
    class="h-full"
    :showFooter="false"
    @ok="handleSubmit">
    <template #centerToolbar>
      <a-button type="primary" class="ml-12px" ghost @click="setLocalCacheDataFn">{{ t('common.temporarySave') }} </a-button>
      <!-- <a-button type="primary" class="mr-8px" @click="handlePrint">打印 </a-button> -->
    </template>
    <div>
      <div class="info" ref="AddTableRef">
        <div>{{ t('dict.OutsourceManageColumn.applyUserName') }} ：{{ getUserInfo.userName }}/{{ getUserInfo.userAccount }} </div>
        <div>{{ t('dict.DepartmentColumn') }} : {{ getUserInfo.departmentName || '--' }}</div>
        <div>{{ t('dict.OutsourceManageColumn.qutsourcingDate') }} : {{ dayjs().format('YYYY-MM-DD') }} </div>
      </div>
    </div>
    <Grid style="height: calc(100% - 45px)">
      <template #toolbar-actions>
        <Subtitle :title="t('dict.OutsourceManageColumn.outsourcingInformation')" />
      </template>
      <template #toolbar-tools>
        <AddCustomRows v-if="!state.disabled" @submit="handleAddRows" />
      </template>
      <template #action="{ rowIndex, row }">
        <TableAction outside :actions="getTableActions(row)" />
      </template>
    </Grid>
  </BasicPopup>
</template>
<script lang="ts" setup>
  import { reactive, toRefs, unref, ref, computed } from 'vue';
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  import Subtitle from '/@/components/Subtitle/src/Subtitle.vue';
  import { MODULE_TEMPLATE, ADD_COLUMNS, getAddColumns } from './config';
  import { buildUUID } from '/@/utils/uuid';
  import { addOutsourcemanage, getDraftlist } from '/@/api/purchase/outsourcemanage';
  import { useUserStore } from '/@/store/modules/user';
  import dayjs from 'dayjs';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import AddCustomRows from '/@/views/engineering/pcc/pccApply/components/AddCustomRows.vue';
  import { requestIdleCallbackAdapter } from '/@/utils/polyfills';
  import { cloneDeep } from 'lodash-es';
  import { bignumber, chain, divide, format } from 'mathjs';
  import { TableAction } from '/@/components/Table';
  import { dateUtil } from '/@/utils/dateUtil';

  const userStore = useUserStore();
  const emits = defineEmits(['register', 'reload']);
  interface State {
    title: string;
    mouldNo: string;
    id: string;
    orgId: string;
    processRouteItem: any;
    bindMaterialList: any[];
    fileList: any[];
    costcenterlist: [];
    factoryList: [];
    productTypelist: [];
    innermaterialnumberList: [];
  }

  const state = reactive<State>({
    mouldNo: '',
    title: '',
    id: '',
    orgId: '',
    processRouteItem: {},
    bindMaterialList: [],
    fileList: [],
    costcenterlist: [],
    factoryList: [],
    productTypelist: [],
    innermaterialnumberList: [],
  });
  const row = ref();
  const AddTableRef = ref();
  const { title } = toRefs(state);
  const { t } = useI18n();
  const { createMessage, createConfirm } = useMessage();
  const [registerPopup, { closePopup }] = usePopupInner(init);

  const getUserInfo = computed(() => userStore.getUserInfo);

  const rawData = {
    // workOrderNo: null,
    // mouldNo: '',
    // process: null,
    // outsourceQuantity: '',
    // demandDeliveryTime: '',
    // supplier: '',
    // remark: '',

    orderNo: null,
    moldNo: null,
    urgentLevel: null,
    moldType: null,
    estimateLifespan: null,
    insidePartNumber: null,
    moldRemark: null,
    insideProjectCode: null,
    immediateCustomerCode: null,
    factory: null,
    moldPurchaseId: null,
    moldUse: null,
    costAttribution: null,
    productType: null,
    mainMaterialThickness: null,
    projectPhase: null,
    quantity: null,
    salespersonId: null,
    requireDeliveryTime: null,
  };

  const [Grid, { loadData, reloadData, getDataSource, reloadColumn, setGridOptions, insertAt, remove, setLoading }] = useVbenVxeGrid({
    gridOptions: {
      id: 'qualityAssurance-cpk-cpkIdentificationSetting-addPopup',
      showIndexColumn: true,
      columns: getAddColumns(),
      editConfig: {
        trigger: 'dblclick',
        mode: 'row',
      },
      toolbarConfig: {
        enabled: true,
      },
      scrollY: {
        enabled: false,
      },
      pagerConfig: {
        enabled: false,
      },
      keyboardConfig: {
        isClip: true, // 是否开启复制粘贴
        isEdit: true, // 是否开启任意键进入编辑（功能键除外）
        isDel: true, // 是否开启删除键功能
        isEsc: true, // 是否开启Esc键关闭编辑功能
      },
      rowConfig: {
        keyField: 'id',
      },
      clipConfig: {
        isPaste: true,
        // beforePasteMethod: handleBeforePaster,
      },
    },
  });

  function handleAddRows(rowCount) {
    const rows: Array<any> = [];
    for (let i = 0; i < rowCount; i++) {
      rows.push({ ...rawData, uuid: buildUUID() });
    }
    requestIdleCallbackAdapter(() => {
      insertAt(rows, -1);
    });
  }

  async function handleChangeTable(type, row) {
    const fullData = getDataSource();
    const data = cloneDeep(fullData);
    const uuid = buildUUID();
    const findIndex = fullData.findIndex(item => item.uuid === row.uuid);
    if (type === 'addBaseIndex') {
      // 新增
      data.splice(findIndex + 1, 0, { ...rawData, uuid });
      loadData(data);
    } else if (type === 'copy') {
      // 复制
      const copyData = cloneDeep(fullData[findIndex]);
      delete copyData.id;

      data.splice(findIndex + 1, 0, { ...copyData, uuid });
      loadData(data);
    } else if (type === 'delete') {
      // 删除
      data.splice(findIndex, 1);
      remove(row);
    }
  }

  function getTableActions(row) {
    return [
      {
        icon: 'icon-ym icon-ym-btn-add',
        // auth: 'btn_upload_pic',
        // tooltip: t('common.uploadDrawingText'),
        onClick: handleChangeTable.bind(null, 'addBaseIndex', row),
      },
      {
        icon: 'icon-ym icon-ym-btn-copy',
        auth: 'btn_detail',
        // tooltip: t('sys.errorLog.tableActionDesc'),
        onClick: handleChangeTable.bind(null, 'copy', row),
      },
      {
        icon: 'icon-ym icon-ym-delete',
        auth: 'btn_remove',
        modelConfirm: {
          onOk: handleChangeTable.bind(null, 'delete', row),
        },
        // tooltip: t('common.deleted'),
      },
    ];
  }

  function setLocalCacheDataFn() {
    handleSubmit(0);
  }

  function validateTableForm() {
    let errorArr: any = [];
    const list = getDataSource();
    for (let index = 0; index < list.length; index++) {
      const element = list[index];
      errorArr = ADD_COLUMNS.filter(o => {
        return !element[o.dataIndex] && o.dataIndex != 'moldRemark' && o.dataIndex != 'process';
      });
      if (errorArr.length) return errorArr;
    }
    return errorArr;
  }

  async function handleSubmit(type = 1) {
    const validateArr = await validateTableForm();
    if (validateArr.length && validateArr[0].title !== '备注') {
      return createMessage.warning(validateArr[0].title + '不能为空');
    }
    const list = getDataSource().map(item => {
      const target = {
        ...item,
        demandDeliveryTime: Number.parseInt(dateUtil(item.demandDeliveryTime).format('x')),
        outsourceQuantity: item.outsourceQuantity + '',
      };
      if (item.id.includes('row')) {
        delete target.id;
      }
      delete target.workOrderNoName;
      return target;
    });
    setLoading(true);
    try {
      const { code, msg } = await addOutsourcemanage({ list, type });
      if (code === 200) {
        closePopup();
        createMessage.success(msg);
        emits('reload');
      }
    } catch (error) {
      console.log(error);
      console.error(error, 'handleSubmit');
    } finally {
      setLoading(false);
    }
  }

  function init({ data, title }) {
    console.log(data, title);
    state.title = title;
    // state.tableData = data ? [data] : [];
    if (data) {
      reloadData([data]);
    } else {
      getDraftlistFn();
    }
    // if (!state.tableData.length) getDraftlistFn();
  }

  async function getDraftlistFn() {
    try {
      const { data, code } = await getDraftlist({});
      if (code === 200) {
        if (data?.length) {
          // state.tableData = data;
          reloadData(data);
        } else {
          // state.tableData = [{ ...MODULE_TEMPLATE, id: 1 }];
          reloadData([cloneDeep(rawData)]);
        }
      }
    } catch (error) {
      console.error(error, 'getDraftlistFn:error');
    }
  }
</script>

<style lang="less" scoped>
  .info {
    display: flex;
    padding: 10px 22px;

    div {
      margin-right: 22px;
    }
  }

  .warp {
    display: flex;
    align-items: baseline;
    flex-wrap: nowrap;
    position: relative;
    padding: 0 10px;
    box-sizing: border-box;

    &-btn {
      display: flex;
      align-items: center;
    }

    &-left {
      flex: 1;
      display: flex;
      align-items: baseline;
      padding: 0 12px;
      min-width: 400px;
      flex-wrap: nowrap;
    }
  }

  .table-box {
    height: 100%;
    background-color: rgb(88 105 132);
  }

  :deep(.lydc-basic-popup-header) {
    padding-left: 12px;
  }

  :deep(.scrollbar__view) {
    height: 100%;

    & > div {
      height: 100%;
    }
  }
</style>
