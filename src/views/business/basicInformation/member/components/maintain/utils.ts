import { cloneDeep } from 'lodash-es';

// 对比俩边的数据
export function formatSelect(soucre, data) {
  const _data = cloneDeep(data);
  const sourceLen = soucre.length;
  if (!sourceLen) {
    return _data;
  }
  const _soucre = cloneDeep(soucre);
  // const dataLen = _data.length;
  // const wrapArr = dataLen < sourceLen ? _data : _soucre;
  // const innerArr = dataLen < sourceLen ? _soucre : _data;
  // for (let i = 0; i < wrapArr.length; i++) {
  //   for (let j = 0; j < innerArr.length; j++) {
  //     if (innerArr[j].id == wrapArr[i].id) {
  //       innerArr.splice(j, 1);
  //       continue;
  //     }
  //   }
  // }
  for (let i = 0; i < _soucre.length; i++) {
    for (let j = 0; j < _data.length; j++) {
      if (_data[j].id == _soucre[i].id) {
        _data.splice(j, 1);
        continue;
      }
    }
  }
  return _soucre.concat(_data);
}
