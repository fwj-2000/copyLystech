/**
 * 表格列类型
 */
export type TableColumn = {
  /** 标题 */
  title: string;
  /** 取值字段 */
  field?: string;
  /** 类型，目前有: seq(序号)，imageList(图片列表) */
  type?: string;
  /** 固定宽度 */
  width?: number;
  /** 最小宽度 */
  minWidth?: number;
  /**
   * 单元格自定义取值
   * @param v 当前按照指定字段的取值
   * @param row 行数据
   * @param index 行所在索引
   * @returns 渲染值
   */
  format?: (v: string, row: any, index: number) => string;
};

/**
 * 表格列集合
 */
export type TableColumns = Array<TableColumn>;

/**
 * 表单键值对 - 单项类型
 */
export type Schema = {
  /** 标题 */
  label: string;
  /** 取值字段 */
  field: string;
  /**
   * 自定义取值
   * @param v 当前按照指定字段的取值
   * @returns 渲染值
   */
  format?: (v: string | number) => string;
  /** 有值时才显示 */
  showIfHasValue?: boolean;
};

/**
 * 表单键值对 - 集合类型
 */
export type Schemas = Array<Schema>;

/**
 * 渲染模板(template.vue) 参数类型
 */
export type TemplateProps = {
  /** 基础信息 */
  baseInfo: Record<string, any>;
  /** 生产信息 */
  prodInfo: Record<string, any>;
  /** 工艺信息 */
  technologyInfo: Record<string, any>;
  /** 模具料号 */
  moldNoList: Array<string>;
  /** 工艺流程 - 表格数据 */
  technologyTableData: Array<any>;
  /** 工艺流程 - 表头显示数据 */
  technologyTableForm: {
    /** 单次换料时长(MIN/次) */
    singleRefuelingDuration: string | number;
    /** 1H停机时长(MIN */
    downtimeOneHour: string | number;
    /** 设备稼动率(%) */
    utilizationRate: string | number;
  };
  /** 材料表格数据 */
  materialTableData: Array<any>;
  /** 包规 & 包材 */
  packageData: {
    // 出货形态
    shipPattern: string;
    /** 卷芯表格数据 */
    packingMaterialCustomList: Array<any>;
    /** 非卷芯表格数据 */
    packingMaterialFixedList: Array<any>;
    packSpecQtyR: string | number;
    packSpecQtyPN: string | number;
  };
  /** 工艺流程详述 */
  technologyDetailTableData: Array<any>;
  /** 变更履历 */
  changeHistoryTableData: Array<any>;
};
