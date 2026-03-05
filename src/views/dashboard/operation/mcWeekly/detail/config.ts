import { EModuleCode, ALL_COLUMNS_OPTIONS, mcTypeOptions, chaoqiOptions, meterOptions, matnrYypeOptions } from '../config';
import { getMCWeeklyLgort } from '/@/api/dashbord/report';
import { IColumnOptions, IOption } from '/@/views/dashboard/types';
import {} from '../config';

const getAllColumns = (moduleCode: EModuleCode) => {
  switch (moduleCode) {
    case EModuleCode.OUTBOUND_SHIPMENTS:
      return [
        { dataIndex: 'factory' },
        { dataIndex: 'matnr' },
        { dataIndex: 'doctype', title: '领料类型' },
        { dataIndex: 'mengeNum' },
        { dataIndex: 'meins' },
        { dataIndex: 'entdate', title: '出库日期' },
        { dataIndex: 'lgort' },
        { dataIndex: 'valuerange' },
      ];
    case EModuleCode.INVENTORY:
      return [
        { dataIndex: 'factory' },
        { dataIndex: 'matnr' },
        { dataIndex: 'matnrtype', title: '类型' },
        { dataIndex: 'mengeNum' },
        { dataIndex: 'meins' },
        { dataIndex: 'lgort' },
        { dataIndex: 'valuerange' },
      ];
    case EModuleCode.SLUGGISH:
      return [
        { dataIndex: 'factory' },
        { dataIndex: 'matnr' },
        { dataIndex: 'matnrtype', title: '类型' },
        { dataIndex: 'mengeNum' },
        { dataIndex: 'period' },
        { dataIndex: 'type' },
        { dataIndex: 'valuerange' },
      ];
    case EModuleCode.EXTENDED:
      return [
        { dataIndex: 'factory' },
        { dataIndex: 'matnr' },
        { dataIndex: 'matnrtype', title: '类型' },
        { dataIndex: 'mengeNum' },
        { dataIndex: 'meins' },
        { dataIndex: 'overtype' },
        { dataIndex: 'lgort' },
        { dataIndex: 'valuerange' },
      ];
    case EModuleCode.MATERIAL_DISTRIBUTION:
      return [
        { dataIndex: 'factory' },
        { dataIndex: 'matnr' },
        { dataIndex: 'type', title: '类型' },
        { dataIndex: 'matnrtype', title: '主辅材料' },
        { dataIndex: 'mengeNum' },
        { dataIndex: 'lgort' },
        { dataIndex: 'valuerange' },
      ];
    default:
      return [
        { dataIndex: 'factory' },
        { dataIndex: 'matnr' },
        { dataIndex: 'mengeNum', title: '卷数' },
        { dataIndex: 'meins' },
        { dataIndex: 'entdate', title: '入库日期' },
        { dataIndex: 'lgort' },
        { dataIndex: 'valuerange' },
      ];
  }
};

// 字段配置
export const getColumnsOptions = (moduleCode: EModuleCode): IColumnOptions[] =>
  getAllColumns(moduleCode).map(item => ({
    ...ALL_COLUMNS_OPTIONS[item.dataIndex],
    ...item,
  }));

// 指标代码类型下拉
export const defaultModuleCode = '1';
// 材料类型下拉
export const defaultMcType = '';
// 超期天数下拉
export const defaultChaoqi = '';
// 材料米数下拉
export const defaultMeter = '';
// 库位下拉
export const defaultLgort = '';

// 所有下拉默认值配置
export const allDefaultOption = {
  moduleCode: defaultModuleCode,
  mcType: defaultMcType,
  chaoqi: defaultChaoqi,
  meter: defaultMeter,
  lgort: defaultLgort,
};

// 获取所有下拉配置
export const getAllOptions = async (params: any): Promise<IOption[]> => {
  const lgortOptions: IOption[] = [];
  if (params.moduleCode !== EModuleCode.SLUGGISH && params.moduleCode !== EModuleCode.MATERIAL_DISTRIBUTION) {
    const { data } = (await getMCWeeklyLgort(params).catch()) || { data: {} };
    const { list = [] } = data;
    lgortOptions.push({
      text: '库位',
      width: 84,
      props: 'lgort',
      options: [{ label: '全部', value: '' }].concat(list.map(item => ({ label: item, value: item }))),
    });
  }
  switch (params.moduleCode) {
    case EModuleCode.INVENTORY:
      return [
        ...lgortOptions,
        {
          text: '材料类型',
          props: 'mcType',
          options: mcTypeOptions,
        },
      ];
    case EModuleCode.SLUGGISH:
      return [
        {
          text: '材料类型',
          props: 'mcType',
          options: mcTypeOptions,
        },
      ];
    case EModuleCode.EXTENDED:
      return [
        ...lgortOptions,
        {
          text: '材料类型',
          props: 'mcType',
          options: mcTypeOptions,
        },
        {
          text: '超期天数',
          props: 'chaoqi',
          options: chaoqiOptions,
        },
      ];
    case EModuleCode.MATERIAL_DISTRIBUTION:
      return [
        ...lgortOptions,
        {
          text: '材料类型',
          props: 'mcType',
          options: mcTypeOptions,
        },
        {
          text: '主辅材料',
          props: 'isMAin',
          options: matnrYypeOptions,
        },
        {
          text: '材料米数',
          props: 'meter',
          options: meterOptions,
        },
      ];
    default:
      return [...lgortOptions];
  }
};
