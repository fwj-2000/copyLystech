<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    :showOkBtn="true"
    :showCancelBtn="true"
    title="CPK审核"
    :destroyOnClose="true"
    :ok-text="t('common.submit')"
    :confirmLoading="loading"
    class="h-full"
    @ok="handleSubmit">
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
        <a-upload v-feature :multiple="false" :before-upload="beforeInstallUpload.bind(null, row)" :showUploadList="false">
          <i class="icon-ym icon-ym-upload" style="color: rgb(26 144 255)" />
        </a-upload>
      </template>
    </Grid>
    <AttachList @register="registerAttach" @reload="emit('reload')" @close="emit('reload')" />
  </BasicPopup>
</template>
<script setup lang="ts">
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { reactive, toRefs } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { getRules } from '/@/views/engineering/PCCBeta/components/PccMaterial/config';
  import { isEmpty, isNullOrUnDef } from '/@/utils/is';
  import { defaultsDeep, isError } from 'lodash-es';
  import { getMaterialQueryByMaterialCode, uploadInstallFile } from '/@/api/engineering/pcc';
  import { getReviewColumn } from '../config';
  import { TableAction } from '/@/components/Table';
  import Subtitle from '/@/components/Subtitle/src/Subtitle.vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useModal } from '/@/components/Modal';
  import AttachList from '../../cpkUploadReport/components/AttachList.vue';
  import { postCpkCommitWithOpinion } from '/@/api/qualityAssurance/cpk';

  const { t } = useI18n();
  const { createMessage } = useMessage();

  const emit = defineEmits(['register', 'reload']);
  const state = reactive({
    loading: false,
  });

  const { loading } = toRefs(state);

  const [registerPopup, { closePopup }] = usePopupInner(init);
  const [registerAttach, { openModal: openAttachModal }] = useModal();

  const [Grid, { loadData, reloadData, getDataSource, grid }] = useVbenVxeGrid({
    gridOptions: {
      id: 'qualityAssurance-cpk-cpkUploadReport-uploadReport',
      columns: getReviewColumn(),
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
        keyField: 'uuid',
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

  function init(data) {
    // const list = data.map(item => ({
    //   ...item,
    //   uuid: item.id,
    // }));
    reloadData(data);
  }

  function handleSubmit() {
    // console.log('handleSubmit', 'handleSubmit');
    const list = getDataSource();
    const params = {
      saveAndCommit: true,
      list,
    };
    postCpkCommitWithOpinion(params).then(({ code, msg }) => {
      if (code == 200) {
        createMessage.success(msg);
        emit('reload');
        closePopup();
      }
    });
  }

  function handleBeforePaster({ targetAreas, pasteCells, $grid }) {
    try {
      const editRules = getRules(props.api, getProcessList());
      const { cols, rows } = targetAreas[0];

      const materialFnList = {};
      // 校验数据
      pasteCells.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
          const col = cols[colIndex];
          const originRow = rows[rowIndex];

          const { field } = col;
          const rule = editRules[field];
          const { validator } = rule[0];
          // 对查询结果进行特殊处理，如果当前是材料列，先存储料号。其他列进行校验
          if (field === 'originPartNumber') {
            // setLoading(true);
            materialFnList[cell] = validator.bind(null, { col, cell, row: originRow, $grid });
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
      if (!isEmpty(materialFnList)) {
        getMaterialQueryByMaterialCode(Object.keys(materialFnList)).then(({ data }) => {
          data.forEach(item => {
            // 执行校验函数
            const result = materialFnList[item['materialCode']]?.(item);
            console.log(result);
          });
        });
      }
    } catch (e) {
      console.log(e);
    }
    return false;
  }

  function beforeInstallUpload(row, file) {
    const params = {
      file: file,
      filePath: 'CPK',
    };
    uploadInstallFile(params)
      .then(({ code, msg, data }) => {
        if (code == 200) {
          defaultsDeep(row, { fileList: [] });
          row.fileList.push(data);
          createMessage.success(msg);
        }
      })
      .catch(() => {
        // changeLoading(false);
      });
    return false;
  }

  function handleAttachmentModal(row) {
    openAttachModal(true, [row]);
  }
</script>

<style lang="scss" scoped>
  :deep(.scrollbar__view) {
    height: 100%;

    & > div {
      height: 100%;
    }
  }
  :deep(.scroll-container) {
    height: 100%;
  }
</style>
