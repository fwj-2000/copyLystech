import { getSlectOps, getFactorylist } from '/@/api/business/member';
import { getCustomerList } from '/@/api/basicData/customer';
import { useMemberStore } from '/@/store/modules/projectMember';
import { getProjectMembersSonConfig } from '/@/api/business/projectMember';
import { useI18n } from '/@/hooks/web/useI18n';
const { t } = useI18n();

export async function getCustomers(keyword) {
  const r = await getCustomerList(keyword);
  return r.data.map(el => {
    return {
      id: el.name,
      fullName: el.name,
      code: el.code,
    };
  });
}

//  获取料件号的下拉框
export const getSlectOpList = async keyword => {
  const r = await getSlectOps(keyword);
  return r.data.map(el => {
    return {
      id: el.name,
      fullName: el.name,
      code: el.code,
    };
  });
};

// 获取工厂的列表数据
export const getFactorylists = async (data: { mainProcess: string; code: string }) => {
  const r = await getFactorylist(data);
  if (r.code == 200) {
    return r.data;
  }
};

// 设置动态表头相关信息
export function setDynamicTitle(sourceList) {
  const dynamicKeys = {}; // 配置字段
  const configTypeList: any = []; // 配置角色列表
  const _list = sourceList
    ? sourceList.map(item => {
        const titleName = t('dict.ProjectMembersTypeEnum.' + item.configType);
        dynamicKeys[item.configType] = '';
        dynamicKeys[item.configType + '__obj'] = {
          // configColumnName: item.configColumnName,
          configColumnName: titleName,
          configType: item.configType,
          memberId: '',
          memberName: '',
        };
        configTypeList.push({
          id: item.configType,
          // fullName: item.configColumnName,
          fullName: titleName,
        });
        // 保存时，检测__obj去处理list
        const _item: any = {
          // title: item.configColumnName,
          title: titleName,
          field: item.configType + '_Name',
          minWidth: 160,
          showOverflow: true,
          editRender: {
            name: 'ACustomUserSelect',
            field: item.configType,
            // 自定义编辑渲染组件的事件处理
            events: {
              change: ({ column, row }, value, $event) => {
                const valueField = column.field.replace('_Name', '');
                row[valueField] = value || '';
                row[column.field] = $event ? $event.fullName : '';
                const kName = valueField + '__obj';
                row._dynamic = {
                  ...row._dynamic,
                  [kName]: {
                    configColumnName: column.title,
                    configType: valueField,
                    memberId: value || '',
                    memberName: $event ? $event.fullName : '',
                  },
                };
              },
            },
          },
        };
        return _item;
      })
    : []; // 表头格式
  return {
    dynamicKeys,
    configTypeList,
    column: _list,
  };
}

// 处理返回的数据
export function setTableList(
  sourceList,
  ops?: {
    editable?: boolean;
    tableView?: boolean; // 纯数据展示
  },
) {
  // 保存时，检测__obj去处理list
  const tempList = sourceList.map(pitem => {
    const { memberConfigList } = pitem;
    pitem._dynamic = {};
    if (memberConfigList?.length) {
      memberConfigList.map(item => {
        pitem[item.configType + '_Name'] = item.memberName || '';
        if (ops?.tableView) {
          return pitem;
        }
        pitem[item.configType] = item.memberId || '';
        const kName = item.configType + '__obj';
        const _item = {
          ...item,
          memberId: item.memberId || '',
          memberName: item.memberName || '',
        };
        // pitem[kName] = _item;
        pitem._dynamic = {
          ...pitem._dynamic,
          [kName]: _item,
        };
      });
    }
    return pitem;
  });
  return tempList;
}

export function randomRange(min: number, max?: number): string {
  const charStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  // 生成 [min, max] 的安全随机整数（避免 Math.random）
  const randomIntInclusive = (minVal: number, maxVal: number): number => {
    const minI = Math.ceil(minVal);
    const maxI = Math.floor(maxVal);
    if (maxI < minI) return minI;

    const range = maxI - minI + 1;
    const maxUint32 = 0xffffffff;
    const limit = maxUint32 - (maxUint32 % range); // rejection sampling，避免取模偏差

    const buf = new Uint32Array(1);
    let x = 0;
    do {
      globalThis.crypto.getRandomValues(buf);
      x = buf[0];
    } while (x >= limit);

    return minI + (x % range);
  };

  const length = typeof max === 'number' ? randomIntInclusive(min, max) : Math.max(0, Math.floor(min));

  const bytes = new Uint8Array(length);
  globalThis.crypto.getRandomValues(bytes);

  let result = '';
  for (let i = 0; i < length; i++) {
    result += charStr.charAt(bytes[i] % charStr.length);
  }

  return result;
}

const memberStore = useMemberStore();
// 获取纯列表页的动态表头
export async function getListDynamicTitles(teamType: string, mainProcess?: string) {
  const params: any = {
    mainProcess: mainProcess || memberStore.mainProcess,
    teamType: teamType,
  };
  // 如果获取的是全部的团队成员，则不传入teamType
  if (teamType == 'all') {
    delete params.teamType;
  }
  const r = await getProjectMembersSonConfig(params);
  const { data } = r;
  const list: any = [];
  data.forEach(el => {
    (el.configList || []).forEach(item => {
      const titleName = t('dict.ProjectMembersTypeEnum.' + item.configType);
      list.push({
        title: titleName,
        field: item.configType,
        width: 180,
      });
    });
  });
  return list;
}

// 数据转化格式
export function beforeSaveFormat(data: any) {
  return data.map((item: any) => {
    const memberConfigList: any = [];
    for (let k in item._dynamic) {
      if (k.indexOf('__obj') > 0) {
        memberConfigList.push({
          ...item._dynamic[k],
        });
        delete item._dynamic[k];
      }
    }
    item.memberConfigList = memberConfigList;
    if (item.id.indexOf('index_') > -1) {
      delete item.id;
    }
    return item;
  });
}

export function normalizeText(v: any) {
  return v == null ? '' : String(v).trim();
}
