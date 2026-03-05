import { generatePdfById } from './pdf';
import { GeneratePDFQueue } from './queue';

export { generatePdfById };

const queue = new GeneratePDFQueue([]);

/**
 * 通过id列表，生成PDF文件
 * @param ids 数据id列表
 */
export async function generatePdfByIds(ids: Array<string>) {
  if (ids.length === 0) {
    return Promise.reject(false);
  }
  return queue.add(ids.map(id => ({ id })));

  // const taskList = ids.map(id =>
  //   getDetailById(id).then(async props => {
  //     return generatePdf(props);
  //   }),
  // );
  // return Promise.all(taskList)
  //   .then(res => {
  //     const list = res.map(file => uploadInstallFile({ fileList: file! }));
  //     return Promise.all(list);
  //   })
  //   .then(res => {
  //     const data = res.map((item, index) => {
  //       const target = item?.data?.[0] || {};
  //       return {
  //         filePath: target.fullPath,
  //         fileName: target.fileName,
  //         id: ids[index],
  //       };
  //     });
  //     return uploadPCC(data);
  //   });
}
