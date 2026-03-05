import { defineStore } from 'pinia';

type MemberTypes = 'materia' | 'customer' | 'innerCode';
type ConfigType = 3 | 2 | 1;
// type MainType = 0 | 1;
interface State {
  mainProcess: string;
  configTypes: any;
  openGroup: number;
  curentMainType: any;
}
const ConfigTypes = {
  3: 'materia',
  2: 'customer',
  1: 'innerCode',
};

export const useMemberStore = defineStore({
  id: 'project-member',
  state: (): State => ({
    mainProcess: '1', //  主要制程
    // memberType: 'materia', // 成员类型
    configTypes: {
      '0': 3,
      '1': 3,
    },
    openGroup: 0,
    curentMainType: 0,
  }),
  getters: {
    configType(state) {
      const { curentMainType, configTypes } = state;
      const _k = curentMainType || 0;
      return configTypes[_k] || 3;
    },
    memberType() {
      return ConfigTypes[this.configType] || 'metaria';
    },
  },
  actions: {
    // 变更主要制程
    updateMainProcess(val: string) {
      this.mainProcess = val;
    },
    // 变更配置类型
    updateconfigType(val: ConfigType, mainType) {
      this.configTypes[mainType] = val;
      this.updateCurrentMainType(mainType);
    },
    // 打开弹窗
    openGroupModal() {
      this.openGroup++;
    },
    updateCurrentMainType(val) {
      this.curentMainType = val;
    },
  },
});
