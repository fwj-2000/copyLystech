import { defHttp } from '/@/utils/http/axios';
import { ContentTypeEnum } from '/@/enums/httpEnum';

enum Api {
  Prefix = '/api/Information',
}

// /Information/quotation/ConfirmPrice
export function getConfirmPriceList(data) {
  return defHttp.get({ url: Api.Prefix + `/quotation/ConfirmPrice`, data });
}
// Quotation/UpdatePrice
export function updatePrice(data) {
  return defHttp.post({ url: Api.Prefix + `/Quotation/UpdatePrice`, data });
}
// /api/Information/quotation/{id}/savegp
export function saveGp(id, data) {
  return defHttp.put({ url: Api.Prefix + `/quotation/${id}/savegp`, data });
}
// /api/Information/quotation/export/quotation
export function exportQuotation(data) {
  return defHttp.get({ url: Api.Prefix + `/quotation/export/quotation`, data });
}
// /api/Information/quotation/{id}/savebidding
export function saveBidding(data) {
  return defHttp.put({
    url: Api.Prefix + `/quotation/${data.id}/savebidding`,
    data,
  });
}
// 确认价格-批量
// /api/Information/quotation/confirm
export function confirmQuotation(data) {
  return defHttp.post({
    url: Api.Prefix + `/quotation/confirm`,
    data,
  });
}

// 价格确认-单个
// /api/Information/quotation/{id}/confirm
export function confirmQuotationSingle(data) {
  return defHttp.put({
    url: Api.Prefix + `/quotation/${data.id}/confirm`,
    data,
  });
}

// 导出Excel-未制作.
// /api/Information/quotation/exportexcel/tomake
export function exportExcelTomake(data) {
  return defHttp.get({ url: Api.Prefix + `/quotation/exportexcel/tomake`, data });
}

// 导出成本分析 /Information/quotation/export/Cost
export function exportCost(data) {
  return defHttp.get({ url: Api.Prefix + `/quotation/export/Cost`, data });
}

//headers: { 'Content-Type': ContentTypeEnum.FORM_URLENCODED }

/**
 * 通过`bomId`获取`Bom`的对应信息
 * @param bomId
 * @returns
 */
export function getQuotationBomByBomId(bomId: string) {
  return defHttp.get({ url: Api.Prefix + `/Quotation/GetQuotationBom/${bomId}` });
}
