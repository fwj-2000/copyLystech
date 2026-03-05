import { VxeGridInstance } from 'vxe-table';
import { ICacheInfo } from './types';
import SearchFormApi from '/@/views/dataAnalysis/components/BaseSearchForm/api';

interface IMountParams {
  searchFormApi: SearchFormApi;
  cacheInfo: ICacheInfo;
  forceUpdate: () => void;
  getGridInstance: () => VxeGridInstance | null;
}
class Api {
  public searchFormApi = {} as SearchFormApi;
  public cacheInfo = {} as ICacheInfo;
  public getGridInstance;
  public forceUpdate;

  mount({ searchFormApi, cacheInfo, forceUpdate, getGridInstance }: IMountParams) {
    this.searchFormApi = searchFormApi;
    this.cacheInfo = cacheInfo;
    this.getGridInstance = getGridInstance;
    this.forceUpdate = forceUpdate;
  }

  getCacheInfo = () => {
    return this.cacheInfo;
  };
}

export default Api;
