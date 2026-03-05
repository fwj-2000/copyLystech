import { useGlobSetting } from '/@/hooks/setting';
const globSetting = useGlobSetting();

// 文件下载
export function downloadFn(filePath, fileName) {
  window.open(`${globSetting.apiUrl}/api/Information/fileinfo/downloadfile?filePath=${filePath}&fileName=${fileName}`);
}
