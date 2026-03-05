import { h } from 'vue';

import { DoubleLeftOutlined } from '@ant-design/icons-vue';

interface ToolbarExpandAllProps {
  title?: string;
  expanded?: boolean;
  disabled?: boolean;
  onToggle?: () => void;
}

/**
 * 渲染`一键展开子表`工具按钮
 */
export function renderToolbarToolExpandAll(renderOpts: { props?: ToolbarExpandAllProps }) {
  const { props = {} } = renderOpts;
  const { title, disabled, expanded, onToggle } = props;

  const rotation = expanded ? '-90deg' : '90deg';

  return h(
    'button',
    {
      class: ['expand-all-icon', 'vxe-button', 'type--button', 'size--small', 'w-31px', 'h-30px', 'rounded-none', expanded ? 'is--active' : ''],
      type: 'button',
      title,
      disabled,
      style: {
        borderRadius: '0px',
      },
      onClick: (event: MouseEvent) => {
        event.stopPropagation();
        if (disabled) {
          return;
        }
        onToggle?.();
      },
    },
    [
      h(DoubleLeftOutlined, {
        style: {
          transform: `rotate(${rotation})`,
          transition: 'transform 0.2s ease',
          display: 'inline-flex',
        },
      }),
    ],
  );
}
