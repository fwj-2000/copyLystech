import { withInstall } from '/@/utils';
import type { ExtractPropTypes } from 'vue';
import SearchFormCompo from './index.vue';
import { searchFormProps } from './props';

export declare type SearchFrom = Partial<ExtractPropTypes<typeof searchFormProps>>;

export const SearchForm = withInstall(SearchFormCompo);