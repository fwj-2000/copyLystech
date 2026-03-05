<script setup lang="ts">
  import { nextTick, reactive, toRefs, toRaw } from 'vue';
  import { Subtitle } from '/@/components/Subtitle';
  import { BasicForm, FormSchema, useForm } from '/@/components/Form';
  import { ScrollContainer } from '/@/components/Container';
  import { getFactorySap, getListProjectClass, getProductType, getProjectClass } from '/@/api/engineering/pcc';
  import { getFactoryList } from '/@/api/business/shippingspace';
  import { getSapFactoryList, getWorkCenterListSelect } from '/@/api/purchase/supplierInformation';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useBaseStore } from '/@/store/modules/base';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { usePCCStore } from '../store';
  import { PlusOutlined, DeleteOutlined } from '@ant-design/icons-vue';
  import { getProcessParaList } from '/@/api/engineering/quotatios';
  import { cloneDeep, isEmpty } from 'lodash-es';
  import { isBoolean, isExist, isNullOrUnDef } from '/@/utils/is';
  import { useVbenForm } from '/@/adapter/form';
  import { normalizeSapFactoryValue } from '/@/views/engineering/PCCBeta/components/utils/normalizeSapFactoryValue';

  const baseStore = useBaseStore();

  const { t } = useI18n();
  const { createMessage } = useMessage();

  const { currentData } = defineProps({
    currentData: {
      type: Object,
      default: {},
    },
  });

  const technologyItem = {
    stepDistance: '',
    modulus: '',
  };

  const PCCStore = usePCCStore();

  const emit = defineEmits(['clearCustomerFile', 'getVersion', 'setBomType', 'materialSetState', 'setFlowUnit', 'calcDowntimeOneHour', 'calcMaterialUseQty']);

  // stepDistance

  const state = reactive({
    chooseNewPartNumType: true,
    mode: 'edit',
    toBeGenerateList: [],
    moldGenerate: '',
    technologyList: [
      {
        stepDistance: '',
        modulus: '',
      },
    ],
    disabled: false,
  });

  const { mode, chooseNewPartNumType, toBeGenerateList, moldGenerate, technologyList } = toRefs(state);

  const [
    BaseInfoForm,
    {
      getValues: baseInfoGetValues,
      setValues: baseInfoSetValuesCallBack,
      resetForm: baseFormResetForm,
      updateSchema: updateBaseInfoSchema,
      setState: updateState,
    },
  ] = useVbenForm({
    wrapperClass: 'grid-cols-24 gap-y-5px gap-x-15px',
    commonConfig: {
      colon: false,
      formItemClass: 'col-span-12',
      labelClass: 'w-full justify-start leading-4.2 pd-3px',
      componentProps: {
        class: 'w-full',
      },
    },
    layout: 'vertical',
    schema: getBaseInfoFormSchema(),
    showDefaultActions: false,

    i18nConfig: {
      moduleCode: 'PCCColumn',
      transferRange: ['label', 'placeholder'],
      excludeFields: [''],
    },
  });

  async function baseInfoSetValues(params) {
    // debugger
    // if(params.workCenter) debugger
    baseInfoSetValuesCallBack(params);
    const shouldUpdateSchemas = [];
    await nextTick();
    if (isExist(params.productTypeName && params.productType)) {
      shouldUpdateSchemas.push({
        fieldName: 'productType',
        componentProps: {
          defaultLabel: params.productTypeName,
          value: params.productType,
        },
      });
      // updateBaseInfoSchema([
      //   {
      //     fieldName: 'productType',
      //     componentProps: {
      //       defaultLabel: params.productTypeName,
      //     },
      //   },
      // ]);
    }
    if (isExist(params.workCenterName && params.workCenter)) {
      shouldUpdateSchemas.push({
        fieldName: 'workCenter',
        componentProps: {
          defaultLabel: params.workCenterName,
          value: params.workCenter,
        },
      });
      // updateBaseInfoSchema([
      //   {
      //     fieldName: 'workCenter',
      //     componentProps: {
      //       defaultLabel: params.workCenterName,
      //     },
      //   },
      // ]);
    }

    // debugger
    await nextTick();

    if (!isEmpty(shouldUpdateSchemas)) {
      updateBaseInfoSchema(shouldUpdateSchemas);
    }
  }

  const getBaseInfoFieldsValue = baseInfoGetValues;

  const setBaseInfoFieldsValue = baseInfoSetValues;

  const getProdInfoFieldsValue = baseInfoGetValues;

  const setProdInfoFieldsValue = baseInfoSetValues;

  const resetBaseInfoFields = baseFormResetForm;

  const resetProdInfoFields = baseFormResetForm;

  const setBaseInfoProps = updateState;

  const setProdInfoProps = updateState;

  const [
    registerTechnologyForm,
    {
      setFieldsValue: setTechnologyFieldsValue,
      validateFields: validateTechnologyFields,
      resetFields: resetTechnologyFields,
      updateSchema: updateTechnologySchema,
      getFieldsValue: getTechnologyFieldsValue,
      setProps: setTechnologyProps,
    },
  ] = useForm({
    schemas: getTechnologyFormSchema(),
    labelWidth: 220,
    layout: 'vertical',
    baseColProps: {
      span: 24,
    },
    i18nConfig: {
      moduleCode: 'PCCColumn',
      transferRange: ['placeholder', 'label'],
    },
  });

  function initBaseInfoFieldsValue(data) {
    setBaseInfoFieldsValue(data);
    if (data.productType) {
      updateBaseInfoSchema([
        {
          fieldName: 'productType',
          componentProps: {
            defaultLabel: data.productTypeName,
          },
        },
      ]);
    }
  }

  function getBaseInfoFormSchema() {
    return [
      {
        fieldName: 'insidePartNumber',
        label: '内部料号',
        component: 'Input',
        componentProps: {
          placeholder: '内部料号',
          disabled: true,
        },
      },
      {
        fieldName: 'factory',
        label: '生产工厂',
        className: 'form-required',
        component: 'ApiSelect',
        componentProps: {
          api: getFactoryList,
          apiSearch: {
            show: true,
            searchName: 'factoryCode',
          },
          resultField: 'data',
          labelField: 'Name',
          valueField: 'Code',
          nameFormat: ['Name', '(', 'Code', ')'],
          showSearch: true,
          immediate: true,
          filterOption: false,
          notFoundContent: null,
          disabled: true,
          onChange: async factoryCode => {
            const { businessType: materialType, isBonded } = await getProdInfoFieldsValue();
            // 产品类型的联动调整：由【工厂】【业务类型】带出，也因其改动一起清除
            setBaseInfoFieldsValue({
              productType: null,
              projectClass: null,
              businessType: null,
            });
            // 过去SAP工厂
            getFactorySap({
              isBonded,
              materialType,
              factoryCode,
            }).then(({ code, data }) => {
              if (code == 200) {
                if (isExist(data) && !isEmpty(data)) {
                  setBaseInfoFieldsValue({
                    sapFactory: `${data?.Name}(${data?.Code})`,
                  });
                } else {
                  setBaseInfoFieldsValue({
                    sapFactory: null,
                  });
                }
              }
            });
          },
        },
      },
      {
        fieldName: 'insidePartNumberOld',
        label: '旧版成品编码',
        component: 'Input',
        componentProps: {
          placeholder: '旧版成品编码',
          disabled: true,
        },
      },
      {
        fieldName: 'businessType',
        label: '业务类型',
        component: 'ApiSelect',
        className: 'form-required',
        componentProps: {
          placeholder: '业务类型',
          api: () => baseStore.getDictionaryData('SapFactoryMaterial', true),
          labelField: 'fullName',
          valueField: 'enCode',
          onChange: async materialType => {
            const { factory: factoryCode, isBonded } = await getProdInfoFieldsValue();
            // 产品类型的联动调整：由【工厂】【业务类型】带出，也因其改动一起清除
            setBaseInfoFieldsValue({
              productType: null,
              projectClass: null,
            });
            const { code, data } = await getFactorySap({
              isBonded,
              materialType,
              factoryCode,
            });
            if (code === 200) {
              if (isExist(data) && !isEmpty(data)) {
                setBaseInfoFieldsValue({
                  sapFactory: `${data?.Name}(${data?.Code})`,
                });
              } else {
                setBaseInfoFieldsValue({
                  sapFactory: null,
                });
              }
            }
          },
        },
      },
      {
        fieldName: 'productDesc',
        label: '产品描述',
        component: 'Textarea',
        componentProps: {
          placeholder: '产品描述',
          autoSize: {
            minRows: 1,
            maxRows: 5,
          },
          disabled: true,
        },
      },
      {
        fieldName: 'isBonded',
        label: '是否保税',
        component: 'Select',
        className: 'form-required',
        defaultValue: 'false',
        componentProps: {
          placeholder: t('common.bonded'),
          options: [
            {
              fullName: t('common.yes'),
              enCode: 'true',
            },
            {
              fullName: t('common.no'),
              enCode: 'false',
            },
          ],
          fieldNames: {
            label: 'fullName',
            value: 'enCode',
          },
          onChange: async isBonded => {
            const { businessType: materialType, factory: factoryCode } = await getProdInfoFieldsValue();
            const { code, data } = await getFactorySap({
              isBonded,
              materialType,
              factoryCode,
            });
            if (code == 200) {
              setBaseInfoFieldsValue({
                sapFactory: `${data?.Name}(${data?.Code})`,
              });
            }
          },
        },
      },
      {
        fieldName: 'bomType',
        label: 'BOM类型',
        component: 'ApiSelect',
        className: 'form-required',

        componentProps: {
          dynamicDisabled: () => {
            if (state.disabled) return true;
            return (
              currentData?.demandType == 'BusinessSamples' || currentData?.demandType == 'EngineeringSamples' || currentData?.currentNode == 'LeaderReview'
            );
          },
          placeholder: 'BOM类型',
          api: () => baseStore.getDictionaryData('PCC.BomType', true),
          onChange: handleBOMChange,
          labelField: 'fullName',
          valueField: 'enCode',
          immediate: true,
        },
      },
      {
        fieldName: 'productType',
        label: '产品类型',
        component: 'ApiSelect',
        className: 'form-required',
        componentProps: {
          placeholder: '产品类型',
          api: getProductType,
          apiSearch: {
            show: true,
            searchName: 'ProductCategory',
          },
          beforeFetch: async params => {
            // 产品类型的联动调整：由【工厂】【业务类型】带出
            const { factory, businessType } = await getProdInfoFieldsValue();
            if (factory) {
              params.factory = factory;
            }
            if (businessType) {
              params.businessType = businessType;
            }
            params.isPCC = true;
            return params;
          },
          resultField: 'data',
          labelField: 'productCategory',
          valueField: 'id',
          showSearch: true,
          immediate: true,
          alwaysLoad: true,
          filterOption: false,
          notFoundContent: null,
          onChange: (_value: string, option: { ProjectClass?: string }) => {
            if (!_value) {
              setBaseInfoFieldsValue({
                projectClass: null,
              });
            }
            // setBaseInfoFieldsValue({ projectClass: option.ProjectClass || '' });
          },
        },
      },

      {
        fieldName: 'version',
        label: '文件版本',
        component: 'Input',
        componentProps: { customPlaceholder: '0', disabled: true, prefix: 'T' },
        dynamicDisabled: true,
      },
      {
        fieldName: 'projectClass',
        label: '项目分类',
        component: 'ApiSelect',
        // className: 'form-required',
        componentProps: {
          placeholder: '项目分类',
          api: async () => {
            const { productType } = await getProdInfoFieldsValue();
            if (productType) {
              return getListProjectClass;
            } else {
              return null;
            }
          },
          apiSearch: {
            show: true,
            searchName: 'projectClass',
          },
          beforeFetch: async params => {
            // 产品类型的联动调整：由【工厂】【业务类型】带出
            const { productType } = await getProdInfoFieldsValue();
            if (productType) {
              params.id = productType;
            }
            return params;
          },
          resultField: 'data',
          labelField: 'projectClass',
          valueField: 'projectClass',
          showSearch: true,
          immediate: true,
          alwaysLoad: true,
          filterOption: false,
          notFoundContent: null,
          // onChange: (_value: string, option: { ProjectClass?: string }) => {
          // 给项目分类赋值
          // setBaseInfoFieldsValue({ projectClass: option.ProjectClass || '' });
          // },
        },
      },
      {
        fieldName: 'docNumber',
        label: '文件编号',
        component: 'Input',
        componentProps: {
          placeholder: '',
          disabled: true,
        },
      },
      {
        fieldName: 'projectPhase',
        label: '项目阶段',
        component: 'Input',
      },
      {
        fieldName: 'applyCode',
        label: '系统编号',
        dynamicDisabled: true,
        component: 'Input',
        componentProps: {
          disabled: true,
          placeholder: '系统生成',
        },
      },
      {
        fieldName: 'productSize',
        label: '产品尺寸',
        component: 'Input',
        componentProps: {
          placeholder: '产品尺寸',
        },
      },
      {
        fieldName: 'effectiveDate',
        label: '生效日期',
        component: 'DatePicker',
        componentProps: {
          placeholder: '生效日期',
          disabled: true,
        },
      },
      {
        fieldName: 'mainMaterialUseSize',
        label: '主材使用尺寸',
        component: 'Input',
        componentProps: {
          placeholder: '主材使用尺寸',
        },
      },
      {
        fieldName: 'creatorUserName',
        label: '制作人',
        component: 'CustomUserSelect',
        className: 'form-required',
        formItemClass: 'col-span-12',
        componentProps: {
          placeholder: '制作人',
          allowClear: true,
          showSearch: true,
        },
      },
      {
        fieldName: 'sapFactory',
        label: 'SAP工厂代码',
        component: 'Input',
        className: 'form-required',
        componentProps: {
          disabled: true,
        },
      },
      // {
      //   fieldName: 'sapFactory',
      //   label: 'SAP工厂代码',
      //   component: 'ApiSelect',
      //   className: 'form-required',
      //   componentProps: {
      //     // disabled: true,
      //     api: getSapFactoryList,
      //     apiSearch: {
      //       show: true,
      //       searchName: 'keyword',
      //     },
      //     beforeFetch: async params => {
      //       const { factory } = await getProdInfoFieldsValue();
      //       if (factory) {
      //         params.factoryCode = factory;
      //       }
      //       return params;
      //     },
      //     alwaysLoad: true,
      //     resultField: 'data',
      //     valueField: 'code',
      //     nameFormat: ['name', '(', 'code', ')'],
      //     showSearch: true,
      //     immediate: true,
      //     filterOption: false,
      //     notFoundContent: null,
      //   },
      // },
      // 项目分类，其值由`产品类型`联动带出赋值
      {
        fieldName: 'handlerId',
        label: '审批人',
        className: 'form-required',
        component: 'CustomUserSelect',
        formItemClass: 'col-span-12',
        componentProps: {
          placeholder: '审批人',
        },
      },
      {
        fieldName: 'workCenter',
        label: '工作中心',
        component: 'ApiSelect',
        className: 'form-required',
        formItemClass: 'col-span-12',
        componentProps: {
          api: async params => {
            await nextTick();
            const { sapFactory, businessType, isBonded } = await getProdInfoFieldsValue();
            if (isNullOrUnDef(sapFactory)) return null;
            if (isNullOrUnDef(businessType)) return null;
            if (isNullOrUnDef(isBonded)) return null;
            return getWorkCenterListSelect(params);
          },
          apiSearch: {
            show: true,
            searchName: 'keyword',
          },
          beforeFetch: async params => {
            const { sapFactory, factory } = await getProdInfoFieldsValue();
            if (sapFactory) {
              params.sapCode = normalizeSapFactoryValue(sapFactory);
            }
            if (factory) {
              params.factory = factory;
            }
          },
          alwaysLoad: true,
          nameFormat: ['code', '(', 'name', ')'],
          resultField: 'data',
          labelField: 'name',
          valueField: 'code',
          showSearch: true,
          immediate: true,
          filterOption: false,
          notFoundContent: null,
        },
      },
      {
        fieldName: '',
        i18nField: '',
      },
      {
        fieldName: 'workshopEnv',
        label: '车间环境',
        defaultValue: '1',
        component: 'ApiSelect',
        className: 'form-required',
        componentProps: {
          api: () => {
            return baseStore.getDictionaryData('PCC.WorkshopEnv');
          },
          labelField: 'fullName',
          valueField: 'enCode',
        },
      },
      {
        fieldName: 'remark',
        label: '特殊备注',
        component: 'Editor',
        formItemClass: 'col-span-24',
        componentProps: {
          editorHeight: '130px',
          mode: 'simple',
          toolbarConfig: {
            toolbarKeys: ['bold', 'color', 'bulletedList', 'numberedList'],
          },
        },
      },
    ];
  }

  function getTechnologyFormSchema() {
    return [
      {
        fieldName: 'difficultyLevel',
        label: '难度等级',
        // defaultValue: '1',
        component: 'ApiSelect',
        componentProps: {
          api: () => baseStore.getDictionaryData('difficultyLevel'),
          labelField: 'fullName',
          valueField: 'enCode',
        },
      },
      {
        field: 'numberOfKnives',
        label: '模切刀数',
        component: 'InputNumber',
        className: 'form-required',
        componentProps: {
          placeholder: '模切刀数',
          onChange: numberOfKnives => {
            const { process } = getTechnologyFieldsValue();
            calcNumberOfKnives(numberOfKnives, process);
          },
        },
      },
      {
        field: 'process',
        label: '生产工艺',
        component: 'ApiSelect',
        className: 'form-required',
        componentProps: {
          placeholder: '生产工艺',
          api: () => {
            return baseStore.getDictionaryData('PCC.ProcessType', true);
          },
          labelField: 'fullName',
          valueField: 'enCode',
          onChange: async process => {
            PCCStore.setProcess(process);
            const { numberOfKnives } = getTechnologyFieldsValue();
            calcNumberOfKnives(numberOfKnives, process);
            /**
             * 如果生产工艺是平板 速度单位: 冲次/min
             * 如果是圆刀、激光，则是m/min
             */
            // SPM/min
            // M/D
            if (process == 1) {
              emit('setFlowUnit', 'SPM/min', '冲次/分钟');
            } else {
              emit('setFlowUnit', 'M/D', '米/分钟');
            }
            await nextTick();
            emit('calcDowntimeOneHour');
            // const list = getTechnologyDataSource();
            // if (process == 1) {
            // 	// 平板
            // 	list.forEach(item => {
            // 		const { editValueRefs, processCode } = item;
            // 		if (!processCode) return;
            // 		if (processCode.startsWith('2') || processCode.startsWith('3')) editValueRefs.speedUnit = 'K/H';
            //
            // 	});
            // } else if (process == 2) {
            // 	// 圆刀
            // } else {
            // 	// 其他
            // }
          },
        },
      },
      {
        field: 'processCode',
        label: '工艺代码',
        component: 'Input',
        componentProps: {
          placeholder: '工艺代码',
          onChange: e => {
            PCCStore.setProcessCode(e);
          },
        },
      },
      {
        field: 'adjustmentMetres',
        label: '调机米数',
        component: 'InputNumber',
        componentProps: {
          placeholder: t('common.autoCarry'),
          onChange: e => {
            PCCStore.setAdjustmentMetres(e);
          },
        },
        // colProps: {
        //   span: 16,
        // },
      },

      {
        field: 'standardManpower',
        label: '标准人力',
        defaultValue: 1,
        component: 'InputNumber',
        dynamicDisabled: true,
      },
      {
        field: 'mainOperatorSkills',
        label: '主机手技能',
        component: 'ApiSelect',
        className: 'form-required',
        componentProps: {
          api: () => baseStore.getDictionaryData('SkillLevel', true),
          labelField: 'fullName',
          valueField: 'enCode',
          showSearch: true,
          filterOption: (value, option) => {
            return option.label.includes(value);
          },
        },
      },
      {
        field: 'mainOperatorNumber',
        label: '主机手人数',
        component: 'InputNumber',
        className: 'form-required',
        componentProps: {
          min: 0,
          step: 1,
          precision: 0,
          onChange: async e => {
            const { auxiliaryOperatorNumber } = getTechnologyFieldsValue();
            setTechnologyFieldsValue({
              standardManpower: e + (auxiliaryOperatorNumber || 0),
            });
          },
        },
      },
      {
        field: 'auxiliaryOperatorSkills',
        label: '辅机手技能',
        component: 'ApiSelect',
        componentProps: {
          api: () => baseStore.getDictionaryData('SkillLevel', true),
          labelField: 'fullName',
          valueField: 'enCode',
          showSearch: true,
          filterOption: (value, option) => {
            return option.label.includes(value);
          },
        },
      },
      {
        field: 'auxiliaryOperatorNumber',
        label: '辅机手人数',
        component: 'InputNumber',
        componentProps: {
          min: 0,
          step: 1,
          precision: 0,
          onChange: async e => {
            const { mainOperatorNumber } = getTechnologyFieldsValue();
            setTechnologyFieldsValue({
              standardManpower: e + (mainOperatorNumber || 0),
            });
          },
        },
      },
      {
        field: 'addTechnology',
        label: '',
        transferRange: ['placeholder'],
        component: 'Input',
        slot: 'addTechnology',
        // colProps: {
        //   span: 8,
        // },
      },
    ];
  }

  function handleAddTechnology() {
    state.technologyList.push(cloneDeep(technologyItem));
    emit('materialSetState', {
      stepDistanceList: toRaw(state.technologyList),
    });
  }

  function warn(msg: string) {
    createMessage.warning(msg);
  }

  function parseMoldGenerateInput(input: string, chooseNewPartNumType: boolean) {
    const arr = input.split('-');
    if (arr.length !== 3) {
      warn(`请输入正确的值，如：${chooseNewPartNumType ? 'AF-BAZZ125ABCD-AA' : 'AF-BAZZ12ABCD-AA'}`);
      return null;
    }
    const [prefix, middle, suffix] = arr;

    if (prefix.length !== 2) {
      warn('请输入前两位正确的值，如：AF');
      return null;
    }
    if (suffix.length !== 2) {
      warn('请输入后五位正确的值，如：AA');
      return null;
    }
    return { prefix, middle, suffix };
  }

  function buildCodes(prefix: string, base: string, tail: string, suffix: string) {
    return [...tail].map(ch => ({ code: `${prefix}-${base}${ch}-${suffix}` }));
  }

  function validateAndGenerateNew(prefix: string, middle: string, suffix: string) {
    if (middle.length < 8) {
      warn('请输入中间正确的值，如：BAZZ125A');
      return null;
    }

    const base = middle.slice(0, 7);
    const tail = middle.slice(7);

    if (!isNumberEndingWithDigit(base)) {
      warn('请确认输入的字符串为新模规则');
      return null;
    }
    if (hasDuplicates(tail)) {
      warn('中间数据尾部有重复数值');
      return null;
    }

    return buildCodes(prefix, base, tail, suffix);
  }

  function validateAndGenerateOld(prefix: string, middle: string, suffix: string) {
    if (middle.length < 7) {
      warn('请输入中间正确的值，如：BAZ125A');
      return null;
    }

    const base = middle.slice(0, 6);
    const oldVerify = middle.slice(6, 7);
    const tail = middle.slice(6);

    if (isNumberEndingWithDigit(oldVerify)) {
      warn('请确认输入的字符串为旧模规则');
      return null;
    }
    if (hasDuplicates(tail)) {
      warn('中间数据尾部有重复数值');
      return null;
    }

    return buildCodes(prefix, base, tail, suffix);
  }

  function handleMoldGenerate() {
    const parsed = parseMoldGenerateInput(state.moldGenerate, state.chooseNewPartNumType);
    if (!parsed) return;

    const { prefix, middle, suffix } = parsed;

    const list = state.chooseNewPartNumType ? validateAndGenerateNew(prefix, middle, suffix) : validateAndGenerateOld(prefix, middle, suffix);

    if (!list) return;

    state.toBeGenerateList.push(...list);
    state.moldGenerate = '';
    createMessage.success('校验并生成成功');
  }

  function handleDeleteMold(index) {
    state.toBeGenerateList.splice(index, 1);
  }

  function hasDuplicates(str) {
    const chars = str.split('');
    const uniqueChars = _.uniq(chars);
    return uniqueChars.length < chars.length;
  }

  function handleBOMChange(e) {
    // 如果是量试需求，且选择了样品BOM，不能选择其他类型的数据
    if (e == 4 && currentData?.demandType == 'Quantitative') {
      setBaseInfoFieldsValue({
        bomType: 1,
      });
      return createMessage.warning('量试需求不能选择样品BOM');
    }

    if (state.bomType == 4 || e == 4) {
      emit('clearCustomerFile');
    }
    emit('setBomType', e);
    if (e == 4) {
      emit('clearCustomerFile');
    }
    emit('getVersion');
  }

  function setValues(data) {
    setBaseInfoFieldsValue(data);
    setProdInfoFieldsValue(data);
    setTechnologyFieldsValue(data);
    state.toBeGenerateList = data.toBeGenerateList;
  }

  function calcNumberOfKnives(numberOfKnives, process, updateMeters) {
    if (!updateMeters) {
      setTechnologyFieldsValue({
        mainOperatorSkills: null,
        auxiliaryOperatorSkills: null,
      });
    }
    // const stepDistance = state.technologyList[0].stepDistance;
    if (!process || !numberOfKnives) return;
    const params = {
      numberOfKnives,
      typeCode: process,
    };
    // 平板 ：刀数、步距变动，取调机米数，
    // 圆刀 ： 刀数变动 取调机米数
    // 圆刀 --> 平板 清空调机米数，如有步距 取
    // 平板 --> 圆刀

    if (updateMeters) {
      const stepDistance = state.technologyList[0].stepDistance;
      params.stepDistance = stepDistance;
    }
    getProcessParaList(params).then(({ code, data }) => {
      if (code == 200) {
        if (data) {
          if (updateMeters) {
            setTechnologyFieldsValue({
              adjustmentMetres: data.suggestedAdjustmentMetres,
            });
          } else {
            setTechnologyFieldsValue({
              adjustmentMetres: null,
            });
          }

          const auxiliaryOperatorNumber = data.auxiliaryOperatorStaffing ? 1 : null;
          const mainOperatorNumber = data.mainOperatorStaffing ? 1 : null;

          console.log({
            mainOperatorSkills: data.mainOperatorStaffing,
            auxiliaryOperatorSkills: data.auxiliaryOperatorStaffing,
            // 辅机手人数
            auxiliaryOperatorNumber: auxiliaryOperatorNumber,
            // 主机手人数
            mainOperatorNumber: mainOperatorNumber,
            standardManpower: (auxiliaryOperatorNumber || 0) + (mainOperatorNumber || 0),
          });
          setTechnologyFieldsValue({
            mainOperatorSkills: data.mainOperatorStaffing,
            auxiliaryOperatorSkills: data.auxiliaryOperatorStaffing,
            // 辅机手人数
            auxiliaryOperatorNumber: auxiliaryOperatorNumber,
            // 主机手人数
            mainOperatorNumber: mainOperatorNumber,
            standardManpower: (auxiliaryOperatorNumber || 0) + (mainOperatorNumber || 0),
          });

          // 生产工艺改变时 --> 填充速度
          // 1. 平板 --> 填充速度 suggestedStartupSpeed
          // 2. 圆刀 --> 填充速度 suggestedStartupSpeedUnit
          // const datalist = getTechnologyDataSource();
          // datalist.forEach(item => {
          //   const { editValueRefs, processCode, speed, speedUnit } = item;
          //   if (!processCode) return;
          //   if (processCode.startsWith('2') || processCode.startsWith('3')) {
          // 	  console.log(66666);
          // 	  // 如果没有速度或速度单位，则填充
          // 	  if (!speed) {
          // 		  editValueRefs.speed = data.suggestedStartupSpeed;
          // 	  }
          // 	  if (!speedUnit) {
          // 		  editValueRefs.speedUnit = data.suggestedStartupSpeedUnit;
          // 	  }
          //   }
          // });
        }
      }
    });
  }

  function setToBeGenerateList(list) {
    state.toBeGenerateList = list;
  }

  function setTechnologyList(list) {
    state.technologyList = list;
  }

  async function getValues() {
    return {
      baseInfo: await getBaseInfoFieldsValue(),
      prodInfo: await getProdInfoFieldsValue(),
      technology: getTechnologyFieldsValue(),
    };
  }

  function getStateList() {
    return {
      toBeGenerateList: state.toBeGenerateList,
      technologyList: state.technologyList,
    };
  }

  async function resetFormFields() {
    // await resetBaseInfoFields()
    // await resetProdInfoFields()
    // await resetTechnologyFields()
    return Promise.all([resetBaseInfoFields(), resetTechnologyFields()]);
  }

  function handleDeleteTechnology(index) {
    state.technologyList.splice(index, 1);
  }

  function isNumberEndingWithDigit(str) {
    if (typeof str !== 'string' || str.length === 0) {
      return false; // Empty or not a string
    }

    const lastChar = str.charAt(str.length - 1);
    return !Number.isNaN(Number.parseInt(lastChar));
  }

  async function setDisabled(disabled: boolean) {
    state.disabled = disabled;
    // setBaseInfoProps({
    //   disabled,
    // });
    //
    // setProdInfoProps({
    //   disabled,
    // });
    updateState({
      commonConfig: {
        disabled: true,
      },
    });
    setTechnologyProps({
      disabled,
    });
  }

  function enableEditFactory() {
    updateBaseInfoSchema([
      {
        fieldName: 'factory',
        componentProps: {
          disabled: false,
        },
      },
    ]);
  }

  defineExpose({
    initBaseInfoFieldsValue,
    setBaseInfoFieldsValue,
    setProdInfoFieldsValue,
    setToBeGenerateList,
    setTechnologyList,
    getProdInfoFieldsValue,
    setTechnologyFieldsValue,
    resetFormFields,
    getTechnologyFieldsValue,
    getValues,
    getStateList,
    setDisabled,
    enableEditFactory,
  });
</script>

<template>
  <a-row :gutter="20">
    <a-col :span="12">
      <Subtitle :title="t('common.baseinfo')" id="base-info" />
      <BaseInfoForm />
      <!--      <a-row :gutter="20">-->
      <!--        <a-col :span="12">-->
      <!--          <Subtitle :title="t('common.baseinfo')" id="base-info" />-->
      <!--          <BasicForm @register="registerBaseInfoForm"></BasicForm>-->
      <!--        </a-col>-->
      <!--        <a-col :span="12">-->
      <!--          <Subtitle :title="t('dict.PCCApplyColumn.productionInformation')" />-->
      <!--          <BasicForm @register="registerProdInfoForm"></BasicForm>-->
      <!--        </a-col>-->
      <!--      </a-row>-->
    </a-col>
    <a-col :span="6">
      <Subtitle :title="t('dict.PCCApplyColumn.processInformation')" />
      <BasicForm @register="registerTechnologyForm">
        <template #addTechnology="{ model, field }">
          <a-button v-if="!state.disabled" type="link" class="flex self-center items-center" @click="handleAddTechnology">
            <template #icon>
              <PlusOutlined />
            </template>
            <!-- 步距组号 -->
            {{ t('common.stepNumber') }}
          </a-button>
        </template>
      </BasicForm>
      <ScrollContainer class="technology-box">
        <a-row :gutter="[5, 0]" v-for="(item, index) in technologyList" class="item-box">
          <!--                    <a-col :span="8"></a-col>-->
          <a-col :span="13">
            <span :class="index == 0 ? 'span-required' : ''"
              >{{ index + 1 }}、{{ index === 0 ? t('dict.ProcessLevelEnum.Main') : '' }}{{ t('common.step') }}(MM)</span
            >
            <LydcInputNumber
              :disabled="state.disabled"
              v-model:value="item.stepDistance"
              :placeholder="t('common.step')"
              @change="
                () => {
                  // if (index !== 0) return;
                  nextTick(() => {
                    const { numberOfKnives, process } = getTechnologyFieldsValue();
                    calcNumberOfKnives(numberOfKnives, process, true);
                    emit('calcMaterialUseQty');
                    // calcDowntimeOneHourUtilizationRate();
                  });
                }
              " />
          </a-col>
          <a-col :span="8">
            <span :class="index == 0 ? 'span-required' : ''">{{ t('common.modules') }}</span>
            <LydcInputNumber :disabled="state.disabled" v-model:value="item.modulus" :placeholder="t('common.modules')" @change="emit('calcMaterialUseQty')" />
          </a-col>
          <a-col :span="3">
            <a-button v-if="!state.disabled" type="link" style="width: 30px" @click="handleDeleteTechnology(index)">
              <DeleteOutlined />
            </a-button>
          </a-col>
        </a-row>
      </ScrollContainer>
    </a-col>
    <a-col :span="6" class="mold">
      <div class="flex justify-between">
        <Subtitle :title="t('dict.CommonCol.moldNo')" />
        <a-switch v-model:checked="chooseNewPartNumType" :checked-children="t('dict.WorkOrder.Type.3')" :un-checked-children="t('common.oldModel')" />
      </div>
      <a-row style="margin-bottom: 12px">
        <a-col :span="19">
          <a-input
            :placeholder="`${t('common.example')}:${chooseNewPartNumType ? 'AF-BAZZ125ABCD-AA' : 'AF-BAZ125ABCD-AA'}`"
            v-model:value="moldGenerate"
            :disabled="state.disabled"
            @keydown.enter.native="handleMoldGenerate" />
        </a-col>
        <a-col :span="5">
          <a-button v-if="!state.disabled" @click="handleMoldGenerate" type="link">{{ t('dict.PCCApplyColumn.generate') }} </a-button>
        </a-col>
      </a-row>
      <ScrollContainer class="scroll-bar">
        <div class="mold-box content">
          <div class="to-be-generate" v-for="(item, index) in toBeGenerateList">
            <div>
              <div class="item-box">{{ item.code }}</div>
            </div>
            <div>
              <a-button v-if="!state.disabled" type="link" style="width: 30px" @click="handleDeleteMold(index)">
                <DeleteOutlined />
              </a-button>
            </div>
          </div>
        </div>
        <!--                  <a-row>-->
        <!--                    <div v-for="(item, index) in toBeGenerateListLeft"></div>-->
        <!--                  </a-row>-->
      </ScrollContainer>
    </a-col>
  </a-row>
</template>

<style scoped>
  .mold-box {
    margin-top: 12px;
    display: flex;
    width: 100%;
    box-sizing: border-box;
    background: #fafafa;
    padding: 8px;
    padding-top: 0;
    height: 308px;
    flex-flow: column wrap;

    .content {
      height: 320px;
      overflow: auto;
    }

    .to-be-generate {
      display: flex;
      flex-direction: row;
    }

    .item-box {
      display: flex;
      flex-direction: row;
      align-items: center;
      margin-bottom: 5px;
      background: #f2f2f2;
      padding: 4px 8px;
    }
  }

  :deep(.form-required > label::before) {
    display: inline-block;
    margin-inline-end: 4px;
    color: #ed6f6f;
    font-size: 14px;
    font-family: SimSun, sans-serif;
    line-height: 1;
    content: '*';
  }
</style>
