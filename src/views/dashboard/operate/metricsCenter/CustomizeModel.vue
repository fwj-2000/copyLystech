<!-- 自定义显示全屏弹窗 -->
<template>
  <a-modal v-model:open="visible" v-bind="modelOptions" width="100%" wrapClassName="fullscreen-modal">
    <!-- 头部信息 -->
    <div class="header-container flex ct-start">
      <div class="left-container flex">
        <a-button type="normal" class="w-150px">自定义视图</a-button>
      </div>
      <div class="right-container flex ct-between">
        <div class="left-side">你可对模块进行添加、拖拽、</div>
        <div class="right-side">
          <a-button type="text" @click="restoreList">
            <template #icon>
              <img :src="freshSvg" class="btn-icon" />
            </template>
            恢复默认
          </a-button>
          <a-button type="text" @click="cleanList">
            <template #icon>
              <img :src="eraserSvg" class="btn-icon" />
            </template>
            清空</a-button
          >
          <a-button @click="handleCancel">取消</a-button>
          <a-button type="primary" @click="saveList">保存</a-button>
        </div>
      </div>
    </div>
    <!-- 内容区域 -->
    <div class="content-container flex">
      <div class="left-content">
        <div class="item tool-item flex ct-between">
          <p>隐藏已添加模块</p>
          <a-switch v-model:checked="hideModule" />
        </div>
        <div v-for="item in moduleNames" :key="item.id" class="item flex ct-between">
          <p>{{ item.name }}</p>
          <a-button type="text" size="small" @click="handleToggleHide(item.id)">
            <img :src="item.show ? closeSvg : plusSvg" class="icon close" />
          </a-button>
        </div>
      </div>
      <div class="right-content">
        <!-- 可拖拽组件 -->
        <Content :list="props.list" @hide="handleToggleHide" :queryInfo="props.queryInfo"> </Content>
      </div>
    </div>
    <!-- end -->
  </a-modal>
</template>
<script setup lang="ts">
  import { computed, ref } from 'vue';
  import Content from './Content/index.vue';
  import plusSvg from '/@/assets/svg/report/plus.svg';
  import closeSvg from '/@/assets/svg/report/close.svg';
  import freshSvg from '/@/assets/svg/report/fresh.svg';
  import eraserSvg from '/@/assets/svg/report/eraser.svg';

  import { addViewSetting } from '/@/api/dashbord/operate';
  import { CustomCompoInfo } from './types';
  import { defineEmits } from 'vue';
  import { cloneDeep } from 'lodash-es';

  export interface CustomizeModelExposed {
    showModal: () => void;
  }

  const emits = defineEmits(['restore', 'updateConfig']);

  const props = defineProps({
    list: {
      type: Array<CustomCompoInfo>,
      default: () => [],
    },
    queryInfo: {
      type: Object,
      default: () => ({}),
    },
  });
  const modelOptions = ref<any>({
    footer: null,
    closable: false,
  });
  const visible = ref<boolean>(false);
  const hideModule = ref<boolean>(true);

  const moduleNames = computed(() => {
    const current = cloneDeep(props.list);
    return hideModule.value ? current.filter(item => !item.show) : current;
  });

  // 保存列表
  const saveList = () => {
    // 将配置信息保存到本地
    const config = props.list.map(item => ({
      id: item.id,
      show: item.show,
    }));
    addViewSetting({ Config: JSON.stringify(config) }).then(() => {
      hideModal();
      emits('updateConfig', config);
    });
  };

  // 取消保存
  const handleCancel = () => {
    restoreList();
    hideModal();
  };

  // 恢复默认列表
  const restoreList = () => {
    emits('restore');
  };

  // 清空列表
  const cleanList = () => {
    props.list.forEach(item => (item.show = false));
  };

  // 切换隐藏显示组件
  const handleToggleHide = id => {
    const idx = props.list.findIndex(item => item.id === id);
    if (idx !== -1) {
      props.list[idx].show = !props.list[idx].show;
    }
  };

  const showModal = () => {
    visible.value = true;
  };
  const hideModal = () => {
    visible.value = false;
  };

  defineExpose({
    showModal,
  });
</script>
<style lang="less" scoped>
  @leftContentWidth: 200px;
  @headerHeight: 50px;

  .fullscreen-modal {
    .content-container {
      height: calc(100vh - @headerHeight);
      padding: 13px 16px 13px 0;

      .left-content {
        width: @leftContentWidth;
        height: 100%;
        padding: 0 8px;

        .item {
          width: 100%;
          padding: 12px 16px;
          color: #1a1a1a;
          font-size: 12px;
          font-style: normal;
          font-weight: 400;
          line-height: 22px;

          &.tool-item {
            font-size: 14px;
            border-bottom: 1px solid #e6e6e6;
          }

          .icon {
            cursor: pointer;
          }
        }
      }

      .right-content {
        width: calc(100% - @leftContentWidth);
        height: 100%;
        overflow-y: auto;
        padding: 16px;
        background: #fff;
        border-radius: 8px;
      }
    }

    .header-container {
      height: @headerHeight;
      background-color: #fff;

      .right-container {
        width: calc(100% - @leftContentWidth);
        padding: 0 16px 0 0;

        .right-side {
          .ant-btn {
            margin-right: 12px;

            .btn-icon {
              display: inline-block;
              margin: 0 8px 2px 0;
              vertical-align: text-bottom;
            }

            &:last-child {
              margin-right: 0;
            }
          }
        }

        .left-side {
          color: #666;
          font-size: 12px;
          font-style: normal;
          font-weight: 400;
          line-height: normal;
        }
      }

      .left-container {
        width: @leftContentWidth;
        height: 100%;
      }
    }
  }
</style>
