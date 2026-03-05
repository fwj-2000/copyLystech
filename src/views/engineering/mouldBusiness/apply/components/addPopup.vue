<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    :showOkBtn="true"
    :showCancelBtn="false"
    :title="title"
    :destroyOnClose="true"
    :closeFunc="handleClose"
    :showFooter="false"
    @ok="handleSubmit"
    :okText="t('common.submit')"
    :okButtonProps="{ class: 'mr-12px' }"
    class="full-popup">
    <template #centerToolbar>
      <a-button type="primary" :loading="loading" ghost class="ml-12px" @click="setLocalCacheDataFn">{{ t('common.temporarySave') }}</a-button>
    </template>
    <div class="h-full pt-10px">
      <AddTable :dataSource="state.tableData" ref="AddTableRef"></AddTable>
    </div>
  </BasicPopup>
</template>
<script lang="ts" setup>
  import { reactive, toRefs, unref, ref } from 'vue';
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { addMoldapply, getDraftlist, getMoldDetailBySubIds } from '/@/api/engineering/mould';
  import { MODULE_TEMPLATE } from './config';
  import AddTable from './addTable.vue';
  import { useBaseStore } from '/@/store/modules/base';
  import { omit } from 'lodash-es';
  import { isFileSizeExceeded } from '/@/views/engineering/mouldBusiness/components/config';

  const emits = defineEmits(['register', 'reload']);
  interface State {
    title: string;
    mouldNo: string;
    id: string;
    orgId: string;
    processRouteItem: any;
    bindMaterialList: any[];
    tableData: any[];
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
    tableData: [],
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
  const baseStore = useBaseStore();
  const { createMessage } = useMessage();
  const [registerPopup, { closePopup, changeLoading, changeOkLoading }] = usePopupInner(init);

  function setLocalCacheDataFn() {
    handleSubmit(0);
  }

  async function handleClose() {
    return true;
  }

  const loading = ref(false);
  function setLoading(val: boolean) {
    loading.value = val;
    changeLoading(val);
    changeOkLoading(val);
  }

  async function handleSubmit(type: 0 | 1 = 1) {
    if (type === 1) {
      const isValid = await unref(AddTableRef).validateAddData();
      if (!isValid) return;
    }

    const { tableData, moldNoType } = unref(AddTableRef).getDataSource();
    state.tableData = tableData;

    if (!Array.isArray(tableData) || tableData.length === 0) {
      createMessage.warning(t('common.noDataToSave'));
      return;
    }

    const fileSizeExceededIndex = tableData.findIndex(el => isFileSizeExceeded(el.moldDrawings));
    if (fileSizeExceededIndex > -1) {
      createMessage.warning(t('dict.MoldApply.fileMaxSize', [fileSizeExceededIndex + 1, '10M']));
      return false;
    }

    setLoading(true);
    try {
      const { code } = await addMoldapply({ list: state.tableData, type, moldNoType, saveType: 0 });
      if (code === 200) {
        createMessage.success(t('common.saveSuccessText'));
        if (type === 1) {
          closePopup();
          emits('reload');
        } else {
          await getDraftlistFn();
        }
      }
    } catch (error) {
      console.error(error, 'handleSubmit');
    } finally {
      setLoading(false);
    }
  }

  function init({ copyIds, title }) {
    state.title = title;
    state.mouldNo = '';
    row.value = 1;

    if (Array.isArray(copyIds) && copyIds.length) {
      return setTableDataByCopyIds(copyIds);
    }

    getDraftlistFn();
  }

  async function getDraftlistFn() {
    unref(AddTableRef).setLoading(true);
    try {
      const { data, code } = await getDraftlist();
      if (code === 200) {
        if (data?.length) {
          const dicts = await Promise.all(
            ['MoldApply.MoldType', 'MoldApply.ProjectPhase', 'SapFactoryMaterial', 'MoldApply.UrgentLevel'].map(async key => {
              const dict = ((await baseStore.getDictionaryData(key)) as any[]).reduce((acc, curr) => {
                acc[curr.enCode] = curr.fullName;
                return acc;
              }, {});
              return dict;
            }),
          );
          state.tableData = data.map(o => {
            o.urgentLevel = o.urgentLevel ? o.urgentLevel : 1;
            o.businessType = o.businessType ? o.businessType : null;
            o.moldTypeName = dicts[0][o.moldType]; //新表格需要这个字段显示
            o.projectPhaseName = dicts[1][o.projectPhase];
            o.businessTypeName = dicts[2][o.businessType];
            o.urgentLevelName = dicts[3][o.urgentLevel];
            return o;
          });
        } else {
          state.tableData = [{ ...MODULE_TEMPLATE, id: 1 }];
          unref(AddTableRef).setTableData(state.tableData);
        }
      }
    } catch (error) {
      console.error(error, 'getDraftlistFn:error');
    } finally {
      unref(AddTableRef).setLoading(false);
    }
  }

  /**
   * 根据ID获取对应的数据赋值到表格中
   * @param copyIds 复制的源数据的id集合
   */
  async function setTableDataByCopyIds(copyIds: string[]) {
    AddTableRef.value.setLoading(true);
    return getMoldDetailBySubIds(copyIds)
      .then(res => {
        const list: Array<any> = Array.isArray(res?.data) ? res.data : [];
        state.tableData = list.map((item: any) =>
          omit(item, [
            'id',
            'headId',
            'status',
            'statusName',
            'detailSourceId',
            'itemType',
            'itemTypeName',
            'moldUse',
            'moldUseName',
            'requireDeliveryTime',
            'costCenter',
            'costAttribution',
          ]),
        );
        AddTableRef.value.setTableData(state.tableData);
      })
      .finally(() => {
        AddTableRef.value.setLoading(false);
      });
  }
</script>
