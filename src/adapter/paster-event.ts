import { getUserInfoList } from '/@/api/permission/user';
import { getUserListByAccountList } from '/@/api/business/salesForecast';

/**
 * @decription 双击表头
 * */
export function handleDblClickHead({ column, config }, gridApi) {
  // 不做处理的范围
  // 非可编辑列不处理
  if (!column.editRender) {
    return;
  }
  const { name, cacheField, enabled, dblClickHead, props } = column.editRender;
  // 如果配置了不可双击，则不处理
  if ((typeof enabled === 'boolean' && !enabled) || (typeof dblClickHead === 'boolean' && !dblClickHead)) {
    return;
  }
  // 如果配置了不可编辑，则不处理
  if (props?.disabled) {
    return;
  }
  // 如果配置了excludeField，则不处理
  if (config?.excludeFields) {
    if (config.excludeFields.includes(column.field)) {
      return;
    }
  }

  // 抽取第一行数据并赋值
  let firstValue = '';
  let firstName = '';
  const Field = column.field;
  let FieldName = '';
  if (name == 'ApiSelect' || name == 'ASelect') {
    FieldName = Field + 'Name';
  }
  if (name == 'CustomUserSelect') {
    FieldName = Field.replace('Id', 'Name');
  }
  if (cacheField) {
    FieldName = column.editRender.cacheField;
  }

  // 填充其余列表数据
  return gridApi.getDataSource().map((el, i) => {
    if (i == 0) {
      firstValue = el[Field];
      firstName = FieldName == '' ? '' : el[FieldName];
    } else {
      el[Field] = firstValue;
      if (FieldName != '') {
        el[FieldName] = firstName;
      }
    }
    return el;
  });
}

/**
 * 复制粘贴
 * */
export function handlePaste({ targetAreas, pasteCells }) {
  if (targetAreas.length === 0) {
    return;
  }
  const { rows } = targetAreas[0];
  // 当黏贴只有一行有数据时，将粘贴的数据填充到每一行
  const pasteCellData = [...pasteCells];
  if (pasteCellData.length === 1 && rows.length > 1) {
    const target = pasteCells[0];
    pasteCellData.length = 0;
    for (let i = 0; i < rows.length; i++) {
      pasteCellData.push(target);
    }
  }
}

/**
 * 复制黏贴用户处理
 * @param cols 复制的列配置
 * @param rows 复制的行内容
 * @param fieldConfig 赋值字段配置
 */
export function handleAfterPasterUser(cols: Array<{ field: string }>, rows: Array<any>, fieldConfig: { id: string; name: string }) {
  const targetIndex = cols.findIndex((item: any) => item.field === fieldConfig.id);
  if (targetIndex == -1 || rows.length === 0) return false;

  const { idList, accountList } = rows.reduce<{ idList: Array<string>; accountList: Array<string> }>(
    (obj, item: { [key: string]: string }) => {
      const value = item[fieldConfig.id] || '';
      // 如果是纯数字组成，则是id，否则按照accountList计算
      if (value && /^\d+$/.test(value)) {
        obj.idList.push(value);
      } else if (value) {
        const account = value.split('/').pop() || '';
        account && obj.accountList.push(account);
      }
      return obj;
    },
    { idList: [], accountList: [] },
  );

  Promise.all([
    idList.length > 0 ? getUserInfoList([...new Set(idList)]) : Promise.resolve({ data: [] }),
    accountList.length > 0 ? getUserListByAccountList([...new Set(accountList)]) : Promise.resolve({ data: {} }),
  ]).then(res => {
    const userList = [
      ...(res[0]?.data?.list || []),
      ...Object.values(res[1]?.data || {}).map((item: any) => ({ ...item, fullName: item.MergeName, id: item.Id })),
    ];
    rows.forEach((row: any) => {
      const target = userList.find(item => item.id === row[fieldConfig.id] || item.fullName === row[fieldConfig.id]);
      Object.assign(row, { [fieldConfig.id]: target?.id || '', [fieldConfig.name]: target?.fullName || '' });
    });
  });
}
