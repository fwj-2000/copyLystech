import { RectNode, RectNodeModel, h, ConnectRule, BaseNodeModel } from '@logicflow/core';
// import { getIcon } from "./icon";
import finishNodeIcon from './icons/finish_node_icon.png';

// 可在此重写节点的各种事件
class FinishNodeModel extends RectNodeModel {
  /**
   * 初始化
   */
  initNodeData(data) {
    console.log(this.style.text, 'this.============');
    super.initNodeData(data);
    this.width = 138;
    this.height = 40;
    this.radius = 4;
    // this.text.editable = false;
    // this.text.isShowAnchor
    this.text.x = this.x;
    this.text.y = this.y;
    this.iconPosition = 'left'; // icon位置，left表示左边，'right'表示右边
    this.defaultFill = '#FFFFFF';
    this.isFlowNode = true;
    // this.isShowAnchor = true;
    // console.log(data, 'initNodeData');
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
  getConnectedSourceRules(): ConnectRule[] {
    const rules = super.getConnectedSourceRules();
    const geteWayOnlyAsTarget = {
      message: '结束节点只能连入，不能连出！',
      validate: (source: BaseNodeModel) => {
        let isValid = true;
        if (source) {
          isValid = false;
        }
        return isValid;
      },
    };
    // @ts-ignore
    rules.push(geteWayOnlyAsTarget);
    return rules;
  }
  // setAttributes() {
  //   this.width = 200;
  //   // const {
  //   //   properties
  //   // } = this;
  //   this.isShowAnchor = true;
  //   console.log(this, 'fields')
  //   // this.height = 60 + fields.length * 24;
  //   console.log(this.height, "setA");
  // }
  /**
   * 重写节点样式
   */
  getNodeStyle() {
    const style = super.getNodeStyle();
    // const dataStyle = this.properties.style || {};
    // const { isCloseToBoundary, region } = this.properties;
    let fill = this.defaultFill;
    // let stroke = '#EAEAEC';
    // switch (region) {
    //   case 'LPL':
    //     fill = 'rgb(248, 206, 204)';
    //     stroke = 'rgb(184, 84, 80)';
    //     break;
    //   case 'LCK':
    //     fill = 'rgb(255, 230, 204)';
    //     stroke = 'rgb(215, 155, 0)';
    //     break;
    //   case 'LEC':
    //     fill = 'rgb(218, 232, 252)';
    //     stroke = 'rgb(108, 142, 191)';
    //     break;
    //   case 'LCS':
    //     fill = 'rgb(213, 232, 212)';
    //     stroke = 'rgb(130, 179, 102)';
    //     break;
    //   case 'CBLOL':
    //     fill = 'rgb(225, 213, 231)';
    //     stroke = 'rgb(150, 115, 166)';
    //     break;
    //   case 'PCS':
    //     fill = 'rgb(177, 221, 240)';
    //     stroke = 'rgb(16, 115, 158)';
    //     break;
    //   case 'LCO':
    //   case 'VCS':
    //   case 'LLA':
    //   case 'LJL':
    //   case 'TCL':
    //     fill = 'rgb(186, 200, 211)';
    //     stroke = 'rgb(35, 68, 93)';
    // }
    // if (isCloseToBoundary) {
    //   style.strokeWidth = Number(dataStyle.borderWidth) || 2;
    //   style.stroke = dataStyle.borderColor || '#ff7f0e';
    // } else {
    //   style.strokeWidth = Number(dataStyle.borderWidth) || 1;
    //   style.stroke = stroke;
    // }
    style.fill = fill;
    return style;
  }
  // getBackgroundFill(region) {
  //   // dataStyle.backgroundColor || this.defaultFill
  // }
  /**
   * 提供方法给插件在判断此节点被拖动边界事件节点靠近时调用，从而触发高亮
   */
  // setIsCloseToBoundary(flag) {
  //   this.setProperty('isCloseToBoundary', flag);
  // }
  // getAnchorStyle(anchorInfo) {
  //   const style = super.getAnchorStyle(anchorInfo);
  //   style.fill = 'transparent';
  //   style.stroke = 'transparent';
  //   style.hover.fill = 'transparent';
  //   style.hover.stroke = 'transparent';
  //   return style;
  // }
  /**
   * 重写定义锚点
   */
  // getDefaultAnchor() {
  //   const { x, y, id, width } = this;
  //   const anchors = [
  //     {
  //       x: x + width / 2,
  //       y: y,
  //       id: `${id}_right`,
  //       type: 'right',
  //     },
  //     {
  //       x: x - width / 2,
  //       y: y,
  //       id: `${id}_left`,
  //       type: 'left',
  //     },
  //   ];
  //   return anchors;
  // }
  // getOutlineStyle() {
  //   const style = super.getOutlineStyle() as any;
  //   style.stroke = 'transparent';
  //   style.hover.stroke = 'transparent';
  //   return style;
  // }
}
class FinishNodeView extends RectNode {
  getIcon() {
    // const { width, height, text } = this.props.model;
    // console.log(width, height, text, 'getIcon');
    return h('image', {
      width: 18,
      height: 18,
      x: -36,
      y: -8,
      // href: getIcon(text.value)
      href: finishNodeIcon,
    });
  }
  customMouseDown = ev => {
    const { model, graphModel } = this.props;
    graphModel.eventCenter.emit('custom-event:clone-node', model);
  };
  getShape() {
    const { text, x, y, width, height, radius } = this.props.model;
    const style = this.props.model.getNodeStyle();
    console.log(style, 'style');
    // console.log(text, x, y, width, height, radius, 'text, x, y, width, height, radius')
    return h(
      'g',
      {
        className: 'lf-Finish-node',
        onMouseDown: this.customMouseDown,
      },
      [
        h('rect', {
          ...style,
          fill: '#FFF0F0',
          stroke: '#FF4D4F',
          x: x - width / 2,
          y: y - height / 2,
          width,
          height,
          rx: radius,
          ry: radius,
          // nodeText: {
          //   color: 'FF4D4F',
          //   overflowMode: 'ellipsis',
          //   lineHeight: 1.2,
          //   fontSize: 14,
          // },
        }),
        h(
          'g',
          {
            style: 'pointer-events: none;',
            transform: `translate(${x}, ${y})`,
          },
          [
            h('rect', {
              x: -width / 4,
              y: -height / 4,
              width: width / 4,
              height: height / 2,
              // fill: '#000',
              fill: '#fff',
              fillOpacity: 0.05,
              stroke: 'none',
            }),
            this.getIcon(),
            h('path', {
              // d: `M ${30 - width / 2} ${1 - height / 2} l 0 28`,
              stroke: '#DDD',
              strokeOpacity: 0.1,
              strokeWidth: 1,
            }),
          ],
        ),
      ],
    );
  }
}

export default {
  type: 'finish-node',
  model: FinishNodeModel,
  view: FinishNodeView,
};
