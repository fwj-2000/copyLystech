import { defHttp } from '/@/utils/http/axios';

enum Api {
    Prefix = '/api/Information/unit',
}


//查询列表
export function getUnit(data) {
    return defHttp.get({ url: Api.Prefix, data });
}
//通过ID查询
export function getUnitById(id) {
    return defHttp.get({ url: Api.Prefix + `/${id}` })
}

//新增
export function addUnit(data) {
    return defHttp.post({ url: Api.Prefix, data });
}

//修改
export function updateUnit(data) {
    return defHttp.put({ url: Api.Prefix + `/${data.Id}`, data });
}

//删除
export function deleteUnit(id) {
    return defHttp.delete({ url: Api.Prefix + `/${id}` })
}

//批量删除
export function blukDeleteUnit(data) {
    return defHttp.post({ url: Api.Prefix + '/BlukDelete', data })
}

// 导入模板下载
export function templateDownload() {
    return defHttp.get({ url: Api.Prefix + `/TemplateDownload` });
}


// 导入
export function importData(data) {
    return defHttp.post({ url: Api.Prefix + `/ImportData`, data });
}

// 导入预览
export function importPreview(data) {
    return defHttp.get({ url: Api.Prefix + `/ImportPreview`, data });
}

//导出Excel
export function exportUnitExcel(data) {
    return defHttp.get({ url: Api.Prefix + `/ExportData`, data });
}