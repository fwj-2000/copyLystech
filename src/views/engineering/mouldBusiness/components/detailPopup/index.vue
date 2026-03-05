<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    :showOkBtn="false"
    :showCancelBtn="false"
    :title="title"
    :destroyOnClose="true"
    :showFooter="false"
    @ok="handleSubmit"
    :okText="t('common.submit')"
    :okButtonProps="{ class: 'mr-12px' }"
    class="full-popup">
    <template #centerToolbar>
      <template v-if="isCanEdit">
        <!-- 暂存 -->
        <a-button type="primary" ghost class="ml-12px" :loading="loading" @click="() => handleSubmit(false)">{{ t('common.temporarySave') }}</a-button>
        <!-- 提交 -->
        <a-button type="primary" class="ml-12px" :loading="loading" @click="() => handleSubmit(true)">{{ t('common.submitText') }}</a-button>
      </template>

      <template v-else-if="isCanAudit">
        <!-- 驳回/不同意 -->
        <a-button type="primary" ghost class="ml-12px" :loading="loading" @click="() => handleReject()">{{
          isPurchase ? t('common.disagree') : t('common.rejectText')
        }}</a-button>
        <!-- 同意 -->
        <a-button type="primary" class="ml-12px" :loading="loading" @click="() => handeleAgree()">{{ t('common.agree') }}</a-button>
      </template>
    </template>

    <div class="h-full pt-10px pb-10px">
      <CompareTable v-if="isModify" ref="compareTableRef" />
      <DataTable v-else ref="dataTableRef" />
    </div>

    <RejectModal @register="registerRejectModal" />
  </BasicPopup>
</template>

<script lang="ts" setup>
  import { ref, nextTick } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { DETAIL_POPUP_MODE, ITEM_TYPE_ENUM, confirmModify } from './config';
  import { useMessage } from '/@/hooks/web/useMessage';
  import {
    getMoldDetailBySubIds,
    getMoldapplyDetail,
    bulkAuditagree,
    bulkAuditreject,
    addMoldapply,
    getMoldCompareDetail,
    purchaseModifyAgree,
    purchaseModifyDisagree,
  } from '/@/api/engineering/mould';
  import { useModal } from '/@/components/Modal';
  import { isFileSizeExceeded } from '/@/views/engineering/mouldBusiness/components/config';

  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import RejectModal from '../rejectModal.vue';
  import DataTable from './dataTable.vue';
  import CompareTable from './compareTable.vue';

  const emits = defineEmits(['reload']);

  const { createMessage } = useMessage();
  const { t } = useI18n();
  const dataTableRef = ref<InstanceType<typeof DataTable>>();
  const compareTableRef = ref<InstanceType<typeof CompareTable>>();

  /** 弹窗数据列表 */
  const dataList = ref<Array<any>>([]);
  /** 弹窗标题 */
  const title = ref<string>(t('common.detailText'));
  /** 弹窗模式 */
  const mode = ref<DETAIL_POPUP_MODE>(DETAIL_POPUP_MODE.详情);
  /** 选中子级的记录ID集合 */
  const ids = ref<Array<string>>([]);
  /** 父级的记录ID集合 */
  const pid = ref<string>('');
  /** 是否可编辑 */
  const isCanEdit = ref<boolean>(false);
  /** 是否可审核 */
  const isCanAudit = ref<boolean>(false);
  /** 是否为采购 */
  const isPurchase = ref<boolean>(false);
  /** 弹窗加载状态 */
  const loading = ref<boolean>(false);

  const [registerPopup, { changeLoading, closePopup }] = usePopupInner(init);

  /** 【单据类型】是否为【修改】 */
  const isModify = ref<boolean>(false);

  function init(data: { pid: string; ids: string[]; title?: string; mode?: DETAIL_POPUP_MODE; isPurchase?: boolean; isModify?: boolean }) {
    // 初始化数据
    pid.value = data.pid || '';
    ids.value = data.ids || [];
    title.value = data?.title || t('common.detailText');
    mode.value = data?.mode || DETAIL_POPUP_MODE.详情;
    isPurchase.value = data?.isPurchase || false;
    // 判断是否可编辑，根据弹窗模式判断
    isCanEdit.value = mode.value === DETAIL_POPUP_MODE.编辑;
    // 判断是否可审核，根据弹窗模式判断
    isCanAudit.value = mode.value === DETAIL_POPUP_MODE.审核;
    isModify.value = data?.isModify || false;

    // 获取详情
    isModify.value ? getCompareDetail() : getDetail();
  }

  /** 获取详情 */
  function getDetail() {
    if (!ids.value.length && !pid.value) return;
    const api = pid.value ? getMoldapplyDetail(pid.value) : getMoldDetailBySubIds(ids.value);

    changeLoading(true);
    api
      .then(res => {
        const list: Array<any> = Array.isArray(res?.data) ? res.data : [];
        dataList.value = list;
        // 判断是否为【修改】
        isModify.value = mode.value !== DETAIL_POPUP_MODE.详情 && list.some(item => `${item.itemType}` === `${ITEM_TYPE_ENUM.修改审批}`);
        nextTick(() => {
          // 初始化表格数据
          dataTableRef.value && dataTableRef.value.reloadData(list, isCanEdit.value, mode.value === DETAIL_POPUP_MODE.详情);
          isModify.value && getCompareDetail();
        });
      })
      .finally(() => {
        changeLoading(false);
      });
  }

  /** 获取对比详情 */
  function getCompareDetail() {
    if (!ids.value.length) return;

    changeLoading(true);
    getMoldCompareDetail(ids.value)
      .then(res => {
        const list = Array.isArray(res?.data?.list) ? res.data.list : [];
        dataList.value = list;
        // 初始化对比表格数据
        compareTableRef.value &&
          compareTableRef.value.reloadData({
            beforeData: Array.isArray(res?.data?.oldList) ? res.data.oldList : [],
            afterData: list,
          });
      })
      .finally(() => {
        changeLoading(false);
      });
  }

  function setLoading(isLoading: boolean) {
    loading.value = isLoading;
    changeLoading(isLoading);
  }

  /**
   * 编辑 - 提交处理
   * @param isSubmit 是否提交，否为暂存
   */
  async function handleSubmit(isSubmit = false) {
    const data = await dataTableRef.value?.getDataSource(true);
    if (!data) {
      return false;
    }

    const fileSizeExceededIndex = data.findIndex(el => isFileSizeExceeded(el.moldDrawings));
    if (fileSizeExceededIndex > -1) {
      createMessage.warning(t('dict.MoldApply.fileMaxSize', [fileSizeExceededIndex + 1, '10M']));
      return false;
    }

    setLoading(true);
    addMoldapply({
      list: data,
      type: isSubmit ? 1 : 0,
      saveType: 1,
      moldNoType: data[0].moldNoType,
    })
      .then(() => {
        createMessage.success(t('sys.api.operationSuccess'));
        emits('reload');
        isSubmit && closePopup();
      })
      .finally(() => {
        setLoading(false);
      });
  }

  /**
   * 审核 - 同意
   */
  async function handeleAgree() {
    let moldPhysicalStatus: any = '';
    if (isPurchase.value) {
      moldPhysicalStatus = await confirmModify(dataList.value);
    }

    // 判断是否为采购审核，调用不同的接口
    const api = isPurchase.value ? purchaseModifyAgree({ ids: ids.value, moldPhysicalStatus }) : bulkAuditagree({ ids: ids.value });

    setLoading(true);
    api
      .then(() => {
        createMessage.success(t('sys.api.operationSuccess'));
        closePopup();
        emits('reload');
      })
      .finally(() => {
        setLoading(false);
      });
  }

  const [registerRejectModal, { openModal: openRejectModal }] = useModal();
  /**
   * 审核 - 驳回/不同意
   */
  function handleReject() {
    const api = isPurchase.value ? purchaseModifyDisagree : bulkAuditreject;

    openRejectModal(true, {
      ids: ids.value,
      title: isPurchase.value ? t('common.disagree') : t('common.rejectText'),
      rejectApi: (params: { reason: string }) =>
        api({ ids: ids.value, rejectRemark: params.reason }).then(() => {
          createMessage.success(t('sys.api.operationSuccess'));
          closePopup();
          emits('reload');
        }),
    });
  }
</script>

<style scoped lang="less">
  div.pb-none {
    padding-bottom: 0;
  }

  :deep(.ant-form .ant-form-item) {
    margin-bottom: 0;

    + .ant-form-item {
      flex: 1;
    }
  }
</style>
