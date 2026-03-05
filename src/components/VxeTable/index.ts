import { withInstall } from '/@/utils';
import vxeBasicTable from './src/VxeBasicTable';
import { VxeUI } from 'vxe-table';
import VXETablePluginAntd from './src/components';
// 引入扩展插件
import '/@/plugins/vxe/extend-cell-area/vxe-table-extend-cell-area.es6.min';
import '/@/plugins/vxe/extend-cell-area/vxe-table-extend-cell-area.min.css';
// import VXETablePluginExportXLSX from 'vxe-table-plugin-export-xlsx';
// import ExcelJS from 'exceljs';
import './src/setting';

export const VxeBasicTable = withInstall(vxeBasicTable);
export * from 'vxe-table';
export * from './src/types';

VxeUI.use(VXETablePluginAntd);
// .use(VXETablePluginExportXLSX, { ExcelJS });
