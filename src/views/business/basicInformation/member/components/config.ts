import { getSlectOps, getFactorylist, getConfigTypes } from '/@/api/business/member';
import { getCustomerList } from '/@/api/basicData/customer';
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

// 获取动态列表 + 获取

// 获取主要制程
export async function getMainProcess() {
  const r = await getConfigTypes(['mainProcess']);
  const _obj = r.data[0].typeList;
  const _list: any = [];
  for (let k in _obj) {
    _list.push({
      id: k,
      fullName: _obj[k],
    });
  }
  return _list;
}

// 设置动态表头相关信息
export function setDynamicTitle(sourceList, ops?: { editable?: boolean; tableView: boolean }) {
  const dynamicKeys = {}; // 配置字段
  const configTypeList: any = []; // 配置角色列表
  const _list = sourceList
    ? sourceList.map(item => {
        dynamicKeys[item.configType] = '';
        dynamicKeys[item.configType + '__obj'] = {
          configColumnName: item.configColumnName,
          configType: item.configType,
          memberId: '',
          memberName: '',
        };
        configTypeList.push({
          id: item.configType,
          fullName: item.configColumnName,
        });
        // 保存时，检测__obj去处理list
        const _item: any = {
          title: item.configColumnName,
          dataIndex: ops?.tableView ? item.configType + 'Name' : item.configType,
          editComponent: 'CustomUserSelect',
          editComponentProps: {
            allowClear: true,
            showSearch: true,
          },
        };
        // 编辑模式下，对人员变动二次处理
        if (ops && ops.editable) {
          _item.editRow = true;
        }
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
    if (memberConfigList && memberConfigList.length) {
      memberConfigList.map(item => {
        pitem[item.configType + 'Name'] = item.memberName || '';
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
        pitem[kName] = _item;
        pitem._dynamic = {
          ...pitem._dynamic,
          [kName]: _item,
        };
      });
    }
    if (ops && ops.editable) {
      pitem.onEdit = true;
      pitem.editable = true;
    }
    return pitem;
  });
  return tempList;
}

export function randomRange(min, max) {
  var returnStr = '',
    range = max ? Math.round(Math.random() * (max - min)) + min : min,
    charStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (var i = 0; i < range; i++) {
    var index = Math.round(Math.random() * (charStr.length - 1));
    returnStr += charStr.substring(index, index + 1);
  }
  return returnStr;
}
