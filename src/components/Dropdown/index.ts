import { withInstall } from '/@/utils';
import dropdown from './src/Dropdown.vue';
import subdropdown from './src/SubDropdown.vue';

export * from './src/typing';
export const Dropdown = withInstall(dropdown);
export const SubDropdown = withInstall(subdropdown);
