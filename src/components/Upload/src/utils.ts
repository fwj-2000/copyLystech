import { fileDownload } from '/@/api/purchase/importMateria';
import { getDrawingsHistory } from '/@/api/common/files';
export enum PartNumberApplyDrawingsType {
  CustomerDrawings = 'CustomerDrawings',
  DesensitizedDrawings = 'DesensitizedDrawings',
  EngineeringDrawings = 'EngineeringDrawings',
  MoldDrawings = 'MoldDrawings',
  ProductImage = 'ProductImage',
  ProductionMaterials = 'ProductionMaterials',
  ProgramCode = 'ProgramCode',
  ProgramProcess = 'ProgramProcess',
  TechnologyInfo = 'TechnologyInfo',
  TestReport = 'TestReport',
  WeighPicture = 'WeighPicture',
}
export function handleDrawParams(params: { insidePartNumber: string; DrawingsType?: PartNumberApplyDrawingsType }) {
  return {
    insidePartNumber: params.insidePartNumber,
    keyFieldName: 'insidePartNumber',
    downloadApi: fileDownload,
    listApi: () => {
      params.Status = 1;
      return getDrawingsHistory(params);
    },
  };
}
