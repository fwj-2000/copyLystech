<template>
  <div :class="prefixCls">
    <div class="flex items-center absolute right-4 top-4">
      <!--      <AppDarkModeToggle class="enter-x mr-2" v-if="!sessionTimeout" />-->
    </div>
    <div class="login-header">
      <a class="login-company-logo" target="_blank" href="https://www.lingyiitech.com">
        <img class="login-company-logo-img -enter-x" src="/@/assets/images/logo.png" alt="" />
      </a>
      <AppLocalePicker v-if="getShowLocalePicker" :showText="true" :ignoreLogin="true" :class="`${prefixCls}-action__item`">
        <template #suffix>
          <DownOutlined class="icon-more" />
        </template>
      </AppLocalePicker>
    </div>
    <div class="login-content">
      <!-- <div class="login-left hidden xl:block">
        <LoginFormTitle class="-enter-x" />
        <img class="login-banner -enter-x" src="../../../assets/images/login-banner.png" alt="" />
      </div> -->
      <div :class="`${prefixCls}-form`" class="enter-x h-560px xl:h-full">
        <!-- <LoginFormTitle class="-enter-x xl:hidden" /> -->
        <LoginForm />
      </div>
    </div>
    <div class="copyright">{{ getSysConfig.copyright }}</div>
  </div>
</template>
<script lang="ts" setup>
  import { computed } from 'vue';
  // import { AppDarkModeToggle } from '/@/components/Application';
  // import LoginFormTitle from './LoginFormTitle.vue';
  import LoginForm from './LoginForm.vue';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { useAppStore } from '/@/store/modules/app';
  import { useLocale } from '/@/locales/useLocale';
  import { DownOutlined } from '@ant-design/icons-vue';
  import AppLocalePicker from '/@/components/Application/src/AppLocalePicker.vue';

  defineProps({
    sessionTimeout: {
      type: Boolean,
    },
  });

  const { prefixCls } = useDesign('login-container');
  const appStore = useAppStore();
  const { getShowLocalePicker } = useLocale();

  const getSysConfig = computed(() => appStore.getSysConfigInfo);
</script>
<style lang="less">
  @import url('./index.less');
</style>
