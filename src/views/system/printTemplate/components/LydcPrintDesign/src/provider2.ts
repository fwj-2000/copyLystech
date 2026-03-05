import { hiprint } from './hiprint/index';

/**
 * 表格列配置
 *
 */
interface TableColumn {
  title: string;
  align: 'left' | 'center' | 'right';
  field: string;
  width: number;
}

/**
 * 表格字段配置（用于设计器字段选择）
 */
interface TableField {
  text: string;
  field: string;
}

/**
 * 打印元素配置
 */
interface PrintElementConfig {
  tid: string;
  title: string;
  type: string;
  options?: any;
  customText?: string;
  custom?: boolean;
  columns?: TableColumn[][];
  footerFormatter?: (options: any, rows: any[], data: Record<string, any>, currentPageGridRowsData: any[]) => string;
}

/**
 * 打印元素组（如 "表格/其他", "辅助"）
 */
interface PrintElementGroup {
  name: string;
  elements: PrintElementConfig[];
}

/**
 * 外部传入的 provider 配置
 */
interface ProviderOptions {
  config?: any;
}

/**
 * hiprint 上下文对象
 */
interface Context {
  removePrintElementTypes: (key: string) => void;
  addPrintElementTypes: (key: string, groups: any[]) => void;
}

/**
 * provider2 模块定义
 */
export const provider2 = function (options: ProviderOptions) {
  console.log(options);

  const addElementTypes = (context: Context): void => {
    context.removePrintElementTypes('providerModule2');

    // 表格类型元素
    const tableElement: PrintElementConfig = {
      tid: 'providerModule2.table',
      title: '订单数据',
      type: 'table',
      options: {
        field: 'table',
        fields: [
          { text: '名称', field: 'NAME' },
          { text: '数量', field: 'SL' },
          { text: '规格', field: 'GG' },
          { text: '条码', field: 'TM' },
          { text: '单价', field: 'DJ' },
          { text: '金额', field: 'JE' },
          { text: '备注', field: 'DETAIL' },
        ] as TableField[],
      },
      columns: [
        [
          { title: '名称', align: 'center', field: 'NAME', width: 100 },
          { title: '数量', align: 'center', field: 'SL', width: 100 },
          { title: '条码', align: 'center', field: 'TM', width: 100 },
          { title: '规格', align: 'center', field: 'GG', width: 100 },
          { title: '单价', align: 'center', field: 'DJ', width: 100 },
          { title: '金额', align: 'center', field: 'JE', width: 100 },
          { title: '备注', align: 'center', field: 'DETAIL', width: 100 },
        ],
      ],
      footerFormatter: function (_options, _rows, data, _currentPageGridRowsData) {
        const cap = data?.['totalCap'];
        return `<td style="padding:0 10px" colspan="100">应收金额大写: ${cap || ''}</td>`;
      },
    };

    // 其他文本/长文本元素
    const miscElements: PrintElementConfig[] = [
      {
        tid: 'providerModule2.customText',
        title: '文本',
        type: 'text',
        customText: '自定义文本',
        custom: true,
      },
      {
        tid: 'providerModule2.longText',
        title: '长文本',
        type: 'longText',
        options: {
          field: 'test.longText',
          width: 200,
          testData: '长文本分页/不分页测试',
        },
      },
    ];

    context.addPrintElementTypes('providerModule2', [new hiprint.PrintElementTypeGroup('表格/其他', [tableElement, ...miscElements])]);
  };

  return { addElementTypes };
};
