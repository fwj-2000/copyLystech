import { ref, nextTick, onMounted } from 'vue';
import { useMessage } from '/@/hooks/web/useMessage';
import { useI18n } from '/@/hooks/web/useI18n';
import { useBaseStore } from '/@/store/modules/base';

export default function useState() {
  const mainProcess = ref(1);
  const mainProcessList = ref<any[]>([]);
  const list = ref<any[]>([]);
  const { createConfirm, createMessage } = useMessage();
  const { t } = useI18n();

  function setMainProcess(value: number | string) {
    mainProcess.value = value;
  }

  function handleMainProcessChange(
    e,
    config: {
      onOk?: () => void;
      beforeMsg?: () => boolean;
    },
  ) {
    // 在变更前查询是否有填写工厂数据，若是有则弹出提示，更改主要制程会清空工厂数据，是否继续
    // const hasFactory = list.value.some(item => item.factory);
    let hasFactory = false;
    if (config.beforeMsg) {
      hasFactory = config.beforeMsg();
    }
    if (hasFactory) {
      createConfirm({
        title: t('common.confirm'),
        content: '更改主要制程会清空工厂数据，是否继续?',
        iconType: 'info',
        onOk: () => {
          setMainProcess(e);
          config?.onOk?.();
        },
        onCancel: () => {
          // 还原主要制程
          const _old = mainProcess.value;
          setMainProcess(e);
          nextTick(() => {
            setMainProcess(_old);
          });
        },
      });
    } else {
      setMainProcess(e);
    }
  }

  function setTableList(data: any[]) {
    list.value = data;
  }

  function validateMainProcess() {
    if (mainProcess.value) {
      return {
        mainProcess: mainProcess.value,
      };
    }
    createMessage.info('请选择主要制程');
    return false;
  }

  onMounted(() => {
    nextTick(async () => {
      const _list: any = await useBaseStore().getDictionaryData('MainProcess', true);
      mainProcessList.value = (_list || []).map(item => {
        return {
          ...item,
          label: item.fullName,
          value: item.enCode,
          id: item.enCode,
        };
      });
      console.log(mainProcessList.value);
    });
  });

  return {
    mainProcess,
    mainProcessList,
    setMainProcess,
    setTableList,
    handleMainProcessChange,
    validateMainProcess,
  };
}
