import { defineStore } from 'pinia';

interface TechnologyForm {
  numberOfKnives: number;
  process: string;
  processCode: string;
  adjustmentMetres: number;
  technologyList: Array<{
    stepDistance: string;
    modulus: string;
  }>;
}

interface PCCState {
  technologyForm: TechnologyForm;
}

export const usePCCStore = defineStore('PCC', {
  state: (): PCCState => ({
    technologyForm: {
      numberOfKnives: 0,
      process: '',
      processCode: '',
      adjustmentMetres: 0,
      technologyList: [
        {
          stepDistance: '',
          modulus: '',
        },
      ],
    },
  }),
  getters: {
    getTechnologyForm: (state): TechnologyForm => state.technologyForm,
    getNumberOfKnives: (state): number => state.technologyForm.numberOfKnives,
    getProcess: (state): string => state.technologyForm.process,
    getProcessCode: (state): string => state.technologyForm.processCode,
    getAdjustmentMetres: (state): number => state.technologyForm.adjustmentMetres,
    getTechnologyList: (state): Array<{ stepDistance: string; modulus: string }> => state.technologyForm.technologyList,
  },
  actions: {
    setTechnologyForm(technologyForm: TechnologyForm): void {
      this.technologyForm = technologyForm;
    },

    // Optional: Individual setters for better granular control
    setNumberOfKnives(value: number): void {
      this.technologyForm.numberOfKnives = value;
    },
    setProcess(value: string): void {
      this.technologyForm.process = value;
    },
    setProcessCode(value: string): void {
      this.technologyForm.processCode = value;
    },
    setAdjustmentMetres(value: number): void {
      this.technologyForm.adjustmentMetres = value;
    },
    setTechnologyList(technologyList: Array<{ stepDistance: string; modulus: string }>): void {
      this.technologyForm.technologyList = technologyList;
    },
  },
});
