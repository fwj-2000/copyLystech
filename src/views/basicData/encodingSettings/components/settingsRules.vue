<template>
  <BasicPopup v-bind="$attrs" :title="title" :showOkBtn="hasBtnP('btn_edit')" @register="registerPopup" @ok="handleSaveAction" class="full-popup top-0">
    <a-spin :spinning="loading">
      <div class="rules-wrap">
        <div class="top-fixed">
          <div class="ctx-box">
            <div class="title-help">
              <div class="title">
                <TitleStick />
                {{ t('dict.CommonCol.documentNumber') }}<p style="color: #999; font-weight: normal"> {{ t('dict.IdgeneratorRule.previewTip') }}</p>
              </div>
              <div class="help" @click="handleHelpAction">
                <img src="./assets/help.svg" :alt="t('commom.help')" />
              </div>
            </div>
            <div class="ctx-preview">
              <div class="ctx-block">
                <draggable class="flex-start drag-full-h" filter=".ctx-add" :list="rulesMessage" item-key="key" animation="300">
                  <template #item="{ element }">
                    <div class="item-wrap">
                      <!--        字符串          -->
                      <template v-if="element.SeqType === 1">
                        <div class="ctx-item-box">
                          <div class="item-delete-point" @click="handleDelRule(element)">
                            <img src="./assets/ctx-reduce.svg" :alt="t('common.delText')" />
                          </div>
                          <div class="ctx-item" @click="handleScroll(element)">
                            {{ element.FixedString }}
                          </div>
                        </div>
                      </template>
                      <template v-if="element.SeqType === 2 && element.DateFormat">
                        <!--      date分三种情况 系统日期 指定日期 变量日期            -->
                        <template v-if="element.DateType === 1">
                          <div class="ctx-item-box">
                            <div class="item-delete-point" @click="handleDelRule(element)">
                              <img src="./assets/ctx-reduce.svg" :alt="t('common.delText')" />
                            </div>
                            <div class="ctx-item" @click="handleScroll(element)">
                              {{ dateFormat(DateFormatOption, element) }}
                            </div>
                          </div>
                        </template>
                        <template v-if="element.DateType === 2">
                          <div class="ctx-item-box">
                            <div class="item-delete-point" @click="handleDelRule(element)">
                              <img src="./assets/ctx-reduce.svg" :alt="t('common.delText')" />
                            </div>
                            <div class="ctx-item" @click="handleScroll(element)">
                              {{ dateFormat(DateFormatOption, element) }}
                            </div>
                          </div>
                        </template>
                        <template v-if="element.DateType === 3">
                          <div class="ctx-item-box">
                            <div class="item-delete-point" @click="handleDelRule(element)">
                              <img src="./assets/ctx-reduce.svg" :alt="t('common.delText')" />
                            </div>
                            <div class="ctx-item" @click="handleScroll(element)">
                              {{ dateFormat(DateFormatOption, element) }}
                            </div>
                          </div>
                        </template>
                      </template>
                      <template v-if="element.SeqType === 3">
                        <div class="ctx-item-box">
                          <div class="item-delete-point" @click="handleDelRule(element)">
                            <img src="./assets/ctx-reduce.svg" :alt="t('common.delText')" />
                          </div>
                          <div class="ctx-item" @click="handleScroll(element)">{{ element.showStr }} </div>
                        </div>
                        <!--      变量类型分两种 1、参数型 2、数据库型            -->
                      </template>
                      <template v-if="element.SeqType === 4">
                        <div class="ctx-item-box">
                          <div class="item-delete-point" @click="handleDelRule(element)">
                            <img src="./assets/ctx-reduce.svg" :alt="t('common.delText')" />
                          </div>
                          <div class="ctx-item" @click="handleScroll(element)">{{ element.showStr }} </div>
                        </div>
                        <!--                        <div class="ctx-item">{{ generateRandomString(element.SequenceLength) }} </div>-->
                      </template>

                      <template v-if="element.SeqType === 5">
                        <!--                        <div class="ctx-item">{{ generateRandomString(element.SequenceLength) }} </div>-->
                        <div class="ctx-add">
                          <img :src="ctxAdd" :alt="t('common.add1Text')" @click="handleCtxAddRule" />
                        </div>
                      </template>
                    </div>
                  </template>
                </draggable>
              </div>
            </div>
            <div class="title">
              <TitleStick />
              {{ t('dict.IdgeneratorRule.configureRules') }}
            </div>
          </div>
        </div>
        <div ref="scrollWrapperRef" class="bottom-content">
          <div ref="scrollContentRef" class="scroll-box">
            <draggable :list="rulesMessage" filter="un-draggable" item-key="key" animation="300">
              <!--          <template v-for="item in rulesMessage">-->
              <template #item="{ element }">
                <div v-if="element.SeqType !== 5" class="rule-relative" :data-index="element.key">
                  <div class="rule-order-icon">
                    <img src="./assets/order.svg" :alt="t('common.sort')" />
                  </div>
                  <a-row :gutter="[24, 12]" class="un-draggable" style="margin-bottom: 24px; margin-left: 35px">
                    <a-col :span="3">
                      <a-select
                        style="width: 100%"
                        v-model:value="element.SeqType"
                        @change="handleSeqTypeChange(element)"
                        :placeholder="t('dict.IdgeneratorRule.selectRuleType')">
                        <a-select-option v-for="element in SeqTypeOption" :key="element.enCode" :value="Number(element.enCode)"
                          >{{ element.fullName }}
                        </a-select-option>
                      </a-select>
                    </a-col>
                    <a-col :span="3">
                      <a-select style="width: 100%" v-model:value="element.IsDisplay" :placeholder="t('dict.IdgeneratorRule.codeSegmentDisplayed')">
                        <a-select-option value="true">{{ t('common.display') }}</a-select-option>
                        <a-select-option value="false">{{ t('common.notDisplay') }}</a-select-option>
                      </a-select>
                    </a-col>
                    <!--字符串-->
                    <template v-if="element.SeqType === 1">
                      <a-col :span="6">
                        <a-input v-model:value="element.FixedString" :placeholder="t('dict.IdgeneratorRule.enterFixedString')" />
                      </a-col>
                      <a-col :span="3"></a-col>
                    </template>
                    <!--时间-->
                    <template v-if="element.SeqType === 2">
                      <a-col :span="3">
                        <a-select style="width: 100%" v-model:value="element.DateType" :placeholder="t('dict.IdgeneratorRule.dateType')">
                          <a-select-option v-for="item in DateTypeOption" :key="item.enCode" :value="Number(item.enCode)">
                            {{ item.fullName }}
                          </a-select-option>
                        </a-select>
                      </a-col>
                      <a-col :span="3">
                        <a-select style="width: 100%" v-model:value="element.DateFormat">
                          <a-select-option v-for="item in DateFormatOption" :key="item.enCode" :value="Number(item.enCode)">
                            {{ item.fullName }}
                          </a-select-option>
                        </a-select>
                      </a-col>
                      <!--如果是 年份代码12 | 月份代码13 | 日期代码14 | 周代码15 -->
                      <template
                        v-if="
                          Number(element?.DateFormat) === 11 ||
                          Number(element?.DateFormat) === 12 ||
                          Number(element?.DateFormat) === 13 ||
                          Number(element?.DateFormat) == 14
                        ">
                        <a-col :span="4" v-if="Number(element?.DateFormat) == 11">
                          <a-select style="width: 100%" v-model:value="element.FormatCode">
                            <a-select-option v-for="item in YearCodeOption" :key="item.enCode" :value="item.enCode">
                              {{ item.fullName }}
                            </a-select-option>
                          </a-select>
                        </a-col>
                        <a-col :span="4" v-if="Number(element?.DateFormat) === 12">
                          <a-select style="width: 100%" v-model:value="element.FormatCode">
                            <a-select-option v-for="item in MonthCodeOption" :key="item.enCode" :value="item.enCode">
                              {{ item.fullName }}
                            </a-select-option>
                          </a-select>
                        </a-col>
                        <a-col :span="4" v-if="Number(element?.DateFormat) === 13">
                          <a-select style="width: 100%" v-model:value="element.FormatCode">
                            <a-select-option v-for="item in DayCodeOption" :key="item.enCode" :value="item.enCode">
                              {{ item.fullName }}
                            </a-select-option>
                          </a-select>
                        </a-col>
                        <a-col :span="4" v-if="Number(element?.DateFormat) === 14">
                          <a-select style="width: 100%" v-model:value="element.FormatCode">
                            <a-select-option v-for="item in WeekCodeOption" :key="item.enCode" :value="item.enCode">
                              {{ item.fullName }}
                            </a-select-option>
                          </a-select>
                        </a-col>
                      </template>
                      <a-col v-if="Number(element.DateType) === 2" :order="10" :offset="12" :span="4">
                        <a-date-picker style="width: 100%" show-time v-model:value="element.SpecificDate" valueFormat="YYYY-MM-DD HH:mm:ss" />
                      </a-col>
                      <a-col v-if="Number(element.DateType) === 3" :order="10" :offset="12" :span="4">
                        <a-input v-model:value="element.Parameter" :placeholder="t('dict.IdgeneratorRule.variableTime')"></a-input>
                      </a-col>
                    </template>
                    <!--变量-->
                    <template v-if="element.SeqType === 3">
                      <a-col :span="3">
                        <a-select style="width: 100%" v-model:value="element.VariableType">
                          <a-select-option
                            v-for="item in VariableTypeOption"
                            :key="item.enCode"
                            :value="Number(item.enCode)"
                            :placeholder="t('dict.IdgeneratorRule.selectDBType')"
                            >{{ item.fullName }}
                          </a-select-option>
                        </a-select>
                      </a-col>
                      <a-col :span="3">
                        <a-input
                          :disabled="Number(element.VariableType) === 2"
                          v-model:value="element.Parameter"
                          :placeholder="t('dict.IdgeneratorRule.parameter')"></a-input>
                      </a-col>
                      <a-col :span="4">
                        <a-select v-model:value="element.VariableDirection" style="width: 100%" :placeholder="t('dict.IdgeneratorRule.enterStringDirection')">
                          <a-select-option v-for="item in VariableDirectionOption" :key="item.enCode" :value="Number(item.enCode)"
                            >{{ item.fullName }}
                          </a-select-option>
                        </a-select>
                      </a-col>

                      <a-col :span="4">
                        <a-input v-model:value="element.StartPosition" :placeholder="t('dict.IdgeneratorRule.enterStartPosition')"></a-input>
                      </a-col>
                      <a-col :order="10" :offset="12" :span="4">
                        <a-input-number
                          :controls="false"
                          @change="showStrChange(element, $event)"
                          v-model:value="element.Length"
                          :placeholder="t('dict.IdgeneratorRule.stringLength')"></a-input-number>
                      </a-col>
                      <a-col :order="10" :offset="12" :span="4">
                        <a-input :maxlength="1" v-model:value="element.PaddingChar" :placeholder="t('dict.IdgeneratorRule.supplementaryCharacters')"></a-input>
                      </a-col>

                      <template v-if="Number(element.VariableType) === 2">
                        <a-col :order="10" :offset="12" :span="4">
                          <a-input v-model:value="element.TableName" :placeholder="t('common.tableName')"></a-input>
                        </a-col>
                        <a-col :order="10" :offset="12" :span="4">
                          <a-input v-model:value="element.ColumnName" :placeholder="t('common.fieldName')"></a-input>
                        </a-col>
                        <a-col :order="10" :offset="12" :span="4">
                          <a-input v-model:value="element.WhereClause" :placeholder="t('common.condition')"></a-input>
                        </a-col>
                      </template>
                    </template>
                    <!-- 序列号 -->
                    <template v-if="element.SeqType === 4">
                      <a-col :span="3">
                        <!--                  <a-input v-model:value="element.SequenceType" placeholder="请输入序列号类型"></a-input>-->
                        <a-select v-model:value="element.SequenceType" style="width: 100%" :placeholder="t('dict.IdgeneratorRule.enterStringDirection')">
                          <a-select-option v-for="item in SerialTypeOption" :key="item.enCode" :value="Number(item.enCode)"
                            >{{ item.fullName }}
                          </a-select-option>
                        </a-select>
                      </a-col>
                      <a-col :span="3">
                        <a-input-number
                          :controls="false"
                          @change="showStrChange(element, $event)"
                          v-model:value="element.SequenceLength"
                          :placeholder="t('dict.IdgeneratorRule.size')"></a-input-number>
                      </a-col>
                      <a-col :span="4">
                        <a-select
                          style="width: 100%"
                          :controls="false"
                          v-model:value="element.SequenceStrategy"
                          :placeholder="t('dict.IdgeneratorRule.flowStrategy')">
                          <a-select-option :value="1">{{ t('dict.IdgeneratorRule.forwardFlowingWater') }}</a-select-option>
                          <a-select-option :value="2">{{ t('dict.IdgeneratorRule.reverseFlowWater') }}</a-select-option>
                        </a-select>
                      </a-col>
                      <a-col :order="10" :offset="9" :span="3">
                        <a-input v-model:value="element.Min" :placeholder="t('component.lydc.numberRange.min')"></a-input>
                      </a-col>
                      <a-col :order="10" :pull="4" :offset="13" :span="3">
                        <a-input v-model:value="element.Max" :placeholder="t('component.lydc.numberRange.max')"></a-input>
                      </a-col>
                      <!--                    <a-col :order="10" :offset="10" :span="5">-->
                      <!--                      <a-select v-model:value="element.Radix" style="width: 100%" placeholder="进制类型">-->
                      <!--                        <a-select-option value="32">10进制</a-select-option>-->
                      <!--                        <a-select-option value="10">32进制</a-select-option>-->
                      <!--                      </a-select>-->
                      <!--                    </a-col>-->
                      <a-col :order="10" :offset="9" :span="3">
                        <a-select v-model:value="element.ExcludeType" style="width: 100%" :placeholder="t('dict.IdgeneratorRule.excludeType')">
                          <a-select-option v-for="item in SerialRadiusCodeOption" :key="item.enCode" :value="Number(item.enCode)"
                            >{{ item.fullName }}
                          </a-select-option>
                        </a-select>
                      </a-col>
                      <a-col :order="10" :span="4">
                        <a-input v-model:value="element.Exclude" :placeholder="t('dict.IdgeneratorRule.excludeCharacters')"></a-input>
                      </a-col>
                      <a-col :offset="9" :order="10" :span="4">
                        <div style="font-weight: bolder; font-size: 20px">Base On{{ t('layout.header.setting') }}</div>
                      </a-col>
                      <a-col :offset="9" :order="10" :span="14">
                        <a-transfer
                          :rowKey="record => record.index"
                          v-model:target-keys="element.BaseOnSeqNo"
                          v-model:selected-keys="selectedKeys"
                          :data-source="rulesMessage.filter(item => item.SeqType !== 5)"
                          :titles="['Source', 'Target']"
                          :render="
                            render => {
                              console.log(render);
                              return element.SeqType !== 5
                                ? `${render.index - 1}、${SeqTypeOption.find(item => Number(item.enCode) === element.SeqType)?.fullName}`
                                : null;
                            }
                          " />
                      </a-col>
                    </template>

                    <a-col
                      :order="1"
                      :offset="element.SeqType === 2 ? (element.DateFormat >= 11 ? 4 : 8) : element.SeqType === 4 ? 4 : element.SeqType === 1 ? 5 : 0"
                      :span="4"
                      style="text-align: end">
                      <div class="rule-action-box">
                        <div class="rule-item" @click="handleAddRule(element)">
                          <img src="./assets/rule-add.svg" :alt="t('common.add2Text')" />
                        </div>
                        <div class="rule-item" @click="handleDelRule(element)">
                          <img src="./assets/rule-reduce.svg" :alt="t('common.delText')" />
                        </div>
                      </div>
                    </a-col>
                  </a-row>
                </div>
              </template>
            </draggable>
          </div>
        </div>
        <!--        <div class="bottom-box">-->
        <!--          <div class="bottom-submit">-->
        <!--            &lt;!&ndash;          <a-button>关闭</a-button>&ndash;&gt;-->
        <!--            <a-button style="margin-left: 20px" type="primary" @click="handleSaveAction">保存 </a-button>-->
        <!--          </div>-->
        <!--        </div>-->
        <CookBook ref="cookBookRef" />
      </div>
    </a-spin>
  </BasicPopup>
</template>

<script lang="ts" setup>
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { nextTick, reactive, ref, toRefs } from 'vue';
  import draggable from 'vuedraggable';
  import TitleStick from './titleLeftStick.vue';
  import ctxAdd from './assets/ctx-add.svg';
  import { generateRandomString } from '../utils/generateRandomString';
  import { buildUUID } from '/@/utils/uuid';
  import { getRuleDetail, postSaveRuleDetail } from '/@/api/basicData/encodingSettings';
  import { useBaseStore } from '/@/store/modules/base';
  import { message } from 'ant-design-vue';
  import { dateFormat } from '/@/views/basicData/encodingSettings/utils/extracted';
  import CookBook from './cookBook.vue';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { useI18n } from '/@/hooks/web/useI18n';

  const [registerPopup, { closePopup }] = usePopupInner(init);
  const baseStore = useBaseStore();
  const { hasBtnP } = usePermission();
  const { t } = useI18n();

  const scrollWrapperRef = ref<HTMLDivElement | null>(null);
  const scrollContentRef = ref<HTMLDivElement | null>(null);
  const loading = ref(false);

  interface State {
    listQuery: any;
    systemId: string;
    title: string;
    parentId: string;
    isDevPlatform: boolean;
  }

  const cookBookRef = ref(null);
  const selectedKeys = ref([]);
  let ruleId;

  // 1 固定字符串
  // 2 日期时间
  // 3 变量
  // 4 序列号

  const state = reactive<State>({
    title: t('common.encodingConfiguration'),
    SeqTypeOption: [],
    DateTypeOption: [],
    DateFormatOption: [],
    YearCodeOption: [],
    MonthCodeOption: [],
    WeekCodeOption: [],
    DayCodeOption: [],
    SerialTypeOption: [],
    SerialRadiusCodeOption: [],
    VariableTypeOption: [],
    VariableDirectionOption: [],
    rulesMessage: [],
  });

  const handleScroll = item => {
    console.log(item);
    if (item.SeqType === 5) return;
    // const scrollContent = document.querySelector('.bottom-content')
    const ele = document.querySelector(`[data-index="${item.key}"]`);
    if (ele) {
      ele.scrollIntoView({
        behavior: 'smooth', // 平滑滚动
        block: 'start', // 元素会被定位到视口的顶部
        inline: 'nearest', // 在水平方向上采用最近的位置
      });
    }
  };
  const handleCtxAddRule = () => {
    const rulesMessage = state.rulesMessage || [];
    const length = rulesMessage.length;
    const element = {
      SeqType: 1,
      key: buildUUID(),
      index: length + 1,
      IsDisplay: 'true',
    };
    console.log(element);
    if (Array.isArray(rulesMessage)) {
      rulesMessage.splice(length - 1, 0, element);
      nextTick(() => {
        handleScroll(element);
      });
    }
  };

  const handleAddRule = ele => {
    const index = state.rulesMessage.findIndex(item => item.key === ele.key);
    state.rulesMessage.splice(index + 1, 0, {
      SeqType: 1,
      key: buildUUID(),
      index: state.rulesMessage.length + 1,
    });
    state.rulesMessage = state.rulesMessage.map((item, index) => ({ ...item, sort: index }));
  };
  const handleDelRule = async ele => {
    console.log(state.rulesMessage);
    console.log(ele);
    const index = state.rulesMessage.findIndex(item => item.key === ele.key);
    state.rulesMessage.splice(index, 1);
    state.rulesMessage = state.rulesMessage.map((item, index) => ({ ...item, sort: index }));
  };

  const handleSeqTypeChange = ele => {
    const index = state.rulesMessage.findIndex(item => item.key === ele.key);
    if (ele.SeqType === 4) {
      state.rulesMessage[index].BaseOnSeqNo = [];
      state.rulesMessage[index].disabled = true;
    }
  };
  const getDetailData = async id => {
    loading.value = true;
    const { code, data, msg } = await getRuleDetail(id);
    if (code !== 200) return message.error(msg);
    const list = data.map((item, index) => {
      return {
        ...item,
        index: index + 1 + '',
        disabled: item.SeqType === 4,
        key: buildUUID(),
        showStr: generateRandomString(item.Length || item.SequenceLength),
        BaseOnSeqNo: item.BaseOnSeqNo ? item.BaseOnSeqNo.split(';') : [],
        IsDisplay: typeof item.IsDisplay === 'boolean' ? item.IsDisplay + '' : 'true',
        SequenceStrategy: item.SequenceStrategy || 1,
        sort: index,
      };
    });
    console.log(list);
    list.push({
      index: list.length + 1 + '',
      SeqType: 5,
      disabled: true,
      key: buildUUID(),
    });
    loading.value = false;
    state.rulesMessage = list;
  };
  const showStrChange = (element, e: number) => {
    console.log(e);
    console.log(element);
    element.showStr = generateRandomString(e);
  };
  const handleHelpAction = () => {
    cookBookRef.value.setVisible(true);
  };
  const handleSaveAction = async () => {
    loading.value = true;
    // postSaveRuleDetail
    const { rulesMessage } = state;
    /**
     * SeqType = 1 字符 FixedString
     * SeqType = 2 日期 DateType DateFormat FormatCode
     * SeqType = 3 变量 VariableType VariableDirection StartPosition Length PaddingChar TableName ColumnName WhereClause
     * SeqType = 4 序列号 SequenceType SequenceLength Min Max ExcludeType Exclude BaseOnSeqNo
     */
    const params = [];
    console.log(rulesMessage, 'rulesMessage');
    rulesMessage.forEach((item, index) => {
      if (item.SeqType === 1) {
        params.push({
          RuleId: ruleId,
          SeqNo: index + 1,
          SeqType: 1,
          FixedString: item.FixedString,
        });
      } else if (item.SeqType === 2) {
        params.push({
          RuleId: ruleId,
          SeqNo: index + 1,
          SeqType: 2,
          DateType: item.DateType,
          DateFormat: item.DateFormat,
          FormatCode: item.FormatCode,
          SpecificDate: item.SpecificDate,
          Parameter: item.Parameter,
        });
      } else if (item.SeqType === 3) {
        const val = {
          RuleId: ruleId,
          SeqNo: index + 1,
          SeqType: 3,
          VariableType: item.VariableType,
          Parameter: item.Parameter,
          VariableDirection: item.VariableDirection,
          StartPosition: item.StartPosition,
          Length: item.Length,
          PaddingChar: item.PaddingChar,
          TableName: item.TableName,
          ColumnName: item.ColumnName,
          WhereClause: item.WhereClause,
          SqlField: item.SqlField,
        };
        if (Number(val.VariableType) === 2) {
          val.Parameter = item.Parameter;
        }
        params.push(val);
      } else if (item.SeqType === 4) {
        console.log(item.BaseOnSeqNo, 'item.BaseOnSeqNoitem.BaseOnSeqNoitem.BaseOnSeqNo');
        params.push({
          RuleId: ruleId,
          SeqNo: index + 1,
          SeqType: 4,
          SequenceType: item.SequenceType,
          SequenceLength: item.SequenceLength,
          Min: item.Min,
          Max: item.Max,
          Radix: item.Radix,
          ExcludeType: item.ExcludeType,
          Exclude: item.Exclude,
          BaseOnSeqNo: item.BaseOnSeqNo.filter((v, i) => item.BaseOnSeqNo.indexOf(v) === i)
            .map(item => item - 1)
            .join(';'),
        });
      }
    });
    try {
      const { code, msg } = await postSaveRuleDetail(params);
      if (code !== 200) return message.error(msg);
      message.success(msg);
      closePopup();
    } catch (e) {
    } finally {
      loading.value = false;
    }
  };
  const getSeqTypeOption = () => {
    baseStore.getDictionaryData('IDGeneratorRuleSeqType').then(res => {
      state.SeqTypeOption = res;
    });
    baseStore.getDictionaryData('IDGeneratorRuleDateType').then(res => {
      state.DateTypeOption = res;
    });
    // IDGeneratorRuleDateFormat
    baseStore.getDictionaryData('IDGeneratorRuleDateFormat').then(res => {
      state.DateFormatOption = res;
    });
    baseStore.getDictionaryData('YearCode').then(res => {
      state.YearCodeOption = res;
    });
    baseStore.getDictionaryData('MonthCode').then(res => {
      state.MonthCodeOption = res;
    });
    baseStore.getDictionaryData('WeekCode').then(res => {
      state.WeekCodeOption = res;
    });
    baseStore.getDictionaryData('DayCode').then(res => {
      state.DayCodeOption = res;
    });
    baseStore.getDictionaryData('IDGeneratorRuleSequenceType').then(res => {
      state.SerialTypeOption = res;
    });
    baseStore.getDictionaryData('IDGeneratorRuleExcludeType').then(res => {
      state.SerialRadiusCodeOption = res;
    });
    baseStore.getDictionaryData('IDGeneratorRuleVariableType').then(res => {
      state.VariableTypeOption = res;
    });
    baseStore.getDictionaryData('IDGeneratorRuleVariableDirection').then(res => {
      state.VariableDirectionOption = res;
    });
  };

  function init(data) {
    getDetailData(data.id);
    ruleId = data.id;
    getSeqTypeOption();
  }

  const {
    title,
    SeqTypeOption,
    rulesMessage,
    DateTypeOption,
    DateFormatOption,
    YearCodeOption,
    MonthCodeOption,
    WeekCodeOption,
    DayCodeOption,
    SerialTypeOption,
    SerialRadiusCodeOption,
    VariableTypeOption,
    VariableDirectionOption,
  } = toRefs(state);
</script>

<style lang="less" scoped>
  .rules-wrap {
    .top-fixed {
      background: #fff;
      padding: 20px 42px;
      height: 196px;
      width: 100%;
      box-shadow: 0 5px 15px -3px rgb(0 0 0 / 12%), 0 5px 12px -3px rgb(0 0 0 / 15%), 0 2px 4px -3px rgb(0 0 0 / 25%);

      .title {
        display: flex;
        flex-direction: row;
        align-items: center;
        color: #1a1a1a;
        font-size: 14px;
        font-style: normal;
        font-weight: 700;
        line-height: 22px;
      }
    }

    .bottom-content {
      z-index: 1;
      height: 57vh;
      overflow-x: hidden;
      //height: max-content;
      //overflow: auto;
      margin-top: 20px;

      //.scroll-box {
      //  overflow: auto;
      //  overflow-x: hidden;
      //}

      //.test {
      //  height: 300px;
      //  width: 100%;
      //}
    }
  }

  .ctx-preview {
    display: flex;
    flex-flow: row wrap;
    align-items: center;
    margin: 20px 0;

    .ctx-add {
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      margin-bottom: 8px;
    }
  }

  .drag-full-h {
    width: 100%;
    flex-wrap: wrap;
  }

  // 单据号top的样式
  .ctx-block {
    display: flex;
    flex-flow: row wrap;

    .ctx-item {
      display: flex;
      height: 48px;
      min-width: 48px;
      padding: 0 12px;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      border-radius: 4px;
      background: #f0f0f0;
      font-weight: bolder;
      font-size: 24px;
      letter-spacing: 5px;
      transition: all 2s;
    }
  }

  .item-wrap {
    cursor: pointer;
    user-select: none;
    margin-left: 10px;
    margin-right: 10px;
    margin-bottom: 8px;
  }

  .rule-item {
    cursor: pointer;
  }

  .rule-action-box {
    display: flex;
    flex-direction: row;

    .rule-item {
      width: 34px;
      height: 34px;

      img {
        width: 100%;
        height: 100%;
      }
    }

    .rule-item:first-child {
      margin-right: 16px;
    }
  }

  .rule-order-icon {
    position: absolute;
    padding: 11px 10px 12px;
    margin-left: 10px;
    display: inline-block;
    cursor: pointer;

    img {
      width: 14px;
      height: 11px;
    }
  }

  .rule-relative {
    position: relative;
  }

  .bottom-box {
    position: relative;
    background: #fff;
    box-shadow: 0 -5px 15px -3px rgb(0 0 0 / 12%), 0 -5px 12px -3px rgb(0 0 0 / 15%), 0 -2px 4px -3px rgb(0 0 0 / 25%);
  }

  .bottom-submit {
    display: flex;
    bottom: 0;
    height: 66px;
    width: 100%;
    padding: 16px;
    flex-direction: row;
    justify-content: flex-end;
  }

  .title-help {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }

  .help {
    width: 34px;
    height: 34px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }

  .ctx-item-box {
    position: relative;
  }

  .item-delete-point {
    position: absolute;
    top: -5px;
    right: -5px;
  }
</style>
