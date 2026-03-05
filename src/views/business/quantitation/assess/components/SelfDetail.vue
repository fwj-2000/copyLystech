<template>
  <BasicPopup
    v-bind="$attrs"
    :showOkBtn="state.showEdit"
    :okText="t('common.submit')"
    :okButtonProps="{ class: 'mr-12px' }"
    :showCancelBtn="true"
    :cancelButtonProps="{ class: 'mr-12px' }"
    :cancelText="t('common.cancelText')"
    :title="title"
    class="full-popup pb-10px"
    :toolbarHeight="60"
    @register="registerPopup"
    @ok="handleSave">
    <template v-if="state.showEdit" #centerToolbar>
      <a-button type="primary" ghost @click="handleSave('storage')" class="my-12px ml-12px">{{ t('common.temporarySave') }}</a-button>
    </template>
    <div class="h-full requirement-pop">
      <Subtitle :title="t('common.reviewInfo')" class="mt-8px" :extra="{ show: state.type == 'add', hideAdd: true }"> </Subtitle>
      <Grid style="height: calc(100% - 50px)" />
    </div>
  </BasicPopup>
</template>
<script lang="ts" setup>
  import { reactive, ref, toRefs } from 'vue';
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { getQuantationReviewInfo, updateapply, storageReview } from '/@/api/business/quantitation';
  import { Subtitle } from '/@/components/Subtitle';
  import { selfCommonVxeCol, selfQuotaVxeCols, selfPriceVxeCols, selfSampleVxeCols, drawDemandVxe } from './tableConfig';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { getUserInfoList } from '/@/api/permission/user';
  import { getUserListByAccountList } from '/@/api/business/salesForecast';
  import { getNodeRemark } from '/@/adapter/utils';
  import { CURRENTNODE } from '../config';
  import { cloneDeep, pick } from 'lodash-es';

  const emits = defineEmits(['register', 'reload']);

  interface State {
    type: 'add' | 'review' | 'view';
    listQuery: any;
    title: string;
    showEdit: boolean;
  }

  const { t } = useI18n();
  const state = reactive<State>({
    type: 'add',
    listQuery: {
      category: 'Web',
      keyword: '',
      type: '',
      enabledMark: '',
    },
    title: '',
    showEdit: false,
  });
  const { title } = toRefs(state);

  const { createMessage } = useMessage();
  const menuTableColumns = ref<any>(selfCommonVxeCol);

  const [registerPopup, { closePopup, changeOkLoading, changeLoading }] = usePopupInner(init);
  const demandTypeReflect = {
    Quantitative: selfQuotaVxeCols,
    EngineeringSamples: selfSampleVxeCols,
    BusinessSamples: selfSampleVxeCols,
    QuotationRequirements: selfPriceVxeCols,
    DrawingsReviewReq: drawDemandVxe,
  };

  const [Grid, gridApi] = useVbenVxeGrid({
    showSearchForm: false,
    gridOptions: {
      id: 'business-quantitation-assess-self-edit',
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
    state.title = t('common.detailText');
    state.type = data.type || 'add';
    const showEdit = state.type === 'review';
    state.showEdit = showEdit;
    gridApi.setGridOptions({ editConfig: { enabled: showEdit } });
    try {
      const res = await getQuantationReviewInfo(data.id);
      let cols = [...(demandTypeReflect[res.data[0].demandType] || selfCommonVxeCol)];
      menuTableColumns.value = cols;
      await gridApi.reloadColumn(menuTableColumns.value);

      gridApi.reloadData(
        res.data.map((item: any) => {
          if (item.nodeRemark) {
            item.pmDesc = getNodeRemark(item.nodeRemark, CURRENTNODE);
          }
          return item;
        }),
      );
      changeLoading(false);
    } catch (error) {
      console.log(error);
      closePopup();
    }
  }

  function handleSave(type) {
    let list;
    if (state.showEdit) {
      const datalist = gridApi.getDataSource();
      list = datalist.map(e => pick(e, ['id', 'pmDesc', 'sampleGroupLeaderPersonId', 'pdPersonId']));
      // if(datalist[0].demandType === 'Quantitative'){
      //    list = datalist.map(e => pick(e, ['id', 'pmDesc', 'sampleGroupLeaderPersonId', 'pdPersonId']));
      // }else{
      // }
      // const list =
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
    // PD 复制粘帖处理
    handleAfterPasterUser(cols, rows, { id: 'pdPersonId', name: 'pdName' });
    // 样品组人员 复制粘帖处理
    handleAfterPasterUser(cols, rows, { id: 'sampleGroupLeaderPersonId', name: 'sampleGroupLeaderPersonName' });
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
    ])
      .then(res => {
        const userList = [
          ...(res[0]?.data?.list || []),
          ...Object.values(res[1]?.data || {}).map((item: any) => ({ ...item, fullName: item.MergeName, id: item.Id })),
        ];
        rows.forEach((row: any) => {
          const target = userList.find(item => item.id === row[fieldConfig.id] || item.fullName === row[fieldConfig.id]);
          gridApi.grid.setRow(row, { [fieldConfig.id]: target?.id || '', [fieldConfig.name]: target?.fullName || '' });
        });
      })
      .catch(e => {
        console.warn('🚀 ~ rows.forEach ~ e:', e);
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

  :deep(.lydc-basic-popup-header) {
    padding-left: 12px;
  }
</style>
