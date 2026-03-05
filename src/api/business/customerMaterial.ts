import { defHttp } from '/@/utils/http/axios';

enum Api {
    Prefix = '/api/Information/CustomerMaterial',
}

//查询列表
export function getCustomerMaterial(data) {
    return defHttp.get({ url: Api.Prefix }, data);
}

//通过ID查询
export function getCustomerMaterialById(id) {
    return defHttp.get({ url: Api.Prefix + `/${id}` })
}

//新增
export function addCustomerMaterial(data) {
    return defHttp.post({ url: Api.Prefix, data });
}

//修改
export function updateCustomerMaterial(data) {
    return defHttp.put({ url: Api.Prefix + `/${data.Id}`, data });
}

//删除
export function deleteCustomerMaterial(id) {
    return defHttp.delete({ url: Api.Prefix + `/${id}` })
}

//批量删除
export function blukDeleteCustomerMaterial(data) {
    return defHttp.post({ url: Api.Prefix + '/BlukDelete', data })
}


//导出Excel
export function exportMaterialExcel(data) {
    return defHttp.get({ url: Api.Prefix + `/ExportData`, data });
}
