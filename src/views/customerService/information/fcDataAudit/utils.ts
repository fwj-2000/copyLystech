import dayjs from 'dayjs';
import { objectToQueryParams } from '/@/views/dashboard/operate/metricsCenter/utils';
import { useMessage } from '/@/hooks/web/useMessage';
import { useI18n } from '/@/hooks/web/useI18n';
const { t } = useI18n();

const { createMessage } = useMessage();
// 跳转到fc报表
export const goPath = (path, params, go) => {
  const url = `${path}?${objectToQueryParams(params)}`;
  go(url);
};

// 转为日期
export const getWeekDate = weekStr => {
  const [year, week] = weekStr.split('WK');
  const date = dayjs(year).week(week).startOf('week').format('YYYY-MM-DD');
  return date;
};

/**
 * 拆解行数据，按审批类型调用接口
 * @returns 返回promise，当 newApi和changeApi都调用完毕时，才返回resolve
 */
export const funcAuditCore = (data, newApi, _, requestParams: any = {}) => {
  // 如果没有选择数据，则提示toast
  if (!data || data.length === 0) {
    createMessage.info(t('common.selectText'));
    return Promise.reject(new Error(t('common.selectText')));
  }
  const params = {
    ids: data.map(item => item.id),
    ...requestParams,
  };
  return newApi(params);
  // 因为后端做了兼容，后续逻辑取消,暂不做删除，防止以后需要
  // const newIds: string[] = [];
  // const changeIds: string[] = [];
  // const tasks: Promise<unknown>[] = [];
  // data.forEach(item => {
  //   const { id, auditType } = item;
  //   if (auditType) {
  //     changeIds.push(id);
  //   } else {
  //     newIds.push(id);
  //   }
  // });
  // if (newIds.length) {
  //   const params = {
  //     ids: newIds,
  //     ...requestParams,
  //   };
  //   tasks.push(Promise.resolve(newApi(params)));
  // }
  // if (changeIds.length) {
  //   const params = {
  //     ids: changeIds,
  //     ...requestParams,
  //   };
  //   tasks.push(Promise.resolve(changeApi(params)));
  // }
  // return Promise.all(tasks);
};
