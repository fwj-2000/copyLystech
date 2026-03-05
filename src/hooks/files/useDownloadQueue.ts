import { useMessage } from '/@/hooks/web/useMessage';
import { useI18n } from '/@/hooks/web/useI18n';
const { createMessage } = useMessage();
const { t } = useI18n();
import { downloadFile } from '/@/utils/file/download';
export function useDownloadQueue() {
  const maxNum = '6'; // 最大下载数量
  function startDownload(rows) {
    if (!rows.length) {
      createMessage.warning(t('common.pleaseCheckTheDrawingsToBeDownloaded'));
      return;
    }
    const downloadQueue = rows.filter(row => row.filePath); // 过滤有效文件
    if (!downloadQueue.length) {
      createMessage.warning(t('common.noFiles'));
      return;
    }
    // 下载队列最大长度限制：chorme/firfox 最大并发数6
    if (downloadQueue.length > maxNum) {
      return createMessage.warning(t('common.MAXNUM', ['6']));
    }
    downloadQueue.forEach((item, index) => {
      setTimeout(() => {
        try {
          downloadFile({
            url: item.filePath,
            fileName: item.fileName,
          });
        } catch (error) {
          console.error(`Error downloading ${item.fileName}:`, error);
        }
      }, index * 350);
    });
  }
  return {
    startDownload,
  };
}
