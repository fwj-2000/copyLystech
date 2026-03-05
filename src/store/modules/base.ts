import { defineStore } from 'pinia';
import { getDictionaryAll } from '/@/api/systemData/dictionary';
import { i18n } from '/@/locales/setupI18n';
export interface DicChildItem {
  isTree?: number;
  id: string;
  enCode: string | number;
  fullName: string;
}
export interface DicItem extends DicChildItem {
  dictionaryList: DicChildItem[];
}
interface BaseState {
  dictionaryList: DicItem[];
  /** 字典数据是否正在加载中 */
  loadingDict: boolean;
  /** 字典数据加载完成后的回调函数列表 */
  dictCallbacks: Array<(data: DicItem[]) => void>;
}

export const useBaseStore = defineStore({
  id: 'app-base',
  state: (): BaseState => ({
    dictionaryList: [],
    loadingDict: false,
    dictCallbacks: [],
  }),
  getters: {
    getDicList(): DicItem[] {
      return this.dictionaryList;
    },
  },
  actions: {
    resetState() {
      this.dictionaryList = [];
      this.loadingDict = false;
      this.dictCallbacks = [];
    },
    setDictionaryList(list: DicItem[] = []) {
      this.dictionaryList = list;
    },
    async getDictionaryAll(): Promise<DicItem[]> {
      try {
        if (this.dictionaryList.length) {
          return this.dictionaryList;
        } else {
          /**
           * 检查是否已有字典数据请求正在进行中
           * 这是并发请求合并的核心逻辑，确保同时发起的多个请求只执行一次API调用
           */
          if (this.loadingDict) {
            // 如果已有请求在处理中，将当前请求的resolve函数加入回调队列
            // 这样可以确保所有并发请求都能获取到相同的数据结果
            return new Promise(resolve => {
              this.dictCallbacks.push(resolve);
            });
          }
          // 标记请求开始，防止重复请求
          this.loadingDict = true;

          return getDictionaryAll()
            .then(res => {
              const list = Array.isArray(res?.data?.list) ? res.data.list : [];
              // 先执行所有等待的回调函数，确保回调获取的是最新数据
              this.dictCallbacks.forEach(callback => callback(list));
              // 然后更新缓存的字典数据
              this.dictionaryList = list;
              // 将处理后的数据返回给调用者
              return list;
            })
            .finally(() => {
              // 无论请求成功或失败，都在finally块中重置请求状态
              // 这是确保应用不会陷入请求锁定状态的关键
              this.loadingDict = false;
              this.dictCallbacks = [];
            });
        }
      } catch (error) {
        return [];
      }
    },
    async getDictionaryData(encode: string, codeToNum: boolean = false, t: boolean = true, id: string = ''): Promise<DicChildItem[] | DicChildItem> {
      try {
        let list: DicItem[] = [],
          data: Partial<DicItem> = {},
          json: DicChildItem[] | DicChildItem = [];
        if (!this.dictionaryList.length) {
          list = await this.getDictionaryAll();
        } else {
          list = this.dictionaryList;
        }
        if (encode) {
          let arr = list.filter(o => o.enCode === encode);
          if (!arr.length) return [];
          data = arr[0];
          if (!id) {
            json = data.dictionaryList as DicChildItem[];

            json.map(o => {
              // console.log(`dict.${encode}.${o.enCode}`,i18n.global.t(`dict.${encode}.${o.enCode}`));
              if (t) {
                const key = `dict.${encode}.${o.enCode}`;
                const translated = i18n.global.t(key);
                o.fullName = translated !== key ? translated : o.fullName;
              }
              if (codeToNum) o.enCode = Number(o.enCode);
              return o;
            });
          } else {
            let rowData: DicChildItem[] = [];
            if (!data.isTree) {
              rowData = (data.dictionaryList as DicChildItem[]).filter(o => o.id === id);
            } else {
              function findData(list) {
                for (let i = 0; i < list.length; i++) {
                  const e = list[i];
                  if (e.id === id) {
                    rowData[0] = e;
                    break;
                  }
                  if (e.children && e.children.length) {
                    findData(e.children);
                  }
                }
              }
              findData(data.dictionaryList);
            }
            if (rowData.length) {
              json = rowData[0];
            } else {
              json = {
                id: '',
                fullName: '',
                enCode: '',
              };
            }
          }
          return json;
        }
        return json;
      } catch (error) {
        return [];
      }
    },
    async getDicDataSelector(value: string, key: string = 'id'): Promise<DicChildItem[]> {
      try {
        let list: DicItem[] = [],
          data: Partial<DicItem> = {},
          json: DicChildItem[] = [];
        if (!this.dictionaryList.length) {
          list = await this.getDictionaryAll();
        } else {
          list = this.dictionaryList;
        }
        if (!value) return [];
        let arr = list.filter(o => {
          return o[key] === value;
        });
        if (!arr.length) return [];
        data = arr[0];
        json = data.dictionaryList as DicChildItem[];
        return json;
      } catch (error) {
        return [];
      }
    },
  },
});
