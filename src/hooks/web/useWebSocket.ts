import { ref, h, nextTick, VNode, render, watch } from 'vue';
import { useMessage } from '/@/hooks/web/useMessage';
import { useUserStore } from '/@/store/modules/user';
import { useGlobSetting } from '/@/hooks/setting';
import { getToken } from '/@/utils/auth';
import { isDevMode } from '/@/utils/env';
import ReconnectingWebSocket from 'reconnecting-websocket';
import { getLydcAppId } from '/@/utils/lydc';
import { Spin, Modal } from 'ant-design-vue';
import { useI18n } from '/@/hooks/web/useI18n';
import dayjs from 'dayjs';
import UpgradeCont from '../../views/basicData/updateLog/components/upgradeCont.vue';
import '../../views/basicData/updateLog/components/style.less';
import { getLatestOneUpdateLog } from '/@/api/business/updateLogs';
import { BasicModal } from '/@/components/Modal';

const { t } = useI18n();
const { createMessage, createWarningModal } = useMessage();

const userStore = useUserStore();
const userInfo = userStore.getUserInfo;
const globSetting = useGlobSetting();

console.log(import.meta.env, isDevMode(), 'isDevMode()');

let url: string;
if (isDevMode()) {
  url = `${globSetting.webSocketUrl}/api/message/websocket/`;
} else if (globSetting.webSocketUrl) {
  url = `${globSetting.webSocketUrl}/websocket/`;
} else {
  url = `${window.location.origin}/websocket/`;
}

const webSocketUrl = url.replace('https://', 'wss://').replace('http://', 'ws://');

let ws: any;
const listeners = new Map<Function, any>();

/**
 * 统一的关闭实现：避免多处重复实现同一段 ws 关闭逻辑（不改变任何关闭时机与行为）
 */
function closeWsInternal() {
  if (ws) {
    ws.close();
    ws = null;
  }
}

function notifyListeners(data: any) {
  for (const callback of listeners.keys()) {
    try {
      callback(data);
    } catch (err) {
      console.error(err);
    }
  }
}

function handleRefresh(data: any) {
  if (data.msg) {
    createMessage.error(data.msg);
    setTimeout(() => {
      location.reload();
    }, 2000);
  } else {
    location.reload();
  }
}

/** 系统消息触发的关闭行为（来自服务端 closeSocket） */
function handleCloseSocket() {
  closeWsInternal();
}

/** 退出登录（不改变原有处理顺序与分支） */
function handleLogout(data: any, token: string) {
  // token 不同直接 reload 并 return
  if (data.token && data.token !== token) return location.reload();

  closeWsInternal();

  createMessage.error(data.msg || '登录过期,请重新登录').then(() => {
    userStore.resetToken();
  });
}

/** 版本升级通知*/
function handleVersionUpgrade() {
  const versionTip = t('sys.versionUpgrade') == 'sys.versionUpgrade' ? '版本更新提示' : t('sys.versionUpgrade');
  const versionTipCont =
    t('sys.versionUpCont') == 'sys.versionUpCont'
      ? '模切平台将于五分钟后再次发布一个紧急修复版本，预计耗时10-15分钟。如果您正在作业，请注意暂存下数据。谢谢！'
      : t('sys.versionUpCont');

  const timeStr = dayjs().tz().format('YYYY-MM-DD HH:mm');

  const modalIns: any = createWarningModal({
    iconType: 'warning',
    closable: true,
    title: h('span', null, [versionTip, h('span', { style: { marginLeft: '16px', color: '#999', fontSize: '13px', fontWeight: 'normal' } }, timeStr)]),
    footer: null,
    content: h('div', null, [
      h('p', null, versionTipCont),
      h(
        'p',
        {
          style: {
            marginTop: '16px',
            fontSize: '14px',
            color: '#ff7d00',
            textDecoration: 'underline',
            textUnderlineOffset: '4px',
            fontWeight: '600',
            cursor: 'pointer',
          },
          onClick: () => {
            modalIns?.destroy?.();
            modalIns?.close?.();
            Modal.destroyAll();
            openTipModal();
          },
        },
        '版本内容',
      ),
    ]),
  });
}

function handleSystemMessage(data: any, token: string) {
  switch (data.method) {
    case 'refresh':
      handleRefresh(data);
      break;

    case 'closeSocket':
      handleCloseSocket();
      break;

    case 'logout':
      return handleLogout(data, token);

    case 'versionUpgrade': {
      handleVersionUpgrade();
      break;
    }

    default:
  }
}

function parseMessageData(res: any) {
  if (!res?.data) return null;
  try {
    const dataStr = res.data;
    return JSON.parse(dataStr);
  } catch (err) {
    console.error('[WebSocket] data解析失败:', err);
    return null;
  }
}

function createOnOpen(sendWsMsg: (msg: string) => void) {
  return function onOpen() {
    const onConnection = { method: 'OnConnection', mobileDevice: false, systemId: userInfo.systemId, isSeparate: !!getLydcAppId() };
    sendWsMsg(JSON.stringify(onConnection));
  };
}

function createOnError() {
  return function onError(_e?: any) {
    // console.log('[WebSocket] 连接发生错误: ', _e);
  };
}

function createOnMessage(token: string) {
  return function onMessage(res: any) {
    const data = parseMessageData(res);
    if (!data) return;
    notifyListeners(data);
    handleSystemMessage(data, token);
  };
}

/**
 * 对外 API：不依赖 useWebSocket 内部局部变量，放到外层避免重复创建（逻辑不变）
 */
function onWebSocket(callback: (data: object) => any) {
  if (!listeners.has(callback)) {
    if (typeof callback === 'function') {
      listeners.set(callback, null);
    } else {
      console.debug('[WebSocket] 添加 WebSocket 消息监听失败：传入的参数不是一个方法');
    }
  }
}

function offWebSocket(callback: (data: object) => any) {
  listeners.delete(callback);
}

function getWebSocket() {
  return ws;
}

/**
 * 关闭 WebSocket：对外暴露的方法，内部复用统一关闭实现（逻辑不变）
 */
function closeWebSocket() {
  closeWsInternal();
}

export function useWebSocket() {
  const token = getToken();
  const server = ref(webSocketUrl + encodeURIComponent(token as string));

  function sendWsMsg(msg: string) {
    try {
      const msgObj = JSON.parse(msg);
      msgObj.token = token;
      const content = JSON.stringify(msgObj);
      ws.send(content);
    } catch (_) {}
    return;
  }

  /** 初始化 WebSocket（不改变原有关闭旧连接 -> 新建连接 -> 绑定事件 的顺序） */
  function initWebSocket() {
    closeWsInternal();
    ws = new ReconnectingWebSocket(server.value);

    ws.onopen = createOnOpen(sendWsMsg);
    ws.onerror = createOnError();
    ws.onmessage = createOnMessage(token);
  }

  return {
    initWebSocket,
    sendWsMsg,
    onWebSocket,
    offWebSocket,
    getWebSocket,
    closeWebSocket,
  };
}

export function openTipModal() {
  const latestLog = ref<any>(null);
  const loading = ref(true);
  const visible = ref(true); // 控制BasicModal显示/隐藏
  let modalMethods: any = null; // 用于存储BasicModal的方法

  // 注册模态框方法
  const handleRegister = (methods: any) => {
    modalMethods = methods;
  };

  const container = document.createElement('div');
  document.body.appendChild(container);

  const destroy = () => {
    render(null, container);
    container.remove();
  };

  const closeModal = () => {
    visible.value = false;
  };

  // 创建弹窗标题
  const createTitle = (): VNode => {
    return h(
      'div',
      {
        style: {
          display: 'flex',
          alignItems: 'center',
          fontSize: '18px',
          fontWeight: 'bold',
          padding: '0px',
          cursor: 'move',
        },
      },
      [
        h('div', {
          style: {
            width: '4px',
            height: '20px',
            backgroundColor: '#ff7b00',
            marginRight: '8px',
            marginLeft: '20px',
            borderRadius: '2px',
          },
        }),
        h('span', null, '更新日志'),
      ],
    );
  };

  const createContent = (): VNode => {
    return h(
      'div',
      {
        style: {
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          backgroundColor: '#fff',
        },
      },
      [
        h(Spin, {
          spinning: loading.value,
          style: { margin: 'auto', alignSelf: 'center', justifyContent: 'center', flex: 1 },
        }),
        h(
          'div',
          {
            style: {
              height: '500px',
              overflowY: 'hidden',
              display: loading.value || !latestLog.value ? 'none' : 'block',
            },
          },
          [
            h(UpgradeCont, {
              showTitle: false,
              showSelect: false,
              logId: latestLog.value?.Id,
            }),
          ],
        ),
      ],
    );
  };

  // 获取最新日志数据
  const fetchLatestLog = async () => {
    try {
      loading.value = true;
      const res = await getLatestOneUpdateLog({});

      if (res.code === 200 && res.data) {
        latestLog.value = res.data;
        // 数据加载成功后更新弹窗内容
        nextTick(() => {
          if (modalMethods) {
            modalMethods.redoModalHeight(); // 重新计算模态框高度
          }
        });
      } else {
        closeModal();
      }
    } catch (error) {
      createMessage.error('网络错误，无法加载更新日志');
      closeModal();
    } finally {
      loading.value = false;
    }
  };

  // 使用h函数创建BasicModal组件
  const modalVNode = h(
    BasicModal,
    {
      open: visible.value,
      width: '600px',
      maskClosable: true,
      showOkButton: false,
      showCancelButton: false,
      class: 'custom-modal',
      bodyStyle: {
        padding: 0,
        margin: 0,
        height: '535px',
      },
      canFullscreen: false,
      footer: null,
      onCancel: closeModal,
      onRegister: handleRegister,
      'onUpdate:open': (value: boolean) => {
        visible.value = value;
      },
    },
    {
      title: () => createTitle(),
      default: () => createContent(),
    },
  );

  render(modalVNode, container);

  watch(
    visible,
    val => {
      if (!val) setTimeout(destroy, 300);
    },
    { immediate: false },
  );

  fetchLatestLog();
}
