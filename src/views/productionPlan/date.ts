import dayjs from 'dayjs';

export const formatDateToServer = date => {
  return date ? dayjs(date).format('YYYY-MM-DD') : null;
};

export const formatDateToShow = date => {
  return date ? dayjs(date).tz().valueOf() : null;
};
