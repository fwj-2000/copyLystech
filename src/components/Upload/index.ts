import { withInstall } from '/@/utils';
import basicUpload from './src/BasicUpload.vue';
import uploadImage from './src/components/ImageUpload.vue';
import preview from './src/components/Preview.vue';
import uploadModal from './src/UploadFileModal.vue';
import fileListModal from './src/FileListVxe.vue';
import uploadBtn from './src/components/UploadBtn.vue';
import fileCell from './src/components/FileCell.vue';

export const ImageUpload = withInstall(uploadImage);
export const BasicUpload = withInstall(basicUpload);
export const PreviewModal = withInstall(preview);
export const UploadModal = withInstall(uploadModal);
export const FileListModal = withInstall(fileListModal);
export const UploadBtn = withInstall(uploadBtn);
export const FileCell = withInstall(fileCell);
