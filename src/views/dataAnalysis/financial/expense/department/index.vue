<!-- 手工数据列表 -->
<template>
  <TableLayout>
    <template #toolbarRight>
      <a-button @click="clickMethod" class="mr-8px"> 未维护数据导出 </a-button>
    </template>
  </TableLayout>
</template>

<script lang="ts" setup>
  import { reactive, ref } from 'vue';
  import { getAllColumns, formOptions, batchMenuItems } from './config';
  import { useTableLayout } from '/@/views/dataAnalysis/components/TableLayout/useTableLayout';
  import { departmentPage } from '/@/api/dataAnalysis/fare';
  import { exportDeptNoMaintenance } from '/@/api/dataAnalysis/fare';
  import { get } from 'lodash-es';
  import { formatToDate } from '/@/utils/dateUtil';

  import * as XLSX from 'xlsx';

  import type { VxeGridProps } from 'vxe-table';

  defineOptions({ name: 'dataAnalysis-financial-expense-department' });

  const attrs = reactive<VxeGridProps<any>>({
    proxyConfig: {
      autoLoad: true,
      response: {
        total: 'data.pagination.total',
      },
    },
  });
  const columns = ref(getAllColumns());
  const [TableLayout, api] = useTableLayout({
    formConfig: {
      formOptions,
    },
    tableConfig: {
      columns,
      attrs,
      getExportParams: () => {
        const { getFormParams } = api.searchFormApi;
        const { startDim, endDim } = getFormParams();
        const filename = `部门对照表_${startDim}-${endDim}`;
        return {
          filename,
        };
      },
      api: departmentPage,
    },
    toolbarConfig: {
      batchMenuItems,
    },
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
  const clickMethod = async () => {
    return exportDeptNoMaintenance()
      .then(res => {
        exportDeptNoMaintenanceToExcel(res.data);
      })
      .catch(e => {
        console.warn('🚀 ~ returnexportDeptNoMaintenance ~ e:', e);
      });
  };
</script>

<style lang="less" scoped>
  @import url('/@/views/dataAnalysis/style.less');
</style>
