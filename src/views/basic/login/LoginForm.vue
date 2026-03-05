<template>
  <div class="login-cap">{{ t('sys.login.name') }}</div>
  <div class="login-sub-title">{{ !isSso && !ssoLoading ? t('sys.login.subTitle') : '' }}</div>
  <div v-show="!isSso && !ssoLoading">
    <Form class="enter-x" :model="formData" :rules="getFormRules" ref="formRef">
      <p class="login-label">{{ t('sys.login.account') }}</p>
      <FormItem name="account" class="enter-x">
        <Input size="large" v-model:value="formData.account" :placeholder="t('sys.login.username')" class="fix-auto-fill cus-btn" @blur="onAccountChange">
          <template #prefix>
            <user-outlined type="user" :style="{ fontSize: '12px', color: '#999' }" />
          </template>
        </Input>
      </FormItem>
      <p class="login-label">{{ t('sys.login.passwordText') }}</p>
      <FormItem name="password" class="enter-x">
        <InputPassword size="large" v-model:value="formData.password" class="cus-btn" :placeholder="t('sys.login.password')">
          <template #prefix>
            <lock-outlined :style="{ fontSize: '12px', color: '#999' }" />
          </template>
        </InputPassword>
      </FormItem>
      <FormItem name="code" class="enter-x" v-if="state.needCode">
        <a-row type="flex" justify="space-between">
          <a-col class="sms-input">
            <a-input v-model:value="formData.code" :placeholder="t('sys.login.codeTip')" name="code" size="large" />
          </a-col>
          <a-col class="sms-right">
            <a-tooltip :content="$t('sys.login.changeCode')" placement="bottom">
              <img class="codeImg" :alt="$t('sys.login.changeCode')" :src="apiUrl + codeImgUrl" @click="handleChangeImg" />
            </a-tooltip>
          </a-col>
        </a-row>
      </FormItem>
      <a-row type="flex" justify="space-between">
        <a-col class="password-extend"
          ><a-checkbox v-model:checked="formData.rember">{{ $t('sys.login.rememberPassword') }}</a-checkbox></a-col
        >
        <!-- <a-col class="password-extend forget" @click="handleForgetPassword">{{ $t('sys.login.forgetPassword') }}</a-col> -->
      </a-row>
      <div class="pt-10px">
        <FormItem class="enter-x">
          <Button type="primary" size="large" block @click="handleLogin" :loading="loading">
            {{ t('sys.login.loginButton') }}
          </Button>
        </FormItem>
      </div>
    </Form>
    <QrCodeForm v-if="activeTab == 2" />
    <div class="socials-box" v-if="socialsList.length">
      <a-divider>{{ t('sys.login.otherLogin') }}</a-divider>
      <div class="socials-list">
        <a-tooltip :title="item.name + '登录'" v-for="(item, i) in socialsList" :key="i">
          <div class="socials-item" @click="handleOtherLogin(item.enname)"><i :class="item.icon" /></div>
        </a-tooltip>
      </div>
    </div>
  </div>
  <a-button type="primary" class="sso-login-btn enter-x" size="large" :loading="loading" @click="handleSsoLogin" v-show="isSso && !ssoLoading">登录</a-button>

  <BasicModal v-bind="$attrs" @register="registerSsoModal" title="登录" :footer="null" :width="1000" class="lydc-sso-modal" :closeFunc="onSsoModalClose">
    <iframe width="100%" height="100%" :src="ssoUrl" v-if="showIframe"></iframe>
  </BasicModal>
  <BasicModal v-bind="$attrs" @register="registerTenantSocialModal" :closable="false" :footer="null" :width="700" class="lydc-tenant-social-modal">
    <div class="other-main">
      <div class="other-title">
        <div class="other-icon"><i class="icon-ym icon-ym-user" /></div>
        <div class="other-text">请选择登录账号</div>
      </div>
      <div class="other-body">
        <a-row :gutter="20">
          <a-col :span="12" v-for="(item, i) in tenantSocialList" :key="i">
            <div @click="handleSocialLogin(item)">
              <a-card hoverable class="other-login-card">
                <div class="other-login-des other-login-title">{{ item.socialName }}</div>
                <div class="other-login-des">租户名称：{{ item.tenantName }}</div>
                <div class="other-login-des">租户ID：{{ item.tenantId }}</div>
                <div class="other-login-des">账号ID：{{ item.accountName }}</div>
              </a-card>
            </div>
          </a-col>
        </a-row>
      </div>
    </div>
  </BasicModal>
  <BasicModal v-bind="$attrs" @register="registerSocialsModal" title="登录" :width="700" :footer="null" :show-cancel-btn="false" :show-ok-btn="false">
    <iframe width="100%" height="600" :src="redirectUrl"></iframe>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { reactive, ref, onMounted, toRefs, onUnmounted, nextTick, unref } from 'vue';
  import { Form, Input, Button } from 'ant-design-vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useGlobSetting } from '/@/hooks/setting';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useUserStore } from '/@/store/modules/user';
  import { useFormRules, useFormValid } from './useLogin';
  import { encryptByMd5 } from '/@/utils/cipher';
  import { onKeyStroke } from '@vueuse/core';
  import { getLoginConfig, getTicket, getTicketStatus, socialsLogin, getConfig } from '/@/api/basic/user';
  import { createLocalStorage } from '/@/utils/cache';
  import { useRouter } from 'vue-router';
  import { PageEnum } from '/@/enums/pageEnum';
  import { BasicModal, useModal } from '/@/components/Modal';
  import { formatToDateTime } from '/@/utils/dateUtil';
  import { h } from 'vue';
  import { isString } from '/@/utils/is';
  import { AesEncryption } from '/@/utils/cipher';
  import QrCodeForm from './QrCodeForm.vue';
  import { UserOutlined, LockOutlined } from '@ant-design/icons-vue';
  import { updateLanguage } from '/@/api/permission/userSetting';
  import { useLocale } from '/@/locales/useLocale';
  import type { DropMenu } from '/@/components/Dropdown';

  interface State {
    formData: any;
    isSso: boolean;
    ssoLoading: boolean;
    preUrl: string;
    ssoUrl: string;
    ssoTicket: string;
    ticketParams: string;
    socialsList: any[];
    socialsWinUrl: any;
    redirectUrl: string;
    ssoTimer: any;
    tenantSocialList: any[];
    showIframe: boolean;
    needCode: boolean;
    codeLength: number;
    timestamp: number;
    codeImgUrl: string;
    activeTab: number;
  }

  const FormItem = Form.Item;
  const InputPassword = Input.Password;
  const { t } = useI18n();
  const { notification, createMessage } = useMessage();
  const userStore = useUserStore();
  const ls = createLocalStorage({ hasEncrypt: true });
  const router = useRouter();
  const globSetting = useGlobSetting();
  const apiUrl = ref(globSetting.apiUrl);
  const [registerSsoModal, { openModal: openSsoModal, closeModal: closeSsoModal }] = useModal();
  const [registerTenantSocialModal, { openModal: openTenantSocialModal }] = useModal();
  const [registerSocialsModal, { openModal: openSocialsModal, closeModal, getOpen: getSocialsModalOpen }] = useModal();
  const { getFormRules } = useFormRules();
  const { getLocale, setTimeZoneList } = useLocale();

  const formRef = ref();
  const loading = ref(false);
  const aesEncryption = new AesEncryption({ useHex: true });

  let socialsWinUrl: any = null;
  const state = reactive<State>({
    formData: {
      account: ls.get('login_account') || '',
      password: ls.get('login_password') || '',
      code: '',
      origin: 'password',
      rember: !!ls.get('login_account'),
    },
    isSso: false,
    ssoLoading: true,
    preUrl: '',
    ssoUrl: '',
    ssoTicket: '',
    ticketParams: '',
    socialsList: [],
    socialsWinUrl: null,
    redirectUrl: '',
    ssoTimer: null,
    tenantSocialList: [],
    showIframe: false,
    needCode: false,
    codeLength: 4,
    timestamp: 0,
    codeImgUrl: '',
    activeTab: 1,
  });
  const { formData, socialsList, isSso, ssoLoading, ssoUrl, redirectUrl, showIframe, tenantSocialList, codeImgUrl, activeTab } = toRefs(state);
  const { validForm } = useFormValid(formRef);

  onKeyStroke('Enter', handleLogin);

  async function handleLogin() {
    if (loading.value) return;
    const data = await validForm();
    if (!data) return;
    try {
      loading.value = true;
      const password = encryptByMd5(data.password);
      const encryptPassword = aesEncryption.encryptByAES(password);
      const userInfo = await userStore.login({
        account: data.account,
        password: encryptPassword,
        code: state.formData.code,
        origin: state.formData.origin,
        timestamp: state.timestamp,
        lydc_ticket: state.ssoTicket,
        goHome: true,
      });
      if (!userInfo) {
        if (state.needCode) {
          state.formData.code = '';
          handleChangeImg();
        }
        loading.value = false;
        return;
      }
      if (userInfo.prevLogin == 1) {
        notification.open({
          message: t('sys.login.lastLoginInfo'),
          description: () =>
            h('div', { class: 'pt-10px' }, [
              h('p', null, `时间： ${formatToDateTime(userInfo.prevLoginTime)}`),
              h('p', null, `地点： ${userInfo.prevLoginIPAddressName || ''}`),
              h('p', null, `IP： ${userInfo.prevLoginIPAddress || ''}`),
            ]),
          placement: 'bottomRight',
          style: { width: '300px' },
        });
      }
      if (state.formData.rember) {
        ls.set('login_account', data.account, null);
        ls.set('login_password', data.password, null);
      } else {
        ls.remove('login_account');
        ls.remove('login_password');
      }
      const lang = unref(getLocale);
      lang && updateLanguage({ language: lang });
    } catch (error) {
      if (isString(error)) createMessage.error(error);
    } finally {
      loading.value = false;
    }
  }
  function handleGetLoginConfig() {
    state.ssoLoading = true;
    getLoginConfig()
      .then(res => {
        state.isSso = !!res.data.redirect;
        state.preUrl = res.data.url;
        state.ticketParams = res.data.ticketParams;
        state.socialsList = res.data.socialsList || [];
        state.ssoLoading = false;
        ls.set('useSocials', state.socialsList.length, null);
        if (res.data.timezoneList?.length > 0) {
          console.log('初始化可选时区', res.data.timezoneList);
          const timezoneLDropist: DropMenu[] = timezoneList.map(item => ({
            event: item.enCode,
            text: item.fullName,
          }));
          setTimeZoneList(timezoneLDropist);
        }
      })
      .catch(() => {
        state.isSso = false;
        state.ssoLoading = false;
      });
  }
  function handleOtherLogin(enname) {
    getTicket().then(res => {
      state.ssoTicket = res.data;
      if (socialsWinUrl && !socialsWinUrl.closed) {
        socialsWinUrl.location.replace(state.redirectUrl);
        socialsWinUrl.focus();
        return;
      }
      state.socialsList.forEach(item => {
        if (enname == item.enname) {
          const renderUrl = item.renderUrl.replace('LYDC_TICKET', state.ssoTicket);
          state.redirectUrl = renderUrl;
        }
      });
      const iWidth = 750; //弹出窗口的宽度;
      const iHeight = 650; //弹出窗口的高度;
      const iLeft = (window.screen.width - iWidth) / 2;
      const iTop = (window.screen.height - iHeight) / 2; //获得窗口的垂直位置;
      const safari = isSafari();

      socialsWinUrl = window.open(
        state.redirectUrl,
        '_blank',
        `height=${iHeight},innerHeight=${iHeight},width=${iWidth},innerWidth=${iWidth},top=${iTop},left=${iLeft},toolbar=no,menubar=no,scrollbars=auto,resizeable=no,location=no,status=no`,
      );

      state.ssoTimer = setInterval(() => {
        if (socialsWinUrl && socialsWinUrl.closed) clearTimer();
        // if (!safari && socialsWinUrl.closed) clearTimer();
        handleGetTicketStatus();
      }, 1000);
    });
  }
  function clearTimer() {
    if (!state.ssoTimer) return;
    clearInterval(state.ssoTimer);
    state.ssoTimer = null;
    state.ssoTicket = '';
  }
  function handleGetTicketStatus() {
    if (!state.ssoTicket) return;
    getTicketStatus(state.ssoTicket).then(res => {
      console.log('🚀 ~  ~ res: ', res);
      if (res.data.status != 2) {
        socialsWinUrl && socialsWinUrl.close();
        if (res.data.status == 4) {
          //未绑定预留ticket
          clearInterval(state.ssoTimer);
          state.ssoTimer = null;
        } else {
          clearTimer();
        }
        switch (res.data.status) {
          case 1: //登陆成功
            closeSocialsModal();
            userStore.updateToken(res.data.value);
            nextTick(() => {
              router.push(PageEnum.BASE_HOME);
            });
            break;
          case 4: //未绑定
            createMessage.error('第三方账号未绑定，5分钟内登录本系统账号密码自动绑定该账号！');
            closeSsoModal();
            closeSocialsModal();
            state.ssoUrl = '';
            break;
          case 6: //多租户绑定多个
            state.tenantSocialList = typeof res.data.value === 'string' ? JSON.parse(res.data.value) : res.data.value;
            openTenantSocialModal(true);
            break;
          default:
            createMessage.error(res.data.value || '账号异常！');
            closeSsoModal();
            closeSocialsModal();
            state.ssoUrl = '';
            getLoginConfig();
            break;
        }
      }
    });
  }

  function closeSocialsModal() {
    closeModal();
    socialsWinUrl.close();
  }
  function handleSsoLogin() {
    if (loading.value) return;
    loading.value = true;
    getTicket().then(res => {
      state.ssoTicket = res.data;
      state.ssoUrl = state.preUrl + '?' + state.ticketParams + '=' + state.ssoTicket;
      openSsoModal(true);
      state.showIframe = true;
      state.ssoTimer = setInterval(() => {
        handleGetTicketStatus();
      }, 1000);
    });
  }
  async function onSsoModalClose() {
    loading.value = false;
    state.showIframe = false;
    clearTimer();
    return true;
  }
  function handleSocialLogin(data) {
    socialsLogin({ ...data, tenantLogin: true }).then(res => {
      userStore.updateToken(res.data.token);
      nextTick(() => {
        router.push(PageEnum.BASE_HOME);
      });
    });
  }
  function onAccountChange(e) {
    const value = e.target.value;
    if (!value) return;
    handleGetConfig(value);
  }
  function handleGetConfig(value) {
    getConfig(value).then(res => {
      state.needCode = !!res.data.enableVerificationCode;
      if (state.needCode) {
        state.codeLength = res.data.verificationCodeNumber || 4;
        handleChangeImg();
      }
    });
  }
  function handleChangeImg() {
    const timestamp = Math.random();
    state.timestamp = timestamp;
    state.codeImgUrl = `/api/oauth/ImageCode/${state.codeLength || 4}/${timestamp}`;
  }
  function handleForgetPassword() {
    createMessage.warning('功能开发中');
  }

  function isSafari() {
    const ua = navigator.userAgent;
    // 检测是否存在Safari标识，同时排除Chrome、Edge、iOS Chrome、Firefox iOS等
    return /Safari/i.test(ua) && /AppleWebKit/i.test(ua) && !/Chrome|CriOS|Edg|EdgiOS|FxiOS|Firefox/i.test(ua);
  }

  onMounted(() => {
    if (state.formData.account) handleGetConfig(state.formData.account);
    if (state.needCode) handleChangeImg();
    handleGetLoginConfig();
  });
  onUnmounted(() => {
    clearTimer();
  });
</script>
