import { Watermark } from 'watermark-js-plus';
import { getToken } from '/@/utils/auth';

const getCurrentTime = () => {
  return Math.floor(new Date().getTime() / 1000);
};

const watermarkContent = userStore => {
  const userInfo = userStore.getUserInfo;
  const userName = userInfo?.userName || '';
  const userAccount = userInfo?.userAccount || '';
  const timeStamp = getCurrentTime();
  return userName || userAccount
    ? `${userName} ${userAccount}
    ${timeStamp}`
    : '';
};

let watermark: Watermark;

export const initWaterMark = (userStore, refresh: boolean = false) => {
  // 如果没有token，则不显示水印
  if (!getToken()) {
    watermark = null as any;
    return;
  }
  watermark = new Watermark({
    contentType: 'multi-line-text',
    content: watermarkContent(userStore),
    width: 400,
    height: 300,
    fontSize: '14px',
    globalAlpha: 0.1,
    rotate: 20,
    onSuccess: () => {
      // success callback
    },
  });
  watermark.create();
  // 开启定时器，每xx秒更新一次水印内容
  refresh &&
    setInterval(() => {
      changeWaterMark(userStore);
    }, 1e4); // 每xx秒更新一次水印内容
};

export const changeWaterMark = userStore => {
  !watermark && initWaterMark(userStore);
  watermark.changeOptions({
    contentType: 'multi-line-text',
    content: watermarkContent(userStore),
    width: 400,
    height: 300,
    fontSize: '14px',
    globalAlpha: 0.1,
    rotate: 20,
    onSuccess: () => {
      // success callback
    },
  });
};
