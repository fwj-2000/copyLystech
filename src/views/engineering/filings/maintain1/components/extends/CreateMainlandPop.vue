<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    :showCancelBtn="false"
    :title="state.title"
    :destroy-on-close="true"
    style="position: relative"
    class="top-0"
    contentHeight="100%">
    <div class="lydc-basic-cell-content">
      <ScrollContainer class="p-10px">
        <Subtitle title="交期确认"></Subtitle>
        <BasicTable @register="registerPackageEditTable">
          <!-- <template #bodyCell="{ column, record, index }">
            <template v-if="column.dataIndex === 'action'">
              <TableAction :actions="getPackageTableActions(index, record)" />
            </template>
          </template> -->
        </BasicTable>
      </ScrollContainer>
    </div>
  </BasicPopup>
  <!-- <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    :showOkBtn="true"
    :showCancelBtn="true"
    :title="state.title"
    destroyOnClose>
    <template #insertToolbar>
    </template>
    <div class="lydc-basic-cell-content">
      <ScrollContainer class="p-10px">
        <Subtitle title="交期确认"></Subtitle>
        <BasicTable @register="registerPackageEditTable">
        </BasicTable>
      </ScrollContainer>
    </div>
  </BasicPopup> -->
</template>
<script setup lang="ts">
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { Subtitle } from '/@/components/Subtitle';
  import { ScrollContainer } from '/@/components/Container';
  import { nextTick, reactive, ref, toRaw, toRefs } from 'vue';
  import { getColumns } from './config';
  import { cloneDeep } from 'lodash-es';
  import { useMessage } from '/@/hooks/web/useMessage';
  import BasicTable from '/@/components/Table/src/BasicTable.vue';
  import { ActionItem, BasicColumn, TableAction, useTable } from '/@/components/Table';
  import { storageDetail, updatePMDetail, getPMDetails } from '/@/api/productionPlan/mainplan';
  import { useI18n } from '/@/hooks/web/useI18n';
  import dayjs from 'dayjs';
  import { formatTableDefaultText } from '/@/utils';
  const { createMessage } = useMessage();

  const emits = defineEmits(['reload', 'register']);
  const [registerPopup] = usePopupInner(init);

  const state = reactive({
    total: 0,
    currentIndex: 0,
    ids: [],
    id: '',
    prefix: '_time_',
    title: '',
  });

  const { t } = useI18n();

  const [registerPackageEditTable] = useTable({
    columns: getColumns(),
    pagination: false,
    showTableSetting: false,
    striped: true,
    canResize: true,
    resizeHeightOffset: 20,
    transformCellText: ({ text }) => formatTableDefaultText(text),
    // actionColumn: {
    //   width: 120,
    //   title: '操作',
    //   dataIndex: 'action',
    // },
  });

  // function getPackageTableActions(index, record): ActionItem[] {
  //   return [
  //     {
  //       label: '',
  //       color: 'error',
  //       icon: 'icon-ym icon-ym-btn-add',
  //       onClick: handleChangePackage.bind(null, 'addBaseIndex', { index }),
  //     },
  //     {
  //       label: '',
  //       color: 'error',
  //       icon: 'icon-ym icon-ym-btn-copy',
  //       onClick: handleChangePackage.bind(null, 'copy', { index }),
  //     },
  //     {
  //       label: '',
  //       color: 'error',
  //       icon: 'icon-ym icon-ym-delete',
  //       modelConfirm: {
  //         onOk: handleChangePackage.bind(null, 'delete', { id: record.id }),
  //       },
  //     },
  //   ];
  // }

  async function init(data) {
    console.log(data, 'data');
    state.title = data?.title;
    // changeLoading(true);
    // try {
    //   const r = await getPMDetails(data.ids);
    //   if (r.code == 200) {
    //     let _cols: any = [];
    //     const _list = r.data.map(item => {
    //       item = {
    //         ...item,
    //         onEdit: true,
    //         editable: true,
    //       };
    //       item?.deliveryPlanList.map(el => {
    //         const _time = dayjs(el.deliveryPlanTime).format('YYYY/MM/DD');
    //         item[state.prefix + _time] = el.deliveryPlanQty;
    //         _cols.push({
    //           title: _time,
    //           dataIndex: state.prefix + _time,
    //         });
    //       });
    //       return item;
    //     });
    //     _cols = [...getColumns(), ..._cols];
    //     setTableData(_list);
    //     setProps({ columns: _cols });
    //   }
    //   changeLoading(false);
    // } catch (error) {
    //   // closePopup();
    // }
  }

  // async function handleSubmit(type) {
  //   changeOkLoading(true);
  //   const params = getDataSource().map(item => {
  //     return {
  //       id: item.id,
  //       handleStatus: item.handleStatus,
  //       handleOpinion: item.handleOpinion,
  //     };
  //   });
  //   try {
  //     const r = type == 'storage' ? await storageDetail(params) : await updatePMDetail(params);
  //     if (r.code == 200) {
  //       createMessage.success(t('sys.api.operationSuccess'));
  //       closePopup();
  //       emits('reload');
  //     }
  //     changeOkLoading(false);
  //   } catch (error) {
  //     changeOkLoading(false);
  //   }
  // }
</script>
<style scoped lang="less"></style>
