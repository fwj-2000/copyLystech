/**
 * Package file volume analysis
 */
import type { PluginOption } from 'vite';
import { visualizer } from 'rollup-plugin-visualizer';
import { isReportMode } from '../../utils';

export function configVisualizerConfig(): PluginOption[] {
  if (!isReportMode()) {
    return [];
  }

  return [
    visualizer({
      filename: './node_modules/.cache/visualizer/stats.html',
      open: true,
      gzipSize: true,
      brotliSize: true,
    }) as unknown as PluginOption,
  ];
}
