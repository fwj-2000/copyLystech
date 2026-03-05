<template>
  <div class="lydc-content-wrapper" id="popupwrap">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <a-tabs v-model:activeKey="activeKey" class="lydc-content-wrapper-tabs" style="height: 100%" destroyInactiveTabPane>
          <a-tab-pane :key="0" :tab="t('common.unbuildOrder')" style="height: 100%">
            <Uncreated ref="uncreatedRef"></Uncreated>
          </a-tab-pane>
          <a-tab-pane :key="3" :tab="t('common.submitTodo')" style="height: 100%">
            <SubmitTodo ref="submitTodoRef"></SubmitTodo>
          </a-tab-pane>
          <a-tab-pane :key="1" :tab="t('common.builtOrder')" style="height: 100%">
            <Createded ref="creatededRef"></Createded>
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, nextTick } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useRouteParams } from '/@/hooks/core/useRouteParams';
  import { getDetail } from '/@/api/customerSerivce/customsAffairsApply';
  import { STATUS_ENUM } from './config';

  import Uncreated from './components/uncreated/index.vue';
  import Createded from './components/created/index.vue';
  import SubmitTodo from './components/submitTodo/index.vue';

  defineOptions({ name: 'customerService-filings-demand' });

  const creatededRef = ref<InstanceType<typeof Createded>>();
  const uncreatedRef = ref<InstanceType<typeof Uncreated>>();
  const submitTodoRef = ref<InstanceType<typeof SubmitTodo>>();

  const { t } = useI18n();
  const activeKey = ref<0 | 1 | 3>(0);

  useRouteParams({ id: {} }, params => {
    const { id } = params;
    if (id) {
      getDetail(id).then(res => {
        if (res.data.status === STATUS_ENUM.已建单) {
          activeKey.value = 1;
          nextTick(() => {
            creatededRef.value && creatededRef.value.openDetail({ id });
          });
        } else if (res.data.status === STATUS_ENUM.待提交) {
          activeKey.value = 3;
          nextTick(() => {
            submitTodoRef.value &&
              submitTodoRef.value.openDetail(true, {
                type: 'add',
                title: t('common.editText'),
                list: [id],
                canAddData: false,
              });
          });
        } else {
          uncreatedRef.value &&
            uncreatedRef.value.openDetail(true, {
              type: 'add',
              title: t('common.create'),
              list: [id],
            });
        }
      });
    }
  });

  // const props = withDefaults(
  //   defineProps<{
  //     updateCheckUrl: string;
  //   }>(),
  //   {
  //     updateCheckUrl: window.location.host || '/',
  //     // updateCheckUrl: import.meta.env.VITE_GLOB_API_URL || '/',
  //   },
  // );
  // const fetchUpdateStatus = async () => {
  //   console.log(props.updateCheckUrl, 'fetchUpdateStatus');
  //   const response = await fetch(props.updateCheckUrl || '/', {
  //     cache: 'no-cache',
  //     method: 'HEAD',
  //     mode: 'cors', // 如果跨域请求，需要设置mode为'cors'
  //     credentials: 'same-origin', // 根据需要设置，如果需要携带cookie等凭证
  //   });
  //   console.log(response, 'response');
  // };
  // fetchUpdateStatus();
</script>
<style lang="less">
  .ant-tabs-content {
    height: 100%;

    & > div {
      height: 100%;
    }
  }

  .ant-tabs-nav-list {
    padding-left: 20px;
  }
</style>
