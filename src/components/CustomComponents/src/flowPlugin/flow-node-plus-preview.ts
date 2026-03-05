import { RectNode, RectNodeModel, h } from '@logicflow/core';
import processNodeIcon from './icons/process_node_icon.svg';
import { useI18n } from '/@/hooks/web/useI18n';
import { useBaseStore } from '/@/store/modules/base';
const baseStore = useBaseStore();
const { t } = useI18n();
// 条件选项
const CONDITION_OPTIONS = [
  { id: 1, fullName: t('status.yes') },
  { id: 0, fullName: t('status.no') },
];
let liuZhuan: any = baseStore.getDictionaryData('uploadTimeNode');
// 工序类型颜色
const TYPEDESC_COLOR_MAP = {
  维修: '#3CC2C9',
  报工: '#477CFE',
  投料: '#FF7B00',
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
    this.text.x = this.x;
    this.text.y = this.y + 20;
    // 内容文字位置
    this.content = data.content || ''; // 内容
    // this.contentPosition = {
    //   x: this.x,
    //   y: this.y + this.titleHeight / 2 + this.splitLineHeight / 2,
    // };
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
    const { x, y, width, height, radius, titleHeight, splitLineHeight, titleFill, splitLineFill, defaultFill, properties } = model;

    const _titleFill = TYPEDESC_COLOR_MAP[properties.processTypeDesc] || titleFill;

    // ==== 动态内容处理 ====
    const contentFields = [
      { label: '标准工时', key: 'standardWorkeHours', type: 'num' },
      { label: '标准良率', key: 'standardYieldRate', type: 'num' },
      { label: 'UPH', key: 'uph', type: 'num' },
      { label: '是否需要打印标签', key: 'isPrintLabel', type: 'select' },
      { label: '是否需要转出', key: 'isNeedCirculation', type: 'select' },
      { label: '是否需要查询PCC', key: 'isReadPcc', type: 'select' },
      { label: '是否投料', key: 'isFeedMaterials', type: 'select' },
      { label: '是否送检', key: 'isTransport', type: 'select' },
      { label: '是否需要胶水', key: 'isNeedGlue', type: 'select' },
      { label: '胶水使用有效期', key: 'glueUseTime', type: 'num' },
      { label: '是否需要上传程序代码', key: 'isUploadProgramCode', type: 'select' },
      { label: '上传程序代码时间', key: 'uploadProgramCodeTime', type: 'num' }, //需要查p
      { label: '是否上传程序工艺', key: 'isUploadProgramProcess', type: 'select' },
      { label: '上传程序工艺时间', key: 'isUploadProgramProcessTime', type: 'num' },
      { label: '是否需要接收物料', key: 'isReceive', type: 'select' },
    ];

    const lineHeight = 20;
    const padding = 10;

    const displayFields = contentFields.filter(item => {
      let isNeedGlue = !properties['isNeedGlue'] || properties['isNeedGlue'] === 0;
      let isUploadProgramCode = !properties['isUploadProgramCode'] || properties['isUploadProgramCode'] === 0;
      let isUploadProgramProcess = !properties['isUploadProgramProcess'] || properties['isUploadProgramProcess'] === 0;
      if (isNeedGlue && item.key === 'glueUseTime') {
        return false;
      }
      if (isUploadProgramCode && item.key === 'uploadProgramCodeTime') {
        return false;
      }
      if (isUploadProgramProcess && item.key === 'isUploadProgramProcessTime') {
        return false;
      }
      return properties[item.key] !== null && properties[item.key] !== undefined && properties[item.key] !== '';
    });
    const contentBoxHeight = displayFields.length * lineHeight + padding * 2;

    // ⚡ 关键：更新节点高度（标题 + 分割线 + 内容 + padding）
    const newHeight = titleHeight + splitLineHeight + contentBoxHeight + 60;
    if (model.height !== newHeight) {
      // 记录原先的顶部位置
      const oldTop = model.y - model.height / 2;
      // 更新高度
      model.height = newHeight;
      // 修正 y，保证顶部不变
      model.y = oldTop + newHeight / 2;
    }

    // ==== 渲染 ====

    const titleRect = h('rect', {
      x: x - width / 2,
      y: y - model.height / 2,
      width,
      height: titleHeight,
      fill: _titleFill,
    });

    const splitLine = h('rect', {
      x: x - width / 2,
      y: y - model.height / 2 + titleHeight,
      width,
      height: splitLineHeight,
      fill: splitLineFill,
    });

    const contentRect = h('rect', {
      x: x - width / 2,
      y: y - model.height / 2 + titleHeight + splitLineHeight,
      width,
      height: model.height - titleHeight - splitLineHeight,
      rx: radius,
      ry: radius,
      fill: defaultFill,
    });

    const titleText = h(
      'text',
      {
        ...model.getTitleStyle(),
        x,
        y: y - model.height / 2 + titleHeight / 2 + 5,
        textAnchor: 'middle',
        dominantBaseline: 'middle',
      },
      properties.processTypeDesc,
    );
    let contentBox: any = null;
    if (displayFields.length > 0) {
      contentBox = h('rect', {
        x: x - width / 2 + 10,
        y: y - model.height / 2 + titleHeight + splitLineHeight + 40,
        width: width - 20,
        height: contentBoxHeight,
        rx: radius,
        ry: radius,
        fill: '#f5f5f5',
        // stroke: '#ccc',
      });
    }
    const contentTexts = displayFields.map((item, index) => {
      let arr = ['uploadProgramCodeTime', 'isUploadProgramProcessTime'];
      let text = '';
      if (item.type === 'select') {
        if (arr.includes(item.key)) {
          text = liuZhuan.find(val => val.enCode === properties[item.key])?.fullName || '';
        } else {
          text = CONDITION_OPTIONS.find(val => val.id === properties[item.key])?.fullName || '';
        }
      } else {
        text = properties[item.key];
      }
      return h(
        'text',
        {
          ...model.getContentStyle(),
          x: x - width / 2 + 20,
          y: y - model.height / 2 + titleHeight + splitLineHeight + padding + (index + 1) * lineHeight + 30,
          textAnchor: 'start',
          dominantBaseline: 'middle',
          fontSize: 10,
        },
        `${item.label}：${text}`,
      );
    });

    return h(
      'g',
      {
        className: 'lf-flow-node',
        onMouseDown: this.customMouseDown,
      },
      [titleRect, splitLine, contentRect, titleText, contentBox, ...contentTexts],
    );
  }
}

export default {
  type: 'flow-node-preview',
  model: FlowNodeModel,
  view: FlowNodeView,
};
