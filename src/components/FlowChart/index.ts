import { withInstall } from '/@/utils';
import flowChart from './src/FlowChart.vue';
import flowChartToolbar from './src/FlowChartToolbar.vue';
import customToorBar from './src/CustomToorBar.vue';

export const FlowChart = withInstall(flowChart);
export const FlowChartToolbar = withInstall(flowChartToolbar);
export const CustomToorBar = withInstall(customToorBar);
