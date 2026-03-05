import { CurvedEdge, CurvedEdgeModel } from '@logicflow/extension';

class BetterLineModel extends CurvedEdgeModel {
  setAttributes() {
    super.setAttributes();
    this.text.editable = false; // 关闭文字编辑
  }
  getEdgeStyle() {
    const style = super.getEdgeStyle();
    const { properties } = this;
    if (properties.stroke && properties.resultType == 'NG') {
      style.stroke = properties.stroke;
    } else {
      style.stroke = '#B3BBC7';
    }
    return style;
  }

  getTextStyle() {
    const style = super.getTextStyle();
    const { properties } = this;
    // 根据条件同步文本颜色
    if (properties.stroke && properties.resultType === 'NG') {
      style.color = '#FF4D4F'; // 文本颜色与边颜色同步
    } else {
      style.color = '#1d1d1d'; // 默认文本颜色
    }
    // 可选：设置文本背景色
    // style.background = { fill: 'transparent' };
    style.background = {
      fill: 'white', // 增加白色背景
      padding: [2, 4], // 背景填充
      radius: 3, // 圆角
    };

    // 可选：设置字体大小
    style.fontSize = 14;
    return style;
  }
}

class BetterLine extends CurvedEdge {}

export default {
  type: 'better-line',
  view: BetterLine,
  model: BetterLineModel,
};
