import * as unCompleteConfig from '../component/unCompleteList/config';
import * as produceConfig from '../component/produce/config';

import * as bom_number from './bomNumber';
import * as receive_view_number from './receiveViewNumber';
import * as cancel_terminate from './cancelTerminate';
import * as demand_qty from './demandQty';
import * as qu_apply_number from './quApplyNumber';
import * as ecn_part_number from './ecnPartNumber';
import * as pcc from './pcc';
import * as drawings_review from './drawingsReview';
import * as dfm from './dfm';
import * as mold_making from './moldMaking';
import * as affairs from './affairs';
import * as cell from './cell';
import * as iqc from './iqc';
import * as qu_require_number from './quRequireNumber';
import * as mold_reach from './moldReach';
import * as mold_apply from './moldApply';

/** 详情页信息 映射表 */
export const DETAIL_PAGE_INFO_MAP: DetailPageInfoType = {
  /** 需求管理 - BOM数（BOM比对也是该详情页面） */
  bom_number,
  /** 需求管理 - 收到图纸 */
  receive_view_number,
  /** 需求管理 - 未收到图纸明细 */
  un_receive_view_number: unCompleteConfig,
  /** 需求管理 - 取消 */
  cancel_terminate,
  /** 需求管理 - 交付数量(k) */
  demand_qty,
  /** 需求管理 - 交付个数 */
  qu_apply_number,
  /** 需求管理 - 设变 */
  ecn_part_number,
  /** 工程开发 - PCC制作 */
  pcc,
  /** 工程开发 - PCC未制作 */
  un_pcc: unCompleteConfig,
  /** 工程开发 - 读图 */
  drawings_review,
  /** 工程开发 - 料件读图未完成 */
  un_drawings_review: unCompleteConfig,
  /** 工程开发 - DFM制作 */
  dfm,
  /** 工程开发 - 料件DFM制作未完成数 */
  un_dfm: unCompleteConfig,
  /** 工程开发 - 模具制作 */
  mold_making,
  /** 工程开发 - 料件模具制作未完成数 */
  un_mold_making: unCompleteConfig,
  /** 关务 - 备案 */
  affairs,
  /** 关务 - 备案资料未完成料件数 */
  un_affairs: unCompleteConfig,
  /** 出货 */
  cell,
  /** 出货 - 未出货料件数 */
  un_cell: unCompleteConfig,
  /** 客户使用 - IQC */
  iqc,
  /** 客户使用 - 上线使用 */
  online: iqc,
  /** 报价管理 */
  qu_require_number,
  /** 材料/模具请购 - PO交期达成 */
  mold_reach,
  /** 材料/模具请购 - 模具完成率 */
  mold_apply,
  /** 生产制造 - 模切排产明细 */
  produce_mq_plan_number: produceConfig,
  /** 生产制造 - 模切上机明细 */
  produce_mq_up_number: produceConfig,
  /** 生产制造 - 模切完成率明细 */
  produce_mq_plan_lv: produceConfig,
  /** 生产制造 - 手工包装排产数明细 */
  produce_hander_package_ypc_number: produceConfig,
  /** 生产制造 - 手工包装完成率明细 */
  produce_hander_package_lv: produceConfig,
  /** 生产制造 - CPK完成数明细 */
  produce_cpk_number: produceConfig,
  /** 生产制造 - CPK完成率明细 */
  produce_cpk_lv: produceConfig,
  /** 生产制造 - 工单异常数明细 */
  produce_work_order_exception: produceConfig,
  /** 生产制造 - 工单异常率明细 */
  produce_work_order_lv: produceConfig,
  /** 生产制造 - 跳票明细 */
  produce_tp_number: produceConfig,
  /** 生产制造 - 跳票率明细 */
  produce_tp_lv: produceConfig,
  /** 生产制造 - 工单异常&跳票数明细 */
  produce_risk_parts: produceConfig,
};
