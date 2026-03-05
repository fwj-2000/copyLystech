<template>
  <BasicModal :width="1200" v-bind="$attrs" title="推送历史" :draggable="true" :showOkBtn="false" @ok="handleSubmit" @register="registerModal">
    <Grid></Grid>
    <Preview ref="filePreviewRef" />
  </BasicModal>
</template>

<script setup lang="ts">
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { useVbenVxeGrid } from '/@/effects/plugins/vxe-table';
  import Preview from '/@/components/Upload/src/components/Preview.vue';
  import { ref, reactive, toRefs, computed } from 'vue';
  import { useUserStore } from '/@/store/modules/user';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { getPushSapPage, postCpkCommitWithFile } from '/@/api/qualityAssurance/cpk';
  import { message } from 'ant-design-vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import Template from '/@/views/engineering/pcc/pccApply/components/print/template.vue';
  import { getPushRecords } from '/@/views/qualityAssurance/cpk/cpkProcess/config';

  const { t } = useI18n();

  const emit = defineEmits(['register', 'reload']);
  const { createMessage } = useMessage();

  const state = reactive({
    mode: '',
    cacheList: [],
    index: 0,
    loading: false,
    nextHandlerId: [],
  });

  const userStore = useUserStore();
  const getUserInfo = computed(() => userStore.getUserInfo || {});

  const { mode, cacheList, index, loading } = toRefs(state);
  const filePreviewRef = ref();

  const currentValue = computed(() => {
    return state.cacheList[state.index];
  });

  const [registerModal, { closeModal, changeOkLoading, changeLoading }] = useModalInner(init);

  const [Grid, { loadData, reloadData, getDataSource }] = useVbenVxeGrid({
    gridOptions: {
      id: 'qualityAssurance-cpk-cpkProcess-pushRecords',
      columns: getPushRecords(),
      minHeight: 500,
      showIndexColumn: true,
      editConfig: {
        trigger: 'dblclick',
        mode: 'row',
      },
      toolbarConfig: {
        enabled: true,
      },
      scrollY: {
        enabled: false,
      },
      pagerConfig: {
        enabled: false,
      },
      rowConfig: {
        keyField: 'uuid',
      },
      clipConfig: {
        isPaste: true,
      },
      // i18nConfig: {
      // 	moduleCode: 'PCCColumn',
      // },
    },
  });

  function init(data) {
    changeLoading(true);
    getPushSapPage(data).then(({ code, data }) => {
      const list = data.list;
      if (code == 200) {
        reloadData(list);
        changeLoading(false);
      }
    });
    reloadData(state.cacheList[state.index]?.fileList);
  }

  function handleSubmit() {
    const params = {
      saveAndCommit: true,
      list: [
        {
          ...state.cacheList[state.index],
          handlerList: state.nextHandlerId,
        },
      ],
    };
    console.log('🚀 ~ handleSubmit ~ params: ', params);
    changeOkLoading(true);
    postCpkCommitWithFile(params)
      .then(({ code, msg }) => {
        console.log('🚀 ~  ~ { code, msg }: ', { code, msg });
        if (code !== 200) return createMessage.error(msg);
        createMessage.success(msg);
        if (state.index + 1 === state.cacheList.length) {
          // 最后一条 关闭弹窗，刷新列表，其他的跳转到下一条审核
          closeModal();
          emit('reload');
        } else {
          changeCurrent('next');
        }
        // closeModal();
        // emit('reload');
      })
      .finally(() => {
        changeOkLoading(false);
      });
  }

  function changeCurrent(type: 'pre' | 'next') {
    const { cacheList, index } = state;
    // 上一个
    if (type === 'pre') {
      if (index === 0) {
        return message.warning('当前已经是第一个');
      }
      state.index = index - 1;
      if (cacheList[index].currentNode == 'Technician') {
        const target = cacheList[index].reviewList.find(item => item.node === 'QE');
        state.nextHandlerId = target?.handlerList || [];
      } else if (cacheList[index].currentNode == 'QE') {
        const target = cacheList[index].reviewList.find(item => item.node === 'PD');
        state.nextHandlerId = target?.handlerList || [];
      } else if (cacheList[index].currentNode == 'PD') {
        const target = cacheList[index].reviewList.find(item => item.node.includes('EPMQPM'));
        state.nextHandlerId = target?.handlerList || [];
      }
      console.log(state.nextHandlerId, 'state.nextHandlerId');
      const fileList = cacheList[index].fileList.map(item => ({
        ...item,
        insidePN: cacheList[index].insidePN,
        wo: cacheList[index].wo,
      }));
      state.cacheList[state.index] = {
        ...state.cacheList[state.index],
        fileList,
      };
      reloadData(state.cacheList[state.index]?.fileList);
    }
    // 下一个
    if (type === 'next') {
      if (index === state.cacheList.length - 1) {
        return message.warning('当前已经是最后一个');
      }
      state.index = index + 1;
      if (cacheList[index].currentNode == 'Technician') {
        const target = cacheList[index].reviewList.find(item => item.node === 'QE');
        state.nextHandlerId = target?.handlerList || [];
      } else if (cacheList[index].currentNode == 'QE') {
        const target = cacheList[index].reviewList.find(item => item.node === 'PD');
        state.nextHandlerId = target?.handlerList || [];
      } else if (cacheList[index].currentNode == 'PD') {
        const target = cacheList[index].reviewList.find(item => item.node.includes('EPMQPM'));
        state.nextHandlerId = target?.handlerList || [];
      }
      const fileList = cacheList[index].fileList.map(item => ({
        ...item,
        insidePN: cacheList[index].insidePN,
        wo: cacheList[index].wo,
      }));
      state.cacheList[state.index] = {
        ...state.cacheList[state.index],
        fileList,
      };
      reloadData(state.cacheList[state.index]?.fileList);
    }
  }
</script>

<style lang="less" scoped>
  .toggle-current {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-left: 10px;
  }

  .state-box {
    margin: 0 10px;
  }

  :deep(.scrollbar) {
    padding: 0 5px !important;
  }
</style>
