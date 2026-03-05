<template>
  <div class="lydc-content-wrapper icons-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-search-box">
        <BasicForm class="search-form" @register="registerForm" @submit="handleSubmit" @reset="handleReset"></BasicForm>
      </div>

      <div class="lydc-content-wrapper-content bg-white">
        <a-tabs v-model:activeKey="activeKey" type="card" class="lydc-content-wrapper-tabs" v-loading="isLoadingIcon">
          <a-tab-pane key="3">
            <template #tab>
              ymDiecut图标(svg)
              <a-tooltip title="点击复制svg类,右键可复制icon类名">
                <i class="ym-diecut ym-diecut-help-circle text-[gray]"></i>
              </a-tooltip>
            </template>
            <ScrollContainer>
              <a-row>
                <a-col
                  :span="6"
                  v-for="item in computed_IconList"
                  :key="item"
                  @contextmenu="handleRightClick(item, $event)"
                  @click="handleCopy('#' + item)"
                  :title="item"
                  class="icon-item">
                  <SvgIcon class="mr-16px svg-icon" size="22" :name="'#' + item" />
                  <span>{{ item }}</span>
                </a-col>
              </a-row>
            </ScrollContainer>
          </a-tab-pane>
          <a-tab-pane key="1" tab="ymIcon图标">
            <ScrollContainer>
              <a-row>
                <a-col :span="6" v-for="item in computed_IconList" :key="item" @click="handleCopy('icon-ym ' + item)" :title="item" class="icon-item">
                  <i :class="'icon-ym ' + item" />
                  <span>{{ item }}</span>
                </a-col>
              </a-row>
            </ScrollContainer>
          </a-tab-pane>
          <a-tab-pane key="2" tab="ymCustom图标">
            <ScrollContainer>
              <a-row>
                <a-col :span="6" v-for="item in computed_IconList" :key="item" @click="handleCopy('ym-custom ' + item)" :title="item" class="icon-item">
                  <i :class="'ym-custom ' + item" />
                  <span>{{ item }}</span>
                </a-col>
              </a-row>
            </ScrollContainer>
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { reactive, toRefs, watch, unref, onMounted, computed, ref } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { ymIconJson } from '/@/components/Lydc/IconPicker/data/ymIcon';
  import { ymCustomJson } from '/@/components/Lydc/IconPicker/data/ymCustom';
  import { useCopyToClipboard } from '/@/hooks/web/useCopyToClipboard';
  import { ScrollContainer } from '/@/components/Container';
  import { SvgIcon } from '/@/components/Icon';

  const ymIcon = ymIconJson.glyphs.map(o => `icon-ym-${o.font_class}`);
  const ymCustom = ymCustomJson.glyphs.map(o => `ym-custom-${o.font_class}`);
  const ymDiecutList = getAllSymolId();

  const { createMessage } = useMessage();
  const [registerForm, { resetFields }] = useForm({
    baseColProps: { span: 6 },
    showActionButtonGroup: true,
    showAdvancedButton: true,
    compact: true,
    schemas: [
      {
        field: 'keyword',
        label: '关键词',
        component: 'Input',
        componentProps: {
          placeholder: '请输入关键词',
          submitOnPressEnter: true,
        },
      },
    ],
  });
  const isLoadingIcon = ref(false);

  const state = reactive({
    activeKey: '3',
    keyword: '',
    ymIconList: ymIcon,
    ymCustomList: ymCustom,
    ymDiecutList: ymDiecutList,
  });
  const { activeKey } = toRefs(state);

  watch(
    () => state.activeKey,
    () => {
      resetFields();
    },
  );

  function handleSubmit({ keyword }) {
    state.keyword = keyword || '';
  }
  function handleReset() {
    state.keyword = '';
  }

  const computed_IconList = computed(() => {
    let showList = [];
    const iconKeys = {
      '1': 'ymIcon',
      '2': 'ymCustom',
      '3': 'ymDiecut',
    };
    const key = iconKeys[state.activeKey];
    const keyWord = state.keyword.replace('#', '') || '';
    if (!keyWord) {
      return state[key + 'List'];
    }
    showList = state[key + 'List'].filter(o => o.includes(keyWord));
    isLoadingIcon.value = false;
    return showList;
  });

  function handleRightClick(item, event) {
    if (event && event.type === 'contextmenu') {
      event.preventDefault();
    }
    item = item.replace('icon-', 'ym-diecut ym-diecut-');
    const { isSuccessRef } = useCopyToClipboard(item);
    unref(isSuccessRef) && createMessage.success('复制成功');
  }

  function handleCopy(item) {
    const { isSuccessRef } = useCopyToClipboard(item);
    unref(isSuccessRef) && createMessage.success('复制成功');
  }

  // 改从window获取所有symbolId
  function getAllSymolId() {
    const allSymbolTag = document.querySelectorAll('symbol');
    if (!allSymbolTag.length) return;
    const allSymbolId: any = [];
    allSymbolTag.forEach(icon => {
      allSymbolId.push(icon.id);
    });
    return allSymbolId;
  }

  onMounted(() => {
    handleReset();
  });
</script>
<style lang="less" scoped>
  .icons-wrapper {
    .icon-item {
      padding: 0 10px;
      height: 40px;
      // line-height: 38px;
      border: 1px dashed transparent;
      color: #6b7a99;
      cursor: pointer;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      display: flex;
      align-items: center;

      i {
        font-size: 16px;
        line-height: 40px;
        margin-right: 14px;
        vertical-align: top;
      }

      span {
        line-height: 40px;
        vertical-align: top;
      }

      &:hover {
        border-color: @primary-color;

        i {
          font-size: 30px;
        }

        .svg-icon {
          transform: scale(1.4);
          // transition: all 0.1s ease-in-out;
        }
      }
    }
  }
</style>
