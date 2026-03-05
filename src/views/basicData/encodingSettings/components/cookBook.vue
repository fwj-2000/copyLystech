<template>
  <a-modal :forceRender="true" :footer="null" v-model:open="visible" :width="788" class="modal-wrapper">
    <a-tabs class="wrapper">
      <!--    <a-tabs v-model:activeKey="activeKey">-->
      <a-tab-pane key="1" :tab="t('dict.IdgeneratorRule.help.tab1')">
        <a-table bordered :pagination="false" :dataSource="dataSource" :columns="columns" :scroll="{ y: 563 }" />
      </a-tab-pane>
      <a-tab-pane key="2" :tab="t('dict.IdgeneratorRule.help.tab2')" force-render>
        <div class="variable-message">
          <p class="title">{{ t('dict.IdgeneratorRule.help.parametricVariable') }}</p>
          <div class="message">{{ t('dict.IdgeneratorRule.help.needIdTip') }}</div>
          <p class="title">{{ t('dict.IdgeneratorRule.help.databaseVariable') }}</p>
          <div class="message">{{ t('dict.IdgeneratorRule.help.searchSettingTip') }}</div>
          <p class="title">{{ t('dict.IdgeneratorRule.help.variableSettingFollowingTip') }}</p>
          <div class="message">
            <span class="sun-color">·{{ t('common.direction') }}：</span>
            <span class="content">{{ t('dict.IdgeneratorRule.help.stringDirectionTip1') }}<br /></span>

            <span class="sun-color">·{{ t('dict.IdgeneratorRule.enterStartPosition') }}：</span>
            <span class="content">{{ t('dict.IdgeneratorRule.help.stringDirectionTip2') }}<br /></span>

            <span class="sun-color">·{{ t('common.length') }}：</span>
            <span class="content"
              >{{ t('dict.IdgeneratorRule.help.stringDirectionTip3') }}<span style="color: #ff4d4f">{{ t('dict.IdgeneratorRule.help.mustBeSpecified') }}</span
              ><br
            /></span>

            <span class="sun-color">·{{ t('dict.IdgeneratorRule.supplementaryCharacters') }}：</span>
            <span class="content"
              >{{ t('dict.IdgeneratorRule.help.supplementaryCharactersTip')
              }}<span style="color: #ff4d4f">{{ t('dict.IdgeneratorRule.help.mustBeSpecified') }}</span
              ><br
            /></span>
          </div>
        </div>
      </a-tab-pane>
      <a-tab-pane key="3" :tab="t('dict.IdgeneratorRule.help.tab3')">
        <div class="variable-message">
          <p class="title">{{ t('dict.IdgeneratorRule.help.parametricVariable') }}</p>
          <div class="message">
            <ul>
              <li>{{ t('dict.IdgeneratorRule.help.parametricVariableTip1') }}</li>
              <li>{{ t('dict.IdgeneratorRule.help.parametricVariableTip2') }}</li>
              <li>{{ t('dict.IdgeneratorRule.help.parametricVariableTip3') }}</li>
              <li>{{ t('dict.IdgeneratorRule.help.parametricVariableTip4') }}</li>
              <li
                >{{ t('dict.IdgeneratorRule.help.parametricVariableTip5')
                }}<span style="color: #ff4d4f">{{ t('dict.IdgeneratorRule.help.parametricVariableTip6') }}</span></li
              >
              <li
                >{{ t('dict.IdgeneratorRule.help.parametricVariableTip7')
                }}<span style="color: #ff4d4f">{{ t('dict.IdgeneratorRule.help.parametricVariableTip8') }}</span></li
              >
            </ul>
          </div>
          <p class="title">{{ t('dict.IdgeneratorRule.help.otherSettings') }}</p>
          <div class="message sun">
            <ul>
              <li
                >{{ t('dict.IdgeneratorRule.size') }}：<span style="color: #666">{{ t('dict.IdgeneratorRule.help.sequenceTip1') }}</span
                ><span style="color: #999">{{ t('dict.IdgeneratorRule.help.sequenceTip2') }}</span
                ><span style="color: #ff4d4f">{{ t('dict.IdgeneratorRule.help.mustBeSpecified') }}</span></li
              >
              <li
                >{{ t('component.lydc.numberRange.min') }}：<span style="color: #666">{{ t('dict.IdgeneratorRule.help.minTip') }}</span
                ><span style="color: #999">{{ t('dict.IdgeneratorRule.help.sequenceTip2') }}</span></li
              >
              <li
                >{{ t('component.lydc.numberRange.max') }}：<span style="color: #666">{{ t('dict.IdgeneratorRule.help.maxTip') }}</span
                ><span style="color: #999">{{ t('dict.IdgeneratorRule.help.sequenceTip2') }}</span></li
              >
              <li
                >{{ t('dict.IdgeneratorRule.excludeCharacters') }}：<span style="color: #666">{{ t('dict.IdgeneratorRule.help.excludeCharactersTip1') }}</span
                ><span style="color: #999">{{ t('dict.IdgeneratorRule.help.excludeCharactersTip2') }}</span></li
              >
              <li
                >{{ t('dict.IdgeneratorRule.excludeType') }}：<span style="color: #666">{{ t('dict.IdgeneratorRule.help.excludeTypeTip1') }}</span
                ><span style="color: #999">{{ t('dict.IdgeneratorRule.help.excludeTypeTip2') }}</span
                ><span style="color: #666">{{ t('dict.IdgeneratorRule.help.excludeTypeTip3') }}</span
                ><span style="color: #999">{{ t('dict.IdgeneratorRule.help.excludeTypeTip4') }}</span
                >{{ t('dict.IdgeneratorRule.help.excludeTypeTip5') }}</li
              >
            </ul>
          </div>
        </div>
      </a-tab-pane>
    </a-tabs>
    <template #title>
      <div class="title-box">
        <TitleStick />
        <div class="modal-title">{{ t('commom.help') }}</div>
      </div>
    </template>
  </a-modal>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import TitleStick from '/@/views/basicData/encodingSettings/components/titleLeftStick.vue';

  import { useI18n } from '/@/hooks/web/useI18n';

  const { t } = useI18n();

  const dataSource = [
    {
      key: '1',
      FormatString: 'yyyy',
      Description: t('dict.IDGeneratorRuleDateFormat.1'),
      Remake: t('dict.IdgeneratorRule.help.dateFormatTip1'),
    },
    {
      key: '2',
      FormatString: 'yy',
      Description: t('dict.IDGeneratorRuleDateFormat.2'),
      Remake: t('dict.IdgeneratorRule.help.dateFormatTip2'),
    },
    {
      key: '3',
      FormatString: 'MM',
      Description: t('dict.IDGeneratorRuleDateFormat.3'),
      Remake: t('dict.IdgeneratorRule.help.dateFormatTip3'),
    },
    {
      key: '4',
      FormatString: 'M',
      Description: t('dict.IDGeneratorRuleDateFormat.4'),
      Remake: t('dict.IdgeneratorRule.help.dateFormatTip4'),
    },
    {
      key: '5',
      FormatString: 'dd',
      Description: t('dict.IDGeneratorRuleDateFormat.5'),
      Remake: t('dict.IdgeneratorRule.help.dateFormatTip5'),
    },
    {
      key: '6',
      FormatString: 'ww',
      Description: t('dict.IDGeneratorRuleDateFormat.6'),
      Remake: t('dict.IdgeneratorRule.help.dateFormatTip6'),
    },
    {
      key: '7',
      FormatString: 'hh',
      Description: t('dict.IDGeneratorRuleDateFormat.7'),
      Remake: t('dict.IdgeneratorRule.help.dateFormatTip7'),
    },
    {
      key: '8',
      FormatString: 'HH',
      Description: t('dict.IDGeneratorRuleDateFormat.8'),
      Remake: t('dict.IdgeneratorRule.help.dateFormatTip8'),
    },
    {
      key: '10',
      FormatString: 'mm',
      Description: t('dict.IDGeneratorRuleDateFormat.9'),
      Remake: t('dict.IdgeneratorRule.help.dateFormatTip9'),
    },
    {
      key: '11',
      FormatString: 'ss',
      Description: t('dict.IDGeneratorRuleDateFormat.10'),
      Remake: t('dict.IdgeneratorRule.help.dateFormatTip10'),
    },
  ];
  const columns = [
    {
      title: t('dict.IdgeneratorRule.help.formatString'),
      dataIndex: 'FormatString',
      key: 'key',
    },
    {
      title: t('dict.IdgeneratorRule.help.description'),
      dataIndex: 'Description',
      key: 'Description',
    },
    {
      title: t('dict.IdgeneratorRule.help.remake'),
      dataIndex: 'Remake',
      key: 'Remake',
    },
  ];
  const visible = ref<boolean>(false);
  const setVisible = (e: boolean) => {
    visible.value = e;
  };

  defineExpose({
    setVisible,
  });
</script>

<style lang="less" scoped>
  .title-box {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-left: 20px;

    .modal-title {
      // color: var(---, #1a1a1a);
      color: #1a1a1a;
      // font-size: var(---M, 16px);
      font-size: 16px;
      font-style: normal;
      font-weight: 700;
      // line-height: var(---16, 24px); /* 150% */
      line-height: 24px; /* 150% */
    }
  }

  .wrapper {
    padding: 20px 36px;
    height: 720px;
  }

  .title {
    display: inline-flex;
    align-items: center;
    // gap: var(---S, 8px);
    gap: 8px;
    color: #1a1a1a;
  }

  .message {
    // color: var(---, #666);
    color: #666;

    // font-size: var(---, 14px);
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    // line-height: var(---14, 22px); /* 157.143% */
    line-height: 22px; /* 157.143% */
    margin: 8px 0 28px;
  }

  .sun-color {
    // color: var(---, #FF7B00);
    color: #ff7b00;
  }

  li {
    list-style-type: disc;
    margin-left: 20px;
  }

  .sun {
    ul {
      color: #ff7b00;
    }

    ul li {
      list-style-type: disc;
      margin-left: 20px;
    }
  }
</style>
