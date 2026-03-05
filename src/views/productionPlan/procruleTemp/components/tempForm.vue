<template>
  <ScrollContainer>
    <div class="basic-block">
      <div v-if="isShowTitleTips && getTitleTips()" class="basic-block-header">
        <span v-html="getTitleTips()"></span>
      </div>
      <a-form :colon="false" :model="state" ref="tempFormRef" v-loading="isLoading" :labelWrap="true" layout="vertical">
        <!-- <a-row> -->
        <draggable
          :draggable="props.isNeedValidate"
          :list="state.tempList"
          :animation="300"
          handle=".option-drag"
          item-key="name"
          class="basic-group"
          ghost-class="ghost"
          @change="handleDragChange">
          <template #item="{ element: item, index }">
            <a-col :class="props.isNeedValidate ? '' : 'option-drag'" :span="colSpan" v-if="isActiveItemFn(item, 'StringType') && item.isShowForm">
              <a-form-item
                :label="formatLabel(item)"
                :name="['tempList', index, 'fieldValue']"
                :rules="{
                  required: item.isRequired === 1 && isNeedValidate,
                  message: t('common.inputText'),
                  trigger: 'change',
                }">
                <!-- :suffixIcon="item.attachJson ? 'icon-ym icon-ym-scanCode' : ''" -->
                <!-- :autoComplete="item.fieldEnName == 'rawMatLabel' || item.fieldEnName == 'transformTag' ? 'off' : 'on'" -->
                <!-- 分切标签打印-工单号输入框只显示一条历史记录 -->
                <LydcInput
                  v-model:value="item.fieldValue"
                  allowClear
                  autoComplete="off"
                  :disabled="item.isDisabled === 1"
                  :placeholder="t('common.inputText')"
                  :historicalRecord="item.fieldEnName === 'workOrderNo' && operationType === 'SplitPrint'"
                  historicalRecordKey="workOrderNoRecord"
                  :suffixIcon="item.fieldEnName == 'rawMatLabel' || item.fieldEnName == 'transformTag' ? 'icon-ym icon-ym-scanCode' : ''"
                  @change="handlerInputChangeFn(item, $event)"
                  @Keydown="handlerInputKeydown(item, $event)"
                  @setInputValue="
                    val => {
                      item.fieldValue = val;
                    }
                  " />
              </a-form-item>
            </a-col>
            <a-col :class="props.isNeedValidate ? '' : 'option-drag'" :span="colSpan" v-else-if="isActiveItemFn(item, 'DecimalType') && item.isShowForm">
              <a-form-item
                :label="formatLabel(item)"
                :name="['tempList', index, 'fieldValue']"
                :rules="{
                  required: item.isRequired === 1 && isNeedValidate,
                  message: t('common.inputText'),
                  trigger: 'change',
                }">
                <LydcInputNumber
                  v-model:value="item.fieldValue"
                  allowClear
                  :placeholder="t('common.inputText')"
                  :disabled="item.isDisabled === 1"
                  :min="item.min || 0"
                  @change="handleDecimalTypeInputChange(item, $event)" />
              </a-form-item>
            </a-col>
            <a-col :class="props.isNeedValidate ? '' : 'option-drag'" :span="colSpan" v-else-if="isActiveItemFn(item, 'IntType') && item.isShowForm">
              <a-form-item
                :label="formatLabel(item)"
                :name="['tempList', index, 'fieldValue']"
                :rules="{
                  required: item.isRequired === 1 && isNeedValidate,
                  message: t('common.inputText'),
                  trigger: 'change',
                }">
                <LydcInputNumber
                  v-model:value="item.fieldValue"
                  allowClear
                  :placeholder="t('common.inputText')"
                  :disabled="item.isDisabled === 1"
                  :min="item.min || 0"
                  @change="handleIntTypeInputChange(item, $event)" />
              </a-form-item>
            </a-col>
            <a-col :class="props.isNeedValidate ? '' : 'option-drag'" :span="colSpan" v-else-if="isActiveItemFn(item, 'DateType') && item.isShowForm">
              <a-form-item
                :label="formatLabel(item)"
                :name="['tempList', index, 'fieldValue']"
                :rules="{
                  required: item.isRequired === 1 && isNeedValidate,
                  message: t('common.inputText'),
                  trigger: 'change',
                }">
                <lydc-date-picker
                  v-model:value="item.fieldValue"
                  :placeholder="t('common.inputText')"
                  :disabled="item.isDisabled === 1"
                  format="YYYY-MM-DD"
                  @change="time => onChangeDate(time, item)" />
              </a-form-item>
            </a-col>
            <a-col :class="props.isNeedValidate ? '' : 'option-drag'" :span="colSpan" v-else-if="isActiveItemFn(item, 'TimeType') && item.isShowForm">
              <a-form-item
                :label="formatLabel(item)"
                :name="['tempList', index, 'fieldValue']"
                :rules="{
                  required: item.isRequired === 1 && isNeedValidate,
                  message: t('common.inputText'),
                  trigger: 'change',
                }">
                <lydc-date-picker
                  v-model:value="item.fieldValue"
                  :placeholder="t('common.inputText')"
                  :disabled="item.isDisabled === 1"
                  @change="time => onChangeTime(time, item)"
                  format="YYYY-MM-DD HH:mm:ss" />
              </a-form-item>
            </a-col>
            <a-col :class="props.isNeedValidate ? '' : 'option-drag'" :span="colSpan" v-else-if="isActiveItemFn(item, 'DictType') && item.isShowForm">
              <a-form-item
                :label="formatLabel(item)"
                :name="['tempList', index, 'fieldValue']"
                :rules="{
                  required: item.isRequired === 1 && isNeedValidate,
                  message: t('common.inputText'),
                  trigger: 'change',
                }">
                <LydcSelect
                  :multiple="item.isMultiSelect === 1 ? true : false"
                  v-model:value="item.fieldValue"
                  :placeholder="t('common.inputText')"
                  showSearch
                  allowClear
                  @change="
                    (_, option) => {
                      selectChange(option, item);
                    }
                  "
                  :fieldNames="{ label: 'fullName', value: 'enCode' }"
                  :options="item.templateList"
                  :disabled="item.isDisabled === 1" />
              </a-form-item>
            </a-col>
            <a-col :class="props.isNeedValidate ? '' : 'option-drag'" :span="colSpan" v-else-if="isActiveItemFn(item, 'ApiType') && item.isShowForm">
              <a-form-item
                :label="formatLabel(item)"
                :name="['tempList', index, 'fieldValue']"
                :rules="{
                  required: item.isRequired === 1 && isNeedValidate,
                  message: t('common.inputText'),
                  trigger: 'change',
                }">
                <LydcSelect
                  :multiple="item.isMultiSelect === 1 ? true : false"
                  v-model:value="item.fieldValue"
                  @change="
                    (val, option) => {
                      selectChange(option, item, 'apiSelect', val);
                    }
                  "
                  :placeholder="t('common.inputText')"
                  showSearch
                  allowClear
                  @search="debounceSearch(item, $event)"
                  :options="item.templateList"
                  :disabled="!!(item.isDisabled === 1 || (item.fieldEnName === 'lineCode' && item.fieldValue && process))" />
                <!-- 黑金刚报工选完线体之后，线体下拉框要立即禁用，只有黑金刚报工才有process -->
              </a-form-item>
            </a-col>
            <a-col :class="props.isNeedValidate ? '' : 'option-drag'" :span="colSpan" v-else-if="isActiveItemFn(item, 'Personnel') && item.isShowForm">
              <a-form-item
                :label="formatLabel(item)"
                :name="['tempList', index, 'fieldValue']"
                :rules="{
                  required: item.isRequired === 1 && isNeedValidate,
                  message: t('common.inputText'),
                  trigger: ['change', 'blur'],
                }">
                <lydc-custom-user-select
                  v-model:value="item.fieldValue"
                  :multiple="item.isMultiSelect === 1"
                  :placeholder="t('common.inputText')"
                  :allowClear="true"
                  :alwaysLoad="true"
                  show-search
                  :maxTagTextLength="16"
                  :maxTagCount="1"
                  class="custom-user-select"
                  @change="
                    (_, option) => {
                      userSelectChange(option, item);
                    }
                  "
                  @options-change="options => userSelectOptionsChange(options, item)"
                  :disabled="item.isDisabled === 1">
                  <template #maxTagPlaceholder="omittedValues">
                    <span>+ {{ omittedValues.length }}</span>
                  </template>
                </lydc-custom-user-select>
              </a-form-item>
            </a-col>
            <a-col :class="props.isNeedValidate ? '' : 'option-drag'" :span="colSpan" v-else-if="isActiveItemFn(item, 'Organize') && item.isShowForm">
              <a-form-item
                :label="formatLabel(item)"
                :name="['tempList', index, 'fieldValue']"
                :rules="{
                  required: item.isRequired === 1 && isNeedValidate,
                  message: t('common.inputText'),
                  trigger: 'change',
                }">
                <!-- <lydcOrganizeCascader v-model:value="item.fieldValue" :showSearch="true" placeholder="请选择" :disabled="item.disabled === 1" /> -->
                <lydc-organize-select :placeholder="t('common.inputText')" v-model:value="item.fieldValue" allowClear :disabled="item.isDisabled === 1" />
              </a-form-item>
            </a-col>
            <a-col :class="props.isNeedValidate ? '' : 'option-drag'" :span="colSpan" v-else-if="isActiveItemFn(item, 'Upload') && item.isShowForm">
              <a-form-item
                :label="formatLabel(item)"
                :name="['tempList', index, 'fieldValue']"
                :rules="{
                  required: item.isRequired === 1 && isNeedValidate,
                  message: t('common.inputText'),
                  trigger: 'change',
                }">
                <div class="down-text" v-if="item.isChecked">
                  <a-dropdown v-if="item.uploadProgramFileName">
                    <a class="ant-dropdown-link" @click.prevent>
                      查看文件
                      <DownOutlined />
                    </a>
                    <template #overlay>
                      <a-menu>
                        <a-menu-item v-for="(o, i) in splitArr(item.uploadProgramFileName)" @click="handleFileDownload(item, i)">
                          <div>
                            <i class="icon-ym icon-ym-h5" style="color: blue"></i>
                            <span style="color: blue">{{ o }}</span>
                          </div>
                        </a-menu-item>
                      </a-menu>
                    </template>
                  </a-dropdown>
                  <span v-else> 暂无数据</span>
                </div>
                <a-upload
                  v-feature
                  v-else
                  multiple
                  name="file"
                  v-model:file-list="state.fileList"
                  :action="getActions"
                  class="upload-area"
                  :accept="accepts"
                  :max-count="10"
                  :headers="getHeaders"
                  :before-upload="handleBeforeUpload"
                  @remove="handleFileRemove(item, $event)"
                  @change="handleFileChange(item, $event)"
                  @download="handleFileDownload"
                  :showUploadList="{ showPreviewIcon: false, showRemoveIcon: true, showDownloadIcon: true }"
                  :disabled="item.isDisabled === 1">
                  <a-button v-if="state.fileList.length <= 10"> <upload-outlined></upload-outlined>上传文件</a-button>
                </a-upload>
              </a-form-item>
            </a-col>
          </template>
        </draggable>
        <!-- </a-row> -->
      </a-form>
    </div>
  </ScrollContainer>
</template>
<script setup lang="ts">
  import { reactive, watch, ref, toRefs, unref, computed } from 'vue';
  import { procRuleTempEnum, TempItem } from '/@/views/productionPlan/procruleTemp/types';
  import { debounce, cloneDeep } from 'lodash-es';
  import { LydcInput } from '/@/components/Lydc/Input';
  import { LydcInputNumber } from '/@/components/Lydc/InputNumber';
  import { getShiftType } from '/@/utils/time';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { ScrollContainer } from '/@/components/Container';
  import { useApiAndAutoComplete } from '../hooks/useApiAndAutoComplete';
  import { processTips } from '../hooks/config';
  import { useGlobSetting } from '/@/hooks/setting';
  import { getToken } from '/@/utils/auth';
  import { upload, fileDownload } from '/@/api/basicData/processrulestemplate';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { downloadByUrl } from '/@/utils/file/download';
  import { UploadOutlined, DownOutlined } from '@ant-design/icons-vue';
  import draggable from 'vuedraggable';
  import dayjs from 'dayjs';

  // import { LydcOrganizeCascader } from '/@/components/Lydc';

  const accepts = '.dxf,.cad,.src,.stcp,.iges,.step,.stl,.ard,.amd,.nv,.i,.mpf.,.eid,.lgl,.lg3,.ard,.amd,.nc,.eia,.dwg';
  const globSetting = useGlobSetting();
  const { createMessage } = useMessage();

  const { t } = useI18n();
  const emit = defineEmits([
    'onChange',
    'onProductCodeChange',
    'onWordOrderNoChange',
    'tempFormChange',
    'onDecimalTypeInputChange',
    'onIntTypeInputChange',
    'inputKeydown',
  ]);
  const props = defineProps({
    tempList: {
      type: Array as PropType<TempItem[]>,
      default: () => [],
    },
    colSpan: {
      type: Number,
      default: 8,
    },
    // 是否需要表单校验
    isNeedValidate: {
      type: Boolean,
      default: false,
    },
    // 工序名称
    processName: {
      type: String,
      default: '',
    },
    process: {
      type: String,
      default: '',
    },
    // 操作类型
    operationType: {
      type: String,
      default: '',
    },
    // 是否显示提示
    isShowTitleTips: {
      type: Boolean,
      default: true,
    },
    // 是否默认显示班次
    showDefaultClasses: {
      type: Boolean,
      default: true,
    },
  });
  const { isNeedValidate, processName, operationType, isShowTitleTips } = toRefs(props);
  const { getDictionaryDataSelectorFn, getOptionsByApiFn, getAutoCompleteData, isLoading } = useApiAndAutoComplete();

  const state = reactive<{ tempList: TempItem[]; filterArr: any[]; titleTips: any; fileList: any }>({
    tempList: [],
    filterArr: [],
    titleTips: [],
    fileList: [],
  });
  const tempFormRef = ref();
  const isGetOptions = ref(false);
  const getHeaders = computed(() => ({ Authorization: getToken() as string }));
  const getActions = computed(() => globSetting.apiUrl + '/api/Production/processrulestemplate/uploadfile');

  const isInit = ref(true);
  watch(
    () => props.tempList,
    async newVal => {
      isInit.value = true;
      if (!state.tempList?.length) {
        state.tempList = cloneDeep(props.tempList);
      } else {
        let result = newVal.map(itemA => {
          return {
            ...itemA,
            // fieldValue: (state.tempList.find(itemB => itemB.fieldConfigId === itemA.fieldConfigId) || {}).fieldValue,
          };
        });
        state.tempList = result;
      }
      // 机台抓取电脑时间判断当前时间是属于什么班次
      state.tempList = state.tempList.map(item => {
        if (item.fieldEnName === 'classes' && props.showDefaultClasses) {
          return {
            ...item,
            fieldValue: getShiftType(),
          };
        } else {
          return { ...item };
        }
      });
      //  && !isGetOptions.value
      if (newVal.length) {
        getOptionsFn();
      }
      setTimeout(() => {
        isInit.value = false;
      }, 1000);
    },
    { deep: true, immediate: true },
  );
  const debounceTempFormChange = debounce(newVal => {
    emit('tempFormChange', newVal);
  }, 300);
  watch(
    () => state.tempList,
    async newVal => {
      if (isInit.value) return;
      // debounceTempFormChange(
      //   newVal.map(item => {
      //     if (item.isMultiSelect === 1) {
      //       return {
      //         ...item,
      //         fieldValue: Array.isArray(item.fieldValue) ? item.fieldValue.join(',') : '',
      //       };
      //     } else {
      //       return { ...item };
      //     }
      //   }),
      // );
      debounceTempFormChange(newVal);
    },
    { deep: true },
  );

  function formatLabel(item: TempItem) {
    const label = t(`dict.CommonCol.${item.fieldEnName}`);
    if (label && label.includes('dict.CommonCol.')) {
      return item.fieldCnName;
    }
    return label || item.fieldCnName;
  }

  function selectChange(option, item, type?, val?) {
    // 清除选中项的时候要重新获取一下下拉数据
    if (type === 'apiSelect' && !val) {
      debounceSearch(item, '');
    }
    // 赋值name值用于渲染表格
    if (item.isMultiSelect === 1) {
      item.fieldValueName = option?.map(item => item.fullName).join(',');
    } else {
      item.fieldValueName = option?.fullName;
    }
  }

  function userSelectChange(option, item) {
    // 赋值name值用于渲染表格
    if (item.isMultiSelect === 1) {
      item.fieldValueName = option?.map(item => item.fullName).join(',');
    } else {
      item.fieldValueName = option?.fullName;
    }
  }

  function onChangeTime(time, item) {
    item.fieldValueName = dayjs(time).format('YYYY-MM-DD HH:mm:ss');
  }

  function onChangeDate(time, item) {
    item.fieldValueName = dayjs(time).format('YYYY-MM-DD');
  }

  function userSelectOptionsChange(options, item) {
    if (options.length !== 1) return;
    const ids = options.map(item => item.id);
    const fullNames = options?.map(item => item.fullName);

    item.fieldValue = item.fieldValue && Array.isArray(item.fieldValue) ? [...item.fieldValue, ...ids] : ids;
    if (item.isMultiSelect === 1) {
      item.fieldValueName = item.fieldValueName ? `${item.fieldValueName},${fullNames.join(',')}` : fullNames.join(',');
    } else {
      item.fieldValueName = options?.fullName;
    }

    document.getElementsByClassName('custom-user-select')[0]?.querySelector('input')?.blur();
  }

  function handleDragChange(a) {
    emit('onChange', state.tempList);
  }

  function splitArr(uploadProgramFileNames) {
    if (!uploadProgramFileNames) return [];
    const arr = uploadProgramFileNames.split(',');
    return arr;
  }

  async function handleFileDownload(e, i) {
    let downloadId = '';
    if (e.fieldValue) {
      const ids = e.fieldValue.split(',');
      downloadId = ids[i];
    } else {
      downloadId = e.response ? e.response.data.Id : e;
    }
    try {
      const { data, code } = await fileDownload(downloadId);
      if (code === 200) {
        downloadByUrl({ url: data.url, fileName: data.name });
      }
    } catch (error) {
      console.error('文件下载失败：', error);
    }
  }
  function handleBeforeUpload(e) {
    const fileParams = new FormData();
    fileParams.append('file', e);
    return Promise.resolve(fileParams);
  }

  function handleFileRemove(item, e) {
    item.fieldValue = '';
  }

  function handleFileChange(item, { file, fileList }) {
    if (file.status === 'done' && file.response) {
      const ids: any = [];
      const nameArr: any = [];
      fileList.forEach(item => {
        ids.push(item.response.data.Id);
        nameArr.push(item.name);
      });
      item.fieldValue = ids.join(',');
      item.uploadProgramFileNames = nameArr.join(',');
      console.log(item.fieldValue, 'tempForm');
    }
  }

  function getTitleTips() {
    const str = processTips[unref(processName)];
    return str ? str.replaceAll('\n', '<br/>') : '';
  }

  function getOptionsFn() {
    isGetOptions.value = true;
    state.tempList.forEach(o => {
      if (isActiveItemFn(o, 'ApiType')) {
        getOptionsByApiFn(o, '', o.fieldEnName === 'lineCode' ? props.process : '');
      } else if (isActiveItemFn(o, 'DictType')) {
        getDictionaryDataSelectorFn(o);
      }
    });
  }

  const handlerInputKeydown = (item: TempItem, e: any) => {
    const val = e.target._value;
    const { fieldEnName } = item;
    // 工单号扫码枪赋值
    if (e.keyCode !== 13) return;
    emit('inputKeydown', item);
    if (fieldEnName === 'workOrderNo') {
      item.fieldValue = val;
    } else if (fieldEnName === 'transformTag') {
      const arr = val.split('!') || [];
      item.fieldValue = arr[0];
    }
  };

  // 自动带入信息
  const handlerInputChangeFn = debounce(async (item: any, fieldValue) => {
    if (item.fieldEnName === 'workOrderNo') {
      emit('onWordOrderNoChange', fieldValue);
    }
    const res = await getAutoCompleteData({ item, fieldValue, processName: unref(processName), operationType: unref(operationType) })?.finally(() => {
      if (item.fieldEnName === 'rawMatLabel') {
        item.fieldValue = '';
      }
    });
    if (res?.data) {
      const { data, autoCompleteObj } = res;
      state.tempList.forEach(o => {
        if (autoCompleteObj[o.fieldEnName]) {
          o.fieldValue = data[autoCompleteObj[o.fieldEnName]];
          if (o.fieldEnName === 'productCode') {
            emit('onProductCodeChange', o.fieldValue);
          }
        }
        // 连环自动带数据，譬如前面已经将模具编号带出，但是这样赋值触发不了input的change，故手动判断触发
        if (autoCompleteObj[o.fieldEnName] && o.attachJson && o.fieldEnName !== item.fieldEnName) {
          handlerInputChangeFn(o, o.fieldValue);
        }
        if (o.fieldEnName == 'rawMatLabel') {
          o.fieldValue = '';
        }
      });
    }
  }, 300);

  const handleDecimalTypeInputChange = debounce(async (item: any, fieldValue) => {
    emit('onDecimalTypeInputChange', state.tempList, item.fieldEnName, fieldValue);
  }, 300);

  const handleIntTypeInputChange = debounce(async (item: any, fieldValue) => {
    console.log(item, fieldValue, 'item, fieldValue++');
    emit('onIntTypeInputChange', state.tempList, item.fieldEnName, fieldValue);
  }, 300);

  // 根据枚举显示对应标签组件
  function isActiveItemFn(item: TempItem, type: keyof typeof procRuleTempEnum) {
    if (!item) return;
    return item.status === 1 && item.dataType === procRuleTempEnum[type];
  }

  // 表单校验方法
  function validateFormFn() {
    if (tempFormRef.value) {
      return new Promise<boolean>((resolve: any, reject) => {
        tempFormRef.value
          .validate()
          .then(() => {
            let _templist = cloneDeep(state.tempList);
            _templist = _templist.map((o: any) => {
              if (o.multiple === 1 && o.fieldValue.length) {
                o.fieldValue.join(',');
              } else {
                if (isActiveItemFn(o, 'Organize') && o.fieldValue?.length) {
                  o.fieldValue = o.fieldValue[o.fieldValue.length - 1];
                }
              }
              delete o.templateList;

              return o;
            });
            resolve(_templist);
          })
          .catch(err => {
            reject(err);
          });
      });
    }
    return Promise.reject(new Error('Form is not defined'));
  }

  // 延迟查询
  const debounceSearch = debounce(async (item: TempItem, searchKey: string) => {
    return getOptionsByApiFn(item, searchKey);
  }, 400);

  // 表单重置方法
  const resetFormFn = () => {
    if (tempFormRef.value) {
      tempFormRef.value.resetFields();
    }
  };

  const updateTempList = tempList => {
    state.tempList = cloneDeep(tempList);
  };
  defineExpose({
    resetFormFn,
    validateFormFn,
    updateTempList,
  });
</script>

<style lang="less" scoped>
  .ant-form-item {
    display: grid;
    grid-template-columns: 0.95fr;
  }

  :deep(.ant-modal) {
    .scrollbar {
      padding: 0 !important;
    }
  }

  :deep(.ant-form-item-label) {
    text-align: left !important;
  }

  :deep(.icon-ym-scanCode) {
    color: #ff7b00 !important;
  }

  .basic-block-header {
    background: #fff5eb;
    color: #1a1a1a;
    font-size: 14px;
    padding: 10px;
  }

  .down-text {
    color: #ff7b00;
    font-size: 14px;
    cursor: pointer;
  }

  .basic-group {
    height: 90%;
    display: flex;
    flex-flow: row wrap;
    // padding-bottom: 60px;
    // padding-right: 12px;
  }

  .option-drag {
    cursor: all-scroll;
  }
</style>
