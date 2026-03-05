/** 常用标签名称 */
const allTags = [
  'html',
  'head',
  'body',
  'base',
  'link',
  'meta',
  'style',
  'title',
  'address',
  'article',
  'aside',
  'footer',
  'header',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'main',
  'nav',
  'section',
  'blockquote',
  'dd',
  'div',
  'dl',
  'dt',
  'figcaption',
  'figure',
  'hr',
  'li',
  'ol',
  'p',
  'pre',
  'ul',
  'a',
  'abbr',
  'b',
  'bdi',
  'bdo',
  'br',
  'cite',
  'code',
  'data',
  'dfn',
  'em',
  'i',
  'kbd',
  'mark',
  'q',
  'rb',
  'rp',
  'rt',
  'rtc',
  'ruby',
  's',
  'samp',
  'small',
  'span',
  'strong',
  'sub',
  'sup',
  'time',
  'u',
  'var',
  'wbr',
  'area',
  'audio',
  'img',
  'map',
  'track',
  'video',
  'embed',
  'iframe',
  'object',
  'param',
  'picture',
  'portal',
  'source',
  'svg',
  'math',
  'canvas',
  'noscript',
  'script',
  'del',
  'ins',
  'caption',
  'col',
  'colgroup',
  'table',
  'tbody',
  'td',
  'tfoot',
  'th',
  'thead',
  'tr',
  'button',
  'datalist',
  'fieldset',
  'form',
  'input',
  'label',
  'legend',
  'meter',
  'optgroup',
  'option',
  'output',
  'progress',
  'select',
  'textarea',
  'details',
  'dialog',
  'menu',
  'summary',
  'slot',
  'template',
];

/**
 * 获取安全的HTML内容，只保留指定的HTML标签，其他标签和特殊字符进行转义处理
 * @param content - 需要处理的原始内容字符串
 * @param allowedTags - 允许保留的HTML标签列表，默认为常用的文本格式化标签
 * @returns 处理后的安全HTML内容，其中只有指定标签被保留，其他HTML标签和特殊字符被转义
 */
export function getSafeContent(content: string, allowedTags: string[] = allTags) {
  if (!content || allowedTags.length === 0) {
    return content;
  }

  const tagMap = new Map();

  // 创建允许标签的正则表达式
  const allowedTagsPattern = allowedTags.join('|');

  let protectedContent = content.replace(new RegExp(`<(\/?)(${allowedTagsPattern})(\\s[^>]*?)?>`, 'gi'), match => {
    const id = `TAG_${Math.random().toString(36).substr(2, 9)}`;
    tagMap.set(id, match);
    return id;
  });
  // 转义所有剩余的尖括号
  protectedContent = protectedContent.replace(/</g, '&lt;').replace(/>/g, '&gt;');

  //  恢复受保护的有效标签
  tagMap.forEach((tag, id) => {
    protectedContent = protectedContent.replace(id, tag);
  });

  // 保留换行符
  return protectedContent.replace(/\n/g, '<br>');
}
