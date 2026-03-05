import type { FormSchema } from '/@/components/Form';

import { getSpaceList, getFactoryList } from '/@/api/engineering/sample';
import { getMaterialCode } from '/@/api/structure/materialCode';
import { getQuantitationApplyDetailByMaterial } from '/@/api/business/quantitation';
import { getunitList } from '/@/api/common/constant';
import { nextTick } from 'vue';
import { handleInnerPartNumberItem, computeProductArea, computeApplyArea, getRelatedPersonnel } from './configVxe';
import { computeReplyArea } from '/@/views/purchase/sampleDemand/components/pending/configVxe';
import { useI18n } from '/@/hooks/web/useI18n';
import { getPartNumberFactoryList } from '/@/api/basicData/factory';

const { t } = useI18n();

/**
 * 申请表单配置
 */
export function getApplyInfoSchemas(setFieldsValue: any, getFieldsValue: any): Array<FormSchema> {
  return [
    {
      label: '单号',
      field: 'applyNumber',
      component: 'Input',
      componentProps: {
        disabled: true,
      },
    },
    {
      label: '产品内部料号',
      field: 'insidePartNumber',
      component: 'ApiSelect',
      componentProps: {
        api: getQuantitationApplyDetailByMaterial,
        showSearch: true,
        apiSearch: {
          show: true,
          searchName: 'innerMaterialNumber',
        },
        params: {
          pageSize: 20,
        },
        resultField: 'data',
        labelField: 'InsidePartNumber',
        valueField: 'InsidePartNumber',
        filterOption: false,
        immediate: false,
        onChange: (value, data) => {
          const item = handleInnerPartNumberItem(data);
          setFieldsValue({ ...item, factoryName: item.factory, applyShippingSpaceId: '', applyShippingSpaceName: '' });
          nextTick(() => {
            getRelatedPersonnel(getFieldsValue).then(res => {
              setFieldsValue(res);
            });
          });
        },
      },
    },
    {
      label: '旧版成品编码',
      field: 'insideNumberOld',
      component: 'Input',
      componentProps: {
        disabled: true,
      },
    },
    {
      label: '终端项目代码',
      field: 'terminalProjectCode',
      component: 'Input',
      componentProps: {
        disabled: true,
      },
    },
    {
      label: '材料八码',
      field: 'innerMaterialNumber',
      component: 'ApiSelect',
      componentProps: {
        api: getMaterialCode,
        showSearch: true,
        apiSearch: {
          show: true,
          searchName: 'shortMaterialCode',
        },
        immediate: true,
        params: {
          pageSize: 20,
        },
        placeholder: '',
        resultField: 'data',
        labelField: 'shortMaterialCode',
        valueField: 'shortMaterialCode',
        filterOption: false,
        onChange: (value: any, _data: any) => {
          setFieldsValue({ innerMaterialNumber: value ?? '' });

          nextTick(() => {
            getRelatedPersonnel(getFieldsValue).then((res: any) => {
              const { innerMaterialNumber, innerExternalNumber, ...rest } = res || {};
              setFieldsValue(rest);
            });
          });
        },
      },
    },
    {
      label: '原厂商型号',
      field: 'innerExternalNumber',
      component: 'Input',
      componentProps: {
        placeholder: '/',
      },
    },
    {
      label: '工厂',
      field: 'factoryId',
      i18nField: 'factoryName',
      component: 'ApiSelect',
      componentProps: {
        api: params => getPartNumberFactoryList({ ...params, partNumber: getFieldsValue()?.insidePartNumber || '' }),
        placeholder: '请选择',
        showSearch: true,
        params: {},
        apiSearch: {
          show: true,
          searchName: 'factory',
        },
        resultField: 'data',
        labelField: 'Name',
        valueField: 'Id',
        immediate: false,
        alwaysLoad: true,
        nameFormat: ['Code', '/', 'Name'],
        onChange: (value: any, data: any) => {
          nextTick(() => {
            setFieldsValue({ factoryName: data.label || '', factoryCode: data.Code || '', applyShippingSpaceId: '', applyShippingSpaceName: '' });
            getRelatedPersonnel(getFieldsValue).then(res => {
              setFieldsValue(res);
            });
          });
        },
      },
    },
    {
      label: '申请仓位',
      field: 'applyShippingSpaceId',
      component: 'ApiSelect',
      i18nField: 'applyShippingSpaceName',
      componentProps: {
        api: params => getSpaceList({ ...params, factoryId: getFieldsValue()?.factoryId || '' }),
        resultField: 'data',
        labelField: 'shippingSpaceName',
        valueField: 'id',
        showSearch: true,
        nameFormat: ['shippingSpaceCode', '/', 'shippingSpaceName'],
        params: {},
        alwaysLoad: true,
        filterOption: (input: string, option: any) => {
          return option.label.includes(input);
        },
        onChange: (_: any, data: any) => {
          setFieldsValue({ applyShippingSpaceName: data?.label || '' });
        },
      },
    },
    {
      label: '产品长度(MM)',
      field: 'productSizeLong',
      component: 'InputNumber',
      componentProps: {
        onChange: () => {
          nextTick(() => setFieldsValue({ productArea: computeProductArea(getFieldsValue()) }));
        },
      },
    },
    {
      label: '产品宽度(MM)',
      field: 'productSizeWide',
      component: 'InputNumber',
      componentProps: {
        onChange: () => {
          nextTick(() => setFieldsValue({ productArea: computeProductArea(getFieldsValue()) }));
        },
      },
    },
    {
      label: '产品面积(M2)',
      field: 'productArea',
      component: 'Input',
      componentProps: {
        disabled: true,
      },
    },
    {
      label: '申请宽度(MM)',
      field: 'applySizeWide',
      component: 'InputNumber',
      componentProps: {
        onChange: () => {
          nextTick(() => setFieldsValue({ applyArea: computeApplyArea(getFieldsValue()) }));
        },
      },
    },
    {
      label: '申请长度(M)',
      field: 'applySizeLong',
      component: 'InputNumber',
      componentProps: {
        onChange: () => {
          nextTick(() => setFieldsValue({ applyArea: computeApplyArea(getFieldsValue()) }));
        },
      },
    },
    {
      label: '申请数量',
      field: 'qty',
      component: 'InputNumber',
      componentProps: {
        onChange: () => {
          nextTick(() => setFieldsValue({ applyArea: computeApplyArea(getFieldsValue()) }));
        },
      },
    },
    {
      label: '数量单位',
      field: 'measurementUnitId',
      component: 'ApiSelect',
      i18nField: 'measurementUnit',
      componentProps: {
        api: getunitList,
        showSearch: true,
        resultField: 'data',
        valueField: 'Id',
        labelField: 'Name',
        filterOption: (input: string, option: any) => {
          return option.label.includes(input);
        },
        immediate: true,
        disabled: false,
        onChange: (_: any, data: any) => {
          setFieldsValue({ measurementUnit: data?.label || '' });
        },
      },
    },
    {
      label: '申请面积(M2)',
      field: 'applyArea',
      component: 'Input',
      componentProps: {
        disabled: true,
      },
    },
    {
      label: '成品打样数量(KPCS)',
      field: 'finishedProductQty',
      component: 'InputNumber',
    },
    {
      label: '要求到样日期',
      field: 'requestArrivalDate',
      i18nField: 'requestArrivalDateTime',
      component: 'DatePicker',
      componentProps: {
        valueFormat: 'YYYY-MM-DD',
      },
    },
    {
      label: '所处阶段',
      field: 'currentStageNew',
      component: 'Input',
    },
    {
      label: 'PD',
      field: 'personEngineeringId',
      i18nField: 'personEngineeringName',
      component: 'CustomUserSelect',
      componentProps: {
        onChange(_: any, data: any) {
          setFieldsValue({ personEngineeringName: data?.fullName || '' });
        },
      },
    },
    // 采购
    {
      label: t('dict.CommonCol.nextHandler', [t('common.purchaser')]),
      field: 'purchaseUserId',
      component: 'CustomUserSelect',
      componentProps: {
        onChange(_: any, data: any) {
          setFieldsValue({ purchaseUserName: data.fullName || '' });
        },
      },
    },
    {
      label: '申请人姓名',
      field: 'applyUserName',
      component: 'Input',
      componentProps: {
        disabled: true,
      },
    },
    {
      label: '申请时间',
      field: 'applyDateTime',
      i18nField: 'applyDate',
      component: 'Input',
      componentProps: {
        disabled: true,
      },
    },
    {
      label: '备注',
      field: 'remark',
      component: 'Input',
      colProps: {
        span: 8,
      },
    },
    {
      label: '产品描述',
      field: 'description',
      component: 'Textarea',
      colProps: {
        span: 8,
      },
      componentProps: {
        autoSize: true,
        minRows: 1,
      },
    },
    {
      label: '材料描述',
      field: 'materialDescription',
      component: 'Textarea',
      componentProps: {
        disabled: true,
        autoSize: true,
        minRows: 1,
      },
      colProps: {
        span: 8,
      },
    },
  ];
}

/**
 * 回复信息表单配置
 */
export function getReplyInfoSchemas(setFieldsValue: any, getFieldsValue: any): Array<FormSchema> {
  return [
    {
      label: '回复宽度(MM)',
      field: 'replySizeWide',
      component: 'InputNumber',
      componentProps: {
        onChange: () => {
          nextTick(() => setFieldsValue({ replyArea: computeReplyArea(getFieldsValue()) }));
        },
      },
    },
    {
      label: '回复长度(M)',
      field: 'replySizeLong',
      component: 'InputNumber',
      componentProps: {
        onChange: () => {
          nextTick(() => setFieldsValue({ replyArea: computeReplyArea(getFieldsValue()) }));
        },
      },
    },
    {
      label: '回复数量',
      field: 'replyQty',
      component: 'InputNumber',
      componentProps: {
        onChange: () => {
          nextTick(() => setFieldsValue({ replyArea: computeReplyArea(getFieldsValue()) }));
        },
      },
    },
    {
      label: '回复面积(M2)',
      field: 'replyArea',
      component: 'Input',
      componentProps: {
        disabled: true,
      },
    },
    {
      label: '到料日期',
      field: 'arrivalDate',
      component: 'DatePicker',
      componentProps: {
        valueFormat: 'YYYY-MM-DD',
      },
    },
    {
      label: '快递信息',
      field: 'expressInformation',
      component: 'Input',
      colProps: {
        span: 8,
      },
    },
    {
      label: '备注',
      field: 'replyRemark',
      component: 'Input',
      colProps: {
        span: 8,
      },
    },
  ];
}
