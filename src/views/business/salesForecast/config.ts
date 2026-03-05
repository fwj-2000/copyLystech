import type { VxeGridPropTypes } from '/@/components/VxeTable';

import { getLabelByOptions } from '/@/views/business/report/utils';
import { get, omit } from 'lodash-es';
import { useI18n } from '/@/hooks/web/useI18n';

const { t } = useI18n();

/**
 * @description 状态枚举
 */
// export enum STATUS_ENUM {
//   草稿 = 1,
//   待处理 = 2,
//   处理中 = 3,
//   已处理 = 4,
//   待确认 = 5,
//   撤回 = 6,
//   驳回 = 7,
//   审核 = 8,
//   审核中 = 9,
//   同意 = 10,
// }

/**
 * @description 状态选项
 */
// export const STATUS_OPTIONS = [
//   { id: STATUS_ENUM.草稿, fullName: t('common.draft'), theme: 'gray', rowKey: 'statusDesc' },
//   { id: STATUS_ENUM.驳回, fullName: t('common.rejectText'), theme: 'yellow', rowKey: 'statusDesc' },
//   { id: STATUS_ENUM.撤回, fullName: t('common.revoke'), theme: 'purple', rowKey: 'statusDesc' },
//   { id: STATUS_ENUM.待处理, fullName: t('common.todoText'), theme: 'gray', rowKey: 'statusDesc' },
//   { id: STATUS_ENUM.已处理, fullName: t('common.doneText'), theme: 'green', rowKey: 'statusDesc' },
//   { id: STATUS_ENUM.待确认, fullName: '待确认', theme: 'gray', rowKey: 'statusDesc' },
//   { id: STATUS_ENUM.审核中, fullName: '审核中', theme: 'green', rowKey: 'statusDesc' },
// ];

/**
 * @description 主要制程枚举
 */
export enum MAIN_PROCESS_ENUM {
  模切 = '1',
  冲压 = '2',
  CNC = '3',
  模具 = '4',
  注塑 = '5',
}

export const mainProcessOptions = [
  { label: t('dict.MainProcess.1'), value: +MAIN_PROCESS_ENUM.模切 },
  { label: t('dict.MainProcess.2'), value: +MAIN_PROCESS_ENUM.冲压 },
  { label: t('dict.MainProcess.3'), value: +MAIN_PROCESS_ENUM.CNC },
  { label: t('dict.MainProcess.4'), value: +MAIN_PROCESS_ENUM.模具 },
  { label: t('dict.MainProcess.5'), value: +MAIN_PROCESS_ENUM.注塑 },
];

export function getMainProcessLabel(value: number | string, defaultLabel = '') {
  return getLabelByOptions(value, defaultLabel, mainProcessOptions);
}

/**
 * @description 模块类型枚举
 */
export enum MODULE_TYPE_ENUM {
  草稿 = 'DrawingStatus',
  客户需求 = 'SubmitStatus',
  需求确认 = 'PMConfirmStatus',
  需求审核 = 'ReviewStatus',
  待产需求 = 'CSConfirmStatus',
}

/**
 * @description 时间正则
 */
export const dateRegExp = /^\d{4}-\d{1,2}-WK\d$/;

/**
 * @description 对接口返回的数据，按照时间排序，生成表格的动态列
 * @param list 接口返回的数据
 * @param isCanEdit 创建的动态列是否可以编辑，默认值为`false`
 * @param path 创建列的数据路径，默认值为`importDatas`
 */
export function getDynamicsTableColumn(list: Array<any>, isCanEdit = false, path = 'importDatas') {
  if (!Array.isArray(list) || list.length === 0) {
    return [];
  }
  const data = get(list[0], path) as { [name: string]: string | number };

  if (!data) {
    return [];
  }

  // 时间排序处理
  const dateList = Object.keys(data)
    .filter(v => dateRegExp.test(v))
    .sort((a, b) => {
      const [yearA, monthA, weekA] = a.split('-');
      const [yearB, monthB, weekB] = b.split('-');
      return +yearA * 1000 + +monthA * 10 + +weekA.replace('WK', '') - (+yearB * 1000 + +monthB * 10 + +weekB.replace('WK', ''));
    });
  if (dateList.length === 0) {
    return [];
  }

  return dateList.reduce((result: VxeGridPropTypes.Columns, item) => {
    const [year, month, week] = item.split('-');
    const key = `${year}/${month.padStart(2, '0')}`;
    let target = result.find(item => item.title === key);
    if (!target) {
      target = {
        title: key,
        align: 'center',
        field: key,
        children: [],
      };
      result.push(target);
    }
    target.children?.push({
      title: week,
      field: `${path}.${item}`,
      showOverflow: 'tooltip',
      width: '120',
      editRender: {
        enabled: isCanEdit,
        name: 'AInputNumber',
        props: {
          stringMode: true,
        },
      },
    });
    return result;
  }, []);
}

type FormatKey = 'covertedDatas' | 'targetDatas' | 'computedDatas';
/**
 * 用于列表或者详情展示，依据所指定的属性（`key`）的内容（`content: { [ck: string]: { [pk: string]: number | string } }`），对每一个`ck`，生成一条完整的数据
 * @param list
 * @param key
 */
export function formatDateilListToShow(list: Array<any>, key: FormatKey) {
  if (!key) {
    return list;
  }

  return list.reduce((result: Array<any>, item) => {
    const { [key]: content } = item;
    const context = omit(item, key);
    if (!content) {
      return result;
    }
    Object.keys(content).forEach(ck => {
      result.push({
        ...context,
        insidePartNumber: content[ck].insidePartNumber || item.insidePartNumber,
        shipPatternPercent: content[ck].shipPatternPercent || item.shipPatternPercent,
        sitePercent: content[ck].sitePercent || item.sitePercent,
        historyShippedQty: content[ck].historyShippedQty || item.historyShippedQty,
        totalRequiredQty: content[ck].totalRequiredQty || item.totalRequiredQty,
        totalWaitedQty: content[ck].totalWaitedQty || item.totalWaitedQty,
        ck,
        targetDatas: content[ck],
        _id: `${item.id}_${ck}`,
      });
    });
    return result;
  }, []);
}

/**
 * 对于被`formatDateilListToShow`方法格式化之后的数据，转回原本的数据
 * @param list
 * @param key
 */
export function formatDateilListToSave(list: Array<any>, key: FormatKey) {
  if (!key) {
    return list;
  }

  return list.reduce((result: Array<any>, item) => {
    const { targetDatas, ck } = item;
    if (!targetDatas || !ck) {
      return result;
    }
    result.push({
      ...omit(item, ['targetDatas', '_id', 'ck']),
      [key]: {
        [ck]: targetDatas,
      },
    });
    return result;
  }, []);
}
