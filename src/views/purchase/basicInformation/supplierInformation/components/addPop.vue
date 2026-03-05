<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    :showOkBtn="!isViewModel"
    :showCancelBtn="true"
    :title="getTitle"
    :destroyOnClose="true"
    :cancel-text="t('common.cancelText')"
    :showFooter="false"
    @ok="handleSubmit"
    :ok-text="t('common.submit')"
    class="full-popup">
    <ScrollContainer style="background: #ebeef5">
      <div class="mt-16px" style="height: 400px">
        <basicInfo ref="basicInfoRef" id="basicInfoRef" :tableData="historyData" @onSupplierTypeChange="handleSupplierTypeChange"></basicInfo>
        <AddressGrid ref="addressRef" />
        <ConcatModuleGrid ref="concatRef" />
        <!--        <dynamicTable ref="addressRef" id="addressRef" :tableData="historyData"></dynamicTable>-->
        <!--        <dynamicTable ref="concatRef" id="concatRef" :tableData="historyData"></dynamicTable>-->
      </div>
    </ScrollContainer>
  </BasicPopup>
</template>
<script setup lang="ts">
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import basicInfo from './basicInfo.vue';
  import { computed, nextTick, onMounted, reactive, ref, unref } from 'vue';
  import { ScrollContainer } from '/@/components/Container';
  // import dynamicTable from './dynamicTable/index.vue';
  import { address_columns, concat_columns, ADDRESS_MODULE_TEMPLATE, CONCAT_MODULE_TEMPLATE, getConcatColumns } from './dynamicTable/config';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { addBaseDataSupplier, editBaseDataSupplier, getBaseDataSupplierDetail } from '/@/api/purchase/supplierInformation';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { cloneDeep } from 'lodash-es';
  import AddressGrid from './AddressGrid.vue';
  import ConcatModuleGrid from './ConcatModuleGrid.vue';

  interface State {
    title: string;
    id: string;
    type: 'add' | 'edit' | 'view';
    cacheData: any;
    supplierType: 'Inside' | 'External';
  }
  const { t } = useI18n();

  const state = reactive<State>({
    title: '',
    id: '',
    type: 'add',
    cacheData: [],
    supplierType: 'Inside',
  });
  const isViewModel = computed(() => state.type === 'view');
  const emits = defineEmits(['reload']);

  const [registerPopup, { closePopup, changeLoading, changeOkLoading }] = usePopupInner(init);
  const { createMessage, createConfirm } = useMessage();

  const basicInfoRef = ref();
  const addressRef = ref();
  const concatRef = ref();
  const historyData = ref();
  const getTitle = computed(() => (state.id ? t('common.editText') : t('common.addText')));

  onMounted(() => {});
  async function getBaseDataSupplierDetailFn() {
    try {
      const { data, code } = await getBaseDataSupplierDetail({ id: state.id });
      if (code === 200) {
        return data;
      }
      return [];
    } catch (error) {
      console.error(error, 'getBaseDataSupplierDetailFn is error');
    }
  }

  async function init(data) {
    state.id = data.id;
    state.type = data.type;
    state.cacheData = data.cacheData || {};
    if (state.id && !data.cacheData) {
      state.cacheData = await getBaseDataSupplierDetailFn();
      if (state.cacheData?.addressList?.length) {
        state.cacheData.addressList = state.cacheData.addressList.map(item => {
          if (item.provinceCityIds) {
            item.provinceCityIds = item.provinceCityIds.split(',');
          }
          return item;
        });
      }
    }
    initSettingFn(state.cacheData);
  }

  function initSettingFn(cacheData) {
    state.supplierType = cacheData.supplierType ? cacheData.supplierType : state.supplierType;
    nextTick(() => {
      unref(basicInfoRef).init({ tableData: cacheData, openModel: state.type });
      unref(addressRef).init({
        title: t('dict.Common.supplierAddress'),
        columns: address_columns,
        template: ADDRESS_MODULE_TEMPLATE,
        tableData: cacheData.addressList,
        openModel: state.type,
      });
      unref(concatRef).init({
        title: t('dict.CommonCol.supplierContact'),
        columns: getConcatColumns(state.supplierType),
        template: CONCAT_MODULE_TEMPLATE,
        tableData: cacheData.contactsList,
        openModel: state.supplierType === 'Inside' ? state.type : 'view',
      });
    });
  }

  async function addOrEditBaseDataSupplierFn(params) {
    const api = params.id ? editBaseDataSupplier : addBaseDataSupplier;

    changeOkLoading(true);
    try {
      const { code } = await api(params);
      if (code === 200) {
        closePopup();
        createMessage.success(t('common.saveSuccessText'));
        emits('reload');
      }
    } catch (error) {
      console.error(error, 'handleSubmit');
    } finally {
      changeOkLoading(false);
    }
  }

  async function handleSubmit(type = 1) {
    changeLoading(true);
    try {
      const [basicInfoList, addressList, contactsList] = await Promise.all([
        basicInfoRef.value.getParamsFn(type),
        addressRef.value.getDataSource(type),
        concatRef.value.getDataSource(type),
      ]);

      if ([basicInfoList, addressList, contactsList].includes(false)) {
        return;
      }
      const _addressList = cloneDeep(addressList).map(item => {
        item.provinceCityIds = Array.isArray(item.provinceCityIds) ? item.provinceCityIds.join(',') : item.provinceCityIds || '';
        return item;
      });
      const params = {
        type,
        ...basicInfoList,
        addressList: _addressList,
        contactsList: contactsList,
      };
      if (state.id) {
        params.id = state.id;
      }
      addOrEditBaseDataSupplierFn(params);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      changeLoading(false);
    }
  }

  function handleSupplierTypeChange(type: State['supplierType']): void {
    state.supplierType = type;
    unref(concatRef).reloadColumn(getConcatColumns(type));
    // unref(concatRef).proxyOperaFn('setColumns', concat_columns(type));
    // 内部供应商，联系人为必填项，如果是外部供应商，则置灰不可填写，并且清空数据
    // const isInside = type === 'Inside';
    // unref(concatRef).init({
    //   title: t('dict.CommonCol.supplierContact'),
    //   columns: concat_columns(type),
    //   template: CONCAT_MODULE_TEMPLATE,
    //   tableData: isInside ? state.cacheData.contactsList : [],
    //   openModel: isInside ? state.type : 'view',
    // });
  }
</script>

<style lang="less" scoped>
  .scroll-tab {
    position: absolute;
    left: 210px;
    display: flex;
    border-left: 2px solid #e5e5e5;
    height: 40px;
    padding-left: 20px;

    &-item {
      width: 60px;
      height: 44px;
      line-height: 46px;
      margin-right: 12px;
      text-align: center;
    }
  }

  .active-btn {
    border-bottom: 4px solid @primary-color;
  }

  .print-icon {
    cursor: pointer;
    margin-right: 12px;

    i {
      font-size: 26px;

      &:hover {
        color: @primary-color;
      }
    }
  }

  :deep(.lydc-basic-popup-header) {
    padding-left: 12px;
  }
</style>
