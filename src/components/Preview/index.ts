import { withInstall } from '/@/utils';

export { default as ImagePreview } from './src/Preview.vue';
import filePreview from './src/FilePreview.vue';

export { createImgPreview } from './src/functional';
export const FilePreview = withInstall(filePreview);
