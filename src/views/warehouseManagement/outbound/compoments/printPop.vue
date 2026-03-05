<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    :showOkBtn="true"
    :okText="t('common.printText')"
    :title="state.title"
    :cancel-text="t('common.back')"
    destroyOnClose
    class="full-popup top-0"
    style="height: 100%"
    @ok="handleSubmit">
    <ScrollContainer style="background: #ebeef5">
      <div class="mb-14px p-12px" style="background: #fff">
        <BasicForm @register="registerForm"> </BasicForm>
        <BasicTable @register="registerTable">
          <template #bodyCell="{ column, record, index }">
            <template v-if="column.dataIndex === 'action'">
              <TableAction :actions="getTableActions(record, index)" />
            </template>
            <template v-else-if="column.cpmType === 'CustomUserSelect'">
              <lydc-custom-user-select v-model:value="record[column.dataIndex]" v-bind="column.cpmSetting"> </lydc-custom-user-select>
            </template>
            <template v-else>
              <FilteredInput
                v-model:value="record[column.dataIndex]"
                :input-type="column.inputType"
                allowClear
                v-bind="column.cpmSetting"
                v-if="column.isEdit" />
            </template>
          </template>
        </BasicTable>
      </div>
      <div id="printJS-form" ref="printRef" v-show="false">
        <outboundTemplate id="saleTemplate" :data="state.printData"></outboundTemplate>
      </div>
    </ScrollContainer>
  </BasicPopup>
</template>
<script lang="ts" setup>
  import { computed, reactive, ref, toRefs } from 'vue';
  import dayjs from 'dayjs';
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { ActionItem, BasicTable, useTable } from '/@/components/Table';
  import { ScrollContainer } from '/@/components/Container';
  import { formatTableDefaultText } from '/@/utils';
  import { useUserStore } from '/@/store/modules/user';
  import { PRINT_COLUMNS, BASICINFO_FORMCONFIG } from '../config';
  import { BasicForm, useForm, FormSchema } from '/@/components/Form';
  import Subtitle from '/@/components/Subtitle/src/Subtitle.vue';
  import AddTable from './addTable.vue';
  import { FilteredInput } from '/@/components/FilteredInput';
  import TableAction from '/@/components/Table/src/components/TableAction.vue';
  import { printoutbound } from '/@/api/warehouse/warehouse';
  import outboundTemplate from './outboundTemplate/index.vue';
  import printStyle1 from './outboundTemplate/printStyle1';
  import { buildBitUUID } from '/@/utils/uuid';
  const emits = defineEmits(['register', 'reload']);
  interface State {
    tableData: [];
    title: string;
    printData: any;
  }
  const printRef = ref();

  const { t } = useI18n();
  const state = reactive<State>({
    tableData: [],
    title: '',
    printData: [],
  });

  const { createMessage, createConfirm } = useMessage();
  const [registerPopup, { closePopup }] = usePopupInner(init);
  const [registerForm, { updateSchema, getFieldsValue, setFieldsValue, validate }] = useForm(BASICINFO_FORMCONFIG);
  const [registerTable, { setTableData, deleteTableDataRecord, setLoading, insertTableDataRecord }] = useTable({
    columns: PRINT_COLUMNS,
    useSearchForm: false,
    immediate: false,
    pagination: false,
    showTableSetting: false,
    striped: true,
    showIndexColumn: true,
    canResize: true,
    isCanResizeParent: false,
    actionColumn: {
      width: 90,
      title: t('common.checkOperationText'),
      dataIndex: 'action', //字段
      fixed: 'right', //显示在右边
    },
    // scroll: {
    //   y: 300,
    // },
    transformCellText: ({ text }) => formatTableDefaultText(text),
  });

  async function init({ title, data }) {
    state.title = title;
    state.tableData = data;
    console.log(data, '666666666666');
    setTableData(data);
    if (data && data.length) {
      setFieldsValue({ customer: data[0].factoryName });
      setFieldsValue({ deliveryAddress: data[0].deliveryAddress });
      setFieldsValue({ contactsId: data[0].contactsId });
      setFieldsValue({ deliveryPersonId: data[0].deliveryPersonId });
    }
  }

  function getTableActions(record, index): ActionItem[] {
    return [
      {
        icon: 'ym-diecut ym-diecut-file-copy',
        onClick: handleCopyItem.bind(null, record, index),
      },
      {
        icon: 'icon-ym icon-ym-delete',
        onClick: handleDeleteItem.bind(null, record, index),
        disabled: state.tableData.length <= 1,
      },
    ];
  }

  function validateTableForm() {
    let errorArr: any = [];
    for (let index = 0; index < state.tableData.length; index++) {
      const element = state.tableData[index];
      errorArr = PRINT_COLUMNS.filter(o => {
        return !element[o.dataIndex];
      });
      if (errorArr.length) return errorArr;
    }
    return errorArr;
  }

  async function handleSubmit(type = 1) {
    const params = await validate();
    if (!params) return;
    const validateArr = await validateTableForm();
    if (validateArr.length && validateArr[0].title !== '备注') {
      return createMessage.warning(validateArr[0].title + t('sys.validate.textRequiredSuffix'));
    }
    setLoading(true);
    try {
      const { data, code, msg } = await printoutbound({ list: state.tableData, ...params });
      if (code === 200) {
        state.tableData = [];
        state.printData = data;
        setTimeout(() => {
          handlePrint();
          closePopup();
          createMessage.success(msg);
          emits('reload');
        }, 300);
      }
    } catch (error) {
      console.error(error, 'handleSubmit');
    } finally {
      setLoading(false);
    }
  }

  const handleCopyItem = (record, index) => {
    insertTableDataRecord({ ...record, id: buildBitUUID() }, index + 1);
  };

  const handleDeleteItem = (record, index) => {
    createConfirm({
      iconType: 'warning',
      title: t('common.tipTitle'),
      content: t('common.delTip'),
      onOk: () => {
        deleteTableDataRecord(record.id);
        createMessage.success(t('common.delSuccess'));
      },
    });
  };

  function handlePrint() {
    const print = printRef.value.innerHTML + printStyle1;
    console.log(print);
    const iframe: any = document.createElement('IFRAME');
    iframe.setAttribute('style', 'position:absolute;width:0px;height:0px;left:-400px;top:-500px;');
    document.body.appendChild(iframe);
    let doc = iframe.contentWindow.document;
    iframe.onload = function () {
      iframe.contentWindow.print();
      // document.body.removeChild(iframe);
      iframe.remove();
    };
    doc.write(print);
    doc.close();
  }
</script>

<style lang="less" scope>
  .ant-table-wrapper {
    // padding: 0 !important;
  }

  .info {
    display: flex;
    padding: 10px 0;

    div {
      margin-right: 22px;
    }
  }

  .info-value {
    background-color: #f5f5f5;
    padding: 4px;
    border-radius: 4px;
  }
</style>
