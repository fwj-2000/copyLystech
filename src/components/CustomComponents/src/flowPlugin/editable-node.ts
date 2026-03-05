import { RectNode, RectNodeModel, h } from '@logicflow/core';
import processNodeIcon from './icons/process_node_icon.svg';
// import { useFlowSettingStore } from '/@/store/modules/flowSetting';
// const useFlowSetting = useFlowSettingStore();

// 工序类型颜色 key对应字典encode
const TYPEDESC_COLOR_MAP = {
  1: '#FF7B00',
  // 开始节点: '#3CC2C9',
  // 处理节点: '#477CFE',
  // 子流程虚拟节点: '#FF7B00',
  4: 'red',
};

class FlowNodeModel extends RectNodeModel {
  /**
   * 初始化
   */
  initNodeData(data) {
    super.initNodeData(data);
    this.width = 160; // 节点宽度
    this.height = 70; // 节点高度
    this.radius = 4; // 圆角
    this.titleHeight = 29; // 标题区域高度
    this.splitLineHeight = 1; // 分割线高度
    this.contentHeight = this.height - this.titleHeight - this.splitLineHeight; // 内容区域高度
    this.titleFill = '#1890FF'; // 标题背景颜色
    this.splitLineFill = '#DDD'; // 分割线颜色
    this.defaultFill = '#FFFFFF'; // 内容背景颜色
    this.isFlowNode = true;
    // // 标题文字位置
    this.hasSetTargetRules = true;
    this.text.x = this.x;
    this.text.y = this.y + this.titleHeight / 2 + this.splitLineHeight / 2;
    // this.text.editable = true;
    // this.text.draggable = true;
    // 内容文字位置
    this.content = data.content || ''; // 内容
    // this.contentPosition = {
    //   x: this.x,
    //   y: this.y + this.titleHeight / 2 + this.splitLineHeight / 2,
    // };
  }

  getTextStyle() {
    const style = super.getTextStyle();
    style.fontSize = 16;
    style.color = '#333';
    return style;
  }
  /**
   * 更新文字位置
   */
  updateTextPosition() {
    super.updateTextPosition();
    // 更新标题文字位置
    this.text.x = this.x;
    this.text.y = this.y - this.height / 2 + this.titleHeight / 2;

    // // 更新内容文字位置
    // this.contentPosition = {
    //   x: this.x,
    //   y: this.y + this.titleHeight / 2 + this.splitLineHeight / 2,
    // };
  }

  /**
   * 标题样式
   */
  getTitleStyle() {
    return {
      fontSize: 14,
      fontWeight: 'bold',
      fill: '#FFF', // 标题文字颜色
      overflowMode: 'autoWrap',
      paddingRight: 5,
      paddingLeft: 5,
    };
  }

  /**
   * 内容样式
   */
  getContentStyle() {
    return {
      fontSize: 12,
      fill: '#333', // 内容文字颜色
      overflowMode: 'autoWrap',
      paddingRight: 5,
      paddingLeft: 5,
    };
  }

  /**
   * 节点样式
   */
  getNodeStyle() {
    const style = super.getNodeStyle();
    style.fill = this.defaultFill;
    return style;
  }
}

class FlowNodeView extends RectNode {
  /**
   * 获取图标
   */
  getIcon() {
    const { width } = this.props.model;
    return h('image', {
      width: 18,
      height: 18,
      x: -width / 2 + 9,
      y: -9,
      href: processNodeIcon,
    });
  }

  /**
   * 自定义鼠标按下事件
   */
  customMouseDown = ev => {
    const { model, graphModel } = this.props;
    graphModel.eventCenter.emit('custom-event:clone-node', model);
  };

  /**
   * 渲染节点形状
   */
  getShape() {
    const { model } = this.props;
    const { x, y, width, height, radius, titleHeight, splitLineHeight, titleFill, splitLineFill, defaultFill, text, properties } = model;
    const _titleFill = TYPEDESC_COLOR_MAP[properties.nodeType] || titleFill;
    // 标题区域
    const titleRect = h('rect', {
      x: x - width / 2,
      y: y - height / 2,
      width,
      height: titleHeight,
      //   rx: radius,
      //   ry: radius,
      fill: _titleFill,
    });

    // 分割线
    const splitLine = h('rect', {
      x: x - width / 2,
      y: y - height / 2 + titleHeight,
      width,
      height: splitLineHeight,
      fill: splitLineFill,
    });

    // 内容区域
    const contentRect = h('rect', {
      x: x - width / 2,
      y: y - height / 2 + titleHeight + splitLineHeight,
      width,
      height: height - titleHeight - splitLineHeight,
      rx: radius,
      ry: radius,
      fill: defaultFill,
    });

    // 标题文字
    const titleText = h(
      'text',
      {
        ...model.getTitleStyle(),
        x,
        y: y - height / 2 + titleHeight / 2 + 5, // 垂直居中，稍微向下偏移
        textAnchor: 'middle', // 文字居中
        dominantBaseline: 'middle', // 垂直居中
      },
      properties.processTypeDesc,
    );

    // // 内容文字
    // const contentText = h(
    //   'text',
    //   {
    //     ...model.getContentStyle(),
    //     x,
    //     y: y + titleHeight / 2 + splitLineHeight + 5, // 垂直居中，稍微向下偏移
    //     textAnchor: 'middle', // 文字居中
    //     dominantBaseline: 'middle', // 垂直居中
    //   },
    //   text.value,
    // );

    return h(
      'g',
      {
        className: 'lf-flow-node',
        // onMouseDown: this.customMouseDown,
      },
      [
        titleRect, // 标题背景
        splitLine, // 分割线
        contentRect, // 内容背景
        titleText, // 标题文字
        // contentText, // 内容文字
      ],
    );
  }
}

export default {
  type: 'editable-node',
  model: FlowNodeModel,
  view: FlowNodeView,
};
