import { useI18n } from '/@/hooks/web/useI18n';
import { reactive } from 'vue';
import { useBaseStore } from '/@/store/modules/base';

const { t } = useI18n();

const baseStore = useBaseStore();

/**
 * `是否沿用件`格式化显示
 * @param value 值
 */
export function usePartFormatter(value: any) {
  if (`${value}` === '1') {
    return t('common.yes');
  }
  return `${value}` === '0' ? t('common.no') : '/';
}

/**
 * 将下划线命名转换为小驼峰命名
 * @param {string} str - 下划线格式的字符串（如：hello_world）
 * @returns {string} 小驼峰格式的字符串（如：helloWorld）
 */
export function snakeToCamel(str: string): string {
  return str
    .split('_') // 按'_'分割成单词数组
    .filter(word => word.length > 0) // 过滤空字符串
    .map((word, index) =>
      index === 0
        ? word.toLowerCase() // 首单词全小写
        : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
    )
    .join(''); // 拼接结果
}

/** 状态列表 */
export const state = reactive<{ [key: string]: Array<IDictionaryItem> }>({
  DFMList: [],
  MakeEngineeringInfoList: [],
  reviewResultList: [],
});

async function getTypeOptions() {
  state.DFMList = (await baseStore.getDictionaryData('DrawingsReview.DFM')) as IDictionaryItem[];
  state.MakeEngineeringInfoList = (await baseStore.getDictionaryData('DrawingsReview.MakeEngineeringInfo')) as IDictionaryItem[];
  state.reviewResultList = (await baseStore.getDictionaryData('DrawingsReview.ReviewResult')) as IDictionaryItem[];
}

await getTypeOptions();
