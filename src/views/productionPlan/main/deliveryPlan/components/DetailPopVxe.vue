<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    :showOkBtn="state.isEditMode"
    :showCancelBtn="true"
    :okText="t('common.submitText')"
    :title="title"
    destroyOnClose
    @ok="handleSubmit"
    class="full-popup">
    <template #insertToolbar>
      <a-button v-if="state.planType == '2' && state.isEditMode" class="mr-3" @click="handleCalDeliveryPlanQty" type="primary" ghost>
        {{ t('common.calText') }}
      </a-button>
      <a-button v-if="state.isEditMode" class="mr-3" @click="handleSubmit('storage')" type="primary" ghost>
        {{ t('common.temporarySave') }}
      </a-button>
      <a-divider type="vertical" class="ml-10px"></a-divider>
    </template>

    <div class="h-full p-10px">
      <template v-if="state.planType === '1'">
        <McGrid>
          <template #toolbar-actions>
            <div style="position: relative; top: 8px">
              <Subtitle :title="title"></Subtitle>
            </div>
          </template>

          <template #engineeringRemarks="{ row }">
            <a-tooltip :title="richTextToPlainText(row.engineeringRemarks)">
              <div v-html="row.engineeringRemarks"></div>
            </a-tooltip>
          </template>

          <template #pdReview="{ row }">
            <span class="table-a" @click="openPdDetailFn(row)"> {{ t('common.viewDetails') }} </span>
          </template>

          <template #expand="{ row }">
            <template v-if="row.productionType == 1">
              <div class="p-10px">
                <span style="font-weight: bold">{{ t('common.process') }}</span>
              </div>
              <div style="max-width: 1200px">
                <BasicTable @register="registerSubTable" :dataSource="row.quantitativePlanProcesses"></BasicTable>
              </div>
            </template>
            <template v-else>
              <div class="p-10px">{{ t('common.noProcessTip') }}</div>
            </template>
          </template>
        </McGrid>
      </template>

      <template v-else>
        <DcGrid>
          <template #toolbar-actions>
            <div style="position: relative; top: 8px">
              <Subtitle :title="title"></Subtitle>
            </div>
          </template>

          <template #engineeringRemarks="{ row }">
            <a-tooltip :title="richTextToPlainText(row.engineeringRemarks)">
              <div v-html="row.engineeringRemarks"></div>
            </a-tooltip>
          </template>

          <template #pdReview="{ row }">
            <span class="table-a" @click="openPdDetailFn(row)"> {{ t('common.viewDetails') }} </span>
          </template>

          <template #expand="{ row }">
            <template v-if="row.productionType == 1">
              <div class="p-10px">
                <span style="font-weight: bold">{{ t('common.process') }}</span>
              </div>
              <div style="max-width: 1200px">
                <BasicTable @register="registerSubTable" :dataSource="row.quantitativePlanProcesses"></BasicTable>
              </div>
            </template>
            <template v-else>
              <div class="p-10px">{{ t('common.noProcessTip') }}</div>
            </template>
          </template>
        </DcGrid>
      </template>
    </div>
  </BasicPopup>
</template>

<script setup lang="ts">
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { Subtitle } from '/@/components/Subtitle';
  import { setDynamicTitle } from './configVxe';
  import { getSubColumns } from '../config';
  import { useMessage } from '/@/hooks/web/useMessage';
  import BasicTable from '/@/components/Table/src/BasicTable.vue';
  import { useTable } from '/@/components/Table';
  import { storageDetail, updateAPI, getDetails, getDyColTitle, storageDcDetail, updateDcAPI, getDcDetails } from '/@/api/productionPlan/deliveryPlan';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { formatTableDefaultText } from '/@/utils';
  import { computed, reactive, nextTick } from 'vue';
  import dayjs from 'dayjs';
  import { trim, replace } from 'lodash-es';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { useRouter } from 'vue-router';
  import { getUserInfoList } from '/@/api/permission/user';
  import { getUserListByAccountList } from '/@/api/business/salesForecast';

  const router = useRouter();
  const { createMessage } = useMessage();

  const emits = defineEmits(['reload']);
  const [registerPopup, { closePopup, changeLoading, changeOkLoading }] = usePopupInner(init);

  const { t } = useI18n();
  const state = reactive({
    planType: '2', // 1: 模切计划， 2： 交货计划
    dynamicKeys: {},
    dynamicPrefix: '_time_',
    expandAll: true,
    isEditMode: true,
  });

  const title = computed(() => {
    return state.planType == '1' ? t('common.mcPlan') : t('common.dcPlan');
  });

  const [registerSubTable] = useTable({
    columns: getSubColumns(),
    useSearchForm: false,
    immediate: false,
    striped: true,
    ellipsis: true,
    canResize: false,
    pagination: false,
    showIndexColumn: false,
    showTableSetting: false,
    transformCellText: ({ text }) => formatTableDefaultText(text),
    i18nConfig: {
      moduleCode: 'EngineeringInformationColumn',
    },
  });

  const baseGridOptions = {
    height: 'auto',
    columns: [] as any[],
    editConfig: {
      trigger: 'dblclick',
      mode: 'row',
    },
    pagerConfig: {
      autoHidden: true,
    },
    toolbarConfig: {
      refresh: false,
      slots: {
        tools: 'buttons',
      },
    },
    clipConfig: {
      isPaste: true,
      afterPasteMethod: handleAfterPaster,
    },
    areaConfig: {
      multiple: true,
    },
    i18nConfig: {
      moduleCode: 'QuantitativeDiecuttingPlanColumn',
    },
    position: 'modal',
  } as const;

  const [McGrid, mcGridApi] = useVbenVxeGrid({
    showSearchForm: false,
    gridOptions: {
      ...baseGridOptions,
      id: 'productionPlan-main-deliveryPlan-detail-mc',
    },
  });

  const [DcGrid, dcGridApi] = useVbenVxeGrid({
    showSearchForm: false,
    gridOptions: {
      ...baseGridOptions,
      id: 'productionPlan-main-deliveryPlan-detail-dc',
    },
  });

  const curGridApi = computed(() => (state.planType === '1' ? mcGridApi : dcGridApi));

  function waitGridReady(maxFrame = 90) {
    return new Promise<void>(resolve => {
      let n = 0;
      const loop = () => {
        const grid = (curGridApi.value as any)?.grid;
        if (grid && typeof grid.reloadColumn === 'function') return resolve();
        if (n++ >= maxFrame) return resolve();
        requestAnimationFrame(loop);
      };
      loop();
    });
  }

  async function reloadColumn(columns: any[]) {
    await waitGridReady();
    return curGridApi.value.reloadColumn(columns);
  }

  async function reloadData(list: any[]) {
    await waitGridReady();
    return curGridApi.value.reloadData(list);
  }

  async function getDataSource() {
    await waitGridReady();
    return curGridApi.value.getDataSource();
  }

  async function init(data: any) {
    changeLoading(true);

    state.planType = data.planType || '2';

    await nextTick();
    await waitGridReady();

    try {
      if (state.planType === '2') {
        // 获取动态表头
        const titles = await getDyColTitle(data.ids);
        const obj = setDynamicTitle(titles.data, {
          planType: state.planType,
          editable: true,
          dynamicPrefix: state.dynamicPrefix,
        });
        await reloadColumn(obj.column);
        state.dynamicKeys = obj.dynamicKeys;
        await handleDetail(data.ids);
      } else {
        const obj = setDynamicTitle([], {
          planType: '1',
          editable: true,
          dynamicPrefix: state.dynamicPrefix,
        });
        await reloadColumn(obj.column);
        await handleDetail(data.ids);
      }
    } catch (e) {
      console.error(e);
      return closePopup();
    } finally {
      changeLoading(false);
    }
  }

  async function handleDetail(ids: any) {
    const r = state.planType == '1' ? await getDcDetails(ids) : await getDetails(ids);
    if (r.code == 200) {
      const { data } = r;
      let _isEditMode = false;
      const list = data.map(item => {
        // [6, 4, 3, 12].includes(item.status) ? (_isEditMode = true) : _isEditMode;
        if ([6, 4, 3, 12].includes(item.status)) {
          _isEditMode = true;
        }
        item = {
          ...item,
          ...state.dynamicKeys,
          deliveryPlanRemark: item.diecuttingRemark ?? item.mcRemark,
          diecuttingRemark: item.diecuttingRemark ?? item.mcRemark,
          remark: item.remark ?? item.mcRemark,
        };

        if (state.planType == '2') {
          const { deliveryPlanList } = item;
          if (deliveryPlanList) {
            deliveryPlanList.map((el: any) => {
              const _time = dayjs(el.deliveryPlanTime).tz().format('YYYY/MM/DD');
              item[state.dynamicPrefix + _time] = el.deliveryPlanQty;
            });
          }
          delete item.deliveryPlanRemark;
        }
        return item;
      });

      state.isEditMode = _isEditMode;
      await reloadData(list);
    }
  }

  // 计算交付计划总额
  function handleCalDeliveryPlanQty() {
    curGridApi.value.getDataSource().forEach((record: any) => {
      let sum = 0;
      for (let k in record) {
        if (k.indexOf(state.dynamicPrefix) > -1) {
          const curentNum = Number(record[k]);
          sum += Number.isNaN(curentNum) ? 0 : curentNum;
        }
      }
      record.deliveryPlanQty = sum;
      return record;
    });
    createMessage.success(t('sys.api.operationSuccess'));
  }

  async function handleDcSave(type: any) {
    changeOkLoading(true);
    const params = (await getDataSource()).map((item: any) => {
      return {
        id: item.id,
        diecuttingPlanRemark: item.diecuttingPlanRemark,
        // 模切 - 备注
        remark: item.remark,
        mainPlanUserId: item.mainPlanUserId,
        mainPlanUserName: item.mainPlanUserName,
      };
    });
    try {
      const r = type == 'storage' ? await storageDcDetail(params) : await updateDcAPI(params);
      if (r.code == 200) {
        createMessage.success(t('sys.api.operationSuccess'));
        // 暂存不退出
        if (type != 'storage') {
          closePopup();
          emits('reload');
        }
      }
      changeOkLoading(false);
    } catch (error) {
      console.log(error);
      changeOkLoading(false);
    }
  }

  function handleAfterPaster({ targetAreas }: any) {
    if (targetAreas.length === 0) return false;
    const { cols, rows } = targetAreas[0];

    // `下一节点处理人(模切计划)` 复制粘帖处理
    handleAfterPasterUser(cols, rows, { id: 'mainPlanUserId', name: 'mainPlanUserName' });
    return true;
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
        const target = userList.find((item: any) => item.id === row[fieldConfig.id] || item.fullName === row[fieldConfig.id]);
        (curGridApi.value as any).grid.setRow(row, { [fieldConfig.id]: target?.id || '', [fieldConfig.name]: target?.fullName || '' });
      });
    });
  }

  // 跳转到量试订单评审详情
  function openPdDetailFn(data) {
    const { engineeringInformationId } = data;
    router.push(`/engineering/data/produce?id=${engineeringInformationId}&type=view`);
  }

  // 交货计划
  async function handleDeSave(type) {
    changeOkLoading(true);
    // 校验交付计划是否有值
    let hasDeSum = false;

    const params = (await getDataSource()).map((item: any) => {
      const _times: any = [];
      for (let k in item) {
        if (k.indexOf(state.dynamicPrefix) > -1) {
          _times.push({
            deliveryPlanTime: k.replace(state.dynamicPrefix, ''),
            deliveryPlanQty: item[k],
          });
          if (item[k] > 0) hasDeSum = true;
        }
      }
      return {
        id: item.id,
        crInputDeliveryPlans: _times,
        // 交货 - 交付计划
        deliveryPlan: item.deliveryPlan,
        // 交货 - 备注
        deliveryPlanRemark: item.deliveryPlanRemark,
      };
    });
    if (type != 'storage' && !hasDeSum) {
      changeOkLoading(false);
      return createMessage.error('请填写交付计划数量');
    }
    try {
      const r = type == 'storage' ? await storageDetail(params) : await updateAPI(params);
      if (r.code == 200) {
        createMessage.success(t('sys.api.operationSuccess'));
        closePopup();
        emits('reload');
      }
      changeOkLoading(false);
    } catch (error) {
      console.log(error);
      changeOkLoading(false);
    }
  }

  async function handleSubmit(type?: any) {
    state.planType == '1' ? handleDcSave(type) : handleDeSave(type);
  }

  // 复制富文本
  function richTextToPlainText(html) {
    if (!html) return '';

    // 创建一个临时的div元素来解析HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;

    // 获取纯文本内容
    let text = tempDiv.textContent || tempDiv.innerText || '';

    // 使用lodash处理文本
    text = trim(text);
    text = replace(text, /\s+/g, ' '); // 将多个空白字符替换为单个空格
    text = replace(text, /\n\s*\n/g, '\n'); // 清理多余的空行

    return text;
  }
</script>
<style lang="less" scoped>
  .rotate-wrap {
    width: var(--vxe-ui-button-height-small);
    height: var(--vxe-ui-button-height-small);
  }

  .rotate-90 {
    transform: rotate(90deg);
    transition: all 0.35s ease;
  }

  .rotate-240 {
    transform: rotate(270deg);
    transition: all 0.35s ease;
  }
</style>
