import FlowNode from './flow-node';
import StartNode from './start-node';
import FinishNode from './finish-node';
import BetterLine from './better-line';
import type { LogicFlow } from '@logicflow/core';
import FlowNodePlus from './flow-node-plus';
import FlowNodePlusPreview from './flow-node-plus-preview';
import editableNode from './editable-node';
class flowPlugin {
  static pluginName = 'flow';
  lf: LogicFlow;
  constructor({ lf }) {
    this.lf = lf;
    this.lf.register(FlowNodePlus);
    this.lf.register(FlowNodePlusPreview);
    this.lf.register(editableNode);
    // this.lf.register(FlowNode);
    this.lf.register(StartNode);
    this.lf.register(FinishNode);
    this.lf.register(BetterLine);
  }
}
export { flowPlugin, FlowNode };
