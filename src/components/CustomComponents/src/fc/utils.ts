import { getFcAuditConfigColumn } from '/@/api/customerSerivce/fcAudit';
import { useI18n } from '/@/hooks/web/useI18n';
const { t } = useI18n();
import { Dayjs } from 'dayjs';

// 设置动态表头相关信息
export function setDynamicTitle(sourceList) {
  const configTypeList: any = []; // 配置角色列表
  const _list = sourceList
    ? sourceList.map(item => {
        const titleName = t('dict.ApproverMemberTypeEnum.' + item.configType);
        configTypeList.push({
          id: item.configType,
          fullName: titleName,
        });
        // 保存时，检测__obj去处理list
        const _item: any = {
          title: titleName,
          field: item.configType + '_Ids',
          minWidth: 280,
          editRender: {
            name: 'CustomUserSelect',
            field: item.configType,
            cacheField: item.configType + '_Names',
            props: {
              multiple: true,
            },
          },
        };
        return _item;
      })
    : []; // 表头格式
  return {
    configTypeList,
    column: _list,
  };
}

// 处理返回的数据
export function setTableList(sourceList) {
  const tempList = sourceList.map(pitem => {
    const { memberConfigs } = pitem;
    if (memberConfigs && memberConfigs.length) {
      memberConfigs.map(item => {
        pitem[item.configType + '_Names'] = item.memberNames || '';
        pitem[item.configType + '_Ids'] = item.memberIds || [];
      });
    }
    return pitem;
  });
  return tempList;
}

/**
 * 获取动态配置，用于列表页和审批公共组件
 * @param params  请求参数
 * @param mode 使用类型'table'|'form'
 * */
export async function getListDynamicTitles(params, mode: 'table' | 'form' = 'table') {
  const _params: any = {
    ...params,
  };
  const r = await getFcAuditConfigColumn(_params);
  const { data } = r;
  const list: any = [];
  data.forEach(item => {
    const titleName = t('dict.ApproverMemberTypeEnum.' + item.configType);
    const _item =
      mode == 'table'
        ? {
            title: titleName,
            field: item.configType,
            width: 250,
          }
        : {
            required: true,
            label: titleName,
            field: item.configType,
            component: 'CustomUserSelect',
            componentProps: {
              multiple: true,
              placeholder: t('common.autoCarry'),
            },
          };
    list.push(_item);
  });
  return list;
}

// 在数据提前前转化成服务端格式
export function beforeSaveFormat(data: any) {
  return data.map((item: any) => {
    const _item: any = {
      approverGroupName: item.approverGroupName,
      factory: item.factory,
    };
    if (item.id) {
      _item.id = item.id;
    }
    const memberConfigList: any = [];
    for (let k in item) {
      if (k.indexOf('_Ids') > 0) {
        memberConfigList.push({
          memberIds: item[k],
          configType: k.replace('_Ids', ''),
        });
      }
    }
    _item.memberConfigs = memberConfigList;
    return _item;
  });
}

// 根据周数动态生成表格列
export const getWeekTitle = (weekDate: Dayjs, addWeek: number) => {
  const newDate = weekDate.add(addWeek, 'week').endOf('week');
  return `${newDate.format('YYYY')}WK${newDate.format('ww')}`;
};
