<template>
  <BasicPopup
    v-bind="$attrs"
    :showOkBtn="state.showEdit"
    :okText="t('common.submitText')"
    :title="title"
    :showCancelBtn="true"
    :cancelButtonProps="{ class: 'mr-12px' }"
    :cancelText="t('common.cancelText')"
    class="full-popup"
    :toolbarHeight="60"
    @register="registerPopup"
    @ok="handleSave">
    <template #insertToolbar> </template>
    <template v-if="state.showEdit" #centerToolbar>
      <a-button type="primary" ghost @click="handleSave('storage')">{{ t('common.temporarySave') }}</a-button>
    </template>
    <div class="h-full p-10px requirement-pop">
      <Subtitle :title="t('common.reviewInfo')" class="mt-8px" :extra="{ show: state.type == 'add', hideAdd: true }"></Subtitle>
      <Grid>
        <template #action="{ row }">
          <TableAction :outside="true" :actions="getTableActions(row)" />
        </template>
      </Grid>
    </div>
  </BasicPopup>
  <SAPModal @register="registerSapModal"></SAPModal>
  <UploadModal v-bind="uploadState" ref="uploadAttachRef" @register="registerUpload" />
  <DrawModal @register="registerDrawModal" />
  <DrawMViewodal @register="registerDrawViewModal" />
</template>
<script lang="ts" setup>
  import { reactive, toRefs, ref } from 'vue';
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { TableAction, ActionItem } from '/@/components/Table';
  import { dateUtil } from '/@/utils/dateUtil';
  import { useModal } from '/@/components/Modal';
  import { getQuantationReviewInfo, updateapply, storageReview, uploadDrawings } from '/@/api/business/quantitation';
  import { Subtitle } from '/@/components/Subtitle';
  import { SAPModal } from '/@/components/CustomComponents';
  import DrawModal from './DrawModal.vue';
  import DrawMViewodal from './DrawViewModal.vue';
  import { UploadModal } from '/@/components/Upload';
  import { outCommonVxeCol, outQuotaVxeCols, outPriceVxeCols, outSampleVxeCols, drawDemandVxe } from './tableConfig';
  import { cloneDeep, pick } from 'lodash-es';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { getUserInfoList } from '/@/api/permission/user';
  import { getUserListByAccountList } from '/@/api/business/salesForecast';
  import { getNodeRemark } from '/@/adapter/utils';
  import { CURRENTNODE } from '../config';

  const [registerSapModal, { openModal: openSapModal }] = useModal();
  const [registerDrawModal, { openModal }] = useModal();
  const [registerDrawViewModal, { openModal: openDrawViewModal }] = useModal();
  const [registerUpload, { openModal: openUpload }] = useModal();
  const emits = defineEmits(['register', 'reload']);

  interface State {
    type: 'add' | 'review' | 'view';
    listQuery: any;
    systemId: string;
    title: string;
    parentId: string;
    searchRsList: any[];
    searchFactoryList: any[];
    fetching: boolean;
    base: any;
    line: number;
    demandType: string;
    showEdit: boolean;
  }
  const { t } = useI18n();
  const uploadState = reactive({
    title: t('dict.DrawingsReviewColumn.attachmentUpload'),
    param: {},
    // mutiple: false,
    api: uploadDrawings,
  });
  const state = reactive<State>({
    type: 'add',
    listQuery: {
      category: 'Web',
      keyword: '',
      type: '',
      enabledMark: '',
    },
    systemId: '',
    title: t('common.detailText'),
    parentId: '',
    searchRsList: [],
    searchFactoryList: [],
    fetching: false,
    base: {},
    line: 1,
    demandType: '',
    showEdit: false,
  });
  const { title } = toRefs(state);

  const { createMessage } = useMessage();
  const menuTableColumns = ref(outCommonVxeCol);

  const [registerPopup, { closePopup, changeOkLoading, changeLoading }] = usePopupInner(init);
  const demandTypeReflect = {
    Quantitative: outQuotaVxeCols({ handleStock, handleDraw, handleDrawView }),
    EngineeringSamples: outSampleVxeCols(),
    BusinessSamples: outSampleVxeCols(),
    QuotationRequirements: outPriceVxeCols({ handleDraw, handleDrawView }),
  };

  const [Grid, gridApi] = useVbenVxeGrid({
    showSearchForm: false,
    gridOptions: {
      id: 'business-quantitation-assess-out-edit',
      columns: menuTableColumns.value as any,
      showIndexColumn: true,
      height: 'auto',
      editConfig: {
        trigger: 'dblclick',
        mode: 'row',
      },
      editRules: {},
      rowConfig: {
        keyField: '_X_ROW_KEY',
      },
      areaConfig: {
        multiple: true, // 是否启用多区域选取功能
      },
      // @ts-ignore
      proxyConfig: {
        enabled: false,
      },
      toolbarConfig: {
        enabled: false,
      },
      clipConfig: {
        isPaste: true,
        afterPasteMethod: handleAfterPaster,
      },
      // @ts-ignore
      i18nConfig: {
        moduleCode: 'EngineeringInformationColumn',
      },
      pagerConfig: {
        enabled: false,
      },
    },
  });

  async function init(data) {
    changeLoading(true);
    state.systemId = data.id;
    state.type = data.type || 'add';
    gridApi.setGridOptions({ editConfig: { enabled: true } });
    try {
      const res = await getQuantationReviewInfo(state.systemId);
      state.demandType = res.data[0].demandType;
      if (state.demandType == 'DrawingsReviewReq') {
        menuTableColumns.value = cloneDeep(drawDemandVxe);
      } else {
        menuTableColumns.value = cloneDeep([...outCommonVxeCol, ...(demandTypeReflect[state.demandType] || [])]);
      }
      if (['Quantitative', 'QuotationRequirements'].includes(state.demandType)) {
        menuTableColumns.value.push({
          title: t('common.action'),
          width: 80,
          field: 'action',
          // @ts-ignore
          fixed: 'right',
          slots: {
            default: 'action',
          },
        });
      }
      await gridApi.reloadColumn(menuTableColumns.value);
      gridApi.reloadData(
        res.data.map((el: any) => {
          const item = {
            ...el,
            deliveryTime: el.deliveryTime ? dateUtil(el.deliveryTime).format('YYYY/MM/DD') : '',
          };
          if (item.nodeRemark) {
            item.pmDesc = getNodeRemark(item.nodeRemark, CURRENTNODE);
          }
          return item;
        }),
      );
      const showEdit = data.type == 'review';
      state.showEdit = showEdit;
      if (!showEdit) {
        gridApi.setGridOptions({ editConfig: { enabled: false } });
      }
      changeLoading(false);
    } catch (error) {
      console.log(error);
      closePopup();
    }
  }

  function getTableActions(record): ActionItem[] {
    return [
      {
        label: t('dict.PurchaseQuotationColumn.UploadAttachment'),
        onClick: handleUpload.bind(null, record),
      },
    ];
  }
  function handleUpload(record) {
    openUpload(true, {
      id: record.id,
    });
  }
  function handleStock(record) {
    openSapModal(true, {
      id: record.id,
      applyNo: record.applyNo,
    });
  }
  function handleDraw(record) {
    openModal(true, {
      id: record.id,
      applyNo: record.applyNo,
    });
  }
  function handleDrawView(record) {
    openDrawViewModal(true, {
      id: record.id,
      InsidePartNumber: record.innerMaterialNumber,
    });
  }

  function handleSave(type) {
    if (state.showEdit) {
      const fieldList = ['id', 'pmDesc', 'purchaserId', 'sampleGroupLeaderPersonId', 'pdPersonId'];
      if (state.demandType === 'Quantitative') {
        // 如果是需求类型是`量试需求(Quantitative)`，需要额外保存`下一节点处理人(主计划)`字段
        fieldList.push('quantitativePlanUserId', 'quantitativePlanUserName');
      }
      if (state.demandType === 'QuotationRequirements') {
        // 如果是需求类型是`报价需求(QuotationRequirements)`，需要额外保存`下一节点处理人(采购)`字段
        fieldList.push('purchaserId');
      }
      const list = gridApi.getDataSource().map(e => {
        const obj: any = pick(e, fieldList);
        if (e.deliveryTime) {
          obj.deliveryTime = dateUtil(e.deliveryTime).format('YYYY-MM-DD');
        }
        return obj;
      });
      changeOkLoading(true);
      const method = type == 'storage' ? storageReview : updateapply;
      method(list)
        .then(() => {
          changeOkLoading(true);
          createMessage.success(t('sys.api.operationSuccess'));
          emits('reload');
          closePopup();
        })
        .catch(() => {
          changeOkLoading(false);
        });
    } else {
      closePopup();
    }
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
    // 采购员 复制粘帖处理
    handleAfterPasterUser(cols, rows, { id: 'purchaserId', name: 'purchaserName' });
    // 样品组人员 复制粘帖处理
    handleAfterPasterUser(cols, rows, { id: 'sampleGroupLeaderPersonId', name: 'sampleGroupLeaderPersonName' });
    // 下一节点处理人(主计划) 复制黏贴处理
    handleAfterPasterUser(cols, rows, { id: 'quantitativePlanUserId', name: 'quantitativePlanUserName' });
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

<style lang="less">
  :deep(.lydc-basic-table-action button i) {
    font-size: 18px;
  }

  .requirement-pop {
    display: flex;
    flex-direction: column;
    padding-bottom: 10px;
  }
</style>
