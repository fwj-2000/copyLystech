// shortcuts.ts
import { onMounted, onUnmounted } from 'vue';
import { useI18n } from '/@/hooks/web/useI18n';

// 类型定义
type ShortcutConfig = {
  key: string[];
  texts: string[]; // 改为支持多个文本
  checkVisibility?: boolean; // 新增配置：是否检查元素可见性
};
type ShortcutConfigList = ShortcutConfig[];

const { t } = useI18n();

// 默认快捷键配置
const defaultShortcutConfig: ShortcutConfigList = [
  {
    key: ['alt', 'n'],
    texts: [t('common.addText'), t('dict.WorkOrder.DataSources.1')],
    checkVisibility: false, // 新增：检查可见性
  }, //新增，新建
  {
    key: ['alt', 'o'],
    texts: [t('common.batchExport')],
    checkVisibility: false,
  }, //导出
  {
    key: ['alt', 'r'],
    texts: [t('common.resetText')],
    checkVisibility: false,
  }, //重置
  {
    key: ['alt', 's'],
    texts: [t('dict.PrOrderFlowNode.apply')],
    checkVisibility: true,
  }, //提交
  {
    key: ['shift', 'Escape'],
    texts: [t('common.back'), t('common.cancel')],
    checkVisibility: false,
  }, //返回，取消
  // {
  //   key: ['shift', 'i'],
  //   texts: [t('common.batchImport')],
  //   checkVisibility: false,
  // }, //批量导入
  {
    key: ['alt', 'p'],
    texts: [t('dict.CommonCol.print')],
    checkVisibility: false,
  }, //打印
  {
    key: ['alt', 'v'],
    texts: [t('common.view')],
    checkVisibility: false,
  }, //查看
];

// 初始化快捷键监听
export function initShortcuts(config: ShortcutConfigList = defaultShortcutConfig) {
  let lastKeyDownTime = 0;
  const SHORTCUT_KEY_MIN_INTERVAL = 100; // 扫码枪与手动按键的时间差阈值
  let isLikelyScannerInput = false;

  const handleKeyDown = (e: KeyboardEvent) => {
    // console.log(e, 'e');
    const now = Date.now();
    if (now - lastKeyDownTime < SHORTCUT_KEY_MIN_INTERVAL) {
      isLikelyScannerInput = true;
    } else {
      isLikelyScannerInput = false;
    }
    lastKeyDownTime = now;
    // 定义要禁用的快捷键组合
    const blockedKeys = ['I', 'J'];

    if (e.ctrlKey && e.shiftKey && blockedKeys.includes(e.key)) {
      e.preventDefault(); // 阻止默认行为
      return;
    }
    if (isLikelyScannerInput) {
      // console.log('[快捷键] 忽略可能的扫码枪输入:', e.key);
      return;
    }

    // 正常快捷键逻辑
    config.forEach(shortcut => {
      if (checkKeyCombination(e, shortcut.key)) {
        e.preventDefault();
        shortcut.texts.forEach(text => {
          triggerButtonByText(text, shortcut.checkVisibility ?? true);
        });
      }
    });
  };

  // 添加事件监听
  onMounted(() => {
    window.addEventListener('keydown', handleKeyDown);
  });

  // 移除事件监听
  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeyDown);
  });
}

// 检查按键组合是否匹配
function checkKeyCombination(e: KeyboardEvent, keys: string[]): boolean {
  // 必须包含所有修饰键
  const requiredModifiers = keys.filter(k => ['ctrl', 'shift', 'alt'].includes(k));

  // 检查修饰键
  if (requiredModifiers.includes('ctrl') && !e.ctrlKey) return false;
  if (requiredModifiers.includes('shift') && !e.shiftKey) return false;
  if (requiredModifiers.includes('alt') && !e.altKey) return false;

  // 最后一个键应该是非修饰键
  const lastKey = keys[keys.length - 1].toLowerCase();
  return e.key.toLowerCase() === lastKey;
}

// 检查元素是否可见（使用offsetWidth和offsetHeight判断）
function isElementVisible(element: HTMLElement): boolean {
  return element.offsetWidth > 0 && element.offsetHeight > 0;
}

// 根据文本触发按钮点击
function triggerButtonByText(text: string, checkVisibility: boolean) {
  const buttons = Array.from(document.querySelectorAll('button')) as HTMLButtonElement[];

  // 过滤匹配文本的按钮
  const matchedButtons = buttons.filter(btn => {
    const btnText = btn.textContent?.trim().replace(/\s+/g, '') || '';
    return btnText === text;
  });

  if (matchedButtons.length > 0) {
    console.log(matchedButtons, 'matchedButtons');

    if (checkVisibility && !isElementVisible(matchedButtons[0])) {
      console.warn(`按钮 "${text}" 被隐藏，不触发点击`);
      return;
    } else {
      matchedButtons[0].click();
    }
  } else {
    // console.warn(`未找到文本为 "${text}" 的按钮`);
  }
}

// 导出默认配置以便外部修改
export { defaultShortcutConfig };
