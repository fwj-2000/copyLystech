import { App } from 'vue';

let currentFocus = null; // 在外部定义一个变量，用来保存当前被focus的元素

const pasteDirective = {
  beforeMount: function (el, binding) {
    el.addEventListener('mouseenter', function (e) {
      currentFocus = el; // 当组件被focus时，记录下这个组件
    });
    el.addEventListener('mouseleave', function (e) {
      currentFocus = null; // 当组件被focus时，记录下这个组件
    });
    document.addEventListener('paste', function (e) {
      // 只有当这个组件被focus时，才让它接收粘贴的文件
      if (currentFocus === el && e.clipboardData && e.clipboardData.items[0].type.indexOf('image') > -1) {
        // if (currentFocus === el && e.clipboardData && e.clipboardData.items[0].type.indexOf('image') > -1) {
        let file = e.clipboardData.items[0].getAsFile();
        binding.value({ file, type: 'paste' });
      }
    });
  },
};

export function setupPasteDirective(app: App) {
  app.directive('paste', pasteDirective);
}

export default setupPasteDirective;
