<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content">
        <BasicTable @register="registerTable">
          <template #tableTitle>
            <!-- 上传按钮 -->
            <SingleUpload v-for="(item, idx) in uploadButtonList" :key="idx" v-bind="item" :afterUpload="reload">导入数据</SingleUpload>
            <a-dropdown placement="bottomLeft" :trigger="['click']">
              <a-button class="ml-12px" type="primary" ghost :loading="templateDownloading">模版下载</a-button>
              <template #overlay>
                <a-menu>
                  <a-menu-item
                    v-for="(item, idx) in templateDownloadList"
                    :key="idx"
                    @click="
                      templateDownloadFile({
                        fileName: item.fileName,
                      })
                    ">
                    {{ item.fileName }}
                  </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
          </template>
        </BasicTable>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { BasicTable, useTable, BasicColumn, FormSchema } from '/@/components/Table';
  import {
    getFeeTypeList,
    getTemplateDownload,
    GetFactoryBind,
    GetBusinessRangeBind,
    GetHomeTypeShortTextBind,
    GetFeeTypeBind,
  } from '/@/api/dashbord/feeTypeRestore';
  import { getISOCodeList } from '/@/api/basicData/currency';
  import { reactive, onMounted } from 'vue';
  import { uploadButtonList, templateDownloadList } from './config';
  import { useDownload } from '/@/views/dashboard/hooks/useDownload';
  import SingleUpload from '/@/views/dashboard/operate/components/SingleUpload.vue';
  import { useBaseStore } from '/@/store/modules/base';

  defineOptions({ name: 'basicData-productionInformation-exchangeRate' });
  interface State {
    industryTypeList: any[];
  }

  //模版下载
  const { loading: templateDownloading, downloadFile: templateDownloadFile } = useDownload({
    requestApi: getTemplateDownload,
  });

  const state = reactive<State>({
    industryTypeList: [],
  });

  // 扩展BasicColumn类型
  interface ExtendedBasicColumn extends BasicColumn {
    render?: (text: any) => string;
  }

  const columns: ExtendedBasicColumn[] = [
    { title: '年份', dataIndex: 'Year' },
    { title: '季度', dataIndex: 'Quarter' },
    { title: '月份', dataIndex: 'Month' },
    // { title: '工厂', dataIndex: 'Factory' },
    { title: '业务范围', dataIndex: 'BusinessRange' },
    { title: 'SBU', dataIndex: 'Sbu' },
    { title: '活动类型', dataIndex: 'ActivityType' },
    { title: '作业类型短文本', dataIndex: 'HomeTypeShortText' },
    { title: '费用分类', dataIndex: 'FeeType' },
    { title: '费率单价', dataIndex: 'RatePrice' },
    { title: '导入日期', dataIndex: 'ImportDate', format: 'date|YYYY-MM-DD' },
    { title: '导入人员', dataIndex: 'ImportName' },
    {
      title: '是否应用还原',
      dataIndex: 'IsApplicationRestore',
      customRender: ({ text }) => {
        if (text == null) {
          return '-';
        }
        return text == true ? '是' : '否';
      },
    },
    { title: '应用还原时间', dataIndex: 'ApplicationRestoreTime', format: 'date|YYYY-MM-DD' },
  ];
  console.log(columns);

  const baseStore = useBaseStore();
  const searchFormSchema: FormSchema[] = [
    {
      field: 'restoreDimension',
      label: '',
      component: 'Select',
      defaultValue: '',
      componentProps: {
        placeholder: '维度',
        options: [
          // { fullName: '请选择', id: '' },
          { fullName: '年份', id: '1' },
          { fullName: '季度', id: '2' },
          { fullName: '月份', id: '3' },
        ],
      },
      colProps: { span: 3 },
    },
    // {
    //   field: 'factory',
    //   label: '',
    //   component: 'ApiSelect',
    //   componentProps: {
    //     api: GetFactoryBind,
    //     placeholder: '工厂',
    //     showSearch: true,
    //     apiSearch: {
    //       show: true,
    //       searchName: 'keyword',
    //     },
    //     resultField: 'data',
    //     labelField: 'Factory',
    //     valueField: 'Factory',
    //     immediate: true,
    //   },
    //   colProps: { span: 3 },
    // },
    {
      field: 'businessRange',
      label: '',
      component: 'ApiSelect',
      componentProps: {
        api: GetBusinessRangeBind,
        placeholder: '业务范围',
        showSearch: true,
        apiSearch: {
          show: true,
          searchName: 'keyword',
        },
        resultField: 'data',
        labelField: 'BusinessRange',
        valueField: 'BusinessRange',
        immediate: true,
      },
      colProps: { span: 3 },
    },
    {
      field: 'homeTypeShortText',
      label: '',
      component: 'ApiSelect',
      componentProps: {
        api: GetHomeTypeShortTextBind,
        placeholder: '作业类型短文本',
        showSearch: true,
        apiSearch: {
          show: true,
          searchName: 'keyword',
        },
        resultField: 'data',
        labelField: 'HomeTypeShortText',
        valueField: 'HomeTypeShortText',
        immediate: true,
      },
      colProps: { span: 3 },
    },
    {
      field: 'feeType',
      label: '',
      component: 'ApiSelect',
      componentProps: {
        api: GetFeeTypeBind,
        placeholder: '费用分类',
        showSearch: true,
        apiSearch: {
          show: true,
          searchName: 'keyword',
        },
        resultField: 'data',
        labelField: 'FeeType',
        valueField: 'FeeType',
        immediate: true,
      },
      colProps: { span: 3 },
    },
    {
      field: 'sbu',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: '请输入SBU',
      },
      colProps: { span: 3 },
    },
    {
      field: 'importName',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: '请输入导入人员',
      },
      colProps: { span: 3 },
    },
    // {
    //   field: 'times',
    //   label: '',
    //   labelWidth: 70,
    //   component: 'DateRange',
    //   colProps: { span: 5 },
    // },
    {
      field: 'times',
      label: '',
      labelWidth: 100,
      component: 'DateRange',
      componentProps: {
        format: 'YYYY-MM-DD',
        placeholder: ['导入开始日期', '导入结束日期'],
      },
    },
  ];

  //getRowSelection获取行id, reload刷新表单，getFetchParams获取表单数据
  const [registerTable, { getRowSelection, reload, getForm, getFetchParams }] = useTable({
    //columnsOptions,
    api: getFeeTypeList,
    title: '',
    columns,
    rowKey: 'Id',
    isCanResizeParent: true,
    canResize: true, //自适应高度
    formConfig: {
      //搜索框
      labelWidth: 100,
      schemas: searchFormSchema,
      fieldMapToTime: [['times', ['importStartDate', 'importEndDate']]],
      autoAdvancedLine: 1, //自动展开行
    },
    striped: true,
    useSearchForm: true, //使用搜索表单
    showTableSetting: true, //刷新按钮,默认打开
    bordered: true, //显示表格边框
    showIndexColumn: false, //显示序号
    pagination: {
      pageSize: 30,
      size: 'small',
    },
    // rowSelection: {
    //   type: 'checkbox',
    // },
  });

  async function getISOCodeByExchangeCurrency(code) {
    const optionList = await getISOCodeList(code);
    const optionISO = optionList.data.map(i => {
      return {
        id: i.ISOCode,
        fullName: i.ISOCode,
      };
    });
    getForm().updateSchema([
      {
        field: 'type',
        componentProps: {
          options: optionISO,
        },
      },
    ]);
  }
  //组件加载后更新搜索框的下拉选项
  onMounted(async () => {
    const { updateSchema } = getForm();
    const optionList = await getISOCodeList();

    const optionISO = optionList.data.map(i => {
      return {
        id: i.ISOCode,
        fullName: i.ISOCode,
      };
    });
    state.industryTypeList = optionISO as any[];
    updateSchema([
      {
        field: 'HoldCurrency',
        componentProps: {
          placeholder: '持有货币',
          options: optionISO,
        },
      },
      {
        field: 'ExchangeCurrency',
        componentProps: {
          options: optionISO,
        },
      },
    ]);
  });
</script>

<style scoped lang="less">
  .pldr {
    color: #ff7b00;
  }
</style>
