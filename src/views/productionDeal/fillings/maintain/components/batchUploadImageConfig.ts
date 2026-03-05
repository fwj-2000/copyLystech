import type { VxeGridPropTypes } from 'vxe-table';

import { useI18n } from '/@/hooks/web/useI18n';

const { t } = useI18n();

/**
 * 命名规则：
 * 产品实物图片正面：   ACP   产品A面(正面）
 * 产品实物图片反面：   BCP   产品B面(反面)
 * 纯产品称重图片：     CCP    纯产品
 * 带衬背称重图片：     DCP    带衬背产品
 * 例如：
 * 800-RAAM043-0C00R-EU0-ACP         代表是产品正面
 * 800-RAAM043-0C00R-EU0-BCP         代表是产品反面
 * 800-RAAM043-0C00R-EU0-CCP-200PCS  代表是纯产品称重图片
 * 800-RAAM043-0C00R-EU0-DCP-200PCS  代表是带衬背产品称重图片
 */
const imageTypeMap = {
  ACP: { field: 'productPicture', title: t('dict.FilingsApplyColumn.ProductPicture') },
  BCP: { field: 'productPictureBack', title: t('dict.FilingsApply.productPictureBack') },
  CCP: { field: 'productWeightPicture', title: t('dict.FilingsApplyColumn.ProductWeightPicture') },
  DCP: { field: 'backProductWeightPicture', title: t('dict.FilingsApplyColumn.BackProductWeightPicture') },
};

/**
 * 根据图片名称，获取对应的字段名
 * 例如：
 * 800-RAAM043-0C00R-EU0-ACP         代表是产品正面，返回 'productPicture'
 * 800-RAAM043-0C00R-EU0-BCP         代表是产品反面，返回 'productPictureBack'
 * 800-RAAM043-0C00R-EU0-CCP-200PCS  代表是纯产品称重图片，返回 'productWeightPicture'
 * 800-RAAM043-0C00R-EU0-DCP-200PCS  代表是带衬背产品称重图片，返回 'backProductWeightPicture'
 * 如果图片名称不符合格式或类型不匹配，则返回null
 * @param imageName 图片名称
 * @returns 图片类型信息，包含字段名和标题，或null
 */
export function getImageTypeInfo(imageName: string): { field: string; title: string } | null {
  //把文件最后的扩展名去掉
  imageName = imageName.replace(/\.\w+$/, '');

  // 按连字符分割图片名称
  const parts = imageName.split('-').map(item => item.trim());
  // 检查分割后的数组是否有足够的部分
  if (parts.length >= 5) {
    const imageTypeCode = parts[4];
    // 如果图片类型代码存在于映射表中，返回对应的字段名
    if (imageTypeMap[imageTypeCode]) {
      return imageTypeMap[imageTypeCode];
    }
  }
  // 不符合格式或类型不匹配，返回空字符串
  return null;
}

export const columns: VxeGridPropTypes.Columns = [
  {
    type: 'seq',
    width: 50,
  },
  // 状态
  {
    title: t('dict.CommonCol.statusName'),
    field: 'message',
    width: 100,
    slots: { default: 'message' },
  },
  // 产品内部料号
  {
    title: t('dict.CommonCol.insidePartNumber'),
    field: 'insidePartNumber',
    width: 180,
  },
  // 图片类型
  {
    title: t('dict.CommonCol.category'),
    field: 'imgType',
    width: 130,
  },
  // 图片
  {
    title: t('dict.CommonCol.img'),
    field: 'imgName',
    width: 300,
    slots: { default: 'imgName' },
  },
  // 操作
  {
    title: t('common.action'),
    width: 50,
    slots: { default: 'action' },
    fixed: 'right',
    field: 'action',
  },
];
