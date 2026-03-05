import { RectNode, RectNodeModel, h } from '@logicflow/core';
import processNodeIcon from './icons/process_node_icon.svg';

// 可在此重写节点的各种事件
class FlowNodeModel extends RectNodeModel {
  /**
   * 初始化
   */
  initNodeData(data) {
    super.initNodeData(data);
    this.width = 138;
    this.height = 40;
    this.radius = 4;
    this.text.x = this.x;
    this.text.y = this.y;
    this.iconPosition = ''; // icon位置，left表示左边，'right'表示右边
    this.defaultFill = '#FFFFFF';
    this.isFlowNode = true;
    console.log(data, '9999999999999');
  }
  getTextStyle() {
    const style = super.getTextStyle();
    style.overflowMode = 'autoWrap';
    // style.width = 136;
    style.fontSize = 14;
    style.paddingRight = 1;
    style.paddingLeft = 1;
    style.lineHeight = 1.5;
    return style;
  }

  /**
   * 重写节点样式
   */
  getNodeStyle() {
    const style = super.getNodeStyle();
    let fill = this.defaultFill;

    style.fill = fill;
    return style;
  }
}
class FlowNodeView extends RectNode {
  getIcon() {
    const { width, height, text } = this.props.model;
    console.log(width, height, text, 'getIcon');
    return h('image', {
      width: 18,
      height: 18,
      x: -width / 2 + 9,
      y: -9,
      href: processNodeIcon,
    });
  }
  customMouseDown = ev => {
    const { model, graphModel } = this.props;
    graphModel.eventCenter.emit('custom-event:clone-node', model);
  };
  getShape() {
    const { text, x, y, width, height, radius } = this.props.model;
    const style = this.props.model.getNodeStyle();
    return h(
      'g',
      {
        className: 'lf-flow-node',
        onMouseDown: this.customMouseDown,
      },
      [
        h('rect', {
          // ...style,
          fill: '#fff',
          stroke: '#ddd',
          x: x - width / 2,
          y: y - height / 2,
          width,
          height,
          rx: radius,
          ry: radius,
        }),
      ],
    );
  }
}

export default {
  type: 'flow-node',
  model: FlowNodeModel,
  view: FlowNodeView,
};
