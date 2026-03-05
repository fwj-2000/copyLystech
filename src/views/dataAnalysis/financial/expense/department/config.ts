import { h } from 'vue';
import { exportDeparImportTemplate, exportDeptNoMaintenance } from '/@/api/dataAnalysis/fare';
import { useDownload } from '/@/views/dashboard/hooks/useDownload';
import { commonDateOption, commonLargeTextOption, commonMediumTextOption } from '/@/views/dataAnalysis/components/BaseVxeTable/config';
import * as XLSX from 'xlsx';
import { formatToDate } from '/@/utils/dateUtil';
import { get } from 'lodash-es';

import { EFormItemType, TFormItemOption } from '/@/views/dataAnalysis/components/BaseSearchForm/types';
import { BaseVxeTableTypes } from '/@/views/dataAnalysis/components/BaseVxeTable/types';
import SingleUploadComponent from '/@/views/dataAnalysis/components/SingleUpload.vue';
import { MenuItemType } from '/@/views/dataAnalysis/components/BatchMenu/types';

// 批量导入菜单
const { downloadFile: deparImportTemplateDownload } = useDownload({
  requestApi: exportDeparImportTemplate,
});

/**
 * 未维护数据导出
 * @param data
 * @returns
 */
function exportDeptNoMaintenanceToExcel(data: Array<{ [key: string]: string }>) {
  if (!Array.isArray(data)) {
    return;
  }

  // `未维护数据导出`字段列表及顺序配置
  const fieldList = ['Budat', 'Month', 'Factory', 'Ywfw', 'YwfwMs', 'YwfwYs', 'Cbzxms', 'Department', 'Sjly'];
  // `未维护数据导出`字段映射
  const fieldMap = {
    Budat: '日期',
    Month: '月',
    Factory: '厂区',
    Ywfw: '业务范围',
    YwfwMs: '业务范围描述',
    YwfwYs: '原始业务范围',
    Cbzxms: '成本中心描述',
    Department: '部门',
    Sjly: '数据来源',
  };

  // 创建HTML表格结构
  const html = `
    <table border="1">
      <thead>
        <tr style="background:#f5f7fa; color:#333; font-weight:bold;">
          ${fieldList.map(field => `<th>${fieldMap[field]}</th>`).join('')}
        </tr>
      </thead>
      <tbody>
        ${data
          .map(
            item => `
          <tr>
            ${fieldList
              .map(
                field => `
              <td style="color:#666; padding:4px 8px;">
                ${get(item, field) || ''}
              </td>
            `,
              )
              .join('')}
          </tr>
        `,
          )
          .join('')}
      </tbody>
    </table>
  `;

  // 转换为Excel工作表
  const ws = XLSX.utils.table_to_sheet(new DOMParser().parseFromString(html, 'text/html').querySelector('table'));

  // 设置列宽
  ws['!cols'] = fieldList.map(() => ({ wch: 20, font: { name: '宋体', sz: 11, bold: false, color: '#666' } }));

  // 创建Excel文件
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  XLSX.writeFile(wb, `部门对照表_未维护数据_${formatToDate(Date.now())}.xlsx`);
}

export const batchMenuItems: MenuItemType[] = [
  // 部门对照表导入
  // {
  //   label: '未维护数据导出',
  //   key: 'productNumberNoMaintenanceDownload',
  //   clickMethod: async () => {
  //     return exportDeptNoMaintenance()
  //       .then(res => {
  //         exportDeptNoMaintenanceToExcel(res.data);
  //       })
  //       .catch(e => {
  //         console.warn('🚀 ~ returnexportDeptNoMaintenance ~ e:', e);
  //       });
  //   },
  // },
  {
    label: '模版下载',
    key: 'departmentTemplate',
    clickMethod: () => {
      return deparImportTemplateDownload({});
    },
  },
  {
    label: h(SingleUploadComponent, {
      api: '/api/report/faremanage/departmentImport',
      buttonText: '导入',
    }),
    key: 'departmentImport',
  },
];
// 表单配置
export const formOptions: TFormItemOption[] = [
  {
    label: '导入时间',
    type: EFormItemType.DATE_PICKER,
    default: '',
    key: 'datasourceTime',
    getParam: value => {
      return {
        DatasourceTime: value ? value.format('YYYY-MM-DD') : '',
      };
    },
  },
  {
    label: '部门',
    type: EFormItemType.INPUT,
    default: '',
    key: 'Dept',
  },
  {
    label: '导入人员',
    type: EFormItemType.INPUT,
    default: '',
    key: 'Creator',
  },
];

// 导出表格字段配置
export const getAllColumns = (): BaseVxeTableTypes.Columns => {
  const columns = [
    {
      ...commonMediumTextOption,
      title: '部门',
      field: 'Dept',
    },
    {
      ...commonLargeTextOption,
      width: 215,
      title: '成本中心描述',
      field: 'Cbzxms',
    },
    {
      ...commonMediumTextOption,
      title: '导入人',
      field: 'Creator',
    },
    {
      ...commonDateOption,
      title: '导入时间',
      field: 'DatasourceTime',
    },
  ];
  return columns;
};
