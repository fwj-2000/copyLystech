import { hiprint } from './hiprint/index';

/**
 *
 * 打印元素的样式和行为配置
 */
interface PrintElementOption {
  /** 字段名，用于数据绑定 */
  field?: string;

  /** 测试数据，用于打印预览或模板设计 */
  testData?: string;

  /** 元素高度（单位：px） */
  height?: number;

  /** 字体大小（单位：pt） */
  fontSize?: number;

  /** 字体粗细，例如 '700' 表示加粗 */
  fontWeight?: string;

  /** 水平对齐方式：left, center, right */
  textAlign?: string;

  /** 垂直对齐方式：top, middle, bottom */
  textContentVerticalAlign?: string;

  /** 行高（仅部分类型支持） */
  lineHeight?: number;

  /** 文本类型：barcode 为条形码，qrcode 为二维码 */
  textType?: 'barcode' | 'qrcode';

  /** 是否隐藏标题（默认显示标题） */
  hideTitle?: boolean;
}

/**
 * 单个打印元素的配置项
 */
interface PrintElementConfig {
  /** 元素的唯一标识 ID */
  tid: string;

  /** 元素标题，显示在设计器中 */
  title: string;

  /** 默认数据内容 */
  data: string;

  /** 元素类型，如 text, image 等 */
  type: string;

  /** 元素的具体配置项 */
  options?: PrintElementOption;
}

interface PrintElementConfigWithText extends PrintElementConfig {
  getText: () => string;
}

/**
 * 打印元素分组（用于在设计器中分组显示）
 */
interface PrintElementGroup {
  /** 分组名称，例如 “常规”、“客户” */
  name: string;

  /** 分组下的打印元素数组 */
  elements: PrintElementConfig[];
}

/**
 * 外部传入 provider 的配置项接口
 */
interface ProviderOptions {
  /** 自定义的打印元素配置，可动态传入 */
  config: PrintElementConfig;
}

/**
 * 提供给 hiprint 的上下文对象，包含操作 API
 */
interface Context {
  /**
   * 移除指定模块的打印元素类型
   * @param key 模块标识字符串
   */
  removePrintElementTypes: (key: string) => void;

  /**
   * 添加打印元素类型分组
   * @param key 模块标识字符串
   * @param groups 打印元素分组数组
   */
  addPrintElementTypes: (key: string, groups: any[]) => void;
}

/**
 * 创建一个文本类型的打印元素配置
 */
const createTextElement = (tid: string, title: string, data: string, options: PrintElementOption = {}): PrintElementConfig => ({
  tid,
  title,
  data,
  type: 'text',
  options,
});

const createIconTextElement = (tid: string, title: string, data: string, options: PrintElementOption = {}, iconClass: string): PrintElementConfigWithText => {
  return {
    ...createTextElement(tid, title, data, options),
    getText: () => `<i class="${iconClass}"></i> ${title}`,
  };
};

export const provider1 = function (options: ProviderOptions) {
  console.log(options);

  const addElementTypes = (context: Context): void => {
    context.removePrintElementTypes('providerModule1');

    const commonElements: PrintElementConfig[] = [
      options.config,
      createTextElement('providerModule1.header', '单据表头', '单据表头', {
        testData: '单据表头',
        height: 17,
        fontSize: 16.5,
        fontWeight: '700',
        textAlign: 'center',
        hideTitle: true,
      }),
      createTextElement('providerModule1.type', '单据类型', '单据类型', {
        testData: '单据类型',
        height: 16,
        fontSize: 15,
        fontWeight: '700',
        textAlign: 'center',
        hideTitle: true,
      }),
      createTextElement('providerModule1.order', '订单编号', 'XS888888888', {
        field: 'order',
        testData: 'XS888888888',
        height: 16,
        fontSize: 6.75,
        fontWeight: '700',
        textAlign: 'left',
        textContentVerticalAlign: 'middle',
      }),
      createTextElement('providerModule1.date', '业务日期', '2020-01-01', {
        field: 'date',
        testData: '2020-01-01',
        height: 16,
        fontSize: 6.75,
        fontWeight: '700',
        textAlign: 'left',
        textContentVerticalAlign: 'middle',
      }),
      createTextElement('providerModule1.barcode', '条形码', 'XS888888888', {
        field: 'barcode',
        testData: 'XS888888888',
        height: 32,
        fontSize: 12,
        lineHeight: 18,
        textAlign: 'left',
        textType: 'barcode',
      }),
      createTextElement('providerModule1.qrcode', '二维码', 'XS888888888', {
        field: 'qrcode',
        testData: 'XS888888888',
        height: 32,
        fontSize: 12,
        lineHeight: 18,
        textType: 'qrcode',
      }),
      createTextElement('providerModule1.platform', '平台名称', '平台名称', {
        field: 'platform',
        testData: '平台名称',
        height: 17,
        fontSize: 16.5,
        fontWeight: '700',
        textAlign: 'center',
        hideTitle: true,
      }),
      {
        tid: 'providerModule1.image',
        title: 'Logo',
        data: '',
        type: 'image',
        getText: () => '<i class="fa fa-user"></i> 姓名',
      },
    ];

    const customerElements: PrintElementConfig[] = [
      createTextElement('providerModule1.khname', '客户名称', '高级客户', {
        field: 'name',
        testData: '高级客户',
        height: 16,
        fontSize: 6.75,
        fontWeight: '700',
        textAlign: 'left',
        textContentVerticalAlign: 'middle',
      }),
      createTextElement('providerModule1.tel', '客户电话', '18888888888', {
        field: 'tel',
        testData: '18888888888',
        height: 16,
        fontSize: 6.75,
        fontWeight: '700',
        textAlign: 'left',
        textContentVerticalAlign: 'middle',
      }),
    ];

    context.addPrintElementTypes('providerModule1', [
      new hiprint.PrintElementTypeGroup('常规', commonElements),
      new hiprint.PrintElementTypeGroup('客户', customerElements),
    ]);
  };

  return {
    addElementTypes,
  };
};
