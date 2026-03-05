<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    @ok="handleSaveAction"
    showOkBtn
    :okText="t('common.submit')"
    destroyOnClose
    :cancelText="t('common.cancelText')"
    :title="t('dict.QuotationFlowNode.Confirm')"
    class="full-popup pb-0px top-0">
    <a-space class="mt-10px">
      <Subtitle :title="t('dict.QuotationFlowNode.Confirm')" id="material" />
      <a-button type="primary" ghost class="mb-16px" @click="handleAgree">{{ t('common.agree') }} </a-button>
      <a-button type="primary" danger ghost class="mb-16px" @click="handleDiaagree">{{ t('common.disagree') }} </a-button>
    </a-space>
    <div class="table-height">
      <Grid>
        <template #action="{ row, rowIndex }">
          <TableAction :outside="true" :actions="getTableActions(rowIndex, row)" />
        </template>
      </Grid>
    </div>
  </BasicPopup>
</template>
<script setup lang="ts">
  import Template from '/@/views/engineering/pcc/pccApply/components/Template.vue';
  import { ActionItem, TableAction } from '/@/components/Table';
  import { getAgreeVxeColumns } from '/@/views/business/priceConfirmation/CONFIG';
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { isEmpty } from '/@/utils/is';
  import { Subtitle } from '/@/components/Subtitle';
  import { confirmQuotation } from '/@/api/business/priceConfirmation';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { bignumber, divide, subtract } from 'mathjs';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';

  const { t } = useI18n();

  const emit = defineEmits(['reload', 'register']);

  const [registerPopup, { closePopup, changeLoading }] = usePopupInner(init);
  const { createMessage } = useMessage();

  const [Grid, gridApi] = useVbenVxeGrid({
    showSearchForm: false,
    gridOptions: {
      id: 'business-priceConfirmation-agreeDetail-edit',
      columns: getAgreeVxeColumns() as any,
      height: 'auto',
      editConfig: {
        trigger: 'dblclick',
        mode: 'row',
      },
      rowConfig: {
        keyField: 'id',
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
      },
      pagerConfig: {
        enabled: false,
      },
    },
  });

  const { getSelectRowKeys, getDataSource, clearSelectedRowKeys } = gridApi;

  function setTableData(list: any) {
    gridApi.reloadData(list);
  }

  function deleteTableDataRecord(id: string) {
    const tableData = getDataSource();
    const targetRow = tableData.find(item => item.id === id);
    targetRow && gridApi.remove(targetRow);
  }

  function init(data) {
    console.log(data);
    const { cacheList } = data;
    const list = cacheList.map(item => {
      const target = {
        ...item,
        fpy: `${item.fpy * 100}%`,
        confirmOpinion: item.confirmOpinion ? item.confirmOpinion : 0,
        onEdit: true,
        editable: true,
      };
      // if (!isEmpty(item.gpList)) {
      //   item.gpList.forEach(val => {
      //     if (val.gp == 0.2) {
      //       item.gp20 = val.price;
      //     }
      //     if (val.gp == 0.25) {
      //       item.gp25 = val.price;
      //     }
      //   });
      // }
      const gp20 = divide(bignumber(item?.parentPartInfo?.singleCost || 0), subtract(bignumber(1), divide(bignumber(20), bignumber(100)))).toFixed(6);
      const gp25 = divide(bignumber(item?.parentPartInfo?.singleCost || 0), subtract(bignumber(1), divide(bignumber(25), bignumber(100)))).toFixed(6);

      target.gp20 = gp20;
      target.gp25 = gp25;
      return target;
    });
    setTableData(list);
  }
  function handleSaveAction() {
    changeLoading(true);
    let list: Array<any> = [];
    try {
      list = getDataSource().map((item, index) => {
        if (!item.confirmOpinion) throw new Error(t('common.thereAreUnconfirmedPrices'));
        if (+item.confirmOpinion === 2 && !item.confirmRemark) throw new Error(t('common.commentPrice', [index + 1]));
        return {
          id: item.id,
          confirmOpinion: item.confirmOpinion,
          confirmRemark: item.confirmRemark,
        };
      });
    } catch (e: any) {
      changeLoading(false);
      return createMessage.warning(e.message);
    }

    confirmQuotation(list)
      .then(({ code, msg }) => {
        if (code === 200) {
          createMessage.success(msg);
          closePopup();
        } else {
          createMessage.error(msg);
        }
      })
      .finally(() => {
        emit('reload');
        changeLoading(false);
      });
  }

  function getTableActions(index, record): ActionItem[] {
    return [
      {
        icon: 'icon-ym icon-ym-delete',
        onClick: handleDel.bind(null, record),
      },
    ];
  }

  function handleDel(record) {
    deleteTableDataRecord(record.id);
  }

  function handleAgree() {
    const selectKeys = getSelectRowKeys();
    const list = getDataSource();
    const datalist = list.map(item => {
      selectKeys.forEach(key => {
        if (item.id === key) {
          item.confirmOpinion = 1;
        }
      });
      return item;
    });
    setTableData(datalist);
    clearSelectedRowKeys();
  }

  function handleDiaagree() {
    const selectKeys = getSelectRowKeys();
    const list = getDataSource();
    let datalist;
    try {
      datalist = list.map((item, index) => {
        selectKeys.forEach(key => {
          if (item.id === key) {
            // if (!item.confirmRemark) {
            //   // throw new Error(`请输入第${index + 1}条的价格意见`);
            //   console.log(t('common.commentPrice', [index + 1]));
            //   throw new Error(t('common.commentPrice', [index + 1]));
            // }
            item.confirmOpinion = 2;
          }
        });
        return {
          ...item,
        };
      });
      setTableData(datalist);
    } catch (e: any) {
      // list.map(item => {
      //   item.confirmOpinion = 0;
      // });
      return createMessage.warning(e.message);
    }
    clearSelectedRowKeys();
  }
</script>
<style lang="less">
  .table-height {
    height: calc(100% - 80px);
  }
</style>
