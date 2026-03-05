import type { TemplateProps } from '../types';

import { h, render, nextTick } from 'vue';
import { cloneDeep } from 'lodash-es';
import { uploadPCC } from '/@/api/engineering/pcc';
import { getDetailById, getCompletedData } from '../common';
import jsPDF from 'jspdf';
import { uploadfiles as uploadInstallFile } from '/@/api/basic/common';
// import html2canvas from 'html2canvas';
import { snapdom } from '@zumer/snapdom';

import Template from '../template.vue';

/**
 * 调整HTML间距，避免文本被阶段，并且生成pdf
 * @param printDom
 * @param _name
 * @returns
 */
async function exportToPDF(printDom: HTMLElement, _name: string) {
  //A4纸张的宽度和高度
  const A4_WIDTH = 592.28;
  const A4_HEIGHT = 841.89;

  //获取DOM节点，这个节点包含的是想要导出的PDF内容
  //计算页面的高度
  const pageHeight = (printDom.getBoundingClientRect().width / A4_WIDTH) * A4_HEIGHT;
  //获取DOM节点，是可能会被截断的DOM节点
  const wholeNodes = document.querySelectorAll('.whole-node') as NodeListOf<HTMLElement>;
  for (let i = 0; i < wholeNodes.length; i++) {
    //这个条件判断是元素i距离上方或上层控件的位置+元素i本身的高度小于A4纸的高度，并且下一个元素距离上方或上层控件的位置+下一个元素本身的高度大于A4纸的高度意味着当前页面的内容则在中间插入一个空白块，空白的高度计算为：A4纸的高度减去减去元素i的offsetTop+offsetHeight需要分页处理。
    const wholeHeight = getOffsetTopRelative(wholeNodes[i], printDom);
    //计算分页的页数
    const bottomPageNum = Math.ceil((wholeHeight + wholeNodes[i].offsetHeight) / pageHeight);

    if (
      wholeHeight + wholeNodes[i].offsetHeight < pageHeight * bottomPageNum &&
      wholeNodes[i + 1] &&
      getOffsetTopRelative(wholeNodes[i + 1], printDom) + wholeNodes[i + 1].offsetHeight > pageHeight * bottomPageNum
    ) {
      const divParent = wholeNodes[i].parentNode;
      const newBlock = document.createElement('div');
      newBlock.className = 'emptyDiv';
      newBlock.style.background = '#fff';
      newBlock.style.display = 'block';
      //计算空白区域的高度，以便正确地填充在当前页面和下一页面之间
      const _H = bottomPageNum * pageHeight - wholeHeight - wholeNodes[i].offsetHeight;
      newBlock.style.height = `${_H + 32}px`;

      // 将空白块插入到当前元素之后
      if (wholeNodes[i].nextSibling) {
        divParent && divParent.insertBefore(newBlock, wholeNodes[i].nextSibling);
      } else {
        divParent && divParent.appendChild(newBlock);
      }
    }
  }

  const webp = await snapdom.toWebp(printDom, { scale: 2 });
  // const canvas = await html2canvas(printDom, { scale: window.devicePixelRatio });

  //获取渲染的 canvas 宽度和高度，并将其乘以 2，因为 canvas 的渲染通常是基于设备像素比例进行缩放的，我们需要还原为实际的物理像素。
  // const contentWidth = parseInt(canvas.width);
  // const contentHeight = parseInt(canvas.height);
  const contentWidth = parseInt(webp.width);
  const contentHeight = parseInt(webp.height);
  const imgWidth = A4_WIDTH;
  const imgHeight = (A4_WIDTH / contentWidth) * contentHeight;
  const pageData = webp;
  // const pageData = canvas.toDataURL('image/jpeg', 1.0);
  const PDF = new jsPDF('p', 'pt', 'a4');

  let leftHeight = contentHeight;
  //初始化 leftHeight 为内容的总高度，position 用于控制每一页图像的位置。
  let position = 0;
  //判断 leftHeight 是否小于等于页面的高度 pageHeight。如果小于等于，直接将图像添加到 PDF 中。如果大于，则分多页添加图像，每页添加 841.89 的高度，直到所有内容都被添加到 PDF 中。position 用于控制图像在每页中的垂直位置。
  if (leftHeight <= pageHeight) {
    PDF.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight);
  } else {
    while (leftHeight > 0) {
      PDF.addImage(pageData, 'JPEG', 0, position, imgWidth, imgHeight);
      leftHeight -= (contentWidth / A4_WIDTH) * A4_HEIGHT;
      position -= A4_HEIGHT;
      if (leftHeight > 0) {
        PDF.addPage();
      }
    }
  }

  // PDF.save(_name);
  return PDF;
}

/**
 * 获取元素相对于指定父元素的offsetTop
 * @param element 目标元素
 * @param parentElement 指定的父元素
 * @returns 相对于父元素的offsetTop（像素值）
 */
function getOffsetTopRelative(element: HTMLElement, parentElement: HTMLElement): number {
  let offsetTop = 0;
  let currentElement: HTMLElement | null = element;

  // 向上遍历DOM树直到找到目标父元素
  while (currentElement && currentElement !== parentElement) {
    offsetTop += currentElement.offsetTop;
    currentElement = currentElement.offsetParent as HTMLElement | null;

    // 如果到达文档根元素仍未找到父元素，则中断循环
    if (!currentElement || currentElement === document.body) {
      break;
    }
  }

  return offsetTop;
}

/**
 * 生成推送到3.8的pdf文件
 * @param props
 * @returns
 */
export async function generatePdf(props: TemplateProps) {
  const propsData = cloneDeep({ ...props });
  return getCompletedData(propsData)
    .then(async () => {
      // 挂载节点
      const tempDiv = document.createElement('div');

      tempDiv.style = 'width: 750px;position: absolute;padding-top: 10px;background: #fff;left: -999999px;top: -999999px;';

      render(h(Template, propsData), tempDiv);
      document.body.appendChild(tempDiv);
      await nextTick(); // 延时，给图片渲染时间
      const { insidePartNumber, docNumber } = propsData.baseInfo;
      const PDF = await exportToPDF(tempDiv, `${insidePartNumber}_${docNumber}.pdf`)
        .then(blob => blob)
        .finally(() => {
          document.body.removeChild(tempDiv);
        });
      return new File([PDF.output('blob')], `${insidePartNumber}_${docNumber}.pdf`, { type: 'application/pdf' });
    })
    .catch(e => {
      console.error('generatePdf e: ', e);
    })
    .finally(() => {});
}

/**
 * 通过id，生成PDF文件
 * @param id
 * @returns
 */
export async function generatePdfById(id: string) {
  return getDetailById(id)
    .then(generatePdf)
    .then(res => {
      return res ? uploadInstallFile({ fileList: res }) : Promise.reject();
    })
    .then(res => {
      const target = res?.data?.[0] || {};
      return (
        target &&
        uploadPCC([
          {
            filePath: target.fullPath,
            fileName: target.fileName,
            id,
          },
        ])
      );
    });
}

/**
 * 通过id列表，PCC制作数据打印
 * @param ids 数据id列表
 */
// export async function generatePdfByIds(ids: Array<string>) {
//   if (ids.length === 0) {
//     return Promise.reject(false);
//   }

//   const taskList = ids.map(id =>
//     getDetailById(id).then(async props => {
//       return generatePdf(props);
//     }),
//   );
//   return Promise.all(taskList)
//     .then(res => {
//       const list = res.map(file => uploadInstallFile({ fileList: file! }));
//       return Promise.all(list);
//     })
//     .then(res => {
//       const data = res.map((item, index) => {
//         const target = item?.data?.[0] || {};
//         return {
//           filePath: target.fullPath,
//           fileName: target.fileName,
//           id: ids[index],
//         };
//       });
//       return uploadPCC(data);
//     });
// }
