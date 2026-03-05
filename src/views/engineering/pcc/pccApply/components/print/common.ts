import type { TemplateProps } from './types';

import { getAppEnvConfig } from '/@/utils/env';
import { useBaseStore } from '/@/store/modules/base';
import { getFactoryList } from '/@/api/business/shippingspace';
import { getSapFactoryList } from '/@/api/purchase/supplierInformation';
import { getUnitListByKeyword } from '/@/api/finance/materialPrice';
import { getUserInfoList } from '/@/api/permission/user';
import { useI18n } from '/@/hooks/web/useI18n';
import { getMaterialAreaChildren } from '/@/api/engineering/pcc';
import { getBomDetail, getPccDetail, getPccRevisionHistory } from '/@/api/engineering/pcc';
import { isNullOrUnDef } from '/@/utils/is';

const { VITE_GLOB_API_URL } = getAppEnvConfig();
const IMG_URL_PREFIX = VITE_GLOB_API_URL + '/api/Information/FileInfo/Download/';

const baseStore = useBaseStore();
const { t } = useI18n();

/**
 * 通过用户id获取详情信息
 * @param data
 */
async function getUserInfoByIds(data: any) {
  const fields = ['creatorUserName', 'handlerId'];

  const ids = fields.reduce((list: Array<string>, item) => {
    if (data.baseInfo[item]) {
      list.push(data.baseInfo[item]);
    }
    return list;
  }, []);

  if (ids.length === 0) {
    return Promise.resolve(data);
  }

  return getUserInfoList(ids).then(res => {
    const userMap = res?.data?.list?.reduce((map: any, item: any) => {
      map[item.id] = item;
      return map;
    }, {});
    fields.forEach(item => {
      if (data.baseInfo[item]) {
        data.baseInfo[item] = userMap?.[data.baseInfo[item]]?.fullName || data.baseInfo[item];
      }
    });
  });
}

/**
 * 通过字段获取对应的值
 * @param dictCode 字典编码
 * @param field 指定字段
 * @param data 数据对象
 * @returns
 */
async function getValueByDictionaryData(dictCode: string, field: string, data: any) {
  return baseStore.getDictionaryData(dictCode, true).then((res: Array<any>) => {
    if (data && typeof data === 'object' && !Array.isArray(data)) {
      const value = data?.[field];
      const target = res?.find(item => `${item.enCode}` === `${value}`);
      if (target) {
        data[field] = target.fullName;
      }
      return Promise.resolve(data);
    }

    if (data && Array.isArray(data)) {
      data.forEach(item => {
        const value = item?.[field];
        const target = res?.find(item => `${item.enCode}` === `${value}`);
        if (target) {
          item[field] = target.fullName;
        }
      });
    }
    return Promise.resolve(data);
  });
}

/**
 * 获取工厂信息
 * @param data
 */
async function getFactoryInfo(data: any) {
  const value = data?.prodInfo?.factory;
  if (!value) {
    return Promise.resolve();
  }
  return getFactoryList({ factoryCode: value }).then((res: { data: Array<any> }) => {
    const target = res?.data?.find(item => item.Code === value);
    if (target) {
      data.prodInfo.factory = `${target.Name}(${target.Code})`;
    }
  });
}

/**
 * 获取sap工厂信息
 * @param data
 * @returns
 */
async function getSapFactoryInfo(data: any) {
  const value = data?.prodInfo?.sapFactory;
  if (!value) {
    return Promise.resolve();
  }
  return getSapFactoryList({ keyword: value }).then((res: { data: Array<any> }) => {
    const target = res?.data?.find(item => item.code === value);
    if (target) {
      data.prodInfo.sapFactory = `${target.name}(${target.code})`;
    }
  });
}

/**
 * 获取工艺流程、材料单位信息
 * @param data
 */
async function getUnitName(data: any) {
  const technologyList = data.technologyTableData;
  const materialList = data.materialTableData;
  const packingMaterialFixedList = data.packageData?.packingMaterialFixedList;
  const packingMaterialCustomList = data.packageData?.packingMaterialCustomList;
  return getUnitListByKeyword({ keyword: '' }).then((res: { data: Array<any> }) => {
    const map = res?.data?.reduce((map: any, item: any) => {
      map[item.Code] = item.Name;
      return map;
    }, {});
    technologyList.forEach((item: any) => {
      item.speedUnit = map[item.speedUnit] || item.speedUnit;
    });
    materialList.forEach((item: any) => {
      item.unit = map[item.unit] || item.unit;
    });
    packingMaterialFixedList.forEach((item: any) => {
      item.packUnit = map[item.packUnit] || item.packUnit;
    });
    packingMaterialCustomList.forEach((item: any) => {
      item.packUnit = map[item.packUnit] || item.packUnit;
    });
  });
}

/**
 * 获取去包规&包材基础表格的`包材类型`的`label`
 * @param data
 * @returns
 */
async function getMaterialAreaChildrenLabel(data: any) {
  const packingMaterialFixedList = data.packageData?.packingMaterialFixedList;
  const packingMaterialCustomList = data.packageData?.packingMaterialCustomList;
  if (
    (!Array.isArray(packingMaterialFixedList) || packingMaterialFixedList.length === 0) &&
    (!Array.isArray(packingMaterialCustomList) || packingMaterialCustomList.length === 0)
  ) {
    return Promise.resolve(data);
  }
  return getMaterialAreaChildren({ enCode: 'PackagingMaterials', keyword: '' }).then(res => {
    const map = res?.data?.reduce((map: any, item: any) => {
      map[item.enCode] = item.fullName;
      return map;
    }, {});
    packingMaterialFixedList.forEach((item: any) => {
      item.type = map[item.type] || item.type;
    });
    packingMaterialCustomList.forEach((item: any) => {
      item.type = map[item.type] || item.type;
    });
  });
}

/**
 * 图片格式化，如果是http开头，将http开头替换为https开头，然后将获取图片转换为对应的base64编码
 * @param data
 */
async function formatImageList(data: any) {
  console.log('🚀 ~ formatImageList ~ data: ', data);
  const taskList: Array<Promise<any>> = [];

  data.technologyDetailTableData.forEach(item => {
    if (!Array.isArray(item.imageList) || item.imageList.length === 0) {
      return;
    }
    [...item.imageList].forEach((el, index) => {
      const url = typeof el === 'string' ? el : el?.filePath || '';
      console.log('🚀 ~  ~ url: ', url);
      taskList.push(
        convertImageToBase64(convertHttpToHttps(url.startsWith('http') ? url : `${IMG_URL_PREFIX}${url}`))
          .then(base64 => {
            item.imageList[index] = base64;
          })
          .catch(() => {}),
      );
    });
  });

  return Promise.all(taskList);
}

/**
 * 判断路径是否以http开头，如果是以http开头，替换为https开头
 * @param url 路径
 * @returns
 */
function convertHttpToHttps(url: string) {
  if (typeof url !== 'string') return url; // 非字符串直接返回
  return url.replace(/^http:\/\//i, 'https://'); // 正则替换
}

/**
 * 将远程图片URL转换为Base64格式
 * @param imageUrl - 需要转换的图片URL
 * @returns 返回Base64字符串
 */
function convertImageToBase64(imageUrl: string): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!imageUrl) {
      return '';
    }

    // 创建Image对象进行跨域请求
    const img = new Image();
    img.crossOrigin = 'Anonymous'; // 处理跨域问题

    img.onload = () => {
      try {
        // 创建canvas进行编码转换
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;

        // 设置canvas尺寸与图片一致
        canvas.width = img.width;
        canvas.height = img.height;

        // 绘制图片并转换
        ctx.drawImage(img, 0, 0);
        const base64 = canvas.toDataURL('image/png'); // 默认转为PNG格式
        resolve(base64);
      } catch (error) {
        reject(`Canvas转换失败: ${error}`);
      }
    };

    img.onerror = err => {
      reject(`图片加载失败: ${JSON.stringify(err)}`);
    };

    // 添加时间戳避免缓存问题
    img.src = imageUrl + (imageUrl.includes('?') ? '&' : '?') + 't=' + Date.now();
  });
}

/**
 * 格式化`材料`中的数据显示
 * @param data
 */
async function formatMaterialTableData(data: TemplateProps) {
  // 处理`工艺代码`显示内容
  const processOptions = (data.technologyTableData || []).map((item, index) => {
    return `${index + 1} 、${item.processCode}`;
  });
  data.materialTableData.forEach(item => {
    if (item.processCode) {
      item.processCode = processOptions[+item.processCode - 1];
    }
  });
}

/**
 * 获取到的数据格式化
 * @param data
 */
async function formatDetail(data: { bomDetail: any; pccDetail: any; history: any }) {
  const { bomDetail, pccDetail, history } = data;
  const parentPartInfo = bomDetail?.parentPartInfo || {};

  const processTableData = (bomDetail.processList || []).map(item => {
    const target = {
      ...item,
      imageList: (item?.imageList || []).map(v => v.filePath),
      isMain: item.isMain ? 1 : 0,
      defectRate: item.defectRate * 100,
      uuid: item.id,
    };
    if (target?.processCode?.startsWith('1') || target?.processCode?.startsWith('4') || target?.processCode?.startsWith('5')) {
      target.disabled = {
        speed: true,
        speedUnit: true,
      };
    } else {
      target.disabled = {
        capacity: true,
      };
    }
    return target;
  });

  const materialTableData = (bomDetail.materialList || []).map(item => ({
    ...item,
    uuid: item.id,
    utilizationRate: item.utilizationRate * 100 + '%',
  }));

  const testOptions = await baseStore.getDictionaryData('TestOption');

  const testStripTableData = (bomDetail.testStripList || []).map((item: any) => {
    const testOption = (testOptions as Array<any>).find((option: any) => option.enCode === item.testOption)?.fullName || item.testOption;
    return {
      ...item,
      testOption,
      uuid: item.id,
    };
  });
  const reviewList: any = [];
  if (pccDetail['currentNode'] != 'End') {
    reviewList.push({
      originVersion: history.length,
      version: `T${history.length}`,
      creatorTime: pccDetail.creatorTime || new Date().getTime(),
      revisionRemark: history.length == 0 ? t('dict.PCCApplyColumn.initialRelease') : pccDetail.revisionRemark || '',
    });
  }
  history.forEach((item: any) => {
    const target = {
      ...item,
      version: `T${item.version}`,
      originVersion: item.version,
    };
    reviewList.push(target);
  });

  const props: any = {
    baseInfo: {
      ...pccDetail,
    },
    prodInfo: {
      ...parentPartInfo,
      workshopEnv: isNullOrUnDef(parentPartInfo.workshopEnv) ? undefined : parentPartInfo.workshopEnv + '',
      process: parentPartInfo.process + '',
      businessType: parentPartInfo.businessType ? parentPartInfo.businessType + '' : '',
      isBonded: isNullOrUnDef(parentPartInfo.isBonded) ? undefined : parentPartInfo.isBonded + '',
    },
    technologyInfo: {
      ...parentPartInfo,
      technologyList: (bomDetail?.stepDistanceList || []).map(item => {
        return {
          ...item,
          uuid: item.id,
          stepDistance: item.stepDistance ? item.stepDistance + '' : null,
          modulus: item.modulus ? item.modulus + '' : null,
        };
      }),
    },
    moldNoList: (bomDetail?.moldList || []).map(item => item.code),
    technologyTableData: [...processTableData],
    technologyTableForm: {
      ...parentPartInfo,
      downtimeOneHour: Number(parentPartInfo.downtimeOneHour).toFixed(2),
      utilizationRate: (Number(parentPartInfo.utilizationRate) * 100).toFixed(2),
    },
    materialTableData,
    testStripTableData,
    packageData: {
      shipPattern: pccDetail.shipPattern,
      source: 'PCC',
      packingMaterialCustomList: (bomDetail.packingMaterialCustomList || []).map(item => ({ ...item, uuid: item.id })),
      packingMaterialFixedList: (bomDetail.packingMaterialFixedList || []).map(item => ({ ...item, uuid: item.id })),
      packageSpecQty: pccDetail.shipPattern === 'R' ? parentPartInfo.packSpecQtyR : parentPartInfo.packSpecQtyPN,
      ...parentPartInfo,
    },
    technologyDetailTableData: [...processTableData],
    changeHistoryTableData: reviewList,
    semiFinishedTableData: bomDetail.semiFinishedList || [],
  };

  return props;
}

/**
 * 将数据补充完整
 * @param propsData
 * @returns
 */
export async function getCompletedData(propsData: TemplateProps) {
  return Promise.all([
    // 将数据补充完整
    getUserInfoByIds(propsData),
    getValueByDictionaryData('PCC.BomType', 'bomType', propsData.baseInfo),
    getFactoryInfo(propsData),
    getSapFactoryInfo(propsData),
    getValueByDictionaryData('SapFactoryMaterial', 'businessType', propsData.prodInfo),
    getValueByDictionaryData('PCC.WorkshopEnv', 'workshopEnv', propsData.prodInfo),
    getValueByDictionaryData('SkillLevel', 'mainOperatorSkills', propsData.technologyInfo),
    getValueByDictionaryData('SkillLevel', 'auxiliaryOperatorSkills', propsData.technologyInfo),
    getValueByDictionaryData('PCC.ProcessType', 'process', propsData.technologyInfo),
    getValueByDictionaryData('PCC.ShippingMaterial', 'shippingMaterial', propsData.materialTableData),
    getUnitName(propsData),
    getMaterialAreaChildrenLabel(propsData),
    // 因为图片没有缓存，所以为了避免获取打印数据时，图片加载不完整，提前加载图片
    formatImageList(propsData),
    // 格式化`材料`中的数据显示
    formatMaterialTableData(propsData),
  ]);
}

/**
 * 通过id获取详情
 * @param id
 * @returns
 */
export async function getDetailById(id: string) {
  // 先请求PCC详情
  return getPccDetail({ id })
    .then(res => {
      const pccDetail = res.data;
      // 根据PCC详情请求历史记录
      const history = getPccRevisionHistory({
        PartNumber: pccDetail.insidePartNumber,
        bomType: pccDetail.bomType,
      });
      // 根据PCC详情请求Bom结构
      const bomDetail = getBomDetail({ id: pccDetail.bomId });
      return Promise.all([history, bomDetail, Promise.resolve(pccDetail)]);
    })
    .then(async ([historyRes, bomDetailRes, pccDetail]) => {
      return await formatDetail({ pccDetail, bomDetail: bomDetailRes.data, history: historyRes.data });
    });
}
