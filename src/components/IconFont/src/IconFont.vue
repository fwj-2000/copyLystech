<script langtype="ts" setup>
  /**
   * Custom icon list
   * All icons are loaded here for easy management
   * @see https://3x.antdv.com/components/icon-cn#components-icon-demo-iconfont
   *
   * 自定义图标加载表
   */

  import { createFromIconfontCN } from '@ant-design/icons-vue';

  const MyIcon = createFromIconfontCN({
    scriptUrl: '//at.alicdn.com/t/font_3289723_4n7g5m6q7f.js', // 在 iconfont.cn 上生成
  });
</script>
