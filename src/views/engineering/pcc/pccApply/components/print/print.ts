import type { TemplateProps } from './types';

import { useVueToPrint } from 'vue-to-print';
import { h, render } from 'vue';
import { cloneDeep } from 'lodash-es';
import { getDetailById, getCompletedData } from './common';

import Template from './template.vue';

/**
 * PCC制作数据打印
 * @param props
 */
export async function printPCCDetail(props: TemplateProps) {
  const propsData = cloneDeep(props);
  return getCompletedData(propsData)
    .then(async () => {
      // 挂载节点
      const tempDiv = document.createElement('div');
      render(h(Template, propsData), tempDiv);

      return new Promise(resolve => {
        // 执行打印
        const { insidePartNumber, docNumber, creatorUserName } = propsData.baseInfo;
        let documentTitle = `${insidePartNumber}_${docNumber}`;
        if (creatorUserName && creatorUserName != '') {
          // 识别用户是否存在英文名字，如果存在，则取index为1的值
          const splitName = creatorUserName.split('/');
          documentTitle = documentTitle + '(' + (splitName.length == 2 ? splitName[0] : splitName[1]) + ')';
        }
        const { handlePrint } = useVueToPrint({
          content: tempDiv,
          removeAfterPrint: true,
          documentTitle,
          onAfterPrint: () => {
            // 关闭打印之后销毁
            resolve(true);
          },
        });
        handlePrint();
      });
    })
    .catch(e => {
      console.error(e);
    })
    .finally(() => {});
}

/**
 * 通过id列表，PCC制作数据打印
 * @param ids 数据id列表
 */
export async function printPCCDetailByIds(ids: Array<string>) {
  if (ids.length === 0) {
    return Promise.reject(false);
  }

  return new Promise(async resolve => {
    for (const id of ids) {
      await getDetailById(id).then(async props => {
        await printPCCDetail(props);
      });
    }
    resolve(true);
  });
}
