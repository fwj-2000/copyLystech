<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    :showOkBtn="false"
    :show-cancel-btn="false"
    :title="state.title"
    destroyOnClose
    class="full-popup p-10px">
    <div class="email h-full">
      <div class="email-header">
        <Subtitle :title="state.title + '信息'"></Subtitle>
      </div>
      <div class="email-content">
        <div>
          <BasicForm labelAlign="right" :schemas="schemas" @register="registerForm" class="p-12px">
            <template #drawing="data">
              <div class="drawings-name">
                <a-tooltip placement="top" v-for="item in state.dataSource" :title="item.moldDrawingsName" class="text-ellipsis">
                  <a
                    @click="
                      () => {
                        filePreviewRef &&
                          filePreviewRef.init({
                            name: item.moldDrawingsName,
                            Id: item.moldDrawingsId,
                            previewType: 'localPreview',
                            noCache: false,
                            isCopy: 0,
                          });
                      }
                    ">
                    {{ item.moldDrawingsName }}
                    <i class="icon-ym icon-ym-btn-download" @click.stop="handleFileDownload(item)"></i>
                  </a>
                </a-tooltip>
              </div>
            </template>
          </BasicForm>
        </div>
        <BasicTable @register="registerTable" style="height: calc(100% - 52px)" class="BasicTableRef" :data-source="state.tableData">
          <template #bodyCell="{ column, record, index }">
            <template v-if="column.dataIndex === 'status'">
              <div
                class="status-tag"
                :style="{
                  color: P_R__STATUS_COLOR_MAP[record[pageTurnConfig.bizType == '0' ? 'engReviewStatus' : 'pmcReviewStatus']]['color'],
                  'background-color': P_R__STATUS_COLOR_MAP[record[pageTurnConfig.bizType == '0' ? 'engReviewStatus' : 'pmcReviewStatus']]['background'],
                }">
                <i class="ym-custom ym-custom-brightness- text-6px" style="position: relative; top: -2px"></i>
                {{ record[pageTurnConfig.bizType == '0' ? 'engReviewStatusName' : 'pmcReviewStatusName'] }}
              </div>
            </template>
            <template v-else-if="column.dataIndex === 'quotation'">
              <a-input-number
                addon-after="￥"
                style="width: 100%"
                :min="0"
                :precision="2"
                v-model:value="record[column.dataIndex]"
                placeholder="报价（人民币）" />
            </template>
            <template v-else-if="column.dataIndex === 'material'">
              <!-- <a-input v-model:value="record[column.dataIndex]" placeholder="材质" /> -->
              <ApiSelect
                v-if="pageTurnConfig.edit"
                v-model:value="record[column.dataIndex]"
                v-bind="{
                  placeholder: '材质',
                  showSearch: false,
                  resultField: 'data',
                  valueField: 'enCode',
                  labelField: 'fullName',
                  filterOption: false,
                  immediate: true,
                  api: () => baseStore.getDictionaryData('ProcessRules.MaterialQuality'),
                }" />
              <template v-else>
                {{ record['materialName'] }}
              </template>
            </template>
            <template v-else-if="column.dataIndex === 'deliveryTime'">
              <lydc-date-picker v-model:value="record[column.dataIndex]" allowClear format="YYYY-MM-DD" />
            </template>
            <template v-else-if="column.dataIndex === 'isProcessMeet'">
              <a-select
                v-model:value="record[column.dataIndex]"
                :options="meetOptions"
                v-if="pageTurnConfig.edit"
                placeholder="工艺是否满足"
                @change="isProcessMeetChange(record)">
                <!-- <a-select-option :value="1">满足</a-select-option>
                <a-select-option :value="0">不满足</a-select-option> -->
              </a-select>
              <template v-else>
                {{ meetDict[record[column.dataIndex]] }}
              </template>
            </template>
            <template v-else-if="column.dataIndex === 'notMeetReason' && pageTurnConfig.edit">
              <a-input v-model:value="record[column.dataIndex]" placeholder="不满足原因" :disabled="record['isProcessMeet'] == '1'" />
            </template>
            <template v-else-if="column.dataIndex === 'designatedPmcReviewerId'">
              <lydc-custom-user-select v-model:value="record[column.dataIndex]" v-bind="column.cpmSetting"> </lydc-custom-user-select>
            </template>
            <template v-else-if="['requireDeliveryTime', 'creatorTime'].includes(column.dataIndex)">
              {{ dayjs(record[column.dataIndex]).format('YYYY-MM-DD') }}
            </template>
            <template v-else-if="column.dataIndex === 'opera'">
              <a v-auth="'btn_detail'" @click="openNodeRecordModalFn(record)" style="cursor: pointer">节点详情</a>
            </template>
            <template v-else-if="column.dataIndex === 'action'">
              <TableAction :actions="getTableActions(record, index)" />
            </template>
          </template>
        </BasicTable>
      </div>
      <div class="email-footer">
        <a-button @click="cancelFn" ghost type="primary" class="ml-16px">取消</a-button>
        <a-button @click="tempSaveFn" type="primary" class="ml-16px">暂存</a-button>
        <a-button @click="handleSubmitFn" type="primary" class="ml-16px">提交</a-button>
      </div>
    </div>
  </BasicPopup>
  <Preview ref="filePreviewRef" />
  <NodeModal @register="registerNodeRecord" />
</template>
<script setup lang="ts">
  import { ref, reactive, nextTick } from 'vue';
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { Subtitle } from '/@/components/Subtitle';
  import { useModal } from '/@/components/Modal';
  import { BasicTable, useTable, BasicColumn, ActionItem } from '/@/components/Table';
  import { UPLOADPAPER_COLUMNS, P_R__STATUS_COLOR_MAP, getPageConfig } from './config';
  import { BasicForm, FormSchema, useForm } from '/@/components/Form';
  import ApiSelect from '/@/components/Form/src/components/ApiSelect.vue';
  import { getReviewDataList, reviewApply, temporarySave, getNodelist } from '/@/api/engineering/mould';
  import Preview from '/@/views/basicData/productCodeApply/components/Preview.vue';
  import { ModalComponent } from '/@/views/basicData/encodingSettings/types';
  import { downloadByUrl } from '/@/utils/file/download';
  import { fileDownload } from '/@/api/basicData/processrulestemplate';
  import { useMessage } from '/@/hooks/web/useMessage';
  import TableAction from '/@/components/Table/src/components/TableAction.vue';
  import dayjs from 'dayjs';
  import { formatTableDefaultText } from '/@/utils';
  import { useBaseStore } from '/@/store/modules/base';
  import { NodeModal } from '/@/components/CustomComponents';

  let baseStore = useBaseStore();
  const emits = defineEmits(['reload']);

  const state = reactive({
    title: '',
    dataSource: [] as any,
    columns: [] as any,
    tableData: [] as any,
  });
  const meetOptions = ref<any[]>([
    { value: 1, label: '满足' },
    { value: 0, label: '不满足' },
  ]);
  const meetDict = meetOptions.value.reduce((obj, { value, label }) => {
    obj[value] = label;
    return obj;
  }, {});
  const pageTurnConfig = getPageConfig();
  const filePreviewRef = ref<ModalComponent | any>(null);
  const { t } = useI18n();
  const { createMessage, createConfirm } = useMessage();
  const [registerForm, { getFieldsValue }] = useForm({
    labelWidth: 60,
    rowProps: {
      gutter: 46,
    },
  });
  const schemas: FormSchema[] = [
    // {
    //   field: 'subject',
    //   component: 'Input',
    //   label: '主题:',
    //   rules: [{ required: true, message: '请输入主题', trigger: 'blur' }],
    // },
    // {
    //   field: 'drawing',
    //   component: 'Input',
    //   label: '   附件 :',
    //   slot: 'drawing',
    // },
  ];
  const [registerNodeRecord, { openModal: openNodeRecordModal }] = useModal();
  const [registerPopup, { closePopup, changeLoading }] = usePopupInner(init);
  const [registerTable, { setTableData, getDataSource, deleteTableDataRecord, setColumns }] = useTable({
    columns: UPLOADPAPER_COLUMNS,
    immediate: true,
    useSearchForm: false,
    rowKey: 'applyId',
    isCanResizeParent: true,
    canResize: false, //自适应高度
    showTableSetting: false,
    pagination: false,
    // actionColumn: {
    //   width: 90,
    //   title: t("common.action"),
    //   dataIndex: 'action', //字段
    //   fixed: 'right', //显示在右边
    // },
    transformCellText: ({ text }) => formatTableDefaultText(text),
  });

  async function init(data) {
    const { title, ids, dataSource: _dataSource, columns } = data;
    state.title = title;
    state.dataSource = _dataSource;
    // if (state.title === '采购') {
    //   state.columns = [{ title: 'PO单号', dataIndex: 'poNo', disabled: true, isEdit: true, inputType: '', placeholder: 'PO单号' }, ...columns];
    // } else {
    state.columns = columns;
    // }

    setColumns(state.columns);
    try {
      const { data, code } = await getReviewDataList(ids);
      if (code === 200) {
        state.tableData = data;
        setTableData(data);
        console.log(data);
      }
    } catch (error) {}
  }
  function openNodeRecordModalFn(record: any = '') {
    openNodeRecordModal(true, {
      api: getNodelist,
      id: record.applyId,
    });
  }
  function getTableActions(record, index): ActionItem[] {
    return [
      {
        icon: 'icon-ym icon-ym-delete',
        onClick: handleDeleteItem.bind(null, record, index),
        disabled: state.tableData.length <= 1 ? true : false,
      },
    ];
  }
  function isProcessMeetChange(record) {
    if (record.isProcessMeet == 1) {
      record.notMeetReason = '';
    }
  }
  const handleDeleteItem = (record, index) => {
    createConfirm({
      iconType: 'warning',
      title: t('common.tipTitle'),
      content: t('common.delTip'),
      onOk: () => {
        deleteTableDataRecord(record.applyId);
        createMessage.success(t('common.delSuccess'));
      },
    });
  };

  function cancelFn() {
    closePopup();
  }
  async function tempSaveFn() {
    try {
      changeLoading(true);
      const params = getDataSource();
      const api = temporarySave;
      const { data, code, msg } = await api({ subject: getFieldsValue().subject, list: params, bizType: pageTurnConfig.bizType });
      if (code === 200) {
        createMessage.success(msg);
        emits('reload');
        closePopup();
        return;
      }
      createMessage.error(msg);
    } catch (error) {
    } finally {
      changeLoading(false);
    }
  }
  async function handleSubmitFn() {
    try {
      changeLoading(true);
      const params = getDataSource();
      const api = reviewApply;
      const { data, code, msg } = await api({ subject: getFieldsValue().subject, list: params, bizType: pageTurnConfig.bizType });
      if (code === 200) {
        createMessage.success(msg);
        emits('reload');
        closePopup();
        return;
      }
      createMessage.error(msg);
    } catch (error) {
    } finally {
      changeLoading(false);
    }
  }

  async function handleFileDownload(e) {
    if (!e.moldDrawingsId) return;
    const downloadId = e.moldDrawingsId;
    try {
      const { data, code } = await fileDownload(downloadId);
      if (code === 200) {
        downloadByUrl({ url: data.url, fileName: data.name });
      }
    } catch (error) {
      console.error('文件下载失败：', error);
    }
  }

  function transfromVal(dataIndex, val) {
    if (state.title === '采购' && dataIndex.includes('poNo')) {
      return 'PONOVALUE';
    }
    if (!val) return '';
    if (dataIndex.includes('Time')) {
      return dayjs(val).format('YYYY-MM-DD');
    } else {
      return val;
    }
  }
  function setHtmlFn() {
    let columns = state.columns;
    if (state.title === '采购') {
      columns = [{ title: 'PO单号', dataIndex: 'poNo', disabled: true, isEdit: true, inputType: '', placeholder: 'PO单号' }, ...columns];
    }
    // 构建表头的 HTML
    const theadHtml = columns.map(header => `<th style="padding: 8px; text-align: left">${header.title}</th>`).join('');

    // 构建表身的 HTML
    const tbodyHtml = getDataSource()
      .map(row => `<tr>${columns.map(cell => `<td style="padding: 8px">${transfromVal(cell.dataIndex, row[cell.dataIndex])}</td>`).join('')}</tr>`)
      .join('');

    // 返回完整的表格 HTML
    return `
    <table border="1" style="border-collapse: collapse; width: 100%">
      <thead>
        <tr>${theadHtml}</tr>
      </thead>
      <tbody>
        ${tbodyHtml}
      </tbody>
    </table>
  `;
  }
</script>

<style lang="less" scoped>
  .email {
    height: 100vh;

    &-header {
      padding-top: 10px;
      display: flex;
      align-items: top;
    }

    &-content {
      height: 60%;
    }

    &-footer {
      position: absolute;
      bottom: 0;
      right: 0;
      width: 100%;
      text-align: right;
      height: 52px;
      line-height: 52px;
      padding-right: 16px;
      background: #fff;
    }
  }

  .drawings-name {
    display: flex;
    align-items: baseline;
    flex-wrap: nowrap;

    a {
      position: relative;
      display: inline-block;
      width: 150px;
      padding-right: 14px;
      margin-right: 14px;

      .icon-ym-btn-download {
        position: absolute;
        right: 0;
        color: #333;
        cursor: pointer;
      }
    }
  }

  .disabled-class {
    pointer-events: none;
  }
</style>
