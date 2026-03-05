import { FormProps, FormSchema, useForm } from '/@/components/Form';
import { FormItem, Input, InputNumber } from 'ant-design-vue';
import { bignumber, divide, subtract } from 'mathjs';
import { useI18n } from '/@/hooks/web/useI18n';
import { AGREE_OPTIONS, STATUS_OPTIONS } from '/@/utils/status';
import { slotFlagsText } from '@vue/shared';
import { getProductionType } from '/@/utils/business/index';
import { useUserStore } from '/@/store/modules/user';

const { t } = useI18n();
const userStore = useUserStore();

export function waitGetVxeFormConfig(): any {
  return [
    {
      label: '',
      fieldName: 'qrApplyCode',
      component: 'Input',
      componentProps: {
        placeholder: t('dict.FilingsApplyColumn.QuantitativeApplyNo'),
        submitOnPressEnter: true,
        allowClear: true,
      },
    },
    {
      label: '',
      fieldName: 'insidePartNumber',
      component: 'Input',
      componentProps: {
        placeholder: t('dict.QuotationRequirementsColumn.insidePartNumber'),
        submitOnPressEnter: true,
        allowClear: true,
      },
    },
    {
      label: '',
      fieldName: 'immediateCustomerName',
      component: 'Input',
      componentProps: {
        placeholder: t('dict.SalesShipPattern.recordTable.immediateCustomerName'),
        submitOnPressEnter: true,
        allowClear: true,
      },
    },
    {
      label: '',
      fieldName: 'applyUserName',
      component: 'Input',
      componentProps: {
        placeholder: t('dict.QuotationRequirementsColumn.applyUserName'),
        submitOnPressEnter: true,
        allowClear: true,
      },
    },
    {
      label: '',
      fieldName: 'qrApplyUserName',
      component: 'Input',
      defaultValue: userStore.userInfo?.userName || '',
      componentProps: {
        placeholder: t('dict.CommonCol.applyUserName'),
        submitOnPressEnter: true,
        allowClear: true,
      },
    },
    {
      label: '',
      fieldName: 'factory',
      component: 'Input',
      componentProps: {
        placeholder: t('dict.QuotationRequirementsColumn.FactoryName'),
        submitOnPressEnter: true,
        allowClear: true,
      },
    },
    {
      fieldName: 'creatorTime',
      label: '',
      component: 'RangePicker',
      componentProps: {
        placeholder: [t('component.lydc.timeRange.startPlaceholder'), t('component.lydc.timeRange.endPlaceholder')],
      },
    },
  ];
}

export function doneGetVxeFormConfig(): any {
  return [
    {
      label: '',
      fieldName: 'qrApplyCode',
      component: 'Input',
      componentProps: {
        placeholder: t('dict.FilingsApplyColumn.QuantitativeApplyNo'),
        submitOnPressEnter: true,
        allowClear: true,
      },
    },
    {
      label: '',
      fieldName: 'insidePartNumber',
      component: 'Input',
      componentProps: {
        placeholder: t('dict.QuotationRequirementsColumn.insidePartNumber'),
        submitOnPressEnter: true,
        allowClear: true,
      },
    },
    {
      label: '',
      fieldName: 'immediateCustomerName',
      component: 'Input',
      componentProps: {
        placeholder: t('dict.SalesShipPattern.recordTable.immediateCustomerName'),
        submitOnPressEnter: true,
        allowClear: true,
      },
    },
    {
      label: '',
      fieldName: 'biddingResult',
      component: 'Input',
      componentProps: {
        placeholder: '竞价结果',
        submitOnPressEnter: true,
        allowClear: true,
      },
    },
    {
      label: '',
      fieldName: 'applyUserName',
      component: 'Input',
      componentProps: {
        placeholder: t('dict.QuotationRequirementsColumn.applyUserName'),
        submitOnPressEnter: true,
        allowClear: true,
      },
    },
    {
      label: '',
      fieldName: 'qrApplyUserName',
      component: 'Input',
      defaultValue: userStore.userInfo?.userName || '',
      componentProps: {
        placeholder: t('dict.CommonCol.applyUserName'),
        submitOnPressEnter: true,
        allowClear: true,
      },
    },
    {
      label: '',
      fieldName: 'factory',
      component: 'Input',
      componentProps: {
        placeholder: t('dict.QuotationRequirementsColumn.FactoryName'),
        submitOnPressEnter: true,
        allowClear: true,
      },
    },
    {
      fieldName: 'creatorTime',
      label: '',
      component: 'RangePicker',
      componentProps: {
        placeholder: [t('component.lydc.timeRange.startPlaceholder'), t('component.lydc.timeRange.endPlaceholder')],
      },
    },
  ];
}

export function waitGetVxeColumns() {
  return [
    // 勾选框
    {
      type: 'checkbox',
      field: 'checkbox',
    },
    // 序号
    {
      field: 'seq',
      title: t('component.table.index'),
      type: 'seq',
      width: '50',
      align: 'center',
    },
    // 生产类型
    {
      title: t('dict.CommonCol.productionTypeName'),
      field: 'productionType',
      formatter: ({ cellValue }) => {
        const item = getProductionType.find(item => item.value == cellValue);
        return item?.label || cellValue;
      },
      filters: [{ data: '' }],
      filterRender: {
        name: 'ASelect',
        cSharpType: 'int',
        props: {
          options: getProductionType,
          fieldNames: { label: 'fullName', value: 'id' },
        },
      },
      width: 120,
    },
    {
      title: t('dict.FilingsApplyColumn.QuantitativeApplyNo'),
      field: 'qrApplyCode',
      width: 200,
    },
    {
      title: t('dict.QuotationRequirementsColumn.insidePartNumber'),
      field: 'insidePartNumber',
      width: 160,
    },
    {
      title: t('dict.QuotationRequirementsColumn.FactoryName'),
      field: 'factoryName',
      width: 160,
    },
    {
      title: '工程报价',
      field: 'quota',
      width: 160,
      slots: {
        default: 'quota',
      },
    },
    {
      title: t('dict.CommonCol.applyUserName'),
      field: 'qrApplyUserName',
      aqpFilter: {
        enabled: true,
        searchField: 'qrApplyUserId',
        name: 'CustomUserSelect',
      },
      width: 160,
    },
    {
      title: t('dict.QuotationRequirementsColumn.applyUserName'),
      field: 'applyUserName',
      aqpFilter: {
        enabled: true,
        searchField: 'applyUserId',
        name: 'CustomUserSelect',
      },
      width: 160,
    },
    {
      title: t('dict.CloudMeasureColumn.materialDesc'),
      field: 'productDesc',
      width: 160,
    },
    {
      title: t('dict.SalesShipPattern.recordTable.immediateCustomerName'),
      field: 'immediateCustomerName',
      width: 320,
      formatter: ({ row }) => `${row.immediateCustomerName}(${row.immediateCustomerCode})`,
    },
    {
      title: t('dict.QuotationColumn.terminalCustomerProjectCode'),
      field: 'terminalCustomerProjectCode',
      width: 160,
    },
    {
      title: t('dict.PCCApplyColumn.terminalCustomerPartNumber'),
      field: 'terminalCustomerPartNumber',
      width: 160,
    },
    // 成本价格
    {
      title: t('dict.QuotationColumn.singleCost'),
      field: 'singleCost',
      width: 160,
      aqpFilter: {
        enable: false, // TODO: 该数字有可能为小数，不是整数类型，待后续支持
        cSharpType: 'int',
      },
    },
    {
      title: t('dict.PurchaseQuotationColumn.quotationTime'),
      field: 'purchaseQuotationTime',
      showOverflow: 'tooltip',
      width: '160',
      cellRender: {
        name: 'Date',
        // @ts-ignore
        format: 'YYYY-MM-DD HH:mm:ss',
      },
    },
    // purchaseQuotationTime
    // {
    //   title: t('dict.QuotationColumn.singleCostActual'),
    //   align: 'center',
    //   dataIndex: 'singleCostActual',
    //   width: 160,
    //   resizable: true,
    // },
    {
      title: t('dict.UnitColumn.Remark'),
      field: 'remark',
      width: 160,
    },
    // {
    //   title: '当前处理人',
    //   align: 'center',
    //   dataIndex: 'handlerName',
    //   width: 160,
    //   resizable: true,
    // },
    // {
    //   title: '当前节点',
    //   align: 'center',
    //   dataIndex: 'currentNode',
    //   width: 160,
    //   resizable: true,
    // },
    // {
    //   title: '节点记录',
    //   align: 'center',
    //   dataIndex: 'nodeDetail',
    //   width: 160,
    //   resizable: true,
    // },
    // 操作行
    {
      title: t('common.action'),
      width: '60',
      field: 'action',
      fixed: 'right',
      slots: {
        default: 'action',
      },
    },
  ];
}

export function doneGetVxeColumns(): any {
  return [
    // 勾选框
    {
      type: 'checkbox',
      field: 'checkbox',
    },
    // 序号
    {
      field: 'seq',
      title: t('component.table.index'),
      type: 'seq',
      width: '50',
      align: 'center',
    },
    // 生产类型
    {
      title: t('dict.CommonCol.productionTypeName'),
      field: 'productionType',
      formatter: ({ cellValue }) => {
        const item = getProductionType.find(item => item.value == cellValue);
        return item?.label || cellValue;
      },
      filters: [{ data: '' }],
      filterRender: {
        name: 'ASelect',
        cSharpType: 'int',
        props: {
          options: getProductionType,
          fieldNames: { label: 'fullName', value: 'id' },
        },
      },
      width: 120,
    },
    {
      title: t('dict.FilingsApplyColumn.QuantitativeApplyNo'),
      field: 'qrApplyCode',
      width: 200,
    },
    {
      title: t('dict.QuotationRequirementsColumn.insidePartNumber'),
      field: 'insidePartNumber',
      width: 160,
    },
    {
      title: t('dict.QuotationRequirementsColumn.FactoryName'),
      field: 'factoryName',
      width: 160,
    },
    // 成本价格
    {
      title: t('dict.QuotationColumn.singleCost'),
      field: 'singleCost',
      width: 160,
      aqpFilter: {
        cSharpType: 'int',
      },
    },
    {
      title: '工程报价',
      field: 'quota',
      width: 140,
      slots: {
        default: 'quota',
      },
    },
    {
      title: t('common.commentRemark'),
      field: 'confirmOpinion',
      width: 160,
      cellRender: {
        name: 'Tag',
        options: AGREE_OPTIONS,
      },
    },
    {
      title: t('common.priceCommentRemark'),
      field: 'confirmRemark',
      width: 160,
    },
    {
      title: t('dict.CommonCol.applyUserName'),
      field: 'qrApplyUserName',
      width: 160,
      aqpFilter: {
        enabled: true,
        searchField: 'qrApplyUserId',
        name: 'CustomUserSelect',
      },
    },
    {
      title: t('dict.QuotationRequirementsColumn.applyUserName'),
      field: 'applyUserName',
      width: 160,
      aqpFilter: {
        enabled: true,
        searchField: 'applyUserId',
        name: 'CustomUserSelect',
      },
    },
    {
      title: t('dict.CloudMeasureColumn.materialDesc'),
      field: 'productDesc',
      width: 160,
    },
    {
      title: t('dict.SalesShipPattern.recordTable.immediateCustomerName'),
      field: 'immediateCustomerName',
      width: 320,
      formatter: ({ row }) => `${row.immediateCustomerName}(${row.immediateCustomerCode})`,
    },
    {
      title: t('dict.QuotationColumn.terminalCustomerProjectCode'),
      field: 'terminalCustomerProjectCode',
      width: 160,
    },
    {
      title: t('dict.PCCApplyColumn.terminalCustomerPartNumber'),
      field: 'terminalCustomerPartNumber',
      width: 160,
    },
    // {
    //   title: t('dict.QuotationColumn.singleCost'),
    //   field: 'cost',
    //   width: 160,
    // },

    // {
    //   title: t('dict.QuotationColumn.singleCostActual'),
    //   field: 'costActual',
    //   width: 160,
    // },
    {
      title: t('common.biddingPrice'),
      field: 'currentNode',
      width: 160,
    },
    {
      title: t('dict.QuotationColumn.biddingResult'),
      field: 'biddingResult',
      width: 160,
    },
    // {
    //   title: '当前处理人',
    //   field: 'nodeDetail',
    //   width: 160,
    // },
    // {
    //   title: '当前节点',
    //   field: 'nodeDetail',
    //   width: 160,
    // },
    // {
    //   title: '节点记录',
    //   field: 'nodeDetail',
    //   width: 160,
    // },
    // 操作行
    {
      title: t('common.action'),
      width: '60',
      field: 'action',
      fixed: 'right',
      slots: {
        default: 'action',
      },
    },
  ];
}

export function getAgreeVxeColumns() {
  return [
    // 勾选框
    {
      type: 'checkbox',
      field: 'checkbox',
    },
    // 序号
    {
      field: 'seq',
      title: t('component.table.index'),
      type: 'seq',
      width: '50',
      align: 'center',
    },
    {
      title: t('common.commentRemark'),
      field: 'confirmOpinion',
      minWidth: 160,
      cellRender: {
        name: 'Tag',
        options: AGREE_OPTIONS,
      },
    },
    {
      title: t('common.priceCommentRemark'),
      field: 'confirmRemark',
      minWidth: 240,
      editRender: {
        name: 'Input',
        props: {
          placeholder: t('common.priceCommentRemark'),
        },
      },
    },
    {
      title: t('common.productInformation'),
      field: 'materialType',
      align: 'center',
      children: [
        {
          title: t('dict.QuotationRequirementsColumn.insidePartNumber'),
          field: 'insidePartNumber',
          minWidth: 180,
        },
        {
          title: t('dict.CloudMeasureColumn.materialDesc'),
          field: 'productDesc',
          minWidth: 180,
        },
        {
          title: `${t('common.suggestedPrice')}(GP20%)`,
          field: 'gp20',
          minWidth: 160,
        },
        {
          title: `${t('common.suggestedPrice')}(GP25%)`,
          field: 'gp25',
          minWidth: 160,
        },
        {
          title: `${t('common.productSpecifications')}产品规格(MM)`,
          field: 'productSpec',
          minWidth: 160,
        },
        {
          title: t('common.materialComposition'),
          field: 'materialString',
          minWidth: 160,
        },
        {
          title: `${t('common.moldCost')}(RMB/KPCS)`,
          field: 'moldCost',
          minWidth: 160,
        },
        {
          title: 'MOQ(KPCS)',
          field: 'moq',
          minWidth: 160,
        },
        {
          title: t('dict.QuotationRequirementsColumn.PurposeName'),
          field: 'purpose',
          minWidth: 160,
        },
      ],
    },
    {
      title: t('common.productCost'),
      align: 'center',
      field: 'productCost',
      children: [
        {
          title: t('common.materialCost'),
          field: 'materialCost',
          minWidth: 160,
        },
        {
          title: t('common.DirectLabor'),
          field: 'directLaborCost',
          minWidth: 160,
        },
        {
          title: t('common.indirectLabor'),
          field: 'indirectLaborCost',
          minWidth: 160,
        },
        {
          title: t('common.fixtureAndJig'),
          field: 'moldCost',
          minWidth: 160,
        },
        {
          title: t('common.OutsourcedProcessing'),
          field: 'outsourcingCost',
          minWidth: 160,
        },
        {
          title: t('dict.LaborRateColumn.changeCost'),
          field: 'dynamicEquipmentCost',
          minWidth: 160,
        },
        {
          title: t('dict.LaborRateColumn.fixedCost'),
          field: 'fixedEquipmentCost',
          minWidth: 160,
        },
        {
          title: t('common.administrativeExpenses'),
          field: 'managementCost',
          minWidth: 160,
        },
        {
          title: t('common.restoreFirstPassYield'),
          field: 'fpy',
          minWidth: 160,
        },
        {
          title: t('common.productionHours'),
          field: 'productionTime',
          minWidth: 160,
        },
      ],
    },
    {
      title: t('common.unitCost'),
      field: 'singleCost',
      minWidth: 160,
    },
    // 操作行
    {
      title: t('common.action'),
      width: '60',
      field: 'action',
      fixed: 'right',
      slots: {
        default: 'action',
      },
    },
  ];
}

export function getPriceInfoSchemas(): FormSchema[] {
  return [
    {
      field: 'confirmOpinion',
      label: t('common.commentRemark'),
      component: 'Select',
      componentProps: {
        placeholder: t('common.commentRemark'),
        options: OPINION_OPTIONS,
      },
    },
    {
      field: 'confirmRemark',
      label: t('common.priceCommentRemark'),
      component: 'Input',
      componentProps: {
        placeholder: t('common.priceCommentRemark'),
      },
      baseColProps: {
        span: 8,
      },
    },
  ];
}

const OPINION_OPTIONS = [
  {
    fullName: t('common.agree'),
    id: 1,
  },
  {
    fullName: t('common.disagree'),
    id: 2,
  },
];

export function getBaseInfoSchemas(): FormSchema[] {
  return [
    {
      field: 'applyCode',
      label: t('dict.FilingsApplyColumn.QuantitativeApplyNo'),
      component: 'Input',
      componentProps: {
        placeholder: t('dict.FilingsApplyColumn.QuantitativeApplyNo'),
      },
    },
    {
      field: 'insidePartNumber',
      label: t('dict.QuotationRequirementsColumn.insidePartNumber'),
      component: 'Input',
      componentProps: {
        placeholder: t('dict.QuotationRequirementsColumn.insidePartNumber'),
      },
    },
    {
      field: 'qrApplyUserName',
      label: t('dict.QuotationColumn.Sell'),
      component: 'Input',
      componentProps: {
        placeholder: t('dict.QuotationColumn.Sell'),
      },
    },
    {
      field: 'applyUserName',
      label: t('dict.QuotationRequirementsColumn.applyUserName'),
      component: 'Input',
      componentProps: {
        placeholder: t('dict.QuotationRequirementsColumn.applyUserName'),
      },
    },
    {
      field: 'immediateCustomerName',
      label: t('dict.SalesShipPattern.recordTable.immediateCustomerName'),
      component: 'Input',
      componentProps: {
        placeholder: t('dict.SalesShipPattern.recordTable.immediateCustomerName'),
      },
    },
    {
      field: 'terminalCustomerPartNumber',
      label: t('dict.PCCApplyColumn.terminalCustomerPartNumber'),
      component: 'Input',
      componentProps: {
        placeholder: t('dict.PCCApplyColumn.terminalCustomerPartNumber'),
      },
    },
    {
      field: 'terminalCustomerProjectCode',
      label: t('dict.QuotationColumn.terminalCustomerProjectCode'),
      component: 'Input',
      componentProps: {
        placeholder: t('dict.QuotationColumn.terminalCustomerProjectCode'),
      },
    },
    {
      field: 'productDesc',
      label: t('dict.CloudMeasureColumn.materialDesc'),
      component: 'Input',
      componentProps: {
        placeholder: t('dict.CloudMeasureColumn.materialDesc'),
      },
      colProps: {
        span: 12,
      },
    },
    // {
    //   field: 'remark',
    //   label: t('dict.UnitColumn.Remark'),
    //   component: 'Input',
    //   componentProps: {
    //     placeholder: t('dict.UnitColumn.Remark'),
    //   },
    //   colProps: {
    //     span: 8,
    //   },
    // },
  ];
}

const [baseInfoRegisterForm, { setFieldsValue: baseInfoResetFields }] = useForm({
  baseColProps: { span: 4 },
  schemas: getBaseInfoSchemas(),
  disabled: true,
  layout: 'vertical',
  labelWidth: 200,
});

export const [baseProductRegisterForm, { setFieldsValue: productResetFields, updateSchema: prodUpdateSchema }] = useForm({
  baseColProps: { span: 4 },
  schemas: getProductSchemas(),
  disabled: true,
  layout: 'vertical',
  labelWidth: 200,
});

export const [costRegisterForm, { setFieldsValue: costSetFields, getFieldsValue: costGetFieldValue }] = useForm({
  baseColProps: { span: 4 },
  schemas: getCostSchemas(),
  disabled: true,
  layout: 'vertical',
  labelWidth: 200,
});

function getProductSchemas(): FormSchema[] {
  return [
    {
      field: 'advanceCost',
      // label: '建议价(成本中心)',
      label: `${t('common.suggestedPrice')}(${t('dict.MoldBusinessProcurementSubColumn.costCenter')})`,
      component: 'Input',
      componentProps: {
        placeholder: `${t('common.suggestedPrice')}(${t('dict.MoldBusinessProcurementSubColumn.costCenter')})`,
      },
      render({ model, field }) {
        return (
          <Input.Group compact>
            <InputNumber
              min={0}
              max={100}
              onChange={e => {
                const { singleCost } = costGetFieldValue();
                const res = divide(bignumber(singleCost), subtract(bignumber(1), divide(bignumber(e), bignumber(100)))).toFixed(6);
                model['advanceCost'] = res;
              }}
              default-value={20}
              style={{ width: '55px !important' }}
              formatter={value => `${value}%`}
              parser={value => value.replace('%', '')}
            />
            <FormItem style={{ width: 'calc( 100% - 55px ) !important' }} rules={[{ required: true }]}>
              <Input
                placeholder={`${t('common.suggestedPrice')}(${t('dict.MoldBusinessProcurementSubColumn.costCenter')})`}
                disabled={true}
                v-model:value={model['advanceCost']}
              />
            </FormItem>
          </Input.Group>
        );
      },
    },
    {
      field: 'advanceCost25',
      // label: '建议价(成本中心)',
      label: `${t('common.suggestedPrice')}(${t('dict.MoldBusinessProcurementSubColumn.costCenter')})`,
      component: 'Input',
      componentProps: {
        placeholder: `${t('common.suggestedPrice')}(${t('dict.MoldBusinessProcurementSubColumn.costCenter')})`,
      },
      render({ model, field }) {
        return (
          <Input.Group compact>
            <InputNumber
              min={0}
              max={100}
              onChange={e => {
                const { singleCost } = costGetFieldValue();
                const res = divide(bignumber(singleCost), subtract(bignumber(1), divide(bignumber(e), bignumber(100)))).toFixed(6);
                model['advanceCost'] = res;
              }}
              default-value={25}
              style={{ width: '55px !important' }}
              formatter={value => `${value}%`}
              parser={value => value.replace('%', '')}
            />
            <FormItem style={{ width: 'calc( 100% - 55px ) !important' }} rules={[{ required: true }]}>
              <Input
                placeholder={`${t('common.suggestedPrice')}(${t('dict.MoldBusinessProcurementSubColumn.costCenter')})`}
                disabled={true}
                v-model:value={model['advanceCost25']}
              />
            </FormItem>
          </Input.Group>
        );
      },
    },
    // {
    //   field: 'actualAdvanceCost',
    //   label: `${t('common.suggestedPrice')}${t('dict.PurchaseQuotationColumn.actualPurchasePrice')}`,
    //   component: 'Input',
    //   componentProps: {
    //     placeholder: `${t('common.suggestedPrice')}${t('dict.PurchaseQuotationColumn.actualPurchasePrice')}`,
    //   },
    //   render({ model, field }) {
    //     return (
    //       <Input.Group compact>
    //         <InputNumber
    //           min={0}
    //           max={100}
    //           onChange={e => {
    //             const { singleCost, singleCostActual } = costGetFieldValue();
    //             const res = divide(bignumber(singleCostActual), subtract(bignumber(1), divide(bignumber(e), bignumber(100)))).toFixed(6);
    //             model['actualAdvanceCost'] = res;
    //           }}
    //           default-value={25}
    //           style={{ width: '55px !important' }}
    //           formatter={value => `${value}%`}
    //           parser={value => value.replace('%', '')}
    //         />
    //         <FormItem style={{ width: 'calc( 100% - 55px ) !important' }} rules={[{ required: true }]}>
    //           <Input
    //             placeholder={`${t('common.suggestedPrice')}${t('dict.PurchaseQuotationColumn.actualPurchasePrice')}`}
    //             disabled={true}
    //             v-model:value={model['actualAdvanceCost']}
    //           />
    //         </FormItem>
    //       </Input.Group>
    //     );
    //   },
    // },
    {
      field: 'productSpec',
      label: `${t('common.productSpecifications')}(MM)`,
      component: 'Input',
      componentProps: {
        placeholder: `${t('common.productSpecifications')}(MM)`,
      },
    },
    {
      field: 'moldCost',
      label: `${t('common.moldCost')}(RMB/KPCS)`,
      component: 'Input',
      componentProps: {
        placeholder: `${t('common.moldCost')}(RMB/KPCS)`,
      },
    },
    {
      field: 'moq',
      label: 'MOQ(KPCS)',
      component: 'Input',
      componentProps: {
        placeholder: 'MOQ(KPCS)',
      },
    },
    {
      field: 'purpose',
      label: t('dict.QuotationReportColumn.purpose'),
      component: 'Input',
      componentProps: {
        placeholder: t('dict.QuotationReportColumn.purpose'),
      },
    },
    // {
    //   field: 'exchangeRate',
    //   label: '建议价(底价)(GP20%)',
    //   component: 'Input',
    //   componentProps: {
    //     placeholder: '建议价(底价)(GP20%)',
    //   },
    // },
    // {
    //   field: 'exchangeRate',
    //   label: '建议价(底价)(GP25%)',
    //   component: 'Input',
    //   componentProps: {
    //     placeholder: '建议价(底价)(GP25%)',
    //   },
    // },
    // {
    //   field: 'materialString',
    //   label: t('common.materialComposition'),
    //   component: 'Input',
    //   componentProps: {
    //     placeholder: t('common.materialComposition'),
    //   },
    //   colProps: {
    //     span: 16,
    //   },
    // },
    // {
    //   field: 'confirmRemark',
    //   label: t('dict.UnitColumn.Remark'),
    //   component: 'Input',
    //   componentProps: {
    //     placeholder: t('dict.UnitColumn.Remark'),
    //   },
    //   colProps: {
    //     span: 12,
    //   },
    // },
  ];
}

export function getCostSchemas(): FormSchema[] {
  return [
    {
      field: 'materialCost',
      label: `${t('common.materialCost')}(${t('common.costCenterPrice')})`,
      component: 'InputNumber',
      componentProps: {
        placeholder: `${t('common.materialCost')}(${t('common.costCenterPrice')})`,
      },
    },
    {
      field: 'directLaborCost',
      label: t('common.directLaborCost'),
      component: 'Input',
      componentProps: {
        placeholder: t('common.directLaborCost'),
      },
    },
    // {
    //   field: 'materialCostActual',
    //   label: `${t('common.materialCost')}(${t('dict.PurchaseQuotationColumn.actualPurchasePrice')})`,
    //   component: 'InputNumber',
    // },
    {
      field: 'indirectLaborCost',
      label: t('common.indirectLabor'),
      component: 'Input',
      componentProps: {
        placeholder: t('common.indirectLabor'),
      },
    },
    {
      field: 'moldCost',
      label: t('common.fixtureAndJig'),
      component: 'Input',
      componentProps: {
        placeholder: t('common.fixtureAndJig'),
      },
    },
    {
      field: 'outsourcingCost',
      label: t('common.OutsourcedProcessing'),
      component: 'InputNumber',
      componentProps: {
        placeholder: t('common.OutsourcedProcessing'),
      },
    },
    {
      field: 'dynamicEquipmentCost',
      label: t('dict.LaborRateColumn.changeCost'),
      component: 'Input',
      componentProps: {
        placeholder: t('dict.LaborRateColumn.changeCost'),
      },
    },
    {
      field: 'fixedEquipmentCost',
      label: t('dict.LaborRateColumn.fixedCost'),
      component: 'Input',
      componentProps: {
        placeholder: t('dict.LaborRateColumn.fixedCost'),
      },
    },
    {
      field: 'managementCost',
      label: `${t('common.administrativeExpenses')}(${t('common.costCenterPrice')})`,
      component: 'Input',
    },
    // {
    //   field: 'managementCostActual',
    //   label: `${t('common.administrativeExpenses')}(${t('dict.PurchaseQuotationColumn.actualPurchasePrice')})`,
    //   component: 'Input',
    // },
    {
      field: 'fpy',
      label: t('common.restoreFirstPassYield'),
      component: 'Input',
      componentProps: {
        placeholder: t('common.restoreFirstPassYield'),
      },
    },
    {
      field: 'productionTime',
      label: `${t('common.productionHours')}(S)`,
      component: 'Input',
    },
    {
      field: 'singleCost',
      label: `${t('common.unitCost')}(${t('common.costCenterPrice')})`,
      component: 'Input',
    },
    // {
    //   field: 'singleCostActual',
    //   label: `${t('common.unitCost')}(${t('dict.PurchaseQuotationColumn.actualPurchasePrice')})`,
    //   component: 'Input',
    // },
  ];
}

export function getColumnsView() {
  return [
    {
      title: t('dict.FilingsApplyColumn.QuantitativeApplyNo'),
      field: 'qrApplyCode',
      width: 120,
      filters: [{ data: '' }],
      filterRender: {
        name: 'Input',
      },
      slots: { default: 'qrApplyCode' },
    },
    {
      title: t('dict.QuotationRequirementsColumn.insidePartNumber'),
      field: 'insidePartNumber',
      width: 160,
      filters: [{ data: '' }],
      filterRender: {
        name: 'Input',
      },
    },
    {
      title: t('dict.QuotationColumn.Sell'),
      align: 'center',
      field: 'qrApplyUserName',
      width: 160,
      filters: [{ data: '' }],
      filterRender: {
        name: 'Input',
      },
    },
    {
      title: t('dict.QuotationRequirementsColumn.applyUserName'),
      align: 'center',
      // helpMessage: 'PD',
      field: 'applyUserName',
      width: 160,
      filters: [{ data: '' }],
      filterRender: {
        name: 'Input',
      },
    },
    {
      title: t('dict.CloudMeasureColumn.materialDesc'),
      align: 'center',
      field: 'productDesc',
      width: 160,
      filters: [{ data: '' }],
      filterRender: {
        name: 'Input',
      },
    },
    {
      title: t('dict.SalesShipPattern.recordTable.immediateCustomerName'),
      align: 'center',
      field: 'immediateCustomerName',
      width: 320,
      filters: [{ data: '' }],
      filterRender: {
        name: 'Input',
      },
      // customRender: ({ record }) => {
      // 	return `${record.immediateCustomerName}(${record.immediateCustomerCode})`;
      // },
    },
    {
      title: t('dict.QuotationColumn.terminalCustomerProjectCode'),
      align: 'center',
      field: 'terminalCustomerProjectCode',
      width: 160,
      filters: [{ data: '' }],
      filterRender: {
        name: 'Input',
      },
    },
    {
      title: t('dict.PCCApplyColumn.terminalCustomerPartNumber'),
      align: 'center',
      field: 'terminalCustomerPartNumber',
      width: 160,
      filters: [{ data: '' }],
      filterRender: {
        name: 'Input',
      },
    },
    {
      title: t('dict.QuotationColumn.singleCost'),
      align: 'center',
      field: 'singleCost',
      width: 160,
      filters: [{ data: '' }],
      filterRender: {
        name: 'Input',
      },
    },
    {
      title: t('dict.QuotationColumn.singleCostActual'),
      align: 'center',
      field: 'singleCostActual',
      width: 160,
      filters: [{ data: '' }],
      filterRender: {
        name: 'Input',
      },
    },
    {
      title: t('dict.UnitColumn.Remark'),
      align: 'center',
      field: 'remark',
      width: 160,
      filters: [{ data: '' }],
      filterRender: {
        name: 'Input',
      },
    },
  ];
}

export function getFormSchema() {
  return [
    {
      label: '',
      fieldName: 'applyCode',
      component: 'Input',
      componentProps: {
        placeholder: t('dict.FilingsApplyColumn.QuantitativeApplyNo'),
        submitOnPressEnter: true,
      },
      i18nField: t('dict.FilingsApplyColumn.QuantitativeApplyNo'),
    },
    {
      label: '',
      fieldName: 'insidePartNumber',
      component: 'Input',
      componentProps: {
        placeholder: t('dict.QuotationRequirementsColumn.insidePartNumber'),
        submitOnPressEnter: true,
      },
    },
    {
      label: '',
      fieldName: 'immediateCustomerName',
      component: 'Input',
      componentProps: {
        placeholder: t('dict.SalesShipPattern.recordTable.immediateCustomerName'),
        submitOnPressEnter: true,
      },
    },
    {
      label: '',
      fieldName: 'time',
      component: 'RangePicker',
      componentProps: {
        submitOnPressEnter: true,
        placeholder: [t('component.lydc.dateRange.startPlaceholder'), t('component.lydc.dateRange.endPlaceholder')],
      },
    },
    {
      label: '',
      fieldName: 'applyUserName',
      component: 'Input',
      componentProps: {
        placeholder: t('dict.QuotationRequirementsColumn.applyUserName'),
        submitOnPressEnter: true,
      },
    },
    {
      label: '',
      fieldName: t('dict.QuotationColumn.Sell'),
      component: 'Input',
      componentProps: {
        placeholder: t('dict.QuotationColumn.Sell'),
        submitOnPressEnter: true,
      },
    },
  ];
}

/** 材料组成展示列 */
export const materialStringColumns: Array<any> = [
  // 内部料号
  {
    title: t('dict.CommonCol.innerMaterialCode'),
    field: 'insidePartNumber',
    width: 180,
    formatter: ({ row }) => row.halfFinishedPart || row.insidePartNumber || '',
  },
  // 材料组成
  {
    title: t('common.materialComposition'),
    field: 'materialString',
  },
  // 备注
  {
    title: t('dict.CommonCol.remark'),
    field: 'remark',
  },
];
