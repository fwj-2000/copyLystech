// 获取页面通用的请求参数
export const getCommonReqParams = (searchFormValue: Record<string, any>) => {
  const dateStart = searchFormValue.dateDim[0];
  const dateEnd = searchFormValue.dateDim[1];
  return {
    orgCode: searchFormValue?.orgCode === 'MQ' ? '' : searchFormValue?.orgCode,
    startDim: `${dateStart.year()}WK${dateStart.week().toString().padStart(2, '0')}`,
    endDim: `${dateEnd.year()}WK${dateEnd.week().toString().padStart(2, '0')}`,
  };
};
