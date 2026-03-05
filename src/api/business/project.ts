import { defHttp } from '/@/utils/http/axios';

enum Api {
    Prefix = '/api/Information/project',
}


//查询列表
export function getProject(data) {
    return defHttp.get({ url: Api.Prefix, data });
}

//通过ID查询
export function getProjectById(id) {
    return defHttp.get({ url: Api.Prefix + `/${id}` })
}

//新增
export function addProject(data) {
    console.log(data)
    return defHttp.post({ url: Api.Prefix, data });
}

//修改
export function updateProject(data) {
    return defHttp.put({ url: Api.Prefix + `/${data.Id}`, data });
}


//删除
export function deleteProject(id) {
    return defHttp.delete({ url: Api.Prefix + `/${id}` })
}

//批量删除
export function blukDeleteProject(data) {
    return defHttp.post({ url: Api.Prefix + '/BlukDelete', data })
}

//导出Excel
export function exportProjectExcel(data) {
    return defHttp.get({ url: Api.Prefix + `/ExportData`, data });
}

//获取用户所在组织
export function getOrganize() {
    return defHttp.get({ url: Api.Prefix + `/GetOrganize` })
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