<template
  ><div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <a-tabs @change="reloadTable" v-model:activeKey="activeKey">
          <a-tab-pane key="1" tab="待处理">
            <BasicTable @register="registerTable">
              <template #tableTitle>
                <a-button v-auth="'btn_add'" type="primary" @click="handleApprove">价格确认</a-button>
                <a-button v-auth="'btn_download'" @click="handleExport">{{ t('views.business.quota.export') }} </a-button>
                <!--            <a-button v-auth="'btn_result_input'" @click="handleEnterPrice"> 竞价结果录入 </a-button>-->
              </template>
              <template #bodyCell="{ column, record, text, index }">
                <template v-if="column.dataIndex === 'confirmOpinion'">
                  <template v-if="text == '2'">
                    <Badge color="#f50" text="不同意" />
                  </template>
                  <template v-if="text == '1'">
                    <Badge color="#87d068" text="同意" />
                  </template>
                </template>
                <template v-if="column.dataIndex === 'originType'">
                  <template v-if="text == '1'">
                    <a-tag color="blue">报价</a-tag>
                  </template>
                </template>
                <template v-if="column.dataIndex === 'action'">
                  <TableAction :actions="getTableActions(record)" />
                </template>
              </template>
              <!--              <template #expandedRowRender="{ record }">-->
              <!--                <a-card-->
              <!--                  v-if="record.gpList.length >= 1 || record.statusEnum == 2"-->
              <!--                  class="lydc-content-wrapper-search-box p-12px mb-16px"-->
              <!--                  style="border-bottom: 1px solid #dbdbdb; background: #fbfbfb">-->
              <!--                  <b v-if="record.gpList.length >= 1">报价价格</b>-->
              <!--                  <CustomRows-->
              <!--                    v-if="record.gpList.length >= 1"-->
              <!--                    :list="-->
              <!--                      record.gpList.map((item, index) => {-->
              <!--                        return {-->
              <!--                          priceTitle: `报价${index + 1}`,-->
              <!--                          price: `￥${Number(item.price).toLocaleString()}`,-->
              <!--                          gp: `${Number(item.gp * 100).toLocaleString()}`,-->
              <!--                          gpTitle: `GP${index + 1}(%)`,-->
              <!--                        };-->
              <!--                      })-->
              <!--                    " />-->
              <!--                  <a-divider v-if="record.statusEnum == 2 && record.gpList.length >= 1" />-->
              <!--                  <div v-if="record.statusEnum == 2" class="mb-10px"-->
              <!--                    ><b>竞价结果</b><a-button @click="handleEditResult(record, index)" class="ml-12px" size="small">修改</a-button></div-->
              <!--                  >-->
              <!--                  <ResultRows-->
              <!--                    v-if="record.statusEnum == 2"-->
              <!--                    :data="{-->
              <!--                      result: record?.biddingResult,-->
              <!--                      price: record?.biddingPrice,-->
              <!--                      remark: record?.biddingRemark,-->
              <!--                    }" />-->
              <!--                </a-card>-->
              <!--                <a-card v-else>-->
              <!--                  <Empty />-->
              <!--                </a-card>-->
              <!--              </template>-->
            </BasicTable>
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>
    <Detail @register="registerDetail" @reload="reload" />
    <ExportForm @register="registerExportForm" @reload="reload" />
    <EnterPrice @register="registerEnterPriceForm" @reload="reload" />
  </div>
</template>

<script lang="ts" setup>
  import { ActionItem, BasicTable, TableAction, useTable } from '/@/components/Table';
  import { Badge, Empty } from 'ant-design-vue';
  import { getConfirmPriceList } from '/@/api/business/priceConfirmation';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useBaseStore } from '/@/store/modules/base';
  import { usePopup } from '/@/components/Popup';
  import CustomRows from './components/CustomRows.vue';
  import Detail from './components/Detail.vue';
  import { cloneDeep } from 'lodash-es';
  import { reactive } from 'vue';
  import ExportForm from './components/ExportForm.vue';
  import EnterPrice from './components/EnterPrice.vue';
  import { useModal } from '/@/components/Modal';
  import ResultRows from '/@/views/business/priceConfirmation/components/ResultRows.vue';
  import { useMessage } from '/@/hooks/web/useMessage';

  defineOptions({ name: 'business-priceConfirmation' });
  const { t } = useI18n();
  const [registerDetail, { openPopup: openDetailPopup }] = usePopup();
  const [registerExportForm, { openModal: openFormModal }] = useModal();
  const [registerEnterPriceForm, { openModal: openEnterPriceForm }] = useModal();
  const { createMessage } = useMessage();
  function getTableActions(record): ActionItem[] {
    return [
      {
        icon: 'icon-ym icon-ym-btn-preview',
        onClick: handleEdit.bind(null, record),
        auth: 'btn_detail',
      },
    ];
  }
  const state = reactive({
    cacheList: [],
  });

  const handleEdit = record => {
    const rows = getSelectRows();
    const clickRow = rows.find(item => record.id === item.id);
    openDetailPopup(true, {
      record: record,
      cacheList: clickRow ? rows : [record],
    });
  };
  const baseStore = useBaseStore();
  const columns = [
    {
      title: '来源单号',
      dataIndex: 'qrApplyCode',
      width: 200,
      resizable: true,
    },
    {
      title: '来源',
      dataIndex: 'originType',
      width: 160,
      resizable: true,
    },
    {
      title: '产品内部料号',
      dataIndex: 'insidePartNumber',
      width: 160,
      resizable: true,
    },
    {
      title: '状态',
      align: 'center',
      dataIndex: 'confirmOpinion',
      width: 160,
      resizable: true,
    },
    {
      title: '价格意见备注',
      dataIndex: 'confirmRemark',
      width: 160,
      resizable: true,
    },
    // {
    //   title: '币别',
    //   dataIndex: 'ApplyCode',
    //   width: 160,
    //   resizable: true,
    // },
    {
      title: '成本价格',
      dataIndex: 'cost',
      width: 160,
      resizable: true,
    },
    // {
    //   title: '报价价格1',
    //   dataIndex: 'ApplyCode',
    //   width: 160,
    //   resizable: true,
    // },
    // {
    //   title: 'GP1(%)',
    //   dataIndex: 'ApplyCode',
    //   width: 160,
    //   resizable: true,
    // },
    // {
    //   title: '报价价格2',
    //   dataIndex: 'ApplyCode',
    //   width: 160,
    //   resizable: true,
    // },
    // {
    //   title: 'GP2(%)',
    //   dataIndex: 'ApplyCode',
    //   width: 160,
    //   resizable: true,
    // },
    {
      title: '竞价结果',
      dataIndex: 'biddingResult',
      width: 160,
      resizable: true,
    },
    {
      title: '竞价价格',
      dataIndex: 'biddingPrice',
      width: 160,
      resizable: true,
    },
    {
      title: '竞价结果备注',
      dataIndex: 'biddingRemark',
      width: 160,
      resizable: true,
    },
    {
      title: '申请人',
      dataIndex: 'applyUserName',
      width: 160,
      resizable: true,
    },
    {
      title: '申请日期',
      dataIndex: 'applyDate',
      width: 160,
      resizable: true,
      format: 'date|YYYY-MM-DD HH:mm:ss',
    },
    {
      title: '产品描述',
      dataIndex: 'productDesc',
      width: 160,
      resizable: true,
    },
  ];
  const [registerTable, { reload, getForm, getSelectRows, setSelectedRowKeys }] = useTable({
    api: getConfirmPriceList,
    columns,
    rowKey: 'id',
    useSearchForm: true,
    resizable: true,
    bordered: true,
    rowSelection: {
      type: 'checkbox',
    },
    afterFetch: data => {
      state.cacheList = cloneDeep(data);
      return data;
    },
    formConfig: {
      schemas: [
        {
          field: 'qrApplyCode',
          label: '来源单号',
          component: 'Input',
          componentProps: {
            placeholder: '请输入来源单号',
            submitOnPressEnter: true,
          },
        },
        {
          field: 'insidePartNumber',
          label: '产品内部料号',
          component: 'Input',
          componentProps: {
            placeholder: '请输入产品内部料号',
            submitOnPressEnter: true,
          },
        },
        {
          field: 'originType',
          label: '选择来源',
          component: 'ApiSelect',
          componentProps: {
            placeholder: '请选择来源',
            submitOnPressEnter: true,
            api: () => {
              return baseStore.getDictionaryData('Quotation.ConfirmOriginType');
            },
            labelField: 'fullName',
            valueField: 'enCode',
            filterOption: false,
            notFoundContent: null,
            immediate: true,
          },
        },
        {
          field: '',
          label: '选择状态',
          component: 'ApiSelect',
          componentProps: {
            placeholder: '请选择状态',
            submitOnPressEnter: true,
            api: () => {
              return baseStore.getDictionaryData('Quotation.ConfirmOpinion');
            },
            labelField: 'fullName',
            valueField: 'enCode',
            filterOption: false,
            notFoundContent: null,
            immediate: true,
          },
        },
        {
          field: 'biddingResult',
          label: '竞价结果',
          component: 'ApiSelect',
          componentProps: {
            placeholder: '请输入竞价结果',
            submitOnPressEnter: true,
            api: () => {
              return baseStore.getDictionaryData('Quotation.BiddingResult');
            },
            labelField: 'fullName',
            valueField: 'enCode',
            filterOption: false,
            notFoundContent: null,
            immediate: true,
          },
        },
      ],
    },
    actionColumn: {
      width: 70,
      title: t('views.business.quota.action'),
      dataIndex: 'action',
    },
    // transformCellText: ({ text }) => formatTableDefaultText(text),
  });

  function handleApprove() {
    const rows = getSelectRows();
    console.log(state.cacheList);
    openDetailPopup(true, {
      record: rows.length > 0 ? rows[0] : state.cacheList[0],
      cacheList: rows.length > 0 ? rows : state.cacheList,
    });
  }

  function handleExport() {
    const rows = getSelectRows();
    openFormModal(true, { cacheList: rows.length > 0 ? rows : state.cacheList });
  }

  function handleEnterPrice() {
    const rows = getSelectRows();
    if (rows.length == 0) return createMessage.warning('请选择需要录入的报价单');
    const cacheList = rows.filter(item => item.biddingResult == 1);
    if (cacheList.length == 0) return createMessage.warning('请选择竞价成功的报价单');
    openEnterPriceForm(true, { cacheList });
  }

  function handleEditResult(record) {
    openEnterPriceForm(true, { cacheList: [record] });
  }
</script>
