<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    :showOkBtn="false"
    :showCancelBtn="true"
    title="CPK报告上传"
    :destroyOnClose="true"
    :ok-text="t('common.submit')"
    :confirmLoading="loading"
    class="h-full"
    @ok="handleSubmit">
    <template #insertToolbar>
      <a-button :loading="loading" v-if="true" @click="handleSubmit" type="primary">{{ t('common.submit') }} </a-button>
    </template>
    <Spin :spinning="loading" :tip="uploadProgress" class="h-full">
      <Grid style="height: calc(100% - 50px)">
        <template #toolbar-actions>
          <Subtitle :title="t('dict.CPK.CPKReportUpload')" />
        </template>
        <template #attachment="{ row }">
          <template v-if="row.fileList && row.fileList.length > 0">
            <span class="table-a" @dblclick="handleAttachmentModal(row)"> {{ t('common.searchDetail') }} </span>
          </template>
          <template v-else></template>
        </template>
        <template #action="{ row }">
          <a-upload v-feature :multiple="true" :before-upload="beforeInstallUpload.bind(null, row)" :showUploadList="false">
            <i class="icon-ym icon-ym-upload" style="color: rgb(26 144 255)" />
          </a-upload>
        </template>
      </Grid>
      <!--      <template #indicator>-->
      <!--        -->
      <!--      </template>-->
    </Spin>
    <AttachList @register="registerAttach" @refresh="handleReload" @changeFileList="handleFileList" />
  </BasicPopup>
</template>
<script setup lang="ts">
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { reactive, toRefs, nextTick, computed } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { isEmpty, isNullOrUnDef } from '/@/utils/is';
  import { cloneDeep, compact, defaultsDeep, isError, isArray } from 'lodash-es';
  import { uploadfiles } from '/@/api/basic/common';
  import { getUploadReportColumn } from '../config';
  import Subtitle from '/@/components/Subtitle/src/Subtitle.vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import AttachList from './AttachList.vue';
  import { useModal } from '/@/components/Modal';
  import { postCpk, postCpkDetail } from '/@/api/qualityAssurance/cpk';
  import { useUserStore } from '/@/store/modules/user';
  import { dateUtil } from '/@/utils/dateUtil';
  import { getRules } from '../getRules';
  import { getUserIdByPhone } from '/@/api/permission/user';
  import { Spin } from 'ant-design-vue';
  import { requestIdleCallbackAdapter } from '/@/utils/polyfills';

  const emit = defineEmits(['register', 'reload']);

  const { t } = useI18n();
  const { createMessage } = useMessage();

  const state = reactive({
    loading: false,
  });

  // 状态跟踪
  const uploadState = reactive({
    activeUploads: 0,
    allFiles: [] as any[],
  });

  const uploadProgress = computed(() => {
    return `${uploadState.activeUploads} / ${uploadState.allFiles.length}`;
  });

  const { allFiles, currentFakeProgress } = toRefs(uploadState);

  const { loading } = toRefs(state);

  const userStore = useUserStore();
  const getUserInfo = computed(() => userStore.getUserInfo || {});

  const [registerPopup, { closePopup, changeLoading }] = usePopupInner(init);
  const [registerAttach, { openModal: openAttachModal, closeModal: closeAttachModal }] = useModal();

  const [Grid, { loadData, reloadData, getDataSource, reloadColumn }] = useVbenVxeGrid({
    gridOptions: {
      id: 'qualityAssurance-cpk-cpkUploadReport-uploadReport',
      columns: getUploadReportColumn(),
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
      keyboardConfig: {
        isClip: true, // 是否开启复制粘贴
        isEdit: true, // 是否开启任意键进入编辑（功能键除外）
        isDel: true, // 是否开启删除键功能
        isEsc: true, // 是否开启Esc键关闭编辑功能
      },
      rowConfig: {
        keyField: 'id',
      },
      clipConfig: {
        isPaste: true,
        beforePasteMethod: handleBeforePaster,
      },
      // i18nConfig: {
      // 	moduleCode: 'PCCColumn',
      // },
    },
  });

  function handleReload(list) {
    console.log(list);
  }

  async function init(data) {
    postCpkDetail(data.map(item => item.id)).then(async ({ code, data: ret }) => {
      console.log(ret);
      if (isEmpty(ret)) {
        // const columns = grid.grid.getTableColumn()
        // console.log(columns, 'columnscolumnscolumnscolumns')
        reloadColumn(getUploadReportColumn().filter(item => item.field !== 'applyCode'));
        await nextTick();
        reloadData(data);
      } else {
        await nextTick();
        reloadData(ret);
      }
    });
  }

  function handleFileList(row) {
    const list = getDataSource();
    const index = list.findIndex(item => item.id === row.id);
    if (index != -1) {
      list[index] = row;
    }
    console.log('🚀 ~ handleFileList ~ list: ', list);
    closeAttachModal();
    reloadData(list);
  }

  const normalizeToArray = value => {
    if (Array.isArray(value)) {
      return value;
    }
    if (value) {
      return [value];
    }
    return [];
  };
  function handleSubmit() {
    const list = getDataSource();
    console.log('🚀 ~ handleSubmit ~ list: ', list);
    const validate = validateParams(list);
    if (!validate) return;
    const params = cloneDeep(list).map(item => {
      const target = {
        ...item,
        reviewList: [
          {
            node: 'Technician',
            handlerList: isArray(item.technician) ? item.technician : [item.technician],
          },
          {
            node: 'QE',
            handlerList: normalizeToArray(item.qe),
          },
          {
            node: 'PD',
            handlerList: normalizeToArray(item.pd),
          },
          {
            node: 'EPMQPM1',
            handlerList: normalizeToArray(item.epmQpm),
          },
          {
            node: 'EPMQPM2',
            handlerList: normalizeToArray(item.epmQpm),
          },
          {
            node: 'EPMQPM3',
            handlerList: normalizeToArray(item.epmQpm),
          },
        ],
      };
      delete target.technician;
      delete target.qe;
      delete target.pd;
      delete target.epmQpm;
      return target;
    });
    changeLoading(true);
    // state.loading = true;
    postCpk({
      saveAndCommit: true,
      list: params,
    })
      .then(({ code, msg }) => {
        if (code === 200) {
          createMessage.success(msg);
          emit('reload');
          closePopup();
        }
      })
      .finally(() => {
        changeLoading(false);
        // state.loading = false
      });
  }

  function validateParams(list) {
    try {
      list.forEach((item, index) => {
        console.log(item.fileList, 'item.fileListitem.fileListitem.fileList');
        if (isNullOrUnDef(item.fileList) || isEmpty(item.fileList)) {
          throw new Error(`请上传第${index + 1}条的附件`);
        } else if (isNullOrUnDef(item.technician) || isEmpty(item.technician)) {
          throw new Error(`请选择第${index + 1}条的技术人员`);
        }
        // else if (isNullOrUnDef(item.qe) || isEmpty(item.qe)) {
        //   throw new Error(`请选择${index + 1}条的PD`);
        // } else if (isNullOrUnDef(item.pd) || isEmpty(item.pd)) {
        //   throw new Error(`请选择${index + 1}条的QE`);
        // } else if (isNullOrUnDef(item.epmQpm) || isEmpty(item.epmQpm)) {
        //   throw new Error(`请选择${index + 1}条的EPM/QPM`);
        // }
      });
      return true;
    } catch (e) {
      createMessage.warning(e?.message);
      return false;
    }
  }

  function handleBeforePaster({ targetAreas, pasteCells, $grid }) {
    try {
      const editRules = getRules();
      const { cols, rows } = targetAreas[0];

      // 收集用户ID
      const userFnList = [];
      // 校验数据
      pasteCells.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
          const col = cols[colIndex];
          const originRow = rows[rowIndex];

          const { field } = col;
          const rule = editRules[field];
          const { validator } = rule[0];

          if (field === 'technician' || field === 'qe' || field === 'pd' || field === 'epmQpm') {
            userFnList.push({
              cell,
              fn: validator.bind(null, { col, cell, row: originRow, $grid }),
            });
            return null;
          }
          const result = validator({ col, cell, row: originRow, $grid });
          if (isNullOrUnDef(result)) return false;
          if (isError(result)) {
            createMessage.warning(result?.message);
          }
          // 校验数据通过
        });
      });
      // 重新执行粘贴的料号逻辑
      if (!isEmpty(userFnList)) {
        const keys = userFnList.map(item => {
          return item.cell.match(/(\d+)(?!.*\d)/)[0];
        });

        getUserIdByPhone({ accounts: compact(keys) }).then(({ data }) => {
          console.log('🚀 ~  ~ data: ', data);
          // 执行校验函数
          userFnList.forEach(value => {
            const target = data.find(item => `${item.RealName}/${item.Account}` === value.cell);
            // 执行缓存函数
            value.fn(target);
          });
        });
        return false;
      }
    } catch (e) {
      console.log(e);
    }
    // return false;
  }

  function beforeInstallUpload(row, file: File, fileList: File[]) {
    // beforeUpload每个文件上传都会跑一次，只判定在最后一个文件执行上传
    if (file.name !== fileList[fileList.length - 1].name) return;
    const errorList = [];
    uploadState.activeUploads = 0;
    uploadState.allFiles = fileList;
    state.loading = true;
    fileList.forEach(item => {
      requestIdleCallbackAdapter(() => {
        const formData = new FormData();
        formData.append('fileList', item);
        uploadfiles(formData)
          .then(({ code, msg, data }) => {
            if (code == 200) {
              defaultsDeep(row, { fileList: [] });
              row.fileList.push({
                fileName: data[0].originFileName,
                filePath: data[0].fullPath,
                creatorUserName: getUserInfo.value.userName,
                creatorTime: dateUtil().valueOf(),
              });
              uploadState.activeUploads = uploadState.activeUploads + 1;
              nextTick(() => {
                if (uploadState.activeUploads === uploadState.allFiles.length) {
                  state.loading = false;
                }
              });
            }
          })
          .finally(() => {
            errorList.push(item);
          });
      });
    });
    // const formData = new FormData();
    // formData.append('fileList', file);
    // uploadfiles(formData)
    //   .then(({ code, msg, data }) => {
    //     if (code == 200) {
    //       defaultsDeep(row, { fileList: [] });
    //       row.fileList.push({
    //         fileName: data[0].originFileName,
    //         filePath: data[0].fullPath,
    //         creatorUserName: getUserInfo.value.userName,
    //         creatorTime: dateUtil().valueOf(),
    //       });
    //       createMessage.success(msg);
    //     }
    //   })
    //   .catch(() => {
    //     // changeLoading(false);
    //   });
    return false;
  }

  function handleAttachmentModal(row) {
    console.log('🚀 ~ handleAttachmentModal ~ row: ', row);
    openAttachModal(true, [row]);
  }
</script>

<style lang="less" scoped>
  :deep(.scrollbar__view) {
    height: 100%;

    & > div {
      height: 100%;
    }
  }

  :deep(.scroll-container) {
    height: 100%;
  }

  :deep(.ant-spin-nested-loading) {
    height: 100%;
  }

  :deep(.ant-spin-container) {
    height: 100%;
  }
</style>
