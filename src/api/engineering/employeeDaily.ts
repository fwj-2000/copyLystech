import { ContentTypeEnum } from '/@/enums/httpEnum';
import { defHttp } from '/@/utils/http/axios';
import { UploadFileParams } from '/#/axios';
import { useGlobSetting } from '/@/hooks/setting';
const { apiUrl } = useGlobSetting();
enum Api {
  ProductionPrefix = '/api/Production',
}
// 查询
export function EmployeeDailyReport(data) {
  return defHttp.get({ url: Api.ProductionPrefix + '/MoldPartPlan/EmployeeDailyReport', data });
}

//
export function EmployeeDailyReportExport(data) {
  return defHttp.post({ url: Api.ProductionPrefix + '/MoldPartPlan/EmployeeDailyReport/Export', data });
}
